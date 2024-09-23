---
html: build-run-rippled-in-reporting-mode.html
parent: install-rippled.html
seo:
    description: 検証済みデータのリモートプロシージャコール(RPC)を処理するrippledの特別なモードをビルドし、実行します。
labels:
  - コアサーバ
  - ブロックチェーン
top_nav_grouping: 人気ページ
---
# レポートモードでの`rippled`のビルドと実行

[レポートモード](../../concepts/networks-and-servers/rippled-server-modes.md)は、[HTTPとWebSocket API](../../references/http-websocket-apis/index.md)の提供に特化したXRP Ledgerのコアサーバのモードです。

レポートモードでは、サーバはピアツーピアネットワークに接続しません。その代わりに、gRPCを使用して、P2Pネットワークに接続されている1つまたは複数の信頼できるサーバから有効なデータを取得します。

そしてAPIコールを効率的に処理し、P2Pモードで動作している`rippled`サーバの負荷を軽減することができます。

[{% inline-svg file="/docs/img/reporting-mode-basic-architecture.svg" /%}](/docs/img/reporting-mode-basic-architecture.svg "図 1: レポートモードでの`rippled`の動作")

`rippled`のレポートモードでは2種類のデータストアを使用します。

* トランザクションのメタデータ、アカウントの状態、レジャーのヘッダーを含む`rippled`のプライマリ永続データストア。プライマリ永続データストアとしてNuDB(ソースに付属)または[Cassandra](https://cassandra.apache.org/)を使用できます。Cassandraを使用する場合、複数のレポートモードサーバが単一のCassandraインスタンスまたはクラスター内のデータへのアクセスを共有できます。

* リレーショナルデータを保持する[PostgreSQL](https://www.postgresql.org/)データベース。主に[txメソッド][]と[account_txメソッド][]で使用されます。

レポートモードサーバはAPIリクエストを受信すると、可能であればこれらのデータストアからデータをロードします。P2Pネットワークからのデータが必要なリクエストの場合、レポートモードはリクエストをP2Pサーバに転送し、レスポンスをクライアントに返します。

複数のレポートモードサーバが同じネットワークのアクセス可能なデータベース(PostgreSQLとCassandra)へのアクセスを共有することができます。

## レポートモードの実行方法

### 前提条件

1. お使いのシステムが[システム要件](system-requirements.md)を満たしていることを確認してください。

    **注記:** データベースとしてCassandraを選択した場合、データがローカルディスクに保存されないため、`rippled`のディスク要件は低くなります。

2. 少なくとも1台の`rippled`サーバをP2Pモードで動作させる必要があります。

3. 互換性のあるバージョンのCMakeがインストールされている必要があります。

4. レポートモードで`rippled`を実行するために必要なデータストアをインストールして設定します。

    1. PostgreSQLをインストールします。

    2. プライマリ永続データストアとして使用するデータベースをインストールして構成します。CassandraまたはNuDBを選択できます。

    3. macOSでは、Cassandraのcppライバを手動でインストールする必要があります。その他のプラットフォームでは、Cassandraドライバは`rippled`ビルドの一部としてビルドされます。
        
        ```
        brew install cassandra-cpp-driver
        ```

#### PostgreSQLのインストール
    
**LinuxにPostgreSQLをインストール**

1. LinuxにPostgreSQLをダウンロードし[インストール](https://www.postgresqltutorial.com/install-postgresql-linux/)してください。
        
2. `psql`を使用してPostgreSQLデータベースサーバに接続し、ユーザ`newuser`とデータベース`reporting`を作成します。

    ```
    psql postgres
        CREATE ROLE newuser WITH LOGIN PASSWORD ‘password’;
        ALTER ROLE newuser CREATEDB;
    \q
    psql postgres -U newuser
    postgres=# create database reporting;
    ```


**macOSにPostgreSQLをインストール**

1. macOSにPostgreSQLをダウンロードしてインストールします。

    ```
    brew install postgres
    brew services start postgres
    ```

2. `psql` を使用してPostgreSQLデータベースサーバに接続し、ユーザ`newuser`とデータベース`reporting`を作成します。

    ```
    psql postgres
        CREATE ROLE newuser WITH LOGIN PASSWORD ‘password’;
        ALTER ROLE newuser CREATEDB;
    \q
    psql postgres -U newuser
    postgres=# create database reporting;
    ```

#### プライマリ永続データストアのインストールと設定

**Cassandra** 

Cassandraをインストールし、レプリケーションを使用して`rippled`用のキースペースを作成します。

レプリケーション係数は3が推奨されますが、ローカルで実行する場合はレプリケーションは不要なので、`replication_factor`を1に設定することができます。
        
```
$ cqlsh [host] [port]
> CREATE KEYSPACE `rippled` WITH REPLICATION =
{'class' : 'SimpleStrategy', 'replication_factor' : 1    };
```

**NuDB** 

ローカルネットワークのレポートモードで`rippled`を実行している場合、バックエンドデータベースとしてCassandraの代わりにNuDBを選択できます。

NuDBは`rippled`ビルドセットアップの一部としてインストールされ、追加のインストール手順は必要ありません。


### 手順

1. [UbuntuまたはmacOS](https://github.com/XRPLF/rippled/blob/release/BUILD.md)のレポートモード用に`rippled`をビルド。

    {% tabs %}

    ```{% label="Linux" %}
    wget https://github.com/Kitware/CMake/releases/download/v3.16.3/cmake-3.16.3-Linux-x86_64.sh
    sudo sh cmake-3.16.3-Linux-x86_64.sh --prefix=/usr/local --exclude-subdir 
    cmake -B build -Dreporting=ON -DCMAKE_BUILD_TYPE=Debug 
    cmake --build build --parallel $(nproc)
    ```

    ```{% label="macOS" %}
    cmake -B build -G "Unix Makefiles" -Dreporting=ON -DCMAKE_BUILD_TYPE=Debug
    cmake --build build --parallel $(nproc)
    ```

    {% /tabs %}

2. レポートモードで`rippled`を実行するための設定ファイルを作成します。

    設定ファイル例`rippled-example.cfg`をコピーして、非rootユーザで`rippled`を実行できる場所に`rippled-reporting-mode.cfg`として保存してください。例えば
    
    ```
    mkdir -p $HOME/.config/ripple
    cp <RIPPLED_SOURCE>/cfg/rippled-example.cfg $HOME/.config/ripple/rippled-reporting-mode.cfg
    ```

3. rippled-reporting-mode.cfgを編集して必要なファイルパスを設定してください。あなたが`rippled`を実行する予定のユーザは、ここで指定したすべてのパスに書き込み権限を持っている必要があります。

    1. `[node_db]`のパスには、レジャーデータベースを保存する場所を設定します。

    2. `[database_path]`には他のデータベースデータを格納する場所を設定してください。(これには設定データを格納したSQLiteデータベースも含まれ、通常は`[node_db]`パスフィールドの一つ上の階層になります)。
        
    3. `[debug_logfile]`に`rippled`がロギング情報を書き込めるパスを設定します。

    これらは`rippled`が正常に起動するために必須の設定だけであることに注意してください。他の設定はすべてオプションであり、サーバが動作するようになってから調整することができます。

4. `rippled-reporting-mode.cfg`ファイルを編集してレポートモードを有効にします：

    1. `[reporting]`スタンザのコメントを外すか、新しいスタンザを追加してください：

        ```
        [reporting]
        etl_source
        read_only=0
        ```

    2. データを抽出する`rippled`ソース(ETLソース)をリストアップします。これらの`rippled`サーバはgRPCが有効になっている必要があります。
    
        注記: レポートモードはP2Pネットワークに接続しないため、データがネットワークのコンセンサスレジャーと実際に一致しているかどうかを検証できないため、信頼できるサーバだけを含めるようにしてください。
        
        ```
        [etl_source]
        source_grpc_port=50051
        source_ws_port=6006
        source_ip=127.0.0.1
        ```

5. データベースの設定

    1. `[ledger_tx_tables]`にPostgres DBを指定します。

        ```
        [ledger_tx_tables]
        conninfo = postgres://newuser:password@127.0.0.1/reporting
        use_tx_tables=1
        ```

    2. `[node_db]` にデータベースを指定します。

        {% tabs %}

        ```{% label="NuDB" %}
        [node_db]
        type=NuDB
        path=/home/ubuntu/ripple/

        [ledger_history]
        1000000
        ```

        ```{% label="Cassandra" %}
        [node_db]
        type=Cassandra

        [ledger_history]
        1000000
        ```

        {% /tabs %}

6. `rippled`の設定を変更してポートを開放してください。

    1. パブリックWebSocketのポートを開きます。

        ```
        [port_ws_admin_local]
        port = 6006
        ip = 127.0.0.1
        admin = 127.0.0.1
        protocol = ws
        ```


    2. ポートを開きます。

        ```
        [port_grpc]
        port = 60051
        ip = 0.0.0.0
        ```


    3. レポートシステムのIPに安全なゲートウェイを追加します。

        ```
        secure_gateway = 127.0.0.1
        ```

7. レポートモードで`rippled`を実行します。

    ```
    ./rippled --conf /home/ubuntu/.config/ripple/rippled-reporting-example.cfg
    ```


### 予想される結果

ターミナルに表示される内容の抜粋です。

```text
Loading: "/home/ubuntu/.config/ripple/rippled-reporting-example.cfg"
2021-Dec-09 21:31:52.245577 UTC JobQueue:NFO Using 10  threads
2021-Dec-09 21:31:52.255422 UTC LedgerConsensus:NFO Consensus engine started (cookie: 17859050541656985684)
2021-Dec-09 21:31:52.256542 UTC ReportingETL::ETLSource:NFO Using IP to connect to ETL source: 127.0.0.1:50051
2021-Dec-09 21:31:52.257784 UTC ReportingETL::ETLSource:NFO Made stub for remote = { validated_ledger :  , ip : 127.0.0.1 , web socket port : 6006, grpc port : 50051 }
2021-Dec-09 21:31:52.258032 UTC ReportingETL::LoadBalancer:NFO add : added etl source - { validated_ledger :  , ip : 127.0.0.1 , web socket port : 6006, grpc port : 50051 }
2021-Dec-09 21:31:52.258327 UTC Application:NFO process starting: rippled-1.8.1+DEBUG
2021-Dec-09 21:31:52.719186 UTC PgPool:DBG max_connections: 18446744073709551615, timeout: 600, connection params: port: 5432, hostaddr: 127.0.0.1, user: newuser, password: *, channel_binding: prefer, dbname: reporting_test_core, host: 127.0.0.1, options: , sslmode: prefer, sslcompression: 0, sslsni: 1, ssl_min_protocol_version: TLSv1.2, gssencmode: prefer, krbsrvname: postgres, target_session_attrs: any
2021-Dec-09 21:31:52.788851 UTC PgPool:NFO server message: NOTICE:  relation "version" already exists, skipping

2021-Dec-09 21:31:53.282807 UTC TaggedCache:DBG LedgerCache target size set to 384
2021-Dec-09 21:31:53.282892 UTC TaggedCache:DBG LedgerCache target age set to 240000000000
2021-Dec-09 21:31:53.283741 UTC Amendments:DBG Amendment 98DECF327BF79997AEC178323AD51A830E457BFC6D454DAF3E46E5EC42DC619F (CheckCashMakesTrustLine) is supported and will be down voted if not enabled on the ledger.
2021-Dec-09 21:31:53.283836 UTC Amendments:DBG Amendment 157D2D480E006395B76F948E3E07A45A05FE10230D88A7993C71F97AE4B1F2D1 (Checks) is supported and will be up voted if not enabled on the ledger.
2021-Dec-09 21:31:53.283917 UTC Amendments:DBG Amendment 1562511F573A19AE9BD103B5D6B9E01B3B46805AEC5D3C4805C902B514399146 (CryptoConditions) is supported and will be down voted if not enabled on the ledger.
2021-Dec-09 21:31:53.283975 UTC Amendments:DBG Amendment 86E83A7D2ECE3AD5FA87AB2195AE015C950469ABF0B72EAACED318F74886AE90 (CryptoConditionsSuite) is supported and will be down voted if not enabled on the ledger.
2021-Dec-09 21:31:53.284016 UTC Amendments:DBG Amendment 30CD365592B8EE40489BA01AE2F7555CAC9C983145871DC82A42A31CF5BAE7D9 (DeletableAccounts) is supported and will be up voted if not enabled on the ledger.
2021-Dec-09 21:31:53.284062 UTC Amendments:DBG Amendment F64E1EABBE79D55B3BB82020516CEC2C582A98A6BFE20FBE9BB6A0D233418064 (DepositAuth) is supported and will be up voted if not enabled on the ledger.
2021-Dec-09 21:31:53.284099 UTC Amendments:DBG Amendment 3CBC5C4E630A1B82380295CDA84B32B49DD066602E74E39B85EF64137FA65194 (DepositPreauth) is supported and will be up voted if not enabled on the ledger.
2021-Dec-09 21:31:53.284126 UTC Amendments:DBG Amendment DC9CA96AEA1DCF83E527D1AFC916EFAF5D27388ECA4060A88817C1238CAEE0BF (EnforceInvariants) is supported and will be down voted if not enabled on the ledger.
2021-Dec-09 21:31:53.284153 UTC Amendments:DBG Amendment 07D43DCE529B15A10827E5E04943B496762F9A88E3268269D69C44BE49E21104 (Escrow) is supported and will be down voted if not enabled on the ledger.
2021-Dec-09 21:31:53.284189 UTC Amendments:DBG Amendment 42426C4D4F1009EE67080A9B7965B44656D7714D104A72F9B4369F97ABF044EE (FeeEscalation) is supported and will be down voted if not enabled on the ledger.
2021-Dec-09 21:31:53.284216 UTC Amendments:DBG Amendment 740352F2412A9909880C23A559FCECEDA3BE2126FED62FC7660D628A06927F11 (Flow) is supported and will be up voted if not enabled on the ledger.
2021-Dec-09 21:31:53.284241 UTC Amendments:DBG Amendment 3012E8230864E95A58C60FD61430D7E1B4D3353195F2981DC12B0C7C0950FFAC (FlowCross) is supported and will be up voted if not enabled on the ledger.
2021-Dec-09 21:31:53.284284 UTC Amendments:DBG Amendment AF8DF7465C338AE64B1E937D6C8DA138C0D63AD5134A68792BBBE1F63356C422 (FlowSortStrands) is supported and will be up voted if not enabled on the ledger.
2021-Dec-09 21:31:53.284337 UTC Amendments:DBG Amendment 1F4AFA8FA1BC8827AD4C0F682C03A8B671DCDF6B5C4DE36D44243A684103EF88 (HardenedValidations) is supported and will be up voted if not enabled on the ledger.
2021-Dec-09 21:31:53.284412 UTC Amendments:DBG Amendment 4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373 (MultiSign) is supported and will be down voted if not enabled on the ledger.
2021-Dec-09 21:31:53.284455 UTC Amendments:DBG Amendment 586480873651E106F1D6339B0C4A8945BA705A777F3F4524626FF1FC07EFE41D (MultiSignReserve) is supported and will be up voted if not enabled on the ledger.
2021-Dec-09 21:31:53.284491 UTC Amendments:DBG Amendment B4E4F5D2D6FB84DF7399960A732309C9FD530EAE5941838160042833625A6076 (NegativeUNL) is supported and will be down voted if not enabled on the ledger.
2021-Dec-09 21:31:53.284528 UTC Amendments:DBG Amendment 08DE7D96082187F6E6578530258C77FAABABE4C20474BDB82F04B021F1A68647 (PayChan) is supported and will be down voted if not enabled on the ledger.
2021-Dec-09 21:31:53.284592 UTC Amendments:DBG Amendment 00C1FC4A53E60AB02C864641002B3172F38677E29C26C5406685179B37E1EDAC (RequireFullyCanonicalSig) is supported and will be up voted if not enabled on the ledger.
2021-Dec-09 21:31:53.284649 UTC Amendments:DBG Amendment CC5ABAE4F3EC92E94A59B1908C2BE82D2228B6485C00AFF8F22DF930D89C194E (SortedDirectories) is supported and will be down voted if not enabled on the ledger.
2021-Dec-09 21:31:53.284703 UTC Amendments:DBG Amendment 532651B4FD58DF8922A49BA101AB3E996E5BFBF95A913B3E392504863E63B164 (TickSize) is supported and will be down voted if not enabled on the ledger.
2021-Dec-09 21:31:53.284787 UTC Amendments:DBG Amendment 955DF3FA5891195A9DAEFA1DDC6BB244B545DDE1BAA84CBB25D5F12A8DA68A0C (TicketBatch) is supported and will be up voted if not enabled on the ledger.
2021-Dec-09 21:31:53.284950 UTC Amendments:DBG Amendment 6781F8368C4771B83E8B821D88F580202BCB4228075297B19E4FDC5233F1EFDC (TrustSetAuth) is supported and will be down voted if not enabled on the ledger.
2021-Dec-09 21:31:53.284997 UTC Amendments:DBG Amendment B4D44CC3111ADD964E846FC57760C8B50FFCD5A82C86A72756F6B058DDDF96AD (fix1201) is supported and will be down voted if not enabled on the ledger.
2021-Dec-09 21:31:53.285025 UTC Amendments:DBG Amendment E2E6F2866106419B88C50045ACE96368558C345566AC8F2BDF5A5B5587F0E6FA (fix1368) is supported and will be down voted if not enabled on the ledger.
2021-Dec-09 21:31:53.285067 UTC Amendments:DBG Amendment 42EEA5E28A97824821D4EF97081FE36A54E9593C6E4F20CBAE098C69D2E072DC (fix1373) is supported and will be down voted if not enabled on the ledger.
2021-Dec-09 21:31:53.285103 UTC Amendments:DBG Amendment 6C92211186613F9647A89DFFBAB8F94C99D4C7E956D495270789128569177DA1 (fix1512) is supported and will be down voted if not enabled on the ledger.
2021-Dec-09 21:31:53.285129 UTC Amendments:DBG Amendment 67A34F2CF55BFC0F93AACD5B281413176FEE195269FA6D95219A2DF738671172 (fix1513) is supported and will be up voted if not enabled on the ledger.
2021-Dec-09 21:31:53.285153 UTC Amendments:DBG Amendment 5D08145F0A4983F23AFFFF514E83FAD355C5ABFBB6CAB76FB5BC8519FF5F33BE (fix1515) is supported and will be up voted if not enabled on the ledger.
2021-Dec-09 21:31:53.285176 UTC Amendments:DBG Amendment B9E739B8296B4A1BB29BE990B17D66E21B62A300A909F25AC55C22D6C72E1F9D (fix1523) is supported and will be down voted if not enabled on the ledger.
2021-Dec-09 21:31:53.285202 UTC Amendments:DBG Amendment 1D3463A5891F9E589C5AE839FFAC4A917CE96197098A1EF22304E1BC5B98A454 (fix1528) is supported and will be down voted if not enabled on the ledger.
2021-Dec-09 21:31:53.285256 UTC Amendments:DBG Amendment CA7C02118BA27599528543DFE77BA6838D1B0F43B447D4D7F53523CE6A0E9AC2 (fix1543) is supported and will be up voted if not enabled on the ledger.
2021-Dec-09 21:31:53.285290 UTC Amendments:DBG Amendment 7117E2EC2DBF119CA55181D69819F1999ECEE1A0225A7FD2B9ED47940968479C (fix1571) is supported and will be up voted if not enabled on the ledger.
2021-Dec-09 21:31:53.285343 UTC Amendments:DBG Amendment FBD513F1B893AC765B78F250E6FFA6A11B573209D1842ADC787C850696741288 (fix1578) is supported and will be up voted if not enabled on the ledger.
2021-Dec-09 21:31:53.285381 UTC Amendments:DBG Amendment 58BE9B5968C4DA7C59BA900961828B113E5490699B21877DEF9A31E9D0FE5D5F (fix1623) is supported and will be up voted if not enabled on the ledger.
2021-Dec-09 21:31:53.285424 UTC Amendments:DBG Amendment 25BA44241B3BD880770BFA4DA21C7180576831855368CBEC6A3154FDE4A7676E (fix1781) is supported and will be up voted if not enabled on the ledger.
2021-Dec-09 21:31:53.285464 UTC Amendments:DBG Amendment 4F46DF03559967AC60F2EB272FEFE3928A7594A45FF774B87A7E540DB0F8F068 (fixAmendmentMajorityCalc) is supported and will be up voted if not enabled on the ledger.
2021-Dec-09 21:31:53.285500 UTC Amendments:DBG Amendment 8F81B066ED20DAECA20DF57187767685EEF3980B228E0667A650BAF24426D3B4 (fixCheckThreading) is supported and will be up voted if not enabled on the ledger.
2021-Dec-09 21:31:53.285527 UTC Amendments:DBG Amendment C4483A1896170C66C098DEA5B0E024309C60DC960DE5F01CD7AF986AA3D9AD37 (fixMasterKeyAsRegularKey) is supported and will be up voted if not enabled on the ledger.
2021-Dec-09 21:31:53.285550 UTC Amendments:DBG Amendment 621A0B264970359869E3C0363A899909AAB7A887C8B73519E4ECF952D33258A8 (fixPayChanRecipientOwnerDir) is supported and will be up voted if not enabled on the ledger.
2021-Dec-09 21:31:53.285575 UTC Amendments:DBG Amendment 89308AF3B8B10B7192C4E613E1D2E4D9BA64B2EE2D5232402AE82A6A7220D953 (fixQualityUpperBound) is supported and will be up voted if not enabled on the ledger.
2021-Dec-09 21:31:53.285614 UTC Amendments:DBG Amendment B6B3EEDC0267AB50491FDC450A398AF30DBCD977CECED8BEF2499CAB5DAC19E2 (fixRmSmallIncreasedQOffers) is supported and will be up voted if not enabled on the ledger.
2021-Dec-09 21:31:53.285651 UTC Amendments:DBG Amendment 452F5906C46D46F407883344BFDD90E672B672C5E9943DB4891E3A34FEEEB9DB (fixSTAmountCanonicalize) is supported and will be up voted if not enabled on the ledger.
2021-Dec-09 21:31:53.285725 UTC Amendments:DBG Amendment 2CD5286D8D687E98B41102BDD797198E81EA41DF7BD104E6561FEB104EFF2561 (fixTakerDryOfferRemoval) is supported and will be up voted if not enabled on the ledger.
2021-Dec-09 21:31:53.290446 UTC Server:NFO Opened 'port_rpc_admin_local' (ip=127.0.0.1:7005, admin IPs:127.0.0.1, http)
2021-Dec-09 21:31:53.290834 UTC Server:NFO Opened 'port_ws_admin_local' (ip=127.0.0.1:7006, admin IPs:127.0.0.1, ws)
2021-Dec-09 21:31:53.290984 UTC Application:WRN Running in standalone mode
2021-Dec-09 21:31:53.291048 UTC NetworkOPs:NFO STATE->full
2021-Dec-09 21:31:53.291192 UTC Application:FTL Startup RPC: 
{
    "command" : "log_level",
    "severity" : "debug"
}


2021-Dec-09 21:31:53.291347 UTC RPCHandler:DBG RPC call log_level completed in 2.2e-08seconds
2021-Dec-09 21:31:53.291440 UTC Application:FTL Result: 
{
    "warnings" : 
    [
        
        {
            "id" : 1004,
            "message" : "This is a reporting server.  The default behavior of a reporting server is to only return validated data. If you are looking for not yet validated data, include \"ledger_index : current\" in your request, which will cause this server to forward the request to a p2p node. If the forward is successful the response will include \"forwarded\" : \"true\""
        }
    ]
}


2021-Dec-09 21:31:53.291502 UTC ReportingETL:NFO Starting reporting etl
2021-Dec-09 21:31:53.291605 UTC Application:NFO Application starting. Version is 1.8.1+DEBUG
2021-Dec-09 21:31:53.291747 UTC LoadManager:DBG Starting
2021-Dec-09 21:31:53.291846 UTC gRPC Server:NFO Starting gRPC server at 0.0.0.0:60051
2021-Dec-09 21:31:53.293246 UTC LedgerCleaner:DBG Started
2021-Dec-09 21:31:53.295543 UTC ReportingETL::ETLSource:DBG handleMessage : Received a message on ledger  subscription stream. Message : {
   "result" : {},
   "status" : "success",
   "type" : "response"
}
 - { validated_ledger :  , ip : 127.0.0.1 , web socket port : 6006, grpc port : 50051 }
2021-Dec-09 21:31:53.368075 UTC ReportingETL:NFO monitor : Database is empty. Will download a ledger from the network.
2021-Dec-09 21:31:53.368183 UTC ReportingETL:NFO monitor : Waiting for next ledger to be validated by network...
```

## よくある質問


**レポートモードを使用するには、`rippled`インスタンスを実行する必要がありますか？**

はい。レポートモードで動作している`rippled`サーバはピアツーピアネットワークに接続せず、ネットワークに接続されている一つ以上の`rippled`サーバから有効なデータを抽出します。そのため、少なくとも一つのP2Pモードサーバを動作させる必要があります。

**すでに`rippled`をインストールしています。設定ファイルを更新して`rippled`を再起動しレポートモードを有効にすることはできますか？**

現在のところ、レポートモードではソースをダウンロードして`rippled`をビルドする必要があります。レポートモード用のパッケージを提供するための作業が進められています。


**レポートモードで`rippled`を実行するには、P2Pモードで動作している`rippled`サーバが少なくとも1つ必要です。これはディスク容量が2倍必要ということですか？**

答えは、プライマリデータストアの場所に依存します。プライマリデータストアにCassandraを使用する場合、レポートモードサーバがローカル・ディスクに保存するデータはかなり少なくなります。PostgreSQLサーバはリモートでもかまいません。複数のレポートモードサーバで同じデータを共有できます。

最後に、P2Pモードサーバはごく最近の履歴しか保持する必要がありませんが、レポートモードサーバは長期間の履歴を保持します。

`rippled`を実行するためのシステム要件については、[`rippled`のシステム要件](system-requirements.md)をご覧ください。

**PostgreSQLまたはCassandraデータベースから送られてくるデータの信頼性を確認するにはどうすればよいですか。**

レポートモードで`rippled`を実行すると、設定ファイルで指定されたETLソースからの有効なデータのみを提供します。P2Pモードで他人の`rippled`サーバをETLソースとして使用している場合、そのサーバを暗黙的に信頼することになります。そうでない場合は、自分の`rippled`ノードをP2Pモードで実行する必要があります。

**APIを使用するのではなく、リレーショナルデータベースに対して従来のSQLクエリを実行することは可能ですか？**

技術的には、データベースに直接アクセスすることも*可能*です。しかし、データはバイナリーBlobとして保存されており、その中のデータにアクセスするにはBlobをデコードしなければなりません。このため、従来のSQLクエリは、データの個々のフィールドを検索したりフィルタリングしたりすることができず、あまり役に立ちません。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
