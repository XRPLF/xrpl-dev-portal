---
html: gateway_balances.html
parent: account-methods.html
seo:
    description: 特定のアカウントから発行された残高の合計を計算します。
labels:
  - トークン
  - アカウント
---
# gateway_balances
[[ソース]](https://github.com/XRPLF/rippled/blob/9111ad1a9dc37d49d085aa317712625e635197c0/src/ripple/rpc/handlers/GatewayBalances.cpp "Source")

`gateway_balances`コマンドは、特定のアカウントから発行された残高の合計を計算します。オプションで、[運用アドレス](../../../../concepts/accounts/account-types.md)が保有する額を除外できます。{% badge href="https://github.com/XRPLF/rippled/releases/tag/0.28.2" %}新規: rippled 0.28.2{% /badge %}

## リクエストのフォーマット
リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": "example_gateway_balances_1",
    "command": "gateway_balances",
    "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
    "strict": true,
    "hotwallet": ["rKm4uWpg9tfwbVSeATv4KxDe6mpE9yPkgJ","ra7JkEzrgeKHdzKgo4EUUVBnxggY4z37kt"],
    "ledger_index": "validated"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "gateway_balances",
    "params": [
        {
            "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
            "hotwallet": [
                "rKm4uWpg9tfwbVSeATv4KxDe6mpE9yPkgJ",
                "ra7JkEzrgeKHdzKgo4EUUVBnxggY4z37kt"
            ],
            "ledger_index": "validated",
            "strict": true
        }
    ]
}
```
{% /tab %}

{% /tabs %}

リクエストには以下のパラメーターが含まれます。

| `Field`        | 型                         | 説明                           |
|:---------------|:---------------------------|:-------------------------------|
| `account` | 文字列 | チェックする[アドレス][]。[発行アドレス](../../../../concepts/accounts/account-types.md)である必要があります。 |
| `strict` | ブール値 | _（省略可）_ trueの場合は、アカウントパラメーターにアドレスまたは公開鍵だけを受け入れます。デフォルトではfalseです。 |
| `hotwallet` | 文字列または配列 | _（省略可）_ 発行済み残高から除外する[運用アドレス](../../../../concepts/accounts/account-types.md)、またはそのようなアドレスの配列。 |
| `ledger_hash` | 文字列 | _（省略可）_ 使用するレジャーバージョンの20バイトの16進文字列。（[レジャーの指定][]をご覧ください） |
| `ledger_index` | 文字列または符号なし整数 | _（省略可）_ 使用するレジャーバージョンの[レジャーインデックス][]、またはレジャーを自動的に選択するためのショートカット文字列。（[レジャーの指定][]をご覧ください） |

## レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 3,
  "status": "success",
  "type": "response",
  "result": {
    "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
    "assets": {
      "r9F6wk8HkXrgYWoJ7fsv4VrUBVoqDVtzkH": [
        {
          "currency": "BTC",
          "value": "5444166510000000e-26"
        }
      ],
      "rPFLkxQk6xUGdGYEykqe7PR25Gr7mLHDc8": [
        {
          "currency": "EUR",
          "value": "4000000000000000e-27"
        }
      ],
      "rPU6VbckqCLW4kb51CWqZdxvYyQrQVsnSj": [
        {
          "currency": "BTC",
          "value": "1029900000000000e-26"
        }
      ],
      "rpR95n1iFkTqpoy1e878f4Z1pVHVtWKMNQ": [
        {
          "currency": "BTC",
          "value": "4000000000000000e-30"
        }
      ],
      "rwmUaXsWtXU4Z843xSYwgt1is97bgY8yj6": [
        {
          "currency": "BTC",
          "value": "8700000000000000e-30"
        }
      ]
    },
    "balances": {
      "rKm4uWpg9tfwbVSeATv4KxDe6mpE9yPkgJ": [
        {
          "currency": "EUR",
          "value": "29826.1965999999"
        }
      ],
      "ra7JkEzrgeKHdzKgo4EUUVBnxggY4z37kt": [
        {
          "currency": "USD",
          "value": "13857.70416"
        }
      ]
    },
    "ledger_hash": "61DDBF304AF6E8101576BF161D447CA8E4F0170DDFBEAFFD993DC9383D443388",
    "ledger_index": 14483195,
    "obligations": {
      "BTC": "5908.324927635318",
      "EUR": "992471.7419793958",
      "GBP": "4991.38706013193",
      "USD": "1997134.20229482"
    },
    "validated": true
  }
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK
{
    "result": {
        "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
        "assets": {
            "r9F6wk8HkXrgYWoJ7fsv4VrUBVoqDVtzkH": [
                {
                    "currency": "BTC",
                    "value": "5444166510000000e-26"
                }
            ],
            "rPFLkxQk6xUGdGYEykqe7PR25Gr7mLHDc8": [
                {
                    "currency": "EUR",
                    "value": "4000000000000000e-27"
                }
            ],
            "rPU6VbckqCLW4kb51CWqZdxvYyQrQVsnSj": [
                {
                    "currency": "BTC",
                    "value": "1029900000000000e-26"
                }
            ],
            "rpR95n1iFkTqpoy1e878f4Z1pVHVtWKMNQ": [
                {
                    "currency": "BTC",
                    "value": "4000000000000000e-30"
                }
            ],
            "rwmUaXsWtXU4Z843xSYwgt1is97bgY8yj6": [
                {
                    "currency": "BTC",
                    "value": "8700000000000000e-30"
                }
            ]
        },
        "balances": {
            "rKm4uWpg9tfwbVSeATv4KxDe6mpE9yPkgJ": [
                {
                    "currency": "EUR",
                    "value": "29826.1965999999"
                }
            ],
            "ra7JkEzrgeKHdzKgo4EUUVBnxggY4z37kt": [
                {
                    "currency": "USD",
                    "value": "13857.70416"
                }
            ]
        },
        "ledger_hash": "980FECF48CA4BFDEC896692C31A50D484BDFE865EC101B00259C413AA3DBD672",
        "ledger_index": 14483212,
        "obligations": {
            "BTC": "5908.324927635318",
            "EUR": "992471.7419793958",
            "GBP": "4991.38706013193",
            "USD": "1997134.20229482"
        },
        "status": "success",
        "validated": true
    }
}
```
{% /tab %}

