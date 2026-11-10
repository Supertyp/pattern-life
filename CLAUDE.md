# Pattern Life: project notes for Claude

Read this first when picking the project back up. It summarises what has been built, the decisions behind it,
and where we left off. Keep it up to date at the end of each working session.

## What the project is

- A website of **practical patterns for everyday life**: a recurring problem plus a solution that combines
  common sense with established best practice. Examples: using kitchen gadgets, hiking, parking in the city.
- Modelled on **https://rse-cep.org/** (an Astro + Pagefind site of research software engineering patterns):
  the same layout, pattern page structure, grouping into clusters and search.
- Goal: a **pattern language**, meaning patterns that cross-link so people can use them together as a resource to
  improve their lives, not as isolated tips.
- Owner: Wolfgang Barth, GitHub user **Supertyp**. Writing uses Australian/British spelling.

## Where it lives

- Local: `/home/u1018237/pattern_life` (WSL2 on Windows).
- Repo: https://github.com/Supertyp/pattern-life (public, branch `main`, pushed over SSH).
- Live site: **https://supertyp.github.io/pattern-life/**
- Deploys automatically: every push to `main` runs `.github/workflows/deploy.yml` (build, then GitHub Pages).
  It takes about a minute; check the repo's Actions tab if something looks wrong.
- The `gh` CLI is **not installed**. Repos and Pages settings have to be changed on github.com by the user.
  The public GitHub API (curl) works for checking workflow runs.

## Tech stack

- Astro 7.4, content collections with the glob loader. Schema in `src/content.config.ts`.
- Pagefind 1.6 for client-side search. The index is generated after `astro build` (see the `build` script).
- Fonts: `@fontsource-variable/inter` and `inter-tight`. Plain CSS, with tokens in `src/styles/global.css`
  (warm green accent and dark mode).
- `astro.config.mjs`: `site: 'https://supertyp.github.io'`, `base: '/pattern-life'`, `trailingSlash: 'always'`.

## Content model

- **Patterns:** `src/content/patterns/<id>.md`. The file name is the id and the URL `/patterns/<id>/`.
  - Frontmatter: `title`, `type`, `cluster`, `problem` (one sentence), `appliesWhen` (3 lowercase items),
    `authors` (default `[Pattern Life team]`), `editors`, `published`, `draft`, `related` (ids).
  - Types: `technique | process | preparation | safety | etiquette`. "process" was added because the user's
    sample pattern used it.
  - **Fixed body structure**, taken from the user's own sample `dishwasher-loading-unloading.md`, which is the
    gold standard:
    - `## Summary`: starts "This pattern is for … It describes …", then a `| Recommendation | Why? |` table
      with 5 to 9 rows.
    - `## Context`: "This pattern suits …", "It does not suit …", "There's a trade-off …".
    - `## Usage`: 2 to 4 paragraphs, each starting with a **Bold label:**.
    - `## References`: one or two sentences naming authoritative sources, with no URLs and nothing invented.
  - Length is about 400 to 650 words, written in the second person in a plain, friendly tone.
- **Clusters (life areas):** `src/content/clusters/<id>.md` with `title` ("X patterns"), `framing` and `order`,
  plus a short body.
  - Current clusters: kitchen (1), outdoors "Hiking patterns" (2), city "City and traffic patterns" (3), travel (4),
    conferences (5), office (6), shared-spaces (7), fitness (8).
- **Cross-links:** inside a body, link with a relative path, `[Title](../other-id/)`, and/or list ids in `related`.
  - `getRelatedMap()` in `src/lib/patterns.ts` makes the links two-way and shows them as "Related patterns".
  - Unknown ids **fail the build** on purpose.
- **Journeys:** `src/data/journeys.ts` holds real-life situations with an ordered list of pattern ids, shown on
  `/language/`. Unknown ids fail the build.

## Diagrams (PlantUML)

- The user wants diagrams written in **PlantUML**. Sources and rendered SVGs live side by side in
  `src/content/patterns/diagrams/` (for example `elevator-floor-plan.puml` and `.svg`). **Commit both**, so the site build
  and CI don't need Java.
- Embed one in a pattern with a relative image and a descriptive alt text:
  `![Alt text describing the diagram](./diagrams/<name>.svg)`. Astro copies it into `_astro/` with the base path.
