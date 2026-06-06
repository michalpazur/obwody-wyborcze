import { Card, Typography } from "@mui/material";
import { LngLat } from "maplibre-gl";
import React, { useMemo } from "react";
import { Popup as MapPopup } from "react-map-gl/maplibre";
import { useElectionsStore } from "../../../../redux/electionsSlice";
import { DistrictInfo } from "../../../../types";
import { sortResults } from "../../../../utils/sortResults";
import { ResultsTable, TurnoutTable } from "../Tables";

type PopupProps = {
  district: DistrictInfo;
  position: LngLat;
};

const Popup: React.FC<PopupProps> = ({ district, position }) => {
  const { elections, showTurnout } = useElectionsStore();

  const popupContent = useMemo(() => {
    const results = sortResults(district, elections);

    return (
      <Card variant="outlined" sx={{ p: 2 }}>
        <Typography sx={{ fontFamily: "'Bree Serif', sans-serif" }}>
          {district.gmina}{" "}
          <Typography
            component="span"
            sx={(theme) => ({
              color: theme.palette.secondary.main,
            })}
          >
            OKW {district.number}
          </Typography>
        </Typography>
        {showTurnout ? (
          <TurnoutTable district={district} results={results} />
        ) : (
          <ResultsTable district={district} results={results} />
        )}
      </Card>
    );
  }, [district, elections]);

  return (
    <MapPopup
      anchor="bottom"
      longitude={position.lng}
      latitude={position.lat}
      closeOnClick={false}
      closeButton={false}
      subpixelPositioning
      maxWidth="100%"
    >
      {popupContent}
    </MapPopup>
  );
};

export default Popup;
