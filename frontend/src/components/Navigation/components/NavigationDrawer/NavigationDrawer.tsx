import GitHub from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import {
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  Stack,
  SxProps,
  Theme,
} from "@mui/material";
import React from "react";
import {
  countryWideElections,
  electionsConfig,
  localElectionsConfig,
} from "../../../../config";
import { useLayoutStore } from "../../../../redux/layoutSlice";
import { LocalElectionId } from "../../../../types";
import {
  glassStyle,
  mapComponentInset,
  topComponentInset,
} from "../../../styles";
import CollapseNavItem from "./components/CollapseNavItem";

const paperSx: SxProps<Theme> = (theme) => ({
  ...glassStyle(theme),
  borderRadius: theme.shape.borderRadius,
  right: mapComponentInset,
  top: topComponentInset,
  height: "unset",
  p: 3,
});

const NavigationDrawer: React.FC = () => {
  const { navigationOpen, setNavigationOpen } = useLayoutStore();

  const onClose = () => {
    setNavigationOpen(false);
  };

  return (
    <Drawer
      variant="temporary"
      open={navigationOpen}
      onClose={onClose}
      anchor="right"
      elevation={0}
      slotProps={{
        paper: { sx: paperSx, component: "nav" },
        backdrop: { sx: { backgroundColor: "unset" } },
      }}
    >
      <List sx={{ py: 0 }}>
        <CollapseNavItem label="Wybory ogólnokrajowe">
          {countryWideElections.map((election) => {
            const config = electionsConfig[election];
            return { href: `/map?election=${election}`, label: config.name };
          })}
        </CollapseNavItem>
        <Divider sx={{ my: 2 }} />
        <CollapseNavItem label="Wybory lokalne">
          {Object.keys(localElectionsConfig).map((key) => {
            const config = localElectionsConfig[key as LocalElectionId];
            return { href: `/local/${key}`, label: config.name };
          })}
        </CollapseNavItem>
        <Divider sx={{ my: 2 }} />
      </List>
      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: "center", alignItems: "center" }}
      >
        <IconButton
          aria-label="Twitter"
          component={Link}
          href="https://twitter.com/michalpazur"
          target="_blank"
          sx={{ color: "#1D9BF0" }}
        >
          <TwitterIcon />
        </IconButton>
        <IconButton
          aria-label="GitHub"
          component={Link}
          href="https://github.com/michalpazur/obwody-wyborcze"
          target="_blank"
        >
          <GitHub />
        </IconButton>
      </Stack>
    </Drawer>
  );
};

export default NavigationDrawer;
