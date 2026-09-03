# Bramble & Fig, a demo storefront for scriptlock

Bramble & Fig is a fictional coffee shop. Nothing is for sale, the payment fields are disabled, no payment can be made and no data is collected. The shop exists to show one thing that is hard to demonstrate any other way:

**a script appears on the checkout page, and not one line changes in this repository.**

That is the everyday case. Marketing adds a pixel through the tag manager. The tag manager pushes it to the container. The container loads it on every page, including the one with the payment fields. There is no commit, no pull request, no deploy and nothing to review. The next time anyone looks at the repository, it says exactly what it said yesterday.

- Storefront: <https://vladimirnizovtsev.github.io/scriptlock-demo-shop/>
- The watched page: <https://vladimirnizovtsev.github.io/scriptlock-demo-shop/checkout.html>
- The tool: <https://github.com/vladimirnizovtsev/scriptlock>

## How it is wired

Three origins, on purpose, because that is how a real checkout is assembled:

| What | Where it lives | Who can change it |
|---|---|---|
| The storefront and the checkout page | this repository, deployed to GitHub Pages | anyone with a reviewed pull request |
| The tag container | [scriptlock-demo-tags](https://github.com/vladimirnizovtsev/scriptlock-demo-tags/blob/main/container.js), published on its own | whoever owns the tag manager, without touching this repository |
| The vendor tags | the same tags repository, served from `cdn.jsdelivr.net` | the vendor |
| The payment fields | a cross-origin frame on `rawcdn.githack.com` | the payment provider |

The container stands in for a tag manager: a separate system, with its own publish flow, that decides what runs on your pages. Changing it touches nothing here. This repository, its pull requests, its CI and its deploy all stand still while the checkout page starts executing something new.

One honest caveat about the demo rig: the container is served from the same GitHub Pages host as the storefront, because that host invalidates its cache predictably and the demo has to be reproducible. In a real deployment the container comes from the tag manager's own domain. Nothing else about the demonstration depends on that: the script that appears is loaded from a genuinely third-party CDN, and the manifest treats the container as third-party code by policy rather than by hostname.

The vendor tags are fictional and collect nothing: an analytics script that loads a second file of its own, a chat widget that loads its runtime, an A/B script that rewrites the headline, and a payment provider stand-in served in a cross-origin frame.

## What the check does

[`.github/workflows/scriptlock.yml`](.github/workflows/scriptlock.yml) runs two jobs, and the difference between them is the point.

`gate` runs on every pull request. It catches a script that a change in this repository would add, before it ships.

`drift` runs on a schedule and on demand. It catches a script that appeared on the deployed page while this repository stood still. That is the job that goes red in the demo.

Both compare a live scan against [`scriptlock.lock.yaml`](scriptlock.lock.yaml), which is reviewed here like any other file. Every entry carries an owner, a category, a written justification, who approved it and when.

## The scope model, visible in the manifest

The payment fields are served in a cross-origin frame from `raw.githack.com`, which [`scriptlock.config.yaml`](scriptlock.config.yaml) marks as a payment provider. Scripts inside that frame get `tpsp` scope: they are inventoried and shown, but the deploy gate does not fail on them, because under the PCI SSC responsibility split the provider owns what runs inside its own frame and the merchant owns the page around it (March 2025 information supplement, Table 3). Everything on the page outside that frame is `merchant` scope and is gated.

## Reproducing the red check

1. Open [`container.js`](https://github.com/vladimirnizovtsev/scriptlock-demo-tags/blob/main/container.js) in the tags repository and add one line to the `TAGS` array:

   ```js
   'https://cdn.jsdelivr.net/gh/vladimirnizovtsev/scriptlock-demo-tags@main/audience-pixel.js'
   ```

2. Save it. Do not touch this repository.
3. Run the `scriptlock` workflow from the Actions tab, or wait for the schedule.
4. The `drift` job fails and the job summary names the script, the host it came from and the script that pulled it in.

Remove the line again and the next run is green.

## What the red run actually said

Run [#5](https://github.com/vladimirnizovtsev/scriptlock-demo-shop/actions/runs/33719635764) of the `drift` job, after one line was added to the container and nothing else anywhere:

```
FAIL (1)
  new            https://cdn.jsdelivr.net/gh/vladimirnizovtsev/scriptlock-demo-tags@main/audience-pixel.js [merchant]
                 unapproved external script in merchant scope (JSDelivr CDN), loaded by
                 https://vladimirnizovtsev.github.io/scriptlock-demo-tags/container.js

INFO (1)
  changed        https://vladimirnizovtsev.github.io/scriptlock-demo-tags/container.js [merchant]
                 body changed under track policy (informational): 5523efa46248 -> f7708b31366e

summary: 1 fail, 0 warn, 1 info; exit code 1 (findings at fail severity)
```

Three things in that output are the reason the tool exists.

It names the script, not just the fact that something changed. It says which scope it ran in, so a script inside the payment provider's frame would not have been treated the same way. And it says **what loaded it**: the container, by name. The person reading the failed check does not have to guess where to look, and the fix is either to remove the tag or to add it to the manifest with an owner and a written justification, in a pull request somebody approves.

The informational line underneath is the container itself: its body changed, which is expected, so it is recorded and not failed. That is the `track` policy doing its job, and it is why the manifest treats vendor code differently from first-party code.

The run also uploads `.scriptlock/` as an artifact: the snapshot, the diff and the history index. That is the evidence a scheduled check has to leave behind if anyone is ever going to ask what it saw and when.

## Honest notes

The vendor scripts here are fictional and harmless. A real skimmer in that position would read the payment fields, and would be no more visible in this repository than the pixel is.

A scheduled scan is a sample, not a guarantee: there is a window between runs, and a script that hides from automation will not be in the inventory. scriptlock states this in its own README and so does this demo.

Apache-2.0. Bramble & Fig is fictional and is not a real business.
