# Analyses — Volume 13

## KuCoin — 2020-09-26 — $150M official / up to $280M estimated
*source slug: kucoin-rekt (500) → resolved to epic-hack-homie*
- Chain/Attack vector: Centralized exchange — Ethereum hot-wallet private-key compromise plus 1,008 BTC swept; no smart-contract flaw.
- Root cause: Direct access to the hot-wallet private key ("unplanned movement of funds" on Sep 26, 2020) — rekt suspected an insider, since the funds were removed via key access rather than a brute-force attack and the laundering was unsophisticated. Single-custody-layer key failure at a CEX.
- Mechanics: The hacker drained the ERC-20 hot wallets (officially ≥$150M; estimates up to $280M as more wallets were linked) and 1,008 BTC. Over the next 24h the loot was laundered through Binance and Uniswap, selling everything for ETH: OCEAN and SNX sold first (the large market sells crashed both prices), then COMP, LINK, DIA — with ~160 different tokens still sitting in the wallet. Funds consolidated into two addresses: 0x00600423c03ec4b46f9b8a28c66d42bdd1b19c36 and 0xf519e276958c3ef2dffd9b6b2d87d26859526505. Token teams fought back via their emergency powers: Tether froze ~$22M USDT, while Velo (~$76M), Orion (~$10M), KardiaChain (~$10M), Ocean (~$9M), Ampleforth (~$9M), VIDT (~$7M), NOIA (~$5M), Aleph ($1.2M), Covesting ($600k), Opacity ($215k) and SilentNotary ($99k) forked, froze or blacklisted the stolen tokens. The hacker's BTC transaction carried the message "Epic Hack Homie - Not your keys not your coins".
- Lesson: (1) Exchange loss claims are checkable on-chain — KuCoin's "$150M" grew toward $280M as researchers linked more wallets, so always re-derive CEX drain totals from the addresses, and treat hot-wallet keys as the single point of failure they are (multisig/cold tiering is the only real mitigation). (2) After a CEX heist the incident-response surface is the token issuers: freeze/blacklist/fork powers (Tether, Velo, Ocean…) are what actually bounded the damage — map which of a protocol's listed assets can be frozen, and by whom, as part of CEX custody risk.
- Aftermath: The article's slug (/epic-hack-homie) is named after the hacker's own BTC broadcast — "Epic Hack Homie - Not your keys not your coins". rekt floated the insider theory (hot-wallet key access, not brute force, plus clumsy laundering) and noted the community pile-on to the hacker's address. Curve publicly pushed back on claims the hacker would have laundered better via DeFi, arguing decentralized protocols are *less* effective for laundering than centralized alternatives. KuCoin promised all funds would be returned, claiming full insurance coverage. Published Sep 29, 2020 — three days into a still-developing story.

### Resolved to a live slug (carded above)
/kucoin-rekt → /epic-hack-homie (fetched 200, carded)

### Dead on live + wayback, but the incident is already carded under its live slug in the first wave
/bunny-rekt → PancakeBunny carded as /pancakebunny-rekt (batch-07)
/coverage-rekt → Cover Protocol carded as /cover-rekt (batch-03)
/harvest-rekt → Harvest Finance carded as /harvest-finance-rekt (batch-05)
/heco-rekt → HECO Bridge/HTX carded as /heco-htx-rekt (batch-05)
/helio-rekt → Ankr & Helio carded as /ankr-helio-rekt (batch-01)
/hundred-rekt → Hundred Finance carded as /hundred-rekt2 (batch-05)
/indexed-rekt → Indexed Finance carded as /indexed-finance-rekt (batch-05)
/inverse-rekt → Inverse Finance (Apr 2022) carded as /inverse-finance-rekt (batch-05)
/inverse2-rekt → Inverse Finance (Jun 2022) carded as /inverse-rekt2 (batch-05)
/jimbos-rekt → Jimbo's Protocol carded as /jimbo-rekt (batch-05)
/kokomoswap-rekt → Kokomo Finance carded as /kokomo-finance-rekt (batch-05)
/kyber-rekt → KyberSwap Elastic carded as /kyberswap-rekt (batch-05)
/justin-sun-rekt → Justin Sun incidents already carded: Poloniex (batch-08), HTX + HECO (batch-05)

/bounce-rekt, /bprotocol-rekt (B.Protocol), /brahmapro-rekt (Brahma), /busd-rekt (Channels BUSD&USDC), /cNTR-rekt (Centaur), /carbonswap-rekt, /carrot-rekt (Carrot 2022-10-10), /cbridge-rekt (Celer cBridge DNS hijack), /cex-rekt (CEXISWAP 2023-09-21), /charge-defi-rekt, /chips-rekt, /citadel-rekt (CitadelFinance 2024-01-27), /cook-rekt, /crosswise-rekt, /cyberkongz-rekt, /ginnan-rekt, /gooddollar-rekt (GoodDollar 2023-12-16), /grin-rekt, /gyroscope-rekt, /h2o-rekt (H2O weak-random-mint 2025-03-14), /hackerone-rekt, /hackless-rekt, /helium-rekt, /hurricane-rekt, /impossible-rekt, /joepegs-rekt, /kado-rekt, /karura-rekt, /keyring-rekt, /kimchi-rekt, /lazarus-rekt (Lazarus Group has no dedicated article; coverage lives inside the Ronin/Axie/Harmony cards)
