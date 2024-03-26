---
html: server-is-amendment-blocked.html
parent: troubleshoot-the-rippled-server.html
seo:
    description: Amendmentによる変更を実行できないサーバのトラブルシューティング
labels:
  - コアサーバ
---
# rippledサーバがAmendmentブロックされた

Amendmentブロックされたサーバは、レジャーの有効性を判断したり、トランザクションを送信または処理したり、コンセンサスプロセスに参加したりすることができません。

あなたの`rippled`サーバが[Amendmentブロック](../../concepts/networks-and-servers/amendments.md#amendmentブロックされたサーバ)されたことを示す最初の兆候の一つは、トランザクションを送信したときに返される`amendmentBlocked`エラーです。以下は`amendmentBlocked`エラーの例です。

```json
{
   "result":{
      "error":"amendmentBlocked",
      "error_code":14,
      "error_message":"Amendment blocked, need upgrade.",
      "request":{
         "command":"submit",
         "tx_blob":"479H0KQ4LUUXIHL48WCVN0C9VD7HWSX0MG1UPYNXK6PI9HLGBU2U10K3HPFJSROFEG5VD749WDPHWSHXXO72BOSY2G8TWUDOJNLRTR9LTT8PSOB9NNZ485EY2RD9D80FLDFRBVMP1RKMELILD7I922D6TBCAZK30CSV6KDEDUMYABE0XB9EH8C4LE98LMU91I9ZV2APETJD4AYFEN0VNMIT1XQ122Y2OOXO45GJ737HHM5XX88RY7CXHVWJ5JJ7NYW6T1EEBW9UE0NLB2497YBP9V1XVAEK8JJYVRVW0L03ZDXFY8BBHP6UBU7ZNR0JU9GJQPNHG0DK86S4LLYDN0BTCF4KWV2J4DEB6DAX4BDLNPT87MM75G70DFE9W0R6HRNWCH0X075WHAXPSH7S3CSNXPPA6PDO6UA1RCCZOVZ99H7968Q37HACMD8EZ8SU81V4KNRXM46N520S4FVZNSJHA"
      },
      "status":"error"
   }
}
```

次の`rippled`ログメッセージは、サーバがAmendmentブロックされていることを示しています。

```
2018-Feb-12 19:38:30 LedgerMaster:ERR One or more unsupported amendments activated: server blocked.
```

あなたの`rippled`サーバがAmendmentブロックされているかどうかは`server_info`コマンドで確認できます。レスポンスの中で`result.info.amendment_blocked`を探してください。もし`amendment_blocked`が`true`になっていれば、あなたのサーバはAmendmentブロックされています。

**JSON-RPCレスポンスの例:**

```json
{
    "result": {
        "info": {
            "amendment_blocked": true,
            "build_version": "0.80.1",
            "complete_ledgers": "6658438-6658596",
            "hostid": "ip-10-30-96-212.us-west-2.compute.internal",
            "io_latency_ms": 1,
            "last_close": {
                "converge_time_s": 2,
                "proposers": 10
            },
...
        },
        "status": "success"
    }
}
```


## サーバのブロックを解除する

最も簡単な解決策は`rippled`の最新バージョンにアップデートすることですが、場合によっては、サーバをブロックするAmendmentを含む古いバージョンにアップデートすることもできます。

**注意:** 最新の`rippled`バージョンがセキュリティやその他の緊急の修正を提供する場合は、できるだけ早く最新バージョンにアップグレードしてください。

最新バージョンより古いバージョンにアップグレードすることで`rippled`サーバのブロックを解除できるかどうかを調べるには、どの機能がサーバをブロックしているかを調べ、ブロックされた機能をサポートしている`rippled`バージョンを調べます。

どの機能が`rippled`サーバをブロックしているかを調べるには、[`feature`](../../references/http-websocket-apis/admin-api-methods/status-and-debugging-methods/feature.md)管理者コマンドを使います。以下のような機能を探してください。

```
"enabled" : true
"supported" : false
```
これらの値は、最新のレジャーではAmendmentが必要だが、サーバがその実装をサポートしていないことを意味します。

** JSON-RPCレスポンスの例:**

```json
{
    "result": {
        "features": {
            "07D43DCE529B15A10827E5E04943B496762F9A88E3268269D69C44BE49E21104": {
                "enabled": true,
                "name": "Escrow",
                "supported": true,
                "vetoed": false
            },
            "08DE7D96082187F6E6578530258C77FAABABE4C20474BDB82F04B021F1A68647": {
                "enabled": true,
                "name": "PayChan",
                "supported": true,
                "vetoed": false
            },
            "1562511F573A19AE9BD103B5D6B9E01B3B46805AEC5D3C4805C902B514399146": {
                "enabled": false,
                "name": "CryptoConditions",
                "supported": true,
                "vetoed": false
            },
            "157D2D480E006395B76F948E3E07A45A05FE10230D88A7993C71F97AE4B1F2D1": {
                "enabled": true,
                "supported": false,
                "vetoed": false
            },
...
            "67A34F2CF55BFC0F93AACD5B281413176FEE195269FA6D95219A2DF738671172": {
                "enabled": true,
                "supported": false,
                "vetoed": false
            },
...
            "F64E1EABBE79D55B3BB82020516CEC2C582A98A6BFE20FBE9BB6A0D233418064": {
                "enabled": true,
                "supported": false,
                "vetoed": false
            }
        },
        "status": "success"
    }
}
```

この例では、以下の機能との競合が`rippled`サーバのAmendmentブロックを引き起こしています。

* `157D2D480E006395B76F948E3E07A45A05FE10230D88A7993C71F97AE4B1F2D1`

* `67A34F2CF55BFC0F93AACD5B281413176FEE195269FA6D95219A2DF738671172`

* `F64E1EABBE79D55B3BB82020516CEC2C582A98A6BFE20FBE9BB6A0D233418064`

どの`rippled`バージョンがこれらの機能をサポートしているか調べるには、[既知のAmendment](/resources/known-amendments.md)をご覧ください。
