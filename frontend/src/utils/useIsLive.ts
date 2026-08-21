import { useElectionsStore } from "../redux/electionsSlice";

export const useIsLive = () => {
  const { elections } = useElectionsStore();

  return elections === import.meta.env.VITE_LIVE_ELECTIONS;
};
