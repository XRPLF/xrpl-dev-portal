# オンライン削除の設定

`rippled`サーバーのデフォルトの構成では、最新2000個のレジャーバージョンよりも古い[履歴が削除され](online-deletion.html)、レジャー履歴は約15分間維持されます（現行のレジャー毎の間隔に基づく）。このページでは、削除までに`rippled`サーバーに保管される履歴の量を設定する方法を説明します。

## 前提条件

このチュートリアルでは、ご使用のサーバーが以下の条件を満たしていることを前提としています。

- サポートされているオペレーティングシステムを使用している。Ubuntu Linux、Red Hat Enterprise Linux（RHEL）、CentOS

- `rippled`サーバーがすでに[インストール](install-rippled.html)されており、[オンライン削除](online-deletion.html)が有効になっている。

    推奨されるプラットフォームのインストール手順に従えば、オンライン削除はデフォルトで有効となります。

- 選択した量の履歴をレジャーストアーに保管するのに[十分なディスク容量](capacity-planning.html)がサーバーにある。


## 構成手順

サーバーに保管する履歴の量を変更するには、以下の手順を実行します。

1. 保管する履歴に相当するレジャーバージョンの数を決定します。

    新しいレジャーバージョンは通常3～4秒間隔で検証されます。このため、レジャーバージョンの数は、保管する期間におおむね対応しています。各種構成で必要なストレージの容量についての詳細は、[容量計画](capacity-planning.html)を参照してください。

    オンライン削除は、履歴の削除 _後_ に維持するレジャーバージョンの数に基づいておこなわれるので、設定した維持するレジャー数の2倍を保管するのに十分なディスク容量が必要です。

0. `rippled`の構成ファイルで`[node_db]` スタンザの`online_delete`フィールドを編集します。

        [node_db]
        # Other settings unchanged ...
      	online_delete=2000
      	advisory_delete=0

    `online_delete`を、オンライン削除の実行後に維持するレジャーバージョンの最小数に設定します。自動削除が設定されている場合（デフォルト）、サーバーは通常、この数の約2倍のレジャーバージョンが蓄積されると削除を実行します。

    {% include '_snippets/conf-file-location.md' %}<!--_ -->

0. `rippled`サービスを起動（または再起動）します。

        $ sudo systemctl restart rippled

0. サーバーがネットワークと同期するまで待ちます。

    ネットワークとシステムの能力と、サーバーがオフラインになっていた期間に応じて、完全な同期が完了するまでには5～15分かかります。

    サーバーとネットワークの同期が完了すると、[server_infoメソッド][]が再び開き、`server_state`の値として`"full"`、`"proposing"`、`"validating"`のいずれかが報告されます。

0. [server_infoメソッド][]を使用してサーバーの`complete_ledgers`範囲を定期的に調べ、レジャーが削除されていることを確認します。

    オンライン削除実行後の`complete_ledgers`範囲には、古いレジャーが使用できなくなったことが反映されます。サーバーに履歴が蓄積されるにつれ、使用可能なレジャーの総数が徐々に増加します。この数が設定した`online_delete`値の2倍に達し、オンライン削除が実行されるとレジャーの総数は減少します。

0. `rippled`ログで、`SHAMapStore::WRN`で始まるメッセージを確認します。このメッセージが出力されている場合、サーバーがネットワークと同期していない状態になったために[オンライン削除が中断されている](online-deletion.html#オンライン削除の中断)可能性があります。

    この状況が定期的に発生する場合は、サーバーのスペックが不十分で、オンライン削除の実行中にレジャーを最新状態に維持できていない可能性があります。同じハードウェア上の他のサービス（スケジュール済みバックアップやセキュリティスキャンなど）と`rippled`サーバーがリソースをめぐって競合していないことを確認してください。以下のいずれかの操作を実行できます。

    - システムスペックを強化する。推奨事項については、[システム要件](system-requirements.html)を参照してください。
    - 設定を変更し、保管する履歴の量を減らす。（このチュートリアルのステップ2）
    - サーバーの[`node_size`パラメーター](capacity-planning.html)を変更する。
    - レジャーストアーに[RocksDBの代わりにNuDB](capacity-planning.html)を使用する。
    - [指示による削除を使用してオンライン削除をスケジュールする](configure-advisory-deletion.html)。


## 関連項目

- [オンライン削除](online-deletion.html)
- [指示による削除の設定](configure-advisory-deletion.html)
- [履歴シャーディングの設定](configure-history-sharding.html)
- [完全な履歴の設定](configure-full-history.html)


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
