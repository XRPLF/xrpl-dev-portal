---
seo:
    description: 特定のレジャーバージョンから1つのトランザクションに関する情報を取得します。
labels:
    - トランザクション送信
---
# transaction_entry
{% source-link path="src/xrpld/rpc/handlers/transaction/TransactionEntry.cpp" /%}

`transaction_entry`メソッドは、特定のレジャーバージョンから1つのトランザクションに関する情報を取得します。（これに対して、[txメソッド][]は、指定したトランザクションをすべてのレジャーから検索します。代わりにtxメソッドを使用することをお勧めします。）

## リクエストのフォーマット

リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": "example_transaction_entry",
  "command": "transaction_entry",
  "tx_hash": "C53ECF838647FA5A4C780377025FEC7999AB4182590510CA461444B207AB74A9",
  "ledger_index": 56865245,
  "api_version": 2
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "transaction_entry",
    "params": [
        {
            "tx_hash": "C53ECF838647FA5A4C780377025FEC7999AB4182590510CA461444B207AB74A9",
            "ledger_index": 56865245,
            "api_version": 2
        }
    ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: transaction_entry transaction_hash ledger_index|ledger_hash
xrpld transaction_entry C53ECF838647FA5A4C780377025FEC7999AB4182590510CA461444B207AB74A9 56865245
```
{% /tab %}

{% /tabs %}

{% try-it method="transaction_entry" /%}

リクエストには以下のパラメーターが含まれます。

| フィールド       | 型                     | 説明 |
|:---------------|:---------------------------|:-------------------------------|
| `ledger_hash`  | 文字列                  | _（省略可）_ 使用するレジャーバージョンの一意のハッシュ。（[レジャーの指定][]を参照してください） |
| `ledger_index` | 文字列または符号なし整数   | _（省略可）_ 使用するレジャーの[レジャーインデックス][]、またはレジャーを自動的に選択するためのショートカット文字列。（[レジャーの指定][]を参照してください） |
| `tx_hash`      | 文字列                  | 検索するトランザクションの一意のハッシュ。 |

{% admonition type="info" name="注記" %}このメソッドでは、現在進行中のレジャーから情報を取得することはできません。`ledger_index`または`ledger_hash`でレジャーバージョンを指定する必要があります。{% /admonition %}

## レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "result": {
    "validated": true,
    "meta": {
      "AffectedNodes": [
        {
          "ModifiedNode": {
            "FinalFields": {
              "ExchangeRate": "4f04c66806cf7400",
              "Flags": 0,
              "RootIndex": "02BAAC1E67C1CE0E96F0FA2E8061020536CEDD043FEB0FF54F04C66806CF7400",
              "TakerGetsCurrency": "0000000000000000000000000000000000000000",
              "TakerGetsIssuer": "0000000000000000000000000000000000000000",
              "TakerPaysCurrency": "000000000000000000000000434E590000000000",
              "TakerPaysIssuer": "CED6E99370D5C00EF4EBF72567DA99F5661BFB3A"
            },
            "LedgerEntryType": "DirectoryNode",
            "LedgerIndex": "02BAAC1E67C1CE0E96F0FA2E8061020536CEDD043FEB0FF54F04C66806CF7400"
          }
        },
        {
          "ModifiedNode": {
            "FinalFields": {
              "Account": "rhhh49pFH96roGyuC4E5P4CHaNjS1k8gzM",
              "Balance": "10404767991",
              "Flags": 0,
              "OwnerCount": 3,
              "Sequence": 5037711
            },
            "LedgerEntryType": "AccountRoot",
            "LedgerIndex": "1DECD9844E95FFBA273F1B94BA0BF2564DDF69F2804497A6D7837B52050174A2",
            "PreviousFields": {
              "Balance": "10404768003",
              "Sequence": 5037710
            },
            "PreviousTxnID": "4DC47B246B5EB9CCE92ABA8C482479E3BF1F946CABBEF74CA4DE36521D5F9008",
            "PreviousTxnLgrSeq": 56865244
          }
        },
        {
          "DeletedNode": {
            "FinalFields": {
              "Account": "rhhh49pFH96roGyuC4E5P4CHaNjS1k8gzM",
              "BookDirectory": "02BAAC1E67C1CE0E96F0FA2E8061020536CEDD043FEB0FF54F04C66806CF7400",
              "BookNode": "0",
              "Flags": 0,
              "OwnerNode": "0",
              "PreviousTxnID": "8F5FF57B404827F12BDA7561876A13C3E3B3095CBF75334DBFB5F227391A660C",
              "PreviousTxnLgrSeq": 56865244,
              "Sequence": 5037708,
              "TakerGets": "15000000000",
              "TakerPays": {
                "currency": "CNY",
                "issuer": "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y",
                "value": "20160.75"
              }
            },
            "LedgerEntryType": "Offer",
            "LedgerIndex": "26AAE6CA8D29E28A47C92ADF22D5D96A0216F0551E16936856DDC8CB1AAEE93B"
          }
        },
        {
          "ModifiedNode": {
            "FinalFields": {
              "Flags": 0,
              "IndexNext": "0",
              "IndexPrevious": "0",
              "Owner": "rhhh49pFH96roGyuC4E5P4CHaNjS1k8gzM",
              "RootIndex": "47FAF5D102D8CE655574F440CDB97AC67C5A11068BB3759E87C2B9745EE94548"
            },
            "LedgerEntryType": "DirectoryNode",
            "LedgerIndex": "47FAF5D102D8CE655574F440CDB97AC67C5A11068BB3759E87C2B9745EE94548"
          }
        },
        {
          "CreatedNode": {
            "LedgerEntryType": "Offer",
            "LedgerIndex": "8BAEE3C7DE04A568E96007420FA11ABD0BC9AE44D35932BB5640E9C3FB46BC9B",
            "NewFields": {
              "Account": "rhhh49pFH96roGyuC4E5P4CHaNjS1k8gzM",
              "BookDirectory": "02BAAC1E67C1CE0E96F0FA2E8061020536CEDD043FEB0FF54F04C66806CF7400",
              "Sequence": 5037710,
              "TakerGets": "15000000000",
              "TakerPays": {
                "currency": "CNY",
                "issuer": "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y",
                "value": "20160.75"
              }
            }
          }
        }
      ],
      "TransactionIndex": 0,
      "TransactionResult": "tesSUCCESS"
    },
    "tx_json": {
      "Account": "rhhh49pFH96roGyuC4E5P4CHaNjS1k8gzM",
      "Fee": "12",
      "Flags": 0,
      "LastLedgerSequence": 56865248,
      "OfferSequence": 5037708,
      "Sequence": 5037710,
      "SigningPubKey": "03B51A3EDF70E4098DA7FB053A01C5A6A0A163A30ED1445F14F87C7C3295FCB3BE",
      "TakerGets": "15000000000",
      "TakerPays": {
        "currency": "CNY",
        "issuer": "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y",
        "value": "20160.75"
      },
      "TransactionType": "OfferCreate",
      "TxnSignature": "3045022100A5023A0E64923616FCDB6D664F569644C7C9D1895772F986CD6B981B515B02A00220530C973E9A8395BC6FE2484948D2751F6B030FC7FB8575D1BFB406368AD554D9"
    },
    "ledger_index": 56865245,
    "ledger_hash": "793E56131D8D4ABFB27FA383BFC44F2978B046E023FF46C588D7E0C874C2472A",
    "close_time_iso": "2020-07-16T20:53:40Z",
    "hash": "C53ECF838647FA5A4C780377025FEC7999AB4182590510CA461444B207AB74A9"
  },
  "id": "example_transaction_entry",
  "api_version": 2,
  "status": "success",
  "type": "response"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
  "result": {
    "validated": true,
    "meta": {
      "AffectedNodes": [
        {
          "ModifiedNode": {
            "FinalFields": {
              "ExchangeRate": "4f04c66806cf7400",
              "Flags": 0,
              "RootIndex": "02BAAC1E67C1CE0E96F0FA2E8061020536CEDD043FEB0FF54F04C66806CF7400",
              "TakerGetsCurrency": "0000000000000000000000000000000000000000",
              "TakerGetsIssuer": "0000000000000000000000000000000000000000",
              "TakerPaysCurrency": "000000000000000000000000434E590000000000",
              "TakerPaysIssuer": "CED6E99370D5C00EF4EBF72567DA99F5661BFB3A"
            },
            "LedgerEntryType": "DirectoryNode",
            "LedgerIndex": "02BAAC1E67C1CE0E96F0FA2E8061020536CEDD043FEB0FF54F04C66806CF7400"
          }
        },
        {
          "ModifiedNode": {
            "FinalFields": {
              "Account": "rhhh49pFH96roGyuC4E5P4CHaNjS1k8gzM",
              "Balance": "10404767991",
              "Flags": 0,
              "OwnerCount": 3,
              "Sequence": 5037711
            },
            "LedgerEntryType": "AccountRoot",
            "LedgerIndex": "1DECD9844E95FFBA273F1B94BA0BF2564DDF69F2804497A6D7837B52050174A2",
            "PreviousFields": {
              "Balance": "10404768003",
              "Sequence": 5037710
            },
            "PreviousTxnID": "4DC47B246B5EB9CCE92ABA8C482479E3BF1F946CABBEF74CA4DE36521D5F9008",
            "PreviousTxnLgrSeq": 56865244
          }
        },
        {
          "DeletedNode": {
            "FinalFields": {
              "Account": "rhhh49pFH96roGyuC4E5P4CHaNjS1k8gzM",
              "BookDirectory": "02BAAC1E67C1CE0E96F0FA2E8061020536CEDD043FEB0FF54F04C66806CF7400",
              "BookNode": "0",
              "Flags": 0,
              "OwnerNode": "0",
              "PreviousTxnID": "8F5FF57B404827F12BDA7561876A13C3E3B3095CBF75334DBFB5F227391A660C",
              "PreviousTxnLgrSeq": 56865244,
              "Sequence": 5037708,
              "TakerGets": "15000000000",
              "TakerPays": {
                "currency": "CNY",
                "issuer": "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y",
                "value": "20160.75"
              }
            },
            "LedgerEntryType": "Offer",
            "LedgerIndex": "26AAE6CA8D29E28A47C92ADF22D5D96A0216F0551E16936856DDC8CB1AAEE93B"
          }
        },
        {
          "ModifiedNode": {
            "FinalFields": {
              "Flags": 0,
              "IndexNext": "0",
              "IndexPrevious": "0",
              "Owner": "rhhh49pFH96roGyuC4E5P4CHaNjS1k8gzM",
              "RootIndex": "47FAF5D102D8CE655574F440CDB97AC67C5A11068BB3759E87C2B9745EE94548"
            },
            "LedgerEntryType": "DirectoryNode",
            "LedgerIndex": "47FAF5D102D8CE655574F440CDB97AC67C5A11068BB3759E87C2B9745EE94548"
          }
        },
        {
          "CreatedNode": {
            "LedgerEntryType": "Offer",
            "LedgerIndex": "8BAEE3C7DE04A568E96007420FA11ABD0BC9AE44D35932BB5640E9C3FB46BC9B",
            "NewFields": {
              "Account": "rhhh49pFH96roGyuC4E5P4CHaNjS1k8gzM",
              "BookDirectory": "02BAAC1E67C1CE0E96F0FA2E8061020536CEDD043FEB0FF54F04C66806CF7400",
              "Sequence": 5037710,
              "TakerGets": "15000000000",
              "TakerPays": {
                "currency": "CNY",
                "issuer": "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y",
                "value": "20160.75"
              }
            }
          }
        }
      ],
      "TransactionIndex": 0,
      "TransactionResult": "tesSUCCESS"
    },
    "tx_json": {
      "Account": "rhhh49pFH96roGyuC4E5P4CHaNjS1k8gzM",
      "Fee": "12",
      "Flags": 0,
      "LastLedgerSequence": 56865248,
      "OfferSequence": 5037708,
      "Sequence": 5037710,
      "SigningPubKey": "03B51A3EDF70E4098DA7FB053A01C5A6A0A163A30ED1445F14F87C7C3295FCB3BE",
      "TakerGets": "15000000000",
      "TakerPays": {
        "currency": "CNY",
        "issuer": "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y",
        "value": "20160.75"
      },
      "TransactionType": "OfferCreate",
      "TxnSignature": "3045022100A5023A0E64923616FCDB6D664F569644C7C9D1895772F986CD6B981B515B02A00220530C973E9A8395BC6FE2484948D2751F6B030FC7FB8575D1BFB406368AD554D9"
    },
    "ledger_index": 56865245,
    "ledger_hash": "793E56131D8D4ABFB27FA383BFC44F2978B046E023FF46C588D7E0C874C2472A",
    "close_time_iso": "2020-07-16T20:53:40Z",
    "hash": "C53ECF838647FA5A4C780377025FEC7999AB4182590510CA461444B207AB74A9",
    "status": "success"
  }
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```json
Loading: "/etc/xrpld/xrpld.cfg"
2025-Dec-19 03:16:00.638871262 UTC HTTPClient:NFO Connecting to 127.0.0.1:5005

{
  "result": {
    "validated": true,
    "meta": {
      "AffectedNodes": [
        {
          "ModifiedNode": {
            "FinalFields": {
              "ExchangeRate": "4f04c66806cf7400",
              "Flags": 0,
              "RootIndex": "02BAAC1E67C1CE0E96F0FA2E8061020536CEDD043FEB0FF54F04C66806CF7400",
              "TakerGetsCurrency": "0000000000000000000000000000000000000000",
              "TakerGetsIssuer": "0000000000000000000000000000000000000000",
              "TakerPaysCurrency": "000000000000000000000000434E590000000000",
              "TakerPaysIssuer": "CED6E99370D5C00EF4EBF72567DA99F5661BFB3A"
            },
            "LedgerEntryType": "DirectoryNode",
            "LedgerIndex": "02BAAC1E67C1CE0E96F0FA2E8061020536CEDD043FEB0FF54F04C66806CF7400"
          }
        },
        {
          "ModifiedNode": {
            "FinalFields": {
              "Account": "rhhh49pFH96roGyuC4E5P4CHaNjS1k8gzM",
              "Balance": "10404767991",
              "Flags": 0,
              "OwnerCount": 3,
              "Sequence": 5037711
            },
            "LedgerEntryType": "AccountRoot",
            "LedgerIndex": "1DECD9844E95FFBA273F1B94BA0BF2564DDF69F2804497A6D7837B52050174A2",
            "PreviousFields": {
              "Balance": "10404768003",
              "Sequence": 5037710
            },
            "PreviousTxnID": "4DC47B246B5EB9CCE92ABA8C482479E3BF1F946CABBEF74CA4DE36521D5F9008",
            "PreviousTxnLgrSeq": 56865244
          }
        },
        {
          "DeletedNode": {
            "FinalFields": {
              "Account": "rhhh49pFH96roGyuC4E5P4CHaNjS1k8gzM",
              "BookDirectory": "02BAAC1E67C1CE0E96F0FA2E8061020536CEDD043FEB0FF54F04C66806CF7400",
              "BookNode": "0",
              "Flags": 0,
              "OwnerNode": "0",
              "PreviousTxnID": "8F5FF57B404827F12BDA7561876A13C3E3B3095CBF75334DBFB5F227391A660C",
              "PreviousTxnLgrSeq": 56865244,
              "Sequence": 5037708,
              "TakerGets": "15000000000",
              "TakerPays": {
                "currency": "CNY",
                "issuer": "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y",
                "value": "20160.75"
              }
            },
            "LedgerEntryType": "Offer",
            "LedgerIndex": "26AAE6CA8D29E28A47C92ADF22D5D96A0216F0551E16936856DDC8CB1AAEE93B"
          }
        },
        {
          "ModifiedNode": {
            "FinalFields": {
              "Flags": 0,
              "IndexNext": "0",
              "IndexPrevious": "0",
              "Owner": "rhhh49pFH96roGyuC4E5P4CHaNjS1k8gzM",
              "RootIndex": "47FAF5D102D8CE655574F440CDB97AC67C5A11068BB3759E87C2B9745EE94548"
            },
            "LedgerEntryType": "DirectoryNode",
            "LedgerIndex": "47FAF5D102D8CE655574F440CDB97AC67C5A11068BB3759E87C2B9745EE94548"
          }
        },
        {
          "CreatedNode": {
            "LedgerEntryType": "Offer",
            "LedgerIndex": "8BAEE3C7DE04A568E96007420FA11ABD0BC9AE44D35932BB5640E9C3FB46BC9B",
            "NewFields": {
              "Account": "rhhh49pFH96roGyuC4E5P4CHaNjS1k8gzM",
              "BookDirectory": "02BAAC1E67C1CE0E96F0FA2E8061020536CEDD043FEB0FF54F04C66806CF7400",
              "Sequence": 5037710,
              "TakerGets": "15000000000",
              "TakerPays": {
                "currency": "CNY",
                "issuer": "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y",
                "value": "20160.75"
              }
            }
          }
        }
      ],
      "TransactionIndex": 0,
      "TransactionResult": "tesSUCCESS"
    },
    "tx_json": {
      "Account": "rhhh49pFH96roGyuC4E5P4CHaNjS1k8gzM",
      "Fee": "12",
      "Flags": 0,
      "LastLedgerSequence": 56865248,
      "OfferSequence": 5037708,
      "Sequence": 5037710,
      "SigningPubKey": "03B51A3EDF70E4098DA7FB053A01C5A6A0A163A30ED1445F14F87C7C3295FCB3BE",
      "TakerGets": "15000000000",
      "TakerPays": {
        "currency": "CNY",
        "issuer": "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y",
        "value": "20160.75"
      },
      "TransactionType": "OfferCreate",
      "TxnSignature": "3045022100A5023A0E64923616FCDB6D664F569644C7C9D1895772F986CD6B981B515B02A00220530C973E9A8395BC6FE2484948D2751F6B030FC7FB8575D1BFB406368AD554D9"
    },
    "ledger_index": 56865245,
    "ledger_hash": "793E56131D8D4ABFB27FA383BFC44F2978B046E023FF46C588D7E0C874C2472A",
    "close_time_iso": "2020-07-16T20:53:40Z",
    "hash": "C53ECF838647FA5A4C780377025FEC7999AB4182590510CA461444B207AB74A9",
    "status": "success"
  }
}
```
{% /tab %}

{% /tabs %}

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

{% tabs %}

{% tab label="API v2" %}

| フィールド         | 型                          | 説明 |
|:-----------------|:--------------------------|:--------------------------------|
| `close_time_iso` | 文字列                       | このトランザクションを含むレジャーが閉鎖された時刻（[ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)形式）。 |
| `hash`           | 文字列                       | トランザクションを識別する一意のハッシュ。 |
| `ledger_index`   | 数値 - [レジャーインデックス][] | トランザクションが見つかったレジャーバージョンのレジャーインデックス。これはリクエストで指定したものと同じです。 |
| `ledger_hash`    | 文字列 - [ハッシュ][]         | _（省略される場合があります）_ トランザクションが見つかったレジャーバージョンの識別用ハッシュ。これはリクエストで指定したものと同じです。 |
| `meta`           | オブジェクト                   | [トランザクションのメタデータ](../../../protocol/transactions/metadata.md)。トランザクションの正確な結果を詳しく示します。 |
| `tx_json`        | オブジェクト                   | [Transactionオブジェクト](../../../protocol/transactions/index.md)のJSON表現。 |

{% /tab %}

{% tab label="API v1" %}

| フィールド       | 型                          | 説明 |
|:---------------|:--------------------------|:--------------------------------|
| `ledger_index` | 数値 - [レジャーインデックス][] | トランザクションが見つかったレジャーバージョンのレジャーインデックス。これはリクエストで指定したものと同じです。 |
| `ledger_hash`  | 文字列 - [ハッシュ][]         | _（省略される場合があります）_ トランザクションが見つかったレジャーバージョンの識別用ハッシュ。これはリクエストで指定したものと同じです。 |
| `metadata`     | オブジェクト                   | [トランザクションのメタデータ](../../../protocol/transactions/metadata.md)。トランザクションの正確な結果を詳しく示します。 |
| `tx_json`      | オブジェクト                   | [Transactionオブジェクト](../../../protocol/transactions/index.md)のJSON表現。 |

{% /tab %}

{% /tabs %}

サーバがトランザクションを見つけられない理由として、次のようなものが考えられます。

* トランザクションが存在しない。
* トランザクションは存在するが、指定したレジャーバージョンには含まれていない。
* 指定したレジャーバージョンをサーバが利用できない。正しいバージョンを保有している別のサーバからは、異なるレスポンスが返される可能性があります。

## 考えられるエラー

* いずれかの[汎用エラータイプ][]。
* `fieldNotFoundTransaction` - リクエストで`tx_hash`フィールドが省略されています。
* `notYetImplemented` - リクエストでレジャーバージョンが指定されていません。
* `lgrNotFound` - `ledger_hash`または`ledger_index`で指定したレジャーが存在しないか、存在してはいるもののサーバが保有していません。
* `transactionNotFound` - リクエストで指定したトランザクションが、指定したレジャーで見つかりませんでした。（トランザクションが別のレジャーバージョンにあるか、まったく利用できない可能性があります。）

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
