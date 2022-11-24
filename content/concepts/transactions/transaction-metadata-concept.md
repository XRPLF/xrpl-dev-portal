---
html: transaction-metadata-concept.html
parent: transactions.html
blurb: Transaction metadata is a section of data that is added to a transaction after it is processed.
labels:
  - Ledgers
---
# Transaction Metadata

Transaction metadata is a section of data that gets added to a transaction after it is processed. Any transaction that gets included in a ledger has metadata, regardless of whether it is successful. The transaction metadata describes the outcome of the transaction in detail.

The changes described in transaction metadata are only final if the transaction is in a validated ledger version.

Some fields that might appear in transaction metadata include:

| Field                                   | Value               | Description  |
|:----------------------------------------|:--------------------|:-------------|
| `AffectedNodes`                         | Array               | List of ledger objects that were created, deleted, or modified by this transaction, and specific changes to each. |
| `DeliveredAmount`                       | Currency Amount | _(May be omitted)_ For a [partial payment](partial-payments.html), this field records the amount of currency actually delivered to the destination. To avoid errors when reading transactions, instead use the `delivered_amount` field, which is provided for all Payment transactions, partial or not. |
| `TransactionIndex`                      | Unsigned Integer    | The transaction's position within the ledger that included it. This is zero-indexed. (For example, the value `2` means it was the 3rd transaction in that ledger.) |
| `TransactionResult`                     | String              | A [result code](transaction-results.html) indicating whether the transaction succeeded or how it failed. |
| [`delivered_amount`](transaction-metadata.html#delivered_amount) | Currency Amount | _(Omitted for non-Payment transactions)_ The Currency Amount actually received by the `Destination` account. Use this field to determine how much was delivered, regardless of whether the transaction is a [partial payment](partial-payments.html). See [this description](transaction-metadata.html#delivered_amount) for details. |

<!-- This metadata is too complex to be useful. Need a smaller example that the user can grok. -->

## Example Metadata

The following JSON object shows the metadata for [a complex cross-currency payment](https://xrpcharts.ripple.com/#/transactions/8C55AFC2A2AA42B5CE624AEECDB3ACFDD1E5379D4E5BF74A8460C5E97EF8706B):

```json
{
  "AffectedNodes": [
    {
      "ModifiedNode": {
        "FinalFields": {
          "Account": "r9ZoLsJHzMMJLpvsViWQ4Jgx17N8cz1997",
          "Balance": "77349986",
          "Flags": 0,
          "OwnerCount": 2,
          "Sequence": 9
        },
        "LedgerEntryType": "AccountRoot",
        "LedgerIndex": "1E7E658C2D3DF91EFAE5A12573284AD6F526B8F64DD12F013C6F889EF45BEA97",
        "PreviousFields": {
          "OwnerCount": 3
        },
        "PreviousTxnID": "55C11248ACEFC2EFD59755BF88867783AC18EA078517108F942069C2FBE4CF5C",
        "PreviousTxnLgrSeq": 35707468
      }
    },
    {
      "ModifiedNode": {
        "FinalFields": {
          "Balance": {
            "currency": "USD",
            "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
            "value": "2298.927882138068"
          },
          "Flags": 1114112,
          "HighLimit": {
            "currency": "USD",
            "issuer": "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
            "value": "0"
          },
          "HighNode": "000000000000006B",
          "LowLimit": {
            "currency": "USD",
            "issuer": "rpvvAvaZ7TXHkNLM8UJwCTU6yBU2jDTJ1P",
            "value": "1000000000"
          },
          "LowNode": "0000000000000007"
        },
        "LedgerEntryType": "RippleState",
        "LedgerIndex": "220DDA7164F3F41F3C5223FA3125D4CD368EBB4FB954B5FBFFB6D1EA6DACDD5E",
        "PreviousFields": {
          "Balance": {
            "currency": "USD",
            "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
            "value": "2297.927882138068"
          }
        },
        "PreviousTxnID": "1DB2F9C67C3F42F7B8AB02BA2264254A78A201EC8A9974A1CACEFD51545B1263",
        "PreviousTxnLgrSeq": 43081739
      }
    },
    {
      "ModifiedNode": {
        "FinalFields": {
          "Balance": {
            "currency": "USD",
            "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
            "value": "33403.80553244443"
          },
          "Flags": 1114112,
          "HighLimit": {
            "currency": "USD",
            "issuer": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
            "value": "0"
          },
          "HighNode": "0000000000001A40",
          "LowLimit": {
            "currency": "USD",
            "issuer": "rd5Sx93pCMgfxwBuofjen2csoFYmY8VrT",
            "value": "1000000000"
          },
          "LowNode": "0000000000000000"
        },
        "LedgerEntryType": "RippleState",
        "LedgerIndex": "38569918AF54B520463CFDDD00EB5ADD8768039BD94E61A5E25C387EA4FDC9A3",
        "PreviousFields": {
          "Balance": {
            "currency": "USD",
            "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
            "value": "33402.80752845242"
          }
        },
        "PreviousTxnID": "38A0E82ADC2DA6C6D59929B73E9812CD1E1384E452FD23D0717EA0037E2FC9E3",
        "PreviousTxnLgrSeq": 43251694
      }
    },
    {
      "ModifiedNode": {
        "FinalFields": {
          "Account": "rBndiPPKs9k5rjBb7HsEiqXKrz8AfUnqWq",
          "BookDirectory": "4627DFFCFF8B5A265EDBD8AE8C14A52325DBFEDAF4F5C32E5B09B13AC59DBA5E",
          "BookNode": "0000000000000000",
          "Flags": 0,
          "OwnerNode": "0000000000000000",
          "Sequence": 407556,
          "TakerGets": {
            "currency": "USD",
            "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
            "value": "75.1379833998197"
          },
          "TakerPays": "204986996"
        },
        "LedgerEntryType": "Offer",
        "LedgerIndex": "557BDD35E40EAFFE0AC98108A0F4AC4BB812A168CFD5B4E35475F42A60ABD9C8",
        "PreviousFields": {
          "TakerGets": {
            "currency": "USD",
            "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
            "value": "76.1399833998197"
          },
          "TakerPays": "207720593"
        },
        "PreviousTxnID": "961C575073788979815F103D065CEE449D2EA6EFE8FC8C33C26EC08586925D90",
        "PreviousTxnLgrSeq": 43251680
      }
    },
    {
      "ModifiedNode": {
        "FinalFields": {
          "Account": "r9KG7Du7aFmABzMvDnwuvPaEoMu4Eurwok",
          "Balance": "8080207629",
          "Flags": 0,
          "OwnerCount": 6,
          "Sequence": 1578765
        },
        "LedgerEntryType": "AccountRoot",
        "LedgerIndex": "5A667CB5FBAB4143EDEFBD6EDDD4B6D19C905209C8EE16486D5D7CD6CB083E78",
        "PreviousFields": {
          "Balance": "8080152531",
          "Sequence": 1578764
        },
        "PreviousTxnID": "E3CDFD288620871455634DC1E56439136AACA1DDBCE987BE12F97486AB477375",
        "PreviousTxnLgrSeq": 43251694
      }
    },
    {
      "DeletedNode": {
        "FinalFields": {
          "Account": "r9ZoLsJHzMMJLpvsViWQ4Jgx17N8cz1997",
          "BookDirectory": "A6D5D1C1CC92D56FDDFD4434FB10BD31F63EB991DA3C756653071AFD498D0000",
          "BookNode": "0000000000000000",
          "Flags": 0,
          "OwnerNode": "0000000000000000",
          "PreviousTxnID": "DB028A461E98B0398CAD65F2871B381A6D0B9A21662CA5B033438D83C518C0F2",
          "PreviousTxnLgrSeq": 35686129,
          "Sequence": 7,
          "TakerGets": {
            "currency": "EUR",
            "issuer": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
            "value": "2.5"
          },
          "TakerPays": {
            "currency": "ETH",
            "issuer": "rcA8X3TVMST1n3CJeAdGk1RdRCHii7N2h",
            "value": "0.05"
          }
        },
        "LedgerEntryType": "Offer",
        "LedgerIndex": "6AA7E5121FEB456F0A899E3D6F25D62ABB408BB67B91C9270E13714401ED72B5"
      }
    },
    {
      "ModifiedNode": {
        "FinalFields": {
          "Account": "rd5Sx93pCMgfxwBuofjen2csoFYmY8VrT",
          "Balance": "8251028196",
          "Flags": 0,
          "OwnerCount": 4,
          "Sequence": 274
        },
        "LedgerEntryType": "AccountRoot",
        "LedgerIndex": "6F830A1B38F827CD4BEC946A40F1E2DF726FC22AFC3918FD621567AF17F49F3A",
        "PreviousFields": {
          "Balance": "8253816902"
        },
        "PreviousTxnID": "38A0E82ADC2DA6C6D59929B73E9812CD1E1384E452FD23D0717EA0037E2FC9E3",
        "PreviousTxnLgrSeq": 43251694
      }
    },
    {
      "ModifiedNode": {
        "FinalFields": {
          "Account": "rd5Sx93pCMgfxwBuofjen2csoFYmY8VrT",
          "BookDirectory": "79C54A4EBD69AB2EADCE313042F36092BE432423CC6A4F784E0CB6D74F25A336",
          "BookNode": "0000000000000000",
          "Flags": 0,
          "OwnerNode": "0000000000000000",
          "Sequence": 273,
          "TakerGets": "8246341599",
          "TakerPays": {
            "currency": "USD",
            "issuer": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
            "value": "2951.147613535471"
          }
        },
        "LedgerEntryType": "Offer",
        "LedgerIndex": "7FD1EAAE17B7D68AE640FFC56CECC3999B4F938EFFF6EA6887B6CC8BD9DBDC63",
        "PreviousFields": {
          "TakerGets": "8249130305",
          "TakerPays": {
            "currency": "USD",
            "issuer": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
            "value": "2952.145617527486"
          }
        },
        "PreviousTxnID": "38A0E82ADC2DA6C6D59929B73E9812CD1E1384E452FD23D0717EA0037E2FC9E3",
        "PreviousTxnLgrSeq": 43251694
      }
    },
    {
      "ModifiedNode": {
        "FinalFields": {
          "Balance": {
            "currency": "USD",
            "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
            "value": "-11.68225001668339"
          },
          "Flags": 131072,
          "HighLimit": {
            "currency": "USD",
            "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "value": "5000"
          },
          "HighNode": "0000000000000000",
          "LowLimit": {
            "currency": "USD",
            "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
            "value": "0"
          },
          "LowNode": "000000000000004A"
        },
        "LedgerEntryType": "RippleState",
        "LedgerIndex": "826CF5BFD28F3934B518D0BDF3231259CBD3FD0946E3C3CA0C97D2C75D2D1A09",
        "PreviousFields": {
          "Balance": {
            "currency": "USD",
            "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
            "value": "-10.68225001668339"
          }
        },
        "PreviousTxnID": "28B271F7C27C1A267F32FFCD8B1795C5D3B1DC761AD705E3A480139AA8B61B09",
        "PreviousTxnLgrSeq": 43237130
      }
    },
    {
      "ModifiedNode": {
        "FinalFields": {
          "Account": "rBndiPPKs9k5rjBb7HsEiqXKrz8AfUnqWq",
          "Balance": "8276201534",
          "Flags": 0,
          "OwnerCount": 5,
          "Sequence": 407558
        },
        "LedgerEntryType": "AccountRoot",
        "LedgerIndex": "880C6FB7B9C0083211F950E4449AD45895C0EC1114B5112CE1320AC7275E3237",
        "PreviousFields": {
          "Balance": "8273467937"
        },
        "PreviousTxnID": "CB4B54942F11510A47D2731C3260429093F24016B366CBF15D8EC4B705372F02",
        "PreviousTxnLgrSeq": 43251683
      }
    },
    {
      "ModifiedNode": {
        "FinalFields": {
          "Balance": {
            "currency": "USD",
            "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
            "value": "-6557.745685633666"
          },
          "Flags": 2228224,
          "HighLimit": {
            "currency": "USD",
            "issuer": "rBndiPPKs9k5rjBb7HsEiqXKrz8AfUnqWq",
            "value": "1000000000"
          },
          "HighNode": "0000000000000000",
          "LowLimit": {
            "currency": "USD",
            "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
            "value": "0"
          },
          "LowNode": "0000000000000512"
        },
        "LedgerEntryType": "RippleState",
        "LedgerIndex": "8A9FEE5192E334195314B5C162BC78F7452ADB14E06839D48943BAE05EE1967F",
        "PreviousFields": {
          "Balance": {
            "currency": "USD",
            "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
            "value": "-6558.747685633666"
          }
        },
        "PreviousTxnID": "961C575073788979815F103D065CEE449D2EA6EFE8FC8C33C26EC08586925D90",
        "PreviousTxnLgrSeq": 43251680
      }
    },
    {
      "ModifiedNode": {
        "FinalFields": {
          "Balance": {
            "currency": "GCB",
            "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
            "value": "9990651675.348776"
          },
          "Flags": 3211264,
          "HighLimit": {
            "currency": "GCB",
            "issuer": "rHaans8PtgwbacHvXAL3u6TG28gTAtCwr8",
            "value": "0"
          },
          "HighNode": "0000000000000000",
          "LowLimit": {
            "currency": "GCB",
            "issuer": "r9KG7Du7aFmABzMvDnwuvPaEoMu4Eurwok",
            "value": "10000000000"
          },
          "LowNode": "0000000000000000"
        },
        "LedgerEntryType": "RippleState",
        "LedgerIndex": "A2B41EE7818A5756B6A2276BDBB3CE0ED3A3B350787FD6B76E5EA1354A8F20D2",
        "PreviousFields": {
          "Balance": {
            "currency": "GCB",
            "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
            "value": "9990651678.137482"
          }
        },
        "PreviousTxnID": "961C575073788979815F103D065CEE449D2EA6EFE8FC8C33C26EC08586925D90",
        "PreviousTxnLgrSeq": 43251680
      }
    },
    {
      "DeletedNode": {
        "FinalFields": {
          "ExchangeRate": "53071AFD498D0000",
          "Flags": 0,
          "RootIndex": "A6D5D1C1CC92D56FDDFD4434FB10BD31F63EB991DA3C756653071AFD498D0000",
          "TakerGetsCurrency": "0000000000000000000000004555520000000000",
          "TakerGetsIssuer": "2ADB0B3959D60A6E6991F729E1918B7163925230",
          "TakerPaysCurrency": "0000000000000000000000004554480000000000",
          "TakerPaysIssuer": "06CC4A6D023E68AA3499C6DE3E9F2DC52B8BA254"
        },
        "LedgerEntryType": "DirectoryNode",
        "LedgerIndex": "A6D5D1C1CC92D56FDDFD4434FB10BD31F63EB991DA3C756653071AFD498D0000"
      }
    },
    {
      "ModifiedNode": {
        "FinalFields": {
          "Flags": 0,
          "Owner": "r9ZoLsJHzMMJLpvsViWQ4Jgx17N8cz1997",
          "RootIndex": "A83C1B192A27582EDB320EBD7A3FE58D7042CE04B67A2B3D87FDD63D871E12D7"
        },
        "LedgerEntryType": "DirectoryNode",
        "LedgerIndex": "A83C1B192A27582EDB320EBD7A3FE58D7042CE04B67A2B3D87FDD63D871E12D7"
      }
    },
    {
      "ModifiedNode": {
        "FinalFields": {
          "Balance": {
            "currency": "USD",
            "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
            "value": "0"
          },
          "Flags": 65536,
          "HighLimit": {
            "currency": "USD",
            "issuer": "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
            "value": "0"
          },
          "HighNode": "0000000000000002",
          "LowLimit": {
            "currency": "USD",
            "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "value": "1"
          },
          "LowNode": "0000000000000000"
        },
        "LedgerEntryType": "RippleState",
        "LedgerIndex": "C493ABA2619D0FC6355BA862BC8312DF8266FBE76AFBA9636E857F7EAC874A99",
        "PreviousFields": {
          "Balance": {
            "currency": "USD",
            "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
            "value": "1"
          }
        },
        "PreviousTxnID": "28B271F7C27C1A267F32FFCD8B1795C5D3B1DC761AD705E3A480139AA8B61B09",
        "PreviousTxnLgrSeq": 43237130
      }
    },
    {
      "ModifiedNode": {
        "FinalFields": {
          "Account": "r9KG7Du7aFmABzMvDnwuvPaEoMu4Eurwok",
          "BookDirectory": "E6E8A9842EA2ED1FD5D0599343692CE1EBF977AEA751B7DC5B038D7EA4C68000",
          "BookNode": "0000000000000000",
          "Flags": 65536,
          "OwnerNode": "0000000000000000",
          "Sequence": 39018,
          "TakerGets": {
            "currency": "GCB",
            "issuer": "rHaans8PtgwbacHvXAL3u6TG28gTAtCwr8",
            "value": "9990651675.348776"
          },
          "TakerPays": "9990651675348776"
        },
        "LedgerEntryType": "Offer",
        "LedgerIndex": "C939B9B2C5803DD6D89B792E72470F79CBE9F9E999691789E0B68C3808BDDD8E",
        "PreviousFields": {
          "TakerGets": {
            "currency": "GCB",
            "issuer": "rHaans8PtgwbacHvXAL3u6TG28gTAtCwr8",
            "value": "9990651678.137482"
          },
          "TakerPays": "9990651678137482"
        },
        "PreviousTxnID": "961C575073788979815F103D065CEE449D2EA6EFE8FC8C33C26EC08586925D90",
        "PreviousTxnLgrSeq": 43251680
      }
    },
    {
      "ModifiedNode": {
        "FinalFields": {
          "Balance": {
            "currency": "USD",
            "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
            "value": "2963.413395452545"
          },
          "Flags": 65536,
          "HighLimit": {
            "currency": "USD",
            "issuer": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
            "value": "0"
          },
          "HighNode": "0000000000001A97",
          "LowLimit": {
            "currency": "USD",
            "issuer": "rpvvAvaZ7TXHkNLM8UJwCTU6yBU2jDTJ1P",
            "value": "0"
          },
          "LowNode": "0000000000000007"
        },
        "LedgerEntryType": "RippleState",
        "LedgerIndex": "E4D1FBD5CB72A1D3EE38C21F3BCB13E454FCB469CD01C1366E0008A031E6A7FC",
        "PreviousFields": {
          "Balance": {
            "currency": "USD",
            "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
            "value": "2964.413395452545"
          }
        },
        "PreviousTxnID": "1DB2F9C67C3F42F7B8AB02BA2264254A78A201EC8A9974A1CACEFD51545B1263",
        "PreviousTxnLgrSeq": 43081739
      }
    }
  ],
  "DeliveredAmount": {
    "currency": "GCB",
    "issuer": "rHaans8PtgwbacHvXAL3u6TG28gTAtCwr8",
    "value": "2.788706"
  },
  "TransactionIndex": 38,
  "TransactionResult": "tesSUCCESS",
  "delivered_amount": {
    "currency": "GCB",
    "issuer": "rHaans8PtgwbacHvXAL3u6TG28gTAtCwr8",
    "value": "2.788706"
  }
}
```

## AffectedNodes

The `AffectedNodes` array contains a complete list of the [objects in the ledger][] that this transaction modified in some way. Each entry in this array is an object with one top-level field indicating what type it is:

- `CreatedNode` indicates that the transaction created a new object in the ledger.
- `DeletedNode` indicates that the transaction removed an object from the ledger.
- `ModifiedNode` indicates that the transaction modified an existing object in the ledger.

The value of each of these fields is a JSON object describing the changes made to the ledger object.

### CreatedNode Fields

A `CreatedNode` object contains the following fields:

| Field             | Value             | Description                          |
|:------------------|:------------------|:-------------------------------------|
| `LedgerEntryType` | String            | The type of [ledger object](ledger-object-types.html) that was created. |
| `LedgerIndex`     | String - Hash | The [ID of this ledger object](ledger-object-ids.html) in the ledger's [state tree](ledgers.html). **Note:** This is _not__ the same as a [ledger index](basic-data-types.html#ledger-index), even though the field name is very similar. |
| `NewFields`       | Object            | The content fields of the newly-created ledger object. Which fields are present depends on what type of ledger object was created. |

### DeletedNode Fields

A `DeletedNode` object contains the following fields:

| Field             | Value             | Description                          |
|:------------------|:------------------|:-------------------------------------|
| `LedgerEntryType` | String            | The [type of ledger object][] that was deleted. |
| `LedgerIndex`     | String - [Hash][] | The [ID of this ledger object](ledger-object-ids.html) in the ledger's [state tree](ledgers.html). **Note:** This is **not the same** as a [ledger index](basic-data-types.html#ledger-index), even though the field name is very similar. |
| `FinalFields`     | Object            | The content fields of the ledger object immediately before it was deleted. Which fields are present depends on what type of ledger object was created. |

### ModifiedNode Fields

A `ModifiedNode` object contains the following fields:

| Field               | Value                     | Description                |
|:--------------------|:--------------------------|:---------------------------|
| `LedgerEntryType`   | String                    | The [type of ledger object](ledger-object-types.html) that was deleted. |
| `LedgerIndex`       | String - Hash         | The [ID of this ledger object](ledger-object-ids.html) in the ledger's [state tree](ledgers.html). **Note:** This is **not the same** as a [ledger index](basic-data-types.html#ledger-index), even though the field name is very similar. |
| `FinalFields`       | Object                    | The content fields of the ledger object after applying any changes from this transaction. Which fields are present depends on what type of ledger object was created. This omits the `PreviousTxnID` and `PreviousTxnLgrSeq` fields, even though most types of ledger objects have them. |
| `PreviousFields`    | Object                    | The previous values for all fields of the object that were changed as a result of this transaction. If the transaction _only added_ fields to the object, this field is an empty object. |
| `PreviousTxnID`     | String - Hash         | _(Can be omitted)_ The identifying hash of the previous transaction to modify this ledger object. Omitted for ledger object types that do not have a `PreviousTxnID` field. |
| `PreviousTxnLgrSeq` | Number - Ledger Index | _(Can be omitted)_  The Ledger Index of the ledger version containing the previous transaction to modify this ledger object. Omitted for ledger object types that do not have a `PreviousTxnLgrSeq` field. |

**Note:** If the modified ledger object has `PreviousTxnID` and `PreviousTxnLgrSeq` fields, the transaction always updates them with the transaction's own identifying hash and the index of the ledger version that included the transaction, but these fields' new value is not listed in the `FinalFields` of the `ModifiedNode` object, and their previous values are listed at the top level of the `ModifiedNode` object rather than in the nested `PreviousFields` object.


## delivered_amount

The `Amount` of a `Payment` transaction indicates the amount to deliver to the `Destination`, so if the transaction was successful, then the destination received that much — _except if the transaction was a [partial payment](partial-payments.html)_. (In that case, any positive amount up to `Amount` might have arrived.) Rather than choosing whether or not to trust the `Amount` field, you should use the `delivered_amount` field of the metadata to see how much actually reached its destination.

The `rippled` server provides a `delivered_amount` field in JSON transaction metadata for all successful Payment transactions. This field is formatted like a normal currency amount. However, the delivered amount is not available for transactions that meet both of the following criteria:

* Is a partial payment
* Included in a validated ledger before 2014-01-20

If both conditions are true, then `delivered_amount` contains the string value `unavailable` instead of an actual amount. If this happens, you can only figure out the actual delivered amount by reading the `AffectedNodes` in the transaction's metadata.

**Note:** The `delivered_amount` field is generated on-demand for the request, and is not included in the binary format for transaction metadata, nor is it used when calculating the hash of the transaction metadata. In contrast, the `DeliveredAmount` field _is_ included in the binary format for partial payment transactions after 2014-01-20.

See also: [Partial Payments](partial-payments.html)

<!---->
<!-- SPELLING_IGNORE: affectednodes, creatednode, deletednode, modifiednode, delivered_amount -->

