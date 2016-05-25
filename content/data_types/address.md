Ripple Accounts are identified by a base-58 Ripple Address, which is derived from the account's master public key. An address is represented as a String in JSON, with the following characteristics:

* Between 25 and 35 characters in length
* Starts with the character `r`
* Case-sensitive
* [Base-58](https://wiki.ripple.com/Encodings) encoded using only the following characters: `rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz` That's alphanumeric characters, excluding zero (`0`), capital O (`O`), capital I (`I`), and lowercase L (`l`).
* Contains error-checking that makes it unlikely that a randomly-generated string is a valid address.

#### Special Addresses ####
[ACCOUNT_ONE]: #special-addresses
[ACCOUNT_ZERO]: #special-addresses

Some addresses have special meaning, or historical uses, in the Ripple Consensus Ledger. In many cases, these are "black hole" addresses, meaning the address is not derived from a known secret key. Since it is almost impossible to guess a secret key from only an address, any XRP possessed by those addresses is lost forever.

| Address                     | Name | Meaning | Black Hole? |
|-----------------------------|------|---------|-------------|
| rrrrrrrrrrrrrrrrrrrrrhoLvTp | ACCOUNT\_ZERO | An address that is the base-58 encoding of the value `0`. In peer-to-peer communications, `rippled` uses this address as the issuer for XRP. | Yes |
| rrrrrrrrrrrrrrrrrrrrBZbvji  | ACCOUNT\_ONE | An address that is the base-58 encoding of the value `1`. In the ledger, [RippleState entries](reference-ledger-format.html#ripplestate) use this address as a placeholder for the issuer of a trust line balance. | Yes |
| rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh | The genesis account | When `rippled` starts a new genesis ledger from scratch (for example, in stand-alone mode), this account holds all the XRP. This address is generated from the seed value "masterpassphrase" which is [hard-coded](https://github.com/ripple/rippled/blob/94ed5b3a53077d815ad0dd65d490c8d37a147361/src/ripple/app/ledger/Ledger.cpp#L184). | No |
| rrrrrrrrrrrrrrrrrNAMEtxvNvQ | Ripple Name reservation black-hole | In the past, Ripple asked users to send XRP to this account to reserve Ripple Names.| Yes |
| rrrrrrrrrrrrrrrrrrrn5RM1rHd | NaN Address | Previous versions of [ripple-lib](https://github.com/ripple/ripple-lib) generated this address when base-58 encoding the value [NaN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN). | Yes |
