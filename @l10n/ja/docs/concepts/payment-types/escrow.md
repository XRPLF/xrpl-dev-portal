---
html: escrow.html
parent: payment-types.html
seo:
    description: XRPはEscrowに預託され、後日特定の条件が満たされた時点で送金されます。Escrowは時間制限、暗号条件、あるいはその両方によって異なる場合があります。
labels:
  - Escrow
---
# Escrow

従来より、Escrowとは、金融取引を円滑に行うための二者間の契約です。公平な第三者が資金を受領・保管し、契約で指定された条件が満たされた場合にのみ、目的の受取人に資金を提供します。この方法により、両当事者は確実に義務を果たすことができます。

XRP LedgerはEscrowをさらに一歩進め、サードパーティをレジャーに組み込まれた自動システムに置き換えます。EscrowはXRPをロックし、条件が満たされるまで使用も破棄もできません。

## Escrowの種類

XRP Ledgerは3つの種類のEscrowをサポートします。

- **時間ベースのEscrow:** 一定の時間が経過した後資金が利用可能になります。
- **条件付きEscrow:** このEscrowは、対応する条件(condition)と履行(フルフィルメント)を設定して作成されます。条件は資金をロックする役割を果たし、正しい履行キーが提供されるまで解除されません。
- **複合Escrow:** このEscrowは、時間ベースEscrowと条件付きEscrowの特徴を兼ね備えています。このEscrowは、指定された時間が経過するまでは全くアクセスすることができず、その後、正しい履行を行うことで資金を解放することができます。

## Escrowのライフサイクル

1. 送信者は`EscrowCreate`トランザクションを用いてEscrowを作成します。このトランザクションは以下を指定します。

    - ロックするXRPの量
    - XRPをリリースする条件
    - XRPの受取人

2. トランザクションが処理されると、XRP LedgerはEscrowされたXRPを保持する`Escrow`オブジェクトを作成します。

3. 受取人はXRPを受け渡すために`EscrowFinish`トランザクションを送信します。条件が満たされた場合、`Escrow`オブジェクトは破棄され、XRPは受取人に引き渡されます。

    **注記:** Escrowに有効期限があり、それまでに正常に終了しなかった場合、Escrowは期限切れになります。期限切れのEscrowは`EscrowCancel`トランザクションがそれをキャンセルするまで台帳に残り、`Escrow`オブジェクトを破棄してXRPを送信者に返します。

## 状態遷移図

次の図は、Escrow実施時の各状態を示します。

[![Escrowの状態がHeld → Ready/Conditionally Ready → Expiredと遷移する様子を示す状態遷移図](/docs/img/escrow-states.ja.png)](/docs/img/escrow-states.ja.png)

この図は、Escrowの「Finish-after」時刻（`FinishAfter`フィールド）、Crypto-condition（`Condition`フィールド）、および有効期限（`CancelAfter`フィールド）の3通りの組み合わせの3つの例を示します。

- **時間ベースのEscrow（左）:** Finish-after時刻のみが設定されているEscrowは、**Held**状態で作成されます。指定の時刻が経過すると**Ready**になり、誰でもこのEscrowを終了できるようになります。Escrowに有効期限が設定されており、その時刻になるまでに誰もEscrowを終了しないと、そのEscrowは**Expired**になります。Expired状態では、Escrowを終了できなくなり、誰でもEscrowをキャンセルできるようになります。Escrowに`CancelAfter`フィールドが設定されていない場合、Escrowが期限切れになることがないため、キャンセルできません。

- **複合Escrow（中央）:** EscrowでCrypto-condition（`Condition`フィールド） _および_ 「Finish-after」時刻（`FinishAfter`フィールド）の両方が指定されている場合、Finish-after時刻が経過するまでEscrowは**Held**状態です。その後**Conditionally Ready**になり、Crypto-conditionに対し正しいフルフィルメントを提供すればEscrowを終了できます。Escrowに有効期限（`CancelAfter`フィールド）が設定されており、その時刻になるまでに誰もEscrowを終了しないと、そのEscrowは**Expired**になります。Expired状態では、Escrowを終了できなくなり、誰でもEscrowをキャンセルできるようになります。Escrowに`CancelAfter`フィールドが設定されていない場合、Escrowが期限切れになることがないため、キャンセルできません。

