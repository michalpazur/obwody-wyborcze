import CloseIcon from "@mui/icons-material/ArrowForwardRounded";
import GitHub from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import { IconButton, Link, Stack, SxProps, Theme } from "@mui/material";
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
      <IconButton
        aria-label="Twitter"
        variant="outlined"
        component={Link}
        href="https://twitter.com/michalpazur"
        target="_blank"
        sx={{ color: "#1D9BF0" }}
      >
        <TwitterIcon />
      </IconButton>
      <IconButton
        aria-label="GitHub"
        variant="outlined"
        component={Link}
        href="https://github.com/michalpazur/obwody-wyborcze"
        target="_blank"
      >
        <GitHub />
      </IconButton>
    </Stack>
  );
};

export default SideButtons;
