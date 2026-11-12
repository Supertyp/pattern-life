---
title: Archiving on Zenodo
type: process
cluster: notebooks
problem: A GitHub repository can be renamed, changed or deleted at any time, so a link to it in a paper isn't a reliable or citable record of the notebooks and data you actually used.
appliesWhen:
  - you publish, submit or present work that rests on your notebooks
  - you want others to cite your code or data and give you credit
  - a funder, journal or institution asks for code and data to be deposited
authors: [Pattern Life team]
published: 2026-11-13
related: [notebooks-in-git, data-provenance-notes, binder-ready-repository, sensitive-data-in-notebooks, pin-the-environment]
---

## Summary

This pattern is for researchers and RSEs who want a permanent, citable copy of their notebooks and data. It describes how to connect GitHub to Zenodo so that each release gets a DOI, and what to add so that people can cite and reuse the work.

| Recommendation | Why? |
| --- | --- |
| Turn on the GitHub integration in Zenodo, then make a GitHub release whenever you reach a version worth citing. | Zenodo stores a copy of each release and gives it a DOI (a permanent identifier), so the paper can point at exactly the code you ran. |
| Add a `CITATION.cff` file that says how to cite the work. | GitHub shows a "Cite this repository" button and Zenodo reads the authors, title and other details from the same file. |
| Choose a licence for the code and a separate one for the data and text. | Without a licence, others have no legal right to reuse your work, however open the repository looks. |
| Deposit the data as its own record, where its licence and your ethics approval allow it, and link the two. | A notebook without its data can't be rerun, and a dataset cited on its own earns credit on its own. |

## Context

This pattern suits notebooks behind a thesis chapter, an article or a public tool: a historian's analysis of Trove newspaper articles, a sociologist's survey analysis, or an RSE's harvesting pipeline that other projects depend on.

It does not suit data you can't share, such as identifiable interview recordings, records restricted by an archive or Indigenous data held under community control. Archive the code and a description of the data instead, and say how access can be requested (see [Handling sensitive data in notebooks](../sensitive-data-in-notebooks/)). Some data also belongs in a discipline or institutional repository, which may be the better home for a linguistic corpus or a survey.

There's a trade-off between permanence and tidiness. Once a Zenodo record is published you can't simply delete it, only add a new version. That's the point, but it means you should check a release for secrets, personal data and broken notebooks before you make it.

## Usage

**Connecting GitHub:** log in to Zenodo with your GitHub account, open the GitHub page in your Zenodo profile and switch on the repository (it must be public). Then create a release on GitHub with a version tag such as `v1.0.0`. Zenodo archives the release (this can take a while for a large one) and mints two DOIs: one for this version and a "concept" DOI that always resolves to the latest version. Cite the version DOI in a paper, and put the concept DOI badge in your README. Before each release, restart and run all notebooks (see [Restarting and running all](../restart-and-run-all/)), and check the history is clean (see [Keeping notebooks in Git](../notebooks-in-git/)).

**Describing the work:** a `CITATION.cff` is a short plain-text file in the repository's top folder. The Citation File Format website links to cffinit, a form that writes the file for you. Add ORCID iDs for the authors. If you also add a `.zenodo.json` file, Zenodo uses that instead and ignores `CITATION.cff`, so most projects keep only one.

```yaml
cff-version: 1.2.0
message: "If you use these notebooks, please cite them as below."
title: "Harvesting digitised newspapers from Trove"
authors:
  - family-names: Nguyen
    given-names: Mai
    orcid: "https://orcid.org/0000-0000-0000-0000"
license: MIT
version: 1.0.0
```

**Licensing:** a permissive software licence such as MIT or Apache 2.0 is common for code, and CC BY 4.0 for data, documentation and the prose in notebooks. You can only license what you have the rights to. Harvested records keep the rights and terms of their source, so record those in your provenance file (see [Recording data provenance](../data-provenance-notes/)) and check them before depositing.

**Depositing data:** upload the processed data as a separate Zenodo record (or to your institution's repository), with a README, the provenance notes and a licence. Link the records to each other with Zenodo's related identifiers, and mention the data DOI in the notebook that loads it.

## References

- [GitHub and Software](https://help.zenodo.org/docs/github/), Zenodo. How to enable a repository, describe software with `CITATION.cff` or `.zenodo.json`, and archive releases.
- [Referencing and citing content](https://docs.github.com/en/repositories/archiving-a-github-repository/referencing-and-citing-content), GitHub Docs. GitHub's walkthrough of getting a DOI for a repository through Zenodo.
- [About CITATION files](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-citation-files), GitHub Docs. How GitHub turns a `CITATION.cff` file into the "Cite this repository" button.
- [Citation File Format](https://citation-file-format.github.io/), Citation File Format project. The specification for `CITATION.cff` files, with links to cffinit and validation tools.
- [Citing your own Research Objects](https://book.the-turing-way.org/communication/citable/citable-cite/), The Turing Way. Why and how to make code and data citable with DOIs and citation files.
