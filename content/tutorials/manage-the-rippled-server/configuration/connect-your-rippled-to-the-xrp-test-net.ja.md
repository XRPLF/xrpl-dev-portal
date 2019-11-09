# XRP Test Netへのrippledの接続

Rippleは、XRP Ledgerのテストプラットフォームを提供するため[XRP Test Network](https://ripple.com/build/xrp-test-net/)を開発しました。XRP Test Netの資金は実際の資金ではなく、テスト専用の資金です。本番環境のXRP Ledger Networkに接続する前に、`rippled`サーバーをXRP Test Netに接続して、`rippled`の機能をテストして理解できます。また、XRP Test Netを使用して、作成したコードが`rippled`と正しくやり取りすることを検証できます。

**注記:** XRP Test Netのレジャーと残高は定期的にリセットされます。

`rippled`サーバーをXRP Test Netに接続するには、以下の構成を設定します。

1. `rippled.cfg`ファイルで以下の手順に従います。

    a. 以下のセクションのコメントを解除します。

        [ips]
        r.altnet.rippletest.net 51235

    b. 以下のセクションを次のようにコメントアウトします。

        # [ips]
        # r.ripple.com 51235

2. `validators.txt`ファイルで以下の手順に従います。

    a. 以下のセクションのコメントを解除します。

        [validator_list_sites]
        https://vl.altnet.rippletest.net

        [validator_list_keys]
        ED264807102805220DA0F312E71FC2C69E1552C9C5790F6C25E3729DEB573D5860

    b. 以下のセクションを次のようにコメントアウトします。

        # [validator_list_sites]
        # https://vl.ripple.com
        #
        # [validator_list_keys]
        # ED2677ABFFD1B33AC6FBC3062B71F1E8397C1505E1C42C64D11AD1B28FF73F4734

3. `rippled`を再起動します。

4. `rippled`がXRP Test Netに接続していることを確認するため、サーバーで[server_infoメソッド][]を使用して、その結果をTest Net のパブリックサーバーの結果と比較します。両方のサーバーで`validated_ledger`オブジェクトの`seq`フィールドが同一である必要があります（確認中にこの数が変化した場合は、1～2の差が生じる可能性があります）。

    以下のコマンドは、`s.altnet.rippletest.net` にあるTest Net サーバーの最新の検証済みレジャーをチェックします。

        $ ./rippled --rpc_ip 34.210.87.206:51234 server_info | grep seq

    以下のコマンドは、ローカルの `rippled` の最新検証済みレジャーシーケンスをチェックします。

        $ ./rippled server_info | grep seq



<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
