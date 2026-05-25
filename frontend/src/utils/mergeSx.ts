import { SxProps, Theme } from "@mui/material";

export const mergeSx = (...sxProps: (SxProps<Theme> | undefined)[]) => {
  let mergedSx: SxProps<Theme> = [];

  for (let i = 0; i < sxProps.length; i++) {
    const prop = sxProps[i];
    if (!!prop) {
      if (Array.isArray(prop)) {
        mergedSx = mergedSx.concat(...prop);
      } else {
        mergedSx = mergedSx.concat(prop);
      }
    }
  }

  return mergedSx;
};
