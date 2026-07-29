---
seo:
  description: Create, reassign, or end the reserve sponsorship on an existing XRP Ledger object.
labels:
  - Accounts
  - Fees
  - Sponsorship
status: not_enabled
---
# Transfer a Reserve Sponsorship

This tutorial shows how to use the [SponsorshipTransfer transaction][] to manage the [reserve sponsorship](../../../concepts/accounts/sponsored-fees-and-reserves.md#how-sponsorship-works) on an existing ledger entry, in this case an `MPToken`. SponsorshipTransfer also works on account reserves.

The other sponsorship flows attach a sponsor when an object is created. SponsorshipTransfer changes who pays for an object that already exists. This example covers three scenarios:

- **Create**: Add sponsorship to an object the sponsee currently pays for.
- **Reassign**: Move the sponsorship from one sponsor to another.
- **End**: Remove the sponsorship so the sponsee takes the reserve back.

{% amendment-disclaimer name="Sponsor" /%}

## Goals

By the end of this tutorial, you should be able to:

- Create a reserve sponsorship on an existing unsponsored ledger entry.
- Reassign a reserve sponsorship from one sponsor to another.
- End a reserve sponsorship so the sponsee covers its own reserve.

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
- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling. `signAsSponsor` adds the incoming sponsor's signature to the transfer.
- `fs`: Used to check for and load the tutorial setup data.
- `./sponsoredFeesAndReservesSetup.js`: The tutorial set up script, imported and called directly.

{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/transferReserveSponsorship.js" language="js" before="// Create the wallets" /%}
{% /tab %}

{% tab label="Python" %}
- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling. `sign_as_sponsor` adds the incoming sponsor's signature to the transfer.
- `json`: Used for loading and formatting JSON data.
- `os` and `sys`: Used to check for setup data and exit on transaction failures.
- `asyncio`: Used to run the async tutorial set up function.
- `sponsored_fees_and_reserves_setup`: The tutorial set up script, imported and called directly.

{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/transfer_reserve_sponsorship.py" language="py" before="# Create the wallets" /%}
{% /tab %}
{% /tabs %}

The example loads an [MPT](../../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md) issuance created by the setup script, which the sponsee authorizes to produce the object it transfers. You can replace it with an issuance of your own.

### 3. Create the wallets

Fund three accounts. **Sponsor A** takes on the reserve first, **Sponsor B** takes it over later, and the **sponsee** owns the object throughout.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/transferReserveSponsorship.js" language="js" from="// Create the wallets" before="// Create an unsponsored object" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/transfer_reserve_sponsorship.py" language="py" from="# Create the wallets" before="# Create an unsponsored object" /%}
{% /tab %}
{% /tabs %}

### 4. Create an unsponsored object

The sponsee submits an [MPTokenAuthorize transaction][] with no sponsorship fields, so it pays the fee and the owner reserve for the resulting `MPToken` entry itself. Note the entry's ID, which identifies the object in the transfers that follow.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/transferReserveSponsorship.js" language="js" from="// Create an unsponsored object" before="// Prepare SponsorshipTransfer transaction to start the sponsorship" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/transfer_reserve_sponsorship.py" language="py" from="# Create an unsponsored object" before="# Prepare SponsorshipTransfer transaction to start the sponsorship" /%}
{% /tab %}
{% /tabs %}

### 5. Create the sponsorship

Submit a SponsorshipTransfer transaction with the `tfSponsorshipCreate` flag, the object's ID, and Sponsor A's address in the `Sponsor` field. The sponsee owns the object, so the sponsee sends the transaction and Sponsor A co-signs it. Sponsor A could also draw the reserve from a [pre-funded pool](./sponsor-a-transaction-with-a-pre-funded-pool.md) instead of signing.

For an object, the sponsor's `SponsorSignature` is optional. This example includes it so that Sponsor A explicitly consents. When the target is an account rather than an object, the signature is required.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/transferReserveSponsorship.js" language="js" from="// Prepare SponsorshipTransfer transaction to start the sponsorship" before="// Prepare SponsorshipTransfer transaction to reassign the sponsorship" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/transfer_reserve_sponsorship.py" language="py" from="# Prepare SponsorshipTransfer transaction to start the sponsorship" before="# Prepare SponsorshipTransfer transaction to reassign the sponsorship" /%}
{% /tab %}
{% /tabs %}

The transaction metadata confirms the `MPToken` entry's `Sponsor` field now names Sponsor A.

### 6. Reassign the sponsorship

A sponsor may want to recoup its reserve. The sponsee can hand the obligation to a new sponsor with the `tfSponsorshipReassign` flag, the object's ID, and the new sponsor's address. Only the incoming sponsor has to consent: the sponsee sends the transaction and Sponsor B co-signs it, while Sponsor A's obligation is released without any involvement.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/transferReserveSponsorship.js" language="js" from="// Prepare SponsorshipTransfer transaction to reassign the sponsorship" before="// Prepare SponsorshipTransfer transaction to end the sponsorship" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/transfer_reserve_sponsorship.py" language="py" from="# Prepare SponsorshipTransfer transaction to reassign the sponsorship" before="# Prepare SponsorshipTransfer transaction to end the sponsorship" /%}
{% /tab %}
{% /tabs %}

Only the sponsee can reassign a sponsorship, because it changes who the sponsee relies on. A sponsor that wants out without a replacement ends the sponsorship instead.

### 7. End the sponsorship

Either party can end the sponsorship with the `tfSponsorshipEnd` flag and the object's ID. The transaction takes no `Sponsor` or `SponsorFlags` field and needs no co-signature. In this example the sponsee ends it, taking the reserve back.

When the sponsor ends the sponsorship instead, it must also name the object's owner in the `Sponsee` field. Without that field the ledger treats the sending account as the sponsee, and the transaction fails.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/transferReserveSponsorship.js" language="js" from="// Prepare SponsorshipTransfer transaction to end the sponsorship" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/transfer_reserve_sponsorship.py" language="py" from="# Prepare SponsorshipTransfer transaction to end the sponsorship" /%}
{% /tab %}
{% /tabs %}

{% admonition type="warning" name="Warning" %}
The sponsee must hold enough XRP to cover the reserve it takes back. If it doesn't, the transaction fails with `tecINSUFFICIENT_RESERVE`.
{% /admonition %}

{% admonition type="info" name="Note" %}
Deleting a sponsored object releases the reserve obligation on its own: the sponsor's `SponsoringOwnerCount` decreases and the reserve frees up. You don't need to end the sponsorship first.
{% /admonition %}

## Targeting an Account Instead of an Object

Each step above passes an `ObjectID` to identify the `MPToken`. To create, reassign, or end the sponsorship on an account's own reserve, omit `ObjectID` entirely: the transaction then applies to the account in the `Account` field. Two differences apply when the target is an account:

- The sponsor's `SponsorSignature` is required when creating or reassigning, not optional.
- The counters the transaction moves are `SponsoringAccountCount` rather than `SponsoringOwnerCount` and `SponsoredOwnerCount`.

Only the entry types listed under [Sponsor](../../../references/protocol/ledger-data/common-fields.md#sponsor) in the ledger entry common fields support sponsorship. Targeting any other type fails with `tecNO_PERMISSION`.

## See Also

- **Concepts:**
  - [Sponsored Fees and Reserves](../../../concepts/accounts/sponsored-fees-and-reserves.md)
  - [Reserves](../../../concepts/accounts/reserves.md)
- **Tutorials:**
  - [Sponsor a Transaction by Co-Signing](./sponsor-a-transaction.md)
  - [Sponsor a Transaction with a Pre-funded Pool](./sponsor-a-transaction-with-a-pre-funded-pool.md)
  - [Manage a Sponsorship Pool](./manage-a-sponsorship-pool.md)
- **References:**
  - [SponsorshipTransfer transaction][]
  - [MPTokenAuthorize transaction][]
  - [Sponsorship ledger entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
