# Partial Payment

デフォルトのケースでは、XRP Ledgerの[Paymentトランザクション][]の`Amount`フィールドに、為替レートと[送金手数料](transfer-fees.html)を差し引いた実際の送金額が指定されます。「Partial Payment」フラグ（[**tfPartialPayment**](payment.html#paymentのフラグ)）を使うと、送金額を増額する代わりに受取金額を減額して、支払を正常に実行できます。Partial Paymentは、追加コストなしで[支払を返金](become-an-xrp-ledger-gateway.html#bouncing-payments)したい場合に便利です。

[トランザクションコスト](transaction-cost.html)に使用されるXRPの額は、トランザクションタイプに関わらず常に送金元のアカウントから差し引かれます。

Partial Paymentは、XRP Ledgerとのネイティブ統合を悪用して取引所およびゲートウェイから資金を盗むのに使用される恐れがあります。本書の[Partial Paymentの悪用](#partial-paymentの悪用)セクションで、この悪用の仕組みと防止対策を説明します。

## セマンティクス

### Partial Paymentを使用しない場合

Partial Paymentフラグを使用しないで送金する場合、トランザクションの`Amount`フィールドに実際の送金額を指定し、`SendMax`フィールドに送金上限額と通貨を指定します。`Amount`の額を全額送金すると`SendMax`パラメーターの値を超えてしまう場合や、その他何らかの理由で総額を送金できない場合は、トランザクションは失敗します。トランザクション指示で`SendMax`フィールドが省略されると、`Amount`と同額とみなされます。この場合、手数料の合計が0である場合のみ支払が成功します。

つまり、次の式になります。

    Amount+（手数料）=（送金額）≤ SendMax

この式の「手数料」は、[送金手数料](transfer-fees.html)と通貨の為替レートを指します。送金額（`Amount`）の通貨は、送金側と受取側で異なる通貨建てにすることができ、XRP Ledgerの分散型取引所でオファーを消費することにより交換されます。

**注記:** トランザクションの`Fee`フィールドが参照するXRP[トランザクションコスト](transaction-cost.html)は、トランザクションをネットワークに中継するために消却されます。トランザクションコストは、常に指定通りの額が送金元から引き落とされ、あらゆるタイプの支払の手数料計算とは完全に切り離されています。

### Partial Paymentを使用する場合

Partial Paymentフラグが有効になっている支払を送金する場合、このトランザクションの`Amount`フィールドには送金限度額を指定します。Partial Paymentでは、制限（手数料、流動性不足、受取アカウントのトラストラインの枠不足など）の有無にかかわらず、指定額の _一部_ を送金できます。

オプションの`DeliverMin`フィールドには、送金下限額を指定します。`SendMax`フィールドは、Partial Payment以外で送金する場合と同様に機能します。Partial Paymentトランザクションは、送金額が`DeliverMin`フィールドの金額以上、`SendMax`の金額未満であれば成功します。`DeliverMin`フィールドに指定のない場合、任意の正の金額の送金であれば、Partial Paymentは成功します。

つまり、次の式になります。

    金額 ≥（送金額）= SendMax -（手数料）≥ DeliverMin > 0

### Partial Paymentの制限事項

Partial Paymentには次の制限事項があります。

- Partial Paymentでは、アドレスにXRPにて資金を供給できません。この場合、[結果コード][]`telNO_DST_PARTIAL`が返されます。
- Partial Paymentでは、XRP間の直接決済はできません。この場合、[結果コード][]`temBAD_SEND_XRP_PARTIAL`が返されます。
    - ただし、イシュアンスからXRPへの支払またはXRPからイシュアンスへの支払は、Partial Paymentが可能です。

[結果コード]: transaction-results.html

### `delivered_amount`フィールド

Partial Paymentでの実際の送金額を把握できるように、正常に完了したPaymentトランザクションのメタデータには`delivered_amount`フィールドが含まれています。このフィールドには送金額が`Amount`フィールドと[同じフォーマット](basic-data-types.html#通貨額の指定)で示されています。

Partial Payment以外の場合、トランザクションのメタデータの`delivered_amount`フィールドは、トランザクションの`Amount`フィールドと同じです。支払が発行済み通貨で行われた場合、丸め方により`delivered_amount`が`Amount`フィールドとやや異なることがあります。

次の**両方**の条件に該当するトランザクションでは、送金額を**使用できません**。

- Partial Paymentである
- 2014-01-20以前の検証済みレジャーに含まれている

この両方の条件に該当する場合、`delivered_amount`には実際の金額ではなく文字列値`unavailable`が示されます。この状況で実際の送金額を確認する唯一の方法は、トランザクションのメタデータでAffectedNodesを参照することです。発行済み通貨を送金するトランザクションで、`Amount`の`issuer`が`Destination`アドレスと同じアカウントである場合、送金額は異なる取引相手へのトラストラインを表す複数の`AffectedNodes`メンバー間で分割できます。

`delivered_amount`フィールドは以下のフィールドに含まれています。

| API | メソッド | フィールド |
|-----|--------|-------|
| [JSON-RPC / WebSocket][] | [account_txメソッド][] | `result.transactions` 配列メンバーの `meta.delivered_amount` |
| [JSON-RPC / WebSocket][] | [txメソッド][] | `result.meta.delivered_amount` |
| [JSON-RPC / WebSocket][] | [transaction_entryメソッド][] | `result.metadata.delivered_amount` |
| [JSON-RPC / WebSocket][] | [ledgerメソッド][]（トランザクションが展開されている状態） | `result.ledger.transactions` 配列メンバーの`metaData.delivered_amount` [新規: rippled 1.2.1][] |
| [WebSocket][] | [トランザクションサブスクリプション](subscribe.html#トランザクションストリーム) | サブスクリプションメッセージの`meta.delivered_amount` [新規: rippled 1.2.1][] |
| [RippleAPI][] | [`getTransaction` メソッド](rippleapi-reference.html#gettransaction) | `outcome.deliveredAmount` |
| [RippleAPI][] | [`getTransactions` メソッド](rippleapi-reference.html#gettransaction) | 配列メンバーの `outcome.deliveredAmount` |

[WebSocket]: rippled-api.html
[JSON-RPC / WebSocket]: rippled-api.html
[RippleAPI]: rippleapi-reference.html

## Partial Paymentの悪用

金融機関によるXRP Ledgerとの統合が、Paymentの`Amount`フィールドは常に総送金額であると想定して行われる場合、不正使用者がその想定を悪用して、金融機関から資金を盗むことが可能になります。Partial Paymentがゲートウェイ、取引所、または業者のソフトウェアで正しく処理されない限り、これらの機関に対してこのような悪用が行われる可能性があります。

**着信Paymentトランザクションを正しく処理するには、**`Amount`フィールドではなく **[`delivered_amount`メタデータフィールド](#delivered_amountフィールド)を使用します。** これにより、金融機関が _実際の_ 受取金額を間違えることがなくなります。


### 悪用シナリオの流れ

脆弱な金融機関を攻撃するため、不正使用者は次のような操作を試みます。

1. 不正使用者がPaymentトランザクションを金融機関に送信します。このトランザクションの`Amount`フィールドの額は高額で、**tfPartialPayment**フラグが有効になっています。
2. Partial Paymentは成功しますが（結果コード`tesSUCCESS`）、実際には指定通貨でわずかな金額だけが送金されます。
3. 脆弱な金融機関はトランザクションの`Amount`フィールドを確認しますが、`Flags`フィールドや`delivered_amount`メタデータフィールドは確認しません。
4. 脆弱な金融機関は、XRP Ledgerへ入金された`delivered_amount`が非常に少額のであるにもかかわらず、外部システム（金融機関独自のレジャーなど）で`Amount`の総額を不正使用者に入金します。
5. 不正使用者は、脆弱な機関がこの差異に気付く前に、可能な限りの多くの残高を別のシステムに出金します。
    - ブロックチェーントランザクションは通常不可逆であるため、不正使用者は一般的にBitcoinなどの他の仮想通貨に残高を換金することを好みます。法定通貨システムに出金した場合、金融機関がトランザクションを撤回または取り消せるのは、最初にトランザクションが実行されてから数日後になります。
    - 取引所の場合、不正使用者はXRPから残高を出金し、直接XRP Ledgerに戻すこともできます。

業者の場合、操作の順序がやや異なりますが、概念は同じです:

1. 不正使用者が大量の商品やサービスの購入を依頼します。
2. 脆弱な業者が不正使用者に対し、購入された商品やサービスの手数料を請求します。
3. 不正使用者がPaymentトランザクションを業者に送信します。このトランザクションの`Amount`フィールドの額は高額で、**tfPartialPayment**フラグが有効になっています。
4. Partial Paymentが成功しますが（結果コード`tesSUCCESS`）、指定通貨でわずかな金額だけが送金されます。
5. 脆弱な業者はトランザクションの`Amount`フィールドを確認しますが、`Flags`フィールドや`delivered_amount`メタデータフィールドは確認しません。
6. 脆弱な業者は、XRP Ledgerへの入金された`delivered_amount` が非常に少額であるにもかかわらず、請求を支払済みとして扱い、商品またはサービスを不正使用者に納入します。
7. 不正使用者は、業者が差異に気付く前に、商品やサービスを使用、再販売または持ち逃げします。

### その他の緩和対策

このような悪用を防ぐには、着信トランザクションの処理で[`delivered_amount`フィールド](#delivered_amountフィールド)を使用すれば十分です。ただし、積極的な取り組みを追加することによっても、このような悪用が発生する可能性を回避または緩和できます。例:

- 出金処理のビジネスロジックにサニティチェックを追加します。XRP Ledgerで保有している残高の合計が、予期されている資産と債務に一致しない場合は、出金を処理をしません。
- 「顧客確認」のガイドラインに従い、顧客の身元情報を厳密に検証します。不正使用者を事前に認識して阻止したり、システムを悪用した不正使用者に対して法的措置を講じたりすることができます。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
