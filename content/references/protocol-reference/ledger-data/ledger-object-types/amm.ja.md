---
html: amm.html
parent: ledger-object-types.html
blurb: 自動マーケットメーカー（AMM）インスタンスの定義と詳細。
labels:
  - AMM
status: not_enabled
---
# AMM
[[Source]](https://github.com/xrplf/rippled/blob/c1e4bfb08bcc9f187d794a71d653003a6148dc68/src/ripple/protocol/impl/LedgerFormats.cpp#L265-L275 "Source")
<!-- TODO: Update source link to merged version when available -->

{% include '_snippets/amm-disclaimer.ja.md' %}

`AMM`オブジェクトは、単一の[自動マーケットメーカー](automated-market-makers.html)(AMM)インスタンスを表します。


## AMM JSONの例

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

## AMM フィールド

`AMM`オブジェクトは以下のフィールドを持ちます。

| フィールド        | JSONの型             | [内部の型][]       | 必須?      | 説明         |
|:-----------------|:--------------------|:------------------|:----------|--------------|
| `Asset`          | オブジェクト          | STIssue           | はい       | このAMMが保有する2つのアセットのうちの1つの定義。JSONでは、`currency`と`issuer`フィールドを持つオブジェクトになります。 |
| `Asset2`         | オブジェクト          | STIssue           | はい       | このAMMが保有するもう一つの資産の定義。JSONでは、`currency`と`issuer`フィールドを持つオブジェクトになります。 |
| `AMMAccount`     | 文字列               | AccountID         | はい       | このAMMの資産を保有する[特殊なアカウント](accountroot.html#ammの特殊なaccountrootオブジェクト)のアドレス。 |
| `AuctionSlot`    | オブジェクト          | STObject          | いいえ     | オークションスロットの現在の所有者の詳細。[オークションスロットオブジェクト](#オークションスロットオブジェクト)形式です。|
| `LPTokenBalance` | [通貨額][]           | Amount            | はい       | AMMインスタンスの流動性供給者トークンの発行残高の合計。このトークンの保有者は、保有量に比例してAMMの取引手数料に投票したり、取引手数料の徴収とともに増えていくAMMの資産の一部とトークンを交換したりすることができます。 |
| `TradingFee`     | 数値                 | UInt16            | はい       | AMMインスタンスに対する取引に課される手数料のパーセンテージを1/100,000の単位で指定します。最大値は1000で、これは1%の手数料となります。 |
| `VoteSlots`      | 配列                 | STArray           | いいえ     | プールの取引手数料に関する投票を表す、投票オブジェクトのリスト。|

### オークションスロットオブジェクト

`AuctionSlot`フィールドは、以下のネストしたフィールドを持つオブジェクトを含んでいます。

| フィールド        | JSONの型             | [内部の型][]       | 必須?      | 説明         |
|:----------------|:--------------------|:------------------|:----------|:--|
| `Account`       | 文字列 - アドレス     | AccountID         | はい       | このオークションスロットの現在の所有者。 |
| `AuthAccounts`  | 配列                 | STArray           | いいえ     | AMMインスタンスに対して取引手数料を割引した価格で取引することを許可された、最大4つの追加アカウントのリスト。 |
| `DiscountedFee` | 文字列               | UInt32            | はい       | オークションの所有者に請求される取引手数料で、`TradingFee`と同じフォーマットです。デフォルトでは0で、オークションスロットの所有者はAMMの標準的な手数料の代わりに、手数料なしで取引できることを意味します。 |
| `Price`         | [通貨額][]           | Amount            | はい       | オークションスロットの所有者がこのスロットを落札するために支払った金額（LPトークン）。 |
| `Expiration`    | 文字列               | UInt32            | はい       | このスロットの有効期限が切れる[Rippleエポック以降の経過秒数][]で指定した時刻。 |

## AMM フラグ

現在、`AMM`オブジェクトに定義されているフラグはありません。

## AMM ID フォーマット

`AMM`オブジェクトのIIは、以下の値の[SHA-512Half][]を順に繋げたものです。

1. `AMM`のスペースキー(`0x0041`)
0. 第1アセットの発行者のAccountID。
0. 第1トークンの160ビットの通貨コード。
0. 第2アセットの発行者のAccountID。
0. 第2トークンの160ビットの通貨コード。

XRPの場合、トークン・発行者ともに全て0を使用します。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
