rippled Historical Database
==========================

The `rippled` Historical Database provides access to raw Ripple transactions that are stored in a database. This provides an alternative to querying `rippled` itself for transactions that occurred in older ledgers, so that the `rippled` server can maintain fewer historical ledger versions and use fewer server resources.

Ripple Labs provides a live instance of the `rippled` Historical Database API with as complete a transaction record as possible at the following address:

`history.ripple.com`

The [rippled Historical Database source code](https://github.com/ripple/rippled-historical-database) is also available under an open-source license, so you can use, install, and contribute back to the project.


# Usage #

The `rippled` Historical Database provides a REST API, currently with only one API method:

## Get Account Transaction History ##
[[Source]<br>](https://github.com/ripple/rippled-historical-database/blob/8dc88fc5a9de5f6bd12dd3589b586872fe283ad3/api/routes/accountTx.js "Source")

Retrieve a history of transactions that affected a specific account. This includes all transactions the account sent, payments the account received, and payments that rippled through the account.

<div class='multicode'>

*REST*

```
GET /v1/accounts/{:address}/transactions
```

</div>

The following URL parameters are required by this API endpoint:

| Field | Value | Description |
|-------|-------|-------------|
| account | String | The Ripple account address of the account |

Optionally, you can also include the following query parameters:

| Field | Value | Description |
|-------|-------|-------------|
| type  | Single transaction type or comma-separated list of types | Filter results to include only transactions with the specified transaction type or types. Valid types include `OfferCreate`, `OfferCancel`, `Payment`, `TrustSet`, `AccountSet`, and `TicketCreate`. |
| result | Transaction result code | Filter results to only transactions with the specified transaction result code. Valid result codes include `tesSUCCESS` and all [tec codes](transactions.html#tec-codes). |
| start | ISO 8601-format date (YYYY-MM-DDThh:mmZ) | Only retrieve transactions occurring on or after the specified date and time. |
| end   | ISO 8601-format date (YYYY-MM-DDThh:mmZ) | Only retrieve transactions occurring on or before the specified date and time. |
| ledger_min | Integer | Sequence number of the earliest ledger to search. | 
| ledger_max | Integer | Sequence number of the most recent ledger to search. |
| limit | Integer | Number of transactions to return. Defaults to 20. |
| offset | Integer | Start getting results after skipping this many. Used for paginating results. |
| descending | Boolean | Whether to order transactions with the most recent first. Defaults to true. |
| binary | Boolean | If true, retrieve transactions as hex-formatted binary blobs instead of parsed JSON objects. Defaults to false. |

#### Response Format ####

A successful response uses the HTTP code **200 OK** and has a JSON body with the following:

| Field  | Value | Description |
|--------|-------|-------------|
| result | `success` | Indicates that the body represents a successful response. |
| count  | Integer | The number of objects contained in the `transactions` field. |
| transactions | Array of transaction objects | The transactions matching the request, with a `tx` field for the [transaction definition](transactions.html) and a `meta` field with transaction result metadata. |


#### Example ####

Request:

```
GET http://history.ripple.com/v1/accounts/r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59/transactions?limit=2&type=OfferCreate
```

Response:

```js
200 OK
{
    "result": "success",
    "count": 2,
    "transactions": [
        {
            "tx": {
                "TransactionType": "OfferCreate",
                "Flags": 131072,
                "Sequence": 159244,
                "TakerPays": {
                    "value": "0.001567373",
                    "currency": "BTC",
                    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
                },
                "TakerGets": "146348921",
                "Fee": "64",
                "SigningPubKey": "02279DDA900BC53575FC5DFA217113A5B21C1ACB2BB2AEFDD60EA478A074E9E264",
                "TxnSignature": "3045022100D81FFECC36A3DEF0922EB5D16F1AA5AA0804C30A18ED3B512093A75E87C81AD602206B221E22A4E3158785C109E7508624AD3DE5C0E06108D34FA709FCC9575C9441",
                "Account": "r2d2iZiCcJmNL6vhUGFjs8U8BuUq6BnmT",
                "hash": "03EDF724397D2DEE70E49D512AECD619E9EA536BE6CFD48ED167AE2596055C9A",
                "ledger_index": 8317037,
                "executed_time": 1408047740,
                "date": 461362940
            },
            "meta": {
                "TransactionIndex": 0,
                "AffectedNodes": [
                    {
                        "ModifiedNode": {
                            "LedgerEntryType": "AccountRoot",
                            "PreviousTxnLgrSeq": 8317036,
                            "PreviousTxnID": "A56793D47925BED682BFF754806121E3C0281E63C24B62ADF7078EF86CC2AA53",
                            "LedgerIndex": "2880A9B4FB90A306B576C2D532BFE390AB3904642647DCF739492AA244EF46D1",
                            "PreviousFields": {
                                "Balance": "275716601760"
                            },
                            "FinalFields": {
                                "Flags": 0,
                                "Sequence": 326323,
                                "OwnerCount": 27,
                                "Balance": "275862935331",
                                "Account": "rfCFLzNJYvvnoGHWQYACmJpTgkLUaugLEw",
                                "RegularKey": "rfYqosNivHQFJ6KpArouxoci3QE3huKNYe"
                            }
                        }
                    },
                    {
                        "ModifiedNode": {
                            "LedgerEntryType": "AccountRoot",
                            "PreviousTxnLgrSeq": 8317030,
                            "PreviousTxnID": "F8E33A40A481F037BA788231421737AF2AD13161928B15A14F6ABC5007D6A2B7",
                            "LedgerIndex": "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05",
                            "PreviousFields": {
                                "OwnerCount": 18,
                                "Balance": "213169802117"
                            },
                            "FinalFields": {
                                "Flags": 0,
                                "Sequence": 1405,
                                "OwnerCount": 17,
                                "Balance": "213169802799",
                                "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59"
                            }
                        }
                    },
                    {
                        "ModifiedNode": {
                            "LedgerEntryType": "Offer",
                            "PreviousTxnLgrSeq": 8317036,
                            "PreviousTxnID": "B7256723E74A38A17C9F4F5CB938BD45581C57767E44BF26DAC8BA9FF2D58021",
                            "LedgerIndex": "55D0954D7C190006BF905D3B3D269A07016CB9F97B1E37ABE7CC8275DBBDE3DA",
                            "PreviousFields": {
                                "TakerPays": "8016312417",
                                "TakerGets": {
                                    "value": "0.085862",
                                    "currency": "BTC",
                                    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
                                }
                            },
                            "FinalFields": {
                                "Flags": 0,
                                "Sequence": 326320,
                                "Expiration": 461364125,
                                "BookNode": "0",
                                "OwnerNode": "3",
                                "BookDirectory": "7B73A610A009249B0CC0D4311E8BA7927B5A34D86634581C5F212B4AE944DDE4",
                                "TakerPays": "7869978846",
                                "TakerGets": {
                                    "value": "0.084294634308",
                                    "currency": "BTC",
                                    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
                                },
                                "Account": "rfCFLzNJYvvnoGHWQYACmJpTgkLUaugLEw"
                            }
                        }
                    },
                    {
                        "ModifiedNode": {
                            "LedgerEntryType": "RippleState",
                            "PreviousTxnLgrSeq": 8317014,
                            "PreviousTxnID": "AB356934159ECD02D27089C0AA97EF2B3DA4B3A5A3A9EC522474CADDF276B307",
                            "LedgerIndex": "5DC222A1BAF75AE489F9C78F772AEF6AF00C66660B4C28D93DC05FF4A4124D27",
                            "PreviousFields": {
                                "Balance": {
                                    "value": "-2.254933867206176",
                                    "currency": "BTC",
                                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji"
                                }
                            },
                            "FinalFields": {
                                "Flags": 2228224,
                                "LowNode": "221",
                                "HighNode": "0",
                                "Balance": {
                                    "value": "-2.253363366782792",
                                    "currency": "BTC",
                                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji"
                                },
                                "LowLimit": {
                                    "value": "0",
                                    "currency": "BTC",
                                    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
                                },
                                "HighLimit": {
                                    "value": "1000",
                                    "currency": "BTC",
                                    "issuer": "rfCFLzNJYvvnoGHWQYACmJpTgkLUaugLEw"
                                }
                            }
                        }
                    },
                    {
                        "ModifiedNode": {
                            "LedgerEntryType": "RippleState",
                            "PreviousTxnLgrSeq": 8317030,
                            "PreviousTxnID": "F8E33A40A481F037BA788231421737AF2AD13161928B15A14F6ABC5007D6A2B7",
                            "LedgerIndex": "767C12AF647CDF5FEB9019B37018748A79C50EDAF87E8D4C7F39F78AA7CA9765",
                            "PreviousFields": {
                                "Balance": {
                                    "value": "-0.000000007322616",
                                    "currency": "BTC",
                                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji"
                                }
                            },
                            "FinalFields": {
                                "Flags": 131072,
                                "LowNode": "43",
                                "HighNode": "0",
                                "Balance": {
                                    "value": "0",
                                    "currency": "BTC",
                                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji"
                                },
                                "LowLimit": {
                                    "value": "0",
                                    "currency": "BTC",
                                    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
                                },
                                "HighLimit": {
                                    "value": "3",
                                    "currency": "BTC",
                                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59"
                                }
                            }
                        }
                    },
                    {
                        "DeletedNode": {
                            "LedgerEntryType": "DirectoryNode",
                            "LedgerIndex": "7B73A610A009249B0CC0D4311E8BA7927B5A34D86634581C5F211CEE1E0697A0",
                            "FinalFields": {
                                "Flags": 0,
                                "ExchangeRate": "5F211CEE1E0697A0",
                                "RootIndex": "7B73A610A009249B0CC0D4311E8BA7927B5A34D86634581C5F211CEE1E0697A0",
                                "TakerPaysCurrency": "0000000000000000000000000000000000000000",
                                "TakerPaysIssuer": "0000000000000000000000000000000000000000",
                                "TakerGetsCurrency": "0000000000000000000000004254430000000000",
                                "TakerGetsIssuer": "0A20B3C85F482532A9578DBB3950B85CA06594D1"
                            }
                        }
                    },
                    {
                        "DeletedNode": {
                            "LedgerEntryType": "Offer",
                            "LedgerIndex": "AF3C702057C9C47DB9E809FD8C76CD22521012C5CC7AE95D914EC9E226F1D7E5",
                            "PreviousFields": {
                                "TakerPays": "182677152",
                                "TakerGets": {
                                    "value": "0.001959953669835",
                                    "currency": "BTC",
                                    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
                                }
                            },
                            "FinalFields": {
                                "Flags": 131072,
                                "Sequence": 1404,
                                "PreviousTxnLgrSeq": 8317030,
                                "BookNode": "0",
                                "OwnerNode": "0",
                                "PreviousTxnID": "F8E33A40A481F037BA788231421737AF2AD13161928B15A14F6ABC5007D6A2B7",
                                "BookDirectory": "7B73A610A009249B0CC0D4311E8BA7927B5A34D86634581C5F211CEE1E0697A0",
                                "TakerPays": "182676470",
                                "TakerGets": {
                                    "value": "0.001959946361835",
                                    "currency": "BTC",
                                    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
                                },
                                "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59"
                            }
                        }
                    },
                    {
                        "ModifiedNode": {
                            "LedgerEntryType": "AccountRoot",
                            "PreviousTxnLgrSeq": 8317036,
                            "PreviousTxnID": "049D5872010AE9144F8FE6A8A92937B6A21C065C2FA9A0233C9CAB7F5485ADC5",
                            "LedgerIndex": "B4C12A5134DCFE012CCC035F62D5903179DE5CABE74B228D84C7E4905BECC032",
                            "PreviousFields": {
                                "Sequence": 159244,
                                "Balance": "201007563226"
                            },
                            "FinalFields": {
                                "Flags": 0,
                                "Sequence": 159245,
                                "OwnerCount": 19,
                                "Balance": "200861228909",
                                "Account": "r2d2iZiCcJmNL6vhUGFjs8U8BuUq6BnmT"
                            }
                        }
                    },
                    {
                        "ModifiedNode": {
                            "LedgerEntryType": "RippleState",
                            "PreviousTxnLgrSeq": 8317036,
                            "PreviousTxnID": "03229A664FF41A8767818DC8B236E59279078BB33C440996CB0A0093F213C173",
                            "LedgerIndex": "F16445094C00CD3A38CE7851BD6ECA77CA2F281019BE800AB984CDF57D2F2631",
                            "PreviousFields": {
                                "Balance": {
                                    "value": "0",
                                    "currency": "BTC",
                                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji"
                                }
                            },
                            "FinalFields": {
                                "Flags": 1114112,
                                "LowNode": "0",
                                "HighNode": "233",
                                "Balance": {
                                    "value": "0.001567373",
                                    "currency": "BTC",
                                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji"
                                },
                                "LowLimit": {
                                    "value": "0",
                                    "currency": "BTC",
                                    "issuer": "r2d2iZiCcJmNL6vhUGFjs8U8BuUq6BnmT"
                                },
                                "HighLimit": {
                                    "value": "0",
                                    "currency": "BTC",
                                    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
                                }
                            }
                        }
                    },
                    {
                        "ModifiedNode": {
                            "LedgerEntryType": "DirectoryNode",
                            "LedgerIndex": "F60ADF645E78B69857D2E4AEC8B7742FEABC8431BD8611D099B428C3E816DF93",
                            "FinalFields": {
                                "Flags": 0,
                                "RootIndex": "F60ADF645E78B69857D2E4AEC8B7742FEABC8431BD8611D099B428C3E816DF93",
                                "Owner": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59"
                            }
                        }
                    }
                ],
                "TransactionResult": "tesSUCCESS"
            }
        },
        {
            "tx": {
                "TransactionType": "OfferCreate",
                "Flags": 0,
                "Sequence": 236535,
                "LastLedgerSequence": 8317038,
                "TakerPays": {
                    "value": "0.39545282",
                    "currency": "BTC",
                    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
                },
                "TakerGets": "36865488056",
                "Fee": "20",
                "SigningPubKey": "0382A086DB113581E08E439546156D7F34B68F11D70914B65F63A98A36AF9845DC",
                "TxnSignature": "3045022100AB584255CDA4500BD82B5EA7CBB5ABB706DF657976F79187985209DDEB05C6290220365B67073797D3D4265B6E28ACC7DB7CE4EF3DF9DDB9B62ABE8078F0BF039414",
                "Account": "rJnZ4YHCUsHvQu7R6mZohevKJDHFzVD6Zr",
                "hash": "F8E33A40A481F037BA788231421737AF2AD13161928B15A14F6ABC5007D6A2B7",
                "ledger_index": 8317030,
                "executed_time": 1408047700,
                "date": 461362900
            },
            "meta": {
                "TransactionIndex": 7,
                "AffectedNodes": [
                    {
                        "ModifiedNode": {
                            "LedgerEntryType": "AccountRoot",
                            "PreviousTxnLgrSeq": 8317030,
                            "PreviousTxnID": "F49ED1ACC968759EF5DA9745B08A4E47D5EA44E614AE61EE1B3CED50E1218C17",
                            "LedgerIndex": "2B9A35D51B6BABE4F386AA3C36866BDE72E14BFC917A95C6B81F5B079F1656A3",
                            "PreviousFields": {
                                "Sequence": 236535,
                                "Balance": "1035793050836"
                            },
                            "FinalFields": {
                                "Flags": 0,
                                "Sequence": 236536,
                                "OwnerCount": 30,
                                "Balance": "998934936914",
                                "Account": "rJnZ4YHCUsHvQu7R6mZohevKJDHFzVD6Zr"
                            }
                        }
                    },
                    {
                        "ModifiedNode": {
                            "LedgerEntryType": "AccountRoot",
                            "PreviousTxnLgrSeq": 8317027,
                            "PreviousTxnID": "D92EBF936C4DEB2B99B7194C98F78A42B998E0B2C357400F139A3DA717AF8737",
                            "LedgerIndex": "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05",
                            "PreviousFields": {
                                "Balance": "176311688215"
                            },
                            "FinalFields": {
                                "Flags": 0,
                                "Sequence": 1405,
                                "OwnerCount": 18,
                                "Balance": "213169802117",
                                "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59"
                            }
                        }
                    },
                    {
                        "ModifiedNode": {
                            "LedgerEntryType": "RippleState",
                            "PreviousTxnLgrSeq": 8317027,
                            "PreviousTxnID": "D92EBF936C4DEB2B99B7194C98F78A42B998E0B2C357400F139A3DA717AF8737",
                            "LedgerIndex": "767C12AF647CDF5FEB9019B37018748A79C50EDAF87E8D4C7F39F78AA7CA9765",
                            "PreviousFields": {
                                "Balance": {
                                    "value": "-0.396243732962616",
                                    "currency": "BTC",
                                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji"
                                }
                            },
                            "FinalFields": {
                                "Flags": 131072,
                                "LowNode": "43",
                                "HighNode": "0",
                                "Balance": {
                                    "value": "-0.000000007322616",
                                    "currency": "BTC",
                                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji"
                                },
                                "LowLimit": {
                                    "value": "0",
                                    "currency": "BTC",
                                    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
                                },
                                "HighLimit": {
                                    "value": "3",
                                    "currency": "BTC",
                                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59"
                                }
                            }
                        }
                    },
                    {
                        "ModifiedNode": {
                            "LedgerEntryType": "Offer",
                            "PreviousTxnLgrSeq": 8317027,
                            "PreviousTxnID": "D92EBF936C4DEB2B99B7194C98F78A42B998E0B2C357400F139A3DA717AF8737",
                            "LedgerIndex": "AF3C702057C9C47DB9E809FD8C76CD22521012C5CC7AE95D914EC9E226F1D7E5",
                            "PreviousFields": {
                                "TakerPays": "37040791054",
                                "TakerGets": {
                                    "value": "0.397412773669835",
                                    "currency": "BTC",
                                    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
                                }
                            },
                            "FinalFields": {
                                "Flags": 131072,
                                "Sequence": 1404,
                                "BookNode": "0",
                                "OwnerNode": "0",
                                "BookDirectory": "7B73A610A009249B0CC0D4311E8BA7927B5A34D86634581C5F211CEE1E0697A0",
                                "TakerPays": "182677152",
                                "TakerGets": {
                                    "value": "0.001959953669835",
                                    "currency": "BTC",
                                    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
                                },
                                "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59"
                            }
                        }
                    },
                    {
                        "ModifiedNode": {
                            "LedgerEntryType": "RippleState",
                            "PreviousTxnLgrSeq": 8317027,
                            "PreviousTxnID": "D92EBF936C4DEB2B99B7194C98F78A42B998E0B2C357400F139A3DA717AF8737",
                            "LedgerIndex": "CA152527E0627E8BB24C80D0D7D9CC515376D4D5416437F7C3687CA506901D83",
                            "PreviousFields": {
                                "Balance": {
                                    "value": "-8.454143459263425",
                                    "currency": "BTC",
                                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji"
                                }
                            },
                            "FinalFields": {
                                "Flags": 2228224,
                                "LowNode": "230",
                                "HighNode": "0",
                                "Balance": {
                                    "value": "-8.849596279263425",
                                    "currency": "BTC",
                                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji"
                                },
                                "LowLimit": {
                                    "value": "0",
                                    "currency": "BTC",
                                    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
                                },
                                "HighLimit": {
                                    "value": "0",
                                    "currency": "BTC",
                                    "issuer": "rJnZ4YHCUsHvQu7R6mZohevKJDHFzVD6Zr"
                                }
                            }
                        }
                    }
                ],
                "TransactionResult": "tesSUCCESS"
            }
        }
    ]
}
```


