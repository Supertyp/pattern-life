---
title: Making a repository Binder-ready
type: technique
cluster: notebooks
problem: Other people want to try your notebooks, but installing Python, the right packages and the data on their own computer stops most of them before they run a single cell.
appliesWhen:
  - your notebooks are in a public GitHub repository
  - readers, students or reviewers should be able to run them without installing anything
  - the notebooks run in a few minutes on modest data
authors: [Pattern Life team]
published: 2026-11-13
related: [pin-the-environment, notebooks-in-git, sensitive-data-in-notebooks, sample-before-full-run, archive-on-zenodo]
---

## Summary

This pattern is for researchers and RSEs who want others to open and run their notebooks in a web browser with one click. It describes how to prepare a GitHub repository for mybinder.org, what Binder can't do, and where to go when it isn't enough.

| Recommendation | Why? |
| --- | --- |
| Describe the environment in standard files, such as `requirements.txt` or `environment.yml`, ideally in a `binder/` folder. | Binder builds the software from these files, so a repository that only works on your laptop won't work on Binder either. |
| Add a "launch binder" badge to the README that opens a specific notebook. | Readers start where you want them to, instead of facing a bare file list. |
| Make the notebooks run on a small sample that ships with the repository or downloads quickly. | Sessions have only 1 to 2 GB of memory and shut down after about 10 minutes of inactivity, so a full harvest won't finish. |
| Keep secrets and sensitive data out, because every Binder launch is public. | Anyone can launch your repository, and Binder offers no private storage or safe place for API keys. |
| Test the Binder link yourself after each release, and know the alternatives. | Builds break when packages change, and some work needs more memory, privacy or time than mybinder.org gives. |

## Context

This pattern suits notebooks that accompany a paper, a lesson or a tool: a linguist's notebook that explores a few published interview transcripts, or a GLAM Workbench-style notebook that shows how to query the Trove or Europeana API.

It does not suit work on sensitive, licensed or very large data, long-running harvests, or anything that needs a private API key. See [Handling sensitive data in notebooks](../sensitive-data-in-notebooks/) before putting any personal or culturally sensitive material near a public service.

There's a trade-off between convenience and permanence. Binder is free and needs no account, but it's a shared public service run by volunteers and donated cloud time. Sessions are temporary, nothing you change is saved, and a build can fail years later when old packages are no longer available. Treat Binder as a way to try the work now, and an archive (see [Archiving on Zenodo](../archive-on-zenodo/)) as the way to keep it.

## Usage

**Configuring the repository:** Binder uses a tool called repo2docker, which reads standard configuration files and builds a container (a packaged copy of the software). For Python, a `requirements.txt` with pinned versions is usually enough; see [Pinning the environment](../pin-the-environment/). Use `environment.yml` if you need conda packages, `runtime.txt` to choose a Python version, `apt.txt` for system libraries and `postBuild` for extra setup steps. For R, add `install.R` and a `runtime.txt` that names the R version and the date of the package snapshot to install from. Putting these files in a `binder/` folder keeps them separate from your local setup, and Binder then ignores any configuration files elsewhere.

**Adding the badge:** the launch link has the form `https://mybinder.org/v2/gh/<user>/<repo>/HEAD`. Add `?urlpath=lab/tree/notebooks/01-explore.ipynb` to open a particular notebook in JupyterLab. mybinder.org has a form that generates the link and the badge Markdown for you. Point the badge at a release tag instead of `HEAD` if you want the link to match an archived version.

```markdown
[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/your-user/trove-harvest/HEAD?urlpath=lab/tree/notebooks/01-explore.ipynb)
```

**Working within the limits:** the first launch builds the image and can take several minutes, while later launches of the same version are faster. Include a small sample of data, or download it in the first cell (see [Developing on a sample first](../sample-before-full-run/)). Tell users in the notebook that their changes disappear when the session ends, and that they should download anything they want to keep.

**Alternatives:** some universities and research organisations run their own BinderHub or JupyterHub with logins, more memory and private data. In Australia, the ARDC Nectar Research Cloud gives researchers virtual machines where you can run your own Jupyter server. Google Colab opens notebooks straight from GitHub and offers more memory, but it needs a Google account, uses its own preinstalled packages (you add others with `%pip install` in a cell) and ignores your `requirements.txt`.

## References

- [Binder documentation](https://mybinder.readthedocs.io/en/latest/), Binder Project. How to prepare a repository, create launch links and badges, and troubleshoot builds.
- [Usage guidelines](https://mybinder.readthedocs.io/en/latest/about/user-guidelines.html), Binder Project. The memory and inactivity limits of mybinder.org, and why there are no private launches.
- [Configuration files supported by repo2docker](https://repo2docker.readthedocs.io/en/latest/configuration/), Project Jupyter. The full list of files Binder reads, including `install.R` and `apt.txt`.
- [Zero-to-Binder](https://book.the-turing-way.org/communication/binder/zero-to-binder/), The Turing Way. A step-by-step tutorial that makes a first Binder-ready repository in Python, Julia or R.
- [ARDC Nectar Research Cloud](https://ardc.edu.au/services/ardc-nectar-research-cloud/), Australian Research Data Commons. Cloud computing for Australian researchers when Binder's limits are too tight.
