# DeFi-Hacks-Reproduce

> Curated knowledge base of **every DeFi exploit reproduced in DeFiHackLabs** (~713 incidents, 2017→2026), distilled into per-incident cards: protocol, date, chain, root-cause class, exploit mechanics, and the transferable hunting lesson.

## Contents
- `exploits/batch-01.md` … `batch-11.md` — **713 per-incident cards** (grouped by time period), each with Date/Chain/Class + Mechanics + Lesson.
- `hack-links-catalogue.md` — the master incident-link table (writeup links per incident).
- `academy-past-survey.md` — the repo's tutorials (academy/) + past reports inventory.

## How to use
- **By class**: grep a class name (e.g. `access-control`, `reentrancy`, `oracle manipulation`) across `exploits/`.
- **By year**: each batch file covers a time range; the cards carry dates.
- **Before auditing any protocol**: find the 3–5 closest past exploits in its category and apply their lessons as the first audit checklist.

## Source
Distilled from [s0sta/DeFiHackLabs](https://github.com/s0sta/DeFiHackLabs) (fork of SunWeb3Sec/DeFiHackLabs) — 693 exploit PoC files read end-to-end and distilled (2 Oct 2026).
