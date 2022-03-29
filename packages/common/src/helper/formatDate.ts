import dayjs from 'dayjs';

export const formatDate = (value: string) => {
  if (!value) {
    return;
  }

  const formattedDate = dayjs(value).format('MMM DD, YYYY');

  return formattedDate;
};
