import MenuIcon from "@mui/icons-material/MenuRounded";
import {
  AppBar,
  Box,
  IconButton,
  SxProps,
  Theme,
  Toolbar,
} from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router";
import { homePath } from "../../config";
import { glassStyle, mapComponentInset } from "../styles";
import Logo from "./components/Logo";
import NavigationDrawer from "./components/NavigationDrawer";

const appBarSx: SxProps<Theme> = (theme) => ({
  ...glassStyle(theme),
  top: theme.spacing(3),
  left: mapComponentInset,
  right: mapComponentInset,
  width: "unset",
  borderRadius: theme.shape.borderRadius,
});

const navbarSx: SxProps<Theme> = {
  width: "100%",
  minHeight: { xs: "48px" },
  justifyContent: "space-between",
  alignItems: "center",
};

const Navbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenDrawer = () => {
    setDrawerOpen((open) => !open);
  };

  return (
    <AppBar sx={appBarSx}>
      <Toolbar sx={navbarSx}>
        <Box sx={{ width: "34px" }} />
        <Link to={homePath} title="Strona główna" aria-label="Strona główna">
          <Logo />
        </Link>
        <IconButton
          size="small"
          aria-label="Otwórz menu"
          onClick={handleOpenDrawer}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <NavigationDrawer open={drawerOpen} setOpen={setDrawerOpen} />
    </AppBar>
  );
};

export default Navbar;
