---
title: Restarting and running all
type: process
cluster: notebooks
problem: A notebook remembers everything you ran in whatever order you ran it, so its saved results can depend on cells that have since been edited, deleted or run out of order, and nobody else can reproduce them.
appliesWhen:
  - you have run or edited cells out of order while exploring
  - you are about to save, share, commit or quote a result
  - another person, computer or automated test needs to rerun the notebook
authors: [Pattern Life team]
published: 2026-11-13
related: [notebook-as-narrative, sample-before-full-run, test-notebooks-in-ci, notebooks-in-git, pin-the-environment]
---

## Summary

This pattern is for anyone who works in Jupyter notebooks, and especially for anyone who shares them. It describes how to clear hidden state by restarting the kernel and running every cell from the top, and how to make that habit cheap enough to keep.

| Recommendation | Why? |
| --- | --- |
| Before you save, share, commit or trust a result, restart the kernel and run all cells from the top. | It throws away hidden state and proves the notebook works from scratch. The execution counts then read 1, 2, 3 in order, which shows readers it ran top to bottom. |
| Do it regularly while you work, not only at the end. | A break is easy to fix while you still remember what you changed, and much harder a week later. |
| Avoid reusing a variable name for different things, and don't write cells that only work if run twice. | Reused names combined with out-of-order runs are the most common source of results nobody can reproduce. |
| Save the output of slow steps to disk and load it from there. | If a full rerun takes three hours you will skip it, so make the rerun fast. |
| Let a machine run the notebook in a fresh kernel too. | It catches what you can't see on your own computer, such as a file or package that only exists there. |

## Context

This pattern suits every notebook you intend to keep: a historian's analysis of Trove articles, a linguist's coding of interview transcripts or an RSE's harvesting notebook. The kernel is the program running behind the notebook that holds your variables in memory. It keeps every value you created, even after you delete or change the cell that made it.

It does not suit a scratch notebook you use for a quick look and then throw away, or a notebook that depends on a live API you can't call again. For that, save the responses first and rerun against the saved copies.

There's a trade-off with long-running notebooks. Restarting throws away hours of computed results. The answer is not to skip the restart but to split the work: a harvesting or processing notebook that writes files, and an analysis notebook that reads them and reruns in seconds.

## Usage

**Doing it by hand:** in JupyterLab and Jupyter Notebook 7, choose Kernel > Restart Kernel and Run All Cells. In VS Code, click Restart and then Run All. Fix the first error and repeat until it runs cleanly, then save. If you work in R, rendering an R Markdown or Quarto document runs it in a fresh R session, which gives you the same check.

**Making it a habit:** restart at the end of each working session and after any big change, such as renaming a column or deleting a block of cells. While you develop, use a small sample as in [Working on a sample before the full run](../sample-before-full-run/), so a full rerun stays quick. Before you commit, restart and run all, so the outputs in version control match the code (see [Keeping notebooks in Git](../notebooks-in-git/)).

**Running it from the command line:** nbconvert runs a notebook in a new kernel without opening it:

```bash
jupyter nbconvert --to notebook --execute --inplace 02-clean-transcripts.ipynb
```

The next step is to let GitHub Actions do the same on every push, as in [Testing notebooks in CI](../test-notebooks-in-ci/). CI (continuous integration) means a service that runs your checks automatically.

**Why it matters:** a large study re-ran thousands of published Jupyter notebooks whose packages installed successfully, and only about one in nine ran through without errors. Not all of those failures come from hidden state, but a notebook that has never been run top to bottom on a clean kernel has not been tested at all.

## References

- [Ten simple rules for writing and sharing computational analyses in Jupyter Notebooks](https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1007007), PLOS Computational Biology (Rule et al., 2019). Rule 7 recommends regularly restarting the kernel and rerunning all cells.
- [I don't like notebooks](https://www.youtube.com/watch?v=7jiPeIFXb6U), Joel Grus at JupyterCon 2018, O'Reilly (YouTube). A well-known, funny talk on hidden state and out-of-order execution.
- [Computational reproducibility of Jupyter notebooks from biomedical publications](https://arxiv.org/abs/2308.07333), arXiv (Samuel and Mietchen, 2023). Of 10,388 notebooks whose dependencies installed, 1,203 ran without errors.
- [Using as a command line tool](https://nbconvert.readthedocs.io/en/latest/usage.html), nbconvert documentation. How to execute a notebook from the command line with `--execute`.
