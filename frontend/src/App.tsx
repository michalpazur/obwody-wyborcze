import {
  Box,
  CssBaseline,
  SxProps,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useEffect } from "react";
import Map from "./components/Map";
import { electionsConfig } from "./config";
import { useElectionsStore } from "./redux/electionsSlice";
import { theme } from "./theme";

const rootSx: SxProps = {
  position: "fixed",
  height: "100%",
  width: "100%",
};

const App = () => {
  const { elections } = useElectionsStore();

  useEffect(() => {
    document.title = electionsConfig[elections].htmlTitle;
  }, [elections]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Typography sx={visuallyHidden} component="h1">
        Mapa wyników wyborów prezydenckich 2025
      </Typography>
      <Box component="main" sx={rootSx}>
        <Map />
      </Box>
    </ThemeProvider>
  );
};

export default App;
