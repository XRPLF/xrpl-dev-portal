# Checks Tutorial (draft)

***TODO: This whole page is just example requests and responses for now, not a finished page.***


<!--{# Just the requests and responses right now #}-->

<!--{# Accounts used in this example:
rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo snkuWqxoqt6aeykTbkEWrTMJHrWGM (as the sender)
rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy sn2Zh1tRZyodU9qNy9tMnQr9UbBss (as the dest.)

both need to be funded and the sender needs enough XRP to send and pay the reserves
Reminder: don't use these addresses for real XRP because the secrets are now public
#}-->

## Create check

CheckCreate tx rUn84→rfkE1

```
$ ./rippled submit snkuWqxoqt6aeykTbkEWrTMJHrWGM '{                                                                                                               "TransactionType": "CheckCreate",
  "Account": "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
  "Destination": "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
  "SendMax": "100000000",
  "Expiration": 570113521,
  "InvoiceID": "46060241FABCF692D4D934BA2A6C4427CD4279083E38C77CBE642243E43BE291",
  "DestinationTag": 1,
  "Fee": "12"
}'
Loading: "/home/mduo13/.config/ripple/rippled.cfg"
2018-Jan-24 01:01:20 HTTPClient:NFO Connecting to 127.0.0.1:5005

{
   "result" : {
      "engine_result" : "tesSUCCESS",
      "engine_result_code" : 0,
      "engine_result_message" : "The transaction was applied. Only final in a validated ledger.",
      "status" : "success",
      "tx_blob" : "120010228000000024000000022A21FB3DF12E00000001501146060241FABCF692D4D934BA2A6C4427CD4279083E38C77CBE642243E43BE29168400000000000000C694000000005F5E1007321022C53CD19049F32F31848DD3B3BE5CEF6A2DD1EFDA7971AB3FA49B1BAF12AEF7874473045022100CC5B7069DF8133E91216F49933A685194DDB9BDCFF8241A7EF2F838993B98BEB022016DF6D746DF13AEA0D4BC867149BFEFFAF724AB0842A823A440D0EC684D876D181147990EC5D1D8DF69E070A968D4B186986FDF06ED0831449FF0C73CA6AF9733DA805F76CA2C37776B7C46B",
      "tx_json" : {
         "Account" : "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
         "Destination" : "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
         "DestinationTag" : 1,
         "Expiration" : 570113521,
         "Fee" : "12",
         "Flags" : 2147483648,
         "InvoiceID" : "46060241FABCF692D4D934BA2A6C4427CD4279083E38C77CBE642243E43BE291",
         "SendMax" : "100000000",
         "Sequence" : 2,
         "SigningPubKey" : "022C53CD19049F32F31848DD3B3BE5CEF6A2DD1EFDA7971AB3FA49B1BAF12AEF78",
         "TransactionType" : "CheckCreate",
         "TxnSignature" : "3045022100CC5B7069DF8133E91216F49933A685194DDB9BDCFF8241A7EF2F838993B98BEB022016DF6D746DF13AEA0D4BC867149BFEFFAF724AB0842A823A440D0EC684D876D1",
         "hash" : "5463C6E08862A1FAE5EDAC12D70ADB16546A1F674930521295BC082494B62924"
      }
   }
}
```

## wait for ledger to close

or use `ledger_accept` if in standalone mode

## Confirm CheckCreate by hash with tx command

```
$ ./rippled tx 5463C6E08862A1FAE5EDAC12D70ADB16546A1F674930521295BC082494B62924
Loading: "/home/mduo13/.config/ripple/rippled.cfg"
2018-Jan-24 01:01:53 HTTPClient:NFO Connecting to 127.0.0.1:5005

{
   "result" : {
      "Account" : "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
      "Destination" : "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
      "DestinationTag" : 1,
      "Expiration" : 570113521,
      "Fee" : "12",
      "Flags" : 2147483648,
      "InvoiceID" : "46060241FABCF692D4D934BA2A6C4427CD4279083E38C77CBE642243E43BE291",
      "SendMax" : "100000000",
      "Sequence" : 2,
      "SigningPubKey" : "022C53CD19049F32F31848DD3B3BE5CEF6A2DD1EFDA7971AB3FA49B1BAF12AEF78",
      "TransactionType" : "CheckCreate",
      "TxnSignature" : "3045022100CC5B7069DF8133E91216F49933A685194DDB9BDCFF8241A7EF2F838993B98BEB022016DF6D746DF13AEA0D4BC867149BFEFFAF724AB0842A823A440D0EC684D876D1",
      "date" : 570070890,
      "hash" : "5463C6E08862A1FAE5EDAC12D70ADB16546A1F674930521295BC082494B62924",
      "inLedger" : 6,
      "ledger_index" : 6,
      "meta" : {
         "AffectedNodes" : [
            {
               "ModifiedNode" : {
                  "FinalFields" : {
                     "Flags" : 0,
                     "Owner" : "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
                     "RootIndex" : "032D861D151E38E86F46805ED1896D1A50144F65459717B6D12470A9E6E3B66E"
                  },
                  "LedgerEntryType" : "DirectoryNode",
                  "LedgerIndex" : "032D861D151E38E86F46805ED1896D1A50144F65459717B6D12470A9E6E3B66E"
               }
            },
            {
               "CreatedNode" : {
                  "LedgerEntryType" : "Check",
                  "LedgerIndex" : "49647F0D748DC3FE26BDACBC57F251AADEFFF391403EC9BF87C97F67E9977FB0",
                  "NewFields" : {
                     "Account" : "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
                     "Destination" : "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
                     "DestinationTag" : 1,
                     "Expiration" : 570113521,
                     "InvoiceID" : "46060241FABCF692D4D934BA2A6C4427CD4279083E38C77CBE642243E43BE291",
                     "SendMax" : "100000000",
                     "Sequence" : 2
                  }
               }
            },
            {
               "ModifiedNode" : {
                  "FinalFields" : {
                     "Flags" : 0,
                     "Owner" : "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
                     "RootIndex" : "AD136EC2A266027D8F202C97D294BBE32F6FC2AD5501D9853F785FE77AB94C94"
                  },
                  "LedgerEntryType" : "DirectoryNode",
                  "LedgerIndex" : "AD136EC2A266027D8F202C97D294BBE32F6FC2AD5501D9853F785FE77AB94C94"
               }
            },
            {
               "ModifiedNode" : {
                  "FinalFields" : {
                     "Account" : "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
                     "Balance" : "4999999999976",
                     "Flags" : 0,
                     "OwnerCount" : 2,
                     "Sequence" : 3
                  },
                  "LedgerEntryType" : "AccountRoot",
                  "LedgerIndex" : "D3A1DBAA28717975A9119EC4CBC891BA9A66236C484F03C9911F463AD3B66DE0",
                  "PreviousFields" : {
                     "Balance" : "4999999999988",
                     "OwnerCount" : 1,
                     "Sequence" : 2
                  },
                  "PreviousTxnID" : "5168CE1F7FB10EED87E6DD94DAE5DD910B120869E5DCE682F6995BDAEA40DACA",
                  "PreviousTxnLgrSeq" : 5
               }
            }
         ],
         "TransactionIndex" : 0,
         "TransactionResult" : "tesSUCCESS"
      },
      "status" : "success",
      "validated" : true
   }
}
```

find CreatedNode of type Check, LedgerIndex is its ID: `49647F0D748DC3FE26BDACBC57F251AADEFFF391403EC9BF87C97F67E9977FB0`

## Cancel Check

```
$ ./rippled submit snkuWqxoqt6aeykTbkEWrTMJHrWGM '{
>     "Account": "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
>     "TransactionType": "CheckCancel",
>     "CheckID": "49647F0D748DC3FE26BDACBC57F251AADEFFF391403EC9BF87C97F67E9977FB0",
>     "Fee": "12"
> }'
Loading: "/home/mduo13/.config/ripple/rippled.cfg"
2018-Jan-24 01:11:07 HTTPClient:NFO Connecting to 127.0.0.1:5005

{
   "result" : {
      "engine_result" : "tesSUCCESS",
      "engine_result_code" : 0,
      "engine_result_message" : "The transaction was applied. Only final in a validated ledger.",
      "status" : "success",
      "tx_blob" : "12001222800000002400000003501849647F0D748DC3FE26BDACBC57F251AADEFFF391403EC9BF87C97F67E9977FB068400000000000000C7321022C53CD19049F32F31848DD3B3BE5CEF6A2DD1EFDA7971AB3FA49B1BAF12AEF78744630440220615F9D19FA182F08530CD978A4C216C8676D0BA9EDB53A620AC909AA0EF0FE7E02203A09CC34C3DB85CCCB3137E78081F8F2B441FB0A3B9E40901F312D3CBA0A67A181147990EC5D1D8DF69E070A968D4B186986FDF06ED0",
      "tx_json" : {
         "Account" : "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
         "CheckID" : "49647F0D748DC3FE26BDACBC57F251AADEFFF391403EC9BF87C97F67E9977FB0",
         "Fee" : "12",
         "Flags" : 2147483648,
         "Sequence" : 3,
         "SigningPubKey" : "022C53CD19049F32F31848DD3B3BE5CEF6A2DD1EFDA7971AB3FA49B1BAF12AEF78",
         "TransactionType" : "CheckCancel",
         "TxnSignature" : "30440220615F9D19FA182F08530CD978A4C216C8676D0BA9EDB53A620AC909AA0EF0FE7E02203A09CC34C3DB85CCCB3137E78081F8F2B441FB0A3B9E40901F312D3CBA0A67A1",
         "hash" : "414558223CA8595916BB1FEF238B3BB601B7C0E52659292251CE613E6B4370F9"
      }
   }
}
```

## wait for validation / ledger_accept

## tx on checkcancel

```
$ ./rippled tx 414558223CA8595916BB1FEF238B3BB601B7C0E52659292251CE613E6B4370F9
Loading: "/home/mduo13/.config/ripple/rippled.cfg"
2018-Jan-24 01:11:53 HTTPClient:NFO Connecting to 127.0.0.1:5005

{
   "result" : {
      "Account" : "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
      "CheckID" : "49647F0D748DC3FE26BDACBC57F251AADEFFF391403EC9BF87C97F67E9977FB0",
      "Fee" : "12",
      "Flags" : 2147483648,
      "Sequence" : 3,
      "SigningPubKey" : "022C53CD19049F32F31848DD3B3BE5CEF6A2DD1EFDA7971AB3FA49B1BAF12AEF78",
      "TransactionType" : "CheckCancel",
      "TxnSignature" : "30440220615F9D19FA182F08530CD978A4C216C8676D0BA9EDB53A620AC909AA0EF0FE7E02203A09CC34C3DB85CCCB3137E78081F8F2B441FB0A3B9E40901F312D3CBA0A67A1",
      "date" : 570071520,
      "hash" : "414558223CA8595916BB1FEF238B3BB601B7C0E52659292251CE613E6B4370F9",
      "inLedger" : 7,
      "ledger_index" : 7,
      "meta" : {
         "AffectedNodes" : [
            {
               "ModifiedNode" : {
                  "FinalFields" : {
                     "Flags" : 0,
                     "Owner" : "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
                     "RootIndex" : "032D861D151E38E86F46805ED1896D1A50144F65459717B6D12470A9E6E3B66E"
                  },
                  "LedgerEntryType" : "DirectoryNode",
                  "LedgerIndex" : "032D861D151E38E86F46805ED1896D1A50144F65459717B6D12470A9E6E3B66E"
               }
            },
            {
               "DeletedNode" : {
                  "FinalFields" : {
                     "Account" : "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
                     "Destination" : "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
                     "DestinationNode" : "0000000000000000",
                     "DestinationTag" : 1,
                     "Expiration" : 570113521,
                     "Flags" : 0,
                     "InvoiceID" : "46060241FABCF692D4D934BA2A6C4427CD4279083E38C77CBE642243E43BE291",
                     "OwnerNode" : "0000000000000000",
                     "PreviousTxnID" : "5463C6E08862A1FAE5EDAC12D70ADB16546A1F674930521295BC082494B62924",
                     "PreviousTxnLgrSeq" : 6,
                     "SendMax" : "100000000",
                     "Sequence" : 2
                  },
                  "LedgerEntryType" : "Check",
                  "LedgerIndex" : "49647F0D748DC3FE26BDACBC57F251AADEFFF391403EC9BF87C97F67E9977FB0"
               }
            },
            {
               "ModifiedNode" : {
                  "FinalFields" : {
                     "Flags" : 0,
                     "Owner" : "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
                     "RootIndex" : "AD136EC2A266027D8F202C97D294BBE32F6FC2AD5501D9853F785FE77AB94C94"
                  },
                  "LedgerEntryType" : "DirectoryNode",
                  "LedgerIndex" : "AD136EC2A266027D8F202C97D294BBE32F6FC2AD5501D9853F785FE77AB94C94"
               }
            },
            {
               "ModifiedNode" : {
                  "FinalFields" : {
                     "Account" : "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
                     "Balance" : "4999999999964",
                     "Flags" : 0,
                     "OwnerCount" : 1,
                     "Sequence" : 4
                  },
                  "LedgerEntryType" : "AccountRoot",
                  "LedgerIndex" : "D3A1DBAA28717975A9119EC4CBC891BA9A66236C484F03C9911F463AD3B66DE0",
                  "PreviousFields" : {
                     "Balance" : "4999999999976",
                     "OwnerCount" : 2,
                     "Sequence" : 3
                  },
                  "PreviousTxnID" : "5463C6E08862A1FAE5EDAC12D70ADB16546A1F674930521295BC082494B62924",
                  "PreviousTxnLgrSeq" : 6
               }
            }
         ],
         "TransactionIndex" : 0,
         "TransactionResult" : "tesSUCCESS"
      },
      "status" : "success",
      "validated" : true
   }
}
```

deleted LedgerEntryType Check in metadata: √

## new checkcreate

```
$ ./rippled submit snkuWqxoqt6aeykTbkEWrTMJHrWGM '{
>   "TransactionType": "CheckCreate",
>   "Account": "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
>   "Destination": "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
>   "SendMax": "100000000",
>   "Expiration": 570113521,
>   "InvoiceID": "6F1DFD1D0FE8A32E40E1F2C05CF1C15545BAB56B617F9C6C2D63A6B704BEF59B",
>   "DestinationTag": 1,
>   "Fee": "12"
> }'
Loading: "/home/mduo13/.config/ripple/rippled.cfg"
2018-Jan-24 01:14:21 HTTPClient:NFO Connecting to 127.0.0.1:5005

{
   "result" : {
      "engine_result" : "tesSUCCESS",
      "engine_result_code" : 0,
      "engine_result_message" : "The transaction was applied. Only final in a validated ledger.",
      "status" : "success",
      "tx_blob" : "120010228000000024000000042A21FB3DF12E0000000150116F1DFD1D0FE8A32E40E1F2C05CF1C15545BAB56B617F9C6C2D63A6B704BEF59B68400000000000000C694000000005F5E1007321022C53CD19049F32F31848DD3B3BE5CEF6A2DD1EFDA7971AB3FA49B1BAF12AEF787446304402206F4500FF59F5DC8684B5715941DCD0985A4107EE7BE11795D051C47E9F14B1C402201DA5634CD532DE77A3BE2C89F30F945514F93F3689A95DE7E42FC3072B10A5B181147990EC5D1D8DF69E070A968D4B186986FDF06ED0831449FF0C73CA6AF9733DA805F76CA2C37776B7C46B",
      "tx_json" : {
         "Account" : "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
         "Destination" : "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
         "DestinationTag" : 1,
         "Expiration" : 570113521,
         "Fee" : "12",
         "Flags" : 2147483648,
         "InvoiceID" : "6F1DFD1D0FE8A32E40E1F2C05CF1C15545BAB56B617F9C6C2D63A6B704BEF59B",
         "SendMax" : "100000000",
         "Sequence" : 4,
         "SigningPubKey" : "022C53CD19049F32F31848DD3B3BE5CEF6A2DD1EFDA7971AB3FA49B1BAF12AEF78",
         "TransactionType" : "CheckCreate",
         "TxnSignature" : "304402206F4500FF59F5DC8684B5715941DCD0985A4107EE7BE11795D051C47E9F14B1C402201DA5634CD532DE77A3BE2C89F30F945514F93F3689A95DE7E42FC3072B10A5B1",
         "hash" : "0FD9F719CDE29E6F6DF752B93EB9AC6FBB493BF989F2CB63B8C0E73A8DCDF61A"
      }
   }
}
```

## validation/ledger_accept

## and tx again

```
$ ./rippled tx 0FD9F719CDE29E6F6DF752B93EB9AC6FBB493BF989F2CB63B8C0E73A8DCDF61A
Loading: "/home/mduo13/.config/ripple/rippled.cfg"
2018-Jan-24 01:14:56 HTTPClient:NFO Connecting to 127.0.0.1:5005

{
   "result" : {
      "Account" : "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
      "Destination" : "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
      "DestinationTag" : 1,
      "Expiration" : 570113521,
      "Fee" : "12",
      "Flags" : 2147483648,
      "InvoiceID" : "6F1DFD1D0FE8A32E40E1F2C05CF1C15545BAB56B617F9C6C2D63A6B704BEF59B",
      "SendMax" : "100000000",
      "Sequence" : 4,
      "SigningPubKey" : "022C53CD19049F32F31848DD3B3BE5CEF6A2DD1EFDA7971AB3FA49B1BAF12AEF78",
      "TransactionType" : "CheckCreate",
      "TxnSignature" : "304402206F4500FF59F5DC8684B5715941DCD0985A4107EE7BE11795D051C47E9F14B1C402201DA5634CD532DE77A3BE2C89F30F945514F93F3689A95DE7E42FC3072B10A5B1",
      "date" : 570071700,
      "hash" : "0FD9F719CDE29E6F6DF752B93EB9AC6FBB493BF989F2CB63B8C0E73A8DCDF61A",
      "inLedger" : 8,
      "ledger_index" : 8,
      "meta" : {
         "AffectedNodes" : [
            {
               "ModifiedNode" : {
                  "FinalFields" : {
                     "Flags" : 0,
                     "Owner" : "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
                     "RootIndex" : "032D861D151E38E86F46805ED1896D1A50144F65459717B6D12470A9E6E3B66E"
                  },
                  "LedgerEntryType" : "DirectoryNode",
                  "LedgerIndex" : "032D861D151E38E86F46805ED1896D1A50144F65459717B6D12470A9E6E3B66E"
               }
            },
            {
               "CreatedNode" : {
                  "LedgerEntryType" : "Check",
                  "LedgerIndex" : "838766BA2B995C00744175F69A1B11E32C3DBC40E64801A4056FCBD657F57334",
                  "NewFields" : {
                     "Account" : "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
                     "Destination" : "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
                     "DestinationTag" : 1,
                     "Expiration" : 570113521,
                     "InvoiceID" : "6F1DFD1D0FE8A32E40E1F2C05CF1C15545BAB56B617F9C6C2D63A6B704BEF59B",
                     "SendMax" : "100000000",
                     "Sequence" : 4
                  }
               }
            },
            {
               "ModifiedNode" : {
                  "FinalFields" : {
                     "Flags" : 0,
                     "Owner" : "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
                     "RootIndex" : "AD136EC2A266027D8F202C97D294BBE32F6FC2AD5501D9853F785FE77AB94C94"
                  },
                  "LedgerEntryType" : "DirectoryNode",
                  "LedgerIndex" : "AD136EC2A266027D8F202C97D294BBE32F6FC2AD5501D9853F785FE77AB94C94"
               }
            },
            {
               "ModifiedNode" : {
                  "FinalFields" : {
                     "Account" : "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
                     "Balance" : "4999999999952",
                     "Flags" : 0,
                     "OwnerCount" : 2,
                     "Sequence" : 5
                  },
                  "LedgerEntryType" : "AccountRoot",
                  "LedgerIndex" : "D3A1DBAA28717975A9119EC4CBC891BA9A66236C484F03C9911F463AD3B66DE0",
                  "PreviousFields" : {
                     "Balance" : "4999999999964",
                     "OwnerCount" : 1,
                     "Sequence" : 4
                  },
                  "PreviousTxnID" : "414558223CA8595916BB1FEF238B3BB601B7C0E52659292251CE613E6B4370F9",
                  "PreviousTxnLgrSeq" : 7
               }
            }
         ],
         "TransactionIndex" : 0,
         "TransactionResult" : "tesSUCCESS"
      },
      "status" : "success",
      "validated" : true
   }
}
```

new check's id: `838766BA2B995C00744175F69A1B11E32C3DBC40E64801A4056FCBD657F57334`

## Cash check (exact amount)

rfkE1 sends this one

```
$ ./rippled submit sn2Zh1tRZyodU9qNy9tMnQr9UbBss '{
>     "Account": "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
>     "TransactionType": "CheckCash",
>     "Amount": "100000000",
>     "CheckID": "838766BA2B995C00744175F69A1B11E32C3DBC40E64801A4056FCBD657F57334",
>     "Fee": "12"
> }'
Loading: "/home/mduo13/.config/ripple/rippled.cfg"
2018-Jan-24 01:17:54 HTTPClient:NFO Connecting to 127.0.0.1:5005

{
   "result" : {
      "engine_result" : "tesSUCCESS",
      "engine_result_code" : 0,
      "engine_result_message" : "The transaction was applied. Only final in a validated ledger.",
      "status" : "success",
      "tx_blob" : "120011228000000024000000015018838766BA2B995C00744175F69A1B11E32C3DBC40E64801A4056FCBD657F57334614000000005F5E10068400000000000000C732102F135B14C552968B0ABE8493CC4C5795A7484D73F6BFD01379F73456F725F66ED74473045022100C64278AC90B841CD3EA9889A4847CAB3AC9927057A34130810FAA7FAC0C6E3290220347260A4C0A6DC9B699DA12510795B2B3414E1FA222AF743226345FBAAEF937C811449FF0C73CA6AF9733DA805F76CA2C37776B7C46B",
      "tx_json" : {
         "Account" : "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
         "Amount" : "100000000",
         "CheckID" : "838766BA2B995C00744175F69A1B11E32C3DBC40E64801A4056FCBD657F57334",
         "Fee" : "12",
         "Flags" : 2147483648,
         "Sequence" : 1,
         "SigningPubKey" : "02F135B14C552968B0ABE8493CC4C5795A7484D73F6BFD01379F73456F725F66ED",
         "TransactionType" : "CheckCash",
         "TxnSignature" : "3045022100C64278AC90B841CD3EA9889A4847CAB3AC9927057A34130810FAA7FAC0C6E3290220347260A4C0A6DC9B699DA12510795B2B3414E1FA222AF743226345FBAAEF937C",
         "hash" : "0521707D510858BC8AF69D2227E1D1ADA7DB7C5B4B74115BCD0D91B62AFA8EDC"
      }
   }
}
```

## validate

## tx the checkcash for final result

```
$ ./rippled tx 0521707D510858BC8AF69D2227E1D1ADA7DB7C5B4B74115BCD0D91B62AFA8EDC
Loading: "/home/mduo13/.config/ripple/rippled.cfg"
2018-Jan-24 01:18:39 HTTPClient:NFO Connecting to 127.0.0.1:5005

{
   "result" : {
      "Account" : "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
      "Amount" : "100000000",
      "CheckID" : "838766BA2B995C00744175F69A1B11E32C3DBC40E64801A4056FCBD657F57334",
      "Fee" : "12",
      "Flags" : 2147483648,
      "Sequence" : 1,
      "SigningPubKey" : "02F135B14C552968B0ABE8493CC4C5795A7484D73F6BFD01379F73456F725F66ED",
      "TransactionType" : "CheckCash",
      "TxnSignature" : "3045022100C64278AC90B841CD3EA9889A4847CAB3AC9927057A34130810FAA7FAC0C6E3290220347260A4C0A6DC9B699DA12510795B2B3414E1FA222AF743226345FBAAEF937C",
      "date" : 570071920,
      "hash" : "0521707D510858BC8AF69D2227E1D1ADA7DB7C5B4B74115BCD0D91B62AFA8EDC",
      "inLedger" : 9,
      "ledger_index" : 9,
      "meta" : {
         "AffectedNodes" : [
            {
               "ModifiedNode" : {
                  "FinalFields" : {
                     "Flags" : 0,
                     "Owner" : "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
                     "RootIndex" : "032D861D151E38E86F46805ED1896D1A50144F65459717B6D12470A9E6E3B66E"
                  },
                  "LedgerEntryType" : "DirectoryNode",
                  "LedgerIndex" : "032D861D151E38E86F46805ED1896D1A50144F65459717B6D12470A9E6E3B66E"
               }
            },
            {
               "ModifiedNode" : {
                  "FinalFields" : {
                     "Account" : "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
                     "Balance" : "1000099999988",
                     "Flags" : 0,
                     "OwnerCount" : 0,
                     "Sequence" : 2
                  },
                  "LedgerEntryType" : "AccountRoot",
                  "LedgerIndex" : "38E1EF3284A45B090D549EFFB014ACF68927FE0884CDAF01CE3629DF90542D66",
                  "PreviousFields" : {
                     "Balance" : "1000000000000",
                     "Sequence" : 1
                  },
                  "PreviousTxnID" : "3E14D859F6B4BE923323EFC94571606455921E65173147A89BC6EDDA4374B294",
                  "PreviousTxnLgrSeq" : 5
               }
            },
            {
               "DeletedNode" : {
                  "FinalFields" : {
                     "Account" : "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
                     "Destination" : "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
                     "DestinationNode" : "0000000000000000",
                     "DestinationTag" : 1,
                     "Expiration" : 570113521,
                     "Flags" : 0,
                     "InvoiceID" : "6F1DFD1D0FE8A32E40E1F2C05CF1C15545BAB56B617F9C6C2D63A6B704BEF59B",
                     "OwnerNode" : "0000000000000000",
                     "PreviousTxnID" : "0FD9F719CDE29E6F6DF752B93EB9AC6FBB493BF989F2CB63B8C0E73A8DCDF61A",
                     "PreviousTxnLgrSeq" : 8,
                     "SendMax" : "100000000",
                     "Sequence" : 4
                  },
                  "LedgerEntryType" : "Check",
                  "LedgerIndex" : "838766BA2B995C00744175F69A1B11E32C3DBC40E64801A4056FCBD657F57334"
               }
            },
            {
               "ModifiedNode" : {
                  "FinalFields" : {
                     "Flags" : 0,
                     "Owner" : "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
                     "RootIndex" : "AD136EC2A266027D8F202C97D294BBE32F6FC2AD5501D9853F785FE77AB94C94"
                  },
                  "LedgerEntryType" : "DirectoryNode",
                  "LedgerIndex" : "AD136EC2A266027D8F202C97D294BBE32F6FC2AD5501D9853F785FE77AB94C94"
               }
            },
            {
               "ModifiedNode" : {
                  "FinalFields" : {
                     "Account" : "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
                     "Balance" : "4999899999952",
                     "Flags" : 0,
                     "OwnerCount" : 1,
                     "Sequence" : 5
                  },
                  "LedgerEntryType" : "AccountRoot",
                  "LedgerIndex" : "D3A1DBAA28717975A9119EC4CBC891BA9A66236C484F03C9911F463AD3B66DE0",
                  "PreviousFields" : {
                     "Balance" : "4999999999952",
                     "OwnerCount" : 2
                  },
                  "PreviousTxnID" : "0FD9F719CDE29E6F6DF752B93EB9AC6FBB493BF989F2CB63B8C0E73A8DCDF61A",
                  "PreviousTxnLgrSeq" : 8
               }
            }
         ],
         "TransactionIndex" : 0,
         "TransactionResult" : "tesSUCCESS"
      },
      "status" : "success",
      "validated" : true
   }
}
```

## cash check (delivermin)

***TODO: alternative version of cashing a check with delivermin instead of amount)
