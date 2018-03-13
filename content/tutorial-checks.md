# Checks Tutorials

Checks in the XRP Ledger are similar to paper personal checks. This tutorial steps through the following processes for using Checks:

- Sending a Check
- Looking for incoming Checks
- Looking for outgoing Checks
- Cashing a Check for an exact amount
- Cashing a Check for a flexible amount
- Canceling a Check

<!--{# Accounts used in these examples:
rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo snkuWqxoqt6aeykTbkEWrTMJHrWGM (as the sender)
rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy sn2Zh1tRZyodU9qNy9tMnQr9UbBss (as the dest.)
#}-->

## Sending a Check

Sending a Check involves sending a [CheckCreate transaction][], which creates a [Check object in the ledger](reference-ledger-format.html#check). Most of the fields of a CheckCreate transaction are similar to the fields of a (push) [Payment][], because a Check is like writing permission for an intended recipient to pull a payment from you. You can create a check for XRP or an issued currency.


### 1. Prepare the CheckCreate transaction

Decide how much money the Check is for and who can cash it. Figure out the values of the [CheckCreate transaction][] fields.

| Field | Value | Description |
|---|---|---|
| `Account` | String (Address) | The address of the sender who is creating the Check. (In other words, your address.) |
| `Destination` | String (Address) | The address of the intended recipient who can cash the Check. |
| `SendMax` | String or Object (Amount) | The maximum amount you can be debited when this Check gets cashed. For XRP, use a string representing drops of XRP. For issued currencies, use an object with `currency`, `issuer`, and `value` fields. See [Specifying Currency Amounts][] for details. If you want the recipient to be able to cash the Check for an exact amount of a non-XRP currency with a [transfer fee](concept-transfer-fees.html), remember to include an extra percentage to pay for the transfer fee. |

For example, here is a transaction to create a Check for 100 XRP from rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo to rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy, with an expiration time of 2018-01-24T12:52:01Z:

```
{
  "TransactionType": "CheckCreate",
  "Account": "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
  "Destination": "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
  "SendMax": "100000000",
  "Expiration": 570113521,
  "InvoiceID": "46060241FABCF692D4D934BA2A6C4427CD4279083E38C77CBE642243E43BE291",
  "DestinationTag": 1,
  "Fee": "12"
}
```

### 2. Sign the CheckCreate transaction

The most secure way to sign a transaction is to do it locally with a signing library, such as [RippleAPI](reference-rippleapi.html). Alternatively, you can sign the transaction using the [`sign`](reference-rippled.html#sign) command, but this must be done through a trusted and encrypted connection, or through a local connection, and only to a server you control.


#### Example Request

***TODO: Change this from submit to sign***

<!-- MULTICODE_BLOCK_START -->

*Commandline*

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
```

<!-- MULTICODE_BLOCK_END -->

#### Example Response

***TODO: Change this from submit to sign***

<!-- MULTICODE_BLOCK_START -->

*Commandline*

```
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

<!-- MULTICODE_BLOCK_END -->


### 3. Wait for validation

{% include 'snippets/wait-for-validation.md' %}

### 4. Confirm final result

Use the [`tx` method](reference-rippled.html#tx) with the CheckCreate transaction's identifying hash to check its status. Look for a `"TransactionResult": "tesSUCCESS"` field in the transaction's metadata, indicating that the transaction succeeded, and the field `"validated": true` in the result, indicating that this result is final.

Look for a `CreatedNode` object in the transaction metadata to indicate that the transaction created a [Check ledger object](reference-ledger-format.html#check). The `LedgerIndex` of this object is the ID of the Check. For example, in the following example, the Check's ID is `49647F0D748DC3FE26BDACBC57F251AADEFFF391403EC9BF87C97F67E9977FB0`.

<!-- MULTICODE_BLOCK_START -->

*Commandline*

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

<!-- MULTICODE_BLOCK_END -->



## Cancel a Check

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
As long as the Check is in the ledger and not expired, the specified recipient can cash it for up to the amount specified in the Check. (If it's an issued currency, the recipient can only cash the Check for that currency from the sender or from a specified issuer they both trust.)

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

***TODO: alternative version of cashing a check with delivermin instead of amount)***


<!--{# common links TODO change this after PR#321 #}-->
[Specifying Currency Amounts]: reference-rippled.html#specifying-currency-amounts
{% include 'snippets/tx-type-links.md' %}
