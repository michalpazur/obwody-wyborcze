import {
  ListItem,
  ListItemButton,
  ListItemText,
  SxProps,
  Theme,
} from "@mui/material";
import React from "react";
import { Link } from "react-router";
import { useLayoutStore } from "../../../../../redux/layoutSlice";
import { serifFont } from "../../../../../theme";
import { mergeSx } from "../../../../../utils/mergeSx";
import LiveIndicator from "../../../../LiveIndicator";
import { useIsLinkActive } from "../utils/useIsLinkActive";
import { listItemSx, listItemTextSx } from "./styles";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  inset?: boolean;
  live?: boolean;
};

const activeSx: SxProps<Theme> = {
  fontFamily: serifFont,
};

const NavLink: React.FC<NavLinkProps> = ({ href, children, inset, live }) => {
  const { setNavigationOpen } = useLayoutStore();
  const isLinkActive = useIsLinkActive();
  const isActive = isLinkActive(href);

  const onClick = () => {
    setNavigationOpen(false);
  };

  return (
    <ListItem disablePadding>
      <ListItemButton
        component={Link}
        to={href}
        onClick={onClick}
        sx={mergeSx(
          listItemSx,
          inset ? { pl: 6 } : {},
          isActive ? activeSx : {},
        )}
      >
        {live && <LiveIndicator />}
        <ListItemText sx={listItemTextSx} disableTypography>
          {children}
        </ListItemText>
      </ListItemButton>
    </ListItem>
  );
};

export default NavLink;
