---
seo:
    description: Create a single asset vault on the XRP Ledger.
metadata:
  indexPage: true
labels:
  - Single Asset Vault
status: not_enabled
---

# Create a Single Asset Vault

This tutorial shows you how to create a [single asset vault](../../../../concepts/tokens/single-asset-vaults.md) on the XRP Ledger. Vaults can only hold a single type of asset, such as XRP, a trust line token, or a Multi-Purpose Token (MPT).

You can create either a:

- **Public vault**: Anyone can deposit assets.
- **Private vault**: Only users with valid [Credentials](../../../../concepts/decentralized-storage/credentials) can deposit, managed through [Permissioned Domains](../../../../concepts/tokens/decentralized-exchange/permissioned-domains).

The tutorial demonstrates how a financial institution could use a **private vault** to pool lender assets for uncollateralized lending while maintaining regulatory compliance through credential-based access control.

{% amendment-disclaimer name="SingleAssetVault" /%}

## Goals

By the end of this tutorial, you will be able to:

- Create a **private** vault.
- Configure vault parameters such as the asset type, maximum deposit amount, and withdrawal policy.
- Configure whether depositors can transfer their vault shares to other accounts.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
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

{% code-snippet file="/_code-samples/vaults/js/createVault.js" language="js" before="// Create and fund" /%}
{% /tab %}
{% tab label="Python" %}
- `json`: Used for loading and formatting JSON data.
- `os`, `subprocess`, `sys`: Used for file handling and running setup scripts.
- `xrpl`: Used for XRPL client connection and transaction handling.

{% code-snippet file="/_code-samples/vaults/py/create_vault.py" language="python" before="# Create and fund" /%}
{% /tab %}
{% /tabs %}

Next, fund a vault owner account, define the MPT issuance ID for the vault's asset, and provide a permissioned domain ID to control who can deposit into the vault.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/createVault.js" language="js" from="// Create and fund" before="// Prepare VaultCreate" /%}

The example uses an existing MPT issuance and permissioned domain data from the `vaultSetup.js` script, but you can also provide your own values. If you want to create a public vault, you don't need to provide the `domainID`.
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/vaults/py/create_vault.py" language="python" from="# Create and fund" before="# Prepare VaultCreate" /%}

The example uses an existing MPT issuance and permissioned domain data from the `vault_setup.py` script, but you can also provide your own values. If you want to create a public vault, you don't need to provide the `domain_id`.
{% /tab %}
{% /tabs %}

### 3. Prepare VaultCreate transaction

Create the [VaultCreate transaction][] object:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/createVault.js" language="js" from="// Prepare VaultCreate" before="// Submit, sign" /%}

The `tfVaultPrivate` flag and `DomainID` field restrict deposits to accounts with valid credentials in the specified permissioned domain. These can be omitted if you want to create a public vault instead.

The `Data` field contains hex-encoded metadata about the vault itself, such as its name (`n`) and website (`w`). While any data structure is allowed, it's recommended to follow the [defined data schema](../../../../references/protocol/ledger-data/ledger-entry-types/vault.md#data-field-format) for better discoverability in the XRPL ecosystem.

The `AssetsMaximum` is set to `0` to indicate no cap on how much of the asset the vault can hold, but you can adjust as needed.
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/vaults/py/create_vault.py" language="python" from="# Prepare VaultCreate" before="# Submit, sign" /%}

The `tfVaultPrivate` flag and `domain_id` field restrict deposits to accounts with valid credentials in the specified permissioned domain. These can be omitted if you want to create a public vault instead.

The `data` field contains hex-encoded metadata about the vault itself, such as its name (`n`) and website (`w`). While any data structure is allowed, it's recommended to follow the [defined data schema](../../../../references/protocol/ledger-data/ledger-entry-types/vault.md#data-field-format) for better discoverability in the XRPL ecosystem.

The `assets_maximum` is set to `0` to indicate no cap on how much of the asset the vault can hold, but you can adjust as needed.
{% /tab %}
{% /tabs %}

Vault shares are **transferable** by default, meaning depositors can transfer their shares to other accounts. If you don't want the vault's shares to be transferable, enable the `tfVaultShareNonTransferable` flag.

### 4. Submit VaultCreate transaction

Sign and submit the `VaultCreate` transaction to the XRP Ledger.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/createVault.js" language="js" from="// Submit, sign" before="// Extract vault information" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/vaults/py/create_vault.py" language="python" from="# Submit, sign" before="# Extract vault information" /%}
{% /tab %}
{% /tabs %}

Verify that the transaction succeeded by checking for a `tesSUCCESS` result code.

### 5. Get vault information

Retrieve the vault's information from the transaction result by checking for the `Vault` object in the transaction metadata.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/createVault.js" language="js" from="// Extract vault information" before="// Call vault_info" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/vaults/py/create_vault.py" language="python" from="# Extract vault information" before="# Call vault_info" /%}
{% /tab %}
{% /tabs %}

You can also use the [vault_info method][]  to retrieve the vault's details:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/vaults/js/createVault.js" language="js" from="// Call vault_info" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/vaults/py/create_vault.py" language="python" from="# Call vault_info" /%}
{% /tab %}
{% /tabs %}

This confirms that you have successfully created an empty single asset vault.

## See Also

**Concepts**:
  - [Single Asset Vaults](../../../../concepts/tokens/single-asset-vaults.md)
  - [Credentials](../../../../concepts/decentralized-storage/credentials)
  - [Permissioned Domains](../../../../concepts/tokens/decentralized-exchange/permissioned-domains)

**Tutorials**:
  - [Issue Credentials](../../../javascript/build-apps/credential-issuing-service.md)
  - [Create Permissioned Domain](../../../javascript/compliance/create-permissioned-domains.md)
  - [Deposit Assets into a Vault](./deposit-into-a-vault.md)

**References**:
  - [VaultCreate transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
