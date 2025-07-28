import { GeoJSONFeature } from "maplibre-gl";
import { CandidateId } from "../config";

type VoteCount = Record<CandidateId, number>;
type VoteResult = Record<`${CandidateId}_proc`, number>;

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
