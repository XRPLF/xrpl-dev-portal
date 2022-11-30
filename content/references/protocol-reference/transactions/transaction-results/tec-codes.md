---
html: tec-codes.html
parent: transaction-results.html
blurb: tec codes indicate that the transaction failed, but it was applied to a ledger to deduct the transaction cost.
labels:
  - Transaction Sending
---
# tec Codes

These codes indicate that the transaction failed, but it was applied to a ledger to apply the [transaction cost](transaction-cost.html). They have numerical values in the range 100 to 199. Ripple recommends using the text code, not the numeric value.

For the most part, transactions with `tec` codes take no action other than to destroy the XRP paid as a [transaction cost](transaction-cost.html), but there are some exceptions. As one such exception, a transaction that results in `tecOVERSIZE` still cleans up some [unfunded offers](offers.html#lifecycle-of-an-offer). Always look at the [transaction metadata](transaction-metadata.html) to see precisely what a transaction did.

**Caution:** A transaction that provisionally failed with a `tec` code may still succeed or fail with a different code after being reapplied. The result is final when it appears in a validated ledger version. For more information, see [Finality of Results](finality-of-results.html) and [Reliable Transaction Submission](reliable-transaction-submission.html).

| Code                       | Value | Explanation                             |
|:---------------------------|:------|:----------------------------------------|
| `tecAMM_BALANCE`           | 163   | 
| `tecAMM_DIRECT_PAYMENT`    | 169   | The transaction tried to send money directly to an AccountRoot object that is part of an Automated Market Maker (AMM) :not_enabled:. AMM AccountRoot entries cannot send or receive money directly except through [AMMWithdraw][] and [AMMDeposit][] transactions. |
| `tecAMM_EXISTS`            | 167   | The [AMMCreate transaction][] :not_enabled: tried to create an Automated Market Maker (AMM) instance that already exists. There can only be at most one AMM per unique currency pair. |
| `tecAMM_FAILED_DEPOSIT`    | 164   | The [AMMDeposit transaction][] :not_enabled: failed, probably because the sender does not have enough of the specified assets, or because the deposit requested an effective price that isn't possible with the available amounts. |
| `tecAMM_FAILED_WITHDRAW`   | 165   | The [AMMWithdraw transaction][] :not_enabled: failed, probably because the sender does not have enough LP Tokens, or because the withdraw requested an effective price that isn't possible with the available amounts. |
| `tecAMM_FAILED_BID`        | 168   | The [AMMBid transaction][] :not_enabled: failed, probably because the price to win the auction was higher than the specified maximum value or the sender's current balance. |
| `tecAMM_FAILED_VOTE`       | 170   | The [AMMVote transaction][] :not_enabled: failed, probably because there are already too many votes from accounts that hold more LP Tokens for this AMM. (This can still recalculate the AMM's trading fee.) |
| `tecAMM_INVALID_TOKENS`    | 166   | The AMM-related transaction :not_enabled: failed due to insufficient LP Tokens or problems with rounding; for example, depositing a very small amount of assets could fail if the amount of LP Tokens to be returned rounds down to zero. |
| `tecCANT_ACCEPT_OWN_NFTOKEN_OFFER` | 157 | The transaction tried to accept an offer that was placed by the same account to buy or sell a [non-fungible token](non-fungible-tokens.html). _(Added by the [NonFungibleTokensV1_1 amendment][].)_ |
| `tecCLAIM`                 | 100   | Unspecified failure, with transaction cost destroyed. |
| `tecCRYPTOCONDITION_ERROR` | 146   | This [EscrowCreate][] or [EscrowFinish][] transaction contained a malformed or mismatched crypto-condition. |
| `tecDIR_FULL`              | 121   | The transaction tried to add an object (such as a trust line, Check, Escrow, or Payment Channel) to an account's owner directory, but that account cannot own any more objects in the ledger. |
| `tecDUPLICATE`             | 149   | The transaction tried to create an object (such as a [DepositPreauth][] authorization) that already exists. |
| `tecDST_TAG_NEEDED`        | 143   | The [Payment transaction][] omitted a [destination tag](source-and-destination-tags.html), but the destination account has the `lsfRequireDestTag` flag enabled. [New in: rippled 0.28.0][] |
| `tecEXPIRED`               | 148   | The transaction tried to create an object (such as an Offer or a Check) whose provided Expiration time has already passed. |
| `tecFAILED_PROCESSING`     | 105   | An unspecified error occurred when processing the transaction. |
| `tecFROZEN`                | 137   | The [OfferCreate transaction][] failed because one or both of the assets involved are subject to a [global freeze](freezes.html). |
| `tecHAS_OBLIGATIONS`       | 151   | The [AccountDelete transaction][] failed because the account to be deleted owns objects that cannot be deleted. See [Deletion of Accounts](accounts.html#deletion-of-accounts) for details. |
| `tecINSUF_RESERVE_LINE`    | 122   | The transaction failed because the sending account does not have enough XRP to create a new trust line. (See: [Reserves](reserves.html)) This error occurs when the counterparty already has a trust line in a non-default state to the sending account for the same currency. (See `tecNO_LINE_INSUF_RESERVE` for the other case.) |
| `tecINSUF_RESERVE_OFFER`   | 123   | The transaction failed because the sending account does not have enough XRP to create a new Offer. (See: [Reserves](reserves.html)) |
| `tecINSUFF_FEE`            | 136   | The transaction failed because the sending account does not have enough XRP to pay the [transaction cost](transaction-cost.html) that it specified. (In this case, the transaction processing destroys all of the sender's XRP even though that amount is lower than the specified transaction cost.) This result only occurs if the account's balance decreases _after_ this transaction has been distributed to enough of the network to be included in a consensus set. Otherwise, the transaction fails with [`terINSUF_FEE_B`](ter-codes.html) before being distributed. |
| `tecINSUFFICIENT_FUNDS`    | 158 | One of the accounts involved does not hold enough of a necessary asset. _(Added by the [NonFungibleTokensV1_1 amendment][].)_ |
| `tecINSUFFICIENT_PAYMENT`  | 161 | The amount specified is not enough to pay all fees involved in the transaction. For example, when trading a non-fungible token, the buy amount may not be enough to pay both the broker fee and the sell amount. _(Added by the [NonFungibleTokensV1_1 amendment][].)_ |
| `tecINSUFFICIENT_RESERVE`  | 141   | The transaction would increase the [reserve requirement](reserves.html) higher than the sending account's balance. [SignerListSet][], [PaymentChannelCreate][], [PaymentChannelFund][], and [EscrowCreate][] can return this error code. See [Signer Lists and Reserves](signerlist.html#signer-lists-and-reserves) for more information. |
| `tecINTERNAL`              | 144   | Unspecified internal error, with transaction cost applied. This error code should not normally be returned. If you can reproduce this error, please [report an issue](https://github.com/ripple/rippled/issues). |
| `tecINVARIANT_FAILED`      | 147   | An invariant check failed when trying to execute this transaction. Added by the [EnforceInvariants amendment][]. If you can reproduce this error, please [report an issue](https://github.com/ripple/rippled/issues). |
| `tecKILLED`                | 150   | The [OfferCreate transaction][] specified the `tfFillOrKill` flag and could not be filled, so it was killed. _(Added by the [fix1578 amendment][].)_ |
| `tecMAX_SEQUENCE_REACHED`  | 153   | A sequence number field is already at its maximum. This includes the `MintedNFTokens` field. _(Added by the [NonFungibleTokensV1_1 amendment][].)_ |
| `tecNEED_MASTER_KEY`       | 142   | This transaction tried to cause changes that require the master key, such as [disabling the master key or giving up the ability to freeze balances](accountset.html#accountset-flags). [New in: rippled 0.28.0][] |
| `tecNFTOKEN_BUY_SELL_MISMATCH` | 155 | The [NFTokenAcceptOffer transaction][] attempted to match incompatible offers to buy and sell a non-fungible token. _(Added by the [NonFungibleTokensV1_1 amendment][].)_ |
| `tecNFTOKEN_OFFER_TYPE_MISMATCH` | 156 | One or more of the offers specified in the transaction was not the right type of offer. (For example, a buy offer was specified in the `NFTokenSellOffer` field.) _(Added by the [NonFungibleTokensV1_1 amendment][].)_ |
| `tecNO_ALTERNATIVE_KEY`    | 130   | The transaction tried to remove the only available method of [authorizing transactions](transaction-basics.html#authorizing-transactions). This could be a [SetRegularKey transaction][] to remove the regular key, a [SignerListSet transaction][] to delete a SignerList, or an [AccountSet transaction][] to disable the master key. (Prior to `rippled` 0.30.0, this was called `tecMASTER_DISABLED`.) |
| `tecNO_AUTH`               | 134   | The transaction failed because it needs to add a balance on a trust line to an account with the `lsfRequireAuth` flag enabled, and that trust line has not been authorized. If the trust line does not exist at all, `tecNO_LINE` occurs instead. |
| `tecNO_DST`                | 124   | The account on the receiving end of the transaction does not exist. This includes Payment and TrustSet transaction types. (It could be created if it received enough XRP.) |
| `tecNO_DST_INSUF_XRP`      | 125   | The account on the receiving end of the transaction does not exist, and the transaction is not sending enough XRP to create it. |
| `tecNO_ENTRY`              | 140   | The transaction tried to modify a [ledger object](ledger-object-types.html), such as a [Check](checks.html), [Payment Channel](payment-channels.html), or [Deposit Preauthorization](depositpreauth-object.html), but the specified object does not exist. It may have already been deleted by a previous transaction or the transaction may have an incorrect value in an ID field such as `CheckID`, `Channel`, `Unauthorize`. |
| `tecNO_ISSUER`             | 133   | The account specified in the `issuer` field of a currency amount does not exist. |
| `tecNO_LINE`               | 135   | The `TakerPays` field of the [OfferCreate transaction][] specifies an asset whose issuer has `lsfRequireAuth` enabled, and the account making the offer does not have a trust line for that asset. (Normally, making an offer implicitly creates a trust line if necessary, but in this case it does not bother because you cannot hold the asset without authorization.) If the trust line exists, but is not authorized, `tecNO_AUTH` occurs instead. |
| `tecNO_LINE_INSUF_RESERVE` | 126   | The transaction failed because the sending account does not have enough XRP to create a new trust line. (See: [Reserves](reserves.html)) This error occurs when the counterparty does not have a trust line to this account for the same currency. (See `tecINSUF_RESERVE_LINE` for the other case.) |
| `tecNO_LINE_REDUNDANT`     | 127   | The transaction failed because it tried to set a trust line to its default state, but the trust line did not exist. |
| `tecNO_PERMISSION`         | 139   | The sender does not have permission to do this operation. For example, the [EscrowFinish transaction][] tried to release a held payment before its `FinishAfter` time, someone tried to use [PaymentChannelFund][] on a channel the sender does not own, or a [Payment][] tried to deliver funds to an account with the "DepositAuth" flag enabled. |
| `tecNO_REGULAR_KEY`        | 131   | The [AccountSet transaction][] tried to disable the master key, but the account does not have another way to [authorize transactions](transaction-basics.html#authorizing-transactions). If [multi-signing](multi-signing.html) is enabled, this code is deprecated and `tecNO_ALTERNATIVE_KEY` is used instead. |
| `tecNO_SUITABLE_NFTOKEN_PAGE` | 154 | The transaction tried to mint or acquire a non-fungible token but the account receiving the `NFToken` does not have a directory page that can hold it. This situation is rare. _(Added by the [NonFungibleTokensV1_1 amendment][].)_ |
| `tecNO_TARGET`             | 138   | The transaction referenced an Escrow or PayChannel ledger object that doesn't exist, either because it never existed or it has already been deleted. (For example, another [EscrowFinish transaction][] has already executed the held payment.) Alternatively, the destination account has `asfDisallowXRP` set so it cannot be the destination of this [PaymentChannelCreate][] or [EscrowCreate][] transaction. |
| `tecOBJECT_NOT_FOUND`      | 160   | One of the objects specified by this transaction did not exist in the ledger. _(Added by the [NonFungibleTokensV1_1 amendment][].)_ |
| `tecOVERSIZE`              | 145   | This transaction could not be processed, because the server created an excessively large amount of [metadata](transaction-metadata.html) when it tried to apply the transaction. [New in: rippled 0.29.0-hf1][] |
| `tecOWNERS`                | 132   | The transaction requires that account sending it has a nonzero "owners count", so the transaction cannot succeed. For example, an account cannot enable the [`lsfRequireAuth`](accountset.html#accountset-flags) flag if it has any trust lines or available offers. |
| `tecPATH_DRY`              | 128   | The transaction failed because the provided [paths](paths.html) did not have enough liquidity to send anything at all. This could mean that the source and destination accounts are not linked by [trust lines](trust-lines-and-issuing.html). |
| `tecPATH_PARTIAL`          | 101   | The transaction failed because the provided [paths](paths.html) did not have enough liquidity to send the full amount. |
| `tecTOO_SOON`              | 152   | The [AccountDelete transaction][] failed because the account to be deleted had a `Sequence` number that is too high. The current ledger index must be at least 256 higher than the account's sequence number. |
| `tecUNFUNDED`              | 129   | The transaction failed because the account does not hold enough XRP to pay the amount in the transaction _and_ satisfy the additional [reserve](reserves.html) necessary to execute this transaction. |
| `tecUNFUNDED_ADD`          | 102   | **DEPRECATED.**                         |
| `tecUNFUNDED_AMM`          | 162   | The [AMMCreate transaction][] :not_enabled: failed because the sender does not have enough of the specified assets to fund it. |
| `tecUNFUNDED_PAYMENT`      | 104   | The transaction failed because the sending account is trying to send more XRP than it holds, not counting the [reserve](reserves.html). |
| `tecUNFUNDED_OFFER`        | 103   | The [OfferCreate transaction][] failed because the account creating the offer does not have any of the `TakerGets` currency. |

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
