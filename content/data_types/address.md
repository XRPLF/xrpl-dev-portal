Ripple Accounts are identified by a base-58 Ripple Address, which is derived from the account's master public key. An address is represented as a String in JSON, with the following characteristics:

* Between 25 and 35 characters in length
* Starts with the character `r`
* Case-sensitive
* Contains error-checking that makes it unlikely that a randomly-generated string is a valid address.
* **Base58-encoded**, using alphanumeric characters, excluding zero (`0`), capital O (`O`), capital I (`I`), and lowercase L (`l`).

For more information, see [Accounts](concept-accounts.html).
