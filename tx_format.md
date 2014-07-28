# Transaction Format #

## All Transactions

| Field | Type | Description |
|-------|------|-------------|
| Account | String | The unique address of the account that initiated the transaction |
| Fee | String | Amount of XRP in drops to be destroyed from the sendering account's balance as a fee for redistributing this transaction to the network. (See [Transaction Fees](https://ripple.com/wiki/Transaction_Fee) |
| Flags | Unsigned Integer | (Optional) Set of bit-flags for this transaction |
| LastLedgerSequence | Number | (Optional) Highest valid ledger number that a transaction can appear in. If this is specified, and the transaction is not included by the time the ledger reaches the specified ledger sequence number, then the transaction is considered to have failed and will no longer be valid. |
| Memos | Array | (Optional) Additional arbitrary information used to identify this transaction. <span class='draft-comment'>(The exact format and limitations of this field are subject to change.)</span> |
| PreviousTxnID | String | (Optional) Identifying hash value of the immediately-previous transaction. If provided, that transaction is canceled and this one replaces it. <span class='draft-comment'>(More clarification needed)</span> |
| Sequence | Unsigned Integer | The sequence number, relative to the initiating account, of this transaction. |
| SigningPubKey | String | (Omitted until signed) Hex representation of the public key that corresponds to the private key used to sign this transaction. |
| SourceTag | <span class='draft-comment'>Uint32?</span> | (Optional) <span class='draft-comment'> Allows the creator of transaction to identify the transaction. For payments, specify the DestinationTag for returning funds. (Need more clarification)</span> |
| TransactionType | String | The type of transaction. Valid types include: `Payment`, `OfferCreate`, `OfferCancel`, `TrustSet`, and `AccountSet`. |
| TxnSignature | String | (Omitted until signed) The signature that verifies this transaction as originating from the account it says it is from |


## Payments

| Field | Type | Description |
|-------|------|-------------|
| Amount | String (XRP)<br/>Object (Otherwise) | (Payment only) The amount of currency sent as part of this transaction. |
| Destination | String | (Payment only) The unique address of the account receiving the payment. |
| DestinationTag | Number<span class='draft-comment'>(UInt32?)</span> | (Optional) Arbitrary tag that identifies the reason for the payment to the destination. |
| InvoiceID | String | (Optional) Identifying hash value of another transaction that was an invoice/bill. If provided, mark this transaction as paying that invoice/bill. <span class='draft-comment'>(More clarification needed)</span> |
| Paths | Array | (Payment only) Array of arrays, specifying [payment paths](https://ripple.com/wiki/Payment_paths) for this transaction. |
| SendMax | String/Object | (Payment only) Highest amount of currency this transaction is allowed to cost; this is to compensate for [slippage](http://en.wikipedia.org/wiki/Slippage_%28finance%29). (See [Specifying Currency Amounts](#specifying-currency-amounts)) |

## AccountSet

| Field | Type | Description |
|-------|------|-------------|
| EmailHash
| WalletLocator
| WalletSize
| MessageKey
| Domain
| TransferRate
| SetFlag
| ClearFlag
| Signers
