# Deposit Authorization

_(Requires the [DepositAuth amendment](reference-amendments.html#depositauth).)_

Deposit Authorization is an optional feature of an [account](accounts.html) in the XRP Ledger. With Deposit Authorization enabled, transactions cannot send value of any kind to the account unless the sender of those transactions is the account itself. This includes transfers of XRP and issued currencies.

By default, new accounts have DepositAuth disabled.

## Background

Financial services regulations and licenses may require that a business or entity must know the sender of all transactions it receives. This presents a challenge on a decentralized system like the XRP Ledger where participants are identified by pseudonyms which can be freely generated and the default behavior is for any address to be able to pay any other.

The Deposit Authorization flag introduces an option for those using the XRP Ledger to comply with such regulations without changing the fundamental nature of the decentralized ledger. With Deposit Authorization enabled, an account can only receive funds it explicitly approves by sending a transaction. The owner of an account using Deposit Authorization can perform the due diligence necessary to identify the sender of any funds _before_ sending the transaction that causes the account to receive the money.

Deposit Authorization is intended to be used with [Checks](reference-amendments.html#checks), [Escrow](escrow.html), and [Payment Channels](reference-amendments.html#paychan). In this "two-step" model, first the source sends a transaction to authorize sending funds, then the destination sends a transaction to authorize receiving those funds. Deposit Authorization cannot be used with [Payment transactions][].

## Recommended Usage

To get the full effect of Deposit Authorization, Ripple recommends also doing the following:

- Always maintain an XRP balance higher than the minimum [reserve requirement](reserves.html).
- Keep the DefaultRipple flag in its default (disabled) state. Do not enable [rippling](noripple.html) on any trust lines. When sending TrustSet transactions, always use the [`tfSetNoRipple` flag](reference-transaction-format.html#trustset-flags).
- Do not place [Offers](reference-transaction-format.html#offercreate). It is impossible to know in advance which matching offers will be consumed to execute such a trade.

## Precise Semantics

An account with Deposit Authorization enabled:

- **Cannot** be the destination of [Payment transactions][], with **one exception**:
    - If the account's XRP balance is equal to or below the minimum account [reserve requirement](reserves.html), it can be the destination of an XRP Payment whose `Amount` is equal or less than the minimum account reserve (currently 20 XRP). This is to prevent an account from becoming "stuck" by being unable to send transactions but also unable to receive XRP. The account's owner reserve does not matter for this case.
- Can receive XRP from [PaymentChannelClaim transactions][] **only if** the sender of the PaymentChannelClaim transaction is the destination of the payment channel.
- Can receive XRP from [EscrowFinish transactions][] **only if** the sender of the EscrowFinish transaction is the destination of the escrow.
- **Can** receive XRP or issued currencies by sending a [CheckCash][] transaction. _(Requires the [Checks amendment](reference-amendments.html#checks).)_
- **Can** receive XRP or issued currencies by sending [OfferCreate transactions][].
    - If the account sends an OfferCreate transaction that is not fully executed immediately, it **can** receive the remainder of the ordered XRP or issued currency later when the offer is consumed by other accounts' [Payment][] and [OfferCreate][] transactions.
- If the account has created any trust lines without the [NoRipple flag](noripple.html) enabled, or has enabled the DefaultRipple flag and issued any currency, the account **can** receive the issued currencies of those trust lines in [Payment transactions][] as a result of rippling. It cannot be the destination of those transactions.
- In general, an account in the XRP Ledger **cannot** receive any non-XRP currencies in the XRP Ledger as long as all of the following are true. (This rule is not specific to the DepositAuth flag.)
    - The account has not created any trust lines with a nonzero limit.
    - The account has not issued currency on trust lines created by others
    - The account has not placed any offers.

The following table summarizes whether a transaction type can deposit money with DepositAuth enabled or disabled:

{% include '_snippets/depositauth-semantics-table.html' %}


## Enabling or Disabling Deposit Authorization

An account can enable deposit authorization by sending an [AccountSet transaction][] with the `SetFlag` field set to the `asfDepositAuth` value (9). The account can disable deposit authorization by sending an [AccountSet transaction][] with the `ClearFlag` field set to the `asfDepositAuth` value (9). For more information on AccountSet flags, see [AccountSet flags](reference-transaction-format.html#accountset-flags).

## Checking Whether an Account Has DepositAuth Enabled

To see whether an account has Deposit Authorization enabled, use the [account_info method][] to look up the account. Compare the value of the `Flags` field (in the `result.account_data` object) with the [bitwise flags defined for an AccountRoot ledger object](reference-ledger-format.html#accountroot-flags).

If the result of the `Flags` value bitwise-AND the `lsfDepositAuth` flag value (0x01000000) is nonzero, then the account has DepositAuth enabled. If the result is zero, then the account has DepositAuth disabled.

## See Also

- The [Authorized Trust Lines](authorized-trust-lines.html) feature (`RequireAuth` flag) limits which counterparties can hold non-XRP currencies issued by an account.
- The `DisallowXRP` flag indicates that an account should not receive XRP. This is a softer protection than Deposit Authorization, and is not enforced by the XRP Ledger. (Client applications should honor this flag or at least warn about it.)
- The `RequireDest` flag indicates that an account can only receive currency amounts if the sending transaction specifies a [Destination Tag](tutorial-gateway-guide.html#source-and-destination-tags). This protects users from forgetting to indicate the purpose of a payment, but does not protect recipients from unknown senders, who can make up arbitrary destination tags.
- [Partial Payments](partial-payments.html) provide a way for accounts to return unwanted payments while subtracting [transfer fees](transfer-fees.html) and exchange rates from the amount delivered instead of adding them to the amount sent.

{% include '_snippets/tx-type-links.md' %}
