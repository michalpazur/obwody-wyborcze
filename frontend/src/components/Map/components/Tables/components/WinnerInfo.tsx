import { Box, TableCell, TableRow } from "@mui/material";
import React, { useMemo } from "react";
import { candidatesConfig, tieColorConfig } from "../../../../../config";
import { useElectionsStore } from "../../../../../redux/electionsSlice";
import { Results } from "../../../../../types";
import { mergeSx } from "../../../../../utils/mergeSx";
import { toDecimalPrecision } from "../../../../../utils/toDecimalPrecision";
import { InfoRowSize } from "../types/props";
import CandidateCell from "./CandidateCell";
import { getNameCellSx, percentCellSx } from "./styles";

const WinnerInfo: React.FC<{ results: Results[]; size: InfoRowSize }> = ({
  results,
  size,
}) => {
  const { candidate } = useElectionsStore();

  const { delta, topResult } = useMemo(() => {
    const topResult = results[0];

    if (candidate === "all" || topResult.candidate === candidate) {
      return {
        delta: topResult?.resultProc - results[1]?.resultProc,
        topResult,
      };
    }

    const result = results.find((result) => result.candidate === candidate);
    if (!result) {
      return { delta: Number.NaN, topResult: result };
    }

    return {
      delta: result.resultProc - topResult?.resultProc,
      topResult: result,
    };
  }, [candidate, results]);

  if (Number.isNaN(delta) || !topResult) {
    return null;
  }

  const winner = candidatesConfig[topResult?.candidate];
  const nameCellSx = getNameCellSx(size);
  const isTie = delta === 0;

  return (
    <TableRow>
      {!isTie ? (
        <CandidateCell candidate={topResult.candidate} size={size} />
      ) : (
        <TableCell sx={nameCellSx}>
          <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ height: "24px" }} />
            Remis
          </Box>
        </TableCell>
      )}
      <TableCell
        colSpan={2}
        align="right"
        sx={mergeSx(percentCellSx, {
          fontWeight: "bold",
          color: !winner.color || isTie ? tieColorConfig.color : winner.color,
        })}
      >
        {isTie ? (
          "+0 p."
        ) : (
          <React.Fragment>
            {delta > 0 ? "+" : ""}
            {toDecimalPrecision(delta)} p.
          </React.Fragment>
        )}
      </TableCell>
    </TableRow>
  );
};

export default WinnerInfo;
