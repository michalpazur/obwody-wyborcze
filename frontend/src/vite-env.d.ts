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
  readonly VITE_TILE_SERVER_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
