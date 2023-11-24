---
html: understanding-log-messages.html
parent: troubleshoot-the-rippled-server.html
blurb: デバッグログの警告メッセージとエラーメッセージを解釈して対応します。
labels:
  - コアサーバー
---
# ログメッセージについて

以下のセクションでは、[`rippled`サーバー](xrpl-servers.html)のデバッグログに出力される最も一般的なログメッセージタイプとその解釈を説明します。

これは、`rippled`の[問題を診断する](diagnosing-problems.html)上で重要なステップです。

## クラッシュ

ログに記録されたランタイムエラーのメッセージは、サーバーがクラッシュしたことを示している可能性があります。このようなメッセージは通常、以下の例に示すいずれかのメッセージで始まります。

```
Throw<std::runtime_error>
```

```
Terminating thread rippled: main: unhandled St13runtime_error
```

サーバーが起動時に常にクラッシュする場合は、[サーバーが起動しない](server-wont-start.html)で考えられる原因を参照してください。

サーバーが稼働中にランダムにクラッシュする場合、または特定のコマンドを実行するとクラッシュする場合は、`rippled`が最新バージョンに[更新](install-rippled.html)されていることを確認してください。最新バージョンに更新済で、サーバーがクラッシュする場合は、以下の点を確認してください。

- サーバーのメモリーが不足していませんか。一部のシステムでは、OOM（Out Of Memory）Killerやその他の監視プロセスによって`rippled`が終了されることがあります。
- サーバーが共有環境で稼働している場合、他のユーザーや管理者によってマシンまたはサービスが再起動されますか。たとえば、一部のホステッドプロバイダーは、長期にわたって共有マシンのリソースを大量に消費するサービスを自動的に終了します。
- サーバーは`rippled`を実行するための[最小要件](system-requirements.html)を満たしていますか。[本番環境サーバーに関する推奨事項](system-requirements.html#推奨される仕様)を適用していますか。

上記のいずれにも該当しない場合は、その問題をセキュリティ上重要なバグとしてRippleに報告してください。Rippleでクラッシュを再現できる場合は、報奨を受領できる可能性があります。詳細は<https://ripple.com/bug-bounty/>を参照してください。


## Already validated sequence at or past

以下のようなログメッセージが出力される場合は、サーバーが異なるレジャーインデックスの検証を順不同で受信しています。

```text
2018-Aug-28 22:55:58.316094260 Validations:WRN Val for 2137ACEFC0D137EFA1D84C2524A39032802E4B74F93C130A289CD87C9C565011 trusted/full from nHUeUNSn3zce2xQZWNghQvd9WRH6FWEnCBKYVJu2vAizMxnXegfJ signing key n9KcRZYHLU9rhGVwB9e4wEMYsxXvUfgFxtmX25pc1QPNgweqzQf5 already validated sequence at or past 12133663 src=1
```

この種類のメッセージが時折発生しても通常は問題ありません。この種類のメッセージが同じ送信バリデータで頻繁に発生する場合は、以下のような問題がある可能性があります（可能性の高いものから順に示しています）。

- メッセージを書き込むサーバーにネットワークの問題がある。
- メッセージに表示されているバリデータにネットワークの問題がある。
- メッセージに表示されているバリデータが悪意のある振る舞いをしている。


## Connection reset by peer

以下のメッセージは、ピア`rippled`サーバーによって接続が閉じられたことを示します。

```text
2018-Aug-28 22:55:41.738765510 Peer:WRN [012] onReadMessage: Connection reset by peer
```

ピアツーピアネットワークで接続が時折失われることは、特に異常な動作ではありません。**この種類のメッセージが時折発生しても問題ではありません。**

このようなメッセージが同時に大量に出力される場合は、以下のような問題がある可能性があります。

- 1つ以上の特定のピアへのインターネット接続が切断されている。
- サーバーからの要求でピアに過剰な負担がかかり、ピアがサーバーをドロップした。


## InboundLedger 11 timeouts for ledger

```text
InboundLedger:WRN 11 timeouts for ledger 8265938
```

これは、サーバーがそのピアに対して特定のレジャーデータを要求する際に問題が発生していることを示しています。[レジャーインデックス](basic-data-types.html#レジャーインデックス)が、[server_infoメソッド][]により報告される最新の検証済みレジャーのインデックスよりもかなり小さい場合は、サーバーが[履歴シャード](history-sharding.html)のダウンロード中である可能性があります。

これは厳密には問題ではありませんが、レジャー履歴を迅速に取得したい場合は、`[ips_fixed]`構成スタンザを追加または編集してからサーバーを再起動することで、すべての履歴が記録されたピアに接続するように`rippled`を構成できます。たとえば、すべての履歴が記録されたRippleのサーバーに常に接続するには、以下のようにします。

```
[ips_fixed]
s2.ripple.com 51235
```


## InboundLedger Want hash

以下のようなログメッセージは、サーバーが他のサーバーにレジャーデータを要求していることを示しています。

```text
InboundLedger:WRN Want: 5AE53B5E39E6388DBACD0959E5F5A0FCAF0E0DCBA45D9AB15120E8CDD21E019B
```

これは、サーバーの同期中、埋め戻し中、[履歴シャード](history-sharding.html)のダウンロード中は正常です。


## LoadMonitor:WRN Job

以下のようなメッセージは、機能の実行に時間がかかっている場合（この例では11秒以上）に出力されます。

```text
2018-Aug-28 22:56:36.180827973 LoadMonitor:WRN Job: gotFetchPack run: 11566ms wait: 0ms
```

以下のようなメッセージは、ジョブの実行待機に時間がかかっている場合（この例でも11秒以上）に出力されます。

```text
2018-Aug-28 22:56:36.180970431 LoadMonitor:WRN Job: processLedgerData run: 0ms wait: 11566ms
2018-Aug-28 22:56:36.181053831 LoadMonitor:WRN Job: AcquisitionDone run: 0ms wait: 11566ms
2018-Aug-28 22:56:36.181110594 LoadMonitor:WRN Job: processLedgerData run: 0ms wait: 11566ms
2018-Aug-28 22:56:36.181169931 LoadMonitor:WRN Job: AcquisitionDone run: 0ms wait: 11566ms
```

ジョブの実行に時間がかかり、そのジョブの完了を他のジョブが待っている場合に、この2種類のメッセージが同時に出力されることがよくあります。

サーバー起動後の**最初の数分間**にこの種類のメッセージがいくつか発生することは**特に異常な動作ではありません**。

サーバーの起動後5分以上にわたってこれらのメッセージが継続する場合、特に`run`時間が1000msを大きく上回る場合は、**サーバーに十分なリソース（ディスクI/O、RAM、CPUなど）がない**可能性があります。この原因として、使用しているハードウェアの性能が不十分であること、または同じハードウェアで実行されている他のプロセスがリソースをめぐって`rippled`と競合していることが考えられます。（`rippled`とリソースをめぐって競合する可能性のある他のプロセスの例としては、スケジュール済みバックアップ、ウィルススキャナー、定期的なデータベースクリーナーなどがあります。）

考えられるもう1つの原因として、回転型ハードディスクでNuDBの使用を試みていることが挙げられます。NuDBはソリッドステートドライブ（SSD）でのみ使用してください。`rippled`のデータベースには常にSSDストレージの使用が推奨されますが、RocksDBを使用する回転型ディスクで`rippled`を正常に稼働できる _可能性があります_ 。回転型ディスクを使用している場合は、`[node_db]`と`[shard_db]`（使用している場合）の両方がRocksDBを使用するように設定されていることを確認してください。例:

```
[node_db]
type=RocksDB
# ... more config omitted

[shard_db]
type=RocksDB
```


## No hash for fetch pack

以下のようなメッセージは、[履歴シャーディング](history-sharding.html)のために履歴レジャーをダウンロードする際に、`rippled` v1.1.0以前のバグが原因で発生します。

```text
2018-Aug-28 22:56:21.397076850 LedgerMaster:ERR No hash for fetch pack. Missing Index 7159808
```

これらは安全に無視できます。


## Potential Censorship

XRP Ledgerが取引検閲の可能性を検出すると、以下のようなログメッセージが出力されます。ログメッセージと取引検閲検出機能の詳細は、[取引検閲の検知](transaction-censorship-detection.html)を参照してください。

**警告メッセージ**

```text
LedgerConsensus:WRN Potential Censorship: Eligible tx E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7, which we are tracking since ledger 18851530 has not been included as of ledger 18851545.
```

**エラーメッセージ**

```text
LedgerConsensus:ERR Potential Censorship: Eligible tx E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7, which we are tracking since ledger 18851530 has not been included as of ledger 18851605. Additional warnings suppressed.
```


## シャード: No such file or directory

`rippled` 1.3.1のバグが原因で、[履歴シャーディング](history-sharding.html)を有効にしたときに次のようなログメッセージが書き込まれることがあります。

```text
ShardStore:ERR shard 1804: No such file or directory
ShardStore:ERR shard 354: No such file or directory
ShardStore:ERR shard 408: No such file or directory
ShardStore:ERR shard 2927: No such file or directory
ShardStore:ERR shard 2731: No such file or directory
ShardStore:ERR shard 2236: No such file or directory
```

これは、サーバーが新しい履歴シャードの取得を開始しようとしたものの、シャードを格納するための新しいディレクトリーを作成できなかったことを示します。このバグにより、rippled 1.3.1は新しいシャードを取得できません。[修正は近日リリース予定](https://github.com/XRPLF/rippled/pull/3014)です。

このエラーは、上記のバグのほかに、`rippled`が**起動後**に基となるファイルシステムに書き込めなくなった場合にも起こります。考えられる原因は次のとおりです。

- ストレージメディアのハードウェア障害
- ファイルシステムがアンマウントされた
- シャードフォルダーが削除された

**ヒント:** 一般的に、サービスが停止している場合は、`rippled`のデータベースファイルを削除しても安全ですが、サーバーの稼働中には決してデータベースファイルを削除しないでください。


## Unable to determine hash of ancestor

以下のようなログメッセージは、サーバーがピアからの検証メッセージを認識するけれども、サーバーが基盤としている親レジャーバージョンを認識しない場合に発生します。これは、サーバーがネットワークの他の部分と同期していない場合に発生することがあります。

```text
2018-Aug-28 22:56:22.256065549 Validations:WRN Unable to determine hash of ancestor seq=3 from ledger hash=00B1E512EF558F2FD9A0A6C263B3D922297F26A55AEB56A009341A22895B516E seq=12133675
```

{% include '_snippets/unsynced_warning_logs.ja.md' %}
<!--_ -->


## View of consensus changed during open

以下のようなログメッセージが出力される場合は、サーバーがネットワークの他の部分と同期していません。

```text
2018-Aug-28 22:56:22.368460130 LedgerConsensus:WRN View of consensus changed during open status=open,  mode=proposing
2018-Aug-28 22:56:22.368468202 LedgerConsensus:WRN 96A8DF9ECF5E9D087BAE9DDDE38C197D3C1C6FB842C7BB770F8929E56CC71661 to 00B1E512EF558F2FD9A0A6C263B3D922297F26A55AEB56A009341A22895B516E
2018-Aug-28 22:56:22.368499966 LedgerConsensus:WRN {"accepted":true,"account_hash":"89A821400087101F1BF2D2B912C6A9F2788CC715590E8FA5710F2D10BF5E3C03","close_flags":0,"close_time":588812130,"close_time_human":"2018-Aug-28 22:55:30.000000000","close_time_resolution":30,"closed":true,"hash":"96A8DF9ECF5E9D087BAE9DDDE38C197D3C1C6FB842C7BB770F8929E56CC71661","ledger_hash":"96A8DF9ECF5E9D087BAE9DDDE38C197D3C1C6FB842C7BB770F8929E56CC71661","ledger_index":"3","parent_close_time":588812070,"parent_hash":"5F5CB224644F080BC8E1CC10E126D62E9D7F9BE1C64AD0565881E99E3F64688A","seqNum":"3","totalCoins":"100000000000000000","total_coins":"100000000000000000","transaction_hash":"0000000000000000000000000000000000000000000000000000000000000000"}
```

{% include '_snippets/unsynced_warning_logs.ja.md' %}
<!--_ -->


## We are not running on the consensus ledger

```text
NetworkOPs:WRN We are not running on the consensus ledger
```

{% include '_snippets/unsynced_warning_logs.ja.md' %}
<!--_ -->


## 関連項目

- **コンセプト:**
    - [`rippled`サーバー](xrpl-servers.html)
    - [技術に関するよくある質問](technical-faq.html)
- **チュートリアル:**
    - [問題の診断](diagnosing-problems.html)
    - [容量の計画](capacity-planning.html)
- **リファレンス:**
    - [rippled APIリファレンス](http-websocket-apis.html)
      - [`rippled`コマンドラインの使用](commandline-usage.html)
      - [server_infoメソッド][]

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
