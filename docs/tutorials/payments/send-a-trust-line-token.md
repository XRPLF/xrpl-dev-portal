---
seo:
  description: Send a trust line token from one holder to another on the XRP Ledger.
metadata:
  indexPage: true
labels:
  - Tokens
  - Payments
---

# Send a Trust Line Token

This tutorial shows you how to send a [trust line token](../../concepts/tokens/fungible-tokens/trust-line-tokens.md) from one holder to another on the XRP Ledger.

Each account must create a trust line to the issuer before it can hold the token. Holders can send the token to each other through the issuer only if the issuer allows rippling on both of their trust lines, either on all of its trust lines by enabling the **Default Ripple** flag (recommended), or on individual trust lines. This indirect movement of funds is called [rippling](../../concepts/tokens/fungible-tokens/rippling.md).

## Goals

By the end of this tutorial, you will be able to:

- Check that a receiving account can accept a trust line token payment.
- Send a trust line token payment between two accounts.
- Verify the payment was successful.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
- Have an XRP Ledger client library set up in your development environment. This page provides examples for the following:
  - **JavaScript** with the [xrpl.js library][]. See [Get Started Using JavaScript][] for setup steps.
  - **Python** with the [xrpl-py library][]. See [Get Started Using Python][] for setup steps.
  - **Go** with the [xrpl-go library][]. See [Get Started Using Go][] for setup steps.

## Source Code

You can find the complete source code for this tutorial's examples in the {% repo-link path="_code-samples/send-a-trust-line-token/" %}code samples section of this website's repository{% /repo-link %}.

## Steps

### 1. Install dependencies

{% tabs %}
{% tab label="JavaScript" %}
From the code sample folder, use `npm` to install dependencies.

```bash
npm install
```
{% /tab %}
{% tab label="Python" %}
From the code sample folder, set up a virtual environment and use `pip` to install dependencies.

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
{% /tab %}
{% tab label="Go" %}
From the code sample folder, use `go` to install dependencies.

```bash
go mod tidy
```
{% /tab %}
{% /tabs %}

### 2. Set up client and accounts

To get started, import the necessary libraries and instantiate a client to connect to the XRPL. This example imports:

{% tabs %}
{% tab label="JavaScript" %}
- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling.
- `fs`: Used to check for and load the tutorial setup data.
- `./sendTrustLineTokenSetup.js`: The tutorial set up script, imported and called directly.

{% code-snippet file="/_code-samples/send-a-trust-line-token/js/sendTrustLineToken.js" language="js" before="// This step checks" /%}
{% /tab %}
{% tab label="Python" %}
- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling.
- `decimal`: Used to compare token amounts without floating-point rounding.
- `json`: Used for loading and formatting JSON data.
- `os` and `sys`: Used to check for setup data and exit on transaction failures.
- `send_trust_line_token_setup`: The tutorial set up script, imported and called directly.

{% code-snippet file="/_code-samples/send-a-trust-line-token/py/send_trust_line_token.py" language="py" before="# This step checks" /%}
{% /tab %}
{% tab label="Go" %}
- `xrpl-go`: Used for XRPL client connection, transaction submission, wallet handling, and ledger entry flag constants.
- `encoding/json` and `fmt`: Used for formatting and printing results to the console.
- `math/big`: Used to compare token amounts without floating-point rounding.
- `os` and `os/exec`: Used to run the tutorial setup script.

{% code-snippet file="/_code-samples/send-a-trust-line-token/go/send-trust-line-token/main.go" language="go" before="// This step checks" /%}
{% /tab %}
{% /tabs %}

Next, load the sender wallet, and set the token to send and the receiver address. This example uses pre-configured data from the setup script, which funds the sender and buys TST for it on the [Decentralized Exchange (DEX)](../../concepts/tokens/decentralized-exchange/index.md), but you can replace these with your own values.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/send-a-trust-line-token/js/sendTrustLineToken.js" language="js" from="// This step checks" before="// Check sender balance" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/send-a-trust-line-token/py/send_trust_line_token.py" language="py" from="# This step checks" before="# Check sender balance" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/send-a-trust-line-token/go/send-trust-line-token/main.go" language="go" from="// This step checks" before="// Check sender balance" /%}
{% /tab %}
{% /tabs %}

TST is a test token available on Testnet, and the receiver is an account that already holds a TST trust line. The `getTrustLine` helper uses the [account_lines method][] to look up the trust line between an account and the issuer, and the remaining steps use it to read balances.

### 3. Check the sender's balance

Before sending the payment, check the sender's balance using the [account_lines method][]. The sender should have an initial balance from the setup script, and at least enough to cover the payment.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/send-a-trust-line-token/js/sendTrustLineToken.js" language="js" from="// Check sender balance" before="// Check receiver" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/send-a-trust-line-token/py/send_trust_line_token.py" language="py" from="# Check sender balance" before="# Check receiver" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/send-a-trust-line-token/go/send-trust-line-token/main.go" language="go" from="// Check sender balance" before="// Check receiver" /%}
{% /tab %}
{% /tabs %}

