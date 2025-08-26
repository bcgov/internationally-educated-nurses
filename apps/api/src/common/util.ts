import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { Transform } from 'stream';

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

/**
 * Asynchronously processes an Excel file buffer and converts it into an array of JSON objects of a specified type.
 *
 * This function reads an Excel file from a provided buffer, converts its first worksheet to JSON format,
 * and streams the JSON objects into an array. The function is generic, allowing you to specify the type
 * of the resulting JSON objects, making it suitable for working with strongly-typed data structures derived
 * from the Excel file.
 *
 * @template T - The type representing the structure of each row in the resulting JSON array.
 *
 * @param {Buffer} fileBuffer - The buffer containing the Excel file data to be processed.
 *
 * @returns {Promise<T[]>} A promise that resolves to an array of JSON objects of type T, where each object
 * represents a row from the Excel file. This array is available once the file processing is complete.
 *
 * @example
 * // Define a specific type for the rows
 * interface MyRowType {
 *   Column1: string;
 *   Column2: number;
 *   Column3: boolean;
 * }
 *
 * // Usage example with a buffer (e.g., from a file upload)
 * const buffer: Buffer = getUploadedFileBuffer(); // Replace with actual buffer
 *
 * (async () => {
 *   try {
 *     const jsonData = await processExcelBuffer<MyRowType>(buffer);
 *     console.log('Data converted to JSON successfully!');
 *     console.log(jsonData);
 *   } catch (error) {
 *     console.error('Error processing Excel buffer:', error);
 *   }
 * })();
 */
type RowData = Record<string, unknown>;
export const processExcelBuffer = async <T extends Record<string, unknown> = RowData>(
  fileBuffer: Buffer,
): Promise<T[]> => {
  const wb = XLSX.read(fileBuffer, { dense: true }); // Read from the buffer
  const ws = wb.Sheets[wb.SheetNames[0]]; // Get the first worksheet

  const jsonArray: T[] = []; // Store JSON objects
  const conv = new Transform({ writableObjectMode: true });
  conv._transform = function (obj, encoding, callback) {
    jsonArray.push(obj); // Push the actual JSON object to the array
    callback(null);
  };

  return new Promise<T[]>((resolve, reject) => {
    conv.on('finish', () => {
      resolve(jsonArray); // Resolve with the array of JSON objects when finished
    });

    conv.on('error', (error: Error) => {
      reject(error); // Reject if there is an error
    });

    XLSX.stream.to_json(ws, { raw: true }).pipe(conv); // Stream the JSON objects
  });
};
