import { ElectionId, LocalElectionId } from "../types";

export const isLiveElection = (electionId: ElectionId | LocalElectionId) => {
  return electionId === import.meta.env.VITE_LIVE_ELECTIONS;
};
