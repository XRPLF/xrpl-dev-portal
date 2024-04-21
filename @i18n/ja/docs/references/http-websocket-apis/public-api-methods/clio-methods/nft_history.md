---
html: nft_history.html
parent: clio-methods.html
seo:
    description: Clioサーバの`nft_history`API を使用して、指定した NFT の所有権と移動の履歴を取得します。
labels:
  - 非代替性トークン, NFT
---
# nft_history

[[ソース]](https://github.com/XRPLF/clio/blob/4a5cb962b6971872d150777881801ce27ae9ed1a/src/rpc/handlers/NFTHistory.cpp "ソース")

`nft_history`コマンドはクエリ対象の[NFT](../../../../concepts/tokens/nfts/index.md)の過去のトランザクションメタデータをClioサーバに問い合わせます。{% badge href="https://github.com/XRPLF/clio/releases/tag/1.1.0" %}新規: Clio v1.1.0{% /badge %}

**注記** `nft_history`はNFTに関連する成功したトランザクションのみを返します。

## リクエストのフォーマット
リクエストのフォーマットの例：

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 1,
  "command": "nft_history",
  "nft_id": "00080000B4F4AFC5FBCBD76873F18006173D2193467D3EE70000099B00000000"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "nft_history",
    "params": [
      {
          "nft_id": "00080000B4F4AFC5FBCBD76873F18006173D2193467D3EE70000099B00000000"
      }
    ]
}
```
{% /tab %}

{% /tabs %}

[試してみる >](/resources/dev-tools/websocket-api-tool#nft_history)

リクエストには以下のパラメーターが含まれます。

| `Field`            | 型                     | 説明                            |
|:-------------------|:-----------------------|:-------------------------------|
| `nft_id`           | 文字列                  | 非代替性トークン(NFT)の一意の識別子。 |
| `ledger_index_min` | 整数                    | _(省略可)_ NFTを含む最も古いレジャーを指定します。値`-1`を指定すると、検証済みの最も古いレジャーのバージョンを使用するようにサーバに指示します。  |
| `ledger_index_max` | 整数                    | _(省略可)_ NFTを含める最新のレジャーを指定します。値`-1`を指定すると、利用可能な最新の有効なレジャーのバージョンを使用するようにサーバに指示します。 |
| `ledger_hash`      | 文字列                  | _(省略可)_ 使用するレジャーのバージョンを示す20バイトの16進文字列。[レジャーの指定][]をご覧ください）。 |
| `ledger_index`     | 文字列 または 符号なし整数 | _(省略可)_ 使用するレジャーの[レジャーインデックス][]あるいは、レジャーを自動的に選択するためのショートカット文字列。 `ledger_index`に`closed`や `current`を指定しないでください。指定した場合、P2Pの`rippled`サーバにリクエストが転送されますが、`nft_history`APIは`rippled`では利用できません。[レジャーの指定][]をご覧ください）。 |
| `binary`           | 真偽値                  | _(省略可)_ デフォルトは`false`。`true`に設定すると、トランザクションをJSONではなく16進数の文字列で返します。 |
| `forward`          | 真偽値                  | _(省略可)_ デフォルトは`false`。`true`に設定すると、最も古いレジャーからインデックスを付けて返します。そうでない場合は、新しいレジャーからインデックスが付けられます。(結果の各ページは内部的には順序付けされていないかもしれませんが、ページ全体としては順序付けされています)。 |
| `limit`            | UInt32                 | _(省略可)_ 取得するNFTの数を制限します。サーバはこの値を守る必要はありません。 |
| `marker`           | マーカー                | 以前のページ分割されたレスポンスの値。そのレスポンスが終了したところからデータの取得を再開します。サーバで使用可能なレジャーの範囲が変更された場合、この値は変化する可能性があります。"検証済み"レジャーを照会している場合、ページング中に新しいNFTが作成される可能性があります。 |

**注記** レジャーのバージョンを指定しない場合、Clioは検証済みの最新のレジャーを使用します。

## レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 0,
  "type": "response",
  "result": {
    "ledger_index_min": 21377274,
    "ledger_index_max": 27876163,
    "transactions": [
      {
        "meta": {
          "AffectedNodes": [
            {
              "CreatedNode": {
                "LedgerEntryType": "NFTokenPage",
                "LedgerIndex": "97707A94B298B50334C39FB46E245D4744C0F5B5FFFFFFFFFFFFFFFFFFFFFFFF",
                "NewFields": {
                  "NFTokens": [
                    {
                      "NFToken": {
                        "NFTokenID": "0008271097707A94B298B50334C39FB46E245D4744C0F5B50000099B00000000",
                        "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469"
                      }
                    }
                  ]
                }
              }
            },
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Account": "rNoj836fhDm1eXaHHefPKs7iDb4gwzS7nc",
                  "Balance": "999999988",
                  "Flags": 0,
                  "MintedNFTokens": 1,
                  "OwnerCount": 1,
                  "Sequence": 27876155
                },
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "AC0A2AD29B67B5E6DA1C5DE696440F59BCD8DEA0A4CF7AFD683D1489AAB1ED24",
                "PreviousFields": {
                  "Balance": "1000000000",
                  "OwnerCount": 0,
                  "Sequence": 27876154
                },
                "PreviousTxnID": "B483F0F7100658380E42BCF1B15AD59B71C4082635AD53B78D08A5198BBB6939",
                "PreviousTxnLgrSeq": 27876154
              }
            }
          ],
          "TransactionIndex": 0,
          "TransactionResult": "tesSUCCESS"
        },
        "tx": {
          "Account": "rNoj836fhDm1eXaHHefPKs7iDb4gwzS7nc",
          "Fee": "12",
          "Flags": 8,
          "LastLedgerSequence": 27876176,
          "NFTokenTaxon": 0,
          "Sequence": 27876154,
          "SigningPubKey": "EDDC20C6791F9FB13AFDCE2C717BE8779DD451BB556243F1FDBAA3CD159D68A9F6",
          "TransactionType": "NFTokenMint",
          "TransferFee": 10000,
          "TxnSignature": "EF657AB47E86FDC112BA054D90587DFE64A61604D9EDABAA7B01B61B56433E3C2AC5BF5AD2E8F5D2A9EAC22778F289094AC383A3F172B2304157A533E0C79802",
          "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469",
          "hash": "E0774E1B8628E397C6E88F67D4424E55E4C81324607B19318255310A6FBAA4A2",
          "ledger_index": 27876158,
          "date": 735167200
        },
        "validated": true
      }
    ],
    "nft_id": "0008271097707A94B298B50334C39FB46E245D4744C0F5B50000099B00000000",
    "validated": true
  },
  "warnings": [
    {
      "id": 2001,
      "message": "This is a clio server. clio only serves validated data. If you want to talk to rippled, include 'ledger_index':'current' in your request"
    }
  ]
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "result": {
    "ledger_index_min": 21377274,
    "ledger_index_max": 27876163,
    "transactions": [
      {
        "meta": {
          "AffectedNodes": [
            {
              "CreatedNode": {
                "LedgerEntryType": "NFTokenPage",
                "LedgerIndex": "97707A94B298B50334C39FB46E245D4744C0F5B5FFFFFFFFFFFFFFFFFFFFFFFF",
                "NewFields": {
                  "NFTokens": [
                    {
                      "NFToken": {
                        "NFTokenID": "0008271097707A94B298B50334C39FB46E245D4744C0F5B50000099B00000000",
                        "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469"
                      }
                    }
                  ]
                }
              }
            },
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Account": "rNoj836fhDm1eXaHHefPKs7iDb4gwzS7nc",
                  "Balance": "999999988",
                  "Flags": 0,
                  "MintedNFTokens": 1,
                  "OwnerCount": 1,
                  "Sequence": 27876155
                },
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "AC0A2AD29B67B5E6DA1C5DE696440F59BCD8DEA0A4CF7AFD683D1489AAB1ED24",
                "PreviousFields": {
                  "Balance": "1000000000",
                  "OwnerCount": 0,
                  "Sequence": 27876154
                },
                "PreviousTxnID": "B483F0F7100658380E42BCF1B15AD59B71C4082635AD53B78D08A5198BBB6939",
                "PreviousTxnLgrSeq": 27876154
              }
            }
          ],
          "TransactionIndex": 0,
          "TransactionResult": "tesSUCCESS"
        },
        "tx": {
          "Account": "rNoj836fhDm1eXaHHefPKs7iDb4gwzS7nc",
          "Fee": "12",
          "Flags": 8,
          "LastLedgerSequence": 27876176,
          "NFTokenTaxon": 0,
          "Sequence": 27876154,
          "SigningPubKey": "EDDC20C6791F9FB13AFDCE2C717BE8779DD451BB556243F1FDBAA3CD159D68A9F6",
          "TransactionType": "NFTokenMint",
          "TransferFee": 10000,
          "TxnSignature": "EF657AB47E86FDC112BA054D90587DFE64A61604D9EDABAA7B01B61B56433E3C2AC5BF5AD2E8F5D2A9EAC22778F289094AC383A3F172B2304157A533E0C79802",
          "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469",
          "hash": "E0774E1B8628E397C6E88F67D4424E55E4C81324607B19318255310A6FBAA4A2",
          "ledger_index": 27876158,
          "date": 735167200
        },
        "validated": true
      }
    ],
    "nft_id": "0008271097707A94B298B50334C39FB46E245D4744C0F5B50000099B00000000",
    "validated": true
  },
  "warnings": [
    {
      "id": 2001,
      "message": "This is a clio server. clio only serves validated data. If you want to talk to rippled, include 'ledger_index':'current' in your request"
    }
  ]
}
```
{% /tab %}

