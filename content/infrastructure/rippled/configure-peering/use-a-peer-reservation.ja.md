---
html: use-a-peer-reservation.html
parent: configure-peering.html
blurb: ピアリザベーションを使用して特定のピアへのより信頼できる接続を設定します。
lables:
  - コアサーバー
---
# ピアリザベーションの使用

[ピアリザベーション][]を使用すると、`rippled`サーバーが予約とマッチしたピアからの通信を常に受け入れるように設定できます。このページでは、ピアリザベーションを使用して2台のサーバー間のピアツーピア通信を、各サーバーの管理者の協力のもと一貫して維持する方法について説明します。

ピアリザベーションは、2台のサーバーが異なる組織によって運用されていて、着信接続を受信するサーバーが、多くのピアを持つ[ハブサーバー](rippled-server-modes.html#公開ハブ)である場合に特に便利です。分かりやすいように、これらの手順では次の用語を使用します。

- **ストックサーバー**は発信接続を行うサーバーです。このサーバーは、ハブサーバー上のピアリザベーションを _使用_ します。
- **ハブサーバー**は着信接続を受信するサーバーです。管理者は、このサーバーにピアリザベーションを _追加_ します。

ただし、一方または両方のサーバーがハブ、バリデータ、ストックサーバーのいずれあっても、これらの手順を使用してピアリザベーションを設定できます。また、よりビジーな状態にあるサーバーから発信接続をする場合にもピアリザベーションを使用できますが、以下のプロセスではそのような構成については説明しません。

## 前提条件

これらの手順を実行するには、次の前提条件を満たしている必要があります。

- 両方のサーバーの管理者が`rippled`を[インストール](install-rippled.html)して実行している。
- 両方のサーバーの管理者が協力することに合意し、連絡が取り合える。秘密情報を共有する必要はないため、パブリックな通信チャネルを使用してもかまいません。
- ハブサーバーが着信ピア接続を受信できる。ファイアウォールをそのように設定する手順については、[ピアリングのポート転送](forward-ports-for-peering.html)を参照してください。
- 両方のサーバーが、同じ[XRP Ledgerネットワーク](parallel-networks.html)（本番XRP Ledger、Testnet、Devnetなど）と同期するように設定されている。

## 手順

ピアリザベーションを使用するには、以下の手順に従います。

### 1.（ストックサーバー）永続ノードキーペアを設定する

ストックサーバーの管理者が、以下の手順を実行します。

永続ノードキーペア値をすでにサーバーに設定している場合は、[ステップ2: ノード公開鍵をピアの管理者に連絡する](#2ストックサーバーのノード公開鍵を連絡する)に進んでください。（例えば、各サーバーの永続ノードキーペアは[サーバークラスターの設定](cluster-rippled-servers.html)の一環として設定します。）

**ヒント:** 永続ノードキーペアの設定は省略可能ですが、この設定をしておけば、サーバーのデータベースの消去や新規マシンへの移行が必要となった場合にピア接続の設定を容易に維持することができます。永続ノードキーペアを設定しない場合は、[server_infoメソッド][]の応答の`pubkey_node`フィールドに表示される、サーバーが自動生成したノード公開鍵を使用できます。

1. [validation_createメソッド][]を使用して新しいランダムキーペアを生成します。（`secret`値を省略します。）

   例:

        rippled validation_create

        Loading: "/etc/rippled.cfg"
        Connecting to 127.0.0.1:5005
        {
           "result" : {
              "status" : "success",
              "validation_key" : "FAWN JAVA JADE HEAL VARY HER REEL SHAW GAIL ARCH BEN IRMA",
              "validation_public_key" : "n9Mxf6qD4J55XeLSCEpqaePW4GjoCR5U1ZeGZGJUCNe3bQa4yQbG",
              "validation_seed" : "ssZkdwURFMBXenJPbrpE14b6noJSu"
           }
        }

   `validation_seed`（ノードシード値）と`validation_public_key`値（ノード公開鍵）を保存します。

2. `rippled`の構成ファイルを編集します。

        vim /etc/opt/ripple/rippled.cfg

   {% include '_snippets/conf-file-location.md' %}<!--_ -->

3. 前のステップで生成した`validation_seed`値を使用して、`[node_seed]`スタンザを追加します。

   例:

        [node_seed]
        ssZkdwURFMBXenJPbrpE14b6noJSu

   **警告:** すべてのサーバーの`[node_seed]`値が一意である必要があります。構成ファイルを別のサーバーにコピーする場合は、`[node_seed]`値を削除するか、変更してください。`[node_seed]`は公開しないようにします。不正使用者がこの値にアクセスできた場合、それを使用してサーバーを偽装し、XRP Ledgerのピアツーピア通信を行う可能性があります。

4. `rippled`サーバーを再起動します。

        systemctl restart rippled

### 2.ストックサーバーのノード公開鍵を連絡する

ストックサーバーの管理者が、ハブサーバーの管理者にストックサーバーのノード公開鍵を伝えます。（ステップ1の`validation_public_key`を使用します。）ハブサーバーの管理者はこの値を以降のステップで使用する必要があります。

### 3.（ハブサーバー）ピアリザベーションを追加する

ハブサーバーの管理者が、以下の手順を実行します。

[peer_reservations_addメソッド][]を使用し、前のステップで入手したノード公開鍵を使用して予約を追加します。例:

```sh
$ rippled peer_reservations_add n9Mxf6qD4J55XeLSCEpqaePW4GjoCR5U1ZeGZGJUCNe3bQa4yQbG "Description here"

Loading: "/etc/opt/ripple/rippled.cfg"
Connecting to 127.0.0.1:5005

{
  "result": {
    "status": "success"
  }
}
```

**ヒント:** 説明はオプションのフィールドです。この予約は誰のためにしたものかを人間が読み取れる形式のメモを追加できます。

### 4.ハブサーバーの現在のIPアドレスとピアポートを連絡する

ハブサーバーの管理者は、サーバーの現在のIPアドレスとピアポートをストックサーバーの管理者に伝える必要があります。ハブサーバーが、ネットワークアドレス変換（NAT）を行なうファイアウォールの内側にある場合は、サーバーの _外部_ IPアドレスを使用します。デフォルトの構成ファイルは、ピアプロトコルにポート51235を使用します。

### 5.（ストックサーバー）ピアサーバーに接続する

ストックサーバーの管理者が、以下の手順を実行します。

[connectメソッド][]を使用して、サーバーをハブサーバーに接続します。例:

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

ハブサーバーの管理者が上記の手順に従ってピアリザベーションを設定した場合、自動的に接続され、可能な限り接続が維持されます。


## 次のステップ

サーバーの管理者は、サーバーに設定された他のピアへの予約を管理できます。（他のサーバーからの予約は確認できません。）次のことを実行できます。

- [peer_reservations_addメソッド][]を使用して、ピアリザベーションの追加や説明の更新を行う。
- [peer_reservations_listメソッド][]を使用して、予約先のサーバーを確認する。
- [peer_reservations_delメソッド][]を使用して、予約を削除する。
- [peersメソッド][]を使用して、現在接続しているピアと使用している帯域幅の量を確認する。

**ヒント:** 不正なピアからの接続を即座に切断するAPIメソッドはありませんが、`firewalld`などのソフトウェアファイアウォールを使用すれば、不正なピアからのサーバーへの接続をブロックできます。例については、コミュニティーによって作成された[rbhスクリプト](https://github.com/gnanderson/rbh)を参照してください。


## 関連項目

- **コンセプト:**
  - [ピアプロトコル](peer-protocol.html)
  - [コンセンサス](consensus.html)
  - [並列ネットワーク](parallel-networks.html)
- **チュートリアル:**
  - [容量の計画](capacity-planning.html)
  - [`rippled`のトラブルシューティング](troubleshoot-the-rippled-server.html)
- **リファレンス:**
  - [peersメソッド][]
  - [peer_reservations_addメソッド][]
  - [peer_reservations_delメソッド][]
  - [peer_reservations_listメソッド][]
  - [connectメソッド][]
  - [fetch_infoメソッド][]
  - [ピアクローラー](peer-crawler.html)


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
