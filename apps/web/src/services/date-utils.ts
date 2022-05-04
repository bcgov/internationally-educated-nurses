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
  { l: 'y' },
  { l: 'yy', d: 'year' },
];

dayjs.extend(duration);
dayjs.extend(relativeTime, { thresholds });

export const getHumanizedDuration = (start: dayjs.ConfigType, end?: dayjs.ConfigType): string => {
  return dayjs.duration(dayjs(start).diff(end || new Date())).humanize();
};
