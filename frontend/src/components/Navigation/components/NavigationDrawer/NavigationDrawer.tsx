import { Divider, Drawer, List, SxProps, Theme } from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";
import {
  countryWideElections,
  electionsConfig,
  localElectionsConfig,
} from "../../../../config";
import { LocalElectionId } from "../../../../types";
import {
  glassStyle,
  mapComponentInset,
  topComponentInset,
} from "../../../styles";
import CollapseNavItem from "./components/CollapseNavItem";

type NavigationDrawerProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const paperSx: SxProps<Theme> = (theme) => ({
  ...glassStyle(theme),
  borderRadius: theme.shape.borderRadius,
  right: mapComponentInset,
  top: topComponentInset,
  height: "unset",
});

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  open,
  setOpen,
}) => {
  const onClose = () => {
    setOpen(false);
  };

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      anchor="right"
      elevation={0}
      slotProps={{
        paper: { sx: paperSx, component: "nav" },
        backdrop: { sx: { backgroundColor: "unset" } },
      }}
    >
      <List sx={{ p: 3 }}>
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
      </List>
    </Drawer>
  );
};

export default NavigationDrawer;
