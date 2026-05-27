import { ColorConfig } from "../utils/createColorConfig";
import { GradientOptions } from "../utils/generateFillColors";

export type CandidateId =
  | "yes"
  | "no"
  | "bartosiewicz"
  | "biejat"
  | "braun"
  | "holownia"
  | "jakubiak"
  | "maciak"
  | "mentzen"
  | "nawrocki"
  | "senyszyn"
  | "stanowski"
  | "trzaskowski"
  | "woch"
  | "zandberg"
  | "ap"
  | "bs"
  | "ko"
  | "konfederacja"
  | "mn"
  | "nk"
  | "nl"
  | "pis"
  | "pjj"
  | "p2050_psl"
  | "rdip"
  | "rnp";

export type Candidate = {
  name: string;
  short?: string;
  avatarUrl?: string;
  candidateId?: CandidateId;
} & Partial<ColorConfig> &
  GradientOptions;

export type ElectionCandidateConfig = {
  hideInLegend?: boolean;
} & Pick<Candidate, keyof GradientOptions>;

export type ElectionCandidatesConfig = Partial<
  Record<CandidateId, ElectionCandidateConfig>
>;
