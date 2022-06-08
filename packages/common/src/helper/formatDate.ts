import dayjs, { ConfigType } from 'dayjs';

export const formatDate = (value: ConfigType) => {
  if (!value) {
    return;
  }

  return dayjs(value).format('MMM DD, YYYY');
};
