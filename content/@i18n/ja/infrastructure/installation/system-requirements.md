---
html: system-requirements.html
parent: install-rippled.html
blurb: rippledのハードウェアやソフトウェアのシステム要件
labels:
  - コアサーバー
---
# システム要件

## 推奨される仕様

企業の本番環境で最良のパフォーマンスを実現するため、以下の仕様のベアメタルで`rippled`を実行することが推奨されています。

- オペレーティングシステム: Ubuntu (LTF) 、CentOS または Red Hat Enterprise Linux (最新版)
- CPU: Intel Xeon 3GHz以上のプロセッサー、8コア以上、ハイパースレッディング有効
- ディスク: SSD / NVMe（10,000 IOPS以上）
- RAM: 64GB
- ネットワーク: ホスト上にギガビットネットワークインターフェイスを備える企業データセンターネットワーク

## 最小仕様

テスト目的やたまにしか使わない場合は、一般的なハードウェア上でXRP Ledgerサーバーを稼働させることができます。以下の最低要件を満たせば、ほとんどの場合は動作しますが、必ずしも[ネットワークと同期](server-doesnt-sync.html)しているとは限りません。

- オペレーティングシステム: macOS、Windows（64ビット）、またはほとんどのLinuxディストリビューション(Red Hat、 Ubuntu、 Debianをサポート)
- CPU: 64ビット x86_64、4コア以上
- ディスク: データベースパーティション用に最低50GB。SSDを強く推奨（最低でも1000IOPS、それよりも多いことが望ましい）
- RAM: 16GB以上

作業負荷によっては、Amazon EC2の`m3.large` VMサイズが適切な場合があります。高速のネットワーク接続が望ましいです。サーバーのクライアント処理負荷が増加すると、必要なリソースも増加します。



## システム時刻

`rippled`サーバーは、正確な時刻が維持されていることを前提としています。`ntpd`や`chrony`などのデーモンで、ネットワークタイムプロトコル（NTP）を使用してシステムの時刻を同期することを推奨します。


## 関連項目

- **コンセプト:**
    - [`rippled`サーバー](xrpl-servers.html)
    - [コンセンサスについて](consensus.html)
- **チュートリアル:**
    - [容量の計画](capacity-planning.html) - 本番環境向けの推奨仕様および計画についての詳細情報
    - [`rippled`のインストール](install-rippled.html)
    - [rippledのトラブルシューティング](troubleshoot-the-rippled-server.html)
- **リファレンス:**
    - [rippled APIリファレンス](http-websocket-apis.html)
      - [`rippled`コマンドラインの使用](commandline-usage.html)
      - [server_infoメソッド][]


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
