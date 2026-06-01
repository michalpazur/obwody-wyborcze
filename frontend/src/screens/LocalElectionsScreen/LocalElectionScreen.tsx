import React, { useEffect } from "react";
import { Navigate, useParams } from "react-router";
import { homePath, localElectionsConfig } from "../../config";
import { useElectionsStore } from "../../redux/electionsSlice";
import { LocalElectionId } from "../../types";
import { useElectionParam } from "../../utils/useElectionParam";
import MapScreen from "../MapScreen";

const LocalElectionsScreen: React.FC = () => {
  const { localElectionId } = useParams();
  const { setElections } = useElectionsStore();
  const config = localElectionsConfig[localElectionId as LocalElectionId];

  useEffect(() => {
    setElections(config?.elections[0]);
  }, [config]);

  if (!config) {
    return <Navigate replace to={homePath} />;
  }

  useElectionParam(config.elections, config.elections[0]);
  return <MapScreen availableElections={config.elections} localElections />;
};

export default LocalElectionsScreen;
