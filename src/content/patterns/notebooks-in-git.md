---
title: Keeping notebooks in Git
type: process
cluster: notebooks
problem: Notebooks change constantly, and without version control you lose working versions, can't see what changed and end up with folders full of analysis_final_v3.ipynb.
appliesWhen:
  - you work on notebooks for more than a few days
  - you share a project with a collaborator, a supervisor or the public
  - you want to publish or archive the work later
authors: [Pattern Life team]
published: 2026-11-13
related: [notebook-project-layout, sensitive-data-in-notebooks, api-keys-out-of-notebooks, restart-and-run-all, archive-on-zenodo]
---

## Summary

This pattern is for researchers and research software engineers who keep Jupyter notebooks in a Git repository. It describes how to commit notebooks so that the history stays readable, small and free of data or secrets that should never be published.

| Recommendation | Why? |
| --- | --- |
| Put every project in a Git repository from the first day, and commit small, described changes often. | You can go back to the version that worked, see who changed what, and stop keeping numbered copies of the same notebook. |
| Decide deliberately about outputs: strip them by default with nbstripout, and keep them only where readers need to see results without running the code. | Saved outputs bloat the repository, make every diff noisy and can carry data you didn't mean to publish. |
| Add a `.gitignore` for data, secrets and checkpoints before the first commit. | Git keeps everything forever, so a file that's committed once stays in the history even after you delete it. |
| Use nbdime to compare and merge notebooks, and consider Jupytext if you want a plain-text copy. | A notebook is a JSON file, so plain `git diff` shows a wall of brackets instead of the change you made. |

## Context

This pattern suits notebook projects of any size, from a historian's single exploration of Trove newspaper articles to a research software engineer's harvesting pipeline with a dozen notebooks.

It does not suit storing the data itself when it's large, sensitive or licensed in ways that forbid redistribution. Keep raw data outside the repository (see [Keeping raw data read-only](../raw-data-read-only/)), and put large files in a data repository rather than Git.

There's a trade-off with outputs. Stripped notebooks give clean diffs and keep personal data out of the history, but a reader on GitHub sees code without any tables or charts. Many projects strip outputs during development and publish a rendered copy (HTML, or a Binder link) for readers. For a teaching or showcase notebook it can be right to keep outputs, as long as you've checked them.

## Usage

**Setting up:** run `git init` in your project folder (see [Laying out a notebook project](../notebook-project-layout/)) and add a `.gitignore` before anything else. Then install nbstripout with `pip install nbstripout` and run `nbstripout --install` inside the repository. This sets up a Git filter, so outputs are removed from what Git stores while your working copy keeps them on screen. Collaborators need to run the install command too, or use it as a pre-commit hook so it runs for everyone. If one cell's output should stay, give that cell the `keep_output` tag.

```gitignore
# Data stays out of Git
data/
outputs/
# Secrets
.env
# Jupyter and Python clutter
.ipynb_checkpoints/
__pycache__/
```

**Before committing:** restart the kernel and run all cells (see [Restarting and running all](../restart-and-run-all/)), so the committed version actually works from top to bottom. Write a commit message that says what you changed and why, such as "Filter interview transcripts to 2019 cohort", not "update". Check that no API key is sitting in a cell (see [Keeping API keys out of notebooks](../api-keys-out-of-notebooks/)). If a secret or personal data does get committed, deleting the file isn't enough: rotate the key, and rewrite the history before you push.

**Reading changes:** install nbdime and run `nbdime config-git --enable` once. After that, `git diff` shows notebook changes cell by cell, and `nbdiff-web` shows them side by side in the browser. nbdime's merge tool also helps when two people edited the same notebook.

**Plain-text pairing (optional):** Jupytext can pair each notebook with a `.py` script or a Markdown file that holds the same cells. Code review and diffs then work on the text file. It's popular with RSEs who review notebooks in pull requests, and it works for R Markdown and R scripts as well.

## References

- [nbstripout: strip output from Jupyter and IPython notebooks](https://github.com/kynan/nbstripout), GitHub. The tool's documentation, covering the Git filter, pre-commit use and the `keep_output` tag.
- [nbdime: diffing and merging of Jupyter Notebooks](https://nbdime.readthedocs.io/en/latest/), Project Jupyter. How to install nbdime and turn on its Git integration for readable notebook diffs.
- [Jupytext: Jupyter notebooks as plain text](https://jupytext.org/), Jupytext. Pairing notebooks with scripts or Markdown files for version control and review.
- [Version Control with Git](https://swcarpentry.github.io/git-novice/), Software Carpentry. A beginner's lesson on Git, including ignoring files and recovering old versions.
- [Ten simple rules for writing and sharing computational analyses in Jupyter Notebooks](https://doi.org/10.1371/journal.pcbi.1007007), PLOS Computational Biology (Rule et al., 2019). Rule 6 recommends version control for notebooks.
