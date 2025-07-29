import chroma from "chroma-js";

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
};

export const GRADIENT_COLORS = 5;

export const candidatesConfig: Record<CandidateId, Candidate> = {
  bartosiewicz: { name: "Artur Bartosiewicz", id: "bartosiewicz" },
  biejat: { name: "Magdalena Biejat", id: "biejat" },
  braun: { name: "Grzegorz Braun", id: "braun" },
  holownia: { name: "Szymon Hołownia", id: "holownia" },
  jakubiak: { name: "Marek Jakubiak", id: "jakubiak" },
  maciak: { name: "Maciej Maciak", id: "maciak" },
  mentzen: {
    name: "Sławomir Mentzen",
    id: "mentzen",
    color: "#1A237E",
    gradient: chroma.scale(["#7986CB", "#1A237E"]).colors(GRADIENT_COLORS),
  },
  nawrocki: {
    name: "Karol Nawrocki",
    id: "nawrocki",
    color: "#0D47A1",
    gradient: chroma.scale(["#64B5F6", "#0D47A1"]).colors(GRADIENT_COLORS),
  },
  senyszyn: { name: "Joanna Senyszyn", id: "senyszyn" },
  stanowski: { name: "Krzysztof Stanowski", id: "stanowski" },
  trzaskowski: {
    name: "Rafał Trzaskowski",
    id: "trzaskowski",
    color: "#BF360C",
    gradient: chroma.scale(["#FF8A65", "#BF360C"]).colors(GRADIENT_COLORS),
  },
  woch: { name: "Marek Woch", id: "woch" },
  zandberg: { name: "Adrian Zandberg", id: "zandberg" },
};

type ElectionId = "pres_2025_1";

type ElectionConfig = {
  id: ElectionId;
  name: string;
  candidates: CandidateId[];
  winners: CandidateId[];
  tilesetId: string;
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
    winners: ["trzaskowski", "nawrocki", "mentzen"],
    tilesetId: "01984855-b44c-75a1-8463-876f2a7f32b3",
  },
};

export const tieGradient = chroma
  .scale(["#EEEEEE", "#212121"])
  .colors(GRADIENT_COLORS);
