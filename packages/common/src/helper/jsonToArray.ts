// used for converting json values to an array to allow map fn to work
export const jsonToArray = (json?: any) => {
  const arr: Array<any> = [];

  Object.keys(json).forEach(key => {
    const { value } = { value: json[key] };
    arr.push(value);
  });

  return arr;
};
