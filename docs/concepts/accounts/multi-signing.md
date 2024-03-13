---
html: multi-signing.html
parent: accounts.html
seo:
    description: Use multi-signing for greater security sending transactions.
labels:
  - Smart Contracts
  - Security
---
# Multi-Signing

Multi-signing in the XRP Ledger is a method of [authorizing transactions](../transactions/index.md#authorizing-transactions) for the XRP Ledger by using a combination of multiple secret keys. You can have any combination of authorization methods enabled for your address, including multi-signing, a [master key pair](cryptographic-keys.md#master-key-pair), and a [regular key pair](cryptographic-keys.md#regular-key-pair). (The only requirement is that _at least one_ method must be enabled.)

Benefits of multi-signing include:

- You can require keys from different devices, so that a malicious actor must compromise multiple machines to send transactions on your behalf.
- You can share custody of an address between multiple people, each of whom only has one of several keys necessary to send transactions from that address.
- You can delegate the power to send transactions from your address to a group of people, who can control your address if you are unavailable or unable to sign normally.

## Signer Lists

Before you can multi-sign, you must create a list of which addresses can sign for you.

The [SignerListSet transaction][] defines a _signer list_, a set of addresses that can authorize transactions from your address. You can include 1 to 32 addresses in a signer list. The list cannot include your address and there can be no duplicate entries. You can control how many signatures are needed, in which combinations, by using the _Signer Weight_ and _Quorum_ settings in the list.

_(Updated by the [ExpandedSignerList amendment][].)_

### Signer Weight

You assign a weight to each signer in the list. The weight represents the authority of the signer relative to other signers on the list. The higher the value, the more authority. Individual weight values cannot exceed 2<sup>16</sup>-1.

### Quorum

The quorum value of a list is the minimum weight total required to authorize a transaction. The quorum must be greater than 0 but less than or equal to the sum of the weight values in the signer list: meaning, it must be possible to achieve a quorum with the given signer weights.

### Wallet Locator
<!-- STYLE_OVERRIDE: wallet -->

You can also add up to 256 bits of arbitrary data to each signer's entry in the list. This data is not required or used by the network, but can be used by smart contracts or other applications to identify or confirm other data about the signers.

_(Added by the [ExpandedSignerList amendment][].)_


### Examples Using Signer Weight and Quorum

The weights and quorum allow you to set an appropriate level of oversight for each transaction, based on the relative trust and authority relegated to responsible participants who manage the account.

For a shared account use case, you might create a list with a quorum of 1, then give all participants a weight of 1. A single approval from any one of them is all that is required to approve a transaction.

For a very important account, you might set the quorum to 3, with 3 participants that have a weight of 1. All of the participants must agree and approve each transaction.

Another account might also have a quorum of 3. You assign your CEO a weight of 3, 3 Vice Presidents a weight of 2 each, and 3 Directors a weight of 1 each. To approve a transaction for this account requires the approval of all 3 Directors (total weight of 3), 1 Vice President and 1 Director (total weight of 3), 2 Vice Presidents (total weight of 4), or the CEO (total weight of 3). <!-- STYLE_OVERRIDE: vice -->

In each of the previous three use cases, you would disable the master key without configuring a regular key, so that multi-signing is the only way of [authorizing transactions](../transactions/index.md#authorizing-transactions).

There might be a scenario where you create a multi-signing list as a "backup plan." The account owner normally uses a regular key for their transactions (not a multi-signing key). For safety, the owner adds a signer list containing 3 friends, each with a weight of 1, and a quorum of 3. If the account owner were to lose the private key, they can ask their friends to multi-sign a transaction to replace the regular key.


## Sending Multi-Signed Transactions

To successfully submit a multi-signed transaction, you must do all of the following:

* The address sending the transaction (specified in the `Account` field) must have a [`SignerList` object in the ledger](../../references/protocol/ledger-data/ledger-entry-types/signerlist.md). For instructions on how to do this, see [Set Up Multi-Signing](../../tutorials/how-tos/manage-account-settings/set-up-multi-signing.md).
* The transaction must include the `SigningPubKey` field as an empty string.
* The transaction must include a [`Signers` field](../../references/protocol/transactions/common-fields.md#signers-field) containing an array of signatures.
* The signatures present in the `Signers` array must match signers defined in the `SignerList`.
* For the provided signatures, the total weight associated with those signers must be equal or greater than the quorum for the `SignerList`.
* The [transaction cost](../transactions/transaction-cost.md) (specified in the `Fee` field) must be at least (N+1) times the normal transaction cost, where N is the number of signatures provided.
* All fields of the transaction must be defined before collecting signatures. You cannot [auto-fill](../../references/protocol/transactions/common-fields.md#auto-fillable-fields) any fields.
* If presented in binary form, the `Signers` array must be sorted based on the numeric value of the signer addresses, with the lowest value first. (If submitted as JSON, the [submit_multisigned method][] handles this automatically.)

## See Also

- **Tutorials:**
    - [Set Up Multi-Signing](../../tutorials/how-tos/manage-account-settings/set-up-multi-signing.md)
    - [Send a Multi-Signed Transaction](../../tutorials/how-tos/manage-account-settings/send-a-multi-signed-transaction.md)
- **Concepts:**
    - [Cryptographic Keys](cryptographic-keys.md)
    - [Special Transaction Cost for Multi-signed transactions](../transactions/transaction-cost.md#special-transaction-costs)
- **References:**
    - [SignerListSet transaction][]
    - [SignerList object](../../references/protocol/ledger-data/ledger-entry-types/signerlist.md)
    - [sign_for method][]
    - [submit_multisigned method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
