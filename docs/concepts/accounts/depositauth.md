---
html: depositauth.html
parent: accounts.html
seo:
    description: The DepositAuth setting lets an account block incoming payments by default.
labels:
  - Payments
  - Security
---
# Deposit Authorization

_(Added by the [DepositAuth amendment][].)_

Deposit Authorization is an optional [account](index.md) setting in the XRP Ledger. If enabled, Deposit Authorization blocks all transfers from strangers, including transfers of XRP and [tokens](../tokens/index.md). An account with Deposit Authorization can only receive value in two ways:

- From accounts it has [preauthorized](#preauthorization).
- By sending a transaction to receive the funds. For example, an account with Deposit Authorization could finish an [Escrow](../payment-types/escrow.md) that was initiated by a stranger.

By default, new accounts have DepositAuth disabled and can receive XRP from anyone.

## Background

Financial services regulations and licenses may require that a business or entity must know the sender of all transactions it receives. This presents a challenge on a decentralized system like the XRP Ledger where participants are identified by pseudonyms which can be freely generated and the default behavior is for any address to be able to pay any other.

The Deposit Authorization flag introduces an option for those using the XRP Ledger to comply with such regulations without changing the fundamental nature of the decentralized ledger. With Deposit Authorization enabled, an account can only receive funds it explicitly approves by sending a transaction. The owner of an account using Deposit Authorization can perform the due diligence necessary to identify the sender of any funds _before_ sending the transaction that causes the account to receive the money.

When you have Deposit Authorization enabled, you can receive money from [Checks](/resources/known-amendments.md#checks), [Escrow](../payment-types/escrow.md), and [Payment Channels](/resources/known-amendments.md#paychan). In these transactions' "two-step" model, first the source sends a transaction to authorize sending funds, then the destination sends a transaction to authorize receiving those funds.

To receive money from [Payment transactions][] when you have Deposit Authorization enabled, you must [preauthorize](#preauthorization) the senders of those Payments. _(Added by the [DepositPreauth amendment][].)_

## Recommended Usage

To get the full effect of Deposit Authorization, Ripple recommends also doing the following:

- Always maintain an XRP balance higher than the minimum [reserve requirement](reserves.md).
- Keep the Default Ripple flag in its default (disabled) state. Do not enable [rippling](../tokens/fungible-tokens/rippling.md) on any trust lines. When sending [TrustSet transactions][], always use the [`tfSetNoRipple` flag](../../references/protocol/transactions/types/trustset.md).
- Do not place [Offers](../../references/protocol/transactions/types/offercreate.md). It is impossible to know in advance which matching offers will be consumed to execute such a trade. <!-- STYLE_OVERRIDE: will -->

## Precise Semantics

An account with Deposit Authorization enabled:

- **Cannot** be the destination of [Payment transactions][], with **the following exceptions**:
    - If the destination has [preauthorized](#preauthorization) the sender of the Payment. _(Added by the [DepositPreauth amendment][])_
    - If the account's XRP balance is equal to or below the minimum account [reserve requirement](reserves.md), it can be the destination of an XRP Payment whose `Amount` is equal or less than the minimum account reserve (currently 10 XRP). This is to prevent an account from becoming "stuck" by being unable to send transactions but also unable to receive XRP. The account's owner reserve does not matter for this case.
- Can receive XRP from [PaymentChannelClaim transactions][] **only in the following cases**:
    - The sender of the PaymentChannelClaim transaction is the destination of the payment channel.
    - The destination of the PaymentChannelClaim transaction has [preauthorized](#preauthorization) the sender of the PaymentChannelClaim. _(Added by the [DepositPreauth amendment][])_
- Can receive XRP from [EscrowFinish transactions][] **only in the following cases**:
    - The sender of the EscrowFinish transaction is the destination of the escrow.
    - The destination of the EscrowFinish transaction has [preauthorized](#preauthorization) the sender of the EscrowFinish. _(Added by the [DepositPreauth amendment][])_
- **Can** receive XRP or tokens by sending a [CheckCash][] transaction. _(Added by the [Checks amendment][].)_
- **Can** receive XRP or tokens by sending [OfferCreate transactions][].
    - If the account sends an OfferCreate transaction that is not fully executed immediately, it **can** receive the rest of the ordered XRP or token later when the offer is consumed by other accounts' [Payment][] and [OfferCreate][] transactions.
- If the account has created any trust lines without the [No Ripple flag](../tokens/fungible-tokens/rippling.md) enabled, or has enabled the Default Ripple flag and issued any currency, the account **can** receive the tokens of those trust lines in [Payment transactions][] as a result of rippling. It cannot be the destination of those transactions.
- In general, an account in the XRP Ledger **cannot** receive any non-XRP currencies in the XRP Ledger as long as all of the following are true. (This rule is not specific to the DepositAuth flag.)
    - The account has not created any trust lines with a nonzero limit.
    - The account has not issued tokens on trust lines created by others.
    - The account has not placed any offers.

The following table summarizes whether a transaction type can deposit money with DepositAuth enabled or disabled:

{% partial file="/docs/_snippets/depositauth-semantics-table.md" /%}



## Enabling or Disabling Deposit Authorization

An account can enable deposit authorization by sending an [AccountSet transaction][] with the `SetFlag` field set to the `asfDepositAuth` value (9). The account can disable deposit authorization by sending an [AccountSet transaction][] with the `ClearFlag` field set to the `asfDepositAuth` value (9). For more information on AccountSet flags, see [AccountSet flags](../../references/protocol/transactions/types/accountset.md).

## Checking Whether an Account Has DepositAuth Enabled

To see whether an account has Deposit Authorization enabled, use the [account_info method][] to look up the account. Compare the value of the `Flags` field (in the `result.account_data` object) with the [bitwise flags defined for an AccountRoot ledger object](../../references/protocol/ledger-data/ledger-entry-types/accountroot.md).

If the result of the `Flags` value bitwise-AND the `lsfDepositAuth` flag value (`0x01000000`) is nonzero, then the account has DepositAuth enabled. If the result is zero, then the account has DepositAuth disabled.

## Preauthorization

_(Added by the [DepositPreauth amendment][].)_

Accounts with DepositAuth enabled can _preauthorize_ certain senders, to allow payments from those senders to succeed even with DepositAuth enabled. This allows specific senders to send funds directly without the receiver taking action on each transaction individually. Preauthorization is not required to use DepositAuth, but can make certain operations more convenient.

Preauthorization is currency-agnostic. You cannot preauthorize accounts for specific currencies only.

To preauthorize a particular sender, send a [DepositPreauth transaction][] with the address of another account to preauthorize in the `Authorize` field. To revoke preauthorization, provide the other account's address in the `Unauthorize` field instead. Specify your own address in the `Account` field as usual. You can preauthorize or unauthorize accounts even if you do not currently have DepositAuth enabled; the preauthorization status you set for other accounts is saved, but has no effect unless you enable DepositAuth. An account cannot preauthorize itself. Preauthorizations are one-directional, and have no effect on payments going the opposite direction.

Preauthorizing another account adds a [DepositPreauth object](../../references/protocol/ledger-data/ledger-entry-types/depositpreauth.md) to the ledger, which increases the [owner reserve](reserves.md#owner-reserves) of the account providing the authorization. If the account revokes this preauthorization, doing so removes the object and decreases the owner reserve.

After the DepositPreauth transaction has been processed, the authorized account can send funds to your account, even if you have DepositAuth enabled, using any of the following transaction types:

- [Payment][]
- [EscrowFinish][]
- [PaymentChannelClaim][]

Preauthorization has no effect on the other ways to send money to an account with DepositAuth enabled. See [Precise Semantics](#precise-semantics) for the exact rules.

### Checking for Authorization

You can use the [deposit_authorized method][] to see if an account is authorized to deposit to another account. This method checks two things: <!-- STYLE_OVERRIDE: is authorized to -->

- Whether the destination account requires Deposit Authorization. (If it does not require authorization, then all source accounts are considered authorized.)
- Whether the source account is preauthorized to send money to the destination.


## See Also

- The [DepositPreauth transaction][] reference.
- The [DepositPreauth ledger object type](../../references/protocol/ledger-data/ledger-entry-types/depositpreauth.md).
- The [deposit_authorized method][] of the [`rippled` API](../../references/http-websocket-apis/index.md).
- The [Authorized Trust Lines](../tokens/fungible-tokens/authorized-trust-lines.md) feature (`RequireAuth` flag) limits which counterparties can hold non-XRP currencies issued by an account.
- The `DisallowXRP` flag indicates that an account should not receive XRP. This is a softer protection than Deposit Authorization, and is not enforced by the XRP Ledger. (Client applications should honor this flag or at least warn about it.)
- The `RequireDest` flag indicates that an account can only receive currency amounts if the sending transaction specifies a [Destination Tag](../transactions/source-and-destination-tags.md). This protects users from forgetting to indicate the purpose of a payment, but does not protect recipients from unknown senders, who can make up arbitrary destination tags.
- [Partial Payments](../payment-types/partial-payments.md) provide a way for accounts to return unwanted payments while subtracting [transfer fees](../tokens/transfer-fees.md) and exchange rates from the amount delivered instead of adding them to the amount sent.
<!--{# TODO: Add link to "check for authorization" tutorial DOC-1684 #}-->


[DepositPreauth amendment]: /resources/known-amendments.md#depositpreauth

{% raw-partial file="/docs/_snippets/common-links.md" /%}
