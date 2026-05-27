import {
  Box,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import { candidatesConfig } from "../../../../config";
import { useElectionsStore } from "../../../../redux/electionsSlice";
import { Results } from "../../../../types";
import { getNameColumnLabel } from "../../../../utils/getLabels";
import Avatar from "./components/Avatar";
import WinnerInfo from "./components/WinnerInfo";

const colorIndicator: SxProps = {
  position: "absolute",
  top: "0px",
  bottom: "0px",
  left: "0px",
  width: "4px",
};

const ResultsTable: React.FC<{ results: Results[]; full?: boolean }> = ({
  results,
  full,
}) => {
  const { elections } = useElectionsStore();

  const nameCellSx = { pl: full ? 9 : 3 };
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
        {truncatedResults.map((result) => {
          const candidate = candidatesConfig[result.candidate];

          return (
            <TableRow key={result.candidate}>
              <TableCell
                align="left"
                sx={{ pl: full ? 2 : 3, position: "relative" }}
              >
                <Box
                  component="span"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Box
                    sx={[
                      colorIndicator,
                      {
                        background: candidate.color,
                      },
                    ]}
                  />
                  {full && <Avatar candidate={candidate} />}
                  <span>{candidate.name}</span>
                </Box>
              </TableCell>
              <TableCell align="right">{result.result}</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                {result.resultProc}%
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
      <TableFooter>
        <TableRow>
          <WinnerInfo results={results} rootSx={nameCellSx} />
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default ResultsTable;
