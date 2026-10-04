# s0sta — DeFi Exploit Research Archive

> 🌐 **Live website:** [s0sta.github.io/DeFi-Hacks-Reproduce](https://s0sta.github.io/DeFi-Hacks-Reproduce/) — searchable, filterable, with the leaderboard of the largest hacks.

> A professional research archive of **863 DeFi exploit incidents** (2017–2026): every incident documented with its date, chain, root-cause class, exploit mechanics with the real numbers, the transferable lesson, and the aftermath.

## Why this archive exists
This archive turns eight years of DeFi loss events into a working reference: read an incident, learn the exact flaw, and apply the lesson to the next audit. Organized so a researcher can learn from it in minutes.

## Structure

| Section | Content |
|---|---|
| `database/` | **713 incident cards**, time-ordered in 11 period files — the full incident database |
| `analyses/` | **155 deep-dive analyses** in 16 volumes — the landmark hacks, with mechanics, numbers, and aftermath |
| `INDEX.md` | Master index of all 863 incidents — jump straight to any protocol |
| `catalogue.md` | 701-row incident catalogue (date · protocol · vulnerability summary) |
| `leaderboard.md` | The 308-entry leaderboard of the largest hacks |
| `coverage.md` | Coverage statistics and how each section was compiled |
| `pending-retrieval.md` | Incidents whose primary writeups are offline, kept for a later retrieval pass |

## How to learn from it
1. **By class** — grep a root-cause class across the archive (e.g. `grep -l "oracle" database/*.md`) and read the cluster of matching incidents; the pattern emerges fast.
2. **By time** — the `database/` files are time-ordered: watch how the attack classes evolve (access-control and reentrancy dominated 2021-22; oracle/flashloan peaked 2022-23; recent years shift to novel protocol-logic flaws).
3. **Before auditing any protocol** — find its category in `INDEX.md`, read the 3-5 closest incidents, and use their lessons as your first audit checklist.

## Root-cause taxonomy used throughout
access-control · reentrancy · oracle manipulation · flashloan · price manipulation · rounding/precision · integer overflow · infinite-mint · governance · bridge · signature validation · business logic · misconfiguration · token logic

---

*Compiled by **s0sta**.*
