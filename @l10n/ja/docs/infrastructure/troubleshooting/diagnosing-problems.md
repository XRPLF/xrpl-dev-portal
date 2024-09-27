---
html: diagnosing-problems.html
parent: troubleshoot-the-rippled-server.html
seo:
    description: 情報を収集して問題の原因を特定します。
labels:
  - コアサーバ
---
# rippledの問題の診断

`rippled`で問題が発生した場合はまず、問題の特徴を正確に明らかにするため、詳細な情報を収集します。これにより、根本原因を洗い出して修正策を編み出すことが容易になります。

サーバが起動しない場合（クラッシュが発生した場合や自動的にシャットダウンした場合など）は、[rippledサーバが起動しない](server-wont-start.md)で考えられる原因と修正策のリストを確認してください。

このドキュメントでは、サーバが稼働している場合（プロセスがアクティブだがネットワークと同期できない場合を含む）に発生する可能性がある問題の診断手順を説明します。

## server_infoの取得

コマンドラインを使用して、ローカル`rippled`インスタンスからサーバステータス情報を取得できます。例:

```
rippled server_info
```

このコマンドに対するレスポンスには大量の情報が含まれています。これについては、[server_infoメソッド][]で説明します。トラブルシューティングで最も重要なフィールドは以下のとおりです（最も一般的に使われるものから順に説明します）。

- **`server_state`** - ほとんどの場合、このフィールドには`proposing`（[バリデータとして設定されている](../configuration/server-modes/run-rippled-as-a-validator.md)サーバの場合）または`full`（バリデータではないサーバの場合）が表示されます。値が`connected`の場合は、サーバはピアツーピアネットワークの他の部分と通信できますが、共有レジャーの状態を追跡するのに十分なデータがありません。通常、レジャーの残りの部分の状態を同期するには起動後約5～15分かかります。

  - サーバが数時間にわたり`connected`状態である場合、または`full`あるいは`proposing`状態になってから`connected`状態に戻る場合は通常、サーバがネットワークの他の部分よりも遅れています。最も一般的なボトルネックはディスクI/O、ネットワーク帯域幅、RAMです。

  - 例えば、以下のサーバ状態情報は、正常なサーバで同期が3分以内に完了しており（`disconnected`、`connected`、`syncing`の状態に分かれている）、現在は完全に同期された`proposing`状態が約90分間続いていることを示しています。

    ```
    $ ./rippled server_info
    Loading: "/etc/opt/ripple/rippled.cfg"
    2020-Jan-03 22:49:32.834134358 HTTPClient:NFO Connecting to 127.0.0.1:5005

    {
      "result" : {
          "info" : {
          ...（省略）...
            "server_state" : "proposing",
            "server_state_duration_us" : "5183282365",
            "state_accounting" : {
              "connected" : {
                "duration_us" : "126164786",
                "transitions" : 1
              },
              "disconnected" : {
                "duration_us" : "2111321",
                "transitions" : 1
              },
              "full" : {
                "duration_us" : "5183282365",
                "transitions" : 1
              },
              "syncing" : {
                "duration_us" : "5545604",
                "transitions" : 1
              },
              "tracking" : {
                "duration_us" : "0",
                "transitions" : 1
              }
            },
          ...（省略）...
       }
      }
    }
    ```

    サーバが同じ状態間で複数の`transitions`を示している場合、サーバが同期状態を維持できなかったことを示します。`full`または`proposing`状態でない場合、サーバはまだネットワークに同期されていません。長期の間には、インターネット接続が不安定になってサーバの同期が時々失われる場合があります。そのためこれが問題になるのは、同期されていない時間がアップタイムのかなりの部分を占める場合のみです。アップタイムが約24時間経過した後に、`full`または`proposing`状態だった時間がサーバの合計実行時間の99%に満たない場合、不安定になっている原因を調査することをお勧めします。

  - 同期の問題をデバッグする際の参考として、[サーバが同期しない](server-doesnt-sync.md)をご覧ください。

