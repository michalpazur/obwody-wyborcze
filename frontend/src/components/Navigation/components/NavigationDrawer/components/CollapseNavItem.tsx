import ArrowIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import {
  Collapse,
  ListItem,
  ListItemButton,
  ListItemText,
  SxProps,
  Theme,
} from "@mui/material";
import React, { useState } from "react";
import { useLocation } from "react-router";
import { mergeSx } from "../../../../../utils/mergeSx";
import NavLink from "./NavLink";
import { listItemSx, listItemTextSx } from "./styles";
import { useIsLinkActive } from "../utils/useIsLinkActive";

type CollapseNavItemProps = {
  label: React.ReactNode;
  children: { href: string; label: string }[];
};

const collapseTextSx: SxProps<Theme> = {
  color: (theme) => theme.palette.text.secondary,
};

const iconSx: SxProps<Theme> = {
  transition: (theme) => theme.transitions.create("transform"),
  width: "20px",
  height: "20px",
};

const CollapseNavItem: React.FC<CollapseNavItemProps> = ({
  label,
  children,
}) => {
  const isLinkActive = useIsLinkActive();
  const [open, setOpen] = useState(
    !!children.find(({ href }) => isLinkActive(href)),
  );

  const onClick = () => {
    setOpen((open) => !open);
  };

  return (
    <React.Fragment>
      <ListItem disablePadding dense>
        <ListItemButton onClick={onClick} sx={listItemSx}>
          <ListItemText
            sx={mergeSx(listItemTextSx, collapseTextSx)}
            disableTypography
          >
            {label}
          </ListItemText>
          <ArrowIcon
            sx={mergeSx(iconSx, { transform: `rotate(${open ? 180 : 0}deg)` })}
          />
        </ListItemButton>
      </ListItem>
      <Collapse in={open} appear={false}>
        {children.map(({ href, label }) => (
          <NavLink key={href} href={href}>
            {label}
          </NavLink>
        ))}
      </Collapse>
    </React.Fragment>
  );
};

export default CollapseNavItem;
