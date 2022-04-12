import dayjs, { ConfigType } from 'dayjs';

export const formatDate = (value: ConfigType) => {
  if (!value) {
    return;
  }

  const formattedDate = dayjs(value).format('MMM DD, YYYY');

  return formattedDate;
};
