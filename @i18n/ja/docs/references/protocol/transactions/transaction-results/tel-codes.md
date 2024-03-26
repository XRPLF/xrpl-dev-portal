---
html: tel-codes.html
parent: transaction-results.html
seo:
    description: telコードは、トランザクションを処理するローカルサーバでのエラーを示します。
labels:
  - トランザクション送信
---
# telコード

これらのコードは、トランザクションを処理するローカルサーバでのエラーを示します。構成や負荷レベルが異なる別のサーバでは同じトランザクションが正常に処理される場合があります。-399から-300までの数値が含まれています。実際のエラーに対して数値は変更される可能性がありますので、これに頼らないでください。

**注意:** `tel`コードが付いているトランザクションはレジャーには適用されません。またこのようなトランザクションが原因でXRP Ledgerの状態が変わることはありません。ただし、暫定的に失敗したトランザクションは、再適用後に成功するか、または別のコードで失敗する可能性があります。詳細は、[結果のファイナリティー](../../../../concepts/transactions/finality-of-results/index.md)と[信頼性の高いトランザクション送信](../../../../concepts/transactions/reliable-transaction-submission.md)をご覧ください。

| コード                  | 説明                                          |
|:----------------------|:-----------------------------------------------------|
| `telBAD_DOMAIN`        | トランザクションで指定されたドメイン値（[AccountSetトランザクション][]の`Domain`フィールドなど）は、レジャーに保管するには長すぎます。 |
| `telBAD_PATH_COUNT`    | トランザクションに含まれているパスが多過ぎるため、ローカルサーバが処理できません。 |
| `telBAD_PUBLIC_KEY`   | トランザクションで指定された公開鍵値（[AccountSetトランザクション][]の`MessageKey`フィールドなど）の長すぎます。 |
| `telCAN_NOT_QUEUE`    | このトランザクションは[オープンレジャーコスト](../../../../concepts/transactions/transaction-cost.md)を満たしていませんが、[キュー制限](../../../../concepts/transactions/transaction-queue.md#キューの制約事項)を満たしていなかったため、サーバはこのトランザクションをキューに入れませんでした。たとえば、送信者のキューにすでに10個のトランザクションが入っている場合には、トランザクションからこのコードが返されます。後で再試行するか、`Fee`フィールドに高いコストを指定して代わりのトランザクションに署名して送信することができます。 |
| `telCAN_NOT_QUEUE_BALANCE` | トランザクションが[オープンレジャーコスト](../../../../concepts/transactions/transaction-cost.md)を満たしておらず、またすでにキューに入っているトランザクションの予測XRPコストの合計が、アカウントの予想残高よりも大きいために、このトランザクションはトランザクションキューに追加されませんでした。後で再試行するか、別のサーバへの送信を試みることができます。 |
| `telCAN_NOT_QUEUE_BLOCKS` | トランザクションは[オープンレジャーコスト](../../../../concepts/transactions/transaction-cost.md)を満たしておらず、トランザクションキューにも追加されませんでした。このトランザクションはキュー内の既存のトランザクションを置き換えることができませんでした。これは、認証メソッドを変更することで、すでにキューに入っている同じ送信者からのトランザクションがブロックされる可能性があるためです。（これには[SetRegularKey][]トランザクションと[SignerListSet][]トランザクションのすべて、およびRequireAuth/OptionalAuth、DisableMaster、AccountTxnIDフラグを変更する[AccountSet][]トランザクションなどがあります。）後で再試行するか、別のサーバへの送信を試みることができます。 |
| `telCAN_NOT_QUEUE_BLOCKED` | トランザクションが[オープンレジャーコスト](../../../../concepts/transactions/transaction-cost.md)を満たしておらず、トランザクションキューにも追加されませんでした。これは、このトランザクションの前にキューに入れられた同じ送信者のトランザクションによってブロックされるためです。（これには[SetRegularKey][]トランザクションと[SignerListSet][]トランザクションのすべて、およびRequireAuth/OptionalAuth、DisableMaster、AccountTxnIDフラグを変更する[AccountSet][]トランザクションなどがあります。）後で再試行するか、別のサーバへの送信を試みることができます。 |
| `telCAN_NOT_QUEUE_FEE` | トランザクションは[オープンレジャーコスト](../../../../concepts/transactions/transaction-cost.md)を満たしておらず、トランザクションキューにも追加されませんでした。このコードは、送信者とシーケンス番号が同じトランザクションがすでにキューに入れられており、新しいトランザクションが、既存のトランザクションを置き換えるのに十分なトランザクションコストを支払わない場合に発生します。キュー内のトランザクションを置き換えるには、新しいトランザクションの`Fee`値に25%以上の上乗せ（[手数料レベル](../../../../concepts/transactions/transaction-cost.md#手数料レベル)で評価）が必要となります。`Fee`の値を大きくして再試行するか、大きな数字の`Sequence`番号でこのトランザクションを送信して既存のトランザクションを置き換えないようにするか、別のサーバへ送信を試みることができます。 |
| `telCAN_NOT_QUEUE_FULL` | このトランザクションは[オープンレジャーコスト](../../../../concepts/transactions/transaction-cost.md)を満たしておらず、またこのサーバのトランザクションキューが一杯であるため、サーバはこのトランザクションをキューに入れませんでした。`Fee`の値を大きくして再試行するか、後で試してみるか、別のサーバへの送信を試みることができます。新しいトランザクションのトランザクションコスト（[手数料レベル](../../../../concepts/transactions/transaction-cost.md#手数料レベル)で評価）は、キュー内でトランザクションコストが最も低いトランザクションよりも高くなければなりません。 |
| `telFAILED_PROCESSING` | トランザクションの処理中に不明なエラーが発生しました。 |
| `telINSUF_FEE_P`       | トランザクションの`Fee`が、サーバの負荷レベルに基づいて定められるサーバの現在の[トランザクションコスト](../../../../concepts/transactions/transaction-cost.md)要件を満たすのに十分な値ではありあません。 |
| `telLOCAL_ERROR`        | 不明なローカルエラー。                             |
| `telNETWORK_ID_MAKES_TX_NON_CANONICAL` | トランザクションは[`NetworkID`フィールド](../common-fields.md#networkidフィールド)を指定していますが、現在のネットワークルールでは`NetworkID`フィールドは指定しないことになっています。(メインネットやその他のチェーンIDが1024以下のネットワークではこのフィールドは使用されません)。もしトランザクションが`NetworkID`を使用しないネットワーク向けであった場合、そのフィールドを削除して再試行してください。トランザクションが別のネットワーク向けだった場合は、正しいネットワークに接続されているサーバに送信してください。 {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.11.0" %}新規: rippled 1.11.0{% /badge %} |
| `telNO_DST`_`PARTIAL`   | トランザクションは、新しいアカウントに資金を供給するためのXRPによる支払いですが、[tfPartialPaymentフラグ](../../../../concepts/payment-types/partial-payments.md)が有効になっていました。これは許可されていません。 |
| `telREQUIRES_NETWORK_ID` | トランザクションは[`NetworkID`フィールド](../common-fields.md#networkidフィールド)を指定していません。トランザクションが`NetworkID`を必要とするネットワーク向けであった場合、フィールドを追加して再試行してください。トランザクションが別のネットワーク向けであった場合、正しいネットワークに接続されているサーバに送信してください。{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.11.0" %}新規: rippled 1.11.0{% /badge %} |
| `telWRONG_NETWORK` | トランザクションが現在のネットワークに対して間違った [`NetworkID` 値](../common-fields.md#networkidフィールド) を指定しています。目的のネットワークに対して正しい `NetworkID`値を指定するか、正しいネットワークに接続されているサーバにトランザクションを送信してください。{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.11.0" %}新規: rippled 1.11.0{% /badge %} |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
