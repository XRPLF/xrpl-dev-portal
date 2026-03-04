---
seo:
  description: Pay off a loan and delete it from the XRP Ledger.
metadata:
  indexPage: true
labels:
  - Lending Protocol
status: not_enabled
---

# Pay Off a Loan

This tutorial shows you how to pay off a [Loan][] and delete it. Loans can only be deleted after they are fully paid off, or if they've been defaulted by the loan broker.

The tutorial demonstrates how to calculate the final payment due, which includes the loan balance and any additional fees, and then pay off the loan. After the loan is fully paid off, the loan is deleted, completely removing it from the XRP Ledger.

{% amendment-disclaimer name="LendingProtocol" /%}

## Goals

By the end of this tutorial, you will be able to:

- Check the outstanding balance on a loan.
- Calculate the total payment due, including additional fees.
- Submit a loan payment.
- Delete a paid off loan from the XRP Ledger.

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

{% code-snippet file="/_code-samples/lending-protocol/js/loanPay.js" language="js" before="// This step checks" /%}
{% /tab %}
{% tab label="Python" %}
- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling.
- `json`: Used for loading and formatting JSON data.
- `os`, `subprocess`, and `sys`: Used to run tutorial set up scripts.

{% code-snippet file="/_code-samples/lending-protocol/py/loan_pay.py" language="py" before="# This step checks" /%}
{% /tab %}
{% /tabs %}

Next, load the borrower account, loan ID, and MPT issuance ID.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/loanPay.js" language="js" from="// This step checks" before="// Check initial loan status" /%}

This example uses preconfigured accounts and loan data from the `lendingSetup.js` script, but you can replace `borrower`, `loanID`, and `mptID` with your own values.
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/loan_pay.py" language="py" from="# This step checks" before="# Check initial loan status" /%}

This example uses preconfigured accounts and loan data from the `lending_setup.py` script, but you can replace `borrower`, `loan_id`, and `mpt_id` with your own values.
{% /tab %}
{% /tabs %}

### 3. Check loan status

Check the current status of the loan using the [ledger_entry method][].

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/loanPay.js" language="js" from="// Check initial loan status" before="// Prepare LoanPay transaction" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/loan_pay.py" language="py" from="# Check initial loan status" before="# Prepare LoanPay transaction" /%}
{% /tab %}
{% /tabs %}

The `TotalValueOutstanding` field contains the remaining principal plus accrued interest; the `LoanServiceFee` is an additional fee charged per payment. Add these together to calculate the total payment.

{% admonition type="info" name="Note" %}
Other fees can be charged on a loan, such as late or early payment fees. These additional fees must be accounted for when calculating payment amounts.
{% /admonition %}

### 4. Prepare LoanPay transaction

Create the [LoanPay transaction][] with the total payment amount.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/loanPay.js" language="js" from="// Prepare LoanPay transaction" before="// Sign, submit, and wait for payment validation" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/loan_pay.py" language="py" from="# Prepare LoanPay transaction" before="# Sign, submit, and wait for payment validation" /%}
{% /tab %}
{% /tabs %}

### 5. Submit LoanPay transaction

Sign and submit the `LoanPay` transaction to the XRP Ledger.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/loanPay.js" language="js" from="// Sign, submit, and wait for payment validation" before="// Extract updated loan info" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/loan_pay.py" language="py" from="# Sign, submit, and wait for payment validation" before="# Extract updated loan info" /%}
{% /tab %}
{% /tabs %}

Verify that the transaction succeeded by checking for a `tesSUCCESS` result code.

### 6. Check loan balance

Retrieve the loan balance from the transaction result by checking for the `Loan` entry in the transaction metadata.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/loanPay.js" language="js" from="// Extract updated loan info" before="// Prepare LoanDelete transaction" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/loan_pay.py" language="py" from="# Extract updated loan info" before="# Prepare LoanDelete transaction" /%}
{% /tab %}
{% /tabs %}

If `TotalValueOutstanding` is absent from the loan metadata, the loan has been fully paid off and is ready for deletion.

### 7. Prepare LoanDelete transaction

Create a [LoanDelete transaction][] to remove the paid loan from the XRP Ledger.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/loanPay.js" language="js" from="// Prepare LoanDelete transaction" before="// Sign, submit, and wait for deletion validation" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/loan_pay.py" language="py" from="# Prepare LoanDelete transaction" before="# Sign, submit, and wait for deletion validation" /%}
{% /tab %}
{% /tabs %}

Either the loan broker or the borrower can submit a `LoanDelete` transaction. In this example, the borrower deletes their own paid off loan.

### 8. Submit LoanDelete transaction

Sign and submit the `LoanDelete` transaction.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/loanPay.js" language="js" from="// Sign, submit, and wait for deletion validation" before="// Verify loan deletion" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/loan_pay.py" language="py" from="# Sign, submit, and wait for deletion validation" before="# Verify loan deletion" /%}
{% /tab %}
{% /tabs %}

Verify that the transaction succeeded by checking for a `tesSUCCESS` result code.

### 9. Verify loan deletion

Confirm that the loan has been removed from the XRP Ledger.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/loanPay.js" language="js" from="// Verify loan deletion" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/loan_pay.py" language="py" from="# Verify loan deletion" /%}
{% /tab %}
{% /tabs %}

If the `ledger_entry` method returns an `entryNotFound` error, the loan has been successfully deleted.

## See Also

**Concepts**:
  - [Lending Protocol][]

**Tutorials**:
  - [Create a Loan](./create-a-loan.md)

**References**:
  - [LoanDelete transaction][]
  - [LoanPay transaction][]
  - [Loan entry][]
  
{% raw-partial file="/docs/_snippets/common-links.md" /%}
