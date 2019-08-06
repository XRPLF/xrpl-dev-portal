# Direct XRP Payments

The basis of any financial system is _transferring value_: or, in one word, payments. The simplest type of payment in the XRP Ledger is a direct XRP-to-XRP payment, which transfers XRP directly from one account in the XRP Ledger to another.

## About Direct XRP-to-XRP Payments

Generally, any address in the XRP Ledger can send XRP directly to any other address. The address on the receiving side is often called the _destination address_, and the address on the sending side is called the _source address_. To send XRP directly, the sender uses a [Payment transaction][], which can be as concise as the following:

```json
{
  "TransactionType": "Payment",
  "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
  "Amount": "13000000"
}
```

These transaction instructions mean: Send a payment from rf1Bi... to ra5nK... delivering exactly 13 XRP. If the transaction is successfully processed, it does exactly that. Since it usually takes about 4 seconds for each new ledger version to become [validated](consensus.html), a successful transaction can be created, submitted, executed, and have a final outcome in 8 seconds or less, even if gets queued for the ledger version after the current in-progress one.

**Caution:** The [Payment transaction type][Payment] can also be used for some more specialized kinds of payments, including [cross-currency payments](cross-currency-payments.html) and [partial payments](partial-payments.html). In the case of partial payments, it is possible that the `Amount` shows a large amount of XRP even if the transaction only delivered a very small amount. See [partial payments exploit](partial-payments.html#partial-payments-exploit) for how to avoid crediting a customer for the wrong amount.

Direct XRP-to-XRP payments cannot be partial payments, but partial payments can deliver XRP after converting from a different source currency.


## Funding Accounts

Any mathematically-valid address can receive a payment, even if the XRP Ledger has no record of that address existing beforehand, as long as the payment delivers enough XRP to meet the minimum [account reserve](reserves.html). If the payment would not deliver enough XRP, it fails.

For more information, see [Accounts](accounts.html#creating-accounts).


## Address Reuse

In the XRP Ledger, addresses where you can receive payments are permanent, and have a non-trivial [reserve requirement](reserves.html) of XRP that they cannot spend. This means that, contrary to some other blockchain systems, it is not a good idea to use a different, disposable address for every transaction. The best practice for the XRP Ledger is to reuse the same address for multiple transactions. If you use the address regularly (especially if it's managed by an internet-connected service), you should set a [regular key](cryptographic-keys.html) and proactively change keys on a regular basis to reduce the risk of a key compromise.

As a sender, it is best not to assume that your intended recipient is using the same address from the last time you sent them a payment. Inevitably, sometimes security compromises happen and a person or business has to change addresses. Before sending money, you should ask the recipient for their current receiving address, so you don't accidentally send money to a malicious user who has taken control of a compromised old address.


## How Direct XRP Payments Are Processed

From a relatively high level, the XRP Ledger's transaction processing engine applies a direct XRP payment as follows:

1. It validates the parameters of the [Payment transaction][]. If the transaction is structured to send and deliver XRP, the transaction processing engine recognizes it as a direct XRP-to-XRP payment. Validation checks include:

    - Checking that all fields are formatted correctly. For example, for direct XRP payments, the `Amount` field must be [drops of XRP][].
    - Checking that the sending address is a funded [account](accounts.html) in the XRP Ledger.
    - Checking that all provided signatures are valid for the sending address.
    - Confirming that the destination address is different than the sender address. (It is not sufficient to send to the same address with a different [destination tag](source-and-destination-tags.html).)
    - Confirming that the sender has a high enough XRP balance to send the payment.

    If any check fails, the payment fails.

2. It checks whether the receiving address is a funded account.

    - If the receiving address is funded, it checks whether the receiving address has any limitations on receiving payments, such as [DepositAuth](depositauth.html) or [RequireDest](source-and-destination-tags.html#requiring-tags). If the payment does not meet any such limitations, the payment fails.
    - If the receiving address is not funded, it checks whether the payment would deliver enough XRP to meet the minimum [account reserve](reserves.html). If not, the payment fails.

3. It debits the sending account by an amount of XRP specified by the `Amount` field plus the XRP to be destroyed for the [transaction cost](transaction-cost.html) and credits the receiving account for the same amount.

    If necessary, it creates a new account ([AccountRoot object](accountroot.html)) for the receiving address. The new account's starting balance is equal to the `Amount` of the payment.

    The engine adds a `delivered_amount` field to the [transaction's metadata](transaction-metadata.html) to indicate how much was delivered. You should always use `delivered_amount`, **not** the `Amount` field, to avoid being tricked about how much XRP you received. (Cross-currency "Partial Payments" can deliver less XRP than stated in the `Amount` field.) For more information, see [Partial Payments](partial-payments.html).


## Comparison to Other Payment Types

- **Direct XRP Payments** are the only way to both send and receive XRP in a single transaction. They are a good balance of speed, simplicity, and low cost.
- [Cross-currency payments](cross-currency-payments.html) also use the [Payment][] transaction type, but can send any combination of XRP and non-XRP [issued currencies](issued-currencies.html) except XRP-to-XRP. They can also be [partial payments](partial-payments.html). Cross-currency payments are good for payments not denominated in XRP or for taking arbitrage opportunities in the [decentralized exchange](decentralized-exchange.html).
- [Checks](checks.html) :not_enabled: let the sender set up an obligation without transferring any money immediately. The recipient can cash it any time before it expires, but the amount is not guaranteed. Checks can send either XRP or issued currencies. Checks are good for giving the recipient the autonomy to claim the payment.
- [Escrow](escrow.html) sets aside XRP which can be claimed by its intended recipient when certain conditions are met. The XRP amount is fully guaranteed and cannot be otherwise used by the sender unless the Escrow expires. Escrow is good for smart contracts in large amounts.
- [Payment Channels](payment-channels.html) set aside XRP. The recipient can claim XRP from the channel in bulk using signed authorizations. Individual authorizations can be verified without sending a full XRP Ledger transaction. Payment channels are good for extremely high-volume micropayments or "streaming" payments.


## See Also

- **Concepts:**
    - [Payment System Basics](payment-system-basics.html)
- **Tutorials:**
    - [Send XRP (Interactive Tutorial)](send-xrp.html)
    - [Monitor Incoming Payments with WebSocket](monitor-incoming-payments-with-websocket.html)
- **References:**
    - [Payment transaction][]
    - [Transaction Results](transaction-results.html)
    - [account_info method][] - for checking XRP balances


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
