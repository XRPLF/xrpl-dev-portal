# Use Payment Channels

[Payment Channels](payment-channels.html) are an advanced feature for sending "asynchronous" XRP payments that can be divided into very small increments and settled later. This tutorial walks through the entire process of using a payment channel, with examples using the [JSON-RPC API](rippled-api.html) of a local [`rippled` server](the-rippled-server.html).

Ideally, to step through this tutorial, you would have two people, each with the keys to a [funded XRP Ledger account](accounts.html). However, you can also step through the tutorial as one person managing two XRP Ledger addresses.

## Example Values

The example addresses used in this tutorial are:

| | |
|--|--|
| **Payer's address** | rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH |
| **Public key used for channel (in the XRP Ledger's [base58][] encoded string format)** | aB44YfzW24VDEJQ2UuLPV2PvqcPCSoLnL7y5M1EzhdW4LnK5xMS3
| **Public key used for channel (in hex)** | 023693F15967AE357D0327974AD46FE3C127113B1110D6044FD41E723689F81CC6 |
| **Payee's address** | rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn |

**Tip:** In this example, the channel's public key is the public key from the payer's master key pair. This is perfectly safe and valid. It is also perfectly safe and valid to use a different key pair, as long as only the payer knows the public and secret keys for that key pair. <!-- Editor's note: We don't have a good page to link to explain key pairs as of time of this writing. -->

Additionally, you'll need a `rippled` server to send transactions to. The examples in this tutorial assume a `rippled` server is running on the test machine (`localhost`) with an unencrypted JSON-RPC API endpoint on port **5005**.

To test without transferring real XRP, you can use [XRP Ledger Testnet](xrp-testnet-faucet.html) addresses with Testnet XRP. If you do use the Testnet, you can use the Testnet servers' JSON-RPC API by connecting to `https://api.altnet.rippletest.net:51234` instead of `http://localhost:5005/`.

You can use any amount of XRP for the payment channels. The example values in this tutorial set aside 100 XRP (`100000000` drops) in a payment channel for at least 1 day.

## Flow Diagram
[flow diagram]: #flow-diagram

The following diagram summarizes the lifecycle of a payment channel:

[![Payment Channel Flow Diagram](img/paychan-flow.png)](img/paychan-flow.png)

You can match up the numbered steps in this diagram with the steps of this tutorial.

1. [Payer: Create channel](#1-the-payer-creates-a-payment-channel-to-a-particular-recipient)
2. [Payee: Check channel](#2-the-payee-checks-specifics-of-the-payment-channel)
3. [Payer: Sign claims](#3-the-payer-creates-one-or-more-signed-claims-for-the-xrp-in-the-channel)
4. [Payer: Send claim(s) to payee](#4-the-payer-sends-a-claim-to-the-payee-as-payment-for-goods-or-services)
5. [Payee: Verify claims](#5-the-payee-verifies-the-claims)
6. [Payee: Provide goods or services](#6-payee-provides-goods-or-services)
7. [Repeat steps 3-6 as desired](#7-repeat-steps-3-6-as-desired)
8. [Payee: Redeem claim](#8-when-ready-the-payee-redeems-a-claim-for-the-authorized-amount)
9. [Payer: Request to close channel](#9-when-the-payer-and-payee-are-done-doing-business-the-payer-requests-for-the-channel-to-be-closed)
10. [Payer (or anyone else): Close expired channel](#10-anyone-can-close-the-expired-channel)

## 1. The payer creates a payment channel to a particular recipient.

This is a [PaymentChannelCreate transaction][]. As part of this process, the payer sets certain specifics of the channel like an expiration time and a settlement delay, which affect the guarantees around the claims in the channel. The payer also sets the public key that will be used to verify claims against the channel. <!-- STYLE_OVERRIDE: will -->

**Tip:** The "settlement delay" does not delay the settlement, which can happen as fast as a ledger version closes (3-5 seconds). The "settlement delay" is a forced delay on closing the channel so that the payee has a chance to finish with settlement.

The following example shows creation of a payment channel by [submitting](submit.html#sign-and-submit-mode) to a local `rippled` server with the JSON-RPC API. The payment channel allocates 100 XRP from the [example payer](#example-values) (rN7n7...) to the [example payee](#example-values) (rf1Bi...) with a settlement delay of 1 day. The public key is the example payer's master public key, in hexadecimal.

**Note:** A payment channel counts as one object toward the payer's [owner reserve](reserves.html#owner-reserves). The owner must keep at least enough XRP to satisfy the reserve after subtracting the XRP allocated to the payment channel.

Request:

    POST http://localhost:5005/
    Content-Type: application/json

    {
        "method": "submit",
        "params": [{
            "secret": "s████████████████████████████",
            "tx_json": {
                "Account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
                "TransactionType": "PaymentChannelCreate",
                "Amount": "100000000",
                "Destination": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "SettleDelay": 86400,
                "PublicKey": "023693F15967AE357D0327974AD46FE3C127113B1110D6044FD41E723689F81CC6",
                "DestinationTag": 20170428
            },
            "fee_mult_max": 1000
        }]
    }

Response:

    200 OK

    {
        "result": {
            "engine_result": "tesSUCCESS",
            "engine_result_code": 0,
            "engine_result_message": "The transaction was applied. Only final in a validated ledger.",
            ...
            "tx_json": {
                ...
                "TransactionType": "PaymentChannelCreate",
                "hash": "3F93C482C0BC2A1387D9E67DF60BECBB76CC2160AE98522C77AF0074D548F67D"
            }
        }
    }


The immediate response to the `submit` request contains a _provisional_ result with the transaction's identifying `hash` value. The payer should check the transaction's _final_ result in a validated ledger and get the Channel ID from the metadata. This can be done with the `tx` command:

Request:

    POST http://localhost:5005/
    Content-Type: application/json

    {
        "method": "tx",
        "params": [{
            "transaction": "3F93C482C0BC2A1387D9E67DF60BECBB76CC2160AE98522C77AF0074D548F67D"
        }]
    }

Response:

    200 OK

    {
        "result": {
            "Account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
            "Amount": "100000000",
            "Destination": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            ...
            "TransactionType": "PaymentChannelCreate",
            ...
            "hash": "3F93C482C0BC2A1387D9E67DF60BECBB76CC2160AE98522C77AF0074D548F67D",
            "inLedger": 29380080,
            "ledger_index": 29380080,
            "meta": {
                "AffectedNodes": [
                    ...
                    {
                        "CreatedNode": {
                            "LedgerEntryType": "PayChannel",
                            "LedgerIndex": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
                            "NewFields": {
                                "Account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
                                "Amount": "100000000",
                                "Destination": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                                "DestinationTag": 20170428,
                                "PublicKey": "023693F15967AE357D0327974AD46FE3C127113B1110D6044FD41E723689F81CC6",
                                "SettleDelay": 86400
                            }
                        }
                    },
                    ...
                ],
                "TransactionIndex": 16,
                "TransactionResult": "tesSUCCESS"
            },
            "status": "success",
            "validated": true
        }
    }

In the response from the JSON-RPC, the payer should look for the following:

- In the transaction's `meta` field, confirm that the `TransactionResult` is `tesSUCCESS`.
- Confirm that the response has `"validated":true` to indicate the data comes from a validated ledger. (The result `tesSUCCESS` is only [final](finality-of-results.html) if it appears in a validated ledger version.)
- In the `AffectedNodes` array of the transaction's `meta` field, look for a `CreatedNode` object with the `LedgerEntryType` of `PayChannel`. The `LedgerIndex` field of the `CreatedNode` object indicates the Channel ID. (In the above example, this is a hex string starting with "5DB0...") The Channel ID is necessary later to sign claims.
    For more information on the PayChannel ledger object type, see [PayChannel ledger object](paychannel.html).


## 2. The payee checks specifics of the payment channel.

You can look up payment channels with the [account_channels method][], using the payer of the channel, as in the following example (using the JSON-RPC API):

Request:

    POST http://localhost:5005/
    Content-Type: application/json

    {
        "method": "account_channels",
        "params": [{
            "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
            "destination_account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            "ledger_index": "validated"
        }]
    }

Response:

    200 OK

    {
        "result": {
            "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
            "channels": [{
                "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
                "amount": "100000000",
                "balance": "0",
                "channel_id": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
                "destination_account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "destination_tag": 20170428,
                "public_key": "aB44YfzW24VDEJQ2UuLPV2PvqcPCSoLnL7y5M1EzhdW4LnK5xMS3",
                "public_key_hex": "023693F15967AE357D0327974AD46FE3C127113B1110D6044FD41E723689F81CC6",
                "settle_delay": 86400
            }],
            "status": "success"
        }
    }

The payee should check that the parameters of the payment channel are suitable for their specific use case, including all of the following:

- Confirm the `destination_account` field has the payee's correct address.
- Confirm the `settle_delay` field has a settlement delay in seconds that provides enough time for the payee to redeem outstanding claims.
- Confirm the fields `cancel_after` (immutable expiration) and `expiration` (mutable expiration), if they are present, are not too soon. The payee should take note of these times so they can be sure to redeem claims before then.
- Take note of the `public_key` and `channel_id` fields. These are necessary later to verify and redeem claims.
- _(Optional)_ Confirm the `destination_tag` field is present and has a desired destination tag.

Since there can be multiple channels between the same two parties, it is important for the payee to check the qualities of the correct channel. If there is any chance of confusion, the payer should clarify the Channel ID (`channel_id`) of the channel to use.


## 3. The payer creates one or more signed _claims_ for the XRP in the channel.

The amounts of these claims depends on the specific goods or services the payer wants to pay for.

Each claim must be for a cumulative amount. In other words, to buy two items at 10 XRP each, the first claim should have an amount of 10 XRP and the second claim should have an amount of 20 XRP. The claim can never be more than the total amount of XRP allocated to the channel. (A [PaymentChannelFund][] transaction can increase the total amount of XRP allocated to the channel.)

You can create claims with the [channel_authorize method][]. The following example authorizes 1 XRP from the channel:

Request:

    POST http://localhost:5005/
    Content-Type: application/json

    {
        "method": "channel_authorize",
        "params": [{
            "channel_id": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
            "secret": "s████████████████████████████",
            "amount": "1000000"
        }]
    }

Response:

    {
        "result": {
            "signature": "304402204EF0AFB78AC23ED1C472E74F4299C0C21F1B21D07EFC0A3838A420F76D783A400220154FB11B6F54320666E4C36CA7F686C16A3A0456800BBC43746F34AF50290064",
            "status": "success"
        }
    }


## 4. The payer sends a claim to the payee as payment for goods or services.

This communication happens "off-ledger" in any communication system the payer and payee can agree to. You should use secure communications for this, but it's not strictly necessary. Only the payer or payee of a channel can redeem claims against that channel.

The exact format of the claim is not important as long as it communicates the following information:

| Field                   | Example                                            |
|:------------------------|:---------------------------------------------------|
| Channel ID              | `5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3` |
| Amount of XRP, in drops | `1000000`                                          |
| Signature               | `304402204EF0AFB78AC23ED1C472E74F4299C0C21F1B21D07EFC0A3838A420F76D783A` <br/> `400220154FB11B6F54320666E4C36CA7F686C16A3A0456800BBC43746F34AF50290064` _(Note: this long string has been broken to fit on one line.)_ |

The payee also needs to know the Public Key associated with the channel, which is the same throughout the channel's life.

## 5. The payee verifies the claims.

You can verify claims using the [channel_verify method][]. The payee should confirm that the amount of the claim is equal to or greater than the total price of goods and services provided. (Since the amount is cumulative, this is the total price of all goods and services bought so far.)

Example of using `channel_verify` with the JSON-RPC API:

Request:

    POST http://localhost:5005/
    Content-Type: application/json

    {
        "method": "channel_verify",
        "params": [{
            "channel_id": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
            "signature": "304402204EF0AFB78AC23ED1C472E74F4299C0C21F1B21D07EFC0A3838A420F76D783A400220154FB11B6F54320666E4C36CA7F686C16A3A0456800BBC43746F34AF50290064",
            "public_key": "aB44YfzW24VDEJQ2UuLPV2PvqcPCSoLnL7y5M1EzhdW4LnK5xMS3",
            "amount": "1000000"
        }]
    }

Response:

    200 OK

    {
        "result": {
            "signature_verified":true,
            "status":"success"
        }
    }

If the response shows `"signature_verified": true` then the claim's signature is genuine. The payee must **also** confirm that the channel has enough XRP available to honor the claim. To do this, the payee uses the [account_channels method][] to confirm the most recent validated state of the payment channel.

Request:

    POST http://localhost:5005/
    Content-Type: application/json

    {
        "method": "account_channels",
        "params": [{
            "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
            "destination_account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            "ledger_index": "validated"
        }]
    }

Response:

    200 OK

    {
        "result": {
            "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
            "channels": [{
                "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
                "amount": "100000000",
                "balance": "0",
                "channel_id": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
                "destination_account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "destination_tag": 20170428,
                "public_key": "aB44YfzW24VDEJQ2UuLPV2PvqcPCSoLnL7y5M1EzhdW4LnK5xMS3",
                "public_key_hex": "023693F15967AE357D0327974AD46FE3C127113B1110D6044FD41E723689F81CC6",
                "settle_delay": 86400
            }],
            "status": "success"
        }
    }

The payee should check the following:

- Find the object in the `channels` array whose `channel_id` matches the Channel ID of the claim. It is possible to have multiple payment channels, even between the same parties, but a claim can only be redeemed against the channel with the matching ID.
- Confirm that the `expiration` (mutable expiration) of the channel, if present, is not too soon. The payee must redeem claims before this time.
- Confirm that the `amount` of the claim is equal or less than the `amount` of the channel. If the `amount` of the claim is higher, the claim cannot be redeemed unless the payer uses a [PaymentChannelFund transaction][] to increase the total amount of XRP available to the channel.
- Confirm that the `balance` of the channel matches the amount the payee expects to have already received from the channel. If these do not match up, the payee should double-check the channel's transaction history. Some possible explanations for a mismatch include:
    - The payer used a [PaymentChannelClaim][] transaction to deliver XRP from the channel to the payee, but the payee did not notice and record the incoming transaction.
    - The payee's records include transactions that are "in flight" or have not yet been included in the latest validated ledger version. The payee can use the [tx method][] to look up the state of individual transactions to check this.
    - The `account_channels` request did not specify the correct ledger version. (Use `"ledger_index": "validated"` to get the latest validated ledger version)
    - The payee previously redeemed XRP but forgot to record it.
    - The payee attempted to redeem XRP and recorded the tentative result, but the transaction's final validated result was not the same and the payee neglected to record the final validated result.
    - The `rippled` server the payee queried has lost sync with the rest of the network or is experiencing an unknown bug. Use the [server_info method][] to check the state of the server. (If you can reproduce this situation, please [report an issue](https://github.com/ripple/rippled/issues/).)

After confirming both the signature and the current state of the payment channel, the payee has not yet received the XRP, but is certain that he or she _can_ redeem the XRP as long as the transaction to do so is processed before the channel expires.


## 6. Payee provides goods or services.

At this point, the payee can provide goods and services to the payer, knowing that payment is already assured.

For purposes of this tutorial, the payee can give the payer a high-five or equivalent online message as the "goods and services".


## 7. Repeat steps 3-6 as desired.

The payer and payee can repeat steps 3 through 6 (creating, transmitting, and verifying claims in exchange for goods and services) as many times and as often as they like without waiting for the XRP Ledger itself. The two main limits of this process are:

- The amount of XRP in the payment channel. (If necessary, the payer can send a [PaymentChannelFund transaction][] to increase the total amount of XRP available to the channel.)

- The immutable expiration of the payment channel, if one is set. (The `cancel_after` field in the response to the [account_channels method][] shows this.)


## 8. When ready, the payee redeems a claim for the authorized amount.

This is the point where the payee finally receives some XRP from the channel.

This is a [PaymentChannelClaim transaction][] with the `Balance`, `Amount`, `Signature`, and `PublicKey` fields provided. Because claim values are cumulative, the payee only needs to redeem the largest (most recent) claim to get the full amount. The payee is not required to redeem the claim for the full amount authorized.

The payee can do this multiple times, to settle partially while still doing business, if desired.

Example of claiming XRP from a channel:

Request:

    POST http://localhost:5005/
    Content-Type: application/json

    {
        "method": "submit",
        "params": [{
                "secret": "s████████████████████████████",
                "tx_json": {
                    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                    "TransactionType": "PaymentChannelClaim",
                    "Amount": "1000000",
                    "Balance": "1000000",
                    "Channel": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
                    "PublicKey": "023693F15967AE357D0327974AD46FE3C127113B1110D6044FD41E723689F81CC6",
                    "Signature": "304402204EF0AFB78AC23ED1C472E74F4299C0C21F1B21D07EFC0A3838A420F76D783A400220154FB11B6F54320666E4C36CA7F686C16A3A0456800BBC43746F34AF50290064"
                },
                "fee_mult_max": 1000
            }]
    }

Response:

    200 OK

    {
        "result": {
            "engine_result": "tesSUCCESS",
            "engine_result_code": 0,
            "engine_result_message": "The transaction was applied. Only final in a validated ledger.",
            "status": "success",
            "tx_blob": "12000F2280000000240000017450165DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB36140000000000F42406240000000000F424068400000000000000A7121023693F15967AE357D0327974AD46FE3C127113B1110D6044FD41E723689F81CC6732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7447304502210096B933BC24DA77D8C4057B4780B282BA66C668DFE1ACF4EEC063AD6661725797022037C8823669CE91AACA8CC754C9F041359F85B0B32384AEA141EBC3603798A24C7646304402204EF0AFB78AC23ED1C472E74F4299C0C21F1B21D07EFC0A3838A420F76D783A400220154FB11B6F54320666E4C36CA7F686C16A3A0456800BBC43746F34AF5029006481144B4E9C06F24296074F7BC48F92A97916C6DC5EA9",
            "tx_json": {
                "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "Amount": "1000000",
                "Balance": "1000000",
                "Channel": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
                "Fee": "10",
                "Flags": 2147483648,
                "PublicKey": "023693F15967AE357D0327974AD46FE3C127113B1110D6044FD41E723689F81CC6",
                "Sequence": 372,
                "Signature": "304402204EF0AFB78AC23ED1C472E74F4299C0C21F1B21D07EFC0A3838A420F76D783A400220154FB11B6F54320666E4C36CA7F686C16A3A0456800BBC43746F34AF50290064",
                "SigningPubKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
                "TransactionType": "PaymentChannelClaim",
                "TxnSignature": "304502210096B933BC24DA77D8C4057B4780B282BA66C668DFE1ACF4EEC063AD6661725797022037C8823669CE91AACA8CC754C9F041359F85B0B32384AEA141EBC3603798A24C",
                "hash": "C9FE08FC88CF76C3B06622ADAA47AE99CABB3380E4D195E7751274CFD87910EB"
            }
        }
    }

The payee should confirm that this transaction is successful in a validated ledger. For the full details, see [Reliable Transaction Submission](reliable-transaction-submission.html).

## 9. When the payer and payee are done doing business, the payer requests for the channel to be closed.

This is a [PaymentChannelClaim transaction][] with the `tfClose` flag set, or a [PaymentChannelFund transaction][] with the `Expiration` field set. _(9a in the [flow diagram][])_.

If the channel has no XRP remaining in it when the payer requests to close the channel, it closes immediately.

If the channel _does_ have XRP remaining, the request to close a channel acts as a final warning to the payee to redeem any outstanding claims right away. The payee has an amount of time no less than the settlement delay before the channel is closed. The exact number of seconds varies slightly based on the close times of ledgers.

The payee can also close a payment channel immediately after processing a claim _(9b in the [flow diagram][])_.

Example of [submitting a transaction](submit.html#sign-and-submit-mode) requesting a channel to close:

    {
        "method": "submit",
        "params": [{
            "secret": "s████████████████████████████",
            "tx_json": {
                "Account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
                "TransactionType": "PaymentChannelClaim",
                "Channel": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
                "Flags": 2147614720
            },
            "fee_mult_max": 1000
        }]
    }

After the transaction is included in a validated ledger, either party can look up the currently-scheduled expiration of the channel using the [account_channels method][]. Be sure to specify `"ledger_index": "validated"` to get data from the latest validated ledger version.

Example `account_channels` response:

    {
        "result": {
            "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
            "channels": [
                {
                    "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
                    "amount": "100000000",
                    "balance": "1000000",
                    "channel_id": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
                    "destination_account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                    "destination_tag": 20170428,
                    "expiration": 547073182,
                    "public_key": "aB44YfzW24VDEJQ2UuLPV2PvqcPCSoLnL7y5M1EzhdW4LnK5xMS3",
                    "public_key_hex": "023693F15967AE357D0327974AD46FE3C127113B1110D6044FD41E723689F81CC6",
                    "settle_delay": 86400
                }
            ],
            "status": "success"
        }
    }

In this example, the `expiration` value 547073182 in [seconds since the Ripple Epoch][] maps to 2017-05-02T20:46:22Z, so any claims not redeemed by that time are no longer valid.

## 10. Anyone can close the expired channel.

After the settlement delay has passed or the channel has reached its planned expiration time, the channel is expired. Any further transaction that would affect the channel can only close it, returning unclaimed XRP to the payer.

The channel can remain on the ledger in an expired state indefinitely. This is because the ledger cannot change except as the results of a transaction, so _someone_ must send a transaction to cause the expired channel to close. As long as the channel remains on the ledger, it counts as an object owned by the payer for purposes of the [owner reserve](reserves.html#owner-reserves).

Ripple recommends that the payer sends a second [PaymentChannelClaim transaction][] with the `tfClose` flag for this purpose. However, other accounts, even those not involved in the payment channel, can cause an expired channel to close.

The command to submit the transaction is the same as the previous example requesting channel expiration. (However, its resulting [auto-filled](transaction-common-fields.html#auto-fillable-fields) `Sequence` number, signature, and identifying hash are unique.)

Example of [submitting](submit.html#sign-and-submit-mode) a transaction to close an expired channel:

    {
        "method": "submit",
        "params": [{
            "secret": "s████████████████████████████",
            "tx_json": {
                "Account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
                "TransactionType": "PaymentChannelClaim",
                "Channel": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
                "Flags": 2147614720
            },
            "fee_mult_max": 1000
        }]
    }

When the transaction has been included in a validated ledger, you can look at the metadata of the transaction to confirm that it deleted the channel and returned the XRP to the sender.

Example response from using the [tx method][] to look up the transaction from this step:

    {
        "result": {
            "Account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
            "Channel": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
            "Fee": "5606",
            "Flags": 2147614720,
            "Sequence": 41,
            "SigningPubKey": "023693F15967AE357D0327974AD46FE3C127113B1110D6044FD41E723689F81CC6",
            "TransactionType": "PaymentChannelClaim",
            "TxnSignature": "3044022008922FEB6F7D35D42006685BCBB007103D2A40AFAA69A7CFC10DF529F94BB6A402205D67816F50BBAEE0A2709AA3A93707304EC21133550FD2FF7436AD0C3CA6CE27",
            "date": 547091262,
            "hash": "9C0CAAC3DD1A74461132DA4451F9E53BDF4C93DFDBEFCE1B10021EC569013B33",
            "inLedger": 29480670,
            "ledger_index": 29480670,
            "meta": {
                "AffectedNodes": [
                    {
                        "ModifiedNode": {
                            "LedgerEntryType": "AccountRoot",
                            "LedgerIndex": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
                            "PreviousTxnID": "C9FE08FC88CF76C3B06622ADAA47AE99CABB3380E4D195E7751274CFD87910EB",
                            "PreviousTxnLgrSeq": 29385089
                        }
                    },
                    {
                        "DeletedNode": {
                            "FinalFields": {
                                "Account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
                                "Amount": "100000000",
                                "Balance": "1000000",
                                "Destination": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                                "DestinationTag": 20170428,
                                "Expiration": 547073182,
                                "Flags": 0,
                                "OwnerNode": "0000000000000000",
                                "PreviousTxnID": "C5C70B2BCC515165B7F62ACC8126F8F8B655EB6E1D949A49B2358262BDA986B4",
                                "PreviousTxnLgrSeq": 29451256,
                                "PublicKey": "023693F15967AE357D0327974AD46FE3C127113B1110D6044FD41E723689F81CC6",
                                "SettleDelay": 86400
                            },
                            "LedgerEntryType": "PayChannel",
                            "LedgerIndex": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3"
                        }
                    },
                    {
                        "ModifiedNode": {
                            "FinalFields": {
                                "Account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
                                "Balance": "1041862844",
                                "Flags": 0,
                                "OwnerCount": 2,
                                "Sequence": 42
                            },
                            "LedgerEntryType": "AccountRoot",
                            "LedgerIndex": "B1CB040A17F9469BC00376EC8719535655824AD16CB5F539DD5765FEA88FDBE3",
                            "PreviousFields": {
                                "Balance": "942868450",
                                "OwnerCount": 3,
                                "Sequence": 41
                            },
                            "PreviousTxnID": "C5C70B2BCC515165B7F62ACC8126F8F8B655EB6E1D949A49B2358262BDA986B4",
                            "PreviousTxnLgrSeq": 29451256
                        }
                    },
                    {
                        "ModifiedNode": {
                            "FinalFields": {
                                "Flags": 0,
                                "Owner": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
                                "RootIndex": "E590FC40B4F24D18341569BD3702A2D4E07E7BC04D11CE63608B67979E67030C"
                            },
                            "LedgerEntryType": "DirectoryNode",
                            "LedgerIndex": "E590FC40B4F24D18341569BD3702A2D4E07E7BC04D11CE63608B67979E67030C"
                        }
                    }
                ],
                "TransactionIndex": 7,
                "TransactionResult": "tesSUCCESS"
            },
            "status": "success",
            "validated": true
        }
    }

In the transaction's metadata, look for the following:

- A `DeletedNode` entry with `"LedgerEntryType": "PayChannel"`. The `LedgerIndex` field should match the Channel ID. This indicates that the channel was deleted.
- A `ModifiedNode` entry with `"LedgerEntryType": "AccountRoot"`. The change in the `Balance` field in `PreviousFields` and `FinalFields` reflects the unspent XRP being returned to the payer.

Those fields indicate that the payment channel is closed.


## Conclusion

This concludes the tutorial of Payment Channel usage. Ripple encourages users to find unique and interesting use cases to take full advantage of the speed and convenience of payment channels.

## See Also

- **Concepts:**
    - [XRP](xrp.html)
    - [Payment Types](payment-types.html)
        - [Payment Channels](payment-channels.html)
- **Tutorials:**
    - [Send XRP](send-xrp.html)
    - [Look Up Transaction Results](look-up-transaction-results.html)
    - [Reliable Transaction Submission](reliable-transaction-submission.html)
- **References:**
    - [PaymentChannelClaim transaction][]
    - [PaymentChannelCreate transaction][]
    - [PaymentChannelFund transaction][]
    - [channel_authorize method][]
    - [channel_verify method][]
    - [PayChannel ledger object](paychannel.html)


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
