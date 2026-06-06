import { Box, SxProps, TableCell } from "@mui/material";
import React from "react";
import { useElectionsStore } from "../../../../../redux/electionsSlice";
import { CandidateId } from "../../../../../types";
import { getCandidateConfig } from "../../../../../utils/getCandidateConfig";
import Avatar from "./Avatar";
import { InfoRowSize } from "../types/props";

const colorIndicator: SxProps = {
  position: "absolute",
  top: "0px",
  bottom: "0px",
  left: "0px",
  width: "4px",
};

const CandidateCell: React.FC<{
  candidate: CandidateId;
  size?: InfoRowSize;
}> = ({ candidate, size }) => {
  const { elections } = useElectionsStore();
  const candidateConfig = getCandidateConfig(candidate, elections);

  return (
    <TableCell
      sx={{
        position: "relative",
        ...(size === "full" ? { pl: 2 } : size === "regular" ? { pl: 3 } : {}),
      }}
    >
      <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
        {size !== "small" && (
          <Box
            sx={[
              colorIndicator,
              {
                background: candidateConfig.color,
              },
            ]}
          />
        )}
        {size === "full" && <Avatar candidate={candidateConfig} />}
        <span>{candidateConfig.name}</span>
      </Box>
    </TableCell>
  );
};

export default CandidateCell;
