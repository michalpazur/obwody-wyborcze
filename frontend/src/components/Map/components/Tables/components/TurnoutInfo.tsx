import { Box, TableCell, TableRow } from "@mui/material";
import { turnoutColorConfig } from "../../../../../config";
import { DistrictInfo } from "../../../../../types";
import { mergeSx } from "../../../../../utils/mergeSx";
import { InfoRowSize } from "../types/props";
import { getNameCellSx, percentCellSx } from "./styles";

type TurnoutInfoProps = {
  district: DistrictInfo;
  size: InfoRowSize;
};

const TurnoutInfo: React.FC<TurnoutInfoProps> = ({ district, size }) => {
  const rootSx = getNameCellSx(size);

  return (
    <TableRow>
      <TableCell sx={rootSx}>
        <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
          {size === "full" && <Box sx={{ height: "24px" }} />}
          Frekwencja
        </Box>
      </TableCell>
      <TableCell
        align="right"
        colSpan={2}
        sx={mergeSx(percentCellSx, {
          color: turnoutColorConfig.color,
        })}
      >
        {district.turnout}%
      </TableCell>
    </TableRow>
  );
};

export default TurnoutInfo;
