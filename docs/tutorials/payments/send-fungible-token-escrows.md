---
seo:
  description: Create and finish escrows that hold fungible tokens (MPTs and trust line tokens) on the XRP Ledger.
metadata:
  indexPage: true
labels:
  - Escrow
---

# Send Fungible Token Escrows

This tutorial shows you how to create and finish escrows that hold fungible tokens on the XRP Ledger. It covers two types of fungible token escrows:

- **Conditional MPT escrow**: An escrow holding [Multi-Purpose Tokens](../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md) that is released when a crypto-condition is fulfilled.
- **Timed trust line token escrow**: An escrow holding [trust line tokens](../../concepts/tokens/fungible-tokens/trust-line-tokens.md) that is released after a specified time.

{% admonition type="info" name="Note" %}
Though this tutorial covers these two specific scenarios, both fungible token types can be used in either conditional or timed escrows.
{% /admonition %}

{% amendment-disclaimer name="TokenEscrow" /%}


## Goals

By the end of this tutorial, you will be able to:

- Issue an MPT with escrow support enabled.
- Create and finish a conditional escrow that holds MPTs.
- Enable trust line token escrows on an issuer account.
- Create and finish a timed escrow that holds trust line tokens.


## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
- Have an XRP Ledger client library installed. This page provides examples for the following:
  - **JavaScript** with the [xrpl.js library][]. See [Get Started Using JavaScript][] for setup steps.
  - **Python** with the [xrpl-py library][]. See [Get Started Using Python][] for setup steps.
  - **Go** with the [xrpl-go library][]. See [Get Started Using Go][] for setup steps.


## Source Code

You can find the complete source code for this tutorial's examples in the {% repo-link path="_code-samples/escrow/" %}code samples section of this website's repository{% /repo-link %}.


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

### 2. Set up client and fund accounts

Import the necessary libraries, instantiate a client to connect to the XRPL, and fund two new accounts (**Issuer** and **Escrow Creator**). This example imports:

{% tabs %}
{% tab label="JavaScript" %}
- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling.
- `five-bells-condition` and `crypto`: Used to generate a crypto-condition.

{% code-snippet file="/_code-samples/escrow/js/sendFungibleTokenEscrow.js" language="js" before="// ====== Conditional MPT Escrow ======" /%}
{% /tab %}
{% tab label="Python" %}
- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling.
- `json`: Used for loading and formatting JSON data.
- `os` and `cryptoconditions`: Used to generate a crypto-condition.
- `datetime` and `time`: Used for time calculations.

{% code-snippet file="/_code-samples/escrow/py/send_fungible_token_escrow.py" language="py" before="# ====== Conditional MPT Escrow ======" /%}
{% /tab %}
{% tab label="Go" %}
- `xrpl-go`: Used for XRPL client connection, transaction submission, and wallet handling.
- `encoding/json`, `strings`, and `fmt`: Used for formatting and printing results to the console.
- `cryptoconditions`, `crypto/rand` and `encoding/hex`: Used to generate a crypto-condition.
- `time`: Used for time calculations.

{% code-snippet file="/_code-samples/escrow/go/send-fungible-token-escrow/main.go" language="go" before="// ====== Conditional MPT Escrow ======" /%}
{% /tab %}
{% /tabs %}

### 3. Issue an MPT with escrow support

Construct an [MPTokenIssuanceCreate transaction][] with the `tfMPTCanEscrow` flag, which enables the token to be held in escrows. Then, retrieve the MPT issuance ID from the transaction result. This example creates an escrow that sends MPTs back to the original issuer. If you wanted to create an escrow for another account, the issuer would also have to set the `tfMPTCanTransfer` flag.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/sendFungibleTokenEscrow.js" language="js" from="// ====== Conditional MPT Escrow ======" before="// Escrow Creator authorizes the MPT" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/escrow/py/send_fungible_token_escrow.py" language="py" from="# ====== Conditional MPT Escrow ======" before="# Escrow Creator authorizes the MPT" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/escrow/go/send-fungible-token-escrow/main.go" language="go" from="// ====== Conditional MPT Escrow ======" before="// Escrow Creator authorizes the MPT" /%}
{% /tab %}
{% /tabs %}

