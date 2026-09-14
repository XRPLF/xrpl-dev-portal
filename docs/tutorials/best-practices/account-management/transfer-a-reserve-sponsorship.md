---
seo:
  description: Create, reassign, or end the reserve sponsorship on an existing ledger entry.
labels:
  - Accounts
  - Fees
  - Sponsorship
status: not_enabled
---
# Transfer a Reserve Sponsorship

This tutorial shows you how to use the [SponsorshipTransfer transaction][] to create, reassign, or end [reserve sponsorship](../../../concepts/accounts/sponsored-fees-and-reserves.md#how-sponsorship-works) for an existing ledger entry. This example walks through all three operations on a `DepositPreauth` entry, but SponsorshipTransfer can also transfer sponsorship of account reserves.

{% amendment-disclaimer name="Sponsor" /%}

## Goals

By the end of this tutorial, you should be able to:

- Create a reserve sponsorship on an existing unsponsored ledger entry.
- Reassign a reserve sponsorship from one sponsor to another.
- End a reserve sponsorship so the sponsee covers the reserve.

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

{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/transferReserveSponsorship.js" language="js" before="// Create the wallets" /%}
{% /tab %}

{% tab label="Python" %}
- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling.
- `json`: Used for formatting JSON data.
- `sys`: Used to exit on transaction failures.

{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/transfer_reserve_sponsorship.py" language="py" before="# Create the wallets" /%}
{% /tab %}
{% /tabs %}

### 3. Create the wallets

Fund three accounts: **Sponsor A**, **Sponsor B**, and the **sponsee**.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/transferReserveSponsorship.js" language="js" from="// Create the wallets" before="// Create an unsponsored ledger entry" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/transfer_reserve_sponsorship.py" language="py" from="# Create the wallets" before="# Create an unsponsored ledger entry" /%}
{% /tab %}
{% /tabs %}

### 4. Create an unsponsored ledger entry

Submit an unsponsored transaction. For this example, a [DepositPreauth transaction][].

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/transferReserveSponsorship.js" language="js" from="// Create an unsponsored ledger entry" before="// Prepare SponsorshipTransfer transaction to start the sponsorship" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/transfer_reserve_sponsorship.py" language="py" from="# Create an unsponsored ledger entry" before="# Prepare SponsorshipTransfer transaction to start the sponsorship" /%}
{% /tab %}
{% /tabs %}

### 5. Create the sponsorship

Submit a SponsorshipTransfer transaction with the `tfSponsorshipCreate` flag enabled, the unsponsored ledger entry's ID, and Sponsor A's address in the `Sponsor` field.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/transferReserveSponsorship.js" language="js" from="// Prepare SponsorshipTransfer transaction to start the sponsorship" before="// Sign as the sponsee, then co-sign as Sponsor A" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/transfer_reserve_sponsorship.py" language="py" from="# Prepare SponsorshipTransfer transaction to start the sponsorship" before="# Sign as the sponsee, then co-sign as Sponsor A" /%}
{% /tab %}
{% /tabs %}

Sponsor A co-signs the transaction, so it must sign the exact `Fee` amount it agrees to pay. Autofill the transaction before signing so the `Fee` field is set; if the fee is added or changed after signing, the signature no longer matches the transaction.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/transferReserveSponsorship.js" language="js" from="// Sign as the sponsee, then co-sign as Sponsor A" before="// Prepare SponsorshipTransfer transaction to reassign the sponsorship" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/transfer_reserve_sponsorship.py" language="py" from="# Sign as the sponsee, then co-sign as Sponsor A" before="# Prepare SponsorshipTransfer transaction to reassign the sponsorship" /%}
{% /tab %}
{% /tabs %}

### 6. Reassign the sponsorship

To move the reserve sponsorship from Sponsor A to Sponsor B, submit a SponsorshipTransfer transaction with the `tfSponsorshipReassign` flag enabled, the entry's ID, and Sponsor B's address in the `Sponsor` field.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/transferReserveSponsorship.js" language="js" from="// Prepare SponsorshipTransfer transaction to reassign the sponsorship" before="// Sign as the sponsee, then co-sign as Sponsor B" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/transfer_reserve_sponsorship.py" language="py" from="# Prepare SponsorshipTransfer transaction to reassign the sponsorship" before="# Sign as the sponsee, then co-sign as Sponsor B" /%}
{% /tab %}
{% /tabs %}

Sponsor B co-signs to accept the reserve obligation; Sponsor A does not need to sign.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/transferReserveSponsorship.js" language="js" from="// Sign as the sponsee, then co-sign as Sponsor B" before="// Prepare SponsorshipTransfer transaction to end the sponsorship" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/transfer_reserve_sponsorship.py" language="py" from="# Sign as the sponsee, then co-sign as Sponsor B" before="# Prepare SponsorshipTransfer transaction to end the sponsorship" /%}
{% /tab %}
{% /tabs %}

Only the sponsee can reassign a sponsorship, because the sponsee chooses which sponsor to rely on.

### 7. End the sponsorship

You can end a sponsorship by submitting a SponsorshipTransfer transaction with the `tfSponsorshipEnd` flag enabled. Either party can end a sponsorship, but this example has the sponsee submit the transaction. When the sponsor submits instead, it must also include the `Sponsee` field. If it succeeds, the `Sponsor` field is removed and the sponsee becomes responsible for the entry's reserve again.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/transferReserveSponsorship.js" language="js" from="// Prepare SponsorshipTransfer transaction to end the sponsorship" before="// Submit the SponsorshipTransfer transaction to end the sponsorship" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/transfer_reserve_sponsorship.py" language="py" from="# Prepare SponsorshipTransfer transaction to end the sponsorship" before="# Submit the SponsorshipTransfer transaction to end the sponsorship" /%}
{% /tab %}
{% /tabs %}

Because no co-signature is involved, the sponsee signs and submits on its own.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/transferReserveSponsorship.js" language="js" from="// Submit the SponsorshipTransfer transaction to end the sponsorship" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/transfer_reserve_sponsorship.py" language="py" from="# Submit the SponsorshipTransfer transaction to end the sponsorship" /%}
{% /tab %}
{% /tabs %}

{% admonition type="warning" name="Warning" %}
Ending a ledger entry's sponsorship doesn't check whether the sponsee can cover the reserve it takes back. The sponsee can end up below its required reserve, which blocks it from creating new ledger entries until it funds the difference.
{% /admonition %}

If the sponsored ledger entry is deleted instead, you don't need to end the sponsorship first. Deleting the entry releases the reserve obligation, which means the sponsor's `SponsoringOwnerCount` decreases and the reserve frees up.

## Targeting an Account Instead of a Ledger Entry

Each step above passes an `ObjectID` to identify the `DepositPreauth` entry. To create, reassign, or end the sponsorship on an account's own reserve, omit `ObjectID` entirely: the transaction then applies to the account in the `Account` field. The following differences apply when the target is an account:

- The sponsor's `SponsorSignature` is required when creating or reassigning, not optional.
- The counters the transaction moves are `SponsoringAccountCount` rather than `SponsoringOwnerCount` and `SponsoredOwnerCount`.
- Ending the sponsorship checks that the account can hold its own account reserve afterwards. If it can't, the transaction fails with `tecINSUFFICIENT_RESERVE`.

Only the entry types listed under [Sponsor](../../../references/protocol/ledger-data/common-fields.md#sponsor) in the ledger entry common fields support sponsorship. Targeting any other type fails with `tecNO_PERMISSION`.

## See Also

- **Concepts:**
  - [Sponsored Fees and Reserves](../../../concepts/accounts/sponsored-fees-and-reserves.md)
  - [Reserves](../../../concepts/accounts/reserves.md)
- **Tutorials:**
  - [Sponsor a Transaction by Co-Signing](./sponsor-a-transaction-by-co-signing.md)
  - [Sponsor a Transaction with a Pre-funded Pool](./sponsor-a-transaction-with-a-pre-funded-pool.md)
  - [Manage a Sponsorship Pool](./manage-a-sponsorship-pool.md)
- **References:**
  - [SponsorshipTransfer transaction][]
  - [DepositPreauth transaction][]
  - [Sponsorship ledger entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
