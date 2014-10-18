# Introduction #

The Gateway Services initiative aims to make gateways interoperable, extending the connectivity of the Ripple Network beyond the bounds of the Ripple ledger. The goal is to allow anyone who's connected to Ripple (not just Ripple account holders) to look up another Ripple-connected entity, find a path between them, quote the cost of a payment, and then make that payment, in a way that is consistent, regulation-compliant, and standards-compliant. It defines a series of REST API calls that make it possible for other gateways and Ripple client applications to perform all of these actions.

Gateways that implement these services can easily link with one another, allowing users who have a business relationship with one of them to send and receive money to parties that are connected to other gateways in an automated fashion, while remaining regulation-compliant. Our Gatewayd framework will implement all these services, so gateway operators using Gatewayd don't need to do anything beyond standard configuration, and those with custom gateway software can use Gatewayd as a reference implementation. 

## Components ##

| Service | Description | Based On | Replaces |
| ------- | ----------- | -------- | -------- |
| [host-meta](#host-meta) | Provides useful metadata about a gateway or service provider, and lists all service endpoints provided by the domain | [RFC6415](http://tools.ietf.org/html/rfc6415) | [ripple.txt](https://ripple.com/wiki/Ripple.txt) |
| [webfinger](#webfinger) | Performs reverse lookup of Ripple addresses, and lists service endpoints for interacting with a specified account holder | [RFC7033](http://tools.ietf.org/html/rfc7033) | [Federation Name Lookup](https://ripple.com/wiki/Federation_protocol) |
| [bridge-payments](#bridge-payments) | Plans payments from any Ripple-connected wallet to any other, connecting through gateways as necessary. | [Ripple-REST payments](http://dev.ripple.com/ripple-rest.html#payments) | [Bridge protocol](https://ripple.com/wiki/Services_API) |
| user-account | Provides standard method for registering an account with a Gateway, and provides signed claims about a user's identity  similar to bridge-payment's required claims | [OpenID Connect Claims](http://openid.net/specs/openid-connect-core-1_0.html#Claims), [JWT](http://tools.ietf.org/html/draft-ietf-oauth-json-web-token-25) | -- |
| wallet-payment | Makes outgoing payments and monitors for incoming payments, and works with hosted wallets. | [Ripple-REST payments](http://dev.ripple.com/ripple-rest.html#payments) | -- |
| wallet-info | Shows information about a wallet, and works with hosted wallets | [Ripple-REST accounts](http://dev.ripple.com/ripple-rest.html#accounts) | -- |
| wallet-balances | Shows information about balances in multiple currencies, and works with hosted wallets. | [Ripple-REST accounts](http://dev.ripple.com/ripple-rest.html#accounts) | -- |
| wallet-history | Shows history of payments sent and received, and works with hosted wallets. | [Ripple-REST payment history](http://dev.ripple.com/ripple-rest.html#payment-history) | -- |

# Gateway Services Identifiers #

Several APIs require you to identify the sender or recipient of a payment. Since several different types of identifiers can be used this way, Gateway Services defines a standard way to create a Universal Resource Identifier (URI) for each type of resource. Any party of a payment should have a URI associated with it that can be WebFingered. This may include:

* The originator (sender) of a payment
* The beneficiary (receiver) of the payment
* Up to two gateways operating as inbound bridge and/or outbound bridges <span class='draft-comment'>(What kind of identifier should they use?)</span>
* Up to two "Participating parties" (one on each end of the transaction), for example the clerk at a store receiving or handing out cash. This may be important for compliance purposes, especially for remittance.

As a general rule on the web at large, any URI starts with a "scheme" portion, followed by a colon, for example `http:`. Gateway service supports using URIs with several different schemes as identifiers to represent the parties to a payment. Depending on the scheme, a particular URI may map to something different:

* `acct:` identifiers refer to a user account at a particular service, such as an account at a bank or financial service.
* `ripple:` identifiers refer to a specific Ripple account in the shared global ledger
* Other identifiers can be used, depending on the configuration of the gateway being used.

An identifier can only be used if a JRD with the necessary information can be found by WebFingering that identifier. Part of the challenge is knowing which WebFinger service to use to look up the desired URI. This is a matter of finding out the right domain to use from the URI.

## Native Identifiers ##

Some kinds of URIs provide a single clear domain that can be used to perform the WebFinger request. A client application must use the following rules for where to WebFinger identifiers in the following formats:

| Type of Identifier | Example | Where to WebFinger |
|--------------------|---------|--------------------|
| Email address      | acct:bob@ripple.com | Domain from the email |
| Email-style Federation address | acct:bob@fidor.de | Domain from the address
| Ripple Address     | ripple:rBWay8KRdmroZra4DTXi6h5cLtPhs5mH7v | Domain from the Ripple AccountRoot object |
| Ripple Address with Destination Tag | ripple:rBWay8KRdmroZra4DTXi6h5cLtPhs5mH7v?dt=103047 | Domain from the Ripple AccountRoot object |
| Ripple Name        | ripple:bob | Domain from the Ripple AccountRoot object |

In the case where a particular email does not provide sufficient information to send a payment, client applications may optionally use a [WebFist](http://www.onebigfluke.com/2013/06/bootstrapping-webfinger-with-webfist.html) service to check for alternate places to WebFinger the provided address.

## Additional Identifiers ##

Additional identifiers may be supported, in order to provide compatibility with other payment systems. Decide where to WebFinger additional URI formats according to the following rules:

Client Applications should either:

  * Be explicitly linked to a particular gateway (e.g. a Fidor app that uses only Fidor-hosted Gateway Services), _or_
  * Only WebFinger gateways explicitly chosen by the user. 
     * Client apps can make this easier by using a central "Registry" of gateways and presenting choices to the user. <span class='draft-comment'>No spec for such a registry exists at this time.</span>
     
Gateway Services providers can recursively WebFinger the **reciever** of a payment based on the **outbound bridges** it trusts that are capable of handing the **destination currency**. Gateways should take responsibility for the outbound bridges that they trust to make the last mile of a payment. This might mean only using outbound bridges that are operated by the same business entity or its partners.

As long as the identifier is reasonably likely to *uniquely* refer to a particular account or person, arbitrary identifiers may be used. We recommend specific formats for the following types of identifiers: <span class='draft-comment'>Format and examples are non-final mockups.</span>

| Type of Identifier | Format | Example | 
|--------------------|---------|---------|
| US Bank number     | usbn:{routing}+{bank acct num} | usbn:2209348904802+23401011034 |
| IBAN               | iban:{some iban format??} | iban:9293722341 |
| Credit/Debit card  | card:{15-16 digit card number} | card:4811738483484923 |
| Coin address       | bitcoin:{bitcoin address} | bitcoin:b238974jsv9sd8sdf923as33f |
| Paypal address     | paypal:{email address used as PayPal login}<br>paypal:{phone number?} | acct:rome@ripple.com@paypal.com acct:paypal:rome@ripple.com |
| Google wallet      | google:{email address} | google:mduo13@gmail.com |
| Square cash        | square:{email address} | square:rome@ripple.com |

# Host-Meta #

Host-Meta tells you about things operated by a domain.

[RFC6415](http://tools.ietf.org/html/rfc6415) defines a standardized way to publish metadata, including information about resources controlled by the host, for any domain. In contrast to the original spec, **Ripple uses the JSON version of host-meta exclusively**, and never queries for the XML version. This spec defines several Ripple-centric resources which a host can advertise in a host-meta file, so that other applications can automatically **find** the host's other Gateway services, and **verify** the domain's various Ripple assets. This extends and replaces the functionality of the [ripple.txt](https://wiki.ripple.com/Ripple.txt) spec.

The response to a host-meta request is a document called a JRD (JSON resource descriptor; there is also an XML version called an XRD). 

<div class='draft-comment'>
(Some things that aren't in host-meta but maybe should be:

<ul><li> what inbound & outbound bridges this system operates</li>
<li> what currencies those bridges take?</li></ul>
</div>

#### Request Format ####

```
GET /.well-known/host-meta.json
```

Alternate request format:

```
GET /.well-known/host-meta
Accept: application/json
```

*Note:* Some domains that do not use Gateway Services may implement host-meta without providing a JRD. In this case, the alternate request format may return an XRD document instead of a Not Found error.


Here is an example of an entire host-meta JRD:

__`GET https://latambridgepay.com/.well-known/host-meta.json`__

```
{
    "subject": "https://latambridgepay.com",
    "expires": "2014-01-30T09:30:00Z",
    "properties": {
        "name": "Latam Bridge Pay",
        "description": "Ripple Gateway to and from Latin American banks.",
        "rl:type": "gateway",
        "rl:domain": "latambridgepay.com",
        "rl:accounts": [
            {
                "address": "r4tFZoa7Dk5nbEEaCeKQcY3rS5jGzkbn8a",
                "rl:currencies": [
                    "USD",
                    "BRL",
                    "PEN",
                    "MXN"
                ]
            }
        ],
        "rl:hotwallets": [
            "rEKuBLEX2nHUiGB9dCGPnFkA7xMyafHTjP"
        ]
    },
    "links": [
        {
            "rel": "lrdd",
            "template": "https://latambridgepay.com/.well-known/webfinger.json?q={uri}"
        },
        {
            "rel": "https://gatewayd.org/gateway-services/bridge_payments",
            "href": "https://latambridgepay.com/v1/bridge_payments",
            "properties": {
                "version": "1"
            }
        }
    ]
}
```

This file is divided up into the following elements:

## Host-Meta Aliases ##

[Aliases are NOT RECOMMENDED](http://tools.ietf.org/html/rfc6415#section-3.1) in host-meta, according to the spec. Consumers of Gateway Services should not rely on any content there.

## Host-Meta Properties ##

```js
    ...
    "properties": {
        "name": "Latam Bridge Pay",
        "description": "Ripple Gateway to and from Latin American banks.",
        "rl:type": "gateway",
        "rl:domain": "latambridgepay.com",
        "rl:accounts": [
            {
                "address": "r4tFZoa7Dk5nbEEaCeKQcY3rS5jGzkbn8a",
                "rl:currencies": [
                    "USD",
                    "BRL",
                    "PEN",
                    "MXN"
                ]
            }
        ],
        "rl:hotwallets": [
            "rEKuBLEX2nHUiGB9dCGPnFkA7xMyafHTjP"
        ]
    }
    ...
```

Ripple defines the following properties:

| Property | Value | Description |
|----------|-------|-------------|
| rl:type  | String | What type of Ripple entity this domain is. Valid types are `"gateway"`, `"merchant"`, `"bridge"`, `"wallet-service"`, `"end-user"`. Other custom types are allowed. |
| rl:domain | String | The domain this host-meta document applies to, which should match the one it is being served from. For example, `"coin-gate.com"` |
| rl:accounts | Array of objects | Each member of this array should be an [account definition object](#acct_def_obj) for an issuing account (cold wallet) operated by this host |
| rl:hotwallets | Array of strings | Each member of this array should be either a base-58-encoded Ripple Address or a Ripple Name for a hot wallet operated by the host |

Gateway Services clients may also use the standard "name" and "description" properties.

#### Account Definition Object <a name="acct_def_obj"></a> ####

An account definition object is a JSON object with the following properties:

| Property | Value | Description |
|----------|-------|-------------|
| address | String | Base-58-encoded Ripple address |
| rl:name | String | (Optional) The [Ripple Name](https://ripple.com/dev-blog/introducing-ripple-names/) of this account, omitting the leading tilde (~) |
| rl:currencies | Object | Map of currencies issued from this address, where field names are the currency codes and values are the maximum amount issued, as a string containing a decimal number. |

Example account definition object:

```js
{
    "address": "rLtys1YJHGj8oTpECWSzDv77YRGDWGduUX",
    "rl:currencies": {
        "BTC": "1000000"
    }
}
```

## Host-Meta Links ##

The `links` field contains links to almost anything. The meaning of the link is identified by a relation type, typically a URI, in the `rel` field of the link object. Gateways should use links to advertise the other Gateway Services APIs that they offer.

Gateway Services requires the following links in host-meta:

* [Webfinger Link](#webfinger_link)
* [Bridge Payments Link](#bridge_payments_link)
* <span class='draft-comment'>(Additional services like user-account and wallet-info TBD)</span>


### WebFinger Link <a name="webfinger_link"></a> ###

This link indicates where the [WebFinger (lrdd) service](#webfinger) is provided.

```js
    ...
    "links": [
        {
            "rel": "lrdd",
            "template": "https://latambridgepay.com/.well-known/webfinger.json?resource={uri}"
        },
    ...
```

Gateway Services requires the use of the [Webfinger protocol](https://code.google.com/p/webfinger/wiki/WebFingerProtocol). The fields of the link are defined as follows:

| Field    | Value  |
|----------|--------|
| rel      | `lrdd` |
| template | The URL of your webfinger service, with `{uri}` in place of the resource to look up. |


### Bridge Payments Link <a name="bridge_payments_link"></a> ###

This link indicates where the [Bridge-Payments Service](#bridge-payments) is provided.

```js
    ...
    "links": [
    ...
        {
            "rel": "https://gatewayd.org/gateway-services/bridge_payments",
            "href": "https://latambridgepay.com/v1/bridge_payments",
            "properties": {
                "version": "1"
            }
        }
    ...
```

The fields of the link are defined as follows:

| Field    | Value  |
|----------|--------|
| rel      | `https://gatewayd.org/gateway-services/bridge_payments` |
| href | The base URL of the gateway's bridge-payments service. |
| properties | Object with key-value map of properties for this link. |

#### Properties ####

The following properties should be provided:

| Field    | Value  |
|----------|--------|
| version  | `"1"` for this version of the spec. |


# WebFinger #

WebFinger tells you about a person, hopefully including how to send money to that person.

[RFC7033](http://tools.ietf.org/html/rfc7033) defines the WebFinger protocol as a way to discover information about people or other entities on the internet, from a URI that might not be usable as a locator otherwise, such as an account or email address. The response to a WebFinger request is like the response to a Host-Meta request, but relates to a specific user (or resource) instead of to the domain. The response to a WebFinger request is also called a JRD (JSON Resource Descriptor) 

Gateway Services uses WebFinger to identify the possible beneficiaries of a payment. The *aliases* and *links* in the WebFinger response provide information about a user with regards to Ripple, including what accounts represent that user, and what services can be used to send money to the user.

#### Request format: ####

```
GET /.well-known/webfinger.json?resource={uri}
```

Alternate request format:

```
GET /.well-known/webfinger?resource={uri}
Accept: application/json
```

The following parameters must be provided in the URL:

| Field | Value | Description |
|-------|-------|-------------|
| uri   | A valid, URL-encoded [Gateway Services identifier URI]() | The resource to look up. For Gateway Services, should be an account that might send or receive money. |

#### Response Format ####

The response is a JRD, in a similar format to the response to [host-meta](#host-meta). Gateway Services uses specific [Aliases](#webfinger_aliases) and [Links](#webfinger_links) as described.

#### Example request: ####

__`GET https://latambridgepay.com/.well-known/webfinger?resource=ripple:bob`__


#### Example response: ####

<span class='draft-comment'>(note: update to reflect the link formatting we settle on for host-meta)</span>

```js
{
    "subject": "ripple:bob",
    "expires": "2014-10-07T22:46:35.097Z",
    "aliases": [
        "ripple:bob",
        "ripple:rBWay8KRdmroZra4DTXi6h5cLtPhs5mH7v"
    ],
    "links": [
        {
            "rel": "https://gatewayd.org/gateway-services/bridge_payments",
            "href": "https://latambridgepay.com/v1/bridge_payments",
            "properties": {
                "version": "1"
            }
        }
    ],
    "properties": {}
}
```


## Webfinger Aliases <a id="webfinger_aliases"></a> ##

The `aliases` field of a WebFinger document can contain various values, including ones that are not related to Ripple. Gateway Services defines three formats for aliases that refer to Ripple addresses:

<span class='draft-comment'>(Same as URIs? Exactly?)</span>

| Alias for   | Format | Example |
|-------------|--------|---------|
| Ripple Name | `ripple:` followed by the user's Ripple Name, without the tilde (~) | ripple:bob |
| Ripple Address | `ripple:` followed by the user's base-58 encoded Ripple address | ripple:rBWay8KRdmroZra4DTXi6h5cLtPhs5mH7v |
| Ripple Address with Destination Tag | `ripple:` followed by the user's base-58 encoded Ripple address, followed by `?dt=` and an integer destination tag. (This is useful when a user only has a hosted wallet.) | ripple:rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn?dt=23459 |

A user can have any number of aliases of any combination of the above types, in addition to non-Ripple aliases, which clients of Gateway Services should ignore.

<span class='draft-comment'>(But what if we want to send money to an off-ledger account? Can we support a type of URI that's for receiving money?)</span>

## Webfinger Links <a id="webfinger_links"></a> ##

<div class='draft-comment'>(Should we have only a link that matches the bridge-payments one, or one link that provides a URL specifically for getting a quote for a payment <em>to</em> this identifier? What about quotes for payments <em>from</em> this identifier? All of the above?

The `links` field of a WebFinger document should contain link elements describing where to find the following APIs:

* Bridge Payments: Get Quotes for payments where this person is the beneficiary
* Bridge Payments: Accept Quote for payments where this person is the beneficiary

Both of these should be specified exactly as in the host-meta, with the following exceptions:

* The `{receiver}` field of the Bridge Payments: Get Quotes `template` should be already filled-in with an appropriate URI based on the resource that was WebFingered.
* The `sender_claims` field of the Bridge Payments: Accept Quote `properties` may differ from the ones available in the host-meta, in case the WebFingered user has different required claims. 
</div>



# Bridge Payments #

The Bridge Payments service consists of the following three API calls.

The URL for all the Bridge Payments calls is relative to the base URL defined in the [Host-Meta Bridge Payments Link](#bridge-payments-link). This should always include at least: `/v1/bridge_payments` (The v1 may change in future versions.)

* [Get Quotes - `GET /quotes/{sender}/{receiver}/{amount}`](#get-quotes)
* [Accept Quote - `POST /`](#accept-quote)
* [Check Status - `GET /{id}`](#check-status)

All three of these operate on a single type: the Bridge Payment object. This is like a contract, representing a chain of steps that complete the intended payment from a sender to a receiver. Get Quotes returns a list of objects representing payments that could potentially happen; accept quote selects one and fills in all the necessary details, indicating that the client intends for it to happen; and Check Status confirms whether a payment is planned, in progress, or complete.

A payment object looks like this:

```js
{
    "gateway_tx_id": "9876",
    "gateway_tx_type": "in",
    "gateway_tx_state": "accepting",
    "gateway_tx_message": "In the process of accepting this quote",
    "expiration": "1311280970",
    "ripple_invoice_id": "8765",
    
    "sender": {
        "uri": "bob@bob-way.com",
        "bank_account": "073240754",
        "routing_number": "23790832978",
        "country": "USA",
        "bank_name": "Example Bank USA"
    },
    "sending_amount": {
        "amount": "5.125",
        "currency": "USD"
    },
    "sender_claims": [..JWTs here..],
    
    "destination": {
        "uri": "acct:stefan@fidor.de",
    },
    "destination_amount": {
        "amount": "5",
        "currency": "USD",
        "issuer": "r4tFZoa7Dk5nbEEaCeKQcY3rS5jGzkbn8a"
    },
    "destination_claims": [JWTs??],
    
    "inbound_bridge": "https://snapswap.us/knox",
    
    "outbound_bridge": "https://ripple.fidor.de",
    //other participating parties/money handlers??
}
```

The fields are defined as follows:

| Field              | Value  | Description |
|--------------------|--------|-------------|
| gateway\_tx\_id    | String | Arbitrary ID for this gateway payment. <span class='draft-comment'>(Probably an unsigned int? Limited character set?)</span> |
| gateway\_tx\_type  | String | <span class='draft-comment'>(in/out depends on a perspective. Not all the calls have perspective as written.)</span> |
| gateway\_tx\_state | String | What state the payment is in. Valid states are: `"quote"`, `"accepting"`, `"invoice"`, `"in_progress"`, `"complete"`, and `"canceled"` <span class='draft-comment'>Discuss.</span> |
| gateway\_tx\_message | String | A human-readable string describing the state the transaction is in. <span class='draft-comment'>(Maybe remove this?)</span> |
| expiration           | String | <span class='draft-comment'>Expiration time in, what, UNIX time seconds? Of the whole thing?</span> |
| ripple\_invoice\_id  | String | Arbitrary ID that will be used as the `InvoiceID` field of the Ripple payment <span class='draft-comment'>(What's the case for having different IDs for this payment on-Ripple and off-Ripple?)</span> |
| sender\_amount       | Object | <span class='draft-comment'>Not in example, but seems crucial.</span> |
| sender\_info | Object | Information about the sender. `uri` sub-field should match the sender from get-quotes URL. <span class='draft-comment'>Is this additional addressing info that may be necessary to make the payment? Do we need a corresponding receiver_info? Where do we define the fields?</span> |
| sender\_claims | Array | (Optional) Array of [JWTs](https://tools.ietf.org/html/draft-ietf-oauth-json-web-token-28) that provide KYC information about the sender <span class='draft-comment'>(and/or receiver?)</span> for compliance purposes. Each token is signed by some authority and may contain multiple claims. |
| destination          | Object | Info about the ultimate beneficiary of the payment. `uri` subfield is the receiver [URI](#gateway-services-uris) from the get-quotes URL |
| destination\_amount  | Object | <span class='draft-comment'>(Looks like a Ripple amount, but may not always be so.)</span> |
| destination\_claims  | Array | (Optional) <span class='draft-comment'>(Do we need claims for the one receiving the payment, too?)</span> |


## Get Quotes ##

Get Quotes tells you what your options are for making a payment.

__`GET https://latambridgepay.com/v1/bridge_payments/quotes/{sender}/{receiver}/{amount}`__

This API should accept parameters that are formatted as follows:

| Parameter | Format | Example(s) |
|-----------|--------|------------|
| sender    | A URL-encoded (%-escaped) [Gateway Services Identifier](#gateway-services-identifiers) | acct%3Abob%40ripple.com |
| receiver  | A URL-encoded (%-escaped) [Gateway Services Identifier](#gateway-services-identifiers) | ripple%3AraLiCEoiYDN3aTw2ZnGmEVXWwYXWiAxR7n |
| amount    | Decimal value, and 3-letter currency code <span class='draft-comment'>(What about demurraging currencies/assets like GBI XAU?)</span> for the currency, concatenated with a `+` | 10.99+USD |

Get Quotes is intended to be a recursive process: if the Gateway Services provider does not know how to make an outgoing payment to the receiver in the specified currency, it can perform a Get Quotes call using another gateway that it trusts, then 

<span class='draft-comment'>(How is that any different from the user querying the outbound gateway directly through a GWS client? Do the requests or the returned quotes look different?)</span>


### Get Quotes Response ###

```js
{
    "success": true,
    "bridge_payments": [
        ... (array of Payment objects in quote state. TODO: finalize payment object and fill in)
    ]
}
```


## Accept Quote ##

Bridge Payments lets you tell the gateway which payment you are making, so it can be ready.

```
POST https://latambridgepay.com/v1/bridge_payments/bob%40ripple.com

(body is a payment object in "accepting" state. TODO: finalize payment object and fill in)
```

No URL parameters. The request body is one of the objects from the `bridge_payments` field of the [Bridge Quotes Response](#bridge-quotes-response), with all the sender claims filled in, as necessary.

<span class='draft-comment'>(Some problems with the body here - does it really make sense to include gateway\_tx\_state, etc.? What's the difference between gateway\_tx\_id and ripple\_invoice\_id? Shouldn't sender amounts be included?)</span>





### Sender Claims Type Reference ###

<span class='draft-comment'>TBD</span>

### Error: Sender Claims Required ###

```
400 Bad Request
{
  success: false,
  "sender_claims_required": [
    "bank_account",
    "routing_number",
    "country",
    "bank_name",
  ]
}
```

## Check Status ##

Bridge payment status checks tells you whether a payment has happened yet.

__`GET https://latambridgepay.com/v1/bridge_payments/9876`__


<span class='draft-comment'>(This should also reflect any changes we make to the payment object.)</span>

Response:

```js
(payment object. TODO: finalize payment object and fill in)
```