### 4. Authorize the MPT

Before the escrow creator can hold the MPT, they must indicate their willingness to hold it with the [MPTokenAuthorize transaction][].

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/sendFungibleTokenEscrow.js" language="js" from="// Escrow Creator authorizes the MPT" before="// Issuer sends MPTs to escrow creator" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/escrow/py/send_fungible_token_escrow.py" language="py" from="# Escrow Creator authorizes the MPT" before="# Issuer sends MPTs to escrow creator" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/escrow/go/send-fungible-token-escrow/main.go" language="go" from="// Escrow Creator authorizes the MPT" before="// Issuer sends MPTs to escrow creator" /%}
{% /tab %}
{% /tabs %}

### 5. Send MPTs to the escrow creator

Send MPTs from the issuer to the escrow creator using a [Payment transaction][].

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/sendFungibleTokenEscrow.js" language="js" from="// Issuer sends MPTs to escrow creator" before="// Escrow Creator creates a conditional MPT escrow" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/escrow/py/send_fungible_token_escrow.py" language="py" from="# Issuer sends MPTs to escrow creator" before="# Escrow Creator creates a conditional MPT escrow" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/escrow/go/send-fungible-token-escrow/main.go" language="go" from="// Issuer sends MPTs to escrow creator" before="// Escrow Creator creates a conditional MPT escrow" /%}
{% /tab %}
{% /tabs %}

### 6. Create a condition and fulfillment

Conditional escrows require a fulfillment and its corresponding condition in the format of a PREIMAGE-SHA-256 _crypto-condition_, represented as hexadecimal. To calculate these in the correct format, use a crypto-conditions library. Generally, you want to generate the fulfillment using at least 32 random bytes from a cryptographically secure source of randomness.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/sendFungibleTokenEscrow.js" language="js" from="// Escrow Creator creates a conditional MPT escrow" before="// Set expiration" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/escrow/py/send_fungible_token_escrow.py" language="py" from="# Escrow Creator creates a conditional MPT escrow" before="# Set expiration" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/escrow/go/send-fungible-token-escrow/main.go" language="go" from="// Escrow Creator creates a conditional MPT escrow" before="// Set expiration" /%}
{% /tab %}
{% /tabs %}

### 7. Create the conditional MPT escrow

Create a conditional escrow using the generated crypto-condition. Fungible token escrows require an expiration date. This example sets an expiration time of five minutes. After creating the escrow, save the sequence number to reference it later.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/sendFungibleTokenEscrow.js" language="js" from="// Set expiration" before="// Finish the conditional MPT escrow" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/escrow/py/send_fungible_token_escrow.py" language="py" from="# Set expiration" before="# Finish the conditional MPT escrow" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/escrow/go/send-fungible-token-escrow/main.go" language="go" from="// Set expiration" before="// Finish the conditional MPT escrow" /%}
{% /tab %}
{% /tabs %}

### 8. Finish the conditional MPT escrow

Finish the escrow by providing the original condition and its matching fulfillment.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/sendFungibleTokenEscrow.js" language="js" from="// Finish the conditional MPT escrow" before="// ====== Timed Trust Line Token Escrow ======" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/escrow/py/send_fungible_token_escrow.py" language="py" from="# Finish the conditional MPT escrow" before="# ====== Timed Trust Line Token Escrow ======" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/escrow/go/send-fungible-token-escrow/main.go" language="go" from="// Finish the conditional MPT escrow" before="// ====== Timed Trust Line Token Escrow ======" /%}
{% /tab %}
{% /tabs %}

### 9. Enable trust line token escrows

