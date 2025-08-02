import chroma from "chroma-js";
import biejat from "./static/biejat.png";
import braun from "./static/braun.png";
import holownia from "./static/holownia.png";
import mentzen from "./static/mentzen.png";
import nawrocki from "./static/nawrocki.png";
import trzaskowski from "./static/trzaskowski.png";
import zandberg from "./static/zandberg.png";

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
};

export const GRADIENT_COLORS = 5;

export const candidatesConfig: Record<CandidateId, Candidate> = {
  bartosiewicz: { name: "Artur Bartosiewicz", id: "bartosiewicz" },
  biejat: {
    name: "Magdalena Biejat",
    id: "biejat",
    color: "#8ACE00",
    avatarUrl: biejat,
  },
  braun: {
    name: "Grzegorz Braun",
    id: "braun",
    color: "#5D4037",
    avatarUrl: braun,
  },
  holownia: {
    name: "Szymon Hołownia",
    id: "holownia",
    color: "#FBC02D",
    avatarUrl: holownia,
  },
  jakubiak: { name: "Marek Jakubiak", id: "jakubiak" },
  maciak: { name: "Maciej Maciak", id: "maciak" },
  mentzen: {
    name: "Sławomir Mentzen",
    id: "mentzen",
    color: "#303F9F",
    gradient: chroma.scale(["#7986CB", "#1A237E"]).colors(GRADIENT_COLORS),
    avatarUrl: mentzen,
  },
  nawrocki: {
    name: "Karol Nawrocki",
    id: "nawrocki",
    color: "#1976D2",
    gradient: chroma.scale(["#64B5F6", "#0D47A1"]).colors(GRADIENT_COLORS),
    avatarUrl: nawrocki,
  },
  senyszyn: { name: "Joanna Senyszyn", id: "senyszyn" },
  stanowski: { name: "Krzysztof Stanowski", id: "stanowski" },
  trzaskowski: {
    name: "Rafał Trzaskowski",
    id: "trzaskowski",
    color: "#E64A19",
    gradient: chroma.scale(["#FF8A65", "#BF360C"]).colors(GRADIENT_COLORS),
    avatarUrl: trzaskowski,
  },
  woch: { name: "Marek Woch", id: "woch" },
  zandberg: {
    name: "Adrian Zandberg",
    id: "zandberg",
    color: "#7B1FA2",
    avatarUrl: zandberg,
  },
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
