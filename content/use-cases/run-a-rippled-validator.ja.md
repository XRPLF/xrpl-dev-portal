# rippledバリデータの実行

各`rippled`サーバー（スタンドアロンモードで実行されているのではない）は、ピアのネットワークに接続し、暗号化署名されたトランザクションを中継し、共有のグローバル台帳の完全なローカルコピーを維持します。バリデータモードで実行されている`rippled`サーバーはコンセンサスプロセスに参加し、相互接続された共謀しない信頼できる特定のセットのバリデータのネットワークを形成します。以下に、`rippled`バリデータを実行するために必要な作業の概要を示します。

<!-- USE_CASE_STEPS_START -->
{% set n = cycler(* range(1,99)) %}

<span class="use-case-step-num">{{n.next()}}</span>
<!-- <span class="use-case-step-length">(1 hour)</span> -->
## [バリデータを実行することの意味を理解する](rippled-server-modes.html#バリデータを運用する理由)

貴社または貴社の組織がXRP Ledgerを使用する場合、バリデータとしてコンセンサスプロセスに参加し、信頼できるバリデータとして進行中のXRP Ledgerの分散化を支援することは貴社にとっても利益となります。

また独立した開発者であれば、XRP Ledgerネットワークをサポートするテクノロジーに触れる、あるいは参画する手段としてバリデータとなることがあるかも知れません。

バリデータの多様性は重要ですが、すべてのバリデータが広く信頼されるわけではありません。バリデータリストの発行者は、バリデータリストに載せる前に、厳しい条件を満たすように求めることがあります。

それにもかかわらず、バリデータそれぞれがXRP Ledgerの長期にわたる健全性と分散化に貢献することになります。


<span class="use-case-step-num">{{n.next()}}</span>
<!-- <span class="use-case-step-length">(1 hour)</span> -->
## [`rippled`サーバーを設定して実行する](manage-the-rippled-server.html)

`rippled`サーバーをインストールして実行します。ネットワークに従い、XRP Ledgerの完全なコピーを保持する、独自の`rippled`サーバーを誰もが実行できます。

構成ガイダンスおよびネットワーク要件とハードウェア要件については、[容量の計画](capacity-planning.html)を参照してください。


<span class="use-case-step-num">{{n.next()}}</span>
<!-- <span class="use-case-step-length">(1 hour)</span> -->
## [rippledサーバーで検証を有効にする](run-rippled-as-a-validator.html)

バリデータモードで実行するように`rippled`サーバーを設定するには、バリデータキーペアを生成し、それを`rippled.cfg`ファイルに追加します。


<span class="use-case-step-num">{{n.next()}}</span>
<!-- <span class="use-case-step-length">(1 hour)</span> -->
## [ストックrippledサーバーをプロキシとして設定する](run-rippled-as-a-validator.html#プロキシを使用した接続)

DDoS攻撃から本番環境のバリデータを保護するため、ストックの`rippled`サーバーをバリデータと外部ネットワークの間のプロキシーとして使用できます。


<span class="use-case-step-num">{{n.next()}}</span>
<!-- <span class="use-case-step-length">(1 hour)</span> -->
## [バリデータを制御するWebドメインと関連付ける](run-rippled-as-a-validator.html#6-ドメイン検証の提供)

ネットワークの参加者は、管理者が不明なバリデータを信頼しません。この問題に対応するため、バリデータをご使用のWebドメインと関連付けます。
また、[XRP Charts Validator Registry](https://xrpcharts.ripple.com/#/validators)のようなバリデータ追跡サービスにバリデータをリストしてもらうのも1つの方法です。


### 関連タスク

- [`rippled`へのコントリビュートコード](contribute-code-to-rippled.html)
