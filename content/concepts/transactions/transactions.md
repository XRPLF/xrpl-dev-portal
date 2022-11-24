---
html: transactions.html
parent: concepts.html
blurb: Transactions allow accounts to modify the XRP Ledger.
labels:
  - Ledgers
---
# Transactions

_Transactions_ allow accounts to modify the XRP Ledger.

Transactions can do more than transfer currency. In addition to supporting various payment types, transactions in the XRP Ledger can rotate cryptographic keys, manage other settings, and trade in the XRP Ledger's decentralized exchange.

## Signing and Submitting Transactions

Sending a transaction to the XRP Ledger involves several steps:

1. Create an [unsigned transaction in JSON format](transaction-structure.html#example-unsigned-transaction).
2. Use one or more signatures to [authorize the transaction](#authorizing-transactions).
3. Submit a transaction to an XRP Ledger server. 
4. The [consensus process](consensus.html) determines which provisional transactions get included in the next validated ledger.
5. The servers apply those transactions to the previous ledger in a canonical order and share their results.
6. If enough trusted validators create the exact same ledger, the ledger is _validated_ and the results of the transactions in that ledger are immutable.

### Example Executed Transaction Response with Metadata

After a transaction is complete, the XRP Ledger adds metadata to show the transaction's final outcome and all the changes that the transaction made to the shared state of the XRP Ledger.

You can check a transaction's status using the API (for example, using the `tx` command).

The results of a transaction, including all its metadata, are not final until the transaction appears in a validated ledger.


## Identifying Transactions

Every signed transaction has a unique `"hash"` that identifies it. The server provides the hash in the response when you submit the transaction; you can also look up a transaction in an account's transaction history with the `account_tx` command.

The transaction hash can be used as a "proof of payment," since anyone can <!-- * --> look up the transaction by its hash to verify its final status.

<!-- *  [look up the transaction by its hash](look-up-transaction-results.html) -->

<!--
{% include '_snippets/setfee_uniqueness_note.md' %}
<!--_ -->


## Claimed Cost Justification

Although it might seem unfair to charge a [transaction cost](transaction-cost.md) for a failed transaction, the `tec` class of errors exists for good reasons:

* Transactions submitted after the failed one do not have to have their Sequence values renumbered. Incorporating the failed transaction into a ledger uses up the transaction's sequence number, preserving the expected sequence.
* Distributing the transaction throughout the network increases network load. Enforcing a cost makes it harder for attackers to abuse the network with failed transactions.
* The transaction cost is generally very small in real-world value, so it should not harm users unless they are sending large quantities of transactions.

## Authorizing Transactions

In the decentralized XRP Ledger, a digital signature proves that a transaction is authorized to do a specific set of actions. Only signed transactions can be submitted to the network and included in a validated ledger. A signed transaction is immutable: its contents cannot change, and the signature is not valid for any other transaction.

Transactions are authorized by any of the following signature types:

* A single signature from the master private key that is mathematically associated with the sending address. You can disable or enable the master key pair using an `AccountSet` transaction.
* A single signature that matches the regular private key associated with the address. You can add, remove, or replace a regular key pair using a `SetRegularKey` transaction.
* A [multi-signature](multi-signing.md) that matches a list of signers owned by the address. You can add, remove, or replace a list of signers using a `SignerListSet` transaction.

Any signature type can authorize any type of transaction, with the following exceptions:

* Only the master private key can <!-- * -->disable the master public key.
* Only the master private key can permanently give up the ability to freeze.
* You can never remove the last method of signing transactions from an address.

<!-- [disable the master public key](accountset.html) -->

For more information about master and regular key pairs, see [Cryptographic Keys](../accounts/cryptographic-keys.md).

<!--{# Add this reference after signatures concept doc is published. For more information about signatures, see [Understanding Signatures](concept-signatures.html). #}-->

<!--

## See Also

- **Concepts:**
    - [Payment Types](payment-types.html)
    - [Consensus Network](consensus-network.html)
- **Tutorials:**
    - [Set Up Secure Signing](set-up-secure-signing.html)
    - [Send XRP](send-xrp.html)
    - [Look Up Transaction Results](look-up-transaction-results.html)
    - [Monitor Incoming Payments with WebSocket](monitor-incoming-payments-with-websocket.html)
    - [Cancel or Skip a Transaction](cancel-or-skip-a-transaction.html)
    - [Reliable Transaction Submission](reliable-transaction-submission.html)
- **References:**
    - [Transaction Common Fields](transaction-common-fields.html)
    - [Transaction Types](transaction-types.html)
    - [Transaction Metadata](transaction-metadata.html)
    - [account_tx method][]
    - [tx method][]
    - [submit method][]
    - [submit_multisigned method][] 
    
-->
    
