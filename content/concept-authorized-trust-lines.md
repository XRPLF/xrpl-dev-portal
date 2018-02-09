# Authorized Trust Lines

The XRP Ledger's Authorized Trust Lines feature enables a currency issuer to limit who can hold its issued currencies, so that unknown XRP Ledger addresses cannot hold those currencies. The Authorized Trust Lines feature has no effect on XRP.

To use the Authorized Trust Lines feature, enable the RequireAuth flag on your issuing address. After doing so, your issuing address can send [TrustSet transactions][] to authorize trust lines from other addresses. While RequireAuth is enabled, other addresses can only hold funds issued by your address if the trust line to your issuing address has been authorized.

The transaction to authorize a trust line must be signed by the issuing address, which unfortunately means an increased risk exposure for that address. The process for sending funds into the XRP Ledger with RequireAuth enabled looks like the following:

1. An issuing gateway publishes its issuing address to customers.
2. A customer sends a [TrustSet transaction][] to create a trust line from her XRP Ledger address to the gateway's issuing address. This indicates that she is willing to hold a specific currency issued by the gateway, up to a specific numeric limit.
3. The gateway's issuing address sends a TrustSet transaction authorizing the customer's trust line.

**Tip:** An issuing gateway can authorize a trust line preemptively (step 3), before the customer has created it. This creates a trust line with zero limit, so that the customer's TrustSet transaction (step 2) sets the limit on the pre-authorized trust line. _(Requires the [TrustSetAuth amendment](reference-amendments.html#trustsetauth), which has been enabled in the production XRP Ledger since 2016-07-19.)_

## RequireAuth Setting

The `RequireAuth` setting (`requireAuthorization` in [RippleAPI](reference-rippleapi.html)) prevents all counterparties from holding balances issued by an address unless the issuing address has specifically approved an accounting relationship with that counterparty.

As a precaution, Ripple recommends that issuing gateways always enable `RequireAuth` on [operational addresses and standby addresses](concept-issuing-and-operational-addresses.html), and then never approve any accounting relationships to those addresses. This prevents operational addresses and standby addresses from issuing currency in the XRP Ledger even by accident. This is a purely precautionary measure, and does not stop those addresses from transferring issued currency balances created by the issuing address, as they are intended to do.

To use the Authorized Trust Lines feature, an issuer must also enable `RequireAuth` on its issuing address. After doing so, the issuing address must [submit a `TrustSet` transaction to approve each trust line](#authorizing-trust-lines) from a customer.

**Caution:** An account can only enable `RequireAuth` if it owns no trust lines and no offers in the XRP Ledger, so you must decide whether or not to use it before you start doing business in the XRP Ledger.

### Enabling RequireAuth

The following is an example of using a locally-hosted `rippled`'s [`submit` command](reference-rippled.html#submit) to send an [AccountSet transaction][] to enable the RequireAuth flag: (This method works the same way regardless of whether the address is an issuing address, operational address, or standby address.)

Request:

```
POST http://localhost:5005/
{
    "method": "submit",
    "params": [
        {
            "secret": "sn3nxiW7v8KXzPzAqzyHXbSSKNuN9",
            "tx_json": {
                "Account": "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
                "Fee": "15000",
                "Flags": 0,
                "SetFlag": 2,
                "TransactionType": "AccountSet"
            }
        }
    ]
}
```

{% include 'snippets/secret-key-warning.md' %}

## Authorizing Trust Lines

If you are using the Authorized Trust Lines feature, customers cannot hold balances you issue unless you first authorize their trust lines to you.

To authorize an accounting relationship, submit a [TrustSet transaction][] from your issuing address, with the user to trust as the `issuer` of the `LimitAmount`. Leave the `value` (the amount to trust them for) as **0**, and enable the [tfSetfAuth](reference-transaction-format.html#trustset-flags) flag for the transaction.

The following is an example of using a locally-hosted `rippled`'s [`submit` command](reference-rippled.html#submit) to send a TrustSet transaction authorizing the customer address rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn to hold issuances of USD from the issuing address rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW:

Request:

```
POST http://localhost:8088/
{
    "method": "submit",
    "params": [
        {
            "secret": "sn3nxiW7v8KXzPzAqzyHXbSSKNuN9",
            "tx_json": {
                "Account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
                "Fee": "15000",
                "TransactionType": "TrustSet",
                "LimitAmount": {
                    "currency": "USD",
                    "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                    "value": 0
                },
                "Flags": 65536
            }
        }
    ]
}
```

{% include 'snippets/secret-key-warning.md' %}

{% include 'snippets/tx-type-links.md' %}
