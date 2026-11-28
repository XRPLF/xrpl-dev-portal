---
seo:
    description: レジャーバージョンの生の内容を取得します。
labels:
    - ブロックチェーン
    - データ保持
---
# ledger_data
{% source-link path="src/xrpld/rpc/handlers/ledger/LedgerData.cpp" /%}

`ledger_data`メソッドは、指定したレジャーの内容を取得します。複数回の呼び出しを繰り返すことで、1つのレジャーバージョンの内容全体を取得できます。

## リクエストのフォーマット
リクエストのフォーマットの例:

{% raw-partial file="/@l10n/ja/docs/_snippets/no-cli-syntax.md" /%}

{% tabs %}

{% tab label="WebSocket" %}
```json
{
   "id": "example_ledger_data",
   "command": "ledger_data",
   "ledger_hash": "842B57C1CC0613299A686D3E9F310EC0422C84D3911E5056389AA7E5808A93C8",   
   "limit": 5,
   "api_version": 2
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "ledger_data",
    "params": [
        {
            "ledger_hash": "842B57C1CC0613299A686D3E9F310EC0422C84D3911E5056389AA7E5808A93C8",
            "limit": 5,
            "api_version": 2
        }
    ]
}
```
{% /tab %}

{% /tabs %}

{% try-it method="ledger_data" /%}

リクエストには以下のフィールドを指定できます。

| フィールド       | 型                     | 必須？ | 説明 |
|:---------------|:-----------------|:----------|----------------|
| `ledger_hash`  | [ハッシュ][]             | いいえ | 使用するレジャーバージョンを識別する16進文字列。 |
| `ledger_index` | [レジャーインデックス][]   | いいえ | 使用するレジャーの[レジャーインデックス][]、またはレジャーを自動的に選択するためのショートカット文字列。（[レジャーの指定][]を参照してください） |
| `binary`       | 真偽値                  | いいえ | `true`の場合、レジャーエントリをJSONではなく16進文字列として返します。デフォルトは`false`です。 |
| `limit`        | 数値                    | いいえ | 取得するレジャーエントリの数を制限します。サーバはこの数より少ないエントリを返すことがあります。2048（バイナリをリクエストする場合）または256（JSONをリクエストする場合）より大きい値は指定できません。この範囲外の正の値は、最も近い有効な値に置き換えられます。デフォルトは最大値です。 |
| `marker`       | [マーカー][Marker]       | いいえ | 以前のページネーションされたレスポンスの値。そのレスポンスが中断したところからデータの取得を再開します。 |
| `type`         | 文字列                  | いいえ | 結果を特定の種類のレジャーエントリに絞り込みます。このフィールドには、[レジャーエントリタイプ](../../../protocol/ledger-data/ledger-entry-types/index.md)の正規の名前（大文字と小文字は区別されません）または[短縮名](../../api-conventions/ledger-entry-short-names.md)を指定できます。省略した場合は、すべての種類のレジャーエントリを返します。 |

{% admonition type="warning" name="注意" %}
`ledger`リクエストパラメーターは廃止予定であり、今後予告なしに削除される可能性があります。代わりに`ledger_hash`または`ledger_index`を使用してください。
{% /admonition %}


## レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket (binary:false)" %}
```json
{
  "result": {
    "ledger_hash": "842B57C1CC0613299A686D3E9F310EC0422C84D3911E5056389AA7E5808A93C8",
    "ledger_index": 6885842,
    "validated": true,
    "state": [
      {
        "Account": "rKKzk9ghA2iuy3imqMXUHJqdRPMtNDGf4c",
        "Balance": "893730848",
        "Flags": 0,
        "LedgerEntryType": "AccountRoot",
        "OwnerCount": 0,
        "PreviousTxnID": "C204A65CF2542946289A3358C67D991B5E135FABFA89F271DBA7A150C08CA046",
        "PreviousTxnLgrSeq": 6487716,
        "Sequence": 1,
        "index": "00001A2969BE1FC85F1D7A55282FA2E6D95C71D2E4B9C0FDD3D9994F3C00FF8F"
      },
      {
        "Account": "rGryPmNWFognBgMtr9k4quqPbbEcCrhNmD",
        "BookDirectory": "71633D7DE1B6AEB32F87F1A73258B13FC8CC32942D53A66D4F038D7EA4C68000",
        "BookNode": "0",
        "Flags": 0,
        "LedgerEntryType": "Offer",
        "OwnerNode": "0",
        "PreviousTxnID": "555B93628BF3EC318892BB7C7CDCB6732FF53D12B6EEC4FAF60DD1AEE1C6101F",
        "PreviousTxnLgrSeq": 3504261,
        "Sequence": 3,
        "TakerGets": "1000000",
        "TakerPays": {
          "currency": "BTC",
          "issuer": "rnuF96W4SZoCJmbHYBFoJZpR8eCaxNvekK",
          "value": "1"
        },
        "index": "000037C6659BB98F8D09F2F4CFEB27DE8EFEAFE54DD9E1C13AECDF5794B0C0F5"
      },
      {
        "Account": "rUy8tW38MW9ma7kSjRgB2GHtTkQAFRyrN8",
        "BookDirectory": "DFA3B6DDAB58C7E8E5D944E736DA4B7046C30E4F460FD9DE4C1AA535D3D0C000",
        "BookNode": "0",
        "Flags": 131072,
        "LedgerEntryType": "Offer",
        "OwnerNode": "0",
        "PreviousTxnID": "A160BC41A45B6BB118DF23D77E4FF23C723431B917F50DCB41319ECC2821F34C",
        "PreviousTxnLgrSeq": 6764892,
        "Sequence": 10,
        "TakerGets": "780000000000",
        "TakerPays": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "5850"
        },
        "index": "0000A8791F78CC9B39200E12A9BDAACCF40A72A512FA815525CFC9BA772990F7"
      },
      {
        "Account": "rh3C81VfNDhhWPQWCU8ZGgknvdgNUvRtM9",
        "Balance": "13000000000",
        "Flags": 0,
        "LedgerEntryType": "AccountRoot",
        "OwnerCount": 0,
        "PreviousTxnID": "286498B513710CFEB2D723A554C7557983D1952DF4DEE342C40DCB43067C9A21",
        "PreviousTxnLgrSeq": 4092975,
        "Sequence": 1,
        "index": "0000B717320558E2DE1A3B9FDB24E9A695BF05D1A44E4A4683212BB1DD0FBA23"
      },
      {
        "Balance": {
          "currency": "BTC",
          "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
          "value": "0"
        },
        "Flags": 131072,
        "HighLimit": {
          "currency": "BTC",
          "issuer": "rKUK9omZqVEnraCipKNFb5q4tuNTeqEDZS",
          "value": "10"
        },
        "HighNode": "0",
        "LedgerEntryType": "RippleState",
        "LowLimit": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0"
        },
        "LowNode": "0",
        "PreviousTxnID": "87591A63051645F37B85D1FBA55EE69B1C96BFF16904F5C99F03FB93D42D0375",
        "PreviousTxnLgrSeq": 746872,
        "index": "000103996A3BAD918657F86E12A67D693E8FC8A814DA4B958A244B5F14D93E58"
      }
    ],
    "ledger": {
      "account_hash": "016661124C467D20034890D16E2519019E4C3911C3A1CBE96A39067AEA9B3C97",
      "close_flags": 0,
      "close_time": 454621560,
      "close_time_human": "2014-May-28 19:46:00.000000000 UTC",
      "close_time_resolution": 10,
      "close_time_iso": "2014-05-28T19:46:00Z",
      "ledger_hash": "842B57C1CC0613299A686D3E9F310EC0422C84D3911E5056389AA7E5808A93C8",
      "parent_close_time": 454621550,
      "parent_hash": "DEF64F075DD2DAD8C76292B43888DCC88214E61E7323C2B0364733AC71A4EFBC",
      "total_coins": "99999990103498274",
      "transaction_hash": "09190FE6C4176E8A445F171B0D52613CEEA772687A1F11E4D061B574CB2AD993",
      "ledger_index": 6885842,
      "closed": true
    },
    "marker": "000103996A3BAD918657F86E12A67D693E8FC8A814DA4B958A244B5F14D93E58"
  },
  "id": "example_ledger_data",
  "api_version": 2,
  "status": "success",
  "type": "response"
}
```
{% /tab %}

