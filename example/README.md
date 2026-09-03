# Example output

Kept here so the demo can be read without running anything.

- [`red-run-report.md`](red-run-report.md) is the markdown report from [run #7](https://github.com/vladimirnizovtsev/scriptlock-demo-shop/actions/runs/33723895231), the one that went red after a line was added to the tag container and nothing was changed in this repository. It is the file the action writes to the job summary.
- [`history-index.jsonl`](history-index.jsonl) is the run history index from the same artifact: one line per run, with the timestamp, the outcome and the counts. This is what a weekly cadence looks like as evidence. Exactly one line per run: scriptlock 0.1.0 wrote two, because the action ran the diff twice over one scan.

Both were downloaded from the run artifact, not written by hand.
