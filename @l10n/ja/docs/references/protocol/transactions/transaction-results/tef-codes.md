---
html: tef-codes.html
parent: transaction-results.html
seo:
    description: tefコードは、トランザクションが失敗してレジャーに記録されなかったが、一部の理論上のレジャーでは正常に完了できた可能性があることを示します。
labels:
  - トランザクション送信
---
# tefコード

これらのコードは、トランザクションが失敗してレジャーに記録されなかったが、一部の理論上のレジャーでは正常に完了できた可能性があることを示します。通常これは、このトランザクションが今後すべてのレジャーで正常に完了できないことを意味します。-199から-100までの数値が含まれています。特定のエラーを示すコードは変更される可能性があるので、コードを使用しないでください。

**注意:** `tef`コードが付いているトランザクションはレジャーには適用されません。またこのようなトランザクションが原因でXRP Ledgerの状態が変わることはありません。ただし、暫定的に失敗したトランザクションは、再適用後に成功するか、または別のコードで失敗する可能性があります。詳細は、[結果のファイナリティー](../../../../concepts/transactions/finality-of-results/index.md)と[信頼できるトランザクションの送信](../../../../concepts/transactions/reliable-transaction-submission.md)をご覧ください。

| コード                 | 説明                                                |
|:-----------------------|:----------------------------------------------------|
| `tefALREADY` | まったく同一のトランザクションがすでに適用されています。 |
| `tefBAD_ADD_AUTH` | **廃止予定。** |
| `tefBAD_AUTH` | このアカウントの署名に使用したキーには、このアカウントを変更する権限がありません。（このアカウントが[レギュラーキー](../../../../concepts/accounts/cryptographic-keys.md)として同じキーセットを持っている場合は変更が承認される可能性があります。） |
| `tefBAD_AUTH_MASTER` | このトランザクションを承認するために指定された1つの署名がマスターキーと一致していませんが、このアドレスに関連付けられているレギュラーキーもありません。 |
| `tefBAD_LEDGER` | トランザクションの処理中に、レジャーが予期しない状態にあることが検出されました。このエラーを再現できる場合は、修正のため[問題を報告](https://github.com/XRPLF/rippled/issues)してください。 |
| `tefBAD_QUORUM` | トランザクションは[マルチシグ](../../../../concepts/accounts/multi-signing.md)トランザクションでしたが、そこに含まれるすべての署名の重みの合計が定数を満たしていません。 |
| `tefBAD_SIGNATURE` | トランザクションは[マルチシグ](../../../../concepts/accounts/multi-signing.md)トランザクションでしたが、送信側アカウントに関連付けられているSignerListにないアドレスの署名が含まれていました。 |
| `tefCREATED` | **廃止予定。** |
| `tefEXCEPTION` | トランザクションの処理中に、サーバが予期しない状態になりました。この状態は、予期しない入力（トランザクションのバイナリーデータの形式が大幅に誤っている場合など）が原因となった可能性があります。このエラーを再現できる場合は、修正のため[問題を報告](https://github.com/XRPLF/rippled/issues)してください。 |
| `tefFAILURE` | トランザクション適用中の不明な障害。 |
| `tefINTERNAL` | トランザクションの適用を試みた際に、サーバが予期しない状態になりました。このエラーを再現できる場合は、修正のため[問題を報告](https://github.com/XRPLF/rippled/issues)してください。 |
| `tefINVARIANT_FAILED` | [トランザクションコスト](../../../../concepts/transactions/transaction-cost.md)を請求しようとしたところ、不変性チェックが失敗しました。[EnforceInvariants Amendment][]により追加されました。このエラーを再現できる場合は、[問題を報告](https://github.com/XRPLF/rippled/issues)してください。 |
| `tefMASTER_DISABLED` | トランザクションはアカウントのマスターキーで署名されていましたが、アカウントに`lsfDisableMaster`フィールドが設定されていました。 |
| `tefMAX_LEDGER` | トランザクションには[`LastLedgerSequence`](../../../../concepts/transactions/reliable-transaction-submission.md#lastledgersequence)パラメーターが指定されていましたが、現在のレジャーのシーケンス番号はすでに指定値を上回っています。 |
| `tefNO_AUTH_REQUIRED` | [TrustSetトランザクション][]がトラストラインを承認済みとしてマークしようとしましたが、対応するアカウントに対して`lsfRequireAuth`フラグが有効になっていないため、承認は不要です。 |
| `tefNOT_MULTI_SIGNING` | トランザクションは[マルチシグ](../../../../concepts/accounts/multi-signing.md)トランザクションでしたが、送信側アカウントでSignerListが定義されていません。 |
| `tefPAST_SEQ` | トランザクションのシーケンス番号は、トランザクションの送信元アカウントの現在のシーケンス番号よりも小さい番号です。 |
| `tefTOO_BIG` | レジャー内にある、トランザクションの影響を受けるオブジェクトが多過ぎます。例えば、これは[AccountDeleteトランザクション][]でしたが、削除されるアカウントのレジャーには1,000個を超えるオブジェクトがあります。 |
| `tefWRONG_PRIOR` | トランザクションに`AccountTxnID`フィールド（または廃止予定の`PreviousTxnID`フィールド）が含まれていますが、このフィールドに指定されているトランザクションはアカウントの前のトランザクションに一致しません。 |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
