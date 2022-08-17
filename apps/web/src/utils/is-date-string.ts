const DATE_STRING_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
export const isDateString = (value: string): boolean => {
  return !!value?.match(DATE_STRING_REGEX);
};
