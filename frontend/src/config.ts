import { colors } from "./colors";
import { krakow } from "./const/bounds";
import { parties, presidentialCandidates } from "./static";
import {
  Candidate,
  CandidateId,
  ElectionConfig,
  ElectionId,
  LocalElectionId,
  LocalElectionsConfig,
} from "./types/config";

export const candidatesConfig: Record<CandidateId, Candidate> = {
  yes: {
    name: "TAK",
    candidateId: "yes",
    ...colors.lightGreen,
  },
  no: {
    name: "NIE",
    candidateId: "no",
    ...colors.red,
  },
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
    turnoutGradientOptions: {
      minGradient: 40,
    },
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
    turnoutGradientOptions: {
      minGradient: 40,
    },
  },
  pres_2025_2: {
    id: "pres_2025_2",
    name: "Prezydent 2025 (II tura)",
    htmlTitle: "Wybory prezydenckie 2025",
    type: "president",
    candidates: ["nawrocki", "trzaskowski"],
    winners: ["nawrocki", "trzaskowski"],
    sourceLayer: "pres_2025_2",
    turnoutGradientOptions: {
      minGradient: 40,
    },
  },
  ref_krk2026_1: {
    id: "ref_krk2026_1",
    name: "Referendum Kraków 2026 (Prezydent)",
    htmlTitle: "Referendum w sprawie odwołania Prezydenta Krakowa",
    tabName: "Pytanie 1",
    type: "referendum",
    question:
      "Czy jest Pan/Pani za odwołaniem Pana Aleksandra Jana Miszalskiego z funkcji Prezydenta Miasta Krakowa przed upływem kadencji?",
    candidates: ["yes", "no"],
    winners: ["yes", "no"],
    sourceLayer: "ref_krk2026_1",
    hideWinners: true,
    gradientOptions: {
      minGradient: 90,
    },
    turnoutGradientOptions: {
      minGradient: 10,
      maxGradient: 50,
      numColors: 8,
    },
    candidatesConfig: {
      yes: { minGradient: 90 },
      no: { maxGradient: 5, hideInLegend: true },
    },
  },
  ref_krk2026_2: {
    id: "ref_krk2026_2",
    name: "Referendum Kraków 2026 (Rada Miasta)",
    htmlTitle: "Referendum w sprawie odwołania Rady Miasta Krakowa",
    tabName: "Pytanie 2",
    type: "referendum",
    question:
      "Czy jest Pan/Pani za odwołaniem Rady Miasta Krakowa przed upływem kadencji?",
    candidates: ["yes", "no"],
    winners: ["yes", "no"],
    sourceLayer: "ref_krk2026_2",
    hideWinners: true,
    gradientOptions: {
      minGradient: 90,
    },
    turnoutGradientOptions: {
      minGradient: 10,
      maxGradient: 50,
      numColors: 8,
    },
    candidatesConfig: {
      yes: { minGradient: 90 },
      no: { maxGradient: 5, hideInLegend: true },
    },
  },
};

export const localElectionsConfig: Record<
  LocalElectionId,
  LocalElectionsConfig
> = {
  ref_krk2026: {
    name: "Referendum w Krakowie",
    elections: ["ref_krk2026_1", "ref_krk2026_2"],
    bounds: krakow,
  },
};

export const allLocalElections = Object.keys(localElectionsConfig).flatMap(
  (k) => {
    const key = k as LocalElectionId;
    return localElectionsConfig[key].elections;
  },
);

export const countryWideElections = Object.keys(electionsConfig).filter(
  (key) => !allLocalElections.includes(key as ElectionId),
) as ElectionId[];

export const tieColorConfig = colors.grey;
export const tieGradient = tieColorConfig.gradient;

export const turnoutColorConfig = colors.teal;
export const turnoutGradient = turnoutColorConfig.gradient;

export const mapOpacity = 1;

export const layerIds = {
  elections: "elections",
  water: "water-layer",
  road: "road",
  building: "building-layer",
  outline: "outline",
  hoverOutline: "hover-outline",
  city: "city",
};

export type { Candidate, CandidateId, ElectionConfig, ElectionId };

export const homePath = "/map";
