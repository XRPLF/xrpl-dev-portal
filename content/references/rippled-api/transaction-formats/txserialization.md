# Transaction Serialization Format (notes)
[[Source]<br>](https://github.com/ripple/rippled/blob/develop/src/ripple/protocol/impl/STObject.cpp#L697-L718 "Source")

XRP Ledger transactions have a canonical binary format, which is necessary to create and verify digital signatures of those transactions' contents. (JSON is sometimes used as a serialization format, but the many equivalent ways to format and represent the same data in JSON makes it unsuitable for being digitally signed.)

The process of serializing a transaction from JSON or any other representation into their canonical binary format can be summarized with these steps:

1. Make sure all required fields are provided, including any required but "auto-fillable" fields.
    **Note:** The `SigningPubKey` must also be provided at this step. When signing, you can derive this key from the secret key that is provided for signing.
2. Convert each field's data into its "internal" binary format.
3. Sort the fields in canonical order.
4. Prefix each field with an identifier.
5. Concatenate the fields (including prefixes) in their sorted order.

The result is a single binary blob that can be signed using well-known signature algorithms such as ECDSA (with the secp256k1 elliptic curve) and Ed25519. After signing, you must attach the signature to the transaction, calculate the transaction's identifying hash, then re-serialize the transaction with the additional fields.

The hard work is the details of each of those steps.

***Notes: some useful links for signing:***

- Actual core of the signing code in rippled: https://github.com/ripple/rippled/blob/develop/src/ripple/protocol/impl/STObject.cpp#L697-L718
- Serialization code in ripple-lib depends on `ripple-binary-codec`. These definitions have the canonical types and sort codes for all fields: https://github.com/ripple/ripple-binary-codec/blob/master/src/enums/definitions.json

## Internal Format

Each field has an "internal" binary format used in the `rippled` source code to represent that field when signing (and in most other cases). The internal formats for all fields are defined in the source code of [`SField.cpp`](https://github.com/ripple/rippled/blob/master/src/ripple/protocol/impl/SField.cpp). (This file also includes fields other than transaction fields. The [Transaction Format Reference](transaction-formats.html) also lists the internal formats for all transaction fields. <!--{# TODO: Clean up the "Internal Format" type listing and come up with an explicit definition of every type. #}-->

For example, the `Flags` [common transaction field](transaction-common-fields.html) becomes a UInt32 (32-bit unsigned integer).

## Canonical Field Order

All fields in a transaction are sorted in a specific order based on the field's type first, then the field itself second. (Think of it as sorting by family name, then given name, where the family name is the field's type and the given name is the field itself.)

When you combine the type code and sort code, you get the field's identifier, which is prefixed before the field in the final serialized blob. If both the type code and the field code 

### Type Codes

Each field type has an arbitrary sort code, with lower codes sorting first. These codes are defined in [`SField.h`](https://github.com/ripple/rippled/blob/master/src/ripple/protocol/SField.h#L57-L74).

For example, [UInt32 has sort order 2](https://github.com/ripple/rippled/blob/72e6005f562a8f0818bc94803d222ac9345e1e40/src/ripple/protocol/SField.h#L59), so all UInt32 fields come before all [Amount fields with order 6](https://github.com/ripple/rippled/blob/72e6005f562a8f0818bc94803d222ac9345e1e40/src/ripple/protocol/SField.h#L63).

### Field Codes

Each field also has a field code, which is used to sort fields that have the same type as one another, with lower codes sorting first. These fields are defined in [`SField.cpp`](https://github.com/ripple/rippled/blob/72e6005f562a8f0818bc94803d222ac9345e1e40/src/ripple/protocol/impl/SField.cpp#L72-L266).

For example, the `Account` field of a [Payment transaction][] [has sort code 1](https://github.com/ripple/rippled/blob/72e6005f562a8f0818bc94803d222ac9345e1e40/src/ripple/protocol/impl/SField.cpp#L219), so it comes before the `Destination` field which [has sort code 3](https://github.com/ripple/rippled/blob/72e6005f562a8f0818bc94803d222ac9345e1e40/src/ripple/protocol/impl/SField.cpp#L221).


### Array Fields

Some transaction fields, such as `SignerEntries` (in [SignerListSet transactions][]) and [`Memos`](transaction-common-fields.html#memos-field), are arrays. ***TODO: describe how they're serialized.***

### Object Fields

Some fields, such as `SignerEntry` (in [SignerListSet transactions][]), and `Memo` (in `Memos` arrays) are objects. ***TODO: describe how objects are serialized.***

### Amount Fields

The "Amount" type is a special field type that represents an amount of currency, either XRP or an issued currency. This type consists of two sub-types:

- **XRP**
    XRP is serialized as a 64-bit unsigned integer (big-endian order), except that the second-most-significant bit is `1` to indicate that it is positive. In other words, take a standard UInt64 and calculate the bitwise-OR of that with `0x4000000000000000` to get the serialized format.
- **Issued Currencies**
    Issued currencies consist of three segments in order:
    1. 64 bits indicating the amount in the [internal currency format](currency-formats.html#issued-currency-math). The first bit is `1` to indicate that this is not XRP.
    2. 160 bits indicating the [currency code](https://developers.ripple.com/currency-formats.html#currency-codes). The standard API converts 3-character codes such as "USD" into 160-bit codes using the [standard currency code format](currency-formats.html#standard-currency-codes), but custom 160-bit codes are also possible.
    3. 160 bits indicating the issuer's Account ID. (See also: [Account Address Encoding](accounts.html#address-encoding))

You can tell which of the two sub-types it is based on the first bit: `0` for XRP; `1` for issued currency.
