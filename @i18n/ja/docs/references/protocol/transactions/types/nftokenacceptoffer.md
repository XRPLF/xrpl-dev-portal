---
html: nftokenacceptoffer.html
parent: transaction-types.html
seo:
    description: NFTokenの購入または売却のオファーを受け入れる。
labels:
  - NFT, 非代替性トークン
---
# NFTokenAcceptOffer
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/impl/NFTokenAcceptOffer.cpp "ソース")

`NFTokenAcceptOffer`トランザクションは`NFToken`の購入または売却のオファーを受け入れるために使用されます。トランザクションは次のいずれかになります。

* 1つのオファーを受け入れます。これは _ダイレクト_ モードと呼ばれます。
* 2つの異なるオファー(`NFToken`の購入オファーと同じ`NFToken`に対するの売却オファー)をアトミックに受け入れます。これは _ブローカー_ モードと呼ばれます。

_([NonFungibleTokensV1_1 amendment][]により追加されました)_

## NFTokenAcceptOffer JSONの例

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

[トランザクションの例を確認 >](/resources/dev-tools/websocket-api-tool?server=wss%3A%2F%2Fs1.ripple.com%2F&req=%7B%22id%22%3A%22example_NFTokenAcceptOffer%22%2C%22command%22%3A%22tx%22%2C%22transaction%22%3A%22BEB64444C36D1072820BAED317BE2E6470AFDAD9D8FB2D16A15A4D46E5A71909%22%2C%22binary%22%3Afalse%7D)

## ブローカー vs. ダイレクト モード

トランザクションが動作するモードは、トランザクションの`NFTokenSellOffer`フィールドと`NFTokenBuyOffer`フィールドの存在によって決まります。

| `NFTokenSellOffer` | `NFTokenBuyOffer` | Mode     |
|:-------------------|:------------------|:---------|
| ✔️                  | ✔️                 | ブローカー |
| ✔️                  | X                 | ダイレクト |
| X                  | ✔️                 | ダイレクト |


もしこれらのフィールドがどちらも指定されていない場合、トランザクションは不正で、`tem`クラスのエラーを発生させます。

ブローカーモードの意味合いは、ダイレクト・モードのそれとは若干異なります。トランザクションを送信するアカウントはブローカーとして機能し、2つのオファーをまとめてマッチングさせますが、関係する`NFToken`の所有権を取得することはなく、トランザクションが成功すれば、販売者から購入者に直接転送されます。


## 実行内容

トランザクションが成功した場合

* 既存の`owner`の`NFTokenPage`からトークンが削除され、新しい`owner`の`NFTokenPage`に追加されます。
* `NFTokenOffer`で指定された通り、購入者から販売者に資金が移動します。対応する`NFToken`のオファーに`TransferFee`が指定されている場合、`issuer`は指定されたパーセンテージを受け取り、残りは`NFToken`の販売者に送られます。

以下の場合、トランザクションは[`tec`コード](../transaction-results/tec-codes.md)で失敗します。

- 購入者が既に`NFToken`を所有している。
- 販売者が現在`NFToken`の所有者でない。
- 取引のオファーの一方または両方の期限が失効している。
- 売却オファーが特定の宛先アカウントを指定しており、トランザクションの送信者がそのアカウントでない。
- トランザクションの送信者が購入または売却のオファーを所有している。


## フィールド

{% raw-partial file="/@i18n/ja/docs/_snippets/tx-fields-intro.md" /%}

