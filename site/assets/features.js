// s0sta — DeFi Exploit Research Archive: curated audit knowledge
// Checklist categories + canonical bug patterns, grounded in the archive's incidents.

window.CHECKLISTS = [
{
  id: 'lending', name: 'Lending & Borrowing',
  patterns: [
    { t: 'Spot-pool price as collateral oracle', e: 'A pool whose reserves the attacker can move is used to price collateral — flash loans let the price be moved, then borrow against it.', ex: ['Hundred Finance', 'Venus', 'Moola Market'], ch: ['grep -rn "getReserves\\|price0Cumulative\\|TWAP" <repo>', 'Check every collateral price source: is it a Chainlink feed, a TWAP, or a live pool read?', 'Test: flash-loan the pricing pool by 20% — does max-borrow change?'] },
    { t: 'Donation / share-price inflation', e: 'Transferring tokens directly to a vault inflates its share price or the apparent balance, which an attacker redeems or borrows against.', ex: ['Venus THE', 'Curve LlamaLend', 'Balancer (2020)'], ch: ['grep -rn "balanceOf(address(this))" <repo> — every raw balance used in math is a donation surface', 'Check the first-depositor guard: virtual shares / MINIMUM_LIQUIDITY present?', 'Test: donate 1 token then deposit/redeem — any gain?'] },
    { t: 'Reward-accrual checkpoint missed', e: 'An action that changes a reward-earning position (merge, split, kill gauge, poke) skips the accrual/checkpoint update — rewards double-count or leak.', ex: ['Alchemix (16 criticals from one poke bug)', 'Yearn yDAI'], ch: ['For every position-mutating function: is _updateRewards / checkpoint called BEFORE the mutation?', 'grep -rn "function poke\\|function merge\\|function reset" <repo>'] },
    { t: 'Reentrancy in borrow / withdraw', e: 'ERC777/ERC721 callbacks or plain external calls after a stale health check let an attacker re-enter and borrow repeatedly against the same collateral.', ex: ['Lendf.Me', 'Cream Finance', 'Omni'], ch: ['grep -rn "safeTransferFrom\\|\.call(" <repo> — is state updated BEFORE every external call?', 'Check for nonReentrant on all borrow/withdraw/liquidate paths'] },
    { t: 'Bad-debt liquidation socializes losses', e: 'Insolvent-position fees are paid from a shared pool (fee vault, insurance fund) — mass insolvency drains it, or the fee math lets liquidators extract more than the position holds.', ex: ['Alchemix (calculateLiquidation outsourced fee)', 'Fluid Protocol'], ch: ['Trace the liquidation fee source when debt >= collateral', 'Test: insolvent position with feeBps=100% — who pays?'] },
    { t: 'Unguarded initializer', e: 'A proxy implementation or contract with a public initialize() and no initialized-guard lets anyone re-run init and take ownership.', ex: ['Harvest Finance', 'Parity', 'Audius'], ch: ['grep -rn "function initialize\\|function init" <repo> — is there an initializer modifier or a first-call guard?', 'For every proxy: can anyone call the implementation directly?'] },
    { t: 'Interest / index rounding', e: 'Index updates that floor or ceil in the protocol-favored direction compound over time, or an off-by-one lets users time deposits between accruals.', ex: ['Silo Finance', 'DFX (2-decimal token)'], ch: ['Derive the index update: which direction does rounding favor, and does it compound?', 'Test same-block deposit→accrue→withdraw'] }
  ]
},
{
  id: 'amm', name: 'AMM & DEX',
  patterns: [
    { t: 'Forked constant mismatch', e: 'A fork changes a constant (10000 vs 1000) and the invariant math silently breaks — classic death by copy-paste.', ex: ['Uranium Finance', 'NowSwap', 'Nimbus'], ch: ['Diff every math constant against the original protocol it was forked from', 'grep -rn "1e3\\|10000\\|1000" <repo> in pair/pool math'] },
    { t: 'Same-token pair price pump', e: 'A pair between a token and itself (or two correlated tokens) computes price from reserves — swapping the same token inflates it 1:1 and the pool values it as worth.', ex: ['MonoX ($31M)'], ch: ['Does the router reject tokenIn == tokenOut?', 'Check price = reserveA/reserveB when A and B are the same asset'] },
    { t: 'Missing slippage / minAmountOut = 0', e: 'Swap paths without a minimum-out let anyone sandwich the entire output — the user gets dust, the attacker gets the difference.', ex: ['AlchemistAllocator (minIntermediateOut:0 class)', 'Sushi/Uniswap clones'], ch: ['grep -rn "minAmountOut\\|amountOutMin" <repo> — any call site passing 0 or omitting the check?'] },
    { t: 'Fee-on-transfer / rebasing tokens', e: 'The contract books the full amount but receives less (or more) — the ledger desyncs from the real balance and the pool pays out other users\' funds.', ex: ['Multiple 2021-22 token exploits', 'SafeDollar'], ch: ['Does the contract support fee-on-transfer tokens? If yes: book balances by measured delta, never by the argument'] },
    { t: 'Emergency / burn path skips accounting', e: 'An emergencyBurn or migrate path moves funds without reconciling internal shares — deposit is counted twice.', ex: ['Eleven Finance ($4.5M)', 'PancakeBunny-family'], ch: ['grep -rn "emergency\\|burn\\|rescue" <repo> — does each path update shares/balances?', 'Test deposit→burn→withdraw: can you extract more than your deposit?'] },
    { t: 'Read-only reentrancy (stale view)', e: 'A view/try-catch pattern reads the pool state mid-callback, so the attacker re-enters against stale pricing.', ex: ['Curve (read-only reentrancy class)'], ch: ['Any external call between reading a price/balance and using it?', 'Add a transient reentrancy guard even for view-based flows'] },
    { t: 'LP share inflation / first depositor', e: 'A tiny first deposit + donation rounds the share price so later depositors mint 0 shares or lose value to rounding.', ex: ['Balancer (2020)', 'Uniswap-v2 clones without MINIMUM_LIQUIDITY'], ch: ['First-depositor protection present?', 'Test deposit(1 wei) → donate → victim deposits — shares minted?'] }
  ]
},
{
  id: 'bridge', name: 'Bridges & Cross-chain',
  patterns: [
    { t: 'Validator threshold inverted', e: 'require(v >= threshold) written backwards — any single validator can sign withdrawals.', ex: ['Ronin ($625M)'], ch: ['Read every multisig/validator check literally: is the comparison direction correct?', 'grep -rn "require.*>=\\|require.*<=" <repo> in signature/multisig code'] },
    { t: 'Unverified message acceptance', e: 'A zero-hash or default-proved path lets any message pass verification and mint on the destination.', ex: ['Nomad ($190M)'], ch: ['Trace the "verified root" path: is there a branch where an empty/unverified root is accepted?', 'Test: call the execute path with a forged/empty proof'] },
    { t: 'Uninitialized proxy', e: 'The bridge implementation\'s initialize() was never called (or is callable by anyone) — anyone becomes owner of the bridge.', ex: ['Wormhole ($326M)', 'Qubit (tokenAddress=0)'], ch: ['For every deployed proxy: check the initialized flag on-chain', 'Test: call initialize() from a random EOA'] },
    { t: 'Replay / nonce handling', e: 'Messages can be replayed across chains, or the same hash executes twice because the nonce is missing/wrong.', ex: ['Chainswap', 'Poly Network'], ch: ['Is there a consumed-message mapping keyed by hash+chain?', 'Test: submit the same message twice'] },
    { t: 'Token/amount validation gaps', e: 'A zero-address token, a fake token with the right name, or an amount that does not exist passes validation and mints/credits.', ex: ['Qubit ($80M)'], ch: ['Is tokenAddress validated against a whitelist, not just != 0?', 'Test: deposit with address(0) or a minted clone token'] },
    { t: 'Single-verifier / single-DVN trust', e: 'One verifier (or a config shared by many apps) is the whole security boundary — compromise or misconfig drains everything.', ex: ['KelpDAO ($292M)', 'LayerZero 47% shared config'], ch: ['Map the trust boundary: how many independent parties must collude to mint?', 'Check the verifier-set config is not shared across unrelated apps'] },
    { t: 'Numeric truncation / overflow in wrapping', e: 'u256→u128 or cross-VM integer truncation on the bridge mints depegged wrapped assets.', ex: ['Astar', 'Moonbeam/Acala (Frontier)'], ch: ['Every cross-chain amount conversion: explicit bounds checks?', 'grep -rn "toUint128\\|uint128(" <repo>'] }
  ]
},
{
  id: 'staking', name: 'Staking, Rewards & ve(3,3)',
  patterns: [
    { t: 'Once-per-epoch guard missing', e: 'An action that should run once per epoch (poke, reset, checkpoint) runs every time — rewards mint unboundedly.', ex: ['Alchemix v2 — 16 confirmed criticals from one poke()'], ch: ['grep -rn "onlyNewEpoch\\|lastEpoch" <repo> — is the guard on EVERY accrual path?'] },
    { t: 'Claim-before-burn missing on merge/withdraw', e: 'When a position NFT is burned or merged, unclaimed rewards are not forced out first — they freeze or are stolen.', ex: ['Alchemix veALCX merge', 've(3,3) forks broadly'], ch: ['Trace merge/burn: is _claim called before _burn?'] },
    { t: 'totalVoting / bribe accounting desync', e: 'withdraw/reset change voting power without decrementing the tracked total — bribe distribution math breaks and users claim unearned bribes.', ex: ['Alchemix Bribe.sol'], ch: ['For every state-mutating function: does the aggregate (totalVoting/totalSupply) move in the SAME direction? Build the asymmetry table.'] },
    { t: 'Checkpoint double-counts balance', e: 'A revenue checkpoint adds the current unclaimed balance as new revenue — the same tokens accrue twice.', ex: ['Alchemix RevenueHandler'], ch: ['Read every "+= balance" in reward math: is the balance already accounted?'] },
    { t: 'Killed gauge keeps accruing', e: 'After a gauge/strategy is killed, its weight is not revalidated — it keeps eating the reward share.', ex: ['Alchemix Minter', 'Curve gauge family'], ch: ['After kill: is the weight zeroed or skipped in distribution?'] },
    { t: 'Retroactive parameter changes', e: 'Fees/lock params change and apply to EXISTING positions with no snapshot — locked users get new terms they never agreed to.', ex: ['Transmuter fee class', 'Multiple staking protocols'], ch: ['Are params snapshotted per position, or read globally at claim time?'] }
  ]
},
{
  id: 'governance', name: 'Governance & DAO',
  patterns: [
    { t: 'Flash-loan voting', e: 'Voting power is bought seconds before a proposal, votes, then sold — no lock means the DAO is controlled for the cost of fees.', ex: ['Beanstalk ($181M)'], ch: ['Is voting power snapshotted BEFORE the proposal, or live balanceOf at vote time?'] },
    { t: 'Unguarded initialize / ownership', e: 'The governance proxy\'s init is callable by anyone: voting period 0, attacker as guardian, then a transfer-99%-of-treasury proposal.', ex: ['Audius ($1.08M)', 'Compound-style clones'], ch: ['initialized guard on the governance proxy? Test calling initialize() from an EOA'] },
    { t: 'No execution delay / timelock bypass', e: 'Proposals execute instantly (or the delay can be set to 0) so the attack completes in one block.', ex: ['Audius (3-block voting period)', 'Multiple DAO forks'], ch: ['Check votingPeriod/executionDelay lower bounds — can they be set to 0?'] },
    { t: 'Quorum / proposal manipulation', e: 'Self-delegation or duplicated votes satisfy quorum without real support, or a defeated proposal becomes executable later.', ex: ['Alchemix v2 findings', 'Governor forks'], ch: ['Can one account delegate to itself multiple times?', 'Are defeated proposals permanently dead?'] }
  ]
},
{
  id: 'nft', name: 'NFT & Marketplaces',
  patterns: [
    { t: 'Missing buyer authorization', e: 'fillSellOrder validates the seller\'s signature but not the buyer — the attacker fills their own order with the victim\'s tokens.', ex: ['Quixotic'], ch: ['Every marketplace fill: is msg.sender checked against the buyer field?'] },
    { t: 'Reentrancy via onERC721Received', e: 'safeTransferFrom triggers the receiver\'s hook mid-health-check — collateral is re-supplied against stale state.', ex: ['Omni'], ch: ['State updated BEFORE every safeTransferFrom of a collateral NFT?'] },
    { t: 'Metadata injection (XSS/URI swap)', e: 'Attacker-controlled fields rendered into tokenURI/SVG without escaping — XSS through NFT metadata, or the URI is mutable after sale.', ex: ['NFT metadata XSS class', 'Loot-style exploits'], ch: ['Is every user-controlled string escaped in the SVG/JSON?', 'Is the tokenURI frozen at mint?'] },
    { t: 'Auction / bid accounting', e: 'Outbid refunds, fee splits, or bid cancellation return wrong amounts or let the owner sweep both the bid and the item.', ex: ['FlippazOne (ownerWithdrawAllTo without onlyOwner)', 'Multiple NFT markets'], ch: ['grep -rn "ownerWithdraw\\|rescue\\|withdrawAll" <repo> — access control on every one'] }
  ]
},
{
  id: 'oracle', name: 'Oracles & Price Feeds',
  patterns: [
    { t: 'Spot-pool price accepted', e: 'The protocol prices assets from a pool it itself manipulates — flash loans move the price and borrow/swap at the manipulated rate.', ex: ['Hundred', 'Moola', 'FireBird'], ch: ['Every price source: Chainlink feed, TWAP, or live pool read? Live pool read = suspect'] },
    { t: 'No freshness / staleness check', e: 'latestRoundData is consumed without checking updatedAt — a stale or poisoned price passes.', ex: ['FrxEthEth dual-oracle class', 'Multiple 2022-23 exploits'], ch: ['grep -rn "latestRoundData" <repo> — are roundId/answeredInRound/updatedAt all validated?'] },
    { t: 'Dual-oracle spread not validated', e: 'Two feeds are averaged or picked without checking they agree — one manipulated feed drags the price.', ex: ['Alchemix H-02/H-09 class'], ch: ['Is the spread between feeds bounded before use?'] },
    { t: 'L2 sequencer-uptime unchecked', e: 'On L2s the sequencer can go down while the feed serves stale prices — prices are accepted as fresh.', ex: ['L2 oracle class'], ch: ['On L2: is the sequencer-uptime feed checked before consuming prices?'] },
    { t: 'Decimals / unit mismatch', e: 'A feed with 8 decimals is multiplied as if 18 (or vice versa) — every price is off by 1e10.', ex: ['Decimal-mishandling incidents across 2021-23'], ch: ['Normalize every feed to 1e18 with an explicit decimals read — never hardcode'] }
  ]
},
{
  id: 'token', name: 'Tokens & ERC-20',
  patterns: [
    { t: 'Overflow in batch transfers', e: 'value * count (or value + fee) wraps unchecked — the sum passes the balance check while each receiver gets the huge value.', ex: ['BEC ($6B at peak)', 'SmartMesh'], ch: ['Every batch transfer: checked math on the sum?', 'grep -rn "unchecked" <repo> in transfer logic'] },
    { t: 'Public _transfer / _mint', e: 'A transfer helper left public (or default visibility) lets anyone move anyone\'s tokens.', ex: ['CF Token'], ch: ['grep -rn "function _transfer\\|function _mint\\|function _burn" <repo> — visibility correct on all?'] },
    { t: 'Mint-on-self-transfer', e: 'transfer(ownAddress) triggers the reward/burn logic on the sender — looping self-transfers inflates the balance.', ex: ['LPC'], ch: ['Self-transfer must be a no-op. Test transfer(address(this), x).'] },
    { t: 'Fee-on-transfer vs accounting', e: 'The token takes a cut on transfer but the contract books the full amount — the ledger desyncs.', ex: ['Fee-on-transfer class'], ch: ['Balance by delta: measure before/after, never trust the argument'] },
    { t: 'Permit replay / signature flaws', e: 'Missing nonce/chainId/domain checks (or malleable signatures) let permits replay or be forged.', ex: ['Signature-validation class'], ch: ['permit: nonce++, chainId bound, s-malleability check?'] },
    { t: 'Backdoor mint / owner relay', e: 'A hidden owner-only drain or an ownership chain relayed through dozens of wallets empties everything locked.', ex: ['DxSale locker ($7.3M via 89-wallet relay)', 'SKP rug'], ch: ['Map every privileged function — is any of them a silent drain?'] }
  ]
}
];

