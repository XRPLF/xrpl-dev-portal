---
html: system-requirements.html
parent: install-rippled.html
seo:
    description: rippledのハードウェアやソフトウェアのシステム要件
labels:
  - コアサーバ
---
# システム要件

## 推奨される仕様

本番環境で信頼性の高いパフォーマンスを確保するためには、以下の条件以上のXRP Ledger (`rippled`) サーバをベアメタル上で稼働させることが推奨されます。

- オペレーティングシステム: Ubuntu (LTS)、Red Hat Enterprise Linux (最新版)
- CPU: Intel Xeon 3GHz以上のプロセッサー、8コア以上、ハイパースレッディング有効
- ディスク: SSD / NVMe (バーストや ピーク時ではなく、10,000 IOPSの維持が望ましい)。データベースパーティションとして最低50GB。Amazon Elastic Block Store(AWS EBS)はレイテンシが高すぎて確実に同期できないので使用しないでください。
- RAM: 64GB
- ネットワーク: ホスト上にギガビットネットワークインターフェイスを備える企業向けのデータセンターネットワーク

バリデータをAWSで使用する場合、ログとコアダンプ用のストレージとして1TBのディスクを追加した`z1d.2xlarge`の利用を検討してください。

## 最小仕様

**注意:** この仕様では、確実に[メインネットとの同期を保つ](../troubleshooting/server-doesnt-sync.md)には不十分です。本番環境で使用する場合は、上記の推奨仕様に従ってください。

テスト目的の場合、次の最小使用で一般的なハードウェア上でXRP Ledgerサーバを稼働させることができます。

- オペレーティングシステム: macOS、Windows（64ビット）、またはほとんどのLinuxディストリビューション(Red Hat、 Ubuntu、 Debianをサポート)
- CPU: 64ビット x86_64、4コア以上
- ディスク: SSD / NVMe (バーストや ピーク時ではなく、10,000 IOPSの維持が望ましい)。データベースパーティションとして最低50GB。Amazon Elastic Block Store(AWS EBS)はレイテンシが高すぎて確実に同期できないので使用しないでください。
- RAM: 16GB以上



作業負荷によっては、Amazon EC2の`i3.2xlarge`のVMサイズが適切な場合があります。高速のネットワーク接続が望ましいです。サーバのクライアント処理負荷が増加すると、必要なリソースも増加します。


## システム時刻

`rippled`サーバは、正確な時刻が維持されていることを前提としています。`ntpd`や`chrony`などのデーモンで、ネットワークタイムプロトコル（NTP）を使用してシステムの時刻を同期することを推奨します。


## 関連項目

- **コンセプト:**
    - [`rippled`サーバ](../../concepts/networks-and-servers/index.md)
    - [コンセンサスについて](../../concepts/consensus-protocol/index.md)
- **チュートリアル:**
    - [容量の計画](capacity-planning.md) - 本番環境向けの推奨仕様および計画についての詳細情報
    - [`rippled`のインストール](index.md)
    - [rippledのトラブルシューティング](../troubleshooting/index.md)
- **リファレンス:**
    - [rippled APIリファレンス](../../references/http-websocket-apis/index.md)
      - [`rippled`コマンドラインの使用](../commandline-usage.md)
      - [server_infoメソッド][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
