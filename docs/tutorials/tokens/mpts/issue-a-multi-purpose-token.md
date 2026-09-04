---
seo:
  description: Issue a Multi-Purpose Token (MPT) with arbitrary metadata on the XRP Ledger.
metadata:
  indexPage: true
labels:
  - Multi-Purpose Token
  - MPT
  - Token Issuance
---
# Issue a Multi-Purpose Token (MPT)

A [Multi-Purpose Token (MPT)](../../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md) lets you quickly access powerful, built-in tokenization features on the XRP Ledger with minimal code.

This tutorial shows you how to issue an MPT with on-chain metadata, such as the token's ticker, name, or description, encoded according to the MPT [metadata schema](../../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md#metadata-schema) defined in [XLS-89](https://xls.xrpl.org/xls/XLS-0089-multi-purpose-token-metadata-schema.html). It then shows you how to update the token's [mutable properties](../../../concepts/tokens/fungible-tokens/mutable-mpts.md) and how to declare a property immutable.

{% amendment-disclaimer name="DynamicMPT" mode="updated" /%}

## Goals

By the end of this tutorial, you will be able to:

- Issue a new MPT on the XRP Ledger.
- Encode and decode token metadata according to the XLS-89 standard.
- Modify token properties after issuance.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
- Have an XRP Ledger client library set up in your development environment. This page provides examples for the following:
	- **JavaScript** with the [xrpl.js library](https://github.com/XRPLF/xrpl.js). See [Get Started Using JavaScript](../../get-started/get-started-javascript.md) for setup steps.
    - **Python** with the [xrpl-py library](https://github.com/XRPLF/xrpl-py). See [Get Started Using Python](../../get-started/get-started-python.md) for setup steps.

## Source Code

You can find the complete source code for this tutorial's example in the [code samples section of this website's repository](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/issue-mpt-with-metadata).

## Steps

The example in this tutorial demonstrates how to issue a sample [US Treasury bill (T-bill)](https://www.treasurydirect.gov/research-center/history-of-marketable-securities/bills/t-bills-indepth/) as an MPT on the XRP Ledger.

### 1. Install dependencies

{% tabs %}
{% tab label="JavaScript" %}
From the code sample folder, use npm to install dependencies:

```bash
npm install xrpl
```
{% /tab %}

{% tab label="Python" %}
From the code sample folder, install dependencies using pip:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
{% /tab %}
{% /tabs %}

### 2. Set up client and account

Import the client library, instantiate a client to connect to the XRPL, and fund a new wallet to act as the token issuer.

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/issue-mpt-with-metadata/js/issue-mpt-with-metadata.js" language="js" before="// Define metadata as JSON" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/issue-mpt-with-metadata/py/issue-mpt-with-metadata.py" language="py" before="# Define metadata as JSON" /%}
{% /tab %}

{% /tabs %}

{% admonition type="info" name="Note" %}
The ledger entry that defines an MPT issuance counts as one object towards the issuer's [owner reserve](../../../concepts/accounts/reserves.md#owner-reserves), so the issuer needs to set aside **{% $env.PUBLIC_OWNER_RESERVE %}** per MPT issuance.
{% /admonition %}

### 3. Define and encode MPT metadata

The metadata you provide is what distinguishes your token from other MPTs. Define the JSON metadata as shown in the following code snippet:

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/issue-mpt-with-metadata/js/issue-mpt-with-metadata.js" language="js" from="// Define metadata as JSON" before="// Encode the metadata" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/issue-mpt-with-metadata/py/issue-mpt-with-metadata.py" language="py" from="# Define metadata as JSON" before="# Encode the metadata" /%}
{% /tab %}

{% /tabs %}

The metadata schema supports both long field names (`ticker`, `name`, `desc`) and compact short keys (`t`, `n`, `d`). To save space on the ledger, it’s recommended to use short key names. This is because the metadata field has a 1024-byte limit, so using compact keys allows you to include more information.

The SDK libraries provide utility functions to encode or decode the metadata for you, so you don't have to. If long field names are provided in the JSON, the **encoding utility function** automatically shortens them to their compact key equivalents before encoding. Similarly, when decoding, the **decoding utility function** converts the short keys back to their respective long names.

To encode the metadata:

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/issue-mpt-with-metadata/js/issue-mpt-with-metadata.js" language="js" from="// Encode the metadata" before="// Define the transaction" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/issue-mpt-with-metadata/py/issue-mpt-with-metadata.py" language="py" from="# Encode the metadata" before="# Define the transaction" /%}
{% /tab %}

{% /tabs %}

{% admonition type="warning" name="Caution" %}
The encoding function raises an error if the input isn't a valid JSON object.
{% /admonition %}

### 4. Prepare the MPTokenIssuanceCreate transaction

To issue the MPT, create an `MPTokenIssuanceCreate` transaction object with the following fields:

| Field               | Value  |
|:------------------- |:------ |
| `TransactionType`   | The type of transaction. In this case, `MPTokenIssuanceCreate`. |
| `Account`           | The wallet address of the account that is issuing the MPT. In this case, the `issuer`. |
| `AssetScale`        | Where to put the decimal place when displaying amounts of this MPT. This is set to `4` for this example. |
| `MaximumAmount`     | The maximum supply of the token to be issued. |
| `TransferFee`       | The transfer fee to charge for transferring the token. In this example it is set to `0`. |
| `Flags`             | Flags to set token permissions. For this example, the following flags are configured: <ul><li>**Can Transfer**: A holder can transfer the T-bill MPT to another account.</li><li>**Can Lock**: The issuer can lock individual balances of the T-bill MPT, or the entire issuance.</li></ul>See [MPTokenIssuanceCreate Flags](../../../references/protocol/transactions/types/mptokenissuancecreate.md#mptokenissuancecreate-flags) for all available flags. |
| `ImmutableFlags`    | Flags declaring which fields and MPT issuance flags can never be changed. This example declares **Can Clawback** immutable, so the issuer can never gain the power to claw back tokens from holders. See [MPTokenIssuanceCreate Immutable Flags](../../../references/protocol/transactions/types/mptokenissuancecreate.md#mptokenissuancecreate-immutable-flags) for all available flags. |
| `MPTokenMetadata`   | The hex-encoded metadata for the token. |

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/issue-mpt-with-metadata/js/issue-mpt-with-metadata.js" language="js" from="// Define the transaction" before="// Sign and submit the transaction" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/issue-mpt-with-metadata/py/issue-mpt-with-metadata.py" language="py" from="# Define the transaction" before="# Sign and submit the transaction" /%}
{% /tab %}

{% /tabs %}

### 5. Submit the transaction and check the result

Some important considerations about token metadata when you submit the transaction:

- If you provide metadata that exceeds the 1024-byte limit, the transaction fails with an error.

- If the metadata does not conform to the XLS-89 standards, the transaction still succeeds, but your token may not be compatible with wallets and applications that expect valid MPT metadata. The SDK libraries provide a warning to help you diagnose why your metadata may not be compliant. For example:
  
  ```sh
  MPTokenMetadata is not properly formatted as JSON as per the XLS-89d standard. 
  While adherence to this standard is not mandatory, such non-compliant MPToken's 
  might not be discoverable by Explorers and Indexers in the XRPL ecosystem.
  - ticker/t: should have uppercase letters (A-Z) and digits (0-9) only. Max 6 characters recommended.
  - name/n: should be a non-empty string.
  - icon/i: should be a non-empty string.
  - asset_class/ac: should be one of rwa, memes, wrapped, gaming, defi, other.
  ```

Sign and submit the `MPTokenIssuanceCreate` transaction to the ledger, then verify that it succeeded and retrieve the MPT issuance ID.

{% admonition type="warning" name="Caution" %}
The `AssetScale` and `MaximumAmount` values are fixed for the life of the token, as is anything you declare in `ImmutableFlags`. Review these settings carefully before submitting. The metadata and transfer fee stay mutable unless you declare them immutable. Capability flags can also be enabled later if they weren't declared immutable, but enabled flags can't be disabled.
{% /admonition %}

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/issue-mpt-with-metadata/js/issue-mpt-with-metadata.js" language="js" from="// Sign and submit the transaction" before="// Look up MPT Issuance entry" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/issue-mpt-with-metadata/py/issue-mpt-with-metadata.py" language="py" from="# Sign and submit the transaction" before="# Look up MPT Issuance entry" /%}
{% /tab %}

{% /tabs %}

A `tesSUCCESS` result indicates that the transaction is successful and the token has been created.

### 6. Confirm MPT issuance and decode metadata

Look up the MPT issuance entry in the validated ledger and decode the metadata to verify it matches your original input.

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/issue-mpt-with-metadata/js/issue-mpt-with-metadata.js" language="js" from="// Look up MPT Issuance entry" before="// Update the mutable properties" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/issue-mpt-with-metadata/py/issue-mpt-with-metadata.py" language="py" from="# Look up MPT Issuance entry" before="# Update the mutable properties" /%}
{% /tab %}

{% /tabs %}

The decoding utility function converts the metadata back to a JSON object and expands the compact key names back to their respective long names.

### 7. (Optional) Modify the token after issuance

Your token is now issued and ready to use. The `MPTokenMetadata` and `TransferFee` fields stay mutable, and unset [MPT issuance flags](../../../references/protocol/ledger-data/ledger-entry-types/mptokenissuance.md#mptokenissuance-flags) can still be enabled, so you can adjust the issuance as your business needs evolve. Use an [MPTokenIssuanceSet transaction][] to update these properties, enable capability flags, or declare them immutable with the `ImmutableFlags` field.

The following example updates the interest rate in the token's metadata, sets a 0.01% transfer fee, enables **Can Trade**, and makes the metadata immutable, all in a single transaction:

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/issue-mpt-with-metadata/js/issue-mpt-with-metadata.js" language="js" from="// Update the mutable properties" before="// Confirm the updated MPT Issuance entry" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/issue-mpt-with-metadata/py/issue-mpt-with-metadata.py" language="py" from="# Update the mutable properties" before="# Confirm the updated MPT Issuance entry" /%}
{% /tab %}

{% /tabs %}

Note the following:

- A metadata update replaces the whole field, so encode the complete object, not only the parts you changed.
- A single transaction can update a property, enable a capability flag, and declare a property immutable. Here, the metadata updates to a 4.75% interest rate, and any later attempts to change it will fail with `tecNO_PERMISSION`.
- `ImmutableFlags` is additive, so each declaration adds to the ones already on the issuance instead of replacing them.
- A non-zero `TransferFee` requires the **Can Transfer** flag, which this example enabled at issuance. See [Transfer Fee Rules](../../../references/protocol/transactions/types/mptokenissuanceset.md#transfer-fee-rules).
- Capability flags, such as **Can Trade**, can be enabled at issuance or later, but once enabled, no later transaction can disable them.
- You can't combine these updates with a `Holder` field, `tfMPTLock`, or `tfMPTUnlock`. Locking holders' balances is a separate operation.

Look up the issuance entry again to confirm the changes:

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/issue-mpt-with-metadata/js/issue-mpt-with-metadata.js" language="js" from="// Confirm the updated MPT Issuance entry" before="// Disconnect from the client" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/issue-mpt-with-metadata/py/issue-mpt-with-metadata.py" language="py" from="# Confirm the updated MPT Issuance entry" /%}
{% /tab %}

{% /tabs %}

## See Also

- **Concepts**:
  - [Multi-Purpose Tokens (MPT)](../../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md)
- **Tutorials**:
  - [Send a Multi-Purpose Token (MPT)](/docs/tutorials/tokens/mpts/send-an-mpt.md)
  - [Mutable MPTs](../../../concepts/tokens/fungible-tokens/mutable-mpts.md)
- **References**:
  - [MPTokenIssuance entry][]
  - [MPTokenIssuanceCreate transaction][]
  - [MPTokenIssuanceDestroy transaction][]
  - [MPTokenIssuanceSet transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
