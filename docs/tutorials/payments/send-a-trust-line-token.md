---
seo:
  description: Send a direct payment of a trust line token on the XRP Ledger.
metadata:
  indexPage: true
labels:
  - Tokens
  - Payments
---

# Send a Trust Line Token

This tutorial shows you how to send a direct [trust line token](../../concepts/tokens/fungible-tokens/trust-line-tokens.md) payment on the XRP Ledger.

Each account must create a trust line to the issuer before it can hold the token. Holders can send the token to each other only if the issuer has the **Default Ripple** flag enabled, which lets the token move indirectly between holders through the issuer. This indirect movement of funds is called [rippling](../../concepts/tokens/fungible-tokens/rippling.md).

## Goals

By the end of this tutorial, you will be able to:

- Create a trust line that lets a holder receive a token from an issuer.
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
- `json`: Used for loading and formatting JSON data.
- `os` and `sys`: Used to check for setup data and exit on transaction failures.
- `send_trust_line_token_setup`: The tutorial set up script, imported and called directly.

{% code-snippet file="/_code-samples/send-a-trust-line-token/py/send_trust_line_token.py" language="py" before="# This step checks" /%}
{% /tab %}
{% tab label="Go" %}
- `xrpl-go`: Used for XRPL client connection, transaction submission, and wallet handling.
- `encoding/json` and `fmt`: Used for formatting and printing results to the console.
- `os` and `os/exec`: Used to run the tutorial setup script.

{% code-snippet file="/_code-samples/send-a-trust-line-token/go/send-trust-line-token/main.go" language="go" before="// This step checks" /%}
{% /tab %}
{% /tabs %}

Next, provide the issuer, sender, and receiver accounts.
{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/send-a-trust-line-token/js/sendTrustLineToken.js" language="js" from="// This step checks" before="// Create trust line" /%}

This example uses preconfigured accounts from the `sendTrustLineTokenSetup.js` script, but you can replace `issuer`, `sender`, and `receiver` with your own values.

{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/send-a-trust-line-token/py/send_trust_line_token.py" language="py" from="# This step checks" before="# Create trust line" /%}

This example uses preconfigured accounts from the `send_trust_line_token_setup.py` script, but you can replace `issuer`, `sender`, and `receiver` with your own values.
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/send-a-trust-line-token/go/send-trust-line-token/main.go" language="go" from="// This step checks" before="// Create trust line" /%}

This example uses preconfigured accounts from the `sendTrustLineTokenSetup` script, but you can replace `issuer`, `sender`, and `receiver` with your own values.
{% /tab %}
{% /tabs %}

The preconfigured issuer account has the **Default Ripple** flag enabled so the token can be transferred between holders. If you provide a different `issuer` account, make sure this flag is enabled.

### 3. Create a trust line from the receiver to the issuer

Any account that wants to hold a trust line token, whether sending or receiving, must opt in first.

Submit a [TrustSet transaction][], signed by the receiver account, to create the trust line. The setup script already created the sender's trust line, so this step is only needed for the receiver.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/send-a-trust-line-token/js/sendTrustLineToken.js" language="js" from="// Create trust line" before="// Check initial balances" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/send-a-trust-line-token/py/send_trust_line_token.py" language="py" from="# Create trust line" before="# Check initial balances" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/send-a-trust-line-token/go/send-trust-line-token/main.go" language="go" from="// Create trust line" before="// Check initial balances" /%}
{% /tab %}
{% /tabs %}

The `LimitAmount` field specifies the maximum quantity of the token the holder is willing to hold, the currency code, and the issuer's address.

A `tesSUCCESS` result confirms the trust line now exists, so the receiver can hold up to the `LimitAmount` of this token from the issuer.

{% admonition type="info" name="Note" %}
If the issuer uses authorized trust lines (enables the **Require Auth** flag), this step isn't enough on its own. After the receiver creates the trust line, the issuer must also approve it by submitting a [TrustSet transaction][] with the `tfSetfAuth` flag enabled and `LimitAmount.issuer` set to the receiver's address. **The issuer in this tutorial doesn't require authorization, so no issuer approval is needed.**
{% /admonition %}

### 4. Check initial balances

Before sending the payment, check each account's balance using the [account_lines method][]. The sender should have an initial balance, while the receiver's balance should be `0`.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/send-a-trust-line-token/js/sendTrustLineToken.js" language="js" from="// Check initial balances" before="// Send issued token" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/send-a-trust-line-token/py/send_trust_line_token.py" language="py" from="# Check initial balances" before="# Send issued token" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/send-a-trust-line-token/go/send-trust-line-token/main.go" language="go" from="// Check initial balances" before="// Send issued token" /%}
{% /tab %}
{% /tabs %}

A trust line is a bidirectional relationship with a single, shared balance that is positive from one account's perspective and negative from the other's. Querying `account_lines` on a holder with `peer` set to the issuer returns the positive value; querying it on the issuer with `peer` set to a holder returns the same value as a negative number.

### 5. Send the token payment

Once the receiver's trust line exists, the sender can send the token to the receiver with a [Payment transaction][]. Provide the [issued currency amount](../../references/protocol/data-types/currency-formats.md#token-amounts) object that specifies the currency code, the issuer's address, and the value to send.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/send-a-trust-line-token/js/sendTrustLineToken.js" language="js" from="// Send issued token" before="// Verify balances" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/send-a-trust-line-token/py/send_trust_line_token.py" language="py" from="# Send issued token" before="# Verify balances" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/send-a-trust-line-token/go/send-trust-line-token/main.go" language="go" from="// Send issued token" before="// Verify balances" /%}
{% /tab %}
{% /tabs %}

The preconfigured issuer in this tutorial doesn't charge a [transfer fee](../../concepts/tokens/fungible-tokens/transfer-fees.md), so the sender's balance decreases by the same amount the receiver gains. If you replace the issuer with one that has a non-zero `TransferRate`, the sender's balance decreases by more than the receiver gains. In that case, include a `SendMax` field in the `Payment` set to the maximum amount the sender is willing to spend, so the payment can cover the transfer fee.

{% admonition type="warning" name="Caution" %}
If the payment fails, it could be for one of the following reasons:

- `tecNO_AUTH`: the issuer uses authorized trust lines and hasn't approved the receiver's trust line.
- `tecPATH_PARTIAL`: the sender doesn't have enough balance to cover the payment. This can also occur if the issuer has configured a non-zero `TransferRate` and the sender doesn't have enough to cover the payment plus the transfer fee.
- `tecPATH_DRY`: no path could deliver any amount at all. This commonly happens when the receiver has no trust line for the token, or the issuer doesn't have **Default Ripple** enabled.
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

The sender's balance should have decreased by the amount sent and the receiver's should have increased by the same amount. On the issuer's side of each trust line, the balance with the sender is reduced and the balance with the receiver is increased.

## See Also

- **Concepts**:
  - [Trust Line Tokens](../../concepts/tokens/fungible-tokens/trust-line-tokens.md)
  - [Rippling](../../concepts/tokens/fungible-tokens/rippling.md)
- **Tutorials**:
  - [Issue a Fungible Token](../tokens/fungible-tokens/issue-a-fungible-token.md)
- **References**:
  - [TrustSet transaction][]
  - [Payment transaction][]
  - [account_lines method][]
  - [RippleState entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
