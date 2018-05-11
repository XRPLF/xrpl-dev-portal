# Modifying the Ledger

All changes to the XRP Ledger happen as the result of transactions. The only API methods that can change the contents of the XRP Ledger are the commands that submit transactions. Even then, changes only apply permanently if the transactions are approved by the [consensus process](consensus.html). Most other public methods represent different ways to view the data represented in the XRP Ledger, or request information about the state of the server.

Transaction submission commands:

- [`submit` command](XREF: submit.md)
- [`submit_multisigned` command](XREF: submit-multisigned.md)

For more information on the various transactions you can submit, see the [Transaction Reference](xref: transaction-methods.html).
