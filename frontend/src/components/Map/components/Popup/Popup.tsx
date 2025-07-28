import { Paper, Stack, Typography } from "@mui/material";
import { LngLat } from "maplibre-gl";
import React, { useMemo } from "react";
import { Popup as MapPopup } from "react-map-gl/maplibre";
import { DistrictInfo } from "../../../../types";
import {
  CandidateId,
  candidatesConfig,
  electionsConfig,
} from "../../../../config";

type PopupProps = {
  district: DistrictInfo;
  position: LngLat;
};

type Results = {
  candidate: CandidateId;
  result: number;
  resultProc: number;
};

const Popup: React.FC<PopupProps> = ({ district, position }) => {
  const popupContent = useMemo(() => {
    let results: Results[] = [];

    Object.keys(district).forEach((key) => {
      const candidate = key as CandidateId;
      if (electionsConfig.pres_2025_1.candidates.includes(candidate)) {
        results.push({
          candidate,
          result: district[key],
          resultProc: district[`${key}_proc`],
        });
      }
    });

    results = results.sort((a, b) => b.result - a.result).slice(0, 3);

    return (
      <Paper sx={{ p: 1 }}>
        <Typography sx={{ fontFamily: "'Bree Serif'" }}>
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
        {results.map((result) => (
          <Typography sx={{ fontSize: "14px" }} key={result.candidate}>
            {candidatesConfig[result.candidate].name} {result.resultProc}%
          </Typography>
        ))}
      </Paper>
    );
  }, [district]);

  return (
    <MapPopup
      anchor="bottom"
      longitude={position.lng}
      latitude={position.lat}
      closeOnClick={false}
    >
      {popupContent}
    </MapPopup>
  );
};

export default Popup;
