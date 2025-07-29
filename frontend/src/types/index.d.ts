import { GeoJSONFeature } from "maplibre-gl";
import { CandidateId } from "../config";

type VoteCount = Record<CandidateId | "winner", number>;
export type ProcentKey = `${CandidateId | "winner"}_proc`
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
} & VoteCount &
  VoteResult;
