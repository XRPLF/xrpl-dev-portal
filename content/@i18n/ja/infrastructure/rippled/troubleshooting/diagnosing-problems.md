---
html: diagnosing-problems.html
parent: troubleshoot-the-rippled-server.html
blurb: 情報を収集して問題の原因を特定します。
labels:
  - コアサーバー
---
# rippledの問題の診断

`rippled`で問題が発生した場合はまず、問題の特徴を正確に明らかにするため、詳細な情報を収集します。これにより、根本原因を洗い出して修正策を編み出すことが容易になります。

サーバーが起動しない場合（クラッシュが発生した場合や自動的にシャットダウンした場合など）は、[rippledサーバーが起動しない](server-wont-start.html)で考えられる原因と修正策のリストを確認してください。

このドキュメントでは、サーバーが稼働している場合（プロセスがアクティブだがネットワークと同期できない場合を含む）に発生する可能性がある問題の診断手順を説明します。

## server_infoの取得

コマンドラインを使用して、ローカル`rippled`インスタンスからサーバーステータス情報を取得できます。例:

```
rippled server_info
```

このコマンドに対する応答には大量の情報が含まれています。これについては、[server_infoメソッド][]で説明します。トラブルシューティングで最も重要なフィールドは以下のとおりです（最も一般的に使われるものから順に説明します）。

- **`server_state`** - ほとんどの場合、このフィールドには`proposing`（[バリデータとして設定されている](run-rippled-as-a-validator.html)サーバーの場合）または`full`（バリデータではないサーバーの場合）が表示されます。値が`connected`の場合は、サーバーはピアツーピアネットワークの他の部分と通信できますが、共有レジャーの状態を追跡するのに十分なデータがありません。通常、レジャーの残りの部分の状態を同期するには起動後約5～15分かかります。

  - サーバーが数時間にわたり`connected`状態である場合、または`full`あるいは`proposing`状態になってから`connected`状態に戻る場合は通常、サーバーがネットワークの他の部分よりも遅れています。最も一般的なボトルネックはディスクI/O、ネットワーク帯域幅、RAMです。

  - 例えば、以下のサーバー状態情報は、正常なサーバーで同期が3分以内に完了しており（`disconnected`、`connected`、`syncing`の状態に分かれている）、現在は完全に同期された`proposing`状態が約90分間続いていることを示しています。

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

    サーバーが同じ状態間で複数の`transitions`を示している場合、サーバーが同期状態を維持できなかったことを示します。`full`または`proposing`状態でない場合、サーバーはまだネットワークに同期されていません。長期の間には、インターネット接続が不安定になってサーバーの同期が時々失われる場合があります。そのためこれが問題になるのは、同期されていない時間がアップタイムのかなりの部分を占める場合のみです。アップタイムが約24時間経過した後に、`full`または`proposing`状態だった時間がサーバーの合計実行時間の99%に満たない場合、不安定になっている原因を調査することをお勧めします。

  - 同期の問題をデバッグする際の参考として、[サーバーが同期しない](server-doesnt-sync.html)を参照してください。

