import { restThreshold } from "../config";
import {
  CandidateId,
  DistrictInfo,
  ElectionResultsInfo,
  LiveDistrictInfo,
  LiveResults,
  LiveResultsResponse,
  Results,
  ResultsByCandidate,
  TurnoutResults,
} from "../types";
import { getPercent } from "./getPercent";

const getWinner = (results: ResultsByCandidate, candidates: CandidateId[]) => {
  let winner: CandidateId | "tie" = "tie";
  let max = 0;

  candidates.forEach((candidate) => {
    const votes = results[candidate] ?? 0;
    if (votes > max) {
      max = votes;
      winner = candidate;
    } else if (votes === max) {
      winner = "tie";
    }
  });

  return { winner, max };
};

const getResults = (
  results: ResultsByCandidate & Record<"voters" | "allVotes" | "total", number>,
  candidates: CandidateId[],
): ElectionResultsInfo => {
  const voters = results.voters ?? 0;
  const allVotes = results.allVotes ?? 0;

  const turnout: TurnoutResults = {
    voters,
    allVotes,
    turnout: getPercent(allVotes, voters),
  };

  const allResults: Results[] = candidates
    .map((candidate) => ({
      candidate,
      result: results[candidate] ?? 0,
      resultProc: getPercent(results[candidate], results.total),
    }))
    .sort((a, b) => b.result - a.result);

  const candidatesResults = allResults.filter(
    ({ resultProc }) => resultProc >= restThreshold,
  );

  // If only one candidate is left there's no point in treating them as "rest"
  if (candidatesResults.length === candidates.length - 1) {
    return { turnout, results: allResults }; 
  }

  const restVotes = allResults
    .filter(({ resultProc }) => resultProc < restThreshold)
    .reduce((sum, { result }) => (sum += result), 0);

  if (restVotes > 0) {
    candidatesResults.push({
      candidate: "rest",
      result: restVotes,
      resultProc: getPercent(restVotes, results.total),
    });
  }

  return { turnout, results: candidatesResults };
};

export const processLiveResults = (
  response: LiveResultsResponse,
): LiveResults => {
  const {
    results: candidateResults,
    byDistrict: districtResults,
    candidates,
    districts,
    counted: countedDistricts,
    reported,
    totalDistricts,
    timestamp,
    ...turnout
  } = response;
  const byDistrict = new Map<DistrictInfo["district"], LiveDistrictInfo>();

  districts.forEach((district, index) => {
    const voters = districtResults.voters[index];
    const allVotes = districtResults.allVotes[index];
    const total = districtResults.total[index];
    const counted = countedDistricts[index] === 1;

    const byCandidate: ResultsByCandidate = {} as ResultsByCandidate;
    candidates.forEach((candidate) => {
      byCandidate[candidate] = districtResults[candidate]?.[index];
    });

    const { winner, max } = getWinner(byCandidate, candidates);

    const districtInfo: LiveDistrictInfo = {
      district,
      counted,
      voters,
      all_votes: allVotes,
      total,
      turnout: getPercent(allVotes, voters),
      winner,
      winner_proc: getPercent(max, total),
    } as unknown as LiveDistrictInfo;

    candidates.forEach((candidate) => {
      const result = byCandidate[candidate];
      if (result >= 0) {
        districtInfo[candidate] = result;
        districtInfo[`${candidate}_proc`] = getPercent(result, total);
      }
    });

    byDistrict.set(district, districtInfo);
  });

  const results = getResults({ ...candidateResults, ...turnout }, candidates);

  return {
    candidates,
    byDistrict,
    results,
    reported,
    totalDistricts,
    timestamp,
  };
};
