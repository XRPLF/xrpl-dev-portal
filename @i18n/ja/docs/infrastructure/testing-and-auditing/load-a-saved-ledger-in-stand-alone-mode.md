---
html: load-a-saved-ledger-in-stand-alone-mode.html
parent: use-stand-alone-mode.html
seo:
    description: 特定の保存済みレジャーからスタンドアロンモードで開始して、トランザクションのテストやリプレイを行います。
labels:
  - コアサーバ
---
# スタンドアロンモードでの保存済みレジャーの読み込み

以前にディスクに保存していた[履歴レジャーバージョン](../../concepts/ledgers/index.md)を使用して、`rippled`サーバを[スタンドアロンモード](../../concepts/networks-and-servers/rippled-server-modes.md)で起動できます。例えば、以前に`rippled`サーバをXRP Ledgerのピアツーピアネットワーク（[本番Mainnet、Testnet、Devnetなど](../../concepts/networks-and-servers/parallel-networks.md)）と同期していた場合は、過去にサーバで使用できていた任意のレジャーバージョンを読み込むことができます。

履歴レジャーバージョンを読み込むことにより、レジャーを「リプレイ」して、トランザクションがネットワークのルールに従って処理されていたか検証したり、異なる[Amendment](../../concepts/networks-and-servers/amendments.md)を有効にした場合のトランザクションセットの処理の結果を比較したりすることができます。万が一、[XRP Ledgerのコンセンサスメカニズムに対する攻撃](../../concepts/consensus-protocol/consensus-protections.md)が発生して共有レジャーの状態に悪影響が及んでも、このプロセスを始めることで、バリデータのコンセンサスを以前の良好だったネットワークの状態に「ロールバック」できる可能性があります。

## 1. `rippled`を通常の方法で起動します。

既存のレジャーを読み込むには、最初にネットワークから当該のレジャーを取得する必要があります。`rippled`をオンラインモードで通常の方法で起動します。

```
rippled --conf=/path/to/rippled.cfg
```

## 2. `rippled`が同期されるまで待ちます。

[server_infoメソッド][]を使用して、ネットワークに対するサーバの状態を確認します。`server_state`に以下のいずれかの値が示される場合は、サーバは同期しています。

* `full`
* `proposing`
* `validating`

詳細は、[考えられるサーバの状態](../../references/http-websocket-apis/api-conventions/rippled-server-states.md)をご覧ください。

## 3. （省略可）特定のレジャーバージョンを取得します。

最新レジャーのみを必要とする場合は、このステップをスキップできます。

特定の履歴レジャーバージョンを読み込むには、[ledger_requestメソッド][]を実行して`rippled`にそのレジャーバージョンを取得させます。`rippled`にまだレジャーバージョンがない場合は、レジャーの取得が完了するまで`ledger_request`コマンドを複数回実行する必要があります。

特定の履歴レジャーバージョンをリプレイする場合は、リプレイするレジャーバージョンとその直前のレジャーバージョンの両方を取得する必要があります。（前のレジャーバージョンにより、リプレイするレジャーバージョンに記述されている変更を適用する初期状態が設定されます。）

## 4. `rippled`をシャットダウンします。

[stopメソッド][]を使用します。

```
rippled stop --conf=/path/to/rippled.cfg
```

## 5. スタンドアロンモードで`rippled`を起動します。

最新のレジャーバージョンを読み込むには、`-a`オプションと`--load`オプションを指定してサーバを起動します。

```
rippled -a --load --conf=/path/to/rippled.cfg
```

特定の履歴レジャーを読み込むには、`--load`パラメーターと`--ledger`パラメーターを使用し、読み込むレジャーバージョンのレジャーインデックスまたは識別用ハッシュを指定してサーバを起動します。

```
rippled -a --load --ledger 19860944 --conf=/path/to/rippled.cfg
```

スタンドアロンモードで`rippled`を起動するときに使用可能なオプションについての詳細は、[コマンドラインの使用: スタンドアロンモードのオプション ](../commandline-usage.md#スタンドアロンモードのオプション)をご覧ください。

## 6. レジャーを手動で進めます。

スタンドアロンモードで`--ledger`を使用してレジャーを読み込むと、読み込まれたレジャーが現行のオープンレジャーになるので、[レジャーを手動で進める](advance-the-ledger-in-stand-alone-mode.md)必要があります。

```
rippled ledger_accept --conf=/path/to/rippled.cfg
```

## 関連項目

- **コンセプト:**
    - [`rippled`サーバ](../../concepts/networks-and-servers/index.md)
      - [`rippled`サーバのモード](../../concepts/networks-and-servers/rippled-server-modes.md)
    - [コンセンサスについて](../../concepts/consensus-protocol/index.md)
    - [Amendment](../../concepts/networks-and-servers/amendments.md)
- **リファレンス:**
    - [ledger_acceptメソッド][]
    - [server_infoメソッド][]
    - [`rippled`コマンドラインの使用](../commandline-usage.md)
- **ユースケース:**
    - [XRP Ledgerへのコードの提供](/resources/contribute-code/index.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
