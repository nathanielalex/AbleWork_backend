export const isValidArrayValues = (arr, validList) => {
  if (!Array.isArray(arr)) return false;
  return arr.every((val) => validList.includes(val));
};
