/// <reference types="vite/client" />

declare module "@mui/material/IconButton" {
  interface IconButtonOwnProps {
    variant?: import("@mui/material/Button").ButtonOwnProps["variant"];
  }
}

interface ViteTypeOptions {
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_TILE_SERVER_URL: string;
  readonly VITE_LIVE_ELECTIONS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