{% /tabs %}

`binary`パラメータを _true_ に設定すると、16進数文字列を使用したコンパクトなレスポンスを受け取ります。人間が読めるものではありませんが、より簡潔です。

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 0,
  "type": "response",
  "result": {
    "ledger_index_min": 21377274,
    "ledger_index_max": 27876275,
    "transactions": [
      {
        "meta": "201C00000000F8E31100505697707A94B298B50334C39FB46E245D4744C0F5B5FFFFFFFFFFFFFFFFFFFFFFFFE8FAEC5A0008271097707A94B298B50334C39FB46E245D4744C0F5B50000099B000000007542697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469E1F1E1E1E51100612501A95B3A55B483F0F7100658380E42BCF1B15AD59B71C4082635AD53B78D08A5198BBB693956AC0A2AD29B67B5E6DA1C5DE696440F59BCD8DEA0A4CF7AFD683D1489AAB1ED24E62401A95B3A2D0000000062400000003B9ACA00E1E722000000002401A95B3B2D00000001202B0000000162400000003B9AC9F4811497707A94B298B50334C39FB46E245D4744C0F5B5E1E1F1031000",
        "tx_blob": "12001914271022000000082401A95B3A201B01A95B50202A0000000068400000000000000C7321EDDC20C6791F9FB13AFDCE2C717BE8779DD451BB556243F1FDBAA3CD159D68A9F67440EF657AB47E86FDC112BA054D90587DFE64A61604D9EDABAA7B01B61B56433E3C2AC5BF5AD2E8F5D2A9EAC22778F289094AC383A3F172B2304157A533E0C798027542697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469811497707A94B298B50334C39FB46E245D4744C0F5B5",
        "ledger_index": 27876158,
        "date": 735167200,
        "validated": true
      }
    ],
    "nft_id": "0008271097707A94B298B50334C39FB46E245D4744C0F5B50000099B00000000",
    "validated": true
  },
  "warnings": [
    {
      "id": 2001,
      "message": "This is a clio server. clio only serves validated data. If you want to talk to rippled, include 'ledger_index':'current' in your request"
    }
  ]
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "result": {
    "ledger_index_min": 21377274,
    "ledger_index_max": 27876275,
    "transactions": [
      {
        "meta": "201C00000000F8E31100505697707A94B298B50334C39FB46E245D4744C0F5B5FFFFFFFFFFFFFFFFFFFFFFFFE8FAEC5A0008271097707A94B298B50334C39FB46E245D4744C0F5B50000099B000000007542697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469E1F1E1E1E51100612501A95B3A55B483F0F7100658380E42BCF1B15AD59B71C4082635AD53B78D08A5198BBB693956AC0A2AD29B67B5E6DA1C5DE696440F59BCD8DEA0A4CF7AFD683D1489AAB1ED24E62401A95B3A2D0000000062400000003B9ACA00E1E722000000002401A95B3B2D00000001202B0000000162400000003B9AC9F4811497707A94B298B50334C39FB46E245D4744C0F5B5E1E1F1031000",
        "tx_blob": "12001914271022000000082401A95B3A201B01A95B50202A0000000068400000000000000C7321EDDC20C6791F9FB13AFDCE2C717BE8779DD451BB556243F1FDBAA3CD159D68A9F67440EF657AB47E86FDC112BA054D90587DFE64A61604D9EDABAA7B01B61B56433E3C2AC5BF5AD2E8F5D2A9EAC22778F289094AC383A3F172B2304157A533E0C798027542697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469811497707A94B298B50334C39FB46E245D4744C0F5B5",
        "ledger_index": 27876158,
        "date": 735167200,
        "validated": true
      }
    ],
    "nft_id": "0008271097707A94B298B50334C39FB46E245D4744C0F5B50000099B00000000",
    "validated": true
  },
  "warnings": [
    {
      "id": 2001,
      "message": "This is a clio server. clio only serves validated data. If you want to talk to rippled, include 'ledger_index':'current' in your request"
    }
  ]
}

