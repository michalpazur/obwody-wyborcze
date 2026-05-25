import { colors } from "./colors";
import { parties, presidentialCandidates } from "./static";

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
  color?: string;
  gradient?: string[];
  avatarUrl?: string;
  maxGradient?: number;
};

export const candidatesConfig: Record<CandidateId, Candidate> = {
  bartosiewicz: {
    name: "Artur Bartoszewicz",
    avatarUrl: presidentialCandidates.bartoszewicz,
  },
  biejat: {
    name: "Magdalena Biejat",
    avatarUrl: presidentialCandidates.biejat,
    maxGradient: 15,
    ...colors.brat,
  },
  braun: {
    name: "Grzegorz Braun",
    avatarUrl: presidentialCandidates.braun,
    maxGradient: 20,
    ...colors.brown,
  },
  holownia: {
    name: "Szymon Hołownia",
    avatarUrl: presidentialCandidates.holownia,
    maxGradient: 20,
    ...colors.yellow,
  },
  jakubiak: {
    name: "Marek Jakubiak",
    avatarUrl: presidentialCandidates.jakubiak,
  },
  maciak: {
    name: "Maciej Maciak",
    avatarUrl: presidentialCandidates.maciak,
  },
  mentzen: {
    name: "Sławomir Mentzen",
    avatarUrl: presidentialCandidates.mentzen,
    maxGradient: 40,
    ...colors.indigo,
  },
  nawrocki: {
    name: "Karol Nawrocki",
    avatarUrl: presidentialCandidates.nawrocki,
    ...colors.blue,
  },
  senyszyn: {
    name: "Joanna Senyszyn",
    avatarUrl: presidentialCandidates.senyszyn,
  },
  stanowski: {
    name: "Krzysztof Stanowski",
    avatarUrl: presidentialCandidates.stanowski,
  },
  trzaskowski: {
    name: "Rafał Trzaskowski",
    avatarUrl: presidentialCandidates.trzaskowski,
    ...colors.orange,
  },
  woch: {
    name: "Marek Woch",
    avatarUrl: presidentialCandidates.woch,
  },
  zandberg: {
    name: "Adrian Zandberg",
    avatarUrl: presidentialCandidates.zandberg,
    maxGradient: 20,
    ...colors.purple,
  },
  ap: { name: "Antypartia" },
  bs: {
    name: "Bezpartyjni Samorządowcy",
    short: "BS",
    avatarUrl: parties.bs,
    maxGradient: 5,
    ...colors.red,
  },
  ko: {
    name: "Koalicja Obywatelska",
    short: "KO",
    avatarUrl: parties.ko,
    ...colors.orange,
  },
  konfederacja: {
    name: "Konfederacja",
    avatarUrl: parties.konfederacja,
    maxGradient: 20,
    ...colors.indigo,
  },
  mn: { name: "Mniejszość Niemiecka", short: "MN" },
  nk: { name: "Normalny Kraj" },
  nl: {
    name: "Nowa Lewica",
    avatarUrl: parties.nl,
    maxGradient: 20,
    ...colors.pink,
  },
  pis: {
    name: "Prawo i Sprawiedliwość",
    short: "PiS",
    avatarUrl: parties.pis,
    ...colors.blue,
  },
  pjj: { name: "Polska Jest Jedna", short: "PJJ", avatarUrl: parties.pjj },
  p2050_psl: {
    name: "Trzecia Droga",
    avatarUrl: parties.p2050_psl,
    maxGradient: 25,
    ...colors.lightGreen,
  },
  rdip: { name: "Ruch Dobrobytu i Pokoju", short: "RDiP" },
  rnp: { name: "Ruch Naprawy Polski", short: "RNP" },
};

export type ElectionId = "parl_2023" | "pres_2025_1" | "pres_2025_2";

type ElectionConfig = {
  id: ElectionId;
  name: string;
  htmlTitle: string;
  type: "parliament" | "president";
  candidates: CandidateId[];
  winners: CandidateId[];
  sourceLayer: string;
};

export const electionsConfig: Record<ElectionId, ElectionConfig> = {
  parl_2023: {
    id: "parl_2023",
    name: "Sejm 2023",
    htmlTitle: "Wybory do Sejmu 2023",
    type: "parliament",
    candidates: [
      "pis",
      "ko",
      "p2050_psl",
      "nl",
      "konfederacja",
      "bs",
      "pjj",
      "mn",
      "rdip",
      "nk",
      "ap",
      "rnp",
    ],
    winners: ["pis", "ko", "p2050_psl", "nl", "konfederacja"],
    sourceLayer: "parl_2023",
  },
  pres_2025_1: {
    id: "pres_2025_1",
    name: "Prezydent 2025 (I tura)",
    htmlTitle: "Wybory prezydenckie 2025",
    type: "president",
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
    htmlTitle: "Wybory prezydenckie 2025",
    type: "president",
    candidates: ["nawrocki", "trzaskowski"],
    winners: ["nawrocki", "trzaskowski"],
    sourceLayer: "pres_2025_2",
  },
};

export const tieGradient = colors.grey.gradient;

export const mapOpacity = 1;

export const layerIds = {
  elections: "elections",
  water: "water-layer",
  road: "road",
  building: "building-layer",
  outline: "outline",
  city: "city",
};
