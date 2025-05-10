import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { addToBlocklist, incrementSuspiciousAttempts } from './ipBlocklist';
import { createRedisStore } from './rateLimiter';
import { getIpAddress } from './ipBlocker';
import redisClient, { REDIS_KEYS } from '@/utils/lib/redis';
import { logger } from '@/utils/lib/logger';

// Track request counts per IP
async function trackRequest(ip: string): Promise<{ count: number; timestamp: number }> {
  const key = `${REDIS_KEYS.REQUEST_TRACKER}:${ip}`;
  const now = Date.now();
  
  try {
    const data = await redisClient.get(key);
    const tracker = data ? JSON.parse(data) : { count: 0, timestamp: now };
    
    if (now - tracker.timestamp > 1000) {
      tracker.count = 1;
      tracker.timestamp = now;
    } else {
      tracker.count++;
    }
    
    await redisClient.setex(key, 60, JSON.stringify(tracker)); // expire after 60 seconds
    return tracker;
  } catch (error) {
    logger.error(`Error tracking requests for IP ${ip}:`, error);
    return { count: 1, timestamp: now };
  }
}

const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // Maximum requests per minute
const BURST_THRESHOLD = 30; // Maximum requests per second

export const ddosProtection = rateLimit({
  store: createRedisStore(),
  windowMs: WINDOW_SIZE,
  max: MAX_REQUESTS,
  handler: async (req: Request, res: Response) => {
    const ip = getIpAddress(req);
    
    try {
      await addToBlocklist(ip, 'DDoS attempt detected', true);
      await incrementSuspiciousAttempts(ip);
      
      logger.info(`Potential DDoS attack detected from IP: ${ip}`, { req });
      
      res.status(429).json({
        error: 'Too many requests, IP has been blocked.',
      });
    } catch (error) {
      logger.error('Error in DDoS protection handler:', { error , req });
      res.status(500).send('Internal Server Error');
    }
  },
  skip: (req: Request) => {
    // Skip rate limiting for health check endpoints
    return req.path === '/api/status' || req.path === '/health-check';
  },
});

export function burstDetection(req: Request, res: Response, next: NextFunction) {
  const ip = getIpAddress(req);
  
  trackRequest(ip).then(tracker => {
    if (tracker.count > BURST_THRESHOLD) {
      addToBlocklist(ip, 'Burst request threshold exceeded', true)
        .catch((error: any) => logger.error('Error blocking IP:', error));
      
      return res.status(429).json({
        error: 'Request burst detected. IP has been blocked.',
      });
    }
    next();
  }).catch(error => {
    logger.error('Error in burst detection:', error);
    next();
  });
}