export const toDecimalPrecision = (number: number, precision: number = 1) => {
  const pow = Math.pow(10, precision);
  return Math.round(number * pow) / pow;
};
