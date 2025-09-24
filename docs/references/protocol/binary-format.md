---
html: serialization.html
parent: protocol-reference.html
seo:
    description: Conversion between JSON and canonical binary format for XRP Ledger transactions and other objects.
labels:
  - Blockchain
  - Transaction Sending
curated_anchors:
  - name: Sample Code
    anchor: "#sample-code"
  - name: Canonical Field Order
    anchor: "#canonical-field-order"
  - name: Type List
    anchor: "#type-list"
---
# Binary Format
[[Source]](https://github.com/XRPLF/rippled/blob/develop/include/xrpl/protocol/SField.h "Source")

This page describes the XRP Ledger's canonical binary format for transactions and other data. This binary format is necessary to create and verify digital signatures of those transactions' contents, and is also used in other places including in the [peer-to-peer communications between servers](../../concepts/networks-and-servers/peer-protocol.md). The [`rippled` APIs](../http-websocket-apis/index.md) typically use JSON to communicate with client applications. However, JSON is unsuitable as a format for serializing transactions for being digitally signed, because JSON can represent the same data in many different but equivalent ways.

The process of serializing a transaction from JSON or any other representation into their canonical binary format can be summarized with these steps:

1. Make sure all required fields are provided, including any required but ["auto-fillable" fields](transactions/common-fields.md#auto-fillable-fields).

    The [Transaction Formats Reference](transactions/index.md) defines the required and optional fields for XRP Ledger transactions.

    {% admonition type="info" name="Note" %}The `SigningPubKey` must also be provided at this step. When signing, you can [derive this key](../../concepts/accounts/cryptographic-keys.md#key-derivation) from the secret key that is provided for signing.{% /admonition %}

2. Convert each field's data into its ["internal" binary format](#internal-format).

3. Sort the fields in [canonical order](#canonical-field-order).

4. Prefix each field with a [Field ID](#field-ids).

5. Concatenate the fields (including prefixes) in their sorted order.

The result is a single binary blob that can be signed using well-known signature algorithms such as ECDSA (with the secp256k1 elliptic curve) and Ed25519. For purposes of the XRP Ledger, you must also [hash][Hash] the data with the appropriate prefix (`0x53545800` if single-signing, or `0x534D5400` if multi-signing). After signing, you must re-serialize the transaction with the `TxnSignature` field included. <!--{# TODO: link docs on how to compute a transaction signature. #}-->

{% admonition type="info" name="Note" %}The XRP Ledger uses the same serialization format to represent other types of data, such as [ledger objects](ledger-data/ledger-entry-types/index.md) and processed transactions. However, only certain fields are appropriate for including in a transaction that gets signed. (For example, the `TxnSignature` field, containing the signature itself, should not be present in the binary blob that you sign.) Thus, some fields are designated as "Signing" fields, which are included in objects when those objects are signed, and "non-signing" fields, which are not.{% /admonition %}

### Examples

Both signed and unsigned transactions can be represented in both JSON and binary formats. The following samples show the same signed transaction in its JSON and binary formats:

**JSON:**

{% code-snippet file="/_code-samples/tx-serialization/py/test-cases/tx1.json" language="json" /%}

**Binary (represented as hexadecimal):**

{% code-snippet file="/_code-samples/tx-serialization/py/test-cases/tx1-binary.txt" language="text" /%}

## Sample Code

The serialization processes described here are implemented in multiple places and programming languages:

- In C++ [in the `rippled` code base](https://github.com/XRPLF/rippled/blob/develop/src/ripple/protocol/impl/STObject.cpp).
- In JavaScript in {% repo-link path="_code-samples/tx-serialization/" %}this repository's code samples section{% /repo-link %}.
- In Python 3 in {% repo-link path="_code-samples/tx-serialization/" %}this repository's code samples section{% /repo-link %}.

Additionally, many [client libraries](../client-libraries.md) provide serialization support under permissive open-source licenses, so you can import, use, or adapt the code for your needs.



## Internal Format

Each field has an canonical binary format, or _internal format_ used in the XRP Ledger protocol to represent that field in transactions and ledger data. The binary format is needed for signing, but it is also used in peer-to-peer communications, in ledger storage, and in other places. The binary formats for all fields are defined in the source code of [`SField.h`](https://github.com/XRPLF/rippled/blob/develop/include/xrpl/protocol/SField.h). The JSON format for transactions and ledger data is standardized for convenience, but JSON is only used in APIs and client libraries: strictly speaking, only the binary format exists at the level of the XRP Ledger protocol.

The [Transaction Format Reference](transactions/index.md) and [Ledger Data Reference](ledger-data/index.md) list both the JSON and the internal (binary) formats for all fields. For example, the `Flags` [common transaction field](transactions/common-fields.md) is a Number in JSON and a UInt32 in binary. Even though the JSON representation uses a data type that can contain decimal places or very large values, the field is limited to values that can be represented as a 32-bit unsigned integer.

### Definitions File

The following JSON file defines the important constants you need for serializing XRP Ledger data to its binary format and deserializing it from binary:

**<https://github.com/XRPLF/xrpl.js/blob/main/packages/ripple-binary-codec/src/enums/definitions.json>**

You can also use the [server_definitions API method](../http-websocket-apis/public-api-methods/server-info-methods/server_definitions.md) to get the same data from a server. This can be useful when working with dev networks, in-development features, and sidechains with new fields or data types.

The following table defines the top-level fields from the definitions file:

| Field                 | Contents                                             |
|:----------------------|:-----------------------------------------------------|
| `TYPES`               | Map of data types to their ["type code"](#type-codes) for constructing field IDs and sorting fields in canonical order. Codes below 1 should not appear in actual data; codes above 10000 represent special "high-level" object types such as "Transaction" that cannot be serialized inside other objects. See the [Type List](#type-list) for details of how to serialize each type. |
| `LEDGER_ENTRY_TYPES`  | Map of [ledger objects](ledger-data/ledger-entry-types/index.md) to their data type. These appear in ledger state data, and in the "affected nodes" section of processed transactions' [metadata](transactions/metadata.md). |
| `FIELDS`              | A sorted array of tuples representing all fields that may appear in transactions, ledger objects, or other data. The first member of each tuple is the string name of the field and the second member is an object with that field's properties. (See the "Field properties" table below for definitions of those fields.) |
| `TRANSACTION_RESULTS` | Map of [transaction result codes](transactions/transaction-results/index.md) to their numeric values. Result types not included in ledgers have negative values; `tesSUCCESS` has numeric value 0; [`tec`-class codes](transactions/transaction-results/tec-codes.md) represent failures that are included in ledgers. |
| `TRANSACTION_TYPES`   | Map of all [transaction types](transactions/types/index.md) to their numeric values. |

For purposes of serializing transactions for signing and submitting, the `FIELDS`, `TYPES`, and `TRANSACTION_TYPES` fields are necessary.

The field definition objects in the `FIELDS` array have the following fields:

| Field            | Type    | Contents                                        |
|:-----------------|:--------|:------------------------------------------------|
| `nth`            | Number  | The [field code](#field-codes) of this field, for use in constructing its [Field ID](#field-ids) and ordering it with other fields of the same data type. |
| `isVLEncoded`    | Boolean | If `true`, this field is [length-prefixed](#length-prefixing). |
| `isSerialized`   | Boolean | If `true`, this field should be encoded into serialized binary data. When this field is `false`, the field is typically reconstructed on demand rather than stored. |
| `isSigningField` | Boolean | If `true` this field should be serialized when preparing a transaction for signing. If `false`, this field should be omitted from the data to be signed. (It may not be part of transactions at all.) |
| `type`           | String  | The internal data type of this field. This maps to a key in the `TYPES` map, which gives the [type code](#type-codes) for this field. |

### Field IDs

[[Source - Encoding]](https://github.com/XRPLF/rippled/blob/edb4f0342c65bd739fee60b74566f3e771134c6c/src/libxrpl/protocol/Serializer.cpp#L120-L153 "Source")
[[Source - Decoding]](https://github.com/XRPLF/rippled/blob/edb4f0342c65bd739fee60b74566f3e771134c6c/src/libxrpl/protocol/Serializer.cpp#L429-L452 "Source")

When you combine a field's type code and field code, you get the field's unique identifier, which is prefixed before the field in the final serialized blob. The size of the Field ID is one to three bytes depending on the type code and field codes it combines. See the following table:

|                  | Type Code < 16                                                                | Type Code >= 16 |
|:-----------------|:------------------------------------------------------------------------------|:--|
| **Field Code < 16**  | ![1 byte: high 4 bits define type; low 4 bits define field.](/docs/img/field-id-common-type-common-field.png) | ![2 bytes: low 4 bits of the first byte define field; next byte defines type.](/docs/img/field-id-uncommon-type-common-field.png) |
| **Field Code >= 16** | ![2 bytes: high 4 bits of the first byte define type; low 4 bits of first byte are 0; next byte defines field](/docs/img/field-id-common-type-uncommon-field.png) | ![3 bytes: first byte is `0x00`, second byte defines type; third byte defines field](/docs/img/field-id-uncommon-type-uncommon-field.png) |

When decoding, you can tell how many bytes the field ID is by which bits **of the first byte** are zeroes. This corresponds to the cases in the above table:

|                  | High 4 bits are nonzero                                                                | High 4 bits are zero |
|:-----------------|:------------------------------------------------------------------------------|:--|
| **Low 4 bits are nonzero**  | 1 byte: high 4 bits define type; low 4 bits define field.                     | 2 bytes: low 4 bits of the first byte define field; next byte defines type |
| **Low 4 bits are zero** | 2 bytes: high 4 bits of the first byte define type; low 4 bits of first byte are 0; next byte defines field | 3 bytes: first byte is `0x00`, second byte defines type; third byte defines field |

{% admonition type="warning" name="Caution" %}Even though the Field ID consists of the two elements that are used to sort fields, you should not sort by the serialized Field ID itself, because the byte structure of the Field ID changes the sort order.{% /admonition %}

### Length Prefixing

Some types of variable-length fields are prefixed with a length indicator. `Blob` fields (containing arbitrary binary data) are one such type. For a list of which types are length-prefixed, see the [Type List](#type-list) table.

{% admonition type="info" name="Note" %}Some types of fields that vary in length are not length-prefixed. Those types have other ways of indicating the end of their contents.{% /admonition %}

The length prefix consists of one to three bytes indicating the length of the field immediately after the type prefix and before the contents.

- If the field contains 0 to 192 bytes of data, the first byte defines the length of the contents, then that many bytes of data follow immediately after the length byte.

- If the field contains 193 to 12480 bytes of data, the first two bytes indicate the length of the field with the following formula:

    ```
    193 + ((byte1 - 193) * 256) + byte2
    ```

- If the field contains 12481 to 918744 bytes of data, the first three bytes indicate the length of the field with the following formula:

    ```
    12481 + ((byte1 - 241) * 65536) + (byte2 * 256) + byte3
    ```

- A length-prefixed field cannot contain more than 918744 bytes of data.

When decoding, you can tell from the value of the first length byte whether there are 0, 1, or 2 additional length bytes:

- If the first length byte has a value of 192 or less, then that's the only length byte and it contains the exact length of the field contents in bytes.
- If the first length byte has a value of 193 to 240, then there are two length bytes.
- If the first length byte has a value of 241 to 254, then there are three length bytes.


## Canonical Field Order

All fields in a transaction are sorted in a specific order based first on the field's type (specifically, a numeric "type code" assigned to each type), then on the field itself (a "field code"). (Think of it as sorting by family name, then given name, where the family name is the field's type and the given name is the field itself.)

### Type Codes

Each field type has an arbitrary type code, with lower codes sorting first. These codes are defined in [`SField.h`](https://github.com/XRPLF/rippled/blob/master/include/xrpl/protocol/SField.h#L60-L98).

For example, [UInt32 has type code 2](https://github.com/XRPLF/rippled/blob/master/include/xrpl/protocol/SField.h#L67), so all UInt32 fields come before all [Amount fields, which have type code 6](https://github.com/XRPLF/rippled/blob/master/include/xrpl/protocol/SField.h#L71).

The [definitions file](#definitions-file) lists the type codes for each type in the `TYPES` map.

### Field Codes

Each field has a field code, which is used to sort fields that have the same type as one another, with lower codes sorting first. These fields are defined in [`sfields.macro`](https://github.com/XRPLF/rippled/blob/master/include/xrpl/protocol/detail/sfields.macro).

For example, the `Account` field of a [Payment transaction][] [has sort code 1](https://github.com/XRPLF/rippled/blob/master/include/xrpl/protocol/detail/sfields.macro#L269), so it comes before the `Destination` field which [has sort code 3](https://github.com/XRPLF/rippled/blob/master/include/xrpl/protocol/detail/sfields.macro#L271).

Field codes are reused for fields of different field types, but fields of the same type never have the same field code. When you combine the type code with the field code, you get the field's unique [Field ID](#field-ids).



## Type List

Transactions and ledger entries may contain fields of any of the following types:

| Type Name        | Type Code | Bit Length | [Length-prefixed][]? | Description    |
|:-----------------|:----------|:-----------|:---------------------|----------------|
| [AccountID][]    | 8         | 160        | Yes                  | The unique identifier for an [account](../../concepts/accounts/index.md). |
| [Amount][]       | 6         | Variable   | No                   | An amount of XRP or tokens. The length of the field is 64 bits for XRP, 384 bits (64+160+160) for fungible tokens, or 264 bits for MPTs. |
| [Array][]        | 15        | Variable   | No                   | An array containing a variable number of members, which can be different types depending on the field. Two cases of this include [memos](transactions/common-fields.md#memos-field) and lists of signers used in [multi-signing](../../concepts/accounts/multi-signing.md). |
| [Blob][]         | 7         | Variable   | Yes                  | Arbitrary binary data. One important such field is `TxnSignature`, the signature that authorizes a transaction. |
| [Currency][]     | 26        | 160        | No                   | A currency code, such as one used in [price oracles](../../concepts/decentralized-storage/price-oracles.md). |
| [Issue][]        | 24        | 160 or 320 | No                   | An asset definition, XRP or a token, with no quantity. |
| [Object][]       | 14        | Variable   | No                   | An object containing one or more nested fields. These "inner" objects may have additional formatting restrictions. |
| [PathSet][]      | 18        | Variable   | No                   | A set of possible [payment paths](../../concepts/tokens/fungible-tokens/paths.md) for a [cross-currency payment](../../concepts/payment-types/cross-currency-payments.md). |
| [UInt8][]        | 16        | 8          | No                   | An 8-bit unsigned integer. |
| [UInt16][]       | 1         | 16         | No                   | A 16-bit unsigned integer. The `TransactionType` is a special case of this type, with specific strings mapping to integer values. |
| [UInt32][]       | 2         | 32         | No                   | A 32-bit unsigned integer. The `Flags` and `Sequence` fields on all transactions are examples of this type. |
| [UInt64][]       | 3         | 64         | No                   | A 64-bit unsigned integer. This type does not appear in transaction instructions, but several ledger entries use fields of this type. |
| [UInt96][]       | 20        | 96         | No                   | **UNUSED.** A 96-bit unsigned integer. |
| [UInt128][]      | 4         | 128        | No                   | A 128-bit binary value. The only such field is `EmailHash`, which is intended to store the MD-5 hash of an account owner's email for purposes of fetching a [Gravatar](https://www.gravatar.com/). |
| [UInt160][]      | 17        | 160        | No                   | A 160-bit binary value. This may define a currency code or issuer. |
| [UInt192][]      | 21        | 192        | No                   | A 192-bit binary value. This usually represents an MPT issuance. |
| [UInt256][]      | 5         | 256        | No                   | A 256-bit binary value. This usually represents the hash of a transaction, ledger version, or ledger entry. |
| [UInt384][]      | 22        | 384        | No                   | **UNUSED.** A 384-bit binary value. |
| [UInt512][]      | 23        | 512        | No                   | **UNUSED.** A 512-bit binary value. |
| [Vector256][]    | 19        | Variable   | Yes                  | A list of 256-bit binary values. This may be a list of ledger entries or other hash values. |
| [XChainBridge][] | 25        | Variable   | No                   | A bridge between two blockchains, identified by the door accounts and issued assets on both chains. |

[Length-prefixed]: #length-prefixing

In the `rippled` source code, some types have an "ST" prefix, which stands for "serialized type". This separates the type definition in the XRP Ledger protocol from data types that may be defined at the programming language level such as arrays or objects.

In addition to all of the above field types, the following types may appear in other contexts, such as [ledger objects](ledger-data/ledger-entry-types/index.md) and [transaction metadata](transactions/metadata.md):

| Type Name   | Type Code | [Length-prefixed]? | Description                   |
|:------------|:----------|:-------------------|:------------------------------|
| Transaction | 10001     | No                 | A "high-level" type containing an entire [transaction](transactions/index.md). |
| LedgerEntry | 10002     | No                 | A "high-level" type containing an entire [ledger entry](ledger-data/ledger-entry-types/index.md). |
| Validation  | 10003     | No                 | A "high-level" type used in peer-to-peer communications to represent a validation vote in the [consensus process](../../concepts/consensus-protocol/index.md). |
| Metadata    | 10004     | No                 | A "high-level" type containing [metadata for one transaction](transactions/metadata.md). |


### AccountID Fields
[AccountID]: #accountid-fields

Fields of this type contain the 160-bit identifier for an XRP Ledger [account](../../concepts/accounts/index.md). In JSON, these fields are represented as [base58][] XRP Ledger "addresses", with additional checksum data so that typos are unlikely to result in valid addresses. (This encoding, sometimes called "Base58Check", prevents accidentally sending money to the wrong address.) The binary format for these fields does not contain any checksum data nor does it include the `0x00` "type prefix" used in [address base58 encoding](../../concepts/accounts/addresses.md#address-encoding). (However, since the binary format is used mostly for signed transactions, a typo or other error in transcribing a signed transaction would invalidate the signature, preventing it from sending money.)

AccountIDs that appear as stand-alone fields (such as `Account` and `Destination`) are [length-prefixed](#length-prefixing) despite being a fixed 160 bits in length. As a result, the length indicator for these fields is always the byte `0x14`. AccountIDs that appear as children of special fields ([Amount `issuer`][Amount] and [PathSet `account`][PathSet]) are _not_ length-prefixed.


### Amount Fields
[Amount]: #amount-fields

The _Amount_ type (also called "STAmount") is a special field type that represents an amount of currency or asset. This type consists of three sub-types, which are XRP, fungible tokens, and multi-purpose tokens (MPTs):

- **XRP**

    XRP is serialized as a 64-bit unsigned integer (big-endian order), except that the most significant bit is always `0`, the second-most-significant bit is `1` to indicate that it is positive, and the third-most-significant bit is `0` to indicate that it is not an MPT. The remaining 61 bits represent the quantity of XRP. Since the maximum amount of XRP (10<sup>17</sup> drops) only requires 57 bits, you can calculate XRP serialized format by taking standard 64-bit unsigned integer and performing a bitwise-OR with `0x4000000000000000`.

- **Fungible Tokens**

    Fungible tokens (also called "IOUs") consist of three segments in order:

    1. 64 bits indicating the amount in the [token amount format](#token-amount-format). The first bit is `1` to indicate that this is a fungible token.
    2. 160 bits indicating the [currency code](data-types/currency-formats.md#currency-codes). The standard API converts 3-character codes such as "USD" into 160-bit codes using the [standard currency code format](data-types/currency-formats.md#standard-currency-codes), but custom 160-bit codes are also possible.
    3. 160 bits indicating the issuer's Account ID. (See also: [Account Address Encoding](../../concepts/accounts/addresses.md#address-encoding))

- **MPTs**

    Multi-Purpose Tokens (MPTs) consist of the following segments in order:

    1. 8 bits indicating that this is an MPT. The most significant bit is `0` to indicate that it's not a fungible token. The second bit is `1` to indicate that it is positive. The third most significant bit is `1` to indicate that it is an MPT. The remaining 5 bits are reserved and must all be `0`. In other words, the first byte is `0x60`.
    2. 64 bits indicating the quantity of the MPT, as a 64-bit unsigned integer. (However, the maximum amount cannot be larger than 2<sup>63</sup>-1.)
    3. 192 bits for the MPT Issuance ID, which is made of the following parts in order:
        1. 32 bits indicating the `Sequence` number of the transaction that created the MPT issuance.
        2. 160 bits indicating the [AccountID][] of the MPT's issuer.

You can tell which of the three sub-types an amount is based on the first and third most significant bits: 

    - If the first bit is a `1`, it's a fungible token (IOU).
    - If the first bit and third bit are both `0`, it's XRP.
    - If the first bit is a `0` and the third bit is a `1`, it's an MPT.

{% admonition type="warning" name="Caution" %}
Not all types of amount are valid in all places. Some fields can only represent XRP, or XRP and fungible tokens but not MPTs. These limitations are defined by the individual transactions and ledger entries.
{% /admonition %}

The following diagram shows the serialization formats for all three amount formats:

[{% inline-svg file="/docs/img/serialization-amount.svg" /%}](/docs/img/serialization-amount.svg 'The first bit is an amount type bit (0 = XRP or MPT, 1 = fungible token). XRP has a sign bit (always 1 for positive), an MPT indicator bit (0=XRP) and 61 bits of precision. MPTs have a sign bit (always 1 for positive), an MPT indicator bit (1=MPT), 5 reserved bits, 64 bit integer quantity, and a 192 bit MPT Issuance ID which consists of the 32-bit Sequence number followed by 160-bit issuer AccountID. Fungible Token amounts consist start with an amount type bit of 1, a sign bit which can be 1 or 0, an exponent (8 bits), significant digits (54 bits), currency code (160 bits), and issuer (160 bits).')

#### Token Amount Format
[[Source]](https://github.com/XRPLF/rippled/blob/35fa20a110e3d43ffc1e9e664fc9017b6f2747ae/src/ripple/protocol/impl/STAmount.cpp "Source")

[{% inline-svg file="/docs/img/currency-number-format.svg" /%}](/docs/img/currency-number-format.svg "Token Amount Format diagram")

The XRP Ledger uses 64 bits to serialize the numeric amount of a (fungible) token. (In JSON format, the numeric amount is the `value` field of a currency amount object.) In binary format, the numeric amount consists of a "not XRP" bit, a sign bit, significant digits, and an exponent, in order:

1. The first (most significant) bit for a token amount is `1` to indicate that it is not an XRP amount. (XRP amounts always have the most significant bit set to `0` to distinguish them from this format.)
2. The sign bit indicates whether the amount is positive or negative. Unlike standard [two's complement](https://en.wikipedia.org/wiki/Two%27s_complement) integers, `1` indicates **positive** in the XRP Ledger format, and `0` indicates negative.
3. The next 8 bits represent the exponent as an unsigned integer. The exponent indicates the scale (what power of 10 the significant digits should be multiplied by) in the range -96 to +80 (inclusive). However, when serializing, we add 97 to the exponent to make it possible to serialize as an unsigned integer. Thus, a serialized value of `1` indicates an exponent of `-96`, a serialized value of `177` indicates an exponent of 80, and so on.
4. The remaining 54 bits represent the significant digits (sometimes called a _mantissa_) as an unsigned integer. When serializing, this value is normalized to the range 10<sup>15</sup> (`1000000000000000`) to 10<sup>16</sup>-1 (`9999999999999999`) inclusive, except for the special case of the value 0. In the special case for 0, the sign bit, exponent, and significant digits are all zeroes, so the 64-bit value is serialized as `0x8000000000000000000000000000000000000000`.

The numeric amount is serialized alongside the [currency code][] and issuer to form a full [token amount](#amount-fields).

#### Currency Codes

At a protocol level, currency codes in the XRP Ledger are arbitrary 160-bit values, except the following values have special meaning:

- The currency code `0x0000000000000000000000005852500000000000` is **always disallowed**. (This is the code "XRP" in the "standard format".)
- The currency code `0x0000000000000000000000000000000000000000` (all zeroes) is **generally disallowed**. Usually, XRP amounts are not specified with currency codes. However, this code is used to indicate XRP in rare cases where a field must specify a currency code for XRP.

The [`rippled` APIs](../http-websocket-apis/index.md) support a **standard format** for translating three-character ASCII codes to 160-bit hex values as follows:

[{% inline-svg file="/docs/img/currency-code-format.svg" /%}](/docs/img/currency-code-format.svg "Standard Currency Code Format")

1. The first 8 bits must be `0x00`.
2. The next 88 bits are reserved, and should be all `0`'s.
3. The next 24 bits represent 3 characters of ASCII.
    Ripple recommends using [ISO 4217](https://www.xe.com/iso4217.php) codes, or popular pseudo-ISO 4217 codes such as "BTC". However, any combination of the following characters is permitted: all uppercase and lowercase letters, digits, as well as the symbols `?`, `!`, `@`, `#`, `$`, `%`, `^`, `&`, `*`, `<`, `>`, `(`, `)`, `{`, `}`, `[`, `]`, and <code>&#124;</code>. The currency code `XRP` (all-uppercase) is reserved for XRP and cannot be used by tokens.
4. The next 40 bits are reserved and should be all `0`'s.

The **nonstandard format** is any 160 bits of data as long as the first 8 bits are not `0x00`.


### Array Fields
[Array]: #array-fields

Some transaction fields, such as `SignerEntries` (in [SignerListSet transactions][]) and [`Memos`](transactions/common-fields.md#memos-field), are arrays of objects. (Also called the "STArray" type).

Arrays contain several [object fields](#object-fields) in their native binary format in a specific order. In JSON, each array member is a JSON "wrapper" object with a single field, which is the name of the member object field. The value of that field is the ("inner") object itself.

In the binary format, each member of the array has a Field ID prefix (based on the single key of the wrapper object) and contents (comprising the inner object, [serialized as an object](#object-fields)). To mark the end of an array, append an item with a "Field ID" of `0xf1` (the type code for array with field code of 1) and no contents.

The following example shows the serialization format for an array (the `SignerEntries` field):

[{% inline-svg file="/docs/img/serialization-array.svg" /%}](/docs/img/serialization-array.svg 'Array field ID, followed by the Field ID and contents of each array element, followed by the "Array end" field ID')


### Blob Fields
[Blob]: #blob-fields

The _Blob_ type (also called "STBlob") is a [length-prefixed](#length-prefixing) field with arbitrary data. Two common fields that use this type are `SigningPubKey` and `TxnSignature`, which contain (respectively) the public key and signature that authorize a transaction to be executed.

Blob fields have no further structure to their contents, so they consist of exactly the amount of bytes indicated in the variable-length encoding, after the Field ID and length prefixes.


### Currency Fields
[Currency]: #currency-fields

Some fields specify a currency code, which could be a fungible token, the ticker symbol for an off-ledger asset, or some other identifier for a currency. This field type is currently used only in [Price Oracles](../../concepts/decentralized-storage/price-oracles.md).

These fields consist of 160 bits of binary data. If the data matches the ["standard" currency code format](#currency-codes), it may be represented as a three-letter currency code string in JSON. Otherwise, it is represented as hexadecimal. Client libraries _may_ attempt to interpret this as a string of ASCII or UTF-8, but it is not guaranteed to be valid. The {% repo-link path="_code-samples/normalize-currency-codes/" %}Normalize Currency Codes code sample{% /repo-link %} demonstrates best practices for converting most common formats for this data into a string for humans to read.


### Issue Fields
[Issue]: #issue-fields

Some fields specify a _type_ of asset, which could be XRP or a fungible [token](../../concepts/tokens/index.md), without an amount. This field is also called "STIssue". These fields have consist of one or two 160-bit segments in order:

1. The first 160 bits are the [currency code](#currency-codes) of the asset. For XRP, this is all 0's.
2. If the first 160 bits are all 0's (the asset is XRP), the field ends there. Otherwise, the asset is a token and the next 160 bits are the [AccountID of the token issuer](#accountid-fields).


### Object Fields
[Object]: #object-fields

Some fields, such as `SignerEntry` (in [SignerListSet transactions][]), and `Memo` (in `Memos` arrays) are objects (called the "STObject" type). The serialization of objects is very similar to that of arrays, with one difference: **object members must be placed in canonical order** within the object field, where array fields have an explicit order already.

The [canonical field order](#canonical-field-order) of object fields is the same as the canonical field order for all top-level fields, but the members of the object must be sorted within the object. After the last member, there is an "Object end" Field ID of `0xe1` with no contents.

The following example shows the serialization format for an object (a single `Memo` object in the `Memos` array).

[{% inline-svg file="/docs/img/serialization-object.svg" /%}](/docs/img/serialization-object.svg 'Object field ID, followed by the Object ID and contents of each object member in canonical order, followed by the "Object end" field ID')


### PathSet Fields
[PathSet]: #pathset-fields

The `Paths` field of a cross-currency [Payment transaction][] is a "PathSet", represented in JSON as an array of arrays. For more information on what paths are used for, see [Paths](../../concepts/tokens/fungible-tokens/paths.md).

A PathSet is serialized as **1 to 6** individual paths in sequence[[Source]](https://github.com/XRPLF/rippled/blob/4cff94f7a4a05302bdf1a248515379da99c5bcd4/src/ripple/app/tx/impl/Payment.h#L35-L36 "Source"). Each complete path is followed by a byte that indicates what comes next:

- `0xff` indicates another path follows
- `0x00` indicates the end of the PathSet

Each path consists of **1 to 8** path steps in order[[Source]](https://github.com/XRPLF/rippled/blob/4cff94f7a4a05302bdf1a248515379da99c5bcd4/src/ripple/app/tx/impl/Payment.h#L38-L39 "Source"). Each step starts with a **type** byte, followed by one or more fields describing the path step. The type indicates which fields are present in that path step through bitwise flags. (For example, the value `0x30` indicates changing both currency and issuer.) If more than one field is present, the fields are always placed in a specific order.

The following table describes the possible fields and the bitwise flags to set in the type byte to indicate them:

| Type Flag | Field Present | Field Type        | Bit Size | Order |
|:----------|:--------------|:------------------|:---------|:------|
| `0x01`    | `account`     | [AccountID][]     | 160 bits | 1st   |
| `0x10`    | `currency`    | [Currency Code][] | 160 bits | 2nd   |
| `0x20`    | `issuer`      | [AccountID][]     | 160 bits | 3rd   |

[Currency Code]: data-types/currency-formats.md#standard-currency-codes

Some combinations are invalid; see [Path Specifications](../../concepts/tokens/fungible-tokens/paths.md#path-specifications) for details.

The AccountIDs in the `account` and `issuer` fields are presented _without_ a length prefix. When the `currency` is XRP, the currency code is represented as 160 bits of zeroes.

Each step is followed directly by the next step of the path. As described above, the last step of a path is followed by either `0xff` (if another path follows) or `0x00` (if this ends the last path).

The following example shows the serialization format for a PathSet:

[{% inline-svg file="/docs/img/serialization-pathset.svg" /%}](/docs/img/serialization-pathset.svg "PathSet is several paths each followed by a continue or end byte; each path is several path steps consisting of a type byte and one or more 160-bit fields based on the type byte")


### UInt Fields
[UInt8]: #uint-fields
[UInt16]: #uint-fields
[UInt32]: #uint-fields
[UInt64]: #uint-fields
[UInt96]: #uint-fields
[UInt128]: #uint-fields
[UInt160]: #uint-fields
[UInt192]: #uint-fields
[UInt256]: #uint-fields
[UInt384]: #uint-fields
[UInt512]: #uint-fields

The XRP Ledger has several unsigned integer types: UInt8, UInt16, UInt32, UInt64, UInt128, UInt160, and UInt256. All of these are standard big-endian binary unsigned integers with the specified number of bits. The larger types such as UInt128, UInt160, and UInt256 were previously named `Hash128`, `Hash160`, and `Hash256` because they often contain hash function outputs. (These names are still used in the definitions file.)

When representing these fields in JSON, these fields may be represented as JSON numbers, strings containing hexadecimal, or as strings containing decimal numbers, depending on the bit size and intended use of the data. UInt64 and up are never converted to JSON numbers, because some JSON decoders may try to represent them as "double precision" floating point numbers, which cannot represent all distinct UInt64 values with full precision. UInt128 and UInt256 typically represent hash values or arbitrary data, so they are typically represented in JSON as hexadecimal.

The types UInt96, UInt384, and UInt512 are currently defined but not used.

The `TransactionType` field is a special case. In JSON, this field is conventionally represented as a string with the name of the transaction type. In binary, this field is a UInt16. The `TRANSACTION_TYPES` object in the [definitions file](#definitions-file) maps these strings to the numeric values used in the binary format.

### Vector256 Fields
[Vector256]: #vector256-fields

The _Vector256_ type contains a list of 256-bit values. This field consists of a multiple of 256 bits following the [length prefix](#length-prefixing). Unlike the [Array][] type, which can contain a mix of different nested object types of varying lengths, each member of a Vector256 field is exactly 256 bits with no type prefix.

The members of a Vector256 field may be [ledger entry IDs](./ledger-data/common-fields.md#ledger-entry-id), transaction IDs, Amendment IDs, ledger hashes, or other binary data.


### XChainBridge Fields
[XChainBridge]: #xchainbridge-fields

[{% inline-svg file="/docs/img/serialization-xchainbridge.svg" /%}](/docs/img/serialization-xchainbridge.svg "XChainBridge format diagram")

The `XChainBridge` field, used in transactions and ledger entries related to [cross-chain bridges](../../concepts/xrpl-sidechains/cross-chain-bridges.md), is the only field of the XChainBridge type. It consists of 4 parts which together define a bridge between blockchains:

- The locking chain door account, a length-prefixed [AccountID][].
- The locking chain asset type, an [Issue][].
- The issuing chain door account, a length-prefixed [AccountID][].
- The issuing chain asset type, an [Issue][].

The two nested [Issue][] types are each either 160 or 320 bits. The Issue field is 160 bits if the currency code it contains is all 0's, meaning that the bridged asset is the native asset of its respective chain, for example XRP on the XRP Ledger Mainnet. If the currency code is nonzero, then the Issue field also contains the (non-length-prefixed) AccountID of the token's issuer on its native chain.

{% admonition type="info" name="Note" %}The door AccountID values are length-prefixed, but the issuer AccountID values are not.{% /admonition %}

In total, an XChainBridge field is always either 656, 816, or 976 bits (82, 102, or 122 bytes) depending on whether zero, one, or both of the assets are the native asset on their respective chain.

<!-- SPELLING_IGNORE: pathset, stobject, starray, ledgerentry, vector256, accountids, uint -->

{% raw-partial file="/docs/_snippets/common-links.md" /%}
