import { CandidateId, electionsConfig } from "../config";
import { DistrictInfo, Results } from "../types";

export const sortResults = (district: DistrictInfo) => {
  let results: Results[] = [];

  Object.keys(district).forEach((key) => {
    const candidate = key as CandidateId;
    if (electionsConfig.pres_2025_1.candidates.includes(candidate)) {
      results.push({
        candidate,
        result: district[key],
        resultProc: district[`${key}_proc`],
      });
    }
  });

  results = results.sort((a, b) => b.result - a.result);

  return results;
};
