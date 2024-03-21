---
html: nftokenacceptoffer.html
parent: transaction-types.html
seo:
    description: Accept an offer to buy or sell an NFToken.
labels:
  - NFTs, Non-fungible Tokens
---
# NFTokenAcceptOffer
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/impl/NFTokenAcceptOffer.cpp "Source")

The `NFTokenAcceptOffer` transaction is used to accept offers to `buy` or `sell` an `NFToken`. It can either:

* Allow one offer to be accepted. This is called _direct_ mode.
* Allow two distinct offers, one offering to buy a given `NFToken` and the other offering to sell the same `NFToken`, to be accepted in an atomic fashion. This is called _brokered_ mode.

_(Added by the [NonFungibleTokensV1_1 amendment][].)_

## Example NFTokenAcceptOffer JSON

```json
{
  "Account": "r9spUPhPBfB6kQeF6vPhwmtFwRhBh2JUCG",
  "Fee": "12",
  "LastLedgerSequence": 75447550,
  "Memos": [
    {
      "Memo": {
        "MemoData": "61356534373538372D633134322D346663382D616466362D393666383562356435386437"
      }
    }
  ],
  "NFTokenSellOffer": "68CD1F6F906494EA08C9CB5CAFA64DFA90D4E834B7151899B73231DE5A0C3B77",
  "Sequence": 68549302,
  "TransactionType": "NFTokenAcceptOffer"
}
```

[Query example transaction. >](/resources/dev-tools/websocket-api-tool?server=wss%3A%2F%2Fs1.ripple.com%2F&req=%7B%22id%22%3A%22example_NFTokenAcceptOffer%22%2C%22command%22%3A%22tx%22%2C%22transaction%22%3A%22BEB64444C36D1072820BAED317BE2E6470AFDAD9D8FB2D16A15A4D46E5A71909%22%2C%22binary%22%3Afalse%7D)

## Brokered vs. Direct Mode

The mode in which the transaction operates depends on the presence of the `NFTokenSellOffer` and `NFTokenBuyOffer` fields of the transaction:

| `NFTokenSellOffer` | `NFTokenBuyOffer` | Mode     |
|:-------------------|:------------------|:---------|
| ✔️                  | ✔️                 | Brokered |
| ✔️                  | ❌                 | Direct   |
| ❌                  | ✔️                 | Direct   |


If neither of those fields is specified, the transaction is malformed and produces a `tem` class error.

The semantics of brokered mode are slightly different than direct mode: the account sending the transaction acts as a broker, bringing the two offers together and causing them to be matched, but does not acquire ownership of the involved `NFToken`. If the transaction is successful, the `NFToken` is sent directly from the seller to the buyer.


## Execution Details

If the transaction succeeds:

- The `NFToken` changes ownership, meaning that the token is removed from the `NFTokenPage` of the existing owner and added to the `NFTokenPage` of the new owner.
- Funds are transferred from the buyer to the seller, as specified in the `NFTokenOffer`. If the `NFToken` has a transfer fee, then its issuer receives the specified percentage, and the rest goes to the seller.

The transaction fails with a [`tec`-class code](../transaction-results/tec-codes.md) if:

- The buyer already owns the `NFToken`.
- The seller is not the current owner of the `NFToken`.
- One or both offers in the transaction have already expired.
- The sell offer specifies a specific destination account, and the sender of the transaction is not that account.
- The sender of this transaction owns the buy or sell offer.


## Fields

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field              | JSON Type           | [Internal Type][] | Description   |
|:-------------------|:--------------------|:------------------|:--------------|
| `NFTokenSellOffer` | String              | Hash256           | _(Optional)_ Identifies the `NFTokenOffer` that offers to sell the `NFToken`. |
| `NFTokenBuyOffer`  | String              | Hash256           | _(Optional)_ Identifies the `NFTokenOffer` that offers to buy the `NFToken`. |
| `NFTokenBrokerFee` | [Currency Amount][] | Amount            | _(Optional)_ This field is only valid in brokered mode, and specifies the amount that the broker keeps as part of their fee for bringing the two offers together; the remaining amount is sent to the seller of the `NFToken` being bought. If specified, the fee must be such that, before applying the transfer fee, the amount that the seller would receive is at least as much as the amount indicated in the sell offer. |

In direct mode, you must specify **either** the `NFTokenSellOffer` or the `NFTokenBuyOffer` field. In brokered mode, you must specify **both** fields.

This functionality is intended to allow the owner of an `NFToken` to offer their token for sale to a third party broker, who may then attempt to sell the `NFToken` on for a larger amount, without the broker having to own the `NFToken` or custody funds.

If both offers are for the same asset, it is possible that the order in which funds are transferred might cause a transaction that would succeed to fail due to a lack of funds. To ensure deterministic transaction execution and maximize the chances of successful execution, the account attempting to buy the `NFToken` is debited first. Funds due to the broker are credited _before_ crediting the seller.

In brokered mode, the offers referenced by `NFTokenBuyOffer` and `NFTokenSellOffer` must both specify the same `NFTokenID`; that is, both must be for the same `NFToken`.

## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code                         | Description                             |
|:-----------------------------------|:----------------------------------------|
| `temDISABLED`                      | The [NonFungibleTokensV1 amendment][] is not enabled. |
| `temMALFORMED`                     | The transaction was not validly formatted. For example, it specified neither `NFTokenSellOffer` nor `NFTokenBuyOffer`, or it specified a negative `NFTokenBrokerFee`. |
| `tecCANT_ACCEPT_OWN_NFTOKEN_OFFER` | The buyer and seller are the same account. |
| `tecEXPIRED`                       | An offer specified in the transaction has already expired. |
| `tecINSUFFICIENT_FUNDS`            | The buyer does not have the full amount they are offering. If the buy amount is specified in XRP, this could be because of the [reserve requirement](../../../../concepts/accounts/reserves.md). If the buy amount is a token, it could be because the token is [frozen](../../../../concepts/tokens/fungible-tokens/freezes.md). |
| `tecINSUFFICIENT_PAYMENT`          | In brokered mode, the buy amount offered is not high enough to pay the `BrokerFee` _and_ the sell cost of the `NFToken`. |
| `tecOBJECT_NOT_FOUND`              | One of the offers specified in the transaction does not exist in the ledger. |
| `tecNFTOKEN_BUY_SELL_MISMATCH`     | In brokered mode, the two offers are not a valid match. For example, the seller is asking more than the buyer is offering, the buy and sell offer are denominated in different assets, or the seller specified a destination that is not the buyer or the broker. |
| `tecNFTOKEN_OFFER_TYPE_MISMATCH`   | The object identified by the `NFTokenBuyOffer` is not actually a buy offer, or the object identified by the `NFTokenSellOffer` is not actually a sell offer. |
| `tecNO_PERMISSION`                 | The seller does not own the `NFToken` being sold; or the matching offer specifies a different `Destination` account than the account accepting the offer. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
