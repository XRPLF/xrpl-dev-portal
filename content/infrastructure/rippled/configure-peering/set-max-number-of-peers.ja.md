---
html: set-max-number-of-peers.html
parent: configure-peering.html
blurb: rippledサーバーが接続するピアの最大数を設定します。
labels:
  - コアサーバー
---
# ピアの最大数の設定

`rippled`サーバーには、接続先の[ピア](peer-protocol.html)の数を定める設定可能なソフト最大数があります。ピアのデフォルトの最大数は**21**です。

**注記:** 内部的に、サーバーは受信ピアと送信ピアのおおよそのクォータを生成します。[固定ピアやピアリザベーション](peer-protocol.html#固定ピアとピアリザベーション)を使用している場合、あるいは[connectメソッド][]を使用して追加のピアに手動で接続している場合は、このソフト最大数を超える可能性があります。

サーバーが許可するピアの最大数を変更するには、以下の手順を実行します。

1. `rippled`の構成ファイルを編集します。

        $ vim /etc/opt/ripple/rippled.cfg

   {% include '_snippets/conf-file-location.md' %}<!--_ -->

2. 構成ファイルで、`[peers_max]`スタンザのコメントを解除して編集するか、まだない場合は追加します。

        [peers_max]
        30

   スタンザの内容は、許可するピアの合計数を示す整数のみである必要があります。デフォルトでは、サーバーは受信ピアが約85%、送信ピアが約15%という比率を維持するように試みますが、送信ピアの最小数が10であるため、68未満の値にしても、サーバーが行う送信ピア接続の数は増えません。

   `[peers_max]`値を10未満にした場合でも、サーバーはハードコーディングされた最小数である10台の送信ピアを許可するため、ネットワークとの接続を維持できます。すべての送信ピア接続をブロックするには、[サーバーをプライベートピアとして設定](run-rippled-as-a-validator.html#プロキシを使用した接続)します。

   **注意:** 接続先のピアサーバーが増えると、`rippled`サーバーが使用するネットワーク帯域幅も増えます。`rippled`サーバーに良好なネットワーク接続があり、使用する帯域幅のコストを許容できる場合にのみ、ピアサーバーの数に大きな値を設定してください。

3. `rippled`サーバーを再起動します。

        $ sudo systemctl restart rippled.service


## 関連項目

- **コンセプト:**
  - [ピアプロトコル](peer-protocol.html)
  - [`rippled`サーバー](xrpl-servers.html)
- **チュートリアル:**
  - [容量の計画](capacity-planning.html)
  - [`rippled`サーバーのトラブルシューティング](troubleshoot-the-rippled-server.html)
- **リファレンス:**
  - [connectメソッド][]
  - [peersメソッド][]
  - [printメソッド][]
  - [server_infoメソッド][]

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