- Render with `npm run diagrams` (needs a `plantuml` command). Neither Java nor PlantUML is installed system-wide.
  Last time, a portable JRE (Adoptium API, Java 21) and `plantuml.jar` (GitHub releases, v1.2026.9) were downloaded
  to a scratch folder and run as `java -jar plantuml.jar -tsvg <file>.puml`.
- Style used: `!pragma layout smetana` (no Graphviz needed), white background, rectangles laid out with hidden
  links, and a colour legend (green `#DCEBDF` = good, amber `#F6E7C1` = conditional, red `#F4D3CF` = keep clear).
  Diagrams sit on a white card in dark mode too (CSS rule `.prose img[src$='.svg']`).

## Site structure

- `/`: home page with the "what is a pattern" intro, a CTA to the pattern language, life-area tiles and recently added patterns.
- `/patterns/`: search, intro with the type definitions, and patterns grouped by cluster. RSS at `/patterns/rss.xml`.
- `/patterns/<id>/`: the pattern page (type badge, "Part of <cluster>", problem callout, Applies when, body,
  Related patterns, Credits).
- `/patterns/clusters/` and `/patterns/clusters/<id>/`: the life areas.
- `/language/`: the pattern language page (how to use it, 9 journeys, a full map of connections).
- `/principles/`, `/contribute/` (contains the pattern template), `/about/`: markdown pages using `PageLayout`.
- Nav is defined in `src/layouts/BaseLayout.astro`.

## Conventions and gotchas

- **Every internal link must go through `url()`** from `src/lib/url.ts`, because it adds the `/pattern-life` base.
  Markdown cross-links between patterns use `../id/` relative links instead, so they need no base.
- `npm run preview` in this Astro version **starts a background server** and returns. Stop it with
  `npx astro preview stop`; `pkill` didn't work. A forgotten server once held port 4321 and caused
  ERR_CONNECTION_RESET in the user's Windows browser.
- `dev` and `preview` run with `--host` so the Windows browser can reach WSL. The local URL is
  http://localhost:4321/pattern-life/. If localhost fails, use the WSL IP that the preview prints.
- Search only works on a built site (`npm run build && npm run preview`), not in `npm run dev`.
- Headless Chromium/Playwright can't run in this WSL environment (missing system libraries), so check pages with
  curl and by inspecting the built HTML in `dist/`.
- Commit messages end with a `Co-Authored-By: Claude …` line. The user is happy for changes to be pushed
  (pushing publishes the site).

## History (2026-11-10)

1. Studied rse-cep.org and scaffolded the Astro site with the same structure, plus 3 placeholder patterns.
2. The user supplied a sample pattern (dishwasher). Adopted its format as the standard, added the type "process",
   renamed clusters to "X patterns", and rewrote the placeholders in that format.
3. Fixed ERR_CONNECTION_RESET (the leftover preview server) and added `--host`.
4. Set up the GitHub repo and Pages: base path, `url()` helper, Actions workflow. The site went live.
5. Added 32 patterns (36 in total) across 8 life areas, two-way cross-links, journeys and the `/language/` page.
   The patterns were drafted by parallel subagents from a shared brief. Safety-critical content was spot-checked
   (food temperatures follow Food Standards Australia New Zealand; driving advice is neutral about the side of
   the road; fitness advice is conservative).

6. Added a PlantUML floor plan of where to stand to `elevator-etiquette` (the first diagram on the site).

## Where we left off / possible next steps

- The user hasn't yet reviewed all 32 new patterns in detail. Expect corrections, and edit the markdown directly.
- Ideas not yet done:
  - a visual network diagram of the pattern language
  - more PlantUML diagrams (for example escalator, zip merge, parallel parking reference points, desk ergonomics)
  - filtering patterns by type
  - a "Download .md" button on pattern pages (rse-cep has one)
  - more patterns in thin areas (hiking, shared spaces)
  - new areas (for example home and household, money, health, digital life)
  - a custom domain
- When adding patterns, follow the format above, cross-link to existing ids, add them to a journey in
  `src/data/journeys.ts` where they fit, run `npm run build` to validate, then commit and push.
