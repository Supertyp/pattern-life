---
title: Making API harvests resumable
type: technique
cluster: notebooks
problem: A long harvest that keeps everything in memory loses hours of work when the network drops, the laptop sleeps or the kernel crashes, and has to start again from the first page.
appliesWhen:
  - a harvest takes more than a few minutes or thousands of requests
  - the connection, the api or the machine may fail part-way through
  - you want to reprocess the data later without harvesting it again
authors: [Pattern Life team]
published: 2026-11-13
related: [polite-api-harvesting, raw-data-read-only, data-provenance-notes, sample-before-full-run, functions-out-of-notebooks]
---

## Summary

This pattern is for anyone running a long harvest from a web API, such as a historian collecting every Trove newspaper article that mentions a shipwreck, or an RSE pulling a whole collection from Europeana. It describes how to save results as you go and keep a bookmark, so that a failed harvest carries on where it stopped and the raw data stays available for later.

| Recommendation | Why? |
| --- | --- |
| Save each raw response to disk as soon as it arrives. | A crash loses at most one page, and you keep the untouched original to reprocess as often as you like. |
| Page with the cursor the API gives you, and ask for a stable sort order. | Cursors stay reliable deep into a result set, and a fixed order means records don't shift between pages while you harvest. |
| Write a small checkpoint file after every page and read it when the harvest starts. | Rerunning the same notebook resumes from the bookmark instead of starting again, so a failure costs minutes, not hours. |
| Keep harvesting and processing in separate notebooks or steps. | You can change how you clean or analyse the data without touching the API again. |
| Log the query, the dates and the counts, and compare the total with what the API reported. | You can see whether the harvest is complete and tell readers exactly what you collected. |

## Context

This pattern suits harvests with many pages, from APIs such as Trove, Europeana, DigitalNZ or the Internet Archive, and any run that takes long enough for something to go wrong.

It does not suit a single request or a quick lookup of a few dozen records. Saving a single JSON file is enough there. It also doesn't suit APIs that offer a bulk download, which is simpler still (see [Harvesting from APIs politely](../polite-api-harvesting/)).

There's a trade-off between tidiness and safety. Saving every raw page fills a folder with thousands of small files and uses more disk space than keeping only the fields you need. This pattern accepts that, because raw responses are cheap to store and expensive to fetch again. If file count is a problem, append one JSON object per line to a JSON Lines file instead.

## Usage

**Saving as you go:** create a folder such as `data/raw/trove-shipwrecks-2026-11-13/` and write each response there exactly as it came. Treat that folder as [read-only from then on](../raw-data-read-only/). Keep a [provenance note](../data-provenance-notes/) beside it with the query, date and API version.

**Paging with a cursor:** many APIs return a token for the next page instead of expecting you to count offsets. Trove's API v3 starts with `s=*` and returns `nextStart`, which you pass as `s` for the following page. Trove also asks you to add `bulkHarvest=true` when you harvest a full result set, which sorts by identifier so that every record arrives once. Look for the equivalent in other APIs' documentation.

**Keeping a checkpoint:** store the next cursor and page number in a small JSON file after each page is saved. When the loop starts, it reads the file if it exists. The functions here are your own, ideally kept in a module (see [Moving functions out of notebooks](../functions-out-of-notebooks/)):

```python
import json, pathlib
out = pathlib.Path("data/raw/trove-shipwrecks")
out.mkdir(parents=True, exist_ok=True)
ckpt = out / "checkpoint.json"
state = json.loads(ckpt.read_text()) if ckpt.exists() else {"start": "*", "page": 0}

while state["start"]:
    data = fetch_page(QUERY, start=state["start"])  # your polite request function
    (out / f"page-{state['page']:05d}.json").write_text(json.dumps(data))
    state = {"start": next_cursor(data), "page": state["page"] + 1}
    ckpt.write_text(json.dumps(state))
```

**Processing separately:** a second notebook reads the saved pages, extracts the fields you need and writes a tidy CSV or Parquet file to `data/processed/`. Develop that step on the first few pages while the harvest is still running, as in [Starting with a sample](../sample-before-full-run/). For Trove newspapers specifically, Tim Sherratt's Trove Newspaper Harvester already does all of this and has a `restart` command for stalled harvests.

## References

- [API technical guide](https://trove.nla.gov.au/about/create-something/using-api/v3/api-technical-guide), National Library of Australia (Trove). Documents the `s` cursor, `nextStart`, the 100-record page size and the `bulkHarvest` parameter.
- [trove-newspaper-harvester](https://wragge.github.io/trove-newspaper-harvester/), Tim Sherratt. A harvester that saves results as it goes and can restart a stalled harvest.
- [Trove Newspaper Harvester notebooks](https://github.com/GLAM-Workbench/trove-newspaper-harvester), GLAM Workbench (GitHub). Notebooks that use the harvester and process its results, ready to run on Binder.
- [requests-cache](https://requests-cache.readthedocs.io/en/stable/), requests-cache project. A persistent cache for `requests` that avoids re-fetching pages while you develop.
