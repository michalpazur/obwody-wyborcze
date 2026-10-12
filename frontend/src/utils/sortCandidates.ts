import { CandidateId, ElectionConfig, Results } from "../types";

export const sortCandidates = (
  electionConfig: ElectionConfig,
  results?: Results[],
): CandidateId[] => {
  if (!results) {
    return electionConfig.candidates;
  }

  return results
    .filter((r) => !r.withdrawn)
    .sort((a, b) => b.result - a.result)
    .map((r) => r.candidate);
};
