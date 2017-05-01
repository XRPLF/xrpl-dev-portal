# Payment Channels Tutorial

Payment Channels are an advanced feature for sending "asynchronous" XRP payments that can be divided into very small increments and settled later. This tutorial walks through the entire process of using a payment channel, with examples using the [JSON-RPC API](reference-rippled.html) of a local `rippled` server.

1. **The payer creates a payment channel to a particular recipient.** In doing so, the payer pre-funds the channel with XRP.

    This is a [PaymentChannelCreate transaction][]. As part of this process, the payer sets certain specifics of the channel like an expiration time and a settlement delay, which affect the guarantees around the claims in the channel. The payer also sets the public key that will be used to verify claims against the channel.

    **Tip:** The "settlement delay" does not delay the settlement, which can happen as fast as a ledger version closes (3-5 seconds). The "settlement delay" is a forced delay on closing the channel so that the payee has a chance to finish with settlement.

    The following example shows creation of a payment channel by submitting to a local `rippled` server with the JSON-RPC API. The payment channel allocates 100 XRP from rN7n7... to rf1Bi... with a settlement delay of 1 day. The public key happens to be rN7n7...fzRH's master public key.

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

    The payer should check the transaction's final result in a validated ledger and get the Channel ID from the metadata. This can be done with the `tx` command:

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

    - Confirm that the response has `"validated":true` to indicate the data comes from a validated ledger, so the transaction's result is final.
    - In the `AffectedNodes` of the transaction's `meta` field, look for a `CreatedNode` with the `LedgerEntryType` of `PayChannel`. The `LedgerIndex` field indicates the Channel ID. (In the above example, this is a hex string starting with "5DB0...") The Channel ID is necessary later to sign claims.

2. **The payee confirms that the specifics of the payment channel are satisfactory for the situation.**

    In particular, the payee should confirm that the settlement delay is long enough that the channel cannot close before the payee has a chance to redeem any outstanding claims against the channel.

    You can look up payment channels with the `account_channels` API method, using the payer of the channel, as in the following example (using the JSON-RPC API):

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

    - Confirm the `destination_account` field has the payee's correct address.
    - Confirm the `settle_delay` field has a settlement delay in seconds that provides enough time for the payee to redeem outstanding claims.
    - Confirm the fields `cancel_after` (immutable expiration) and `expiration` (mutable expiration), if they are present, are not too soon. The payee should take note of these times so they can be sure to redeem claims before then.
    - Take note of the `public_key` and `channel_id` fields. These are necessary later to verify and redeem claims.
    - _(Optional)_ Confirm the `destination_tag` field, if present, has the correct destination tag (if desired).

    Since there can be multiple channels between the same two parties, it is important for the payee to check the qualities of the correct channel. If there is any chance of confusion, the payer should clarify the Channel ID (`channel_id`) of the channel to use.

3. **The payer creates one or more signed _claims_ for the XRP in the channel.** The amounts of these claims depends on the specific goods or services the payer wants to pay for.

    Each claim must be for a cumulative amount. In other words, to purchase two items at 10 XRP each, the first claim should have an amount of 10 XRP and the second claim should have an amount of 20 XRP. The claim can never be more than the total amount of XRP allocated to the channel. (A [PaymentChannelFund][] transaction can increase the total amount of XRP allocated to the channel.)

    You can create claims with the `channel_authorize` API method. The following example authorizes 1 XRP from the channel:

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


4. **The payer transmits a claim to the payee as payment for goods or services.**

    This communication happens "off-ledger" in any communication system the payer and payee can agree to. It's recommended that the two parties use secure communications for this, but it's not strictly necessary. Only the payer or payee of a channel can redeem claims against that channel.

    The exact format of the claim is not important as long as it communicates the following information:

    | Field                   | Example                                            |
    |:------------------------|:---------------------------------------------------|
    | Channel ID              | `5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3` |
    | Amount of XRP, in drops | `1000000`                                          |
    | Signature               | `304402204EF0AFB78AC23ED1C472E74F4299C0C21F1B21D07EFC0A3838A420F76D783A400220154FB11B6F54320666E4C36CA7F686C16A3A0456800BBC43746F34AF50290064` |

    The payee also needs to know the Public Key associated with the channel, which is the same throughout the channel's life.

