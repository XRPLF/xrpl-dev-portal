Accounts in the XRP Ledger are identified by an address in the XRP Ledger's [base58][] format. The address is derived from the account's master [public key](https://en.wikipedia.org/wiki/Public-key_cryptography), which is in turn derived from a secret key. An address is represented as a string in JSON and has the following characteristics:

* Between 25 and 35 characters in length
* Starts with the character `r`

    **Note:** The XRP community has [proposed](https://github.com/xrp-community/standards-drafts/issues/6) (and developed a [codec](https://github.com/xrp-community/xrpl-tagged-address-codec) to support) a new **X**-address format that exchanges and wallets could use instead of [destination tags](https://xrpl.org/source-and-destination-tags.html). These "packed" addresses start with an `X` instead of an `r`. For more information, see the [XRPL 𝗫-address format](https://xrpaddress.info/) site.

* Uses alphanumeric characters, excluding the number "`0`" capital letter "`O`", capital letter "`I`", and lowercase letter "`l`"
* Case-sensitive
* Includes a 4-byte checksum so that the probability of generating a valid address from random characters is approximately 1 in 2^32

{% if currentpage.md != "concept-accounts.md" %}
For more information, see [Accounts](accounts.html) and [base58 Encodings](base58-encodings.html).
{% endif %}
