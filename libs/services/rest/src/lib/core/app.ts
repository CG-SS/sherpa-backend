import * as express from "express";
import { DefaultGetRoutes } from "./routes";

export const defaultApp = express();

// Every microservice will use JSON for their bodies.
defaultApp.use(express.json());

// Every microservice will have the health route by default.
// In the future, we might have more endpoints that every microservice that
// every microservice has (for instance, metric collection).
DefaultGetRoutes.forEach(([route, resolver]) => defaultApp.get(route, resolver));
