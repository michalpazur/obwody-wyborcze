import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useElectionsStore } from "../redux/electionsSlice";
import { ElectionId } from "../types";

export const useElectionParam = (
  availableElections: ElectionId[],
  defaultParam: ElectionId = "pres_2025_1",
) => {
  const { elections, setElections } = useElectionsStore();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSearchParams({ election: elections }, { replace: true });
  }, [elections]);

  useEffect(() => {
    const param = searchParams.get("election") as ElectionId;

    if (param && availableElections.includes(param)) {
      setElections(param as ElectionId);
    } else {
      setElections(defaultParam);
      setSearchParams({ election: defaultParam }, { replace: true });
    }
  }, [searchParams]);
};
