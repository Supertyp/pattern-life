---
layout: ../layouts/PageLayout.astro
title: Contribute
description: Suggest a new pattern or improve an existing one.
---

Pattern Life grows through contributions. If you have a solution to an everyday problem that reliably works, we'd like to hear about it.

## Pattern template

Patterns link to each other instead of repeating each other. To link to another pattern inside the text, use a relative link with its id, for example `[Keeping knives sharp](../knife-sharpening/)`. Links appear automatically in both directions under "Related patterns", and the build fails if a link points to a pattern that doesn't exist.

Each pattern is a markdown file in `src/content/patterns/`. Copy the template below and fill it in.

```markdown
---
title: Short, descriptive name
type: process          # technique | process | preparation | safety | etiquette
cluster: kitchen       # id of a life area in src/content/clusters/
problem: One sentence describing the recurring problem.
appliesWhen:
  - first condition
  - second condition
authors: [Your Name]
published: 2026-11-10
related: [other-pattern-id]   # optional: ids of closely related patterns
---

## Summary

This pattern is for <who>. It describes <what the pattern covers>.

| Recommendation | Why? |
| --- | --- |
| What to do. | The reason it works. |

## Context

This pattern suits <situations>.

It does not suit <situations where it doesn't apply>.

There's a trade-off with <...>. <Explain the choice this pattern makes.>

## Usage

**First step:** ...

**Second step:** ...

## References

<Where to find more detail, such as a manual or official guidance.>
```
