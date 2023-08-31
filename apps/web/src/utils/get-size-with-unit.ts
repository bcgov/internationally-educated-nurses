export const getSizeWithUnit = (size: number, withComma = true): string => {
  const format = (n: number) => (withComma ? n.toLocaleString() : n);

  if (size > 1024 * 1024) {
    return `${format(size / 1024 / 1024)} MB`;
  }
  if (size > 1024) {
    return `${format(size / 1024)} KB`;
  }
  return `${format(size)} B`;
};
