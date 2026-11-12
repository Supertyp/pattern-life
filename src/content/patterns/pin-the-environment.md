---
title: Pinning the environment
type: preparation
cluster: notebooks
problem: A notebook that runs today can fail or give different results next year, or on a colleague's computer, because the Python version or the package versions have changed underneath it.
appliesWhen:
  - you will come back to the project after months away
  - a colleague, binder or an automated test needs to run your notebooks
  - the project uses packages beyond the standard library
authors: [Pattern Life team]
published: 2026-11-13
related: [notebook-project-layout, binder-ready-repository, test-notebooks-in-ci, archive-on-zenodo, restart-and-run-all]
---

## Summary

This pattern is for anyone whose notebooks need to keep working beyond the day they were written. It describes how to give each project its own environment, which is the Python (or R) version plus the set of installed packages that your code runs with, and how to record it so that someone else can rebuild it.

| Recommendation | Why? |
| --- | --- |
| Create a fresh environment for each project and use it as the project's notebook kernel. | Upgrading a package for one project can't break another, and you know exactly what this project needs. |
| Record every package with its exact version in a file in the repository, such as requirements.txt, environment.yml, uv.lock or renv.lock. | Anyone can rebuild the same setup, and services such as Binder and CI read these files directly. |
| Record the Python or R version as well as the packages. | Packages support only some Python versions, so a package list alone may not install on a newer Python. |
| Upgrade on purpose: change the versions, rerun every notebook and commit the new file. | Silent upgrades can change results without warning, while a deliberate upgrade shows you what changed. |
| Print the versions in the notebook itself. | The saved copy then records what it actually ran with, which helps when you quote a result or archive the work. |

## Context

This pattern suits any notebook project you plan to share, publish or return to: a sociologist's survey analysis, a historian's Trove harvest or an RSE's pipeline that runs on a schedule. It matters most when the project depends on fast-moving packages such as pandas, spaCy or a GLAM API client.

It does not suit a quick one-off look at a file with packages you already have, or teaching sessions where everyone uses a shared, managed environment such as an institutional JupyterHub.

There's a trade-off between exact and loose pins. Exact versions rebuild the same setup, but they age: in one study that re-ran published notebooks, only about two-thirds of those with a requirements file could still install their packages. For long-term preservation, archive the environment file with the code (see [Archiving on Zenodo](../archive-on-zenodo/)), and consider a container image if the work must run in ten years.

## Usage

**Creating the environment:** with plain Python, `python -m venv .venv` creates one in the project folder. With conda, write an environment.yml and run `conda env create -f environment.yml`. With uv, `uv init` and `uv add pandas` keep a pyproject.toml and an exact uv.lock up to date, and `uv python pin 3.13` records the Python version. To make the environment available as a kernel, install `ipykernel` in it and run `python -m ipykernel install --user --name trove-harvest`. In R, `renv::init()` gives the project its own library, `renv::snapshot()` writes renv.lock and `renv::restore()` rebuilds it.

**Writing the file:** `pip freeze > requirements.txt` lists every installed package with its exact version. `conda env export --from-history` lists only the packages you asked for, which is tidier but keeps only the versions you specified. A hand-written environment.yml is short and readable:

```yaml
name: trove-harvest
channels:
  - conda-forge
dependencies:
  - python=3.13
  - pandas=3.1.1
  - requests=2.32.3
  - jupyterlab=4.6
  - pip
  - pip:
      - python-dotenv==1.0.1
```

**Recording versions in the notebook:** the `watermark` extension prints the Python and package versions in one line (`%load_ext watermark`, then `%watermark -v -p pandas,requests`). In R, end the notebook with `sessionInfo()`.

**Checking it works:** build the environment from the file on a clean machine or in CI, then restart and run all (see [Restarting and running all](../restart-and-run-all/)). If that works, Binder will usually work too (see [Making a repository Binder-ready](../binder-ready-repository/)).

## References

- [Reproducible Environments](https://book.the-turing-way.org/reproducible-research/renv/), The Turing Way. Why environments matter and the options from package managers to containers.
- [Requirements File Format](https://pip.pypa.io/en/stable/reference/requirements-file-format/), pip documentation. The format of requirements.txt, including exact version pins.
- [Managing environments](https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html), conda documentation. Creating environments from environment.yml and exporting them, including `--from-history`.
- [Using uv with Jupyter](https://docs.astral.sh/uv/guides/integration/jupyter/), uv documentation. How to use a uv project environment as a Jupyter kernel.
- [Introduction to renv](https://rstudio.github.io/renv/articles/renv.html), renv documentation (Posit). Project environments and lockfiles for R.
