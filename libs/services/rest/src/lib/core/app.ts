import express from 'express';
import winston from 'winston';
import expressWinston from 'express-winston';
import { ValidationError } from 'express-json-validator-middleware';

import { DefaultGetRoutes } from './routes';

export const defaultApp = express();

// Every microservice will use JSON for their bodies.
defaultApp.use(express.json());
defaultApp.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    meta: false,
    msg: 'HTTP  ',
    expressFormat: true,
    colorize: false,
  })
);
defaultApp.use((error, request, response, next) => {
  // Check the error is a validation error
  if (error instanceof ValidationError) {
    // Handle the error
    response.status(422).send(error.validationErrors);
    next();
  } else {
    // Pass error on if not a validation error
    next(error);
  }
});

// Every microservice will have the health route by default.
// In the future, we might have more endpoints that every microservice that
// every microservice has (for instance, metric collection).
DefaultGetRoutes.forEach(([route, resolver]) => defaultApp.get(route, resolver));
