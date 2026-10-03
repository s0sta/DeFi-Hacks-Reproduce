# Academy + Past — Survey (DeFiHackLabs tutorials & historical reports)

> File inventory with one-line content summaries. Sources: `repo/academy/` (62 files) + `repo/past/` +
> `repo/script/` + top-level docs. Surveyed 2026-10-03. This file supersedes the earlier stub version.

## Top-level docs (brief)

- `CONTRIBUTING.md` (144 lines) — Contribution guide: add incidents via the interactive `python add_new_entry.py` CLI (network selection, tx-hash timestamp extraction, lost amount, link references); it auto-generates the PoC `.sol` from a template, updates README "List of DeFi Hacks & POCs" + TOC, and adds RPC endpoints to foundry.toml; PR workflow + formatting rules.
- `foundry.toml` (42 lines) — Foundry config: `src='src'`, `evm_version='shanghai'`, fs read on `./`, 15 `[rpc_endpoints]` (mainnet, blast, optimism, fantom, arbitrum, bsc, moonriver, gnosis, avalanche, polygon, celo, base, linea, mantle, sei) + `[fmt]` style rules (line_length 120, double quotes, etc.).
- `README.md` (1,897 lines) — Master hack table "List of Past DeFi Incidents" (701 rows → fully catalogued in `hack-links-catalogue.md`) + detailed 2026 PoC section + debugging-tool/signature-DB/useful-tools/hacks-dashboard links + academy index.
- Other top-level: `add_new_entry.py` (37 KB interactive entry CLI), `test.py` (41 KB batch forge-test runner), `requirements.txt` (1 line), `remappings.txt`, `foundry.lock`, `.gitmodules`, `.prettierrc`, `AudiusPocGasReport.gif`.

## academy/ — Web3 Cybersecurity Academy (also on Substack)

Structure: each lesson has a root `readme.md` (Chinese original) plus `en/` (and sometimes `es/ ja/ ko/ kr/ vi/`) translations of the same lesson. 62 markdown files total.

- `academy/readme.md` — Academy index: 4 tracks (OnChain debugging ×7, Solidity ×3, User awareness ×8, Move ×2) with zh/en links.
- `academy/move/01_move_sec_intro/readme.md` (159 ln) — Move Security 1: Move 語言安全性解析 (zh) by Numen Cyber: why Move is a smart-contract language "game changer".
- `academy/move/01_move_sec_intro/en/readme.md` (309 ln) — Lesson 1 (en): Security Analysis of the Move Language by Numen.
- `academy/move/02_move_power/readme.md` (503 ln) — Move Security 2: Move Prover 教程 (zh) by MoveBit: formal verification of Aptos contracts with the Move Prover.
- `academy/move/02_move_power/en/readme.md` (573 ln) — Lesson 2 (en): Verify Smart Contracts in Aptos with the Move Prover, Pt.1 by MoveBit.
- `academy/onchain_debug/01_tools/readme.md` (124 ln zh) + `en/` (121) `es/` (122) `ja/` (113) `ko/` (124) `vi/` (122) — Lesson 1 "Tools" by Sun (1nf0s3cpt): overview of on-chain tx-debugging tools (Phalcon, Tenderly, …) and workflow.
- `academy/onchain_debug/02_warmup/readme.md` (144 ln zh) + `en/` (160) `es/` (113) `ja/` (160) `ko/` (160) — Lesson 2 "Warm up" by Sun: step-by-step warm-up exercise tracing a real transaction.
- `academy/onchain_debug/03_write_your_own_poc/readme.md` (589 ln zh) + `en/` (571) `es/` (573) `ja/` (577) `ko/` (575) — Lesson 3 "Write Your Own PoC (Price Oracle Manipulation)" by h0wsO1: hands-on oracle-manipulation PoC.
- `academy/onchain_debug/04_write_your_own_poc/readme.md` (77 ln zh) + `en/` (74) `es/` (76) `ja/` (84) `kr/` (76) — Lesson 4 "Write your own POC — MEV Bot" by Sun: building a PoC for an MEV-bot scenario.
- `academy/onchain_debug/05_Rugpull/readme.md` (71 ln zh) + `en/` (77) `es/` (81) `ja/` (77) — Lesson 5 by Numen Cyber: Rugpull analysis of CirculateBUSD ($2.27M loss, 2023-01-12; admin `startTrading` + unverified `SwapHelper.swaptoToken` drained funds).
- `academy/onchain_debug/06_write_your_own_poc/readme.md` (211 ln zh) + `en/` (214) `es/` (216) `ja/` (216) — Lesson 6 "Write Your Own PoC (Reentrancy)" by gbaleeee: hands-on reentrancy PoC.
- `academy/onchain_debug/07_Analysis_nomad_bridge/readme.md` (307 ln zh) + `en/` (334) `es/` (342) `ja/` (342) — Lesson 7 by gmhacker.eth: Nomad Bridge hack analysis (Aug 2022, ~$190M) incl. the copycat attack wave.
- `academy/solidity/01_audit/readme.md` (123 ln zh) + `en/` (122) — Lesson 1 by Sm4rty: smart-contract audit methodology & tips + audit resources.
- `academy/solidity/02_first_deposit/readme.md` (147 ln zh) + `en/` (146) — Lesson 2 by Akshay Srivastav: First Deposit Bug in CompoundV2 and forks (share-inflation attack; educational, fixed upstream).
- `academy/solidity/03_lsd_audit/readme.md` (123 ln zh) + `en/` (119) — Lesson 3 by QuillAudits: auditing guidelines for liquid-staking protocols (withdrawals, rounding, external calls, fee logic, loops, structs, lock periods).
- `academy/user_awareness/01_handbook/readme.md` (205 ln zh) + `en/` (172) — Lesson 1 by SlowMist: blockchain dark-forest self-rescue handbook (wallet safety).
- `academy/user_awareness/02_CommonScam/readme.md` (281 ln zh) + `en/` (353) — Lesson 2 by XREX Security Team: nine common Web3 hacks & scams catalog.
- `academy/user_awareness/03_HoneyPot/readme.md` (94 ln zh) + `en/` (94) — Lesson 3 by GoPlus Security: new honeypot-token scams — code patterns and how to spot them.
- `academy/user_awareness/04_NFTScam/readme.md` (165 ln zh) + `en/` (143) — Lesson 4 by Scam Sniffer: NFT airdrop-phishing case study (targeted holders; 21 CloneX / 168 ETH stolen).
- `academy/user_awareness/05_Address_poisoning/readme.md` (100 ln zh) + `en/` (104) — Lesson 5 by SlowMist: same-tail-address airdrop poisoning scam.
- `academy/user_awareness/06_Report_stolen/readme.md` (209 ln zh) + `en/` (217) — Lesson 6 by Beosin: what to do when crypto is stolen — case examples (Bo Shen $42M) + reporting/legal guidance.
- `academy/user_awareness/07_offline_sign/7-1/readme.md` (178 ln zh) + `en/` (177); `7-2/readme.md` (221 ln zh) + `en/` (217) — Lesson 7 parts 1–2 by ZenGo Wallet: how offline signatures can drain your wallet + safe practices.
- `academy/user_awareness/08_Anti_phishing_plugin/readme.md` (363 ln zh) + `en/` (403) — Lesson 8 by SlowMist: how to choose an NFT anti-phishing browser plugin.

