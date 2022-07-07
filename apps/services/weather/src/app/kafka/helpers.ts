import {
  addDays,
  isWithinInterval,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
} from 'date-fns';

export const isWithinSevenDays = (date: Date): boolean => {
  const currentDate = setHours(
    setMinutes(setSeconds(setMilliseconds(new Date(), 0), 0), 0),
    0
  );
  const sevenDaysFromNow = addDays(currentDate, 7);

  return isWithinInterval(date, { start: currentDate, end: sevenDaysFromNow });
};
