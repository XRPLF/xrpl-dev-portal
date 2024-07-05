---
html: transaction-metadata.html
parent: transaction-formats.html
seo:
    description: トランザクションのメタデータは、トランザクションが成功したかどうかに関係なく、トランザクションの結果を詳細に記述します。
labels:
  - ブロックチェーン
---
# トランザクションのメタデータ

トランザクションのメタデータは、トランザクションの処理後にトランザクションに追加されるひとまとまりのデータです。レジャーに記録されるトランザクションは、トランザクションが成功するかどうかにかかわらず、メタデータを保持しています。トランザクションのメタデータには、トランザクションの結果の詳細が含まれます。

**警告:** トランザクションのメタデータに示された変更が最終的なものになるのは、トランザクションが検証済みバージョンのレジャーに記録された場合のみです。

以下に、トランザクションのメタデータに含まれる可能性があるフィールドをいくつか示します。

{% partial file="/@i18n/ja/docs/_snippets/tx-metadata-field-table.md" /%} 


## メタデータの例

次のJSONオブジェクトは、[XRPからUSDへの交換](https://livenet.xrpl.org/transactions/424661CF1FD3675D11EC910CF161979553B6D135F9BD03E6F8D4611D88D27581)のメタデータを示しています。

```json
"meta": {
  "AffectedNodes": [
    {
      "ModifiedNode": {
        "FinalFields": {
          "Account": "rBTwLga3i2gz3doX6Gva3MgEV8ZCD8jjah",
          "Balance": "27724423128",
          "Flags": 0,
          "OwnerCount": 14,
          "Sequence": 129693478
        },
        "LedgerEntryType": "AccountRoot",
        "LedgerIndex": "1ED8DDFD80F275CB1CE7F18BB9D906655DE8029805D8B95FB9020B30425821EB",
        "PreviousFields": {
          "Balance": "27719423228",
          "Sequence": 129693477
        },
        "PreviousTxnID": "3110F983CDC090750B45C9BFB74B8CE629CA80F57C35612402B2760153822BA5",
        "PreviousTxnLgrSeq": 86724072
      }
    },
    {
      "DeletedNode": {
        "FinalFields": {
          "Account": "rPx6Rbh8fStXeP3LwECBisownN2ZyMyzYS",
          "BookDirectory": "DFA3B6DDAB58C7E8E5D944E736DA4B7046C30E4F460FD9DE4E1566CBCC208000",
          "BookNode": "0",
          "Flags": 0,
          "OwnerNode": "0",
          "PreviousTxnID": "DCB061EC44BBF73BBC20CE0432E9D8D7C4B8B28ABA8AE5A5BA687476E7A796EF",
          "PreviousTxnLgrSeq": 86724050,
          "Sequence": 86586865,
          "TakerGets": "0",
          "TakerPays": {
            "currency": "USD",
            "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
            "value": "0"
          }
        },
        "LedgerEntryType": "Offer",
        "LedgerIndex": "348AF66EBD872FBF2BD23085D3FB4A200E15509451475027C4A5EE8D8B77C623",
        "PreviousFields": {
          "TakerGets": "5000000",
          "TakerPays": {
            "currency": "USD",
            "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
            "value": "3.012"
          }
        }
      }
    },
    {
      "ModifiedNode": {
        "FinalFields": {
          "Flags": 0,
          "Owner": "rPx6Rbh8fStXeP3LwECBisownN2ZyMyzYS",
          "RootIndex": "4A68E363398C8DA470CF85237CA4A044476CD38BA7D5C9B8E8F19417A13B01C1"
        },
        "LedgerEntryType": "DirectoryNode",
        "LedgerIndex": "4A68E363398C8DA470CF85237CA4A044476CD38BA7D5C9B8E8F19417A13B01C1"
      }
    },
    {
     "ModifiedNode": {
        "FinalFields": {
          "Balance": {
            "currency": "USD",
            "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
            "value": "-3.0120000001701"
          },
          "Flags": 2228224,
          "HighLimit": {
            "currency": "USD",
            "issuer": "rPx6Rbh8fStXeP3LwECBisownN2ZyMyzYS",
            "value": "0"
          },
          "HighNode": "0",
          "LowLimit": {
            "currency": "USD",
            "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
            "value": "0"
          },
          "LowNode": "bd5"
        },
        "LedgerEntryType": "RippleState",
        "LedgerIndex": "7345788A2C9121EB8168D2755950887CED3887CCDBC882015BC070A61C2AD1DA",
        "PreviousFields": {
          "Balance": {
            "currency": "USD",
            "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
            "value": "-0.0000000001701"
          }
        },
        "PreviousTxnID": "B4726FC087FAB3DB3578A34095B96F9055075A86A16CE741B406D91202685998",
        "PreviousTxnLgrSeq": 86722015
      }
    },
    {
      "ModifiedNode": {
        "FinalFields": {
          "Balance": {
            "currency": "USD",
            "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
            "value": "-52157.74818800332"
          },
          "Flags": 2228224,
          "HighLimit": {
            "currency": "USD",
            "issuer": "rBTwLga3i2gz3doX6Gva3MgEV8ZCD8jjah",
            "value": "1000000000"
          },
          "HighNode": "0",
          "LowLimit": {
            "currency": "USD",
            "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
            "value": "0"
          },
          "LowNode": "b29"
        },
        "LedgerEntryType": "RippleState",
        "LedgerIndex": "8250CE37F6495903C1F7D16E072E8823ECE06FA73F011A0F8D79D5626BF581BB",
        "PreviousFields": {
          "Balance": {
            "currency": "USD",
            "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
            "value": "-52160.76470600332"
          }
        },
        "PreviousTxnID": "B4726FC087FAB3DB3578A34095B96F9055075A86A16CE741B406D91202685998",
        "PreviousTxnLgrSeq": 86722015
      }
    },
    {
      "ModifiedNode": {
        "FinalFields": {
          "Account": "rPx6Rbh8fStXeP3LwECBisownN2ZyMyzYS",
          "Balance": "52479871",
          "Flags": 0,
          "OwnerCount": 2,
         "Sequence": 86586866
        },
        "LedgerEntryType": "AccountRoot",
        "LedgerIndex": "9D398F1DEA77448C78196D6B01289A13D32DFCB4F9023A2A06338F893FA85521",
        "PreviousFields": {
          "Balance": "57479871",
          "OwnerCount": 3
        },
        "PreviousTxnID": "DCB061EC44BBF73BBC20CE0432E9D8D7C4B8B28ABA8AE5A5BA687476E7A796EF",
        "PreviousTxnLgrSeq": 86724050
      }
    },
    {
      "DeletedNode": {
        "FinalFields": {
          "ExchangeRate": "4e1566cbcc208000",
          "Flags": 0,
          "RootIndex": "DFA3B6DDAB58C7E8E5D944E736DA4B7046C30E4F460FD9DE4E1566CBCC208000",
          "TakerGetsCurrency": "0000000000000000000000000000000000000000",
          "TakerGetsIssuer": "0000000000000000000000000000000000000000",
          "TakerPaysCurrency": "0000000000000000000000005553440000000000",
          "TakerPaysIssuer": "0A20B3C85F482532A9578DBB3950B85CA06594D1"
        },
        "LedgerEntryType": "DirectoryNode",
        "LedgerIndex": "DFA3B6DDAB58C7E8E5D944E736DA4B7046C30E4F460FD9DE4E1566CBCC208000"
      }
    }
  ],
  "TransactionIndex": 5,
  "TransactionResult": "tesSUCCESS"
}
```


## AffectedNodes

`AffectedNodes`配列には、このトランザクションが何らかの変更を加えた[レジャーエントリ](../ledger-data/ledger-entry-types/index.md)の完全なリストが格納されます。この配列の各項目は、何が起こったかを示すトップレベルのフィールドを1つ持つオブジェクトです。

- `CreatedNode`: トランザクションが新しいレジャーエントリを作成したことを示します。
- `DeletedNode`: トランザクションが新しいレジャーエントリを削除したことを示します。
- `ModifiedNode`: トランザクションが既存のレジャーエントリを更新したことを示します。

これらの各フィールドの値は、レジャーエントリに行われた変更を記述するJSONオブジェクトです。


### CreatedNodeのフィールド

`CreatedNode`オブジェクトは次のフィールドを含みます。

| フィールド          | 値                  | 説明                                  |
|:------------------|:--------------------|:-------------------------------------|
| `LedgerEntryType` | 文字列               | 作成された[レジャーエントリの種類](../ledger-data/ledger-entry-types/index.md)。 |
| `LedgerIndex`     | 文字列 - [ハッシュ][] | レジャーの[状態ツリー](../../../concepts/ledgers/index.md)内のこの[レジャーエントリのID](../ledger-data/common-fields.md)。**注意:** 名前が非常に似ていますがこれは[レジャーインデックス](../data-types/basic-data-types.md#レジャーインデックス)とは**異なります**。 |
| `NewFields`       | オブジェクト          | 新しく作成されたレジャーエントリの内容を示すフィールド。どのフィールドが存在するかは、作成されたレジャーエントリの種類によって異なります。 |


### DeletedNodeのフィールド

`DeletedNode`オブジェクトは次のフィールドを含みます。

| フィールド          | 値                  | 説明                                  |
|:------------------|:--------------------|:-------------------------------------|
| `LedgerEntryType` | 文字列               | 削除された[レジャーエントリの種類](../ledger-data/ledger-entry-types/index.md)。 |
| `LedgerIndex`     | 文字列 - [ハッシュ][] | レジャーの[状態ツリー](../../../concepts/ledgers/index.md)内のこの[レジャーエントリのID](../ledger-data/common-fields.md)。**注意:** 名前が非常に似ていますがこれは[レジャーインデックス](../data-types/basic-data-types.md#レジャーインデックス)とは**異なります** |
| `FinalFields`     | オブジェクト          | 削除されたレジャーエントリの最後の内容を示すフィールド。どのフィールドが存在するかは、削除されたレジャーエントリの種類によって異なります。 |


### ModifiedNodeのフィールド

`ModifiedNode`オブジェクトは次のフィールドを含みます。

| フィールド            | 値                         | 説明                        |
|:--------------------|:---------------------------|:---------------------------|
| `LedgerEntryType`   | 文字列                      | 更新された[レジャーエントリの種類](../ledger-data/ledger-entry-types/index.md)。 |
| `LedgerIndex`       | 文字列 - [ハッシュ][]         | レジャーの[状態ツリー](../../../concepts/ledgers/index.md)内のこの[レジャーエントリのID](../ledger-data/common-fields.md)。**注意:** 名前が非常に似ていますがこれは[レジャーインデックス](../data-types/basic-data-types.md#レジャーインデックス)とは**異なります**。 |
| `FinalFields`       | オブジェクト                  | このトランザクションからの変更を適用した後のレジャーエントリの内容を示すフィールド。どのフィールドが存在するかは、作成されたレジャーエントリの種類によって異なります。ほとんどのタイプのレジャーエントリには`PreviousTxnID`フィールドと`PreviousTxnLgrSeq`フィールドがありますが、これは省略されます。 |
| `PreviousFields`    | オブジェクト                  | このトランザクションの結果として変更されたオブジェクトのすべてのフィールドの以前の値。トランザクションがオブジェクトにフィールドを追加しただけの場合、このフィールドは空のオブジェクトです。 |
| `PreviousTxnID`     | 文字列 - [ハッシュ][]         | _(省略可能)_ このレジャーエントリを変更する前のトランザクションの[識別用ハッシュ][]。`PreviousTxnID`フィールドを持たないレジャーエントリの種類では省略されます。 |
| `PreviousTxnLgrSeq` | 数値 - [レジャーインデックス][] | _(省略可能)_ このレジャーエントリを変更する前のトランザクションを含むレジャーバージョンの[レジャーインデックス][]。`PreviousTxnLgrSeq`フィールドを持たないレジャーエントリの種類では省略されます。 |

**注記:** 変更されたレジャーエントリに`PreviousTxnID`フィールドと`PreviousTxnLgrSeq`フィールドがある場合、トランザクションは常にトランザクションの識別ハッシュとトランザクションを含むレジャーバージョンのインデックスでそれらを更新しますが、これらのフィールドの新しい値は`ModifiedNode`オブジェクトの`FinalFields`にはリストされず、以前の値はネストされた`PreviousFields`オブジェクトではなく`ModifiedNode`オブジェクトのトップレベルにリストされます。


## NFTのフィールド

NFTを含むトランザクション（`tx`と`account_tx`）はメタデータに以下のフィールドを含むことができます。これらの値はリクエスト時にサーバによって追加され、ハッシュ化されたバイナリメタデータには格納されません。

| フィールド            | 値                        | 説明                        |
|:--------------------|:--------------------------|:---------------------------|
| `nftoken_id`        | 文字列                     | トランザクションの結果、レジャー上で変更された`NFToken`の`NFTokenID`を示します。トランザクションが`NFTokenMint`または`NFTokenAcceptOffer`の場合のみ表示されます。[NFTokenID](../data-types/nftoken.md#nftokenid)をご覧ください。 |
| `nftoken_ids`       | 配列                       | トランザクションの結果、レジャー上で変更された`NFToken`のすべての`NFTokenID`を表示します。トランザクションが `NFTokenCancelOffer`の場合のみ表示されます。 |
| `offer_id`          | 文字列                      | `NFTokenCreateOffer`トランザクションからのレスポンスに、新しい`NFTokenOffer`の`OfferID`を表示します。 |

## delivered_amount

[Paymentトランザクション][]によって`Destination`に実際送金された金額を表します。トランザクションが成功すると、**[Partial Payments](../../../concepts/payment-types/partial-payments.md)であった場合を除いて、** 宛先は当該の金額を受取ります（Partial Paymentsの場合、`Amount`を上限とする正の金額が受取られます）。`Amount`フィールドを信頼するかどうかを選択するのではなく、メタデータの`delivered_amount`フィールドを使用して、宛先に実際に到達する金額を確認してください。

トランザクションのメタデータの`delivered_amount`フィールドは、成功したすべてのPaymentトランザクションが保持しており、フォーマットは通常の通貨額と同様です。ただし、送金額は、以下の両方の条件に該当するトランザクションについては使用できません。

* Partial Paymentsである
* 2014-01-20よりも前の検証済みレジャーに含まれている

両方の条件に該当する場合、`delivered_amount`には、実際の金額ではなく文字列値`unavailable`が記述されます。この場合、トランザクションのメタデータにあるAffectedNodesを読み取ることが、実際に送金された金額を割り出せる唯一の手段になります。

**注記:** `delivered_amount`フィールドはリクエストに対してオンデマンドで生成され、トランザクションメタデータのバイナリフォーマットには含まれず、トランザクションメタデータの[ハッシュ](../data-types/basic-data-types.md#ハッシュ)を計算する際にも使用されません。一方、`DeliveredAmount`フィールドは2014-01-20以降のpartial paymentトランザクションのバイナリフォーマットに _含まれます_ 。

関連項目: [Partial Payments](../../../concepts/payment-types/partial-payments.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
