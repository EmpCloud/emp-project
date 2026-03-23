import Response from '../response/response.js';
import config from 'config';
import logger from '../resources/logs/logger.log.js';
let apiCallCounts = {}; // object to store the number of API calls made by each IP address
const windowMs = config.get('window_timecycle'); // time window in milliseconds
const maxRequests = config.get('maxRequests'); // maximum number of requests within the time window

const rateLimiterMiddleware = function (req, res, next) {
    let ip = req?.query?.uni ?? 0;

    let apiCallCount = apiCallCounts[ip] || 0;
    const resetTime = Date.now() + windowMs;
    if (apiCallCount >= maxRequests) {
        // if the API call limit has been exceeded, respond with a rate limit error
        res.setHeader('Retry-After', windowMs);
        res.send(Response.projectFailResp(`Too many requests, please try again later.`));
    } else {
        // add a delay of 2 seconds to the second and subsequent API calls for a specific IP
        const delayMs = apiCallCount === 0 ? 0 : config.get('delayTime');
        logger.info(`UNI Number--> ${ip}    +++apicallCount--> ${apiCallCount}`);
        setTimeout(() => {
            apiCallCounts[ip] = apiCallCount + 1;
            req.rateLimit = {
                remaining: maxRequests - (apiCallCount + 1),
                resetTime: resetTime,
                windowMs: windowMs,
            };
            next();
            //reset the API call count for each IP address after the time window has passed
            if (apiCallCount === 0) {
                // reset the API call count for each IP address after the time window has passed
                setTimeout(() => {
                    logger.info(`Resetting API call count for IP: ${ip}`);
                    apiCallCounts[ip] = 0;
                }, windowMs);
            }
        }, delayMs);
    }
};

export default rateLimiterMiddleware;
