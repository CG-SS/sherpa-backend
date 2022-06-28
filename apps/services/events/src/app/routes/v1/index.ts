import { RouteResolver } from '@sherpa-backend/services/rest';

import { getAllEvents } from './getAllEvents';
import { getEvent } from './getEvent';

export const V1GetRoutes: RouteResolver[] = [getAllEvents, getEvent];
