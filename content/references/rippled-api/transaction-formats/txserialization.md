# Transaction Serialization Format (notes)
[[Source]<br>](https://github.com/ripple/rippled/blob/develop/src/ripple/protocol/impl/STObject.cpp#L697-L718 "Source")

XRP Ledger transactions have a canonical binary format, which is necessary to create and verify digital signatures of those transactions' contents. (JSON is sometimes used as a serialization format, but the many equivalent ways to format and represent the same data in JSON makes it unsuitable for being digitally signed.)

The process of serializing a transaction from JSON or any other representation into their canonical binary format can be summarized with these steps:

1. Convert each field's data into its "internal" binary format.
2. Sort the fields in canonical order.
3. Concatenate the fields in their sorted order. ***TODO: seems there must be some sort of wrapping/control data to indicate which fields are present for cases with optional fields.***

When serializing transaction instructions to be signed, you must also:

- Make sure all required fields are provided, including any required but "auto-fillable" fields.
- Add the `SigningPubKey` field ***TODO: at what point in the above process? Probably before sorting, if it's a signing field?***


The result is a single binary blob that can be signed using well-known signature algorithms such as ECDSA (with the secp256k1 elliptic curve) and Ed25519. The hard work is the details of each of those steps.

***Notes: some useful links for signing:***

- Actual core of the signing code in rippled: https://github.com/ripple/rippled/blob/develop/src/ripple/protocol/impl/STObject.cpp#L697-L718
- Serialization code in ripple-lib depends on `ripple-binary-codec`. These definitions have the canonical types and sort codes for all fields: https://github.com/ripple/ripple-binary-codec/blob/master/src/enums/definitions.json

## Internal Format

Each field has an "internal" binary format used in the `rippled` source code to represent that field when signing (and in most other cases). The internal formats for all fields are defined in the source code of [`SField.cpp`](https://github.com/ripple/rippled/blob/master/src/ripple/protocol/impl/SField.cpp). (This file also includes fields other than transaction fields. The [Transaction Format Reference](transaction-formats.html) also lists the internal formats for all transaction fields. <!--{# TODO: Clean up the "Internal Format" type listing and come up with an explicit definition of every type. #}-->

For example, the `Flags` [common transaction field](transaction-common-fields.html) becomes a UInt32 (32-bit unsigned integer).

## Canonical Field Order

All fields in a transaction are sorted in a specific order based on the field's type first, then the field itself second. (Think of it as sorting by family name, then given name, where the family name is the field's type and the given name is the field itself.)

### Type Codes

Each field type has an arbitrary sort code, with lower codes sorting first. These codes are defined in [`SField.h`](https://github.com/ripple/rippled/blob/master/src/ripple/protocol/SField.h#L57-L74).

For example, [UInt32 has sort order 2](https://github.com/ripple/rippled/blob/72e6005f562a8f0818bc94803d222ac9345e1e40/src/ripple/protocol/SField.h#L59), so all UInt32 fields come before all [Amount fields with order 6](https://github.com/ripple/rippled/blob/72e6005f562a8f0818bc94803d222ac9345e1e40/src/ripple/protocol/SField.h#L63).

### Field Codes

Each field also has a sort code, which is used to sort fields that have the same type as one another, with lower codes sorting first. These fields are defined in [`SField.cpp`](https://github.com/ripple/rippled/blob/72e6005f562a8f0818bc94803d222ac9345e1e40/src/ripple/protocol/impl/SField.cpp#L72-L266).

For example, the `Account` field of a [Payment transaction][] [has sort code 1](https://github.com/ripple/rippled/blob/72e6005f562a8f0818bc94803d222ac9345e1e40/src/ripple/protocol/impl/SField.cpp#L219), so it comes before the `Destination` field which [has sort code 3](https://github.com/ripple/rippled/blob/72e6005f562a8f0818bc94803d222ac9345e1e40/src/ripple/protocol/impl/SField.cpp#L221).


### Array Fields

Some transaction fields, such as `SignerEntries` (in [SignerListSet transactions][]) and [`Memos`](transaction-common-fields.html#memos-field), are arrays. ***TODO: describe how they're serialized.***

### Object Fields

Some fields, such as `SignerEntry` (in [SignerListSet transactions][]), and `Memo` (in `Memos` arrays) are objects. ***TODO: describe how objects are serialized.***

### Amount Fields

The "AMOUNT" type is a special field type that represents an amount of currency, either XRP or an issued currency. ***TODO: details on how both are serialized in transactions.***
