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

A pre-funded pool suits ongoing or batch operations where the sponsor doesn't need to approve each transaction. If the sponsor wants to review every transaction, use [co-signing](./sponsor-a-transaction.md) instead.

{% amendment-disclaimer name="Sponsor" /%}

## Goals

By the end of this tutorial, you should be able to:

- Create a pre-funded sponsorship pool for a sponsee.
- Submit a sponsored transaction that draws on the pool.
- Confirm what the pool spent on fees and reserves.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
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

### 2. Set up client and load the tutorial data

Import the necessary libraries and instantiate a client to connect to the XRPL. This example imports:

{% tabs %}
{% tab label="JavaScript" %}
- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling. `addPreFundedSponsor` adds the sponsorship fields to a transaction the pool pays for.
- `fs`: Used to check for and load the tutorial setup data.
- `./sponsoredFeesAndReservesSetup.js`: The tutorial set up script, imported and called directly.

{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/sponsorWithPreFundedPool.js" language="js" before="// Create the sponsor and sponsee wallets" /%}
{% /tab %}

{% tab label="Python" %}
- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling. `SponsorshipSet` creates the pool the sponsee draws on.
- `json`: Used for loading and formatting JSON data.
- `os` and `sys`: Used to check for setup data and exit on transaction failures.
- `asyncio`: Used to run the async tutorial set up function.
- `sponsored_fees_and_reserves_setup`: The tutorial set up script, imported and called directly.

{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_with_pre_funded_pool.py" language="py" before="# Create the sponsor and sponsee wallets" /%}
{% /tab %}
{% /tabs %}

The example loads an [MPT](../../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md) issuance created by the setup script, which the sponsored transaction authorizes. You can replace it with an issuance of your own.

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

Send a [Payment transaction][] with the `tfSponsorCreatedAccount` flag enabled. The flag places the account reserve on the sponsor, so the payment itself only needs to deliver 1 drop.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/sponsorWithPreFundedPool.js" language="js" from="// Prepare Payment transaction to create the sponsee's account" before="// Prepare SponsorshipSet transaction" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_with_pre_funded_pool.py" language="py" from="# Prepare Payment transaction to create the sponsee's account" before="# Prepare SponsorshipSet transaction" /%}
{% /tab %}
{% /tabs %}

### 5. Create the pre-funded pool

Submit a [SponsorshipSet transaction][] to create the [Sponsorship entry][] that holds the pool. The `FeeAmount` field sets the drops available for fees, `MaxFee` caps what the pool pays for any single transaction, and `RemainingOwnerCount` sets how many object reserves the sponsor covers.

The sponsor pays the `FeeAmount` up front and takes on one owner reserve for the Sponsorship entry itself. If it can't cover both, the transaction fails with `tecUNFUNDED`.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/sponsorWithPreFundedPool.js" language="js" from="// Prepare SponsorshipSet transaction" before="// Prepare the sponsored MPTokenAuthorize transaction" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_with_pre_funded_pool.py" language="py" from="# Prepare SponsorshipSet transaction" before="# Prepare the sponsored MPTokenAuthorize transaction" /%}
{% /tab %}
{% /tabs %}

A SponsorshipSet transaction takes either a `Sponsee` or a `CounterpartySponsor` field, but not both. The sponsor sends the transaction here, so `Sponsee` identifies who can spend the pool. If the sponsee set up the arrangement instead, it would send the transaction and use `CounterpartySponsor` to identify the sponsor.

{% admonition type="success" name="Tip" %}
By default the sponsee spends from the pool without further approval. To require the sponsor's signature on each use, enable the `tfSponsorshipSetRequireSignForFee` and `tfSponsorshipSetRequireSignForReserve` flags. The pool still supplies the funds, but the sponsor keeps oversight of every transaction that draws from it.
{% /admonition %}

### 6. Submit a sponsored transaction and confirm the sponsorship

The sponsee sends an [MPTokenAuthorize transaction][] to hold the MPT, naming the sponsor and the costs to draw from the pool. Because the Sponsorship entry already exists, the sponsee signs and submits alone: the transaction carries no `SponsorSignature`.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/sponsorWithPreFundedPool.js" language="js" from="// Prepare the sponsored MPTokenAuthorize transaction" before="// Extract sponsorship information" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_with_pre_funded_pool.py" language="py" from="# Prepare the sponsored MPTokenAuthorize transaction" before="# Extract sponsorship information" /%}
{% /tab %}
{% /tabs %}

{% admonition type="info" name="Note" %}
This example sponsors an MPTokenAuthorize transaction, but many other transaction types can be sponsored. See [Common Fields](../../../references/protocol/transactions/common-fields.md#sponsorflags-field) for the transactions that allow `spfSponsorReserve`.
{% /admonition %}

The pool must have enough left to cover the transaction. If the `Fee` exceeds the pool's `MaxFee` or its remaining `FeeAmount`, the transaction fails.

Then inspect the affected nodes to see the `Sponsor` field on the new `MPToken` entry, and compare the Sponsorship entry's fields before and after to see what the pool spent.

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
  - [Sponsor a Transaction by Co-Signing](./sponsor-a-transaction.md)
  - [Manage a Sponsorship Pool](./manage-a-sponsorship-pool.md)
  - [Transfer a Reserve Sponsorship](./transfer-a-reserve-sponsorship.md)
- **References:**
  - [SponsorshipSet transaction][]
  - [MPTokenAuthorize transaction][]
  - [Sponsorship ledger entry][]
  - [Common Fields](../../../references/protocol/transactions/common-fields.md#sponsorflags-field)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
