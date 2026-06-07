export const getMaxValue = (value: number) => {
  if (value >= 60) {
    return 100;
  }

  const rounded = Math.round(value);
  const remainder = rounded % 10;
  const nextMultipleOf10 = remainder === 0 ? rounded : rounded + 10 - remainder;

  return Math.min(nextMultipleOf10 + 10, 100);
};
