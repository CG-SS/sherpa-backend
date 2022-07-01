import { RouteResolverWithSchema } from '@sherpa-backend/services/rest';
import { Request, Response } from 'express';
import { parseISO } from 'date-fns';

import {
  EventInput,
  EventInputSchema,
} from '@sherpa-backend/services/file-uploader-shared';
import { prisma } from '@sherpa-backend/prisma';

// POST /events
export const createEvent: RouteResolverWithSchema = [
  '/events',
  EventInputSchema,
  async (req: Request, res: Response) => {
    const { body } = req;
    const eventInput = body as EventInput;

    const { date, organizer, attendees } = eventInput;
    const isoDate = parseISO(date);

    const { name: organizerName } = organizer;

    const createdEvent = await prisma.event.create({
      data: {
        name: eventInput.name,
        date: isoDate,
        isOutside: eventInput.isOutside,
        organizer: {
          create: {
            name: organizerName,
          },
        },
        attendees: {
          create: attendees,
        },
      },
    });

    res.status(200).json(createdEvent);
  },
];
