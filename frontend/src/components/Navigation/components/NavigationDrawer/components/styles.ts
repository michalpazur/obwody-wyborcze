import { SxProps, Theme } from "@mui/material";

export const listItemSx: SxProps<Theme> = {
  px: 3,
  py: 1,
  borderRadius: theme => theme.shape.borderRadius
};

export const listItemTextSx: SxProps<Theme> = {
  my: 0,
  lineHeight: "1.25",
  textAlign: "center",
};
