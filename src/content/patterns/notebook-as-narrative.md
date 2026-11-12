---
title: Writing a notebook as a narrative
type: technique
cluster: notebooks
problem: A notebook of bare code cells and outputs makes sense on the day you write it, but not to a colleague, a reviewer or yourself a year later.
appliesWhen:
  - you explore a dataset in jupyter notebooks and want to come back to it later
  - other people will read, review or reuse your notebooks
  - your findings depend on choices you made along the way
authors: [Pattern Life team]
published: 2026-11-13
related: [notebook-project-layout, functions-out-of-notebooks, restart-and-run-all, sample-before-full-run, parameterised-notebooks]
---

## Summary

This pattern is for anyone who explores data in Jupyter notebooks and wants the notebook to explain itself. It describes how to use Markdown cells, headings and cell size so that a notebook reads like a short, checkable essay rather than a scratchpad.

| Recommendation | Why? |
| --- | --- |
| Give each notebook one question, and state it in a Markdown cell at the top together with its inputs and outputs. | A reader knows straight away what the notebook is for, and a notebook that tries to answer everything soon grows past the point where anyone reads it. |
| Divide the notebook into steps with Markdown headings, and keep each code cell short, doing one thing. | Headings become a clickable table of contents in JupyterLab, and short cells make it easy to see which step produced which output and where something went wrong. |
| Write down the why in Markdown cells: your decisions, what you left out and the dead ends. | Code shows what you did, not why you did it. That reasoning is what reviewers ask about and what you forget first. |
| Put your interpretation directly below the result it rests on. | Readers can check the claim against the table or chart, and a note kept next to its evidence is less likely to drift out of step when the numbers change. |
| Move long helper code out of the notebook into a module and import it. | The story stays readable, and the code becomes easier to test and reuse. |

## Context

This pattern suits exploratory and interpretive work: a historian tracing how a word spreads through Trove newspapers, a linguist coding interview transcripts, or an art historian looking for patterns in a museum collection export. It also suits an RSE's worked examples for a harvesting tool.

It does not suit throwaway notebooks you use for a quick check and delete the same day, or pipeline steps that no human reads and that would be better as a plain script.

There's a trade-off between writing as you go and getting on with the work. Careful prose in every cell slows down exploration, and much of it gets thrown away. Most experienced people jot short notes while exploring and do a proper writing pass once the notebook has settled, before they share it.

## Usage

**The opening cell:** start with a title, the question in one or two sentences, the data the notebook reads (with its path, for example `data/processed/`), what it writes, and a date. If the notebook is part of a numbered series, as in [Laying out a notebook project](../notebook-project-layout/), say which notebook comes before it and which comes after.

```markdown
# 03 Mentions of "drought" in Queensland newspapers, 1880–1920

**Question:** did coverage rise before or after the Federation Drought?
**Reads:** `data/processed/articles_qld.csv` (made by notebook 02)
**Writes:** `outputs/drought_by_year.png`
**Last run:** 13 November 2026
```

**Writing as you go:** use second-level headings for each step (load, clean, count, compare) and a sentence under each heading saying what the step does. When you drop records, change a threshold or choose one method over another, say so and say why: "Articles with an OCR quality score below 0.6 were excluded because the word counts were unreliable." Under each chart, write what you see, and mark guesses as guesses.

**Keeping cells small:** a cell that loads, cleans and plots in one go is hard to read and debug, so aim for one action per cell. Functions you call from several notebooks, or anything longer than a screen, belong in a module, as described in [Moving functions out of notebooks](../functions-out-of-notebooks/).

**Tidying before you share:** delete dead-end cells, or collapse them into a short note about what you tried and why it didn't work. Then restart the kernel (the process that runs your code and holds your variables) and run everything from the top, as in [Restarting and running all](../restart-and-run-all/), so that the story and the outputs match.

## References

- [Ten simple rules for writing and sharing computational analyses in Jupyter Notebooks](https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1007007), PLOS Computational Biology (Rule et al., 2019). Rules 1 to 3 cover telling a story for an audience, documenting the process and using cells to make steps clear.
- [Introduction to Jupyter Notebooks](https://programminghistorian.org/en/lessons/jupyter-notebooks), Programming Historian. A lesson for humanities researchers that shows how to combine Markdown and code cells in a research notebook.
- [Markdown Cells](https://jupyter-notebook.readthedocs.io/en/stable/examples/Notebook/Working%20With%20Markdown%20Cells.html), Jupyter Notebook documentation. How to write headings, lists, links and formulas in Markdown cells.
- [GLAM Workbench on GitHub](https://github.com/GLAM-Workbench), Tim Sherratt. Notebooks for Trove and other GLAM collections that explain each step in prose, a good model to copy.
