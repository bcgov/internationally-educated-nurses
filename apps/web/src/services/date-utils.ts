import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

const thresholds = [
  { l: 's', r: 1 },
  { l: 'm', r: 1 },
  { l: 'mm', r: 59, d: 'minute' },
  { l: 'h', r: 1 },
  { l: 'hh', r: 23, d: 'hour' },
  { l: 'd', r: 1 },
  { l: 'dd', r: 29, d: 'day' },
  { l: 'M', r: 1 },
  { l: 'MM', r: 11, d: 'month' },
  { l: 'y', r: 1 },
  { l: 'yy', d: 'year' },
];

dayjs.extend(duration);
dayjs.extend(relativeTime, { thresholds });

export const getHumanizedDuration = (start: dayjs.ConfigType, end?: dayjs.ConfigType): string => {
  // since we don't keep track of time, start_date from the DB gets set to 00:00:00:00
  // so anything less than a day will take the current locale time and compare it to start_date
  // ex if new status is added at 12pm locale time,
  // it will be a 12hr duration when compared to start_date from DB
  if (start === dayjs().format('YYYY-MM-DD')) {
    return 'today';
  }

  return dayjs.duration(dayjs(start).diff(end || new Date())).humanize();
};
