import { GeoJSONFeature } from "maplibre-gl";
import { CandidateId, ElectionType } from "./config";

type VoteCount = Record<CandidateId, number>;
export type ProcentKey = `${CandidateId | "winner"}_proc` | "turnout";
type VoteResult = Record<ProcentKey, number>;

export type DistrictInfo = {
  id: GeoJSONFeature["id"]; // feature id
  number: number;
  district: string;
  teryt: string;
  gmina: string;
  voters: number;
  all_votes: number;
  total: number;
  turnout: number;
  winner: CandidateId;
} & VoteCount &
  VoteResult;

export type Results = {
  candidate: CandidateId;
  result: number;
  resultProc: number;
};

export type TurnoutResults<T extends ElectionType = any> = {
  allVotes: number;
  turnout: number;
  voters: number;
} & (T extends "referendum"
  ? { threshold: number; thresholdProc: number }
  : { threshold?: never; thresholdProc?: never });

export type ElectionResultsInfo<T extends ElectionType = any> = {
  turnout?: TurnoutResults<T>;
  results?: Results[];
};
