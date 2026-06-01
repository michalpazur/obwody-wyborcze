import { Box, SxProps } from "@mui/material";
import React, { useMemo } from "react";
import Map from "../../components/Map";
import { allLocalElections, electionsConfig } from "../../config";
import { MapContext, MapContextType } from "../../context/MapContext";
import { ElectionId } from "../../types";
import { useElectionParam } from "../../utils/useElectionParam";

const rootSx: SxProps = {
  position: "fixed",
  height: "100%",
  width: "100%",
};

const MapScreen: React.FC<Partial<MapContextType>> = ({
  availableElections,
  localElections = false,
}) => {
  const elections = useMemo(() => {
    if (!availableElections) {
      return Object.keys(electionsConfig).filter(
        (k) => !allLocalElections.includes(k as ElectionId),
      ) as ElectionId[];
    }

    return availableElections;
  }, [availableElections]);

  useElectionParam(elections);

  return (
    <MapContext value={{ availableElections: elections, localElections }}>
      <Box component="main" sx={rootSx}>
        <Map />
      </Box>
    </MapContext>
  );
};

export default MapScreen;
