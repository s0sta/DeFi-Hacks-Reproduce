# Analyses — Volume 14

> Procedure: every slug was re-attempted on the live site (2 retries, 2s delay, `Mozilla/5.0` UA),
> Live site returned the Vercel 500 page for **all 86** slugs (deterministic route-level 500s, not rate limiting).

## bZx — 2021-11-06 — ~$55M
- Chain/Attack vector: Polygon + BSC (exit/collateral leg on Ethereum); phishing-compromised developer personal wallet (mnemonic) that controlled the protocol's Polygon/BSC deployments — no smart-contract flaw.
- Root cause: A single developer EOA held admin control over bZx's Polygon and BSC deployments. The dev opened a phishing email's Word attachment containing a malicious macro on a personal computer, which ran a script and leaked the wallet mnemonic. The entire cross-chain deployment was one personal wallet away from full control — no multisig, no key separation between personal devices and protocol admin keys.
- Mechanics: With the compromised keys the attacker drained BZRX from the protocol contracts, then updated the contract code to extract tokens from any wallet that had granted token approvals to the affected contracts (approval-sweep upgrade). To get around the liquidity problem of dumping a huge BZRX bag, the attacker bridged stolen BZRX to Ethereum and used it as collateral to borrow a variety of other assets — lower profit per token, but liquid. SlowMist's running total reached ~$55M at time of writing; ~10 hours after the initial announcement, bZx confirmed the phishing vector while stressing "the code itself hadn't been compromised".
- Lesson: (1) Protocol admin rights must never sit in a single personal EOA — hardware-custodied multisig key separation for every chain deployment, with personal machines treated as outside the trust boundary. (2) Phishing a dev's personal machine is a full protocol-kill vector: team-member OPSEC is part of the attack surface, and after any admin-key incident users must be pushed to revoke token approvals, because the follow-up upgrade can sweep every existing allowance.
- Aftermath: bZx's fourth major incident ("4th time's the charm") — after the Feb 2020 flash-loan exploits ($298k + $645k, the first flash-loan attacks in DeFi history) and a Sept 2020 $8M incident later returned. Community replies were "exasperation rather than shock" ("What is this like 4th time?", "Y'all ngmi"); bZx asked Circle to freeze USDC and confirmed Binance froze funds/USDT, and offered to "chat and reach an agreement" with the hacker. Debut entry on the leaderboard, straight into the top 10.

---

**Wayback fetch returned "not archived" (37):** avalanche-rekt, axie-rekt, aztec-network-rekt, beefy-rekt, bent-finance-rekt, bibi-rekt, binance-rekt, bitsane-rekt, poly-rekt, prism-rekt, pulse-rekt, pwn-rekt, qbridge-rekt, qredo-rekt, rari-rekt, retreeb-rekt, ribbon-rekt, ripae-rekt, rocket-rekt, saddle-rekt, sashimi-rekt, sentiment-rekt, shell-rekt, silo-rekt, solana-rekt, sphere-rekt, splinter-rekt, storm-rekt, swing-rekt, swych-rekt, t-rekt, tBTC-rekt, tokenlon-rekt, turtle-rekt, unmarshal-rekt, vesta-rekt, viabtc-rekt

**Wayback fetch returned "not archived" (12, verification pass after archive.org throttling):** bitkeep-rekt, bitrue-rekt, blackhat-rekt, blur-rekt, polygon-rekt, polynetwork2-rekt, robinhood-rekt, safe-rekt, thalia-rekt, umbra-rekt, vires-rekt, vow-rekt

**Wayback CDX API: zero snapshots (35):** babylon-rekt, bancor-rekt, bella-rekt, beosin-kyber-rekt, big-whale-rekt, bigfoot-rekt, bitcoin-rekt, bitdao-rekt, bogged-rekt, bonqdao-rekt, platypus-rekt, platypus2-rekt, pluton-rekt, popcorn-rekt, punk-rekt, radiant-rekt, rarible-rekt, scream-rekt, serum-rekt, shark-rekt, spirit-rekt, stakehound-rekt, stellar-rekt, swan-rekt, tarot-rekt, teddy-rekt, teller-rekt, terra2-rekt, tether-rekt, torque-rekt, traderjoe-rekt, treasury-rekt, upbit-rekt, utopia-rekt, varen-rekt

**Archived but not an article (1):** sandbox-rekt (only snapshot is the site's own 404 page)

> Conclusion: the live-site 500s are deterministic route-level failures (removed from the data layer), not transient rate limiting, for 85 of 86 slugs. Only /bZx-rekt (case-insensitive wayback match on /bzx-rekt) resolved to a real article and is carded above.
