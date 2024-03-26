---
html: set-max-number-of-peers.html
parent: configure-peering.html
seo:
    description: rippledサーバが接続するピアの最大数を設定します。
labels:
  - コアサーバ
---
# ピアの最大数の設定

`rippled`サーバには、接続先の[ピア](../../../concepts/networks-and-servers/peer-protocol.md)の数を定める設定可能なソフト最大数があります。ピアのデフォルトの最大数は**21**です。

**注記:** 内部的に、サーバは受信ピアと送信ピアのおおよそのクォータを生成します。[固定ピアやピアリザベーション](../../../concepts/networks-and-servers/peer-protocol.md#固定ピアとピアリザベーション)を使用している場合、あるいは[connectメソッド][]を使用して追加のピアに手動で接続している場合は、このソフト最大数を超える可能性があります。

サーバが許可するピアの最大数を変更するには、以下の手順を実行します。

1. `rippled`の構成ファイルを編集します。

    ```
    $ vim /etc/opt/ripple/rippled.cfg
    ```

   {% partial file="/@i18n/ja/docs/_snippets/conf-file-location.md" /%}

2. 構成ファイルで、`[peers_max]`スタンザのコメントを解除して編集するか、まだない場合は追加します。

    ```
    [peers_max]
    30
    ```

   スタンザの内容は、許可するピアの合計数を示す整数のみである必要があります。デフォルトでは、サーバは受信ピアが約85%、送信ピアが約15%という比率を維持するように試みますが、送信ピアの最小数が10であるため、68未満の値にしても、サーバが行う送信ピア接続の数は増えません。

   `[peers_max]`値を10未満にした場合でも、サーバはハードコーディングされた最小数である10台の送信ピアを許可するため、ネットワークとの接続を維持できます。すべての送信ピア接続をブロックするには、[サーバをプライベートピアとして設定](../server-modes/run-rippled-as-a-validator.md#プロキシを使用した接続)します。

   **注意:** 接続先のピアサーバが増えると、`rippled`サーバが使用するネットワーク帯域幅も増えます。`rippled`サーバに良好なネットワーク接続があり、使用する帯域幅のコストを許容できる場合にのみ、ピアサーバの数に大きな値を設定してください。

3. `rippled`サーバを再起動します。

    ```
    $ sudo systemctl restart rippled.service
    ```


## 関連項目

- **コンセプト:**
  - [ピアプロトコル](../../../concepts/networks-and-servers/peer-protocol.md)
  - [`rippled`サーバ](../../../concepts/networks-and-servers/index.md)
- **チュートリアル:**
  - [容量の計画](../../installation/capacity-planning.md)
  - [`rippled`サーバのトラブルシューティング](../../troubleshooting/index.md)
- **リファレンス:**
  - [connectメソッド][]
  - [peersメソッド][]
  - [printメソッド][]
  - [server_infoメソッド][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
