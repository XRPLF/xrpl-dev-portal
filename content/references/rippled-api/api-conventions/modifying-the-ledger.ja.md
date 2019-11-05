# レジャーの変更

XRP Ledgerに対する変更はすべて、トランザクションの結果として行われます。XRP Ledgerの内容を変更できるAPIメソッドは、トランザクションを送信するコマンドだけです。Ledgerの内容が変更されても、その変更が永続的に適用されるのは、トランザクションが[コンセンサスプロセス](consensus.html)により承認されている場合に限られます。その他のほとんどのパブリックメソッドでは、異なる方法でXRP Ledgerに表示されるデータを閲覧し、サーバーの状態に関する情報を要求します。

トランザクション送信コマンド:

- [submitメソッド][]
- [submit_multisignedメソッド][]

送信可能なさまざまなトランザクションについての詳細は、[トランザクションフォーマット](transaction-formats.html)を参照してください。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}