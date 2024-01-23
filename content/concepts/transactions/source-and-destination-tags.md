---
html: source-and-destination-tags.html
parent: transactions.html
blurb: Use source and destination tags to indicate specific purposes for payments from and to multi-purpose addresses.
labels:
  - Payments
  - Accounts
  - Security
---
# Source and Destination Tags

_Source tags_ and _destination tags_ are a feature of XRP Ledger [payments](../payment-types/index.md) that can indicate specific purposes for payments from and to multi-purpose addresses. Source and destination tags do not have direct on-ledger functionality; source and destination tags merely provide information about how off-ledger systems should process a payment. In transactions, both source and destination tags are formatted as 32-bit unsigned integers.

Destination tags indicate the beneficiary or destination for a payment. For example, a payment to an [exchange](../../use-cases/defi/list-xrp-as-an-exchange.md) or [stablecoin issuer](../../use-cases/tokenization/stablecoin-issuer.md) address can use a destination tag to indicate which customer to credit for the amount of the payment in that business's own systems. A payment to a merchant could indicate what item or cart the payment is buying.

Source tags indicate the originator or source of a payment. Most commonly, a Source Tag is included so that the recipient of the payment knows where to send a return, or "bounced", payment. When returning an incoming payment, you should use the source tag from the incoming payment as the destination tag of the outgoing (return) payment.

The practice of giving customers the ability to send and receive transactions from your XRP Ledger address using another interface is called providing _hosted accounts_. Hosted accounts typically use source and destination tags for each customer.

**Tip:** An [X-address](https://xrpaddress.info/) combines a classic address with a tag into a single address that encodes both. If you are showing a deposit address to customers, it may be easier for your customers to use an X-address rather than making them keep track of two pieces of information. (The tag in an X-address acts as a source tag when sending and a destination tag when receiving.)

## Rationale

In other distributed ledgers, it is common to use different deposit addresses for each customer. In the XRP Ledger, an address must be a funded, permanent [account](../accounts/accounts.md) to receive payments. Using this approach in the XRP Ledger wastefully consumes resources of all servers in the network, and is costly because the [reserve](../accounts/reserves.md) amount must be set aside indefinitely for each address.

Source and destination tags provide a more lightweight way to map deposits and payments to individual customers.

## Use Cases

A business may want to use source and destination tags for several purposes:

- Direct mappings to customer accounts.
- Matching return payments to the outgoing payments that prompted them.
- Mapping payments to quotes that expire.
- Providing disposable tags that customers can generate for specific deposits.

To prevent overlap while protecting privacy, a business can divide the total range of tags available into sections for each purpose, then assign tags in an unpredictable order within the range. For example, use a cryptographic hash function like [SHA-256](https://en.wikipedia.org/wiki/SHA-2), then use the [modulo operator](https://en.wikipedia.org/wiki/Modulo_operation) to map the output to the size of the relevant section. To be safe, check for collisions with old tags before using a new tag.

Assigning tags in numerical order provides less privacy to customers. Since all XRP Ledger transactions are public, assigning tags in this way can make it possible to guess which tags correspond to various users' addresses or to derive information about users' accounts based on the tags used.


## Requiring Tags

For an XRP Ledger address that may receive payments intended for several customer accounts, receiving a payment _without_ a destination tag can be a problem: it is not immediately obvious which customer to credit, which can require a manual intervention and a discussion with the sender to figure out who was the intended recipient. To reduce cases like this, you can [enable the `RequireDest` setting](../../tutorials/manage-account-settings/require-destination-tags.md). That way, if a user forgets to include a destination tag in a payment, the XRP Ledger rejects their payment instead of giving you money you don't know what to do with. The user can then send the payment again, using the tag as they should have.


## See Also

- [Require Destination Tags](../../tutorials/manage-account-settings/require-destination-tags.md)
- [Payment Types](../payment-types/index.md)

{% raw-partial file="/_snippets/common-links.md" /%}
