---
seo:
  description: Create, query, and delete a Price Oracle on the XRP Ledger.
metadata:
  indexPage: true
labels:
  - Price Oracles
---

# Create, Query, and Delete a Price Oracle

This tutorial shows you how to create a Price Oracle on the XRP Ledger, query the price data it holds, and delete it when you're done with it. A Price Oracle is an [Oracle entry][] that feeds external data, such as asset prices and exchange rates, onto the XRP Ledger so that other on-chain applications, such as the [Lending Protocol][], can use it.

{% amendment-disclaimer name="PriceOracle" /%}

## Goals

By the end of this tutorial, you will be able to:

- Create a **Price Oracle** using the [OracleSet transaction][] with price data for a currency pair.
- Query the Price Oracle objects owned by an account.
- Delete a Price Oracle using the [OracleDelete transaction][].

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
- Have an XRP Ledger client library set up in your development environment. This page provides examples for the following:
  - **Python** with the [xrpl-py library][]. See [Get Started Using Python][] for setup steps.

## Source Code

You can find the complete source code for this tutorial's examples in the {% repo-link path="_code-samples/price-oracle-tutorial/" %}code samples section of this website's repository{% /repo-link %}.

## Steps

### 1. Install dependencies

{% tabs %}
{% tab label="Python" %}
From the code sample folder, set up a virtual environment and use `pip` to install dependencies.

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
{% /tab %}
{% /tabs %}

### 2. Connect to the network and fund an account

To get started, import the necessary libraries and instantiate a client to connect to the XRPL. This example funds a new Testnet account using the faucet, but you can use an existing funded account instead.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/price-oracle-tutorial/py/create_price_oracle.py" language="py" before="# Prepare OracleSet" /%}
{% /tab %}
{% /tabs %}

### 3. Prepare and submit the OracleSet transaction

Build a [PriceData](../../../references/protocol/ledger-data/ledger-entry-types/oracle.md#pricedata-fields) object describing the asset pair and price, then create the [OracleSet transaction][] object. A single `OracleSet` transaction can include up to 10 `PriceData` objects, letting one Oracle report on multiple asset pairs at once.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/price-oracle-tutorial/py/create_price_oracle.py" language="py" from="# Prepare OracleSet" /%}
{% /tab %}
{% /tabs %}

The `oracle_document_id` is a caller-chosen identifier that distinguishes this Oracle from other Oracles the same account might own. The ledger doesn't look up or validate this value against anything else, so your application is responsible for keeping track of which ID corresponds to which Oracle.

Verify that the transaction succeeded by checking for a `tesSUCCESS` result code.

### 4. Query the Price Oracle

Once an Oracle exists, any account can look it up using the [account_objects method][] filtered to the `oracle` object type.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/price-oracle-tutorial/py/query_price_oracle.py" language="py" /%}
{% /tab %}
{% /tabs %}

Replace the `oracle_owner` address with the address printed by the previous step.

{% admonition type="info" name="Note" %}
To get a single combined price across multiple Oracles instead of reading each Oracle's raw data yourself, use the [get_aggregate_price method][] instead.
{% /admonition %}

### 5. Delete the Price Oracle

When you no longer need a Price Oracle, delete it using the [OracleDelete transaction][] to reclaim its reserve. Only the Oracle's owner can delete it.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/price-oracle-tutorial/py/delete_price_oracle.py" language="py" /%}
{% /tab %}
{% /tabs %}

This example reads the owner's seed from the `ORACLE_OWNER_SEED` environment variable rather than hardcoding it.

Verify that the transaction succeeded by checking for a `tesSUCCESS` result code.

## See Also

**Concepts**:
  - [Price Oracles](../../../concepts/decentralized-storage/price-oracles.md)
  - [Lending Protocol][]

**References**:
  - [OracleSet transaction][]
  - [OracleDelete transaction][]
  - [Oracle entry][]
  - [account_objects method][]
  - [get_aggregate_price method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
