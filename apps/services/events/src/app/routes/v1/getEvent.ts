import { Request, Response } from 'express';
import { RouteResolver } from '../types';
import { prisma } from '@sherpa-backend/prisma';

//GET /events/{eventId}
export const getEvent: RouteResolver = [
  '/events/:eventId',
  async (req: Request, res: Response) => {
    const { params } = req;
    const { eventId } = params;

    if (!eventId) {
      res.status(422).send();
      return;
    }

    const event = prisma.event.findUnique({
      where: {
        id: eventId as string,
      },
    });

    res.status(200).json(event);
  },
];
