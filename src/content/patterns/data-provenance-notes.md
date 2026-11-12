---
title: Recording data provenance
type: preparation
cluster: notebooks
problem: Months later you have a folder of data but can't say exactly where it came from, which search or API version produced it, when it was collected or whether you may share it.
appliesWhen:
  - you download, harvest or are given a dataset for research
  - the source can change over time, such as a live api, a catalogue or a website
  - you plan to publish, share or cite the results
authors: [Pattern Life team]
published: 2026-11-13
related: [raw-data-read-only, notebook-project-layout, resumable-api-harvests, archive-on-zenodo, sensitive-data-in-notebooks]
---

## Summary

This pattern is for researchers and research software engineers who bring outside data into a notebook project. It describes how to write down, at the moment you get the data, where it came from and what you may do with it, in a small machine-readable file kept next to the data.

| Recommendation | Why? |
| --- | --- |
| Record the source, the date and time you retrieved it, and who retrieved it. | Collections, catalogues and newspaper archives change: records are added, corrected and removed. The date tells readers which version you saw. |
| Save the exact query, parameters and API version or export settings. | Another person, or a scheduled rerun, can repeat the request exactly. "Searched Trove for floods" is not enough; the full URL or parameter set is. |
| Note the licence, rights statement and any conditions of use for the data. | Rights vary between collections and even between records, and they decide whether you can publish the data, only describe it, or not share it at all. |
| Keep it in a machine-readable file, such as `datapackage.json` or a small YAML file, next to the data it describes. | Code can write it automatically during a harvest, and it travels with the data into git, Zenodo or a colleague's inbox. |

## Context

This pattern suits any dataset that comes from somewhere else: newspaper articles harvested from Trove, records from Europeana or the Digital Public Library of America, items from the Internet Archive, a collection export from a museum, or survey data from a panel provider.

It does not suit data that has no outside source, such as notes you typed yourself. Those still need a README explaining what they are, but there's no query or licence from a provider to record.

There's a trade-off between detail and effort. A full standard such as RO-Crate or Frictionless Data Package describes everything, but a researcher may never start if it feels like paperwork. Begin with a few plain fields written by the harvesting code itself, and move to a standard when you deposit the data in a repository.

## Usage

**Writing it as you go:** have the notebook or script that downloads the data write the provenance file in the same step, so it can't be forgotten. The Trove Newspaper Harvester by Tim Sherratt does this: every harvest saves the query and harvest details in an `ro-crate-metadata.json` file alongside the results. For a file someone emails you, write the record by hand on the day it arrives and save the email or covering note in `data/raw/` too (see [Keeping raw data read-only](../raw-data-read-only/)).

**A simple record:** a Frictionless Data Package file lists the resources, their sources and licences, and lets you add your own fields for the query and the date. Something like this is enough to start:

```json
{
  "name": "trove-floods-1890s",
  "created": "2026-11-13T10:42:00+11:00",
  "sources": [{"title": "Trove newspapers API v3",
               "path": "https://api.trove.nla.gov.au/v3/result"}],
  "query": {"q": "flood", "category": "newspaper",
            "l-decade": "189"},
  "licenses": [{"title": "Rights vary by article; see each record's rights field"}],
  "resources": [{"path": "harvest/results.csv"}]
}
```

**Keeping per-record rights:** when the source gives rights or a licence per item, as many GLAM APIs do, keep that field in your data rather than summarising it. It's the only reliable way to filter what you can republish later. Check it again before you [archive on Zenodo](../archive-on-zenodo/), and note any cultural or privacy restrictions as described in [Sensitive data in notebooks](../sensitive-data-in-notebooks/).

**Linking it to the code:** record the git commit or software version that produced the data as well. With [resumable harvests](../resumable-api-harvests/), store the provenance once per harvest, not once per page. Mention the provenance file in the project README so readers know it exists.

## References

- [Data Provenance](https://ardc.edu.au/resource/data-provenance/), Australian Research Data Commons. Explains what provenance is, why it matters for reuse and how to record it.
- [trove-newspaper-harvester: core](https://wragge.github.io/trove-newspaper-harvester/core.html), Tim Sherratt (GLAM Workbench). Documentation of a HASS harvester that saves an RO-Crate metadata file describing each harvest.
- [Data Package](https://datapackage.org/standard/data-package/), Data Package Standard (Open Knowledge Foundation). The specification for `datapackage.json`, including the `sources`, `licenses` and `created` properties.
- [Research Object Crate (RO-Crate)](https://www.researchobject.org/ro-crate/), RO-Crate community. A richer, widely used standard for packaging research data with its metadata and provenance.
