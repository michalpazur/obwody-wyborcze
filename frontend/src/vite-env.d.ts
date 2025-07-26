/// <reference types="vite/client" />

interface ViteTypeOptions {}

interface ViteMetaEnv {
  readonly VITE_MAPTILER_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
