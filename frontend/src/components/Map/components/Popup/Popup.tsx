import { Card, Typography } from "@mui/material";
import { LngLat } from "maplibre-gl";
import React, { useMemo } from "react";
import { Popup as MapPopup } from "react-map-gl/maplibre";
import { useElectionsStore } from "../../../../redux/electionsSlice";
import { DistrictInfo } from "../../../../types";
import { sortResults } from "../../../../utils/sortResults";
import ResultsTable from "../ResultsTable";

type PopupProps = {
  district: DistrictInfo;
  position: LngLat;
};

const Popup: React.FC<PopupProps> = ({ district, position }) => {
  const { elections } = useElectionsStore();

  const popupContent = useMemo(() => {
    let results = sortResults(district, elections);
    results = results.slice(0, 3);

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
        <ResultsTable results={results} />
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
