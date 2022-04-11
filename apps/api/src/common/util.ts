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
