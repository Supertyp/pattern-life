# Pattern Life

A static website of practical patterns for everyday life, modelled on [rse-cep.org](https://rse-cep.org/).
Built with [Astro](https://astro.build/) and [Pagefind](https://pagefind.app/) search.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Local dev server at http://localhost:4321/pattern-life/ (search not available) |
| `npm run build` | Build the static site into `dist/` and generate the search index |
| `npm run preview` | Serve the built site in the background, including search (stop with `npx astro preview stop`) |

## Adding content

- **Pattern:** add a markdown file to `src/content/patterns/`. The file name becomes the URL.
  See `/contribute/` on the site for the template. Frontmatter is validated by `src/content.config.ts`.
- **Life area (cluster):** add a markdown file to `src/content/clusters/`. A pattern's `cluster` field
  must match a cluster's file name (e.g. `kitchen`).
- **Cross-links:** link to another pattern inside the text with `[Title](../other-id/)`, or list ids in the
  `related` frontmatter field. Related patterns are shown in both directions, and unknown ids fail the build.
- **Pattern language page** (`src/pages/language.astro`): the journeys (situations with their sequence of patterns)
  are defined in `src/data/journeys.ts`.
- **Pattern types** (`technique`, `process`, `preparation`, `safety`, `etiquette`) are defined in `src/content.config.ts`.

## Deploying

The site is published at https://supertyp.github.io/pattern-life/ by GitHub Actions
(`.github/workflows/deploy.yml`). Every push to `main` rebuilds and redeploys it.

Internal links must go through the `url()` helper in `src/lib/url.ts`, which adds the `/pattern-life` base path.
