import {
  ListItem,
  ListItemButton,
  ListItemText,
  SxProps,
  Theme,
} from "@mui/material";
import React from "react";
import { Link } from "react-router";
import { mergeSx } from "../../../../../utils/mergeSx";
import { useIsLinkActive } from "../utils/useIsLinkActive";
import { listItemSx, listItemTextSx } from "./styles";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  inset?: boolean;
};

const activeSx: SxProps<Theme> = {
  fontFamily: "'Bree Serif'",
};

const NavLink: React.FC<NavLinkProps> = ({ href, children, inset }) => {
  const isLinkActive = useIsLinkActive();
  const isActive = isLinkActive(href);

  return (
    <ListItem disablePadding>
      <ListItemButton
        component={Link}
        to={href}
        sx={mergeSx(
          listItemSx,
          inset ? { pl: 6 } : {},
          isActive ? activeSx : {},
        )}
      >
        <ListItemText sx={listItemTextSx} disableTypography>
          {children}
        </ListItemText>
      </ListItemButton>
    </ListItem>
  );
};

export default NavLink;
