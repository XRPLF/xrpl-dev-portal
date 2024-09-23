---
html: secure-signing.html
parent: transactions.html
seo:
    description: 安全にトランザクションを送信できる環境を設定します。
labels:
  - セキュリティ
  - 開発
---
# 安全な署名

[トランザクション](index.md)をXRP Ledgerに送信するには、[秘密鍵](../accounts/cryptographic-keys.md)のセキュリティを損なわない方法でトランザクションにデジタル署名する必要があります。（他の人があなたの秘密鍵にアクセスできる場合、その人はあなたと同じようにあなたのアカウントを操作できるため、すべての資金が盗まれたり消却されたりする可能性があります。）このページでは、トランザクションに安全に署名できる環境の設定方法について説明します。

**ヒント:** ネットワークにトランザクションを送信していない場合は、Rippleが運用しているサーバなど、信頼できる公開サーバを安全に使用して、着信トランザクションの監視やその他のネットワークアクティビティの読み取りを行うことができます。XRP Ledgerのすべてのトランザクション、残高、データは公開されています。

セキュリティのレベルが異なるさまざまな構成があるため、状況に応じて適したものは異なります。次の中からニーズに最適なものを選択してください。

- [`rippled`をローカルで実行](#ローカルでrippledを実行する)または[同じLAN内で実行](#同じlan内でrippledを実行する)
- ローカル署名を行える[クライアントライブラリを使用](#ローカル署名機能のあるクライアントライブラリを使用する)
- XRP Ledgerの署名に対応した[専用の署名デバイスを使用](#専用の署名デバイスを使用する)
- 信頼できる[リモート`rippled`マシンに接続するために安全なVPNを使用](#リモートrippledサーバに対して安全なvpnを使用する)

<!-- Source for all diagrams in this article: https://drive.google.com/drive/u/0/folders/1MFkzxtMYpS8tzdm-TjWbLSVgU0zAG9Vh -->

## 安全でない構成

<!-- TODO: translate diagrams -->
[{% inline-svg file="/docs/img/insecure-signing-options.svg" /%}](/docs/img/insecure-signing-options.svg "安全でない構成の図")

外部のソースからあなたの秘密鍵にアクセスできる構成は危険で、不正使用者によってあなたのすべてのXRP（およびあなたのXRP Ledgerのアドレスにあるすべてのもの）が盗まれる可能性があります。そのような構成の例としては、インターネット経由で他の人の`rippled`サーバの[signメソッド][]を使用する構成や、秘密鍵をインターネットを経由してプレーンテキストで自己所有サーバに送信する構成などがあります。

秘密鍵の秘匿性は常に保持する必要があります。自分にメールで送信したり、人の目に触れるところで入力したりしてはいけません。秘密鍵を使用しないときは、決してプレーンテキストではなく、暗号化された形式で保存する必要があります。セキュリティと利便性のバランスは、アドレスの保有額によっても変わります。さまざまな目的に合わせてさまざまなセキュリティ構成の複数のアドレスを使用することをお勧めします。

<!-- Note: I'd link "issuing and operational addresses" for an explanation of hot/cold wallet security, but it's particularly gateway/issued-currency centric, which is not appropriate for this context. -->


## ローカルでrippledを実行する

[{% inline-svg file="/docs/img/secure-signing-local-rippled.svg" /%}](/docs/img/secure-signing-local-rippled.svg "署名にローカルrippledサーバを使用する構成の図")

この構成では、トランザクションを生成するマシンで`rippled`を実行します。  秘密鍵はマシンから出ていかないため、マシンへのアクセス権がない人は秘密鍵にアクセスできません。もちろん、マシンのセキュリティ保護に関する業界標準のプラクティスに従ってください。この構成を使用するには、次の手順を実行します。

1. [`rippled`をインストール](../../infrastructure/installation/index.md)します。

    ローカルマシンが[`rippled`の最小システム要件](../../infrastructure/installation/system-requirements.md)を満たしていることを確認します。

2. トランザクションに署名する必要がある場合は、`localhost`または`127.0.0.1`のサーバに接続します。シングル署名の場合は[signメソッド][]、マルチシグの場合は[sign_forメソッド][]を使用します。

    [構成ファイルの例](https://github.com/XRPLF/rippled/blob/8429dd67e60ba360da591bfa905b58a35638fda1/cfg/rippled-example.cfg#L1050-L1073)では、ローカルループバックネットワーク上（127.0.0.1）のポート5005でJSON-RPC（HTTP）、ポート6006でWebSocket（WS）の接続をリッスンし、接続されるすべてのクライアントを管理者として扱っています。

    **注意:** 署名に[コマンドラインAPI](../../references/http-websocket-apis/api-conventions/request-formatting.md#コマンドライン形式)を使用する場合は、コマンドラインでないクライアントで[Websocket APIやJSON-RPC APIを使用](../../tutorials/http-websocket-apis/build-apps/get-started.md)する場合よりもセキュリティが弱くなります。コマンドライン構文を使用すると、秘密鍵がシステムのプロセスリストで他のユーザに見える可能性があり、シェル履歴にプレーンテキスト形式でキーが保存される可能性があります。

3. サーバの使用中は、稼働状態と最新状態を維持して、ネットワークと同期されるようにしておく必要があります。

    **注記:** トランザクションを送信していないときは`rippled`サーバをオフにすることが _可能_ ですが、再び起動したときにネットワークとの同期に最大15分かかります。


## 同じLAN内でrippledを実行する

[{% inline-svg file="/docs/img/secure-signing-lan-rippled.svg" /%}](/docs/img/secure-signing-lan-rippled.svg "署名にLAN経由でrippledサーバを使用する構成の図")

この構成では、署名するトランザクションを生成するマシンと同じプライベートローカルエリアネットワーク（LAN）内の専用マシンで`rippled`サーバを実行します。この構成では、`rippled`を実行する専用の1台のマシンを使用しながら、中程度のシステムスペックの1台以上のマシンでトランザクションの指示を組み立てることができます。自己所有のデータセンターやサーバルームがある場合に魅力的な選択肢です。

この構成を使用するには、`rippled`サーバをLAN内の`wss`および`https`接続を受け入れるように設定します。[証明書ピンニング](https://en.wikipedia.org/wiki/Transport_Layer_Security#Certificate_pinning)を使用する場合は自己署名証明書を使用できます。あるいは、社内や既知の認証局が署名した証明書を使用できます。[Let's Encrypt](https://letsencrypt.org/)などの一部の認証局は無料で証明書を自動発行しています。

<!--{# TODO: link api-over-lan.html with the detailed instructions when those are ready #}-->

必ず、マシンのセキュリティ保護に関する業界標準のプラクティスに従ってください。例えば、ファイアウォール、ウイルス対策、適切なユーザ権限を使用するなどです。


## ローカル署名機能のあるクライアントライブラリを使用する

[{% inline-svg file="/docs/img/secure-signing-client-library.svg" /%}](/docs/img/secure-signing-client-library.svg "ローカル署名機能のあるクライアントライブラリを使用する構成の図")

この構成では、使用するプログラミング言語で、署名を組み込んだクライアントライブラリを使用します。ローカル署名を実行できるライブラリの一覧は、[クライアントライブラリ](../../references/client-libraries.md)をご覧ください。

### 署名ライブラリのセキュリティベストプラクティス

署名ライブラリのセキュリティを最適化するために、次のベストプラクティスを使用してください。

* 使用する署名ライブラリが、署名アルゴリズムを適切かつ安全に実装 していることを確認してください。例えば、ライブラリがデフォルトのECDSAアルゴリズムを使用する場合、[RFC-6979](https://tools.ietf.org/html/rfc6979)に記述されているように、決定論的なnoncesも使用すべきです。

    上記のすべての公開ライブラリは、業界のベストプラクティスに従っています。


* クライアントライブラリを最新の安定版に更新してください。

* セキュリティ強化のため、[Vault](https://www.vaultproject.io/)などの管理ツールから秘密鍵を読み込みます。

### ローカル署名の例

以下は、以下の言語とライブラリを使用して、ローカルでトランザクションに署名する方法の例です。

* **JavaScript** / **TypeScript** - [`xrpl.js`](https://github.com/XRPLF/xrpl.js)

* **Python** - [`xrpl-py`](https://github.com/XRPLF/xrpl-py)

* **Java** - [`xrpl4j`](https://github.com/XRPLF/xrpl4j)

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/secure-signing/js/signPayment.js" language="js" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/secure-signing/py/sign-payment.py" language="py" /%}
{% /tab %}

{% tab label="Java" %}
{% code-snippet file="/_code-samples/secure-signing/java/SignPayment.java" language="java" /%}
{% /tab %}

{% /tabs %}


## 専用の署名デバイスを使用する

[{% inline-svg file="/docs/img/secure-signing-dedicated-hardware.svg" /%}](/docs/img/secure-signing-dedicated-hardware.svg "専用の署名ハードウェアの使用の図")

専用の署名デバイスが各社から販売されており、例えば[Ledger Nano S](https://www.ledger.com/products/ledger-nano-s)は、秘密鍵をデバイスから出さずに使ってXRP Ledgerトランザクションに署名できます。すべてのタイプのトランザクションに対応していないデバイスもあります。

この構成の設定は、特定のデバイスによって異なります。場合によっては、署名デバイスと通信するためにマシンで「マネージャー」アプリケーションを実行する必要があります。そのようなデバイスの設定と使用方法については、メーカーの手順をご覧ください。


## リモートrippledサーバに対して安全なVPNを使用する

[{% inline-svg file="/docs/img/secure-signing-over-vpn.svg" /%}](/docs/img/secure-signing-over-vpn.svg "VPNを経由してリモート`rippled`に安全に接続する構成の図")

この構成では、コロケーション施設や遠隔地のデータセンターなどにあるリモートでホストされている`rippled`サーバを使用し、暗号化されたVPNを使用してそのサーバに接続します。

この構成を使用するには、[プライベートLANで`rippled`を実行](#同じlan内でrippledを実行する)するための手順に従いますが、VPNを使用してリモート`rippled`サーバのLANに接続します。VPNの設定手順は環境によって異なり、このガイドでは説明しません。


## 関連項目

- **コンセプト:**
    - [暗号鍵](../accounts/cryptographic-keys.md)
    - [マルチシグ](../accounts/multi-signing.md)
- **チュートリアル:**
    - [rippledのインストール](../../infrastructure/installation/index.md)
    - [レギュラーキーペアの割り当て](../../tutorials/how-tos/manage-account-settings/assign-a-regular-key-pair.md)
    - [信頼できるトランザクションの送信](reliable-transaction-submission.md)
    - [パブリック署名の有効化](../../infrastructure/configuration/enable-public-signing.md)
- **リファレンス:**
    - [signメソッド][]
    - [submitメソッド][]
    - [xrpl.jsリファレンス](https://js.xrpl.org/)
    - [`xrpl-py`リファレンス](https://xrpl-py.readthedocs.io/)
    - [`xrpl4j` Reference](https://javadoc.io/doc/org.xrpl/)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
