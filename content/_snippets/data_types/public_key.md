The XRP Ledger uses public keys to verify cryptographic signatures in several places:

* To authorize transactions, a public key is attached to the transaction. The public key must be mathematically associated with the sending XRP Ledger address or the sender's regular key address.
* To secure peer-to-peer communications between `rippled` servers. This uses a "node public key" that the server generates randomly when it starts with an empty database.
* To sign validation votes as part of the consensus process. This uses a "validator public key" that the server operator [defines in the config file](run-rippled-as-a-validator.html).

Validator public keys and node public keys use the exact same format.

Public keys can be represented in hexadecimal or in base-58. In hexadecimal, all three types of public keys are 33 bytes (66 characters) long.

In base-58 format, validator public keys and node public keys always start with the character `n`, commonly followed by the character `9`. A validator public key in base-58 format can be up to 53 characters long. Example node public key: `n9Mxf6qD4J55XeLSCEpqaePW4GjoCR5U1ZeGZGJUCNe3bQa4yQbG`.

XRP Ledger addresses are mathematically associated with a public key. This public key is rarely encoded in base-58, but when it is, it starts with the character `a`.
