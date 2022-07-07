import { RouteResolverWithSchema } from '@sherpa-backend/services/rest';
import { Request, Response } from 'express';
import { formatISO, parseISO } from 'date-fns';

import {
  EventInput,
  EventInputSchema,
} from '@sherpa-backend/services/file-uploader-shared';
import { prisma } from '@sherpa-backend/prisma';
import { getKafkaProducer } from '../../producer';
import { environment } from '../../environment';
import {
  CreateEventPayload,
  EventMessageValue,
  EventType,
} from '@sherpa-backend/domain/events';

// POST /events
export const createEvent: RouteResolverWithSchema = [
  '/events',
  EventInputSchema,
  async (req: Request, res: Response) => {
    const { body } = req;
    const eventInput = body as EventInput;

    const { date, organizer, attendees, name, isOutside } = eventInput;

    const possibleEvent = await prisma.event.findUnique({
      where: {
        name,
      },
    });

    if (possibleEvent) {
      // Conflict
      res.status(409).send();

      return;
    }

    const isoDate = parseISO(date);

    const { name: organizerName } = organizer;

    const createdEvent = await prisma.event.create({
      data: {
        name,
        date: isoDate,
        isOutside,
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

    const payload: CreateEventPayload = {
      attendees: attendees,
      date: formatISO(isoDate),
      isOutside,
      name,
      organizer: {
        name: organizerName,
      },
    };

    const eventMessage: EventMessageValue = {
      eventType: EventType.CREATE_EVENT,
      payload,
    };

    const kafkaProducer = await getKafkaProducer();
    await kafkaProducer.send({
      topic: environment.kafkaTopic,
      messages: [{ value: JSON.stringify(eventMessage) }],
    });

    res.status(200).json(createdEvent);
  },
];
