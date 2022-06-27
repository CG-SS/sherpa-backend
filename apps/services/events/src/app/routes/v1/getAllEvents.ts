import { Request, Response } from 'express';
import { RouteResolver } from "../types";

// GET /events
export const getAllEvents: RouteResolver = ['/events', async (req: Request, res: Response) => {
  console.log('GetAllEvent')

  res.status(200).send();
}];
