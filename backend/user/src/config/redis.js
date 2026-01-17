// ============================================
// FILE: backend/user/src/config/redis.js
// ============================================
const redis = require('redis');
const logger = require('../utils/logger');
const config = require('./env');

let redisClient = null;

const connectRedis = async () => {
  if (!config.redis.enabled) {
    logger.info('Redis is disabled in configuration');
    return null;
  }

  try {
    redisClient = redis.createClient({
      socket: {
        host: config.redis.host,
        port: config.redis.port,
      },
      password: config.redis.password,
      legacyMode: false,
    });

    redisClient.on('error', (err) => {
      logger.error(`Redis error: ${err.message}`);
    });

    redisClient.on('connect', () => {
      logger.info('Redis client connected');
    });

    redisClient.on('ready', () => {
      logger.info('Redis client ready');
    });

    redisClient.on('end', () => {
      logger.warn('Redis client disconnected');
    });

    await redisClient.connect();

    return redisClient;
  } catch (error) {
    logger.error(`Failed to connect to Redis: ${error.message}`);
    logger.warn('Continuing without Redis caching');
    return null;
  }
};

const getRedisClient = () => {
  return redisClient;
};

const disconnectRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    logger.info('Redis client disconnected');
  }
};

// Cache helpers
const cacheSet = async (key, value, ttl = 3600) => {
  if (!redisClient) return false;
  
  try {
    await redisClient.setEx(
      key,
      ttl,
      typeof value === 'object' ? JSON.stringify(value) : value
    );
    return true;
  } catch (error) {
    logger.error(`Redis SET error: ${error.message}`);
    return false;
  }
};

const cacheGet = async (key) => {
  if (!redisClient) return null;
  
  try {
    const value = await redisClient.get(key);
    if (!value) return null;
    
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  } catch (error) {
    logger.error(`Redis GET error: ${error.message}`);
    return null;
  }
};

const cacheDel = async (key) => {
  if (!redisClient) return false;
  
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error(`Redis DEL error: ${error.message}`);
    return false;
  }
};

const cacheDelPattern = async (pattern) => {
  if (!redisClient) return false;
  
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    return true;
  } catch (error) {
    logger.error(`Redis DEL pattern error: ${error.message}`);
    return false;
  }
};

module.exports = {
  connectRedis,
  getRedisClient,
  disconnectRedis,
  cacheSet,
  cacheGet,
  cacheDel,
  cacheDelPattern,
};