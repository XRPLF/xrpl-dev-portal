# Known Amendments
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/protocol/impl/Feature.cpp "Source")

The following is a comprehensive list of all known amendments and their status on the production XRP Ledger:

| Name                            | Introduced | Status                              |
|:--------------------------------|:-----------|:------------------------------------|
| [CryptoConditionsSuite][]       | TBD        | [In Development: TBD]( "BADGE_LIGHTGREY") |
| [OwnerPaysFee][]                | TBD        | [In Development: TBD]( "BADGE_LIGHTGREY") |
| [SHAMapV2][]                    | TBD        | [In Development: TBD]( "BADGE_LIGHTGREY") |
| [Tickets][]                     | TBD        | [In Development: TBD]( "BADGE_LIGHTGREY") |
| [DeletableAccounts][]           | v1.4.0     | [Planned: TBD]( "BADGE_LIGHTGREY") |
| [fixCheckThreading][]           | v1.4.0     | [Expected: 2020-01-18](https://xrpl.org/blog/2020/fixcheckthreading-fixpaychanrecipientownerdir-expected.html "BADGE_BLUE") |
| [fixPayChanRecipientOwnerDir][] | v1.4.0     | [Expected: 2020-01-18](https://xrpl.org/blog/2020/fixcheckthreading-fixpaychanrecipientownerdir-expected.html "BADGE_BLUE") |
| [Checks][]                      | v0.90.0    | [Planned: TBD]( "BADGE_LIGHTGREY") |
| [FlowCross][]                   | v0.70.0    | [Planned: TBD]( "BADGE_LIGHTGREY") |
| [fixMasterKeyAsRegularKey][]    | v1.3.1     | [Enabled: 2019-10-02](https://xrpcharts.ripple.com/#/transactions/61096F8B5AFDD8F5BAF7FC7221BA4D1849C4E21B1BA79733E44B12FC8DA6EA20 "BADGE_GREEN") |
| [MultiSignReserve][]            | v1.2.0     | [Enabled: 2019-04-17](https://xrpcharts.ripple.com/#/transactions/C421E1D08EFD78E6B8D06B085F52A34A681D0B51AE62A018527E1B8F54C108FB "BADGE_GREEN") |
| [fixTakerDryOfferRemoval][]     | v1.2.0     | [Enabled: 2019-04-02](https://xrpcharts.ripple.com/#/transactions/C42335E95F1BD2009A2C090EA57BD7FB026AD285B4B85BE15F669BA4F70D11AF "BADGE_GREEN") |
| [fix1578][]                     | v1.2.0     | [Enabled: 2019-03-23](https://xrpcharts.ripple.com/#/transactions/7A80C87F59BCE6973CBDCA91E4DBDB0FC5461D3599A8BC8EAD02FA590A50005D "BADGE_GREEN") |
| [DepositPreauth][]              | v1.1.0     | [Enabled: 2018-10-09](https://xrpcharts.ripple.com/#/transactions/AD27403CB840AE67CADDB084BC54249D7BD1B403885819B39CCF723DC671F927 "BADGE_GREEN") |
| [fix1515][]                     | v1.1.0     | [Enabled: 2018-10-09](https://xrpcharts.ripple.com/#/transactions/6DF60D9EC8AF3C39B173840F4D1C57F8A8AB51E7C6571483B4A5F1AA0A9AAEBF "BADGE_GREEN") |
| [fix1543][]                     | v1.0.0     | [Enabled: 2018-06-21](https://xrpcharts.ripple.com/#/transactions/EA6054C9D256657014052F1447216CEA75FFDB1C9342D45EB0F9E372C0F879E6 "BADGE_GREEN") |
| [fix1623][]                     | v1.0.0     | [Enabled: 2018-06-20](https://xrpcharts.ripple.com/#/transactions/4D218D86A2B33E29F17AA9C25D8DFFEE5D2559F75F7C0B1D016D3F2C2220D3EB "BADGE_GREEN") |
| [fix1571][]                     | v1.0.0     | [Enabled: 2018-06-19](https://xrpcharts.ripple.com/#/transactions/920AA493E57D991414B614FB3C1D1E2F863211B48129D09BC8CB74C9813C38FC "BADGE_GREEN") |
| [DepositAuth][]                 | v0.90.0    | [Enabled: 2018-04-06](https://xrpcharts.ripple.com/#/transactions/902C51270B918B40CD23A622E18D48B4ABB86F0FF4E84D72D9E1907BF3BD4B25 "BADGE_GREEN") |
| [fix1513][]                     | v0.90.0    | [Enabled: 2018-04-06](https://xrpcharts.ripple.com/#/transactions/57FE540B8B8E2F26CE8B53D1282FEC55E605257E29F5B9EB49E15EA3989FCF6B "BADGE_GREEN") |
| [fix1201][]                     | v0.80.0    | [Enabled: 2017-11-14](https://xrpcharts.ripple.com/#/transactions/B1157116DDDDA9D9B1C4A95C029AC335E05DB052CECCC5CA90118A4D46C77C5E "BADGE_GREEN") |
| [fix1512][]                     | v0.80.0    | [Enabled: 2017-11-14](https://xrpcharts.ripple.com/#/transactions/63F69F59BEFDC1D79DBF1E4060601E05960683AA784926FB74BC55074C4F6647 "BADGE_GREEN") |
| [fix1523][]                     | v0.80.0    | [Enabled: 2017-11-14](https://xrpcharts.ripple.com/#/transactions/97FD0E35654F4B6714010D3CBBAC4038F60D64AD0292693C28A1DF4B796D8469 "BADGE_GREEN") |
| [fix1528][]                     | v0.80.0    | [Enabled: 2017-11-14](https://xrpcharts.ripple.com/#/transactions/27AEE02DA4FE22B6BB479F850FBBC873FDC7A09A8594753A91B53098D726397E "BADGE_GREEN") |
| [SortedDirectories][]           | v0.80.0    | [Enabled: 2017-11-14](https://xrpcharts.ripple.com/#/transactions/6E2309C156EBF94D03B83D282A3914671BF9168FB26463CFECD068C63FFFAB29 "BADGE_GREEN") |
| [EnforceInvariants][]           | v0.70.0    | [Enabled: 2017-07-07](https://xrpcharts.ripple.com/#/transactions/17593B03F7D3283966F3C0ACAF4984F26E9D884C9A202097DAED0523908E76C6 "BADGE_GREEN") |
| [fix1373][]                     | v0.70.0    | [Enabled: 2017-07-07](https://xrpcharts.ripple.com/#/transactions/7EBA3852D111EA19D03469F6870FAAEBF84C64F1B9BAC13B041DDD26E28CA399 "BADGE_GREEN") |
| [Escrow][]                      | v0.60.0    | [Enabled: 2017-03-31](https://xrpcharts.ripple.com/#/transactions/C581E0A3F3832FFFEEB13C497658F475566BD7695B0BBA531A774E6739801515 "BADGE_GREEN") |
| [fix1368][]                     | v0.60.0    | [Enabled: 2017-03-31](https://xrpcharts.ripple.com/#/transactions/3D20DE5CD19D5966865A7D0405FAC7902A6F623659667D6CB872DF7A94B6EF3F "BADGE_GREEN") |
| [PayChan][]                     | v0.33.0    | [Enabled: 2017-03-31](https://xrpcharts.ripple.com/#/transactions/16135C0B4AB2419B89D4FB4569B8C37FF76B9EF9CE0DD99CCACB5734445AFD7E "BADGE_GREEN") |
| [TickSize][]                    | v0.50.0    | [Enabled: 2017-02-21](https://xrpcharts.ripple.com/#/transactions/A12430E470BE5C846759EAE3C442FF03374D5D73ECE5815CF4906894B769565E "BADGE_GREEN") |
| [CryptoConditions][]            | v0.50.0    | [Enabled: 2017-01-03](https://xrpcharts.ripple.com/#/transactions/8EB00131E1C3DB35EDFF45C155D941E18C3E86BC1934FF987D2DA204F4065F15 "BADGE_GREEN") |
| [Flow][]                        | v0.33.0    | [Enabled: 2016-10-21](https://xrpcharts.ripple.com/#/transactions/C06CE3CABA3907389E4DD296C5F31C73B1548CC20BD7B83416C78CD7D4CD38FC "BADGE_GREEN") |
| [TrustSetAuth][]                | v0.30.0    | [Enabled: 2016-07-19](https://xrpcharts.ripple.com/#/transactions/0E589DE43C38AED63B64FF3DA87D349A038F1821212D370E403EB304C76D70DF "BADGE_GREEN") |
| [MultiSign][]                   | v0.31.0    | [Enabled: 2016-06-27](https://xrpcharts.ripple.com/#/transactions/168F8B15F643395E59B9977FC99D6310E8708111C85659A9BAF8B9222EEAC5A7 "BADGE_GREEN") |
| [FeeEscalation][]               | v0.31.0    | [Enabled: 2016-05-19](https://xrpcharts.ripple.com/#/transactions/5B1F1E8E791A9C243DD728680F108FEF1F28F21BA3B202B8F66E7833CA71D3C3 "BADGE_GREEN") |
| [FlowV2][]                      | v0.32.1    | [Vetoed: Removed in v0.33.0](https://xrpl.org/blog/2016/flowv2-vetoed.html "BADGE_RED") |
| [SusPay][]                      | v0.31.0    | [Vetoed: Removed in v0.60.0](https://xrpl.org/blog/2017/ticksize-voting.html#upcoming-features "BADGE_RED") |

**Note:** In many cases, an incomplete version of the code for an amendment is present in previous versions of the software. The "Introduced" version in the table above is the first stable version. The value "TBD" indicates that the amendment is not yet considered stable.

## Checks
[Checks]: #checks

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 157D2D480E006395B76F948E3E07A45A05FE10230D88A7993C71F97AE4B1F2D1 | Planned   |

Introduces "Checks" to the XRP Ledger. Checks work similarly to personal paper checks. The sender signs a transaction to create a Check for a specific maximum amount and destination. Later, the destination can cash the Check to receive up to the specified amount. The actual movement of money only occurs when the Check is cashed, so cashing the Check may fail depending on the sender's current balance and the available liquidity. If cashing the Check fails, the Check object remains in the ledger so it may be successfully cashed later.

The sender or the receiver can cancel a Check at any time before it is cashed. A Check can also have an expiration time, after which it cannot be cashed, and anyone can cancel it.

Introduces three new transaction types: CheckCreate, CheckCancel, and CheckCash, and a new ledger object type, Check. Adds a new transaction result code, `tecEXPIRED`, which occurs when trying to create a Check whose expiration time is in the past.

This amendment also changes the OfferCreate transaction to return `tecEXPIRED` when trying to create an Offer whose expiration time is in the past. Without this amendment, an OfferCreate whose expiration time is in the past returns `tesSUCCESS` but does not create or execute an Offer.


## CryptoConditions
[CryptoConditions]: #cryptoconditions

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 1562511F573A19AE9BD103B5D6B9E01B3B46805AEC5D3C4805C902B514399146 | Enabled   |

Although this amendment is enabled, it has no effect unless the [SusPay](#suspay) amendment is also enabled. Ripple does not expect SusPay to become enabled. Instead, Ripple plans to incorporate crypto-conditions in the [Escrow](#escrow) amendment.


## CryptoConditionsSuite
[CryptoConditionsSuite]: #cryptoconditionssuite

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 86E83A7D2ECE3AD5FA87AB2195AE015C950469ABF0B72EAACED318F74886AE90 | In Development |

Implements several types of crypto-conditions from the official [crypto-conditions specification](https://tools.ietf.org/html/draft-thomas-crypto-conditions-03) for use in [EscrowCreate][] and [EscrowFinish][] transactions. Without this amendment, only the PREIMAGE-SHA-256 type is supported.

**Caution:** This amendment is still [in development](https://github.com/ripple/rippled/pull/2170). The version from `rippled` v0.60.0 to present does not implement the full functionality.


## DeletableAccounts
[DeletableAccounts]: #deletableaccounts

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 30CD365592B8EE40489BA01AE2F7555CAC9C983145871DC82A42A31CF5BAE7D9 | Planned   |

Makes it possible to delete [accounts](accounts.html).

Without this amendment, new accounts always start with their `Sequence` numbers at 1, and there is no way to remove accounts from the state data of the ledger.

With this amendment, new accounts start with their `Sequence` numbers equal to the `Sequence` number matching the [index of the ledger][Ledger Index] in which the account is created. This change protects accounts that are deleted and later re-created from having their old transactions executed again. Adds a new `AccountDelete` transaction type, which deletes an account and certain objects that the account owns in the ledger. Certain types of objects cannot be deleted this way, so an account that is linked to any such objects cannot be deleted. Additionally, an account cannot be deleted if the current ledger index minus 256 is less than the account's current `Sequence` number. See [XRP Community Standards Draft 7](https://github.com/xrp-community/standards-drafts/issues/8) for a detailed discussion of this amendment.


## DepositAuth
[DepositAuth]: #depositauth

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| F64E1EABBE79D55B3BB82020516CEC2C582A98A6BFE20FBE9BB6A0D233418064 | Enabled   |

Adds a new account flag, `DepositAuth`, which lets an account strictly reject any incoming money from transactions sent by other accounts. Businesses can use this flag to comply with strict regulations that require due diligence before receiving money from any source.

When an account enables this flag, Payment transactions fail if the account is the destination, regardless of whether the Payment would have delivered XRP or an issued currency. EscrowFinish and PaymentChannelClaim transactions fail if the account is the destination unless the destination account itself sends those transactions. If the [Checks][] amendment is enabled, the account can receive XRP or issued currencies by sending CheckCash transactions.

As an exception, accounts with `DepositAuth` enabled can receive Payment transactions for small amounts of XRP (equal or less than the minimum [account reserve](reserves.html)) if their current XRP balance is below the account reserve.

Also fixes a bug in the EscrowCreate and PaymentChannelCreate transactions where they mistakenly enforced the DisallowXRP flag, which is meant to be a non-binding advisory flag. (By not enforcing DisallowXRP in the ledger itself an account can still receive the necessary XRP to meet its [account reserve](reserves.html) and pay [transaction costs](transaction-cost.html).)


## DepositPreauth
[DepositPreauth]: #depositpreauth

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 3CBC5C4E630A1B82380295CDA84B32B49DD066602E74E39B85EF64137FA65194 | Enabled   |

Provides users of [deposit authorization](depositauth.html) with a way to preauthorize specific senders so those senders are allowed to send payments directly.

Adds a new transaction type, DepositPreauth for adding or removing preauthorization, and a DepositPreauth ledger object type for tracking preauthorizations from one account to another. Adds a JSON-RPC command, `deposit_authorized`, to query whether an account is authorized to send payments directly to another.

Also changes the behavior of cross-currency Payments from an account to itself when that account requires deposit authorization. Without this amendment, those payments always fail with the code tecNO_PERMISSION. With this amendment, those payments succeed as they would with Deposit Authorization disabled.


## EnforceInvariants
[EnforceInvariants]: #enforceinvariants

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| DC9CA96AEA1DCF83E527D1AFC916EFAF5D27388ECA4060A88817C1238CAEE0BF | Enabled   |

Adds sanity checks to transaction processing to ensure that certain conditions are always met. This provides an extra, independent layer of protection against bugs in transaction processing that could otherwise cause exploits and vulnerabilities in the XRP Ledger. Ripple expects to add more invariant checks in future versions of `rippled` without additional amendments.

Introduces two new transaction error codes, `tecINVARIANT_FAILED` and `tefINVARIANT_FAILED`. Changes transaction processing to add the new checks.

Examples of invariant checks:

- The total amount of XRP destroyed by a transaction must match the [transaction cost](transaction-cost.html) exactly.
- XRP cannot be created.
- [`AccountRoot` objects in the ledger](accountroot.html) cannot be deleted unless [DeletableAccounts](#deletableaccounts) is enabled. (See also: [Deletion of Accounts](accounts.html#deletion-of-accounts).)
- [An object in the ledger](ledger-object-types.html) cannot change its type. (The `LedgerEntryType` field is immutable.)
- There cannot be a trust line for XRP.


## Escrow
[Escrow]: #escrow

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 07D43DCE529B15A10827E5E04943B496762F9A88E3268269D69C44BE49E21104 | Enabled   |

Replaces the [SusPay](#suspay) and [CryptoConditions](#cryptoconditions) amendments.

Provides "suspended payments" for XRP for escrow within the XRP Ledger, including support for [Interledger Protocol Crypto-Conditions](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02). Creates a new ledger object type for suspended payments and new transaction types to create, execute, and cancel suspended payments.


## FeeEscalation
[FeeEscalation]: #feeescalation

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 42426C4D4F1009EE67080A9B7965B44656D7714D104A72F9B4369F97ABF044EE | Enabled   |

Changes the way the [transaction cost](transaction-cost.html) applies to proposed transactions. Modifies the consensus process to prioritize transactions that pay a higher transaction cost. <!-- STYLE_OVERRIDE: prioritize -->

This amendment introduces a fixed-size transaction queue for transactions that were not able to be included in the previous consensus round. If the `rippled` servers in the consensus network are under heavy load, they queue the transactions with the lowest transaction cost for later ledgers. Each consensus round prioritizes transactions from the queue with the largest transaction cost (`Fee` value), and includes as many transactions as the consensus network can process. If the transaction queue is full, transactions drop from the queue entirely, starting with the ones that have the lowest transaction cost.

While the consensus network is under heavy load, legitimate users can pay a higher transaction cost to make sure their transactions get processed. The situation persists until the entire backlog of cheap transactions is processed or discarded.

A transaction remains in the queue until one of the following happens:

* It gets applied to a validated ledger (regardless of success or failure)
* It becomes invalid (for example, the [`LastLedgerSequence`](transaction-common-fields.html) causes it to expire)
* It gets dropped because there are too many transactions in the queue with a higher transaction cost.


## fix1201
[fix1201]: #fix1201

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| B4D44CC3111ADD964E846FC57760C8B50FFCD5A82C86A72756F6B058DDDF96AD | Enabled   |

Correctly implements a limit on [transfer fees](transfer-fees.html) to a 100% fee, represented by a maximum `TransferRate` value of `2000000000`. (A 100% fee in this case means you must send 2 units of the issued currency for every 1 unit you want to deliver.) Without the amendment, the effective limit is a `TransferRate` value of 2<sup>32</sup>-1, for approximately a 329% fee.

With this amendment enabled, an [AccountSet][] transaction that attempts to set `TransferRate` higher than `2000000000` fails with the result code `temBAD_TRANSFER_RATE`. Any existing `TransferRate` which was set to a higher value under the previous rules continues to apply at the higher rate.


## fix1368
[fix1368]: #fix1368

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| E2E6F2866106419B88C50045ACE96368558C345566AC8F2BDF5A5B5587F0E6FA | Enabled   |

Fixes a minor bug in transaction processing that causes some payments to fail when they should be valid. Specifically, during payment processing, some payment steps that are expected to produce a certain amount of currency may produce a microscopically different amount, due to a loss of precision related to floating-point number representation. When this occurs, those payments fail because they cannot deliver the exact amount intended. The fix1368 amendment corrects transaction processing so payments can no longer fail in this manner.


## fix1373
[fix1373]: #fix1373

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 42EEA5E28A97824821D4EF97081FE36A54E9593C6E4F20CBAE098C69D2E072DC | Enabled   |

Fixes a minor bug in transaction processing that causes failures when trying to prepare certain [payment paths](paths.html) for processing. As a result, payments could not use certain paths that should have been valid but were invalidly prepared. Without this amendment, those payments are forced to use less-preferable paths or may even fail.

The fix1373 amendment corrects the issue so that the paths are properly prepared and payments can use them. It also disables some inappropriate paths that are currently allowed, including paths whose [steps](paths.html#path-specifications) include conflicting fields and paths that loop through the same object more than once.


## fix1512
[fix1512]: #fix1512

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 6C92211186613F9647A89DFFBAB8F94C99D4C7E956D495270789128569177DA1 | Enabled   |

Fixes a bug in transaction processing that causes some invalid [PaymentChannelClaim][] transactions to fail with the wrong error code. Without this amendment, the transactions have a `tec`-class result code despite not being included in a ledger and therefore not paying the [transaction cost](transaction-cost.html).

With this amendment, the transactions fail with a more appropriate result code, `temBAD_AMOUNT`, instead.


## fix1513
[fix1513]: #fix1513

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 67A34F2CF55BFC0F93AACD5B281413176FEE195269FA6D95219A2DF738671172 | Enabled   |

Fixes a bug that resulted in transaction processing not using new `STAmountCalcSwitchovers` code when the `FeeEscalation` amendment is enabled.

With this amendment, the new `STAmountCalcSwitchovers` code applies, which may cause slight changes to transaction processing due to calculation differences. Amounts may be rounded differently and offers may be executed in a different order as a result.


## fix1515
[fix1515]: #fix1515

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 5D08145F0A4983F23AFFFF514E83FAD355C5ABFBB6CAB76FB5BC8519FF5F33BE | Enabled   |

Changes how Payment transactions consume offers to remove a minor difference in how payment processing and offer processing consume liquidity. (Also affects how OfferCreate transactions are processed if [FlowCross][] is enabled.)

Without the amendment, payment processing gives up on using particular order books if the transaction would consume over 2000 offers at the same exchange rate. In this case, the payment does not use the liquidity from those offers, and does not consider that order book's remaining liquidity when attempting to complete the payment.

With this amendment, if any transaction processes over 1000 offers at the same exchange rate, the transaction consumes the liquidity from the first 1000 offers, then does not consider that order book's remaining liquidity when attempting to complete the payment.

In both cases, transaction processing can still complete by using liquidity from other paths or exchange rates.


## fix1523
[fix1523]: #fix1523

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| B9E739B8296B4A1BB29BE990B17D66E21B62A300A909F25AC55C22D6C72E1F9D | Enabled   |

Adds tracking by destination account to [escrows](escrow.html). Without this amendment, pending escrows are only tracked by sender. This amendment makes it possible to look up pending escrows by the destination address using the [account_objects method][], excluding any pending escrows that were created before this amendment became enabled. This amendment also makes [EscrowCreate transactions][] appear in the destination's transaction history, as viewed with the [account_tx method][].

With this amendment, new escrows are added to the [owner directories](directorynode.html) of both the sender and receiver. This amendment also adds a new `DestinationNode` field to [Escrow ledger objects](escrow-object.html), indicating which page of the destination's owner directory contains the escrow.


## fix1528
[fix1528]: #fix1528

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 1D3463A5891F9E589C5AE839FFAC4A917CE96197098A1EF22304E1BC5B98A454 | Enabled   |

Fixes a bug where validators could build consensus ledgers with different timestamps, potentially delaying the process of declaring validated ledgers. The circumstances for this to occur require precise timing, so validators are unlikely to encounter this bug outside of controlled test conditions.

This amendment changes how validators negotiate the close time of the consensus ledger so that they cannot reach a consensus on ledger contents but build ledger versions with different timestamps.


## fix1543
[fix1543]: #fix1543

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| CA7C02118BA27599528543DFE77BA6838D1B0F43B447D4D7F53523CE6A0E9AC2 | Enabled   |

Enforces reserved flag ranges on some transaction types that did not correctly enforce them already. Transactions of the affected types are now considered invalid if they enable undefined or unknown flags, or flags from the reserved range. (Transactions unaffected by this change already correctly enforce the same rules.)

Without this amendment, transactions of certain types are considered valid even when they have undefined or reserved flags enabled.

The affected transaction types are:

- Escrow transactions: [EscrowCancel][], [EscrowCreate][], and [EscrowFinish][]
- Payment Channel transactions: [PaymentChannelClaim][], [PaymentChannelCreate][], and [PaymentChannelFund][]


## fix1571
[fix1571]: #fix1571

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 7117E2EC2DBF119CA55181D69819F1999ECEE1A0225A7FD2B9ED47940968479C | Enabled   |

Changes Escrow to fix the following issues:

- Changes the [EscrowCreate transaction][] to require the `Condition` or `FinishAfter` field (or both). Escrows with neither `Condition` nor `FinishAfter` that were created before this amendment can be finished by anyone at any time before their `CancelAfter` time.
- Fixes a flaw that incorrectly prevents time-based Escrows from being finished in some circumstances.


## fix1578
[fix1578]: #fix1578

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| FBD513F1B893AC765B78F250E6FFA6A11B573209D1842ADC787C850696741288 | Enabled   |

Changes the result codes returned by two transaction types:

- Changes the [OfferCreate transaction][] to return a new result code, `tecKILLED`, if the offer used the `tfFillOrKill` flag and was killed. Without this amendment, the offer is killed but the transaction result is `tesSUCCESS`.
- Changes the [TrustSet transaction][] to fail with `tecNO_PERMISSION` if it tries to enable the [NoRipple flag](rippling.html#the-noripple-flag) but cannot because the trust line has a negative balance. Without this amendment, the transaction does not enable the NoRipple flag, but the transaction result is `tesSUCCESS` nonetheless.


## fix1623
[fix1623]: #fix1623

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 58BE9B5968C4DA7C59BA900961828B113E5490699B21877DEF9A31E9D0FE5D5F | Enabled   |

Adds delivered amount to metadata for CheckCash transactions cashed for a flexible amount. (Has no effect unless the [Checks](#checks) amendment is enabled.)

With this amendment enabled, transaction processing adds a `DeliveredAmount` field to the metadata of [CheckCash transactions][] for a variable amount (using the `DeliverMin` field). This change is written to the ledger data, resulting in a different ledger hash than would result from processing the transaction without this amendment. It does not affect the actual amounts delivered. Additionally, with this amendment enabled, the [tx method][] and [account_tx method][] return a [`delivered_amount` field](transaction-metadata.html#delivered_amount) for CheckCash transactions. (The `delivered_amount` field is calculated when you look up a transaction, and is not part of the data that is written to the ledger.)

The fix1623 amendment has no effect on [CheckCash transactions][] for a fixed amount (using the `Amount` field) or any other transaction types.

**Caution:** In `rippled` 1.0.0, if the Checks amendment is enabled before the fix1623 amendment, the `delivered_amount` may display as "0" for variable-amount CheckCash transactions from before this amendment was enabled, even if the transaction delivered a nonzero amount. Ripple plans to enable fix1623 at the same time as the [Checks][] amendment on the production network, but this situation may be possible on [parallel networks](parallel-networks.html).


## fixCheckThreading
[fixCheckThreading]: #fixcheckthreading

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 8F81B066ED20DAECA20DF57187767685EEF3980B228E0667A650BAF24426D3B4 | Expected  |

Changes the way Checks transactions affect account metadata, so that Checks are properly added to the [account](accounts.html) history of the receiving account. (Specifically, they update the `PreviousTxnID` and `PreviousTxnLedgerSeq` fields of the receiving account's [AccountRoot object](accountroot.html), which can be used to trace the "thread" of transactions that affected the account and the objects it owns.)

Without this amendment, Checks transactions ([CheckCreate][], [CheckCash][], and [CheckCancel][]) only update the account history of the sender. With this amendment, those transactions affect both the sending and receiving accounts. This amendment has no effect unless the [Checks amendment](#checks) is also enabled.


## fixMasterKeyAsRegularKey
[fixMasterKeyAsRegularKey]: #fixmasterkeyasregularkey

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| C4483A1896170C66C098DEA5B0E024309C60DC960DE5F01CD7AF986AA3D9AD37 | Enabled   |

Fixes a bug where accounts can set their regular key pair to match their master key pair, but cannot send transactions signed by the key if the master key is disabled.

Without this fix, a user can unintentionally "black hole" their account by setting the regular key to match the master key, then disabling the master key. The network rejects transactions signed with the both-master-and-regular key pair because the code interprets them as being signed with the disabled master key before it recognizes that they are signed by the currently-enabled regular key.

With this amendment enabled, a SetRegularKey transaction cannot set the regular key to match the master key; such a transaction results in the transaction code `temBAD_REGKEY`. Additionally, this amendment changes the signature verification code so that accounts which _already_ have their regular key set to match their master key can send transactions successfully using the key pair.


## fixPayChanRecipientOwnerDir
[fixPayChanRecipientOwnerDir]: #fixpaychanrecipientownerdir

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 621A0B264970359869E3C0363A899909AAB7A887C8B73519E4ECF952D33258A8 | Expected  |

Changes the [PaymentChannelCreate transaction][] type so that it adds new [payment channels](payment-channels.html) to the recipient's [owner directory](directorynode.html). Without this amendment, new payment channels are added only to the sender's owner directory; with this amendment enabled, newly-created payment channels are added to both owner directories. Existing payment channels are unchanged.

This change makes it easier to look up payment channels by their recipient and prevents accounts from being deleted if they are the recipient for open payment channels (except those channels created before this amendment).


## fixTakerDryOfferRemoval
[fixTakerDryOfferRemoval]: #fixtakerdryofferremoval

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 2CD5286D8D687E98B41102BDD797198E81EA41DF7BD104E6561FEB104EFF2561 | Enabled   |

Fixes a bug in [auto-bridging](autobridging.html) that can leave a dry offer in the XRP Ledger. A dry offer is an offer that, if crossed, cannot yield any funds.

Without this fix, the dry offer remains on the ledger and counts toward its owner's [reserve requirement](reserves.html#owner-reserves) without providing any benefit to the owner. Another offer crossing of the right type and quality can remove the dry offer. However, if the required offer crossing type and quality are rare, it may take a while for the dry offer to be removed.

With this amendment enabled, the XRP Ledger removes these dry offers when they're matched in auto-bridging.


## Flow
[Flow]: #flow

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 740352F2412A9909880C23A559FCECEDA3BE2126FED62FC7660D628A06927F11 | Enabled   |

Replaces the payment processing engine with a more robust and efficient rewrite called the Flow engine. The new version of the payment processing engine is intended to follow the same rules as the old one, but occasionally produces different results due to floating point rounding. This Amendment supersedes the [FlowV2](https://xrpl.org/blog/2016/flowv2-vetoed.html) amendment.

The Flow Engine also makes it easier to improve and expand the payment engine with further Amendments.


## FlowCross
[FlowCross]: #flowcross

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 3012E8230864E95A58C60FD61430D7E1B4D3353195F2981DC12B0C7C0950FFAC | Planned   |

Streamlines the offer crossing logic in the XRP Ledger's decentralized exchange. Uses the updated code from the [Flow](#flow) amendment to power offer crossing, so [OfferCreate transactions][] and [Payment transactions][] share more code. This has subtle differences in how offers are processed:

- Rounding is slightly different in some cases.
- Due to differences in rounding, some combinations of offers may be ranked higher or lower than by the old logic, and taken preferentially.
- The new logic may delete more or fewer offers than the old logic. (This includes cases caused by differences in rounding and offers that were incorrectly removed as unfunded by the old logic.)


## FlowV2
[FlowV2]: #flowv2

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 5CC22CFF2864B020BD79E0E1F048F63EF3594F95E650E43B3F837EF1DF5F4B26 | Vetoed    |

This is a previous version of the [Flow](#flow) amendment. It was [rejected due to a bug](https://xrpl.org/blog/2016/flowv2-vetoed.html) and removed in version 0.33.0.


## MultiSign
[MultiSign]: #multisign

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373 | Enabled   |

Introduces [multi-signing](multi-signing.html) as a way to authorize transactions. Creates the [`SignerList` ledger object type](signerlist.html) and the [`SignerListSet` transaction type](signerlistset.html). Adds the optional `Signers` field to all transaction types. Modifies some transaction result codes.

This amendment allows addresses to have a list of signers who can authorize transactions from that address in a multi-signature. The list has a quorum and 1 to 8 weighted signers. This allows various configurations, such as "any 3-of-5" or "signature from A plus any other two signatures."

Signers can be funded or unfunded addresses. Funded addresses in a signer list can sign using a regular key (if defined) or master key (unless disabled). Unfunded addresses can sign with a master key. Multi-signed transactions have the same permissions as transactions signed with a regular key.

An address with a SignerList can disable the master key even if a regular key is not defined. An address with a SignerList can also remove a regular key even if the master key is disabled. The `tecMASTER_DISABLED` transaction result code is renamed `tecNO_ALTERNATIVE_KEY`. The `tecNO_REGULAR_KEY` transaction result is retired and replaced with `tecNO_ALTERNATIVE_KEY`. Additionally, this amendment adds the following new [transaction result codes](transaction-results.html):

* `temBAD_SIGNER`
* `temBAD_QUORUM`
* `temBAD_WEIGHT`
* `tefBAD_SIGNATURE`
* `tefBAD_QUORUM`
* `tefNOT_MULTI_SIGNING`
* `tefBAD_AUTH_MASTER`


## MultiSignReserve
[MultiSignReserve]: #multisignreserve

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 586480873651E106F1D6339B0C4A8945BA705A777F3F4524626FF1FC07EFE41D | Enabled   |

Reduces the [owner reserve](reserves.html#owner-reserves) counted against your XRP Ledger account when it owns a [multi-signing](multi-signing.html) SignerList.

Without this amendment, the owner reserve for a SignerList ranges from 15 to 50 XRP, depending on the number of signers in the list.

With this amendment enabled, the owner reserve for a new SignerList is 5 XRP, regardless of the number of signers. The reserve requirement for previously-created SignerList objects remains unchanged. To reduce the reserve requirement of SignerList objects created before this amendment was enabled, use a [SignerListSet transaction](signerlistset.html) to replace the SignerList after this amendment has been enabled. (The replacement can be identical to the previous version.)


## OwnerPaysFee
[OwnerPaysFee]: #ownerpaysfee

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 9178256A980A86CF3D70D0260A7DA6402AAFE43632FDBCB88037978404188871 | In Development |

Fixes an inconsistency in the way [transfer fees](transfer-fees.html) are calculated between [OfferCreate](offercreate.html) and [Payment](payment.html) transaction types. Without this amendment, the holder of the issuances pays the transfer fee if an offer is executed in offer placement, but the initial sender of a transaction pays the transfer fees for offers that are executed as part of payment processing. With this amendment, the holder of the issuances always pays the transfer fee, regardless of whether the offer is executed as part of a Payment or an OfferCreate transaction. Offer processing outside of payments is unaffected.

This Amendment requires the [Flow Amendment](#flow) to be enabled.

**Note:** An incomplete version of this amendment was introduced in v0.33.0 and removed in v0.80.0. (It was never enabled.) Ripple plans to re-add the amendment when the code is stable enough.


## PayChan
[PayChan]: #paychan

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 08DE7D96082187F6E6578530258C77FAABABE4C20474BDB82F04B021F1A68647 | Enabled   |

Creates "Payment Channels" for XRP. Payment channels are a tool for facilitating repeated, unidirectional payments or temporary credit between two parties. Ripple expects this feature to be useful for the [Interledger Protocol](https://interledger.org/). One party creates a Payment Channel and sets aside some XRP in that channel for a predetermined expiration. Then, through off-ledger secure communications, the sender can send "Claim" messages to the receiver. The receiver can redeem the Claim messages before the expiration, or choose not to in case the payment is not needed. The receiver can verify Claims individually without actually distributing them to the network and waiting for the consensus process to redeem them, then redeem the batched content of many small Claims later, as long as it is within the expiration.

Creates three new transaction types: [PaymentChannelCreate][], [PaymentChannelClaim][], and [PaymentChannelFund][]. Creates a new ledger object type, [PayChannel](paychannel.html). Defines an off-ledger data structure called a `Claim`, used in the ChannelClaim transaction. Creates new `rippled` API methods: [`channel_authorize`](channel_authorize.html) (creates a signed Claim), [`channel_verify`](channel_verify.html) (verifies a signed Claim), and [`account_channels`](account_channels.html) (lists Channels associated with an account).

For more information, see the [Payment Channels Tutorial](use-payment-channels.html).


## SHAMapV2
[SHAMapV2]: #shamapv2

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| C6970A8B603D8778783B61C0D445C23D1633CCFAEF0D43E7DBCD1521D34BD7C3 | In Development |

Changes the hash tree structure that `rippled` uses to represent a ledger. The new structure is more compact and efficient than the previous version. This affects how ledger hashes are calculated, but has no other user-facing consequences.

When this amendment is activated, the XRP Ledger will undergo a brief scheduled unavailability while the network calculates the changes to the hash tree structure. <!-- STYLE_OVERRIDE: will -->


## SortedDirectories
[SortedDirectories]: #sorteddirectories

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| CC5ABAE4F3EC92E94A59B1908C2BE82D2228B6485C00AFF8F22DF930D89C194E | Enabled   |

Sorts the entries in [DirectoryNode ledger objects](directorynode.html) and fixes a bug that occasionally caused pages of owner directories not to be deleted when they should have been.

**Warning:** Older versions of `rippled` that do not know about this amendment may crash when they encounter a DirectoryNode sorted by the new rules. To avoid this problem, [upgrade](install-rippled.html) to `rippled` version 0.80.0 or later.


## SusPay
[SusPay]: #suspay

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| DA1BD556B42D85EA9C84066D028D355B52416734D3283F85E216EA5DA6DB7E13 | Vetoed    |

This amendment was replaced by the [Escrow](escrow-object.html) amendment.


## Tickets
[Tickets]: #tickets

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| C1B8D934087225F509BEB5A8EC24447854713EE447D277F69545ABFA0E0FD490 | In Development |

Introduces Tickets as a way to reserve a transaction sequence number for later execution. Creates the `Ticket` ledger object type and the transaction types `TicketCreate` and `TicketCancel`.

**Caution:** This amendment is still in development.


## TickSize
[TickSize]: #ticksize

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 532651B4FD58DF8922A49BA101AB3E996E5BFBF95A913B3E392504863E63B164 | Enabled   |

Changes the way [Offers](offers.html#lifecycle-of-an-offer) are ranked in order books, so that currency issuers can configure how many significant digits are taken into account when ranking Offers by exchange rate. With this amendment, the exchange rates of Offers are rounded to the configured number of significant digits, so that more Offers have the same exact exchange rate. The intent of this change is to require a meaningful improvement in price to outrank a previous Offer. If used by major issuers, this should reduce the incentive to spam the ledger with Offers that are only a tiny fraction of a percentage point better than existing offers. It may also increase the efficiency of order book storage in the ledger, because Offers can be grouped into fewer exchange rates.

Introduces a `TickSize` field to accounts, which can be set with the [AccountSet transaction type](accountset.html). If a currency issuer sets the `TickSize` field, the XRP Ledger truncates the exchange rate (ratio of funds in to funds out) of Offers to trade the issuer's currency, and adjusts the amounts of the Offer to match the truncated exchange rate. If only one currency in the trade has a `TickSize` set, that number of significant digits applies. When trading two currencies that have different `TickSize` values, whichever `TickSize` indicates the fewest significant digits applies. XRP does not have a `TickSize`.


## TrustSetAuth
[TrustSetAuth]: #trustsetauth

| Amendment ID                                                     | Status    |
|:-----------------------------------------------------------------|:----------|
| 6781F8368C4771B83E8B821D88F580202BCB4228075297B19E4FDC5233F1EFDC | Enabled   |

Allows pre-authorization of accounting relationships (zero-balance trust lines) when using [Authorized Trust Lines](authorized-trust-lines.html).

With this amendment enabled, a `TrustSet` transaction with [`tfSetfAuth` enabled](trustset.html#trustset-flags) can create a new [`RippleState` ledger object](ripplestate.html) even if it keeps all the other values of the `RippleState` node in their default state. The new `RippleState` node has the [`lsfLowAuth` or `lsfHighAuth` flag](ripplestate.html#ripplestate-flags) enabled, depending on whether the sender of the transaction is considered the low node or the high node. The sender of the transaction must have already enabled [`lsfRequireAuth`](accountroot.html#accountroot-flags) by sending an [AccountSet transaction](accountset.html) with the [asfRequireAuth flag enabled](accountset.html#accountset-flags).


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
