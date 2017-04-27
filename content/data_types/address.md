Ripple Accounts are identified by a base58 Ripple Address, which is derived from the account's master public key. An address is represented as a string in JSON, with the following characteristics:

* Between 25 and 35 characters in length
* Starts with the character `r`
* Case-sensitive
* Contains error-checking that makes it unlikely that a randomly-generated string is a valid address
* Uses alphanumeric characters, excluding the number "`0`" capital letter "`O`", capital letter "`I`", and lowercase letter "`l`"

For more information, see [Accounts](concept-accounts.html).
