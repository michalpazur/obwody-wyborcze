import React from "react";
import { Navigate, useParams } from "react-router";
import { homePath, localElectionsConfig } from "../../config";
import { LocalElectionId } from "../../types";
import MapScreen from "../MapScreen";
import { useElectionParam } from "../../utils/useElectionParam";

const LocalElectionsScreen: React.FC = () => {
  const { id } = useParams();
  const config = localElectionsConfig[id as LocalElectionId];

  if (!config) {
    return <Navigate replace to={homePath} />;
  }

  useElectionParam(config.elections, config.elections[0]);
  return <MapScreen availableElections={config.elections} />;
};

export default LocalElectionsScreen;
