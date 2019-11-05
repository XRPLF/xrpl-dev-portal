# print
[[ソース]<br>](https://github.com/ripple/rippled/blob/315a8b6b602798a4cff4d8e1911936011e12abdb/src/ripple/rpc/handlers/Print.cpp "Source")

`print`コマンドは、さまざまな内部サブシステム（ピア、レジャークリーナー、リソースマネージャーなど）の現在の状況を返します。

*`print`要求は、権限のないユーザーは実行できない[管理メソッド](admin-rippled-methods.html)です。*

### 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "id": "print_req_1",
   "command": "print"
}
```

*コマンドライン*

```
rippled print
```

<!-- MULTICODE_BLOCK_END -->

要求にはパラメーターが含まれていません。

### 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*コマンドライン*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
  "result" : {
     "app" : {
        "ledgercleaner" : {
           "status" : "idle"
        },
        "peers" : {
           "peerfinder" : {
              "bootcache" : {
                 "entries" : 109
              },
              "config" : {
                 "auto_connect" : "true",
                 "features" : "",
                 "max_peers" : 21,
                 "out_peers" : 10,
                 "port" : 51235,
                 "want_incoming" : "true"
              },
              "counts" : {
                 "accept" : 0,
                 "close" : 0,
                 "cluster" : "0",
                 "connect" : 0,
                 "fixed" : "0",
                 "in" : "0/11",
                 "out" : "10/10",
                 "total" : "10"
              },
              "fixed" : 0,
              "livecache" : {
                 "entries" : [
                    {
                       "address" : "23.239.3.247:51235",
                       "expires" : "30000000000 nanoseconds",
                       "hops" : 2
                    },
                    {
                       "address" : "192.170.145.88:51235",
                       "expires" : "30000000000 nanoseconds",
                       "hops" : 1
                    },
                    {
                       "address" : "198.204.238.130:51235",
                       "expires" : "26000024558 nanoseconds",
                       "hops" : 1
                    },
                    {
                       "address" : "203.127.12.115:51235",
                       "expires" : "26000024558 nanoseconds",
                       "hops" : 2
                    },
                    {
                       "address" : "212.83.147.67:51235",
                       "expires" : "26000024558 nanoseconds",
                       "hops" : 2
                    }
                 ],
                 "hist" : "0, 10, 74, 10, 0, 0, 0, 0",
                 "size" : "94"
              },
              "peers" : [
                 {
                    "local_address" : "10.1.10.78:48923",
                    "remote_address" : "52.24.43.83:51235",
                    "state" : "active"
                 },
                 {
                    "local_address" : "10.1.10.78:50004",
                    "remote_address" : "52.26.205.197:51235",
                    "state" : "active"
                 },
                 {
                    "local_address" : "10.1.10.78:37019",
                    "remote_address" : "168.1.60.132:51235",
                    "state" : "active"
                 },
                 {
                    "local_address" : "10.1.10.78:38775",
                    "remote_address" : "192.170.145.88:51235",
                    "state" : "active"
                 },
                 {
                    "local_address" : "10.1.10.78:34793",
                    "remote_address" : "198.204.238.130:51235",
                    "state" : "active"
                 }
              ]
           }
        },
        "resource" : {
           "admin" : [
              {
                 "balance" : 0,
                 "count" : 1,
                 "name" : "\"127.0.0.1\""
              }
           ],
           "inactive" : [],
           "inbound" : [],
           "outbound" : [
              {
                 "balance" : 23,
                 "count" : 1,
                 "name" : "93.190.138.234:51235"
              },
              {
                 "balance" : 35,
                 "count" : 1,
                 "name" : "198.204.238.130:51235"
              },
              {
                 "balance" : 31,
                 "count" : 1,
                 "name" : "52.26.205.197:51235"
              },
              {
                 "balance" : 32,
                 "count" : 1,
                 "name" : "54.186.73.52:51235"
              },
              {
                 "balance" : 15,
                 "count" : 1,
                 "name" : "72.251.233.164:51235"
              }
           ]
        },
        "server" : {
           "active" : "2",
           "hist" : "16",
           "history" : [
              {
                 "bytes_in" : "214",
                 "bytes_out" : "11688",
                 "elapsed" : "0 seconds",
                 "id" : "16",
                 "requests" : 1,
                 "when" : "2015-Jun-16 16:33:50"
              },
              {
                 "bytes_in" : "214",
                 "bytes_out" : "11431",
                 "elapsed" : "0 seconds",
                 "id" : "15",
                 "requests" : 1,
                 "when" : "2015-Jun-16 16:11:59"
              },
              {
                 "bytes_in" : "227",
                 "bytes_out" : "337",
                 "elapsed" : "0 seconds",
                 "id" : "3",
                 "requests" : 1,
                 "when" : "2015-Jun-16 14:57:23"
              },
              {
                 "bytes_in" : "214",
                 "bytes_out" : "2917",
                 "elapsed" : "0 seconds",
                 "id" : "2",
                 "requests" : 1,
                 "when" : "2015-Jun-16 12:39:29"
              },
              {
                 "bytes_in" : "220",
                 "bytes_out" : "1426",
                 "elapsed" : "0 seconds",
                 "id" : "1",
                 "requests" : 1,
                 "when" : "2015-Jun-16 12:39:13"
              }
           ]
        },
        "validators" : {}
     },
     "status" : "success"
  }
}

```

<!-- MULTICODE_BLOCK_END -->

応答は[標準フォーマット][]に従っています。結果に含まれる追加フィールドは、`rippled`サーバーの内部状態に応じて異なります。このコマンドの実行結果は、予告なく変更されることがあります。

### 考えられるエラー

* [汎用エラータイプ][]のすべて。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}