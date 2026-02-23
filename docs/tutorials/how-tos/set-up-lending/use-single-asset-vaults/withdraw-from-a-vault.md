---
seo:
    description: Withdraw assets from a single asset vault.
metadata:
  indexPage: true
labels:
  - Single Asset Vault
status: not_enabled
---

# Withdraw from a Vault

This tutorial shows you how to withdraw assets from a [single asset vault](../../../../concepts/tokens/single-asset-vaults.md). You can withdraw by specifying either how many assets you want to receive or how many shares you want to redeem. The vault burns the necessary shares and transfers the corresponding assets to your account.

{% amendment-disclaimer name="SingleAssetVault" /%}

## Goals

By the end of this tutorial, you will be able to:

- Withdraw assets from a private/public vault.
- Check the vault's state after a successful withdrawal.
- Check the depositor account's state after the withdrawal.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
- Have previously deposited into a vault. This tutorial uses an account that has already deposited into a vault. To deposit your own asset, see [Deposit into a Vault](./deposit-into-a-vault.md).
- Have an XRP Ledger client library set up in your development environment. This page provides examples for the following:
  - **JavaScript** with the [xrpl.js library][]. See [Get Started Using JavaScript][] for setup steps.
  - **Python** with the [xrpl-py library][]. See [Get Started Using Python][] for setup steps.

## Source Code

You can find the complete source code for this tutorial's examples in the {% repo-link path="_code-samples/vaults/" %}code samples section of this website's repository{% /repo-link %}.

## Steps

### 1. Install dependencies

{% tabs %}
{% tab label="JavaScript" %}
From the code sample folder, use `npm` to install dependencies:

```bash
npm install xrpl
```

{% /tab %}
{% tab label="Python" %}
From the code sample folder, set up a virtual environment and use `pip` to install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

{% /tab %}
{% /tabs %}

### 2. Set up client and accounts

To get started, import the necessary libraries and instantiate a client to connect to the XRPL. This example imports:

{% tabs %}
{% tab label="JavaScript" %}
- `xrpl`: Used for XRPL client connection and transaction handling.
- `fs` and `child_process`: Used to run tutorial setup scripts.

{% code-snippet file="/_code-samples/vaults/js/withdraw.js" language="js" before="// You can replace" /%}
{% /tab %}

{% tab label="Python" %}
- `json`: Used for loading and formatting JSON data.
- `os`, `subprocess`, `sys`: Used for file handling and running setup scripts.
- `xrpl`: Used for XRPL client connection and transaction handling.

{% code-snippet file="/_code-samples/vaults/py/withdraw.py" language="py" before="# You can replace" /%}
{% /tab %}
{% /tabs %}

Provide the depositor account and specify the vault details.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/withdraw.js" language="js" from="// You can replace" before="console.log" /%}

This example uses preconfigured accounts and vault data from the `vaultSetup.js` script, but you can replace these values with your own.
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/vaults/py/withdraw.py" language="py" from="# You can replace" before="print" /%}

This example uses preconfigured accounts and vault data from the `vault_setup.py` script, but you can replace these values with your own.
{% /tab %}
{% /tabs %}

### 3. Check initial vault state

Before withdrawing, check the vault's current state to see its total assets and available liquidity.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/withdraw.js" language="js" from="// Get initial vault" before="// Check depositor's share balance" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/vaults/py/withdraw.py" language="py" from="# Get initial vault" before="# Check depositor's share balance" /%}
{% /tab %}
{% /tabs %}

### 4. Check share balance

Verify that the depositor account has vault shares to redeem. If not, the transaction will fail with a `tecINSUFFICIENT_FUNDS` error.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/withdraw.js" language="js" from="// Check depositor's share balance" before="// Prepare VaultWithdraw" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/vaults/py/withdraw.py" language="py" from="# Check depositor's share balance" before="# Prepare VaultWithdraw" /%}
{% /tab %}
{% /tabs %}

### 5. Prepare VaultWithdraw transaction

Create a [VaultWithdraw transaction][] to withdraw assets from the vault.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/withdraw.js" language="js" from="// Prepare VaultWithdraw" before="// Submit VaultWithdraw" /%}

The transaction defines the account requesting the withdrawal, the vault's unique identifier (`VaultID`), and the amount to withdraw or redeem. You can specify the `Amount` field in two ways:
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/vaults/py/withdraw.py" language="py" from="# Prepare VaultWithdraw" before="# Submit VaultWithdraw" /%}

The transaction defines the account requesting the withdrawal, the vault's unique identifier (`vault_id`), and the amount to withdraw or redeem. You can specify the `amount` field in two ways:
{% /tab %}
{% /tabs %}

- **Asset amount**: When you specify an asset amount, the vault burns the necessary shares to provide that amount.
- **Share amount**: When you specify a share amount, the vault converts those shares into the corresponding asset amount.

While not required, you can provide a destination account to receive the assets; if omitted, assets go to the account submitting the transaction.

{% admonition type="info" name="Note" %}
You can withdraw from a vault regardless of whether it's private or public. If you hold vault shares, you can always redeem them, even if your credentials in a private vault's permissioned domain have expired or been revoked. This prevents you from being locked out of your funds.
{% /admonition %}

### 6. Submit VaultWithdraw transaction

Submit the `VaultWithdraw` transaction to the XRP Ledger.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/withdraw.js" language="js" from="// Submit VaultWithdraw " before="// Extract vault state" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/vaults/py/withdraw.py" language="py" from="# Submit VaultWithdraw" before="# Extract vault state" /%}
{% /tab %}
{% /tabs %}

When the transaction succeeds:

- The vault calculates how many shares need to be burned to provide the requested asset amount.
- The vault transfers the assets from its pseudo-account to the depositor account (or the destination account if specified).

{% admonition type="info" name="Note" %}
Transfer fees are not charged on `VaultWithdraw` transactions.
{% /admonition %}

### 7. Verify withdrawal

After withdrawing, check the vault's state. You can extract this information directly from the transaction metadata.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/withdraw.js" language="js" from="// Extract vault state" before="// Get the depositor's share balance" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/vaults/py/withdraw.py" language="py" from="# Extract vault state" before="# Get the depositor's share balance" /%}
{% /tab %}
{% /tabs %}

Then, check the depositor's share balance:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/withdraw.js" language="js" from="// Get the depositor's share balance" before="// Get the depositor's asset balance" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/vaults/py/withdraw.py" language="py" from="# Get the depositor's share balance" before="# Get the depositor's asset balance" /%}
{% /tab %}
{% /tabs %}

Finally, verify the correct asset amount has been received by the depositor account:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/withdraw.js" language="js" from="// Get the depositor's asset balance" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/vaults/py/withdraw.py" language="py" from="# Get the depositor's asset balance" /%}
{% /tab %}
{% /tabs %}

## See Also

**Concepts**:

- [Single Asset Vaults](../../../../concepts/tokens/single-asset-vaults.md)
- [Credentials](../../../../concepts/decentralized-storage/credentials.md)
- [Permissioned Domains](../../../../concepts/tokens/decentralized-exchange/permissioned-domains.md)

**Tutorials**:

- [Create a Single Asset Vault](./create-a-single-asset-vault.md)
- [Deposit into a Vault](./deposit-into-a-vault.md)

**References**:

- [VaultWithdraw transaction][]
- [vault_info method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
