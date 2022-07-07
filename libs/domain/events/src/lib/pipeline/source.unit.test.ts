import { KafkaMessage } from 'kafkajs';
import {
  EventMessageValue,
  EventType,
  validateMessage,
} from '@sherpa-backend/domain/events';

describe('Pipeline Source (validateMessage)', () => {
  type TestCase = {
    name: string;
    entry: KafkaMessage;
    expected: EventMessageValue | null;
  };

  // We need to define DATABASE_URL to satisfy Prisma.
  process.env.DATABASE_URL = 'postgresql://postgres:admin@localhost:12999/postgres';

  const testCases: TestCase[] = [
    {
      name: 'Refuses invalid message',
      entry: {
        key: null,
        timestamp: null,
        attributes: null,
        offset: null,
        headers: null,
        value: Buffer.from('Nothing', 'utf-8'),
      },
      expected: null,
    },
    {
      name: 'Refuses empty JSON message',
      entry: {
        key: null,
        timestamp: null,
        attributes: null,
        offset: null,
        headers: null,
        value: Buffer.from('{}', 'utf-8'),
      },
      expected: null,
    },
    {
      name: 'Refuses null message',
      entry: {
        key: null,
        timestamp: null,
        attributes: null,
        offset: null,
        headers: null,
        value: null,
      },
      expected: null,
    },
    {
      name: 'Validates valid create message',
      entry: {
        key: null,
        timestamp: null,
        attributes: null,
        offset: null,
        headers: null,
        value: Buffer.from(
          JSON.stringify({
            eventType: EventType.CREATE_EVENT,
            payload: {
              name: 'Party at the lake',
              date: '2022-07-07T00:13:57+00:00',
              isOutside: false,
              organizer: {
                name: 'John Smith',
              },
              attendees: [],
            },
          }),
          'utf-8'
        ),
      },
      expected: {
        eventType: EventType.CREATE_EVENT,
        payload: {
          attendees: [],
          date: '2022-07-07T00:13:57+00:00',
          isOutside: false,
          name: 'Party at the lake',
          organizer: { name: 'John Smith' },
        },
      },
    },
    {
      name: 'Validates valid update message',
      entry: {
        key: null,
        timestamp: null,
        attributes: null,
        offset: null,
        headers: null,
        value: Buffer.from(
          JSON.stringify({
            eventType: EventType.UPDATE_EVENT,
            payload: {
              eventName: 'Party at the lake',
              weather: {
                chanceOfRain: 40,
                temperatureInDegreesCelsius: 21,
              },
            },
          }),
          'utf-8'
        ),
      },
      expected: {
        eventType: EventType.UPDATE_EVENT,
        payload: {
          eventName: 'Party at the lake',
          weather: { chanceOfRain: 40, temperatureInDegreesCelsius: 21 },
        },
      },
    },
    {
      name: 'Refuses invalid create payload',
      entry: {
        key: null,
        timestamp: null,
        attributes: null,
        offset: null,
        headers: null,
        value: Buffer.from(
          JSON.stringify({
            eventType: EventType.CREATE_EVENT,
            payload: {
              eventName: 'Party at the lake',
            },
          }),
          'utf-8'
        ),
      },
      expected: null,
    },
    {
      name: 'Refuses invalid upload payload',
      entry: {
        key: null,
        timestamp: null,
        attributes: null,
        offset: null,
        headers: null,
        value: Buffer.from(
          JSON.stringify({
            eventType: EventType.UPDATE_EVENT,
            payload: {
              name: 'Nice Party',
            },
          }),
          'utf-8'
        ),
      },
      expected: null,
    },
  ];

  testCases.forEach(async ({ name, entry, expected }) => {
    it(name, () => expect(validateMessage(entry)).toEqual(expected));
  });
});
