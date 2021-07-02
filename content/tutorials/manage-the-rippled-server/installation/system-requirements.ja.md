---
html: system-requirements.html
parent: install-rippled.html
blurb: rippledのハードウェアやソフトウェアのシステム要件
labels:
  - コアサーバー
---
# システム要件

## 最小仕様

ネットワークに参加するための費用を抑えるため、`rippled`サーバーは一般製品のハードウェア上で快適に実行できる必要があります。Rippleでは、現時点で以下の最小要件を推奨します。

- オペレーティングシステム:
    - 本番環境: CentOSまたはRedHat Enterprise Linux（最新リリース）、Ubuntu（16.04以降）、Debian（9.x）をサポート
    - 開発環境: Mac OS X、Windows（64ビット）、またはほとんどのLinuxディストリビューション
- CPU: 64ビット x86_64、2つ以上のコア
- ディスク: データベースパーティション用に最低50GB。SSDを強く推奨（最低でも1000IOPS、それよりも多いことが望ましい）
- RAM: 8GB以上

作業負荷によっては、Amazon EC2の`m3.large` VMサイズが適切な場合があります。高速のネットワーク接続が望ましいです。サーバーのクライアント処理負荷が増加すると、必要なリソースも増加します。


## 推奨される仕様

企業の本番環境で最良のパフォーマンスを実現するため、Rippleでは、以下の仕様のベアメタルで`rippled`を実行することを推奨しています。

- オペレーティングシステム: Ubuntu 16.04以上
- CPU: Intel Xeon 3以上、GHzプロセッサー、4コア、ハイパースレッディング有効
- ディスク: SSD（7000回以上の書き込み/秒、10,000回以上の読み取り/秒）
- RAM:
  - テスト用: 8GB以上
  - 本番環境用: 32GB
- ネットワーク: ホスト上にギガビットネットワークインターフェイスを備える企業データセンターネットワーク

## システム時刻

`rippled`サーバーは、正確な時刻が維持されていることを前提としています。`ntpd`や`chrony`などのデーモンで、ネットワークタイムプロトコル（NTP）を使用してシステムの時刻を同期することを推奨します。


## 関連項目

- **コンセプト:**
    - [`rippled`サーバー](the-rippled-server.html)
    - [コンセンサスについて](intro-to-consensus.html)
- **チュートリアル:**
    - [容量の計画](capacity-planning.html) - 本番環境向けの推奨仕様および計画についての詳細情報
    - [`rippled`のインストール](install-rippled.html)
    - [rippledのトラブルシューティング](troubleshoot-the-rippled-server.html)
- **リファレンス:**
    - [rippled APIリファレンス](rippled-api.html)
      - [`rippled`コマンドラインの使用](commandline-usage.html)
      - [server_infoメソッド][]


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
