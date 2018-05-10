# Ledger Object Types

There are several different kinds of objects that can appear in the ledger's state tree:

* [**AccountRoot** - The settings, XRP balance, and other metadata for one account.](accountroot.html)
* [**Amendments** - Singleton object with status of enabled and pending amendments.](amendments.html)
* [**Check** - A check that can be redeemed for money by its destination.](check.html)
* [**DirectoryNode** - Contains links to other objects.](directorynode.html)
* [**Escrow** - Contains XRP held for a conditional payment.](escrow.html)
* [**FeeSettings** - Singleton object with consensus-approved base transaction cost and reserve requirements.](feesettings.html)
* [**LedgerHashes** - Lists of prior ledger versions' hashes for history lookup.](ledgerhashes.html)
* [**Offer** - An offer to exchange currencies, known in finance as an _order_.](offer.html)
* [**PayChannel** - A channel for asynchronous XRP payments.](paychannel.html)
* [**RippleState** - Links two accounts, tracking the balance of one currency between them. The concept of a _trust line_ is really an abstraction of this object type.](ripplestate.html)
* [**SignerList** - A list of addresses for multi-signing transactions.](signerlist.html)

Each ledger object consists of several fields. In the peer protocol that `rippled` servers use to communicate with each other, ledger objects are represented in their raw binary format. In [`rippled` APIs](rippled-apis.html), ledger objects are represented as JSON objects.