A trust line is a bidirectional relationship with a single, shared balance that is positive from one account's perspective and negative from the other's. Querying `account_lines` on a holder with `peer` set to the issuer returns the positive value.

### 4. Check that the receiver can receive the payment

A payment between two holders can fail for reasons that have nothing to do with the sender. Check the receiver's trust line and the issuer's settings before submitting, so you can tell the user why a payment can't go through instead of letting it fail on the ledger.

First, request the issuer's settings with the [account_info method][] and the receiver's trust line with `account_lines`.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/send-a-trust-line-token/js/sendTrustLineToken.js" language="js" from="// Check receiver" before="// 1. The receiver must" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/send-a-trust-line-token/py/send_trust_line_token.py" language="py" from="# Check receiver" before="# 1. The receiver must" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/send-a-trust-line-token/go/send-trust-line-token/main.go" language="go" from="// Check receiver" before="// 1. The receiver must" /%}
{% /tab %}
{% /tabs %}

Then, run the following checks:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/send-a-trust-line-token/js/sendTrustLineToken.js" language="js" from="// 1. The receiver must" before="// Send payment" /%}

{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/send-a-trust-line-token/py/send_trust_line_token.py" language="py" from="# 1. The receiver must" before="# Send payment" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/send-a-trust-line-token/go/send-trust-line-token/main.go" language="go" from="// 1. The receiver must" before="// Send payment" /%}
{% /tab %}
{% /tabs %}

1. **Trust line exists**: The receiver has a trust line to the issuer for this currency.
2. **Rippling is allowed**: The issuer hasn't set `no_ripple_peer` on the sender's or receiver's line.
3. **Limit covers the payment**: The receiver's `limit` is at least their `balance` plus the amount.
4. **Authorization**: If the issuer requires auth, the receiver's line has `peer_authorized` set.
5. **Transfer fee**: If the issuer sets a `TransferRate`, the payment includes a `SendMax` to cover it, and the code refuses fees above a threshold.

### 5. Send the token payment

Once the checks pass, the sender can send the token to the receiver with a [Payment transaction][]. Provide the [issued currency amount](../../references/protocol/data-types/currency-formats.md#token-amounts) object that specifies the currency code, the issuer's address, and the value to send.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/send-a-trust-line-token/js/sendTrustLineToken.js" language="js" from="// Send payment" before="// Verify balances" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/send-a-trust-line-token/py/send_trust_line_token.py" language="py" from="# Send payment" before="# Verify balances" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/send-a-trust-line-token/go/send-trust-line-token/main.go" language="go" from="// Send payment" before="// Verify balances" /%}
{% /tab %}
{% /tabs %}

The TST issuer doesn't charge a [transfer fee](../../concepts/tokens/fungible-tokens/transfer-fees.md), so the sender's balance decreases by the same amount the receiver gains. If you replace the issuer with one that has a non-zero `TransferRate`, the sender's balance decreases by more than the receiver gains. The `SendMax` field set in the previous step covers the difference.

{% admonition type="warning" name="Caution" %}
If the payment fails, it could be for one of the following reasons:

- `tecPATH_PARTIAL`: the sender doesn't have enough balance to cover the payment. This can also occur if the issuer has configured a non-zero `TransferRate` and the sender doesn't have enough to cover the payment plus the transfer fee.
- `tecPATH_DRY`: no path could deliver any amount at all. This commonly happens when the receiver has no trust line for the token, the issuer doesn't allow rippling, or the receiver's trust line isn't authorized.
{% /admonition %}

### 6. Verify updated balances

Check the account balances again to confirm the transfer.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/send-a-trust-line-token/js/sendTrustLineToken.js" language="js" from="// Verify balances" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/send-a-trust-line-token/py/send_trust_line_token.py" language="py" from="# Verify balances" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/send-a-trust-line-token/go/send-trust-line-token/main.go" language="go" from="// Verify balances" /%}
{% /tab %}
{% /tabs %}

The sender's balance should have decreased by the amount sent and the receiver's should have increased by the same amount.

## See Also

- **Concepts**:
  - [Trust Line Tokens](../../concepts/tokens/fungible-tokens/trust-line-tokens.md)
  - [Rippling](../../concepts/tokens/fungible-tokens/rippling.md)
  - [Authorized Trust Lines](../../concepts/tokens/fungible-tokens/authorized-trust-lines.md)
  - [Transfer Fees](../../concepts/tokens/fungible-tokens/transfer-fees.md)
- **Tutorials**:
  - [Issue a Fungible Token](../tokens/fungible-tokens/issue-a-fungible-token.md)
  - [Trade in the Decentralized Exchange](../defi/dex/trade-in-the-decentralized-exchange.md)
- **References**:
  - [Payment transaction][]
  - [TrustSet transaction][]
  - [account_lines method][]
  - [account_info method][]
  - [RippleState entry][]
  - [AccountRoot entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
