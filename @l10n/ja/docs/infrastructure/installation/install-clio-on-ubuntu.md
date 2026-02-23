---
html: install-clio-on-ubuntu.html
parent: install-rippled.html
seo:
    description: Ubuntu Linuxにコンパイル済みのClioバイナリをインストールします。
labels:
  - Clioサーバ
---
# Ubuntu LinuxへのClioのインストール

このページでは、[`apt`](https://ubuntu.com/server/docs)を使用して、**Ubuntu Linux 20.04 以降**にClioの最新安定版をインストールするための推奨手順を説明します。

これらの手順はRippleによってコンパイルされたバイナリをインストールします。Clioをソースからビルドする方法については、[Clioソースコードリポジトリ](https://github.com/XRPLF/clio)をご覧ください。


## 前提条件

Clioをインストールする前に、以下の条件を満たしている必要があります。

- お使いのシステムが[システム要件](system-requirements.md)を満たしていることを確認してください。

    {% admonition type="info" name="Note" %}Clioのシステム要件は`rippled`サーバと同じですが、同じ量のレジャー履歴を保存するのに必要なディスク容量はClioの方が少なくなります。{% /admonition %}

-  互換性のあるバージョンのCMakeとBoostが必要です。ClioにはC++20とBoost 1.75.0以上が必要です。

- ローカルまたはリモートで実行されているCassandraクラスタにアクセスします。[Cassandraのインストールほうほ](https://cassandra.apache.org/doc/latest/cassandra/getting_started/installing.html)に従ってCassandraクラスタを手動でインストールして構成するか、次のコマンドのいずれかを使用してDockerコンテナ上でCassandraを実行できます。

    -  Clioデータを永続化する場合は、DockerコンテナでCassandraを実行し、Clioデータを格納する空のディレクトリを指定します：

        ```
        docker run --rm -it --network=host --name cassandra  -v $PWD/cassandra_data:/var/lib/
        cassandra cassandra:4.0.4
        ```

    - Clioのデータを永続化したくない場合は、以下のコマンドを実行してください。

        ```
        docker run --rm -it --network=host --name cassandra cassandra:4.0.4
        ```

- P2Pモードでは1つ以上の`rippled`サーバにgRPCでアクセスする必要があります。この`rippled`サーバはローカルでもリモートでも構いませんが、信頼する必要があります。最も確実な方法は、[`rippled`を自分でインストール](index.md)することです。


## インストールの手順

1. リポジトリを更新します。

    ```
    sudo apt -y update
    ```

    {% admonition type="success" name="ヒント" %}すでに同じマシンに`rippled`の最新版をインストールしている場合、Rippleのパッケージリポジトリと署名キーを追加する以下のステップは省略できます。ステップ5の"Rippleリポジトリを取得します。"から再開します。{% /admonition %}

2. ユーティリティをインストールします。

    ```
    sudo apt -y install apt-transport-https ca-certificates wget gnupg
    ```

3.  Rippleのパッケージ署名用のGPGキーを、信頼できるキーのリストに追加します。

    ```
    sudo mkdir /usr/local/share/keyrings/
    wget -q -O - "https://repos.ripple.com/repos/api/gpg/key/public" | gpg --dearmor > ripple-key.gpg
    sudo mv ripple-key.gpg /usr/local/share/keyrings
    ```

4. 追加したキーのフィンガープリントを確認します。

    ```
    gpg /usr/local/share/keyrings/ripple-key.gpg
    ```

    出力に、次のようなRipple用のエントリが含まれていることを確認してください。

    ```
    gpg: WARNING: no command supplied.  Trying to guess what you mean ...
    pub   ed25519 2026-02-16 [SC] [expires: 2033-02-14]
        E057C1CF72B0DF1A4559E8577DEE9236AB06FAA6
    uid   TechOps Team at Ripple <techops+rippled@ripple.com>
    sub   ed25519 2026-02-16 [S] [expires: 2029-02-15]
    ```


    特に、フィンガープリントが一致することを確認してください。（上記の例では、フィンガープリントは三行目の`C001`で始まる部分です。）

4. 使用しているオペレーティングシステムのバージョンに対応する適切なRippleリポジトリを追加します。

    ```
    echo "deb [signed-by=/usr/local/share/keyrings/ripple-key.gpg] https://repos.ripple.com/repos/rippled-deb focal stable" | \
        sudo tee -a /etc/apt/sources.list.d/ripple.list
    ```

    上記の例は、**Ubuntu 20.04 Focal Fossa**向けのものです。

5. Rippleリポジトリを取得します。

    ```
    sudo apt -y update
    ```

6. Clioソフトウェアパッケージをインストールします。オプションは2つあります。

    - 同じマシン上で`rippled`を実行するには、両方のサーバをセットアップする`clio`パッケージをインストールしてください：

        ```
        sudo apt -y install clio
        ```

    - Clio を`rippled`とは別のマシンで実行するには、Clioのみをセットアップする`clio-server`パッケージをインストールしてください：

        ```
        sudo apt -y install clio-server
        ```

7. 別のマシンで`rippled`を実行している場合は、Clioの設定ファイルを修正して、そちらを指すようにします。`clio`パッケージを使って同じマシンに両方をインストールした場合は、この手順を省略できます。



    1. Clioサーバの設定ファイルを編集して`rippled`サーバの接続情報を変更します。パッケージはこのファイルを`/opt/clio/etc/config.json`にインストールします。

        ```
        "etl_sources":
        [
            {
                "ip":"127.0.0.1",
                "ws_port":"6006",
                "grpc_port":"50051"
            }
        ]
        ```

        以下の情報が含まれます。

        - `rippled`サーバのIPアドレス
        - `rippled`が暗号化されていないWebSocket接続を受け付けるポート番号
        - `rippled`がgRPCリクエストを受け付けるポート番号

        {% admonition type="info" name="注記" %}`etl_sources`セクションに項目を追加することで、複数の`rippled`サーバをデータソースとして使用することができます。そうすると、Clioはリスト内のすべてのサーバでリクエストを負荷分散し、少なくとも`rippled`サーバの一つが同期している限り、ネットワークに追いつくことができます。{% /admonition %}

        [設定ファイル例](https://github.com/XRPLF/clio/blob/develop/example-config.json)は、ローカルのループバックネットワーク(127.0.0.1)上で動作している`rippled`サーバに、ポート6006のWebSocket(WS)とポート50051のgRPCでアクセスします。

    2. Clioサーバが接続できるように`rippled`サーバの設定ファイルを更新します。パッケージはこのファイルを`/etc/opt/ripple/rippled.cfg`にインストールします。

        * 暗号化されていないWebSocket接続を受け付けるポートを開きます。

            ```
            [port_ws_public]
            port = 6005
            ip = 0.0.0.0
            protocol = ws
            ```

        * gRPCリクエストを処理するポートを開き、`secure_gateway`項目にClioサーバのIPを指定します。

            ```
            [port_grpc]
            port = 50051
            ip = 0.0.0.0
            secure_gateway = 127.0.0.1
            ```

            {% admonition type="success" name="ヒント" %}もし`rippled`と同じマシンでClioを実行していない場合は、サンプルの`secure_gateway`を変更して、ClioサーバのIPアドレスを使用してください。{% /admonition %}

8. Clioのsystemdサービスを有効にして起動します。

    ```
    sudo systemctl enable clio
    ```

9. `rippled`サーバとClioサーバを起動します。

    ```
    sudo systemctl start rippled
    sudo systemctl start clio
    ```

    新しいデータベースで始める場合、Clioは完全なレジャーをダウンロードする必要があります。これには時間がかかります。両方のサーバを初めて起動する場合、Clioはレジャーを抽出する前に`rippled`の同期を待つため、さらに時間がかかることがあります。





## 関連項目

- **コンセプト:**
    - [Clioサーバ](../../concepts/networks-and-servers/the-clio-server.md)
