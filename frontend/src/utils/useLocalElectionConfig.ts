import { useParams } from "react-router";
import { localElectionsConfig } from "../config";
import { LocalElectionId } from "../types";

export const useLocalElectionConfig = () => {
  const { localElectionId } = useParams();
  const config = localElectionsConfig[localElectionId as LocalElectionId];

  return config;
};
