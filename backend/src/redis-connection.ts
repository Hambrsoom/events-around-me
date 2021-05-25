import redis from "redis";
import { promisify } from "util";
import  config  from "../config/config";
import logger from "./utilities/logger/logger";

export const redisClient = redis.createClient(config.redisPort, "127.0.0.1");

export const runRedis = () =>  {
  redisClient.on("connect", () => {
    logger.info({
          message: `connected to redis db at the port: ${config.redisPort}`,
      });
  });
};

export const exist: any = promisify(redisClient.exists).bind(redisClient);
export const cache: any = promisify(redisClient.set).bind(redisClient);
export const readCache: any = promisify(redisClient.get).bind(redisClient);
export const del: any = promisify(redisClient.del).bind(redisClient);
