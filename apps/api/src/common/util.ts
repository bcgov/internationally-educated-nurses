import dayjs from 'dayjs';

const OLD_BCCNM_PROCESS_CUT_OFF_DATE = '2023-01-30';

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

export function startDateOfFiscal(date: string) {
  const today = new Date(date);
  let fiscalYearStartDate = today.getFullYear();
  if (today.getMonth() + 1 <= 3) {
    fiscalYearStartDate = today.getFullYear() - 1;
  }
  return `${fiscalYearStartDate}-04-01`;
}

export function isNewBCCNMProcess(registration_date: string | Date | undefined) {
  if (!registration_date) {
    return false;
  }
  return dayjs(registration_date).isAfter(OLD_BCCNM_PROCESS_CUT_OFF_DATE);
}

export function getDateFromCellValue(value: number | string): string | undefined {
  if (!value) return;

  if (typeof value === 'number') {
    // THIS IS BUG, SEE BELOW: 25568 -> number of days from 1990 to epoch at PST
    // Note: The 25568 offset seems to assume a different epoch (e.g., 1990). However, Excel's epoch starts at 1899-12-30
    return dayjs((+value - 25569) * 86400 * 1000).format('YYYY-MM-DD');
  }
  if (value.trim().toLowerCase() === 'yes') {
    return dayjs().format('YYYY-MM-DD');
  }
  if (value.trim().toLowerCase() === 'no') {
    return;
  }
  if (dayjs(value).isValid()) {
    return dayjs(value).format('YYYY-MM-DD');
  }
  throw Error('Invalid date format');
}
