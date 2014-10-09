# Introduction #

The Gateway Services initiative aims to make gateways interoperable, extending the connectivity of the Ripple Network beyond the bounds of the Ripple ledger. The goal is to allow anyone who's connected to Ripple (not just Ripple account holders) to look up another Ripple-connected entity, find a path between them, quote the cost of a payment, and then make that payment, in a way that is consistent, regulation-compliant, and standards-compliant. It defines a series of REST API calls that make it possible for other gateways and Ripple client applications to perform all of these actions.

Gateways that implement these services can easily link with one another, allowing users who have a business relationship with one of them to send and receive money to parties that are connected to other gateways in an automated fashion, while remaining regulation-compliant. Our Gatewayd framework will implement all these services, so gateway operators using Gatewayd don't need to do anything beyond standard configuration, and those with custom gateway software can use Gatewayd as a reference implementation. 

## Components ##

| Service | Description | Based On | Replaces |
| ------- | ----------- | -------- | -------- |
| [host-meta](#host-meta) | Provides useful metadata about a gateway or service provider, and lists all service endpoints provided by the domain | [RFC6415](http://tools.ietf.org/html/rfc6415) | [ripple.txt](https://ripple.com/wiki/Ripple.txt) |
| [webfinger](#webfinger) | Performs reverse lookup of Ripple addresses, and lists service endpoints for interacting with a specified account holder | [RFC7033](http://tools.ietf.org/html/rfc7033) | [Federation Name Lookup](https://ripple.com/wiki/Federation_protocol) |
| [bridge-payment](#bridge-payment) | Plans payments from any Ripple-connected wallet to any other, connecting through gateways as necessary. | [Ripple-REST payments](http://dev.ripple.com/ripple-rest.html#payments) | [Bridge protocol](https://ripple.com/wiki/Services_API) |
| user-account | Provides standard method for registering an account with a Gateway, and provides signed claims about a user's identity  similar to bridge-payment's required claims | [OpenID Connect Claims](http://openid.net/specs/openid-connect-core-1_0.html#Claims), [JWT](http://tools.ietf.org/html/draft-ietf-oauth-json-web-token-25) | -- |
| wallet-payment | Makes outgoing payments and monitors for incoming payments, and works with hosted wallets. | [Ripple-REST payments](http://dev.ripple.com/ripple-rest.html#payments) | -- |
| wallet-info | Shows information about a wallet, and works with hosted wallets | [Ripple-REST accounts](http://dev.ripple.com/ripple-rest.html#accounts) | -- |
| wallet-balances | Shows information about balances in multiple currencies, and works with hosted wallets. | [Ripple-REST accounts](http://dev.ripple.com/ripple-rest.html#accounts) | -- |
| wallet-history | Shows history of payments sent and received, and works with hosted wallets. | [Ripple-REST payment history](http://dev.ripple.com/ripple-rest.html#payment-history) | -- |

# Host-Meta #

Host-Meta tells you about things operated by a domain.

[RFC6415](http://tools.ietf.org/html/rfc6415) defines a standardized way to publish metadata, including information about resources controlled by the host, for any domain. In contrast to the original spec, **Ripple uses the JSON version of host-meta exclusively**, and never queries for the XML version. This spec defines several Ripple-centric resources which a host can advertise in a host-meta file, so that other applications can automatically **find** the host's other Gateway services, and **verify** the domain's various Ripple assets. This extends and replaces the functionality of the [ripple.txt](https://wiki.ripple.com/Ripple.txt) spec.

The response to a host-meta request is a document called a JRD (JSON resource descriptor; there is also an XML version called an XRD). You can retrieve a domain's host-meta JRD by making an HTTP GET request to the `/.well-known/host-meta.json` path at the top level of the domain. You can also GET `/.well-known/host-meta` while providing an `Accept: application/json` header. Hosts implementing Gateway Services should support both methods.

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
            "rel": "https://gatewayd.org/gateway-services/bridge_quotes",
            "template": "https://latambridgepay.com/v1/bridge/quotes/{dest_acct}/{amount}",
            "properties": {
                "version": "1"
            }
        },
        {
            "rel": "https://gatewayd.org/gateway-services/bridge_payments",
            "href": "https://latambridgepay.com/v1/bridge/payments",
            "properties": {
                "version": "1",
                "fields": {
                    "sender_claims": {
                        "bank": {
                            "type": "AstropayBankCode",
                            "required": true,
                            "label": {
                                "en": "Astropay Bank Code",
                                "es": "Astropay Código del banco"
                            },
                            "description": {
                                "en": "Bank code from Astropay's documentation"
                            }
                        },
                        "country": {
                            "type": "AstropayCountryCode",
                            "required": true,
                            "label": {
                                "en": "Astropay Country Code"
                            },
                            "description": {
                                "en": "Country code from Astropay's documentation"
                            }
                        },
                        "cpf": {
                            "type": "PersonalIDNumber",
                            "required": true,
                            "label": {
                                "en": "Personal Government ID Number"
                            },
                            "description": {
                                "en": "Personal ID number from the Astropay documentation"
                            }
                        },
                        "name": {
                            "type": "FullName",
                            "required": true,
                            "label": {
                                "en": "Sender's Full Name"
                            },
                            "description": {
                                "en": "First and last name of sender"
                            }
                        },
                        "email": {
                            "type": "EmailAddress",
                            "required": true,
                            "label": {
                                "en": "Sender's Email Address"
                            },
                            "description": {
                                "en": "Sender's Email Address"
                            }
                        },
                        "bdate": {
                            "type": "Date",
                            "required": true,
                            "label": {
                                "en": "YYYYMMDD"
                            },
                            "description": {
                                "en": "Sender's date of birth"
                            }
                        }
                    }
                }
            }
        },
        {
            "rel": "https://gatewayd.org/gateway-services/bridge_payment_status",
            "template": "https://latambridgepay.com/api/v1/bridge/payments/{id}",
            "properties": {
                "version": "1"
            }
        }
    ]
}
```

This file is divided up into the following elements:

## Aliases ##

[Aliases are NOT RECOMMENDED](http://tools.ietf.org/html/rfc6415#section-3.1) in host-meta, according to the spec. Consumers of Gateway Services should not rely on any content there.

## Properties ##

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
| rl:type  | String | What type of Ripple entity this domain is, for example `"gateway"` |
| rl:domain | String | The domain this host-meta document applies to, which should match the one it is being served from. For example, `"coin-gate.com"` |
| rl:accounts | Array of objects | Each member of this array should be an [account definition object](#acct_def_obj) for an issuing account (cold wallet) operated by this host |
| rl:hotwallets | Array of strings | Each member of this array should be either a base-58-encoded Ripple Address or a Ripple Name for a hot wallet operated by the host |

<span class='draft-comment'>(Might Ripple clients also use the standard objects "name" and "description"?)</span>

#### Account Definition Object <a name="acct_def_obj"></a> ####

An account definition object is a JSON object with the following properties:

| Property | Value | Description |
|----------|-------|-------------|
| address | String | Base-58-encoded Ripple address |
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

## Links ##

The `links` field contains links to almost anything, where the meaning of the link is programmatically identified by a relation type, typically a URI, in the `rel` field of the link object. Gateways should use links to advertise the other Gateway Services APIs that they offer.

Gateway Services requires the following links in host-meta:

* [Webfinger link](#webfinger_link)
* [Bridge Payments Quotes link](#bridge_quotes_link)
* [Bridge Payments Accept link](#bridge_payments_link)
* [Bridge Payments Status link](#bridge_payment_status_link)
* <span class='draft-comment'>(Additional services like user-account and wallet-info TBD?)</span>


### Webfinger Link <a name="webfinger_link"></a> ###

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

For Gateway Services purposes, Webfinger API should accept requests that are formatted as follows:

| Parameter | Format | Example(s) |
|-----------|--------|------------|
| uri       | URL-encoded (%-escaped) string, prepended with "acct:" and with <span class='draft-comment'>one of the following: email address, federation address, Ripple account, Ripple name, Routing number and Bank number concatenated with a `+`</span> | bob@ripple.com <br>bob@fidor.de <br>rBWay8KRdmroZra4DTXi6h5cLtPhs5mH7v <br>~bob <br>92734089709+1272301 |

For the details of the response, see the [Gateway Services Webfinger Reference](#webfinger).


### Bridge Payments: Quotes Link <a name="bridge_quotes_link"></a> ###

Also see the [Bridge-Quotes Reference](#bridge-quotes).

```js
    ...
    "links": [
    ...
        {
            "rel": "https://gatewayd.org/gateway-services/bridge_quotes",
            "template": "https://latambridgepay.com/v1/bridge/quotes/{dest_acct}/{amount}",
            "properties": {
                "version": "1"
            }
        },
    ...
```

The fields of the link are defined as follows:

| Field    | Value  |
|----------|--------|
| rel      | `https://gatewayd.org/gateway-services/bridge_quotes` |
| template | The URL of your bridge-quotes service, with `{dest_acct}` in place of the account to send to, and `{amount}` in the place of how much to send. |
| properties | Object with key-value map of properties for this link. |

#### Properties ####

The following properties should be provided:

| Field    | Value  |
|----------|--------|
| version  | `"1"` for this version of the spec. |


### Bridge Payments: Accept Link <a name="bridge_payments_link"></a> ###

```js
        ...
        "links": [
        ...
        {
            "rel": "https://gatewayd.org/gateway-services/bridge_payments",
            "href": "https://latambridgepay.com/v1/bridge/payments",
            "properties": {
                "version": "1",
                "fields": {
                    "sender_claims": {
                        "bank": {
                            "type": "AstropayBankCode",
                            "required": true,
                            "label": {
                                "en": "Astropay Bank Code",
                                "es": "Astropay Código del banco"
                            },
                            "description": {
                                "en": "Bank code from Astropay's documentation"
                            }
                        },
                        "country": {
                            "type": "AstropayCountryCode",
                            "required": true,
                            "label": {
                                "en": "Astropay Country Code"
                            },
                            "description": {
                                "en": "Country code from Astropay's documentation"
                            }
                        },
                        ...
                    }
                }
            }
        },
        ...
```

The fields of the link are defined as follows:

| Field    | Value  |
|----------|--------|
| rel      | `https://gatewayd.org/gateway-services/bridge_payments` |
| <span class='draft-comment'>href</span>     | The URL of your payments API. (No variable parameters in the URL) |
| properties | Object with key-value map of properties for this link. |

#### Properties ####

The following properties should be provided:

| Field    | Value  |
|----------|--------|
| version  | `"1"` for this version of the spec. |
| fields   | Specification of body fields for this method. <span class='draft-comment'>(But only the ones that are customizeable?)</span> |

For Bridge Payment, the `fields` property should include a `sender_claims` object that defines all the sender claims that might be provided as sub-fields to the `sender_claims` object of a payment at the time of submission. Importantly, this includes a definition of which fields are required or optional. Each field should be defined by the following parameters:

| Field    | Value  | Description |
|----------|--------|-------------|
| type     | String ([Sender Claims Types](#sender-claims-type-reference)) | What sort of data should go in this field. |
| required | Boolean | Whether or not this claim is required in order to send a payment. |
| label    | Object | Map of brief labels for this field. Keys should be [two-character ISO-639.1 codes](http://www.loc.gov/standards/iso639-2/php/code_list.php), and values should be human-readable Unicode strings (in the corresponding language) suitable for display in a UI. |
| description | Object | Map of longer descriptions for this field. Keys should be [two-character ISO-639.1 codes](http://www.loc.gov/standards/iso639-2/php/code_list.php) <span class='draft-comment'>(or 3 letter codes instead? Any preferences?)</span>, and values should be human-readable Unicode strings (in the corresponding language) suitable for display in a UI. |

For the label and description fields, user-agent applications can choose which language to display, and which languages to fall back on in cases where the preferred language is not provided.


### Bridge Payments: Status Link <a name="bridge_payment_status_link"></a> ###

```js
    ...
    "links": 
    ...
    {
      "rel": "https://gatewayd.org/gateway-services/bridge_payment_status",
      "template": "https://latambridgepay.com/api/v1/bridge/payments/{id}",
      "properties": {
        "version": "1"
      }
    }
    ...
```

The fields of the link are defined as follows:

| Field    | Value  |
|----------|--------|
| rel      | `https://gatewayd.org/gateway-services/bridge_payment_status` |
| template | The URL of your bridge-quotes service, with `{id}` in place of the payment to check |
| properties | Object with key-value map of properties for this link. |

#### Properties ####

The following properties should be provided:

| Field    | Value  |
|----------|--------|
| version  | `"1"` for this version of the spec. |




# WebFinger #

WebFinger tells you about a person, hopefully including how to send money to that person.

[RFC7033](http://tools.ietf.org/html/rfc7033) defines the WebFinger protocol as a way to discover information about people or other entities on the internet, from a URI that might not be usable as a locator otherwise, such as an account or email address. The response to a WebFinger request is like the response to a Host-Meta request, but relates to a specific user (or resource) instead of to the domain. The response to a WebFinger request is also called a JRD (JSON Resource Descriptor) 

Gateway Services uses WebFinger to identify the possible beneficiaries of a payment. defines specific types of *aliases* and *links* that provide information about a user with regards to Ripple: what accounts represent that user, and what services can be used to send money to the user.

__`GET https://latambridgepay.com/.well-known/webfinger?resource=ripple:bob`__

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
            "rel": "https://gatewayd.org/gateway-services/bridge_quotes",
            "href": "https://latambridgepay.com/v1/bridge/quotes",
            "titles": {
                "default": "Get quotes to send funds between Ripple and bank accounts in Latin America."
            }
        },
        {
            "rel": "https://gatewayd.org/gateway-services/bridge_payments",
            "href": "https://latambridgepay.com/v1/bridge/payments",
            "titles": {
                "default": "Send funds between Ripple and bank accounts in Latin America."
            }
        }
    ],
    "properties": {}
}
```

## Aliases ##

The `aliases` field of a WebFinger document can contain various values, including ones that are not related to Ripple. Gateway Services defines three formats for aliases that refer to Ripple addresses:

| Alias for   | Format | Example
|-------------|----
| Ripple Name | `ripple:` followed by the user's Ripple Name, without the tilde (~) | ripple:bob |
| Ripple Address | `ripple:` followed by the user's base-58 encoded Ripple address | ripple:rBWay8KRdmroZra4DTXi6h5cLtPhs5mH7v |
| Ripple Address with Destination Tag | `ripple:` followed by the user's base-58 encoded Ripple address, followed by `?dt=` and an integer destination tag. (This is useful when a user only has a hosted wallet.) | ripple:rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn?dt=23459 |

A user can have any number of aliases of any combination of the above types, in addition to non-Ripple aliases, which clients of Gateway Services should ignore.


## Links ##

The `links` field of a WebFinger document should contain link elements describing where to find the following APIs:

* Bridge Payments: Get Quotes for payments where this person is the beneficiary
* Bridge Payments: Accept Quote for payments where this person is the beneficiary

### Bridge Payments Get Quotes for user ###


# Bridge Payments: Get Quotes #

Get Quotes tells you what your options are for making a payment.

__`GET https://latambridgepay.com/v1/bridge/quotes/{dest_acct}/{amount}`__

This API should accept parameters that are formatted as follows:

| Parameter | Format | Example(s) |
|-----------|--------|------------|
| dest_acct | URL-encoded (%-escaped) string, prepended with "acct:" and with <span class='draft-comment'>one of the following: email address, federation address, Ripple account, Ripple name, Routing number and Bank number concatenated with a `+`</span> | bob@ripple.com <br>bob@fidor.de <br>ripple:rBWay8KRdmroZra4DTXi6h5cLtPhs5mH7v <br>ripple:bob <br>92734089709+1272301 |
| amount    | Decimal value, and 3-letter currency code <span class='draft-comment'>(Or hex code for say, GBI?)</span> for the currency, concatenated with a `+` | 10.99+USD |

## Bridge Quotes Response ##

```js
{
    "success": true,
    "bridge_payments": [
        {
            "gateway_tx_id": "9876",
            "gateway_tx_type": "in",
            "gateway_tx_state": "quote",
            "gateway_tx_message": "Inactive, must be posted.",
            "destination_account": "acct:stefan@fidor.de",
            "destination_amount": {
                "amount": "5",
                "currency": "USD",
                "issuer": "r4tFZoa7Dk5nbEEaCeKQcY3rS5jGzkbn8a"
            },
            "ripple_invoice_id": "8765",
            "sender_claims": {
                "bank_account": "",
                "routing_number": "",
                "country": "",
                "bank_name": ""
            }
        }
    ]
}
```

# Bridge Payments: Accept Quote #

Bridge Payments lets you tell the gateway which payment you are making, so it can be ready.

__`GET https://latambridgepay.com/v1/bridge/quotes/ripple:bob/5+USD`__

```
POST https://latambridgepay.com/v1/bridge/payments

{
    "gateway_tx_id": "9876",
    "gateway_tx_type": "in",
    "gateway_tx_state": "quote",
    "gateway_tx_message": "Inactive, must be posted.",
    "destination_account": "acct:stefan@fidor.de",
    "destination_amount": {
        "amount": "5",
        "currency": "USD",
        "issuer": "r4tFZoa7Dk5nbEEaCeKQcY3rS5jGzkbn8a"
    },
    "ripple_invoice_id": "8765",
    "sender_claims": {
        "bank_account": "073240754",
        "routing_number": "23790832978",
        "country": "USA",
        "bank_name": "Example Bank USA"
    }
}
```

No URL parameters. The request body is one of the objects from the `bridge_payments` field of the [Bridge Quotes Response](#bridge-quotes-response), with all the sender claims filled in, as necessary.

<span class='draft-comment'>(Some problems with the body here - does it really make sense to include gateway\_tx\_state, etc.? What's the difference between gateway\_tx\_id and ripple\_invoice\_id?)</span>





## Sender Claims Type Reference ##

<span class='draft-comment'>TBD</span>

## Sender Claims Required Failure ##

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

# Bridge Payments: Check Status #

Bridge payment status checks tells you whether a payment has happened yet.

__`GET https://latambridgepay.com/v1/bridge/payments/9876`__


Response:

```js
{
  "success": true,
  "bridge_payment": {
    "gateway_tx_id": "9876",
    "gateway_tx_type": "in", // in to ripple
    "gateway_tx_state": "invoice",
    "gateway_tx_message": "Invoice, must be paid.",
    "expiration": "1311280970"
    "destination_account": "acct:stefan@fidor.de",
    "destination_amount": {
        "amount": "5",
        "currency": "USD",
        "issuer": "r4tFZoa7Dk5nbEEaCeKQcY3rS5jGzkbn8a"
    },
    "ripple_invoice_id": "8765", <== Add invoice_id column to ripple_transactions
    "sender_claims": {
      "bank_account": "somebankaccount",
      "routing_number": "routingnumber",
      "country": "countrt",
      "bank_name": "bankname"
    }
  }
}
```
