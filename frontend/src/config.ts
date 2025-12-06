import chroma from "chroma-js";
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

export const GRADIENT_COLORS = 5;

export const candidatesConfig: Record<CandidateId, Candidate> = {
  bartosiewicz: {
    name: "Artur Bartoszewicz",
    id: "bartosiewicz",
    avatarUrl: presidentialCandidates.bartoszewicz,
  },
  biejat: {
    name: "Magdalena Biejat",
    id: "biejat",
    color: "#8ACE00",
    gradient: chroma.scale(["#B4FF1C", "#689B00"]).colors(GRADIENT_COLORS),
    avatarUrl: presidentialCandidates.biejat,
    maxGradient: 15,
  },
  braun: {
    name: "Grzegorz Braun",
    id: "braun",
    color: "#5D4037",
    gradient: chroma.scale(["#A1887F", "#3E2723"]).colors(GRADIENT_COLORS),
    avatarUrl: presidentialCandidates.braun,
    maxGradient: 20,
  },
  holownia: {
    name: "Szymon Hołownia",
    id: "holownia",
    color: "#FBC02D",
    gradient: chroma.scale(["#FFF176", "#F57F17"]).colors(GRADIENT_COLORS),
    avatarUrl: presidentialCandidates.holownia,
    maxGradient: 20,
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
    color: "#303F9F",
    gradient: chroma.scale(["#7986CB", "#1A237E"]).colors(GRADIENT_COLORS),
    avatarUrl: presidentialCandidates.mentzen,
    maxGradient: 40,
  },
  nawrocki: {
    name: "Karol Nawrocki",
    id: "nawrocki",
    color: "#1976D2",
    gradient: chroma.scale(["#64B5F6", "#0D47A1"]).colors(GRADIENT_COLORS),
    avatarUrl: presidentialCandidates.nawrocki,
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
    color: "#E64A19",
    gradient: chroma.scale(["#FF8A65", "#BF360C"]).colors(GRADIENT_COLORS),
    avatarUrl: presidentialCandidates.trzaskowski,
  },
  woch: {
    name: "Marek Woch",
    id: "woch",
    avatarUrl: presidentialCandidates.woch,
  },
  zandberg: {
    name: "Adrian Zandberg",
    id: "zandberg",
    color: "#7B1FA2",
    avatarUrl: presidentialCandidates.zandberg,
    gradient: chroma.scale(["#BA68C8", "#4A148C"]).colors(GRADIENT_COLORS),
    maxGradient: 20,
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
