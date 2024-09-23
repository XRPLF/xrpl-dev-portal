---
html: rippling.html
parent: trust-lines-and-issuing.html
seo:
    description: Ripplingは、複数当事者間でのトークン残高の自動ネット決済です。
labels:
  - トークン
  - クロスカレンシー
---
# Rippling

XRP Ledgerでは、「Rippling」とは同一通貨の[トラストライン](index.md)を有する複数の接続当事者間での非可分なネット決済のプロセスを指しています。Ripplingはトークンの基幹的なプロセスです。Ripplingを利用すれば、同一イシュアーを信頼するユーザは、そのイシュアーを受動的な仲介機関として発行済み残高を相互に送金できるようになります。Ripplingは、受動的かつ双方向の[通貨取引オーダー](../decentralized-exchange/offers.md)のようなもので、制限がなく、通貨コードが同一でイシュアーが異なる2つの通貨間の為替レートは1:1です。

Ripplingは、支払[パス](paths.md)でのみ発生します。[XRP間の直接決済](../../payment-types/direct-xrp-payments.md)にはRipplingは使用されません。

発行アカウント以外のアカウントでは、Ripplingが望ましくない場合があります。Ripplingを使えば、他のユーザが同一通貨のイシュアー間で債権債務を移動できるようになるためです。このため、アカウントの[DefaultRippleフラグ](#defaultrippleフラグ)を有効にして、アカウントがデフォルトでRipplingを有効にしない限り、デフォルトでは[NoRippleフラグ](#norippleフラグ)により着信トラストラインでのRipplingが無効になっています。

**注意:** 別のアドレスへのトラストラインを作成する場合、そのトラストラインのあなたの側でRipplingをブロックするには、tfSetNoRippleフラグを明示的に有効にする必要があります。

## Ripplingの例

「Rippling」は、支払いを行うために複数のトラストラインが調整されたときに発生します。たとえば、AliceがCharlieにお金を借りており、さらにAliceはBobからもお金を借りている場合、XRP Ledgerではトラストラインは次のようになります:

[{% inline-svg file="/docs/img/noripple-01.svg" /%}](/docs/img/noripple-01.svg "Charlie --($10)-- Alice -- ($20) -- Bob")

BobがCharlieに$3を支払いたい場合、BobはAliceに対して「Alice、君に貸しているお金の中から$3をCharlieに支払ってくれ。」と言えます。AliceはBobに借りているお金の一部をCharlieに送金します。最終的にはトラストラインは次のようになります。

[{% inline-svg file="/docs/img/noripple-02.svg" /%}](/docs/img/noripple-02.svg "Charlie --($13)-- Alice --($17)-- Bob")

2つのアドレスが、アドレス間のトラストライン上の残高を調整することで相互に支払うこのプロセスを「Rippling」と呼びます。これはXRP Ledgerの有用で重要な機能です。Ripplingは、同一の[通貨コード][]を使用するトラストラインによってアドレスがリンクされている場合に起こります。イシュアーが同一でなくてもかまいません。実際、大規模なチェーンでは常にイシュアーが変更されます。

## NoRippleフラグ

発行アカウント以外のアカウント、特に手数料やポリシーが異なる複数のイシュアーの残高を保有している流動性プロバイダーは、一般的に残高がRipplingされることを望みません。

「NoRipple」フラグは、トラストライン上の設定です。2つのトラストラインの両方で、同じアドレスによってNoRippleが有効に設定されている場合、第三者からの支払を、これらのトラストラインでこのアドレスを通じて「Rippling」することはできません。これにより、同一通貨の複数イシュアー間で流動性プロバイダーの残高が予期せず移動されるのを防ぎます。

アカウントは1つのトラストラインでNoRippleを無効にできます。これにより、そのトラストラインを含む任意のペアを通じてのRipplingが可能になります。アカウントにてデフォルトでRipplingを有効にするには、[DefaultRippleフラグ](#defaultrippleフラグ)を有効にします。

たとえば、Emilyが2つの異なる金融機関から発行されたお金を保有しているとします。

[{% inline-svg file="/docs/img/noripple-03.svg" /%}](/docs/img/noripple-03.svg "Charlie --（$10）-- 金融機関A --（$1）-- Emily --（$100）-- 金融機関B --（$2）-- Daniel")

CharlieはDanielに支払うため、Emilyのアドレスを通じてRipplingします。たとえば、CharlieがDanielに$10を支払うとします:

[{% inline-svg file="/docs/img/noripple-04.svg" /%}](/docs/img/noripple-04.svg "Charlie --（$0）-- 金融機関A --（$11）-- Emily --（$90）-- 金融機関B --（$12）-- Daniel")

この場合、CharlieやDanielと面識のないEmilyは驚く可能性があります。さらに、金融機関Aが金融機関Bよりも高い出金手数料をEmilyに請求した場合、Emilyがコストを負担することになる可能性があります。NoRippleフラグはこの状況を回避するためのフラグです。Emilyが両方のトラストラインでNoRippleフラグを設定していれば、この2つのトラストラインを使用しているEmilyのアドレスを通じて、支払がRipplingされることはありません。

例:

[{% inline-svg file="/docs/img/noripple-05.svg" /%}](/docs/img/noripple-05.svg "Charlie --（$10）-- 金融機関A --（$1、NoRipple）-- Emily --（$100、NoRipple）-- 金融機関B --（$2）-- Daniel")

このように、CharlieがEmilyのアドレスを通じてRipplingし、Danielに支払うという上記のシナリオは、不可能になります。

### 詳細

NoRippleフラグにより特定のパスが無効になり、無効になったパスは支払に使用できなくなります。パスが無効であると見なされるのは、パスが、あるアドレスに対してNoRippleが有効となっているトラストラインを通じて、そのアドレスノードに入り**かつ**そのノードから出た場合に限られます。

[{% inline-svg file="/docs/img/noripple-06.ja.svg" /%}](/docs/img/noripple-06.ja.svg "処理を行うためには同一アドレスによって両方のトラストラインにNoRippleが設定されている必要があることを示す図")


## DefaultRippleフラグ

DefaultRippleフラグは、デフォルトで着信トラストラインでのRipplingを有効にするアカウント設定です。ゲートウェイやその他の通貨イシュアーは、顧客が通貨を相互に送金できるようにするには、このフラグを有効にする必要があります。

アカウントのDefaultRipple設定は、他者があなたに対してオープンしたトラストラインにのみ影響し、あなたが作成するトラストラインには影響しません。アカウントのDefaultRipple設定を変更する場合、変更前に作成したトラストラインでは既存のNoRipple設定が維持されます。アドレスの新しいデフォルトに合わせてトラストラインのNoRipple設定を変更するには、[TrustSetトランザクション][]を使用します。


## NoRippleを使用する
<!--{# TODO: move these things into their own tutorials #}-->

### NoRippleを有効/無効にする

トラストライン上のNoRippleフラグは、トラストライン上のアドレスの残高がプラスまたはゼロの場合に限り、有効にできます。これにより、この機能を悪用してトラストラインの残高に示される債務を不履行にすることができなくなります。（ただし、アドレスを放棄すれば債務を不履行にできます。）

[`rippled` API](../../../references/http-websocket-apis/index.md)でNoRippleフラグを有効にするには、`tfSetNoRipple`フラグを設定した[TrustSetトランザクション][]を送信します。NoRippleを無効にする（Ripplingを有効にする）には、`tfClearNoRipple`フラグを使用します。


### NoRippleステータスの確認

相互に信頼し合っている2つのアカウントの場合、NoRippleフラグはアカウントごとに管理されます。

[`rippled` API](../../../references/http-websocket-apis/index.md)でアドレスに関連付けられているトラストラインを確認するには、[account_linesメソッド][]を使用します。各トラストラインの`no_ripple`フィールドには、現在のアドレスがそのトラストラインに対してNoRippleフラグを有効にしているか否かが表示され、`no_ripple_peer`フィールドには、取引相手がNoRippleフラグを有効にしているか否かが表示されます。


## 関連項目

- **コンセプト:**
  - [パス](paths.md)
- **リファレンス:**
  - [account_linesメソッド][]
  - [account_infoメソッド][]
  - [AccountSetトランザクション][]
  - [TrustSetトランザクション][]
  - [AccountRootのフラグ](../../../references/protocol/ledger-data/ledger-entry-types/accountroot.md#accountrootのフラグ)
  - [RippleState（トラストライン）のフラグ](../../../references/protocol/ledger-data/ledger-entry-types/ripplestate.md#ripplestateのフラグ)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
