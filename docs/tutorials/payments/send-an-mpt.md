---
seo:
  description: Send a direct payment of a Multi-Purpose Token (MPT) on the XRP Ledger.
metadata:
  indexPage: true
labels:
  - Multi-Purpose Token
  - MPT
  - Payments
---
# Send a Multi-Purpose Token (MPT)

This tutorial shows you how to send a direct [Multi-Purpose Token (MPT)](../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md) payment on the XRP Ledger.

Each account must authorize the MPT before it can hold the token. This is to prevent malicious users from spamming accounts with unwanted tokens that could negatively impact storage and XRP reserves. Holders can send the MPT to each other only if the issuance has the **Can Transfer** flag enabled, and both parties are authorized.

{% amendment-disclaimer name="MPTokensV1" /%}

## Goals

By the end of this tutorial, you will be able to:

- Authorize an account to hold a specific MPT.
- Send a payment of an MPT between two accounts.
- Verify the payment was successful.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
- Have an XRP Ledger client library set up in your development environment. This page provides examples for the following:
  - **JavaScript** with the [xrpl.js library][]. See [Get Started Using JavaScript][] for setup steps.
  - **Python** with the [xrpl-py library][]. See [Get Started Using Python][] for setup steps.
  - **Go** with the [xrpl-go library][]. See [Get Started Using Go][] for setup steps.

## Source Code

You can find the complete source code for this tutorial's examples in the {% repo-link path="_code-samples/send-an-mpt/" %}code samples section of this website's repository{% /repo-link %}.

## Steps

### 1. Install dependencies

{% tabs %}
{% tab label="JavaScript" %}
From the `js/` folder, use `npm` to install dependencies.

```sh
npm install
```
{% /tab %}

{% tab label="Python" %}
From the `py/` folder, set up a virtual environment and use `pip` to install dependencies.

