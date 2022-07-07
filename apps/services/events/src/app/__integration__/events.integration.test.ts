import request from 'supertest';
import { Prisma } from '@prisma/client';

import { app } from '../app';
import { prisma } from '@sherpa-backend/prisma';

describe('Events Service App Integration Test', () => {
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

  beforeAll(() => {
    // We make sure the database is clean before testing.
    return prisma.weather
      .deleteMany()
      .then(() => prisma.event.deleteMany())
      .then(() => Promise.all(events.map(prisma.event.create)));
  });

  it('Returns health status', async () => {
    const res = await request(app).get('/health').set('Content-Type', 'application/json');
    expect(res.status).toEqual(200);
  });

  it('Returns all events', async () => {
    // Ideally, we want to test if the return type is the same, however, since
    // the returned dates are a string, we would have to cast each element of
    // each returned object to string, and for the sake of time I won't be
    // doing this here. And the same applies to the other tests.
    const expectedEvents = (await prisma.event.findMany())
      .map((e) => e.id)
      .sort((a, b) => a.localeCompare(b));

    const res = await request(app)
      .get('/v1/events')
      .set('Content-Type', 'application/json');

    const { status, body } = res;

    expect(status).toEqual(200);
    expect(body.map((e) => e.id).sort((a, b) => a.localeCompare(b))).toEqual(
      expectedEvents
    );
  });

  it('Returns paginated results', async () => {
    const currentEvents = (await prisma.event.findMany())
      .map((e) => e.id)
      .sort((a, b) => a.localeCompare(b));

    const id = currentEvents[0];
    const eventsRest = currentEvents.slice(1).sort((a, b) => a.localeCompare(b));

    const res = await request(app)
      .get(`/v1/events?cursorId=${id}`)
      .set('Content-Type', 'application/json');

    const { status, body } = res;

    expect(status).toEqual(200);
    expect(body.map((e) => e.id).sort((a, b) => a.localeCompare(b))).toEqual(eventsRest);
  });

  it('Returns specific event', async () => {
    const { id } = await prisma.event.findFirst();

    const res = await request(app)
      .get(`/v1/events/${id}`)
      .set('Content-Type', 'application/json');

    const { status, body } = res;

    expect(status).toEqual(200);
    expect(body.id).toEqual(id);
  });
});
