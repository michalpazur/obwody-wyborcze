export const formatNumber = (number: number) => {
  // TODO: update locale accordingly
  return Intl.NumberFormat("pl-PL").format(number);
}