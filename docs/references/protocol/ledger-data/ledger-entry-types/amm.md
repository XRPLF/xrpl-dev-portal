---
seo:
    description: The definition and details of an Automated Market Maker (AMM) instance.
labels:
  - AMM
---
# AMM
[[Source]](https://github.com/XRPLF/rippled/blob/f64cf9187affd69650907d0d92e097eb29693945/include/xrpl/protocol/detail/ledger_entries.macro#L369-L380 "Source")

An `AMM` ledger entry describes a single [Automated Market Maker](../../../../concepts/tokens/decentralized-exchange/automated-market-makers.md) (AMM) instance. This is always paired with a [special AccountRoot entry](accountroot.md#special-amm-accountroot-entries). You can create an AMM by sending an [AMMCreate transaction][].

{% amendment-disclaimer name="AMM" /%}


## Example AMM JSON

```json
{
    "Account": "rBp3UDRuEteeJqp4rEk5kxMe7BGWNYrF9A",
    "Asset": {
      "currency": "XRP"
    },
    "Asset2": {
      "currency": "NEX",
      "issuer": "rQGiPFWhaTDdue1xHX7cVpxGqPQK54zng1"
    },
    "AuctionSlot": {
      "Account": "r3ZGQZw1NCbBp5AEGkMDE9NgNpzw91aofD",
      "Expiration": 778576560,
      "Price": {
        "currency": "03DC324562A8915B7C65E9D31B93D62D02BC491C",
        "issuer": "rBp3UDRuEteeJqp4rEk5kxMe7BGWNYrF9A",
        "value": "0"
      }
    },
    "Flags": 0,
    "LPTokenBalance": {
      "currency": "03DC324562A8915B7C65E9D31B93D62D02BC491C",
      "issuer": "rBp3UDRuEteeJqp4rEk5kxMe7BGWNYrF9A",
      "value": "5509581.299648495"
    },
    "LedgerEntryType": "AMM",
    "OwnerNode": "0",
    "PreviousTxnID": "9E8E9B8FD27391C818525BFF6A29452F7A9888F31622BEF6FC36064D05CF6436",
    "PreviousTxnLgrSeq": 91448830,
    "TradingFee": 1,
    "VoteSlots": [
      {
        "VoteEntry": {
          "Account": "r3ZGQZw1NCbBp5AEGkMDE9NgNpzw91aofD",
          "TradingFee": 1,
          "VoteWeight": 100000
        }
      }
    ],
    "index": "F490627BACE2D0AA744514A640B4999D50E495DD1677550D8B10E2D20FBB15C3"
}
```

## AMM Fields

In addition to the [common fields](../common-fields.md), {% code-page-name /%} entries have the following fields:

| Field            | JSON Type           | [Internal Type][] | Required? | Description  |
|:-----------------|:--------------------|:------------------|:----------|--------------|
| `Asset`          | Object              | Issue             | Yes       | The definition for one of the two assets this AMM holds. In JSON, this is an object with `currency` and `issuer` fields. |
| `Asset2`         | Object              | Issue             | Yes       | The definition for the other asset this AMM holds. In JSON, this is an object with `currency` and `issuer` fields. |
| `Account`        | String - [Address][] | AccountID        | Yes       | The address of the [special account](accountroot.md#special-amm-accountroot-entries) that holds this AMM's assets. |
| `AuctionSlot`    | Object              | Object            | No        | Details of the current owner of the auction slot, as an [Auction Slot object](#auction-slot-object). |
| `LPTokenBalance` | [Currency Amount][] | Amount            | Yes       | The total outstanding balance of liquidity provider tokens from this AMM instance. The holders of these tokens can vote on the AMM's trading fee in proportion to their holdings, or redeem the tokens for a share of the AMM's assets which grows with the trading fees collected. |
| `PreviousTxnID`  | String - [Hash][]   | UInt256           | No        | The identifying hash of the transaction that most recently modified this entry. {% amendment-disclaimer name="fixPreviousTxnID" /%} |
| `PreviousTxnLgrSeq` | Number           | UInt32            | No        | The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this entry. {% amendment-disclaimer name="fixPreviousTxnID" /%} |
| `TradingFee`     | Number              | UInt16            | Yes       | The percentage fee to be charged for trades against this AMM instance, in units of 1/100,000. The maximum value is 1000, for a 1% fee. |
| `VoteSlots`      | Array               | Array             | No        | A list of vote objects, representing votes on the pool's trading fee. |


### Auction Slot Object

The `AuctionSlot` field contains an object with the following nested fields:

| Field           | JSON Type           | [Internal Type][] | Required? | Description |
|:----------------|:--------------------|:------------------|:----------|:--|
| `Account`       | String - Address    | AccountID         | Yes       | The current owner of this auction slot. |
| `AuthAccounts`  | Array               | Array           | No        | A list of at most 4 additional accounts that are authorized to trade at the discounted fee for this AMM instance. |
| `DiscountedFee` | String              | UInt32            | Yes       | The trading fee to be charged to the auction owner, in the same format as `TradingFee`. Normally, this is 1/10 of the normal fee for this AMM. |
| `Price`         | [Currency Amount][] | Amount            | Yes       | The amount the auction owner paid to win this slot, in LP Tokens. |
| `Expiration`    | String              | UInt32            | Yes       | The time when this slot expires, in [seconds since the Ripple Epoch][]. |

## VoteEntry Object

The `VoteSlots` field contains an array of `VoteEntry` objects with the following fields:

| Field            | JSON Type           | [Internal Type][] | Required? | Description  |
|:-----------------|:--------------------|:------------------|:----------|--------------|
| `Account`        | String - Address    | AccountID         | Yes       | The account that cast the vote. |
| `TradingFee`     | Number              | UInt16            | Yes       | The proposed trading fee, in units of 1/100,000; a value of 1 is equivalent to 0.001%. The maximum value is 1000, indicating a 1% fee. |
| `VoteWeight`     | Number              | UInt32            | Yes       | The weight of the vote, in units of 1/100,000. For example, a value of 1234 means this vote counts as 1.234% of the weighted total vote. The weight is determined by the percentage of this AMM's LP Tokens the account owns. The maximum value is 100000. |


## {% $frontmatter.seo.title %} Reserve

{% code-page-name /%} entries do not require a reserve.


## {% $frontmatter.seo.title %} Flags

There are no flags defined for {% code-page-name /%} entries.


## AMM ID Format

The ID of an `AMM` entry is the [SHA-512Half][] of the following values, concatenated in order:

1. The `AMM` space key (`0x0041`)
0. The AccountID of the first asset's issuer.
0. The 160-bit currency code of the first token.
0. The AccountID of the second asset's issuer.
0. The 160-bit currency code of the second token.

For XRP, use all 0's for both the token and the issuer.

## See Also

- **Transactions:**
  - [AMMBid transaction][]
  - [AMMClawback transaction][]
  - [AMMCreate transaction][]
  - [AMMDelete transaction][]
  - [AMMDeposit transaction][]
  - [AMMVote transaction][]
  - [AMMWithdraw transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
