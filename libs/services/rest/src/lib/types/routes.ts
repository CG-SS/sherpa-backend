import { Request, Response } from 'express';
import { AllowedSchema } from 'express-json-validator-middleware';

export type RouteResolver = readonly [
  string,
  (req: Request, res: Response) => Promise<void>
];

export type RouteResolverWithSchema = readonly [
  string,
  AllowedSchema,
  (req: Request, res: Response) => Promise<void>
];
