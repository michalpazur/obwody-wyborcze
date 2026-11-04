import { electionsConfig } from "../config";
import { CandidateId, ElectionId, Results } from "../types";
import { getCandidateConfig } from "./getCandidateConfig";

export const sortCandidates = (
  elections: ElectionId,
  results?: Results[],
): CandidateId[] => {
  const electionConfig = electionsConfig[elections];

  if (!results) {
    return electionConfig.candidates;
  }

  const candidates = results
    .filter((r) => !r.withdrawn)
    .sort((a, b) => b.result - a.result)
    .map((r) => r.candidate);

  electionConfig.winners.forEach((winner) => {
    const config = getCandidateConfig(winner, elections);
    if (config.showInWinners && !candidates.includes(winner)) {
      candidates.push(winner);
    }
  });

  return candidates;
};
