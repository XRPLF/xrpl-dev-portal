---
html: stablecoin-configuration.html
parent: stablecoins.html
seo:
    description: Configure your stablecoin to fine tune its capabilities.
labels:
  - Tokens
---
# Stablecoin Configuration

There are some settings you must configure on your XRP Ledger account before you start issuing tokens. For examples of how to configure these settings, see [Issue a Fungible Token](../../../../tutorials/how-tos/use-tokens/issue-a-fungible-token.md).

Settings you might want to configure include:

| Setting | Notes |
|---------|-------|
| Default Ripple | Issuers must enable this field. |
| Deposit Authorization | Block all incoming payments from users you haven't explicitly approved. |
| Require Auth | Restrict your tokens to being held by users you've explicitly approved. |
| Tick Size | Round off exchange rates in the decentralized exchange to facilitate faster price discovery. |
| Transfer Fee | Charge a percentage fee when users send your token to each other. |


## Default Ripple

The Default Ripple flag controls whether the balances on a trust line are allowed to _ripple_ by default. Rippling is what allows customers to send and trade tokens among themselves, so an issuer MUST allow rippling on all the trust lines to its issuing address. See [Rippling](../rippling.md).

Before asking customers to create trust lines to its issuing address, an issuer should enable the Default Ripple flag on that address. Otherwise, the issuer must individually disable the No Ripple flag for each trust line that other addresses have created.

You should _not_ enable the Default Ripple flag on other addresses, such as your operational or standby wallets.


## Deposit Authorization

The Deposit Authorization setting blocks all incoming payments to your account, unless either:

- You have previously preauthorized the sender.
- You send a transaction to receive the funds. For example, you could finish an Escrow that was initiated by a stranger.

Deposit Authorization is most useful for blocking unwanted XRP payments, because you already can't receive tokens unless you've created a trust line to their issuer. However, as a stablecoin issuer, you need to be able to receive payments from users in order for them to redeem the stablecoin for its off-ledger value; you can preauthorize your customers but doing so requires storing an object in the ledger for each custom address, increasing your reserve requirement substantially.

Therefore, Deposit Authorization is not recommended for stablecoin issuers unless you need it to meet regulatory requirements about receiving money from unknown or sanctioned entities.

For more information, see [Deposit Authorization](../../../accounts/depositauth.md).


## Disallow Incoming Trust Line

The Disallow Incoming Trust Line setting prevents other users from opening trust lines to an address. As a precaution, you should enable this setting on your operational and standby addresses so that those addresses cannot issue tokens even inadvertently. Do not enable this setting on your issuing address.

To enable this setting, send an [AccountSet transaction](../../../../references/protocol/transactions/types/accountset.md) with `"SetFlag": 15` (`asfDisallowIncomingTrustline`).


## Disallow XRP

The Disallow XRP setting is designed to discourage XRP Ledger users from sending XRP to an address by accident. This reduces the costs and effort of bouncing undesired payments from addresses that aren't intended to receive and hold XRP. The Disallow XRP flag is not enforced at the protocol level, because doing so could allow addresses to become permanently unusable if they run out of XRP. Client applications should honor the Disallow XRP flag by default, but may allow users to ignore it.

The Disallow XRP flag is optional, but if you don't intend to receive XRP from customers you may want to enable it on your issuing address and all your operational addresses.


## Require Auth

The Require Auth setting blocks users from holding the tokens you issue unless you explicitly approve their trust lines first. You can use this setting to meet regulatory requirements if it matters who holds your tokens within the XRP Ledger. However, this can reduce the utility of your tokens since your approval becomes a bottleneck for users to use them.

Also, you must use your issuing address each time you authorize a trust line; if you must authorize a lot of trust lines, this can undermine the security of your issuing address because you have to use it so often. (If you only need to use the issuing address sparingly, you can put greater protections on its secret keys. The more often you use it, the more of a burden those protections become.)

For more information, see [Authorized Trust Lines](../authorized-trust-lines.md).


## Tick Size

The Tick Size setting controls how many decimal places are used when calculating exchange rates in the [Decentralized Exchange](../../decentralized-exchange/index.md). A higher Tick Size means more precision and less rounding in the amounts of various trades. Too much precision can be inconvenient because trades are ranked primarily based on exchange rate, so a trader can offer a minuscule amount more to the top of the list. A smaller Tick Size works similar to the minimum bid increment at an auction, saving everyone the time and effort of gradually bidding up a price by irrelevantly small amounts. However, a smaller Tick Size results in more rounding, which can increase the costs of trading, and sometimes has surprising results because two Offers that seemed like an exact match before rounding no longer match after rounding.

The Tick Size is an account-level setting and applies to all tokens issued by the same address.

Tick Size only controls the precision of _exchange rates_, not the precision of the token itself. Users can send and hold very large or very small amounts regardless of the Tick Size set by the token's issuer.

For more information, see [Tick Size](../../decentralized-exchange/ticksize.md).


## Transfer Fees

A transfer fee setting charges users a percentage fee when sending your tokens to each other. The transfer fee does not apply when issuing tokens or redeeming them directly with the issuing address. (It _does_ apply when users send payments to your hot wallet.) If you issue multiple tokens from the same address, the same transfer fee applies to all of them.

When users send a token with a transfer fee, the amount of the transfer fee is debited from the sending side in addition to the destination amount, but only the destination amount is credited to the recipient. The amount of the fee "vanishes" from the XRP Ledger. As a stablecoin issuer, this means that you gain that much equity in your reserves outside of the XRP Ledger—or, in other words, the amount you need to keep as collateral decreases each time users pay a transfer fee.

At a protocol level, the transfer fee is defined by the `TransferRate` account setting, which is an integer from 1 billion to 2 billion.

For more information, see [Transfer Fees](../../transfer-fees.md).


### Transfer Fees with Operational and Standby Addresses

All XRP Ledger addresses, including operational and standby addresses, are subject to the issuer's transfer fees when sending tokens. If you set a nonzero transfer fee, then you must send extra (to pay the transfer fee) when making payments from your operational address or standby address. In other words, your addresses must pay back a little of the balance your issuing address created, each time you make a payment.

Set the `SendMax` transaction parameter higher than the destination `Amount` parameter by a percentage based on the `TransferRate` setting.

**Note:** Transfer fees do not apply when sending tokens directly from or to the issuing address. The issuing address must always accept its tokens at face value in the XRP Ledger. This means that customers don't have to pay the transfer fee if they send payments to the issuing address directly, but they do when sending to an operational address. If you accept payments at both addresses, you may want to adjust the amount you credit customers in your system of record when customers send payments to the operational address, to compensate for the transfer fee the customer pays.

For example: If ACME sets a transfer fee of 1%, an XRP Ledger payment to deliver 5 EUR.ACME from a customer address to ACME's issuing address would cost exactly 5 EUR.ACME. However, the customer would need to send 5.05 EUR.ACME to deliver 5 EUR.ACME to ACME's operational address. When ACME credits customers for payments to ACME's operational address, ACME credits the customer for the amount delivered to the operational address _and_ the transfer fee, giving the customer €5,05 in ACME's systems.
