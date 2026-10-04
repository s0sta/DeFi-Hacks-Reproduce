# Analyses — Volume 12

Result: the live site still returns the Vercel 500 page (3120 bytes) for all 86 slugs; exactly one slug,
`/bZx-rekt/`, has a Wayback snapshot of a real article. 1 card written below; the other 85 slugs have no
Wayback capture under those names and remain dead — they are reported as failures (the wave-1 "transient
500" hypothesis holds only for bZx; the other 85 are stale/non-canonical slugs with no archived article).

## bZx — 2021-11-05 — ~$55M
- Chain/Attack vector: Polygon + BSC protocol deployments (stolen BZRX later bridged to Ethereum and posted as collateral to borrow other assets); private-key compromise via spear-phishing — no smart-contract flaw.
- Root cause: A bZx developer opened a phishing email attachment — a Word document with a malicious macro — on his personal computer; the macro ran a script that exfiltrated his wallet mnemonic. That personal EOA held admin control over bZx's Polygon and BSC deployments, so a single personal-wallet breach handed the attacker full control of both protocol deployments.
- Mechanics: The attacker used the compromised key to seize the contracts and drain their BZRX, then updated the contract code to extract tokens from any wallet that had granted approvals to the affected contracts. To sidestep the liquidity problem of dumping a huge BZRX stack, the stolen BZRX was sent to Ethereum and used as collateral to borrow a variety of other assets. SlowMist's running total reached ~$55M; bZx asked Circle to freeze the stolen USDC (USDT held on Binance was frozen quickly) and offered the hacker to "chat and reach an agreement".
- Lesson: (1) Production admin keys must never live on a personal device/EOA — any single key controlling protocol deployments is a full-drain primitive; enforce hardware wallets, multisigs and key separation for everyone with admin roles. (2) A compromised admin key converts instantly into a mass-drain of every user with standing token approvals — treat admin-key hygiene and approval-revocation UX as first-class audit findings, and treat any contract upgrade right after a key theft as a red flag.