window.PATTERNS10 = [
 { t: 'Unguarded initializers', sig: 'grep -rn "function initialize\\|function init"', why: 'Anyone re-runs init and takes ownership of the proxy — Harvest, Parity, Audius, Wormhole.', d: 'initializer modifier or first-call guard on every init' },
 { t: 'Missing access control on money paths', sig: 'grep -rn "function .*[Ww]ithdraw\\|function .*[Rr]escue\\|ownerWithdraw"', why: 'One forgotten onlyOwner is a full drain — FlippazOne, Enzyme, Alchemix AlEth.', d: 'every withdraw/rescue/claim has an explicit check' },
 { t: 'balanceOf used as accounting', sig: 'grep -rn "balanceOf(address(this))"', why: 'Donations and flash flows inflate the read — the donation-attack family.', d: 'track balances in storage, not raw reads' },
 { t: 'Reward-accrual checkpoint missed', sig: 'grep -rn "function poke\\|function merge\\|function reset\\|function kill"', why: 'One skipped checkpoint = unbounded mint — the ve(3,3) class (16 criticals from one poke).', d: 'accrue before every mutation' },
 { t: 'Update without revalidation', sig: 'grep -rn "\.push\\|\[.*\] = " near state arrays', why: 'The state changes but consumers of the old value are never re-run — ThunderNFT, killed gauges.', d: 're-run validation after every update' },
 { t: 'Forked constant mismatch', sig: 'grep -rn "10000\\|1000\\|1e3" in math', why: 'Copy-paste forks break invariants — Uranium, NowSwap, Nimbus.', d: 'diff every constant against the original' },
 { t: 'Rounding direction asymmetry', sig: 'grep -rn "mulDivUp\\|mulDivDown\\|Math.round"', why: 'Ceil-on-the-way-in + floor-on-the-way-out leaks value per user.', d: 'balance the directions or bound the dust' },
 { t: 'Reentrancy windows', sig: 'grep -rn "\.call\\|safeTransferFrom\\|safeTransfer"', why: 'State read before the external call is stale — Lendf.Me, Cream, Omni, Curve read-only.', d: 'CEI + nonReentrant + transient guards' },
 { t: 'Oracle trust without freshness/spread', sig: 'grep -rn "latestRoundData\\|getReserves"', why: 'Stale/manipulated prices pass — the oracle class that cost billions.', d: 'validate roundId+updatedAt+spread+sequencer' },
 { t: 'Privilege relay / hidden backdoors', sig: 'map every onlyOwner/admin function', why: 'Ownership relayed through 89 wallets = $7.3M locker drain.', d: 'timelocks + events + off-chain monitoring' }
];
