// Resolves a path inside /public against the app's base URL so references work
// at the dev root and when hosted from a sub-path. Binding these via :src keeps
// Vite from trying to bundle them (public assets are served as-is).
export function publicAsset(path) {
  const base = import.meta.env.BASE_URL || '/'
  return base.replace(/\/?$/, '/') + path.replace(/^\//, '')
}
