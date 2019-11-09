# スタンドアロンモードでの新しいジェネシスレジャーの開始

スタンドアロンモードでは`rippled`に新しいジェネシスレジャーを作成させることができます。これにより既知の状態が実現され、本番環境のXRP Ledgerのレジャー履歴は使用されません。（これは単体テストなどに特に便利です。）

* スタンドアロンモードで新しいジェネシスレジャーを使用して`rippled`を起動するには、`-a`オプションと`--start`オプションを使用します。

```
rippled -a --start --conf=/path/to/rippled.cfg
```

スタンドアロンモードで`rippled`を起動時に使用できるオプションについての詳細は、[コマンドラインの使用リファレンスのスタンドアロンモードのオプション](commandline-usage.html#スタンドアロンモードのオプション)を参照してください。

ジェネシスレジャーの[ジェネシスアドレス](accounts.html#特別なアドレス)は1,000億XRPすべてを保有しています。ジェネシスアドレスのキーは以下のように[ハードコーディング](https://github.com/ripple/rippled/blob/94ed5b3a53077d815ad0dd65d490c8d37a147361/src/ripple/app/ledger/Ledger.cpp#L184)されています。

**アドレス:** `rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh`

**シークレット:** `snoPBrXtMeMyMHUVTgbuqAfg1SUTb`（"masterpassphrase"）

## 新しいジェネシスレジャーの設定

新しいジェネシスレジャーでは、デフォルトでハードコーディングされる[準備金](reserves.html)は**200 XRP**です。この額は、新規アドレスに支給される最低額で、レジャーの1オブジェクトにつき**50 XRP**ずつ増加します。これらは本番環境ネットワークの現在の必要準備金よりも大きな値です。（関連項目: [手数料投票](fee-voting.html)）

デフォルトでは、新しいジェネシスレジャーでは[Amendment](amendments.html)が有効になっていません。`--start`を使用して新しいジェネシスレジャーを開始する場合、ジェネシスレジャーには、構成ファイルで明示的に無効にされたAmendmentを除き、`rippled`サーバーでネイティブにサポートされているすべてのAmendmentを有効にする[EnableAmendment疑似トランザクション](enableamendment.html)が含まれています。これらのAmendmentの効果は、直後のレジャーバージョンから反映されます。（留意事項: スタンドアロンモードでは[レジャーを手動で進める](advance-the-ledger-in-stand-alone-mode.html)必要があります。）[新規: rippled 0.50.0][]

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