Token issuers enable trust line token escrows differently from MPTs. Unlike MPTs, which are escrowable at the token level, trust line tokens are escrowable at the account level. When an issuer enables the `asfAllowTrustLineLocking` flag on their account, _all_ trust line tokens issued from that account are escrowable.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/sendFungibleTokenEscrow.js" language="js" from="// ====== Timed Trust Line Token Escrow ======" before="// Escrow Creator sets up a trust line" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/escrow/py/send_fungible_token_escrow.py" language="py" from="# ====== Timed Trust Line Token Escrow ======" before="# Escrow Creator sets up a trust line" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/escrow/go/send-fungible-token-escrow/main.go" language="go" from="// ====== Timed Trust Line Token Escrow ======" before="// Escrow Creator sets up a trust line" /%}
{% /tab %}
{% /tabs %}

### 10. Set up a trust line

Establish a trust line between the escrow creator and issuer using the [TrustSet transaction][]. The escrow creator submits this transaction to indicate their willingness to receive the token, defining the currency and maximum amount they're willing to hold.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/sendFungibleTokenEscrow.js" language="js" from="// Escrow Creator sets up a trust line" before="// Issuer sends IOU tokens to creator" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/escrow/py/send_fungible_token_escrow.py" language="py" from="# Escrow Creator sets up a trust line" before="# Issuer sends IOU tokens to creator" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/escrow/go/send-fungible-token-escrow/main.go" language="go" from="// Escrow Creator sets up a trust line" before="// Issuer sends IOU tokens to creator" /%}
{% /tab %}
{% /tabs %}

### 11. Send IOU tokens to the escrow creator

Send IOU tokens from the issuer to the escrow creator using a [Payment transaction][].

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/sendFungibleTokenEscrow.js" language="js" from="// Issuer sends IOU tokens to creator" before="// Escrow Creator creates a timed trust line token escrow" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/escrow/py/send_fungible_token_escrow.py" language="py" from="# Issuer sends IOU tokens to creator" before="# Escrow Creator creates a timed trust line token escrow" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/escrow/go/send-fungible-token-escrow/main.go" language="go" from="// Issuer sends IOU tokens to creator" before="// Escrow Creator creates a timed trust line token escrow" /%}
{% /tab %}
{% /tabs %}

### 12. Create a timed trust line token escrow

To make a timed escrow, set the maturity time of the escrow, which is a timestamp formatted as [seconds since the Ripple Epoch][]. This example sets a maturity time of ten seconds from the time the code executes. Since it is a fungible token escrow, it also sets an expiration time of five minutes. After submitting the [EscrowCreate transaction][], save the sequence number from the transaction result.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/sendFungibleTokenEscrow.js" language="js" from="// Escrow Creator creates a timed trust line token escrow" before="// Wait for the escrow to mature" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/escrow/py/send_fungible_token_escrow.py" language="py" from="# Escrow Creator creates a timed trust line token escrow" before="# Wait for the escrow to mature" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/escrow/go/send-fungible-token-escrow/main.go" language="go" from="// Escrow Creator creates a timed trust line token escrow" before="// Wait for the escrow to mature" /%}
{% /tab %}
{% /tabs %}

### 13. Wait for escrow to mature and finish

Wait for the escrow to mature. Before submitting the [EscrowFinish][] transaction, the code checks the current validated ledger to confirm the close time is after the escrow maturation time. This check ensures the escrow is matured on a validated ledger before trying to finish it.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/sendFungibleTokenEscrow.js" language="js" from="// Wait for the escrow to mature" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/escrow/py/send_fungible_token_escrow.py" language="py" from="# Wait for the escrow to mature" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/escrow/go/send-fungible-token-escrow/main.go" language="go" from="// Wait for the escrow to mature" /%}
{% /tab %}
{% /tabs %}


## See Also

**Concepts**:
  - [Escrow](../../concepts/payment-types/escrow.md)
  - [Multi-Purpose Tokens](../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md)
  - [Trust Line Tokens](../../concepts/tokens/fungible-tokens/trust-line-tokens.md)

**Tutorials**:
  - [Look up Escrows](./look-up-escrows.md)
  - [Cancel an Expired Escrow](./cancel-an-expired-escrow.md)

**References**:
  - [EscrowCreate transaction][]
  - [EscrowFinish transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