{% /tabs %}

**注記:** このメソッドのコマンドライン構文はありません。コマンドラインからアクセスするには[jsonメソッド][]を使用してください。

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| `Field`                | 型                        | 説明                    |
|:-----------------------|:--------------------------|:------------------------|
| `account` | 文字列 - [アドレス][] | 残高を発行したアカウントのアドレス。 |
| `obligations` | オブジェクト | （空の場合は省略）除外されていないアドレスに発行された額の合計。発行された価値の合計に対する通貨のマップとして示されます。 |
| `balances` | オブジェク | _（空の場合は省略）_ リクエストから`hotwallet`アドレスに発行された額。キーはアドレスであり、値はアドレスが保有する通貨額の配列です。 |
| `assets` | オブジェクト | _（空の場合は省略）_ 他から発行された保有額の合計。推奨される構成では、[発行アドレス](../../../../concepts/accounts/account-types.md)の保有額はありません。 |
| `ledger_hash` | 文字列 - [ハッシュ][] | _（省略される場合があります）_ このレスポンスの生成に使用されたレジャーバージョンの識別用ハッシュ。 |
| `ledger_index` | 数値 - [レジャーインデックス][] | _（省略される場合があります）_ このレスポンスの生成に使用されたレジャーバージョンのレジャーインデックス。 | |
| `ledger_current_index` | 数値 - [レジャーインデックス][] | _（`ledger_current_index`が指定されている場合は省略）_ この情報の取得時に使用した、現在処理中のレジャーバージョンの[レジャーインデックス][]。 |

## 考えられるエラー

* いずれかの[汎用エラータイプ][]。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `invalidHotWallet` - `hotwallet`フィールドに指定されている1つ以上のアドレスが、リクエストに指定されているアカウントが発行した通貨を保有しているアカウントの[アドレス][]ではありません。
* `actNotFound` - リクエストの`account`フィールドに指定されている[アドレス][]が、レジャーのアカウントに対応していません。
* `lgrNotFound` - `ledger_hash`または`ledger_index`で指定したレジャーが存在しないか、存在してはいるもののサーバが保有していません。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
