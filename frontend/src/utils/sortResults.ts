import {
  CandidateId,
  candidatesConfig,
  ElectionId,
  electionsConfig,
} from "../config";
import { DistrictInfo, Results } from "../types";

export const sortResults = (district: DistrictInfo, elections: ElectionId) => {
  let results: Results[] = [];
  const candidates = electionsConfig[elections]?.candidates;

  Object.keys(district).forEach((key) => {
    const candidate = key as CandidateId;
    if (district[candidate] !== null && candidates?.includes(candidate)) {
      results.push({
        candidate,
        result: district[candidate],
        resultProc: district[`${candidate}_proc`],
      });
    }
  });

  results = results.sort((a, b) => {
    if (a.result == b.result) {
      const aCandidate = candidatesConfig[a.candidate];
      const bCandidate = candidatesConfig[b.candidate];
      return aCandidate.name.localeCompare(bCandidate.name);
    }

    if (a.result === undefined || b.result === undefined) {
      return a.result === undefined ? -1 : 1;
    }

    return b.result - a.result;
  });

  return results;
};