- **条件付きEscrow（右）:** EscrowでCrypto-condition（`Condition`フィールド）が指定されており、Finish-after時刻が指定されていない場合、Escrowは作成時点で即時に**Conditionally Ready**になります。この時点では、Crypto-conditionに対する正しいフルフィルメントを提供した人だけがEscrowを終了できます。有効期限（`CancelAfter`フィールド）までに終了されなかったEscrowは**Expired**になります。（Finish-after時刻が設定されていないEscrowには、有効期限が設定されている _必要があります_ 。）Expired状態では、Escrowを終了できなくなり、誰でもEscrowをキャンセルできるようになります。


## 制約事項

- EscrowはXRPでのみ実行でき、発行済み通貨では実行できません。
- 少額での利用はコスト面で難しいかもしれません。
    - Crypto-conditionを使用する場合、[EscrowFinishトランザクションのコスト](#escrowfinishトランザクションのコスト)が通常よりも高くなります。
    - エスクローが未成立な間は、`Escrow`オブジェクトの[準備金](../accounts/reserves.md)は送信者の責任となります。
- Escrowを作成するトランザクションの実行時には、時刻の値が過去の時間であってはなりません。
- 時限リリースおよび有効期限は、レジャークローズに制約されます。つまり実際には、レジャーの正確なクローズ時刻に基づいて、これらの時刻が約5秒単位で丸められる場合があります。
- サポートされている唯一の[Crypto-condition][]タイプはPREIMAGE-SHA-256です。


## EscrowFinishトランザクションのコスト

Crypto-conditionを使用する場合、Crypto-conditionフルフィルメントの検証に高い処理負荷がかかるため、EscrowFinishトランザクションでは[高額なトランザクションコスト](../transactions/transaction-cost.md#特別なトランザクションコスト)を支払う必要があります。

追加で必要となる取引コストはフルフィルメントのサイズに比例します。トランザクションが[マルチシグ](../accounts/multi-signing.md)の場合、マルチサインのコストはフルフィルメントのコストに追加されます。

必要となる追加のトランザクションコストは、フルフィルメントのサイズに比例します。現時点では、フルフィルメントのあるEscrowFinishでは最小トランザクションコストとして、**330 drop（[XRPのdrop数](../../references/protocol/data-types/basic-data-types.md#通貨額の指定)）と、フルフィルメントのサイズで16バイトあたり10 drop**が必要です。

**注記:** 上記の式は、トランザクションのリファレンスコストが10 dropであることを前提としています。

[手数料投票](../consensus-protocol/fee-voting.md)により`reference_fee`の値が変更される場合、この式は新しいリファレンスコストに基づいてスケーリングされます。フルフィルメントのあるEscrowFinishトランザクションの公式は次のとおりです。

```
reference_fee * (signer_count + 33 + (fulfillment_bytes / 16))
```



## 参考情報

XRP LedgerのEscrowの詳細は、以下をご覧ください:

- [Escrowチュートリアル](../../tutorials/how-tos/use-specialized-payment-types/use-escrows/index.md)
- [トランザクションのリファレンス](../../references/protocol/transactions/index.md)
    - [EscrowCreateトランザクション][]
    - [EscrowFinishトランザクション][]
    - [EscrowCancelトランザクション][]
- [レジャーリファレンス](../../references/protocol/ledger-data/index.md)
    - [Escrowオブジェクト](../../references/protocol/ledger-data/ledger-entry-types/escrow.md)


Rippleによる550億XRPのロックアップについては、[Ripple's Insights Blog](https://ripple.com/insights/ripple-to-place-55-billion-xrp-in-escrow-to-ensure-certainty-into-total-xrp-supply/)をご覧ください。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
