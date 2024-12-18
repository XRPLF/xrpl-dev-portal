---
blurb: Get the holders for a given `MPTokenIssuanceID` and ledger sequence.
labels:
  - Accounts
  - XRP
---

# mpt_holders

{% partial file="/docs/_snippets/mpts-disclaimer.md" /%}

For a given `MPTokenIssuanceID` and ledger sequence, `mpt_holders` returns all holders of that MPT and their balance. This method likely returns very large data sets, so you should expect to implement paging via the `marker` field. This API is only available using Clio, not rippled.

## Request Format

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


The request contains the following parameters:

| Field             | Type                 | Required? | Description |
|:------------------|:---------------------|:----------|-------------|
| `mpt_issuance_id` | string               | Yes       | The `MPTokenIssuance` to query. |
| `ledger_index`    | string or number (positive integer) | No | The ledger index of the max ledger to use, ora shortcut string to choose a ledger automatically. You must specify either ledger_index or ledger_hash. |
| `ledger_hash`     | string               | No        | A 32-byte hex string for the ledger version to use. You must specify either ledger_index or ledger_hash. |
| `marker`          | string               | No        | Used to continue your query where it left off in paginating. |
| `limit`           | number (positive integer) | No   | Specify a limit to the number of MPTs returned. |

## Response Format

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

### Response Fields

The response follows the [standard format][], with the result containing the following fields:

| Field                  | Type    | Description                               |
|:-----------------------|:--------|:------------------------------------------|
| `mpt_issuance_id`      | string  | The `MPTokenIssuance` queried             |
| `mptokens`             | array   | An array of mptokens. Includes all relevant fields in the underlying MPToken object. |
| `marker`               | string  | Used to continue querying where we left off when paginating. Omitted if there are no more entries after this result. |
| `limit`                | number  | The limit, as specfied in the request
| `ledger_index`         | number  | The index of the ledger used. |

An `mptoken` object has the following parameters:

| Field                  | Type    | Description |
|:-----------------------|:--------|:------------------------------------------|
| `account`              | string  | The account address of the holder who owns the `MPToken`. |
| `flags`                | number  | The flags assigned to the`MPToken` object. |
| `mpt_amount`           | string  | Base 10-encoded amount of the holder's balance. |
| `mptoken_index`        | string  | Key of the `MPToken` object. |

##### Example
Example of a `tx` response:

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

##### Object
An `mpt_issuance_id` field is provided in JSON MPTokenIssuance objects (not available for binary). The following APIs are impacted: `ledger_data` and `account_objects`.

##### Example
Example of an `account_objects` response:

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
