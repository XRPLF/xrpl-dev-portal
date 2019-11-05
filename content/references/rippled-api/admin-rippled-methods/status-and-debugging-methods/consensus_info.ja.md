# consensus_info
[[ソース]<br>](https://github.com/ripple/rippled/blob/a61ffab3f9010d8accfaa98aa3cacc7d38e74121/src/ripple/rpc/handlers/ConsensusInfo.cpp "Source")

`consensus_info`コマンドは、デバッグのためのコンセンサスプロセスに関する情報を返します。

_`consensus_info`メソッドは、権限のないユーザーは実行できない[管理メソッド](admin-rippled-methods.html)です。_

### 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "id": 99,
   "command": "consensus_info"
}
```

*JSON-RPC*

```
{
   "method": "consensus_info",
   "params": [
       {}
   ]
}
```

*コマンドライン*

```
#Syntax: consensus_info
rippled consensus_info
```

<!-- MULTICODE_BLOCK_END -->

この要求にはパラメーターはありません。

### 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*JSON-RPC*

```
{
  "result" : {
     "info" : {
        "acquired" : {
           "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306" : "acquired"
        },
        "close_granularity" : 10,
        "close_percent" : 50,
        "close_resolution" : 10,
        "close_times" : {
           "486082972" : 1,
           "486082973" : 4
        },
        "current_ms" : 1003,
        "have_time_consensus" : false,
        "ledger_seq" : 13701086,
        "our_position" : {
           "close_time" : 486082973,
           "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
           "propose_seq" : 0,
           "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
        },
        "peer_positions" : {
           "0A2EAF919033A036D363D4E5610A66209DDBE8EE" : {
              "close_time" : 486082972,
              "peer_id" : "n9KiYM9CgngLvtRCQHZwgC2gjpdaZcCcbt3VboxiNFcKuwFVujzS",
              "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
              "propose_seq" : 0,
              "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
           },
           "1567A8C953A86F8428C7B01641D79BBF2FD508F3" : {
              "close_time" : 486082973,
              "peer_id" : "n9LdgEtkmGB9E2h3K4Vp7iGUaKuq23Zr32ehxiU8FWY7xoxbWTSA",
              "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
              "propose_seq" : 0,
              "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
           },
           "202397A81F20B44CF44EA99AF761295E5A8397D2" : {
              "close_time" : 486082973,
              "peer_id" : "n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj",
              "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
              "propose_seq" : 0,
              "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
           },
           "5C29005CF4FB479FC49EEFB4A5B075C86DD963CC" : {
              "close_time" : 486082973,
              "peer_id" : "n9L81uNCaPgtUJfaHh89gmdvXKAmSt5Gdsw2g1iPWaPkAHW5Nm4C",
              "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
              "propose_seq" : 0,
              "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
           },
           "EFC49EB648E557CC50A72D715249B80E071F7705" : {
              "close_time" : 486082973,
              "peer_id" : "n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7",
              "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
              "propose_seq" : 0,
              "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
           }
        },
        "previous_mseconds" : 2005,
        "previous_proposers" : 5,
        "proposers" : 5,
        "proposing" : false,
        "state" : "consensus",
        "synched" : true,
        "validating" : false
     },
     "status" : "success"
  }
}
```

*コマンドライン*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
  "result" : {
     "info" : {
        "acquired" : {
           "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306" : "acquired"
        },
        "close_granularity" : 10,
        "close_percent" : 50,
        "close_resolution" : 10,
        "close_times" : {
           "486082972" : 1,
           "486082973" : 4
        },
        "current_ms" : 1003,
        "have_time_consensus" : false,
        "ledger_seq" : 13701086,
        "our_position" : {
           "close_time" : 486082973,
           "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
           "propose_seq" : 0,
           "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
        },
        "peer_positions" : {
           "0A2EAF919033A036D363D4E5610A66209DDBE8EE" : {
              "close_time" : 486082972,
              "peer_id" : "n9KiYM9CgngLvtRCQHZwgC2gjpdaZcCcbt3VboxiNFcKuwFVujzS",
              "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
              "propose_seq" : 0,
              "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
           },
           "1567A8C953A86F8428C7B01641D79BBF2FD508F3" : {
              "close_time" : 486082973,
              "peer_id" : "n9LdgEtkmGB9E2h3K4Vp7iGUaKuq23Zr32ehxiU8FWY7xoxbWTSA",
              "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
              "propose_seq" : 0,
              "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
           },
           "202397A81F20B44CF44EA99AF761295E5A8397D2" : {
              "close_time" : 486082973,
              "peer_id" : "n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj",
              "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
              "propose_seq" : 0,
              "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
           },
           "5C29005CF4FB479FC49EEFB4A5B075C86DD963CC" : {
              "close_time" : 486082973,
              "peer_id" : "n9L81uNCaPgtUJfaHh89gmdvXKAmSt5Gdsw2g1iPWaPkAHW5Nm4C",
              "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
              "propose_seq" : 0,
              "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
           },
           "EFC49EB648E557CC50A72D715249B80E071F7705" : {
              "close_time" : 486082973,
              "peer_id" : "n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7",
              "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
              "propose_seq" : 0,
              "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
           }
        },
        "previous_mseconds" : 2005,
        "previous_proposers" : 5,
        "proposers" : 5,
        "proposing" : false,
        "state" : "consensus",
        "synched" : true,
        "validating" : false
     },
     "status" : "success"
  }
}
```

<!-- MULTICODE_BLOCK_END -->

この応答は[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれています。

| `Field` | 型   | 説明                                               |
|:--------|:-------|:----------------------------------------------------------|
| `info`  | オブジェクト | コンセンサスのデバッグで役立つ可能性のある情報。この出力は、予告なく変更される可能性があります。 |

`info`オブジェクトに含まれる可能性のあるフィールドについて以下に簡単に説明します。

| `Field`          | 型    | 説明                                     |
|:-----------------|:--------|:------------------------------------------------|
| `ledger_seq`     | 数値  | 現在コンセンサスプロセスにあるレジャーのシーケンス番号。 |
| `our_position`   | オブジェクト  | コンセンサスプロセスにあるレジャーについてサーバーが予期する内容。 |
| `peer_positions` | オブジェクト  | コンセンサスプロセスにあるピアと各ピアが提案するレジャーバージョンのマップ。 |
| `proposers`      | 数値  | このコンセンサスプロセスに参加している信頼できるバリデータの数。信頼できるバリデータは、このサーバー構成に応じて異なります。 |
| `synched`        | ブール値 | このサーバー自体が、自分がネットワークと同期中であるとみなしているかどうか。 |
| `state`          | 文字列  | 現在進行中のコンセンサスプロセスの部分: `open`、`consensus`、`finished`、または`accepted`。 |

`info`の唯一のフィールドが`"consensus": "none"`である最小限の結果となることもありますが、これは正常です。これは、サーバーがコンセンサスラウンドの合間にあることを示します。

`consensus_info`コマンドを短い間隔で連続して数回実行すると、このコマンドの結果が大きく変化することがあります。


### 考えられるエラー

* [汎用エラータイプ][]のすべて。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}