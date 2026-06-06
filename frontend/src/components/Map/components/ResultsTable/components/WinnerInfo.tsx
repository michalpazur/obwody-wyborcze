import { SxProps, TableCell, Theme } from "@mui/material";
import React, { useMemo } from "react";
import { candidatesConfig, tieColorConfig } from "../../../../../config";
import { useElectionsStore } from "../../../../../redux/electionsSlice";
import { Results } from "../../../../../types";
import { getWinnerName } from "../../../../../utils/getLabels";
import { mergeSx } from "../../../../../utils/mergeSx";
import { toDecimalPrecision } from "../../../../../utils/toDecimalPrecision";

const WinnerInfo: React.FC<{ results: Results[]; rootSx: SxProps<Theme> }> = ({
  results,
  rootSx,
}) => {
  const { candidate, elections } = useElectionsStore();

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
  const isTie = delta === 0;

  return (
    <React.Fragment>
      <TableCell
        colSpan={3}
        align="right"
        sx={mergeSx(rootSx, {
          fontWeight: "bold",
          fontSize: "14px",
          color: !winner.color || isTie ? tieColorConfig.color : winner.color,
        })}
      >
        {delta === 0 ? (
          "Remis +0"
        ) : (
          <React.Fragment>
            {getWinnerName(topResult.candidate, elections)}
            {" "}
            {delta > 0 ? "+" : ""}
            {toDecimalPrecision(delta)}
          </React.Fragment>
        )}
      </TableCell>
    </React.Fragment>
  );
};

export default WinnerInfo;
