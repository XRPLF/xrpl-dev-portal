---
seo:
  description: Create a sponsorship pool that lets a sponsee submit sponsored transactions without the sponsor co-signing each one.
labels:
  - Accounts
  - Fees
  - Sponsorship
status: not_enabled
---
# Sponsor a Transaction with a Pre-funded Pool

This tutorial shows how to use the pre-funded [sponsorship](../../../concepts/accounts/sponsored-fees-and-reserves.md#how-sponsorship-works) flow, where a sponsor allocates XRP upfront that a sponsee draws on for fees and reserves. In this example, a sponsor onboards a new user who holds no XRP, then sets up a pool the user can spend without further approval.

Use the default pre-funded flow when sponsees must be able to transact without waiting on the sponsor. If the sponsor needs to review each transaction without setting up a pool, use [co-signing](./sponsor-a-transaction-by-co-signing.md) instead.

{% amendment-disclaimer name="Sponsor" /%}

## Goals

By the end of this tutorial, you should be able to:

- Create a pre-funded sponsorship pool for a sponsee.
- Submit a sponsored transaction that draws on the pool.
- Confirm what the pool spent on fees and reserves.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger and [Sponsored Fees and Reserves](../../../concepts/accounts/sponsored-fees-and-reserves.md).
- Have an XRP Ledger client library set up in your development environment. This page provides examples for the following:
  - **JavaScript** with the [xrpl.js library](https://github.com/XRPLF/xrpl.js). See [Get Started Using JavaScript](../../get-started/get-started-javascript.md) for setup steps.
  - **Python** with the [xrpl-py library](https://github.com/XRPLF/xrpl-py). See [Get Started Using Python](../../get-started/get-started-python.md) for setup steps.

## Source Code

You can find the complete source code for this tutorial's example in the [code samples section of this website's repository](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/sponsored-fees-and-reserves).

## Steps

### 1. Install dependencies

{% tabs %}
{% tab label="JavaScript" %}
From the code sample folder, use `npm` to install dependencies:

```bash
npm install
```
{% /tab %}

{% tab label="Python" %}
From the code sample folder, set up a virtual environment and use `pip` to install dependencies:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
{% /tab %}
{% /tabs %}

### 2. Set up the client

Import the necessary libraries and instantiate a client to connect to the XRPL. This example imports:

{% tabs %}
{% tab label="JavaScript" %}
- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling.

{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/sponsorWithPreFundedPool.js" language="js" before="// Create the sponsor and sponsee wallets" /%}
{% /tab %}

{% tab label="Python" %}
- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling.
- `json`: Used for formatting JSON data.
- `sys`: Used to exit on transaction failures.

{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_with_pre_funded_pool.py" language="py" before="# Create the sponsor and sponsee wallets" /%}
{% /tab %}
{% /tabs %}

### 3. Create the wallets

Fund the sponsor and generate a key pair for the sponsee. Only the sponsor needs XRP, because it covers every cost in this example.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/sponsorWithPreFundedPool.js" language="js" from="// Create the sponsor and sponsee wallets" before="// Prepare Payment transaction to create the sponsee's account" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_with_pre_funded_pool.py" language="py" from="# Create the sponsor and sponsee wallets" before="# Prepare Payment transaction to create the sponsee's account" /%}
{% /tab %}
{% /tabs %}

### 4. Create the sponsee's account

Create a [Payment transaction][] with the `tfSponsorCreatedAccount` flag enabled to create the sponsee's account. The flag makes the sponsor responsible for the new account's reserve, so the payment only needs to deliver the smallest possible XRP amount.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/sponsorWithPreFundedPool.js" language="js" from="// Prepare Payment transaction to create the sponsee's account" before="// Prepare SponsorshipSet transaction" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_with_pre_funded_pool.py" language="py" from="# Prepare Payment transaction to create the sponsee's account" before="# Prepare SponsorshipSet transaction" /%}
{% /tab %}
{% /tabs %}

### 5. Prepare the SponsorshipSet transaction

To create the pre-funded pool ([Sponsorship entry][Sponsorship ledger entry]), prepare a [SponsorshipSet transaction][].

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/sponsorWithPreFundedPool.js" language="js" from="// Prepare SponsorshipSet transaction" before="// Submit the SponsorshipSet transaction" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_with_pre_funded_pool.py" language="py" from="# Prepare SponsorshipSet transaction" before="# Submit the SponsorshipSet transaction" /%}
{% /tab %}
{% /tabs %}

{% admonition type="success" name="Tip" %}
Set `MaxFee` with enough headroom for changes in the network's required [transaction cost](../../../concepts/transactions/transaction-cost.md). A cap near the current minimum can block the sponsee's transactions when the cost rises. Monitor the pool's `FeeAmount` so it can be topped up before it runs out.
{% /admonition %}

The `FeeAmountDelta` field represents the drops available for fees, `MaxFee` caps what the pool pays for any single transaction, and `RemainingOwnerCountDelta` is the number of owner reserves the sponsor covers.

The two delta fields are amounts to add to the pool's current values (`FeeAmount` and `RemainingOwnerCount`), not replacements. For this example, the pool is new so each delta becomes its starting value. Both fields also accept a _negative_ value:

- A negative `FeeAmountDelta` returns the unspent XRP to the sponsor.
- A negative `RemainingOwnerCountDelta` lowers how many owner reserves the pool covers.

A negative delta is a subtraction, so neither field goes below zero. If you subtract more than a field has left, that field drops to zero instead, as long as the other one stays positive. A subtraction that would leave both at zero fails with `tecNO_PERMISSION`.

### 6. Submit the SponsorshipSet transaction

Sign and submit the SponsorshipSet transaction.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/sponsorWithPreFundedPool.js" language="js" from="// Submit the SponsorshipSet transaction" before="// Prepare the sponsored DepositPreauth transaction" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_with_pre_funded_pool.py" language="py" from="# Submit the SponsorshipSet transaction" before="# Prepare the sponsored DepositPreauth transaction" /%}
{% /tab %}
{% /tabs %}

The sponsor pays the `FeeAmountDelta` up front and must also meet the reserve requirement for the new Sponsorship entry. If it can't cover those costs, the transaction fails with `tecUNFUNDED`.

Each pool is a single Sponsorship entry that serves one sponsee. To fund several sponsees, the sponsor must create a pool for each one and hold an owner reserve for every pool.

{% admonition type="info" name="Note" %}
By default, the sponsee can spend from the pool without further sponsor approval. A sponsor can also require a signature on each use by enabling the `tfSponsorshipSetRequireSignForFee` and `tfSponsorshipSetRequireSignForReserve` flags. In that variation, transactions still draw from the pre-funded pool, but each sponsored transaction must also include the sponsor's signature.
{% /admonition %}

### 7. Sponsor a transaction

Submit the sponsored transaction and wait for validation.

{% tabs %}
{% tab label="JavaScript" %}
The `addPreFundedSponsor` helper adds the `Sponsor` and `SponsorFlags` fields for a transaction that draws from an existing pre-funded Sponsorship entry.
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/sponsorWithPreFundedPool.js" language="js" from="// Prepare the sponsored DepositPreauth transaction" before="// Extract sponsorship information" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_with_pre_funded_pool.py" language="py" from="# Prepare the sponsored DepositPreauth transaction" before="# Extract sponsorship information" /%}
{% /tab %}
{% /tabs %}

In this example, the sponsee submits a [DepositPreauth transaction][] without a signature from the sponsor. The transaction draws its transaction fee and the new ledger entry's reserve from the pool. Many other transaction types can also be sponsored; see [SponsorFlags field](../../../references/protocol/transactions/common-fields.md#sponsorflags-field) to learn more.

### 8. Validate the sponsorship

Inspect the affected nodes to verify the `Sponsor` field is on the new [DepositPreauth entry][], and compare the Sponsorship entry's fields before and after to see what the pool spent.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/sponsorWithPreFundedPool.js" language="js" from="// Extract sponsorship information" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_with_pre_funded_pool.py" language="py" from="# Extract sponsorship information" /%}
{% /tab %}
{% /tabs %}

## See Also

- **Concepts:**
  - [Sponsored Fees and Reserves](../../../concepts/accounts/sponsored-fees-and-reserves.md)
  - [Reserves](../../../concepts/accounts/reserves.md)
- **Tutorials:**
  - [Sponsor a Transaction by Co-Signing](./sponsor-a-transaction-by-co-signing.md)
  - [Manage a Sponsorship Pool](./manage-a-sponsorship-pool.md)
  - [Transfer a Reserve Sponsorship](./transfer-a-reserve-sponsorship.md)
- **References:**
  - [SponsorshipSet transaction][]
  - [DepositPreauth transaction][]
  - [Sponsorship ledger entry][]
  - [Common Fields](../../../references/protocol/transactions/common-fields.md#sponsorflags-field)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
