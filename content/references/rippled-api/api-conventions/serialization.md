# Serialization Format
[[Source]<br>](https://github.com/ripple/rippled/blob/develop/src/ripple/protocol/impl/STObject.cpp#L697-L718 "Source")

This page describes the XRP Ledger's canonical binary format for transactions and other data. This binary format is necessary to create and verify digital signatures of those transactions' contents, and is also used in other places. The [rippled APIs](rippled-apis.html) typically use JSON to communicate with client applications. However, JSON is unsuitable as a format for serializing transactions for being digitally signed, because JSON can represent the same data in many different but equivalent ways.

The process of serializing a transaction from JSON or any other representation into their canonical binary format can be summarized with these steps:

1. Make sure all required fields are provided, including any required but "auto-fillable" fields.

    **Note:** The `SigningPubKey` must also be provided at this step. When signing, you can derive this key from the secret key that is provided for signing.

2. Convert each field's data into its "internal" binary format.
3. Sort the fields in canonical order.
4. Prefix each field with a Field ID.
5. Concatenate the fields (including prefixes) in their sorted order.

The result is a single binary blob that can be signed using well-known signature algorithms such as ECDSA (with the secp256k1 elliptic curve) and Ed25519. After signing, you must attach the signature to the transaction, calculate the transaction's identifying hash, then re-serialize the transaction with the additional fields.

**Note:** The XRP Ledger uses the same serialization format to represent other types of data, such as [ledger objects](ledger-object-types.html) and processed transactions. However, only certain fields are appropriate for including in a transaction that gets signed. (For example, the `TxnSignature` field, containing the signature itself, should not be present in the binary blob that you sign.) Thus, some fields are designated as "Signing" fields, which are included in objects when those objects are signed, and "non-signing" fields, which are not.

The hard work is the details of each of those steps.

***Notes: some useful links for signing:***

- Actual core of the signing code in rippled: https://github.com/ripple/rippled/blob/develop/src/ripple/protocol/impl/STObject.cpp#L697-L718
- Serialization code in ripple-lib depends on `ripple-binary-codec`. These definitions have the canonical types and sort codes for all fields: https://github.com/ripple/ripple-binary-codec/blob/master/src/enums/definitions.json

## Internal Format

Each field has an "internal" binary format used in the `rippled` source code to represent that field when signing (and in most other cases). The internal formats for all fields are defined in the source code of [`SField.cpp`](https://github.com/ripple/rippled/blob/master/src/ripple/protocol/impl/SField.cpp). (This file also includes fields other than transaction fields. The [Transaction Format Reference](transaction-formats.html) also lists the internal formats for all transaction fields. <!--{# TODO: Clean up the "Internal Format" type listing and come up with an explicit definition of every type. #}-->

For example, the `Flags` [common transaction field](transaction-common-fields.html) becomes a UInt32 (32-bit unsigned integer).

## Canonical Field Order

All fields in a transaction are sorted in a specific order based on the field's type first, then the field itself second. (Think of it as sorting by family name, then given name, where the family name is the field's type and the given name is the field itself.)

### Field IDs

[[Source - Encoding]](https://github.com/seelabs/rippled/blob/cecc0ad75849a1d50cc573188ad301ca65519a5b/src/ripple/protocol/impl/Serializer.cpp#L117-L148 "Source")
[[Source - Decoding]](https://github.com/seelabs/rippled/blob/cecc0ad75849a1d50cc573188ad301ca65519a5b/src/ripple/protocol/impl/Serializer.cpp#L484-L509 "Source")


When you combine the type code and sort code, you get the field's identifier, which is prefixed before the field in the final serialized blob. The size of the Field ID is one to three bytes depending on the type code and field codes it combines. See the following table:

|                  | Type Code < 16                                                                | Type Code >= 16 |
|:-----------------|:------------------------------------------------------------------------------|:--|
| **Field Code < 16**  | 1 byte: high 4 bits define type; low 4 bits define field.                     | 2 bytes: low 4 bits of the first byte define field; next byte defines type |
| **Field Code >= 16** | 2 bytes: high 4 bits of the first byte define type; low 4 bits of first byte are 0; next byte defines field | 3 bytes: first byte is 0x00, second byte defines type; third byte defines field |

When decoding, you can tell how many bytes the field ID is by which bits **of the first byte** are zeroes. This corresponds to the cases in the above table:

|                  | High 4 bits are nonzero                                                                | High 4 bits are zero |
|:-----------------|:------------------------------------------------------------------------------|:--|
| **Low 4 bits are nonzero**  | 1 byte: high 4 bits define type; low 4 bits define field.                     | 2 bytes: low 4 bits of the first byte define field; next byte defines type |
| **Low 4 bits are zero** | 2 bytes: high 4 bits of the first byte define type; low 4 bits of first byte are 0; next byte defines field | 3 bytes: first byte is 0x00, second byte defines type; third byte defines field |

### Type Codes

Each field type has an arbitrary sort code, with lower codes sorting first. These codes are defined in [`SField.h`](https://github.com/ripple/rippled/blob/master/src/ripple/protocol/SField.h#L57-L74).

For example, [UInt32 has sort order 2](https://github.com/ripple/rippled/blob/72e6005f562a8f0818bc94803d222ac9345e1e40/src/ripple/protocol/SField.h#L59), so all UInt32 fields come before all [Amount fields with order 6](https://github.com/ripple/rippled/blob/72e6005f562a8f0818bc94803d222ac9345e1e40/src/ripple/protocol/SField.h#L63).

### Field Codes

Each field also has a field code, which is used to sort fields that have the same type as one another, with lower codes sorting first. These fields are defined in [`SField.cpp`](https://github.com/ripple/rippled/blob/72e6005f562a8f0818bc94803d222ac9345e1e40/src/ripple/protocol/impl/SField.cpp#L72-L266).

For example, the `Account` field of a [Payment transaction][] [has sort code 1](https://github.com/ripple/rippled/blob/72e6005f562a8f0818bc94803d222ac9345e1e40/src/ripple/protocol/impl/SField.cpp#L219), so it comes before the `Destination` field which [has sort code 3](https://github.com/ripple/rippled/blob/72e6005f562a8f0818bc94803d222ac9345e1e40/src/ripple/protocol/impl/SField.cpp#L221).

The field code is combined with the type code to make a field's [Field ID](#field-ids).

### Variable-Length Encoding

Some types of fields are Variable-Length encoding, which means they are not always the same byte length and are prefixed with a length indicator to indicate how much data they contain. `Blob` fields (containing arbitrary binary data) are one such variable-length encoded type. For a list of which types are variable-length encoded, see the [Internal Formats](#internal-formats) table.

**Note:** Some types that are not variable-length encoded nonetheless vary in length. These types have different ways of indicating how long they are.

Variable-length fields are encoded with one to three bytes indicating the length of the field immediately after the type prefix and before the contents.

- If the field contains 0 to 192 bytes of data, the first byte defines the length of the VariableLength data, then that many bytes of data follow immediately after the length byte.
- If the field contains 193 to 12480 bytes of data, the first two bytes indicate the length of the field with the following formula:
        193 + ((byte1 - 193) * 256) + byte2
- If the field contains 12481 to 918744 bytes of data, the first three bytes indicate the length of the field with the following formula:
        12481 + ((byte1 - 241) * 65536) + (byte2 * 256) + byte3;
- A variable-length field cannot contain more than 918744 bytes of data.

When decoding, you can tell from the value of the first length byte whether there are 0, 1, or 2 more length bytes:

- If the first length byte has a value of 192 or less, then that's the only length byte and it contains the exact length of the field contents in bytes.
- If the first length byte has a value of 193 to 240, then there are two length bytes.
- If the first length byte has a value of 241 to 254, then there are three length bytes.


## Type List

Transaction instructions may contain fields of any of the following types:

| Type Name     | Type Code | Variable-Length? | Description                   |
|:--------------|:----------|:-----------------|:------------------------------|
| [AccountID][] | 8         | Yes              | The unique identifier for an [account](accounts.html). This field is variable-length encoded, but always exactly 20 bytes. |
| [Amount][]    | 6         | No               | An amount of XRP or issued currency. The length of the field is 64 bits for XRP or |
| [Blob][]      | 7         | Yes              | Arbitrary binary data. One important such field is `TxnSignature`, the signature that authorizes a transaction. |
| [Hash128][]   | 4         | No               | A 128-bit arbitrary binary value. The only such field is `EmailHash`, which is intended to store the MD-5 hash of an account owner's email for purposes of fetching a [Gravatar](https://www.gravatar.com/). |
| [Hash160][]   | 17        | No               | A 160-bit arbitrary binary value. This may define a currency code or issuer. |
| [Hash256][]   | 5         | No               | A 256-bit arbitrary binary value. This usually represents the "SHA-512Half" hash of a transaction, ledger version, or ledger data object. |
| [PathSet][]   | 18        | No               | A set of possible [payment paths](paths.html) for a [cross-currency payment](cross-currency-payments.html). |
| [STArray][]   | 15        | No               | An array containing a variable number of members, which can be different types depending on the field. Two cases of this include [memos](transaction-common-fields.html#memos-field) and lists of signers used in [multi-signing](multi-signing.html). |
| [STObject][]  | 14        | No               | An object containing one or more nested fields. |
| [UInt8][]     | 16        | No               | An 8-bit unsigned integer.    |
| [UInt16][]    | 1         | No               | A 16-bit unsigned integer. The `TransactionType` is a special case of this type, with specific strings mapping to integer values. |
| [UInt32][]    | 2         | No               | A 32-bit unsigned integer. The `Flags` and `Sequence` fields on all transactions are examples of this type. |

In addition to all of the above field types, the following types may appear in other contexts, such as [ledger objects](ledger-object-types.html) and [transaction metadata](transaction-metadata.html):

| Type Name     | Type Code | Variable-Length? | Description                   |
|:--------------|:----------|:-----------------|:------------------------------|
| Transaction   | 10001     | No               | A "high-level" type containing an entire [transaction](transaction-formats.html). |
| LedgerEntry   | 10002     | No               | A "high-level" type containing an entire [ledger object](ledger-object-types.html). |
| Validation    | 10003     | No               | A "high-level" type used in peer-to-peer communications to represent a validation vote in the [consensus process](consensus.html). |
| Metadata      | 10004     | No               | A "high-level" type containing [metadata for one transaction](transaction-metadata.html). |
| [UInt64][]    | 3         | No               | A 64-bit unsigned integer. This type does not appear in transaction instructions, but several  use fields of this type. |
| [Vector256][] | 19        | Yes              | This type does not appear in transaction instructions, but the [Amendments ledger object](amendments-object.html)'s `Amendments` field uses this to represent which [amendments](amendments.html) are currently enabled. |


### AccountID Fields
[AccountID]: #accountid-fields

Fields of this type contain the 160-bit identifier for an XRP Ledger [account](accounts.html). In JSON, these fields are represented as base58 XRP Ledger "addresses", with additional checksum data so that typos are unlikely to result in valid addresses. (This encoding, sometimes called "Base58Check", prevents accidentally sending money to the wrong address.) The binary format for these fields does not contain any checksum data. (However, since the binary format is used mostly for signed transactions, a typo or other error in transcribing a signed transaction would invalidate the signature, preventing it from sending money.)

These fields are [variable-length encoded](#variable-length-encoding) despite being a fixed 160 bits in length. As a result, the length indicator for these fields is always the byte `0x14`.


### Amount Fields
[Amount]: #amount-fields

The "Amount" type is a special field type that represents an amount of currency, either XRP or an issued currency. This type consists of two sub-types:

- **XRP**
    XRP is serialized as a 64-bit unsigned integer (big-endian order), except that the second-most-significant bit is `1` to indicate that it is positive. In other words, take a standard UInt64 and calculate the bitwise-OR of that with `0x4000000000000000` to get the serialized format.
- **Issued Currencies**
    Issued currencies consist of three segments in order:
    1. 64 bits indicating the amount in the [internal currency format](currency-formats.html#issued-currency-math). The first bit is `1` to indicate that this is not XRP.
    2. 160 bits indicating the [currency code](https://developers.ripple.com/currency-formats.html#currency-codes). The standard API converts 3-character codes such as "USD" into 160-bit codes using the [standard currency code format](currency-formats.html#standard-currency-codes), but custom 160-bit codes are also possible.
    3. 160 bits indicating the issuer's Account ID. (See also: [Account Address Encoding](accounts.html#address-encoding))

You can tell which of the two sub-types it is based on the first bit: `0` for XRP; `1` for issued currency.


### Array Fields
[STArray]: #array-fields

Some transaction fields, such as `SignerEntries` (in [SignerListSet transactions][]) and [`Memos`](transaction-common-fields.html#memos-field), are arrays.

Arrays contain several other fields in their native binary format in a specific order. Each of these fields has its normal Field ID prefix and contents. To mark the end of an array, append an item with a "Field ID" of `0xf1` (the type code for array with field code of 1) and no contents.

The following example shows the serialization format for an array (the `SignerEntries` field):

![Array field ID, followed by the Field ID and contents of each array element, followed by the "Array end" field ID](img/serialization-array.png)


### Blob Fields
[Blob]: #blob-fields

The Blob type is a [variable-length encoded](#variable-length-encoding) field with arbitrary data. Two common fields that use this type are `SigningPubKey` and `TxnSignature`, which contain (respectively) the public key and signature that authorize a transaction to be executed.

Blob fields have no further structure to their contents, so they consist of exactly the amount of bytes indicated in the variable-length encoding, after the Field ID and length prefixes.


### Object Fields
[STObject]: #object-fields

Some fields, such as `SignerEntry` (in [SignerListSet transactions][]), and `Memo` (in `Memos` arrays) are objects. The serialization of objects is very similar to that of arrays, with one difference: **object members must be placed in canonical order** within the object field, where array fields have an explicit order already.

The [canonical field order](#canonical-field-order) of object fields is the same as the canonical field order for all top-level fields, but the members of the object must be sorted within the object. After the last member, there is an "Object end" Field ID of `0xe1` with no contents.

The following example shows the serialization format for an object (a single `Memo` object in the `Memos` array).

![Object field ID, followed by the Object ID and contents of each object member in canonical order, followed by the "Object end" field ID](img/serialization-object.png)

### UInt Fields
[UInt8]: #uint-fields
[UInt16]: #uint-fields
[UInt32]: #uint-fields
[UInt64]: #uint-fields

The XRP Ledger has several unsigned integer types: UInt8, UInt16, UInt32, and UInt64. All of these are standard big-endian binary unsigned integers with the specified number of bits.

When representing these fields in JSON objects, most are represented as JSON numbers by default. The exception is UInt64, which is represented as a string because some JSON decoders may try to represent these integers as 64-bit "double precision" floating point numbers, which cannot represent all distinct UInt64 values with full precision.
