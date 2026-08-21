import { useLiveElectionResults } from "../services/useLiveElectionResults";
import { ElectionConfig } from "../types";
import { useElectionConfig } from "./useElectionConfig";
import { useIsLive } from "./useIsLive";

export const useElectionResults = (): ElectionConfig["results"] => {
  const electionConfig = useElectionConfig();
  const isLive = useIsLive();
  const { data: results } = useLiveElectionResults();

  if (!isLive) {
    return electionConfig.results;
  }

  if (!results) {
    return;
  }

  const { turnout, results: liveResults } = results.results;
  return {
    // We know the referendum threshold beforehand so it can be imported from config
    turnout: turnout
      ? { ...electionConfig.results?.turnout, ...turnout }
      : electionConfig.results?.turnout,
    results: liveResults,
  };
};
