/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_GUID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
