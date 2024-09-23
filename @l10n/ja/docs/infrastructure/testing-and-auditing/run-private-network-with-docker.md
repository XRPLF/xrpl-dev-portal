---
html: private-network-with-docker.html
name: プライベートネットワークをDockerで構築する
parent: use-stand-alone-mode.html
seo:
    description: DockerとDocker Composeを使って独自のXRPプライベートレジャーネットワークを構築する方法を紹介します。
labels:
  - コアサーバ
---

# プライベートネットワークをDockerで構築する

このチュートリアルでは、[Docker](https://docs.docker.com/get-docker/)と最新バージョンの[rippled](https://hub.docker.com/r/xrpllabsofficial/xrpld)を使って、あなたのコンピュータ上でプライベートなXRP Ledgerネットワークを実行する方法を説明します。

公開されているXRPテストネットのサーバを利用することは簡単ですが、プライベートネットワークを実行することは、XRP Ledgerの仕組みを理解しようとするときや、新しい機能を単独でテストするときに便利です。

**注意:** このチュートリアルは開発またはテスト目的のみに適しており、実際の資金を使用するものではありません。本番ネットワークではこの設定を使用しないでください。

## 学習のゴール

このチュートリアルでは、次のことを学びます：

- 3つの`rippled`バリデータノードを持つ _小規模な_ ネットワークのセットアップと設定方法(各ノードの鍵の生成方法を含む)

- [Docker Compose](https://docs.docker.com/compose/)でネットワークを動かす方法.

- ネットワークが稼働していることを確認する方法

次の図は、これからセットアップするコンテナ型プライベートネットワークの概要を示したものです。

[{% inline-svg file="/docs/img/xrp-ledger-private-network-docker.svg" /%}](/docs/img/xrp-ledger-private-network-docker.svg "図1：3つのノードのコンテナ型プライベートレジャーネットワークの構成図")

## 前提条件

このチュートリアルに従うには、最新の**Docker**があなたの選択したプラットフォームにインストールされていることを確認してください。

## バリデータキーの生成

`rippled`で提供されている`validator-keys`ツールを使って、バリデータノードの**それぞれ**のキーを生成します。生成されたキーは、後で使用するためにコンピュータのテキストファイルに保存しておく必要があります。

1. ターミナルで以下を実行し、`rippled`のDockerコンテナシェル内でコマンドを実行します：

    ```
    docker run -it --entrypoint /bin/bash xrpllabsofficial/xrpld:latest
    ```

    **注記:** Apple M1またはM2チップの場合は、代わりに`docker run -it --platform linux/amd64 --entrypoint /bin/bash xrpllabsofficial/xrpld:latest`を実行してください。

    出力の例:

    ```
    root@7732bd585b14:/#
    ```

2. `create_keys`コマンドを使ってバリデータのキーペアを生成します。

    ```
    cd /opt/ripple/bin &&
        ./validator-keys create_keys --keyfile /PATH/TO/YOUR/validator-<NUMBER>-keys.json
    ```

    出力の例:

    ```
    バリデータのキーは/PATH/TO/YOUR/validator-<NUMBER>-keys.jsonに保存されています。

    このファイルは安全に保管し、決して他人と共有しないようにしてください。
    ```

    **注意:** 本番環境やテスト環境では、常にベストプラクティスに従い、生成された鍵は暗号化されたUSBフラッシュドライブなど、安全でオフラインかつ復元可能な場所に保管してください。しかし、このチュートリアルはローカルの開発セットアップの例なので、鍵をコンピュータに保存するだけで十分です。

3. JSON出力から**public_key**の値をコピーし、コンピュータ上のテキストファイルに保存します。

    ```
    cat /PATH/TO/YOUR/validator-<NUMBER>-keys.json
    ```

    出力の例:

    ```
    {
       "key_type" : "ed25519",
       "public_key" : "nHD9jtA9y1nWC2Fs1HeRkEisqV3iFpk12wHmHi3mQxQwUP1ywUKs",
       "revoked" : false,
       "secret_key" : "paLsUUm9bRrvNBPpvJQ4nF7vdRTZyDNofGMMYs9EDeEKeNJa99q",
       "token_sequence" : 0
    }
    ```

4. `create_token`コマンドを使ってバリデータトークンを作成します。

    ```
    ./validator-keys create_token --keyfile /PATH/TO/YOUR/validator-<NUMBER>-keys.json
    ```

    出力から次のようなトークンの値をコピーし、コンピュータ上のテキストファイルに保存します。

    ```
    [validator_token]
    eyJ2YWxpZGF0aW9uX3NlY3J|dF9rZXkiOiI5ZWQ0NWY4NjYyNDFjYzE4YTI3NDdiNT
    QzODdjMDYyNTkwNzk3MmY0ZTcxOTAyMzFmYWE5Mzc0NTdmYT|kYWY2IiwibWFuaWZl
    c3QiOiJKQUFBQUFGeEllMUZ0d21pbXZHdEgyaUNjTUpxQzlnVkZLaWxHZncxL3ZDeE
    hYWExwbGMyR25NaEFrRTFhZ3FYeEJ3RHdEYklENk9NU1l1TTBGREFscEFnTms4U0tG
    bjdNTzJmZGtjd1JRSWhBT25ndTlzQUtxWFlvdUorbDJWMFcrc0FPa1ZCK1pSUzZQU2
    hsSkFmVXNYZkFpQnNWSkdlc2FhZE9KYy9hQVpva1MxdnltR21WcmxIUEtXWDNZeXd1
    NmluOEhBU1FLUHVnQkQ2N2tNYVJGR3ZtcEFUSGxHS0pkdkRGbFdQWXk1QXFEZWRGdj
    VUSmEydzBpMjFlcTNNWXl3TFZKWm5GT3I3QzBrdzJBaVR6U0NqSXpkaXRROD0ifQ==
    ```

5. 残りのバリデータノードについても**2-4**の手順を繰り返します。すべてのバリデータのキーとトークンを生成したら、ターミナルで`exit`と入力してDockerコンテナを終了します。

## ネットワークの設定

このセクションでは、ネットワーク内のバリデータノードを設定する方法について説明します。

**注記:** このチュートリアルの設定により、ネットワークはある程度のレジャー履歴を保持できるようになりますが、保存される取引履歴の量は、ネットワークがオンラインになってからの時間によって異なります。

### ノードのディレクトリを作成

コンピュータに、プライベートネットワーク内のすべてのノードのディレクトリと、それぞれの設定フォルダを作成します。

```
xrpl-private-network/
    ├── validator_1/
    │   └── config
    ├── validator_2/
    │   └── config
    └── validator_3/
        └── config
```

ターミナルで以下のコマンドを実行し、ディレクトリを作成します。

```
mkdir -p xrpl-private-network/{validator_1/config,validator_2/config,validator_3/config}
```

### バリデータ設定ファイルの作成

各バリデータノードについて、以下の手順を実行します。

1. バリデータの`config`ディレクトリに`rippled.cfg`ファイルを作成します。

2. 以下の`rippled.cfg`テンプレートの情報をファイルにコピーします。

    ```
    [server]
    port_rpc_admin_local
    port_rpc
    port_ws_admin_local
    port_ws_public
    port_peer
    # ssl_key = /etc/ssl/private/server.key
    # ssl_cert = /etc/ssl/certs/server.crt

    [port_rpc_admin_local]
    port = 5005
    ip = 127.0.0.1
    admin = 127.0.0.1
    protocol = http

    [port_ws_admin_local]
    port = 6006
    ip = 127.0.0.1
    admin = 127.0.0.1
    protocol = ws

    [port_ws_public]
    port = 80
    ip = 0.0.0.0
    protocol = ws

    [port_peer]
    port = 51235
    ip = 0.0.0.0
    protocol = peer

    [port_rpc]
    port = 51234
    ip = 0.0.0.0
    admin = 127.0.0.1
    protocol = https, http

    [node_size]
    small
    # tiny
    # small
    # medium
    # large
    # huge

    [node_db]
    type=NuDB
    path=/var/lib/rippled/db/nudb
    advisory_delete=0

    # How many ledgers do we want to keep (history)?
    # Integer value that defines the number of ledgers
    # between online deletion events
    online_delete=256

    [ledger_history]
    # How many ledgers do we want to keep (history)?
    # Integer value (ledger count)
    # or (if you have lots of TB SSD storage): 'full'
    256

    [database_path]
    /var/lib/rippled/db

    [debug_logfile]
    /var/log/rippled/debug.log

    [sntp_servers]
    time.windows.com
    time.apple.com
    time.nist.gov
    pool.ntp.org

    [ips_fixed]
    validator_1 51235
    validator_2 51235
    validator_3 51235

    [validators_file]
    validators.txt

    [rpc_startup]
    { "command": "log_level", "severity": "warning" }
    # severity (order: lots of information .. only errors)
    # debug
    # info
    # warn
    # error
    # fatal

    [ssl_verify]
    0

    [validator_token]
    <Add your validator token here>
    ```

3. チュートリアルの[最初](#バリデータキーの生成)に作成した次のようなバリデータトークンを追加します。

    ```
    [validator_token]
    eyJtYW5pZmVzdCI6IkpBQUFBQUZ4SWUwcVd3ZnpLZ2tacWJTL01QVGxHVXlOeTVJZ2kzYzlG
    V1JvTDFIMGoydkNobk1oQTBOc2RHeFNXbWF6b0xkdU5NeDVmaVVZU2h3bjk2SnpSaUFReFJz
    cENuR2dka1l3UkFJZ1dLazV4cklSN3FNRWd1UmJwOTRrN0E0QnBOZmwrT2VYUm92bTNIOGtS
    YkVDSUZXYmVocHd5ZS9UWFpZRGYwUEgwTkxjN2I1cWNEOXUvbzVYUjA4YW1pUEJjQkpBYjEw
    NE95bG5IS0JSZTJmRW1qSVVjT24vZ2ZacE44bXdhZ1dGbUxlemc2RFRLL0hpTVkyektNQ3l0
    aksreHpHNWpjc3JlS3k5Q29sRGtpKzk3V0JHQ2c9PSIsInZhbGlkYXRpb25fc2VjcmV0X2tl
    eSI6IjZFNTNFQjA1M0IwNEM1RTczNDc4M0VCMEU0RTBFOTg1NDVDNDQ0QzI3OTBFQjdBMzA2
    NUQzMUVBOTU1QjQyMTIifQ==
    ```

    各バリデータノードは固有のトークンを持たなければなりません。

### validators.txtファイルの作成

バリデータの設定ファイルを作成したので、次は`validator.txt`ファイルを追加します。このファイルは、どのバリデータがネットワークから信頼されるかを定義します。

各ノードにて以下の手順を実行します：

1. 設定ディレクトリに`validators.txt`ファイルを作成します。
2. チュートリアルの[最初](#バリデータキーの生成)に生成した`validator-keys.json`ファイルから公開鍵をコピーします。
3. 次のようにすべてのバリデータの公開鍵を追加します。

    ```
    [validators]
        nHBgaEDL8buUECuk4Rck4QBYtmUgbAoeYJLpWLzG9iXsznTRYrQu
        nHBCHX7iLDTyap3LumqBNuKgG7JLA5tc6MSJxpLs3gjkwpu836mY
        nHU5STUKTgWdreVqJDx6TopLUymzRUZshTSGcWNtjfByJkYdiiRc
    ```

## ネットワークを開始する

Docker Composeを使用すると、簡単な`yaml`ファイルの設定でコンピュータ上の複数のコンテナを管理することができます。このセクションでは、Docker Composeでネットワークを実行する方法と、ネットワークが正常に実行されていることを確認する方法について説明します。

**注記:** Docker Composeはデフォルトでコンテナが同じDocker仮想ネットワークに属していることを保証するので、`rippled`コンテナ同士が通信するために追加の手順を踏む必要はありません。

プライベートネットワークの使用を始めるには、次の手順を実行します。

1. `xrpl-private-network`ディレクトリのルートに`docker-compose.yml`ファイルを作成し、次の内容を追加します。

    ```
    version: "3.9"
    services:
      validator_1:
        platform: linux/amd64
        container_name: validator_1
        image: "xrpllabsofficial/xrpld"
        ports:
          - "8001:80"
          - "5006:5005"
          - "4001:6006"
          - "9001:51235"
        volumes:
          - ./validator_1/config:/config/
      validator_2:
        platform: linux/amd64
        container_name: validator_2
        image: "xrpllabsofficial/xrpld"
        ports:
          - "8002:80"
          - "5007:5005"
          - "4002:6006"
          - "9002:51235"
        volumes:
          - ./validator_2/config:/config/
      validator_3:
        platform: linux/amd64
        container_name: validator_3
        image: "xrpllabsofficial/xrpld"
        ports:
          - "8003:80"
          - "5008:5005"
          - "4003:6006"
          - "9003:51235"
        volumes:
          - ./validator_3/config:/config/
    ```

    各 `service`の`volumes`キーは、設定ファイルが保存されている場所を表します。例えば、`./validator_1/config:/config/`はホストコンピュータの`/validator_1/config`ディレクトリをDockerコンテナの`/config/`マップします。ホストのディレクトリで行われた変更は、自動的にコンテナに反映されます。

2. ターミナルから`docker-compose.yml`ファイルを作成した場所で`docker-compose up -d`を実行してください。以下のような出力が表示されるはずです。

    ```
    [+] Running 4/4
     ✔ Network xrpl-private-network_default    Created                             0.0s
     ✔ Container validator_3                   Started                             0.5s
     ✔ Container validator_1                   Started                             0.5s
     ✔ Container validator_2                   Started                             0.5s
    ```

## ネットワークを検証する

プライベートレジャーのネットワークが立ち上がったので、**各**バリデータノードが期待通りに動作していることを確認する必要があります。

1. ターミナルで`docker exec -it <validator_name> bin/bash`を実行し、バリデータのDockerコンテナでコマンドを実行します。`<validator_name>`はコンテナ名に置き換えてください(例:`validator_1`)。

2. 

```
rippled server_info | grep server_state
```

```
出力の例:

    "server_state" : "proposing"

**注記:** server_stateが**proposing**に更新されない場合は、レジャーの更新に時間がかかることがあるため、数分後にステップ**2**を繰り返してください。
```

3. バリデータに接続しているピア数を確認します。

```
    rippled server_info | grep peers

出力の例:

    "peers" : 2
```

4. 以下のコマンドを実行して、genesisのアカウント情報を確認します。

```
    rippled account_info rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh validated strict

出力の例:

    {
      "result" : {
          "account_data" : {
            "Account" : "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
            "Balance" : "100000000000000000",
            "Flags" : 0,
            "LedgerEntryType" : "AccountRoot",
            "OwnerCount" : 0,
            "PreviousTxnID" : "0000000000000000000000000000000000000000000000000000000000000000",
            "PreviousTxnLgrSeq" : 0,
            "Sequence" : 1,
            "index" : "2B6AC232AA4C4BE41BF49D2459FA4A0347E1B543A4C92FCEE0821C0201E2E9A8"
          },
          "ledger_hash" : "CFCEFB049A71E26DE812529ABB212F330FAF583A98FE073F14713B0644D7CEE9",
          "ledger_index" : 10181,
          "status" : "success",
          "validated" : true
      }
   }
```

5. Dockerコンテナシェルから抜けるには、ターミナルで`exit`と入力します。

### テストトランザクションの実行

アカウントに送金できることを確認するため、**テスト**トランザクションを実行してください。

1. ターミナルで以下のコマンドを実行し、トランザクションを送信します。

    ```
    docker exec -it validator_1 \
        rippled submit 'snoPBrXtMeMyMHUVTgbuqAfg1SUTb' '{ "Account": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh", "Amount": "1000000000", "Destination": "r9wRwVgL2vWVnKhTPdtxva5vdH7FNw1zPs", "TransactionType": "Payment", "Fee": "10" }'
    ```

    出力の例:

    ```
    {
      "result" : {
          "engine_result" : "tesSUCCESS",
          "engine_result_code" : 0,
          "engine_result_message" : "The transaction was applied. Only final in a validated ledger.",
          "status" : "success",
          "tx_blob" :   "1200002280000000240000000161400000003B9ACA0068400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074463044022057CCEED351A4278F35C13FD104A55338DC8F48C1F9902D58045A4CD0CE89C92A0220184026BD3B1E2C21239017CAF1BBF683 35EDC57F6F98D952E263763DE449561B8114B5F762798A53D543A014CAF8B297CFF8F2F937E883145988EBB744055F4E8BDC7F67FD53EB9FCF961DC0",
          "tx_json" : {
            "Account" : "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
            "Amount" : "1000000000",
            "Destination" : "r9wRwVgL2vWVnKhTPdtxva5vdH7FNw1zPs",
            "Fee" : "10",
            "Flags" : 2147483648,
            "Sequence" : 1,
            "SigningPubKey" : "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
            "TransactionType" : "Payment",
            "TxnSignature" : "3044022057CCEED351A4278F35C13FD104A55338DC8F48C1F9902D58045A4CD0CE89C92A0220184026BD3B1E2C21239017CAF1BBF68335EDC57F6F98D952E263763DE449561B",
            "hash" : "EB516738841794B24819C68273E0F853A3D234350E6534F7F2841F620CE99437"
          }
      }
    }
    ```

2. 各バリデータについて、宛先アカウント `r9wRwVgL2vWVnKhTPdtxva5vdH7FNw1zPs` に 1000000000 XRP があることを確認します。

    ```
    docker exec -it validator_1 \
        rippled account_info r9wRwVgL2vWVnKhTPdtxva5vdH7FNw1zPs validated strict
    ```

    出力の例:

    ```
    {
       "result" : {
           "account_data" : {
             "Account" : "r9wRwVgL2vWVnKhTPdtxva5vdH7FNw1zPs",
             "Balance" : "1000000000",
             "Flags" : 0,
             "LedgerEntryType" : "AccountRoot",
             "OwnerCount" : 0,
             "PreviousTxnID" : "EB516738841794B24819C68273E0F853A3D234350E6534F7F2841F620CE99437",
             "PreviousTxnLgrSeq" : 36,
             "Sequence" : 1,
             "index" : "0F2E4615AE24EEF58EE82BD1E67D237234ED41BFC8B7885630B7AC05082E97AA"
           },
           "ledger_hash" : "6F9F54903CC4546F7A426CD78AFD68D907F5DC40B1780DF31A662CF65920E49C",
           "ledger_index" : 51,
           "status" : "success",
           "validated" : true
       }
    }

    ```
    すべてのバリデータノードは、`r9wRwVgL2vWVnKhTPdtxva5vdH7FNw1zPs`アカウントの同じ残高1000000000XRPでレスポンスする必要があります。

## ネットワークを停止する

プライベートネットワークの使用を終了したい場合、

1. ターミナルで`xrpl-private-network`ディレクトリに移動します。
2. 以下のコマンドを実行して、ネットワークをシャットダウンします。

    ```
    docker-compose down
    ```

    出力の例:

    ```
    [+] Running 4/4
     ✔ Container validator_3                 Removed                                                       1.7s
     ✔ Container validator_1                 Removed                                                       1.6s
     ✔ Container validator_2                 Removed                                                       1.6s
     ✔ Network xrpl-private-network_default  Removed                                                       0.0s
    ```

## 関連項目

- **ネットワークとサーバ:**
    - [ピアプロトコル](../../concepts/networks-and-servers/peer-protocol.md)
    
- **References:**
    - [XRPL TestnetのDocker用セットアップスクリプト](https://github.com/UNIC-IFF/xrpl-docker-testnet)
