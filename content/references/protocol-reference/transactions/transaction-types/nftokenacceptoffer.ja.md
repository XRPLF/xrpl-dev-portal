---
html: nftokenacceptoffer.html
parent: transaction-types.html
blurb: NFTokenの購入または売却のオファーを受け入れる。
labels:
  - NFT, 非代替性トークン
---
# NFTokenAcceptOffer

`NFTokenAcceptOffer`トランザクションは`NFToken`の購入または売却のオファーを受け入れるために使用されます。トランザクションは次のいずれかになります。

* 1つのオファーを受け入れることを許可する。これは _ダイレクト_ モードと呼ばれます。
* 2つの異なるオファー、1つは与えられた`NFToken`の購入を提案し、もう1つは同じ`NFToken`の売却を提案し、アトミックに受け入れられることを許可します。これは _ブローカー_ モードと呼ばれます。

_([NonFungibleTokensV1_1 amendment][]が必要です)_


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


### ダイレクトモード

ダイレクトモードでは、以下の場合、`NFTokenAcceptOffer`トランザクションは失敗します。

* `NFTokenAcceptOffer`トランザクションの対象となる`NFTokenOffer`が`NFToken`の`購入`オファーであり、`NFTokenAcceptOffer`を送信したアカウントが、実行時に対応する`NFToken`を所有していない場合。
* `NFTokenAcceptOffer`トランザクションの対象となる`NFTokenOffer`は`NFToken`の`売却`オファーであり、実行時に`NFToken`の所有者ではないアカウントが送信している場合。
* `NFTokenAcceptOffer`トランザクションの対象となる`NFTokenOffer`は`NFToken`の`売却`オファーであり、実行時に`NFTokenOffer`内の受信者である`Account`以外のアカウントによって送信された場合（存在する場合）。
* `NFTokenAcceptOffer`トランザクションの対象となる`NFTokenOffer`に`expiration`が設定されており、そのトランザクションが含まれる親レジャーのフィールドの終了時刻が既に経過している場合。
* `NFTokenAcceptOffer`トランザクションの対象となる`NFTokenOffer`が、`NFTokenAcceptOffer`を実行するアカウントが所有し、`NFToken`の売買が行われる場合。

このような失敗の副作用として、`NFTokenOffer`オブジェクトが削除され、オファーがキャンセルされたかのように準備金が払い戻されることがあります。このため、適切な`tec`クラスのエラーを使用する必要があります。

トランザクションが正常に実行された場合

* 既存の`owner`の`NFTokenPage`からトークンが削除され、新しい`owner`の`NFTokenPage`に追加されます。
* `NFTokenOffer`で指定された通り、購入者から販売者に資金が移動します。対応する`NFToken`のオファーに`TransferFee`が指定されている場合、`issuer`は指定されたパーセンテージを受け取り、残りは`NFToken`の販売者に送られます。


### ブローカーモード

ブローカーモードでは、以下の場合、`NFTokenAcceptOffer`トランザクションは失敗します。

* `NFTokenAcceptOffer`トランザクションに対する`NFTokenOffer`の`購入`オファーがトランザクションを送信するアカウントによって所有されている場合。
* `NFTokenAcceptOffer`トランザクションに対する`NFTokenOffer`の`売却`オファーが、トランザクションを送信するアカウントによって所有されている場合。
* `NFToken`の売却オファーを出したアカウントが、その実行時に対応する`NFToken`の現在の所有者ではない場合。
* いずれかのオファー（`購入`または`売却`）が`expiration`を指定しており、そのトランザクションが含まれる親レジャーのクローズ時間がすでに経過している場合。


## フィールド

{% include '_snippets/tx-fields-intro.ja.md' %}

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

すべてのトランザクションで発生する可能性のあるエラーに加えて、{{currentpage.name}}トランザクションでは、次の[トランザクション結果コード](transaction-results.html)が発生する可能性があります。

| エラーコード                         | 説明                                    |
|:-----------------------------------|:----------------------------------------|
| `temDISABLED`                 | [NonFungibleTokensV1の修正][]は有効ではありません。 |
| `temMALFORMED`                     | トランザクションのフォーマットが正しくありません。たとえば、`NFTokenSellOffer`と`NFTokenBuyOffer`のどちらも指定されていないか、`NFTokenBrokerFee`に負の値が指定されています。|
| `tecCANT_ACCEPT_OWN_NFTOKEN_OFFER` | 購入者と販売者が同じアカウントになっています。 |
| `tecEXPIRED`                       | トランザクションで指定されたオファーの有効期限が既に切れています。 |
| `tecINSUFFICIENT_FUNDS`            | 購入者が申し出た金額を全額持っていない。購入額がXRPで指定されている場合、[所有者準備金](reserves.html)が原因である可能性があります。購入額が発行済み通貨である場合、トークンが[凍結](freezes.html) されていることが原因と考えられます。 |
| `tecINSUFFICIENT_PAYMENT`          | ブローカーモードにおいて、提示された購入額は、`BrokerFee` _および_ `NFToken`の売却コストを支払うには十分な額ではありません。 |
| `tecOBJECT_NOT_FOUND`              | トランザクションで指定されたオファーがレジャーに存在しません。 |
| `tecNFTOKEN_BUY_SELL_MISMATCH`     | ブローカーモードにおいて、2つのオファーが有効なマッチングではありません。例えば、販売者が購入者の提示額よりも高い金額を提示している、購入と売却のオファーが異なる通貨で提示されている、販売者が購入者や ブローカーとは異なる販売先を指定している、などです。 |
| `tecNFTOKEN_OFFER_TYPE_MISMATCH`   | `NFTokenBuyOffer`で識別されるオブジェクトが実際には購入オファーでない、または`NFTokenSellOffer`で識別されるオブジェクトが実際には売却オファーでない場合です。|
| `tecNO_PERMISSION`                 | 販売者が売却する`NFToken`を所有していません。または、マッチングオファーが、オファーを受け入れるアカウントとは異なる`Destination`アカウントを指定しています。 |


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
