const intl = new Intl.NumberFormat("pl-PL");

export const formatNumber = (number: number) => {
  return intl.format(number);
};
