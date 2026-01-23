---
seo:
  description: Authorize a second key pair to sign transactions from your account. This key pair can be changed or removed later.
labels:
  - Security
  - Accounts
---
# Assign a Regular Key Pair

This tutorial shows how to authorize a secondary key pair, called a _[regular key pair](../../../concepts/accounts/cryptographic-keys.md)_, to sign future transactions. Unlike the master key pair, which is mathematically linked to the account's address, you can remove or replace the regular key pair, which is better for security.

## Goals

By following this tutorial, you should learn how to:

- Securely generate a regular key pair and attach it to your account.
- Submit transactions using a regular key pair.
- Check a transaction to see if the key that was used to sign it matches a known key pair.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
- Have an [XRP Ledger client library](../../../references/client-libraries.md), such as **xrpl.js**, installed.
- Have a basic understanding of [Cryptographic Keys](../../../concepts/accounts/cryptographic-keys.md).

## Source Code

You can find the complete source code for this tutorial's examples in the {% repo-link path="_code-samples/assign-regular-key/" %}code samples section of this website's repository{% /repo-link %}.

## Steps

### 1. Install dependencies

{% tabs %}
{% tab label="JavaScript" %}
From the code sample folder, use `npm` to install dependencies:

```sh
npm i
```
{% /tab %}
{% /tabs %}

### 2. Connect and get account(s)

To get started, import the client library and instantiate an API client. For this tutorial, you need one account, which the sample code funds using the Testnet faucet; you could also use an existing account.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/assign-regular-key/js/assign-regular-key.js" language="js" before="// Generate a new key pair" /%}
{% /tab %}
{% /tabs %}

### 3. Generate a key pair

Next, generate a key pair to use as the regular key pair. This is the same data type as a master key pair, so you can generate it the same way.

{% admonition type="danger" name="Warning" %}
It's important to generate and store the key pair securely; otherwise, it may be possible for malicious actors to gain access to your account and take your money. Common errors include:

- Getting your secret key from a remote machine, or otherwise sending your secret key in plain text over the internet.
- Generating a key pair using a compromised software library.
- Generating a key pair from a passphrase or other secret value that does not have enough entropy.
{% /admonition %}

{% tabs %}
{% tab label="JavaScript" %}
Use the [`Wallet.generate()` class method](https://js.xrpl.org/classes/Wallet.html#generate) to generate a key pair locally on your machine.
{% code-snippet file="/_code-samples/assign-regular-key/js/assign-regular-key.js" language="js" from="// Generate a new key pair" before="// Send SetRegularKey transaction" /%}
{% /tab %}
{% /tabs %}

### 4. Send a SetRegularKey transaction

Use a [SetRegularKey transaction][] to assign the new key pair to your account as a regular key pair.

{% admonition type="success" name="Tip" %}This example uses the master key pair to assign the regular key pair, but you can also use an existing regular key pair to replace itself, or assign a regular key pair using a [multi-signing list](../../../concepts/accounts/multi-signing.md) if your account has multi-signing set up.{% /admonition %}

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/assign-regular-key/js/assign-regular-key.js" language="js" from="// Send SetRegularKey transaction" before="// Send a test transaction" /%}
{% /tab %}
{% /tabs %}

### 5. Send a test transaction using the regular key

After the SetRegularKey transaction succeeds, the regular key pair is assigned to your account and you should be able to send transactions using the regular key pair. **To avoid losing control of your account,** it is important that you test your regular key before you take any additional steps such as [disabling the master key pair](disable-master-key-pair.md). If you make a mistake and lose access to your account, no one can restore it for you.

To test the key, send any type of transaction, signing it using the regular key pair. The sample code sends an [AccountSet transaction][] with no parameters, which is a "no-op" that does nothing besides use a sequence number and burn the transaction cost.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/assign-regular-key/js/assign-regular-key.js" language="js" from="// Send a test transaction" before="// Check result of the test" /%}
{% /tab %}
{% /tabs %}

### 6. Confirm that the test transaction succeeded as expected

If the test transaction succeeds, your regular key pair works as expected. For further confirmation, you can look at the `SigningPubKey` field which is automatically added to a transaction during signing; this field contains the _public key_ of the key pair that was used to sign the transaction, and is what the network uses to validate the transaction signature. When you use your regular key pair to sign a transaction, the `SigningPubKey` field contains the public key from your regular key pair.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/assign-regular-key/js/assign-regular-key.js" language="js" from="// Check result of the test" /%}
{% /tab %}
{% /tabs %}

If the transaction fails with the following [result codes](../../../references/protocol/transactions/transaction-results/index.md), here are some things to check:

- **`tefBAD_AUTH`**: The regular key you signed your test transaction with doesn't match the regular key you set in the previous step. Check that the secret and address for your regular key pair match and double-check which values you used in each step.
- **`tefBAD_AUTH_MASTER`** or **`temBAD_AUTH_MASTER`**: Your account doesn't have a regular key assigned. Check that the SetRegularKey transaction executed successfully. You can also use the [account_info method][] to confirm that your regular key is set in the `RegularKey` field as expected.

For possible causes of other result codes, see [Transaction Results](../../../references/protocol/transactions/transaction-results/index.md).


## See Also

Now that you're familiar with the benefits of assigning a regular key pair to an account, consider taking a look at these related topics and tutorials:

- **Concepts:**
    - [Cryptographic Keys](../../../concepts/accounts/cryptographic-keys.md)
    - [Multi-Signing](../../../concepts/accounts/multi-signing.md)
    - [Issuing and Operational Addresses](../../../concepts/accounts/account-types.md)
- **Tutorials:**
    - [Change or Remove a Regular Key Pair](change-or-remove-a-regular-key-pair.md)
    - [Set Up Multi-Signing](set-up-multi-signing.md)
    - [List XRP as an Exchange](../../../use-cases/defi/list-xrp-as-an-exchange.md)
- **References:**
    - [wallet_propose method][]
    - [sign method][]
    - [SetRegularKey transaction][]
    - [AccountRoot object](../../../references/protocol/ledger-data/ledger-entry-types/accountroot.md) where the regular key is stored in the field `RegularKey`

{% raw-partial file="/docs/_snippets/common-links.md" /%}
