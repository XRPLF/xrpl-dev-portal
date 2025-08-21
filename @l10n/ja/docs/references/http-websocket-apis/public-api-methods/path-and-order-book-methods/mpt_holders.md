---
seo:
    description: 指定された`MPTokenIssuanceID`とledgerシーケンスに対する所有者の情報を取得します。
labels:
  - アカウント
  - XRP
---

# mpt_holders

{% partial file="/@l10n/ja/docs/_snippets/mpts-disclaimer.md" /%}

指定された`MPTokenIssuanceID`とレジャーシーケンスに対して、`mpt_holders`はそのMPTの全所有者とその残高を返します。このメソッドは非常に大きなデータセットを返す可能性があるため、`marker`フィールドを使用したページングの実装が必要になると考えられます。このAPIはClioでのみ利用可能で、rippledでは利用できません。

## リクエストのフォーマット

*Websocket*

```json
{
  "command": "mpt_holders",
  "mpt_issuance_id": "00070C4495F14B0E44F78A264E41713C64B5F89242540EE255534400000000000000",
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
  "method": "mpt_holders",
  "params": [
    {
      "mpt_issuance_id": "00070C4495F14B0E44F78A264E41713C64B5F89242540EE255534400000000000000",
      "ledger_index": "validated"
    }
  ]
}
```


リクエストには以下のパラメータが含まれます。

| フィールド        | 型                    | 必須？    | 説明 |
|:------------------|:----------------------|:----------|-------------|
| `mpt_issuance_id` | 文字列                | はい      | クエリ対象の`MPTokenIssuance`。 |
| `ledger_index`    | 文字列または数値（正の整数） | いいえ | 使用する最大のレジャーインデックス、または自動的にレジャーを選択するためのショートカット文字列。ledger_indexまたはledger_hashのいずれかを指定する必要があります。 |
| `ledger_hash`     | 文字列                | いいえ    | 使用する32バイトのレジャーハッシュ。ledger_indexまたはledger_hashのいずれかを指定する必要があります。 |
| `marker`          | 文字列                | いいえ    | ページングで中断したクエリを続けるために使用します。 |
| `limit`           | 数値(正の整数)        | いいえ    | 返されるMPTの数の制限を指定します。 |

## レスポンスのフォーマット

```json
{
    "mpt_issuance_id": "000004C463C52827307480341125DA0577DEFC38405B0E3E",
    "limit":50,
    "ledger_index": 2,
    "mptokens": [{
        "account": "rEiNkzogdHEzUxPfsri5XSMqtXUixf2Yx",
        "flags": 0,
        "mpt_amount": "20",
        "mptoken_index": "36D91DEE5EFE4A93119A8B84C944A528F2B444329F3846E49FE921040DE17E65"
    },
    {
        "account": "rrnAZCqMahreZrKMcZU3t2DZ6yUndT4ubN",
        "flags": 0,
        "mpt_amount": "1",
        "mptoken_index": "D137F2E5A5767A06CB7A8F060ADE442A30CFF95028E1AF4B8767E3A56877205A"
    }],
    "validated": true
}
```

### レスポンスのフィールド

レスポンスは[標準フォーマット][]に従い、結果に以下のフィールドが含まれます。

| フィールド          | 型      | 説明                                     |
|:--------------------|:--------|:----------------------------------------|
| `mpt_issuance_id`   | 文字列  | クエリされた`MPTokenIssuance`              |
| `mptokens`          | 配列    | mptokenの配列。基礎となるMPTokenオブジェクトの全ての関連フィールドを含みます。 |
| `marker`            | 文字列  | ページング時に次のクエリを続けるために使用します。この結果の後にエントリがない場合は省略されます。 |
| `limit`             | 数値    | リクエストで指定された制限値 |
| `ledger_index`      | 数値    | 使用されたレジャーインデックス。 |

`mptoken`オブジェクトには以下のパラメータがあります。

| フィールド          | 型      | 説明 |
|:--------------------|:--------|:----------------------------------------|
| `account`           | 文字列  | `MPToken`を所有するホルダーのアカウントアドレス。 |
| `flags`             | 数値    | `MPToken`オブジェクトに割り当てられたフラグ。 |
| `mpt_amount`        | 文字列  | ホルダーの残高を10進数でエンコードした量。 |
| `mptoken_index`     | 文字列  | `MPToken`オブジェクトのキー。 |

##### 例

`tx`レスポンスの例:

```json
{
   "result": {
      "Account": "rBT9cUqK6UvpvZhPFNQ2qpUTin8rDokBeL",
      "AssetScale": 2,
      "Fee": "10",
      "Flags": 64,
      "Sequence": 303,
      "SigningPubKey": "ED39955DEA2D083C6CBE459951A0A84DB337925389ACA057645EE6E6BA99D4B2AE",
      "TransactionType": "MPTokenIssuanceCreate",
      "TxnSignature": "80D7B7409980BE9854F7217BB8E836C8A2A191E766F24B5EF2EA7609E1420AABE6A1FDB3038468679081A45563B4D0B49C08F4F70F64E41B578F288A208E4206",
      "ctid": "C000013100000000",
      "date": 760643692,
      "hash": "E563D7942E3E4A79AD73EC12E9E4C44B7C9950DF7BF5FDB75FAD0F5CE0554DB3",
      "inLedger": 305,
      "ledger_index": 305,
      "meta": {
         "AffectedNodes": [...],
         "TransactionIndex": 0,
         "TransactionResult": "tesSUCCESS",
         "mpt_issuance_id": "0000012F72A341F09A988CDAEA4FF5BE31F25B402C550ABE"
      },
      "status": "success",
      "validated": true
   }
}
```

##### オブジェクト

`mpt_issuance_id`フィールドはJSON MPTokenIssuanceオブジェクトで提供されます(バイナリでは利用できません)。次ののAPIが影響を受けます、`ledger_data`および`account_objects`。


##### 例

`account_objects`のレスポンス例

```json
{
   "result": {
      "account": "rBT9cUqK6UvpvZhPFNQ2qpUTin8rDokBeL",
      "account_objects": [
          {
            "AssetScale": 2,
            "Flags": 64,
            "Issuer": "rBT9cUqK6UvpvZhPFNQ2qpUTin8rDokBeL",
            "LedgerEntryType": "MPTokenIssuance",
            "OutstandingAmount": "100",
            "OwnerNode": "0",
            "PreviousTxnID": "BDC5ECA6B115C74BF4DA83E36325A2F55DF9E2C968A5CC15EB4D009D87D5C7CA",
            "PreviousTxnLgrSeq": 308,
            "Sequence": 303,
            "index": "75EC6F2939ED6C5798A5F369A0221BC4F6DDC50F8614ECF72E3B976351057A63",
            "mpt_issuance_id": "0000012F72A341F09A988CDAEA4FF5BE31F25B402C550ABE"
         }
      ],
      "ledger_current_index": 309,
      "status": "success",
      "validated": false
   }
}
```
