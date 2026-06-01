import { CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { electionsConfig } from "./config";
import { useElectionsStore } from "./redux/electionsSlice";
import LocalElectionsScreen from "./screens/LocalElectionsScreen";
import MapScreen from "./screens/MapScreen";
import { theme } from "./theme";

const App = () => {
  const { elections } = useElectionsStore();

  useEffect(() => {
    document.title = electionsConfig[elections].htmlTitle;
  }, [elections]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route index element={<Navigate replace to="/map" />} />
          <Route path="/map" element={<MapScreen />} />
          <Route
            path="/local/:localElectionId"
            element={<LocalElectionsScreen />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
