---
html: manually-connect-to-a-specific-peer.html
parent: configure-peering.html
blurb: rippledサーバーを特定のピアに接続します。
labels:
  - コアサーバー
---
# 特定のピアへの手動接続

サーバーをXRP Ledgerネットワーク内の特定の[ピア](peer-protocol.html)に手動で接続するには、次の手順を実行します。

**ヒント:** サーバーが起動時にこのサーバーに自動的に接続して、以降も接続を維持するようにするには、そのピアに対して[ピアリザベーション](use-a-peer-reservation.html)を設定することができます。


## 前提条件

- 接続先のピアのIPアドレスを把握しておく必要があります。
- 接続先のピアがXRP Ledger[ピアプロトコル](peer-protocol.html)に使用するポートを把握しておく必要があります。デフォルトでは、ポート51235です。
- サーバーからピアへのネットワーク接続を用意する必要があります。例えば、ピアサーバーは[ファイアウォールを通じて適切なポートを転送する](forward-ports-for-peering.html)必要があります。
- ピアサーバーに使用可能なピアスロットがある必要があります。ピアがすでにピアの最大数に達している場合、ピアサーバーのオペレーターに依頼して、サーバーの[ピアリザベーション](use-a-peer-reservation.html)を追加してもらいます。

## 手順

接続するには、[connectメソッド][]を使用します。例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
    "command": "connect",
    "ip": "169.54.2.151",
    "port": 51235
}
```

*JSON-RPC*

```
{
    "method": "connect",
    "params": [
        {
            "ip": "169.54.2.151",
            "port": 51235
        }
    ]
}
```


*コマンドライン*

```
rippled connect 169.54.2.151 51235
```

<!-- MULTICODE_BLOCK_END -->


## 関連項目

- **コンセプト:**
  - [ピアプロトコル](peer-protocol.html)
  - [`rippled`サーバー](xrpl-servers.html)
- **チュートリアル:**
  - [容量の計画](capacity-planning.html)
  - [`rippled`サーバーのトラブルシューティング](troubleshoot-the-rippled-server.html)
- **リファレンス:**
  - [connectメソッド][]
  - [peersメソッド][]
  - [printメソッド][]
  - [server_infoメソッド][]

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
