---
# Filled in by the reporter
title: Editor freezes when saving a large file
severity: high
steps: |
  1. Open a file larger than 10 MB.
  2. Press Ctrl+S.
  3. The window stops responding for about 30 seconds.
expected: The file saves within a second.
build: "2024.10.0"
regression: "true"
---

# Bug report

**Title**: ___@title

@severity: [select options="low,medium,high,critical" required]

## Reproduction

@steps: [textarea rows=6]

Expected result: ___@expected[text placeholder="What should happen?"]

Build: ___@build, regression: ___@regression[select options="true,false"]

## Log

```text
2024-10-02 10:14:03 WARN  save blocked on ___@lock (held by indexer)
@retry: [3 attempts]
```

Use `___@title` style markers only inside code when quoting a template.
