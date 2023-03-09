---
html: ammbid.html
parent: transaction-types.html
blurb: 自動マーケットメーカーのオークションスロットに入札することで、手数料の割引を受けることができます。
labels:
  - AMM
status: not_enabled
---
# AMMBid
[[Source]](https://github.com/gregtatcam/rippled/blob/amm-core-functionality/src/ripple/app/tx/impl/AMMBid.cpp "Source")
<!-- TODO: Update source link to merged version when available -->

{% include '_snippets/amm-disclaimer.ja.md' %}

[自動マーケットメーカー](automated-market-makers.html)のオークションスロットに入札することができます。落札されると、競り落とされるか24時間が経過するまで、割引料金でAMMと取引することができます。24時間が経過する前に競り落とされた場合、残り時間に応じて落札価格の一部が払い戻されます。

AMMのLPトークンを使って落札すると、落札額はAMMに返金され、LPトークンの残高が減ります。


## {{currentpage.name}} JSONの例

```json
{
    "Account" : "rJVUeRqDFNs2xqA7ncVE6ZoAhPUoaJJSQm",
    "Asset" : {
        "currency" : "XRP"
    },
    "Asset2" : {
        "currency" : "TST",
        "issuer" : "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"
    },
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
    "BidMax" : {
        "currency" : "039C99CD9AB0B70B32ECDA51EAAE471625608EA2",
        "issuer" : "rE54zDvgnghAoPopCgvtiqWNq3dU5y836S",
        "value" : "100"
    },
    "Fee" : "10",
    "Flags" : 2147483648,
    "Sequence" : 9,
    "TransactionType" : "AMMBid"
}
```

{% include '_snippets/tx-fields-intro.ja.md' %}

| フィールド       | JSONの型    | [内部の型][] | 必須?  | 説明 |
|:---------------|:-----------|:- ----------|:----- |:------------|
| `Asset`        | オブジェクト | STIssue      | はい  | AMMのプールにある資産の一つを定義します。JSONでは、`currency`と`issuer`フィールドを持つオブジェクトになります（XRPの場合は`issuer`を省略します）。 |
| `Asset2`       | オブジェクト | STIssue      | はい  | AMM のプールにあるもう一つのアセットの定義です。JSONでは、`currency`と`issuer`フィールドを持つオブジェクトになります（XRPの場合は`issuer`を省略します）。 |
| `BidMin`       | [通貨額][]  | Amount       | いいえ | スロットに支払う最小の金額。この値を高く設定すると、他の人から競り落とされにくくなります。省略された場合は、落札に必要な最低額を支払います。 |
| `BidMax`       | [通貨額][]  | Amount       | いいえ | スロットに支払う最大の金額。落札するためのコストがこの金額より高い場合、取引は失敗します。省略された場合は、落札に必要な金額を支払います。 |
| `AuthAccounts` | 配列        | STArray     | いいえ  | 割引料金で取引を許可する最大4つの追加のアカウントのリスト。これには、トランザクション送信者のアドレスは含めることはできません。これらのオブジェクトはそれぞれ[Auth Accountオブジェクト](#auth-accountオブジェクト)である必要があります。. |

`BidMin` と `BidMax` の両方を指定することはできません。

### Auth Accountオブジェクト

`AuthAccounts` 配列の各メンバーは、以下のフィールドを持つオブジェクトである必要があります。

| フィールド       | JSONの型   | [内部の型][] | 必須? | 説明 |
|:---------------|:----------|:-------------|:-----|:------------|
| `Account`      | 文字列     | AccountID    | はい | 認可するアカウントのアドレス。 |

配列に現れる他の「内部オブジェクト」と同様に、これらのオブジェクトのJSON表現は、オブジェクトタイプ`AuthAccount`のみをキーとするオブジェクトにラップされています。

## オークションスロットの価格

落札された場合、トランザクションは自動的に前のスロット所有者を競り落とし、送信者のLPトークンから落札価格が引き落とされます。落札価格は、72分ずつ20回に区切られた時間経過とともに減少します。もし送信者が落札するのに十分なLPトークンを持っていなかったり、入札価格がトランザクションの`BidMax`値より高い場合、トランザクションは`tecAMM_FAILED_BID`という結果で失敗します。

- オークションスロットが現在空であったり、期限切れ、または最後のインターバルである場合、**最低入札価格**はAMMの総LPトークン残高の**0.001%**です。

    **注意:** この最小値は暫定値であり、AMM機能が最終的に完成する前に変更される可能性があります。

- それ以外の場合、現在の保有者に競り勝つための価格は、以下の式で計算されます。

        P = B × 1.05 × (1 - t⁶⁰) + M

    - `P`: 競り落とすための価格。単位はLPトークン。
    - `B`: 現在の入札価格。単位はLPトークン。
    - `t`: 現在の24時間枠で経過した時間の割合。0.05の倍数に切り捨てられる。
    - `M`: M`は上記で定義された**最低入札価格**。

    競り落とすためのコストには、2つの特殊なケースがあります。誰かが落札してから**最初の時間枠**では、その人を競り落とすための価格は、最低入札価格+既存の入札価格の5%アップとなります。

        P = B × 1.05 + M

    スロットの**最後の時間枠**では、誰かを競り落とすためのコストは最低入札額のみです。

        P = M

**注記:** 台帳を作成する際に、ネットワーク上のすべてのサーバーが同じ結果になるように、時間の計測は前回の台帳の[正規の終了時刻](ledgers.html#ledger-close-times) に基づいており、これはおおよその目安の時間です。

## 払い戻し

アクティブなオークションスロットを競り落とした場合、AMMは以下の計算式で前ホルダーに価格の一部を払い戻します。

```text
R = B × (1 - t)
```

- `R`: は返金する金額。単位はLPトークン。
- `B`: 払い戻しの対象となる前回の入札の価格。単位はLPトークン。
- `t`: 現在の24時間枠で経過した時間の割合。0.05の倍数に切り捨てられる。

特殊なケースとして、オークションスロットの最終（20番目）区間では、払い戻し額は0となる。

**注記:** XRP Ledgerの時刻と同様に、トランザクション処理では _前回の_ 台帳の[正規の終了時刻](ledgers.html#ledger-close-times)を使用するため、実時間と最大で約10秒の差が生じる場合があります。


## エラーケース
すべてのトランザクションで発生する可能性のあるエラーに加えて、{{currentpage.name}}トランザクションでは、次の[トランザクション結果コード](transaction-results.html)が発生する可能性があります。

| エラーコード              | 説明                                          |
|:------------------------|:---------------------------------------------|
| `tecAMM_FAILED_BID`     | このトランザクションでは、送信者が必要な入札額を支払うために十分なLPトークンを保有していないか、落札価格がトランザクションで指定された`BidMax`値より高いため、落札できませんでした。 |
| `tecAMM_INVALID_TOKENS` | このトランザクションの送信者は、スロット価格に見合うだけのLPトークンを保有していません。 |
| `temBAD_AMM_TOKENS`     | 指定された`BidMin`または`BidMax`は、このAMMの正しいLPトークンとして指定されていません。 |
| `temBAD_AMM_OPTIONS`    | トランザクションが無効なオプションを指定しました。例えば、`AuthAccounts`のリストが長すぎるか、`BidMin`とBidMax` の両方を指定しています。 |
| `temDISABLED`           | このネットワークでは、AMM機能 :not_enabled: は有効ではありません。 |
| `terNO_ACCOUNT`         | このリクエストで指定されたアカウントのいずれかが存在しません。 |
| `terNO_AMM`             | このトランザクションの資産ペアの自動マーケットメーカーのインスタンスが存在しません。 |


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