5. **The payee verifies the claims and provides the goods or services.**

    You can verify claims using the `channel_verify` API method. The payee should confirm that the amount of the claim is equal or greater than the total price of goods and services provided. (Since the amount is cumulative, this is the total price of all goods and services purchased so far.)

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

    If the response shows `"signature_verified": true` then the claim is genuine. At this point, the payee has not yet received the XRP, but can be certain that he or she _can_ redeem the XRP as long as the transaction to do so is processed before the channel expires. ***Rome's question: Is there anything else the payee should check, or any tricks the payer could use to make a "valid" signature for a balance that couldn't actually be redeemed?***

6. **The payer and payee can repeat steps 3 through 5 (creating, transmitting, and verifying claims in exchange for goods and services) as many times and as often as they like without waiting for the Ripple Consensus Ledger itself.**

    The two main limits of this process are:

    - The amount of XRP in the payment channel. (If necessary, the payer can send a [PaymentChannelFund transaction][] to increase the total amount of XRP available to the channel.)

    - The immutable expiration of the payment channel, if one is set. (The `cancel_after` field in the `account_channels` response shows this.)

7. **Whenever the payee is ready, the payee redeems a claim for the authorized amount, receiving that much XRP from the payment channel.**

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

    The payee should confirm that this transaction is successful in a validated ledger. For the full details, see [Reliable Transaction Submission](tutorial-reliable-transaction-submission.html).


8. **When the payer and payee are done doing business, the payer requests for the channel to be closed.**

    This is a [PaymentChannelClaim transaction][] with the `tfClose` flag set, or a [PaymentChannelFund transaction][] with the `Expiration` field set.

    The request to close a channel acts as a final warning to the payee to redeem any outstanding claims right away. The payee has an amount of time no less than the settlement delay before the channel is closed. The exact number of seconds varies slightly based on the close times of ledgers.

    The payee can always close a payment channel immediately after processing a claim. The payer can close the payment channel immediately if it has no XRP remaining in it.

    The following shows a PaymentChannelClaim transaction

    Request:

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

    Response:

    {
        "result": {
            "engine_result": "tesSUCCESS",
            "engine_result_code": 0,
            "engine_result_message": "The transaction was applied. Only final in a validated ledger.",
            "status": "success",
            "tx_blob": "12000F2280020000240000002850165DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB368400000000000000A7321023693F15967AE357D0327974AD46FE3C127113B1110D6044FD41E723689F81CC674473045022100EFAF85836A3EE540D6BCEC16B44819704B1227B6DB125F87EDF0457D1A915A1902201BF9B79A12217B83E6AF685B030C274251A1C373CC5C51E0010A9B232A64E523811493B89AFCAD4C8EAC2B131C1331FEF12AE1522BBE",
            "tx_json": {
                "Account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
                "Channel": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
                "Fee": "10",
                "Flags": 2147614720,
                "Sequence": 40,
                "SigningPubKey": "023693F15967AE357D0327974AD46FE3C127113B1110D6044FD41E723689F81CC6",
                "TransactionType": "PaymentChannelClaim",
                "TxnSignature": "3045022100EFAF85836A3EE540D6BCEC16B44819704B1227B6DB125F87EDF0457D1A915A1902201BF9B79A12217B83E6AF685B030C274251A1C373CC5C51E0010A9B232A64E523",
                "hash": "C5C70B2BCC515165B7F62ACC8126F8F8B655EB6E1D949A49B2358262BDA986B4"
            }
        }
    }

    After the transaction is included in a validated ledger, either party can look up the currently-scheduled expiration of the channel in the latest validated ledger using the `account_channels` method.

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

    In this example, the `expiration` value 547073182 in [seconds since the Ripple Epoch](reference-rippled.html#specifying-time) maps to 2017-05-02T20:46:22Z, so any claims not redeemed by that time are no longer valid.

9. **After the settlement delay has passed or the channel has reached its planned expiration time, the channel is expired.** Any further transaction that would affect the channel can only close it, returning unclaimed XRP to the payer.

    The channel can remain on the ledger in an expired state indefinitely. This is because the ledger cannot change except as the results of a transaction, so _someone_ must send a transaction to cause the expired channel to close.

    We recommend the payer sends a second [PaymentChannelClaim transaction][] with the `tfClose` flag for this purpose. However, other accounts, even those not involved in the payment channel, can cause an expired channel to close.


    ***TODO: PaymentChannelClaim example to show closing expired channel***


{% include 'snippets/tx-type-links.md' %}
