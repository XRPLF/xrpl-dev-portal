# Confidential Atomic Settlement on the XRP Ledger

A guided demo of a two-leg repo trade settled on the XRP Ledger.

> **AlphaFund**, an asset manager, tokenizes its money market fund as **TMMF**.
> **InvestCo** buys TMMF, then repos it to **TradeDesk**, 100 TMMF against
> 1,000 USD issued by **StableCorp**, unwound 10 days later at 1,001.37 USD
> (5% annualized, computed off-chain). Both legs settle **atomically** and
> **confidentially**. **xSecurities** orchestrates the swaps and sponsors the
> transaction costs. It holds no assets itself.

You act as **every** party, one step at a time:

- **Deal ticket**: set the collateral, cash, tenor, and repo rate. The interest
  math updates live and flows through the whole settlement. Terms freeze when
  the first transaction is signed.
- **One step per screen**: the seven phases break into short steps of at most
  two actions each. Forward navigation stops at the live step, and revisited
  steps are read-only, so an executed action can never run twice.
- **You are who you click**: the balances panel lists every party, and clicking
  one hands you its keys. The party whose move is next is flagged "next".
- **Review before you act**: every console shows the transaction JSON exactly as
  it will be submitted, including real encryption keys, full batch contents, and
  the unshortened hex of every ciphertext and Zero-Knowledge Proof (ZKP). A
  confidential send's proof is generated against live state at submit time, so
  it cannot exist beforehand. The console says so rather than showing you
  something different from what is sent.
- **See what happened**: a completed action keeps its results inline, with each
  transaction's engine result, a link to the Devnet explorer, and the validated
  transaction and metadata as the ledger recorded it.
- **Per-key decryption**: the balances panel shows the ciphertexts every
  observer sees. Becoming a party reveals only what its key can read.

**XRP Ledger features used**, all enabled on Devnet:

| Feature | Spec | Used for |
| --- | --- | --- |
| Multi-Purpose Tokens (MPTs) | XLS-33 / XLS-89 | Issuing TMMF and USD with metadata |
| Confidential Transfers | XLS-96 | Encrypted balances, sends, ZKPs |
| Batch Transactions | XLS-56 | Atomic all-or-nothing settlement of each leg |
| Sponsored Fees and Reserves | XLS-68 | xSecurities pays holders' costs and reserves |

## Prerequisites

Node.js 20.19 or later, the minimum for `xrpl` 5.x. Everything else installs
from npm, including `@xrplf/mpt-crypto`, the WASM module that generates
confidential proofs.

## Run it

```sh
npm install
cp .env.example .env   # optional, defaults target Devnet with faucet wallets
npm run dev            # interactive demo at http://localhost:5173
```

Set your terms on the deal ticket, then work down the flow as each party. Proof
generation and faucet funding make the full settlement take a few minutes.

## Configuration

Everything sensitive or environment-specific is an env var, listed in
`.env.example`. That covers the WebSocket endpoint, the explorer URL, and
optional per-party seeds for pinning to pre-funded accounts. With no seeds set,
fresh faucet wallets are created per run.

> **`VITE_*` values are compiled into the bundle.** Vite substitutes
> `import.meta.env` at build time, so any seed in `.env` appears verbatim in
> `dist/assets/*.js`. `.env` is gitignored, but a built bundle is not. Keep
> only disposable Devnet seeds there, and **never** put a seed that controls
> real funds in one.

Reusing accounts across runs is safe. Issuance IDs are held in browser memory
only, so every run creates new issuances and starts from clean confidential
state, with nothing colliding with the previous run's keys or balances. What
accumulates is ledger entries, two issuances per run plus the counterparties'
`MPToken`s, which the flow never unwinds. Each costs owner reserve, so after
enough runs the issuers run out of it. Clear the seeds to go back to faucet
wallets, or fund fresh accounts.

## Encryption-key lifecycle

Confidential Transfers use a second key pair per party, separate from the
transaction-signing key pair. Know its lifecycle before building on this.

- **Derivation.** `deriveConfidentialKeypair(seed)` derives a secp256k1 key
  pair. This demo derives it from each account's seed so one backup recovers
  both keys. The SDK recommends a **dedicated seed** in production, because
  reusing the signing seed extends that key's trust boundary into the
  confidential cryptography (WASM decryption and proof generation).
- **Registration.** An issuer registers its public key on the issuance with
  `MPTokenIssuanceSet` (`IssuerEncryptionKey`). A holder's key is registered by
  its first `ConfidentialMPTConvert`, and a zero-amount convert registers the
  key without moving funds. A party **must** have a registered key before it can
  receive a confidential send.
- **Use.** Every confidential balance is stored encrypted under the holder's key
  and the issuer's key, plus an auditor's if one is registered. Spending and
  decrypting both need the private key, since proofs are generated from it.
- **Loss.** A holder that loses its encryption private key can no longer decrypt
  **or spend** its confidential balance. If the issuance has clawback enabled,
  the issuer can recover the funds with `ConfidentialMPTClawback` using its own
  key. This demo's tokens do **not** enable clawback, so a lost key here means
  an unrecoverable balance. Decide your recovery policy before issuing.
- **Compromise.** A leaked encryption key exposes past and future amounts for
  that balance, because the ciphertexts stay on the ledger permanently. It does
  not allow spending on its own unless the signing key leaked too. This demo
  does not cover rotating a registered key on an existing balance. Check the
  XLS-96 spec and core server behavior before relying on rotation.

## Project layout

Every ledger interaction lives in one file. Read `src/xrpl.ts` to learn the
protocol, since it knows nothing about this scenario and you can lift its
functions straight into your own app. Read `src/repo.ts` and `src/steps.ts` for
the repo scenario itself.

```text
src/
  xrpl.ts             The ledger layer, and the only file that imports xrpl.js.
                      Generic, scenario-free functions for connection, wallets,
                      MPT issuance, encryption keys, plain and sponsored
                      submits, batch construct/sign/combine/submit, and balance
                      reads and decryption.
  repo.ts             The scenario layer. RepoLedger holds this deal's state
                      (parties, both issuances, each leg's in-flight batch) and
                      calls xrpl.ts for every ledger interaction.
  steps.ts            The narrative layer. buildSteps(deal) returns the steps,
                      each at most two per-party actions calling RepoLedger,
                      parameterized by the deal ticket.
  variables.ts        Fictional example variables for parties, tokens, default
                      deal terms, and the interest and operating-balance math.
  config.ts           Env-driven runtime config.
  types.ts            Narrative types the UI renders.
  components/         StepPanel (one step per screen, navigation, results),
                      ActionConsole (the signing console), BalancePanel
                      (clickable parties, per-key decryption), DealTicket,
                      PartyBadge, JsonView. Built with Mantine.
```

## Disclaimers

Educational demo, Devnet only. Seeds live in browser memory, and optionally in a
gitignored `.env`. In production every party signs with its own custodian and no
single machine holds all keys.
