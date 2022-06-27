import { V1GetRoutes } from './routes';
import { defaultApp } from "@sherpa-backend/services/rest";

export const app = defaultApp;

V1GetRoutes.forEach(([route, resolver]) => app.get(`/v1${route}`, resolver));
