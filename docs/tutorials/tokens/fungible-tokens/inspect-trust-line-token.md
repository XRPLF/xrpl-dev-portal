---
seo:
    description: Programmatically look up a trust line token's transfer fee, flags, per-line settings, and TransferRate history.
labels:
  - Tokens
  - Trust Lines
---
# Inspect Trust Line Token Properties

This tutorial shows how to programmatically inspect the on-chain properties of a [trust line token](../../../concepts/tokens/fungible-tokens/trust-line-tokens.md) — the transfer fee, auth requirement, other flags, per-line settings, and the history of transfer fee changes.

These are the same properties that the [XRPL Explorer](https://devnet.xrpl.org/token/USD.ryWPRK3BqMovxEQSt5C3fXZkUCxrqVXgf) surfaces for any trust line token, but you often need them available in your own code — for wallets, indexers, compliance dashboards, and analytics.

## Goals

By the end of this tutorial, you will be able to:

- Look up an issuer's [AccountRoot object][] to read its [`TransferRate`](../../../concepts/tokens/fungible-tokens/transfer-fees.md), `TickSize`, `Domain`, and account flags.
- Convert `TransferRate` (in billionths) to a human-readable percentage.
- Decode `AccountRoot` flags that affect all trust line tokens issued by the account.
- List individual trust lines for a currency and read per-line settings (`limit`, `no_ripple`, `freeze`, `authorized`).
- Reconstruct the chronological history of `TransferRate` changes from [`AccountSet`][AccountSet transaction] transactions.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger and [trust line tokens](../../../concepts/tokens/fungible-tokens/trust-line-tokens.md).
- Have an XRP Ledger client library installed. This page provides examples for:
    - **JavaScript** with the [xrpl.js library](https://github.com/XRPLF/xrpl.js). See [Get Started Using JavaScript](../../get-started/get-started-javascript.md).
    - **Python** with the [xrpl-py library](https://github.com/XRPLF/xrpl-py). See [Get Started Using Python](../../get-started/get-started-python.md).
    - **Go** with the [xrpl-go library](https://github.com/Peersyst/xrpl-go). See [Get Started Using Go](../../get-started/get-started-go.md).

## Source Code

The complete source code for this tutorial's example is in the [code samples section of this website's repository](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/inspect-fungible-token).

## Steps

The example runs against the [Devnet](../../public-servers.md) `USD` token issued by `ryWPRK3BqMovxEQSt5C3fXZkUCxrqVXgf`. You can pass a different issuer and currency as command-line arguments.

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

Connect to Devnet and read the issuer and currency to inspect from the command line, falling back to defaults if none are provided.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/inspect-fungible-token/js/inspect-trust-line-token.js" language="js" from="// --- 1. Set up client and inputs ---" before="// --- 2. Define shared helpers ---" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/inspect-fungible-token/py/inspect_trust_line_token.py" language="py" from="# --- 1. Set up client and inputs ---" before="# --- 2. Define shared helpers ---" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/inspect-fungible-token/go/inspect-trust-line-token/main.go" language="go" /%}
{% /tab %}
{% /tabs %}

### 3. Define shared helpers

Two small helpers handle the two decoding tasks used throughout this tutorial:

- `percentFromTransferRate` converts the `TransferRate` field (an integer in **billionths**) to a human-readable percentage. A `TransferRate` of `1000000000` means 0% (no fee); `1005000000` means 0.5%; `2000000000` means the maximum 100%.
- `decodeFlags` walks a bitmask and returns the flag names that are set. The flag values themselves come from the [AccountRoot Flags reference](../../../references/protocol/ledger-data/ledger-entry-types/accountroot.md#accountroot-flags).

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/inspect-fungible-token/js/inspect-trust-line-token.js" language="js" from="// --- 2. Define shared helpers ---" before="// --- 3. Look up the issuer's AccountRoot ---" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/inspect-fungible-token/py/inspect_trust_line_token.py" language="py" from="# --- 2. Define shared helpers ---" before="# --- 3. Look up the issuer's AccountRoot ---" /%}
{% /tab %}
{% /tabs %}

{% admonition type="info" name="Tip" %}
The [`xrpl.js` library](https://github.com/XRPLF/xrpl.js) ships a convenience helper `xrpl.transferRateToPercent()` you can use instead of writing your own conversion.
{% /admonition %}

### 4. Look up the issuer's AccountRoot

The issuer's account controls the [transfer fee](../../../concepts/tokens/fungible-tokens/transfer-fees.md), the [tick size for offers](../../../concepts/tokens/decentralized-exchange/ticksize.md), and the flags that gate token behavior (auth required, rippling default, freezes, incoming-trustline block, clawback capability). All of these live on the [AccountRoot entry][] and apply to **every** trust line token this account issues, which is why issuers should use a dedicated issuing address per token.

Call the [`account_info`][account_info method] method to fetch the current `AccountRoot`, then decode the transfer rate and flags.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/inspect-fungible-token/js/inspect-trust-line-token.js" language="js" from="// --- 3. Look up the issuer's AccountRoot ---" before="// --- 4. Look up individual trust lines ---" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/inspect-fungible-token/py/inspect_trust_line_token.py" language="py" from="# --- 3. Look up the issuer's AccountRoot ---" before="# --- 4. Look up individual trust lines ---" /%}
{% /tab %}
{% /tabs %}

### 5. Look up individual trust lines

Beyond the issuer-wide settings, each holder-issuer pair has its own [RippleState entry][] with per-line settings: the `limit`, `authorized`, `no_ripple`, `freeze`, and `deep_freeze` flags, and `quality_in`/`quality_out` valuation. Use [`account_lines`][account_lines method] on either the issuer or the holder to enumerate these.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/inspect-fungible-token/js/inspect-trust-line-token.js" language="js" from="// --- 4. Look up individual trust lines ---" before="// --- 5. Reconstruct the TransferRate history ---" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/inspect-fungible-token/py/inspect_trust_line_token.py" language="py" from="# --- 4. Look up individual trust lines ---" before="# --- 5. Reconstruct the TransferRate history ---" /%}
{% /tab %}
{% /tabs %}

{% admonition type="info" name="Note" %}
`account_lines` on an issuer with many holders returns paginated results. The example filters a single page for brevity; production code should follow the `marker` field until the response no longer contains one. See [Markers and Pagination][Marker].
{% /admonition %}

### 6. Reconstruct the TransferRate history

The current transfer rate is a single field, but the issuer can change it at any time by submitting an [`AccountSet`][AccountSet transaction] transaction with a new `TransferRate` value. To reconstruct that history, walk the issuer's transaction stream in **forward** order and record each `AccountSet` that carries a `TransferRate` field different from the previous observed value.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/inspect-fungible-token/js/inspect-trust-line-token.js" language="js" from="// --- 5. Reconstruct the TransferRate history ---" before="// --- 6. Main flow ---" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/inspect-fungible-token/py/inspect_trust_line_token.py" language="py" from="# --- 5. Reconstruct the TransferRate history ---" before="# --- 6. Main flow ---" /%}
{% /tab %}
{% /tabs %}

{% admonition type="warning" name="Performance" %}
`account_tx` scans every transaction the issuer has ever sent. For active issuers this can be tens of thousands of entries. In production, cache the walk and resume from the last seen `ledger_index_min` instead of scanning from `-1` each time.
{% /admonition %}

### 7. Run the inspector

The main flow strings the pieces together — connect, look up the issuer, look up the trust lines, reconstruct the fee history, disconnect.

{% tabs %}
{% tab label="JavaScript" %}
```sh
node inspect-trust-line-token.js ryWPRK3BqMovxEQSt5C3fXZkUCxrqVXgf USD
```
{% /tab %}
{% tab label="Python" %}
```sh
python inspect_trust_line_token.py ryWPRK3BqMovxEQSt5C3fXZkUCxrqVXgf USD
```
{% /tab %}
{% tab label="Go" %}
```sh
go run ./inspect-trust-line-token ryWPRK3BqMovxEQSt5C3fXZkUCxrqVXgf USD
```
{% /tab %}
{% /tabs %}

The output shows the issuer settings, the individual trust lines, and the chronological transfer rate history.

## See Also

- **Concepts:**
    - [Trust Line Tokens](../../../concepts/tokens/fungible-tokens/trust-line-tokens.md)
    - [Transfer Fees](../../../concepts/tokens/fungible-tokens/transfer-fees.md)
    - [Authorized Trust Lines](../../../concepts/tokens/fungible-tokens/authorized-trust-lines.md)
    - [Freezes](../../../concepts/tokens/fungible-tokens/freezes.md)
- **References:**
    - [account_info method][]
    - [account_lines method][]
    - [account_tx method][]
    - [AccountRoot object](../../../references/protocol/ledger-data/ledger-entry-types/accountroot.md)
    - [RippleState object](../../../references/protocol/ledger-data/ledger-entry-types/ripplestate.md)
    - [AccountSet transaction][]
- **Related tutorials:**
    - [Issue a Fungible Token](./issue-a-fungible-token.md)
    - [Inspect MPT Properties](../mpts/inspect-mpt.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
