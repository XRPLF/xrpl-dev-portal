---
html: rippled-server-modes.html
parent: xrpl-servers.html
blurb: ストックサーバー、バリデータサーバー、スタンドアロンモードで運用されるrippledサーバーなど、rippledサーバーのモードについて説明します。
labels:
  - コアサーバー
---
# rippledサーバーのモード

`rippled`サーバーソフトウェアは、その設定に応じて以下のようなさまざまなモードで実行できます。

* ストックサーバー - レジャーのローカルコピーを保持し、ネットワークをフォローします。
* 検証サーバー（ _バリデータ_ ）- コンセンサスの参加者（ストックサーバーの処理もすべて行います）。
* `rippled`スタンドアロンモードのサーバー - テスト用。他の`rippled`サーバーと通信しません。

また、[`rippled` API](http-websocket-apis.html)にローカルでアクセスするためのクライアントアプリケーションとして、`rippled`実行可能ファイルを実行できます。（この場合同じバイナリの2つのインスタンスを並列して実行できます。1つのインスタンスをサーバーとして実行し、もう1つのインスタンスをクライアントとして一時的に実行して終了します。）

各モードでrippledを実行するためのコマンドについては、[rippledコマンドライン使用リファレンス](commandline-usage.html)を参照してください。


## ストックサーバーを運用する理由

独自の`rippled`サーバーを運用する理由は多数ありますが、その最たる理由として、独自サーバーが信頼できるものであり、自身でその負荷を管理でき、サーバーにアクセスするタイミングとアクセス方法を他のユーザーに依存せずに決めることができる点があげられます。もちろん、独自サーバーを不正使用者から保護するために適切なネットワークセキュリティ対策を講じなければなりません。

使用する`rippled`を信頼する必要があります。悪意のあるサーバーに接続してしまうと、そのサーバーはさまざまな方法であなたを利用して資金を失わせることができます。例:

* 悪意のあるサーバーは、実際には行われていないあなたへの支払いが行われたと報告することがあります。
* ペイメントパスと通貨取引オファーを選択的に表示または非表示にし、最適なディールをあなたに提示せずに不正使用者の利益になるようにします。
* 悪意のあるサーバーにアドレスのシークレットキーを送信すると、このサーバーがあなたの代理として任意のトランザクションを実行し、アドレスが保有する資金全額を送金または消却することがあります。

さらに、独自サーバーを運用することでサーバーを制御できるようになり、重要な管理者専用コマンドや負荷の高いコマンドを実行できます。共有サーバーを使用する場合は、同じサーバーを利用する他のユーザーとサーバーのコンピューティング能力をめぐって競合することに注意する必要があります。WebSocket APIのコマンドの多くは、サーバーに大きな負荷をかけるため、`rippled`には必要に応じてその応答を縮小できるオプションがあります。サーバーを他のユーザーと共有する場合には、常に最適の結果を得られるとは限りません。

最後に、各自で検証サーバーを運用する場合には、ストックサーバーをパブリックネットワークへのプロキシとして使用し、ストックサーバー経由でのみ外部にアクセス可能なプライベートサブネット上で検証サーバーを維持することができます。これにより、検証サーバーの整合性を危うくすることはさらに難しくなります。

### 公開ハブ

公開ハブは、他のサーバーへの[ピアプロトコル接続](peer-protocol.html)が多数あるストックサーバーを指します。ストックサーバーを公開ハブとして実行することで、XRP Ledgerネットワークの効率的な接続を維持できます。適切に運用されている公開ハブには、以下の特徴があります。

- 十分な帯域幅。

- 多数の信頼できるピアとの接続。

- メッセージを確実に中継する能力。



## バリデータを運用する理由

XRP Ledgerの堅牢性は、バリデータが相互に接続されたネットワークに依存しています。各バリデータは、他の何人かのバリデータが _共謀しない_ と信頼しています。利害の異なるバリデータ運用オペレーターが増えるほど、ネットワークの各メンバーは、ネットワークが引き続き公平に運営されることに確信が持てるようになります。XRP Ledgerを使用している組織や個人の場合、コンセンサスプロセスへ参加することが自らの利益につながります。

