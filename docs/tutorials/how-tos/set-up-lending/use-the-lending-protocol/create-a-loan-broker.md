---
seo:
  description: Create a loan broker on the XRP Ledger.
metadata:
  indexPage: true
labels:
  - Lending Protocol
status: not_enabled
---

# Create a Loan Broker

This tutorial shows you how to create a [LoanBroker][] on the XRP Ledger using a private vault. A loan broker creates and manages loans, and also manages the first-loss capital for a connected single asset vault.

{% amendment-disclaimer name="LendingProtocol" /%}

## Goals

By the end of this tutorial, you will be able to:

- Create a **loan broker** linked to a private single asset vault.
- Configure loan broker parameters, such as a management fee rate.
- Retrieve the loan broker ID and pseudo-account.

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

{% code-snippet file="/_code-samples/lending-protocol/js/createLoanBroker.js" language="js" before="// This step checks" /%}
{% /tab %}
{% tab label="Python" %}
- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling.
- `json`: Used for loading and formatting JSON data.
- `os`, `subprocess`, and `sys`: Used to run tutorial set up scripts.

{% code-snippet file="/_code-samples/lending-protocol/py/create_loan_broker.py" language="py" before="# This step checks" /%}
{% /tab %}
{% /tabs %}

Next, load the vault owner account and vault ID. The vault owner will also be the loan broker.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/createLoanBroker.js" language="js" from="// This step checks" before="// Prepare LoanBrokerSet" /%}

This example uses preconfigured accounts and vault data from the `lendingSetup.js` script, but you can replace `loanBroker` and `vaultID` with your own values.
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/create_loan_broker.py" language="py" from="# This step checks" before="# Prepare LoanBrokerSet" /%}

This example uses preconfigured accounts and vault data from the `lending_setup.py` script, but you can replace `loan_broker` and `vault_id` with your own values.
{% /tab %}
{% /tabs %}

### 3. Prepare LoanBrokerSet transaction

Create the [LoanBrokerSet transaction][] object.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/createLoanBroker.js" language="js" from="// Prepare LoanBrokerSet" before="// Submit, sign" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/create_loan_broker.py" language="py" from="# Prepare LoanBrokerSet" before="# Submit, sign" /%}
{% /tab %}
{% /tabs %}

The management fee rate is set in 1/10th basis points. A value of `1000` equals 1% (100 basis points).

### 4. Submit LoanBrokerSet transaction

Sign and submit the `LoanBrokerSet` transaction to the XRP Ledger.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/createLoanBroker.js" language="js" from="// Submit, sign" before="// Extract loan broker" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/create_loan_broker.py" language="py" from="# Submit, sign" before="# Extract loan broker" /%}
{% /tab %}
{% /tabs %}

Verify that the transaction succeeded by checking for a `tesSUCCESS` result code.

### 5. Get loan broker information

Retrieve the loan broker's information from the transaction result by checking for the `LoanBroker` entry in the transaction metadata.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/createLoanBroker.js" language="js" from="// Extract loan broker" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/create_loan_broker.py" language="py" from="# Extract loan broker" /%}
{% /tab %}
{% /tabs %}

The loan broker pseudo-account is a special account that holds first-loss capital.

## See Also

**Concepts**:
  - [Lending Protocol][]
  - [Single Asset Vault](../../../../concepts/tokens/single-asset-vaults.md)

**Tutorials**:
  - [Create a Single Asset Vault](../use-single-asset-vaults/create-a-single-asset-vault.md)
  - [Deposit and Withdraw First-Loss Capital](./deposit-and-withdraw-cover.md)
  - [Create a Loan](./create-a-loan.md)

**References**:
  - [LoanBrokerSet transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
