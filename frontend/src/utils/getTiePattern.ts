import { ExpressionSpecification } from "maplibre-gl";
import { electionsConfig, mapOpacity } from "../config";
import { CandidateId, ElectionId } from "../types";
import { GradientOptions } from "../types/colors";
import { TIE_PATTERN_JOINER, TIE_PATTERN_PREFIX } from "./createHatchPattern";
import { getCandidateConfig } from "./getCandidateConfig";
import { getGradient } from "./getGradient";
import { getGradientThresholds } from "./getGradientThresholds";

export type TiePattern = {
  id: string;
  patternId: string;
  opacity: ExpressionSpecification;
};

const hasColorConfig = (candidate: CandidateId, election: ElectionId) =>
  !!getCandidateConfig(candidate, election).gradient;

const getTieCandidates = (election: ElectionId) => {
  const { winners, candidates } = electionsConfig[election];
  const others = candidates.filter((candidate) => !winners.includes(candidate));

  return [
    ...winners,
    ...others.filter((candidate) => hasColorConfig(candidate, election)),
    ...others.filter((candidate) => !hasColorConfig(candidate, election)),
  ];
};

const getProc = (key: string, isLive: boolean): ExpressionSpecification => [
  "to-number",
  [isLive ? "feature-state" : "get", key],
];

const isTiedCandidate = (
  candidate: CandidateId,
  isLive: boolean,
): ExpressionSpecification => [
  "all",
  ["==", [isLive ? "feature-state" : "get", "winner"], "tie"],
  [">", getProc("winner_proc", isLive), 0],
  ["==", getProc(`${candidate}_proc`, isLive), getProc("winner_proc", isLive)],
];

export const getTieStripes = (
  election: ElectionId,
  isLive: boolean,
  gradientOptions: Required<GradientOptions>,
) => {
  const candidates = getTieCandidates(election);

  const thresholds = getGradientThresholds(gradientOptions);
  const winnerProc: ExpressionSpecification = [
    "to-number",
    [isLive ? "feature-state" : "get", "winner_proc"],
  ];

  const tieColors = candidates.map((candidate): ExpressionSpecification => {
    const gradient = getGradient(
      getCandidateConfig(candidate, election),
      gradientOptions.numColors,
    );

    const arr = ["step", winnerProc];
    thresholds.forEach((threshold, idx) => {
      // @ts-expect-error
      arr.push(gradient[idx], threshold);
    });
    arr.push(gradient[gradient.length - 1]);

    return [
      "case",
      isTiedCandidate(candidate, isLive),
      ["concat", TIE_PATTERN_JOINER, arr as ExpressionSpecification],
      "",
    ];
  });

  const hasTie: ExpressionSpecification = [
    ">",
    ["length", ["concat", ...tieColors]],
    0,
  ];

  const pattern: ExpressionSpecification = [
    "image",
    ["concat", TIE_PATTERN_PREFIX, ...tieColors],
  ];

  const opacity: ExpressionSpecification = ["case", hasTie, mapOpacity, 0];

  return { pattern, opacity };
};