```
{% /tab %}

{% /tabs %}

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| `Field`            | 型                          | 説明                        |
|:-------------------|:----------------------------|:---------------------------|
| `nft_id`           | 文字列                       | 非代替性トークン(NFT)の一意の識別子。 |
| `ledger_index_min` | 整数 - [レジャーインデックス][] | 実際にトランザクションを検索した最も古いレジャーのレジャーインデックス。 |
| `ledger_index_max` | 整数 - [レジャーインデックス][] | 実際にトランザクションを検索した最新のレジャーのレジャーインデックス。 |
| `limit`            | 整数                         | リクエストで使われる`limit`の値。(これはサーバによって強制される実際の値とは異なるかもしれません)。 |
| `marker`           | [マーカー][]                  | レスポンスがページ分割されていることを示す、サーバ定義の値。この値を次の呼び出しに渡すと、この呼び出しが中断したところから再開します。 |
| `transactions`     | 配列                         | 以下に説明するように、リクエストの条件に一致するトランザクションの配列。 |
| `validated`        | 真偽値                       | レスポンスに含まれ、`true`に設定されている場合、このレスポンスの情報は検証済みのレジャーのバージョンに基づきます。`false`の場合、情報は変更される可能性があります。 |

**注記:** 例えば、指定したバージョンが手元にない場合、サーバはリクエストで指定した値とは異なる`ledger_index_min`と`ledger_index_max`を返すことがあります。

各トランザクションオブジェクトは、JSONまたは16進文字列(`"binary":true`)のどちらの形式でリクエストされたかに応じて、以下のフィールドを含みます。

| `Field`        | 型                                   | 説明              |
|:---------------|:-------------------------------------|:-------------------------|
| `ledger_index` | 整数                                  | このトランザクションを含むレジャーバージョンの[レジャーインデックス][]。 |
| `meta`         | オブジェクト(JSON) または 文字列(バイナリ) | `binary`が`true`の場合、トランザクションメタデータの16文字列が格納されます。`false`の場合は、トランザクションメタデータがJSON 形式で格納されます。 |
| `tx`           | オブジェクト                           | (JSONのみ) トランザクションを定義するJSONオブジェクト |
| `tx_blob`      | 文字列                                | (Binaryのみ) トランザクションを表す一意のハッシュ化された文字列。 |
| `validated`    | 真偽値                                | トランザクションが検証済みレジャーに含まれているかどうか。まだ有効なレジャーに含まれていないトランザクションは、変更される可能性があります。 |

`tx`オブジェクトで返されるフィールドの定義については、[トランザクションメタデータ](../../../protocol/transactions/metadata.md)をご覧ください。

## 考えられるエラー

* いずれかの[汎用エラータイプ][]。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `actMalformed` - リクエストの`account`フィールドに指定した[アドレス][]が、正しいフォーマットではありません。
* `lgrIdxMalformed` - `ledger_index_min`または`ledger_index_max`で指定されたレジャーが存在しないか、存在してもサーバに保存されていません。
* `lgrIdxsInvalid` - リクエストが`ledger_index_min`よりも前の`ledger_index_max`を指定しているか、サーバが[ネットワークと同期していない](../../../../infrastructure/troubleshooting/server-doesnt-sync.md)ために有効なレジャー範囲を持っていません。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
