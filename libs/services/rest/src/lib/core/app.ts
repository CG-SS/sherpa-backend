import express from 'express';
import winston from 'winston';
import expressWinston from 'express-winston';
import { DefaultGetRoutes } from './routes';

export const defaultApp = express();

// Every microservice will use JSON for their bodies.
defaultApp.use(express.json());
defaultApp.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      process.env.NODE_ENV === 'production'
        ? winston.format.json()
        : winston.format.simple()
    ),
    meta: false,
    msg: 'HTTP  ',
    expressFormat: true,
    colorize: false,
  })
);

// Every microservice will have the health route by default.
// In the future, we might have more endpoints that every microservice that
// every microservice has (for instance, metric collection).
DefaultGetRoutes.forEach(([route, resolver]) => defaultApp.get(route, resolver));
