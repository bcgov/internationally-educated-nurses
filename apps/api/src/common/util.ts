import dayjs from 'dayjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function sortStatus(data: any[]): any[] {
  data.sort((a, b) => {
    /**
     * Sorting status based on milestone date + created_date stamp in ASC.
     * There is a chance that multiple milestones changes on the same date
     */
    let retval = 0;
    if (a.start_date > b.start_date) retval = 1; // ASC
    if (a.start_date < b.start_date) retval = -1; // ASC
    if (retval === 0) retval = a.created_date < b.created_date ? -1 : 1; // ASC
    return retval;
  });
  return data;
}

export function getMilestoneCategory(name: string) {
  // HMBC provide as a category for status. We have added 5 main category with unique ID in seed.
  // This category-ID are only for internal purpose, So we will check it with predefined array of match keyword and return it's value
  // We will use switch case or object-value in future, once we receive production API endpoints from HMBC ATS system
  if (name.toLocaleLowerCase().indexOf('hmbc process') !== -1) {
    return 10001;
  } else if (
    name.toLocaleLowerCase().indexOf('licensing') !== -1 ||
    name.toLocaleLowerCase().indexOf('registration') !== -1
  ) {
    return 10002;
  } else if (
    name.toLocaleLowerCase().indexOf('competition') !== -1 ||
    name.toLocaleLowerCase().indexOf('recruitment') !== -1
  ) {
    return 10003;
  } else if (
    name.toLocaleLowerCase().indexOf('pnp') !== -1 ||
    name.toLocaleLowerCase().indexOf('immigration') !== -1
  ) {
    return 10004;
  } else if (name.toLocaleLowerCase().indexOf('final') !== -1) {
    return 10005;
  }
  return null;
}

export function isValidDateFormat(dt: string) {
  const regx = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12]\d{1}|3[01])$/;
  return !!dt.match(regx);
}

export function getStartEndDateOfWeek(w: number, y: number, period: number) {
  const startdate = getDateOfWeek(w, y);
  const enddate = dayjs(startdate).add(period * 7 - 1, 'day');
  return { startdate, enddate };
}

function getDateOfWeek(w: number, y: number) {
  const simple = new Date(y, 0, 1 + (w - 1) * 7);
  const dow = simple.getDay();
  const ISOweekStart = simple;
  if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart;
}
