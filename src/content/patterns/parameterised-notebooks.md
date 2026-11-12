---
title: Parameterising notebooks
type: technique
cluster: notebooks
problem: Rerunning the same analysis for another query, collection or year by editing values in the middle of a notebook is slow, easy to get wrong and leaves no record of what was run.
appliesWhen:
  - the same analysis has to run for several queries, collections or years
  - you want a record of exactly which settings produced each result
  - the notebook already runs cleanly from top to bottom
authors: [Pattern Life team]
published: 2026-11-13
related: [restart-and-run-all, functions-out-of-notebooks, sample-before-full-run, test-notebooks-in-ci, data-provenance-notes]
---

## Summary

This pattern is for anyone who runs one notebook many times with different settings, such as a historian comparing Trove coverage of influenza for each year from 1914 to 1920, or an RSE refreshing a harvest for several collections every month. It describes how to gather the settings into one cell and let a tool run the notebook for you, keeping an executed copy of every run.

| Recommendation | Why? |
| --- | --- |
| Put everything that changes between runs in one cell at the top, tagged `parameters`, with defaults for a quick test run. | Readers see at once what can vary, and the defaults keep a casual run small and fast. |
| Run the notebook with papermill or Quarto instead of editing and saving it by hand. | The tool injects new values without touching your original, and every run starts from a clean kernel. |
| Keep each executed copy, named after its parameters. | The copy records the values, outputs and any error for that run, which is your evidence of what produced a result. |
| Build output file names from the parameters. | Runs for different years or collections never overwrite each other's data or figures. |

## Context

This pattern suits notebooks that are past the exploring stage and ask the same question of different inputs: one notebook per Trove query, per museum collection export, per survey wave, or per month of a regular harvest.

It does not suit a notebook you are still shaping, because every change of direction then means changing the parameters too. It also doesn't suit very large numbers of runs, where a proper workflow tool such as Snakemake, or plain Python scripts, will serve you better than hundreds of notebook copies.

There's a trade-off between record-keeping and clutter. Executed copies are large and repetitive, and if your data includes personal details they carry those details in their outputs (see [Handling sensitive data in notebooks](../sensitive-data-in-notebooks/)). This pattern keeps them because they show exactly what ran. Commit or archive the ones that back a published claim, and treat the rest as disposable.

## Usage

**Writing the parameters cell:** put plain assignments at the top of the notebook, such as `query = "influenza"`, `year = 1919` and `sample_size = 100`, and tag the cell `parameters` (in JupyterLab, through the property inspector in the right sidebar). Keep calculations out of this cell: papermill puts the new values in a cell after it, so anything worked out from the defaults would stay stale. Use a small sample as the default, as described in [Starting with a sample](../sample-before-full-run/), and let the full run set it to `None`.

**Running it:** papermill reads the tagged cell, inserts a new cell tagged `injected-parameters` just after it with your values, and runs the whole notebook in a fresh kernel. That gives you the same guarantee as [restarting and running all](../restart-and-run-all/). From the command line it is `papermill analyse.ipynb runs/analyse-1919.ipynb -p year 1919`. From Python you can loop:

```python
import papermill as pm

for year in range(1914, 1921):
    pm.execute_notebook(
        "analyse.ipynb",
        f"runs/analyse-{year}.ipynb",
        parameters={"year": year, "sample_size": None},
    )
```

**Using Quarto or R:** Quarto uses the same `parameters` tag for Jupyter notebooks and renders a report with `quarto render analyse.ipynb -P year:1919`. In R, R Markdown and Quarto documents declare `params` in the YAML header instead. Papermill also runs notebooks with an R kernel.

**Keeping the results:** if a cell fails, papermill still saves the executed copy up to the error and marks it, so look there first. Write data and figures to paths such as `outputs/1919/`, and record the parameters in your [provenance notes](../data-provenance-notes/). Moving the heavy code into a module, as in [Moving functions out of notebooks](../functions-out-of-notebooks/), keeps the parameterised notebook short enough to read.

## References

- [Parameterize](https://papermill.readthedocs.io/en/latest/usage-parameterize.html), papermill documentation. How to tag a parameters cell and how the injected-parameters cell works.
- [Execute](https://papermill.readthedocs.io/en/latest/usage-execute.html), papermill documentation. Running a notebook with new values from Python or the command line.
- [Parameters](https://quarto.org/docs/computations/parameters.html), Quarto. Parameterised reports for Jupyter and knitr, including the `-P` flag.
- [Parameterized reports](https://pkg.yihui.org/rmarkdown-book/parameterized-reports), R Markdown: The Definitive Guide (Xie, Allaire and Grolemund). Declaring and passing `params` in R Markdown documents.
- [Ten simple rules for writing and sharing computational analyses in Jupyter Notebooks](https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1007007), Rule et al., PLOS Computational Biology (2019). Rule 7, "Build a pipeline", recommends putting key variables at the top so a notebook can be rerun with new inputs.
