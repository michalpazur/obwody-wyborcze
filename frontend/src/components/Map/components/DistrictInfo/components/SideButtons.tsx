import CloseIcon from "@mui/icons-material/ArrowForwardRounded";
import { IconButton, Stack, SxProps, Theme } from "@mui/material";
import React from "react";
import { stackSpacing } from "./styles";

const iconSx: SxProps<Theme> = {
  transition: (theme) =>
    theme.transitions.create(["transform"], {
      duration: theme.transitions.duration.enteringScreen,
    }),
};

type SideButtonProps = {
  open: boolean;
  onClose: () => void;
};

const SideButtons: React.FC<SideButtonProps> = ({ open, onClose }) => {
  return (
    <Stack spacing={stackSpacing}>
      <IconButton
        aria-label={open ? "Zamknij szczegóły" : "Pokaż szczegóły"}
        onClick={onClose}
        variant="outlined"
      >
        <CloseIcon
          sx={[iconSx, { transform: `rotate(${open ? "180" : "0"}deg)` }]}
        />
      </IconButton>
    </Stack>
  );
};

export default SideButtons;
