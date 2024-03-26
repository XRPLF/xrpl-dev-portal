---
html: connect-your-rippled-to-the-xrp-test-net.html
parent: configure-rippled.html
seo:
    description: rippledサーバをTest Netに接続して、模造の資金を使って新しい機能を試したり、機能をテストしたりします。
labels:
  - コアサーバ
  - ブロックチェーン
  - 開発
---
# rippledを並列ネットワークに接続

様々な[テスト用・開発用の代替ネットワーク](../../concepts/networks-and-servers/parallel-networks.md)が存在しており、開発者は実際の資金をリスクにさらすことなく、アプリのテストや機能の実験を行うことができます。**これらのネットワークで使用される資金は実際の資金ではなく、テスト専用です。**あなたの[`rippled`サーバ](../../concepts/networks-and-servers/index.md)をこれらのテストネットワークのいずれかに接続することができます。

**警告:** 新機能や実験的な機能を持つテストネットワークでは、ネットワークと同期するためにサーバの本番リリース前のリリースを実行することが必要になる場合があります。各ネットワークに必要なコードのバージョンについては、[並列ネットワークのページ](../../concepts/networks-and-servers/parallel-networks.md)をご覧ください。

## 手順

あなたの`rippled`サーバをXRPテストネットまたは開発ネットに接続するには、次の手順に従ってください。また、テストネットや開発ネットに接続した後、本番用メインネットに切り替えることもできます。

## 1. 適切なハブに接続するようにサーバを設定します。

`rippled.cfg`ファイルを編集します。

{% partial file="/@i18n/ja/docs/_snippets/conf-file-location.md" /%}
<!--{_ }-->

1. `[ips]`に接続したいネットワークのハブを設定します。

    {% tabs %}

    ```{% label="Testnet" %}
    [ips]
    s.altnet.rippletest.net 51235
    ```

    ```{% label="Devnet" %}
    [ips]
    s.devnet.rippletest.net 51235
    ```

    ```{% label="Mainnet" %}
    # No [ips] stanza. Use the default hubs to connect to Mainnet.
    ```

    ```{% label="Sidechain-Devnet" %}
    [ips]
    sidechain-net2.devnet.rippletest.net 51235
    ```

    {% /tabs %}

2. 以前の `[ips]`があれば、コメントアウトしてください。

    ```
    # [ips]
    # r.ripple.com 51235
    # zaphod.alloy.ee 51235
    # sahyadri.isrdc.in 51235
    ```

3. `[network_id]`に適切な値を追加します。

    {% tabs %}

    ```{% label="Testnet" %}
    [network_id]
    testnet
    ```

    ```{% label="Devnet" %}
    [network_id]
    devnet
    ```

    ```{% label="Mainnet" %}
    [network_id]
    main
    ```

    ```{% label="Sidechain-Devnet" %}
    [network_id]
    262
    ```

    {% /tabs %}

    カスタムネットワークの場合、そのネットワークに接続する全員が、そのネットワークに固有の値を使用する必要があります。新しいネットワークを作成するときは、ネットワークIDを11から4,294,967,295までの整数からランダムに選択します。

    **注記:** この設定はサーバが同じネットワーク上にいる仲間を見つけるのに役立ちますが、サーバがどのネットワークに従うかを厳密に制御するものではありません。UNL/信頼できるバリデータの設定(次のステップ)はサーバが従うネットワークを定義するものです。

## 2. 信頼できるバリデータリストの設定

`validators.txt`ファイルを編集します。このファイルは`rippled.cfg`ファイルと同じフォルダにあり、どのバリデータが共謀しないと信頼するかを定義します。

1. 接続したいネットワークの`[validator_list_sites]`と`[validator_list_keys]`コメントを解除するか、追加します。

    {% tabs %}

    ```{% label="Testnet" %}
    [validator_list_sites]
    https://vl.altnet.rippletest.net

    [validator_list_keys]
    ED264807102805220DA0F312E71FC2C69E1552C9C5790F6C25E3729DEB573D5860
    ```

    ```{% label="Devnet" %}
    [validator_list_sites]
    https://vl.devnet.rippletest.net

    [validator_list_keys]
    EDDF2F53DFEC79358F7BE76BC884AC31048CFF6E2A00C628EAE06DB7750A247B12
    ```

    ```{% label="Mainnet" %}
    [validator_list_sites]
    https://vl.ripple.com

    [validator_list_keys]
    ED2677ABFFD1B33AC6FBC3062B71F1E8397C1505E1C42C64D11AD1B28FF73F4734
    ```

    ```{% label="Sidechain-Devnet" %}
    [validator_list_sites]
    https://vlsidechain-net2.devnet.rippletest.net

    [validator_list_keys]
    EDA5504C7133743FADA46342229B4E9CBBE1CF9BCA19D16633574F7CBB72F79569
    ```

    {% /tabs %}

    **ヒント:** プレビュー版パッケージには必要な項目があらかじめ設定されている場合がありますが、念のため確認してください。

