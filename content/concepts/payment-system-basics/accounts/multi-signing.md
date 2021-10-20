---
html: multi-signing.html
parent: accounts.html
blurb: Use multi-signing for greater security sending transactions.
labels:
  - Smart Contracts
  - Security
---
# Multi-Signing

Multi-signing in the XRP Ledger is a method of [authorizing transactions](transaction-basics.html#authorizing-transactions) for the XRP Ledger by using a combination of multiple secret keys. You can have any combination of authorization methods enabled for your address, including multi-signing, a [master key pair](cryptographic-keys.html#master-key-pair), and a [regular key pair](cryptographic-keys.html#regular-key-pair). (The only requirement is that _at least one_ method must be enabled.)

Benefits of multi-signing include:

* You can require keys from different devices, so that a malicious actor must compromise multiple machines to send transactions on your behalf.
* You can share custody of an address between multiple people, each of whom only has one of several keys necessary to send transactions from that address.
* You can delegate the power to send transactions from your address to a group of people, who can control your address if you are unavailable or unable to sign normally.
* ... and more.

## SignerLists

Before you can multi-sign, you must create a list of which addresses can sign for you.

The [SignerListSet transaction][] defines which addresses can authorize transactions from your address. You can include 1 to 8 addresses in a SignerList. The SignerList cannot include the sender's address and there can be no duplicate entries. You can control how many signatures are needed, in which combinations, by using the *SignerWeight* and *SignerQuorum* values of the SignerList.

### SignerWeight

You can assign a weight to each signer in the SignerList. The weight represents the relative authority of the signer to other signers on the list. The higher the value, the more authorization authority. Individual SignerWeight values cannot exceed 2<sup>16</sup>-1.

### SignerQuorum

The SignerQuorum value is the minimum SignerWeight total required to authorize a transaction. The SignerQuorum value must be attainable. The SignerQuorum must be greater than 0 but less than or equal to the sum of the SignerWeight values in the SignerList.  

### Examples Using SignerWeight and SignerQuorum

For a typical use case, you might have a shared account with a SignerQuorum of 1, then give all participants a SignerWeight of 1. A single approval from any one of them is all that is required to approve a transaction.

For a very important account, you might set the SignerQuorum to 3, with 3 participants that have a SignerWeight of 1. All of the participants must agree and approve each transaction.

Another account might also have a SignerQuorum of 3. You assign your CEO a SignerWeight of 3, 3 Vice Presidents a SignerWeight of 2 each, and 3 Directors a SignerWeight of 1 each. To approve a transaction for this account requires the approval of all 3 Directors (total weight of 3), 1 Vice President and 1 Director (total weight of 3), 2 Vice Presidents (total weight of 4), or the CEO (total weight of 3).

In each of the previous three use cases, you would disable the master key without configuring a regular key, so that multi-signing is the only way of [authorizing transactions](transaction-basics.html#authorizing-transactions).

There might be a scenario where you create a multi-signing list as a "backup plan." The account owner normally uses a regular key for their transactions (not a multi-signing key). For safety, the owner adds a SignerList containing 3 friends, each with a weight of 1, and a SignerQuorum of 3. If the account owner were to lose the private key, they can ask their friends to multi-sign a transaction to replace the regular key.

SignerWeight and SignerQuorum allow you to set an appropriate level of oversight for each transaction, based on the relative trust and authority relegated to responsible participants who manage the account. 

## Sending Multi-Signed Transactions

To successfully submit a multi-signed transaction, you must do all of the following:

* The address sending the transaction (specified in the `Account` field) must have a [SignerList in the ledger](signerlist.html). For instructions on how to do this, see [Set Up Multi-Signing](set-up-multi-signing.html).
* The transaction must include the `SigningPubKey` field as an empty string.
* The transaction must include a [`Signers` field](transaction-common-fields.html#signers-field) containing an array of signatures.
* The signatures present in the `Signers` array must match signers defined in the SignerList.
* For the provided signatures, the total `weight` associated with those signers must be equal or greater than the `quorum` for the SignerList.
* The [transaction cost](transaction-cost.html) (specified in the `Fee` field) must be at least (N+1) times the normal transaction cost, where N is the number of signatures provided.
* All fields of the transaction must be defined before collecting signatures. You cannot [auto-fill](transaction-common-fields.html#auto-fillable-fields) any fields.
* If presented in binary form, the `Signers` array must be sorted based on the numeric value of the signer addresses, with the lowest value first. (If submitted as JSON, the [submit_multisigned method][] handles this automatically.)

## See Also

- **Tutorials:**
    - [Set Up Multi-Signing](set-up-multi-signing.html)
    - [Send a Multi-Signed Transaction](send-a-multi-signed-transaction.html)
- **Concepts:**
    - [Cryptographic Keys](cryptographic-keys.html)
    - [Special Transaction Cost for Multi-signed transactions](transaction-cost.html#special-transaction-costs)
- **References:**
    - [SignerListSet transaction][]
    - [SignerList object](signerlist.html)
    - [sign_for method][]
    - [submit_multisigned method][]

{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
