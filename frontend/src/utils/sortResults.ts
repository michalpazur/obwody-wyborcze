import { CandidateId, ElectionId, electionsConfig } from "../config";
import { DistrictInfo, Results } from "../types";

export const sortResults = (district: DistrictInfo, elections: ElectionId) => {
  let results: Results[] = [];

  Object.keys(district).forEach((key) => {
    const candidate = key as CandidateId;
    if (electionsConfig[elections]?.candidates.includes(candidate)) {
      results.push({
        candidate,
        result: district[candidate],
        resultProc: district[`${candidate}_proc`],
      });
    }
  });

  results = results.sort((a, b) => b.result - a.result);

  return results;
};
