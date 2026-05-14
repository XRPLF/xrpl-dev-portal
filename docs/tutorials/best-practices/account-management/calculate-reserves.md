---
seo:
  description: Look up and calculate base and owner reserve requirements for an XRPL account. 
labels:
  - Accounts
---
# Calculate Account Reserves

This tutorial demonstrates how to look up and calculate the [reserve requirements](../../../concepts/accounts/reserves.md) for an XRP Ledger account. Reserves are the minimum amount of XRP an account must hold based on its activity on the ledger.

## Goals

By the end of this tutorial, you should be able to: 
- Look up an account's current [base](../../../concepts/accounts/reserves.md#base-reserve-and-owner-reserve) and incremental reserve values.
- Determine an account's [owner reserve](../../../concepts/accounts/reserves.md#owner-reserves).
- Calculate an account's total reserve requirement.

## Prerequisites

To complete this tutorial, you need:

- A basic understanding of the XRP Ledger.
- An XRP Ledger [client library](../../../references/client-libraries.md) set up.

## Source Code 

You can find this tutorial's example source code in the [code samples section of this website's repository](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/calculate-reserves).

## Steps

### 1. Install dependencies

Install dependencies for your language from the code sample folder.

{% tabs %}
{% tab label="JavaScript" %}

```bash
npm install xrpl
```
{% /tab %}
{% tab label="Python" %}

```bash
pip install xrpl-py
```
{% /tab %}
{% tab label="Go" %}

```bash
go mod tidy
```
{% /tab %}
{% /tabs %}

### 2. Set up client

Import the XRPL library and create a client connection.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/calculate-reserves/js/calculate_reserves.js" language="js" from="// Set up client" to="// Look up reserve values" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/calculate-reserves/py/calculate_reserves.py" language="py" from="# Set up client" to="# Look up reserve values" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/calculate-reserves/go/calculate_reserves.go" language="go" from="// Set up client" to="// Look up reserve values" /%}
{% /tab %}
{% /tabs %}

### 3. Look up reserve values

Retrieve the base and incremental reserve values using the [`server_info`][server_info method] or [`server_state`][server_state method] method. This example uses `server_state` to return reserve values as integer drops, avoiding floating-point precision issues.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/calculate-reserves/js/calculate_reserves.js" language="js" from="// Look up reserve values" to="// Look up owner count"/%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/calculate-reserves/py/calculate_reserves.py" language="py" from="# Look up reserve values" to="# Look up owner count"/%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/calculate-reserves/go/calculate_reserves.go" language="go" from="// Look up reserve values" to="// Look up owner count"/%}
{% /tab %}
{% /tabs %}

### 4. Look up owner count

Call [`account_info`][account_info method] and take `account_data.OwnerCount` to retrieve an account's total number of objects.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/calculate-reserves/js/calculate_reserves.js" language="js" from="// Look up owner count" to="// Calculate total reserve"/%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/calculate-reserves/py/calculate_reserves.py" language="py" from="# Look up owner count" to="# Calculate total reserve"/%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/calculate-reserves/go/calculate_reserves.go" language="go" from="// Look up owner count" to="// Calculate total reserve" /%}
{% /tab %}
{% /tabs %}

### 5. Calculate total reserve

Once you have the owner count, you can calculate the account's total reserve. The total reserve is the base reserve plus the incremental reserve multiplied by the owner count.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/calculate-reserves/js/calculate_reserves.js" language="js" from="// Calculate total reserve"/%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/calculate-reserves/py/calculate_reserves.py" language="py" from="# Calculate total reserve"/%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/calculate-reserves/go/calculate_reserves.go" language="go" from="// Calculate total reserve" /%}
{% /tab %}
{% /tabs %}

## See Also

Concepts: 
- [Reserves](../../../concepts/accounts/reserves.md)

Tutorials:
- [Calculate and Display the Reserve Requirement (Python)](../../sample-apps/build-a-desktop-wallet-in-python.md#3-display-an-account)

References: 
- [`server_info`][server_info method]
- [`server_state`][server_state method]
- [`account_info`][account_info method]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
