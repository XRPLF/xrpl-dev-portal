---
seo:
    description: Create a new Automated Market Maker for trading a given pair of assets.
labels:
    - AMM
---
# AMMCreate
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/AMMCreate.cpp "Source")

Create a new [Automated Market Maker](../../../../concepts/tokens/decentralized-exchange/automated-market-makers.md) (AMM) instance for trading a pair of assets ([fungible tokens](../../../../concepts/tokens/index.md) or [XRP](../../../../introduction/what-is-xrp.md)).

Creates both an [AMM entry][] and a [special AccountRoot entry](../../ledger-data/ledger-entry-types/accountroot.md#special-amm-accountroot-entries) to represent the AMM. Also transfers ownership of the starting balance of both assets from the sender to the created `AccountRoot` and issues an initial balance of liquidity provider tokens (LP Tokens) from the AMM account to the sender.

{% admonition type="warning" name="Caution" %}When you create the AMM, you should fund it with (approximately) equal-value amounts of each asset. Otherwise, other users can profit at your expense by trading with this AMM ([performing arbitrage](https://www.machow.ski/posts/an_introduction_to_automated_market_makers/#price-arbitrage)). The currency risk that liquidity providers take on increases with the volatility (potential for imbalance) of the asset pair. The higher the trading fee, the more it offsets this risk, so it's best to set the trading fee based on the volatility of the asset pair.{% /admonition %}

{% amendment-disclaimer name="AMM" /%}

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "Account": "r3qNwezAqKp2FRFteiFjhC4V1at4KePFx7",
  "Amount": {
    "currency": "SKY",
    "issuer": "rSKYachd4cqUgztsTr83mEKTAcNZG4Ez2",
    "value": "80"
  },
  "Amount2": "20000000",
  "Fee": "200000",
  "Flags": 2147483648,
  "LastLedgerSequence": 99502897,
  "Memos": [
    {
      "Memo": {
        "MemoData": "414D4D2063726561746520696E69746961746564207669612058506D61726B65742E636F6D"
      }
    }
  ],
  "Sequence": 94041760,
  "SourceTag": 20221212,
  "TradingFee": 1000,
  "TransactionType": "AMMCreate",
}
```

{% tx-example txid="E4CC45E28421618FFEB1920B8FE152EAAB70489BD9AD52FEF24D58389C011C5E" /%}

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field        | JSON Type           | [Internal Type][] | Required? | Description |
|:-------------|:--------------------|:------------------|:----------|:------------|
| `Amount`     | [Currency Amount][] | Amount            | Yes       | The first of the two assets to fund this AMM with. This must be a positive amount. |
| `Amount2`    | [Currency Amount][] | Amount            | Yes       | The second of the two assets to fund this AMM with. This must be a positive amount. |
| `TradingFee` | Number              | UInt16            | Yes       | The fee to charge for trades against this AMM instance, in units of 1/100,000; a value of 1 is equivalent to 0.001%. The maximum value is `1000`, indicating a 1% fee. The minimum value is `0`. |

One or both of `Amount` and `Amount2` can be [tokens](../../../../concepts/tokens/index.md); at most one of them can be [XRP](../../../../introduction/what-is-xrp.md). They cannot both have the same currency code and issuer. The tokens' issuers must have [Default Ripple](../../../../concepts/tokens/fungible-tokens/rippling.md#the-default-ripple-flag) enabled. The assets _cannot_ be LP tokens for another AMM.

## Special Transaction Cost

Since each AMM instance involves an AccountRoot ledger entry, an AMM ledger entry, and a trust line for each token in its pool, an AMMCreate transaction requires a much higher than usual [transaction cost][] to deter ledger spam. Instead of the standard minimum of 0.00001 XRP, AMMCreate must destroy at least the incremental owner reserve amount, currently {% $env.PUBLIC_OWNER_RESERVE %}. This is the same special transaction cost as [AccountDelete transactions][].

## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code          | Description                                  |
|:--------------------|:---------------------------------------------|
| `tecAMM_INVALID_TOKENS` | Either `Amount` or `Amount2` has a currency code that is the same as this AMM's LP Tokens would use. (This is very unlikely to occur.) |
| `tecDUPLICATE`      | There is already another AMM for this currency pair. |
| `tecFROZEN`         | At least one of the deposit assets (`Amount` or `Amount2`) is currently [frozen](../../../../concepts/tokens/fungible-tokens/freezes.md). |
| `tecINSUF_RESERVE_LINE` | The sender of this transaction does meet the increased [reserve requirement](../../../../concepts/accounts/reserves.md) of processing this transaction, probably because they need a new trust line to hold the LP Tokens, and they don't have enough XRP to meet the additional owner reserve for a new trust line. |
| `tecNO_AUTH`        | At least one of the deposit assets uses [authorized trust lines](../../../../concepts/tokens/fungible-tokens/authorized-trust-lines.md) and the sender does not have authorization to hold that asset. |
| `tecNO_LINE`        | The sender does not have a trust line for at least one of the deposit assets. |
| `tecNO_PERMISSION`  | At least one of the deposit assets cannot be used in an AMM. |
| `tecUNFUNDED_AMM`   | The sender does not hold enough of the assets specified in `Amount` and `Amount2` to fund the AMM. |
| `terNO_RIPPLE`      | The issuer of at least one of the assets has not enabled the [Default Ripple flag](../../../../concepts/tokens/fungible-tokens/rippling.md#the-default-ripple-flag). |
| `temAMM_BAD_TOKENS` | The values of `Amount` and `Amount2` are not valid: for example, both refer to the same token. |
| `temBAD_FEE`        | The `TradingFee` value is invalid. It must be zero or a positive integer and cannot be over 1000. |
| `temDISABLED`       | The AMM feature is not enabled on this network. |

## See Also

- [AMM entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
