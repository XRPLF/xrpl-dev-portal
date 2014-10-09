# Gateway Services #

The Gateway Services initiative aims to make gateways interoperable, extending the connectivity of the Ripple Network beyond the bounds of the Ripple ledger. The goal is to allow anyone who's connected to Ripple (not just Ripple account holders) to look up another Ripple-connected entity, find a path between them, quote the cost of a payment, and then make that payment, in a way that is consistent, regulation-compliant, and standards-compliant. It defines a series of REST API calls that make it possible for other gateways and Ripple client applications to perform all of these actions.

Gateways that implement these services can easily link with one another, allowing users who have a business relationship with one of them to send and receive money to parties that are connected to other gateways in an automated fashion, while remaining regulation-compliant. Our Gatewayd framework will implement all these services, so gateway operators using Gatewayd don't need to do anything beyond standard configuration, and those with custom gateway software can use Gatewayd as a reference implementation. 

## Components ##

| Service | Description | Based On | Replaces |
| ------- | ----------- | -------- | -------- |
| host-meta | Provides useful metadata about a gateway or service provider, and lists all service endpoints provided by the domain | [RFC6415](http://tools.ietf.org/html/rfc6415) | [ripple.txt](https://ripple.com/wiki/Ripple.txt) |
| webfinger | Performs reverse lookup of Ripple addresses, and lists service endpoints for interacting with a specified account holder | [RFC7033](http://tools.ietf.org/html/rfc7033) | [Federation Name Lookup](https://ripple.com/wiki/Federation_protocol) |
| bridge-payment | Plans and sends payments from any Ripple-connected wallet to any other, connecting through gateways as necessary. | [Ripple-REST payments](http://dev.ripple.com/ripple-rest.html#payments) | [Bridge protocol](https://ripple.com/wiki/Services_API) |
| user-account | Provides standard method for registering an account with a Gateway, and provides signed claims about a user's identity  similar to bridge-payment's required claims | [OpenID Connect Claims](http://openid.net/specs/openid-connect-core-1_0.html#Claims), [JWT](http://tools.ietf.org/html/draft-ietf-oauth-json-web-token-25) | -- |
| wallet-payment | Makes outgoing payments and monitors for incoming payments, and works with hosted wallets. | [Ripple-REST payments](http://dev.ripple.com/ripple-rest.html#payments) | -- |
| wallet-info | Shows information about a wallet, and works with hosted wallets | [Ripple-REST accounts](http://dev.ripple.com/ripple-rest.html#accounts) | -- |
| wallet-balances | Shows information about balances in multiple currencies, and works with hosted wallets. | [Ripple-REST accounts](http://dev.ripple.com/ripple-rest.html#accounts) | -- |
| wallet-history | Shows history of payments sent and received, and works with hosted wallets. | [Ripple-REST payment history](http://dev.ripple.com/ripple-rest.html#payment-history) | -- |

## Host-Meta ##

[RFC6415](http://tools.ietf.org/html/rfc6415) defines a standardized way to publish metadata, including information about resources controlled by the host, for any domain. In contrast to the original spec, **Ripple uses the JSON version of host-meta exclusively**, and never queries for the XML version. This spec defines several Ripple-centric resources which a host can advertise in a host-meta file, so that other applications can automatically **find** the host's other Gateway services, and **verify** the domain's various Ripple assets. This extends and replaces the functionality of the [ripple.txt](https://wiki.ripple.com/Ripple.txt) spec.

Here is an example of an entire host-meta file:

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
            "href": "https://latambridgepay.com/v1/bridge/quotes/",
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
            "href": "https://latambridgepay.com/api/v1/bridge/payments",
            "properties": {
                "version": "1"
            }
        }
    ]
}
```

## Elements of the host-meta file ##

### Aliases ###

[Aliases are NOT RECOMMENDED](http://tools.ietf.org/html/rfc6415#section-3.1) in host-meta, according to the spec. Consumers of Gateway Services should not rely on any content there.

### Properties ###

```js
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

### Links ###

The `links` field contains links to almost anything, where the meaning of the link is programmatically identified by a relation type, typically a URI, in the `rel` field of the link object. Gateways should use links to advertise the other Gateway Services APIs that they offer.

Ripple defines the following link types:

#### Webfinger ####

```js
    ...
    "links": [
        {
            "rel": "lrdd",
            "template": "https://latambridgepay.com/.well-known/webfinger.json?q={uri}"
        },
    ...
```

This is not our invention, but Gateway Services requires the use of the Webfinger protocol.


#### Bridge Quotes

#### Bridge Payments

#### Bridge Payment Status
