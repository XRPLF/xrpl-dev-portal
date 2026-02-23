---
seo:
  description: Create a loan on the XRP Ledger using the Lending Protocol.
metadata:
  indexPage: true
labels:
  - Lending Protocol
status: not_enabled
---

# Create a Loan

This tutorial shows you how to create a [Loan][] on the XRP Ledger. A loan requires signatures from both the loan broker and the borrower to be created.

This tutorial demonstrates how a loan broker and a borrower can cosign the terms of a loan and create that loan on the XRPL.

{% amendment-disclaimer name="LendingProtocol" /%}

## Goals

By the end of this tutorial, you will be able to:

- Create a **LoanSet transaction** with loan terms.
- Sign and add the loan broker's signature to the transaction.
- Sign and add the borrower's signature to the transaction.
- Submit the cosigned transaction to create a loan.

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

{% code-snippet file="/_code-samples/lending-protocol/js/createLoan.js" language="js" before="// This step checks" /%}
{% /tab %}
{% tab label="Python" %}
- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling.
- `json`: Used for loading and formatting JSON data.
- `os`, `subprocess`, and `sys`: Used to run tutorial set up scripts.

{% code-snippet file="/_code-samples/lending-protocol/py/create_loan.py" language="py" before="# This step checks" /%}
{% /tab %}
{% /tabs %}

Next, load the loan broker account, borrower account, and loan broker ID.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/createLoan.js" language="js" from="// This step checks" before="// Prepare LoanSet" /%}

This example uses preconfigured accounts and loan broker data from the `lendingSetup.js` script, but you can replace `loanBroker`, `borrower`, and `loanBrokerID` with your own values.
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/create_loan.py" language="py" from="# This step checks" before="# Prepare LoanSet" /%}

This example uses preconfigured accounts and loan broker data from the `lending_setup.py` script, but you can replace `loan_broker`, `borrower`, and `loan_broker_id` with your own values.
{% /tab %}
{% /tabs %}

### 3. Prepare LoanSet transaction

Create the [LoanSet transaction][] object with the loan terms.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/createLoan.js" language="js" from="// Prepare LoanSet" before="// Loan broker signs first" /%}

The `Account` field is the loan broker, and the `Counterparty` field is the borrower. These fields can be swapped, but determine the signing order: the `Account` signs first, and the `Counterparty` signs second.

The loan terms include:
- `PrincipalRequested`: The amount of an asset requested by the borrower. You don't have to specify the type of asset in this field.
- `InterestRate`: The annualized interest rate in 1/10th basis points (500 = 0.5%).
- `PaymentTotal`: The number of payments to be made.
- `PaymentInterval`: The number of seconds between payments (2592000 = 30 days).
- `GracePeriod`: The number of seconds after a missed payment before the loan can be defaulted (604800 = 7 days).
- `LoanOriginationFee`: A one-time fee charged when the loan is created, paid in the borrowed asset.
- `LoanServiceFee`: A fee charged with every loan payment, paid in the borrowed asset.
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/create_loan.py" language="py" from="# Prepare LoanSet" before="# Loan broker signs first" /%}

The `account` field is the loan broker, and the `counterparty` field is the borrower. These fields can be swapped, but determine the signing order: the `account` signs first, and the `counterparty` signs second.

The loan terms include:
- `principal_requested`: The amount of an asset requested by the borrower. You don't have to specify the type of asset in this field.
- `interest_rate`: The annualized interest rate in 1/10th basis points (500 = 0.5%).
- `payment_total`: The number of payments to be made.
- `payment_interval`: The number of seconds between payments (2592000 = 30 days).
- `grace_period`: The number of seconds after a missed payment before the loan can be defaulted (604800 = 7 days).
- `loan_origination_fee`: A one-time fee charged when the loan is created, paid in the borrowed asset.
- `loan_service_fee`: A fee charged with every loan payment, paid in the borrowed asset.
{% /tab %}
{% /tabs %}

### 4. Add loan broker signature

The loan broker (the `Account`) signs the transaction first, adding their `TxnSignature` and `SigningPubKey` to the `LoanSet` transaction object.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/createLoan.js" language="js" from="// Loan broker signs first" before="// Borrower signs second" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/create_loan.py" language="py" from="# Loan broker signs first" before="# Borrower signs second" /%}
{% /tab %}
{% /tabs %}

### 5. Add borrower signature

The borrower (the `Counterparty`) signs the transaction second. Their `TxnSignature` and `SigningPubKey` are stored in a `CounterpartySignature` field, which is added to the `LoanSet` transaction object.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/createLoan.js" language="js" from="// Borrower signs second" before="// Submit and wait" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/create_loan.py" language="py" from="# Borrower signs second" before="# Submit and wait" /%}
{% /tab %}
{% /tabs %}

### 6. Submit LoanSet transaction

Submit the fully signed `LoanSet` transaction to the XRP Ledger.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/createLoan.js" language="js" from="// Submit and wait" before="// Extract loan information" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/create_loan.py" language="py" from="# Submit and wait" before="# Extract loan information" /%}
{% /tab %}
{% /tabs %}

Verify that the transaction succeeded by checking for a `tesSUCCESS` result code.

### 7. Get loan information

Retrieve the loan's information from the transaction result by checking for the `Loan` entry in the transaction metadata.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/createLoan.js" language="js" from="// Extract loan information" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/create_loan.py" language="py" from="# Extract loan information" /%}
{% /tab %}
{% /tabs %}

## See Also

**Concepts**:
  - [Lending Protocol][]

**Tutorials**:
  - [Create a Loan Broker](./create-a-loan-broker.md)
  - [Manage a Loan](./manage-a-loan.md)

**References**:
  - [LoanSet transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
