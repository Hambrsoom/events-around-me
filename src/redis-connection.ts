import redis from "redis";
import  config  from "../config/config";
import { promisify } from "util";

export const redisClient = redis.createClient(config.redisPort, "127.0.0.1");
redisClient.on("connect", function() {
    console.log("connected");
});

export const cleanRedis = () => {
    redisClient.flushdb( function (err: Error, succeeded) {
        console.log(succeeded);
    });
};


export const existAsync: any = promisify(redisClient.exists).bind(redisClient);
export const setAsync: any = promisify(redisClient.set).bind(redisClient);
export const getAsync: any = promisify(redisClient.get).bind(redisClient);
export const delAsync: any = promisify(redisClient.del).bind(redisClient);
