---
seo:
  description: Send a transaction authorized with multiple signatures.
labels:
  - Security
---
# Send a Multi-Signed Transaction

This tutorial shows how to send a transaction using [multi-signing](../../../concepts/accounts/multi-signing.md).

## Goals

By following this tutorial, you should learn how to send a transaction using a multi-signing list to authorize the transaction.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
- Have an [XRP Ledger client library](../../../references/client-libraries.md), such as **xrpl.js**, installed.
- Understand how to [set up multi-signing](set-up-multi-signing.md) on an account, including how signer weights and quorums work.

## Source Code

You can find the complete source code for this tutorial's examples in the {% repo-link path="_code-samples/multisigning/" %}code samples section of this website's repository{% /repo-link %}.

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
{% code-snippet file="/_code-samples/multisigning/js/send-multi-signed-transaction.js" language="js" before="// Set up multi-signing" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/multisigning/py/send-multi-signed-transaction.py" language="py" before="# Set up multi-signing" /%}
{% /tab %}
{% /tabs %}

### 3. Set up multi-signing

Before you can send a multi-signed transaction, you have to have a signer list set up for your account. Since the sample code uses a newly funded account, it needs to do this one-time setup first. For a more detailed explanation of this process, see [Set Up Multi-Signing](set-up-multi-signing.md). **Skip this step if you are using an existing account that already has a signer list.**

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/multisigning/js/send-multi-signed-transaction.js" language="js" from="// Set up multi-signing" before="// Prepare transaction" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/multisigning/py/send-multi-signed-transaction.py" language="py" from="# Set up multi-signing" before="# Prepare transaction" /%}
{% /tab %}
{% /tabs %}

### 4. Prepare the transaction

When sending a multi-signed transaction, you need to specify _all_ the details of the transaction before collecting signatures, so that the signers are signing the exact same transaction instructions. Instead of implicitly autofilling a transaction while signing it, you can explicitly use your client library's autofill function to set auto-fillable transaction fields like the `Fee`, `Sequence`, and `LastLedgerSequence`. Multi-signed transactions require a higher [transaction cost][] based on the number of signatures, so you should specify the expected number of signers to this function.

The sample code uses a no-op [AccountSet transaction][], but you can send almost any type of transaction using a multi-signature.

{% admonition type="warning" name="Caution: Sequence Numbers" %}
You have to set the transaction's sequence number in the `Sequence` field at this time. If you send any other transactions from the same account while you are collecting signatures, this transaction becomes invalid because you can't reuse or skip sequence numbers. If collecting signatures may take a while, you should [use a ticket](../transaction-sending/use-tickets.md) instead.
{% /admonition %}

{% tabs %}
{% tab label="JavaScript" %}
In **xrpl.js**, use the [`autofill(transaction, signerCount)` method](https://js.xrpl.org/classes/Client.html#autofill) of the Client instance to autofill a transaction for multi-signing.
{% code-snippet file="/_code-samples/multisigning/js/send-multi-signed-transaction.js" language="js" from="// Prepare transaction" before="// Collect signatures" /%}
{% /tab %}

{% tab label="Python" %}
In **xrpl-py**, use the [`xrpl.transaction.autofill(transaction, client, num_signers)` function](https://xrpl-py.readthedocs.io/en/stable/source/xrpl.transaction.html#xrpl.transaction.autofill) to autofill a transaction for multi-signing.
{% code-snippet file="/_code-samples/multisigning/py/send-multi-signed-transaction.py" language="py" from="# Prepare transaction" before="# Collect signatures" /%}
{% /tab %}
{% /tabs %}

### 5. Collect signatures

Now, have each of your signers provide a signature for the prepared transaction. Provide the same prepared transaction JSON to each signer, so they can use their own private key to sign the transaction. Signatures for a multi-signed transaction are slightly different than a single-signed transaction, so be sure each signer uses the correct method for producing their signature.

{% tabs %}
{% tab label="JavaScript" %}
In **xrpl.js**, pass `true` as the second argument to the [`Wallet.sign(...)` method](https://js.xrpl.org/classes/Wallet.html#sign) to create a signature for a multi-signed transaction.
{% code-snippet file="/_code-samples/multisigning/js/send-multi-signed-transaction.js" language="js" from="// Collect signatures" before="// Combine signatures" /%}
{% /tab %}

{% tab label="Python" %}
In **xrpl-py**, pass `multisign=True` to the [`xrpl.transaction.sign(...)` function](https://xrpl-py.readthedocs.io/en/stable/source/xrpl.transaction.html#xrpl.transaction.sign) to create a signature for a multi-signed transaction.
{% code-snippet file="/_code-samples/multisigning/py/send-multi-signed-transaction.py" language="py" from="# Collect signatures" before="# Combine signatures" /%}
{% /tab %}
{% /tabs %}

### 6. Combine signatures and submit the transaction

When you have enough signatures to authorize the transaction, combine them into a single transaction, and submit the transaction to the network.

{% tabs %}
{% tab label="JavaScript" %}
In **xrpl.js**, use the [`xrpl.multisign(...)` function](https://js.xrpl.org/functions/multisign.html) to combine a list of signatures into a single multi-signed transaction.
{% code-snippet file="/_code-samples/multisigning/js/send-multi-signed-transaction.js" language="js" from="// Combine signatures" /%}
{% /tab %}

{% tab label="Python" %}
In **xrpl-py**, use the [`xrpl.transaction.multisign(...)` function](https://xrpl-py.readthedocs.io/en/stable/source/xrpl.transaction.html#xrpl.transaction.multisign) to combine a list of signatures into a single multi-signed transaction.
{% code-snippet file="/_code-samples/multisigning/py/send-multi-signed-transaction.py" language="py" from="# Combine signatures" /%}
{% /tab %}
{% /tabs %}

Confirming that the transaction succeeded and accomplished the intended purpose is largely the same as it would be when sending the transaction normally, except you should be aware of the potential for [malleability with multi-signatures](../../../concepts/transactions/finality-of-results/transaction-malleability.md#malleability-with-multi-signatures): if valid signatures can be added to or removed from the transaction, it could succeed with a different identifying hash than you expected. You can mitigate these risks with good operational security, including not submitting a transaction with more than the necessary number of signatures.

## See Also

For more information about multi-signing and related topics, see:

- **Concepts:**
    - [Cryptographic Keys](../../../concepts/accounts/cryptographic-keys.md)
    - [Multi-Signing](../../../concepts/accounts/multi-signing.md)
    - [Account Types](../../../concepts/accounts/account-types.md)
    - [Transaction Malleability](../../../concepts/transactions/finality-of-results/transaction-malleability.md)
- **Tutorials:**
    - [Set Up Multi-Signing](set-up-multi-signing.md)
    - [Disable Master Key Pair](disable-master-key-pair.md)
    - [Use Tickets](../transaction-sending/use-tickets.md)
- **References:**
    - **xrpl.js:**
        - [`autofill(transaction, signerCount)`](https://js.xrpl.org/classes/Client.html#autofill)
        - [`Wallet.sign(...)`](https://js.xrpl.org/classes/Wallet.html#sign)
        - [`xrpl.multisign(...)`](https://js.xrpl.org/functions/multisign.html)
    - **xrpl-py:**
        - [`xrpl.transaction.autofill(transaction, client, num_signers)`](https://xrpl-py.readthedocs.io/en/stable/source/xrpl.transaction.html#xrpl.transaction.autofill)
        - [`xrpl.transaction.sign(...)`](https://xrpl-py.readthedocs.io/en/stable/source/xrpl.transaction.html#xrpl.transaction.sign)
        - [`xrpl.transaction.multisign(...)`](https://xrpl-py.readthedocs.io/en/stable/source/xrpl.transaction.html#xrpl.transaction.multisign)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
