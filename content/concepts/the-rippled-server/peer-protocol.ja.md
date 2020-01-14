# ピアプロトコル

XRP Ledgerのサーバーは、XRP Ledgerピアプロトコル（RTXP）を使用して相互に通信します。

ピアプロトコルは、XRP Ledgerのサーバー間のメイン通信モードです。XRP Ledgerの動作、進捗状況、接続に関するすべての情報がピアプロトコルを通じて伝達されます。ピアツーピア通信の例を以下に示します。

- ピアツーピアネットワーク内の他のサーバーへの接続の要求、または接続スロットの使用可能性についてのアドバタイズ。
- ネットワークのその他の部分との候補トランザクションの共有。
- 履歴レジャーへのレジャーデータの要求、またはレジャーデータの提供。
- コンセンサスのための一連のトランザクションの提示、またはコンセンサストランザクションセットの適用に関する算出結果の共有。

ピアツーピア接続を確立するには、サーバーどうしをHTTPSで接続し、一方のサーバーはRTXPへの切り替えのために[HTTPアップグレード](https://tools.ietf.org/html/rfc7230#section-6.7)を要求します。（詳細は、[`rippled`リポジトリ](https://github.com/ripple/rippled)の[Overlay Network](https://github.com/ripple/rippled/blob/906ef761bab95f80b0a7e0cab3b4c594b226cf57/src/ripple/overlay/README.md#handshake)を参照してください。）

## ピア発見

**Note:** この部分は日本語ではまだ利用できません。助けたいと思うなら、[提供して下さい！](https://github.com/ripple/xrpl-dev-portal#contributing)

The XRP Ledger uses a "gossip" protocol to help find servers find others to connect to in the XRP Ledger network. Whenever a server starts up, it reconnects to any other peers it previously connected to. As a fallback, it uses the [hardcoded public hubs](https://github.com/ripple/rippled/blob/fa57859477441b60914e6239382c6fba286a0c26/src/ripple/overlay/impl/OverlayImpl.cpp#L518-L525). After a server successfully connects to a peer, it asks that peer for the contact information (generally, IP address and port) of other XRP Ledger servers that may also be seeking peers. The server can then connect to those servers, and ask them for the contact information of yet more XRP Ledger servers to peer with. Through this process, the server establishes enough peer connections that it can remain reliably connected to the rest of the network even if it loses a connection to any single peer.

Typically, a server needs to connect to a public hub only once, for a short amount of time, to find other peers. After doing so, the server may or may not remain connected to the hub, depending on how stable its network connection is, how busy the hub is, and how many other high-quality peers the server finds. The server saves the addresses of these other peers so it can try reconnecting directly to those peers later, after a network outage or a restart.

The [peers method][] shows a list of peers your server is currently connected to.

For certain high-value servers (such as important [validators](rippled-server-modes.html)) you may prefer not to have your server connect to untrusted peers through the peer discovery process. In this case, you can configure your server to use [private peers](#プライベートピア) only.

## ピアプロトコルポート

XRP Ledgerに参加するため、`rippled`サーバーはピアプロトコルを使用して任意のピアに接続します。（すべてのピアは、現行サーバーで[クラスター化されている](clustering.html)場合を除き、信頼できないものとして扱われます。）

サーバーがピアポートで接続を送信 _かつ_ 受信できることが理想的です。ピアプロトコルに使用するポートを、ファイアウォール経由で`rippled`サーバーに転送する必要があります。[デフォルトの`rippled`構成ファイル](https://github.com/ripple/rippled/blob/master/cfg/rippled-example.cfg)は、すべてのネットワークインターフェイスでポート51235で着信ピアプロトコル接続を待機します。使用するポートを変更するには、`rippled.cfg`ファイル内の該当するスタンザを編集します。

例:

```
[port_peer]
port = 51235
ip = 0.0.0.0
protocol = peer
```

ピアプロトコルポートは[特殊なPeer Crawler APIメソッド](peer-crawler.html)も処理します。

## ノードキーペア

サーバーを初めて起動すると、ピアプロトコル通信でサーバー自体を識別するための _ノードキーペア_ が生成されます。サーバーはこのキーを使用して、ピアプロトコル通信のすべてに署名します。これにより、ピアツーピアネットワーク内の別のサーバーからのメッセージの整合性を、信頼できる方法で識別、検証できます。これは、そのサーバーのメッセージが信頼できないピアにより中継される場合も同様です。

ノードキーペアはデータベースに保存され、サーバーの再起動時に再利用されます。サーバーのデータベースを削除すると、新しいノードキーペアが作成され、異なるアイデンティティでオンラインになります。データベースが削除されても同じキーペアを再利用するには、`[node_seed]`スタンザを使用してサーバーを設定できます。`[node_seed]`スタンザでの使用に適した値を生成するには、[validation_createメソッド][]を使用します。

ノードキーペアは、このサーバーと共に[クラスター化](clustering.html)されている他のサーバーも識別します。サーバークラスターを使用している場合、一意の`[node_seed]`設定を使用してクラスター内の各サーバーを構成する必要があります。クラスターの設定についての詳細は、[`rippled`サーバーのクラスター化](cluster-rippled-servers.html)を参照してください。


## Fixed Peers and Peer Reservations
<a id="pros-and-cons-of-peering-configurations"></a> <!-- TODO: remove this anchor when the corresponding section is translated -->

**注意:** 現在の所はこの部分は日本語では利用できません。[英語版](/{{currentpage.html}})をご覧下さい。


## プライベートピア

`rippled`サーバーが「プライベート」サーバーとして動作するように設定し、そのIPアドレスを非公開にすることができます。これは、信頼できるバリデータなどの重要な`rippled`サーバーへのサービス拒否攻撃や侵入の試みに対する予防対策として有用です。ピアツーピアネットワークに参加するには、プライベートサーバーは1つ以上の非プライベートサーバーに接続するように設定されている必要があります。この非プライベートサーバーにより、メッセージがネットワークのその他の部分へ中継されます。

サーバーをプライベートサーバーとして設定すると次のさまざまな影響が生じます。

- サーバーがピアツーピアネットワーク内の他のサーバーに接続するように明示的に設定されていない場合、サーバーは他のサーバーに発信接続しません。
- サーバーは、他のサーバーからの接続を受け入れるように明示的に設定されていない場合、他のサーバーからの着信接続を受け入れません。
- サーバーはそのダイレクトピアに対し、信頼できない通信（[ピアクローラーAPI応答](peer-crawler.html)を含む）の中ではサーバーのIPアドレスを公開しないように指示します。これは、[peers adminメソッド][peers method]などの信頼できる通信には影響しません。

    プライベートサーバーの設定に関係なく、バリデータは常にそのピアに対し、バリデータのIPアドレスを非公開にするように指示します。これにより、バリデータがサービス拒否攻撃を受け過剰な負荷がかかることから保護されます。[新規: rippled 1.2.1][]

    **注意:** サーバーのソースコードを改ざんして、サーバーがこの要求を無視し、直近のピアのIPアドレスを共有する可能性があります。プライベートサーバーを、このように改ざんされていないことが確認されているサーバーにのみ接続するように設定してください。


### プライベートサーバーの設定

サーバーがプライベートピアとして動作するように設定するには、`rippled`構成ファイルの`[peer_private]`スタンザを使用します。`[ips_fixed]`を使用して、サーバーの接続先サーバーをリストします。（`[ips_fixed]`にアドレスを指定せずに`[peer_private]`を有効にすると、サーバーはネットワークに接続しません。）追加の予防対策として、ファイアウォールを使用して他のサーバーからの着信接続をブロックします。

設定例:

```
# Configuration on a private server that only connects through
# a second rippled server at IP address 10.1.10.55
[ips_fixed]
10.1.10.55

[peer_private]
1
```


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
