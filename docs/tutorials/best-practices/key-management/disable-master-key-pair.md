---
seo:
    description: Disable the master key that is mathematically associated with an address.
labels:
  - Security
  - Accounts
---
# Disable Master Key Pair

This page describes how to disable the [master key pair](../../../concepts/accounts/cryptographic-keys.md) for an account. You should do this if your account's master key pair may have been compromised, or if you want to make [multi-signing](../../../concepts/accounts/multi-signing.md) the _only_ way to submit transactions from your account.

{% admonition type="danger" name="Warning" %}Disabling the master key pair removes the default method of [authorizing transactions](../../../concepts/transactions/index.md#authorizing-transactions). Before doing this, it's best to double-check that you can successfully send transactions using your regular key pair or multi-signing list. Due to the decentralized nature of the XRP Ledger, there is no one who can restore access to your account if something goes wrong.{% /admonition %}

## Goals

By following this tutorial, you should learn how to:

- Disable the master key pair for an account.
- Check an account to see if its master key pair is disabled.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
- Have an [XRP Ledger client library](../../../references/client-libraries.md), such as **xrpl.js**, installed.
- Have a basic understanding of [Cryptographic Keys](../../../concepts/accounts/cryptographic-keys.md).
- Know how to [assign a regular key pair](assign-a-regular-key-pair.md) or [set up multi-signing](set-up-multi-signing.md) for an account.

## Source Code

You can find the complete source code for this tutorial's examples in the {% repo-link path="_code-samples/disable-master-key/" %}code samples section of this website's repository{% /repo-link %}.

## Steps

### 1. Install dependencies

{% tabs %}
{% tab label="JavaScript" %}
From the code sample folder, use `npm` to install dependencies:

```sh
npm i
```
{% /tab %}

{% tab label="Python" %}
From the code sample folder, set up a virtual environment and use `pip` to install dependencies:

```sh
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
{% /tab %}
{% /tabs %}

### 2. Connect and get account(s)

To get started, import the client library and instantiate an API client. For this tutorial, you need one account, which the sample code funds using the Testnet faucet; you could also use an existing account.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/disable-master-key/js/disable-master-key.js" language="js" before="// Generate a regular key" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/disable-master-key/py/disable-master-key.py" language="py" before="# Generate a regular key" /%}
{% /tab %}
{% /tabs %}

### 3. Set up another way of authorizing transactions

Before you can disable the master key pair, your account must have another way of authorizing transactions, either a regular key pair or a multi-signing list. Since the sample code uses a newly-funded account, it does not yet have either one, so it generates and assigns a regular key the same way as in the [Assign a Regular Key Pair tutorial](assign-a-regular-key-pair.md). **Skip this step if you are using an existing account that already has a regular key pair or multi-signing list set up.**

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/disable-master-key/js/disable-master-key.js" language="js" from="// Generate a regular key" before="// Disable master key" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/disable-master-key/py/disable-master-key.py" language="py" from="# Generate a regular key" before="# Disable master key" /%}
{% /tab %}
{% /tabs %}

{% admonition type="success" name="Tip" %}If your goal is to make the account a [black hole](/docs/concepts/accounts/addresses#special-addresses) that cannot send transactions at all, you still need to set a regular key. Instead of generating a key pair, use a known black hole address such as **rrrrrrrrrrrrrrrrrrrrrhoLvTp**.{% /admonition %}

### 4. Disable the master key pair

To disable the master key pair, send an [AccountSet transaction][] with the `SetFlag` value set to the `asfDisableMaster` value (4). Unlike most transactions, this one MUST be signed with the **master key pair** for the account.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/disable-master-key/js/disable-master-key.js" language="js" from="// Disable master key" before="// Confirm account flags" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/disable-master-key/py/disable-master-key.py" language="py" from="# Disable master key" before="# Confirm account flags" /%}
{% /tab %}
{% /tabs %}

If the transaction fails with the result `tecNO_ALTERNATIVE_KEY`, your account does not have another method of authorizing transactions currently enabled. You must [assign a regular key pair](assign-a-regular-key-pair.md) or [set up multi-signing](set-up-multi-signing.md), then try again to disable the master key pair.

{% admonition type="success" name="Tip" %}
If you later want to re-enable the master key pair, you can send an AccountSet transaction almost like this one, except for the following changes:
- Use the `ClearFlag` field instead of the `SetFlag` field.
- Sign the transaction using a regular key pair or multi-signing list. Naturally, you can't use the master key pair because it's disabled.
{% /admonition %}

### 5. Confirm account flags

At this point the master key pair for the account should be disabled. You can confirm that this is the case using the [account_info method][] and checking the `disableMasterKey` field of `account_flags` in the result.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/disable-master-key/js/disable-master-key.js" language="js" from="// Confirm account flags" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/disable-master-key/py/disable-master-key.py" language="py" from="# Confirm account flags" /%}
{% /tab %}
{% /tabs %}

If the result does not match your expectations, check whether the transaction you sent in the previous steps has executed successfully. It should be the most recent entry in the account's transaction history and it should have the result code `tesSUCCESS`. If you see any other [result code](../../../references/protocol/transactions/transaction-results/index.md), the transaction was not executed successfully.

Another possibility that may occur is that the `account_info` response you received was slightly out of date, because it used the validated ledger from just _before_ your transaction was validated. This is especially likely when using public server clusters, where requests may go to different machines, but it can happen any time you request data from the ledger immediately after a transaction is validated. If you wait at least half a second and send the same `account_info` request again, you should get the updated results.

You can look up the account on the [Testnet Explorer](https://testnet.xrpl.org/) to see if its master key pair is disabled in the most recent ledger version.

## See Also

For more information about this and related topics, see:

- **Concepts:**
    - [Cryptographic Keys](../../../concepts/accounts/cryptographic-keys.md)
    - [Multi-Signing](../../../concepts/accounts/multi-signing.md)
    - [Issuing and Operational Addresses](../../../concepts/accounts/account-types.md)
- **Tutorials:**
    - [Assign a Regular Key Pair](assign-a-regular-key-pair.md)
    - [Change or Remove a Regular Key Pair](change-or-remove-a-regular-key-pair.md)
    - [Set Up Multi-Signing](set-up-multi-signing.md)
- **References:**
    - [AccountSet transaction][]
    - [account_info method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
