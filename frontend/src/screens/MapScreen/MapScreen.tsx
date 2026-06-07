import { Box, SxProps } from "@mui/material";
import React, { useMemo } from "react";
import Map from "../../components/Map";
import {
  allLocalElections,
  countryWideElections,
  electionsConfig,
} from "../../config";
import { MapContext, MapContextType } from "../../context/MapContext";
import { ElectionId } from "../../types";
import { useElectionParam } from "../../utils/useElectionParam";
import { Navbar } from "../../components/Navigation";

const rootSx: SxProps = {
  position: "fixed",
  height: "100%",
  width: "100%",
};

const MapScreen: React.FC<Partial<MapContextType>> = ({
  availableElections,
  localElections = false,
}) => {
  const elections = availableElections
    ? availableElections
    : countryWideElections;

  useElectionParam(elections);

  return (
    <MapContext value={{ availableElections: elections, localElections }}>
      <Navbar />
      <Box component="main" sx={rootSx}>
        <Map />
      </Box>
    </MapContext>
  );
};

export default MapScreen;
