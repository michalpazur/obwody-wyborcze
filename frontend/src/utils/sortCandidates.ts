import { CandidateId, ElectionConfig, Results } from "../types";

export const sortCandidates = (
  electionConfig: ElectionConfig,
  results?: Results[],
): CandidateId[] => {
  if (!results) {
    return electionConfig.candidates;
  }

  return results.map((r) => r.candidate);
};
