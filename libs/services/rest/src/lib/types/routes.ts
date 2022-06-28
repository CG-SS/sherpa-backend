import { Request, Response } from 'express';

export type RouteResolver = readonly [
  string,
  (req: Request, res: Response) => Promise<void>
];
