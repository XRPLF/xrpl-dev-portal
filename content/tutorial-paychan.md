# Payment Channels Tutorial

Payment Channels are an advanced feature for sending "asynchronous" XRP payments that can be divided into very small increments and settled later. The basic flow of using a payment channel is as follows:

1. **The payer creates a payment channel to a particular recipient and pre-funds the channel with XRP.**

    This is a [PaymentChannelCreate transaction][]. As part of this process, the payer sets certain specifics of the channel like an expiration time and a settlement delay, which affect the guarantees around the claims in the channel. The payer also sets the public key that will be used to verify claims against the channel.

    **Tip:** The "settlement delay" does not delay the settlement, which can happen as fast as a ledger version closes (3-5 seconds). The "settlement delay" is a forced delay on closing the channel so that the payee has a chance to finish with settlement.

    The following example shows creation of a payment channel by submitting to a local `rippled` server with the JSON-RPC API. The payment channel allocates 100 XRP from rN7n7... to rf1Bi... with a settlement delay of 1 day. The public key happens to be rN7n7...fzRH's master public key.

    Request:

        POST http://localhost:5005/
        Content-Type: application/json

        {
            "method": "submit",
            "params": [
                {
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
                }
            ]
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

    **TODO:** The payer should check the transaction's final result with `tx` and get the Channel ID from the metadata.

2. **The payee confirms that the specifics of the payment channel are satisfactory for the situation.**

    In particular, the payee should confirm that the settlement delay is long enough that the channel cannot close before the payee has a chance to redeem any outstanding claims against the channel. The settlement delay is defined in seconds in the `SettleDelay` field of the payment channel.

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

    Since there can be multiple channels between the same two parties, it is important for the payee to check the qualities of the correct channel. If there is any chance of confusion, the payer should clarify the Channel ID (`channel_id`) of the channel to use.

3. **The payer creates one or more signed _claims_ for the XRP in the channel.** The amounts of these claims depends on the specific goods or services the payer wants to pay for.

    Each claim must be for a cumulative amount. In other words, to purchase two items at 10 XRP each, the first claim should have an amount of 10 XRP and the second claim should have an amount of 20 XRP. The claim can never be more than the total amount of XRP allocated to the channel. (A [PaymentChannelFund][] transaction can increase the total amount of XRP allocated to the channel.)

    You can create claims with the `channel_authorize` API method.

4. **The payer transmits a claim to the payee as payment for goods or services.**

    This communication happens "off-ledger" in any communication system the payer and payee can agree to. It's recommended that the two parties use secure communiations for this, but it's not strictly necessary. Only the payer or payee of a channel can redeem claims against that channel.

5. **The payee verifies the claims and provides the goods or services.**

    You can verify claims using the `channel_verify` API method. The payee should confirm that the amount of the claim is equal or greater than the total price of goods and services provided.

6. **The payer and payee can repeat steps 3 through 5 (creating, transmitting, and verifying claims in exchange for goods and services) as many times and as often as they like without waiting for the Ripple Consensus Ledger itself.**

    The two main limits of this process are:

    - The amount of XRP in the payment channel

    - The immutable expiration of the payment channel, if one is set

7. **Whenever the payee is ready, the payee redeems a claim for the authorized amount, receiving that much XRP from the payment channel.**

    Because claim values are cumulative, the payee only needs to redeem the largest (most recent) claim to get the full amount. The payee is not required to redeem the claim for the full amount authorized.

    The payee can do this multiple times, to settle partially while still doing business, if desired.

8. **Optionally, the payer can fund the channel with additional XRP to continue doing business if the initial amount wasn't sufficient.**

    This is a [PaymentChannelFund][] transaction.

9. **When the payer and payee are done doing business, the payer requests for the channel to be closed.**

    This is a [PaymentChannelClaim transaction][] with the `tfClose` flag set, or a [PaymentChannelFund transaction][] with the `Expiration` field set.

    The request to close a channel acts as a final warning to the payee to redeem any outstanding claims right away. The payee has an amount of time no less than the settlement delay before the channel is closed. The exact number of seconds varies slightly based on the close times of ledgers.

    The payee can always close a payment channel immediately after processing a claim. The payer can close the payment channel immediately if it has no XRP remaining in it.

10. **After the settlement delay has passed or the channel has reached its planned expiration time, the channel is expired.** Any further transaction that would affect the channel can only close it, returning unclaimed XRP to the payer.

    The channel can remain on the ledger in an expired state indefinitely. This is because the ledger cannot change except as the results of a transaction, so _someone_ must send a transaction to cause the expired channel to close.

    We recommend the payer sends a second [PaymentChannelClaim transaction][] with the `tfClose` flag for this purpose. However, other accounts, even those not involved in the payment channel, can cause an expired channel to close.




{% include 'snippets/tx-type-links.md' %}
