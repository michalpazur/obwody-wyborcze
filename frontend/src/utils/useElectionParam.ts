import { useEffect } from "react";
import { useElectionsStore } from "../redux/electionsSlice";
import { ElectionId } from "../types";

export const useElectionParam = (
  availableElections: ElectionId[],
  defaultParam: ElectionId = "pres_2025_1",
) => {
  const { setElections } = useElectionsStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const param = params.get("election") as ElectionId;

    if (param && availableElections.includes(param)) {
      setElections(param as ElectionId);
    } else {
      setElections(defaultParam);
      history.replaceState(null, "", `?election=${defaultParam}`);
    }
  }, []);
};
