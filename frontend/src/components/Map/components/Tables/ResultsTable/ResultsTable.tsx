import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import { useElectionsStore } from "../../../../../redux/electionsSlice";
import { DistrictInfo, Results } from "../../../../../types";
import { getNameColumnLabel } from "../../../../../utils/getLabels";
import CandidateCell from "../components/CandidateCell";
import { getNameCellSx, percentCellSx } from "../components/styles";
import WinnerInfo from "../components/WinnerInfo";
import TurnoutInfo from "../components/TurnoutInfo";

type ResultsTableProps = {
  results: Results[];
  full?: boolean;
  district: DistrictInfo;
};

const ResultsTable: React.FC<ResultsTableProps> = ({
  results,
  full,
  district,
}) => {
  const { elections } = useElectionsStore();

  const nameCellSx = getNameCellSx(full ? "full" : "regular");
  const truncatedResults = full ? results : results.slice(0, 3);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell align="left" sx={nameCellSx}>
            {getNameColumnLabel(elections)}
          </TableCell>
          <TableCell align="right">Głosy</TableCell>
          <TableCell align="right">Proc.</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {truncatedResults.map((result) => (
          <TableRow key={result.candidate}>
            <CandidateCell
              candidate={result.candidate}
              size={full ? "full" : "regular"}
            />
            <TableCell align="right">{result.result}</TableCell>
            <TableCell align="right" sx={percentCellSx}>
              {result.resultProc}%
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <WinnerInfo results={results} size={full ? "full" : "regular"} />
        <TurnoutInfo district={district} size={full ? "full" : "regular"} />
      </TableFooter>
    </Table>
  );
};

export default ResultsTable;
