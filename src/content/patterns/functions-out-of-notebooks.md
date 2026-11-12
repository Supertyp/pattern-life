---
title: Moving functions out of notebooks
type: technique
cluster: notebooks
problem: Code copied from notebook to notebook drifts apart, can't be tested on its own and buries the story of the analysis under long cells of helper functions.
appliesWhen:
  - you have copied the same function into a second notebook
  - helper code is crowding out the explanation in your notebook
  - other people or other projects would benefit from reusing the code
authors: [Pattern Life team]
published: 2026-11-13
related: [notebook-as-narrative, notebook-project-layout, test-notebooks-in-ci, parameterised-notebooks, resumable-api-harvests]
---

## Summary

This pattern is for anyone whose notebooks have started to share code, such as a linguist with a function that cleans interview transcripts, or an RSE with harvesting code used by several notebooks. It describes how to move that code into a Python module that the notebooks import, so that there is one tested copy, and the notebook goes back to telling the story.

| Recommendation | Why? |
| --- | --- |
| Move a function into a `.py` module in your project as soon as you need it in a second notebook. | One copy means one place to fix a bug, and every notebook gets the fix. |
| Make the project installable with a `pyproject.toml` and install it in editable mode. | Notebooks in any folder can import your code without fragile `sys.path` tricks, and edits take effect without reinstalling. |
| Give each function a docstring and a few `pytest` tests built from small, real examples. | You and others can see what a function expects and returns, and you'll know when a change breaks it. |
| Turn on `%autoreload` at the top of the notebook while you develop. | Changes you save in the module reach the notebook without restarting the kernel and losing loaded data. |
| Keep the notebook for loading data, calling functions, showing results and interpreting them. | Readers see the reasoning and the evidence, not two hundred lines of string handling. |

## Context

This pattern suits projects with more than one notebook, code that runs in a pipeline, and anything you plan to reuse in the next project or publish for others.

It does not suit a single exploratory notebook you'll use once, or a short teaching notebook where seeing every line of code is the point. Moving code out too early also slows down exploration while you're still finding out what you need.

There's a trade-off between visibility and reuse. Code in a module is hidden from someone reading the notebook, and a beginner may find the jump to another file confusing. Good function names, docstrings and a link to the module from a markdown cell keep the notebook understandable (see [Writing notebooks as narratives](../notebook-as-narrative/)).

## Usage

**Where the code goes:** inside the [project folder](../notebook-project-layout/), create a package such as `src/convicts/` with an empty `__init__.py` and modules named after what they do, for example `clean.py` and `harvest.py`. Add a short `pyproject.toml`, then run `pip install -e .` in the project's environment. The `-e` (editable) flag means Python reads the files where they are, so your edits count straight away. Cookiecutter Data Science sets all of this up for you.

**Working with it from the notebook:** load the autoreload extension in the first cell. `%autoreload 2` reloads every imported module before each cell runs. It occasionally gets confused after big changes, such as renamed classes, and then a kernel restart sorts it out.

```python
%load_ext autoreload
%autoreload 2

from convicts.clean import normalise_place_names
from convicts.harvest import fetch_page
```

**Testing it:** put tests in a `tests/` folder and run `pytest`. Use tiny examples taken from your own material, such as three transcript lines with the speaker labels your cleaning function must handle. These tests run quickly in [continuous integration](../test-notebooks-in-ci/), meaning an automatic check on every push, alongside the notebooks themselves.

**In R and other options:** the same idea works in R by putting functions in an `R/` folder of a small package, loading them with `devtools::load_all()` and testing with `testthat`. If you prefer to write library code in notebooks, nbdev turns specially marked notebook cells into a Python package with tests and documentation. Once your functions are stable, they also make [parameterised notebooks](../parameterised-notebooks/) much shorter.

## References

- [Ten simple rules for writing and sharing computational analyses in Jupyter Notebooks](https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1007007), Rule et al., PLOS Computational Biology (2019). Rule 4, "Modularize code", recommends moving reused code into functions and modules.
- [Using the template](https://cookiecutter-data-science.drivendata.org/using-the-template/), Cookiecutter Data Science. Shows a project installed as a package and the autoreload cell used to import it in notebooks.
- [autoreload](https://ipython.readthedocs.io/en/stable/config/extensions/autoreload.html), IPython documentation. What each `%autoreload` mode does and its known limitations.
- [Packaging Python Projects](https://packaging.python.org/en/latest/tutorials/packaging-projects/), Python Packaging User Guide. A step-by-step guide to `pyproject.toml` and the `src` layout.
- [Get Started](https://docs.pytest.org/en/stable/getting-started.html), pytest documentation. How to write and run your first tests.
