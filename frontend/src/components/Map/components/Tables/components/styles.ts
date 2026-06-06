import { SxProps, tableCellClasses, tableRowClasses } from "@mui/material";
import { InfoRowSize } from "../types/props";

export const percentCellSx: SxProps = {
  fontFamily: "'Bree Serif', sans-serif",
  fontWeight: "bold",
};

export const getNameCellSx = (size: InfoRowSize): SxProps => {
  if (size === "small") {
    return {};
  }

  return {
    pl: size === "full" ? 9 : 3,
  };
};

export const footerSx: SxProps = {
  [`& .${tableRowClasses.footer}:not(:last-child) .${tableCellClasses.footer}`]:
    {
      borderBottomStyle: "dashed",
    },
};
