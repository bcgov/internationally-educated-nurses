export const formatDate = (value: string) => {
  if (!value) {
    return;
  }

  const date = new Date(value);

  // Date object subtracts a day, so need to re-add by 1
  const day = parseInt(date.toLocaleString('default', { day: '2-digit' })) + 1;

  const month = date.toLocaleString('default', { month: 'short' });

  const year = date.toLocaleString('default', { year: 'numeric' });
  return `${month} ${day}, ${year}`;
};
