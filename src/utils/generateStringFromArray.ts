export const generateStringFromArray = (arr: any) => {
  let res = "";
  res = `(${arr.map((v: { toString: () => any; }) => JSON.stringify(v.toString())).join(', ')})`;
  return res;
};