| フィールド           | JSONの型            | [内部の型][]        | 説明          |
|:-------------------|:--------------------|:------------------|:--------------|
| `NFTokenSellOffer` | 文字列              | Hash256           | _(省略可)_ `NFToken`の売却を提案する`NFTokenOffer`の識別情報です。 |
| `NFTokenBuyOffer`  | 文字列              | Hash256           | _(省略可)_ `NFToken`の購入を提案する`NFTokenOffer`の識別情報です。 |
| `NFTokenBrokerFee` | [通貨額][] | Amount            | _(省略可)_ このフィールドはブローカーモードでのみ有効であり、2つのオファーをまとめるための手数料としてブローカーが保持する金額を指定します。残りの金額は`NFToken`の販売者に送られます。指定する場合、発行者が課す送金手数料を考慮する前に、販売者が受け取る金額が少なくとも売却オファーで示された金額になるように手数料を設定しなければなりません。 |

ダイレクトモードでは、`NFTokenSellOffer`または`NFTokenBuyOffer`フィールドの**いずれか**を指定する必要があります。ブローカーモードでは、**両方**のフィールドを指定する必要があります。

この機能は、`NFToken`の所有者が第三者のブローカーにトークンの売却を提案し、ブローカーが`NFToken`を所有したり資金を預けることなく、より高額で`NFToken`を売却することを可能にするものです。

両方のオファーが同じ資産に対するものである場合、資金が転送される順序によって、本来成功するはずの取引が、資金不足のために失敗する可能性があります。決定論的なトランザクション実行を保証し、成功の可能性を最大化するために、`NFToken`を購入しようとするアカウントから先に資金が引き落とされます。ブローカーに支払われる資金は、販売者に入金される前に入金されます。

ブローカーモードでは、`NFTokenBuyOffer`と`NFTokenSellOffer`の両方が同じ`NFTokenID`を指定する必要があります。

## エラーケース

すべてのトランザクションで発生する可能性のあるエラーに加えて、{% $frontmatter.seo.title %}トランザクションでは、次の[トランザクション結果コード](../transaction-results/index.md)が発生する可能性があります。

| エラーコード                         | 説明                                    |
|:-----------------------------------|:----------------------------------------|
| `temDISABLED`                 | [NonFungibleTokensV1 Amendment][]は有効ではありません。 |
| `temMALFORMED`                     | トランザクションのフォーマットが正しくありません。たとえば、`NFTokenSellOffer`と`NFTokenBuyOffer`のどちらも指定されていないか、`NFTokenBrokerFee`に負の値が指定されています。|
| `tecCANT_ACCEPT_OWN_NFTOKEN_OFFER` | 購入者と販売者が同じアカウントになっています。 |
| `tecEXPIRED`                       | トランザクションで指定されたオファーの有効期限が既に切れています。 |
| `tecINSUFFICIENT_FUNDS`            | 購入者が申し出た金額を全額持っていない。購入額がXRPで指定されている場合、[所有者準備金](../../../../concepts/accounts/reserves.md)が原因である可能性があります。購入額がトークンである場合、トークンが[凍結](../../../../concepts/tokens/fungible-tokens/freezes.md) されていることが原因と考えられます。 |
| `tecINSUFFICIENT_PAYMENT`          | ブローカーモードにおいて、提示された購入額は、`BrokerFee` _および_ `NFToken`の売却コストを支払うには十分な額ではありません。 |
| `tecOBJECT_NOT_FOUND`              | トランザクションで指定されたオファーがレジャーに存在しません。 |
| `tecNFTOKEN_BUY_SELL_MISMATCH`     | ブローカーモードにおいて、2つのオファーが有効なマッチングではありません。例えば、販売者が購入者の提示額よりも高い金額を提示している、購入と売却のオファーが異なる通貨で提示されている、販売者が購入者や ブローカーとは異なる販売先を指定している、などです。 |
| `tecNFTOKEN_OFFER_TYPE_MISMATCH`   | `NFTokenBuyOffer`で識別されるオブジェクトが実際には購入オファーでない、または`NFTokenSellOffer`で識別されるオブジェクトが実際には売却オファーでない場合です。|
| `tecNO_PERMISSION`                 | 販売者が売却する`NFToken`を所有していません。または、マッチングオファーが、オファーを受け入れるアカウントとは異なる`Destination`アカウントを指定しています。 |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
