import Redis from 'ioredis';
import { logger } from './logger';
import dotenv from 'dotenv';


dotenv.config();
export const REDIS_KEYS = {
    IP_BLOCKLIST: 'ip:blocklist',
    SUSPICIOUS_ATTEMPTS: 'ip:suspicious_attempts',
    RATE_LIMIT_PREFIX: 'ip:ratelimit:',
    REQUEST_TRACKER: 'ip:request_tracker',
  } as const;

export const config = {
    rateLimit:    {
        api: {
          windowMs: 15 * 60 * 1000,
          max: 100,
        },
        login: {
          windowMs: 15 * 60 * 1000,
          max: process.env.NODE_ENV === "production" ? 10 : 20,
        },
    },
    environment: process.env.NODE_ENV,
    redisUrl: process.env.REDIS_URL,
}

const REDIS_RETRY_STRATEGY = (times: number) => {
  const delay = Math.min(times * 50, 2000);
  return delay;
};

function getRedisConfig() {
  // If Redis URL is provided, use it
    try {
      const parsedUrl = new URL(config.redisUrl!);
      return {
        host: parsedUrl.hostname,
        port: parseInt(parsedUrl.port),
        password: parsedUrl.password
      };
    } catch (error) {
      logger.warn('Invalid Redis URL, falling back to individual config params');
    }
    return {
        host: "127.0.0.1",
        port: 6379,
    };
}

export const redisClient = new Redis({
  ...getRedisConfig(),
  retryStrategy: REDIS_RETRY_STRATEGY,
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  reconnectOnError: (err) => {
    const targetError = 'READONLY';
    return err.message.includes(targetError);
  }
});

redisClient.on('connect', () => {
  logger.info('Redis client connected successfully');
});

redisClient.on('error', (err) => {
  logger.error('Redis client error:', err);
});

redisClient.on('ready', () => {
  logger.info('Redis client ready');
});

redisClient.on('reconnecting', () => {
  logger.info('Redis client reconnecting');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  redisClient.quit().then(() => {
    logger.info('Redis client disconnected through app termination');
    process.exit(0);
  });
});

export default redisClient;

// Helper functions for working with Redis Streams
export async function addToStream(streamName: string, data: Record<string, any>): Promise<string> {
  try {
    const id = await redisClient.xadd(streamName, '*', ...Object.entries(data).flat());
    if (id === null) throw new Error('Failed to add to stream');
    return id;
  } catch (error) {
    logger.error('Error adding to Redis Stream:', error);
    throw error;
  }
}

export async function readFromStream(streamName: string, count: number = 1): Promise<[string, string[]][]> {
  try {
    const result = await redisClient.xread('COUNT', count, 'STREAMS', streamName, '0');
    return result ? result[0][1] : [];
  } catch (error) {
    logger.error('Error reading from Redis Stream:', error);
    throw error;
  }
}

export async function createConsumerGroup(streamName: string, groupName: string): Promise<void> {
  try {
    await redisClient.xgroup('CREATE', streamName, groupName, '$', 'MKSTREAM');
  } catch (error) {
    if (error instanceof Error && error.message.includes('BUSYGROUP')) {
      logger.info(`Consumer group ${groupName} already exists for stream ${streamName}`);
    } else {
      logger.error('Error creating consumer group:', error);
      throw error;
    }
  }
}

export async function readFromGroup(streamName: string, groupName: string, consumerName: string): Promise<[string, string[]][]> {
  try {
    const result = await redisClient.xreadgroup('GROUP', groupName, consumerName, 'COUNT', 1, 'STREAMS', streamName, '>');
    return result && Array.isArray(result[0]) ? result[0][1] as [string, string[]][] : [];
  } catch (error) {
    logger.error('Error reading from consumer group:', error);
    throw error;
  }
}

export async function ackMessage(streamName: string, groupName: string, id: string): Promise<void> {
  try {
    await redisClient.xack(streamName, groupName, id);
  } catch (error) {
    logger.error('Error acknowledging message:', error);
    throw error;
  }
}