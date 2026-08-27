# Repo Settlement on the XRP Ledger

A guided demo of a two-leg repo trade settled on XRPL Devnet:

> **AlphaFund** (asset manager) tokenizes its money market fund as **TMMF**.
> **InvestCo** buys TMMF, then repos it to **TradeDesk**: 100 TMMF against
> 1,000 USD (issued by **StableCorp**), unwound 10 days later at 1,001.37
> USD (5% annualized, computed off-chain). Both legs settle **atomically**
> and **confidentially**. **xSecurities** orchestrates the swaps and sponsors
> fees. It holds no assets itself.

The demo is a small app. You act as every party, one step at a time:

- **Deal ticket**: set the collateral, cash, tenor, and repo rate; the
  interest math updates live and flows through the whole settlement. The
  terms freeze when the first transaction is signed, and the ticket collapses
  to a one-line summary you can expand at any time.
- **One step per screen**: the flow's seven phases break into short steps,
  shown one at a time so the whole screen stays in view. No step asks for more
  than two actions. Arrows (and the phase stepper) move back and forth;
  forward stops at the live step, and revisited steps are read-only — an
  executed action can never run twice.
- **You are who you click**: the balances panel lists every party; clicking one
  hands you its keys. The party whose move is next is flagged "next", and an
  action's console offers a one-click switch to the right identity.
- **Review before you act**: every console shows the transaction JSON exactly
  as it will be submitted — real encryption keys, full batch contents, and the
  complete hex of every ciphertext and zero-knowledge proof, unshortened.
  Where a transaction genuinely cannot exist yet (a confidential send's proof
  is generated against live state at submit time), the console says so instead
  of showing you something different from what is sent.
- **See what happened**: a completed action animates in its results — each
  transaction's engine result, a link to the Devnet explorer, and the full
  validated transaction with metadata as the ledger recorded it.
- **Per-key decryption**: the balances panel shows the ciphertexts every
  observer sees; becoming a party reveals only what its key can read.

**XRPL features used** (all enabled on Devnet):

| Feature | Spec | Used for |
| --- | --- | --- |
| Multi-Purpose Tokens | XLS-33 / XLS-89 | Issuing TMMF and USD with metadata |
| Confidential Transfers | XLS-96 | Encrypted balances, sends, ZK proofs |
| Batch | XLS-56 | Atomic all-or-nothing settlement of each leg |
| Sponsored Fees & Reserves | XLS-68 | xSecurities pays holders' fees and reserves |

## Prerequisites

- Node.js ≥ 18
- A local build of **xrpl.js** that includes both Confidential Transfers and
  Sponsored Fees support (no published npm release has them yet). The
  `vendor/` directory contains tarballs packed from such a build. To refresh
  them from your xrpl.js checkout:

  ```sh
  cd /path/to/xrpl.js
  npm install && npm run build
  for pkg in xrpl ripple-binary-codec mpt-crypto; do
    (cd packages/$pkg && npm pack --pack-destination /path/to/repo-tutorial/vendor)
  done
  ```

  `package.json` consumes them via a `file:` dependency plus npm `overrides`,
  so the local `ripple-binary-codec` (with the new transaction definitions)
  and `@xrplf/mpt-crypto` (the WASM proof generator) are used everywhere.

## Run it

```sh
npm install
cp .env.example .env   # optional; defaults target Devnet with faucet wallets
npm run dev            # interactive demo at http://localhost:5173
```

Set your terms on the deal ticket, then run each action with the **Run**
button on the highlighted row. The full settlement takes ~3 minutes of ledger
time (proof generation and faucet funding dominate).

## Configuration

Everything sensitive or environment-specific is an env var (see
`.env.example`): the WebSocket endpoint, explorer URL, and optional per-party
seeds for pinning to pre-funded accounts. With no seeds set, fresh faucet
wallets are created per run.

> **`VITE_*` values are compiled into the bundle.** Vite substitutes
> `import.meta.env` at build time, so any seed in `.env` appears verbatim in
> `dist/assets/*.js`. `.env` is gitignored, but a built bundle is not: keep
> only disposable Devnet seeds there, and never put a seed that controls real
> funds in one.

Reusing accounts across runs is safe but untidy. Issuance IDs are held in
browser memory only, so every run creates new issuances and starts from clean
confidential state — nothing collides with the previous run's encryption keys
or balances. What accumulates is ledger objects: two issuances per run, plus
the counterparties' `MPToken`s, which the flow never unwinds. Each costs owner
reserve, so after enough runs the issuers run out of it. Clear the seeds to go
back to faucet wallets, or fund fresh accounts.