2. 以前の`[validator_list_sites]`,`[validator_list_keys]`,または`[validators]`をコメントアウトします。

    例えば:

    ```
    # [validator_list_sites]
    # https://vl.ripple.com
    #
    # [validator_list_keys]
    # ED2677ABFFD1B33AC6FBC3062B71F1E8397C1505E1C42C64D11AD1B28FF73F4734

    # Old hard-coded List of Devnet Validators
    # [validators]
    # n9Mo4QVGnMrRN9jhAxdUFxwvyM4aeE1RvCuEGvMYt31hPspb1E2c
    # n9MEwP4LSSikUnhZJNQVQxoMCgoRrGm6GGbG46AumH2KrRrdmr6B
    # n9M1pogKUmueZ2r3E3JnZyM3g6AxkxWPr8Vr3zWtuRLqB7bHETFD
    # n9MX7LbfHvPkFYgGrJmCyLh8Reu38wsnnxA4TKhxGTZBuxRz3w1U
    # n94aw2fof4xxd8g3swN2qJCmooHdGv1ajY8Ae42T77nAQhZeYGdd
    # n9LiE1gpUGws1kFGKCM9rVFNYPVS4QziwkQn281EFXX7TViCp2RC
    # n9Jq9w1R8UrvV1u2SQqGhSXLroeWNmPNc3AVszRXhpUr1fmbLyhS
    ```

## 3. 機能を有効化(無効化)する

実験的な機能を使用するテストネットワークでは、設定ファイルで該当する機能を強制的に有効にする必要があります。その他のネットワークでは、`[features]`を使用しないでください。設定ファイルの`[features]`を以下のように追加または変更します。

{% tabs %}

{% tab label="Testnet" %}
```
# [features]
# Delete or comment out. Don't force-enable features on Testnet.
```
{% /tab %}

{% tab label="Devnet" %}
```
# [features]
# Delete or comment out. Don't force-enable features on Devnet.
```
{% /tab %}

{% tab label="Mainnet" %}
```
# [features]
# Delete or comment out. Don't force-enable features on Mainnet.
```
{% /tab %}

{% tab label="Sidechain-Devnet" %}
```
[features]
XChainBridge
```
{% /tab %}

{% /tabs %}

**警告:** メインネットまたはテストネットに接続するときは、`[features]`を使用しないでください。他のネットワークと異なる機能を強制的に有効にすると、サーバがネットワークから分断される可能性があります。

## 4. サーバを再起動する

```sh
$ sudo systemctl restart rippled
```

## 5. サーバの同期を確認します。

再起動後、ネットワークに同期するのに約5分から15分かかります。サーバの同期が完了すると、[server_infoメソッド][]は接続しているネットワークに基づいた`validated_ledger`オブジェクトを表示します。

自分の`rippled`が正しいネットワークに接続されていることを確認するには、自分のサーバの結果をTestnetまたはDevnet上の[公開サーバ][public servers]と比較してください。`validated_ledger`オブジェクトの`seq`フィールドはどちらのサーバでも同じはずです（チェックしている間に変更された場合は、1つか2つずれている可能性があります）。

次の例は、コマンドラインからサーバの最新の検証済みレジャーをチェックする方法を示しています。

```sh
rippled server_info | grep seq
```

WebSocketツールの[server_info](/resources/dev-tools/websocket-api-tool#server_info)を使って、対象のネットワーク上の最新のレジャーインデックス(`seq`)を調べることができます。



## 関連項目

- **ツール:**
    - [XRP Faucets](/resources/dev-tools/xrp-faucets)
    - [WebSocket APIツール](/resources/dev-tools/websocket-api-tool) - 接続オプションで「Testnet Public Server」または「Devnet Public Server」を選択します。
- **コンセプト:**
    - [並列ネットワーク](../../concepts/networks-and-servers/parallel-networks.md)
    - [コンセンサス](../../concepts/consensus-protocol/index.md)
- **チュートリアル:**
    - [バリデータとしてのrippledの実行](server-modes/run-rippled-as-a-validator.md)
    - [オフラインで`rippled`をスタンドアロンモードでテストする](../testing-and-auditing/index.md)
    - [`rippled`のトラブルシューティング](../troubleshooting/index.md)
- **References:**
    - [server_infoメソッド][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
