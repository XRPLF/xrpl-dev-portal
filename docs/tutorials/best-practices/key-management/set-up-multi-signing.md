---
seo:
    description: Add a signer list to your account to enable multi-signing.
labels:
  - Security
---
# Set Up Multi-Signing

This tutorial shows up how to set up [multi-signing](../../../concepts/accounts/multi-signing.md) on your XRP Ledger account, which allows you to authorize transactions using signatures from a combination of keys. Various configurations are possible, but this tutorial shows a straightforward configuration requiring 2 of 3 signers to authorize a transaction.

## Goals

By following this tutorial, you should learn how to:

- Generate key pairs you can use for multi-signing.
- Add or update a signer list on your account.
- Look up the signer list associated with an account, including its configured weights and quorum.


## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
- Have an [XRP Ledger client library](../../../references/client-libraries.md), such as **xrpl.js**, installed.
- Have a basic understanding of [Cryptographic Keys](../../../concepts/accounts/cryptographic-keys.md) and [Multi-Signing](../../../concepts/accounts/multi-signing.md).

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
{% code-snippet file="/_code-samples/multisigning/js/set-up-multi-signing.js" language="js" before="// Generate key pairs" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/multisigning/py/set-up-multi-signing.py" language="py" before="# Generate key pairs" /%}
{% /tab %}
{% /tabs %}

### 3. Prepare signer keys

Each signer on your list needs a key pair they can use to sign transactions. As the account owner, you only need to know the addresses, not the secret keys, of each signer. One party knowing all the secret keys might defeat the purpose of multi-signing, depending on your use case. These addresses _can_ have funded accounts in the ledger, but they don't have to.

Each signer should securely generate and store their own key pair, as you would any time you generate keys for an XRP Ledger account.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/multisigning/js/set-up-multi-signing.js" language="js" from="// Generate key pairs" before="// Send SignerListSet transaction" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/multisigning/py/set-up-multi-signing.py" language="py" from="# Generate key pairs" before="# Send SignerListSet transaction" /%}
{% /tab %}
{% /tabs %}

For purposes of this tutorial, the sample code generates three key pairs and saves their addresses into an array.

### 4. Send SignerListSet transaction

Use a [SignerListSet transaction][] to assign a multi-signing list to your account. For this transaction, you set the total weight needed for a quorum in the `SignerQuorum` field, and the list of signers with their individual weights in the `SignerEntries` field. For 2-of-3 multi-signing, give each of the three signers a weight of `1` and set the quorum to `2`. Note that each object in the `SignerEntries` array must be a wrapper object with a single `SignerEntry` field.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/multisigning/js/set-up-multi-signing.js" language="js" from="// Send SignerListSet transaction" before="// Confirm signer list" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/multisigning/py/set-up-multi-signing.py" language="py" from="# Send SignerListSet transaction" before="# Confirm signer list" /%}
{% /tab %}
{% /tabs %}

{% admonition type="success" name="Tip: Replacing Signer Lists" %}
If you already have a multi-signing list configured for your account, you can use this same process to replace it with a new list. You can even use the old list to authorize the transaction.
{% /admonition %}

### 5. Confirm that the signer list is assigned to your account

If the SignerListSet transaction succeeded, the list should now be associated with your account. For further confirmation, you can look up the list using the [account_info method][].

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/multisigning/js/set-up-multi-signing.js" language="js" from="// Confirm signer list" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/multisigning/py/set-up-multi-signing.py" language="py" from="# Confirm signer list" /%}
{% /tab %}
{% /tabs %}

{% admonition type="info" name="Note" %}
There currently is no way to have more than one multi-signing list assigned to your account, but the protocol is built to be expandable; every signer list has an ID number of `0`, so that a future [amendment](../../../concepts/networks-and-servers/amendments.md) could allow lists with other IDs. This is why the `signer_lists` field is an array in the `account_info` response.
{% /admonition %}

## Next Steps

At this point, you can [send a multi-signed transaction](send-a-multi-signed-transaction.md). You may also want to:

* [Disable the master key pair](disable-master-key-pair.md).
* [Remove the regular key pair](change-or-remove-a-regular-key-pair.md) (if you previously set one)

## See Also

- **Concepts:**
   - [Cryptographic Keys](../../../concepts/accounts/cryptographic-keys.md)
   - [Multi-Signing](../../../concepts/accounts/multi-signing.md)
- **Tutorials:**
   - [Send a Multi-signed Transaction](send-a-multi-signed-transaction.md)
   - [Assign a Regular Key Pair](assign-a-regular-key-pair.md)
   - [Reliable Transaction Submission](../../../concepts/transactions/reliable-transaction-submission.md)
- **References:**
   - [account_info method][]
   - [SignerListSet transaction][]
   - [SignerList entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
