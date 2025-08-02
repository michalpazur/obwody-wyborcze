import {
  Avatar,
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
import { Results } from "../../../../types";

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
          <TableCell align="left" sx={{ pl: full ? 9 : 3 }}>
            Kandydat
          </TableCell>
          <TableCell align="right">Głosy</TableCell>
          <TableCell align="right">Proc.</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {results.map((result) => {
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
                  {full && (
                    <Avatar
                      src={candidate.avatarUrl}
                      sx={{ mr: 1, width: "24px", height: "24px" }}
                    />
                  )}
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
      {full ? (
        <TableFooter>
          <TableRow>
            <TableCell sx={{ pl: full ? 9 : 3 }}>Łącznie głosów</TableCell>
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
