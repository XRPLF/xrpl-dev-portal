# yumを使用したCentOS/Red Hatへのインストール

このページでは、Rippleの[yum](https://en.wikipedia.org/wiki/Yellowdog_Updater,_Modified)リポジトリを使用して、**CentOS 7**または**Red Hat Enterprise Linux 7**に、`rippled`の安定した最新バージョンをインストールする場合の推奨手順を説明します。

以下の手順では、Rippleによってコンパイルされたバイナリーをインストールします。


## 前提条件

`rippled`をインストールする前に、[システム要件](system-requirements.html)を満たす必要があります。


## インストール手順

1. Ripple RPMリポジトリをインストールします。

        $ sudo rpm -Uvh https://mirrors.ripple.com/ripple-repo-el7.rpm

2. `rippled`ソフトウェアパッケージをインストールします。

        $ sudo yum install --enablerepo=ripple-stable rippled

3. システム起動時に開始するように、`rippled`サービスを設定します。

        $ sudo systemctl enable rippled.service

4. `rippled`サービスを開始します。

        $ sudo systemctl start rippled.service


## 次のステップ

{% include '_snippets/post-rippled-install.md' %}<!--_ -->

## 関連項目

- [CentOS/Red Hatでの自動更新](update-rippled-automatically-on-centos-rhel.html)
- [Ubuntu Linuxでrippledをインストール](install-rippled-on-ubuntu-with-alien.html)（Ubuntu上の事前構築済みバイナリー）
- [Ubuntuでの'rippled'の構築と実行](build-run-rippled-ubuntu.html)（Ubuntuで`rippled`を自分でコンパイル）
- [その他のプラットフォーム用のコンパイル手順](https://github.com/ripple/rippled/tree/develop/Builds)
