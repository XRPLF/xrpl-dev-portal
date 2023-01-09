---
html: amm.html
parent: ledger-object-types.html
blurb: The definition and details of an Automated Market Maker (AMM) instance.
labels:
  - AMM
status: not_enabled
---
# AMM
[[Source]](https://github.com/gregtatcam/rippled/blob/c1e4bfb08bcc9f187d794a71d653003a6148dc68/src/ripple/protocol/impl/LedgerFormats.cpp#L265-L275 "Source")
<!-- TODO: Update source link to merged version when available -->

{% include '_snippets/amm-disclaimer.md' %}

The `AMM` object type describes a single [Automated Market Maker](automated-market-makers.html) (AMM) instance.


## Example AMM JSON

```json
{
    "AMMAccount" : "rE54zDvgnghAoPopCgvtiqWNq3dU5y836S",
    "Asset" : {
      "currency" : "XRP"
    },
    "Asset2" : {
      "currency" : "TST",
      "issuer" : "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"
    },
    "AuctionSlot" : {
      "Account" : "rJVUeRqDFNs2xqA7ncVE6ZoAhPUoaJJSQm",
      "AuthAccounts" : [
          {
            "AuthAccount" : {
                "Account" : "rMKXGCbJ5d8LbrqthdG46q3f969MVK2Qeg"
            }
          },
          {
            "AuthAccount" : {
                "Account" : "rBepJuTLFJt3WmtLXYAxSjtBWAeQxVbncv"
            }
          }
      ],
      "DiscountedFee" : 0,
      "Expiration" : 721870180,
      "Price" : {
          "currency" : "039C99CD9AB0B70B32ECDA51EAAE471625608EA2",
          "issuer" : "rE54zDvgnghAoPopCgvtiqWNq3dU5y836S",
          "value" : "0.8696263565463045"
      }
    },
    "Flags" : 0,
    "LPTokenBalance" : {
      "currency" : "039C99CD9AB0B70B32ECDA51EAAE471625608EA2",
      "issuer" : "rE54zDvgnghAoPopCgvtiqWNq3dU5y836S",
      "value" : "71150.53584131501"
    },
    "TradingFee" : 600,
    "VoteSlots" : [
      {
          "VoteEntry" : {
            "Account" : "rJVUeRqDFNs2xqA7ncVE6ZoAhPUoaJJSQm",
            "TradingFee" : 600,
            "VoteWeight" : 100000
          }
      }
    ]
}
```

## AMM Fields

The `AMM` object has the following fields:

| Field            | JSON Type           | [Internal Type][] | Required? | Description  |
|:-----------------|:--------------------|:------------------|:----------|--------------|
| `Asset`          | Object              | STIssue           | Yes       | The definition for one of the two assets this AMM holds. In JSON, this is an object with `currency` and `issuer` fields. |
| `Asset2`         | Object              | STIssue           | Yes       | The definition for the other asset this AMM holds. In JSON, this is an object with `currency` and `issuer` fields. |
| `AMMAccount`     | String              | AccountID         | Yes       | The address of the [special account](accountroot.html#special-amm-accountroot-objects) that holds this AMM's assets. |
| `AuctionSlot`    | Object              | STObject          | No        | Details of the current owner of the auction slot, as an [Auction Slot object](#auction-slot-object). |
| `LPTokenBalance` | [Currency Amount][] | Amount            | Yes       | The total outstanding balance of liquidity provider tokens from this AMM instance. The holders of these tokens can vote on the AMM's trading fee in proportion to their holdings, or redeem the tokens for a share of the AMM's assets which grows with the trading fees collected. |
| `TradingFee`     | Number              | UInt16            | Yes       | The percentage fee to be charged for trades against this AMM instance, in units of 1/100,000. The maximum value is 1000, for a 1% fee. |
| `VoteSlots`      | Array               | STArray           | No        | A list of vote objects, representing votes on the pool's trading fee. |

### Auction Slot Object

The `AuctionSlot` field contains an object with the following nested fields:

| Field           | JSON Type           | [Internal Type][] | Required? | Description |
|:----------------|:--------------------|:------------------|:----------|:--|
| `Account`       | String - Address    | AccountID         | Yes       | The current owner of this auction slot. |
| `AuthAccounts`  | Array               | STArray           | No        | A list of at most 4 additional accounts that are authorized to trade at the discounted fee for this AMM instance. |
| `DiscountedFee` | String              | UInt32            | Yes       | The trading fee to be charged to the auction owner, in the same format as `TradingFee`. By default this is 0, meaning that the auction owner can trade at no fee instead of the standard fee for this AMM. |
| `Price`         | [Currency Amount][] | Amount            | Yes       | The amount the auction owner paid to win this slot, in LP Tokens. |
| `Expiration`    | String              | UInt32            | Yes       | The time when this slot expires, in [seconds since the Ripple Epoch][]. |

## AMM Flags

There are currently no flags defined for `AMM` objects.

## AMM ID Format

The ID of an `AMM` object is the [SHA-512Half][] of the following values, concatenated in order:

1. The `AMM` space key (`0x0041`)
0. The AccountID of the first asset's issuer.
0. The 160-bit currency code of the first token.
0. The AccountID of the second asset's issuer.
0. The 160-bit currency code of the second token.

For XRP, use all 0's for both the token and the issuer.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
