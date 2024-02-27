---
html: pseudo-transaction-types.html
parent: transaction-formats.html
seo:
    description: Formats of pseudo-transactions that validators sometimes apply to the XRP Ledger.
metadata:
  indexPage: true
labels:
  - Blockchain
---
# Pseudo-Transactions

Pseudo-transactions are never submitted by users, nor [propagated through the network](../../../../concepts/networks-and-servers/peer-protocol.md). Instead, a server may choose to inject pseudo-transactions in a proposed ledger directly according to specific protocol rules. If enough servers propose the exact same pseudo-transaction, the [consensus process](../../../../concepts/consensus-protocol/index.md) approves it, and the pseudo-transaction is included in that ledger's transaction data.

## Special Values for Common Fields

Some of the required [common fields][] for normal transactions do not make sense for pseudo-transactions. Pseudo-transactions use following special values for these common fields:

| Field           | JSON Type | [Internal Type][] | Value                      |
|:----------------|:----------|:------------------|:---------------------------|
| `Account`       | String    | AccountID         | [ACCOUNT_ZERO](../../../../concepts/accounts/addresses.md#special-addresses) |
| `Fee`           | String    | Amount            | `0`                        |
| `Sequence`      | Number    | UInt32            | `0`                        |
| `SigningPubKey` | String    | Blob              | `""` (Empty string)        |
| `TxnSignature`  | String    | Blob              | `""` (Empty string)        |

Pseudo-transactions use the following common fields as normal:

- `TransactionType`
- `Flags`

| Field             | JSON Type | [Internal Type][] | Description              |
|:------------------|:----------|:------------------|:-------------------------|
| `TransactionType` | String    | UInt16            | _(Required)_ The type of transaction. |
| `Flags`           | Number    | UInt32            | _(Optional)_ A set of bit-flags for this transaction. The meaning of specific flags varies based on the transaction type. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}


{% child-pages /%}
