---
seo:
  description: Remove a regular key pair already authorized by your account.
labels:
  - Security
  - Accounts
---
# Remove a Regular Key Pair

This tutorial shows how to remove a [regular key pair](../../../concepts/accounts/cryptographic-keys.md) from an [account](../../../concepts/accounts/index.md). You can do this if you suspect your regular key pair is compromised.

{% admonition type="success" name="Tip: Change Regular Key Pair" %}
To replace an existing regular key pair with a new regular key pair, follow the exact same process as [assigning a regular key pair](assign-a-regular-key-pair.md) for the first time.
{% /admonition %}

## Goals

By following this tutorial, you should learn how to:

- Look up the regular key pair associated with an account, if any.
- Remove the regular key pair from an account.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
- Have an [XRP Ledger client library](../../../references/client-libraries.md), such as **xrpl.js**, installed.
- Have a basic understanding of [Cryptographic Keys](../../../concepts/accounts/cryptographic-keys.md).

## Source Code

You can find the complete source code for this tutorial's examples in the {% repo-link path="_code-samples/remove-regular-key/" %}code samples section of this website's repository{% /repo-link %}.

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
{% code-snippet file="/_code-samples/remove-regular-key/js/remove-regular-key.js" language="js" before="// Generate a regular key" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/remove-regular-key/py/remove-regular-key.py" language="py" before="# Generate a regular key" /%}
{% /tab %}
{% /tabs %}

Before you can remove the regular key pair from an account, the account has to have a regular key pair assigned in the first place. Since the sample code uses a fresh account from the faucet, it needs to generate and assign a regular key pair. **Skip this part if you are using an existing account that already has a regular key pair assigned.**

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/remove-regular-key/js/remove-regular-key.js" language="js" from="// Generate a regular key" before="// Check regular key" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/remove-regular-key/py/remove-regular-key.py" language="py" from="# Generate a regular key" before="# Check regular key" /%}
{% /tab %}
{% /tabs %}

### 3. Check regular key pair associated with account

Before you disable the regular key, you may want to confirm that the account has a regular key assigned and check which key it is. To do this, use the [account_info method][] and look at for a `RegularKey` field in the account data. If the field is present, it contains the [address](../../../concepts/accounts/addresses.md) of the regular key pair; if the field is absent, the account does not currently have a regular key pair authorized.

This step is optional; you can remove the regular key pair without knowing which key it is.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/remove-regular-key/js/remove-regular-key.js" language="js" from="// Check regular key" before="// Remove regular key" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/remove-regular-key/py/remove-regular-key.py" language="py" from="# Check regular key" before="# Remove regular key" /%}
{% /tab %}
{% /tabs %}

### 4. Remove regular key pair

To remove the regular key pair, send a [SetRegularKey transaction][] without a `RegularKey` field. You can sign this transaction with the regular key pair itself, with the master key pair, or with a multi-signing list.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/remove-regular-key/js/remove-regular-key.js" language="js" from="// Remove regular key" before="// Confirm that the account has no regular key" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/remove-regular-key/py/remove-regular-key.py" language="py" from="# Remove regular key" before="# Confirm that the account has no regular key" /%}
{% /tab %}
{% /tabs %}

If the transaction fails with the result code `tecNO_ALTERNATIVE_KEY`, you cannot remove the regular key because the account does not have any other method of authorizing transactions: this means the master key pair is disabled and the account does not have a multi-signing list. Before you can remove the regular key pair, you must either re-enable the master key pair or set up a multi-signing list.

### 5. Confirm that the account has no regular key authorized

After removing the regular key pair, you can confirm that the account has no regular key pair using the [account_info method][] in the same way as in step 3. If the account data does not have a `RegularKey` field, then no regular key pair is authorized.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/remove-regular-key/js/remove-regular-key.js" language="js" from="// Confirm that the account has no regular key" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/remove-regular-key/py/remove-regular-key.py" language="py" from="# Confirm that the account has no regular key" /%}
{% /tab %}
{% /tabs %}

Another way to verify that you succeeded at removing the regular key pair is to attempt to send a transaction signed using the removed key pair. Submitting the transaction should fail with the `badSecret` error and an error message such as `Secret does not match account`.

## See Also

- **Concepts:**
    - [Cryptographic Keys](../../../concepts/accounts/cryptographic-keys.md)
    - [Multi-Signing](../../../concepts/accounts/multi-signing.md)
    - [Transaction Cost](../../../concepts/transactions/transaction-cost.md)
        - [Key Reset Transaction](../../../concepts/transactions/transaction-cost.md#key-reset-transaction): a special case where you can send a SetRegularKey transaction with a transaction cost of 0.
- **Tutorials:**
    - [Change or Remove a Regular Key Pair](change-or-remove-a-regular-key-pair.md)
    - [Set Up Multi-Signing](set-up-multi-signing.md)
    - [Disable Master Key Pair](disable-master-key-pair.md)
- **References:**
    - [SetRegularKey transaction][]
    - [account_info method][]
    - [AccountRoot entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
