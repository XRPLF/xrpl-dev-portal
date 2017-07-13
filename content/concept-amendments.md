# Amendments #

[Introduced in: rippled 0.31.0][New in: rippled 0.31.0]

The Amendments system provides a means of introducing new features to the decentralized Ripple consensus network without causing disruptions. The amendments system works by utilizing the core consensus process of the network to approve any changes by showing continuous support before those changes go into effect. An amendment normally requires **80% support for two weeks** before it can apply.

When an Amendment has been enabled, it applies permanently to all ledger versions after the one that included it. You cannot disable an Amendment, unless you introduce a new Amendment to do so.


## Background ##

Any changes to transaction processing could cause servers to build a different ledger with the same set of transactions. If some _validators_ (`rippled` servers [participating in consensus](tutorial-rippled-setup.html#reasons-to-run-a-validator)) have upgraded to a new version of the software while other validators use the old version, this could cause anything from minor inconveniences to full outages. In the minor case, a minority of servers spend more time and bandwidth fetching the actual consensus ledger because they cannot build it using the transaction processing rules they already know. In the worst case, [the consensus process](https://ripple.com/build/ripple-ledger-consensus-process/) might be unable to validate new ledger versions because servers with different rules could not reach a consensus on the exact ledger to build.

Amendments solve this problem, so that new features can be enabled only when enough validators support those features.

Users and businesses who rely on the Ripple Consensus Ledger can also use Amendments to provide advance notice of changes in transaction processing that might affect their business. However, API changes that do not impact transaction processing or [the consensus process](https://ripple.com/build/ripple-ledger-consensus-process/) do not need Amendments.


## About Amendments ##

An amendment is a fully-functional feature or change, waiting to be enabled by the peer-to-peer network as a part of the consensus process. A `rippled` server that wants to use an amendment has code for two modes: without the amendment (old behavior) and with the amendment (new behavior).

Every amendment has a unique identifying hex value and a short name. The short name is for human use, and is not used in the amendment process. Two servers can support the same amendment ID while using different names to describe it. An amendment's name is not guaranteed to be unique.

By convention, Ripple's developers use the SHA-512Half hash of the amendment name as the amendment ID.

See also: [Known Amendments](#known-amendments)

## Amendment Process ##

Every 256th ledger is called a "flag" ledger. The process of approving an amendment starts in the ledger version immediately before the flag ledger. When `rippled` validator servers send validation messages for that ledger, those servers also submit votes in favor of specific amendments. If a validator does not vote in favor of an amendment, that is the same as voting against the amendment. ([Fee Voting](concept-fee-voting.html) also occurs around flag ledgers.)

The flag ledger itself has no special contents. However, during that time, the servers look at the votes of the validators they trust, and decide whether to insert an [`EnableAmendment` pseudo-transaction](reference-transaction-format.html#enableamendment) into the following ledger. The flags of an EnableAmendment pseudo-transaction show what the server thinks happened:

* The `tfGotMajority` flag means that support for the amendment has increased to at least 80% of trusted validators.
* The `tfLostMajority` flag means that support for the amendment has decreased to less than 80% of trusted validators.
* An EnableAmendment pseudo-transaction with no flags means that support for the amendment has been enabled. (The change in transaction processing applies to every ledger after this one.)

A server only inserts the pseudo-transaction to enable an amendment if all of the following conditions are met:

* The amendment has not already been enabled.
* A previous ledger includes an EnableAmendment pseudo-transaction for this amendment with the `tfGotMajority` flag enabled.
* The previous ledger in question is an ancestor of the current ledger.
* The previous ledger in question has a close time that is at least **two weeks** before the close time of the latest flag ledger.
* There are no EnableAmendment pseudo-transactions for this amendment with the `tfLostMajority` flag enabled in the consensus ledgers between the `tfGotMajority` pseudo-transaction and the current ledger.

Theoretically, a `tfLostMajority` EnableAmendment pseudo-transaction could be included in the same ledger as the pseudo-transaction to enable an amendment. In this case, the pseudo-transaction with the `tfLostMajority` pseudo-transaction has no effect.

## Amendment Voting ##

Each version of `rippled` is compiled with a list of known amendments and the code to implement those amendments. By default, `rippled` supports known amendments and opposes unknown amendments. Operators of `rippled` validators can [configure their servers](#configuring-amendment-voting) to explicitly support or oppose certain amendments, even if those amendments are not known to their `rippled` versions.

To become enabled, an amendment must be supported by at least 80% of trusted validators continuously for two weeks. If support for an amendment goes below 80% of trusted validators, the amendment is temporarily rejected. The two week period starts over if the amendment regains support of at least 80% of trusted validators. (This can occur if validators vote differently, or if there is a change in which validators are trusted.) An amendment can gain and lose a majority an unlimited number of times before it becomes permanently enabled. An amendment cannot be permanently rejected, but it becomes very unlikely for an amendment to become enabled if new versions of `rippled` do not have the amendment in their known amendments list.

As with all aspects of the consensus process, amendment votes are only taken into account by servers that trust the validators sending those votes. At this time, Ripple (the company) recommends only trusting the 5 default validators that Ripple (the company) operates. For now, trusting only those validators is enough to coordinate with Ripple (the company) on releasing new features.

### Configuring Amendment Voting ###

You can temporarily configure an amendment using the [`feature` command](reference-rippled.html#feature). To make a persistent change to your server's support for an amendment, change your server's `rippled.cfg` file.

Use the `[veto_amendments]` stanza to list amendments you do not want the server to vote for. Each line should contain one amendment's unique ID, optionally followed by the short name for the amendment. For example:

```
[veto_amendments]
C1B8D934087225F509BEB5A8EC24447854713EE447D277F69545ABFA0E0FD490 Tickets
DA1BD556B42D85EA9C84066D028D355B52416734D3283F85E216EA5DA6DB7E13 SusPay
```

Use the `[amendments]` stanza to list amendments you want to vote for. (Even if you do not list them here, by default a server votes for all the amendments it knows how to apply.) Each line should contain one amendment's unique ID, optionally followed by the short name for the amendment. For example:

```
[amendments]
4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373 MultiSign
42426C4D4F1009EE67080A9B7965B44656D7714D104A72F9B4369F97ABF044EE FeeEscalation
```


### Amendment Blocked ###

When an amendment gets enabled for the network after the voting process, servers running earlier versions of `rippled` that do not know about the amendment become "amendment blocked" because they no longer understand the rules of the network. Servers that are amendment blocked:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Do not participate in the consensus process
* Do not vote on future amendments

Becoming amendment blocked is a security feature to protect backend applications. Rather than guessing and maybe misinterpreting a ledger after new rules have applied, `rippled` reports that it does not know the state of the ledger because it does not know how the amendment works.

The amendments that a `rippled` server is configured to vote for or against have no impact on whether the server becomes amendment blocked. A `rippled` server always follows the set of amendments enabled by the rest of the network, to the extent possible. A server only becomes amendment blocked if the enabled amendment is not included in the amendment definitions compiled into the server's source code -- in other words, if the amendment is newer than the server.

If your server is amendment blocked, you must [upgrade to a new version](tutorial-rippled-setup.html#updating-rippled) to sync with the network.


## Testing Amendments ##

If you want to see how `rippled` behaves with an amendment enabled, before that amendment gets enabled on the production network, you can run use `rippled`'s configuration file to forcibly enable a feature. This is intended for development purposes only.

Because other members of the consensus network probably do not have the feature enabled, you should not use this feature while connecting to the production network. While testing with features forcibly enabled, you should run `rippled` in [Stand-Alone Mode](concept-stand-alone-mode.html).

To forcibly enable a feature, add a `[features]` stanza to your `rippled.cfg` file. In this stanza, add the short names of the features to enable, one per line. For example:

```
[features]
MultiSign
TrustSetAuth
```


# Known Amendments #
[[Source]<br>](https://github.com/ripple/rippled/blob/release/src/ripple/app/main/Amendments.cpp "Source")

The following is a comprehensive list of all known amendments and their status on the production Ripple Consensus Ledger:

| Name                                  | Introduced | Status                  |
|:--------------------------------------|:-----------|:------------------------|
| [FlowCross](#flowcross)               | v0.70.0    | [Planned: TBD]( "BADGE_LIGHTGREY") |
| [SHAMapV2](#shamapv2)                 | v0.33.0    | [Planned: TBD]( "BADGE_LIGHTGREY") |
| [OwnerPaysFee](#ownerpaysfee)         | v0.33.0    | [Planned: TBD]( "BADGE_LIGHTGREY") |
| [Tickets](#tickets)                   | N/A        | [Planned: TBD]( "BADGE_LIGHTGREY") |
| [EnforceInvariants](#enforceinvariants) | v0.70.0  | [Enabled: 2017-07-07](https://xrpcharts.ripple.com/#/transactions/7EBA3852D111EA19D03469F6870FAAEBF84C64F1B9BAC13B041DDD26E28CA399 "BADGE_GREEN") |
| [fix1373](#fix1373)                   | v0.70.0    | [Enabled: 2017-07-07](https://xrpcharts.ripple.com/#/transactions/7EBA3852D111EA19D03469F6870FAAEBF84C64F1B9BAC13B041DDD26E28CA399 "BADGE_GREEN") |
| [fix1368](#fix1368)                   | v0.60.0    | [Enabled: 2017-03-31](https://xrpcharts.ripple.com/#/transactions/3D20DE5CD19D5966865A7D0405FAC7902A6F623659667D6CB872DF7A94B6EF3F "BADGE_GREEN") |
| [PayChan](#paychan)                   | v0.33.0    | [Enabled: 2017-03-31](https://xrpcharts.ripple.com/#/transactions/16135C0B4AB2419B89D4FB4569B8C37FF76B9EF9CE0DD99CCACB5734445AFD7E "BADGE_GREEN") |
| [Escrow](#escrow)                     | v0.60.0    | [Enabled: 2017-03-31](https://xrpcharts.ripple.com/#/transactions/C581E0A3F3832FFFEEB13C497658F475566BD7695B0BBA531A774E6739801515 "BADGE_GREEN") |
| [TickSize](#ticksize)                 | v0.50.0    | [Enabled: 2017-02-21](https://xrpcharts.ripple.com/#/transactions/A12430E470BE5C846759EAE3C442FF03374D5D73ECE5815CF4906894B769565E "BADGE_GREEN") |
| [SusPay](#suspay)                     | v0.31.0    | [Vetoed: Removed in v0.60.0](https://ripple.com/dev-blog/ticksize-amendment-open-voting/#upcoming-features "BADGE_RED") |
| [CryptoConditions](#cryptoconditions) | v0.50.0    | [Enabled: 2017-01-03](https://xrpcharts.ripple.com/#/transactions/8EB00131E1C3DB35EDFF45C155D941E18C3E86BC1934FF987D2DA204F4065F15 "BADGE_GREEN") |
| [Flow](#flow)                         | v0.33.0    | [Enabled: 2016-10-21](https://xrpcharts.ripple.com/#/transactions/C06CE3CABA3907389E4DD296C5F31C73B1548CC20BD7B83416C78CD7D4CD38FC "BADGE_GREEN") |
| [FlowV2](#flowv2)                     | v0.32.1    | [Vetoed: Removed in v0.33.0](https://ripple.com/dev-blog/flowv2-amendment-vetoed/ "BADGE_RED") |
| [TrustSetAuth](#trustsetauth)         | v0.30.0    | [Enabled: 2016-07-19](https://xrpcharts.ripple.com/#/transactions/0E589DE43C38AED63B64FF3DA87D349A038F1821212D370E403EB304C76D70DF "BADGE_GREEN") |
| [MultiSign](#multisign)               | v0.31.0    | [Enabled: 2016-06-27](https://xrpcharts.ripple.com/#/transactions/168F8B15F643395E59B9977FC99D6310E8708111C85659A9BAF8B9222EEAC5A7 "BADGE_GREEN") |
| [FeeEscalation](#feeescalation)       | v0.31.0    | [Enabled: 2016-05-19](https://xrpcharts.ripple.com/#/transactions/5B1F1E8E791A9C243DD728680F108FEF1F28F21BA3B202B8F66E7833CA71D3C3 "BADGE_GREEN") |

**Note:** In many cases, an incomplete version of the code for an amendment is present in previous versions of the software. The "Introduced" version in the table above is the first stable version.

## CryptoConditions

| Amendment ID                                                     | Status  |
|:-----------------------------------------------------------------|:--------|
| 1562511F573A19AE9BD103B5D6B9E01B3B46805AEC5D3C4805C902B514399146 | Enabled |

Although this amendment is enabled, it has no effect unless the [SusPay](#suspay) amendment is also enabled. Ripple does not expect SusPay to become enabled. Instead, Ripple plans to incorporate crypto-conditions in the [Escrow](#escrow) amendment.


## EnforceInvariants

| Amendment ID                                                     | Status  |
|:-----------------------------------------------------------------|:--------|
| DC9CA96AEA1DCF83E527D1AFC916EFAF5D27388ECA4060A88817C1238CAEE0BF | In voting; expected 2017-06-29 |

Adds sanity checks to transaction processing to ensure that certain conditions are always met. This provides an extra, independent layer of protection against bugs in transaction processing that could otherwise cause exploits and vulnerabilities in the Ripple Consensus Ledger. Ripple expects to add more invariant checks in future versions of `rippled` without additional amendments.

Introduces two new transaction error codes, `tecINVARIANT_FAILED` and `tefINVARIANT_FAILED`. Changes transaction processing to add the new checks.

Examples of invariant checks:

- The total amount of XRP destroyed by a transaction must match the [transaction cost](concept-transaction-cost.html) exactly.
- XRP cannot be created.
- [`AccountRoot` objects in the ledger](reference-ledger-format.html#accountroot) cannot be deleted. (See also: [Permanence of Accounts](concept-accounts.html#permanence-of-accounts).)
- [An object in the ledger](reference-ledger-format.html#ledger-node-types) cannot change its type. (The `LedgerEntryType` field is immutable.)
- There cannot be a trust line for XRP.


## Escrow

| Amendment ID                                                     | Status  |
|:-----------------------------------------------------------------|:--------|
| 07D43DCE529B15A10827E5E04943B496762F9A88E3268269D69C44BE49E21104 | Enabled |

Replaces the [SusPay](#suspay) and [CryptoConditions](#cryptoconditions) amendments.

Provides "suspended payments" for XRP for escrow within the Ripple Consensus Ledger, including support for [Interledger Protocol Crypto-Conditions](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02). Creates a new ledger node type for suspended payments and new transaction types to create, execute, and cancel suspended payments.



## FeeEscalation

| Amendment ID                                                     | Status  |
|:-----------------------------------------------------------------|:--------|
| 42426C4D4F1009EE67080A9B7965B44656D7714D104A72F9B4369F97ABF044EE | Enabled |

Changes the way the [transaction cost](concept-transaction-cost.html) applies to proposed transactions. Modifies the consensus process to prioritize transactions that pay a higher transaction cost. <!-- STYLE_OVERRIDE: prioritize -->

This amendment introduces a fixed-size transaction queue for transactions that were not able to be included in the previous consensus round. If the `rippled` servers in the consensus network are under heavy load, they queue the transactions with the lowest transaction cost for later ledgers. Each consensus round prioritizes transactions from the queue with the largest transaction cost (`Fee` value), and includes as many transactions as the consensus network can process. If the transaction queue is full, transactions drop from the queue entirely, starting with the ones that have the lowest transaction cost.

While the consensus network is under heavy load, legitimate users can pay a higher transaction cost to make sure their transactions get processed. The situation persists until the entire backlog of cheap transactions is processed or discarded.

A transaction remains in the queue until one of the following happens:

* It gets applied to a validated ledger (regardless of success or failure)
* It becomes invalid (for example, the [`LastLedgerSequence`](reference-transaction-format.html#lastledgersequence) causes it to expire)
* It gets dropped because there are too many transactions in the queue with a higher transaction cost.

## fix1368

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| E2E6F2866106419B88C50045ACE96368558C345566AC8F2BDF5A5B5587F0E6FA | Enabled   |

Fixes a minor bug in transaction processing that causes some payments to fail when they should be valid. Specifically, during payment processing, some payment steps that are expected to produce a certain amount of currency may produce a microscopically different amount, due to a loss of precision related to floating-point number representation. When this occurs, those payments fail because they cannot deliver the exact amount intended. The fix1368 amendment corrects transaction processing so payments can no longer fail in this manner.

## fix1373

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 42EEA5E28A97824821D4EF97081FE36A54E9593C6E4F20CBAE098C69D2E072DC | In voting; expected 2017-06-29 |

Fixes a minor bug in transaction processing that causes failures when trying to prepare certain [payment paths](concept-paths.html) for processing. As a result, payments could not use certain paths that should have been valid but were invalidly prepared. Without this amendment, those payments are forced to use less-preferable paths or may even fail.

The fix1373 amendment corrects the issue so that the paths are properly prepared and payments can use them. It also disables some inappropriate paths that are currently allowed, including paths whose [steps](concept-paths.html#path-specifications) include conflicting fields and paths that loop through the same object more than once.


## Flow

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 740352F2412A9909880C23A559FCECEDA3BE2126FED62FC7660D628A06927F11 | Enabled |

Replaces the payment processing engine with a more robust and efficient rewrite called the Flow engine. The new version of the payment processing engine is intended to follow the same rules as the old one, but occasionally produces different results due to floating point rounding. This Amendment supersedes the [FlowV2](https://ripple.com/dev-blog/flowv2-amendment-vetoed/) amendment.

The Flow Engine also makes it easier to improve and expand the payment engine with further Amendments.


## FlowCross

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 3012E8230864E95A58C60FD61430D7E1B4D3353195F2981DC12B0C7C0950FFAC | Released but not enabled |

Streamlines the offer crossing logic in the RCL's decentralized exchange. Uses the updated code from the [Flow](#flow) amendment to power offer crossing, so [OfferCreate transactions][] and [Payment transactions][] share more code. This has subtle differences in how offers are processed:

- Rounding is slightly different in some cases.
- Due to differences in rounding, some combinations of offers may be ranked higher or lower than by the old logic, and taken preferentially.
- The new logic may delete more or fewer offers than the old logic. (This includes cases caused by differences in rounding and offers that were incorrectly removed as unfunded by the old logic.)


## FlowV2

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 5CC22CFF2864B020BD79E0E1F048F63EF3594F95E650E43B3F837EF1DF5F4B26 | Withdrawn |

This is a previous version of the [Flow](#flow) amendment. It was [rejected due to a bug](https://ripple.com/dev-blog/flowv2-amendment-vetoed/) and removed in version 0.33.0.


## MultiSign

| Amendment ID                                                     | Status  |
|:-----------------------------------------------------------------|:--------|
| 4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373 | Enabled |

Introduces [multi-signing](reference-transaction-format.html#multi-signing) as a way to authorize transactions. Creates the [`SignerList` ledger node type](reference-ledger-format.html#signerlist) and the [`SignerListSet` transaction type](reference-transaction-format.html#signerlistset). Adds the optional `Signers` field to all transaction types. Modifies some transaction result codes.

This amendment allows addresses to have a list of signers who can authorize transactions from that address in a multi-signature. The list has a quorum and 1 to 8 weighted signers. This allows various configurations, such as "any 3-of-5" or "signature from A plus any other two signatures."

Signers can be funded or unfunded addresses. Funded addresses in a signer list can sign using a regular key (if defined) or master key (unless disabled). Unfunded addresses can sign with a master key. Multi-signed transactions have the same permissions as transactions signed with a regular key.

An address with a SignerList can disable the master key even if a regular key is not defined. An address with a SignerList can also remove a regular key even if the master key is disabled. The `tecMASTER_DISABLED` transaction result code is renamed `tecNO_ALTERNATIVE_KEY`. The `tecNO_REGULAR_KEY` transaction result is retired and replaced with `tecNO_ALTERNATIVE_KEY`. Additionally, this amendment adds the following new [transaction result codes](reference-transaction-format.html#result-categories):

* `temBAD_SIGNER`
* `temBAD_QUORUM`
* `temBAD_WEIGHT`
* `tefBAD_SIGNATURE`
* `tefBAD_QUORUM`
* `tefNOT_MULTI_SIGNING`
* `tefBAD_AUTH_MASTER`


## OwnerPaysFee

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 9178256A980A86CF3D70D0260A7DA6402AAFE43632FDBCB88037978404188871 | Released but not enabled |

Fixes an inconsistency in the way [transfer fees](concept-transfer-fees.html) are calculated between [OfferCreate](reference-transaction-format.html#offercreate) and [Payment](reference-transaction-format.html#payment) transaction types. Without this amendment, the holder of the issuances pays the transfer fee if an offer is executed in offer placement, but the initial sender of a transaction pays the transfer fees for offers that are executed as part of payment processing. With this amendment, the holder of the issuances always pays the transfer fee, regardless of whether the offer is executed as part of a Payment or an OfferCreate transaction. Offer processing outside of payments is unaffected.

This Amendment requires the [Flow Amendment](#flow) to be enabled.


## PayChan

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 08DE7D96082187F6E6578530258C77FAABABE4C20474BDB82F04B021F1A68647 | Enabled   |

Creates "Payment Channels" for XRP. Payment channels are a tool for facilitating repeated, unidirectional payments or temporary credit between two parties. Ripple expects this feature to be useful for the [Interledger Protocol](https://interledger.org/). One party creates a Payment Channel and sets aside some XRP in that channel for a predetermined expiration. Then, through off-ledger secure communications, the sender can send "Claim" messages to the receiver. The receiver can redeem the Claim messages before the expiration, or choose not to in case the payment is not needed. The receiver can verify Claims individually without actually distributing them to the network and waiting for the consensus process to redeem them, then redeem the batched content of many small Claims later, as long as it is within the expiration.

Creates three new transaction types:[PaymentChannelCreate][], [PaymentChannelClaim][], and [PaymentChannelFund][]. Creates a new ledger node type, [PayChannel](reference-ledger-format.html#paychannel). Defines an off-ledger data structure called a `Claim`, used in the ChannelClaim transaction. Creates new `rippled` API methods: [`channel_authorize`](reference-rippled.html#channel-authorize) (creates a signed Claim), [`channel_verify`](reference-rippled.html#channel-verify) (verifies a signed Claim), and [`account_channels`](reference-rippled.html#account-channels) (lists Channels associated with an account).

For more information, see the [Payment Channels Tutorial](tutorial-paychan.html).


## SHAMapV2

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| C6970A8B603D8778783B61C0D445C23D1633CCFAEF0D43E7DBCD1521D34BD7C3 | Released but not enabled |

Changes the hash tree structure that `rippled` uses to represent a ledger. The new structure is more compact and efficient than the previous version. This affects how ledger hashes are calculated, but has no other user-facing consequences.

When this amendment is activated, the Ripple Consensus Ledger will undergo a brief scheduled unavailability while the network calculates the changes to the hash tree structure.


## SusPay

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| DA1BD556B42D85EA9C84066D028D355B52416734D3283F85E216EA5DA6DB7E13 |Enabled on TestNet; not intended for production.  |

This amendment is currently enabled on the [Ripple Test Net](https://ripple.com/build/ripple-test-net/). In production, Ripple expects to enable similar functionality with the [Escrow](#escrow) amendment instead.


## TrustSetAuth ##

| Amendment ID                                                     | Status  |
|:-----------------------------------------------------------------|:--------|
| 6781F8368C4771B83E8B821D88F580202BCB4228075297B19E4FDC5233F1EFDC | Enabled |

Allows pre-authorization of accounting relationships (zero-balance trust lines) when using [Authorized Accounts](tutorial-gateway-guide.html#authorized-accounts).

With this amendment enabled, a `TrustSet` transaction with [`tfSetfAuth` enabled](reference-transaction-format.html#trustset-flags) can create a new [`RippleState` ledger node](reference-ledger-format.html#ripplestate) even if it keeps all the other values of the `RippleState` node in their default state. The new `RippleState` node has the [`lsfLowAuth` or `lsfHighAuth` flag](reference-ledger-format.html#ripplestate-flags) enabled, depending on whether the sender of the transaction is considered the low node or the high node. The sender of the transaction must have already enabled [`lsfRequireAuth`](reference-ledger-format.html#accountroot-flags) by sending an [AccountSet transaction](reference-transaction-format.html#accountset) with the [asfRequireAuth flag enabled](reference-transaction-format.html#accountset-flags).

## TickSize

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 532651B4FD58DF8922A49BA101AB3E996E5BFBF95A913B3E392504863E63B164 | Enabled   |

Changes the way [Offers](reference-transaction-format.html#lifecycle-of-an-offer) are ranked in order books, so that currency issuers can configure how many significant digits are taken into account when ranking Offers by exchange rate. With this amendment, the exchange rates of Offers are rounded to the configured number of significant digits, so that more Offers have the same exact exchange rate. The intent of this change is to require a meaningful improvement in price to outrank a previous Offer. If used by major issuers, this should reduce the incentive to spam the ledger with Offers that are only a tiny fraction of a percentage point better than existing offers. It may also increase the efficiency of order book storage in the ledger, because Offers can be grouped into fewer exchange rates.

Introduces a `TickSize` field to accounts, which can be set with the [AccountSet transaction type](reference-transaction-format.html#accountset). If a currency issuer sets the `TickSize` field, the Ripple Consensus Ledger truncates the exchange rate (ratio of funds in to funds out) of Offers to trade the issuer's currency, and adjusts the amounts of the Offer to match the truncated exchange rate. If only one currency in the trade has a `TickSize` set, that number of significant digits applies. When trading two currencies that have different `TickSize` values, whichever `TickSize` indicates the fewest significant digits applies. XRP does not have a `TickSize`.


## Tickets ##

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| C1B8D934087225F509BEB5A8EC24447854713EE447D277F69545ABFA0E0FD490 | In development |

Introduces Tickets as a way to reserve a transaction sequence number for later execution. Creates the `Ticket` ledger node type and the transaction types `TicketCreate` and `TicketCancel`.

**Caution:** This amendment is still in development.

{% include 'snippets/rippled_versions.md' %}
{% include 'snippets/tx-type-links.md' %}
