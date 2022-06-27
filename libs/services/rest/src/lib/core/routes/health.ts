import { Request, Response } from 'express';
import { RouteResolver } from "../../types";

//GET /events/{eventId}
export const health: RouteResolver = ['/health', async (req: Request, res: Response) => {
  res.status(200).json('Up and running!');
}];
