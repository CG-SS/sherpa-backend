import { Request, Response } from 'express';
import { RouteResolver } from '@sherpa-backend/services/rest';
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

    const event = await prisma.event.findUnique({
      where: {
        id: eventId as string,
      },
      include: {
        weather: true,
        organizer: true,
        attendees: true,
      },
    });

    res.status(200).json(event);
  },
];
