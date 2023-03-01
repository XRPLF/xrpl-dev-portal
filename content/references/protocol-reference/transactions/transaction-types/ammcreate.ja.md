---
html: ammcreate.html
parent: transaction-types.html
blurb: 指定された資産ペアを取引するための新しい自動マーケットメーカーを作成します。
labels:
  - AMM
status: not_enabled
---
# AMMCreate
[[Source]](https://github.com/gregtatcam/rippled/blob/amm-core-functionality/src/ripple/app/tx/impl/AMMCreate.cpp "Source")
<!-- TODO: Update source link to merged version when available -->

{% include '_snippets/amm-disclaimer.ja.md' %}

資産（[代替可能トークン](tokens.html)または[XRP](xrp.html)）のペアを取引するための新しい[自動マーケットメーカー](automated-market-makers.html)(AMM)インスタンスを作成します。

AMMを表す[AMMオブジェクト][]と[特殊なAccountRootオブジェクト](accountroot.html#ammの特殊なaccountrootオブジェクト)を作成します。また、両資産の開始残高の所有権を送信者から、作成された`AccountRoot`に移し、初期残高の流動性プロバイダトークン（LPトークン）をAMMアカウントから送信者に発行します。

**注意:** AMMを作成する際には、各資産を（ほぼ）同額ずつ投入する必要があります。そうしないと、他のユーザーがあなたの負担において、このAMMを使った取引で利益を得ることができます（[アービトラージの実行](https://www.machow.ski/posts/an_introduction_to_automated_market_makers/#price-arbitrage))。流動性供給者が負う通貨リスクは、資産ペアのボラティリティ（不均衡の可能性）が高ければ高いほど、大きくなります。取引手数料が高いほど、このリスクを相殺することになりますので、資産ペアのボラティリティに応じて取引手数料を設定するとよいでしょう。

## {{currentpage.name}} JSONの例

```json
{
    "Account" : "rJVUeRqDFNs2xqA7ncVE6ZoAhPUoaJJSQm",
    "Amount" : {
        "currency" : "TST",
        "issuer" : "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd",
        "value" : "25"
    },
    "Amount2" : "250000000",
    "Fee" : "10",
    "Flags" : 2147483648,
    "Sequence" : 6,
    "TradingFee" : 500,
    "TransactionType" : "AMMCreate"
}
```

{% include '_snippets/tx-fields-intro.md' %}
<!--{# fix md highlighting_ #}-->

| フィールド     | JSONの型  | [内部の型][] | 必須? | 説明 |
|:-------------|:---- -----|:-----------|:------|:------------|
| `Amount`     | [通貨額][] | Amount     | はい   | このAMMの最初の資金となる2つの資産のうち、1つ目の資産です。これは正数である必要があります。 |
| `Amount2`    | [通貨額][] | Amount     | はい   | このAMMの最初の資金となる2つの資産のうち、2つ目の資産です。これは正数である必要があります。 |
| `TradingFee` | 数値       | UInt16     | はい  | このAMMインスタンスに対する取引に課される手数料を1/100,000単位で指定します（値1は0.001%に相当）。最大値は`1000`で、1%の手数料を意味します。最小値は `0`です。 |

`Amount`と`Amount2`の一方または両方は[tokens](tokens.html)であり、最大でどちらか一方を[XRP](xrp.html)にすることが可能です。通貨コードと発行者が同じものは使用できません。AMMのLPトークンは、別のAMMの資産の1つとして使用することができます。

## エラーケース

すべてのトランザクションで発生する可能性のあるエラーに加えて、{{currentpage.name}}トランザクションでは、次の[トランザクション結果コード](transaction-results.html)が発生する可能性があります。

| エラーコード          | 説明                                          |
|:--------------------|:---------------------------------------------|
| `temDISABLED`       | このネットワークでは、AMM機能 :not_enabled: は有効ではありません。 |
| `temINVALID_FLAG`   | トランザクションに無効な`Flags`値が指定されています。現在、このトランザクションタイプに定義されたフラグはないので、[グローバルフラグ](transaction-common-fields.html#グローバルフラグ)のみが許可されます。 |
| `temBAD_AMM_TOKENS` | `Amount`と`Amount2`値が正しくありません。例えば、両方とも同じトークンを参照している場合です。 |
| `temBAD_FEE`        | `TradingFee`の値が不正です。ゼロまたは正の整数でなければならず、1000を超えることはできません。 |
| `terNO_ACCOUNT`     | リクエストで参照されたいずれかのアカウントが存在しません。|
| `tecNO_AUTH`        | 送信者は資産（`Amount`または`Amount2`）のいずれかを保有する権限がありません。 |
| `tecNO_LINE`        | 送信者は資産（`Amount`または`Amount2`）のうちいずれか1つに対するトラストラインを保有していません。 |
| `tecFROZEN`         | 資産（`Amount`または`Amount2`）の少なくとも1つが現在[凍結](freezes.html)されています。 |
| `tecUNFUNDED_AMM`   | 送信者は`Amount`と`Amount2`で指定された金額をAMMに入金するための十分な資金を保有していません。 |
| `tecAMM_EXISTS`     | この通貨ペアを扱っているAMMが既に存在しています。 |

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
