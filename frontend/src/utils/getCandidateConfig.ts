import { candidatesConfig, ElectionId, electionsConfig } from "../config";
import { CandidateId } from "../types";

export const getCandidateConfig = (
  candidate: CandidateId,
  elections: ElectionId,
) => {
  const candidateConfig = candidatesConfig[candidate];
  const electionConfig = electionsConfig[elections];

  const override = electionConfig.candidatesConfig?.[candidate] ?? {};

  return {
    ...candidateConfig,
    ...override,
  };
};
