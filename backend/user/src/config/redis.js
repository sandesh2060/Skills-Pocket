// ============================================
// FILE: backend/user/src/config/redis.js
// ============================================
const Redis = require('ioredis');
const logger = require('../utils/logger');

let redisClient = null;

const connectRedis = () => {
  if (process.env.REDIS_ENABLED !== 'true') {
    logger.info('Redis is disabled');
    return null;
  }

  try {
    redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    redisClient.on('connect', () => {
      logger.info('Redis connected successfully');
    });

    redisClient.on('error', (err) => {
      logger.error(`Redis error: ${err.message}`);
    });

    return redisClient;
  } catch (error) {
    logger.error(`Redis connection failed: ${error.message}`);
    return null;
  }
};

const getRedisClient = () => redisClient;

const cacheGet = async (key) => {
  if (!redisClient) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error(`Redis GET error: ${error.message}`);
    return null;
  }
};

const cacheSet = async (key, value, expirationInSeconds = 3600) => {
  if (!redisClient) return;
  try {
    await redisClient.setex(key, expirationInSeconds, JSON.stringify(value));
  } catch (error) {
    logger.error(`Redis SET error: ${error.message}`);
  }
};

const cacheDel = async (key) => {
  if (!redisClient) return;
  try {
    await redisClient.del(key);
  } catch (error) {
    logger.error(`Redis DEL error: ${error.message}`);
  }
};

module.exports = { connectRedis, getRedisClient, cacheGet, cacheSet, cacheDel };