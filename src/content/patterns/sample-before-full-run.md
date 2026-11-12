---
title: Working on a sample before the full run
type: technique
cluster: notebooks
problem: Running every step against the whole dataset or a complete API harvest while you are still writing the code wastes hours, uses up API quotas and hides mistakes until the end.
appliesWhen:
  - the full dataset or harvest takes minutes or hours to process
  - you are still writing or changing the code
  - the data comes from a rate-limited api or a large collection export
authors: [Pattern Life team]
published: 2026-11-13
related: [polite-api-harvesting, resumable-api-harvests, parameterised-notebooks, test-notebooks-in-ci, notebook-as-narrative]
---

## Summary

This pattern is for anyone who builds an analysis or a harvest in a notebook and has more data than they can process in a few seconds. It describes how to develop on a small, sensible sample and only scale up once the code works.

| Recommendation | Why? |
| --- | --- |
| Develop on a small sample: a few hundred rows, one page of API results or a single decade. | Each run takes seconds, so you can try things freely, and mistakes show up straight away instead of after an hour. |
| Control the sample size with one setting near the top of the notebook. | Switching to the full run is a single change, and the same setting lets you rerun the notebook on a sample in tests. |
| Draw a random sample with a fixed seed, and add a few awkward records on purpose. | The first rows of a file are often the oldest or cleanest. A fixed seed gives the same sample every time, so you can compare runs. |
| Save API responses to disk while developing and work from the saved copy. | You don't send the same requests to the server again and again, and you can keep working when the API is slow or you are offline. |
| Check the sample's output by eye and time it before you start the full run. | You catch wrong results while they are cheap to fix, and you know whether the full run takes minutes or days. |

## Context

This pattern suits a sociologist with tens of thousands of survey responses, a linguist with hundreds of interview transcripts, or a historian planning to harvest 200,000 newspaper articles from Trove. It also suits an RSE's harvesting pipeline, where every API call costs time and quota.

It does not suit small datasets that load and process in a second or two, where sampling only adds a step. It also does not suit final results: numbers from a sample are for checking code, not for quoting in a paper.

There's a trade-off between speed and coverage. A small sample can miss the rare cases that break code: a record with a missing date, a transcript in another language or an issue with unusual OCR errors. That is why you add awkward records on purpose and look carefully at the first full run.

## Usage

**Setting up the sample:** put the sample size in a settings cell at the top. For a file that fits in memory, read it all and take a random sample. For a file too big to load, `pandas.read_csv(..., nrows=1000)` reads only the first rows, which is quick but not random. In R, `dplyr::slice_sample(n = 500)` after `set.seed()` does the same job.

```python
SAMPLE_SIZE = 500   # set to None for the full run
SEED = 42

df = pd.read_csv("data/raw/survey_2024.csv")
if SAMPLE_SIZE:
    df = df.sample(n=SAMPLE_SIZE, random_state=SEED)
```

**Sampling an API:** ask for one page of results, or narrow the query to one year, one state or one newspaper title. Save each response as a file in your raw data folder, then point your processing cells at those files. The `requests-cache` package can do this for you by caching responses locally. This helps you stay within the limits described in [Harvesting politely from APIs](../polite-api-harvesting/).

**Scaling up:** once the sample gives sensible output, time it and multiply. If 100 records take 20 seconds, 200,000 take about 11 hours, which is long enough that you need [Resumable API harvests](../resumable-api-harvests/) rather than one long run. If unsure, scale up in steps and watch memory use.

**Keeping the sample:** leave the setting in place after the full run. A small sample makes the notebook quick to rerun in automated tests, as in [Testing notebooks in CI](../test-notebooks-in-ci/), and [Parameterised notebooks](../parameterised-notebooks/) can set it from outside the notebook.

## References

- [pandas.DataFrame.sample](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.sample.html), pandas documentation. Draws a random sample of rows, with `random_state` to make it repeatable.
- [pandas.read_csv](https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html), pandas documentation. The `nrows` option reads only the first rows of a large file.
- [requests-cache](https://requests-cache.readthedocs.io/en/stable/), requests-cache documentation. Caches API responses locally so repeated runs don't send the same requests again.
- [Trove newspapers notebooks](https://github.com/GLAM-Workbench/trove-newspapers), GLAM Workbench (Tim Sherratt). Notebooks that explore and harvest Trove's digitised newspapers, often starting from small queries.
- [Using the API](https://trove.nla.gov.au/about/create-something/using-api), Trove, National Library of Australia. How to apply for a key and the conditions for using the Trove API.
