---
html: amm.html
parent: ledger-entry-types.html
seo:
    description: 自動マーケットメーカー（AMM）インスタンスの定義と詳細。
labels:
  - AMM
---
# AMM
[[ソース]](https://github.com/xrplf/rippled/blob/c1e4bfb08bcc9f187d794a71d653003a6148dc68/src/ripple/protocol/impl/LedgerFormats.cpp#L265-L275 "Source")

_([AMM amendment][])_

`AMM`レジャーエントリは、単一の[自動マーケットメーカー](../../../../concepts/tokens/decentralized-exchange/automated-market-makers.md)(AMM)インスタンスを表します。これは常に[特殊なAccountRootエントリ](accountroot.md#ammの特殊なaccountrootエントリ)と対になっています。


## AMMのJSONの例

```json
{
    "Account" : "rE54zDvgnghAoPopCgvtiqWNq3dU5y836S",
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
      "DiscountedFee" : 60,
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

## AMMのフィールド

[共通フィールド][]に加えて、{% $frontmatter.seo.title %}エントリは以下のフィールドを使用します。

| フィールド        | JSONの型             | [内部の型][]       | 必須?      | 説明         |
|:-----------------|:--------------------|:------------------|:----------|--------------|
| `Asset`          | オブジェクト          | STIssue           | はい       | このAMMが保有する2つのアセットのうちの1つの定義。JSONでは、`currency`と`issuer`フィールドを持つオブジェクトになります。 |
| `Asset2`         | オブジェクト          | STIssue           | はい       | このAMMが保有するもう一つの資産の定義。JSONでは、`currency`と`issuer`フィールドを持つオブジェクトになります。 |
| `Account`     | 文字列               | AccountID         | はい       | このAMMの資産を保有する[特殊なアカウント](accountroot.md#ammの特殊なaccountrootエントリ)のアドレス。 |
| `AuctionSlot`    | オブジェクト          | STObject          | いいえ     | オークションスロットの現在の所有者の詳細。[オークションスロットオブジェクト](#オークションスロットオブジェクト)形式です。|
| `LPTokenBalance` | [通貨額][]           | Amount            | はい       | AMMインスタンスの流動性供給者トークンの発行残高の合計。このトークンの保有者は、保有量に比例してAMMの取引手数料に投票したり、取引手数料の徴収とともに増えていくAMMの資産の一部とトークンを交換したりすることができます。 |
| `TradingFee`     | 数値                 | UInt16            | はい       | AMMインスタンスに対する取引に課される手数料のパーセンテージを1/100,000の単位で指定します。最大値は1000で、これは1%の手数料となります。 |
| `VoteSlots`      | 配列                 | STArray           | いいえ     | プールの取引手数料に関する投票を表す、投票オブジェクトのリスト。|

### AuctionSlotオブジェクト

`AuctionSlot`フィールドは、以下のネストしたフィールドを持つオブジェクトを含んでいます。

| フィールド        | JSONの型             | [内部の型][]       | 必須?      | 説明 |
|:----------------|:--------------------|:------------------|:----------|:--|
| `Account`       | 文字列 - アドレス     | AccountID         | はい       | このオークションスロットの現在の所有者。 |
| `AuthAccounts`  | 配列                 | STArray           | いいえ     | AMMインスタンスに対して取引手数料を割引した価格で取引することを許可された、最大4つの追加アカウントのリスト。 |
| `DiscountedFee` | 文字列               | UInt32            | はい       | オークションスロットの所有者に請求される取引手数料で、`TradingFee`と同じフォーマットです。これは通常の取引手数料の1/10です。 |
| `Price`         | [通貨額][]           | Amount            | はい       | オークションスロットの所有者がこのスロットを落札するために支払った金額（LPトークン）。 |
| `Expiration`    | 文字列               | UInt32            | はい       | このスロットの有効期限が切れる[Rippleエポック以降の経過秒数][]で指定した時刻。 |

## VoteEntryオブジェクト

`VoteSlots`フィールドには、以下のフィールドを持つ`VoteEntry`オブジェクトの配列が格納されます。

| フィールド         | JSONの型        | [内部の型][] | 必須? | 説明  |
|:-----------------|:----------------|:-----------|:------|------|
| `Account`        | 文字列 - アドレス | AccountID  | はい  | 投票を行ったアカウント |
| `TradingFee`     | 数値            | UInt16     | はい  | 提案されている取引手数料。単位は1/100,000で、1の値は0.001%に相当します。最大値は1000で、1%の手数料を示します。 |
| `VoteWeight`     | 数値            | UInt32     | はい  | 投票の重みを1/100,000単位で表します。例えば、値が1234の場合、この投票は重み付けされた総投票数の1.234%としてカウントされます。重み付けは、そのアカウントが所有するこのAMMのLPトークンの割合によって決まります。最大値は100000です。 |


## {% $frontmatter.seo.title %}の準備金

{% code-page-name /%}エントリは準備金が不要です。

## {% $frontmatter.seo.title %}のフラグ

{% code-page-name /%}エントリに定義されているフラグはありません。

## AMM IDのフォーマット

`AMM`エントリのIDは、以下の値を順に繋げた[SHA-512Half][]です。

1. `AMM`のスペースキー(`0x0041`)
2. 第1アセットの発行者のAccountID。
3. 第1トークンの160ビットの通貨コード。
4. 第2アセットの発行者のAccountID。
5. 第2トークンの160ビットの通貨コード。

XRPの場合、トークン・発行者ともに全て0を使用します。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
