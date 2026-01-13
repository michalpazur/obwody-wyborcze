import chroma from "chroma-js";
import { colors, GRADIENT_COLORS } from "./colors";
import { presidentialCandidates } from "./static";

export type CandidateId =
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
  | "zandberg";

type Candidate = {
  name: string;
  id: CandidateId;
  color?: string;
  gradient?: string[];
  avatarUrl?: string;
  maxGradient?: number;
};

export const candidatesConfig: Record<CandidateId, Candidate> = {
  bartosiewicz: {
    name: "Artur Bartoszewicz",
    id: "bartosiewicz",
    avatarUrl: presidentialCandidates.bartoszewicz,
  },
  biejat: {
    name: "Magdalena Biejat",
    id: "biejat",
    avatarUrl: presidentialCandidates.biejat,
    maxGradient: 15,
    ...colors.brat,
  },
  braun: {
    name: "Grzegorz Braun",
    id: "braun",
    avatarUrl: presidentialCandidates.braun,
    maxGradient: 20,
    ...colors.brown,
  },
  holownia: {
    name: "Szymon Hołownia",
    id: "holownia",
    avatarUrl: presidentialCandidates.holownia,
    maxGradient: 20,
    ...colors.yellow,
  },
  jakubiak: {
    name: "Marek Jakubiak",
    id: "jakubiak",
    avatarUrl: presidentialCandidates.jakubiak,
  },
  maciak: {
    name: "Maciej Maciak",
    id: "maciak",
    avatarUrl: presidentialCandidates.maciak,
  },
  mentzen: {
    name: "Sławomir Mentzen",
    id: "mentzen",
    avatarUrl: presidentialCandidates.mentzen,
    maxGradient: 40,
    ...colors.indigo,
  },
  nawrocki: {
    name: "Karol Nawrocki",
    id: "nawrocki",
    avatarUrl: presidentialCandidates.nawrocki,
    ...colors.blue,
  },
  senyszyn: {
    name: "Joanna Senyszyn",
    id: "senyszyn",
    avatarUrl: presidentialCandidates.senyszyn,
  },
  stanowski: {
    name: "Krzysztof Stanowski",
    id: "stanowski",
    avatarUrl: presidentialCandidates.stanowski,
  },
  trzaskowski: {
    name: "Rafał Trzaskowski",
    id: "trzaskowski",
    avatarUrl: presidentialCandidates.trzaskowski,
    ...colors.orange,
  },
  woch: {
    name: "Marek Woch",
    id: "woch",
    avatarUrl: presidentialCandidates.woch,
  },
  zandberg: {
    name: "Adrian Zandberg",
    id: "zandberg",
    avatarUrl: presidentialCandidates.zandberg,
    maxGradient: 20,
    ...colors.purple,
  },
};

export type ElectionId = "pres_2025_1" | "pres_2025_2";

type ElectionConfig = {
  id: ElectionId;
  name: string;
  candidates: CandidateId[];
  winners: CandidateId[];
  sourceLayer: string;
};

export const electionsConfig: Record<ElectionId, ElectionConfig> = {
  pres_2025_1: {
    id: "pres_2025_1",
    name: "Prezydent 2025 (I tura)",
    candidates: [
      "trzaskowski",
      "nawrocki",
      "mentzen",
      "braun",
      "holownia",
      "zandberg",
      "biejat",
      "stanowski",
      "senyszyn",
      "jakubiak",
      "bartosiewicz",
      "maciak",
      "woch",
    ],
    winners: ["trzaskowski", "nawrocki", "mentzen", "braun", "zandberg"],
    sourceLayer: "pres_2025_1",
  },
  pres_2025_2: {
    id: "pres_2025_2",
    name: "Prezydent 2025 (II tura)",
    candidates: ["nawrocki", "trzaskowski"],
    winners: ["nawrocki", "trzaskowski"],
    sourceLayer: "pres_2025_2",
  },
};

export const tieGradient = chroma
  .scale(["#E0E0E0", "#212121"])
  .colors(GRADIENT_COLORS);

export const mapOpacity = 1;

export const layerIds = {
  elections: "elections",
  water: "water-layer",
  road: "road",
  building: "building-layer",
  outline: "outline",
  city: "city",
};
