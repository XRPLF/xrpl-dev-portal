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
* Up to two gateways operating as inbound bridge (onto Ripple) and/or outbound bridges (off of Ripple)
* Up to two "Participating parties" (one on each end of the transaction), for example the clerk at a store receiving or handing out cash. This may be important for compliance purposes, especially for remittance.

As a general rule on the web at large, any URI starts with a "scheme" portion, followed by a colon, for example `http:`. Gateway service supports using URIs with several different schemes as identifiers to represent the parties to a payment. Depending on the scheme, a particular URI may map to something different:

* `acct:` identifiers refer to a user account at a particular service, such as an account at a bank or financial service.
* `ripple:` identifiers refer to a specific Ripple account in the shared global ledger
* `http:` and `https:` identifiers, always followed by *a domain only*, refer to a specific business entity that is connected to Ripple
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
| Domain             | http://snapswap.us | Use [host-meta](#host-meta) instead. |

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

## Currency Codes ##

Currency codes in Gateway Services are specified as they are in Ripple. In most common cases, this means that currencies are provided as three-letter [ISO4217](http://www.xe.com/iso4217.php/) identifiers such as `"USD"`. Three-letter identifiers should be **case-insensitive**. 

A currency can also be provided as a 160-bit hexadecimal string, in case it has unusual properties such as built-in demurrage. For example, gold with 0.5% annual demurrage from [Gold Bullion International](http://www.bullioninternational.com/digital-physical-gold/) is represented as the string `"0158415500000000C1F76FF6ECB0BAC600000000"`. 

It is RECOMMENDED that Gateway Services providers and clients should be able to recognize hex values that refer to common 3-letter currencies. This can be achieved by the following method:

* Convert three-letter codes to uppercase. (This is important! Even though "btc" is considered the same as "BTC", both should map to the same hex)
* Determine the hex ASCII codes for those letters. For example, "JPY" is "4A5059". 
* Render the hex code as "000000000000000000000000" + the hex of the 3-letter currency code + "0000000000"
* If this code matches a hex code that is provided directly, then they are the same currency.

See [Currency Format](https://wiki.ripple.com/Currency_format) for more detailed information on the hex representation..




# Host-Meta #

Host-Meta tells you about things operated by a domain.

[RFC6415](http://tools.ietf.org/html/rfc6415) defines a standardized way to publish metadata, including information about resources controlled by the host, for any domain. In contrast to the original spec, **Ripple uses the JSON version of host-meta exclusively**, and never queries for the XML version. This spec defines several Ripple-centric resources which a host can advertise in a host-meta file, so that other applications can automatically **find** the host's other Gateway services, and **verify** the domain's various Ripple assets. This extends and replaces the functionality of the [ripple.txt](https://wiki.ripple.com/Ripple.txt) spec.

The response to a host-meta request is a document called a JRD (JSON resource descriptor; there is also an XML version called an XRD). 

#### Request Format ####

```
GET /.well-known/host-meta.json
```

Alternate request format:

```
GET /.well-known/host-meta
Accept: application/json
```

__*Note:*__ Some domains that do not use Gateway Services may implement host-meta without providing a JRD. In this case, the alternate request format may return an XRD document instead of a Not Found error.


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
            "template": "https://latambridgepay.com/.well-known/webfinger.json?q={uri}",
            "properties": {
                "rl:uri_schemes": ["paypal","bitcoin","acct","ripple"]
            }
        },
        {
            "rel": "https://gatewayd.org/gateway-services/bridge_payments",
            "href": "https://latambridgepay.com/v1/bridge_payments",
            "properties": {
                "version": "1",
                "additional_info_definitions":{
                    "bank": {
                      "type": "AstropayBankCode",
                      "label": {
                        "en": "Astropay Bank Code"
                      },
                      "description": {
                        "en": "Bank code from Astropay's documentation"
                      }
                    },
                    "country": {
                      "type": "AstropayCountryCode",
                      "label": {
                        "en": "Astropay Country Code",
                      },
                      "description": {
                        "en": "Country code from Astropay's documentation"
                      }
                    },
                    "cpf": {
                      "type": "PersonalIDNumber",
                      "label": {
                        "en": "Personal Government ID Number"
                      },
                      "description": {
                        "en": "Personal ID number from the Astropay documentation"
                      },
                    }
                    "name": {
                      "type": "FullName",
                      "label": {
                        "en": "Sender's Full Name"
                      },
                      "description": {
                        "en": "First and last name of sender"
                      }
                    },
                    "email": {
                      "type": "EmailAddress",
                      "label": {
                        "en": "Sender's Email Address"
                      },
                      "description": {
                        "en": "Sender's Email Address"
                      }
                    },
                    "bdate": {
                      "type": "Date",
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

<span class='draft-comment'>TBD: format for providing a JWT-signing PubKey in the properties. (Possibly use OpenID format?)</span>

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
* <span class='draft-comment'>(As additional services are defined, they should have links added to host-meta.)</span>


### WebFinger Link <a name="webfinger_link"></a> ###

This link indicates where the [WebFinger (lrdd) service](#webfinger) is provided.

```js
    ...
    "links": [
        {
            "rel": "lrdd",
            "template": "https://latambridgepay.com/.well-known/webfinger.json?q={uri}",
            "properties": {
                "rl:uri_schemes": ["paypal","bitcoin","acct","ripple"]
            }
        },
    ...
```

Gateway Services requires the use of the [Webfinger protocol](https://code.google.com/p/webfinger/wiki/WebFingerProtocol). The fields of the link are defined as follows:

| Field    | Value  |
|----------|--------|
| rel      | `lrdd` |
| template | The URL of your webfinger service, with `{uri}` in place of the resource to look up. |
| properties | Object with properties of this link |

The `properties` field should contain the following field:

| Field          | Value | Description |
|----------------|-------|-------------|
| rl:uri_schemes | Array | Each member of this array refers to the scheme section (the part before the first colon) of [Gateway Services Identifiers](#gateway-services-identifiers) that can be WebFingered at this location. By default, Gateway Services providers should support `acct` and `ripple`; other schemes indicate that the gateway operates a bridge that can send to and/or receive from identifiers for those schemes. |


### Bridge Payments Link <a name="bridge_payments_link"></a> ###

This link indicates where the [Bridge-Payments Service](#bridge-payments) is provided, and information about it.

```js
    ...
    "links": [
    ...
        {
            "rel": "https://gatewayd.org/gateway-services/bridge_payments",
            "href": "https://latambridgepay.com/v1/bridge_payments",
            "properties": {
                "version": "1",
                "bridges": [
                    {
                        "currency": "USD",
                        "scheme": "astropay",
                        "direction": "both"
                    },
                    {
                        "currency": "BTC",
                        "scheme": "bitcoin",
                        "direction": "in"
                    }
                ],
                "additional_info_definitions":{
                    "bank": {
                      "type": "AstropayBankCode",
                      "label": {
                        "en": "Astropay Bank Code"
                      },
                      "description": {
                        "en": "Bank code from Astropay's documentation"
                      }
                    },
                    "country": {
                      "type": "AstropayCountryCode",
                      "label": {
                        "en": "Astropay Country Code",
                      },
                      "description": {
                        "en": "Country code from Astropay's documentation"
                      }
                    },
                    "cpf": {
                      "type": "PersonalIDNumber",
                      "label": {
                        "en": "Personal Government ID Number"
                      },
                      "description": {
                        "en": "Personal ID number from the Astropay documentation"
                      },
                    }
                    "name": {
                      "type": "FullName",
                      "label": {
                        "en": "Sender's Full Name"
                      },
                      "description": {
                        "en": "First and last name of sender"
                      }
                    },
                    "email": {
                      "type": "EmailAddress",
                      "label": {
                        "en": "Sender's Email Address"
                      },
                      "description": {
                        "en": "Sender's Email Address"
                      }
                    },
                    "bdate": {
                      "type": "Date",
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
| bridges  | Array of objects describing any Ripple bridges operated by this gateway. |
| additional\_info\_definitions | Definitions of all additional fields that may be requested to make payments through this API. |

Each member of the `bridges` array should be an object with the following fields:

| Field     | Value  | Description |
|-----------|--------|-------------|
| currency  | String | Currency code for the currency supported by this bridge. |
| scheme    | String | A valid URI scheme that matches identifiers used to make non-Ripple payments to or from this bridge. See [Gateway Services Identifiers](#gateway-services-identifiers) for a list of schemes. The scheme `ripple` is not valid here. |
| direction | String | Whether this bridge supports payments into the Ripple network (`in`), payments out from the Ripple network (`out`) or payments in both directions (`both`). Any other values of this field are invalid. |

Each field name in the `additional_info` object should match a field that may be requested by the [Get Quotes method](#get-quotes). The contents of that field in the host-meta should be a definition of the field, so that client applications can create a user interface to request the user to fill in those fields.

| Field    | Value  | Description |
|----------|--------|-------------|
| type     | String ([Additional Info Types](#additional-info-type-reference)) | What sort of validation should be performed on this field. |
| label    | Object | Map of brief labels for this field. Keys should be [two-character ISO-639.1 codes](http://www.loc.gov/standards/iso639-2/php/code_list.php), and values should be human-readable Unicode strings (in the corresponding language) suitable for display in a UI. |
| description | Object | Map of longer descriptions for this field. Keys should be [two-character ISO-639.1 codes](http://www.loc.gov/standards/iso639-2/php/code_list.php), and values should be human-readable Unicode strings (in the corresponding language) suitable for display in a UI. |

For the label and description fields, client applications can choose which language to display, and which languages to fall back on in cases where the preferred language is not provided.

### Additional Info Type Reference ###

<span class='draft-comment'>TBD</span>




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
| uri   | A valid, URL-encoded [Gateway Services URI](gateway-services-identifiers) | The resource to look up. For Gateway Services, should be an account that might send or receive money, or be otherwise involved in a payment. |

#### Response Format ####

The response is a JRD, in a similar format to the response to [host-meta](#host-meta). Gateway Services uses specific [Aliases](#webfinger_aliases) and [Links](#webfinger_links) as described.

#### Example request: ####

__`GET https://latambridgepay.com/.well-known/webfinger?resource=ripple:bob`__


#### Example response: ####

```js
{
    "subject": "ripple:bob",
    "expires": "2014-10-07T22:46:35.097Z",
    "aliases": [
        "ripple:bob",
        "ripple:rBWay8KRdmroZra4DTXi6h5cLtPhs5mH7v",
        "paypal:bob@bob-way.com"
    ],
    "links": [
        {
            "rel": "https://gatewayd.org/gateway-services/bridge_payments",
            "href": "https://latambridgepay.com/v1/bridge_payments",
            "properties": {
                "version": "1",
                "send_to": 
                [
                    {
                        "uri": "acct:bob@bob-way.com",
                        "currencies": ["USD", "XAU"]
                    },
                    {
                        "uri": "paypal:bob@bob-way.com",
                        "currencies": ["USD"]
                    },
                    {
                        "uri": "bitcoin:1Y23423jf9234...",
                        "currencies": ["BTC"]
                    }
                ]
            }
        }
    ]
}
```


## Webfinger Aliases <a id="webfinger_aliases"></a> ##

```js
    ...
    "aliases": [
        "ripple:bob",
        "ripple:rBWay8KRdmroZra4DTXi6h5cLtPhs5mH7v",
        "paypal:bob@bob-way.com"
    ],
    ...
```

The `aliases` field of a WebFinger document can contain various values, including ones that are not related to Ripple. Aliases that match supported [Gateway Services URIs](#gateway-services-identifiers) can be used to identify this account as a party to a payment.

If you WebFinger any of the aliases at the same domain, the resulting document should be the same. Optionally, the `subject` field may change to reflect the resource requested in the URL. Alternatively, the `subject` field can remain the same, to indicate the preferred URI for a particular resource.

<span class='draft-comment'>(TODO: Discuss weird edge cases here where an alias does not necessarily mean that the user can be paid according to that scheme by this gateway.)</span>


## Webfinger Links <a id="webfinger_links"></a> ##

The `links` field of a WebFinger document should contain link elements describing where to find the following APIs:

* Bridge Payments
* <span class='draft-comment'>As we add other APIs that are relevant for a particular user, links to those APIs should be added to the WebFinger response.</span>
* Optionally, additional links with information relevant to this party can be added. <span class='draft-comment'>The Gateway Services spec may grow to include some uses of additional links, for example location data that can be used by client applications to select from agents in different regions.</span>

### Bridge Payments Link <a id='webfinger_bridgepayments_link'></a> ###

```js
    ...
    {
        "rel": "https://gatewayd.org/gateway-services/bridge_payments",
        "href": "https://latambridgepay.com/v1/bridge_payments",
        "properties": {
            "version": "1",
            "send_to": 
            [
                {
                    "uri": "acct:bob@bob-way.com",
                    "currencies": ["USD", "XAU"]
                },
                {
                    "uri": "paypal:bob@bob-way.com",
                    "currencies": ["USD"]
                },
                {
                    "uri": "bitcoin:1Y23423jf9234...",
                    "currencies": ["BTC"]
                }
            ]
        }
    }
    ...
```

The Bridge-Payments link indicates where to find the [Bridge-Payments](#bridge-payments) service for the user in the URL; the URL provided is used as the base for Bridge-Payments methods. Unlike the version of this link in host-meta, the version in the WebFinger JRD does not have a definition of all the fields that might be requested in the `additional_info` paramter. (That information is omitted because it is not related to the resource being WebFingered.)

Instead, the Bridge-Payments link the WebFinger JRD has a `send_to` property, which indicates which identifiers should be used to send different currencies to the resource being queried. Each element in the `send_to` array should be an object with the following fields:

| Field | Value | Description |
|-------|-------|-------------|
| uri   | A valid [Gateway Services URI](#gateway-services-identifiers) | This identifies a particular identifier that should be used at this gateway-services link when the resource in the URL is receiving a payment. It may or may not be the same as the URI from the request. Any given URI should only appear once in the `send_to` array. |
| currencies | Array | The [currency codes](#currency-codes) for one or more currencies that should be sent to the associated identifier using this bridge-payments service. |

It is possible that a provider of Gateway Services may only provide WebFinger on a particular domain, so that the `href` for Bridge-Payments may be different for different resources. For example, an individual can set up her personal domain to run WebFinger, so that querying the person's personal email address returns a link to a bridge-payments service operated by a chosen gateway. It is even possible that there may be multiple instances of the Bridge-Payments link (with the same `rel`) but different destinations and properties, indicating that the resource has multiple Gateway Services providers it trusts.



# Bridge Payments #

The Bridge Payments service consists of the following three API calls.

The URL for all the Bridge Payments calls is relative to the base URL defined in the [Host-Meta Bridge Payments Link](#bridge-payments-link). This should always include at least: `/v1/bridge_payments` (The v1 may change in future versions.)

* [Get Quotes - `GET /quotes/{sender}/{receiver}/{amount}`](#get-quotes)
* [Accept Quote - `POST /`](#accept-quote)
* [Check Status - `GET /{id}`](#check-status)

All three of these operate on a single type: the Gateway Transaction object. 


## Gateway Transaction Objects ##

A Gateway Transaction defines is a type of object that represents a payment through a gateway. This is like a contract, representing a chain of steps that complete the intended payment from a sender to a receiver. 

It looks like this:

```js
{
    "id": "9876A034899023AEDFE",
    "state": "quote",
    "created": "2014-09-23T19:20:20.000Z",
    
    "source": {
        "uri": "bobway@snapswap.us",
        "claims_required": ["dob","us_ssn","zip"],
        "claims_jwts": ["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYW1pbHlfbmFtZSI6IlJlZ2luZWxsaSIsImdpdmVuX25hbWUiOiJSb21lIn0.o0l4dfizDHOlbqJonkwyqBhufIwfXX9Ltjv56Fcn9SQ", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXNzYWdlIjoiQ29uZ3JhdHVsYXRpb25zLCB5b3UgZGVjb2RlZCBhIEpXVCJ9.msBhzh2yzZabnMei9b1mchspWXWS0xOxCf4Vlhd6mAg"],
        "additional_info": { 
            "bank_account": "073240754",
            "routing_number": "23790832978",
            "country": "USA",
            "bank_name": "Example Bank USA"
        }
    },
    
    "wallet_payment": {
        "destination": "ripple:snapswap"
        "primary_amount": {
            "amount": "5.125",
            "currency": "USD",
            "issuer": ""
        },
        "invoice_id": "87246",
        "expiration": "2014-09-23T20:20:20.000Z",
    },
    
    "destination": {
        "uri": "acct:stefan@fidor.de",
        "claims_required": [],
        "claims_jwts": [],
        "additional_info": {
            "zip": "83902-1135"
        }
    },
    "destination_amount": {
        "amount": "5",
        "currency": "USD",
        "issuer": "r4tFZoa7Dk5nbEEaCeKQcY3rS5jGzkbn8a"
    },
    
    "parties": {
        "inbound_bridge": "snapswap.us/knox",
        "outbound_bridge": "ripple.fidor.de",
        "sending_agent": "handler33@brickandmort.ar",
        "receiving_agent": ""
    }
}
```

The fields are defined as follows:

| Field              | Value  | Description |
|--------------------|--------|-------------|
| id    | String | An identifying hash value that uniquely describes this gateway payment. This is a 256-bit hash of the Gateway Transaction object, omitting the `wallet_payment`, the `state`, and the `id` itself. If any Ripple transactions are made as part of this gateway transaction, they should use this value as the `InvoiceID` field of the Ripple payment. Not included until the response to Accept Quote. |
| created | String | The time that this resource was initially created as part of a Get-Quotes request, as an ISO8601 extended format string. This time never changes throughout the lifetime of the object. This is included so that the hashed ID is different if the same parties make a payment for the same amount on different dates. |
| state | String | What state the payment is in. Valid states are: `"quote"`, `"invoice"`, `"in_progress"`, `"complete"`, and `"canceled"`. |
| source | Object | Information about the originator of the payment. |
| wallet\_payment | Object | An object that defines the payment which will initiate the entire chain of necessary transactions. After you accept the quote, you post the **wallet\_payment** object to the appropriate API to make the payment that starts the chain. <span class='draft-comment'>(This object is not yet fully defined.)</span> |
| wallet\_payment.expiration | String | Expiration time in ISO8601 extended format. The initial wallet payment will not be accepted if it arrives after this time. When the quote is accepted, the gateway may optionally extend the expiration to a later time. |
| destination          | Object | Info about the ultimate beneficiary of the payment, in the same format as `source`. |
| destination\_amount  | Object | The amount of money that is received at the destination. The `issuer` field may be an empty string for non-Ripple addresses or cases where any trusted issuer is accepted. |
| parties | Object | Info about intermediary parties in the transaction. A value of `""` indicates that the party is not involved or the field is not applicable this this transaction. |
| parties.inbound\_bridge | String (URI) | The gateway provider responsible for receiving the wallet\_payment and making another payment. <span class='draft-comment'>(Are we defining these in terms of Ripple? -- YES)</span> |
| parties.outbound\_bridge | String (URI) | The gateway provider responsible for paying the destination amount, if not the same as `inbound_bridge`. |
| parties.sending\_agent | String (URI) | Another involved party responsible for handling money on behalf of the `source` party. |
| parties.receiving\_agent | String (URI) | Another involved party responsible for handling money on behalf of the `destination` party. |

<span class='draft-comment'>(Possible additional parties: the sender and receiver, all over again, but as URIs that can definitely be WebFingered at a single definitive domain.)</span>

The `source` and `destination` objects are defined in the same way, as follows:

| Field              | Value  | Description |
|--------------------|--------|-------------|
| uri                | String | A WebFinger-able unique identifier for this account or person. |
| claims\_required   | Array  | A list of pieces of information that are necessary to make this payment. |
| claims_jwts        | Array  | Array of [JWTs](https://tools.ietf.org/html/draft-ietf-oauth-json-web-token-28). Each JWT contains one or more claims about this account or person, and is signed by some authority who vouches for those claims.
| additional_info    | Object | If additional addressing information is necessary to make the payment, this field contains key-value pairs. The Get Quotes method returns `""` to indicate fields where information is needed. The definitions of these fields is provided in the host-meta. |

<span class='draft-comment'>Potential future feature - document / estimate all fees including ones on the initiating payment.</span>


## Get Quotes ##

Get Quotes tells you what your options are for making a payment.

__`GET /v1/bridge_payments/quotes/{sender}/{receiver}/{amount}`__

This API should accept parameters that are formatted as follows:

| Parameter | Format | Example(s) |
|-----------|--------|------------|
| sender    | A URL-encoded (%-escaped) [Gateway Services Identifier](#gateway-services-identifiers) | acct%3Abob%40ripple.com |
| receiver  | A URL-encoded (%-escaped) [Gateway Services Identifier](#gateway-services-identifiers) | ripple%3AraLiCEoiYDN3aTw2ZnGmEVXWwYXWiAxR7n |
| amount    | Decimal value, and [code for the currency to be received](#currency-codes), concatenated with a `+` | 10.99+USD |

The response to Get Quotes is a JSON object with two top-level fields:

| Field           | Value   | Description |
|-----------------|---------|-------------|
| success         | Boolean | `true` if this method succeeded |
| bridge_payments | Array   | Array of [Payment Objects](#gateway-transaction-objects) in the `quote` state that represent possible payments, which could result in the destination amount being paid to the ultimate beneficiary. |

The Gateway Services implementation can use custom business logic to determines which bridge_payments to include in the response, if any. This can depend on the sender, the receiver, the currency and amount, or other factors.

Get Quotes is intended to be a recursive process: if the Gateway Services provider does not know how to make an outgoing payment to the receiver in the specified currency, it can perform a Get Quotes call using another gateway that it trusts, then return quotes accordingly (possibly marked up from the quotes of the other gateway). In this case, most portions of the payment object remain the same throughout, but the `wallet_payment` object at each stage reflects the payment that must be made to continue the chain.

Some fields of each gateway transaction object may be omitted or not in their final state:

* The `id` field is omitted until the quote is accepted by both parties (see [Accept Quote](#accept-quote)) because it is a hash of the immutable portions of the gateway transaction object. <span class='draft-comment'>(We'll need specific rules for deriving this, since some portions like "state" are not immutable.)</span>
* The `state` field has the value `"quote"` to indicate that this is just a potential gateway transaction, and is not yet valid.
* The `source.claims_jwts` field may be empty, even though `source.claims_required` is not empty. This indicates that this transaction requires signed claims from an authority the gateway trusts before it can be made.
* The `source.additional_info` field may contain several fields whose value is the empty string `""`. This indicates that the client must provide values for those fields in order to accept the payment.
* The `destination.claims_jwts` and `destination.additional_info` fields may require population in the same manner as the corresponding `source` fields.


### Get Quotes Example ###

Request:

```
GET https://latambridgepay.com/v1/bridge_payments/acct%3Abobway%40snapswap.us/acct%3Astefan%40fidor.de/5+USD
```

Response:

```js
{
    "success": true,
    "bridge_payments": [
        {
            "state": "quote",
            "created": "2014-09-23T19:20:20.000Z",
            "source": {
                "uri": "acct:bobway@snapswap.us",
                "claims_required": [],
                "claims_jwts": [],
                "additional_info": {}
            },
            "wallet_payment": {
                "destination": "ripple:snapswap",
                "primary_amount": {
                    "amount": "5.125",
                    "currency": "USD",
                    "issuer": ""
                },
                "invoice_id": "78934",
                "expiration": "2014-09-23T20:20:20.000Z"
            },
            "destination": {
                "uri": "acct:stefan@fidor.de",
                "claims_required": [],
                "claims_jwts": [],
                "additional_info": {}
            },
            "destination_amount": {
                "amount": "5",
                "currency": "USD",
                "issuer": "r4tFZoa7Dk5nbEEaCeKQcY3rS5jGzkbn8a"
            },
            "parties": {
                "inbound_bridge": "snapswap.us/knox",
                "outbound_bridge": "ripple.fidor.de",
                "sending_agent": "",
                "receiving_agent": ""
            }
        },
        {
            "state": "quote",
            "created": "2014-09-23T19:20:20.000Z",
            "source": {
                "uri": "acct:bobway@snapswap.us",
                "claims_required": [],
                "claims_jwts": [],
                "additional_info": {}
            },
            "wallet_payment": {
                "destination": "bitcoin:1AAHyhHQzRyKkUaCmAi8dPanXoxqHuGdEJ",
                "primary_amount": {
                    "amount": "0.0140",
                    "currency": "BTC",
                    "issuer": ""
                },
                "invoice_id": "",
                "expiration": "2014-09-23T20:20:20.000Z"
            },
            "destination": {
                "uri": "acct:stefan@fidor.de",
                "claims_required": [],
                "claims_jwts": [],
                "additional_info": {}
            },
            "destination_amount": {
                "amount": "5",
                "currency": "USD",
                "issuer": "r4tFZoa7Dk5nbEEaCeKQcY3rS5jGzkbn8a"
            },
            "parties": {
                "inbound_bridge": "snapswap.us/knox",
                "outbound_bridge": "ripple.fidor.de",
                "sending_agent": "",
                "receiving_agent": ""
            }
        }
    ]
}
```


## Accept Quote ##

Bridge Payments lets you tell the gateway which payment you are making, so it can be ready.


Request:

```
POST /v1/bridge_payments/
{ .. gateway transaction object ... }
```

No URL parameters. The request body is a single [Gateway Transaction Object](#gateway-transaction-objects) in the `quote` state, as provided by the [Get Quotes method](#get-quotes). Before submitting the request, the client may modify the following fields:

* `source.claims_jwts`, `source.additional_info`, `destination.claims_jwts`, and `destination.additional_info`: Provide any necessary information, along with claims signed by appropriate authorities, that the gateway requests in order to make this payment.
* `sending_agent`, if the client wishes to name an applicable participating party
* All other fields should be left exactly as provided by the Get Quotes method. <span class='draft-comment'>We should discuss validation of the quote. Should the server check that the sender did not change any fields to unacceptable values (basically rewriting the contract)? How does it enforce expiration dates?</span>

Response:

If the quote is valid and all necessary information is provided, the server returns `200 OK` with the request body containing two top-level fields:

| Field           | Value   | Description |
|-----------------|---------|-------------|
| success         | Boolean | `true` if this method succeeded |
| bridge_payment  | [Gateway Transaction object](#gateway-transaction-objects) | The accepted gateway transaction object, as saved. |

The Gateway Transaction object should reflect the object provided in the request, with the following exceptions:

* The `id` field should be provided as an identifying hash for the transaction, not including the `state` field nor the `id` itself. <span class='draft-comment'>(Slightly more detail necessary here.)</span>
* The `state` field should be updated to `invoice` status to indicate that the quote has been accepted by both the client and the Gateway Services provider.
* Optionally, the Gateway Services provider may extend the `expiration` field to a later time than originally provided. The expiration CANNOT change to earlier than was quoted.

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


Response:

```js
{
    "id": "9876A034899023AEDFE",
    "state": "invoice",
    "created": "2014-09-23T19:20:20.000Z",
    "source": {
        "uri": "acct:bobway@snapswap.us",
        "claims_required": [],
        "claims_jwts": [],
        "additional_info": {}
    },
    "wallet_payment": {
        "destination": "ripple:snapswap",
        "primary_amount": {
            "amount": "5.125",
            "currency": "USD",
            "issuer": ""
        },
        "invoice_id": "78934",
        "expiration": "2014-09-23T20:20:20.000Z"
    },
    "destination": {
        "uri": "acct:stefan@fidor.de",
        "claims_required": [],
        "claims_jwts": [],
        "additional_info": {}
    },
    "destination_amount": {
        "amount": "5",
        "currency": "USD",
        "issuer": "r4tFZoa7Dk5nbEEaCeKQcY3rS5jGzkbn8a"
    },
    "parties": {
        "inbound_bridge": "snapswap.us/knox",
        "outbound_bridge": "ripple.fidor.de",
        "sending_agent": "",
        "receiving_agent": ""
    }
}
```
