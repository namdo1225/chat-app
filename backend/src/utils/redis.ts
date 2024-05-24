import * as redis from 'redis';
import { REDIS_URL } from './config';

const redisClient = redis.createClient({url: `redis://${REDIS_URL}:6379`});
redisClient.on("error", (error) => console.error(`Error : ${error}`));


/**
 * Connect to Redis service.
 */
const connectRedis = async (): Promise<void> => {
    await redisClient.connect();
};

void connectRedis();

export default redisClient;