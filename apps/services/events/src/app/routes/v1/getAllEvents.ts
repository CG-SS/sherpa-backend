import { Request, Response } from 'express';
import { RouteResolver } from '../types';
import { prisma } from '@sherpa-backend/prisma';

// GET /events
export const getAllEvents: RouteResolver = [
  '/events',
  async (req: Request, res: Response) => {
    const allEvents = await prisma.event.findMany();

    res.status(200).json(allEvents);
  },
];
