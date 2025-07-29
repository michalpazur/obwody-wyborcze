export const getLastName = (name: string) => {
  const split = name.split(" ");
  return split[split.length - 1];
};
