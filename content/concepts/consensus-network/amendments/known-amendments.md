---
html: known-amendments.html
parent: amendments.html
blurb: List of all known amendments to the XRP Ledger protocol and their status.
labels:
  - Blockchain
---
# Known Amendments
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/protocol/impl/Feature.cpp "Source")

The following is a comprehensive list of all known [amendments](amendments.html) and their status on the production XRP Ledger:

**Tip:** This list is updated manually. For a live view of amendment voting, see the [XRPScan Amendments Dashboard](https://xrpscan.com/amendments).

| Name                            | Introduced | Status                        |
|:--------------------------------|:-----------|:------------------------------|
| [fixTrustLinesToSelf][]         | TBD        | [In Development: TBD]( "BADGE_LIGHTGREY") |
| [OwnerPaysFee][]                | TBD        | [In Development: TBD]( "BADGE_LIGHTGREY") |
| [fixRemoveNFTokenAutoTrustLine][] | v1.9.4   | [Open for Voting: TBD](https://xrpl.org/blog/2022/rippled-1.9.4.html "BADGE_80d0e0") |
| [fixNFTokenNegOffer][]          | v1.9.2     | [Open for Voting: TBD](https://xrpl.org/blog/2022/rippled-1.9.2.html "BADGE_80d0e0") |
| [NonFungibleTokensV1_1][]       | v1.9.2     | [Open for Voting: TBD](https://xrpl.org/blog/2022/rippled-1.9.2.html "BADGE_80d0e0") |
| [ExpandedSignerList][]          | v1.9.1     | [Open for Voting: TBD](https://xrpl.org/blog/2022/rippled-1.9.1.html "BADGE_80d0e0") |
| [fixNFTokenDirV1][]             | v1.9.1     | [Open for Voting: TBD](https://xrpl.org/blog/2022/rippled-1.9.1.html "BADGE_80d0e0") |
| [NonFungibleTokensV1][]         | v1.9.0     | [Open for Voting: TBD](https://xrpl.org/blog/2022/rippled-1.9.0.html "BADGE_80d0e0") |
| [CheckCashMakesTrustLine][]     | v1.8.0     | [Open for Voting: TBD](https://xrpl.org/blog/2021/rippled-1.8.1.html "BADGE_80d0e0") |
| [NegativeUNL][]                 | v1.7.3     | [Enabled: 2021-11-21](https://livenet.xrpl.org/transactions/1500FADB73E7148191216C53040990E829C7110788B26E7F3246CB3660769EBA "BADGE_GREEN") |
| [fixRmSmallIncreasedQOffers][]  | v1.7.2     | [Enabled: 2021-11-18](https://livenet.xrpl.org/transactions/1F37BA0502576DD7B5464F47641FA95DEB55735EC2663269DFD47810505478E7 "BADGE_GREEN") |
| [TicketBatch][]                 | v1.7.0     | [Enabled: 2021-11-18](https://livenet.xrpl.org/transactions/111B32EDADDE916206E7315FBEE2DA1521B229F207F65DD314829F13C8D9CA36 "BADGE_GREEN") |
| [fixSTAmountCanonicalize][]     | v1.7.0     | [Enabled: 2021-11-11](https://livenet.xrpl.org/transactions/AFF17321A012C756B64FCC3BA0FDF79109F28E244D838A28D5AE8A0384C7C532 "BADGE_GREEN") |
| [FlowSortStrands][]             | v1.7.0     | [Enabled: 2021-11-11](https://livenet.xrpl.org/transactions/1C3D3BD2AFDAF326EBFEA54579A89B024856609DB4310F7140086AAB262D09A1 "BADGE_GREEN") |
| [fix1781][]                     | v1.6.0     | [Enabled: 2021-04-08](https://livenet.xrpl.org/transactions/DA59F10201D651B544F65896330AFACA8CA4198904265AD279D56781F655FAFB "BADGE_GREEN") |
| [fixAmendmentMajorityCalc][]    | v1.6.0     | [Enabled: 2021-04-08](https://livenet.xrpl.org/transactions/5B3ACE6CAC9C56D2008410F1B0881A0A4A8866FB99D2C2B2261C86C760DC95EF "BADGE_GREEN") |
| [HardenedValidations][]         | v1.6.0     | [Enabled: 2021-04-08](https://livenet.xrpl.org/transactions/3A45DCF055B68DCBBFE034240F9359FB22E8A64B1BF7113304535BF5BB8144BF "BADGE_GREEN") |
| [FlowCross][]                   | v0.70.0    | [Enabled: 2020-08-04](https://livenet.xrpl.org/transactions/44C4B040448D89B6C5A5DEC97C17FEDC2E590BA094BC7DB63B7FDC888B9ED78F "BADGE_GREEN") |
| [fixQualityUpperBound][]        | v1.5.0     | [Enabled: 2020-07-09](https://livenet.xrpl.org/transactions/5F8E9E9B175BB7B95F529BEFE3C84253E78DAF6076078EC450A480C861F6889E "BADGE_GREEN") |
| [RequireFullyCanonicalSig][]    | v1.5.0     | [Enabled: 2020-07-03](https://livenet.xrpl.org/transactions/94D8B158E948148B949CC3C35DD5DC4791D799E1FD5D3CE0E570160EDEF947D3 "BADGE_GREEN") |
| [Checks][]                      | v0.90.0    | [Enabled: 2020-06-18](https://livenet.xrpl.org/transactions/D88F2DCDFB10023F9F6CBA8DF34C18E321D655CAC8FDB962387A5DB1540242A6 "BADGE_GREEN") |
| [DeletableAccounts][]           | v1.4.0     | [Enabled: 2020-05-08](https://livenet.xrpl.org/transactions/47B90519D31E0CB376B5FEE5D9359FA65EEEB2289F1952F2A3EB71D623B945DE "BADGE_GREEN") |
| [fixCheckThreading][]           | v1.4.0     | [Enabled: 2020-05-01](https://livenet.xrpl.org/transactions/74AFEA8C17D25CA883D40F998757CA3B0DB1AC86794335BAA25FF20E00C2C30A "BADGE_GREEN") |
| [fixPayChanRecipientOwnerDir][] | v1.4.0     | [Enabled: 2020-05-01](https://livenet.xrpl.org/transactions/D2F8E457D08ACB185CDE3BB9BB1989A9052344678566785BACFB9DFDBDEDCF09 "BADGE_GREEN") |
| [fixMasterKeyAsRegularKey][]    | v1.3.1     | [Enabled: 2019-10-02](https://livenet.xrpl.org/transactions/61096F8B5AFDD8F5BAF7FC7221BA4D1849C4E21B1BA79733E44B12FC8DA6EA20 "BADGE_GREEN") |
| [MultiSignReserve][]            | v1.2.0     | [Enabled: 2019-04-17](https://livenet.xrpl.org/transactions/C421E1D08EFD78E6B8D06B085F52A34A681D0B51AE62A018527E1B8F54C108FB "BADGE_GREEN") |
| [fixTakerDryOfferRemoval][]     | v1.2.0     | [Enabled: 2019-04-02](https://livenet.xrpl.org/transactions/C42335E95F1BD2009A2C090EA57BD7FB026AD285B4B85BE15F669BA4F70D11AF "BADGE_GREEN") |
| [fix1578][]                     | v1.2.0     | [Enabled: 2019-03-23](https://livenet.xrpl.org/transactions/7A80C87F59BCE6973CBDCA91E4DBDB0FC5461D3599A8BC8EAD02FA590A50005D "BADGE_GREEN") |
| [DepositPreauth][DepositPreauthAmendment] | v1.1.0     | [Enabled: 2018-10-09](https://livenet.xrpl.org/transactions/AD27403CB840AE67CADDB084BC54249D7BD1B403885819B39CCF723DC671F927 "BADGE_GREEN") |
| [fix1515][]                     | v1.1.0     | [Enabled: 2018-10-09](https://livenet.xrpl.org/transactions/6DF60D9EC8AF3C39B173840F4D1C57F8A8AB51E7C6571483B4A5F1AA0A9AAEBF "BADGE_GREEN") |
| [fix1543][]                     | v1.0.0     | [Enabled: 2018-06-21](https://livenet.xrpl.org/transactions/EA6054C9D256657014052F1447216CEA75FFDB1C9342D45EB0F9E372C0F879E6 "BADGE_GREEN") |
| [fix1623][]                     | v1.0.0     | [Enabled: 2018-06-20](https://livenet.xrpl.org/transactions/4D218D86A2B33E29F17AA9C25D8DFFEE5D2559F75F7C0B1D016D3F2C2220D3EB "BADGE_GREEN") |
| [fix1571][]                     | v1.0.0     | [Enabled: 2018-06-19](https://livenet.xrpl.org/transactions/920AA493E57D991414B614FB3C1D1E2F863211B48129D09BC8CB74C9813C38FC "BADGE_GREEN") |
| [DepositAuth][]                 | v0.90.0    | [Enabled: 2018-04-06](https://livenet.xrpl.org/transactions/902C51270B918B40CD23A622E18D48B4ABB86F0FF4E84D72D9E1907BF3BD4B25 "BADGE_GREEN") |
| [fix1513][]                     | v0.90.0    | [Enabled: 2018-04-06](https://livenet.xrpl.org/transactions/57FE540B8B8E2F26CE8B53D1282FEC55E605257E29F5B9EB49E15EA3989FCF6B "BADGE_GREEN") |
| [fix1201][]                     | v0.80.0    | [Enabled: 2017-11-14](https://livenet.xrpl.org/transactions/B1157116DDDDA9D9B1C4A95C029AC335E05DB052CECCC5CA90118A4D46C77C5E "BADGE_GREEN") |
| [fix1512][]                     | v0.80.0    | [Enabled: 2017-11-14](https://livenet.xrpl.org/transactions/63F69F59BEFDC1D79DBF1E4060601E05960683AA784926FB74BC55074C4F6647 "BADGE_GREEN") |
| [fix1523][]                     | v0.80.0    | [Enabled: 2017-11-14](https://livenet.xrpl.org/transactions/97FD0E35654F4B6714010D3CBBAC4038F60D64AD0292693C28A1DF4B796D8469 "BADGE_GREEN") |
| [fix1528][]                     | v0.80.0    | [Enabled: 2017-11-14](https://livenet.xrpl.org/transactions/27AEE02DA4FE22B6BB479F850FBBC873FDC7A09A8594753A91B53098D726397E "BADGE_GREEN") |
| [SortedDirectories][]           | v0.80.0    | [Enabled: 2017-11-14](https://livenet.xrpl.org/transactions/6E2309C156EBF94D03B83D282A3914671BF9168FB26463CFECD068C63FFFAB29 "BADGE_GREEN") |
| [EnforceInvariants][]           | v0.70.0    | [Enabled: 2017-07-07](https://livenet.xrpl.org/transactions/17593B03F7D3283966F3C0ACAF4984F26E9D884C9A202097DAED0523908E76C6 "BADGE_GREEN") |
| [fix1373][]                     | v0.70.0    | [Enabled: 2017-07-07](https://livenet.xrpl.org/transactions/7EBA3852D111EA19D03469F6870FAAEBF84C64F1B9BAC13B041DDD26E28CA399 "BADGE_GREEN") |
| [Escrow][]                      | v0.60.0    | [Enabled: 2017-03-31](https://livenet.xrpl.org/transactions/C581E0A3F3832FFFEEB13C497658F475566BD7695B0BBA531A774E6739801515 "BADGE_GREEN") |
| [fix1368][]                     | v0.60.0    | [Enabled: 2017-03-31](https://livenet.xrpl.org/transactions/3D20DE5CD19D5966865A7D0405FAC7902A6F623659667D6CB872DF7A94B6EF3F "BADGE_GREEN") |
| [PayChan][]                     | v0.33.0    | [Enabled: 2017-03-31](https://livenet.xrpl.org/transactions/16135C0B4AB2419B89D4FB4569B8C37FF76B9EF9CE0DD99CCACB5734445AFD7E "BADGE_GREEN") |
| [TickSize][]                    | v0.50.0    | [Enabled: 2017-02-21](https://livenet.xrpl.org/transactions/A12430E470BE5C846759EAE3C442FF03374D5D73ECE5815CF4906894B769565E "BADGE_GREEN") |
| [CryptoConditions][]            | v0.50.0    | [Enabled: 2017-01-03](https://livenet.xrpl.org/transactions/8EB00131E1C3DB35EDFF45C155D941E18C3E86BC1934FF987D2DA204F4065F15 "BADGE_GREEN") |
| [Flow][]                        | v0.33.0    | [Enabled: 2016-10-21](https://livenet.xrpl.org/transactions/C06CE3CABA3907389E4DD296C5F31C73B1548CC20BD7B83416C78CD7D4CD38FC "BADGE_GREEN") |
| [TrustSetAuth][]                | v0.30.0    | [Enabled: 2016-07-19](https://livenet.xrpl.org/transactions/0E589DE43C38AED63B64FF3DA87D349A038F1821212D370E403EB304C76D70DF "BADGE_GREEN") |
| [MultiSign][]                   | v0.31.0    | [Enabled: 2016-06-27](https://livenet.xrpl.org/transactions/168F8B15F643395E59B9977FC99D6310E8708111C85659A9BAF8B9222EEAC5A7 "BADGE_GREEN") |
| [FeeEscalation][]               | v0.31.0    | [Enabled: 2016-05-19](https://livenet.xrpl.org/transactions/5B1F1E8E791A9C243DD728680F108FEF1F28F21BA3B202B8F66E7833CA71D3C3 "BADGE_GREEN") |
| [CryptoConditionsSuite][]       | v0.60.0    | [Obsolete: To Be Removed]( "BADGE_RED") |
| [SHAMapV2][]                    | v0.32.1    | [Vetoed: Removed in v1.4.0](https://xrpl.org/blog/2019/rippled-1.4.0.html "BADGE_RED") |
| [FlowV2][]                      | v0.32.1    | [Vetoed: Removed in v0.33.0](https://xrpl.org/blog/2016/flowv2-vetoed.html "BADGE_RED") |
| [SusPay][]                      | v0.31.0    | [Vetoed: Removed in v0.60.0](https://xrpl.org/blog/2017/ticksize-voting.html#upcoming-features "BADGE_RED") |
| [Tickets][]                     | v0.30.1    | [Vetoed: Removed in v0.90.0](https://xrpl.org/blog/2018/rippled-0.90.0.html "BADGE_RED") |

**Note:** In many cases, an incomplete version of the code for an amendment is present in previous versions of the software. The "Introduced" version in the table above is the first stable version. The value "TBD" indicates that the amendment is not yet considered stable.

## CheckCashMakesTrustLine
[CheckCashMakesTrustLine]: #checkcashmakestrustline

| Amendment | CheckCashMakesTrustLine |
|:----------|:-----------|
| Amendment ID | 98DECF327BF79997AEC178323AD51A830E457BFC6D454DAF3E46E5EC42DC619F |
| Status | Open for Voting |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

Adjusts the [CheckCash transaction][] so that cashing a [Check](checks.html) for an issued token automatically creates a [trust line](trust-lines-and-issuing.html) to hold the token. The new behavior is similar to how the [OfferCreate transaction][] behaves when users purchase tokens in the decentralized exchange: the automatic trust line has a limit value of 0. This removes the setup step of setting up a trust line before receiving a token via a Check. (Checks that send XRP are unaffected.)

Without this amendment, users have to separately send a [TrustSet transaction][] before they can cash a Check for an issued token.

This amendment does not change the fact that you cannot force anyone to hold tokens they don't want in the XRP Ledger.


## Checks
[Checks]: #checks

| Amendment | Checks |
|:----------|:-----------|
| Amendment ID | 157D2D480E006395B76F948E3E07A45A05FE10230D88A7993C71F97AE4B1F2D1 |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Introduces "Checks" to the XRP Ledger. Checks work similarly to personal paper checks. The sender signs a transaction to create a Check for a specific maximum amount and destination. Later, the destination can cash the Check to receive up to the specified amount. The actual movement of money only occurs when the Check is cashed, so cashing the Check may fail depending on the sender's current balance and the available liquidity. If cashing the Check fails, the Check object remains in the ledger so it may be successfully cashed later.

The sender or the receiver can cancel a Check at any time before it is cashed. A Check can also have an expiration time, after which it cannot be cashed, and anyone can cancel it.

Introduces three new transaction types: CheckCreate, CheckCancel, and CheckCash, and a new ledger object type, Check. Adds a new transaction result code, `tecEXPIRED`, which occurs when trying to create a Check whose expiration time is in the past.


## CryptoConditions
[CryptoConditions]: #cryptoconditions

| Amendment | CryptoConditions |
|:----------|:-----------|
| Amendment ID | 1562511F573A19AE9BD103B5D6B9E01B3B46805AEC5D3C4805C902B514399146 |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | Yes |

Although this amendment is enabled, it has no effect unless the [SusPay](#suspay) amendment is also enabled. The SusPay amendment was replaced by the [Escrow](#escrow) amendment, so the CryptoConditions amendment has no effect.


## CryptoConditionsSuite
[CryptoConditionsSuite]: #cryptoconditionssuite

| Amendment | CryptoConditionsSuite |
|:----------|:-----------|
| Amendment ID | 86E83A7D2ECE3AD5FA87AB2195AE015C950469ABF0B72EAACED318F74886AE90 |
| Status | Obsolete |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

This amendment was intended to add support for several types of crypto-conditions from the official [crypto-conditions specification](https://tools.ietf.org/html/draft-thomas-crypto-conditions-03) for use in [EscrowCreate][] and [EscrowFinish][] transactions.

However, the amendment was added to `rippled` v0.60.0 before implementation was complete. As a result, this amendment ID refers to incomplete code which does almost nothing. Modifying the existing amendment to add support for other crypto-conditions would cause a conflict with old versions of the amendment already in released software. If a future release adds support for additional crypto-conditions, it must use a new and different amendment ID.


## DeletableAccounts
[DeletableAccounts]: #deletableaccounts

| Amendment | DeletableAccounts |
|:----------|:-----------|
| Amendment ID | 30CD365592B8EE40489BA01AE2F7555CAC9C983145871DC82A42A31CF5BAE7D9 |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Makes it possible to delete [accounts](accounts.html).

Without this amendment, new accounts always start with their `Sequence` numbers at 1, and there is no way to remove accounts from the state data of the ledger.

With this amendment, new accounts start with their `Sequence` numbers equal to the `Sequence` number matching the [index of the ledger][Ledger Index] in which the account is created. This change protects accounts that are deleted and later re-created from having their old transactions executed again. Adds a new `AccountDelete` transaction type, which deletes an account and certain objects that the account owns in the ledger. Certain types of objects cannot be deleted this way, so an account that is linked to any such objects cannot be deleted. Additionally, an account cannot be deleted if the current ledger index minus 256 is less than the account's current `Sequence` number. See [XRP Community Standards Draft 7](https://github.com/XRPLF/XRPL-Standards/issues/8) for a detailed discussion of this amendment.


## DepositAuth
[DepositAuth]: #depositauth

| Amendment | DepositAuth |
|:----------|:-----------|
| Amendment ID | F64E1EABBE79D55B3BB82020516CEC2C582A98A6BFE20FBE9BB6A0D233418064 |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Adds a new account flag, `DepositAuth`, which lets an account strictly reject any incoming money from transactions sent by other accounts. Businesses can use this flag to comply with strict regulations that require due diligence before receiving money from any source.

When an account enables this flag, Payment transactions fail if the account is the destination, regardless of whether the Payment would have delivered XRP or a token. EscrowFinish and PaymentChannelClaim transactions fail if the account is the destination unless the destination account itself sends those transactions. If the [Checks][] amendment is enabled, the account can receive XRP or tokens by sending CheckCash transactions.

As an exception, accounts with `DepositAuth` enabled can receive Payment transactions for small amounts of XRP (equal or less than the minimum [account reserve](reserves.html)) if their current XRP balance is below the account reserve.

Also fixes a bug in the EscrowCreate and PaymentChannelCreate transactions where they mistakenly enforced the Disallow XRP flag, which is meant to be a non-binding advisory flag. (By not enforcing Disallow XRP in the ledger itself an account can still receive the necessary XRP to meet its [account reserve](reserves.html) and pay [transaction costs](transaction-cost.html).)


## DepositPreauth
[DepositPreauthAmendment]: #depositpreauth

| Amendment | DepositPreauth |
|:----------|:-----------|
| Amendment ID | 3CBC5C4E630A1B82380295CDA84B32B49DD066602E74E39B85EF64137FA65194 |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Provides users of [deposit authorization](depositauth.html) with a way to preauthorize specific senders so those senders are allowed to send payments directly.

Adds a new transaction type, DepositPreauth for adding or removing preauthorization, and a DepositPreauth ledger object type for tracking preauthorizations from one account to another. Adds a JSON-RPC command, `deposit_authorized`, to query whether an account is authorized to send payments directly to another. <!-- STYLE_OVERRIDE: is authorized to -->

Changes the behavior of cross-currency Payments from an account to itself when that account requires deposit authorization. Without this amendment, those payments always fail with the code `tecNO_PERMISSION`. With this amendment, those payments succeed as they would with Deposit Authorization disabled.

Also changes the OfferCreate transaction to return `tecEXPIRED` when trying to create an Offer whose expiration time is in the past. Without this amendment, an OfferCreate whose expiration time is in the past returns `tesSUCCESS` but does not create or execute an Offer.


## EnforceInvariants
[EnforceInvariants]: #enforceinvariants

| Amendment | EnforceInvariants |
|:----------|:-----------|
| Amendment ID | DC9CA96AEA1DCF83E527D1AFC916EFAF5D27388ECA4060A88817C1238CAEE0BF |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | Yes |

Adds sanity checks to transaction processing to ensure that certain conditions are always met. This provides an extra, independent layer of protection against bugs in transaction processing that could otherwise cause exploits and vulnerabilities in the XRP Ledger. Future versions of `rippled` may add more invariants without additional amendments.

Introduces two new transaction error codes, `tecINVARIANT_FAILED` and `tefINVARIANT_FAILED`. Changes transaction processing to add the new checks.

Examples of invariant checks:

- The total amount of XRP destroyed by a transaction must match the [transaction cost](transaction-cost.html) exactly.
- XRP cannot be created.
- [`AccountRoot` objects in the ledger](accountroot.html) cannot be deleted unless [DeletableAccounts](#deletableaccounts) is enabled. (See also: [Deletion of Accounts](accounts.html#deletion-of-accounts).)
- [An object in the ledger](ledger-object-types.html) cannot change its type. (The `LedgerEntryType` field is immutable.)
- There cannot be a trust line for XRP.


## Escrow
[Escrow]: #escrow

| Amendment | Escrow |
|:----------|:-----------|
| Amendment ID | 07D43DCE529B15A10827E5E04943B496762F9A88E3268269D69C44BE49E21104 |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | Yes |

Replaces the [SusPay](#suspay) and [CryptoConditions](#cryptoconditions) amendments.

Provides "suspended payments" for XRP for escrow within the XRP Ledger, including support for [Interledger Protocol Crypto-Conditions](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02). Creates a new ledger object type for suspended payments and new transaction types to create, execute, and cancel suspended payments.


## ExpandedSignerList
[ExpandedSignerList]: #expandedsignerlist

| Amendment | ExpandedSignerList |
|:----------|:-----------|
| Amendment ID | B2A4DB846F0891BF2C76AB2F2ACC8F5B4EC64437135C6E56F3F859DE5FFD5856 |
| Status | Open for Voting |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

This amendment expands the maximum signer list size and allows each signer to have optional data associated with it. The additional data can be used to identify the signer, which may be useful for smart contracts, or for identifying who controls a key in a large organization: for example, you could store an IPv6 address or the identifier of a Hardware Security Module (HSM).

Without this amendment, the maximum signer list size is 8 entries, and each entry has exactly two fields, `Account` and `SignerWeight`.

With this amendment, the maximum [SignerList object][] size is 32 entries. Additionally, each `SignerEntry` object can contain an optional 256-bit (32-byte) `WalletLocator` field containing arbitrary data. This amendment changes the [SignerListSet transaction][] accordingly.


## FeeEscalation
[FeeEscalation]: #feeescalation

| Amendment | FeeEscalation |
|:----------|:-----------|
| Amendment ID | 42426C4D4F1009EE67080A9B7965B44656D7714D104A72F9B4369F97ABF044EE |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | Yes |

Changes the way the [transaction cost](transaction-cost.html) applies to proposed transactions. Modifies the consensus process to prioritize transactions that pay a higher transaction cost. <!-- STYLE_OVERRIDE: prioritize -->

This amendment introduces a fixed-size transaction queue for transactions that were not able to be included in the previous consensus round. If the `rippled` servers in the consensus network are under heavy load, they queue the transactions with the lowest transaction cost for later ledgers. Each consensus round prioritizes transactions from the queue with the largest transaction cost (`Fee` value), and includes as many transactions as the consensus network can process. If the transaction queue is full, transactions drop from the queue entirely, starting with the ones that have the lowest transaction cost.

While the consensus network is under heavy load, legitimate users can pay a higher transaction cost to make sure their transactions get processed. The situation persists until the entire backlog of cheap transactions is processed or discarded.

A transaction remains in the queue until one of the following happens:

* It gets applied to a validated ledger (regardless of success or failure)
* It becomes invalid (for example, the [`LastLedgerSequence`](transaction-common-fields.html) causes it to expire)
* It gets dropped because there are too many transactions in the queue with a higher transaction cost.


## fix1201
[fix1201]: #fix1201

| Amendment | fix1201 |
|:----------|:-----------|
| Amendment ID | B4D44CC3111ADD964E846FC57760C8B50FFCD5A82C86A72756F6B058DDDF96AD |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | Yes |

Correctly implements a limit on [transfer fees](transfer-fees.html) to a 100% fee, represented by a maximum `TransferRate` value of `2000000000`. (A 100% fee in this case means you must send 2 units of the token for every 1 unit you want to deliver.) Without the amendment, the effective limit is a `TransferRate` value of 2<sup>32</sup>-1, for approximately a 329% fee.

With this amendment enabled, an [AccountSet][] transaction that attempts to set `TransferRate` higher than `2000000000` fails with the result code `temBAD_TRANSFER_RATE`. Any existing `TransferRate` which was set to a higher value under the previous rules continues to apply at the higher rate.


## fix1368
[fix1368]: #fix1368

| Amendment | fix1368 |
|:----------|:-----------|
| Amendment ID | E2E6F2866106419B88C50045ACE96368558C345566AC8F2BDF5A5B5587F0E6FA |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | Yes |

Fixes a minor bug in transaction processing that causes some payments to fail when they should be valid. Specifically, during payment processing, some payment steps that are expected to produce a certain amount of currency may produce a microscopically different amount, due to a loss of precision related to floating-point number representation. When this occurs, those payments fail because they cannot deliver the exact amount intended. The fix1368 amendment corrects transaction processing so payments can no longer fail in this manner.


## fix1373
[fix1373]: #fix1373

| Amendment | fix1373 |
|:----------|:-----------|
| Amendment ID | 42EEA5E28A97824821D4EF97081FE36A54E9593C6E4F20CBAE098C69D2E072DC |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | Yes |

Fixes a minor bug in transaction processing that causes failures when trying to prepare certain [payment paths](paths.html) for processing. As a result, payments could not use certain paths that should have been valid but were invalidly prepared. Without this amendment, those payments are forced to use less-preferable paths or may even fail.

The fix1373 amendment corrects the issue so that the paths are properly prepared and payments can use them. It also disables some inappropriate paths that are currently allowed, including paths whose [steps](paths.html#path-specifications) include conflicting fields and paths that loop through the same object more than once.


## fix1512
[fix1512]: #fix1512

| Amendment | fix1512 |
|:----------|:-----------|
| Amendment ID | 6C92211186613F9647A89DFFBAB8F94C99D4C7E956D495270789128569177DA1 |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | Yes |

Fixes a bug in transaction processing that causes some invalid [PaymentChannelClaim][] transactions to fail with the wrong error code. Without this amendment, the transactions have a `tec`-class result code despite not being included in a ledger and therefore not paying the [transaction cost](transaction-cost.html).

With this amendment, the transactions fail with a more appropriate result code, `temBAD_AMOUNT`, instead.


## fix1513
[fix1513]: #fix1513

| Amendment | fix1513 |
|:----------|:-----------|
| Amendment ID | 67A34F2CF55BFC0F93AACD5B281413176FEE195269FA6D95219A2DF738671172 |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Fixes a bug that resulted in transaction processing not using new `STAmountCalcSwitchovers` code when the `FeeEscalation` amendment is enabled.

With this amendment, the new `STAmountCalcSwitchovers` code applies, which may cause slight changes to transaction processing due to calculation differences. Amounts may be rounded differently and offers may be executed in a different order as a result.


## fix1515
[fix1515]: #fix1515

| Amendment | fix1515 |
|:----------|:-----------|
| Amendment ID | 5D08145F0A4983F23AFFFF514E83FAD355C5ABFBB6CAB76FB5BC8519FF5F33BE |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Changes how Payment transactions consume offers to remove a minor difference in how payment processing and offer processing consume liquidity. (Also affects how OfferCreate transactions are processed if [FlowCross][] is enabled.)

Without the amendment, payment processing gives up on using particular order books if the transaction would consume over 2000 offers at the same exchange rate. In this case, the payment does not use the liquidity from those offers, and does not consider that order book's remaining liquidity when attempting to complete the payment.

With this amendment, if any transaction processes over 1000 offers at the same exchange rate, the transaction consumes the liquidity from the first 1000 offers, then does not consider that order book's remaining liquidity when attempting to complete the payment.

In both cases, transaction processing can still complete by using liquidity from other paths or exchange rates.


## fix1523
[fix1523]: #fix1523

| Amendment | fix1523 |
|:----------|:-----------|
| Amendment ID | B9E739B8296B4A1BB29BE990B17D66E21B62A300A909F25AC55C22D6C72E1F9D |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | Yes |

Adds tracking by destination account to [escrows](escrow.html). Without this amendment, pending escrows are only tracked by sender. This amendment makes it possible to look up pending escrows by the destination address using the [account_objects method][], excluding any pending escrows that were created before this amendment became enabled. This amendment also makes [EscrowCreate transactions][] appear in the destination's transaction history, as viewed with the [account_tx method][].

With this amendment, new escrows are added to the [owner directories](directorynode.html) of both the sender and receiver. This amendment also adds a new `DestinationNode` field to [Escrow ledger objects](escrow-object.html), indicating which page of the destination's owner directory contains the escrow.


## fix1528
[fix1528]: #fix1528

| Amendment | fix1528 |
|:----------|:-----------|
| Amendment ID | 1D3463A5891F9E589C5AE839FFAC4A917CE96197098A1EF22304E1BC5B98A454 |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | Yes |

Fixes a bug where validators could build consensus ledgers with different timestamps, potentially delaying the process of declaring validated ledgers. The circumstances for this to occur require precise timing, so validators are unlikely to encounter this bug outside of controlled test conditions.

This amendment changes how validators negotiate the close time of the consensus ledger so that they cannot reach a consensus on ledger contents but build ledger versions with different timestamps.


## fix1543
[fix1543]: #fix1543

| Amendment | fix1543 |
|:----------|:-----------|
| Amendment ID | CA7C02118BA27599528543DFE77BA6838D1B0F43B447D4D7F53523CE6A0E9AC2 |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Enforces reserved flag ranges on some transaction types that did not correctly enforce them already. Transactions of the affected types are now considered invalid if they enable undefined or unknown flags, or flags from the reserved range. (Transactions unaffected by this change already correctly enforce the same rules.)

Without this amendment, transactions of certain types are considered valid even when they have undefined or reserved flags enabled.

The affected transaction types are:

- Escrow transactions: [EscrowCancel][], [EscrowCreate][], and [EscrowFinish][]
- Payment Channel transactions: [PaymentChannelClaim][], [PaymentChannelCreate][], and [PaymentChannelFund][]


## fix1571
[fix1571]: #fix1571

| Amendment | fix1571 |
|:----------|:-----------|
| Amendment ID | 7117E2EC2DBF119CA55181D69819F1999ECEE1A0225A7FD2B9ED47940968479C |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Changes Escrow to fix the following issues:

- Changes the [EscrowCreate transaction][] to require the `Condition` or `FinishAfter` field (or both). Escrows with neither `Condition` nor `FinishAfter` that were created before this amendment can be finished by anyone at any time before their `CancelAfter` time.
- Fixes a flaw that incorrectly prevents time-based Escrows from being finished in some circumstances.


## fix1578
[fix1578]: #fix1578

| Amendment | fix1578 |
|:----------|:-----------|
| Amendment ID | FBD513F1B893AC765B78F250E6FFA6A11B573209D1842ADC787C850696741288 |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Changes the result codes returned by two transaction types:

- Changes the [OfferCreate transaction][] to return a new result code, `tecKILLED`, if the offer used the `tfFillOrKill` flag and was killed. Without this amendment, the offer is killed but the transaction result is `tesSUCCESS`.
- Changes the [TrustSet transaction][] to fail with `tecNO_PERMISSION` if it tries to enable the [No Ripple flag](rippling.html#the-no-ripple-flag) but cannot because the trust line has a negative balance. Without this amendment, the transaction does not enable the No Ripple flag, but the transaction result is `tesSUCCESS` nonetheless.


## fix1623
[fix1623]: #fix1623

| Amendment | fix1623 |
|:----------|:-----------|
| Amendment ID | 58BE9B5968C4DA7C59BA900961828B113E5490699B21877DEF9A31E9D0FE5D5F |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Adds delivered amount to metadata for CheckCash transactions cashed for a flexible amount. (Has no effect unless the [Checks](#checks) amendment is enabled.)

With this amendment enabled, transaction processing adds a `DeliveredAmount` field to the metadata of [CheckCash transactions][] for a variable amount (using the `DeliverMin` field). This change is written to the ledger data, resulting in a different ledger hash than would result from processing the transaction without this amendment. It does not affect the actual amounts delivered. Additionally, with this amendment enabled, the [tx method][] and [account_tx method][] return a [`delivered_amount` field](transaction-metadata.html#delivered_amount) for CheckCash transactions. (The `delivered_amount` field is calculated when you look up a transaction, and is not part of the data that is written to the ledger.)

The fix1623 amendment has no effect on [CheckCash transactions][] for a fixed amount (using the `Amount` field) or any other transaction types.


## fix1781
[fix1781]: #fix1781

| Amendment | fix1781 |
|:----------|:-----------|
| Amendment ID | 25BA44241B3BD880770BFA4DA21C7180576831855368CBEC6A3154FDE4A7676E |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Fixes a bug where certain XRP endpoints were not checked when detecting circular paths.

Without this amendment, it is possible to have a [payment path](paths.html) where the input to the path is XRP, and an intermediate path step also outputs XRP. This is a "loop" payment, and the payment engine disallows such paths because they can have different results when executed forward compared to backwards.

With this amendment, those payments fail with the [`temBAD_PATH_LOOP` result code](tem-codes.html) instead.


## fixAmendmentMajorityCalc
[fixAmendmentMajorityCalc]: #fixamendmentmajoritycalc

| Amendment | fixAmendmentMajorityCalc |
|:----------|:-----------|
| Amendment ID | 4F46DF03559967AC60F2EB272FEFE3928A7594A45FF774B87A7E540DB0F8F068 |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Fixes a bug that could cause an amendment to achieve a majority and later activate with support of slightly less than 80% of trusted validators due to rounding semantics.

Without this amendment, the minimum threshold for amendment activation is any value that rounds to 204/256 of trusted validators, which depends on the number of trusted validators at the time. For example, an amendment could activate with exactly 28 out of 36 validators (approximately 77.8%). With this amendment, the actual minimum number of validators needed is never less than 80% of trusted validators.


## fixCheckThreading
[fixCheckThreading]: #fixcheckthreading

| Amendment | fixCheckThreading |
|:----------|:-----------|
| Amendment ID | 8F81B066ED20DAECA20DF57187767685EEF3980B228E0667A650BAF24426D3B4 |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Changes the way Checks transactions affect account metadata, so that Checks are properly added to the [account](accounts.html) history of the receiving account. (Specifically, they update the `PreviousTxnID` and `PreviousTxnLedgerSeq` fields of the receiving account's [AccountRoot object](accountroot.html), which can be used to trace the "thread" of transactions that affected the account and the objects it owns.)

Without this amendment, Checks transactions ([CheckCreate][], [CheckCash][], and [CheckCancel][]) only update the account history of the sender. With this amendment, those transactions affect both the sending and receiving accounts. This amendment has no effect unless the [Checks amendment](#checks) is also enabled.


## fixMasterKeyAsRegularKey
[fixMasterKeyAsRegularKey]: #fixmasterkeyasregularkey

| Amendment | fixMasterKeyAsRegularKey |
|:----------|:-----------|
| Amendment ID | C4483A1896170C66C098DEA5B0E024309C60DC960DE5F01CD7AF986AA3D9AD37 |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Fixes a bug where accounts can set their regular key pair to match their master key pair, but cannot send transactions signed by the key if the master key is disabled.

Without this fix, a user can unintentionally "black hole" their account by setting the regular key to match the master key, then disabling the master key. The network rejects transactions signed with the both-master-and-regular key pair because the code interprets them as being signed with the disabled master key before it recognizes that they are signed by the currently-enabled regular key.

With this amendment enabled, a SetRegularKey transaction cannot set the regular key to match the master key; such a transaction results in the transaction code `temBAD_REGKEY`. Additionally, this amendment changes the signature verification code so that accounts which _already_ have their regular key set to match their master key can send transactions successfully using the key pair.


## fixNFTokenDirV1
[fixNFTokenDirV1]: #fixnftokendirv1

| Amendment | fixNFTokenDirV1 |
|:----------|:-----------|
| Amendment ID | 0285B7E5E08E1A8E4C15636F0591D87F73CB6A7B6452A932AD72BBC8E5D1CBE3 |
| Status | Open for Voting |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

This amendment fixes an off-by-one error that occurred in some corner cases when determining which `NFTokenPage` a `NFToken` object belongs on. It also adjusts the constraints of `NFTokenPage` invariant checks, so that certain error cases fail with a suitable error code such as `tecNO_SUITABLE_TOKEN_PAGE` instead of failing with a `tecINVARIANT_FAILED` error code.

This amendment has no effect unless the [NonFungibleTokensV1][] amendment is enabled. To avoid bugs, all the NFT-related amendments should be enabled together using [NonFungibleTokensV1_1][].


## fixNFTokenNegOffer
[fixNFTokenNegOffer]: #fixnftokennegoffer

| Amendment | fixNFTokenNegOffer |
|:----------|:-----------|
| Amendment ID | 36799EA497B1369B170805C078AEFE6188345F9B3E324C21E9CA3FF574E3C3D6 |
| Status | Open for Voting |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

This amendment fixes a bug in the [NonFungibleTokensV1][] amendment code where NFTs could be traded for negative amounts of money. Without this fix, users could place and accept an offer to buy or sell a `NFToken` for a negative amount of money, which resulted in the person "buying" the NFT also receiving money from the "seller". With this amendment, NFT offers for negative amounts are considered invalid.

This amendment has no effect unless the [NonFungibleTokensV1][] amendment is enabled. To avoid bugs, all the NFT-related amendments should be enabled together using [NonFungibleTokensV1_1][].


## fixPayChanRecipientOwnerDir
[fixPayChanRecipientOwnerDir]: #fixpaychanrecipientownerdir

| Amendment | fixPayChanRecipientOwnerDir |
|:----------|:-----------|
| Amendment ID | 621A0B264970359869E3C0363A899909AAB7A887C8B73519E4ECF952D33258A8 |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Changes the [PaymentChannelCreate transaction][] type so that it adds new [payment channels](payment-channels.html) to the recipient's [owner directory](directorynode.html). Without this amendment, new payment channels are added only to the sender's owner directory; with this amendment enabled, newly-created payment channels are added to both owner directories. Existing payment channels are unchanged.

This change prevents accounts from being deleted if they are the recipient for open payment channels, except for channels created before this amendment.


## fixQualityUpperBound
[fixQualityUpperBound]: #fixqualityupperbound

| Amendment | fixQualityUpperBound |
|:----------|:-----------|
| Amendment ID | 89308AF3B8B10B7192C4E613E1D2E4D9BA64B2EE2D5232402AE82A6A7220D953 |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Fixes a bug in unused code for estimating the ratio of input to output of individual steps in cross-currency payments.

This amendment has no known impact on transaction processing.

## fixRemoveNFTokenAutoTrustLine
[fixRemoveNFTokenAutoTrustLine]: #fixremovenftokenautotrustline

| Amendment | fixRemoveNFTokenAutoTrustLine |
|:----------|:-----------|
| Amendment ID | DF8B4536989BDACE3F934F29423848B9F1D76D09BE6A1FCFE7E7F06AA26ABEAD |
| Status | In Development   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Removes the `tfTrustLine` setting on [non-fungible tokens](non-fungible-tokens.html), to protect against a denial of service attack on issuers using this flag. With this amendment enabled, a [NFTokenMint transaction](nftokenmint.html) with the `tfTrustLine` flag enabled is considered invalid and cannot be confirmed by consensus; therefore, `NFToken` objects cannot be minted with the flag.

Without this amendment, an attacker could create new, meaningless fungible tokens and sell a `NFToken` back and forth for those tokens, creating numerous useless trust lines tied to the issuer and increasing the issuer's reserve requirement. 

This amendment does not change the code for `NFToken` objects that have already been minted. On test networks that already have NonFungibleTokensV1_1 enabled, this means that issuers who have already minted NFTokens with the `tfTrustLine` flag enabled are still vulnerable to the exploit even after the fixRemoveNFTokenAutoTrustLine amendment.

This amendment has no effect unless [NonFungibleTokensV1][] or [NonFungibleTokensV1_1][] is also enabled.

To protect issuers, this amendment should be enabled _before_ [NonFungibleTokensV1][] or [NonFungibleTokensV1_1][].


## fixRmSmallIncreasedQOffers
[fixRmSmallIncreasedQOffers]: #fixrmsmallincreasedqoffers

| Amendment | fixRmSmallIncreasedQOffers |
|:----------|:-----------|
| Amendment ID | B6B3EEDC0267AB50491FDC450A398AF30DBCD977CECED8BEF2499CAB5DAC19E2 |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

This amendment fixes an issue where certain Offers, when almost completely consumed, have a much lower exchange rate than when they were first placed. This occurs when the remaining amounts of one or both assets are so small that they cannot be rounded to a similar ratio as when the Offer was placed.

Without this amendment, an Offer in this state blocks Offers with better rates deeper in the order book and causes some payments and Offers to fail when they could have succeeded.

With this amendment, payments and trades can remove these types of Offers the same way that transactions normally remove fully consumed or unfunded Offers.


## fixSTAmountCanonicalize
[fixSTAmountCanonicalize]: #fixstamountcanonicalize

| Amendment | fixSTAmountCanonicalize |
|:----------|:-----------|
| Amendment ID | 452F5906C46D46F407883344BFDD90E672B672C5E9943DB4891E3A34FEEEB9DB |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Fixes an edge case in [deserializing](serialization.html) Amount-type fields. Without this amendment, in some rare cases the operation could result in otherwise valid serialized amounts overflowing during deserialization. With this amendment, the XRP Ledger detects error conditions more quickly and eliminates the problematic corner cases.


## fixTakerDryOfferRemoval
[fixTakerDryOfferRemoval]: #fixtakerdryofferremoval

| Amendment | fixTakerDryOfferRemoval |
|:----------|:-----------|
| Amendment ID | 2CD5286D8D687E98B41102BDD797198E81EA41DF7BD104E6561FEB104EFF2561 |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Fixes a bug in [auto-bridging](autobridging.html) that can leave a dry offer in the XRP Ledger. A dry offer is an offer that, if crossed, cannot yield any funds.

Without this fix, the dry offer remains on the ledger and counts toward its owner's [reserve requirement](reserves.html#owner-reserves) without providing any benefit to the owner. Another offer crossing of the right type and quality can remove the dry offer. However, if the required offer crossing type and quality are rare, it may take a while for the dry offer to be removed.

With this amendment enabled, the XRP Ledger removes these dry offers when they're matched in auto-bridging.


## fixTrustLinesToSelf
[fixTrustLinesToSelf]: #fixtrustlinestoself

| Amendment | fixTrustLinesToSelf |
|:----------|:-----------|
| Amendment ID | F1ED6B4A411D8B872E65B9DCB4C8B100375B0DD3D62D07192E011D6D7F339013 |
| Status | In Development |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

This amendment removes two trust lines from an account to itself that were created due to an old bug (both on 2013-05-07). When the amendment becomes enabled, it deletes trust lines with the IDs `2F8F21EFCAFD7ACFB07D5BB04F0D2E18587820C7611305BB674A64EAB0FA71E1` and `326035D5C0560A9DA8636545DD5A1B0DFCFF63E68D491B5522B767BB00564B1A` if they exist. After doing so, the amendment does nothing else.

On test networks that do not have these trust lines, the amendment has no effect.


## Flow
[Flow]: #flow

| Amendment | Flow |
|:----------|:-----------|
| Amendment ID | 740352F2412A9909880C23A559FCECEDA3BE2126FED62FC7660D628A06927F11 |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Replaces the payment processing engine with a more robust and efficient rewrite called the Flow engine. The new version of the payment processing engine is intended to follow the same rules as the old one, but occasionally produces different results due to floating point rounding. This Amendment supersedes the [FlowV2](https://xrpl.org/blog/2016/flowv2-vetoed.html) amendment.

The Flow Engine also makes it easier to improve and expand the payment engine with further Amendments.


## FlowCross
[FlowCross]: #flowcross

| Amendment | FlowCross |
|:----------|:-----------|
| Amendment ID | 3012E8230864E95A58C60FD61430D7E1B4D3353195F2981DC12B0C7C0950FFAC |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Streamlines the offer crossing logic in the XRP Ledger's decentralized exchange. Uses the updated code from the [Flow](#flow) amendment to power offer crossing, so [OfferCreate transactions][] and [Payment transactions][] share more code. This has subtle differences in how offers are processed:

- Rounding is slightly different in some cases.
- Due to differences in rounding, some combinations of offers may be ranked higher or lower than by the old logic, and taken preferentially.
- The new logic may delete more or fewer offers than the old logic. (This includes cases caused by differences in rounding and offers that were incorrectly removed as unfunded by the old logic.)


## FlowSortStrands
[FlowSortStrands]: #flowsortstrands

| Amendment | FlowSortStrands |
|:----------|:-----------|
| Amendment ID | AF8DF7465C338AE64B1E937D6C8DA138C0D63AD5134A68792BBBE1F63356C422 |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Improves the payment engine's calculations for finding the most cost-efficient way to execute a cross-currency transaction.

Without this change, the engine simulates a payment through each possible path to calculate the quality (ratio of input to output) of each path. With this change, the engine calculates the theoretical quality of each path without simulating a full payment. With this amendment, the payment engine executes some cross-currency payments much faster, is able to find the most cost-efficient path in more cases, and can enable some payments to succeed in certain conditions where the old payment engine would fail to find enough liquidity.


## FlowV2
[FlowV2]: #flowv2

| Amendment | FlowV2 |
|:----------|:-----------|
| Amendment ID | 5CC22CFF2864B020BD79E0E1F048F63EF3594F95E650E43B3F837EF1DF5F4B26 |
| Status | Vetoed    |
| Pre-amendment functionality retired? | No |

This is a previous version of the [Flow](#flow) amendment. It was [rejected due to a bug](https://xrpl.org/blog/2016/flowv2-vetoed.html) and removed in version 0.33.0.


## HardenedValidations
[HardenedValidations]: #hardenedvalidations

| Amendment | HardenedValidations |
|:----------|:-----------|
| Amendment ID | 1F4AFA8FA1BC8827AD4C0F682C03A8B671DCDF6B5C4DE36D44243A684103EF88 |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Allows validators to include a new optional field in their validations to attest to the hash of
the latest ledger that the validator considers to be fully validated. The consensus process can use this information to increase the robustness of consensus.


## MultiSign
[MultiSign]: #multisign

| Amendment | MultiSign |
|:----------|:-----------|
| Amendment ID | 4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373 |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | Yes |

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

| Amendment | MultiSignReserve |
|:----------|:-----------|
| Amendment ID | 586480873651E106F1D6339B0C4A8945BA705A777F3F4524626FF1FC07EFE41D |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Reduces the [owner reserve](reserves.html#owner-reserves) counted against your XRP Ledger account when it owns a [multi-signing](multi-signing.html) SignerList.

Without this amendment, the owner reserve for a SignerList ranges from 15 to 50 XRP, depending on the number of signers in the list.

With this amendment enabled, the owner reserve for a new SignerList is 5 XRP, regardless of the number of signers. The reserve requirement for previously-created SignerList objects remains unchanged. To reduce the reserve requirement of SignerList objects created before this amendment was enabled, use a [SignerListSet transaction](signerlistset.html) to replace the SignerList after this amendment has been enabled. (The replacement can be the same as the previous version.)


## NegativeUNL
[NegativeUNL]: #negativeunl

| Amendment | NegativeUNL |
|:----------|:-----------|
| Amendment ID | B4E4F5D2D6FB84DF7399960A732309C9FD530EAE5941838160042833625A6076 |
| Status | Enabled   |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

Implements a "Negative UNL" system, where the network can track which validators are temporarily offline and disregard those validators for quorum calculations. This can improve the ability of the network to make progress during periods of network instability.


## NonFungibleTokensV1
[NonFungibleTokensV1]: #nonfungibletokensv1

| Amendment | NonFungibleTokensV1 |
|:----------|:-----------|
| Amendment ID | 3C43D9A973AA4443EF3FC38E42DD306160FBFFDAB901CD8BAA15D09F2597EB87 |
| Status | Open for Voting |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

Adds native support for non-fungible tokens. Standards Draft: [XLS-20d](https://github.com/XRPLF/XRPL-Standards/discussions/46). <!-- SPELLING_IGNORE: xls, 20d -->

**Warning:** There is a known issue with this amendment that can cause `tecINVARIANT_FAILED` errors to appear in the ledger. The [fixNFTokenDirV1][] amendment fixes these issues and should be enabled before the NonFungibleTokensV1 amendment to avoid problems.

This amendment adds 5 new transaction types:

- [NFTokenAcceptOffer][]
- [NFTokenBurn][]
- [NFTokenCancelOffer][]
- [NFTokenCreateOffer][]
- [NFTokenMint][]

It also adds 2 new ledger object types:

- [NFTokenOffer object][]
- [NFTokenPage object][]

Additionally, it modifies the [AccountRoot object][] type to add 3 new optional fields: `MintedNFTokens`, `BurnedNFTokens`, and `NFTokenMinter`.

It also modifies the [AccountSet transaction][] type to allow you to set the `NFTokenMinter` field.


## NonFungibleTokensV1_1
[NonFungibleTokensV1_1]: #nonfungibletokensv1_1

| Amendment | NonFungibleTokensV1_1 |
|:----------|:-----------|
| Amendment ID | 32A122F1352A4C7B3A6D790362CC34749C5E57FCE896377BFDC6CCD14F6CD627 |
| Status | Open for Voting  |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

This amendment's only effect is to enable three other amendments at the same time:

- [NonFungibleTokensV1][]
- [fixNFTokenNegOffer][]
- [fixNFTokenDirV1][]

This ensures that the base NFT functionality and the related fixes all become enabled together, with no chance for the buggy functionality to become enabled without the fixes and no delay needed in between.

Validators who wish to enable Non-Fungible Tokens (NFTs) on the XRP Ledger should vote in favor of this amendment and not the others.


## OwnerPaysFee
[OwnerPaysFee]: #ownerpaysfee

| Amendment | OwnerPaysFee |
|:----------|:-----------|
| Amendment ID | 9178256A980A86CF3D70D0260A7DA6402AAFE43632FDBCB88037978404188871 |
| Status | In Development |
| Default Vote (Latest stable release) | N/A |
| Pre-amendment functionality retired? | No |

Fixes an inconsistency in the way [transfer fees](transfer-fees.html) are calculated between [OfferCreate](offercreate.html) and [Payment](payment.html) transaction types. Without this amendment, the holder of the token pays the transfer fee if an offer is executed in offer placement, but the initial sender of a transaction pays the transfer fees for offers that are executed as part of payment processing. With this amendment, the holder of the token always pays the transfer fee, regardless of whether the offer is executed as part of a Payment or an OfferCreate transaction. Offer processing outside of payments is unaffected.

This Amendment requires the [Flow Amendment](#flow) to be enabled.

**Note:** An incomplete version of this amendment was introduced in v0.33.0 and removed in v0.80.0. (It was never enabled.)


## PayChan
[PayChan]: #paychan

| Amendment | PayChan |
|:----------|:-----------|
| Amendment ID | 08DE7D96082187F6E6578530258C77FAABABE4C20474BDB82F04B021F1A68647 |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | Yes |

Creates "Payment Channels" for XRP. Payment channels are a tool for facilitating repeated, unidirectional payments or temporary credit between two parties. This feature is expected to be useful for the [Interledger Protocol](https://interledger.org/). One party creates a Payment Channel and sets aside some XRP in that channel for a predetermined expiration. Then, through off-ledger secure communications, the sender can send "Claim" messages to the receiver. The receiver can redeem the Claim messages before the expiration, or choose not to in case the payment is not needed. The receiver can verify Claims individually without actually distributing them to the network and waiting for the consensus process to redeem them, then redeem the combined content of many small Claims later, as long as it is within the expiration.

Creates three new transaction types: [PaymentChannelCreate][], [PaymentChannelClaim][], and [PaymentChannelFund][]. Creates a new ledger object type, [PayChannel](paychannel.html). Defines an off-ledger data structure called a `Claim`; the PaymentChannelClaim uses a signature for this data structure. Creates new `rippled` API methods: [`channel_authorize`](channel_authorize.html) (creates a signed Claim), [`channel_verify`](channel_verify.html) (verifies a signed Claim), and [`account_channels`](account_channels.html) (lists Channels associated with an account).

For more information, see the [Payment Channels Tutorial](use-payment-channels.html).


## RequireFullyCanonicalSig
[RequireFullyCanonicalSig]: #requirefullycanonicalsig

| Amendment | RequireFullyCanonicalSig |
|:----------|:-----------|
| Amendment ID | 00C1FC4A53E60AB02C864641002B3172F38677E29C26C5406685179B37E1EDAC |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Changes the signature requirements for the XRP Ledger protocol so that non-fully-canonical signatures are no longer valid in any case. This protects against [transaction malleability](transaction-malleability.html) on _all_ transactions, instead of only transactions with the [`tfFullyCanonicalSig` flag](transaction-common-fields.html#global-flags) enabled.

Without this amendment, a transaction is malleable if it uses a secp256k1 signature and does not have `tfFullyCanonicalSig` enabled. Most signing utilities enable `tfFullyCanonicalSig` by default, but there are exceptions.

With this amendment, no single-signed transactions are malleable. ([Multi-signed transactions may still be malleable](transaction-malleability.html#malleability-with-multi-signatures) if signers provide more signatures than are necessary.) All transactions must use the fully canonical form of the signature, regardless of the `tfFullyCanonicalSig` flag. Signing utilities that do not create fully canonical signatures are not supported. All of Ripple's signing utilities have been providing fully-canonical signatures exclusively since at least 2014.

For more information, see [`rippled` issue #3042](https://github.com/ripple/rippled/issues/3042).


## SHAMapV2
[SHAMapV2]: #shamapv2

| Amendment | SHAMapV2 |
|:----------|:-----------|
| Amendment ID | C6970A8B603D8778783B61C0D445C23D1633CCFAEF0D43E7DBCD1521D34BD7C3 |
| Status | Vetoed    |
| Pre-amendment functionality retired? | No |

Changes the hash tree structure that `rippled` uses to represent a ledger. The new structure is more compact and efficient than the previous version. This affects how ledger hashes are calculated, but has no other user-facing consequences.

When this amendment is activated, the XRP Ledger will undergo a brief scheduled unavailability while the network calculates the changes to the hash tree structure. <!-- STYLE_OVERRIDE: will -->


## SortedDirectories
[SortedDirectories]: #sorteddirectories

| Amendment | SortedDirectories |
|:----------|:-----------|
| Amendment ID | CC5ABAE4F3EC92E94A59B1908C2BE82D2228B6485C00AFF8F22DF930D89C194E |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | Yes |

Sorts the entries in [DirectoryNode ledger objects](directorynode.html) and fixes a bug that occasionally caused pages of owner directories not to be deleted when they should have been.

**Warning:** Older versions of `rippled` that do not know about this amendment may crash when they encounter a DirectoryNode sorted by the new rules. To avoid this problem, [upgrade](install-rippled.html) to `rippled` version 0.80.0 or later.


## SusPay
[SusPay]: #suspay

| Amendment | SusPay |
|:----------|:-----------|
| Amendment ID | DA1BD556B42D85EA9C84066D028D355B52416734D3283F85E216EA5DA6DB7E13 |
| Status | Vetoed    |
| Pre-amendment functionality retired? | No |

This amendment was replaced by the [Escrow](escrow-object.html) amendment.


## TicketBatch
[TicketBatch]: #ticketbatch

| Amendment | TicketBatch |
|:----------|:-----------|
| Amendment ID | 955DF3FA5891195A9DAEFA1DDC6BB244B545DDE1BAA84CBB25D5F12A8DA68A0C |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

This amendment adds [Tickets](tickets.html) as a way of sending transactions out of the typical sequence number order.

Standards Draft: [XLS-13d](https://github.com/XRPLF/XRPL-Standards/issues/16). <!-- SPELLING_IGNORE: xls, 13d -->


## Tickets
[Tickets]: #tickets

| Amendment | Tickets |
|:----------|:-----------|
| Amendment ID | C1B8D934087225F509BEB5A8EC24447854713EE447D277F69545ABFA0E0FD490 |
| Status | Vetoed    |
| Pre-amendment functionality retired? | No |

This amendment was replaced by the [TicketBatch][] amendment.


## TickSize
[TickSize]: #ticksize

| Amendment | TickSize |
|:----------|:-----------|
| Amendment ID | 532651B4FD58DF8922A49BA101AB3E996E5BFBF95A913B3E392504863E63B164 |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | Yes |

Changes the way [Offers](offers.html#lifecycle-of-an-offer) are ranked in order books, so that currency issuers can configure how many significant digits are taken into account when ranking Offers by exchange rate. With this amendment, the exchange rates of Offers are rounded to the configured number of significant digits, so that more Offers have the same exact exchange rate. The intent of this change is to require a meaningful improvement in price to outrank a previous Offer. If used by major issuers, this should reduce the incentive to spam the ledger with Offers that are only a tiny fraction of a percentage point better than existing offers. It may also increase the efficiency of order book storage in the ledger, because Offers can be grouped into fewer exchange rates.

Introduces a `TickSize` field to accounts, which can be set with the [AccountSet transaction type](accountset.html). If a currency issuer sets the `TickSize` field, the XRP Ledger truncates the exchange rate (ratio of funds in to funds out) of Offers to trade the issuer's currency, and adjusts the amounts of the Offer to match the truncated exchange rate. If only one currency in the trade has a `TickSize` set, that number of significant digits applies. When trading two currencies that have different `TickSize` values, whichever `TickSize` indicates the fewest significant digits applies. XRP does not have a `TickSize`.


## TrustSetAuth
[TrustSetAuth]: #trustsetauth

| Amendment | TrustSetAuth |
|:----------|:-----------|
| Amendment ID | 6781F8368C4771B83E8B821D88F580202BCB4228075297B19E4FDC5233F1EFDC |
| Status | Enabled   |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | Yes |

Allows pre-authorization of accounting relationships (zero-balance trust lines) when using [Authorized Trust Lines](authorized-trust-lines.html).

With this amendment enabled, a `TrustSet` transaction with [`tfSetfAuth` enabled](trustset.html#trustset-flags) can create a new [`RippleState` ledger object](ripplestate.html) even if it keeps all the other values of the `RippleState` node in their default state. The new `RippleState` node has the [`lsfLowAuth` or `lsfHighAuth` flag](ripplestate.html#ripplestate-flags) enabled, depending on whether the sender of the transaction is considered the low node or the high node. The sender of the transaction must have already enabled [`lsfRequireAuth`](accountroot.html#accountroot-flags) by sending an [AccountSet transaction](accountset.html) with the [`asfRequireAuth` flag enabled](accountset.html#accountset-flags).


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
