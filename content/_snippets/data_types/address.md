Accounts in the XRP Ledger are identified by an address in the XRP Ledger's [base58][] format. The address is derived from the account's master [public key](https://en.wikipedia.org/wiki/Public-key_cryptography), which is in turn derived from a secret key. An address is represented as a string in JSON and has the following characteristics:

* Between 25 and 35 characters in length
* Starts with the character `r`
* Uses alphanumeric characters, excluding the number "`0`" capital letter "`O`", capital letter "`I`", and lowercase letter "`l`"
* Case-sensitive
* Includes a 4-byte checksum so that the probability of generating a valid address from random characters is approximately 1 in 2^32

{% if currentpage.md != "concept-accounts.md" %}
For more information, see [Accounts](accounts.html) and [base58 Encodings](base58-encodings.html).
{% endif %}
