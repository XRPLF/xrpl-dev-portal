# Ledger Object Types

Following are the different kinds of objects that can appear in the ledger's state tree. Each ledger object consists of several fields. In the peer protocol that `rippled` servers use to communicate with each other, ledger objects are represented in their raw binary format. In the [`rippled` API](rippled-api.html), ledger objects are represented as JSON objects.

* [**AccountRoot**](accountroot.html)

    The settings, XRP balance, and other metadata for one account.

* [**Amendments**](amendments.html)

    Singleton object with status of enabled and pending amendments.

* [**Check**](check.html)

    A check that can be redeemed for money by its destination.

* [**DirectoryNode**](directorynode.html)

    Contains links to other objects.

* [**Escrow**](escrow.html)

    Contains XRP held for a conditional payment.

* [**FeeSettings**](feesettings.html)

    Singleton object with consensus-approved base transaction cost and reserve requirements.

* [**LedgerHashes**](ledgerhashes.html)

    Lists of prior ledger versions' hashes for history lookup.

* [**Offer**](offer.html)

    An offer to exchange currencies, known in finance as an _order_.

* [**PayChannel**](paychannel.html)

    A channel for asynchronous XRP payments.

* [**RippleState**](ripplestate.html)

    Links two accounts, tracking the balance of one currency between them. The concept of a _trust line_ is really an abstraction of this object type.

* [**SignerList**](signerlist.html)

    A list of addresses for multi-signing transactions.
