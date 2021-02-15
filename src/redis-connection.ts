import redis from "redis";
import  config  from "../config/config";

export const redisClient = redis.createClient(config.redisPort, "127.0.0.1");
redisClient.on('connect', function() {
    console.log('connected');
});

export const cleanRedis = () => {
    redisClient.flushdb( function (err, succeeded) {
        console.log(succeeded);
    });
}
