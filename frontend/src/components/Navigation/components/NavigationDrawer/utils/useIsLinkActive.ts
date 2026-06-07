import { useLocation } from "react-router";

export const useIsLinkActive = () => {
  const { pathname, search } = useLocation();

  const isLinkActive = (href: string) => {
    if (href === pathname) {
      return true;
    }

    return href === pathname + search;
  };

  return isLinkActive;
};
