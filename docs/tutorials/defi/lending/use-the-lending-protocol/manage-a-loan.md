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
{% amendment-disclaimer name="LendingProtocolV1_1" mode="updated" /%}

{% admonition type="info" name="Note" %}
- **JavaScript** code expects both `LendingProtocol` and `LendingProtocolV1_1`.
- **Python** and **Go** code expect only `LendingProtocol`.
{% /admonition %}

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
  - **Python** with the [xrpl-py library][]. See [Get Started Using Python][] for setup steps.
  - **Go** with the [xrpl-go library][]. See [Get Started Using Go][] for setup steps.

## Source Code

You can find the complete source code for this tutorial's examples in the {% repo-link path="_code-samples/lending-protocol/" %}code samples section of this website's repository{% /repo-link %}.

## Steps

### 1. Install dependencies

{% tabs %}
{% tab label="JavaScript" %}
From the code sample folder, use `npm` to install dependencies.

```bash
npm install xrpl
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
- `fs` and `child_process`: Used to run tutorial set up scripts.

{% code-snippet file="/_code-samples/lending-protocol/js/loanManage.js" language="js" before="// This step checks" /%}
{% /tab %}
{% tab label="Python" %}
- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling.
- `json`: Used for loading and formatting JSON data.
- `os`, `subprocess`, and `sys`: Used to run tutorial set up scripts.
- `time` and `datetime`: Used for grace period countdown and date formatting.

{% code-snippet file="/_code-samples/lending-protocol/py/loan_manage.py" language="py" before="# This step checks" /%}
{% /tab %}
{% tab label="Go" %}
- `xrpl-go`: Used for XRPL client connection, transaction submission, and wallet handling.
- `encoding/json` and `fmt`: Used for formatting and printing results to the console.
- `os` and `os/exec`: Used to run tutorial set up scripts.
- `time`: Used for grace period countdown and date formatting.

{% code-snippet file="/_code-samples/lending-protocol/go/loan-manage/main.go" language="go" before="// Check for setup data" /%}
{% /tab %}
{% /tabs %}

Next, load the loan broker account and loan ID.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/loanManage.js" language="js" from="// This step checks" before="// Check loan status" /%}

This example uses preconfigured accounts and loan data from the `lendingSetup.js` script, but you can replace `loanBroker` and `loanID` with your own values.
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/loan_manage.py" language="py" from="# This step checks" before="# Check loan status" /%}

This example uses preconfigured accounts and loan data from the `lending_setup.py` script, but you can replace `loan_broker` and `loan_id` with your own values.
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/lending-protocol/go/loan-manage/main.go" language="go" from="// Check for setup data" before="// Check loan status" /%}

This example uses preconfigured accounts and loan data from the `lending-setup` script, but you can replace `loanBrokerWallet` and `loanID` with your own values.
{% /tab %}
{% /tabs %}

### 3. Check loan status

Check the current status of the loan using the [ledger_entry method][].

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/loanManage.js" language="js" from="// Check loan status" before="// Countdown until the loan can be impaired" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/loan_manage.py" language="py" from="# Check loan status" before="# Prepare LoanManage transaction to impair" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/lending-protocol/go/loan-manage/main.go" language="go" from="// Check loan status" before="// Prepare LoanManage transaction to impair" /%}
{% /tab %}
{% /tabs %}

This shows the total amount owed and the next payment due date. The [Ripple Epoch][] timestamp is converted to a readable date format.

### 4. Wait for late payment

Loans can only be impaired after missing a payment.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/loanManage.js" language="js" from="// Countdown until the loan can be impaired" before="// Prepare LoanManage transaction to impair" /%}

The countdown displays the expected remaining seconds in real-time, but is validated against the ledger's actual close time.
{% /tab %}
{% tab label="Python" %}
This step is required if both `LendingProtocol` and `LendingProtocolV1_1` are enabled. The **Python** code is currently written for only `LendingProtocol`, which can skip this step.
{% /tab %}
{% tab label="Go" %}
This step is required if both `LendingProtocol` and `LendingProtocolV1_1` are enabled. The **Go** code is currently written for only `LendingProtocol`, which can skip this step.
{% /tab %}
{% /tabs %}

### 5. Prepare LoanManage transaction to impair the loan

Create the [LoanManage transaction][] with the `tfLoanImpair` flag.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/loanManage.js" language="js" from="// Prepare LoanManage transaction to impair" before="// Sign, submit, and wait for impairment" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/loan_manage.py" language="py" from="# Prepare LoanManage transaction to impair" before="# Sign, submit, and wait for impairment" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/lending-protocol/go/loan-manage/main.go" language="go" from="// Prepare LoanManage transaction to impair" before="// Sign, submit, and wait for impairment" /%}
{% /tab %}
{% /tabs %}

### 6. Submit LoanManage impairment transaction

Sign and submit the `LoanManage` transaction to impair the loan.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/loanManage.js" language="js" from="// Sign, submit, and wait for impairment" before="// Countdown until the loan can be defaulted" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/loan_manage.py" language="py" from="# Sign, submit, and wait for impairment" before="# Extract loan impairment info" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/lending-protocol/go/loan-manage/main.go" language="go" from="// Sign, submit, and wait for impairment" before="// Extract loan impairment info" /%}
{% /tab %}
{% /tabs %}

Verify that the transaction succeeded by checking for a `tesSUCCESS` result code.

### 7. Get loan impairment information

Retrieve the loan's grace period and updated payment due date from the transaction result by checking for the `Loan` entry in the transaction metadata.

{% tabs %}
{% tab label="JavaScript" %}
This step is required if only `LendingProtocol` is enabled. The **JavaScript** code is written for both `LendingProtocol` and `LendingProtocolV1_1`, which can skip this step.
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/loan_manage.py" language="py" from="# Extract loan impairment info" before="# Countdown until loan can be defaulted" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/lending-protocol/go/loan-manage/main.go" language="go" from="// Extract loan impairment info" before="// Countdown until loan can be defaulted" /%}
{% /tab %}
{% /tabs %}

### 8. Wait for grace period to expire

Loans can only be defaulted when the grace period expires after the missed payment due date.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/loanManage.js" language="js" from="// Countdown until the loan can be defaulted" before="// Prepare LoanManage transaction to default" /%}

The countdown displays the expected remaining seconds in real-time, but is validated against the ledger's actual close time.
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/loan_manage.py" language="py" from="# Countdown until loan can be defaulted" before="# Prepare LoanManage transaction to default" /%}

The countdown displays the remaining seconds in real-time.
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/lending-protocol/go/loan-manage/main.go" language="go" from="// Countdown until loan can be defaulted" before="// Prepare LoanManage transaction to default" /%}

The countdown displays the remaining seconds in real-time.
{% /tab %}
{% /tabs %}

### 9. Prepare LoanManage transaction to default the loan

After the grace period expires, create a `LoanManage` transaction with the `tfLoanDefault` flag.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/loanManage.js" language="js" from="// Prepare LoanManage transaction to default" before="// Sign, submit, and wait for default" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/loan_manage.py" language="py" from="# Prepare LoanManage transaction to default" before="# Sign, submit, and wait for default" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/lending-protocol/go/loan-manage/main.go" language="go" from="// Prepare LoanManage transaction to default" before="// Sign, submit, and wait for default" /%}
{% /tab %}
{% /tabs %}

### 10. Submit LoanManage default transaction

Sign and submit the `LoanManage` transaction to default the loan.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/loanManage.js" language="js" from="// Sign, submit, and wait for default" before="// Verify loan default status" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/loan_manage.py" language="py" from="# Sign, submit, and wait for default" before="# Verify loan default status" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/lending-protocol/go/loan-manage/main.go" language="go" from="// Sign, submit, and wait for default" before="// Verify loan default status" /%}
{% /tab %}
{% /tabs %}

Verify that the transaction succeeded by checking for a `tesSUCCESS` result code.

### 11. Verify loan default status

Confirm the loan has been defaulted by checking the loan flags.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/loanManage.js" language="js" from="// Verify loan default status" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/loan_manage.py" language="py" from="# Verify loan default status" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/lending-protocol/go/loan-manage/main.go" language="go" from="// Verify loan default status" /%}
{% /tab %}
{% /tabs %}

The loan flags are parsed to confirm the `tfLoanDefault` flag is now set.

## See Also

**Concepts**:
  - [Lending Protocol][]

**Tutorials**:
  - [Create a Loan](./create-a-loan.md)

**References**:
  - [LoanManage transaction][]
  - [Loan entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
