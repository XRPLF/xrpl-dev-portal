---
html: connect-your-rippled-to-the-xrp-test-net.html
parent: configure-rippled.html
blurb: rippledサーバーをTest Netに接続して、模造の資金を使って新しい機能を試したり、機能をテストしたりします。
labels:
  - コアサーバー
  - ブロックチェーン
  - 開発
---
# XRPL Altnetへのrippledの接続

Rippleは[代替となるテスト用および開発用ネットワーク](parallel-networks.html)を作成しており、開発者が最新のXRP Ledgerの非本番バージョン（Testnet）でアプリケーションをテストしたり、最新のベータバージョン（Devnet）で機能をテストして実験したりできるようにしています。 **これらのネットワークで使用する資金は実際の資金ではなく、テスト専用の資金です。** TestnetまたはDevnetの[`rippled`サーバー](xrpl-servers.html)に接続できます。

**注記:** XRP TestnetとDevnetのレジャーと残高は定期的にリセットされます。

`rippled`サーバーをXRP TestnetまたはDevnetに接続するには、以下の構成を設定します。

1. `rippled.cfg`ファイルで以下の手順に従います。

   a. [Testnet](xrp-testnet-faucet.html)に接続するには、以下のセクションのコメントを解除し、次のように追加します。

        [ips]
        s.altnet.rippletest.net 51235

   b. [Devnet](xrp-testnet-faucet.html)に接続するには、以下のセクションのコメントを解除し、次のように追加します。

        [ips]
        s.devnet.rippletest.net 51235

   c. 以下のセクションを次のようにコメントアウトします。

        # [ips]
        # r.ripple.com 51235



2. `validators.txt`ファイルで以下の手順に従います。

   2a. Altnetに接続するための変更

        a. 以下のセクションのコメントを解除し、Altnetに接続するようにします。

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

   2b. Devnetに接続するための変更

        a. 以下のセクションをコメントアウトします。

            # [validator_list_sites]
            # https://vl.altnet.rippletest.net

            # [validator_list_keys]
            # ED264807102805220DA0F312E71FC2C69E1552C9C5790F6C25E3729DEB573D5860

            # [validator_list_sites]
            # https://vl.ripple.com
            #
            # [validator_list_keys]
            # ED2677ABFFD1B33AC6FBC3062B71F1E8397C1505E1C42C64D11AD1B28FF73F4734

        b. 次の信頼できるバリデータをvalidator.txtファイルに追加します。

            [validator_list_sites]
            https://vl.devnet.rippletest.net/index.json

            [validator_list_keys]
            EDDF2F53DFEC79358F7BE76BC884AC31048CFF6E2A00C628EAE06DB7750A247B12



3. `rippled`を再起動します。

4. `rippled`がXRP TestnetまたはDevnetに接続していることを確認するため、サーバーで[server_infoメソッド][]を使用して、その結果をTestnetまたはDevnetの公開サーバーの結果と比較します。両方のサーバーで`validated_ledger`オブジェクトの`seq`フィールドが同一である必要があります（確認中にこの数が変化した場合は、1～2の差が生じる可能性があります）。

    以下のコマンドは、ローカルの`rippled`の最新検証済みレジャーインデックスをチェックします。

         $ ./rippled server_info | grep seq

    [WebSocket Toolのserver_info](websocket-api-tool.html#server_info)でネットワークのレジャーインデックスをチェックします。


## 関連項目

- **ツール:**
  - [XRP Faucet](xrp-testnet-faucet.html)
  - [WebSocket APIツール](websocket-api-tool.html) - 接続オプションで「Testnet公開サーバー」を選択します。
- **コンセプト:**
  - [並列ネットワーク](parallel-networks.html)
  - [コンセンサスについて](intro-to-consensus.html)
- **チュートリアル:**
  - [バリデータとしてのrippledの実行](run-rippled-as-a-validator.html)
  - [スタンドアロンモードでの`rippled`のオフラインテスト](use-stand-alone-mode.html)
  - `rippled`の[トラブルシューティング](troubleshoot-the-rippled-server.html)
- **リファレンス:**
  - [server_infoメソッド][]



<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
