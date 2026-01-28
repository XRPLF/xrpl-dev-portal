---
seo:
    description: Deposit assets into a vault and receive shares.
metadata:
  indexPage: true
labels:
  - Single Asset Vault
---

# Deposit into a Vault

This tutorial shows you how to deposit assets into a [single asset vault](../../../../concepts/tokens/single-asset-vaults.md). The example demonstrates depositing into a private vault with credential-based access control, however you can easily use the same code to deposit into a public vault.

When you deposit into a vault, you receive shares that represent your proportional ownership of the vault's assets. For example, in an institutional lending context, depositing into a vault allows you to pool your assets with other depositors to participate in larger lending markets.

{% admonition type="warning" name="Warning" %}
Anyone can create a public vault, and malicious vault owners can drain your assets. Always verify that the vault owner and vault settings meet your standards before depositing assets.
{% /admonition %}

{% amendment-disclaimer name="SingleAssetVault" /%}

## Goals

By the end of this tutorial, you will be able to:

- Deposit assets into a private/public vault.
- Check the depositing account's share balance and the vault's state after a successful deposit.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
- Have access to an existing vault. See [Create a Single Asset Vault](./create-a-single-asset-vault.md).
- Have an XRP Ledger client library set up in your development environment. This page provides examples for the following:
  - **JavaScript** with the [xrpl.js library](https://github.com/XRPLF/xrpl.js). See [Get Started Using JavaScript](../../../javascript/build-apps/get-started.md) for setup steps.

## Source Code

You can find the complete source code for this tutorial's examples in the {% repo-link path="_code-samples/vaults/" %}code samples section of this website's repository{% /repo-link %}.

## Steps

### 1. Install dependencies

{% tabs %}
{% tab label="JavaScript" %}
From the code sample folder, use npm to install dependencies:

```bash
npm install xrpl
```

{% /tab %}
{% /tabs %}

### 2. Set up client and accounts

To get started, import the necessary libraries and instantiate a client to connect to the XRPL. This example imports:

- `xrpl`: Used for XRPL client connection and transaction handling.
- `fs` and `child_process`: Used to run tutorial setup scripts.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/deposit.js" language="js" from="import xrpl" before="// You can replace" /%}
{% /tab %}
{% /tabs %}

Provide the depositing account and specify the vault details. The depositor must have a balance of the vault's asset to deposit.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/deposit.js" language="js" from="// You can replace" before="// Get initial vault" /%}
{% /tab %}
{% /tabs %}

{% admonition type="info" name="Note" %}
This example uses an existing vault and depositor account from the `vaultSetup.js` script, but you can replace these values with your own. The preconfigured depositor account has:

- Valid [Credentials](../../../../concepts/decentralized-storage/credentials.md) in the vault's [Permissioned Domain](../../../../concepts/tokens/decentralized-exchange/permissioned-domains.md).
- A positive balance of the MPT in the vault.
{% /admonition %}

### 3. Check initial vault state

Use the [vault_info method][] to retrieve the vault's current state, including its total value and available liquidity.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/deposit.js" language="js" from="// Get initial vault" before="// Check depositor's asset balance" /%}
{% /tab %}
{% /tabs %}

### 4. Check depositor's asset balance

Before depositing, verify that the depositor has sufficient balance of the vault's asset. If the depositor doesn't have enough funds, the transaction will fail with a `tecINSUFFICIENT_FUNDS` error.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/deposit.js" language="js" from="// Check depositor's asset balance" before="// Prepare VaultDeposit" /%}
{% /tab %}
{% /tabs %}

### 5. Prepare VaultDeposit transaction

Create a [VaultDeposit transaction][] object to deposit assets into the vault.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/deposit.js" language="js" from="// Prepare VaultDeposit" before="// Submit VaultDeposit" /%}
{% /tab %}
{% /tabs %}

The transaction specifies the depositing account, the vault's unique identifier (`VaultID`), and the amount to deposit. The asset in the `Amount` field must match the vault's asset type, otherwise the transaction will fail with a `tecWRONG_ASSET` error.

### 6. Submit VaultDeposit transaction

Submit the `VaultDeposit` transaction to the XRP Ledger.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/deposit.js" language="js" from="// Submit VaultDeposit" before="// Extract vault state" /%}
{% /tab %}
{% /tabs %}

When depositing into a private vault, the transaction verifies that the depositor has valid credentials in the vault's permissioned domain. Without valid credentials, the `VaultDeposit` transaction fails with a `tecNO_AUTH` error.

If the transaction succeeds, the vault:

- Transfers the assets from the depositing account to the vault's pseudo-account.
- Issues vault shares to the depositor.

{% admonition type="info" name="Note" %}
Transfer fees are not charged on `VaultDeposit` transactions.
{% /admonition %}

### 7. Verify deposit and check share balance

After depositing, verify the vault's updated state. You can extract this information directly from the transaction metadata without making additional API calls:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/deposit.js" language="js" from="// Extract vault state" before="// Get the depositor's" /%}
{% /tab %}
{% /tabs %}

Finally, check that the depositing account has received the shares.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/deposit.js" language="js" from="// Get the depositor's" /%}
{% /tab %}
{% /tabs %}

The code checks for both `ModifiedNode` and `CreatedNode` because on the first deposit, a new MPToken entry is created for the depositor's shares (`CreatedNode`). On subsequent deposits, the depositor's existing share balance is updated (`ModifiedNode`).

## See Also

**Concepts**:
  - [Single Asset Vaults](../../../../concepts/tokens/single-asset-vaults.md)
  - [Credentials](../../../../concepts/decentralized-storage/credentials.md)
  - [Permissioned Domains](../../../../concepts/tokens/decentralized-exchange/permissioned-domains.md)

**Tutorials**:
  - [Create a Single Asset Vault](./create-a-single-asset-vault.md)
  - [Withdraw from a Vault](./withdraw-from-a-vault.md)

**References**:
  - [VaultDeposit transaction][]
  - [vault_info method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
