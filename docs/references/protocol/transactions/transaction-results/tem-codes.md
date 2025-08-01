---
html: tem-codes.html
parent: transaction-results.html
seo:
    description: tem codes indicate that the transaction was malformed, and cannot succeed according to the XRP Ledger protocol.
labels:
  - Transaction Sending
---
# tem Codes

These codes indicate that the transaction was malformed, and cannot succeed according to the XRP Ledger protocol. They have numerical values in the range -299 to -200. The exact code for any given error is subject to change, so don't rely on it.

{% admonition type="success" name="Tip" %}Transactions with `tem` codes are not applied to ledgers, and cannot cause any changes to XRP Ledger state. A `tem` result is final unless the rules for a valid transaction change. (For example, using functionality from an [Amendment](../../../../concepts/networks-and-servers/amendments.md) before that amendment is enabled results in `temDISABLED`; such a transaction could succeed later if it becomes valid when the amendment is enabled.){% /admonition %}

| Code                          | Explanation                                   |
|:------------------------------|:----------------------------------------------|
| `temBAD_AMM_TOKENS`           | The transaction incorrectly specified one or more assets. For example, the asset's issuer does not match the corresponding asset in the AMM's pool, or the transaction specified the same asset twice. _(Added by the [AMM amendment][])_  |
| `temBAD_AMOUNT`               | An amount specified by the transaction (for example the destination `Amount` or `SendMax` values of a [Payment][]) was invalid, possibly because it was a negative number. |
| `temBAD_AUTH_MASTER`          | The key used to sign this transaction does not match the master key for the account sending it, and the account does not have a [Regular Key](../../../../concepts/accounts/cryptographic-keys.md) set. |
| `temBAD_CURRENCY`             | The transaction improperly specified a currency field. See [Specifying Currency Amounts][Currency Amount] for the correct format. |
| `temBAD_EXPIRATION`           | The transaction improperly specified an expiration value, for example as part of an [OfferCreate transaction][]. Alternatively, the transaction did not specify a required expiration value, for example as part of an [EscrowCreate transaction][]. |
| `temBAD_FEE`                  | The transaction improperly specified its `Fee` value, for example by listing a non-XRP currency or some negative amount of XRP. |
| `temBAD_ISSUER`               | The transaction improperly specified the `issuer` field of some currency included in the request. |
| `temBAD_LIMIT`                | The [TrustSet transaction][] improperly specified the `LimitAmount` value of a trust line. |
| `temBAD_NFTOKEN_TRANSFER_FEE` | The [NFTokenMint transaction][] improperly specified the `TransferFee` field of the transaction. _(Added by the [NonFungibleTokensV1_1 amendment][].)_ |
| `temBAD_OFFER`                | The [OfferCreate transaction][] specifies an invalid offer, such as offering to trade XRP for itself, or offering a negative amount. |
| `temBAD_PATH`                 | The [Payment transaction][] specifies one or more [Paths](../../../../concepts/tokens/fungible-tokens/paths.md) improperly, for example including an issuer for XRP, or specifying an account differently. |
| `temBAD_PATH_LOOP`            | One of the [Paths](../../../../concepts/tokens/fungible-tokens/paths.md) in the [Payment transaction][] was flagged as a loop, so it cannot be processed in a bounded amount of time. |
| `temBAD_SEND_XRP_LIMIT`       | The [Payment transaction][] used the [`tfLimitQuality` flag](../types/payment.md#limit-quality) in a direct XRP-to-XRP payment, even though XRP-to-XRP payments do not involve any conversions. |
| `temBAD_SEND_XRP_MAX`         | The [Payment transaction][] included a `SendMax` field in a direct XRP-to-XRP payment, even though sending XRP should never require `SendMax`. (XRP is only valid in `SendMax` if the destination `Amount` is not XRP.) |
| `temBAD_SEND_XRP_NO_DIRECT`   | The [Payment transaction][] used the [`tfNoDirectRipple` flag](../types/payment.md#payment-flags) for a direct XRP-to-XRP payment, even though XRP-to-XRP payments are always direct. |
| `temBAD_SEND_XRP_PARTIAL`     | The [Payment transaction][] used the [`tfPartialPayment` flag](../../../../concepts/payment-types/partial-payments.md) for a direct XRP-to-XRP payment, even though XRP-to-XRP payments should always deliver the full amount. |
| `temBAD_SEND_XRP_PATHS`       | The [Payment transaction][] included `Paths` while sending XRP, even though XRP-to-XRP payments should always be direct. |
| `temBAD_SEQUENCE`             | The transaction is references a sequence number that is higher than its own `Sequence` number, for example trying to cancel an offer that would have to be placed after the transaction that cancels it. |
| `temBAD_SIGNATURE`            | The signature to authorize this transaction is either missing, or formed in a way that is not a properly-formed signature. (See [`tecNO_PERMISSION`](tec-codes.md) for the case where the signature is properly formed, but not authorized for this account.) |
| `temBAD_SRC_ACCOUNT`          | The `Account` on whose behalf this transaction is being sent (the "source account") is not a properly-formed [account](../../../../concepts/accounts/index.md) address. |
| `temBAD_TRANSFER_RATE`        | The [`TransferRate` field of an AccountSet transaction](../types/accountset.md#transferrate) is not properly formatted or out of the acceptable range. |
| `temCANNOT_PREAUTH_SELF`      | The sender of the [DepositPreauth transaction][] was also specified as the account to preauthorize. You cannot preauthorize yourself. |
| `temDST_IS_SRC`               | The transaction improperly specified a destination address as the `Account` sending the transaction. This includes trust lines (where the destination address is the `issuer` field of `LimitAmount`) and payment channels (where the destination address is the `Destination` field). |
| `temDST_NEEDED`               | The transaction improperly omitted a destination. This could be the `Destination` field of a [Payment transaction][], or the `issuer` sub-field of the `LimitAmount` field fo a `TrustSet` transaction. |
| `temINVALID`                  | The transaction is otherwise invalid. For example, the transaction ID may not be the right format, the signature may not be formed properly, or something else went wrong in understanding the transaction. |
| `temINVALID_COUNT`            | The transaction includes a `TicketCount` field, but the number of Tickets specified is invalid. |
| `temINVALID_FLAG`             | The transaction includes a [Flag](../common-fields.md#flags-field) that does not exist, or includes a contradictory combination of flags. |
| `temMALFORMED`                | Unspecified problem with the format of the transaction. |
| `temREDUNDANT`                | The transaction would do nothing; for example, it is sending a payment directly to the sending account, or creating an offer to buy and sell the same currency from the same issuer. |
| `temREDUNDANT_SEND_MAX`       | {% badge href="https://github.com/XRPLF/rippled/releases/tag/0.28.0" %}Removed in: rippled 0.28.0{% /badge %} |
| `temRIPPLE_EMPTY`             | The [Payment transaction][] includes an empty `Paths` field, but paths are necessary to complete this payment. |
| `temSEQ_AND_TICKET`           | The transaction contains both a `TicketSequence` field and a non-zero `Sequence` value. A transaction cannot include both. _(Added by the [TicketBatch amendment][].)_ |
| `temBAD_WEIGHT`               | The [SignerListSet transaction][] includes a `SignerWeight` that is invalid, for example a zero or negative value. |
| `temBAD_SIGNER`               | The [SignerListSet transaction][] includes a signer who is invalid. For example, there may be duplicate entries, or the owner of the SignerList may also be a member. |
| `temBAD_QUORUM`               | The [SignerListSet transaction][] has an invalid `SignerQuorum` value. Either the value is not greater than zero, or it is more than the sum of all signers in the list. |
| `temUNCERTAIN`                | Used internally only. This code should never be returned. |
| `temUNKNOWN`                  | Used internally only. This code should never be returned. |
| `temDISABLED`                 | The transaction requires logic that is disabled. Typically this means you are trying to use an [amendment](../../../../concepts/networks-and-servers/amendments.md) that is not enabled for the current ledger. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
