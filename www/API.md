#Introduction
## Ripple Concepts
## Getting Started
### Setup
### Making a call
### Errors
### API Objects
#### 1. Amount

All currencies on the Ripple Network have issuers, except for XRP. In the case of XRP, the `"issuer"` field may be omitted or set to `""`. Otherwise, the `"issuer"` must be a valid Ripple address of the gateway that issues the currency.

>Amount Object:

```js
{
  "value": "1.0",
  "currency": "USD",
  "issuer": "r..."
}
```

For more information about XRP see [the Ripple Wiki page on XRP](https://ripple.com/wiki/XRP). For more information about using currencies other than XRP on the Ripple Network see [the Ripple Wiki page for gateways](https://ripple.com/wiki/Ripple_for_Gateways).

#### 2. Payment

The `Payment` object is a simplified version of the standard Ripple transaction format. 

This `Payment` format is intended to be straightforward to create and parse, from strongly or loosely typed programming languages. Once a transaction is processed and validated it also includes information about the final details of the payment.

The following fields are the minimum required to submit a `Payment`:
```js
{
  "src_address": "rKXCummUHnenhYudNb9UoJ4mGBR75vFcgz",
  "dst_address": "rNw4ozCG514KEjPs5cDrqEcdsi31Jtfm5r",
  "dst_amount": {
    "value": "0.001",
    "currency": "XRP",
    "issuer": ""
  }
}
```
+ `dst_amount` is an [`Amount` object](#1-amount)

The full set of fields accepted on `Payment` submission is as follows:

+ `src_tag` is an optional unsigned 32 bit integer (0-4294967294, inclusive) that is generally used if the sender is a hosted wallet at a gateway. This should be the same as the `dst_tag` used to identify the hosted wallet when they are receiving a payment.
+ `dst_tag` is an optional unsigned 32 bit integer (0-4294967294, inclusive) that is generally used if the receiver is a hosted wallet at a gateway
+ `src_slippage` can be specified to give the `src_amount` a cushion and increase its chance of being processed successfully. This is helpful if the payment path changes slightly between the time when a payment options quote is given and when the payment is submitted. The `src_address` will never be charged more than `src_slippage` + the `value` specified in `src_amount`
+ `invoice_id` is an optional 256-bit hash field that can be used to link payments to an invoice or bill
+ `paths` is a "stringified" version of the Ripple PathSet structure. Most users of this API will want to treat this field as opaque. See the [Ripple Wiki](https://ripple.com/wiki/Payment_paths) for more information about Ripple pathfinding
+ `flag_no_direct_ripple` is a boolean that can be set to `true` if `paths` are specified and the sender would like the Ripple Network to disregard any direct paths from the `src_address` to the `dst_address`. This may be used to take advantage of an arbitrage opportunity or by gateways wishing to issue balances from a hot wallet to a user who has mistakenly set a trustline directly to the hot wallet. Most users will not need to use this option.
+ `flag_partial_payment` is a boolean that, if set to true, indicates that this payment should go through even if the whole amount cannot be sent because of a lack of liquidity or funds in the `src_address` account. The vast majority of senders will never need to use this option.

```js
{
    /* User Specified */

    "src_address": "rKXCummUHnenhYudNb9UoJ4mGBR75vFcgz",
    "src_tag": "",
    "src_amount": {
        "value": "0.001",
        "currency": "XRP",
        "issuer": ""
    },
    "src_slippage": "0",
    "dst_address": "rNw4ozCG514KEjPs5cDrqEcdsi31Jtfm5r",
    "dst_tag": "",
    "dst_amount": {
        "value": "0.001",
        "currency": "XRP",
        "issuer": ""
    },

    /* Advanced Options */

    "invoice_id": "",
    "paths": "[]",
    "flag_no_direct_ripple": false,
    "flag_partial_payment": false
}
```


When a payment is confirmed in the Ripple ledger, it will have additional fields added:

+ `tx_result` will be `tesSUCCESS` if the transaction was successfully processed. If it was unsuccessful but a transaction fee was claimed the code will start with `tec`. More information about transaction errors can be found on the [Ripple Wiki](https://ripple.com/wiki/Transaction_errors).
+ `tx_timestamp` is the UNIX timestamp for when the transaction was validated
+ `tx_fee` is the network transaction fee charged for processing the transaction. For more information on fees, see the [Ripple Wiki](https://ripple.com/wiki/Transaction_fees). In the standard Ripple transaction format fees are expressed in drops, or millionths of an XRP, but for clarity the new formats introduced by this API always use the full XRP unit.
+ `tx_src_bals_dec` is an array of [`Amount`](#1-amount) objects representing all of the balance changes of the `src_address` caused by the payment. Note that this includes the `tx_fee`
+ `tx_dst_bals_inc` is an array of [`Amount`](#1-amount) objects representing all of the balance changes of the `dst_address` caused by the payment
```js
{
    /* User Specified */

    "src_address": "rKXCummUHnenhYudNb9UoJ4mGBR75vFcgz",
    "src_tag": "",
    "src_amount": {
        "value": "0.001",
        "currency": "XRP",
        "issuer": ""
    },
    "src_slippage": "0",
    "dst_address": "rNw4ozCG514KEjPs5cDrqEcdsi31Jtfm5r",
    "dst_tag": "",
    "dst_amount": {
        "value": "0.001",
        "currency": "XRP",
        "issuer": ""
    },

    /* Advanced Options */

    "invoice_id": "",
    "paths": "[]",
    "flag_no_direct_ripple": false,
    "flag_partial_payment": false,

    /* Generated After Validation */

    "tx_direction": "outgoing",
    "tx_state": "confirmed",
    "tx_result": "tesSUCCESS",
    "tx_ledger": 4696959,
    "tx_hash": "55BA3440B1AAFFB64E51F497EFDF2022C90EDB171BBD979F04685904E38A89B7",
    "tx_timestamp": 1391025100000,
    "tx_fee": "0.000012",
    "tx_src_bals_dec": [{
        "value": "-0.001012",
        "currency": "XRP",
        "issuer": ""
    }],
    "tx_dst_bals_inc": [{
        "value": "0.001",
        "currency": "XRP",
        "issuer": ""
    }]
}
```

#### 3. Notification

Notifications are new type of object not used elsewhere on the Ripple Network but intended to simplify the process of monitoring accounts for new activity.

If there is a new `Notification` for an account it will contain information about the type of transaction that affected the account, as well as a link to the full details of the transaction and a link to get the next notification. 


If there is a new `notification` for an account, it will come in this format:

```js
{
  "address": "rKXCummUHnenhYudNb9UoJ4mGBR75vFcgz",
  "type": "payment",
  "tx_direction": "outgoing",
  "tx_state": "confirmed",
  "tx_result": "tesSUCCESS",
  "tx_ledger": 4696959,
  "tx_hash": "55BA3440B1AAFFB64E51F497EFDF2022C90EDB171BBD979F04685904E38A89B7",
  "tx_timestamp": 1391025100000,
  "tx_url": "http://ripple-rest.herokuapp.com/api/v1/addresses/rKXCummUHnenhYudNb9UoJ4mGBR75vFcgz/payments/55BA3440B1AAFFB64E51F497EFDF2022C90EDB171BBD979F04685904E38A89B7",
  "next_notification_url": "http://ripple-rest.herokuapp.com/api/v1/addresses/rKXCummUHnenhYudNb9UoJ4mGBR75vFcgz/next_notification/55BA3440B1AAFFB64E51F497EFDF2022C90EDB171BBD979F04685904E38A89B7"
  "confirmation_token": "55BA3440B1AAFFB64E51F497EFDF2022C90EDB171BBD979F04685904E38A89B7"
}
```
+ `tx_timestamp` is the UNIX timestamp for when the transaction was validated
+ `tx_url` is a URL that can be queried to retrieve the full details of the transaction. If it the transaction is a payment it will be returned in the `Payment` object format, otherwise it will be returned in the standard Ripple transaction format
+ `next_notification_url` is a URL that can be queried to get the notification following this one for the given address
+ `confirmation_token` is a temporary string that is returned upon transaction submission and can be matched against account notifications to confirm that the transaction was processed


If there are no new notifications, the empty `Notification` object will be returned in this format:
```js
{
  "address": "rKXCummUHnenhYudNb9UoJ4mGBR75vFcgz",
  "type": "none",
  "tx_direction": "",
  "tx_state": "empty",
  "tx_result": "",
  "tx_ledger": "",
  "tx_hash": "",
  "tx_timestamp": ,
  "tx_url": "",
  "next_notification_url": "http://ripple-rest.herokuapp.com/api/v1/addresses/rKXCummUHnenhYudNb9UoJ4mGBR75vFcgz/next_notification/55BA3440B1AAFFB64E51F497EFDF2022C90EDB171BBD979F04685904E38A89B7",
  "confirmation_token": ""
}
```
+ `type` will be `none` if there are no new notifications
+ `tx_state` will be `pending` if there are still transactions waiting to clear and `empty` otherwise
+ `next_notification_url` will be provided whether there are new notifications or not so that that field can always be used to query the API for new notifications.

#Payments
## Preparing a Payment

## Submitting a Payment
## Confirming a Payment

#Notifications
## Retrieving a Payment

#Generic Ripple Transactions

#Rippled Server Status
## Check 'rippled' Status


