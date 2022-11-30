---
html: ter-codes.html
parent: transaction-results.html
blurb: terコードは、トランザクションは失敗したけれども、将来そのトランザクションを正常に適用できる可能性があることを示します。
labels:
  - トランザクション送信
---
# terコード

これらのコードは、トランザクションは失敗したけれども、将来そのトランザクションを正常に適用できる可能性があることを示します。通常は、他の仮定トランザクションが先に適用される場合など。これらには-99から-1までの数値が含まれています。実際のエラーに対して数値は変更される可能性がありますので、これに頼らないでください。

**注意:** `ter`コードが付いているトランザクションはレジャーには適用されません。またこのようなトランザクションが原因でXRP Ledgerの状態が変わることはありません。ただし、暫定的に失敗したトランザクションは、再適用後に成功するか、または別のコードで失敗する可能性があります。詳細は、[結果のファイナリティー](finality-of-results.html)と[信頼性の高いトランザクション送信](reliable-transaction-submission.html)を参照してください。

| コード             | 説明                                               |
|:-----------------|:----------------------------------------------------------|
| `terFUNDS_SPENT`  | **廃止予定。**                                           |
| `terINSUF_FEE_B` | トランザクションの送信元アカウントに、トランザクションに指定されている`Fee`の支払いに十分なXRPがありません。 |
| `terLAST`          | 内部使用のみ。通常はこのコードは返されません。 |
| `terNO_ACCOUNT`   | レジャーのトランザクション送信元アドレスに（まだ）資金が供給されていません。 |
| `terNO_AMM`      | The AMM-related transaction :not_enabled: specifies an asset pair that does not currently have an AMM instance. <!-- TODO: translate --> |
| `terNO_AUTH`      | トランザクションでは、`lsfRequireAuth`が有効であるアカウントが発行した通貨を未承認のトラストラインに追加する操作が行われます。たとえば、保有が許可されていない通貨を購入するオファーを出した場合などです。 |
| `terNO_LINE`      | 内部使用のみ。通常はこのコードは返されません。 |
| `terNO_RIPPLE`    | 内部使用のみ。通常はこのコードは返されません。 |
| `terOWNERS`        | トランザクションでは、トランザクションを送信するアカウントの「所有者カウント」はゼロ以外である必要があります。このためトランザクションを正常に完了できません。たとえば、トラストラインや使用可能なオファーがあるアカウントでは、[`lsfRequireAuth`](accountset.html#accountsetのフラグ)フラグを有効にできません。 |
| `terPRE_SEQ`      | 現在のトランザクションの`Sequence`番号が、トランザクションを送信するアカウントの現在のシーケンス番号よりも大きな番号です。 |
| `terRETRY`         | 再試行可能な不明なエラー。                              |
| `terQUEUED`        | トランザクションは負荷スケーリングされた[トランザクションコスト](transaction-cost.html)の要件を満たしているが、オープンレジャーの要件を満たしていなかったため、トランザクションは将来のレジャーのキューに入れられました。 |

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
