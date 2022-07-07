import {
  addDays,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
  subDays,
} from 'date-fns';
import { isWithinSevenDays } from './helpers';

describe('Weather Kafka Helpers (isWithinSevenDays)', () => {
  type TestCase = {
    name: string;
    entry: Date;
    expected: boolean;
  };

  const currentDate = setHours(
    setMinutes(setSeconds(setMilliseconds(new Date(), 0), 0), 0),
    0
  );

  const testCases: TestCase[] = [
    {
      name: 'Returns true for date within range',
      entry: addDays(currentDate, 4),
      expected: true,
    },
    {
      name: 'Returns true for another date within range',
      entry: addDays(currentDate, 1),
      expected: true,
    },
    {
      name: 'Returns true for today',
      entry: currentDate,
      expected: true,
    },
    {
      name: 'Returns true for seven days from now',
      entry: addDays(currentDate, 7),
      expected: true,
    },
    {
      name: 'Returns false for past date',
      entry: subDays(currentDate, 1),
      expected: false,
    },
    {
      name: 'Returns false for date after seven days',
      entry: addDays(currentDate, 8),
      expected: false,
    },
  ];

  testCases.forEach(async ({ name, entry, expected }) => {
    it(name, () => expect(isWithinSevenDays(entry)).toEqual(expected));
  });
});
