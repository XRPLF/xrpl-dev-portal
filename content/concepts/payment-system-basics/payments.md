# Payments

The basis of any financial system is _transferring value_: or, in one word, payments. The XRP Ledger supports a variety of ways to make payments, with different types specialized for various use cases. The most basic type of payment in the XRP Ledger is a direct XRP-to-XRP payment.

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

These transaction instructions mean: Send a payment from rf1Bi... to ra5nK... delivering exactly 13 XRP. If the transaction is successfully processed, it does exactly that. Since it usually takes about 4 seconds for each new ledger version to become [validated](consensus.html), a successful transaction can be created, submitted, executed, and have a completely final outcome in 8 seconds or less, even if gets queued for the ledger version after the current in-progress one.

**Caution:** The [Payment transaction type][Payment] can also be used for some more specialized kinds of payments, including [cross-currency payments](cross-currency-payments.html) and [partial payments](partial-payments.html). In the case of partial payments, it is possible that the `Amount` shows a large amount of XRP even if the transaction only delivered a very small amount. See [partial payments exploit](partial-payments.html#partial-payments-exploit) for how to avoid crediting a customer for the wrong amount.

## Funding Accounts

Any mathematically-valid address can receive a payment, even if the XRP Ledger has no record of that address existing beforehand, as long as the payment delivers enough XRP to meet the minimum [account reserve](reserves.html). If the payment would not deliver enough XRP, it fails.

For more information, see [Accounts](accounts.html#creating-accounts).

## Blocking Incoming Payments

By default, any address can send XRP to any other address. This works well for many smart contracts and for making most transactions as smooth as possible. However, you may not want to be able to receive from unknown senders because of regulatory requirements. For example, you or your business might be required to prove that you do not receive money from economically-sanctioned countries, terrorists, or known criminals. In this case, you can enable the [DepositAuth setting](depositauth.html) to block incoming payments unless you approve the sender or individual payment before receiving funds (XRP or otherwise). For more information, see [DepositAuth](depositauth.html).

The [`DisallowXRP` setting](accountset.html#blocking-incoming-transactions) is a related, softer limitation which is not natively enforced in the XRP Ledger. (Doing so strictly could cause an account to become "locked" if it ran out of XRP to pay for [transaction costs](transaction-cost.html).) Instead, client applications should enforce this setting (unless explicitly overridden with user intervention) to reduce cases of accidentally sending XRP to an address that primarily deals in [issued currencies](issued-currencies.html).

## Source and Destination Tags

***TODO: split off from gateway guide***

## See Also

***TODO***
