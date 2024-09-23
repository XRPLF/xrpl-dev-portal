---
html: restricting-deposits-uc.html
parent: payments-uc.html
seo:
    description: Checkは、紙の小切手と同じように後払い決済を行うことができます。
labels:
  - トランザクション
---
# 入金の制限

銀行に関する規制を遵守するため、金融機関は受け取った資金の出所に関する書類を提出する必要があります。これらの規制は、金融機関が処理するすべての支払いの出所と行き先を追跡することを義務付け、不正な活動を防止することを目的としています。XRP Ledgerでは、支払いは受取人からのインタラクションなしに送受信することができます。このデフォルトの動作には問題がありますが、デポジット認可を有効にすることで、明示的に認可した資金のみを受け取ることができます。

デポジット認可が有効になっているアカウントでは、次のような場合のみ資金を受け取ることができます。

  - 事前認可されたアカウント
  - チェック
  - エスクロー
<!-- - ペイメントチャネル -->


## デポジット認可のセットアップ

デポジット認可を有効にするには、`AccountSet`トランザクションを使用して`asfDepositAuth`フラグを設定します。[デポジット認可](../../concepts/accounts/depositauth.md)をご覧ください。

## アカウントの事前認可

デポジット認可を有効にすると、アカウントは、あなたが特に許可しない限り、すべての受信トランザクションをブロックします。これは、あなたの求めていることかもしれませんが、大量のトランザクションを扱う場合、面倒になることがあります。信頼できる業者やアカウントがある場合は、それらの業者からのトランザクションを認可する必要がないように、事前認可することができます。

事前認可されたアカウントによる支払いは通貨を問わないので、認可する通貨を指定することはできません。すべてを認可するか認可しないかです。

[デポジットの事前認可](../../references/protocol/transactions/types/depositpreauth.md)をご覧ください。


## 未認可のアカウントからの入金を許可する

デポジット認可を有効にした後でも、未認可のアカウントから支払いを行うこととは可能です。それを可能にするいくつかの方法があります。


### Check

Checkは、デポジット認可が有効な場合、シンプルで親しみやすく、柔軟な資金移動方法です。Checkは、2つの要素から構成される支払い方法です。送信者がCheckを作成し、受信者がそのCheckを現金化する必要があります。Checkを現金化するとは、入金を明示的に承認することです。

この方法は最もシンプルですが、資金が保証されるわけではありません。Checkは後払いであり、Checkを現金化しようとする瞬間まで資金は動きません。Checkを現金化するときに、送金側のアカウントに必要な資金がない可能性があり、ビジネスによっては遅延やその他の問題を引き起こす可能性があります。

[Checkの利用](../../tutorials/how-tos/use-specialized-payment-types/use-checks/use-checks.md)をご覧ください。


### Escrow

入金時の資金保証が必要な場合は、エスクローで入金してもらう方法もあります。通常のエスクローと同様に、送金者はレジャーに資金を確保し、一定の条件が満たされるまで資金を効果的にロックします。これにより、エスクローを閉じて資金を放出するときに、資金が利用できることが保証されます。

[エスクローの利用](../../tutorials/how-tos/use-specialized-payment-types/use-escrows/index.md)をご覧ください。


<!-- Need a better understanding of Payment Channels use cases.

### Payment Channels

Payment Channels are an advanced feature for sending asynchronous XRP payments that can be divided into very small increments and settled later.

The XRP for a payment channel is set aside temporarily. The sender creates _Claims_ against the channel, which the recipient verifies without sending an XRP Ledger transaction or waiting for a new ledger version to be approved by consensus. (This is an _asynchronous_ process because it happens separate from the usual pattern of getting transactions approved by consensus.) At any time, the recipient can _redeem_ a Claim to receive an amount of XRP authorized by that Claim. Settling a Claim like this uses a standard XRP Ledger transaction, as part of the usual consensus process. This single transaction can encompass any number of transactions guaranteed by smaller Claims.

Because Claims can be verified individually but settled in bulk later, payment channels make it possible to conduct transactions at a rate only limited by the participants' ability to create and verify the digital signatures of those Claims. This limit is primarily based on the speed of the participants' hardware and the complexity of the signature algorithms. For maximum speed, use Ed25519 signatures, which are faster than the XRP Ledger's default secp256k1 ECDSA signatures. Research has demonstrated the ability to create over Ed25519 100,000 signatures per second and to verify over [70,000 per second](https://ed25519.cr.yp.to/ed25519-20110926.pdf) on commodity hardware in 2011.

Learn about [Payment Channels](payment-channels.html) on the XRP Ledger.

you may have circumstances where you want to go into contract with a contractor, but don't know the exact amount. This is common in situations such as home improvement projects where an estimate can be provided, but unforeseen circumstances can increase the final amount due. In these situations you can create a payment channel, which allocates (currently only XRP) to a payment channel. This amount would be the estimate the contractor gives you and can serve as their budget for the project. Each item they require payment for, you would submit a claim to the payment channel.

Repeating this process, you would eventually settle on the final amount due, where the contractor (payee) claims the final amount from the payment channel. This method of payment serves as a great way to track invdividual items payed for in large projects.

-->
