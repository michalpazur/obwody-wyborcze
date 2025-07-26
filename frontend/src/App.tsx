import {
  Box,
  CssBaseline,
  SxProps,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import Map from "./components/Map";
import { theme } from "./theme";

const rootSx: SxProps = {
  position: "fixed",
  height: "100%",
  width: "100%",
};

const App = () => {
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
