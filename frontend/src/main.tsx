import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.scss"

createRoot(document.body).render(
  <StrictMode>
    <App />
  </StrictMode>
);
