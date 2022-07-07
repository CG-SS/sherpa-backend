import { RouteResolver, RouteResolverWithSchema } from '@sherpa-backend/services/rest';
import { createEvent } from './createEvent';
import { uploadJsonFile } from './uploadJsonFile';

export const V1PostRoutesWithSchema: RouteResolverWithSchema[] = [createEvent];

export const V1PostRoutes: RouteResolver[] = [uploadJsonFile];
