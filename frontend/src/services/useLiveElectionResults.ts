import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useElectionsStore } from "../redux/electionsSlice";
import { LiveResults, LiveResultsResponse } from "../types";
import axios from "../utils/axios";
import { processLiveResults } from "../utils/processLiveResults";
import { useIsLive } from "../utils/useIsLive";

const refreshInterval = 2 * 60 * 1000;

export const useLiveElectionResults = () => {
  const queryClient = useQueryClient();
  const { elections } = useElectionsStore();
  const isLive = useIsLive();
  const queryKey = ["LIVE_ELECTIONS", elections];

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = (
        await axios.get<LiveResultsResponse>("/results/" + elections)
      ).data;

      const old = queryClient.getQueryData(queryKey) as LiveResults;
      // Process data ONLY when number of reported districts changed
      if (response.reported !== old?.reported) {
        return processLiveResults(response);
      }

      // prepare_live_json.py script shouldn't run when the number of districts didn't change
      // so there's no need to update the timestamp
      return old;
    },
    retryDelay: (attempt) => Math.min(2 ** (attempt + 1) * 1000, 30 * 1000),
    enabled: isLive,
    staleTime: refreshInterval,
    refetchInterval: refreshInterval,
  });
};
