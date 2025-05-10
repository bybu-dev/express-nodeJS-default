import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { getIpAddress } from './ipBlocker';
import { REDIS_KEYS } from '@/utils/lib/redis';
import { config } from './constant';

export function createRedisStore() {
  return new RedisStore({
    prefix: REDIS_KEYS.RATE_LIMIT_PREFIX,
    // @ts-expect-error - Redis client type mismatch
    sendCommand: (...args: any[]) => redisClient.call(...args),
  });
}

export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.api.windowMs,
  max: config.rateLimit.api.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
  skipFailedRequests: true,
  keyGenerator: getIpAddress,
  store: createRedisStore(),
  validate: {
    xForwardedForHeader: false,
    singleCount: config.environment !== 'development',
  }
});

export const loginLimiter = rateLimit({
  windowMs: config.rateLimit.login.windowMs,
  max: config.rateLimit.login.max,
  message: 'Too many login attempts from this IP, please try again after an hour',
  skipFailedRequests: true,
  keyGenerator: getIpAddress,
  store: createRedisStore(),
  validate: {
    xForwardedForHeader: false,
    singleCount: config.environment !== 'development',
  }
});