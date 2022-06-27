import { RouteResolver } from "../types";

import { getAllEvents } from "./getAllEvents";
import { getEvent } from "./getEvent";

export const V1GetRoutes: RouteResolver[] = [
  getAllEvents,
  getEvent,
];