すべての`rippled`サーバーをバリデータとする必要はありません。信頼する同一オペレーターのサーバーの数が増えても、共謀の発生をよりよく防止できるわけではありません。組織が自然災害などの緊急事態に備えて冗長性を保つために、複数の地域でバリデータを運用することがあります。

組織が検証サーバーを運用している場合は、1つ以上のストックサーバーを実行して、APIアクセスの計算負荷のバランスを取ったり、それらを検証サーバーと外部ネットワーク間のプロキシとすることもできます。

バリデータの実行についての詳細は、[バリデータとしての`rippled`の実行](run-rippled-as-a-validator.html)を参照してください。



## `rippled`サーバーをスタンドアロンモードで実行する理由

信頼できるサーバーのコンセンサスなしでも、`rippled`をスタンドアロンモードで実行できます。スタンドアロンモードでは、`rippled`はXRP Ledgerピアツーピアネットワーク内のその他のサーバーとは通信しませんが、同じ操作のほとんどをローカルサーバーのみで実行できます。スタンドアロンでは、本番環境ネットワークに接続せずに`rippled`の動作をテストできます。たとえば、分散型ネットワークにAmendmentが反映される前に、[Amendmentの効果をテスト](amendments.html#amendmentのテスト)できます。

`rippled`をスタンドアロンモードで実行する場合、どのレジャーバージョンから開始するかを指示する必要があります。

* [新しいジェネシスレジャー](start-a-new-genesis-ledger-in-stand-alone-mode.html)を最初から作成する。
* ディスクから[既存のレジャーバージョンを読み込む](load-a-saved-ledger-in-stand-alone-mode.html)。

**注意:** スタンドアロンモードでは[レジャーを手動で進める](advance-the-ledger-in-stand-alone-mode.html)必要があります。

## レポーティングモード
[導入: rippled 1.7.0][][]

<!-- TODO: translate this section -->
Reporting mode is specialized mode for serving API requests more efficiently. In this mode, the server gets the latest validated ledger data over [gRPC](https://xrpl.org/configure-grpc.html) from a separate `rippled` server running in P2P Mode, then loads that data into a relational database ([PostgreSQL](https://www.postgresql.org/)). The reporting mode server does not directly participate in the peer-to-peer network, though it can forward requests such as transaction submission to the P2P Mode server it uses.

Multiple reporting mode servers can share access to a PostgreSQL database and [Apache Cassandra](https://cassandra.apache.org/) cluster to serve a large amount of history without each server needing a redundant copy of all the data. Reporting mode servers provide this data through the same [`rippled` APIs](http-websocket-apis.html) with some slight changes to accommodate for the differences in how they store the underlying data.

Most notably, reporting mode servers do not report pending, non-validated ledger data or transactions. This limitation is relevant to certain use cases that rely on rapid access to in-flux data, such as performing arbitrage in the [decentralized exchange](decentralized-exchange.html).



## 関連項目

- **リファレンス:**
  - [コマンドライン使用リファレンス](commandline-usage.html) - すべての`rippled`サーバーモードのコマンドラインオプションに関する詳細情報。
  - [ledger_acceptメソッド][] - スタンドアロンモードでレジャーを手動で進めます。
  - [featureメソッド][] - 現在有効になっている既知の[Amendment](amendments.html)を確認します。
- **チュートリアル:**
  - [`rippled`の構成](configure-rippled.html)
    - [バリデータとしての`rippled`の実行](run-rippled-as-a-validator.html)
  - [スタンドアロンモードでのrippledの使用](use-stand-alone-mode.html):
    - [スタンドアロンモードでの新しいジェネシスレジャーの開始](start-a-new-genesis-ledger-in-stand-alone-mode.html)
    - [スタンドアロンモードでの保存済みレジャーの読み込み](load-a-saved-ledger-in-stand-alone-mode.html)
    - [スタンドアロンモードでレジャーを進める](advance-the-ledger-in-stand-alone-mode.html)


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			 
{% include '_snippets/tx-type-links.md' %}			 
{% include '_snippets/rippled_versions.md' %}
