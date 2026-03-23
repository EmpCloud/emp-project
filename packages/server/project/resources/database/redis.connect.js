import { createClient } from 'redis';
import logger from '../logs/logger.log.js';
import config from 'config';

const redisClient = createClient({ url: config.get("redis.url")});

(async () => {
    await redisClient.connect();
})();
logger.info('Connecting to the Redis');
console.log('Connecting to the Redis');

redisClient.on('ready', () => {
    logger.info('Redis database Connected!');
    console.log('Redis database Connected!');
});

redisClient.on('error', err => {
    logger.error(`Error in the Connection"${err}`);
    console.log(err);
    console.log('Error in the Connection');
});

export default redisClient;
