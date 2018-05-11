# Pseudo-Transactions

Pseudo-Transactions are never submitted by users, nor propagated through the network. Instead, a server may choose to inject them in a proposed ledger directly. If enough servers inject an equivalent pseudo-transaction for it to pass consensus, then it becomes included in the ledger, and appears in ledger data thereafter.

Some of the fields that are mandatory for normal transactions do not make sense for pseudo-transactions. In those cases, the pseudo-transaction has the following default values:

| Field         | Default Value                                            |
|:--------------|:---------------------------------------------------------|
| Account       | [ACCOUNT_ZERO](accounts.html#special-addresses) |
| Sequence      | 0                                                        |
| Fee           | 0                                                        |
| SigningPubKey | ""                                                       |
| Signature     | ""                                                       |
