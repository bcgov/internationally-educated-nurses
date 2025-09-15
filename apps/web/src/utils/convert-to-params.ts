export const convertToParams = (obj?: object): string => {
  if (!obj) return '';

  const params = new URLSearchParams();
  Object.entries(obj).forEach(([key, value]) => {
    if (value) {
      params.append(key, value);
    }
  });

  return params.toString();
};
