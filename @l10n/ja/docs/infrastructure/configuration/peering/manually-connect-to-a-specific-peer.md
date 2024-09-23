---
html: manually-connect-to-a-specific-peer.html
parent: configure-peering.html
seo:
    description: rippledサーバを特定のピアに接続します。
labels:
  - コアサーバ
---
# 特定のピアへの手動接続

サーバをXRP Ledgerネットワーク内の特定の[ピア](../../../concepts/networks-and-servers/peer-protocol.md)に手動で接続するには、次の手順を実行します。

**ヒント:** サーバが起動時にこのサーバに自動的に接続して、以降も接続を維持するようにするには、そのピアに対して[ピアリザベーション](use-a-peer-reservation.md)を設定することができます。


## 前提条件

- 接続先のピアのIPアドレスを把握しておく必要があります。
- 接続先のピアがXRP Ledger[ピアプロトコル](../../../concepts/networks-and-servers/peer-protocol.md)に使用するポートを把握しておく必要があります。デフォルトでは、ポート51235です。
- サーバからピアへのネットワーク接続を用意する必要があります。例えば、ピアサーバは[ファイアウォールを通じて適切なポートを転送する](forward-ports-for-peering.md)必要があります。
- ピアサーバに使用可能なピアスロットがある必要があります。ピアがすでにピアの最大数に達している場合、ピアサーバのオペレーターに依頼して、サーバの[ピアリザベーション](use-a-peer-reservation.md)を追加してもらいます。

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
  - [`rippled`サーバ](../../../concepts/networks-and-servers/index.md)
- **チュートリアル:**
  - [容量の計画](../../installation/capacity-planning.md)
  - [`rippled`サーバのトラブルシューティング](../../troubleshooting/index.md)
- **リファレンス:**
  - [connectメソッド][]
  - [peersメソッド][]
  - [printメソッド][]
  - [server_infoメソッド][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
