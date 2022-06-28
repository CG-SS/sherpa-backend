import { Request, Response } from 'express';
import { RouteResolver } from '../types';

//GET /events/{eventId}
export const getEvent: RouteResolver = [
  '/events/:eventId',
  async (req: Request, res: Response) => {
    console.log('GetEvent');

    res.status(200).send();
  },
];
