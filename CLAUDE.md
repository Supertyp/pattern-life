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
  - Types: `technique | process | preparation | safety | etiquette | recipe`. "process" was added because the user's
    sample pattern used it.
  - **Recipe patterns** (type `recipe`, first one `bolognese`): the user's design. General patterns such as
    `boiling-pasta` are **about the skill, not about a dish**. The recipe pattern links to them and says what's
    specific to the dish, usually one table row per general pattern (e.g. "boil tagliatelle, not spaghetti"). The
    two-way related links make the recipe show up on the general patterns automatically.
    A general pattern **may name a well-known dish as one passing example** and link to it (the user relaxed the
    rule on 2026-11-12). `boiling-pasta` and `simmering-sauces` mention bolognese this way. Never build a general
    pattern's advice around a dish.
  - **Fixed body structure**, taken from the user's own sample `dishwasher-loading-unloading.md`, which is the
    gold standard:
    - `## Summary`: starts "This pattern is for … It describes …", then a `| Recommendation | Why? |` table
      with 3 to 6 rows (the user asked for this on 2026-11-12;
      combine related rows and move how-to detail into Usage).
    - `## Context`: "This pattern suits …", "It does not suit …", "There's a trade-off …".
    - `## Usage`: 2 to 4 paragraphs, each starting with a **Bold label:**.
    - `## References`: a bullet list of 3 to 5 real, linkable sources, formatted
      `- [Title](url), Publisher. One sentence.`. Use blog posts, manufacturers' sites, YouTube videos and official
      guidance, not generic "see your manual" lines. Check every URL before adding it (YouTube through its oEmbed
      endpoint), and never invent one.
  - **AIdea badge:** the user asked for this after their wife spotted an AI-ish recommendation (throw out all old socks
    when you buy a new set). Mark a recommendation that's logical on paper but not something people actually do by
    adding this at the end of its first cell:
    `<a class="aidea" href="../../principles/#tested-in-practice" title="AIdea: logical on paper, but not something people actually do">AIdea</a>`.
    It renders as a small violet pill in the cell's corner (CSS in `global.css`), and `/principles/` explains it.
  - Length is about 400 to 650 words, written in the second person in a plain, friendly tone.
- **Clusters (life areas):** `src/content/clusters/<id>.md` with `title` ("X patterns"), `framing` and `order`,
  plus a short body.
  - Current clusters: kitchen (1), outdoors "Hiking patterns" (2), city "City and traffic patterns" (3), travel (4),
    conferences (5), office (6), shared-spaces (7), fitness (8), embroidery (9), home "Home and household patterns" (10),
    dining "Table and dining patterns" (11), notebooks "Jupyter notebook patterns for HASS" (12),
    trade "Trade agreement patterns" (13).
- **Cross-links:** inside a body, link with a relative path, `[Title](../other-id/)`, and/or list ids in `related`.
  - `getRelatedMap()` in `src/lib/patterns.ts` makes the links two-way and shows them as "Related patterns".
  - Unknown ids **fail the build** on purpose.
- **Journeys:** `src/data/journeys.ts` holds real-life situations with an ordered list of pattern ids, shown on
  `/journeys/`. Unknown ids fail the build.

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

- `/`: home page with "What is a pattern?", "A pattern language" (stats, how to use it, CTA to journeys), life-area
  tiles and recently added patterns.
- `/patterns/`: search, intro with the type definitions, and patterns grouped by cluster. RSS at `/patterns/rss.xml`.
- `/patterns/<id>/`: the pattern page (type badge, "Part of <cluster>", problem callout, Applies when, body,
  Related patterns, Credits).
- `/patterns/clusters/` and `/patterns/clusters/<id>/`: the life areas.
- `/journeys/` (nav "Journeys"): the journey cards plus a full map of connections. It was the "Pattern language"
  page at `/language/` until 2026-11-12. The how-to text moved to the home page, and `/language/` now redirects (see
  `redirects` in `astro.config.mjs`, whose target must include the `/pattern-life` base).
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
- Astro 7 renders Markdown with **Sätteri**, not remark/rehype: `markdown.rehypePlugins` doesn't work. Plugins go in
  `satteri({ hastPlugins })` in `astro.config.mjs`, where one opens external links in a new tab (shown with ↗).
  After changing Markdown plugins, delete `.astro/data-store.json` so the content is rendered again.
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

## Session 2026-11-12: decisions

These are the user's decisions from this session, with the reasons where they gave them. The details are in the
sections above.

**Pattern format**
1. **3 to 6 recommendations per table**, ideally 4 or 5. The user felt tables were too long. Combine related rows and
   move how-to detail into Usage. All existing tables were cut to 4 or 5 rows.
