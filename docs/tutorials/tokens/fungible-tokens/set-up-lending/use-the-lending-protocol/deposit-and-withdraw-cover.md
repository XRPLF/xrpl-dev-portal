---
seo:
  description: Deposit and withdraw first-loss capital from a LoanBroker entry on the XRP Ledger.
metadata:
  indexPage: true
labels:
  - Lending Protocol
status: not_enabled
---

# Deposit and Withdraw First-Loss Capital

This tutorial shows you how to deposit and withdraw first-loss capital from a [LoanBroker][] on the XRP Ledger. First-loss capital helps protect vault depositor's assets, acting as a buffer in the event of loan defaults.

The tutorial demonstrates how a loan broker can manage risk by depositing XRP as first-loss capital, and how they can withdraw it when needed.

{% amendment-disclaimer name="LendingProtocol" /%}

## Goals

By the end of this tutorial, you will be able to:

- Deposit an MPT as first-loss capital into a `LoanBroker` entry.
- Check the available cover balance in the loan broker's pseudo-account.
- Withdraw first-loss capital from a `LoanBroker` entry.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
- Have an XRP Ledger client library set up in your development environment. This page provides examples for the following:
  - **JavaScript** with the [xrpl.js library][]. See [Get Started Using JavaScript][] for setup steps.
  - **Python** with the [xrpl-py library][]. See [Get Started Using Python][] for setup steps.

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
{% /tabs %}

### 2. Set up client and accounts

To get started, import the necessary libraries and instantiate a client to connect to the XRPL. This example imports:

{% tabs %}
{% tab label="JavaScript" %}
- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling.
- `fs` and `child_process`: Used to run tutorial set up scripts.

{% code-snippet file="/_code-samples/lending-protocol/js/coverDepositAndWithdraw.js" language="js" before="// This step checks" /%}
{% /tab %}
{% tab label="Python" %}
- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling.
- `json`: Used for loading and formatting JSON data.
- `os`, `subprocess`, and `sys`: Used to run tutorial set up scripts.

{% code-snippet file="/_code-samples/lending-protocol/py/cover_deposit_and_withdraw.py" language="py" before="# This step checks" /%}
{% /tab %}
{% /tabs %}

Next, load the loan broker account, loan broker ID, and MPT issuance ID.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/coverDepositAndWithdraw.js" language="js" from="// This step checks" before="// Prepare LoanBrokerCoverDeposit" /%}

This example uses preconfigured accounts and loan broker data from the `lendingSetup.js` script, but you can replace `loanBroker`, `loanBrokerID`, and `mptID` with your own values.
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/cover_deposit_and_withdraw.py" language="py" from="# This step checks" before="# Prepare LoanBrokerCoverDeposit" /%}

This example uses preconfigured accounts and loan broker data from the `lending_setup.py` script, but you can replace `loan_broker`, `loan_broker_id`, and `mpt_id` with your own values.
{% /tab %}
{% /tabs %}

### 3. Prepare LoanBrokerCoverDeposit transaction

Create the [LoanBrokerCoverDeposit transaction][] object.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/coverDepositAndWithdraw.js" language="js" from="// Prepare LoanBrokerCoverDeposit" before="// Sign, submit, and wait for deposit" /%}

The `Amount` field specifies the MPT and amount to deposit as first-loss capital.
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/cover_deposit_and_withdraw.py" language="py" from="# Prepare LoanBrokerCoverDeposit" before="# Sign, submit, and wait for deposit" /%}

The `amount` field specifies the MPT and amount to deposit as first-loss capital.
{% /tab %}
{% /tabs %}

If the transaction succeeds, the amount is deposited and held in the pseudo-account associated with the `LoanBroker` entry.

### 4. Submit LoanBrokerCoverDeposit transaction

Sign and submit the `LoanBrokerCoverDeposit` transaction to the XRP Ledger.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/coverDepositAndWithdraw.js" language="js" from="// Sign, submit, and wait for deposit" before="// Extract cover balance" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/cover_deposit_and_withdraw.py" language="py" from="# Sign, submit, and wait for deposit" before="# Extract cover balance" /%}
{% /tab %}
{% /tabs %}

Verify that the transaction succeeded by checking for a `tesSUCCESS` result code.

### 5. Check cover balance after deposit

Retrieve the cover balance from the transaction result by checking the `LoanBroker` entry in the transaction metadata.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/coverDepositAndWithdraw.js" language="js" from="// Extract cover balance" before="// Prepare LoanBrokerCoverWithdraw" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/cover_deposit_and_withdraw.py" language="py" from="# Extract cover balance" before="# Prepare LoanBrokerCoverWithdraw" /%}
{% /tab %}
{% /tabs %}

The `LoanBroker` pseudo-account address is the `Account` field, and `CoverAvailable` shows the cover balance.

### 6. Prepare LoanBrokerCoverWithdraw transaction

Create the [LoanBrokerCoverWithdraw transaction][] object.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/coverDepositAndWithdraw.js" language="js" from="// Prepare LoanBrokerCoverWithdraw" before="// Sign, submit, and wait for withdraw" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/cover_deposit_and_withdraw.py" language="py" from="# Prepare LoanBrokerCoverWithdraw" before="# Sign, submit, and wait for withdraw" /%}
{% /tab %}
{% /tabs %}

### 7. Submit LoanBrokerCoverWithdraw transaction

Sign and submit the `LoanBrokerCoverWithdraw` transaction to the XRP Ledger.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/coverDepositAndWithdraw.js" language="js" from="// Sign, submit, and wait for withdraw" before="// Extract updated cover balance" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/cover_deposit_and_withdraw.py" language="py" from="# Sign, submit, and wait for withdraw" before="# Extract updated cover balance" /%}
{% /tab %}
{% /tabs %}

Verify that the transaction succeeded by checking for a `tesSUCCESS` result code.

### 8. Check cover balance after withdrawal

Retrieve the updated cover balance from the transaction result.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/coverDepositAndWithdraw.js" language="js" from="// Extract updated cover balance" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/cover_deposit_and_withdraw.py" language="py" from="# Extract updated cover balance" /%}
{% /tab %}
{% /tabs %}

The `CoverAvailable` field now shows the reduced balance after the withdrawal.

## See Also

**Concepts**:
  - [Lending Protocol][]

**Tutorials**:
  - [Create a Loan Broker](./create-a-loan-broker.md)

**References**:
  - [LoanBrokerCoverDeposit transaction][]
  - [LoanBrokerCoverWithdraw transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
