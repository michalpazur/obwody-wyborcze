import { LngLatBoundsLike, LngLatLike } from "maplibre-gl";
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

export type ElectionId =
  | "parl_2023"
  | "pres_2025_1"
  | "pres_2025_2"
  | "ref_krk2026_1"
  | "ref_krk2026_2";

export type LocalElectionId = "ref_krk2026";

type ElectionConfig = {
  id: ElectionId;
  name: string;
  htmlTitle: string;
  tabName?: string;
  candidates: CandidateId[];
  winners: CandidateId[];
  sourceLayer: string;
  candidatesConfig?: Partial<Record<CandidateId, ElectionCandidateConfig>>;
  hideWinners?: boolean;
  gradientOptions?: GradientOptions;
  turnoutGradientOptions?: GradientOptions;
} &
  (
    | { type: "parliament" | "president"; question?: never }
    | { type: "referendum"; question: string }
  );

export type ElectionCandidateConfig = {
  hideInLegend?: boolean;
} & Pick<Candidate, keyof GradientOptions>;

export type ElectionCandidatesConfig = Partial<
  Record<CandidateId, ElectionCandidateConfig>
>;

export type BoundsAndCenter = { bounds: LngLatBoundsLike; center: LngLatLike };

export type LocalElectionsConfig = {
  name: string;
  elections: ElectionId[];
  bounds: BoundsAndCenter;
};
