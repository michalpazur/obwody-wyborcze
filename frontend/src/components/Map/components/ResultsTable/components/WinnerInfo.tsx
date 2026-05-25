import { SxProps, TableCell, Theme } from "@mui/material";
import React, { useMemo } from "react";
import { colors } from "../../../../../colors";
import { candidatesConfig } from "../../../../../config";
import { useElectionsStore } from "../../../../../redux/electionsSlice";
import { Results } from "../../../../../types";
import { getLastName } from "../../../../../utils/getLastName";
import { mergeSx } from "../../../../../utils/mergeSx";
import { toDecimalPrecision } from "../../../../../utils/toDecimalPrecision";
import { useIsParliamentaryElection } from "../../../../../utils/useIsParliamentaryElection";

const WinnerInfo: React.FC<{ results: Results[]; rootSx: SxProps<Theme> }> = ({
  results,
  rootSx,
}) => {
  const { candidate } = useElectionsStore();
  const isParliamentaryElection = useIsParliamentaryElection();

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
          color: !winner.color || isTie ? colors.grey.color : winner.color,
        })}
      >
        {delta === 0 ? (
          "Remis +0"
        ) : (
          <React.Fragment>
            {isParliamentaryElection ? winner.name : getLastName(winner.name)}
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
