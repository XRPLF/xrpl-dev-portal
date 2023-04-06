---
html: nft_history.html
parent: clio-methods.html
blurb: Retrieve the history of ownership and transfers for the specified NFT using Clio server's `nft_history_` API.
labels:
  - Non-fungible Tokens, NFTs
---
# nft_history

[[Source]](https://github.com/XRPLF/clio/blob/4a5cb962b6971872d150777881801ce27ae9ed1a/src/rpc/handlers/NFTHistory.cpp "Source")

The `nft_history` command asks the Clio server for past transaction metadata for the [NFT](non-fungible-tokens.html) being queried. [New in: Clio v1.1.0](https://github.com/XRPLF/clio/releases/tag/1.1.0 "BADGE_BLUE")

**Note** `nft_history` returns only _successful_ transactions associated with the NFT.

## Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": 1,
  "command": "nft_history",
  "nft_id": "00080000B4F4AFC5FBCBD76873F18006173D2193467D3EE70000099B00000000"
}
```

*JSON-RPC*

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

<!-- MULTICODE_BLOCK_END -->

<!-- To DO: Add an example command to the assets/js/apitool-methods-ws.js file. The WebSocket Tool requires access to a publicly available Clio server.
[Try it! >](websocket-api-tool.html#nft_history)-->

The request contains the following parameters:

| `Field`        | Type                       | Description                    |
|:---------------|:---------------------------|:-------------------------------|
| `nft_id`       | String                     | A unique identifier for the non-fungible token (NFT). |
| `ledger_hash`  | String                     | _(Optional)_ A 20-byte hex string for the ledger version to use. (See [Specifying Ledgers][]) |
| `ledger_index` | String or Unsigned Integer | _(Optional)_ The [ledger index][] of the ledger to use, or a shortcut string to choose a ledger automatically.  Do not specify the `ledger_index` as `closed` or `current`; doing so forwards the request to the P2P `rippled` server and the `nft_history` API is not available on `rippled`. (See [Specifying Ledgers][]) |

If you do not specify a ledger version, Clio uses the latest validated ledger.

## Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": 0,
  "type": "response",
  "result": {
    "ledger_index_min": 21377274,
    "ledger_index_max": 27482261,
    "transactions": [
      {
        "meta": {
          "AffectedNodes": [
            {
              "DeletedNode": {
                "FinalFields": {
                  "Flags": 1,
                  "NFTokenID": "00082710A955EBAD4AE6261466FBEEEBF6A59591AC8C831F16E5DA9C00000001",
                  "RootIndex": "33A64DE4A5B00FDB23036216653F1059C5ED7546E502DE878500DF667D61551E"
                },
                "LedgerEntryType": "DirectoryNode",
                "LedgerIndex": "33A64DE4A5B00FDB23036216653F1059C5ED7546E502DE878500DF667D61551E"
              }
            },
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Account": "rGS43H57KGnvsDapj796XXo3g5qWcQxqmA",
                  "Balance": "1079999928",
                  "BurnedNFTokens": 1,
                  "Flags": 0,
                  "MintedNFTokens": 2,
                  "OwnerCount": 0,
                  "Sequence": 27479932
                },
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "6745C90D426A198852939F3F3B97C8467C16147969BF68C773702BED477F4C1B",
                "PreviousFields": {
                  "Balance": "979999940",
                  "OwnerCount": 1,
                  "Sequence": 27479931
                },
                "PreviousTxnID": "377B9A2DBA9448911BDC3C241104C2F6BAE0BF62A2E32976E0FCE33ED945EA8E",
                "PreviousTxnLgrSeq": 27481755
              }
            },
            {
              "DeletedNode": {
                "FinalFields": {
                  "Amount": "100000000",
                  "Flags": 0,
                  "NFTokenID": "00082710A955EBAD4AE6261466FBEEEBF6A59591AC8C831F16E5DA9C00000001",
                  "NFTokenOfferNode": "0",
                  "Owner": "rHKjdRD2aHzEojrioJb4tw6p4i7FS1hUkc",
                  "OwnerNode": "0",
                  "PreviousTxnID": "B2E36CBAE4C0E329A0FA373DBC853AE871F9EC0371C6299FE0955F689671F015",
                  "PreviousTxnLgrSeq": 27481778
                },
                "LedgerEntryType": "NFTokenOffer",
                "LedgerIndex": "9E6D53863A5A5CC3A2FADD774BD744512AE7AFF4E6EAD77FAD4BBCE9C7746F28"
              }
            },
            {
              "DeletedNode": {
                "FinalFields": {
                  "Flags": 0,
                  "NFTokens": [
                    {
                      "NFToken": {
                        "NFTokenID": "00082710A955EBAD4AE6261466FBEEEBF6A59591AC8C831F16E5DA9C00000001",
                        "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469"
                      }
                    }
                  ],
                  "PreviousTxnID": "377B9A2DBA9448911BDC3C241104C2F6BAE0BF62A2E32976E0FCE33ED945EA8E",
                  "PreviousTxnLgrSeq": 27481755
                },
                "LedgerEntryType": "NFTokenPage",
                "LedgerIndex": "A955EBAD4AE6261466FBEEEBF6A59591AC8C831FFFFFFFFFFFFFFFFFFFFFFFFF"
              }
            },
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Account": "rHKjdRD2aHzEojrioJb4tw6p4i7FS1hUkc",
                  "Balance": "919999964",
                  "Flags": 0,
                  "OwnerCount": 1,
                  "Sequence": 27481215
                },
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "AE8FB07137E82BB9D143CE00DFE437A67EDF336EFE8A505BD749B70BF30EF4CD",
                "PreviousFields": {
                  "Balance": "1019999964"
                },
                "PreviousTxnID": "B2E36CBAE4C0E329A0FA373DBC853AE871F9EC0371C6299FE0955F689671F015",
                "PreviousTxnLgrSeq": 27481778
              }
            },
            {
              "CreatedNode": {
                "LedgerEntryType": "NFTokenPage",
                "LedgerIndex": "B30D15755A95CFCA216ABF1296FDD4511BCC313EFFFFFFFFFFFFFFFFFFFFFFFF",
                "NewFields": {
                  "NFTokens": [
                    {
                      "NFToken": {
                        "NFTokenID": "00082710A955EBAD4AE6261466FBEEEBF6A59591AC8C831F16E5DA9C00000001",
                        "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469"
                      }
                    }
                  ]
                }
              }
            },
            {
              "DeletedNode": {
                "FinalFields": {
                  "Flags": 0,
                  "Owner": "rHKjdRD2aHzEojrioJb4tw6p4i7FS1hUkc",
                  "RootIndex": "C20BE23C0678A107CFACF3AA60A7A8E912A43685FB4FC87EFE8420F146FA5E26"
                },
                "LedgerEntryType": "DirectoryNode",
                "LedgerIndex": "C20BE23C0678A107CFACF3AA60A7A8E912A43685FB4FC87EFE8420F146FA5E26"
              }
            }
          ],
          "TransactionIndex": 0,
          "TransactionResult": "tesSUCCESS"
        },
        "tx": {
          "Account": "rGS43H57KGnvsDapj796XXo3g5qWcQxqmA",
          "Fee": "12",
          "Flags": 0,
          "LastLedgerSequence": 27481810,
          "NFTokenBuyOffer": "9E6D53863A5A5CC3A2FADD774BD744512AE7AFF4E6EAD77FAD4BBCE9C7746F28",
          "Sequence": 27479931,
          "SigningPubKey": "EDFD4B44B6CA8F281C85D417EC4717579CA5BA8E74FE066BB5A27851159D350DA0",
          "TransactionType": "NFTokenAcceptOffer",
          "TxnSignature": "6C7FFDC2781A10FF342E75301D88D5A0D9B5D8B9AF02D3EDC2D07876B13D3E6441C24A86D7FBE9CE5C4E2D03D9A770BC6C388212EADCFE4D24F1E3DED3345E01",
          "hash": "F53B8310C329774829EE89D0D373673D8AFC4178BB989CEDCDDE94E40FD0B6CD",
          "ledger_index": 27481792,
          "date": 733964382
        },
        "validated": true
      },
      {
        "meta": {
          "AffectedNodes": [
            {
              "CreatedNode": {
                "LedgerEntryType": "DirectoryNode",
                "LedgerIndex": "33A64DE4A5B00FDB23036216653F1059C5ED7546E502DE878500DF667D61551E",
                "NewFields": {
                  "Flags": 1,
                  "NFTokenID": "00082710A955EBAD4AE6261466FBEEEBF6A59591AC8C831F16E5DA9C00000001",
                  "RootIndex": "33A64DE4A5B00FDB23036216653F1059C5ED7546E502DE878500DF667D61551E"
                }
              }
            },
            {
              "CreatedNode": {
                "LedgerEntryType": "NFTokenOffer",
                "LedgerIndex": "9E6D53863A5A5CC3A2FADD774BD744512AE7AFF4E6EAD77FAD4BBCE9C7746F28",
                "NewFields": {
                  "Amount": "100000000",
                  "NFTokenID": "00082710A955EBAD4AE6261466FBEEEBF6A59591AC8C831F16E5DA9C00000001",
                  "Owner": "rHKjdRD2aHzEojrioJb4tw6p4i7FS1hUkc"
                }
              }
            },
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Account": "rHKjdRD2aHzEojrioJb4tw6p4i7FS1hUkc",
                  "Balance": "1019999964",
                  "Flags": 0,
                  "OwnerCount": 1,
                  "Sequence": 27481215
                },
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "AE8FB07137E82BB9D143CE00DFE437A67EDF336EFE8A505BD749B70BF30EF4CD",
                "PreviousFields": {
                  "Balance": "1019999976",
                  "OwnerCount": 0,
                  "Sequence": 27481214
                },
                "PreviousTxnID": "6455F2D867E7F9C54C725A4AC86B3940277F1E21A0021E5CED1BC2E8D920677F",
                "PreviousTxnLgrSeq": 27481410
              }
            },
            {
              "CreatedNode": {
                "LedgerEntryType": "DirectoryNode",
                "LedgerIndex": "C20BE23C0678A107CFACF3AA60A7A8E912A43685FB4FC87EFE8420F146FA5E26",
                "NewFields": {
                  "Owner": "rHKjdRD2aHzEojrioJb4tw6p4i7FS1hUkc",
                  "RootIndex": "C20BE23C0678A107CFACF3AA60A7A8E912A43685FB4FC87EFE8420F146FA5E26"
                }
              }
            }
          ],
          "TransactionIndex": 0,
          "TransactionResult": "tesSUCCESS"
        },
        "tx": {
          "Account": "rHKjdRD2aHzEojrioJb4tw6p4i7FS1hUkc",
          "Amount": "100000000",
          "Fee": "12",
          "Flags": 0,
          "LastLedgerSequence": 27481796,
          "NFTokenID": "00082710A955EBAD4AE6261466FBEEEBF6A59591AC8C831F16E5DA9C00000001",
          "Owner": "rGS43H57KGnvsDapj796XXo3g5qWcQxqmA",
          "Sequence": 27481214,
          "SigningPubKey": "ED196A74C27132D2D1563E50841B6FE1D7AE2EF331E3B2BE889DA88CE1A7974637",
          "TransactionType": "NFTokenCreateOffer",
          "TxnSignature": "C59B5E3CD80DACC2573A2D197F073DD1F4EA8E5DF4AE9572A724BD0F405349C48B0A462696C3CE5E9B12A86BC2FBDA9974CA3D6C864053D1DE179F347C06FC01",
          "hash": "B2E36CBAE4C0E329A0FA373DBC853AE871F9EC0371C6299FE0955F689671F015",
          "ledger_index": 27481778,
          "date": 733964341
        },
        "validated": true
      },
      {
        "meta": {
          "AffectedNodes": [
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Account": "rGS43H57KGnvsDapj796XXo3g5qWcQxqmA",
                  "Balance": "979999940",
                  "BurnedNFTokens": 1,
                  "Flags": 0,
                  "MintedNFTokens": 2,
                  "OwnerCount": 1,
                  "Sequence": 27479931
                },
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "6745C90D426A198852939F3F3B97C8467C16147969BF68C773702BED477F4C1B",
                "PreviousFields": {
                  "Balance": "979999952",
                  "MintedNFTokens": 1,
                  "OwnerCount": 0,
                  "Sequence": 27479930
                },
                "PreviousTxnID": "79FA1C8DD916E147892D765CBE798D8D7C0073FF6BF64ED3A80DCA79ABFA065E",
                "PreviousTxnLgrSeq": 27481745
              }
            },
            {
              "CreatedNode": {
                "LedgerEntryType": "NFTokenPage",
                "LedgerIndex": "A955EBAD4AE6261466FBEEEBF6A59591AC8C831FFFFFFFFFFFFFFFFFFFFFFFFF",
                "NewFields": {
                  "NFTokens": [
                    {
                      "NFToken": {
                        "NFTokenID": "00082710A955EBAD4AE6261466FBEEEBF6A59591AC8C831F16E5DA9C00000001",
                        "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469"
                      }
                    }
                  ]
                }
              }
            }
          ],
          "TransactionIndex": 0,
          "TransactionResult": "tesSUCCESS"
        },
        "tx": {
          "Account": "rGS43H57KGnvsDapj796XXo3g5qWcQxqmA",
          "Fee": "12",
          "Flags": 8,
          "LastLedgerSequence": 27481774,
          "NFTokenTaxon": 0,
          "Sequence": 27479930,
          "SigningPubKey": "EDFD4B44B6CA8F281C85D417EC4717579CA5BA8E74FE066BB5A27851159D350DA0",
          "TransactionType": "NFTokenMint",
          "TransferFee": 10000,
          "TxnSignature": "C95A7819CA1F5229B0818FEBD21DA28892FB64CD70C169D0E4911688E57047CDEFAD273A72D255BC388BE5A96FCBF26657C62EFBC240746047D818A219BB8A0F",
          "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469",
          "hash": "377B9A2DBA9448911BDC3C241104C2F6BAE0BF62A2E32976E0FCE33ED945EA8E",
          "ledger_index": 27481755,
          "date": 733964271
        },
        "validated": true
      }
    ],
    "nft_id": "00082710A955EBAD4AE6261466FBEEEBF6A59591AC8C831F16E5DA9C00000001",
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

*JSON-RPC*

```json
"result": {
    "ledger_index_min": 21377274,
    "ledger_index_max": 27482261,
    "transactions": [
      {
        "meta": {
          "AffectedNodes": [
            {
              "DeletedNode": {
                "FinalFields": {
                  "Flags": 1,
                  "NFTokenID": "00082710A955EBAD4AE6261466FBEEEBF6A59591AC8C831F16E5DA9C00000001",
                  "RootIndex": "33A64DE4A5B00FDB23036216653F1059C5ED7546E502DE878500DF667D61551E"
                },
                "LedgerEntryType": "DirectoryNode",
                "LedgerIndex": "33A64DE4A5B00FDB23036216653F1059C5ED7546E502DE878500DF667D61551E"
              }
            },
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Account": "rGS43H57KGnvsDapj796XXo3g5qWcQxqmA",
                  "Balance": "1079999928",
                  "BurnedNFTokens": 1,
                  "Flags": 0,
                  "MintedNFTokens": 2,
                  "OwnerCount": 0,
                  "Sequence": 27479932
                },
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "6745C90D426A198852939F3F3B97C8467C16147969BF68C773702BED477F4C1B",
                "PreviousFields": {
                  "Balance": "979999940",
                  "OwnerCount": 1,
                  "Sequence": 27479931
                },
                "PreviousTxnID": "377B9A2DBA9448911BDC3C241104C2F6BAE0BF62A2E32976E0FCE33ED945EA8E",
                "PreviousTxnLgrSeq": 27481755
              }
            },
            {
              "DeletedNode": {
                "FinalFields": {
                  "Amount": "100000000",
                  "Flags": 0,
                  "NFTokenID": "00082710A955EBAD4AE6261466FBEEEBF6A59591AC8C831F16E5DA9C00000001",
                  "NFTokenOfferNode": "0",
                  "Owner": "rHKjdRD2aHzEojrioJb4tw6p4i7FS1hUkc",
                  "OwnerNode": "0",
                  "PreviousTxnID": "B2E36CBAE4C0E329A0FA373DBC853AE871F9EC0371C6299FE0955F689671F015",
                  "PreviousTxnLgrSeq": 27481778
                },
                "LedgerEntryType": "NFTokenOffer",
                "LedgerIndex": "9E6D53863A5A5CC3A2FADD774BD744512AE7AFF4E6EAD77FAD4BBCE9C7746F28"
              }
            },
            {
              "DeletedNode": {
                "FinalFields": {
                  "Flags": 0,
                  "NFTokens": [
                    {
                      "NFToken": {
                        "NFTokenID": "00082710A955EBAD4AE6261466FBEEEBF6A59591AC8C831F16E5DA9C00000001",
                        "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469"
                      }
                    }
                  ],
                  "PreviousTxnID": "377B9A2DBA9448911BDC3C241104C2F6BAE0BF62A2E32976E0FCE33ED945EA8E",
                  "PreviousTxnLgrSeq": 27481755
                },
                "LedgerEntryType": "NFTokenPage",
                "LedgerIndex": "A955EBAD4AE6261466FBEEEBF6A59591AC8C831FFFFFFFFFFFFFFFFFFFFFFFFF"
              }
            },
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Account": "rHKjdRD2aHzEojrioJb4tw6p4i7FS1hUkc",
                  "Balance": "919999964",
                  "Flags": 0,
                  "OwnerCount": 1,
                  "Sequence": 27481215
                },
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "AE8FB07137E82BB9D143CE00DFE437A67EDF336EFE8A505BD749B70BF30EF4CD",
                "PreviousFields": {
                  "Balance": "1019999964"
                },
                "PreviousTxnID": "B2E36CBAE4C0E329A0FA373DBC853AE871F9EC0371C6299FE0955F689671F015",
                "PreviousTxnLgrSeq": 27481778
              }
            },
            {
              "CreatedNode": {
                "LedgerEntryType": "NFTokenPage",
                "LedgerIndex": "B30D15755A95CFCA216ABF1296FDD4511BCC313EFFFFFFFFFFFFFFFFFFFFFFFF",
                "NewFields": {
                  "NFTokens": [
                    {
                      "NFToken": {
                        "NFTokenID": "00082710A955EBAD4AE6261466FBEEEBF6A59591AC8C831F16E5DA9C00000001",
                        "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469"
                      }
                    }
                  ]
                }
              }
            },
            {
              "DeletedNode": {
                "FinalFields": {
                  "Flags": 0,
                  "Owner": "rHKjdRD2aHzEojrioJb4tw6p4i7FS1hUkc",
                  "RootIndex": "C20BE23C0678A107CFACF3AA60A7A8E912A43685FB4FC87EFE8420F146FA5E26"
                },
                "LedgerEntryType": "DirectoryNode",
                "LedgerIndex": "C20BE23C0678A107CFACF3AA60A7A8E912A43685FB4FC87EFE8420F146FA5E26"
              }
            }
          ],
          "TransactionIndex": 0,
          "TransactionResult": "tesSUCCESS"
        },
        "tx": {
          "Account": "rGS43H57KGnvsDapj796XXo3g5qWcQxqmA",
          "Fee": "12",
          "Flags": 0,
          "LastLedgerSequence": 27481810,
          "NFTokenBuyOffer": "9E6D53863A5A5CC3A2FADD774BD744512AE7AFF4E6EAD77FAD4BBCE9C7746F28",
          "Sequence": 27479931,
          "SigningPubKey": "EDFD4B44B6CA8F281C85D417EC4717579CA5BA8E74FE066BB5A27851159D350DA0",
          "TransactionType": "NFTokenAcceptOffer",
          "TxnSignature": "6C7FFDC2781A10FF342E75301D88D5A0D9B5D8B9AF02D3EDC2D07876B13D3E6441C24A86D7FBE9CE5C4E2D03D9A770BC6C388212EADCFE4D24F1E3DED3345E01",
          "hash": "F53B8310C329774829EE89D0D373673D8AFC4178BB989CEDCDDE94E40FD0B6CD",
          "ledger_index": 27481792,
          "date": 733964382
        },
        "validated": true
      },
      {
        "meta": {
          "AffectedNodes": [
            {
              "CreatedNode": {
                "LedgerEntryType": "DirectoryNode",
                "LedgerIndex": "33A64DE4A5B00FDB23036216653F1059C5ED7546E502DE878500DF667D61551E",
                "NewFields": {
                  "Flags": 1,
                  "NFTokenID": "00082710A955EBAD4AE6261466FBEEEBF6A59591AC8C831F16E5DA9C00000001",
                  "RootIndex": "33A64DE4A5B00FDB23036216653F1059C5ED7546E502DE878500DF667D61551E"
                }
              }
            },
            {
              "CreatedNode": {
                "LedgerEntryType": "NFTokenOffer",
                "LedgerIndex": "9E6D53863A5A5CC3A2FADD774BD744512AE7AFF4E6EAD77FAD4BBCE9C7746F28",
                "NewFields": {
                  "Amount": "100000000",
                  "NFTokenID": "00082710A955EBAD4AE6261466FBEEEBF6A59591AC8C831F16E5DA9C00000001",
                  "Owner": "rHKjdRD2aHzEojrioJb4tw6p4i7FS1hUkc"
                }
              }
            },
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Account": "rHKjdRD2aHzEojrioJb4tw6p4i7FS1hUkc",
                  "Balance": "1019999964",
                  "Flags": 0,
                  "OwnerCount": 1,
                  "Sequence": 27481215
                },
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "AE8FB07137E82BB9D143CE00DFE437A67EDF336EFE8A505BD749B70BF30EF4CD",
                "PreviousFields": {
                  "Balance": "1019999976",
                  "OwnerCount": 0,
                  "Sequence": 27481214
                },
                "PreviousTxnID": "6455F2D867E7F9C54C725A4AC86B3940277F1E21A0021E5CED1BC2E8D920677F",
                "PreviousTxnLgrSeq": 27481410
              }
            },
            {
              "CreatedNode": {
                "LedgerEntryType": "DirectoryNode",
                "LedgerIndex": "C20BE23C0678A107CFACF3AA60A7A8E912A43685FB4FC87EFE8420F146FA5E26",
                "NewFields": {
                  "Owner": "rHKjdRD2aHzEojrioJb4tw6p4i7FS1hUkc",
                  "RootIndex": "C20BE23C0678A107CFACF3AA60A7A8E912A43685FB4FC87EFE8420F146FA5E26"
                }
              }
            }
          ],
          "TransactionIndex": 0,
          "TransactionResult": "tesSUCCESS"
        },
        "tx": {
          "Account": "rHKjdRD2aHzEojrioJb4tw6p4i7FS1hUkc",
          "Amount": "100000000",
          "Fee": "12",
          "Flags": 0,
          "LastLedgerSequence": 27481796,
          "NFTokenID": "00082710A955EBAD4AE6261466FBEEEBF6A59591AC8C831F16E5DA9C00000001",
          "Owner": "rGS43H57KGnvsDapj796XXo3g5qWcQxqmA",
          "Sequence": 27481214,
          "SigningPubKey": "ED196A74C27132D2D1563E50841B6FE1D7AE2EF331E3B2BE889DA88CE1A7974637",
          "TransactionType": "NFTokenCreateOffer",
          "TxnSignature": "C59B5E3CD80DACC2573A2D197F073DD1F4EA8E5DF4AE9572A724BD0F405349C48B0A462696C3CE5E9B12A86BC2FBDA9974CA3D6C864053D1DE179F347C06FC01",
          "hash": "B2E36CBAE4C0E329A0FA373DBC853AE871F9EC0371C6299FE0955F689671F015",
          "ledger_index": 27481778,
          "date": 733964341
        },
        "validated": true
      },
      {
        "meta": {
          "AffectedNodes": [
            {
              "ModifiedNode": {
                "FinalFields": {
                  "Account": "rGS43H57KGnvsDapj796XXo3g5qWcQxqmA",
                  "Balance": "979999940",
                  "BurnedNFTokens": 1,
                  "Flags": 0,
                  "MintedNFTokens": 2,
                  "OwnerCount": 1,
                  "Sequence": 27479931
                },
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "6745C90D426A198852939F3F3B97C8467C16147969BF68C773702BED477F4C1B",
                "PreviousFields": {
                  "Balance": "979999952",
                  "MintedNFTokens": 1,
                  "OwnerCount": 0,
                  "Sequence": 27479930
                },
                "PreviousTxnID": "79FA1C8DD916E147892D765CBE798D8D7C0073FF6BF64ED3A80DCA79ABFA065E",
                "PreviousTxnLgrSeq": 27481745
              }
            },
            {
              "CreatedNode": {
                "LedgerEntryType": "NFTokenPage",
                "LedgerIndex": "A955EBAD4AE6261466FBEEEBF6A59591AC8C831FFFFFFFFFFFFFFFFFFFFFFFFF",
                "NewFields": {
                  "NFTokens": [
                    {
                      "NFToken": {
                        "NFTokenID": "00082710A955EBAD4AE6261466FBEEEBF6A59591AC8C831F16E5DA9C00000001",
                        "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469"
                      }
                    }
                  ]
                }
              }
            }
          ],
          "TransactionIndex": 0,
          "TransactionResult": "tesSUCCESS"
        },
        "tx": {
          "Account": "rGS43H57KGnvsDapj796XXo3g5qWcQxqmA",
          "Fee": "12",
          "Flags": 8,
          "LastLedgerSequence": 27481774,
          "NFTokenTaxon": 0,
          "Sequence": 27479930,
          "SigningPubKey": "EDFD4B44B6CA8F281C85D417EC4717579CA5BA8E74FE066BB5A27851159D350DA0",
          "TransactionType": "NFTokenMint",
          "TransferFee": 10000,
          "TxnSignature": "C95A7819CA1F5229B0818FEBD21DA28892FB64CD70C169D0E4911688E57047CDEFAD273A72D255BC388BE5A96FCBF26657C62EFBC240746047D818A219BB8A0F",
          "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469",
          "hash": "377B9A2DBA9448911BDC3C241104C2F6BAE0BF62A2E32976E0FCE33ED945EA8E",
          "ledger_index": 27481755,
          "date": 733964271
        },
        "validated": true
      }
    ],
    "nft_id": "00082710A955EBAD4AE6261466FBEEEBF6A59591AC8C831F16E5DA9C00000001",
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

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`            | Type                       | Description                |
|:-------------------|:---------------------------|:---------------------------|
| `nft_id`           | String                     | A unique identifier for the non-fungible token (NFT). |
| `ledger_index_min` | Integer - [Ledger Index][] | The ledger index of the earliest ledger actually searched for transactions. |
| `ledger_index_max` | Integer - [Ledger Index][] | The ledger index of the most recent ledger actually searched for transactions. |
| `limit`            | Integer                    | The `limit` value used in the request. (This may differ from the actual limit value enforced by the server.) |
| `marker`           | [Marker][]                 | Server-defined value indicating the response is paginated. Pass this to the next call to resume where this call left off. |
| `transactions`     | Array                      | Array of transactions matching the request's criteria, as explained below. |
| `validated`        | Boolean                    | If included and set to `true`, the information in this response comes from a validated ledger version. Otherwise, the information is subject to change. |

**Note:** The server may respond with different values of `ledger_index_min` and `ledger_index_max` than you provided in the request, for example if it did not have the versions you specified on hand.

Each transaction object includes the following fields, depending on whether it was requested in JSON or hex string (`"binary":true`) format.

| `Field`        | Type                             | Description              |
|:---------------|:---------------------------------|:-------------------------|
| `ledger_index` | Integer                          | The [ledger index][] of the ledger version that included this transaction. |
| `meta`         | Object (JSON) or String (Binary) | If `binary` is True, then this is a hex string of the transaction metadata. Otherwise, the transaction metadata is included in JSON format. |
| `tx`           | Object                           | (JSON mode only) JSON object defining the transaction |
| `tx_blob`      | String                           | (Binary mode only) Unique hashed String representing the transaction. |
| `validated`    | Boolean                          | Whether or not the transaction is included in a validated ledger. Any transaction not yet in a validated ledger is subject to change. |

For definitions of the fields returned in the `tx` object, see [Transaction Metadata](transaction-metadata.html).

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `actMalformed` - The [Address][] specified in the `account` field of the request is not formatted properly.
* `lgrIdxMalformed` - The ledger specified by the `ledger_index_min` or `ledger_index_max` does not exist, or if it does exist but the server does not have it.
* `lgrIdxsInvalid` - Either the request specifies a `ledger_index_max` that is before the `ledger_index_min`, or the server does not have a validated ledger range because it is [not synced with the network](server-doesnt-sync.html).

{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}

