Accounts in the XRP Ledger are identified by an address in the XRP Ledger's [base58](../../references/protocol/data-types/base58-encodings.md) format. The address is derived from the account's master [public key](https://en.wikipedia.org/wiki/Public-key_cryptography), which is in turn derived from a secret key. An address is represented as a string in JSON and has the following characteristics:

* Between 25 and 35 characters in length
* Starts with the character `r`
* Uses alphanumeric characters, excluding the number "`0`" capital letter "`O`", capital letter "`I`", and lowercase letter "`l`"
* Case-sensitive
* Includes a 4-byte checksum so that the probability of generating a valid address from random characters is approximately 1 in 2<sup>32</sup>

{% admonition type="info" name="Note" %}
There is also an **X**-address format that "packs" a [destination tag](../../concepts/transactions/source-and-destination-tags.md) into the address. These addresses start with an `X` (for Mainnet) or a `T` (for [test networks](../../concepts/networks-and-servers/parallel-networks.md)). Exchanges and wallets can use X-addresses to represent all the data a customer needs to know in one value. For more information, see the [X-address format site](https://xrpaddress.info/) and [codec](https://github.com/xrp-community/xrpl-tagged-address-codec).

The XRP Ledger protocol only supports "classic" addresses natively, but many [client libraries](../../references/client-libraries.md) support X-addresses too.
{% /admonition %}
