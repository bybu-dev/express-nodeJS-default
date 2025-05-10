import { Request, Response, NextFunction } from 'express';
import { isBlocked } from './ipBlocklist';
import { logger } from '@/utils/lib/logger';

export async function ipBlocker(req: Request, res: Response, next: NextFunction) {
  if(process.env.NODE_ENV === 'development') {
    return next();
  }
  const ip = getIpAddress(req)
  if(!ip || ip === "Unknown") {
    return res.status(403).json({ message: 'Invalid access' });
  }

  if (ip && await isBlocked(ip)) {
    logger.error(`Blocked request from blacklisted IP: ${ip}`);
    return res.status(403).json({ message: 'Access denied' });
  }

  next();
}

export function getIpAddress(req: Request) {
  const forwarderIp = Array.isArray(req.headers['x-forwarded-for'])
    ? req.headers['x-forwarded-for'][0]
    : (req.headers['x-forwarded-for'] as string)?.split(',').shift()?.trim();

  const realIp = req.headers['x-real-ip'] as string;
  const clientIp = req.ip;
  const ip = forwarderIp || realIp || clientIp || "Unknown";

  return ip;
}