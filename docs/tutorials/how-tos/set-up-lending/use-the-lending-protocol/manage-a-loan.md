---
seo:
  description: Impair and default a loan on the XRP Ledger.
metadata:
  indexPage: true
labels:
  - Lending Protocol
status: not_enabled
---

# Manage a Loan

This tutorial shows you how to manage a [Loan][] on the XRP Ledger. Loan management includes marking loans as impaired when payments are missed, defaulting loans after the grace period expires, and deleting repaid or defaulted loans.

The tutorial demonstrates how a loan broker can manually impair a loan before a payment due date passes (in cases where you suspect a borrower can't make a payment) and default the loan after the grace period expires.

{% amendment-disclaimer name="LendingProtocol" /%}

## Goals

By the end of this tutorial, you will be able to:

- Check the status of an existing loan.
- Manually impair a loan to speed up the default process.
- Wait through the loan's grace period.
- Default a loan after the grace period expires.

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
From the code sample folder, use npm to install dependencies:

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
{% code-snippet file="/_code-samples/lending-protocol/js/loanManage.js" language="js" before="// This step checks" /%}
{% /tab %}
{% /tabs %}

Next, load the loan broker account and loan ID.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/loanManage.js" language="js" from="// This step checks" before="// Check loan status" /%}
{% /tab %}
{% /tabs %}

This example uses preconfigured accounts and loan data from the `lendingSetup.js` script, but you can replace `loanBroker` and `loanID` with your own values.

### 3. Check loan status

Check the current status of the loan using the [ledger_entry method][]:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/loanManage.js" language="js" from="// Check loan status" before="// Prepare LoanManage transaction to impair" /%}
{% /tab %}
{% /tabs %}

This shows the total amount owed and the next payment due date. The [Ripple Epoch][] timestamp is converted to a JavaScript Date object for readability.

### 4. Prepare LoanManage transaction to impair the loan

Create the [LoanManage transaction][] with the `tfLoanImpair` flag:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/loanManage.js" language="js" from="// Prepare LoanManage transaction to impair" before="// Sign, submit, and wait for impairment" /%}
{% /tab %}
{% /tabs %}

### 5. Submit LoanManage impairment transaction

Sign and submit the `LoanManage` transaction to impair the loan:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/loanManage.js" language="js" from="// Sign, submit, and wait for impairment" before="// Extract loan impairment info" /%}
{% /tab %}
{% /tabs %}

Verify that the transaction succeeded by checking for a `tesSUCCESS` result code.

### 6. Get loan impairment information

Retrieve the loan's grace period and updated payment due date from the transaction result by checking for the `Loan` entry in the transaction metadata:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/loanManage.js" language="js" from="// Extract loan impairment info" before="// Countdown until loan can be defaulted" /%}
{% /tab %}
{% /tabs %}

The loan can only be defaulted after the grace period expires. The example calculates when the grace period ends and displays a countdown.

### 7. Wait for grace period to expire

This countdown displays the remaining seconds in real-time. Once the grace period expires, the loan can be defaulted.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/loanManage.js" language="js" from="// Countdown until loan can be defaulted" before="// Prepare LoanManage transaction to default" /%}
{% /tab %}
{% /tabs %}

### 8. Prepare LoanManage transaction to default the loan

After the grace period expires, create a `LoanManage` transaction with the `tfLoanDefault` flag:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/loanManage.js" language="js" from="// Prepare LoanManage transaction to default" before="// Sign, submit, and wait for default" /%}
{% /tab %}
{% /tabs %}

### 9. Submit LoanManage default transaction

Sign and submit the `LoanManage` transaction to default the loan:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/loanManage.js" language="js" from="// Sign, submit, and wait for default" before="// Verify loan default status" /%}
{% /tab %}
{% /tabs %}

Verify that the transaction succeeded by checking for a `tesSUCCESS` result code.

### 10. Verify loan default status

Confirm the loan has been defaulted by checking the loan flags:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/loanManage.js" language="js" from="// Verify loan default status" /%}
{% /tab %}
{% /tabs %}

The `parseTransactionFlags` function converts the numeric flags to a readable format, showing that the `tfLoanDefault` flag is now set.

## See Also

**Concepts**:
  - [Lending Protocol][]

**Tutorials**:
  - [Create a Loan](./create-a-loan.md)

**References**:
  - [LoanManage transaction][]
  - [Loan entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
