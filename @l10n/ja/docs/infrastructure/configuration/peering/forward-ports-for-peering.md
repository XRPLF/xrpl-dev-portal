---
html: forward-ports-for-peering.html
parent: configure-peering.html
seo:
    description: 受信ピアがrippledサーバに接続できるようにファイアウォールを設定します。
labels:
  - コアサーバ
---
# ピアリングのポート転送

XRP Ledgerのピアツーピアネットワーク内にあるサーバは、[ピアプロトコル](../../../concepts/networks-and-servers/peer-protocol.md)を介して通信します。セキュリティとネットワークの他の部分との接続を両立させるために、ファイアウォールを使用して、サーバをほとんどのポートから保護し、ピアプロトコルポートだけを開放するか転送するようにする必要があります。

`rippled`サーバの稼動中に、[server_infoメソッド][]を実行すると、いくつのピアがあるか確認することができます。`info`オブジェクトの`peers`フィールドは、サーバに現在接続しているピアの数を示します。この数が10または11の場合、通常はファイアウォールが着信接続をブロックしていることを示します。

ファイアウォールが着信ピア接続をブロックしていると思われるためピアが10個しかないことを示している`server_info`の結果の例（一部省略）は次のとおりです。

```json
$ ./rippled server_info
Loading: "/etc/opt/ripple/rippled.cfg"
2019-Dec-23 22:15:09.343961928 HTTPClient:NFO Connecting to 127.0.0.1:5005

{
   "result" : {
      "info" : {
         ...（省略）...
         "load_factor" : 1,
         "peer_disconnects" : "0",
         "peer_disconnects_resources" : "0",
         "peers" : 10,
         "pubkey_node" : "n9KUjqxCr5FKThSNXdzb7oqN8rYwScB2dUnNqxQxbEA17JkaWy5x",
         "pubkey_validator" : "n9KM73uq5BM3Fc6cxG3k5TruvbLc8Ffq17JZBmWC4uP4csL4rFST",
         "published_ledger" : "none",
         "server_state" : "connected",
         ...（省略）...
      },
      "status" : "success"
   }
}
```

着信接続を許可するために、ピアプロトコルポートを転送するようにファイアウォールを設定します。ピアプロトコルポートは、デフォルトの構成ファイルでは**ポート51235**で提供されます。ポートの転送の手順はファイアウォールによって異なります。例えば、Red Hat Enterprise Linuxで`firewalld`ソフトウェアファイアウォールを使用している場合は、[`firewall-cmd`ツールを使用](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/security_guide/sec-port_forwarding)して、TCPトラフィックを次のように転送します。

```sh
$ sudo firewall-cmd --add-forward-port=port=51235:proto=tcp:toport=51235
```

その他のソフトウェアファイアウォールとハードウェアファイアウォールについては、メーカー公式のドキュメントをご覧ください。


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
