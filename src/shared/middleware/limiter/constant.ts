import dotenv from "dotenv"

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