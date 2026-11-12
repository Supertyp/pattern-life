---
title: Sensitive data in notebooks
type: safety
cluster: notebooks
problem: Personal or culturally sensitive data slips out of a project through notebook outputs, git history or a public Binder link, often without the researcher noticing.
appliesWhen:
  - your data includes people's names, contact details, interviews or survey answers
  - your data includes culturally sensitive material or data about indigenous peoples
  - you share notebooks through git, github, binder or email
authors: [Pattern Life team]
published: 2026-11-13
related: [notebooks-in-git, api-keys-out-of-notebooks, binder-ready-repository, raw-data-read-only, data-provenance-notes]
---

## Summary

This pattern is for researchers and research software engineers whose notebooks touch personal or culturally sensitive data. It describes where such data leaks from a notebook project and how to keep it inside the place it is allowed to be.

| Recommendation | Why? |
| --- | --- |
| Clear the outputs of notebooks that display sensitive data before you commit or share them. | A `.ipynb` file saves every printed table, preview and chart inside the file, so `df.head()` on interview data puts real names into git and email. |
| Keep sensitive data out of the repository altogether: list its folder in `.gitignore` and store it where your ethics approval says. | Git keeps everything you ever committed. Deleting a file later doesn't remove it from the history, and a public push can be copied within minutes. |
| Never put sensitive data, or a repository that fetches it, on mybinder.org or other public services. | mybinder.org is a free public service. Launches are logged publicly and its guidelines say not to share sensitive or personal data there. |
| Follow the CARE principles and talk to the community when data concerns Indigenous peoples. | Indigenous communities have the right to control data about them. Open sharing that suits other data can cause real harm here. |
| Share a de-identified or synthetic sample for others to run your notebooks. | Reviewers and readers can still rerun the code without seeing anyone's personal details. |

## Context

This pattern suits a linguist with recorded interviews, a sociologist with survey responses that include free-text answers, an oral historian, or a digital humanist working with records about Aboriginal and Torres Strait Islander people. It also suits an RSE harvesting social-media posts, which often name private individuals.

It does not suit data that is already fully public and carries no ethical conditions, such as out-of-copyright newspaper articles about public events. Even then, historical records can name living people, so a quick check before publishing is worth it.

There's a trade-off between openness and protection. Funders and journals ask for open data and rerunnable notebooks, but consent forms, ethics approvals and community agreements may forbid it. When they clash, the approval and the community's wishes come first. Share the code, describe the data and explain how to apply for access.

## Usage

**Stripping outputs:** in JupyterLab, use "Edit > Clear Outputs of All Cells" before saving a notebook you'll share. To make it automatic, install nbstripout in the project and run `nbstripout --install`, which sets up a git filter that removes outputs on every commit while leaving your working copy alone. See [Notebooks in git](../notebooks-in-git/) for when you might keep outputs on purpose. The same care applies to API keys (see [API keys out of notebooks](../api-keys-out-of-notebooks/)).

**Keeping data out of git:** put sensitive files in a folder such as `data/restricted/` and list it in `.gitignore` before the first commit. Store them on encrypted institutional storage. Record in your provenance file where they live and what conditions apply (see [Recording data provenance](../data-provenance-notes/)). If something has already been pushed, deleting it isn't enough: follow GitHub's guide to rewriting history with `git filter-repo`, contact GitHub support to clear cached copies, and tell your ethics office or data custodian.

**Choosing where it runs:** a [Binder-ready repository](../binder-ready-repository/) should use only open or synthetic data. Google Colab and other cloud notebooks upload your data to a third party, which your ethics approval may not allow, so check first. Your institution or the ARDC Nectar Research Cloud may offer a JupyterHub that does meet the requirements.

**Indigenous and culturally sensitive data:** in Australia, read the AIATSIS Code of Ethics and the Maiam nayri Wingara principles alongside CARE. Find out who has authority over the material, which may be a community rather than the archive that holds it. Some items, such as images of people who have died, may need warnings or should not be shown at all.

## References

- [The CARE Principles for Indigenous Data Governance](https://doi.org/10.5334/dsj-2020-043), Data Science Journal (Carroll et al., 2020). Sets out collective benefit, authority to control, responsibility and ethics for data about Indigenous peoples.
- [Maiam nayri Wingara principles](https://www.maiamnayriwingara.org/mnw-principles), Maiam nayri Wingara Indigenous Data Sovereignty Collective. The Australian principles for Aboriginal and Torres Strait Islander data sovereignty.
- [Usage guidelines](https://mybinder.readthedocs.io/en/latest/about/user-guidelines.html), mybinder.org documentation. Explains that launches are public and warns never to share sensitive or personal data or API keys on mybinder.org.
- [Removing sensitive data from a repository](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository), GitHub Docs. How to purge files from git history with `git filter-repo` and what can't be undone after a push.
- [nbstripout](https://github.com/kynan/nbstripout), GitHub (kynan). A tool that strips outputs from notebooks automatically as a git filter.
