---
html: ammcreate.html
parent: transaction-types.html
seo:
    description: 指定された資産ペアを取引するための新しい自動マーケットメーカーを作成します。
labels:
  - AMM
---
# AMMCreate
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/AMMCreate.cpp "Source")

{% amendment-disclaimer name="AMM" /%}

資産（[代替可能トークン](../../../../concepts/tokens/index.md)または[XRP](../../../../introduction/what-is-xrp.md)）のペアを取引するための新しい[自動マーケットメーカー](../../../../concepts/tokens/decentralized-exchange/automated-market-makers.md)(AMM)インスタンスを作成します。

AMMを表す[AMMエントリ][]と[特殊なAccountRootエントリ](../../ledger-data/ledger-entry-types/accountroot.md#ammの特殊なaccountrootエントリ)を作成します。また、両資産の開始残高の所有権を送信者から、作成された`AccountRoot`に移し、初期残高の流動性プロバイダトークン（LPトークン）をAMMアカウントから送信者に発行します。

{% admonition type="warning" name="注意" %}AMMを作成する際には、各資産を（ほぼ）同額ずつ投入する必要があります。そうしないと、他のユーザがこのAMMを使った取引で利益を得ることができ、あなたがその損失を被ることとなります（[アービトラージの実行](https://www.machow.ski/posts/an_introduction_to_automated_market_makers/#price-arbitrage)。流動性プロバイダが負う通貨リスクは、資産ペアのボラティリティ（不均衡の可能性）が高ければ高いほど、大きくなります。取引手数料が高いほど、このリスクを相殺することになりますので、資産ペアのボラティリティに応じて取引手数料を設定するとよいでしょう。{% /admonition %}

## {% $frontmatter.seo.title %} JSONの例

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

{% raw-partial file="/@l10n/ja/docs/_snippets/tx-fields-intro.md" /%}

| フィールド     | JSONの型  | [内部の型][] | 必須? | 説明 |
|:-------------|:----------|:-----------|:------|:------------|
| `Amount`     | [通貨額][] | Amount     | はい   | このAMMの最初の資金となる2つの資産のうち、1つ目の資産です。これは正数である必要があります。 |
| `Amount2`    | [通貨額][] | Amount     | はい   | このAMMの最初の資金となる2つの資産のうち、2つ目の資産です。これは正数である必要があります。 |
| `TradingFee` | 数値       | UInt16     | はい  | このAMMインスタンスに対する取引に課される手数料を1/100,000単位で指定します（値1は0.001%に相当）。最大値は`1000`で、1%の手数料を意味します。最小値は `0`です。 |

`Amount`と`Amount2`の一方または両方は[トークン](../../../../concepts/tokens/index.md)であり、最大でどちらか一方を[XRP](../../../../introduction/what-is-xrp.md)にすることが可能です。通貨コードと発行者が同じものは使用できません。AMMのLPトークンは、別のAMMの資産の1つとして使用することができます。トークンの発行者は[Default Ripple](../../../../concepts/tokens/fungible-tokens/rippling.md#defaultrippleフラグ)を有効にしていなければなりません。AMMのLPトークンは、別のAMMの資産の一つとして使用することはできません。

## 特殊なトランザクションコスト

各AMMインスタンスはAccountRootレジャーエントリ、AMMレジャーエントリ、プール内の各トークンのトラストラインを含むため、AMMCreateトランザクションは台帳スパムを抑止するために通常よりもはるかに高い[トランザクションコスト][]を必要とします。標準的な最低0.00001XRPの代わりに、AMMCreateは少なくとも所有者準備金の増分(現在は2XRP)を破棄しなければなりません。これは[AccountDeleteトランザクション][]と同じ特別なトランザクションコストです。

## エラーケース

すべてのトランザクションで発生する可能性のあるエラーに加えて、{% $frontmatter.seo.title %}トランザクションでは、次の[トランザクション結果コード](../transaction-results/index.md)が発生する可能性があります。

| エラーコード        | 説明                                          |
|:--------------------|:---------------------------------------------|
| `tecAMM_INVALID_TOKENS` | `Amount`または`Amount2`が、このAMMのLPトークンと同じ通貨コードを使用しています。(これが起こることは稀です。) |
| `tecDUPLICATE`      | この通貨ペアを扱っているAMMが既に存在しています。 |
| `tecFROZEN`         | 資産(`Amount`または`Amount2`)の少なくとも1つが現在[フリーズ](../../../../concepts/tokens/fungible-tokens/freezes.md)されています。 |
| `tecINSUF_RESERVE_LINE` | 送信者は、このトランザクションを処理するための[準備金要件](../../../../concepts/accounts/reserves.md)を満たしていません。おそらく、LPトークンを保持するための新しいトラストラインが必要で、新しいトラストラインの所有者準備金を満たす十分なXRPを持っていないためです。 |
| `tecNO_AUTH`        | 送信者は資産(`Amount`または`Amount2`)のいずれかを保有する権限がありません。 |
| `tecNO_LINE`        | 送信者は資産(`Amount`または`Amount2`)のうちいずれか1つに対するトラストラインを保有していません。 |
| `tecNO_PERMISSION`  | 少なくとも1つの入金資産はAMMで使用できません。 |
| `tecUNFUNDED_AMM`   | 送信者は`Amount`と`Amount2`で指定された金額をAMMに入金するための十分な資金を保有していません。 |
| `terNO_RIPPLE`      | 少なくとも1つの資産の発行者が[Default Rippleフラグ](../../../../concepts/tokens/fungible-tokens/rippling.md#defaultrippleフラグ)を有効にしていません。 |
| `temAMM_BAD_TOKENS` | `Amount`と`Amount2`値が正しくありません。例えば、両方とも同じトークンを参照している場合です。 |
| `temBAD_FEE`        | `TradingFee`の値が不正です。ゼロまたは正の整数でなければならず、1000を超えることはできません。 |
| `temDISABLED`       | このネットワークでは、AMM機能が無効になっています。 |

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
