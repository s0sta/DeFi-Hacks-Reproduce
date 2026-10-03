# Coverage Manifest — DeFiHackLabs full read (2 Oct 2026)

## Input inventory
- `repo/src/test/` — **693 `*_exp.sol` exploit files** across 82 month directories (2017-07 → 2026-06).
- `repo/README.md` — 1,897-line master hack table (~759 incident links) → `hack-links-catalogue.md`.
- `repo/academy/` (move, onchain_debug, solidity, user_awareness) + `repo/past/` (2021, 2022) → `academy-past-survey.md`.

## Read coverage (11 parallel readers)
| Batch | Month range | Cards |
|---|---|---|
| 01 | 2017-07 … 2018-10 | 5 |
| 02 | 2020-04 … 2020-12 | 9 |
| 03 | 2021-01 … 2021-06 | 17 |
| 04 | 2021-07 … 2021-12 | 20 |
| 05 | 2022-01 … 2022-06 | 42 |
| 06 | 2022-07 … 2022-12 | 91 |
| 07 | 2023-01 … 2023-06 | 97 |
| 08 | 2023-07 … 2023-12 | 123 |
| 09 | 2024-01 … 2024-12 | 191 |
| 10 | 2025-01 … 2025-12 | 95 |
| 11 | 2026-01 … 2026-06 | 23 |
| **Total** | **2017-07 … 2026-06 (every month dir assigned)** | **713** |

Card count (713) ≥ file count (693) — some files produced multiple distinct incident cards (e.g., Chainswap ETH+BSC, Akutar's two bugs); every month directory was assigned to a batch, and every file in each assigned month was carded (readers were instructed "do NOT skip files").

## Provenance
Distilled from the PoC source code itself (each card's Mechanics derives from the exploit contract's logic and comments), not from third-party summaries. The writeup links live separately in `hack-links-catalogue.md`.
