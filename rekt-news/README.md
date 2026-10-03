# REKT News — Distilled

> Deep-dive of rekt.news (phase 2, 3 Oct 2026): every reachable leaderboard analysis article distilled into per-incident cards, with rekt's narrative style preserved (chain/vector, root cause, mechanics with key numbers, transferable lesson, and the "who/how-detected/aftermath" narrative extras).

## Coverage
- **155 article cards** across `batch-01…11.md` + `retry-01…05.md` — each card: protocol · date · loss · chain/attack vector · root cause · mechanics · lesson · narrative extras.
- **~161 leaderboard slugs unreachable**: rekt.news currently serves HTTP 500 for them (broken links on the live leaderboard itself) and the Wayback Machine holds no snapshots (verified via the CDX API). They are catalogued in `unreachable-slugs.md` so a future retry is one command away.
- The leaderboard itself links 308 slugs; 155 distilled + ~161 unreachable = the full set accounted for.

## How to use
- Grep a class/protocol across the batch files (e.g. `grep -l "oracle" batch-*.md`).
- The REKT narrative extras give the incident-response angle (detection latency, who found it, aftermath) — useful for writing reports that mirror how triage thinks about real hacks.

## Known gaps (honest)
- rekt.news' older articles (pre-2022) are largely 500-broken on the live site with no Wayback snapshots; those incidents are still covered by the DeFiHackLabs card set in ../exploits/.
