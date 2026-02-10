---
seo:
  description: Claw back tokens that have been deposited into a LoanBroker entry as first-loss capital.
metadata:
  indexPage: true
labels:
  - Lending Protocol
status: not_enabled
---

# Claw Back First-Loss Capital

This tutorial shows you how to claw back tokens from a [LoanBroker][] on the XRP Ledger. The clawback feature enables token issuers (Multi-Purpose or Trust Line) to meet regulatory standards and claw back funds even if those funds have been deposited as [first-loss capital](../../../../concepts/tokens/lending-protocol.md#risk-management).

{% amendment-disclaimer name="LendingProtocol" /%}

## Goals

By the end of this tutorial, you will be able to:

- Deposit an MPT as first-loss capital into a `LoanBroker` entry.
- Verify the MPT issuer.
- Claw back all first-loss capital from the `LoanBroker` entry.
- Check the cover available for the `LoanBroker` entry.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
- Have an XRP Ledger client library set up in your development environment. This page provides examples for the following:
  - **JavaScript** with the [xrpl.js library][]. See [Get Started Using JavaScript][] for setup steps.

## Source Code

You can find the complete source code for this tutorial's examples in the {% repo-link path="_code-samples/lending-protocol/" %}code samples section of this website's repository{% /repo-link %}.

## Steps

### 1. Install dependencies

{% tabs %}
{% tab label="JavaScript" %}
From the code sample folder, use npm to install dependencies.

```bash
npm install xrpl
```

{% /tab %}
{% /tabs %}

### 2. Set up client and accounts

To get started, import the necessary libraries and instantiate a client to connect to the XRPL. This example imports:
- `xrpl`: Used for XRPL client connection and transaction handling.
- `fs` and `child_process`: Used to run tutorial set up scripts.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/coverClawback.js" language="js" before="// This step checks" /%}
{% /tab %}
{% /tabs %}

Next, load the loan broker account, MPT issuer account, loan broker ID, and MPT ID.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/coverClawback.js" language="js" from="// This step checks" before="// Check cover available" /%}
{% /tab %}
{% /tabs %}

This example uses preconfigured accounts, MPTs, and loan broker data from the `lendingSetup.js` script, but you can replace `loanBroker`, `mptIssuer`, `loanBrokerID`, and `mptID` with your own values.

### 3. Check initial cover available

Check the initial cover (first-loss capital) available using the [ledger_entry method][].

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/coverClawback.js" language="js" from="// Check cover available" before="// Prepare LoanBrokerCoverDeposit" /%}
{% /tab %}
{% /tabs %}

If the `CoverAvailable` field is missing, it means no first-loss capital has been deposited.

### 4. Prepare LoanBrokerCoverDeposit transaction

Create the [LoanBrokerCoverDeposit transaction][] object.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/coverClawback.js" language="js" from="// Prepare LoanBrokerCoverDeposit" before="// Sign, submit, and wait for deposit validation" /%}
{% /tab %}
{% /tabs %}

The `Amount` field specifies the MPT and amount to deposit as first-loss capital. If the transaction succeeds, the amount is deposited and held in the pseudo-account associated with the `LoanBroker` entry.

### 5. Submit LoanBrokerCoverDeposit transaction

Sign and submit the `LoanBrokerCoverDeposit` transaction to the XRP Ledger.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/coverClawback.js" language="js" from="// Sign, submit, and wait for deposit validation" before="// Extract updated cover available" /%}
{% /tab %}
{% /tabs %}

Verify that the transaction succeeded by checking for a `tesSUCCESS` result code.

### 6. Check updated cover available

Retrieve the cover available from the transaction result by checking the `LoanBroker` entry in the transaction metadata.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/coverClawback.js" language="js" from="// Extract updated cover available" before="// Verify issuer of cover asset" /%}
{% /tab %}
{% /tabs %}

### 7. Verify the asset issuer

Before executing a clawback, verify that the account submitting the transaction is the same as the asset issuer.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/coverClawback.js" language="js" from="// Verify issuer of cover asset" before="// Prepare LoanBrokerCoverClawback" /%}
{% /tab %}
{% /tabs %}

Clawback functionality is disabled by default. In the case of MPTs, the `tfMPTCanClawback` flag must be enabled when the [MPTokenIssuanceCreate transaction][] is submitted. This tutorial uses an MPT that is already configured for clawback.

### 7. Prepare LoanBrokerCoverClawback transaction

Create the [LoanBrokerCoverClawback transaction][] object.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/coverClawback.js" language="js" from="// Prepare LoanBrokerCoverClawback" before="// Sign, submit, and wait for clawback validation" /%}
{% /tab %}
{% /tabs %}

In this example we claw back the entire amount, but you can specify any amount so long as it doesn't exceed the available cover or reduce the cover below the minimum required by the `LoanBroker`.

### 8. Submit LoanBrokerCoverClawback transaction

Sign and submit the `LoanBrokerCoverClawback` transaction to the XRP Ledger.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/coverClawback.js" language="js" from="// Sign, submit, and wait for clawback validation" before="// Extract final cover available" /%}
{% /tab %}
{% /tabs %}

Verify that the transaction succeeded by checking for a `tesSUCCESS` result code.

### 9. Check final cover available

Retrieve the final cover available from the transaction result.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/coverClawback.js" language="js" from="// Extract final cover available" /%}
{% /tab %}
{% /tabs %}

## See Also

**Concepts**:
  - [Lending Protocol][]
  - [Clawing Back Tokens](../../../../concepts/tokens/fungible-tokens/clawing-back-tokens.md)

**Tutorials**:
  - [Issue a Multi-Purpose Token (MPT)](../../use-tokens/issue-a-multi-purpose-token.md)

**References**:
  - [LoanBrokerCoverDeposit transaction][]
  - [LoanBrokerCoverClawback transaction][]
  - [MPTokenIssuanceCreate transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