{% tab label="WebSocket (binary:true)" %}
```json
{
  "result": {
    "ledger_hash": "842B57C1CC0613299A686D3E9F310EC0422C84D3911E5056389AA7E5808A93C8",
    "ledger_index": 6885842,
    "validated": true,
    "state": [
      {
        "data": "11006122000000002400000001250062FEA42D0000000055C204A65CF2542946289A3358C67D991B5E135FABFA89F271DBA7A150C08CA0466240000000354540208114C909F42250CFE8F12A7A1A0DFBD3CBD20F32CD79",
        "index": "00001A2969BE1FC85F1D7A55282FA2E6D95C71D2E4B9C0FDD3D9994F3C00FF8F"
      },
      {
        "data": "11006F22000000002400000003250035788533000000000000000034000000000000000055555B93628BF3EC318892BB7C7CDCB6732FF53D12B6EEC4FAF60DD1AEE1C6101F501071633D7DE1B6AEB32F87F1A73258B13FC8CC32942D53A66D4F038D7EA4C6800064D4838D7EA4C68000000000000000000000000000425443000000000035DD7DF146893456296BF4061FBE68735D28F3286540000000000F42408114A4B8F5F7B644AEDC3447F9459C132EEB016A133B",
        "index": "000037C6659BB98F8D09F2F4CFEB27DE8EFEAFE54DD9E1C13AECDF5794B0C0F5"
      },
      {
        "data": "11006F2200020000240000000A250067395C33000000000000000034000000000000000055A160BC41A45B6BB118DF23D77E4FF23C723431B917F50DCB41319ECC2821F34C5010DFA3B6DDAB58C7E8E5D944E736DA4B7046C30E4F460FD9DE4C1AA535D3D0C00064D554C88B43EFA00000000000000000000000000055534400000000000A20B3C85F482532A9578DBB3950B85CA06594D165400000B59B9F780081148366FB9ACD2A0FD822E31112D2EB6F98C317C2C1",
        "index": "0000A8791F78CC9B39200E12A9BDAACCF40A72A512FA815525CFC9BA772990F7"
      },
      {
        "data": "1100612200000000240000000125003E742F2D0000000055286498B513710CFEB2D723A554C7557983D1952DF4DEE342C40DCB43067C9A21624000000306DC42008114225BAB89C4A4B94624BB069D6DB3C819F934991C",
        "index": "0000B717320558E2DE1A3B9FDB24E9A695BF05D1A44E4A4683212BB1DD0FBA23"
      },
      {
        "data": "110072220002000025000B65783700000000000000003800000000000000005587591A63051645F37B85D1FBA55EE69B1C96BFF16904F5C99F03FB93D42D03756280000000000000000000000000000000000000004254430000000000000000000000000000000000000000000000000166800000000000000000000000000000000000000042544300000000000A20B3C85F482532A9578DBB3950B85CA06594D167D4C38D7EA4C680000000000000000000000000004254430000000000C795FDF8A637BCAAEDAD1C434033506236C82A2D",
        "index": "000103996A3BAD918657F86E12A67D693E8FC8A814DA4B958A244B5F14D93E58"
      }
    ],
    "ledger": {
      "ledger_data": "006911D2016345760FA95E22DEF64F075DD2DAD8C76292B43888DCC88214E61E7323C2B0364733AC71A4EFBC09190FE6C4176E8A445F171B0D52613CEEA772687A1F11E4D061B574CB2AD993016661124C467D20034890D16E2519019E4C3911C3A1CBE96A39067AEA9B3C971B18F96E1B18F9780A00",
      "closed": true
    },
    "marker": "000103996A3BAD918657F86E12A67D693E8FC8A814DA4B958A244B5F14D93E58"
  },
  "id": "example_ledger_data",
  "api_version": 2,
  "status": "success",
  "type": "response"
}
```
{% /tab %}

