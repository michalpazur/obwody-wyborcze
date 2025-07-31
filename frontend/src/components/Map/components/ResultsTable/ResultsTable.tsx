import {
  Box,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  Theme,
} from "@mui/material";
import React from "react";
import { candidatesConfig } from "../../../../config";
import { Results } from "../../../../types";

const firstCell: SxProps<Theme> = {
  paddingLeft: (theme) => theme.spacing(3),
  position: "relative",
};

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
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell align="left" sx={firstCell}>
            Kandydat
          </TableCell>
          <TableCell align="right">Głosy</TableCell>
          <TableCell align="right">Proc.</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {results.map((result) => (
          <TableRow key={result.candidate}>
            <TableCell align="left" sx={firstCell}>
              <Box
                sx={[
                  colorIndicator,
                  {
                    background: candidatesConfig[result.candidate].color,
                  },
                ]}
              />
              {candidatesConfig[result.candidate].name}
            </TableCell>
            <TableCell align="right">{result.result}</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              {result.resultProc}%
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {full ? (
        <TableFooter>
          <TableRow>
            <TableCell sx={firstCell}>Łącznie głosów</TableCell>
            <TableCell align="right">
              {results.reduce((sum, result) => sum + result.result, 0)}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      ) : null}
    </Table>
  );
};

export default ResultsTable;
