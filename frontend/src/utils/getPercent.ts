import { toDecimalPrecision } from "./toDecimalPrecision";

export const getPercent = (value: number, _of: number) => {
  if (_of === 0) {
    return 0;
  }

  return toDecimalPrecision((value * 100) / _of, 2);
};
