import { Request, Response } from 'express';
import { RouteResolver } from '@sherpa-backend/services/rest';
import { prisma } from '@sherpa-backend/prisma';
import validate from 'uuid-validate';

// Maximum number of events that the endpoint can return.
const MAX_RETURN_ALL_EVENTS = 100;

// GET /events
// GET /events?cursorId=<id>
export const getAllEvents: RouteResolver = [
  '/events',
  async (req: Request, res: Response) => {
    const { query } = req;
    const { cursorId } = query;

    // If something gets sent as cursorId, we try to validate it.
    if (cursorId && !validate(cursorId as string)) {
      // If not valid, we return a bad request.
      res.status(422).send();
      return;
    }

    const cursorStrId = cursorId as string;

    // We use cursor based pagination, where the cursor is the ID of the last
    // item, exclusive. (That is, we don't include the last item.)
    const allEvents = await prisma.event.findMany({
      skip: cursorStrId ? 1 : 0,
      take: MAX_RETURN_ALL_EVENTS,
      cursor: cursorStrId ? { id: cursorStrId } : undefined,
    });

    res.status(200).json(allEvents);
  },
];