2. **References are real, linkable sources**: blog posts, manufacturers' recommendations, YouTube videos and
   official guidance, not "see your manual". Give 3 to 5 per pattern and check every URL. Checking them corrected some
   facts: kerb distance, Smartraveller has no trip registration, pasta needs natural release, knife angles.
3. **External links open in a new tab**, marked with ↗. Links within the site stay in the same tab (my call; the
   user hasn't objected).
4. **AIdea badge** for recommendations that are logical but not something a human would do. The idea came from the
   user's wife, who spotted "replace the whole sock set at once". The badge is a violet pill in the cell corner,
   linking to `/principles/#tested-in-practice`. So far only the socks row has one. **Open offer:** review all tables
   and suggest more AIdea candidates for the user (and their wife) to decide on.

**Content**
5. **New area: embroidery**, with 15 patterns: 8 bigger-picture and 7 individual stitches. The user left the split to me
   and asked for both fine-grained and big-picture patterns.
6. **New area: home and household**, starting with the user's own `buying-socks` idea. "Variety fraud" is the user's
   term and stays. Its third row was replaced at the user's request: collect single socks in one spot so they can be
   rematched.
7. **Recipe patterns** (new type `recipe`) and a bolognese journey. General patterns are about the skill. The recipe
   pattern applies them to one dish (e.g. "tagliatelle, not spaghetti"). The user later allowed a well-known dish to
   appear as a passing example in a general pattern.
8. **New area: dining** ("Table and dining patterns") for setting the table and eating pasta.

**Site structure**
9. **"Pattern language" tab renamed to "Journeys"** (`/journeys/`, and the old `/language/` redirects there).
   The explanation of the pattern language moved to the home page. The full list of connections stayed on the
   Journeys page (my call; the user was told and can move it).

## Session 2026-11-13: Jupyter notebooks in HASS

- New area `notebooks`, the first technical one: 17 patterns on using Jupyter notebooks in humanities, arts and social
  sciences research. They serve two journeys in `journeys.ts`: "Exploring your own dataset with notebooks" (a HASS
  researcher) and "Harvesting data from APIs with notebooks" (an RSE). Shared patterns such as provenance, pinned
  environments, git, Binder and Zenodo appear in both journeys.
- Drafted by 4 parallel subagents from a brief (kept only in the session scratchpad). Examples are Python-first with R
  notes, and Trove (NLA) is the recurring API example.
- These patterns may contain **one short fenced code block** in Usage. It's rendered by Shiki (github-dark), with
  `.prose pre` styling in `global.css`. They run longer than everyday patterns (about 700 to 790 words).
- glam-workbench.net blocks curl with a bot check, so references cite the GLAM Workbench GitHub repos instead.
- The user hasn't reviewed these yet.

## Session 2026-11-14: trade agreements

- New area `trade` with one journey, "Negotiating an international trade agreement". The user asked for no more than
  7 patterns covering requirements scope through negotiation and signing to execution: mandate, stakeholder
  consultation, walkaway (BATNA), single negotiating text, legal scrub and signing, ratification and entry into force,
  and implementation.
- Neutral on countries and on free trade. Australia's treaty process (National Interest Analysis, JSCOT, Federal
  Executive Council) is the running example, with EU and US comparisons.
- Fact to remember: the Australia–EU FTA negotiations **concluded on 24 March 2026**, after breaking down in 2023
  (confirmed on DFAT's site).
- aph.gov.au returns 403 to curl, so JSCOT is referenced through DFAT pages.
- The user hasn't reviewed these yet.

## Where we left off / possible next steps

- The user hasn't reviewed all patterns in detail yet: the original 32, the 15 embroidery patterns or the 8 bolognese
  ones. Expect corrections, and edit the markdown directly.
- Offered and not yet answered:
  - an AIdea review of all tables (suggest candidates; the user decides);
  - stitch diagrams for the embroidery patterns, starting with French knot, stem and satin stitch (probably
    hand-made SVG, since PlantUML is a poor fit for needle paths);
  - a "Running the household" journey once the home area has more patterns (laundry, pantry, mending);
  - more recipe patterns that reuse the general cooking patterns (e.g. a curry or stir-fry).
- Other ideas not yet done:
  - a visual network diagram of the pattern language
  - more PlantUML diagrams (for example escalator, zip merge, parallel parking reference points, desk ergonomics)
  - filtering patterns by type
  - a "Download .md" button on pattern pages (rse-cep has one)
  - more patterns in thin areas (hiking, shared spaces)
  - new areas (for example money, health, digital life)
  - a custom domain
- When adding patterns, follow the format above, cross-link to existing ids, add them to a journey in
  `src/data/journeys.ts` where they fit, run `npm run build` to validate, then commit and push.