{% tab label="JSON-RPC (binary:true)" %}
```json
200 OK

{
  "result": {
    "ledger_hash": "842B57C1CC0613299A686D3E9F310EC0422C84D3911E5056389AA7E5808A93C8",
    "ledger_index": 6885842,
    "validated": true,
    "state": [
      {
        "data": "11006122000000002400000001250062FEA42D0000000055C204A65CF2542946289A3358C67D991B5E135FABFA89F271DBA7A150C08CA0466240000000354540208114C909F42250CFE8F12A7A1A0DFBD3CBD20F32CD79",
        "index": "00001A2969BE1FC85F1D7A55282FA2E6D95C71D2E4B9C0FDD3D9994F3C00FF8F"
      },
      {
        "data": "11006F22000000002400000003250035788533000000000000000034000000000000000055555B93628BF3EC318892BB7C7CDCB6732FF53D12B6EEC4FAF60DD1AEE1C6101F501071633D7DE1B6AEB32F87F1A73258B13FC8CC32942D53A66D4F038D7EA4C6800064D4838D7EA4C68000000000000000000000000000425443000000000035DD7DF146893456296BF4061FBE68735D28F3286540000000000F42408114A4B8F5F7B644AEDC3447F9459C132EEB016A133B",
        "index": "000037C6659BB98F8D09F2F4CFEB27DE8EFEAFE54DD9E1C13AECDF5794B0C0F5"
      },
      {
        "data": "11006F2200020000240000000A250067395C33000000000000000034000000000000000055A160BC41A45B6BB118DF23D77E4FF23C723431B917F50DCB41319ECC2821F34C5010DFA3B6DDAB58C7E8E5D944E736DA4B7046C30E4F460FD9DE4C1AA535D3D0C00064D554C88B43EFA00000000000000000000000000055534400000000000A20B3C85F482532A9578DBB3950B85CA06594D165400000B59B9F780081148366FB9ACD2A0FD822E31112D2EB6F98C317C2C1",
        "index": "0000A8791F78CC9B39200E12A9BDAACCF40A72A512FA815525CFC9BA772990F7"
      },
      {
        "data": "1100612200000000240000000125003E742F2D0000000055286498B513710CFEB2D723A554C7557983D1952DF4DEE342C40DCB43067C9A21624000000306DC42008114225BAB89C4A4B94624BB069D6DB3C819F934991C",
        "index": "0000B717320558E2DE1A3B9FDB24E9A695BF05D1A44E4A4683212BB1DD0FBA23"
      },
      {
        "data": "110072220002000025000B65783700000000000000003800000000000000005587591A63051645F37B85D1FBA55EE69B1C96BFF16904F5C99F03FB93D42D03756280000000000000000000000000000000000000004254430000000000000000000000000000000000000000000000000166800000000000000000000000000000000000000042544300000000000A20B3C85F482532A9578DBB3950B85CA06594D167D4C38D7EA4C680000000000000000000000000004254430000000000C795FDF8A637BCAAEDAD1C434033506236C82A2D",
        "index": "000103996A3BAD918657F86E12A67D693E8FC8A814DA4B958A244B5F14D93E58"
      }
    ],
    "ledger": {
      "ledger_data": "006911D2016345760FA95E22DEF64F075DD2DAD8C76292B43888DCC88214E61E7323C2B0364733AC71A4EFBC09190FE6C4176E8A445F171B0D52613CEEA772687A1F11E4D061B574CB2AD993016661124C467D20034890D16E2519019E4C3911C3A1CBE96A39067AEA9B3C971B18F96E1B18F9780A00",
      "closed": true
    },
    "marker": "000103996A3BAD918657F86E12A67D693E8FC8A814DA4B958A244B5F14D93E58",
    "status": "success"
  }
}
```
{% /tab %}

{% /tabs %}

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| フィールド       | 型                                  | 説明 |
|:---------------|:------------------------------------|:----------------------|
| `ledger`       | オブジェクト                          | このレジャーバージョンの完全な[レジャーヘッダー](../../../protocol/ledger-data/ledger-header.md)のデータ。 |
| `ledger_index` | 符号なし整数 - [レジャーインデックス][] | このレジャーバージョンのレジャーインデックス。 |
| `ledger_hash`  | 文字列 - [ハッシュ][]                 | このレジャーバージョンを識別する一意のハッシュ。 |
| `state`        | 配列                                 | レジャーの状態ツリーのデータを含むJSONオブジェクトの配列。以下で定義します。 |
| `marker`       | [マーカー][Marker]                    | レスポンスがページネーションされていることを示す、サーバが定義した値。この値を次の呼び出しに渡すと、この呼び出しが終わったところから再開します。 |

リクエストで`type`フィールドを指定した場合、配列の最初の一連のオブジェクトがリクエストした種類に一致しないと、`state`配列は空になります。その場合は、このレスポンスの`marker`を使用してページネーションを行い、続きのデータを取得できます。

`state`配列の各オブジェクトのフォーマットは、リクエストで`binary`をtrueに設定したかどうかによって異なります。各`state`オブジェクトには、以下のフィールドが含まれる場合があります。

| フィールド            | 型       | 説明 |
|:--------------------|:----------|:-------------------------------------------|
| `data`              | 文字列    | _（`"binary":true`の場合にのみ含まれます）_ リクエストされたデータの16進表現。 |
| `LedgerEntryType`   | 文字列    | _（`"binary":false`の場合にのみ含まれます）_ このオブジェクトが表すレジャーオブジェクトの種類を示す文字列。すべての種類の一覧については、[レジャーエントリのタイプ](../../../protocol/ledger-data/ledger-entry-types/index.md)を参照してください。 |
| （追加のフィールド） | （各種）   | _（`"binary":false`の場合にのみ含まれます）_ このオブジェクトを記述する追加のフィールド。どの[レジャーエントリのタイプ](../../../protocol/ledger-data/ledger-entry-types/index.md)であるかによって異なります。 |
| `index`             | 文字列    | このレジャーエントリの一意の識別子（16進数）。 |

## 考えられるエラー

* いずれかの[汎用エラータイプ][]。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `lgrNotFound` - `ledger_hash`または`ledger_index`で指定したレジャーが存在しないか、存在してはいるもののサーバが保有していません。

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
