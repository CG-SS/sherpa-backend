import request from 'supertest';
import { app } from "./app";
import { prisma } from "@sherpa-backend/prisma";

describe('File Uploader Service App', () => {

  process.env.DATABASE_URL = 'postgresql://postgres:admin@localhost:12999/postgres';

  const OLD_ENV = process.env;

  beforeEach(() => {
    // Clears the cache
    jest.resetModules();
    // Make a copy of the env
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    // Restore old environment
    process.env = OLD_ENV;
  });

  it('Returns health status', async () => {
    const res = await request(app).get('/health').set('Content-Type', 'application/json');
    expect(res.status).toEqual(200);
  });

  it('Creates a new event', async () => {
    const jsonBody = {
      name: "Party at the lake",
      date: "2022-06-28T15:46:43+00:00",
      isOutside: true,
      organizer: {
        name: "John Smith"
      },
      attendees: [
        {
          name: "Rebecca Johnson",
          age: 18
        },
        {
          name: "Kevin Kepler",
          age: 18
        },
      ],
    };

    const res = await request(app)
      .post('/v1/events')
      .send(jsonBody)
      .set('Content-Type', 'application/json');

    const { status, body } = res;
    const { id } = body;

    // We check if the event has the same fields.
    const newEvent = await prisma.event.findUnique({
      where: {
        id,
      },
      include: {
        organizer: true,
      }
    });

    expect(status).toEqual(200);
    // We should check for every field, but for the sake of simplicity, I only
    // check some.
    expect(newEvent.id).toEqual(id);
    expect(newEvent.isOutside).toEqual(jsonBody.isOutside);
    expect(newEvent.organizer.name).toEqual(jsonBody.organizer.name);
  });

  it('Uploads JSON file', async () => {
    const jsonFile = JSON.stringify([{
      name: "Party at the lake",
      date: "2022-06-28T15:46:43+00:00",
      isOutside: true,
      organizer: {
        name: "John Smith"
      },
      attendees: [
        {
          name: "Rebecca Johnson",
          age: 18
        },
        {
          name: "Kevin Kepler",
          age: 18
        },
      ],
    }]);

    const res = await request(app)
      .post('/v1/upload/events/json')
      .attach('name', Buffer.from(jsonFile), 'events.json');
    const { status } = res;

    expect(status).toEqual(200);
  });
});
