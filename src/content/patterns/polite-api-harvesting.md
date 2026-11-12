---
title: Harvesting from APIs politely
type: etiquette
cluster: notebooks
problem: A harvesting loop in a notebook can send thousands of requests in minutes, which strains small cultural institutions' servers, breaks their terms of use and gets your key or address blocked.
appliesWhen:
  - you collect more than a handful of records from a web api or website
  - the provider is a library, archive, museum or other public service
  - your harvest will run unattended or more than once
authors: [Pattern Life team]
published: 2026-11-13
related: [api-keys-out-of-notebooks, resumable-api-harvests, sample-before-full-run, data-provenance-notes, test-notebooks-in-ci]
---

## Summary

This pattern is for anyone who collects data from an API (a web address that returns data for programs rather than pages for people), such as a historian harvesting newspaper articles from Trove or an RSE building a pipeline on Europeana or the Internet Archive. It describes how to harvest in a way that the provider would be happy to see, so that the service stays available for you and everyone else.

| Recommendation | Why? |
| --- | --- |
| Read the terms of use and rate limits first, and look for a bulk download before you write a loop. | A ready-made data dump is faster for you and lighter for the provider, and the terms tell you what you may do with the data afterwards. |
| Identify yourself in the User-Agent header with your project's name and a contact address. | If your harvest causes trouble, the provider can contact you instead of simply blocking you. Some providers require it. |
| Pause between requests and stay well under the published limit. | GLAM institutions often run their APIs on modest budgets, and a steady pace never trips the limit in the first place. |
| Retry on 429 and 5xx errors with growing waits, honour `Retry-After`, and give up after a few attempts. | A server that is overloaded or telling you to slow down needs breathing space, not an immediate flood of retries. |
| Ask only for what you need, and never download the same thing twice. | Requesting fewer fields and larger pages, and keeping what you have already fetched, cuts the number of calls dramatically. |

## Context

This pattern suits harvests from the APIs of libraries, archives and museums (GLAM institutions), such as Trove, Europeana, DigitalNZ and the Digital Public Library of America, and from social-media or government APIs.

It does not suit scraping websites that offer no API and forbid automated access, which raises legal and ethical questions this pattern doesn't settle. It also doesn't replace your ethics approval when the records describe living people.

There's a trade-off between speed and courtesy. A polite harvest of a large Trove query can take hours instead of minutes. This pattern accepts that, and makes the wait painless by [resuming crashed harvests](../resumable-api-harvests/) and testing on a [small sample first](../sample-before-full-run/).

## Usage

**Before you start:** read the provider's terms. Trove's terms, for example, set a quota of calls per minute that comes with your key and say how reused data must be licensed and credited. Check whether a bulk route exists: Wikimedia publishes database dumps, the Internet Archive's `internetarchive` library downloads whole items, Trove has a `bulkHarvest` option for complete result sets, and many institutions offer OAI-PMH, a standard protocol for bulk metadata harvesting. Write the terms, date and query into your [provenance notes](../data-provenance-notes/).

**Setting up the session:** use one `requests.Session` with a descriptive User-Agent and automatic retries, then pause in your loop. urllib3's `Retry` grows the wait after each failure and honours the server's `Retry-After` header by default. In R, `httr2` offers the same with `req_user_agent()`, `req_throttle()` and `req_retry()`.

```python
import time, requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

session = requests.Session()
session.headers["User-Agent"] = "convict-letters-harvest/0.3 (https://github.com/your-name/project; your.name@example.edu)"
retry = Retry(total=5, backoff_factor=2, status_forcelist=[429, 500, 502, 503, 504])
session.mount("https://", HTTPAdapter(max_retries=retry))

for params in pages:
    response = session.get(API_URL, params=params, timeout=30)
    time.sleep(1)  # well under the quota
```

**Asking for less:** use the largest page size the API allows (100 records for Trove), request only the fields or facets you need, and save each response so that a rerun reads from disk rather than the network. The `requests-cache` package can do this transparently while you develop.

**Being reachable:** use a real address that you check. If the provider asks you to slow down or stop, do so and reply. Many GLAM API teams are small and keen to hear how researchers use their data.

## References

- [Trove API Terms of Use](https://trove.nla.gov.au/about/create-something/using-api/trove-api-terms-use), National Library of Australia. The per-minute call quota, licensing and attribution rules for Trove data.
- [Wikimedia Foundation User-Agent Policy](https://foundation.wikimedia.org/wiki/Policy:Wikimedia_Foundation_User-Agent_Policy), Wikimedia Foundation. Why scripts must send an informative User-Agent with contact details, and what happens if they don't.
- [429 Too Many Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/429), MDN Web Docs. What the "slow down" status code means and how it relates to the `Retry-After` header.
- [urllib3 Retry utilities](https://urllib3.readthedocs.io/en/stable/reference/urllib3.util.html), urllib3. Reference for `Retry`, including `backoff_factor`, `status_forcelist` and `respect_retry_after_header`.
- [Downloading Multiple Records Using Query Strings](https://programminghistorian.org/en/lessons/downloading-multiple-records-using-query-strings), Programming Historian. A beginner's lesson that pauses between downloads "to be kind" to the Old Bailey Online server.