- **`complete_ledgers`** - このフィールドは、サーバに完全なレジャーデータが保管されている[レジャーインデックス](../../references/protocol/data-types/basic-data-types.md#レジャーインデックス)を示します。通常、正常なサーバには連続した最新のレジャーのセット（`"12133424-12133858"`など）があります。

  - 連続していない完全なレジャーのセット（`"11845721-12133420,12133424-12133858"`など）がある場合、サーバで断続的な障害が発生したか、またはネットワークの他の部分との同期が一時的にできなかった可能性があります。このようなケースの最も一般的な原因は、ディスクI/Oまたはネットワーク帯域幅の不足です。

  - 通常、`rippled`サーバはピアから最新のレジャー履歴をダウンロードします。レジャー履歴のギャップが数時間以上続く場合は、欠落データを所有しているピアに接続されていない可能性があります。この状況が発生した場合は、構成ファイルに次のスタンザを追加して再起動すれば、完全な履歴が保管されているRippleのパブリックサーバの1つにサーバを強制的にピア接続できます。

    ```
    [ips_fixed]
    s2.ripple.com 51235
    ```

- **`amendment_blocked`** - このフィールドは通常`server_info`レスポンスでは省略されます。このフィールドの値が`true`の場合は、ネットワークにより承認された[Amendment](../../concepts/networks-and-servers/amendments.md)がサーバに導入されていません。ほとんどの場合は、最新バージョンに[rippledを更新する](../installation/index.md)ことで修正できます。また[featureメソッド][]を使用して、現在有効なAmendment ID、サーバでサポートされているAmendment ID、サーバでサポートされていないAmendment IDを確認することもできます。

- **`peers`** - このフィールドは、サーバが接続しているXRP Ledgerピアツーピアネットワーク内のその他のサーバの数を示します。特定のピアのみに接続するように明示的に構成されているサーバを除き、正常なサーバでは通常5～50ピアと表示されます。

  - ピアの数が0の場合、サーバがネットワークに接続できないか、またはシステムクロックが正しくない可能性があります。（サーバのクロックを同期するため、すべてのサーバで[NTP](http://www.ntp.org/)デーモンを実行することが推奨されます。）

  - ピアの数が10の場合、`rippled`が[NAT](https://en.wikipedia.org/wiki/Network_address_translation)を使用したルーター経由での着信接続を受信できていない可能性があります。接続を改善するには、ルーターのファイアウォールがピアツーピア接続に使用するポート（[デフォルトでは](https://github.com/XRPLF/rippled/blob/8429dd67e60ba360da591bfa905b58a35638fda1/cfg/rippled-example.cfg#L1065)ポート51235）を転送するように設定します。

### サーバからレスポンスがない場合

`rippled`実行可能ファイルがクライアントとして`rippled`サーバに接続できなかった場合、以下のメッセージが返されます。

```json
{
   "error" : "internal",
   "error_code" : 71,
   "error_message" : "Internal error.",
   "error_what" : "no response from server"
}
```

通常これはさまざまな問題の1つを示します。

- `rippled`サーバが起動したばかりであるか、または完全に稼働していません。サービスのステータスを確認してください。稼働している場合は数秒間待ってから再試行してください。
- サーバに接続するために異なる[パラメーターを`rippled`コマンドラインクライアントに](../commandline-usage.md#クライアントモードのオプション)渡す必要があります。
- `rippled`サーバがJSON-RPC接続を受け入れるように構成されていない可能性があります。

## サーバログの確認

[デフォルトでは](https://github.com/XRPLF/rippled/blob/master/cfg/rippled-example.cfg#L1139-L1142)`rippled`はサーバのデバッグログを`/var/log/rippled/debug.log`ファイルに書き込みます。このデバッグログの位置は、サーバの構成ファイルにより異なる可能性があります。`rippled`サービスを（`systemctl`または`service`を使用して開始するのではなく）直接開始した場合、デフォルトではログメッセージはコンソールにも出力されます。

デフォルトの構成ファイルでは、起動時に[log_levelメソッド][]を内部で使用して、すべてのログメッセージカテゴリでログレベルの重大度は「警告」に設定されています。デバッグログの詳細レベルを制御するには、[起動時に`--silent`コマンドラインオプションを使用し](../commandline-usage.md#詳細レベルのオプション)、サーバの稼働中に[log_levelメソッド][]を使用します。（設定については構成ファイルの`[rpc_startup]`スタンザをご覧ください。）

`rippled`サーバが起動中に多数の警告レベルの（`WRN`）メッセージを出力し、その後はときどきいくつかの警告レベルメッセージを出力することは正常です。サーバ起動時の最初の5～15分間に出力されるほとんどの警告は、**安全に無視**できます。

さまざまな種類のログメッセージに関する詳しい説明については、[ログメッセージについて](understanding-log-messages.md)をご覧ください。

## 関連項目

- **コンセプト:**
    - [`rippled`サーバ](../../concepts/networks-and-servers/index.md)
    - [Amendment](../../concepts/networks-and-servers/amendments.md)
- **チュートリアル:**
    - [容量の計画](../installation/capacity-planning.md)
    - [rippledの構成](../configuration/index.md)
- **リファレンス:**
    - [rippled APIリファレンス](../../references/http-websocket-apis/index.md)
      - [`rippled`コマンドラインの使用](../commandline-usage.md)
      - [log_levelメソッド][]
      - [server_infoメソッド][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
