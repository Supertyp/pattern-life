---
title: Laying out a notebook project
type: preparation
cluster: notebooks
problem: Notebooks, data files and figures pile up in one folder until nobody, including you a year later, can tell which file came from where or what to run first.
appliesWhen:
  - you are starting a new research project that will use jupyter notebooks
  - the project has its own data, such as texts, records, survey responses or api harvests
  - you expect to come back to it later, share it or publish it
authors: [Pattern Life team]
published: 2026-11-13
related: [raw-data-read-only, data-provenance-notes, notebook-as-narrative, notebooks-in-git, pin-the-environment]
---

## Summary

This pattern is for anyone who starts a research project in Jupyter notebooks, from a historian with a folder of Trove articles to a research software engineer building a harvesting pipeline. It describes a simple, conventional folder layout that makes the order of work and the origin of every file obvious.

| Recommendation | Why? |
| --- | --- |
| Give each project its own folder, and open Jupyter from that folder. | Relative paths such as `data/raw/` then work for everyone, and nothing depends on where files happen to sit on your laptop. |
| Split data into `data/raw/` for originals and `data/processed/` for anything your code creates. | You can always tell what is a source and what is a result, and you can delete and regenerate processed files without fear. |
| Number your notebooks in the order they run, such as `01-harvest.ipynb` and `02-clean.ipynb`. | The file list reads as a recipe, so a reader knows where to start and which notebook feeds the next. |
| Write figures, tables and exports to an `outputs/` folder, never back into the data folders. | Results stay separate from inputs, and you can share or publish the outputs folder on its own. |
| Put a short `README.md` at the top that says what the project is, how to set it up and what order to run things in. | It's the first file people open on GitHub, Binder or Zenodo, and it's the note you'll need most when you return in a year. |

## Context

This pattern suits projects of any size that are worked on over weeks or months: a linguist analysing interview transcripts, a sociologist with a survey export, an art historian exploring a museum collection, or an RSE harvesting from Europeana or the Internet Archive.

It does not suit a quick one-off notebook that you'll throw away after an afternoon, or a large software package that already follows Python or R packaging conventions. For a package, use the packaging layout and keep notebooks in a `notebooks/` or `examples/` folder.

There's a trade-off between a full template and a minimal one. Templates such as Cookiecutter Data Science create many folders at once, which is helpful for a team but can feel like clutter for one researcher. Start with the five items in the table and add folders (such as `src/` for shared code or `docs/`) when you actually need them.

## Usage

**Setting up:** create the folders before you write any code, so that the first notebook already reads from `data/raw/` and writes to `data/processed/`. A typical project looks like the tree below. Add a `requirements.txt` or `environment.yml` as described in [Pinning the environment](../pin-the-environment/), and put the project under version control early (see [Notebooks in git](../notebooks-in-git/)).

```text
my-project/
├── README.md
├── requirements.txt
├── data/
│   ├── raw/          # originals, never edited
│   └── processed/    # created by the notebooks
├── notebooks/
│   ├── 01-harvest.ipynb
│   ├── 02-clean.ipynb
│   └── 03-explore.ipynb
└── outputs/          # figures and tables
```

**Keeping the roles clear:** the raw folder holds data exactly as you received or downloaded it, and nothing writes into it (see [Keeping raw data read-only](../raw-data-read-only/)). Next to the raw files, keep a small record of where each dataset came from, as described in [Recording data provenance](../data-provenance-notes/). Each notebook should answer one question and save what the next notebook needs, so that [each notebook tells its own story](../notebook-as-narrative/).

**Paths in code:** use relative paths from the project folder, or build them with `pathlib.Path` in Python (or the `here` package in R). Avoid paths like `C:\Users\anna\Desktop\`, which break on every other computer. When a notebook sits inside `notebooks/`, refer to `../data/raw/`, or define the project root once at the top.

**Growing it:** when you copy the same function into a second notebook, create a `src/` folder or a small module and import it from there. Renumber notebooks only when the order really changes, and leave gaps (10, 20, 30) if you expect to insert steps.

## References

- [Ten simple rules for writing and sharing computational analyses in Jupyter Notebooks](https://doi.org/10.1371/journal.pcbi.1007007), PLOS Computational Biology (Rule et al., 2019). Practical rules for organising, documenting and sharing notebook-based research.
- [Good enough practices in scientific computing](https://doi.org/10.1371/journal.pcbi.1005510), PLOS Computational Biology (Wilson et al., 2017). Recommends a predictable project layout with separate folders for data, code, results and docs, and a README.
- [Cookiecutter Data Science](https://cookiecutter-data-science.drivendata.org/), DrivenData. A widely used project template with `data/raw` and `data/processed`, numbered notebooks and the reasoning behind each folder.
- [Workflow: scripts and projects](https://r4ds.hadley.nz/workflow-scripts.html), R for Data Science (2nd edition). The same project-oriented approach for R users, with relative paths and one project per analysis.
