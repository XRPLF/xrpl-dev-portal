---
seo:
  description: Settle a two-leg repo trade on the XRP Ledger with confidential Multi-Purpose Tokens, atomic batches, and sponsored transaction costs.
metadata:
  indexPage: true
labels:
  - Multi-Purpose Token
  - Confidential Transfers
  - Batch
  - Sponsorship
status: not_enabled
---
# Build a Repo Settlement App in TypeScript

This tutorial walks through a sample app that settles a two-leg [repurchase agreement](https://en.wikipedia.org/wiki/Repurchase_agreement) on the XRP Ledger. Five parties tokenize a money market fund, exchange it against a stablecoin, and unwind the trade ten days later. Both legs settle atomically, both legs keep their amounts encrypted, and one orchestrator pays everyone's transaction costs.

The app is an interactive walkthrough: you act as every party in turn, review each transaction as JSON before you sign it, and watch balances change from each party's own point of view.

[**Open the interactive walkthrough**](https://maria-robobug.github.io/xrpl-dev-portal/interactive-tutorial/)

{% amendment-disclaimer name="ConfidentialTransfer" /%}
{% amendment-disclaimer name="BatchV1_1" /%}
{% amendment-disclaimer name="Sponsor" /%}

## Goals

By the end of this tutorial, you will be able to:

- Issue an MPT that can hold confidential balances and gate its holders.
- Register encryption keys and convert public balances to confidential ones.
- Settle a two-sided swap atomically with a multi-account `Batch` transaction.
- Sponsor another account's transaction costs and reserves.

## Features Used

| Feature | Spec | Used for |
| --- | --- | --- |
| [Multi-Purpose Tokens (MPTs)](../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md) | XLS-33, XLS-89 | Issuing the collateral and cash tokens with on-chain metadata. See [Issue a Multi-Purpose Token](../tokens/mpts/issue-a-multi-purpose-token.md). |
| [Confidential Transfers](../../concepts/tokens/fungible-tokens/confidential-transfers.md) | XLS-96 | Encrypting balances and settling with Zero-Knowledge Proofs (ZKPs). |
| [Batch Transactions](../../concepts/transactions/batch-transactions.md) | XLS-56 | Settling each leg all-or-nothing. See [Send a Multi-Account Batch Transaction](../best-practices/transaction-sending/send-a-multi-account-batch-transaction.md). |
| [Sponsored Fees and Reserves](../../concepts/accounts/sponsored-fees-and-reserves.md) | XLS-68 | Letting the orchestrator pay costs for accounts that hold no XRP. |

## The Scenario

**AlphaFund**, an asset manager, issues **TMMF**, a tokenized money market fund. **InvestCo** buys TMMF, then repos it to **TradeDesk**: 100 TMMF against 1,000 USD issued by **StableCorp**, unwound ten days later at 1,001.37 USD. Interest is computed off-chain, since the ledger does not calculate it. **xSecurities** builds the batches, collects signatures, submits them, and sponsors the transaction costs. It holds no assets.

Each leg is a two-sided swap, so each leg is one batch of two confidential sends. If either side fails, neither happens.

## Prerequisites

To complete this tutorial, you should:

- Have [Node.js](https://nodejs.org/en/download/) 20.19 or later installed, the minimum for **xrpl.js** 5.x.
- Be familiar with modern TypeScript and have completed [Get Started Using TypeScript](../get-started/get-started-typescript.md).
- Understand [MPTs](../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md) and [transaction costs](../../concepts/transactions/transaction-cost.md).

## Source Code

You can find the complete source code for this tutorial in the {% repo-link path="_code-samples/repo-settlement/" %}code samples section of this website's repository{% /repo-link %}.

Every ledger interaction lives in `src/xrpl.ts`, which knows nothing about the repo scenario. The snippets below all come from that file, so you can lift them straight into your own app.

## Usage

To run the app locally, install dependencies from the code sample folder and start the dev server:

```sh
cd _code-samples/repo-settlement
npm install
npm run dev
```

Sample output:

```text
VITE v5.4.11  ready in 412 ms
➜  Local:   http://localhost:5173/
```

The app targets Devnet with faucet wallets by default. Copy `.env.example` to `.env` to point at a different endpoint or to pin the parties to pre-funded accounts.

{% admonition type="warning" name="Caution" %}
Vite substitutes `import.meta.env` at build time, so any seed in `.env` appears verbatim in the built bundle. Use **disposable Devnet seeds only**.
{% /admonition %}

Set your terms on the deal ticket, then work down the flow as each party. Proof generation and faucet funding make a full settlement take a few minutes.

## Steps

### 1. Create accounts and derive encryption keys

Confidential Transfers use a **second key pair** per party, separate from the transaction-signing key pair. Balances are encrypted under it, and both spending and decrypting need its private half.

{% code-snippet file="/_code-samples/repo-settlement/src/xrpl.ts" language="ts" from="export async function createConfidentialAccount" before="// ---------------------------------------------------------------- submission" /%}

A party that loses this key can no longer decrypt **or spend** its confidential balance. Decide your recovery policy before you issue anything. This sample derives the key from the account's seed so one backup recovers both, but the SDK recommends a dedicated seed in production.

### 2. Issue the tokens

Authorization, transferability, and confidentiality are protocol flags on the token itself, so no contract code is involved. `tfMPTCanHoldConfidentialBalance` is what allows encrypted balances later, and it **cannot be added after issuance**.

{% code-snippet file="/_code-samples/repo-settlement/src/xrpl.ts" language="ts" from="export function buildIssuanceCreate" before="export function buildIssuerEncryptionKey" /%}

The issuance ID is assigned by the ledger and appears as `mpt_issuance_id` in the transaction metadata, not in the request. Read it back after the transaction validates.

### 3. Register the issuer's encryption key

Confidential transfers stay switched off until the issuer registers its own encryption public key on the issuance. That key also gives the issuer a lawful view of every encrypted balance of the token.

{% code-snippet file="/_code-samples/repo-settlement/src/xrpl.ts" language="ts" from="export function buildIssuerEncryptionKey" before="export function buildAuthorize" /%}

### 4. Authorize the holders

`MPTokenAuthorize` covers both sides of the handshake. A holder sends it to opt in, and an issuer with `tfMPTRequireAuth` set sends it with a `Holder` field to approve that holder.

{% code-snippet file="/_code-samples/repo-settlement/src/xrpl.ts" language="ts" from="export function buildAuthorize" before="/** A public (unencrypted) MPT payment" /%}

The `Sponsor` and `SponsorFlags` fields hand the cost of the transaction to another account. The sender signs first, then the sponsor co-signs that signed blob to accept the cost. The sponsor cannot alter or initiate what it pays for.

{% code-snippet file="/_code-samples/repo-settlement/src/xrpl.ts" language="ts" from="export interface SponsorOptions" before="export async function submit (" /%}

`spfSponsorReserve` is only valid on transactions that create a ledger entry. Pass `feeOnly` for the ones that do not, such as a convert or a merge.

### 5. Encrypt the balances

`ConfidentialMPTConvert` encrypts a public balance, carrying a locally generated ZKP that the plaintext matches the ciphertext.

{% code-snippet file="/_code-samples/repo-settlement/src/xrpl.ts" language="ts" from="export async function convertToConfidential" before="export function convertIntent" /%}

A converted amount lands in the holder's confidential **inbox**, which cannot be spent and cannot back a proof. Every convert and every confidential receipt must be followed by a merge.

{% code-snippet file="/_code-samples/repo-settlement/src/xrpl.ts" language="ts" from="export function buildMergeInbox" before="export async function mergeInbox" /%}

A **zero-amount convert** registers a holder's encryption key without moving funds. A party must have a registered key before it can receive a confidential send.

### 6. Settle a leg atomically

Each leg is one batch of two confidential sends, one in each direction. Every inner transaction carries an encrypted amount and a proof that its sender holds enough to cover it.

{% code-snippet file="/_code-samples/repo-settlement/src/xrpl.ts" language="ts" from="export async function constructConfidentialBatch" before="export function signBatchCopy" /%}

The submission window is widened deliberately. Autofill's default expires in about a minute, which suits a script but not several counterparties signing at their own pace.

Each counterparty then signs its **own copy** of the same unsigned batch, which is what lets signatures be collected independently. The assembler combines the signatures. It built the batch but cannot alter it, because any change invalidates them.

{% code-snippet file="/_code-samples/repo-settlement/src/xrpl.ts" language="ts" from="export function signBatchCopy" before="export async function submitBatch" /%}

### 7. Submit, then verify the inner transactions

A `tesSUCCESS` on a `Batch` means only that the **outer** transaction was well-formed. Hash each inner transaction and look it up individually to confirm it applied.

{% code-snippet file="/_code-samples/repo-settlement/src/xrpl.ts" language="ts" from="export async function submitBatch" before="/** True when a submission failed" /%}

Reading a balance means decrypting it. The `MPToken` entry holds the public amount as plaintext and the confidential spending and inbox balances as ciphertexts, which anyone can see but only the holder's key can read. The issuer's key decrypts its own view of the same balance.

{% code-snippet file="/_code-samples/repo-settlement/src/xrpl.ts" language="ts" from="export async function readTokenBalance" /%}

A ciphertext that exists but fails to decrypt is reported as `failed`, never as zero. In a financial application those are distinct states.

## See Also

- **Concepts**:
  - [Multi-Purpose Tokens (MPTs)](../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md)
  - [Confidential Transfers](../../concepts/tokens/fungible-tokens/confidential-transfers.md)
  - [Batch Transactions](../../concepts/transactions/batch-transactions.md)
  - [Sponsored Fees and Reserves](../../concepts/accounts/sponsored-fees-and-reserves.md)
- **Tutorials**:
  - [Issue a Multi-Purpose Token (MPT)](../tokens/mpts/issue-a-multi-purpose-token.md)
  - [Send a Multi-Purpose Token (MPT)](../payments/send-an-mpt.md)
  - [Send a Multi-Account Batch Transaction](../best-practices/transaction-sending/send-a-multi-account-batch-transaction.md)
- **References**:
  - [MPTokenIssuanceCreate transaction][]
  - [MPTokenIssuanceSet transaction][]
  - [MPTokenAuthorize transaction][]
  - [ConfidentialMPTConvert transaction][]
  - [ConfidentialMPTMergeInbox transaction][]
  - [ConfidentialMPTSend transaction][]
  - [Batch transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
