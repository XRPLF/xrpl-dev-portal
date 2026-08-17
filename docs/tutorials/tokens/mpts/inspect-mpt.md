---
seo:
    description: Programmatically look up a Multi-Purpose Token's transfer fee, flags, supply, and XLS-89 metadata.
labels:
  - Multi-purpose Tokens, MPTs, Tokens
---
# Inspect Multi-Purpose Token (MPT) Properties

This tutorial shows how to programmatically inspect the on-chain properties of a [Multi-Purpose Token (MPT)](../../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md) — the transfer fee, flags (including the auth requirement), supply figures, and the decoded [XLS-89](https://xls.xrpl.org/xls/XLS-0089-multi-purpose-token-metadata-schema.html) metadata blob.

These are the same properties that the [XRPL Explorer](https://devnet.xrpl.org/mpt/002A2749DE74AF5C22DC62DF3E2E95D64B9A9E305C092CE8) surfaces for any MPT issuance, but you often need them available in your own code — for wallets, indexers, compliance dashboards, and analytics.

## Goals

By the end of this tutorial, you will be able to:

- Look up an [`MPTokenIssuance`](../../../references/protocol/ledger-data/ledger-entry-types/mptokenissuance.md) entry using the [ledger_entry method][].
- Convert `TransferFee` (in tenths of a basis point) to a human-readable percentage.
- Decode `MPTokenIssuance` flags such as `lsfMPTRequireAuth`, `lsfMPTCanTransfer`, and `lsfMPTCanClawback`.
- Decode the hex-encoded `MPTokenMetadata` blob using the XLS-89 metadata utility from your client library.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger and [Multi-Purpose Tokens](../../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md).
- Have an XRP Ledger client library installed. This page provides examples for:
    - **JavaScript** with the [xrpl.js library](https://github.com/XRPLF/xrpl.js). See [Get Started Using JavaScript](../../get-started/get-started-javascript.md).
    - **Python** with the [xrpl-py library](https://github.com/XRPLF/xrpl-py). See [Get Started Using Python](../../get-started/get-started-python.md).
    - **Go** with the [xrpl-go library](https://github.com/Peersyst/xrpl-go). See [Get Started Using Go](../../get-started/get-started-go.md).

## Source Code

The complete source code for this tutorial's example is in the [code samples section of this website's repository](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/inspect-fungible-token).

## Steps

The example runs against the [Devnet](../../public-servers.md) MPT issuance ID `002A2749DE74AF5C22DC62DF3E2E95D64B9A9E305C092CE8`. You can pass a different `MPTokenIssuanceID` as a command-line argument.

### 1. Install dependencies

{% tabs %}
{% tab label="JavaScript" %}
```sh
cd _code-samples/inspect-fungible-token/js
npm install
```
{% /tab %}
{% tab label="Python" %}
```sh
cd _code-samples/inspect-fungible-token/py
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```
{% /tab %}
{% tab label="Go" %}
```sh
cd _code-samples/inspect-fungible-token/go
go mod tidy
```
{% /tab %}
{% /tabs %}

### 2. Set up client and inputs

Connect to Devnet and read the `MPTokenIssuanceID` to inspect from the command line, falling back to a default if none is provided.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/inspect-fungible-token/js/inspect-mpt.js" language="js" from="// --- 1. Set up client and inputs ---" before="// --- 2. Define shared helpers ---" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/inspect-fungible-token/py/inspect_mpt.py" language="py" from="# --- 1. Set up client and inputs ---" before="# --- 2. Define shared helpers ---" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/inspect-fungible-token/go/inspect-mpt/main.go" language="go" /%}
{% /tab %}
{% /tabs %}

### 3. Define shared helpers

Two small helpers handle the two decoding tasks used throughout this tutorial:

- `percentFromTransferFee` converts the `TransferFee` field (an integer in **tenths of a basis point**, 0–50000) to a human-readable percentage. `0` means no fee, `1000` means 0.1%, `50000` means the maximum 50%.
- `decodeFlags` walks a bitmask and returns the flag names that are set. The flag values themselves come from the [MPTokenIssuance Flags reference](../../../references/protocol/ledger-data/ledger-entry-types/mptokenissuance.md#mptokenissuance-flags).

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/inspect-fungible-token/js/inspect-mpt.js" language="js" from="// --- 2. Define shared helpers ---" before="// --- 3. Look up the MPTokenIssuance entry ---" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/inspect-fungible-token/py/inspect_mpt.py" language="py" from="# --- 2. Define shared helpers ---" before="# --- 3. Look up the MPTokenIssuance entry ---" /%}
{% /tab %}
{% /tabs %}

### 4. Look up the MPTokenIssuance entry

Unlike trust line tokens, an MPT's properties all live on a single [`MPTokenIssuance`](../../../references/protocol/ledger-data/ledger-entry-types/mptokenissuance.md) ledger entry. Fetch it with the [ledger_entry method][] and the `mpt_issuance` parameter.

Read these fields from the response:

| Field | Meaning |
|:------|:--------|
| `Issuer` | The address that created and controls the MPT. |
| `AssetScale` | Where to put the decimal point when displaying amounts. |
| `MaximumAmount` | The maximum supply that can ever exist. Omitted means `2^63 - 1`. |
| `OutstandingAmount` | Total tokens currently held by non-issuers. |
| `LockedAmount` | Tokens locked in escrow (subset of `OutstandingAmount`). |
| `TransferFee` | Fee charged on secondary transfers, in tenths of a basis point. |
| `Flags` | Bitmask of `lsfMPT*` flags. See below. |

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/inspect-fungible-token/js/inspect-mpt.js" language="js" from="// --- 3. Look up the MPTokenIssuance entry ---" before="// --- 4. Decode the XLS-89 metadata blob ---" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/inspect-fungible-token/py/inspect_mpt.py" language="py" from="# --- 3. Look up the MPTokenIssuance entry ---" before="# --- 4. Decode the XLS-89 metadata blob ---" /%}
{% /tab %}
{% /tabs %}

The **auth requirement** for MPTs is the `lsfMPTRequireAuth` flag. When set, holders must be individually authorized by the issuer via an [`MPTokenAuthorize`][MPTokenAuthorize transaction] transaction before they can receive the token. Other flags such as `lsfMPTCanTransfer`, `lsfMPTCanTrade`, `lsfMPTCanEscrow`, `lsfMPTCanClawback`, and `lsfMPTCanLock` control whether specific transactional capabilities are enabled.

### 5. Decode the XLS-89 metadata blob

`MPTokenMetadata` is a **hex-encoded** field that, by convention, contains a UTF-8 JSON payload conforming to [XLS-89](https://xls.xrpl.org/xls/XLS-0089-multi-purpose-token-metadata-schema.html). The client libraries provide a helper that hex-decodes the payload and expands short-form keys (`t`, `n`, `d`, ...) back to their long-form names (`ticker`, `name`, `desc`, ...).

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/inspect-fungible-token/js/inspect-mpt.js" language="js" from="// --- 4. Decode the XLS-89 metadata blob ---" before="// --- 5. Main flow ---" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/inspect-fungible-token/py/inspect_mpt.py" language="py" from="# --- 4. Decode the XLS-89 metadata blob ---" before="# --- 5. Main flow ---" /%}
{% /tab %}
{% /tabs %}

{% admonition type="info" name="Note" %}
The MPT specification does not require metadata to be JSON, so real-world tokens may store arbitrary bytes. The helper functions in the code samples fall back to the raw hex if decoding fails.
{% /admonition %}

### 6. Run the inspector

{% tabs %}
{% tab label="JavaScript" %}
```sh
node inspect-mpt.js 002A2749DE74AF5C22DC62DF3E2E95D64B9A9E305C092CE8
```
{% /tab %}
{% tab label="Python" %}
```sh
python inspect_mpt.py 002A2749DE74AF5C22DC62DF3E2E95D64B9A9E305C092CE8
```
{% /tab %}
{% tab label="Go" %}
```sh
go run ./inspect-mpt 002A2749DE74AF5C22DC62DF3E2E95D64B9A9E305C092CE8
```
{% /tab %}
{% /tabs %}

The output shows the issuance fields, the decoded flag list, the transfer fee as a percentage, and the decoded XLS-89 metadata.

## About MPT Immutability

Under the [MPTokensV1 amendment](/resources/known-amendments.md#mptokensv1), MPT issuance fields are **immutable** once created — with the single exception of the `lsfMPTLocked` flag, which the issuer can toggle with an [`MPTokenIssuanceSet`][MPTokenIssuanceSet transaction] transaction. This means:

- **There is no `TransferFee` history to reconstruct.** The value shown on the `MPTokenIssuance` entry is the same value the issuer set when creating the token.
- Auth requirements, transferability, clawback capability, and other flags are frozen at creation time.

Mutability of these fields is proposed in [XLS-94 (Dynamic MPT)](https://xls.xrpl.org/xls/XLS-0094-dynamic-MPT.html). Once that amendment is enabled, walking `MPTokenIssuanceSet` transactions via [account_tx method][] will let you reconstruct MPT property history the same way [account inspection](../fungible-tokens/inspect-trust-line-token.md#6-reconstruct-the-transferrate-history) works for trust line tokens today.

## See Also

- **Concepts:**
    - [Multi-Purpose Tokens](../../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md)
    - [Transfer Fees](../../../concepts/tokens/fungible-tokens/transfer-fees.md)
- **References:**
    - [MPTokenIssuance object](../../../references/protocol/ledger-data/ledger-entry-types/mptokenissuance.md)
    - [MPToken object](../../../references/protocol/ledger-data/ledger-entry-types/mptoken.md)
    - [ledger_entry method][]
    - [MPTokenIssuanceCreate transaction][]
    - [MPTokenIssuanceSet transaction][]
    - [MPTokenAuthorize transaction][]
- **Related tutorials:**
    - [Issue a Multi-Purpose Token](./issue-a-multi-purpose-token.md)
    - [Inspect Trust Line Token Properties](../fungible-tokens/inspect-trust-line-token.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
