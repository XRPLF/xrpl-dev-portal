# Basic Data Types

Different types of objects are uniquely identified in different ways:

[Accounts](accounts.html) are identified by their [Address][], for example `"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59"`. Addresses always start with "r". Many `rippled` methods also accept a hexadecimal representation.

[Transactions](transaction-formats.html) are identified by a [Hash][] of the transaction's binary format. You can also identify a transaction by its sending account and [Sequence Number][].

Each closed [Ledger](ledger-data-formats.html) has a [Ledger Index][] and a [Hash][] value. When [Specifying Ledgers][] you can use either one.

## Addresses
[Address]: #addresses

{% include '_snippets/data_types/address.md' %}
<!--{#_ #}-->


## Hashes
[Hash]: #hashes

{% include '_snippets/data_types/hash.md' %}
<!--{#_ #}-->

### Hash Prefixes
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/protocol/HashPrefix.h "Source")

In many cases, the XRP Ledger prefixes an object's binary data with a 4-byte code before calculating its hash, so that objects of different types have different hashes even if their binary formats are the same. The existing 4-byte codes are structured as three alphabetic characters, encoded as ASCII, followed by a zero byte.

Some types of hash appear in API requests and responses. Others are only calculated as the first step of signing a certain type of data, or calculating a higher-level hash. The following table shows all 4-byte hash prefixes the XRP Ledger uses:

| Object Type                           | API Fields                           | Hash Prefix (Hex) | Hash Prefix (Text) |
|:--------------------------------------|:-------------------------------------|:------------------|:--|
| Consensus proposal                    | N/A                                  | `0x50525000`      | `PRP\0` |
| Ledger Version                        | `ledger_hash`                        | `0x4C575200`      | `LWR\0` |
| Ledger state data                     | `account_state` in [ledger header][] | `0x4D4C4E00`      | `MLN\0` |
| Ledger data inner node                | N/A                                  | `0x4D494E00`      | `MIN\0` |
| Ledger data inner node ([SHAMapv2][]) | N/A                                  | `0x494E5200`      | `INR\0` |
| Payment Channel Claim                 | N/A                                  | `0x434C4D00`      | `CLM\0` |
| Signed Transaction                    | `hash` of transactions               | `0x54584E00`      | `TXN\0` |
| Transaction with metadata             | N/A                                  | `0x534E4400`      | `SND\0` |
| Unsigned Transaction (Single-signing) | N/A                                  | `0x53545800`      | `STX\0` |
| Unsigned Transaction (Multi-signing)  | N/A                                  | `0x534D5400`      | `SMT\0` |
| Validation vote                       | N/A                                  | `0x56414C00`      | `VAL\0` |
| Validator subkey authorization ("validator manifest") | N/A                  | `0x4D414E00`      | `MAN\0` |

[ledger header]: ledger-header.html
[SHAMapv2]: known-amendments.html#shamapv2

[Ledger objects IDs](ledger-object-ids.html) are calculated in a similar way, but they use a 2-byte prefix called a "space key" instead of a prefix in the form described here.


## Account Sequence
[Sequence Number]: #account-sequence

{% include '_snippets/data_types/account_sequence.md' %}
<!--{#_ #}-->


## Ledger Index
[Ledger Index]: #ledger-index

{% include '_snippets/data_types/ledger_index.md' %}
<!--{#_ #}-->


### Specifying Ledgers

Many API methods require you to specify an instance of the ledger, with the data retrieved being considered up-to-date as of that particular version of the shared ledger. The commands that accept a ledger version all work the same way. There are three ways you can specify which ledger you want to use:

1. Specify a ledger by its [Ledger Index][] in the `ledger_index` parameter. Each closed ledger has a ledger index that is 1 higher than the previous ledger. (The very first ledger had ledger index 1.)
2. Specify a ledger by its [Hash][] value in the `ledger_hash` parameter.
3. Specify a ledger by one of the following shortcuts, in the `ledger_index` parameter:
    * `validated` for the most recent ledger that has been validated by the whole network
    * `closed` for the most recent ledger that has been closed for modifications and proposed for validation
    * `current` for the server's current working version of the ledger.

There is also a deprecated `ledger` parameter which accepts any of the above three formats. *Do not* use this parameter; it may be removed without further notice.

If you do not specify a ledger, the `current` (in-progress) ledger is chosen by default. If you provide more than one field specifying ledgers, the deprecated `ledger` field is used first if it exists, falling back to `ledger_hash`. The `ledger_index` field is ignored unless neither of the other two are present.

**Note:** Do not rely on this default behavior for specifying a ledger; it is subject to change. Always specify a ledger version in the request if you can.


## Currencies

There are two kinds of currencies in the XRP Ledger: XRP, and everything else. There are many differences between the two:

| `XRP`                                                           | Issued Currencies |
|:----------------------------------------------------------------|:-----------|
| Has no issuer.                                                  | Always issued by an XRP Ledger account |
| Specified as a string                                           | Specified as an object |
| Tracked in [accounts](accountroot.html) | Tracked in [trust lines](ripplestate.html) |
| Can never be created; can only be destroyed                     | Can be issued or redeemed freely |
| Maximum value `100000000000` (`1e11`)                           | Maximum value `9999999999999999e80` |
| Precise to the nearest ["drop"](#xrp) (0.000001 XRP)            | 15 decimal digits of precision, with a minimum nonzero absolute value of `1000000000000000e-96` |

**Caution:** The XRP Ledger uses decimal math with different precision than typical floating-point numbers, so currency amounts are always presented as strings.

### Specifying Currency Amounts

Some API methods require you to specify an amount of currency. Depending on whether you are dealing in the network's native XRP currency or other currency units (called _issuances_), the style for specifying it is very different.

#### XRP
[drops of XRP]: #xrp
[XRP, in drops]: #xrp

Amounts of XRP are represented as strings. (XRP has precision equivalent to a 64-bit integer, but JSON integers are limited to 32 bits, so XRP can overflow if represented in a JSON integer.) XRP is formally specified in "drops", which are equivalent to 0.000001 (one 1-millionth) of an XRP each. Thus, to represent 1.0 XRP in a JSON document, you would write:

```
"1000000"
```

**Do not specify XRP as an object.**

Unit tests are permitted to submit values of XRP (not drops) with a decimal point - for example, "1.23" meaning 1.23 XRP. All other cases should always specify XRP in drops, with no decimal point: e.g. "1230000" meaning 1.23 XRP.

#### Non-XRP

If you are specifying non-XRP currency (including fiat dollars, precious metals, cryptocurrencies, or other custom currency) you must specify it with a currency specification object. This is a JSON object with three fields:

| `Field`    | Type                       | Description                        |
|:-----------|:---------------------------|:-----------------------------------|
| `currency` | String - [Currency Code][] | Arbitrary code for currency to issue. Cannot be `XRP`. |
| `value`    | String                     | Quoted decimal representation of the amount of currency. This can include scientific notation, such as `1.23e11` meaning 123,000,000,000. Both `e` and `E` may be used. |
| `issuer`   | String                     | Unique account address of the entity issuing the currency. In other words, the person or business where the currency can be redeemed. |

**Caution:** These field names are case-sensitive.

For example, to represent $153.75 US dollars issued by account `r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59`, you would specify:

```
{
    "currency": "USD",
    "value": "153.75",
    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59"
}
```

Unit tests are permitted to submit amounts of non-XRP currencies as a slash-separated string in the format `"amount/currency/issuer"`. All other cases should use the JSON object format above.

#### Specifying Currencies Without Amounts

If you are specifying a non-XRP currency without an amount (typically for defining an order book of currency exchange offers) you should specify it as above, but omit the `value` field.

If you are specifying XRP without an amount (typically for defining an order book) you should specify it as a JSON object with _only_ a `currency` field. Never include an `issuer` field for XRP.

Finally, if the recipient account of the payment trusts multiple issuers for a currency, you can indicate that the payment should be made in any combination of issuers that the recipient accepts. To do this, specify the recipient account's address as the `issuer` value in the JSON object.

### Currency Codes
[Currency Code]: #currency-codes

{% include '_snippets/data_types/currency_code.md' %}
<!--{#_ #}-->


## Specifying Time

The `rippled` server and its APIs represent time as an unsigned integer. This number measures the number of seconds since the "Ripple Epoch" of January 1, 2000 (00:00 UTC). This is like the way the [Unix epoch](http://en.wikipedia.org/wiki/Unix_time) works, except the Ripple Epoch is 946684800 seconds after the Unix Epoch.

Don't convert Ripple Epoch times to UNIX Epoch times in 32-bit variables: this could lead to integer overflows.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
