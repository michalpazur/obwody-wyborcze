export const getInitials = (name: string) => {
  const split = name.split(/\s/g);

  return split.map((part) => part.substring(0, 1).toLocaleUpperCase()).join("");
};
