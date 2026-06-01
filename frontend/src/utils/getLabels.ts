import { ElectionId, electionsConfig } from "../config";

export const getNameColumnLabel = (elections: ElectionId) => {
  const electionConfig = electionsConfig[elections];

  switch (electionConfig.type) {
    case "parliament":
      return "Nazwa listy";
    case "referendum":
      return "Odpowiedź";
    default:
      return "Kandydat";
  }
};

export const getAllWinnersLabel = (elections: ElectionId) => {
  const electionConfig = electionsConfig[elections];

  switch (electionConfig.type) {
    case "parliament":
      return "Wszystkie listy";
    case "referendum":
      return "Wszystkie odpowiedzi";
    default:
      return "Wszyscy";
  }
};

export const getElectionLabel = (election: ElectionId) => {
  const electionConfig = electionsConfig[election];

  if (electionConfig.tabName) {
    return electionConfig.tabName;
  }

  return electionConfig.name;
};
