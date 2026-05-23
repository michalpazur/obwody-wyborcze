import { electionsConfig } from "../config";
import { useElectionsStore } from "../redux/electionsSlice";

export const useIsParliamentaryElection = () => {
  const { elections } = useElectionsStore();

  return electionsConfig[elections].type === "parliament";
};
