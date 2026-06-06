import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from "@mui/material";
import React, { useMemo } from "react";
import { DistrictInfo, Results } from "../../../../../types";
import TurnoutInfo from "../components/TurnoutInfo";
import WinnerInfo from "../components/WinnerInfo";

type TurnoutInfoRow = {
  label: string;
  value: number;
};

const TurnoutTable: React.FC<{
  district: DistrictInfo;
  results?: Results[];
}> = ({ district, results }) => {
  const rows = useMemo(() => {
    const rows: TurnoutInfoRow[] = [
      { label: "Łącznie głosów", value: district.total },
      { label: "Kart ważnych", value: district.all_votes },
      { label: "Łącznie wyborców", value: district.voters },
    ];

    return rows;
  }, [district]);

  return (
    <Table>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.label}>
            <TableCell>{row.label}</TableCell>
            <TableCell align="right">{row.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TurnoutInfo district={district} size="small" />
        {results && <WinnerInfo results={results} size="small" />}
      </TableFooter>
    </Table>
  );
};

export default TurnoutTable;
