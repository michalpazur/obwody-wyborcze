import { useEffect, useState } from "react";
import { VotingHoursConfig } from "../types";
import { useElectionConfig } from "./useElectionConfig";

export type VotingHours = {
  timeToStart: number;
  timeToEnd: number;
  duration: number;
  now: number;
} & VotingHoursConfig;

export const useVotingHours = (): VotingHours | null => {
  const [now, setNow] = useState(new Date());
  const { votingHours } = useElectionConfig();

  useEffect(() => {
    if (!votingHours) {
      return;
    }

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [votingHours]);

  if (!votingHours) {
    return null;
  }

  const start = new Date(votingHours.start).getTime();
  const end = new Date(votingHours.end).getTime();
  const nowTime = now.getTime();

  return {
    timeToStart: start - nowTime,
    timeToEnd: end - nowTime,
    duration: end - start,
    now: nowTime,
    ...votingHours,
  };
};