```sh
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
{% /tab %}

{% tab label="Go" %}
From the `go/` folder, use `go` to install dependencies.

```sh
go mod tidy
```
{% /tab %}
{% /tabs %}

### 2. Set up client and accounts

To get started, import the necessary libraries and instantiate a client to connect to the XRPL. This example imports:

{% tabs %}
{% tab label="JavaScript" %}
- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling.
- `fs` and `child_process`: Used to run tutorial set up scripts.

{% code-snippet file="/_code-samples/send-an-mpt/js/sendMPT.js" language="js" before="// Load setup data" /%}
{% /tab %}

{% tab label="Python" %}
- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling.
- `json`: Used for loading and formatting JSON data.
- `os`, `subprocess`, and `sys`: Used to run tutorial set up scripts.

{% code-snippet file="/_code-samples/send-an-mpt/py/send_mpt.py" language="py" before="# Load setup data" /%}
{% /tab %}

{% tab label="Go" %}
- `xrpl-go`: Used for XRPL client connection, transaction submission, and wallet handling.
- `encoding/json` and `fmt`: Used for formatting and printing results to the console.
- `os` and `os/exec`: Used to run tutorial set up scripts.

{% code-snippet file="/_code-samples/send-an-mpt/go/send-mpt/main.go" language="go" before="// Load setup data" /%}
{% /tab %}
{% /tabs %}

Next, provide the sender and receiver wallets, and the MPT issuance ID.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/send-an-mpt/js/sendMPT.js" language="js" from="// Load setup data" before="// Authorize receiver" /%}

This example uses a preconfigured sender and MPT issuance from the `sendMPTSetup.js` script, but you can replace `sender` and `mptIssuanceID` with your own values.
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/send-an-mpt/py/send_mpt.py" language="py" from="# Load setup data" before="# Authorize receiver" /%}

This example uses a preconfigured sender and MPT issuance from the `send_mpt_setup.py` script, but you can replace `sender` and `mpt_issuance_id` with your own values.
{% /tab %}

{% tab label="Go" %}
{% code-snippet file="/_code-samples/send-an-mpt/go/send-mpt/main.go" language="go" from="// Load setup data" before="// Authorize receiver" /%}

This example uses a preconfigured sender and MPT issuance from the `send-mpt-setup/main.go` script, but you can replace `sender` and `mptIssuanceID` with your own values.
{% /tab %}
{% /tabs %}

### 3. Authorize the receiving account

Any account that wants to hold an MPT, whether sending or receiving, must opt in first. Submit an [MPTokenAuthorize transaction][], signed by the holder, to create an `MPToken` ledger entry on their account. In this tutorial, the setup script authorizes the sender before transferring it any tokens, so this step only runs for the receiver.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/send-an-mpt/js/sendMPT.js" language="js" from="// Authorize receiver" before="// Check initial balances" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/send-an-mpt/py/send_mpt.py" language="py" from="# Authorize receiver" before="# Check initial balances" /%}
{% /tab %}

{% tab label="Go" %}
{% code-snippet file="/_code-samples/send-an-mpt/go/send-mpt/main.go" language="go" from="// Authorize receiver" before="// Check initial balances" /%}
{% /tab %}
{% /tabs %}

A `tesSUCCESS` result confirms the receiver is now authorized to hold the MPT, and should have an `MPToken` ledger entry with a balance of zero.

{% admonition type="info" name="Note" %}
If the issuance uses allow-listing (the **Require Auth** flag), this step isn't enough on its own. After the holder opts in, the issuer typically must also approve the holder—usually by submitting its own [MPTokenAuthorize transaction][] with the `Holder` field set to the holder's address. **The token used in this tutorial doesn't use allow-listing, so no issuer approval is needed.**
{% /admonition %}

### 4. Check initial balances

Before sending the payment, check each account's MPT holdings using the [account_objects method][]. For each account, filter by the object type `MPToken` and locate the entry whose `MPTokenIssuanceID` matches this issuance.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/send-an-mpt/js/sendMPT.js" language="js" from="// Check initial balances" before="// Send MPT from sender" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/send-an-mpt/py/send_mpt.py" language="py" from="# Check initial balances" before="# Send MPT from sender" /%}
{% /tab %}

{% tab label="Go" %}
{% code-snippet file="/_code-samples/send-an-mpt/go/send-mpt/main.go" language="go" from="// Check initial balances" before="// Send MPT from sender" /%}
{% /tab %}
{% /tabs %}

### 5. Send the token payment

Specify an [MPT amount](../../references/protocol/data-types/currency-formats.md#mpt-amounts) to send to the receiver, then submit the [Payment transaction][].

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/send-an-mpt/js/sendMPT.js" language="js" from="// Send MPT from sender" before="// Verify balances" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/send-an-mpt/py/send_mpt.py" language="py" from="# Send MPT from sender" before="# Verify balances" /%}
{% /tab %}

{% tab label="Go" %}
{% code-snippet file="/_code-samples/send-an-mpt/go/send-mpt/main.go" language="go" from="// Send MPT from sender" before="// Verify balances" /%}
{% /tab %}
{% /tabs %}

The MPT issuance in this example uses an [asset scale](../../references/protocol/data-types/currency-formats.md#mpt-precision) of `2`, so applications shift the displayed amount two decimal places. A _value_ of `"100"` therefore shows as `1.00` units of the token.

The example MPT has a `TransferFee` of `0`, which means the sender's debit matches the payment value exactly. With a non-zero `TransferFee`, the sender would have to pay extra so the receiver gets the full value.

{% admonition type="warning" name="Caution" %}
If the payment fails, it could be for one of the following reasons:

- `tecNO_AUTH`: the issuance does not have **Can Transfer** enabled, or (with allow-listing) the issuer hasn't approved the holder.
- `tecINSUFFICIENT_FUNDS`: the sender's MPT balance is less than the value being sent.
- `tecLOCKED`: the issuance, the sender, or the receiver is locked by the issuer (only possible if the issuance has the **Can Lock** flag enabled).
{% /admonition %}

### 6. Verify updated balances

Check both accounts' MPT holdings again to confirm the transfer.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/send-an-mpt/js/sendMPT.js" language="js" from="// Verify balances" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/send-an-mpt/py/send_mpt.py" language="py" from="# Verify balances" /%}
{% /tab %}

{% tab label="Go" %}
{% code-snippet file="/_code-samples/send-an-mpt/go/send-mpt/main.go" language="go" from="// Verify balances" /%}
{% /tab %}
{% /tabs %}

The sender's `MPTAmount` should have decreased by the value you sent, and the receiver's should match it.

## See Also

**Concepts**:
  - [Multi-Purpose Tokens (MPT)](../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md)

**Tutorials**:
  - [Issue a Multi-Purpose Token (MPT)](../tokens/mpts/issue-a-multi-purpose-token.md)

**References**:
  - [MPTokenAuthorize transaction][]
  - [Payment transaction][]
  - [account_objects method][]
  - [MPToken entry][]
  - [MPTokenIssuance entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
