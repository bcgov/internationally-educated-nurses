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
