---
title: Keeping raw data read-only
type: safety
cluster: notebooks
problem: A quick fix made directly in the original data file, such as correcting a date or deleting odd rows, can't be undone, checked or repeated, and the original is lost.
appliesWhen:
  - you work with data you collected, downloaded or received from someone else
  - you clean, filter or reshape that data before analysing it
  - other people, or you later, need to trust and rerun the results
authors: [Pattern Life team]
published: 2026-11-13
related: [notebook-project-layout, data-provenance-notes, restart-and-run-all, resumable-api-harvests, sample-before-full-run]
---

## Summary

This pattern is for researchers and research software engineers who clean or transform data in notebooks. It describes how to treat the original data as untouchable and create every cleaned or derived version with code, so that nothing is lost and every change can be seen and rerun.

| Recommendation | Why? |
| --- | --- |
| Keep the originals in `data/raw/` exactly as you received or downloaded them, and never open them in Excel to tidy up. | The raw files are your evidence. Spreadsheet software can silently change dates, leading zeros and character encodings when it saves. |
| Make every correction in code that reads from `data/raw/` and writes to `data/processed/`. | Each change is written down, so you, a reviewer or a co-author can see exactly what was done and redo it. |
| Make the raw folder read-only once it's complete. | A stray "Save" or a bug that writes to the wrong path fails with an error instead of overwriting your source. |
| Keep a backup copy of the raw data somewhere other than your laptop. | If the original is lost, the code that derives everything else can't help you. Processed data can be regenerated; raw data often can't. |

## Context

This pattern suits any project where the data needs cleaning: OCR text from digitised newspapers, transcripts with inconsistent speaker labels, survey responses with typos in free-text fields, or a museum collection export with mixed date formats.

It does not suit data that you are actively creating by hand, such as a coding sheet you fill in while reading sources. That data is the raw data. Keep it under version control instead, and treat each finished export or snapshot as read-only.

There's a trade-off between speed and traceability. Fixing ten obvious typos by hand takes a minute, while writing code for them takes longer. For a few fixes, keep a small corrections table (for example `corrections.csv` with the record id, field, old value and new value) and apply it in code. You still get speed, and the fixes stay visible and repeatable.

## Usage

**Setting up the folder:** decide what counts as raw at the start. For an API harvest, that's the responses saved to disk as you collect them (see [Resumable API harvests](../resumable-api-harvests/)). For a file someone sends you, it's that file, unopened. Record where each dataset came from next to it, as described in [Recording data provenance](../data-provenance-notes/). Then make the folder read-only. On macOS and Linux, run `chmod -R a-w data/raw`; on Windows, tick "Read-only" in the folder's Properties. Remove the protection deliberately when you add new raw data, then put it back.

**Deriving data in code:** start each cleaning notebook by loading from `data/raw/` and end it by saving to `data/processed/`. Never write to the same path you read from. In pandas, load with options that keep values as they are, such as `dtype=str` for identifiers with leading zeros, and parse dates explicitly. In R, readr's `col_types` does the same job. Write processed data in an open format such as CSV, Parquet or JSON.

**Checking it holds:** delete `data/processed/` now and then and rebuild it by [restarting the kernel and running all](../restart-and-run-all/) cleaning notebooks in order. If the results come back the same, your pipeline really does start from the raw data. If a notebook fails, you've found a hidden manual step.

**Big or shared data:** large raw files often don't belong in git. Store them on institutional research storage, a cloud drive or a repository such as Zenodo, and record in the README where they live and how to fetch them. For data under access restrictions, see [Sensitive data in notebooks](../sensitive-data-in-notebooks/).

## References

- [Good enough practices in scientific computing](https://doi.org/10.1371/journal.pcbi.1005510), PLOS Computational Biology (Wilson et al., 2017). Its first data rules are to save the raw data, back it up in more than one place and keep cleaned files separate.
- [Opinions: raw data is immutable](https://cookiecutter-data-science.drivendata.org/opinions/), Cookiecutter Data Science. Explains why raw data should never be edited in place, "especially not in Excel", and how data flows from `raw` to `processed`.
- [Tidy data for librarians](https://librarycarpentry.github.io/lc-spreadsheets/), Library Carpentry. A beginner-friendly lesson on keeping raw data raw and the traps spreadsheets set with dates and formatting.
- [Data Storage and Organisation](https://book.the-turing-way.org/reproducible-research/rdm/rdm-storage/), The Turing Way. Guidance on organising, storing and backing up research data.
