Many objects in the XRP Ledger, particularly transactions and ledgers, are uniquely identified by a 256-bit hash value. This value is typically calculated as a "SHA-512Half", which calculates a [SHA-512](http://dx.doi.org/10.6028/NIST.FIPS.180-4) hash from some contents, then takes the first half of the output. (That's 256 bits, which is 32 bytes, or 64 characters of the hexadecimal representation.) Since the hash of an object is derived from the contents in a way that is extremely unlikely to produce collisions, two objects with the same hash can be considered the same.

An XRP Ledger hash value has the following characteristics:

* Exactly 64 characters in length
* [Hexadecimal](https://en.wikipedia.org/wiki/Hexadecimal) character set: 0-9 and A-F.
* Typically written in upper case.

**Note:** SHA-512Half has similar security to the officially-defined _SHA-512/256_ hash function. However, the XRP Ledger's usage predates SHA-512/256 and is also easier to implement on top of an existing SHA-512 function. (As of this writing, SHA-512 support in cryptographic libraries is much more common than for SHA-512/256.)
