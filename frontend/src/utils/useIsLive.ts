import { useElectionsStore } from "../redux/electionsSlice";
import { isLiveElection } from "./isLiveElection";

export const useIsLive = () => {
  const { elections } = useElectionsStore();

  return isLiveElection(elections);
};
