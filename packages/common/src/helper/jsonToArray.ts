// used for converting json values to an array to allow map fn to work
export const jsonToArray = (json?: any) => {
  const arr: Array<any> = [];

  Object.values(json).forEach(value => {
    arr.push(value);
  });

  return arr;
};
