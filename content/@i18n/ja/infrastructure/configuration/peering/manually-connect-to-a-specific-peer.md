---
html: manually-connect-to-a-specific-peer.html
parent: configure-peering.html
blurb: rippledサーバーを特定のピアに接続します。
labels:
  - コアサーバー
---
# 特定のピアへの手動接続

サーバーをXRP Ledgerネットワーク内の特定の[ピア](../../../concepts/networks-and-servers/peer-protocol.md)に手動で接続するには、次の手順を実行します。

**ヒント:** サーバーが起動時にこのサーバーに自動的に接続して、以降も接続を維持するようにするには、そのピアに対して[ピアリザベーション](use-a-peer-reservation.md)を設定することができます。


## 前提条件

- 接続先のピアのIPアドレスを把握しておく必要があります。
- 接続先のピアがXRP Ledger[ピアプロトコル](../../../concepts/networks-and-servers/peer-protocol.md)に使用するポートを把握しておく必要があります。デフォルトでは、ポート51235です。
- サーバーからピアへのネットワーク接続を用意する必要があります。例えば、ピアサーバーは[ファイアウォールを通じて適切なポートを転送する](forward-ports-for-peering.md)必要があります。
- ピアサーバーに使用可能なピアスロットがある必要があります。ピアがすでにピアの最大数に達している場合、ピアサーバーのオペレーターに依頼して、サーバーの[ピアリザベーション](use-a-peer-reservation.md)を追加してもらいます。

## 手順

接続するには、[connectメソッド][]を使用します。例:

{% tabs %}

{% tab label="WebSocket" %}
```
{
    "command": "connect",
    "ip": "169.54.2.151",
    "port": 51235
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
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
{% /tab %}

{% tab label="コマンドライン" %}
```
rippled connect 169.54.2.151 51235
```
{% /tab %}

{% /tabs %}


## 関連項目

- **コンセプト:**
  - [ピアプロトコル](../../../concepts/networks-and-servers/peer-protocol.md)
  - [`rippled`サーバー](../../../concepts/networks-and-servers/index.md)
- **チュートリアル:**
  - [容量の計画](../../installation/capacity-planning.md)
  - [`rippled`サーバーのトラブルシューティング](../../troubleshooting/index.md)
- **リファレンス:**
  - [connectメソッド][]
  - [peersメソッド][]
  - [printメソッド][]
  - [server_infoメソッド][]

{% raw-partial file="/_snippets/common-links.md" /%}
