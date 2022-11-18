## Addresses

Accounts in the XRP Ledger are identified by an address in the XRP Ledger's base58 format. The address is derived from the account's master [public key](https://en.wikipedia.org/wiki/Public-key_cryptography), which is in turn derived from a secret key. An address is represented as a string in JSON and has the following characteristics:

* Between 25 and 35 characters in length
* Starts with the character `r`
* Uses alphanumeric characters, excluding the number "`0`" capital letter "`O`", capital letter "`I`", and lowercase letter "`l`"
* Case-sensitive
* Includes a 4-byte checksum so that the probability of generating a valid address from random characters is approximately 1 in 2<sup>32</sup>

> **Note:** The XRP community has proposed an **X**-address format that "packs" a destination tag into the address. These addresses start with an `X` (for the mainnet) or a `T` (for the [testnet](../networks/parallel-networks.md)). Exchanges and wallets can use X-addresses to represent all the data a customer needs to know in one value. For more information, see the [X-address format site](https://xrpaddress.info/) and [codec](https://github.com/xrp-community/xrpl-tagged-address-codec).
>
> The XRP Ledger protocol only supports "classic" addresses natively, but many client libraries support X-addresses too.


For more information, see [Accounts](accounts.md).


Any valid address can become an account in the XRP Ledger by being funded. You can also use an address that has not been funded to represent a regular key or a member of a signer list. Only a funded account can be the sender of a transaction.

Creating a valid address is a strictly mathematical task starting with a key pair. You can generate a key pair and calculate its address entirely offline without communicating to the XRP Ledger or any other party. The conversion from a public key to an address involves a one-way hash function, so it is possible to confirm that a public key matches an address but it is impossible to derive the public key from the address alone. (This is part of the reason why signed transactions include the public key _and_ the address of the sender.)

For more technical details of how to calculate an XRP Ledger address, see [Address Encoding](#address-encoding).


## Address Encoding

**Tip:** These technical details are only relevant for people building low-level library software for XRP Ledger compatibility!

[[Source]](https://github.com/ripple/rippled/blob/35fa20a110e3d43ffc1e9e664fc9017b6f2747ae/src/ripple/protocol/impl/AccountID.cpp#L109-L140 "Source")

XRP Ledger addresses are encoded using `base58` with the _dictionary_ `rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz`. Since the XRP Ledger encodes several types of keys with base58, it prefixes the encoded data with a one-byte "type prefix" (also called a "version prefix") to distinguish them. The type prefix causes addresses to usually start with different letters in base58 format.


### Special Addresses

Some addresses have special meaning, or historical uses, in the XRP Ledger. In many cases, these are "black hole" addresses, meaning the address is not derived from a known secret key. Since it is effectively impossible to guess a secret key from only an address, any XRP possessed by black hole addresses is lost forever.


| Address                       | Name | Meaning | Black Hole? |
|-------------------------------|------|---------|-------------|
| `rrrrrrrrrrrrrrrrrrrrrhoLvTp` | ACCOUNT\_ZERO | An address that is the XRP Ledger's base58 encoding of the value `0`. In peer-to-peer communications, `rippled` uses this address as the issuer for XRP. | Yes |
| `rrrrrrrrrrrrrrrrrrrrBZbvji`  | ACCOUNT\_ONE | An address that is the XRP Ledger's base58 encoding of the value `1`. In the ledger, [RippleState entries](ripplestate.html) use this address as a placeholder for the issuer of a trust line balance. | Yes |
| `rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh` | The genesis account | When `rippled` starts a new genesis ledger from scratch (for example, in stand-alone mode), this account holds all the XRP. This address is generated from the seed value `masterpassphrase` which is [hard-coded](https://github.com/ripple/rippled/blob/94ed5b3a53077d815ad0dd65d490c8d37a147361/src/ripple/app/ledger/Ledger.cpp#L184). | No |
| `rrrrrrrrrrrrrrrrrNAMEtxvNvQ` | Ripple Name reservation black-hole | In the past, Ripple asked users to send XRP to this account to reserve Ripple Names.| Yes |
| `rrrrrrrrrrrrrrrrrrrn5RM1rHd` | NaN Address | Previous versions of [ripple-lib](https://github.com/XRPLF/xrpl.js) generated this address when encoding the value [NaN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN) using the XRP Ledger's base58 string encoding format. | Yes |
