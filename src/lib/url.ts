/** Prefix a root-relative path with the site's base path (e.g. "/pattern-life" on GitHub Pages). */
export function url(path: string): string {
  return import.meta.env.BASE_URL.replace(/\/$/, '') + path;
}