## Encryption-key lifecycle

Confidential transfers use a second keypair per party, separate from the
transaction-signing keypair. Know its lifecycle before building on this:

- **Derivation.** `deriveConfidentialKeypair(seed)` derives a secp256k1
  keypair. This demo derives it from each account's seed so one backup
  recovers both keys. The SDK recommends a **dedicated seed** in production:
  reusing the signing seed extends that key's trust boundary into the
  confidential cryptography (WASM decryption and proof generation).
- **Registration.** An issuer registers its public key on the issuance with
  `MPTokenIssuanceSet` (`IssuerEncryptionKey`). A holder's key is registered
  by its first `ConfidentialMPTConvert`; a zero-amount convert registers the
  key without moving funds. A party **must** have a registered key before it
  can receive a confidential send.
- **Use.** Every confidential balance is stored encrypted under the holder's
  key and the issuer's key (and an auditor's, if one is registered). Spending
  and decrypting both require the private key: proofs are generated from it.
- **Loss.** A holder that loses its encryption private key can no longer
  decrypt **or spend** its confidential balance. If the issuance has clawback
  enabled, the issuer can recover the funds with `ConfidentialMPTClawback`
  using its own key. This demo's tokens do **not** enable clawback, so a lost
  key here means an unrecoverable balance. Decide your recovery policy before
  issuing.
- **Compromise.** A leaked encryption key exposes past and future amounts for
  that balance (the ciphertexts are on-ledger permanently), though it does not
  allow spending on its own unless the signing key also leaked. Whether a
  registered key can be rotated on an existing balance is not covered by this
  demo; check the XLS-96 spec and rippled behavior before relying on rotation.

## Project layout

Every XRPL interaction lives in one file. Read `src/xrpl.ts` to learn the
protocol — it knows nothing about this scenario, so you can lift its functions
straight into your own app. Read `src/repo.ts` and `src/steps.ts` to see the
deal it tells.

```text
src/
  xrpl.ts             The ledger layer, and the only file that imports xrpl.js.
                      Generic, scenario-free functions: connection, wallets,
                      MPT issuance, encryption keys, plain and sponsored
                      submits, batch construct/sign/combine/submit, balance
                      reads and decryption.
  repo.ts             The scenario layer. RepoLedger holds this deal's state
                      (parties, both issuances, each leg's in-flight batch) and
                      calls xrpl.ts for every ledger interaction.
  steps.ts            The narrative layer. buildSteps(deal) returns the
                      steps, each a checklist of at most two per-party actions
                      calling RepoLedger, parameterized by the deal ticket.
  variables.ts        Fictional example variables: parties, tokens, default
                      deal terms, and the interest/operating-balance math.
  config.ts           Env-driven runtime config.
  types.ts            Narrative types the UI renders.
  components/         StepPanel (one step per screen, navigation, results),
                      ActionConsole (the signing console), BalancePanel
                      (clickable parties, per-key decryption), DealTicket,
                      PartyBadge, JsonView. Built with Mantine.
```

## End-to-end tests

Cypress covers the UI. The default run needs no network beyond localhost:

```sh
npm run test:e2e          # starts the dev server, runs the UI specs headless
npm run test:e2e:devnet   # also runs the live-Devnet spec (slow, real faucet + txs)
npm run cy:open           # interactive runner against an already-running `npm run dev`
```

`cypress/e2e/ui.cy.ts` checks identity selection via the balances panel, the
deal ticket's live math and collapse, step-navigation locking, and that all
five parties fit the panel without scrolling.
`cypress/e2e/devnet-flow.cy.ts` funds real accounts and signs the first
issuance, verifying the recorded transaction results and unlocked navigation;
it is skipped unless `--env devnet=1` is set.

## Flow notes (where practice refines the term sheet)

- **Receiving confidentially requires a registered key.** Each party registers
  its encryption key on tokens it only *receives* (a zero-amount
  `ConfidentialMPTConvert` does this without moving funds).
- **Convert lands in the inbox.** Every conversion or confidential receipt
  must be merged (`ConfidentialMPTMergeInbox`) before it is spendable. The
  merge between the two legs is mandatory or the far leg's proofs cannot
  be built.
- **Interest has to come from somewhere.** The far leg returns principal plus
  interest, so InvestCo carries a small USD operating balance from setup.
- **Proofs are perishable.** Each ZK proof binds to the sender's current
  confidential balance state; construct legs late and submit immediately.

## Disclaimers

Educational demo, Devnet only. Seeds live in browser memory (and optionally a
gitignored `.env`); in production every party signs with its own custodian and
no single machine holds all keys.
