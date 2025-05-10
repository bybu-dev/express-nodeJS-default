import { logger } from "@/utils/lib/logger";
import redisClient, { REDIS_KEYS } from "@/utils/lib/redis";


interface BlocklistEntry {
  ip: string;
  reason: string;
  timestamp: number;
  isPermanent: boolean;
  url?: string;
}

interface RedisError extends Error {
  message: string;
}

const TEMP_BLOCK_DURATION = 24 * 60 * 60; // 24 hours in seconds
const MAX_SUSPICIOUS_ATTEMPTS = 3;

async function ensureHashStructure(key: string): Promise<void> {
  try {
    const type = await redisClient.type(key);
    if (type !== 'hash' && type !== 'none') {
      await redisClient.del(key);
      logger.info(`Reset ${key} due to wrong type (${type})`);
    }
  } catch (error) {
    logger.error(`Error checking/resetting ${key}:`, error);
  }
}

export async function addToBlocklist(
  ip: string, 
  reason: string, 
  isPermanent = false,
  url?: string
): Promise<void> {
  try {
    await ensureHashStructure(REDIS_KEYS.IP_BLOCKLIST);
    
    const entry: BlocklistEntry = {
      ip,
      reason,
      timestamp: Date.now(),
      isPermanent,
      url
    };

    const multi = redisClient.multi();
    multi.hset(REDIS_KEYS.IP_BLOCKLIST, ip, JSON.stringify(entry));
    
    if (!isPermanent) {
      multi.expire(REDIS_KEYS.IP_BLOCKLIST, TEMP_BLOCK_DURATION);
    }
    
    await multi.exec();
    logger.info(`Added IP ${ip} to blocklist. URL: ${url}, Reason: ${reason}, isPermanent: ${isPermanent}`);
  } catch (error) {
    logger.error(`Error adding IP ${ip} to blocklist:`, error);
    throw error;
  }
}

export async function isBlocked(ip: string): Promise<boolean> {
  try {
    await ensureHashStructure(REDIS_KEYS.IP_BLOCKLIST);
    
    const entry = await redisClient.hget(REDIS_KEYS.IP_BLOCKLIST, ip);
    if (!entry) return false;

    const blockData: BlocklistEntry = JSON.parse(entry);
    
    if (blockData.isPermanent) return true;
    
    const blockAge = Date.now() - blockData.timestamp;
    return blockAge < TEMP_BLOCK_DURATION * 1000;
  } catch (error) {
    logger.error(`Error checking if IP ${ip} is blocked:`, error);
    return false;
  }
}

export async function incrementSuspiciousAttempts(
  ip: string, 
  url?: string
): Promise<number> {
  try {
    await ensureHashStructure(REDIS_KEYS.SUSPICIOUS_ATTEMPTS);
    
    const multi = redisClient.multi();
    multi.hincrby(REDIS_KEYS.SUSPICIOUS_ATTEMPTS, ip, 1);
    multi.expire(REDIS_KEYS.SUSPICIOUS_ATTEMPTS, TEMP_BLOCK_DURATION);
    
    const results = await multi.exec();
    if (!results) return 0;

    const attempts = results[0][1] as number;
    
    if (attempts >= MAX_SUSPICIOUS_ATTEMPTS) {
      await addToBlocklist(
        ip, 
        'Multiple suspicious activities detected', 
        true,
        url
      );
      await redisClient.hdel(REDIS_KEYS.SUSPICIOUS_ATTEMPTS, ip);
      logger.info(`IP ${ip} blocked after ${attempts} suspicious attempts. Last URL: ${url}`);
    } else {
      logger.info(`Suspicious attempt #${attempts} from IP ${ip} at URL: ${url}`);
    }
    
    return attempts;
  } catch (error) {
    logger.error(`Error incrementing suspicious attempts for IP ${ip}:`, error);
    return 0;
  }
}

export async function getBlocklistEntry(ip: string): Promise<BlocklistEntry | null> {
  try {
    const entry = await redisClient.hget(REDIS_KEYS.IP_BLOCKLIST, ip);
    return entry ? JSON.parse(entry) : null;
  } catch (error) {
    logger.error(`Error getting blocklist entry for IP ${ip}:`, error);
    return null;
  }
}

// Add cleanup function to remove expired entries
export async function cleanupBlocklist(): Promise<void> {
  try {
    const entries = await redisClient.hgetall(REDIS_KEYS.IP_BLOCKLIST);
    const now = Date.now();
    const multi = redisClient.multi();

    for (const [ip, entryStr] of Object.entries(entries)) {
      const entry: BlocklistEntry = JSON.parse(entryStr);
      if (!entry.isPermanent && (now - entry.timestamp) >= TEMP_BLOCK_DURATION * 1000) {
        multi.hdel(REDIS_KEYS.IP_BLOCKLIST, ip);
      }
    }

    await multi.exec();
  } catch (error) {
    logger.error('Error cleaning up blocklist:', error);
  }
}