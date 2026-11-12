---
title: Testing notebooks automatically
type: process
cluster: notebooks
problem: Notebooks that worked when you wrote them quietly stop working when a package updates, a collaborator changes a function or an API changes its responses, and you usually find out only when someone else tries to use them.
appliesWhen:
  - your notebooks live in a GitHub repository (or a similar host)
  - other people, or a later version of you, depend on them working
  - the notebooks call web APIs or shared code that can change underneath you
authors: [Pattern Life team]
published: 2026-11-13
related: [restart-and-run-all, sample-before-full-run, pin-the-environment, functions-out-of-notebooks, api-keys-out-of-notebooks]
---

## Summary

This pattern is for RSEs who maintain notebooks as part of a pipeline, and for researchers whose shared notebooks need to keep running. It describes how to run every notebook automatically on GitHub Actions, on a small sample, whenever the code changes and on a regular schedule.

| Recommendation | Why? |
| --- | --- |
| Run every notebook from top to bottom with nbmake (or nbval) in a GitHub Actions workflow on each push and pull request. | It's an automatic version of restarting and running all, so a broken notebook is caught before it's merged or published. |
| Give each notebook a small-sample mode and use it in the tests. | A test run should take minutes, not hours, and shouldn't put a full harvest's load on someone else's API. |
| Add a scheduled run, for example weekly. | APIs and packages change even when your code doesn't, and a scheduled failure tells you before your users find out. |
| Install from your pinned requirements and pass API keys in as repository secrets. | The test then uses the same environment your users get, and no key ends up in the workflow file or the logs. |
| Test reusable functions with ordinary pytest tests, and treat notebook runs as smoke tests. | A smoke test shows the notebook runs without errors, but not that its answers are right. |

## Context

This pattern suits notebooks that others rely on: an RSE's Trove or Europeana harvesting pipeline, a set of teaching notebooks, or a published GLAM Workbench-style tool. It also helps a researcher who wants confidence that the analysis behind a paper still runs a year later.

It does not suit notebooks that need large or sensitive data, special hardware or hours of computing. Test those on a synthetic or published sample, or run them on your own server, rather than on GitHub's shared machines.

There's a trade-off between coverage and speed. Running everything on full data gives the most confidence, but it's slow, may use up API quotas and can fail for reasons that have nothing to do with your code. A small sample keeps tests quick and reliable, and the scheduled run covers the slower drift.

## Usage

**Setting up the workflow:** CI (continuous integration) means a service that runs your checks automatically whenever the repository changes. GitHub Actions does this with a YAML file in `.github/workflows/`. nbmake is a pytest plugin that executes each notebook in a fresh kernel (the process that runs your code) and fails if any cell raises an error. nbval is an alternative that can also compare outputs with the saved ones, but for analysis notebooks its `--nbval-lax` mode, which only checks for errors, is usually more useful. Both work for Python, while nbmake can also run an R kernel if one is installed in the workflow.

```yaml
on:
  push:
  pull_request:
  schedule:
    - cron: "0 3 * * 1"   # Mondays 03:00 UTC
jobs:
  notebooks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-python@v7
        with: {python-version: "3.12"}
      - run: pip install -r requirements.txt pytest nbmake
      - run: pytest --nbmake notebooks/
        env: {SAMPLE_SIZE: "50", TROVE_API_KEY: "${{ secrets.TROVE_API_KEY }}"}
```

**Running on a sample:** read a setting such as `SAMPLE_SIZE` from an environment variable in the first cell, or use a papermill parameters cell (see [Parameterising notebooks](../parameterised-notebooks/)). Locally you leave it unset and run the full job; in CI it limits the harvest to a page or two. This fits naturally with [Developing on a sample first](../sample-before-full-run/).

**Handling keys and failures:** store keys under Settings, then Secrets and variables, in the repository (see [Keeping API keys out of notebooks](../api-keys-out-of-notebooks/)). Secrets aren't passed to pull requests from forks, so skip the API notebooks there. When a scheduled run fails, check the API's announcements before your code. In public repositories GitHub switches off scheduled workflows after 60 days without activity, so keep an eye on them.

**Testing the logic:** move functions into a module (see [Moving functions out of notebooks](../functions-out-of-notebooks/)) and write small pytest tests for them, such as "parses a date from a Trove record". These run in seconds and check correctness, which a notebook run can't.

## References

- [nbmake: Pytest plugin for testing notebooks](https://github.com/treebeardtech/nbmake), GitHub. Running notebooks with pytest, setting timeouts, choosing kernels and running in parallel.
- [nbval: IPython Notebook Validation for py.test](https://nbval.readthedocs.io/en/latest/), nbval project. Checking notebooks for errors and, optionally, comparing outputs.
- [Building and testing Python](https://docs.github.com/en/actions/tutorials/build-and-test-code/python), GitHub Docs. Setting up Python, installing dependencies and running pytest in GitHub Actions.
- [Events that trigger workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows), GitHub Docs. The `schedule` event, cron syntax and when scheduled workflows are disabled.
- [Continuous integration](https://book.the-turing-way.org/reproducible-research/ci/), The Turing Way. A plain introduction to CI for researchers.
