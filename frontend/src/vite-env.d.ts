/// <reference types="vite/client" />

interface ViteTypeOptions {
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_MAPTILER_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
