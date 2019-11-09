# rippledサーバーのクラスター化

1つのデータセンターで複数の`rippled`サーバーを稼働している場合は、これらのサーバーを[クラスター](clustering.html)に構成して、効率を最大化できます。クラスター構成の設定は次のとおりです。

1. 各サーバーのIPアドレスをメモします。

2. [validation_createメソッド][]を使用して各サーバーの一意のシードを生成します。

    コマンドラインインターフェイスを使用する場合の例を以下に示します。

        $ rippled validation_create

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

    各応答の`validation_seed`パラメーターと`validation_public_key`パラメーターを安全な場所に保存します。

3. 各サーバーで[構成ファイル](https://github.com/ripple/rippled/blob/master/cfg/rippled-example.cfg)を編集し、以下のセクションを変更します。

    1. `[ips_fixed]`セクションに、クラスターの _その他の_ 各メンバーのIPアドレスとポートを記入します。各サーバーのポート番号は、サーバーの `rippled.cfg`に指定されている`protocol = peer`ポート（通常は51235）と一致している必要があります。例:

            [ips_fixed]
            192.168.0.1 51235
            192.168.0.2 51235

        この例では、このサーバーがダイレクトピアツーピア接続の維持を常に試みる先のピアサーバーを特定しています。

    2. `[node_seed]`セクションでは、サーバーのノードシードを、ステップ2で[validation_createメソッド][]を使用して生成した`validation_seed`の値の1つに設定します。各サーバーは一意のノードシードを使用する必要があります。例:

            [node_seed]
            ssZkdwURFMBXenJPbrpE14b6noJSu

        この例では、ピアツーピア通信（検証メッセージを除く）の署名にサーバーが使用するキーペアを定義しています。

    3. `[cluster_nodes]`セクションでは、サーバーのクラスターのメンバーを設定します。これらのメンバーは`validation_public_key`の値で識別されます。各サーバーのクラスターの _その他の_ すべてのメンバーをここに記入する必要があります。任意で、各サーバーのカスタム名を追加します。例:

            [cluster_nodes]
            n9McNsnzzXQPbg96PEUrrQ6z3wrvgtU4M7c97tncMpSoDzaQvPar keynes
            n94UE1ukbq6pfZY9j54sv2A1UrEeHZXLbns3xK5CzU9NbNREytaa friedman

        この例は、サーバーがクラスターのメンバーを認識するために使用するキーペアを定義しています。

4. 構成ファイルを保存した後、各サーバーで`rippled`を再起動します。

        # systemctl restart rippled

5. 各サーバーがクラスターのメンバーになっていることを確認するには、[peersメソッド][]を使用します。`cluster`フィールドに、各サーバーの公開鍵とカスタム名（構成している場合）のリストが表示されます。

    コマンドラインインターフェイスを使用する場合の例を以下に示します。

        $ rippled peers

        Loading: "/etc/rippled.cfg"
        Connecting to 127.0.0.1:5005
        {
          "result" : {
            "cluster" : {
                "n9McNsnzzXQPbg96PEUrrQ6z3wrvgtU4M7c97tncMpSoDzaQvPar": {
                  "tag": "keynes",
                  "age": 1
                },
                "n94UE1ukbq6pfZY9j54sv2A1UrEeHZXLbns3xK5CzU9NbNREytaa": {
                  "tag": "friedman",
                  "age": 1
                }
            },
            "peers" : [
              ...(omitted) ...
            ],
            "status" : "success"
          }
        }



<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
