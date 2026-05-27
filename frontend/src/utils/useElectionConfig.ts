import { electionsConfig } from "../config";
import { useElectionsStore } from "../redux/electionsSlice"

export const useElectionConfig = () => {
  const { elections } = useElectionsStore();
  const electionConfig = electionsConfig[elections];

  return electionConfig;
}