import { colors } from "./colors";
import { krakow, warszawa } from "./const/bounds";
import { parties, presidentialCandidates, warsawMayor } from "./static";
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
  rest: {
    name: "Reszta",
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
  bochenski: {
    name: "Tobiasz Bocheński",
    avatarUrl: warsawMayor.bochenski,
    ...colors.blue,
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
  korwin: {
    name: "Janusz Korwin-Mikke",
    avatarUrl: warsawMayor.korwin,
    ...colors.teal,
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
  starosielec: {
    name: "Romuald Starosielec",
    avatarUrl: warsawMayor.starosielec,
    ...colors.brown,
  },
  trzaskowski: {
    name: "Rafał Trzaskowski",
    avatarUrl: presidentialCandidates.trzaskowski,
    ...colors.orange,
  },
  wipler: {
    name: "Przemysław Wipler",
    avatarUrl: warsawMayor.wipler,
    ...colors.indigo,
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
    results: {
      turnout: {
        allVotes: 21966891,
        turnout: 74.38,
        voters: 29532595,
      },
      results: [
        { candidate: "pis", result: 7640854, resultProc: 35.38 },
        { candidate: "ko", result: 6629402, resultProc: 30.7 },
        { candidate: "p2050_psl", result: 3110670, resultProc: 14.4 },
        { candidate: "nl", result: 1859018, resultProc: 8.61 },
        { candidate: "konfederacja", result: 1547364, resultProc: 7.16 },
        { candidate: "bs", result: 401054, resultProc: 1.86 },
        { candidate: "rest", result: 408312, resultProc: 1.9 },
      ],
    },
  },
  mayor_waw2024: {
    id: "mayor_waw2024",
    name: "Prezydent Warszawy 2024",
    htmlTitle: "Wybory prezydenta Warszawy 2024",
    type: "president",
    candidates: [
      "trzaskowski",
      "bochenski",
      "biejat",
      "wipler",
      "korwin",
      "starosielec",
    ],
    winners: ["trzaskowski", "bochenski", "biejat", "wipler"],
    sourceLayer: "mayor_waw2024",
    candidatesConfig: {
      bochenski: { maxGradient: 50 },
      biejat: { maxGradient: 25 },
      korwin: { maxGradient: 2.5 },
      starosielec: { maxGradient: 2 },
      wipler: { maxGradient: 15 },
    },
    turnoutGradientOptions: {
      minGradient: 30,
      maxGradient: 80,
    },
    results: {
      turnout: {
        turnout: 58.88,
        voters: 1322897,
        allVotes: 778887,
      },
      results: [
        { candidate: "trzaskowski", result: 444006, resultProc: 57.41 },
        { candidate: "bochenski", result: 178652, resultProc: 23.1 },
        { candidate: "biejat", result: 99442, resultProc: 12.86 },
        { candidate: "wipler", result: 34389, resultProc: 4.45 },
        { candidate: "korwin", result: 10839, resultProc: 1.4 },
        { candidate: "starosielec", result: 6019, resultProc: 0.78 },
      ],
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
    results: {
      turnout: {
        allVotes: 19689597,
        turnout: 67.31,
        voters: 29252340,
      },
      results: [
        { candidate: "trzaskowski", result: 6147797, resultProc: 31.36 },
        { candidate: "nawrocki", result: 5790804, resultProc: 29.54 },
        { candidate: "mentzen", result: 2902448, resultProc: 14.81 },
        { candidate: "braun", result: 1242917, resultProc: 6.34 },
        { candidate: "holownia", result: 978901, resultProc: 4.99 },
        { candidate: "zandberg", result: 952832, resultProc: 4.86 },
        { candidate: "biejat", result: 829361, resultProc: 4.23 },
        { candidate: "rest", result: 759084, resultProc: 3.87 },
      ],
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
    results: {
      turnout: {
        allVotes: 21033457,
        turnout: 71.63,
        voters: 29363722,
      },
      results: [
        { candidate: "nawrocki", result: 10606877, resultProc: 50.89 },
        { candidate: "trzaskowski", result: 10237286, resultProc: 49.11 },
      ],
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
    results: {
      turnout: {
        allVotes: 176228,
        voters: 587637,
        turnout: 29.99,
        threshold: 158555,
        thresholdProc: 26.98,
      },
      results: [
        { candidate: "yes", result: 171581, resultProc: 97.93 },
        { candidate: "no", result: 3631, resultProc: 2.07 },
      ],
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
    results: {
      turnout: {
        allVotes: 176107,
        voters: 587637,
        turnout: 29.97,
        threshold: 179792,
        thresholdProc: 30.6,
      },
      results: [
        { candidate: "yes", result: 168010, resultProc: 96.16 },
        { candidate: "no", result: 6713, resultProc: 3.84 },
      ],
    },
  },
};

export const localElectionsConfig: Record<
  LocalElectionId,
  LocalElectionsConfig
> = {
  mayor_waw2024: {
    name: "Prezydent Warszawy 2024",
    elections: ["mayor_waw2024"],
    bounds: warszawa,
  },
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
