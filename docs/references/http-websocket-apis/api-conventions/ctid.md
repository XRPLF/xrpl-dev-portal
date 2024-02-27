---
html: ctid.html
parent: api-conventions.html
seo:
    description: A Compact Transaction Identifier (CTID) is a short string that uniquely identifies a validated transaction across any chain.
labels:
  - Development
---
# Compact Transaction Identifier

A Compact Transaction Identifier (CTID) is a unique identifier for a validated transaction that applies across any [network](../../../concepts/networks-and-servers/parallel-networks.md), not just the XRP Ledger Mainnet.

The differences between a CTID and a transaction's [identifying hash](../../../concepts/transactions/index.md#identifying-transactions) are as follows:

- A CTID identifies a validated transaction based on its network ID, ledger index, and position within the ledger. Since it specifies which network a transaction has been validated on, it can be used in contexts where you are interacting with more than one network, such as connecting to sidechains. A CTID is 64 bits, typically written as 16 characters of uppercase hexadecimal starting with `C`, for example `C005523E00000000`.
- An transaction's identifying hash identifies a signed transaction based on its contents, regardless of if that transaction has been validated on any chains. Since it's a cryptographic hash, it can also be used to prove that the transaction contents are intact. A transaction hash is 256 bits, typically written as 64 characters of hexadecimal, for example `E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7`.

**Caution:** Do not try to use a CTID for a transaction that has not yet been validated. The canonical order of the transaction can change between when the transaction is initially applied and when it is validated by the consensus process, resulting in a CTID that identifies a different transaction or no transaction at all.

## Structure

A CTID contains the following parts, in order (big-endian):

1. 4 bits: The hex nibble `C` indicating that this is a CTID.
2. 28 bits: The ledger index of the ledger where the transaction was validated.
3. 16 bits: The transaction index, its place within the ledger's canonical order. This is provided as the field `TransactionIndex` in [transaction metadata](../../protocol/transactions/metadata.md).
4. 16 bits: The [network ID](../../protocol/transactions/common-fields.md#networkid-field) of the network that validated this transaction.

**Note:** The ledger index is normally stored as a 32-bit unsigned integer which increases by 1 each time a new ledger is created. If a network's ledger index is greater than 268,435,455, it won't fit in 28 bits, so the leading `C` should be incremented to `D`, `E`, or `F` as necessary. This is not expected to be necessary until at least the year 2043.

## See Also

For more information including sample code and background, see the [XLS-37d Standard](https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0037d-concise-transaction-identifier-ctid).
