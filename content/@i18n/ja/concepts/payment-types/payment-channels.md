---
html: payment-channels.html
parent: payment-types.html
blurb: Payment Channelは、少額の単位に分割可能な高速な非同期のXRPペイメントを送信し、後日決済されるようにします。
labels:
  - Payment Channel
  - スマートコントラクト
---
# Payment Channel

Payment Channelは、少額の単位に分割可能な「非同期」のXRPペイメントを送信し、後日決済する高度な機能です。

Payment Channel向けのXRPは、指定された期間にわたって留保されます。送金元がチャネルに対する _クレーム_ を作成します。受取人は、XRP Ledgerトランザクションを送信したり、新しいレジャーバージョンが[コンセンサス](../consensus-protocol/index.md)に基づいて承認されるまで待つことなしに、このクレームを検証します。（これは、合意に基づいてトランザクションが承認される通常のパターンとは別に発生する、 _非同期_ のプロセスです。）受取人はいつでもクレームを _清算_ して、このクレームにより承認された額のXRPを受領することができます。このようなクレームを清算するときには、通常の合意プロセスの一部として標準XRP Ledgerトランザクションを使用します。この1回のトランザクションに、少額のクレームにより保証される任意の数のトランザクションを含めることができます。

クレームは個別に検証され、後で一括で清算できるため、Payment Channelでは、クレームのデジタル署名を作成および検証する参加者の能力によってのみ制限されるペースで、トランザクションを行えます。この制限は主に、参加者のハードウェアのスピードと、署名アルゴリズムの複雑さによるものです。最大限の速度を引き出すにはEd25519署名を使用します。これはXRP Ledgerのデフォルトのsecp256k1 ECSDA 署名よりも高速です。研究の結果、2011年のコモディティーハードウェアで[1秒あたりEd25519署名を100,000個以上作成し、1秒あたり70,000個以上を検証できることが実証されました](https://ed25519.cr.yp.to/ed25519-20110926.pdf)。


## Payment Channelを使用する理由

Payment Channelを使用するプロセスには常に、支払人と受取人という2名の当事者が関わります。支払人とは、受取人の顧客で、XRP Ledgerを使用している個人または機関です。受取人とは、商品またはサービスの代金としてXRPを受領する個人または事業者です。

Payment Channelでは本来、そこで売買可能なものにいては、一切指定されません。ただし、次の商品やサービスはPayment Channelに適しています。

- デジタルアイテムなど、ほぼ即時に送信できるもの
- 安価な商品（価格に占めるトランザクション処理コストの割合が大きい）
- 通常大量購入する商品（正確な希望数量が事前に判明していない）


## Payment Channelのライフサイクル

次の図は、Payment Channelのライフサイクルの概要を示します。

[![Payment Channelフローチャート](/img/paychan-flow.ja.png)](/img/paychan-flow.ja.png)


## 関連項目

- [Payment Channelの使用](../../tutorials/use-specialized-payment-types/use-payment-channels.md): Payment Channelを使用するプロセスを段階的に説明するチュートリアル。

- [Escrow](escrow.md): 速度が遅い、条件付きの大量XRP決済のための類似機能。

{% raw-partial file="/_snippets/common-links.md" /%}
