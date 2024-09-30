前のステップで署名したトランザクションblobを`rippled`サーバに送信します。これは`rippled`サーバを実行していなくても安全にできます。レスポンスには仮の結果が含まれ、それは`tesSUCCESS`であるべきですが、この結果は[通常は最終的なものではありません](../concepts/transactions/finality-of-results/index.md)。[キューに入れられたトランザクション](../concepts/transactions/transaction-cost.md#queued-transactions)は通常、次のオープンレジャーのバージョンに含まれるからです(通常、送信から約10秒後となります)。

**ヒント:** 仮の結果が `tefMAX_LEDGER` であった場合、そのトランザクションの`LastLedgerSequence`パラメータが現在のレジャー番号よりも低いため、そのトランザクションが失敗しています。これは、トランザクション情報を準備してから送信するまでに、予想されるレジャーのバージョン数よりも長くかかった場合に起こります。このような場合は、`LastLedgerSequence`の値を大きくしてステップ1からやり直してください。