- **`complete_ledgers`** - このフィールドは、サーバーに完全なレジャーデータが保管されている[レジャーインデックス](basic-data-types.html#レジャーインデックス)を示します。通常、正常なサーバーには連続した最新のレジャーのセット（`"12133424-12133858"`など）があります。

  - 連続していない完全なレジャーのセット（`"11845721-12133420,12133424-12133858"`など）がある場合、サーバーで断続的な障害が発生したか、またはネットワークの他の部分との同期が一時的にできなかった可能性があります。このようなケースの最も一般的な原因は、ディスクI/Oまたはネットワーク帯域幅の不足です。

  - 通常、`rippled`サーバーはピアから最新のレジャー履歴をダウンロードします。レジャー履歴のギャップが数時間以上続く場合は、欠落データを所有しているピアに接続されていない可能性があります。この状況が発生した場合は、構成ファイルに次のスタンザを追加して再起動すれば、完全な履歴が保管されているRippleのパブリックサーバーの1つにサーバーを強制的にピア接続できます。

          [ips_fixed]
          s2.ripple.com 51235

- **`amendment_blocked`** - このフィールドは通常`server_info`応答では省略されます。このフィールドの値が`true`の場合は、ネットワークにより承認された[Amendment](amendments.html)がサーバーに導入されていません。ほとんどの場合は、最新バージョンに[rippledを更新する](install-rippled.html)ことで修正できます。また[featureメソッド][]を使用して、現在有効なAmendment ID、サーバーでサポートされているAmendment ID、サーバーでサポートされていないAmendment IDを確認することもできます。

- **`peers`** - このフィールドは、サーバーが接続しているXRP Ledgerピアツーピアネットワーク内のその他のサーバーの数を示します。特定のピアのみに接続するように明示的に構成されているサーバーを除き、正常なサーバーでは通常5～50ピアと表示されます。

  - ピアの数が0の場合、サーバーがネットワークに接続できないか、またはシステムクロックが正しくない可能性があります。（サーバーのクロックを同期するため、すべてのサーバーで[NTP](http://www.ntp.org/)デーモンを実行することが推奨されます。）

  - ピアの数が10の場合、`rippled`が[NAT](https://en.wikipedia.org/wiki/Network_address_translation)を使用したルーター経由での着信接続を受信できていない可能性があります。接続を改善するには、ルーターのファイアウォールがピアツーピア接続に使用するポート（[デフォルトでは](https://github.com/XRPLF/rippled/blob/8429dd67e60ba360da591bfa905b58a35638fda1/cfg/rippled-example.cfg#L1065)ポート51235）を転送するように設定します。

### サーバーから応答がない場合

`rippled`実行可能ファイルがクライアントとして`rippled`サーバーに接続できなかった場合、以下のメッセージが返されます。

```json
{
   "error" : "internal",
   "error_code" : 71,
   "error_message" : "Internal error.",
   "error_what" : "no response from server"
}
```

通常これはさまざまな問題の1つを示します。

- `rippled`サーバーが起動したばかりであるか、または完全に稼働していません。サービスのステータスを確認してください。稼働している場合は数秒間待ってから再試行してください。
- サーバーに接続するために異なる[パラメーターを`rippled`コマンドラインクライアントに](commandline-usage.html#クライアントモードのオプション)渡す必要があります。
- `rippled`サーバーがJSON-RPC接続を受け入れるように構成されていない可能性があります。

## サーバーログの確認

[デフォルトでは](https://github.com/XRPLF/rippled/blob/master/cfg/rippled-example.cfg#L1139-L1142)`rippled`はサーバーのデバッグログを`/var/log/rippled/debug.log`ファイルに書き込みます。このデバッグログの位置は、サーバーの構成ファイルにより異なる可能性があります。`rippled`サービスを（`systemctl`または`service`を使用して開始するのではなく）直接開始した場合、デフォルトではログメッセージはコンソールにも出力されます。

デフォルトの構成ファイルでは、起動時に[log_levelメソッド][]を内部で使用して、すべてのログメッセージカテゴリーでログレベルの重大度は「警告」に設定されています。デバッグログの詳細レベルを制御するには、[起動時に`--silent`コマンドラインオプションを使用し](commandline-usage.html#詳細レベルのオプション)、サーバーの稼働中に[log_levelメソッド][]を使用します。（設定については構成ファイルの`[rpc_startup]`スタンザを参照してください。）

`rippled`サーバーが起動中に多数の警告レベルの（`WRN`）メッセージを出力し、その後はときどきいくつかの警告レベルメッセージを出力することは正常です。サーバー起動時の最初の5～15分間に出力されるほとんどの警告は、**安全に無視**できます。

さまざまな種類のログメッセージに関する詳しい説明については、[ログメッセージについて](understanding-log-messages.html)を参照してください。

## 関連項目

- **コンセプト:**
    - [`rippled`サーバー](xrpl-servers.html)
    - [Amendment](amendments.html)
- **チュートリアル:**
    - [容量の計画](capacity-planning.html)
    - [rippledの構成](configure-rippled.html)
- **リファレンス:**
    - [rippled APIリファレンス](http-websocket-apis.html)
      - [`rippled`コマンドラインの使用](commandline-usage.html)
      - [log_levelメソッド][]
      - [server_infoメソッド][]

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
