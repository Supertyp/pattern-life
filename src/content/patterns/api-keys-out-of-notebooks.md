---
title: Keeping API keys out of notebooks
type: safety
cluster: notebooks
problem: An API key typed into a notebook cell ends up in saved outputs, shared copies and git history, where anyone who finds it can use it in your name.
appliesWhen:
  - your notebook calls an api that needs a personal key or token
  - you plan to share the notebook, push it to github or run it on binder
  - more than one person or machine runs the same notebook
authors: [Pattern Life team]
published: 2026-11-13
related: [polite-api-harvesting, notebooks-in-git, sensitive-data-in-notebooks, binder-ready-repository, test-notebooks-in-ci]
---

## Summary

This pattern is for anyone whose notebook needs a key to use an API, such as a historian harvesting newspaper articles from Trove or an RSE pulling records from Europeana. It describes how to keep the key out of the notebook file so that you can share the notebook freely, and what to do when a key leaks anyway.

| Recommendation | Why? |
| --- | --- |
| Read the key from an environment variable, kept in a `.env` file that git ignores, and commit a `.env.example` with the names but no values. | The notebook can be shared as it is. Each person supplies their own key, and the example file tells them which ones they need. |
| Stop with a clear message when the key is missing. | Someone running your notebook for the first time learns what to set up, instead of puzzling over a "401 Unauthorized" error ten cells later. |
| Never display a key, or a request URL that contains it, in a cell's output. | Outputs are saved inside the `.ipynb` file, so a printed key travels with every copy, even after you delete the cell. |
| On Binder, in CI and on Colab, use each service's own secrets mechanism or ask for the key at run time. | A `.env` file isn't there on a shared or temporary machine, and copying it there exposes it. |
| If a key leaks, revoke or regenerate it first, then clean up the files and history. | Once a key is public you can't know who copied it. A new key makes the old one useless, which deleting the commit doesn't. |

## Context

This pattern suits any notebook that talks to an API needing a personal key or token: Trove, Europeana, DigitalNZ, social-media APIs, cloud storage, or a large language model service you pay for by use.

It does not suit high-stakes credentials, such as the password to a database of interview transcripts. Those belong in your institution's password manager, and the data needs the care described in [Handling sensitive data in notebooks](../sensitive-data-in-notebooks/).

There's a trade-off between convenience and safety. Pasting the key into a cell is quicker for a one-off experiment, and a `.env` file is still a plain-text file on your laptop. This pattern accepts that small risk because it removes the much larger one: a key published by accident.

## Usage

**Setting it up:** install `python-dotenv` and create a file called `.env` in the project folder with lines such as `TROVE_API_KEY=abc123`. Add `.env` to `.gitignore` before you create the file, so it can never be committed by mistake (see [Keeping notebooks in git](../notebooks-in-git/)). In R, the same job is done by a `.Renviron` file and `Sys.getenv()`. The first code cell of the notebook then looks like this:

```python
import os
from dotenv import load_dotenv

load_dotenv()  # reads .env from this folder or a parent folder
TROVE_KEY = os.getenv("TROVE_API_KEY")
if not TROVE_KEY:
    raise RuntimeError("Set TROVE_API_KEY in a .env file (see .env.example).")
```

**Keeping it out of outputs:** don't end a cell with the key's variable name, and don't print the full request URL when an API, like Trove's, takes the key as a URL parameter. Error messages from `requests` often include the URL, so a failed request can display the key too. Where an API accepts the key in a request header, use that instead. Before you share, search the saved file for the start of your key.

**Sharing and running elsewhere:** never put a key in a public Binder repository. Binder sessions are public and temporary, so readers enter their own key in an input box or a `getpass()` prompt instead (see [Making a repository Binder-ready](../binder-ready-repository/)). On GitHub Actions, store the key as a repository secret and pass it to the job as an environment variable. Google Colab has a Secrets panel in its sidebar for the same purpose.

**When a key leaks:** go to the provider's site and revoke or regenerate the key straight away, then update your `.env` file. Rewriting git history comes second, because it doesn't reach copies that others already have. GitHub's secret scanning also warns about known key formats in public repositories and can block a push that contains one.

## References

- [python-dotenv](https://saurabh-kumar.com/python-dotenv/), python-dotenv project. Documentation for loading a `.env` file into environment variables, including from IPython.
- [Using the API](https://trove.nla.gov.au/about/create-something/using-api), National Library of Australia (Trove). How to apply for a personal Trove API key, which you should keep to yourself.
- [Removing sensitive data from a repository](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository), GitHub Docs. Explains why you revoke or rotate a leaked secret before rewriting history.
- [Secret scanning](https://docs.github.com/en/code-security/concepts/secret-security/secret-scanning), GitHub Docs. How GitHub detects keys pushed to repositories and how push protection blocks them.
