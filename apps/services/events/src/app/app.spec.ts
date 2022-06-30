import request from 'supertest';
import { Prisma, Event } from '@prisma/client';
import { toDate } from 'date-fns';

import { app } from './app';
import { prisma } from '@sherpa-backend/prisma';

describe('Events Service App', () => {
  // Helper func to map Dates into ISO date strings, which are returned by the
  // endpoint.
  const mapToIsoDate = (event: Event) => {
    const { createdAt, date, updatedAt } = event;

    return {
      ...event,
      createdAt: toDate(createdAt).toISOString(),
      date: toDate(date).toISOString(),
      updatedAt: toDate(updatedAt).toISOString(),
    };
  };

  // The events to be used on the tests.
  const events: Prisma.EventCreateArgs[] = [
    {
      data: {
        name: 'Party at the lake',
        date: '2022-06-29T21:46:12+00:00',
        isOutside: true,
        organizer: {
          create: {
            name: 'John Smith',
          },
        },
        weather: {
          create: {
            chanceOfRain: 44,
            temperatureInDegreesCelsius: 25,
          },
        },
        attendees: {
          create: [
            {
              name: 'Albert Kepler',
              age: 18,
            },
            {
              name: 'Halkin Neutron',
              age: 20,
            },
          ],
        },
      },
    },
    {
      data: {
        name: 'Techno Rave',
        date: '2022-06-29T21:48:47+00:00',
        isOutside: false,
        organizer: {
          create: {
            name: 'DJ Gunther',
          },
        },
        attendees: {
          create: [
            {
              name: 'Christopher Hans',
              age: 33,
            },
          ],
        },
      },
    },
  ];

  beforeAll(async () => {
    // We populate the database with the new events.
    await Promise.all(events.map(prisma.event.create));
  });

  process.env.DATABASE_URL = 'postgresql://postgres:admin@localhost:12999/postgres';

  it('Returns health status', async () => {
    const res = await request(app).get('/health').set('Content-Type', 'application/json');
    expect(res.status).toEqual(200);
  });

  it('Returns all events', async () => {
    const expectedEvents = (await prisma.event.findMany())
      .map(mapToIsoDate)
      .sort((a, b) => a.id.localeCompare(b.id));

    const res = await request(app)
      .get('/v1/events')
      .set('Content-Type', 'application/json');

    const { status, body } = res;

    expect(status).toEqual(200);
    expect(body.sort((a, b) => a.id.localeCompare(b.id))).toEqual(expectedEvents);
  });

  it('Returns paginated results', async () => {
    const currentEvents = (await prisma.event.findMany()).map(mapToIsoDate);

    const { id } = currentEvents[0];
    const eventsRest = currentEvents.slice(1).sort((a, b) => a.id.localeCompare(b.id));

    const res = await request(app)
      .get(`/v1/events?cursorId=${id}`)
      .set('Content-Type', 'application/json');

    const { status, body } = res;

    expect(status).toEqual(200);
    expect(body.sort((a, b) => a.id.localeCompare(b.id))).toEqual(eventsRest);
  });

  it('Returns specific event', async () => {
    const event = mapToIsoDate(await prisma.event.findFirst());

    const { id } = event;

    const res = await request(app)
      .get(`/v1/events/${id}`)
      .set('Content-Type', 'application/json');

    const { status, body } = res;

    expect(status).toEqual(200);
    expect(body).toEqual(event);
  });
});
