---
seo:
  description: Issue a Multi-Purpose Token (MPT) that supports confidential transfers, register the issuer and auditor encryption keys, and mint confidential tokens.
metadata:
  indexPage: true
labels:
  - Multi-Purpose Token
  - MPT
  - Confidential Transfers
status: not_enabled
---
# Issue an MPT for Confidential Transfers

This tutorial shows you how to issue a [Multi-Purpose Token (MPT)](../../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md) that supports [Confidential Transfers](../../../concepts/tokens/fungible-tokens/confidential-transfers.md), so that account balances and transfer amounts stay encrypted on-ledger.

{% amendment-disclaimer name="ConfidentialTransfer" /%}

## Goals

By the end of this tutorial, you will be able to:

- Generate the [EC-ElGamal](https://en.wikipedia.org/wiki/ElGamal_encryption) keypairs that confidential transfers require.
- Issue an MPT configured for confidential transfers.
- Merge an inbox balance into a spending balance and decrypt it to verify the result.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
- Understand the [Confidential Transfers](../../../concepts/tokens/fungible-tokens/confidential-transfers.md) concept, in particular the [issuer second account model](../../../concepts/tokens/fungible-tokens/confidential-transfers.md#issuer-second-account-model) and the [split-balance model](../../../concepts/tokens/fungible-tokens/confidential-transfers.md#split-balance-model).
- Have an XRP Ledger client library set up in your development environment. This page provides examples for the following:
  - **JavaScript** with the [xrpl.js library][]. See [Get Started Using JavaScript][] for setup steps.
  - **Python** with the [xrpl-py library][]. See [Get Started Using Python][] for setup steps.

## Source Code

You can find the complete source code for this tutorial's examples in the {% repo-link path="_code-samples/confidential-transfers/" %}code samples section of this website's repository{% /repo-link %}.

## Steps

### 1. Install dependencies

{% tabs %}
{% tab label="JavaScript" %}
From the code sample folder, use `npm` to install dependencies.

```bash
npm install
```
{% /tab %}

{% tab label="Python" %}
From the code sample folder, set up a virtual environment and use `pip` to install dependencies.

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
{% /tab %}
{% /tabs %}

### 2. Set up the client and accounts

To get started, import the necessary libraries and instantiate a client to connect to the XRP Ledger. This example imports:

{% tabs %}
{% tab label="JavaScript" %}
- `fs`: Used to write the generated accounts and keys to a local file.
- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling.

{% code-snippet file="/_code-samples/confidential-transfers/js/issueConfidentialMPT.js" language="js" before="// Fund the accounts" /%}
{% /tab %}

{% tab label="Python" %}
- `json`: Used to write the generated accounts and keys to a local file.
- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling.
- `xrpl.ext.confidential`: Used for key generation, confidential transaction builders, and decryption.

{% code-snippet file="/_code-samples/confidential-transfers/py/issue_confidential_mpt.py" language="py" before="# Fund the accounts" /%}
{% /tab %}
{% /tabs %}

Next, fund the three accounts this example needs:

- **Issuer**: Creates the MPT issuance and registers the encryption keys.
- **Second account**: A regular holder account that the issuer controls. This is the account that holds the confidential balance.
- **Auditor**: An independent party that can decrypt every holder's balance for this issuance.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/confidential-transfers/js/issueConfidentialMPT.js" language="js" from="// Fund the accounts" before="// Generate confidential encryption keypairs" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/issue_confidential_mpt.py" language="py" from="# Fund the accounts" before="# Generate confidential encryption keypairs" /%}
{% /tab %}
{% /tabs %}

An issuing account can't hold a confidential balance of its own token, because an issuer's balance doesn't count as tokens in circulation. Confidential tokens enter circulation through a second account that the issuer controls and that the ledger treats as a regular holder.

{% admonition type="info" name="Note" %}
The auditor account is optional, so include it only if the token needs independent oversight. The auditor key must be registered in the same transaction as the issuer key, so this decision is permanent.
{% /admonition %}

### 3. Generate the encryption keypairs

Confidential transfers use EC-ElGamal encryption over secp256k1. Each participant needs an encryption keypair, which is separate from the account's signing keys. The private key is the only way to decrypt a balance, and the public key is what gets registered on the ledger.

{% tabs %}
{% tab label="JavaScript" %}
Generate the encryption keypairs with `deriveConfidentialKeypair()`. This helper function derives the keypair deterministically from an account's seed, so one backed-up secret recovers both the signing key and the encryption key.

{% code-snippet file="/_code-samples/confidential-transfers/js/issueConfidentialMPT.js" language="js" from="// Generate confidential encryption keypairs" before="// Create the MPT issuance" /%}
{% /tab %}

{% tab label="Python" %}
Generate the encryption keypairs with `generate_keypair()`. This helper function returns a fresh random keypair as a `(private_key, public_key)` tuple. It isn't derived from the account seed, so you have to store the private key yourself.

{% code-snippet file="/_code-samples/confidential-transfers/py/issue_confidential_mpt.py" language="py" from="# Generate confidential encryption keypairs" before="# Create the MPT issuance" /%}
{% /tab %}
{% /tabs %}

{% admonition type="danger" name="Warning" %}
**Store the encryption private keys securely.** If a holder loses their encryption private key, their confidential balance is permanently unspendable. The holder can't decrypt it and can't generate the proofs needed to send or convert it back. Registered public keys are permanent and can't be changed or cleared.
{% /admonition %}

### 4. Create the MPT issuance

Submit an [MPTokenIssuanceCreate transaction][] with the `tfMPTCanHoldConfidentialBalance` flag. This flag is what makes the issuance eligible for confidential balances.

The example sets `tfMPTCanTransfer` so holders can send the token to each other, `tfMPTCanClawback` so the issuer can recover balances, and `tfMPTCanLock` so the issuer can freeze them.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/confidential-transfers/js/issueConfidentialMPT.js" language="js" from="// Create the MPT issuance" before="// Register the encryption keys on the issuance" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/issue_confidential_mpt.py" language="py" from="# Create the MPT issuance" before="# Register the encryption keys on the issuance" /%}
{% /tab %}
{% /tabs %}

You can also add this capability to an existing issuance with the `tfMPTSetCanHoldConfidentialBalance` flag on an [MPTokenIssuanceSet transaction][], as long as the issuer didn't mark the capability immutable at creation. Enabling it is **one-way**, so there is no flag to turn it off.

{% admonition type="warning" name="Caution" %}
The `TransferFee` must be `0` on an issuance that can hold confidential balances, because the ledger can't compute a percentage fee on an encrypted amount.
{% /admonition %}

### 5. Register the encryption keys

Holders can't convert their balances into confidential ones until the issuer registers an `IssuerEncryptionKey` with an [MPTokenIssuanceSet transaction][]. Register an `AuditorEncryptionKey` in the same transaction if the token needs independent oversight.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/confidential-transfers/js/issueConfidentialMPT.js" language="js" from="// Register the encryption keys on the issuance" before="// Authorize the second account" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/issue_confidential_mpt.py" language="py" from="# Register the encryption keys on the issuance" before="# Authorize the second account" /%}
{% /tab %}
{% /tabs %}

{% admonition type="danger" name="Warning" %}
Key registration is a permanent operation:

- Neither key can be changed or removed after registration. Resubmitting a key that's already on the issuance returns `tecNO_PERMISSION`.
- `AuditorEncryptionKey` requires `IssuerEncryptionKey` in the same transaction, or the transaction returns `temMALFORMED`. Because the issuer key can't be resubmitted, this is the only chance to register an auditor.
{% /admonition %}

Once an auditor is registered, every confidential transaction on the issuance must have an `AuditorEncryptedAmount`.

### 6. Send public tokens to the second account

To introduce confidential tokens into circulation, the issuer must send the required amount to their second account, and convert it.

Authorize the second account to hold the MPT with an [MPTokenAuthorize transaction][], then send it the required amount with a [Payment transaction][].

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/confidential-transfers/js/issueConfidentialMPT.js" language="js" from="// Authorize the second account" before="// Convert the public balance to a confidential balance" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/issue_confidential_mpt.py" language="py" from="# Authorize the second account" before="# Convert the public balance to a confidential balance" /%}
{% /tab %}
{% /tabs %}

Note that this payment is **public**. The amount is visible to anyone reading the ledger, and it sets the ceiling on how much this account can hold confidentially.

### 7. Convert the public balance to a confidential balance

Submit a [ConfidentialMPTConvert transaction][] to convert the public balance into a confidential one.

{% admonition type="info" name="Note" %}
Confidential transactions cost 10 times the standard [transaction cost](../../../concepts/transactions/transaction-cost.md).
{% /admonition %}

{% tabs %}
{% tab label="JavaScript" %}
`prepareConfidentialConvert` reads the issuer's and auditor's registered public keys from the [MPTokenIssuance entry][], so you pass only the holder's own keypair.

{% code-snippet file="/_code-samples/confidential-transfers/js/issueConfidentialMPT.js" language="js" from="// Convert the public balance to a confidential balance" before="// Merge the inbox into the spending balance" /%}
{% /tab %}

{% tab label="Python" %}
`prepare_confidential_convert` takes the issuer's and the auditor's registered public keys as arguments, along with the holder's own keypair.

{% code-snippet file="/_code-samples/confidential-transfers/py/issue_confidential_mpt.py" language="py" from="# Convert the public balance to a confidential balance" before="# Merge the inbox into the spending balance" /%}
{% /tab %}
{% /tabs %}

The helper function handles the following for you:

- Encrypts the amount under the holder's, the issuer's, and any auditor's public keys, using one shared blinding factor so every ciphertext commits to the same value.
- Generates a Schnorr proof that the account controls the encryption key it registers.
- Sets a `HolderEncryptionKey`, so the holder's first conversion doubles as their opt-in. No separate registration step is needed.

{% admonition type="warning" name="Caution" %}
The Schnorr proof commits to the account's `Sequence` number as the helper function read it from the ledger. Submit the prepared transaction before sending anything else from that account. If another transaction lands first, the prepared transaction is no longer valid and must be rebuilt.
{% /admonition %}

Note that the `MPTAmount` field on a conversion is plaintext. Observers can see how much moved into the confidential pool, but not how it's distributed or spent afterwards.

### 8. Merge the inbox into the spending balance

A confidential balance has two buckets on the [MPToken entry][]:

- `ConfidentialBalanceInbox` receives incoming funds, from both conversions and confidential payments.
- `ConfidentialBalanceSpending` is the only bucket a [ConfidentialMPTSend transaction][] can draw from.

Submit a [ConfidentialMPTMergeInbox transaction][] to move the inbox balance into the spending balance. The two buckets exist so that an incoming payment can't invalidate a proof that the holder is already building against their spending balance.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/confidential-transfers/js/issueConfidentialMPT.js" language="js" from="// Merge the inbox into the spending balance" before="// Decrypt the confidential balance" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/issue_confidential_mpt.py" language="py" from="# Merge the inbox into the spending balance" before="# Decrypt the confidential balance" /%}
{% /tab %}
{% /tabs %}

Each merge increments the holder's `ConfidentialBalanceVersion`. Proofs for confidential sends are bound to that version, so a merge invalidates any proof that was built against a previous one.

### 9. Decrypt the confidential balance

The second account is controlled by the issuer, so the issuer holds its encryption private key. Read the second account's `MPToken` entry, then decrypt `ConfidentialBalanceSpending` with that key to confirm the conversion was successful.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/confidential-transfers/js/issueConfidentialMPT.js" language="js" from="// Decrypt the confidential balance" before="// The auditor reads the same amount" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/issue_confidential_mpt.py" language="py" from="# Decrypt the confidential balance" before="# The auditor reads the same amount" /%}
{% /tab %}
{% /tabs %}

The `MPToken` also has an `AuditorEncryptedBalance` field, which holds the same amount, but is encrypted under the auditor key. The auditor can decrypt it with its own private key and should see the same balance, without ever needing the issuer's key.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/confidential-transfers/js/issueConfidentialMPT.js" language="js" from="// The auditor reads the same amount" before="// Save the accounts and keys" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/issue_confidential_mpt.py" language="py" from="# The auditor reads the same amount" before="# Save the accounts and keys" /%}
{% /tab %}
{% /tabs %}

Everyone else sees only the ciphertext.

### 10. Save the accounts and keys

The example writes the account seeds and the encryption keypairs to a `keys.json` file, so you can reuse these accounts.

{% admonition type="danger" name="Warning" %}
**Saving keys to a JSON file is not secure, and is only acceptable when working on a test network.** In production, store them in a secure, encrypted key store.
{% /admonition %}

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/confidential-transfers/js/issueConfidentialMPT.js" language="js" from="// Save the accounts and keys" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/issue_confidential_mpt.py" language="py" from="# Save the accounts and keys" /%}
{% /tab %}
{% /tabs %}

## See Also

- **Concepts**:
  - [Confidential Transfers](../../../concepts/tokens/fungible-tokens/confidential-transfers.md)
  - [Multi-Purpose Tokens (MPT)](../../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md)
- **Tutorials**:
  - [Send Confidential MPT Payments](../../payments/send-confidential-payments.md)
- **References**:
  - [ConfidentialMPTConvert transaction][]
  - [ConfidentialMPTMergeInbox transaction][]
  - [MPToken entry][]
  - [MPTokenIssuance entry][]
  - [MPTokenIssuanceCreate transaction][]
  - [MPTokenIssuanceSet transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
