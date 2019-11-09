# Amendment

[導入: rippled 0.31.0][]

Amendmentシステムは、混乱を生じさせることなく、分散型のXRP Ledgerネットワークに新しい機能を導入する方法を提供します。Amendmentシステムは、ネットワークのコンセンサスの主要プロセスを利用して、継続的なサポートを含めて変更を承認し適用される仕組みになっています。Amendmentを適用するには通常、**80%のサポートが2週間にわたって**必要になります。

Amendmentが有効になると、そのAmendmentが含まれているバージョン以降のすべてのレジャーバージョンに永続的に適用されます。Amendmentを無効にすることはできません。ただし、Amendmentを無効にするための新しいAmendmentを導入する場合は除きます。

既知のAmendment、それらのステータス、およびIDのリストについては、以下を参照してください: [既知のAmendment](known-amendments.html)

## 背景

トランザクション処理に変更があると、サーバーで同じトランザクションのセットを使用して別のレジャーが作成される場合があります。一部の _バリデータ_ （[コンセンサスに参加している](rippled-server-modes.html#バリデータを運用する理由)`rippled`サーバー）が古いバージョンのソフトウェアを使用している状態で、他のバリデータが新しいバージョンのソフトウェアにアップグレードすると、ごく小さな問題から、場合によっては完全機能停止などの問題が生じる可能性があります。希なケースでは、少数のサーバーにおいて、実際のコンセンサスレジャーを取得するために、より多くの時間と帯域幅が使用される場合があります。既知のトランザクションの処理ルールを使ってレジャーを構築できないためです。最悪の場合、異なるルールを使用するサーバー間で当該レジャーについてコンセンサスに達することができないため、[コンセンサスプロセス][]により新しいレジャーバージョンを検証できない可能性があります。

Amendmentはこの問題を解決し、十分なバリデータがそれらの機能をサポートしている場合にのみ新しい機能を有効にします。

XRP Ledgerを使用しているユーザーや企業は、業務に影響を及ぼす可能性があるトランザクション処理の変更について事前に通知するためにAmendmentを使用することもできます。ただし、トランザクション処理や[コンセンサスプロセス][]に影響のないAPIを変更する場合、Amendmentは不要です。

[コンセンサスプロセス]: consensus.html


## Amendmentについて

Amendmentは、正常に動作する機能や変更であり、コンセンサスプロセスの一環としてピアツーピアサーバーのネットワークで有効になるのを待っています。Amendmentを使用する`rippled`サーバーには、Amendmentなし（古い動作）とAmendmentあり（新しい動作）の2種類のモードのコードがあります。

各Amendmentには、識別用の一意の16進値および短縮名が付けられています。短縮名は人間が使用するためのものであり、Amendmentプロセスでは使用されません。説明用に異なった名前を使った場合でも、2つのサーバーで同じAmendment IDを使用できます。Amendmentの名前が一意であるという保証はありません。

慣例により、Rippleの開発者は、Amendment名のSHA-512HalfハッシュをAmendment IDとして使用します。


## Amendmentプロセス

256番目毎のレジャーは、「フラグ」レジャーと呼ばれます。Amendmentの承認プロセスは、フラグレジャーの直前のレジャーバージョンで開始されます。`rippled`のバリデータサーバーは、そのレジャーの検証メッセージを送信するときに、具体的なAmendmentへの賛成票も送信します。バリデータがAmendmentに賛成票を投じない場合は、そのAmendmentに対して反対票を投じていることを意味します。（[手数料の投票](fee-voting.html)もフラグレジャーで行われます。）

フラグレジャー自体に特別な内容はありません。ただし、その間、サーバーは信頼するバリデータの投票を確認し、[`EnableAmendment` 疑似トランザクション](enableamendment.html)を次のレジャーに挿入するかどうかを決定します。EnableAmendmentの疑似トランザクションのフラグは、サーバーが発生したとみなす内容を示しています。

* `tfGotMajority`フラグは、Amendmentのサポートが、信頼できるバリデータの80%以上に増加したことを意味します。
* `tfLostMajority`フラグは、Amendmentのサポートが、信頼できるバリデータの80%未満に減少したことを意味します。
* フラグのないEnableAmendment擬似トランザクションは、そのAmendmentのサポートが有効になっていることを意味します。（トランザクション処理の変更は、これ以降のすべてのレジャーに適用されます。）

次の条件がすべて満たされた場合にのみ、サーバーは疑似トランザクションを挿入してAmendmentを有効にします。

* このAmendmentはまだ有効になっていない。
* 前のレジャーには、`tfGotMajority`フラグが有効な状態で、このAmendmentに対するEnableAmendment疑似トランザクションが含まれている。
* 当該前レジャーは、現行のレジャーの前のバージョンである。
* 当該前レジャーの終了時刻は、最新のフラグレジャーの終了時刻の少なくとも**2週間**前である。
* `tfGotMajority`疑似トランザクションと現行のレジャーの間のコンセンサスレジャーには、この修正に対するEnableAmendment疑似トランザクションで、`tfLostMajority`フラグが有効になっているものはない。

理論的には、`tfLostMajority` EnableAmendment擬似トランザクションを、Amendmentを有効にするための擬似トランザクションと同じレジャーに含めることができます。この場合、`tfLostMajority`擬似トランザクションを含む擬似トランザクションは効果がありません。

## Amendment投票

`rippled`の各バージョンは、既知のAmendmentのリストとそれらのAmendmentを実装するためのコードでコンパイルされています。デフォルトでは、`rippled`は既知のAmendmentをサポートし、未知のAmendmentに反対します。`rippled`バリデータのオペレーターは、特定のAmendmentが`rippled`バージョンにとって既知でない場合でも、そのAmendmentを明示的にサポートまたは反対するように[サーバーを設定](#amendment投票の設定)することができます。

有効にするには、Amendmentが、信頼済みのバリデータの80%以上に2週間継続してサポートされている必要があります。Amendmentのサポートが信頼できるバリデータの80%を下回ると、そのAmendmentは一時的に拒否されます。Amendmentが信頼済みのバリデータの少なくとも80%のサポートを取り戻した場合は、そこから2週間の期間が再スタートします。（この状況は、バリデータの投票内容が変わった場合や、バリデータの信頼に変化があった場合に発生します。）Amendmentが永続的に有効になるまでに、何度も過半数の支持を得たり失ったりすることがあります。Amendmentが永続的に拒否されることはありませんが、新しいバージョンの`rippled`の既知のAmendmentのリストにないAmendmentが有効になることはほとんどありません。

コンセンサスプロセスのすべてにおいてと同様に、Amendmentの投票は、投票を送信しているバリデータを信頼するサーバーによってのみ有効とみなされます。現時点では、Ripple社は、Rippleが運用するデフォルトのバリデータのみを信頼することを推奨しています。今のところ、新機能のリリースに関してRippleと協力するには、それらのバリデータのみを信頼するだけで十分です。

### Amendment投票の設定

[featureメソッド][]を使用してAmendmentを一時的に設定できます。サーバーのAmendmentに対するサポートを永続的に変更するには、サーバーの`rippled.cfg`ファイルを変更します。

サーバーに賛成票を投じさせたくないAmendmentを表示するには、`[veto_amendments]`スタンザを使用します。各行には1つのAmendmentの一意のIDを含める必要があり、必要に応じて、その後にAmendmentの短縮名を続けます。例:

```
[veto_amendments]
C1B8D934087225F509BEB5A8EC24447854713EE447D277F69545ABFA0E0FD490 Tickets
DA1BD556B42D85EA9C84066D028D355B52416734D3283F85E216EA5DA6DB7E13 SusPay
```

投票するAmendmentを表示するには、`[amendments]`スタンザを使用します。（ここで表示しなくても、サーバーは、適用方法を把握しているすべてのAmendmentにデフォルトで賛成票を投じます。）各行には1つのAmendmentの一意のIDを含める必要があり、必要に応じて、その後にAmendmentの短縮名を続けます。例:

```
[amendments]
4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373 MultiSign
42426C4D4F1009EE67080A9B7965B44656D7714D104A72F9B4369F97ABF044EE FeeEscalation
```


### Amendment blocked

投票プロセス後にネットワークに対してAmendmentが有効になると、そのAmendmentを認識していない、以前のバージョンの`rippled`を実行しているサーバーは、ネットワークのルールを認識できなくなるため、「Amendment blocked」状態になります。Amendment blockedの状態のサーバーは次のようになります。

* レジャーのバリデータを判断できない
* トランザクションを送信または処理できない
* コンセンサスプロセスを行わない
* 今後のAmendmentに投票しない

Amendment blockedは、XRP Ledgerに依存するアプリケーションを保護するためのセキュリティー機能です。新しいルールが適用された後のレジャーを推測したり誤解したりしないように、`rippled`は、Amendmentがどのように動作するか確認できないためにレジャーの状態が不明であると報告します。

`rippled`サーバーが賛成票または反対票を投じるように設定されているAmendmentは、そのサーバーがAmendment blockedの状態になるかどうかに影響を与えません。`rippled`サーバーは、可能な限り、ネットワークの他の部分によって有効なった一連のAmendmentに従います。有効なAmendmentがサーバーのソースコード内のAmendment定義に含まれていない場合、つまりAmendmentがサーバーよりも新しい場合にのみ、サーバーはAmendment blockedになります。

サーバーがAmendment blockedである場合は、[新しいバージョンにアップグレード](install-rippled.html)してネットワークと同期する必要があります。


#### `rippled`サーバーがAmendment blockedの状態かどうかを確認する方法

`rippled`サーバーがAmendment blockedの状態であるという最初の兆候のひとつに、[トランザクションの送信時](submit.html)に返される`amendmentBlocked`エラーがあります。`amendmentBlocked`エラーの例を以下に示します。

```
{
   "result":{
      "error":"amendmentBlocked",
      "error_code":14,
      "error_message":"Amendment blocked, need upgrade.",
      "request":{
         "command":"submit",
         "tx_blob":"479H0KQ4LUUXIHL48WCVN0C9VD7HWSX0MG1UPYNXK6PI9HLGBU2U10K3HPFJSROFEG5VD749WDPHWSHXXO72BOSY2G8TWUDOJNLRTR9LTT8PSOB9NNZ485EY2RD9D80FLDFRBVMP1RKMELILD7I922D6TBCAZK30CSV6KDEDUMYABE0XB9EH8C4LE98LMU91I9ZV2APETJD4AYFEN0VNMIT1XQ122Y2OOXO45GJ737HHM5XX88RY7CXHVWJ5JJ7NYW6T1EEBW9UE0NLB2497YBP9V1XVAEK8JJYVRVW0L03ZDXFY8BBHP6UBU7ZNR0JU9GJQPNHG0DK86S4LLYDN0BTCF4KWV2J4DEB6DAX4BDLNPT87MM75G70DFE9W0R6HRNWCH0X075WHAXPSH7S3CSNXPPA6PDO6UA1RCCZOVZ99H7968Q37HACMD8EZ8SU81V4KNRXM46N520S4FVZNSJHA"
      },
      "status":"error"
   }
}
```

次の`rippled`ログメッセージも、サーバーがAmendment blockedであることを示しています。

```
2018-Feb-12 19:38:30 LedgerMaster:ERR One or more unsupported amendments activated: server blocked.
```

`rippled`バージョン0.80.0以降を使用している場合は、[`server_info`](server_info.html)コマンドを使用して`rippled`サーバーがAmendment blockedであるかを確認できます。応答内で、`result.info.amendment_blocked`を探します。`amendment_blocked`が`true`に設定されている場合、サーバーはAmendment blockedの状態です。

**JSON-RPC応答の例:**

```
{
    "result": {
        "info": {
            "amendment_blocked": true,
            "build_version": "0.80.1",
            "complete_ledgers": "6658438-6658596",
            "hostid": "ip-10-30-96-212.us-west-2.compute.internal",
            "io_latency_ms": 1,
            "last_close": {
                "converge_time_s": 2,
                "proposers": 10
            },
...
        },
        "status": "success"
    }
}
```

サーバーがAmendment blockedでない場合、応答で`amendment_blocked`フィールドは返されません。

**注意:** `rippled` 0.80.0より前のバージョンでは、サーバーがAmendment blockedである場合でも`amendment_blocked`フィールドは含まれません。


#### Amendment blockedの状態の`rippled`サーバーのブロックを解除する方法

サーバーがAmendment blockedとなる原因となっているAmendmentをサポートする`rippled`バージョンにアップグレードします。Rippleでは、[最新の`rippled`バージョンにアップグレード](install-rippled.html)してサーバーのブロックを解除し、ネットワークと再同期できるようにすることを推奨しています。

状況によっては、最新のバージョンよりも古い`rippled`バージョンにアップグレードすることで、サーバーのブロックを解除できる場合があります。これが可能なのは、その古いバージョンが、`rippled`サーバーをブロックしているAmendmentをサポートしている場合です。

**警告:** 最新の`rippled`バージョンでセキュリティーまたはその他の緊急の修正が提供されている場合は、できるだけ早く最新バージョンにアップグレードしてください。

最新バージョンよりも古いバージョンにアップグレードして`rippled`サーバーのブロックを解除できるかどうかを判断するには、サーバーをブロックしている機能を調べ、そのブロックしている機能をサポートしている`rippled`バージョンを調べます。

`rippled`サーバーをブロックしている機能を調べるには、[`feature`](feature.html)管理コマンドを使用します。`"enabled" : true`と`"supported" : false`を含む機能を探します。これらの機能の値は、最新のレジャーでAmendmentが現在有効になっている（必須）が、Amendmentをサポートまたは適用する方法がサーバーに認識されていないことを意味します。

**JSON-RPC応答の例:**

```
{
    "result": {
        "features": {
            "07D43DCE529B15A10827E5E04943B496762F9A88E3268269D69C44BE49E21104": {
                "enabled": true,
                "name": "Escrow",
                "supported": true,
                "vetoed": false
            },
            "08DE7D96082187F6E6578530258C77FAABABE4C20474BDB82F04B021F1A68647": {
                "enabled": true,
                "name": "PayChan",
                "supported": true,
                "vetoed": false
            },
            "1562511F573A19AE9BD103B5D6B9E01B3B46805AEC5D3C4805C902B514399146": {
                "enabled": false,
                "name": "CryptoConditions",
                "supported": true,
                "vetoed": false
            },
            "157D2D480E006395B76F948E3E07A45A05FE10230D88A7993C71F97AE4B1F2D1": {
                "enabled": true,
                "supported": false,
                "vetoed": false
            },
...
            "67A34F2CF55BFC0F93AACD5B281413176FEE195269FA6D95219A2DF738671172": {
                "enabled": true,
                "supported": false,
                "vetoed": false
            },
...
            "F64E1EABBE79D55B3BB82020516CEC2C582A98A6BFE20FBE9BB6A0D233418064": {
                "enabled": true,
                "supported": false,
                "vetoed": false
            }
        },
        "status": "success"
    }
}
```

この例では、次の機能との競合により、`rippled`サーバーがAmendment blockedになっています。

* `157D2D480E006395B76F948E3E07A45A05FE10230D88A7993C71F97AE4B1F2D1`

* `67A34F2CF55BFC0F93AACD5B281413176FEE195269FA6D95219A2DF738671172`

* `F64E1EABBE79D55B3BB82020516CEC2C582A98A6BFE20FBE9BB6A0D233418064`

これらの機能をサポートしている`rippled`バージョンを見つけるには、[既知のAmendment](known-amendments.html)を参照してください。


## Amendmentのテスト

Amendmentが有効になっている場合の`rippled`の動作を確認するには、そのAmendmentが実稼働ネットワークで有効になる前に、`rippled`の構成ファイルを実行して強制的に機能を有効にします。これは、開発目的でのみサポートされています。

コンセンサスネットワークの他のメンバーはこの機能を有効にしていない可能性があるため、実稼働ネットワークに接続されている間はこの機能を使用しないでください。機能を強制的に有効にしてテストしている間は、[スタンドアロンモード](rippled-server-modes.html#rippledサーバーをスタンドアロンモードで実行する理由)で`rippled`を実行する必要があります。

機能を強制的に有効にするには、`[features]`スタンザを`rippled.cfg`ファイルに追加します。このスタンザで、有効にする機能の名前の短縮名を1行に1つずつ追加します。例:

```
[features]
MultiSign
TrustSetAuth
```


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
