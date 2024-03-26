---
html: ledger-history.html
parent: networks-and-servers.html
seo:
    description: rippledサーバはトランザクションの変動金額と状態の履歴をローカルに保管します。
labels:
  - データ保持
  - ブロックチェーン
  - コアサーバ
---
# レジャー履歴

[コンセンサスプロセス](../consensus-protocol/index.md)により、[検証済みレジャーバージョン](../ledgers/index.md)のチェーンが作成されます。各バージョンは、以前のバージョンに[トランザクション](../transactions/index.md)のセットを適用して生成されます。各[`rippled`サーバ](index.md)には、レジャーバージョンとトランザクション履歴がローカルに保管されます。サーバに保管されるトランザクション履歴の量は、サーバがオンラインであった期間と、サーバが取得し、保持する履歴量の設定に応じて異なります。

ピアツーピアのXRP Ledgerネットワーク内のサーバは、コンセンサスプロセスの一環としてトランザクションやその他のデータを相互に共有します。各サーバは個別に新しいレジャーバージョンを作成し、その結果を信頼できるバリデータと比較して、整合性を維持します。（信頼できるバリデータのコンセンサスがサーバの結果と一致しない場合は、サーバがピアから必要なデータを取得して整合性を維持します。）サーバはピアから古いデータをダウンロードして、利用可能な履歴のギャップを埋めることができます。レジャーはデータの暗号[ハッシュ](../../references/protocol/data-types/basic-data-types.md#ハッシュ)を使用した構造となっているため、すべてのサーバがデータの整合性の検証を行えます。

## データベース

サーバはレジャーの状態データとトランザクションを _レジャーストアー_ と呼ばれるkey-valueストアで保持します。また、`rippled`にはいくつかのSQLiteデータベースファイルが維持されているので、トランザクション履歴などへより柔軟にアクセスし、特定の設定変更を追跡できます。

一般に、`rippled`サーバが稼働していないときにはそのサーバのすべてのデータベースファイルを安全に削除できます。（たとえばサーバのストレージ設定を変更する場合や、Test Netから本番環境ネットワークに切り替える場合に、このような削除が必要となることがあります。）

## 利用可能な履歴

設計上、XRP Ledgerのすべてのデータとトランザクションは公開されており、誰でもすべてのデータを検索または照会できます。ただし、サーバが検索できるデータは、そのサーバがローカルで使用できるデータに限られます。サーバで利用できないレジャーバージョンやトランザクションを照会しようとすると、そのデータが見つからないというレスポンスがサーバから返されます。必要な履歴を保持している他のサーバに対して同じ照会を実行すると、正常なレスポンスが返されます。XRP Ledgerデータを使用する企業では、サーバで利用可能な履歴の量に注意してください。

[server_infoメソッド][]は、サーバで利用可能なレジャーバージョンの数を`complete_ledgers`フィールドで報告します。

## 履歴の取得

`rippled`サーバは起動されると、最優先で最新の検証済みレジャーの完全なコピーを取得します。その後、サーバは常にレジャーの進行状況を把握します。レジャー履歴を埋め戻すように設定されているサーバでは、レジャー履歴が設定量に達するまで埋め戻されます。この設定量は、オンライン削除による削除が開始されるカットオフ値以下でなければなりません。

履歴の埋め戻しは、サーバの最も低い優先順位の1つであるため、特にサーバが忙しい場合や、ハードウェアやネットワークのスペックが十分でない場合、不足する履歴を埋めるのに長い時間がかかることがあります。ハードウェアのスペックに関する推奨事項は、[容量計画](../../infrastructure/installation/capacity-planning.md)をご覧ください。また、履歴を埋め戻すには、サーバのダイレクトピアのうち少なくとも1つが該当する履歴を持っていることが必要です。サーバのピアツーピア接続の管理については、[ピアリングの設定](../../infrastructure/configuration/peering/index.md)をご覧ください。

XRP Ledgerは、コンテンツの一意のハッシュを使用して（さまざまなレベルの）データを識別します。XRP Ledgerの状態データには、レジャーの履歴の概要が[LedgerHashesオブジェクトタイプ](../../references/protocol/ledger-data/ledger-entry-types/ledgerhashes.md)の形式で含まれています。サーバはLedgerHashesオブジェクトを使用して取得するレジャーバージョンを認識し、受信するレジャーデータが正しく完全であることを確認します。


<a id="with-advisory-deletion"></a>
### 履歴の埋め戻し
{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.6.0" %}新規: rippled 1.6.0{% /badge %}

サーバがダウンロードしようとする履歴の量は、その設定に依存します。サーバは自動的に、**最も古い台帳までの履歴**をダウンロードしてギャップを埋めようとします。`[ledger_history]`設定を使用すると、サーバがそれ以降の履歴を埋め戻すようにすることができます。ただし、[削除](../../infrastructure/configuration/data-retention/online-deletion.md)が予定されている台帳は、サーバがダウンロードすることはありません。

`[ledger_history]`設定は、現在有効な台帳の前から蓄積する台帳の最小数を定義します。ネットワークの[完全な履歴](#すべての履歴)をダウンロードするには、特別な値`full`を使用します。`[ledger_history]`設定を使用して、サーバに _より少ない_ 履歴をダウンロードさせることはできません。サーバが保存する履歴の量を減らすには、代わりに[オンライン削除](../../infrastructure/configuration/data-retention/online-deletion.md)設定を変更してください。

## すべての履歴

XRP Ledgerネットワーク内の一部のサーバは、「すべての履歴が記録される」サーバとして設定されています。これらのサーバは、使用可能なすべてのXRP Ledgerの履歴を収集しますが、**オンライン削除は使用しません**。このため他の追跡サーバよりもかなり多くのディスク容量が必要です。

XRP Ledger財団は、コミュニティメンバーが運営する一連の全履歴サーバへのアクセスを提供しています（詳細は[xrplcluster.com](https://xrplcluster.com)を参照）。
また、Ripple社は公開サービスとして、`s2.ripple.com`に一連の公開全履歴サーバを提供しています。

**ヒント:** 一部の暗号資産ネットワークとは異なり、XRP Ledgerのサーバは、現在の状態を認識して最新のトランザクションを把握するのにすべての履歴を必要としません。

すべての履歴の設定については、[完全な履歴の設定](../../infrastructure/configuration/data-retention/configure-full-history.md)をご覧ください。

## 履歴シャーディング

XRP Ledgerのすべての履歴を1台の高価なマシンに保管する代わりに、複数のサーバがレジャー履歴の一部分を保管するように構成できます。これは[履歴シャーディング](../../infrastructure/configuration/data-retention/history-sharding.md)機能によって実現します。一定範囲のレジャー履歴が _シャードストアー_ という個別の保管領域に保管されます。ピアサーバから（上記の[履歴の取得](#履歴の取得)で説明したとおり）特定のデータがリクエストされると、サーバはレジャーストアーまたはシャードストアーのデータを使用してレスポンスできます。

オンライン削除ではシャードストアーのデータは削除**されません**。ただし、32768個以上のレジャーバージョンをサーバのレジャーストアーに保持するようにオンライン削除が設定されていれば、レジャーストアーからデータが自動的に削除される前に、サーバはレジャーストアーからシャードストアーにすべてのシャードをコピーできます。

詳細は、[履歴シャーディングの設定](../../infrastructure/configuration/data-retention/configure-history-sharding.md)をご覧ください。

## 関連項目

- **コンセプト:**
    - [レジャー](../ledgers/index.md)
    - [コンセンサス](../consensus-protocol/index.md)
- **チュートリアル:**
    - [`rippled`の設定](../../infrastructure/configuration/index.md)
        - [オンライン削除の設定](../../infrastructure/configuration/data-retention/configure-online-deletion.md)
        - [指示による削除の設定](../../infrastructure/configuration/data-retention/configure-advisory-deletion.md)
        - [履歴シャーディングの設定](../../infrastructure/configuration/data-retention/configure-history-sharding.md)
        - [全履歴の設定](../../infrastructure/configuration/data-retention/configure-full-history.md)
- **リファレンス:**
    - [ledgerメソッド][]
    - [server_infoメソッド][]
    - [ledger_requestメソッド][]
    - [can_deleteメソッド][]
    - [ledger_cleanerメソッド][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
