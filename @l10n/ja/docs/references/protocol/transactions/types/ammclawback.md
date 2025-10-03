---
seo:
    description: 自動マーケットメーカープールに発行済みトークンを預け入れた保有者から、トークンを回収する。
labels:
  - AMM
  - Tokens
---
# AMMClawback

[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/AMMClawback.cpp "ソース")

発行したトークンをAMMプールに預け入れた保有者からトークンを回収します。

Clawbackはデフォルトで無効です。Clawbackを使用するには、[AccountSetトランザクション][]を送信して、**Allow Trust Line Clawback**設定を有効にする必要があります。すでにトークンが発行済みである発行者はClawbackを有効にできません。**Allow Trust Line Clawback**を有効にするには、トラストライン、オファー、エスクロー、ペイメントチャネル、チェック、署名者リストを設定する前に、所有者ディレクトリを完全に空にする必要があります。Clawbackを有効にした後は、元に戻すことはできません。つまり発行者アカウントは、トラストラインの発行済みトークンを回収できる権利を永続的に得ます。


{% amendment-disclaimer name="AMMClawback" /%}


## {% $frontmatter.seo.title %} JSONの例

```json
{
  "TransactionType": "AMMClawback",
  "Account": "rPdYxU9dNkbzC5Y2h4jLbVJ3rMRrk7WVRL",
  "Holder": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
  "Asset": {
      "currency" : "FOO",
      "issuer" : "rPdYxU9dNkbzC5Y2h4jLbVJ3rMRrk7WVRL"
  },
  "Asset2" : {
      "currency" : "BAR",
      "issuer" : "rHtptZx1yHf6Yv43s1RWffM3XnEYv3XhRg"
  },
  "Amount": {
      "currency" : "FOO",
      "issuer" : "rPdYxU9dNkbzC5Y2h4jLbVJ3rMRrk7WVRL",
      "value" : "1000"
  }
}
```


{% raw-partial file="/@l10n/ja/docs/_snippets/tx-fields-intro.md" /%}


| フィールド | JSONの型              | [内部の型][] | 必須?  | 説明 |
|:-----------|:----------------------|:-------------|:-------|:------------------|
| `Account`  | 文字列 - [アドレス][] | AccountID    | はい   | 回収する資産の発行者。このトランザクションは、発行者のみが送信できます。 |
| `Asset`    | オブジェクト          | Issue        | はい   | AMMプールから回収したい資産を指定します。資産はXRP、トークン、またはMPT（[金額なしの指定][]を参照）です。`issuer`フィールドは`Account`と一致していなければなりません。 |
| `Asset2`   | オブジェクト          | Issue        | はい   | AMMのプール内のもう一方の資産を指定します。資産はXRP、トークン、またはMPT（[金額なしの指定][]を参照）です。 |
| `Amount`   | [通貨額][]            | Amount       | いいえ | AMMアカウントから回収する最大額を指定します。`currency`と`issuer`サブフィールドは`Asset`サブフィールドと一致していなければなりません。このフィールドが指定されていない場合、または`value`サブフィールドがAMMの保有者の利用可能なトークンを超えている場合、保有者のすべてのトークンが回収されます。 |
| `Holder`   | 文字列 - [アドレス][] | AccountID    | はい   | 回収する資産を保有しているアカウント。 |


## AMMClawbackのフラグ

| フラグ名          | Hex値        | 10進数値 | 説明 |
|-------------------|--------------|----------|-------------|
| `tfClawTwoAssets` | `0x00000001` | 1        | `Asset`の指定額を回収し、AMMプールの資産比率に基づいて`Asset2`の対応する額を回収します。両方の資産は`Account`フィールドの発行者によって発行されなければなりません。このフラグが有効でない場合、発行者は`Asset`の指定された額を回収しますが、`Asset2`の対応する比率は`Holder`に返されます。 |


## エラーのケース

すべてのトランザクションで発生する可能性のあるエラーに加えて、`AMMClawback`トランザクションは以下の[トランザクション結果コード](../transaction-results/index.md)をもたらすことがあります。

| エラーコード         | 説明 |
|:-------------------|:------------|
| `tecNO_PERMISSION` | `lsfAllowTrustlineClawback` フラグが有効になっていない状態で AMM からトークンを回収しようとした場合、または AMM で両方の資産を発行していない状態で `tfClawTwoAssets` フラグが有効になっている場合に発生します。また、`Asset` の発行者が `Account` と一致しない場合にも発生します。 |
| `tecAMM_BALANCE`   | `Holder`がAMMプールのLPトークンを保有していない場合に発生します。 |
| `temDISABLED`      | [AMMClawback amendment][]が有効になっていない場合に発生します。 |
| `temBAD_AMOUNT`    | `AMMClawback`トランザクションの`Amount`フィールドが0以下の場合、または`currency`と`issuer`サブフィールドが`Amount`と`Asset`の間で一致しない場合に発生します。 |
| `temINVALID_FLAG`  | `tfClawTwoAssets`以外のフラグを有効にしようとした場合に発生します。 |
| `temMALFORMED`     | `issuer`サブフィールドが`Asset`と`Account`の間で一致しない場合、`Account`が`Holder`と同じ場合、または`Asset`がXRPの場合に発生します。 |
| `terNO_AMM`        | `Asset`と`Asset2`で指定されたAMMプールが存在しない場合に発生します。 |

## 関連項目

- [AMMエントリ][]

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