## past/ — per-year incident writeup indexes (1 file per year)

Each year file is a single `README.md`: a TOC plus per-incident sections (`### YYYYMMDD Name — root cause`, `#### Lost:`, forge test command, `#### Contract`, `#### Link reference`).

- `past/2021/README.md` (1,175 lines) — 2021 + pre-2021 index. TOC lists **102** entries, but only **51** dated detail sections exist (37 of 2021 + 14 pre-2021: 2020×9, 2018×3, 2017×2); the other ~51 TOC anchors are dangling (no writeup in this file). Matches the main README's 2021 (37) + "Before 2020" (14) rows = 51.
- `past/2022/README.md` (3,106 lines) — 2022 index. TOC lists **260** entries, **129** dated detail sections; ~131 TOC anchors are dangling. Matches the main README's 2022 rows = 129.
- Out of this survey's scope but present: `past/2023/README.md` (4,850 lines / 432 TOC rows), `past/2024/README.md` (3,381 / 190), `past/2025/README.md` (1,591 / 97) — same structure (presumably covered by `out-repo/exploits/batch-*.md`).

## script/ — exploit templates (2 files)

- `script/Exploit-template.sol` — Foundry PoC template: `@KeyInfo` header (Total Lost, Attacker, Attack/Vulnerable Contract, Attack Tx) + `forge-std/Script.sol` import; fill-in per incident.
- `script/Exploit-template_new.sol` — Newer variant importing `../src/test/basetest.sol` (shared harness), same `@KeyInfo` header with placeholder addresses.

## Other non-test directories

- `.github/workflows/PRAutoTest.yml` — CI: on PRs touching `src/test/*_exp.sol`, runs the Foundry test profile (submodules recursive).
- `.github/ISSUE_TEMPLATE/poc-request.md`, `feature_request.md`, `bug_report.md` — issue templates.
- Excluded per instructions: `lib/` (vendored submodules) and `src/` (PoC test directory: `Poc-template.sol`, `RPCS_alive_test.sol`, `test/…`).

## Cross-reference with hack-links-catalogue.md

The catalogue holds all **701** master-table rows. Year-README TOCs (102+260+432+190+97 = 1,081) over-list
relative to written writeups; the master README's 701 rows correspond to the writeups that actually exist,
so the catalogue is the accurate "what's really documented" list.
