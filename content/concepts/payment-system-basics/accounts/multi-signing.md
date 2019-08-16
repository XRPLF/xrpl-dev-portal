# Multi-Signing

Multi-signing in the XRP Ledger is a method of [authorizing transactions](transaction-basics.html#authorizing-transactions) for the XRP Ledger by using a combination of multiple secret keys. You can have any combination of authorization methods enabled for your address, including multi-signing, a [master key pair](cryptographic-keys.html#master-key-pair), and a [regular key pair](cryptographic-keys.html#regular-key-pair). (The only requirement is that _at least one_ method must be enabled.)

Benefits of multi-signing include:

* You can require keys from different devices, so that a malicious actor must compromise multiple machines to send transactions on your behalf.
* You can share custody of an address between multiple people, each of whom only has one of several keys necessary to send transactions from that address.
* You can delegate the power to send transactions from your address to a group of people, who can control your address if you are unavailable or unable to sign normally.
* ... and more.

## Signer Lists

Before you can multi-sign, you must create a list of which addresses can sign for you.

The [SignerListSet transaction][] defines which addresses can authorize transactions from your address. You can include up to 8 addresses in a SignerList. You can control how many signatures are needed, in which combinations, by using the quorum and weight values of the SignerList.

## Sending Multi-Signed Transactions

To successfully submit a multi-signed transaction, you must do all of the following:

* The address sending the transaction (specified in the `Account` field) must own a [`SignerList` in the ledger](signerlist.html).
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
