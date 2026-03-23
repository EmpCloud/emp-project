import basicAuth from 'express-basic-auth';
import Logger from './../logs/logger.log.js';
import config from 'config';

const swaggerAuthLogger = (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  Logger.info(`------${new Date()}------${req.auth.user}------${ip}------`);
  next();
};

const auth = basicAuth({
  users: config.get('SWAGGER_AUTH'),
  challenge: true,
});


export {auth, swaggerAuthLogger};
