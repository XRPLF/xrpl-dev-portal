# Checks Tutorials

Checks in the XRP Ledger are similar to paper personal checks. This tutorial steps through the following processes for using Checks:

- [Send a Check](#send-a-check)
- Look for incoming Checks
- Look for outgoing Checks
- Cash a Check for an exact amount
- Cash a Check for a flexible amount
- [Cancel a Check](#cancel-a-check)


<!--{# Accounts used in old examples:
rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo snkuWqxoqt6aeykTbkEWrTMJHrWGM (as the sender)
rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy sn2Zh1tRZyodU9qNy9tMnQr9UbBss (as the dest.)

new examples:
rBXsgNkPcDN2runsvWmwxk3Lh97zdgo9za ssqSRChhs5qTiUzn9jYf25khmQuwL as the sender
rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis sn2DreVBky7kzbXJoaUMXMKCR8HAc as the receiver
#}-->

## Send a Check

Sending a Check involves sending a [CheckCreate transaction][], which creates a [Check object in the ledger](reference-ledger-format.html#check). Most of the fields of a CheckCreate transaction are similar to the fields of a (push) [Payment][], because a Check is like writing permission for an intended recipient to pull a payment from you. You can create a check for XRP or an issued currency.

### Prerequisites

To send a Check with this tutorial, you need the following:

- The **address** and **secret key** of a funded account to send the Check from.
    - You can use the [XRP Ledger Test Net Faucet](https://ripple.com/build/xrp-test-net/) to get a funded address and secret with 10,000 Test Net XRP.
- The **address** of a funded account to receive the Check.
- A secure way to sign transactions, such as [RippleAPI][] or your own [`rippled` server](tutorial-rippled-setup.html).
- A client library that can connect to a `rippled` server, such as [RippleAPI][] or any HTTP or WebSocket library.
    - For more information, see [Connecting to `rippled`](reference-rippled.html#connecting-to-rippled).

### 1. Prepare the CheckCreate transaction

Decide how much money the Check is for and who can cash it. Figure out the values of the [CheckCreate transaction][] fields. The following fields are the bare minimum; everything else is either optional or can be [auto-filled](reference-transaction-format.html#auto-fillable-fields) when signing:

| Field             | Value                     | Description                  |
|:------------------|:--------------------------|:-----------------------------|
| `TransactionType` | String                    | The value `CheckCreate` indicates this is a CheckCreate transaction. |
| `Account`         | String (Address)          | The address of the sender who is creating the Check. (In other words, your address.) |
| `Destination`     | String (Address)          | The address of the intended recipient who can cash the Check. |
| `SendMax`         | String or Object (Amount) | The maximum amount the sender can be debited when this Check gets cashed. For XRP, use a string representing drops of XRP. For issued currencies, use an object with `currency`, `issuer`, and `value` fields. See [Specifying Currency Amounts][] for details. If you want the recipient to be able to cash the Check for an exact amount of a non-XRP currency with a [transfer fee](concept-transfer-fees.html), remember to include an extra percentage to pay for the transfer fee. |

If you are using [RippleAPI](reference-rippleapi.html), you can use the `prepareCheckCreate()` helper method.

**Note:** RippleAPI supports Checks in versions 0.19.0 and up.

#### Example Check Preparation

This example transaction creates a Check for 100 XRP from rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo to rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy, with no expiration:

<!-- MULTICODE_BLOCK_START -->

*JSON-RPC, WebSocket, or Commandline*

```
{
  "TransactionType": "CheckCreate",
  "Account": "rBXsgNkPcDN2runsvWmwxk3Lh97zdgo9za",
  "Destination": "rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis",
  "SendMax": "100000000",
  "Expiration": 570113521,
  "InvoiceID": "46060241FABCF692D4D934BA2A6C4427CD4279083E38C77CBE642243E43BE291",
  "DestinationTag": 1,
  "Fee": "12"
}
```

*RippleAPI*

```js
{% include 'code_samples/checks/js/prepareCreate.js' %}
```

<!-- MULTICODE_BLOCK_END -->

### 2. Sign the CheckCreate transaction

The most secure way to sign a transaction is to do it locally with a signing library, such as [RippleAPI](reference-rippleapi.html). Alternatively, you can sign the transaction using the [`sign`](reference-rippled.html#sign) command, but this must be done through a trusted and encrypted connection, or through a local connection, and only to a server you control.

In all cases, note the signed transaction's identifying hash for later.

#### Example Request

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include 'code_samples/checks/js/signCreate.js' %}
```

*WebSocket*

```json
{% include 'code_samples/checks/websocket/sign-create-req.json' %}
```

*Commandline*

```bash
{% include 'code_samples/checks/cli/sign-create-req.sh' %}
```

<!-- MULTICODE_BLOCK_END -->

#### Example Response

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include 'code_samples/checks/js/sign-create-resp.txt' %}
```

*WebSocket*

```json
{% include 'code_samples/checks/websocket/sign-create-resp.json' %}
```

*Commandline*

```json
{% include 'code_samples/checks/cli/sign-create-resp.txt' %}
```

<!-- MULTICODE_BLOCK_END -->

### 3. Submit the signed transaction

Take the signed transaction blob from the previous step and submit it to a `rippled` server. You can do this safely even if you do not operate the `rippled` server. The response contains a provisional result, which should be `tesSUCCESS`, but this result is [usually not final](reference-transaction-format.html#finality-of-results). A provisional response of `terQUEUED` is also OK, since [queued transactions](concept-transaction-cost.html#queued-transactions) are generally included in the next open ledger version (usually about 10 seconds after submission).

**Tip:** If the preliminary result is `tefMAX_LEDGER`, the transaction has failed permanently because its `LastLedgerSequence` parameter is lower than the current ledger. This happens when you take longer than the expected number of ledger versions between preparing and submitting the transaction. If this occurs, [start over from step 1](#1-prepare-the-checkcreate-transaction) with a higher `LastLedgerSequence` value.

#### Example Request

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include 'code_samples/checks/js/submitCreate.js' %}
```

*WebSocket*

```json
{% include 'code_samples/checks/websocket/submit-create-req.json' %}
```

*Commandline*

```bash
{% include 'code_samples/checks/cli/submit-create-req.sh' %}
```

<!-- MULTICODE_BLOCK_END -->

#### Example Response

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include 'code_samples/checks/js/submit-create-resp.txt' %}
```

*WebSocket*

```json
{% include 'code_samples/checks/websocket/submit-create-resp.json' %}
```

*Commandline*

```json
{% include 'code_samples/checks/cli/submit-create-resp.txt' %}
```

<!-- MULTICODE_BLOCK_END -->


### 4. Wait for validation

{% include 'snippets/wait-for-validation.md' %}

### 5. Confirm final result

Use the [`tx` method](reference-rippled.html#tx) with the CheckCreate transaction's identifying hash to check its status. Look for a `"TransactionResult": "tesSUCCESS"` field in the transaction's metadata, indicating that the transaction succeeded, and the field `"validated": true` in the result, indicating that this result is final.

Look for a `CreatedNode` object in the transaction metadata to indicate that the transaction created a [Check ledger object](reference-ledger-format.html#check). The `LedgerIndex` of this object is the ID of the Check. In the following example, the Check's ID is `49647F0D748DC3FE26BDACBC57F251AADEFFF391403EC9BF87C97F67E9977FB0`.

***TODO: Is there a way to look up the Check ID using RippleAPI? As far as I can tell, there isn't. Reported as https://github.com/ripple/ripple-lib/issues/876 for now.***

#### Example Request

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```
{% include 'code_samples/checks/js/getCreateTx.js' %}
```

<!-- MULTICODE_BLOCK_END -->

#### Example Response

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```
{% include 'code_samples/checks/js/get-create-tx-resp.txt' %}
```

*WebSocket*

```json
{% include 'code_samples/checks/websocket/tx-create-resp.txt' %}
```

*Commandline*

```json
{% include 'code_samples/checks/cli/tx-create-resp.txt' %}
```

<!-- MULTICODE_BLOCK_END -->



## Cancel a Check

Canceling a Check involves sending a [CheckCancel transaction][], which removes a [Check object from the ledger](reference-ledger-format.html#check) without redeeming it. Either the sender or the recipient of a Check can cancel it before it has been redeemed. If the Check has expired, anyone can cancel it (and no one can cash it).

### Prerequisites

To cancel a Check with this tutorial, you need the following:

- You need the ID of a Check object currently in the ledger.
    - For example, the ID of the Check created in the WebSocket examples above was `84C61BE9B39B2C4A2267F67504404F1EC76678806C1B901EA781D1E3B4CE0CD9`, although you must use a different ID to go through these steps yourself.
- The **address** and **secret key** of a funded account to send the CheckCancel transaction. This address must be either the sender or the recipient of the Check, unless the Check is expired.
- A secure way to sign transactions, such as [RippleAPI][] or your own [`rippled` server](tutorial-rippled-setup.html).
- A client library that can connect to a `rippled` server, such as [RippleAPI][] or any HTTP or WebSocket library.
    - For more information, see [Connecting to `rippled`](reference-rippled.html#connecting-to-rippled).


### 1. Prepare the CheckCancel transaction

Figure out the values of the [CheckCancel transaction][] fields. The following fields are the bare minimum; everything else is either optional or can be [auto-filled](reference-transaction-format.html#auto-fillable-fields) when signing:

| Field             | Value                     | Description                  |
|:------------------|:--------------------------|:-----------------------------|
| `TransactionType` | String                    | The value `CheckCancel` indicates this is a CheckCancel transaction. |
| `Account`         | String (Address)          | The address of the sender who is canceling the Check. (In other words, your address.) |
| `CheckID`         | String                    | The ID of the Check object in the ledger to cancel. You can get this information by looking up the metadata of the CheckCreate transaction using the [`tx` method](reference-rippled.html#tx) or by looking for checks using the [`account_objects` method](reference-rippled.html#account-objects). |

If you are using [RippleAPI](reference-rippleapi.html), you can use the `prepareCheckCancel()` helper method.

**Note:** RippleAPI supports Checks in versions 0.19.0 and up.

### 2. Sign the CheckCancel transaction

***TODO: separate signing/submitting of CheckCancel***

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
### 3. Submit the signed CheckCancel transaction

***TODO: examples of submitting signed blob***

### 4. Wait for validation

{% include 'snippets/wait-for-validation.md' %}

### 5. Confirm final result

Use the [`tx` method](reference-rippled.html#tx) with the CheckCancel transaction's identifying hash to check its status. Look for a `"TransactionResult": "tesSUCCESS"` field in the transaction's metadata, indicating that the transaction succeeded, and the field `"validated": true` in the result, indicating that this result is final.

Look for a `DeletedNode` object in the transaction metadata with `"LedgerEntryType": "Check"` to indicate that the transaction removed a [Check ledger object](reference-ledger-format.html#check). The `LedgerIndex` of this object should match the ID of the Check.

#### Example Request

<!-- MULTICODE_BLOCK_START -->

*Commandline*

```bash
{% include 'code_samples/checks/cli/tx-cancel-req.sh' %}
```

<!-- MULTICODE_BLOCK_END -->


#### Example Response

<!-- MULTICODE_BLOCK_START -->

*Commandline*

```json
{% include 'code_samples/checks/cli/tx-cancel-resp.txt' %}
```

<!-- MULTICODE_BLOCK_END -->


## Cash a Check for an exact amount

As long as the Check is in the ledger and not expired, the specified recipient can cash it for up to the amount specified in the Check. (If it's an issued currency, the recipient can only cash the Check for that currency from the sender or from a specified issuer they both trust.)

Uses check id: `838766BA2B995C00744175F69A1B11E32C3DBC40E64801A4056FCBD657F57334`

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

## Cash a Check for a flexible amount

***TODO: alternative version of cashing a check with delivermin instead of amount)***


<!--{# common links TODO change this after PR#321 #}-->
[Specifying Currency Amounts]: reference-rippled.html#specifying-currency-amounts
[RippleAPI]: reference-rippleapi.html
{% include 'snippets/tx-type-links.md' %}
