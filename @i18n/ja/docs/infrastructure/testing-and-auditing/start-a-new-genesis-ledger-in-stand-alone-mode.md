---
html: start-a-new-genesis-ledger-in-stand-alone-mode.html
parent: use-stand-alone-mode.html
seo:
    description: スタンドアロンモードで新しいジェネシスレジャーを開始します。
labels:
  - コアサーバ
---
# スタンドアロンモードでの新しいジェネシスレジャーの開始

スタンドアロンモードでは`rippled`に新しいジェネシスレジャーを作成させることができます。これにより既知の状態が実現され、本番環境のXRP Ledgerのレジャー履歴は使用されません。（これは単体テストなどに特に便利です。）

* スタンドアロンモードで新しいジェネシスレジャーを使用して`rippled`を起動するには、`-a`オプションと`--start`オプションを使用します。

```
rippled -a --start --conf=/path/to/rippled.cfg
```

スタンドアロンモードで`rippled`を起動時に使用できるオプションについての詳細は、[コマンドラインの使用リファレンスのスタンドアロンモードのオプション](../commandline-usage.md#スタンドアロンモードのオプション)をご覧ください。

ジェネシスレジャーの[ジェネシスアドレス](../../concepts/accounts/addresses.md#特別なアドレス)は1,000億XRPすべてを保有しています。ジェネシスアドレスのキーは以下のように[ハードコーディング](https://github.com/XRPLF/rippled/blob/94ed5b3a53077d815ad0dd65d490c8d37a147361/src/ripple/app/ledger/Ledger.cpp#L184)されています。

**アドレス:** `rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh`

**シークレット:** `snoPBrXtMeMyMHUVTgbuqAfg1SUTb`（"masterpassphrase"）

## 新しいジェネシスレジャーの設定

新しいジェネシスレジャーでは、デフォルトでハードコーディングされる[準備金](../../concepts/accounts/reserves.md)は**200 XRP**です。この額は、新規アドレスに支給される最低額で、レジャーの1オブジェクトにつき**50 XRP**ずつ増加します。これらは本番環境ネットワークの現在の必要準備金よりも大きな値です。（関連項目: [手数料投票](../../concepts/consensus-protocol/fee-voting.md)）

デフォルトでは、新しいジェネシスレジャーでは[Amendment](../../concepts/networks-and-servers/amendments.md)が有効になっていません。`--start`を使用して新しいジェネシスレジャーを開始する場合、ジェネシスレジャーには、構成ファイルで明示的に無効にされたAmendmentを除き、`rippled`サーバでネイティブにサポートされているすべてのAmendmentを有効にする[EnableAmendment疑似トランザクション](../../references/protocol/transactions/pseudo-transaction-types/enableamendment.md)が含まれています。これらのAmendmentの効果は、直後のレジャーバージョンから反映されます。（留意事項: スタンドアロンモードでは[レジャーを手動で進める](advance-the-ledger-in-stand-alone-mode.md)必要があります。）{% badge href="https://github.com/XRPLF/rippled/releases/tag/0.50.0" %}新規: rippled 0.50.0{% /badge %}

{% raw-partial file="/docs/_snippets/common-links.md" /%}
