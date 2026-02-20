// .d.ts files are "declaration files"
// They tell TypeScript about types that exist outside your code
// interface ImportMetaEnv tells TS exactly what env vars exist in import.meta.env

interface ImportMetaEnv {
  readonly VITE_TMDB_API_KEY: string
  readonly VITE_TMDB_TOKEN: string
  readonly VITE_TMDB_BASE_URL: string
  readonly VITE_TMDB_IMAGE_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}