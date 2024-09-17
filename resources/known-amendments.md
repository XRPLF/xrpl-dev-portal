---
seo:
    description: List of all known amendments to the XRP Ledger protocol and their status.
labels:
  - Blockchain
---
# Known Amendments
[[Source]](https://github.com/xrplf/rippled/blob/master/src/ripple/protocol/impl/Feature.cpp "Source")

## Known Amendments on Mainnet

The following is a comprehensive list of all known [amendments](../docs/concepts/networks-and-servers/amendments.md) and their status on the production XRP Ledger:

{% admonition type="success" name="Tip" %}
This list is updated manually. For a live view of amendment voting, see the Amendments Dashboards: [XRPScan](https://xrpscan.com/amendments), [XRPLExplorer](https://xrplexplorer.com/amendments).
{% /admonition %}

| Name                              | Introduced | Status                        |
|:----------------------------------|:-----------|:------------------------------|
| [fixAMMv1_1][]                    | v2.2.0     | {% badge href="https://xrpl.org/blog/2024/rippled-2.2.0" %}Open for Voting: 2024-06-04{% /badge %} |
| [fixEmptyDID][]                   | v2.2.0     | {% badge href="https://xrpl.org/blog/2024/rippled-2.2.0" %}Open for Voting: 2024-06-04{% /badge %} |
| [fixPreviousTxnID][]              | v2.2.0     | {% badge href="https://xrpl.org/blog/2024/rippled-2.2.0" %}Open for Voting: 2024-06-04{% /badge %} |
| [fixXChainRewardRounding][]       | v2.2.0     | {% badge href="https://xrpl.org/blog/2024/rippled-2.2.0" %}Open for Voting: 2024-06-04{% /badge %} |
| [PriceOracle][]                   | v2.2.0     | {% badge href="https://xrpl.org/blog/2024/rippled-2.2.0" %}Open for Voting: 2024-06-04{% /badge %} |
| [DID][]                           | v2.0.0     | {% badge href="https://xrpl.org/blog/2024/rippled-2.0.0.html" %}Open for Voting: 2024-01-09{% /badge %} |
| [XChainBridge][]                  | v2.0.0     | {% badge href="https://xrpl.org/blog/2024/rippled-2.0.0.html" %}Open for Voting: 2024-01-09{% /badge %} |
| [fixNFTokenReserve][]             | v2.1.0     | {% badge href="https://livenet.xrpl.org/transactions/D708CF1799A27CB982F16FCE4762DD12738737A61E5850480BA51400280E06C4" %}Enabled: 2024-04-12{% /badge %} |
| [fixAMMOverflowOffer][]           | v2.1.1     | {% badge href="https://livenet.xrpl.org/transactions/64144409D991726D108B89D79F9305438D61928A322EF1CD14DC3A5F24CE64BC" %}Enabled: 2024-04-11{% /badge %} |
| [fixDisallowIncomingV1][]         | v2.0.0     | {% badge href="https://livenet.xrpl.org/transactions/50286B4B9C95331A48D3AD517E1FD3299308C6B696C85E096A73A445E9EB1BFB" %}Enabled: 2024-04-11{% /badge %} |
| [fixFillOrKill][]                 | v2.0.0     | {% badge href="https://livenet.xrpl.org/transactions/3209D6B66D375C23EEBE7C3DD3058B361427148D80C570B8E791D4C76555FA7B" %}Enabled: 2024-04-11{% /badge %} |
| [fixInnerObjTemplate][]           | v2.1.0     | {% badge href="https://livenet.xrpl.org/transactions/EC67D9DF8D06067A76E8F8F43BC036B5E0267568F8D92624A658AC01A8186235" %}Enabled: 2024-04-08{% /badge %} |
| [XRPFees][]                       | v1.10.0    | {% badge href="https://livenet.xrpl.org/transactions/4B6047F84B959B64FDD10E22D9E7CCC1EA0D228387462E8FF975B17F7C779021" %}Enabled: 2024-03-25{% /badge %} |
| [AMM][]                           | v1.12.0    | {% badge href="https://livenet.xrpl.org/transactions/75F52BB86416717288999523063D54E24290EFEA2E99DF78E80A12BD1C8FAC99" %}Enabled: 2024-03-22{% /badge %} |
| [Clawback][]                      | v1.12.0    | {% badge href="https://livenet.xrpl.org/transactions/C6BCCE60DFA4430A1F9097D774EA49E6FEFB1B535BA0EF9170DA0F2D08CDDB11" %}Enabled: 2024-02-08{% /badge %} |
| [fixNFTokenRemint][]              | v1.11.0    | {% badge href="https://livenet.xrpl.org/transactions/CA4562711E4679FE9317DD767871E90A404C7A8B84FAFD35EC2CF0231F1F6DAF" %}Enabled: 2023-11-27{% /badge %} |
| [fixReducedOffersV1][]            | v1.12.0    | {% badge href="https://livenet.xrpl.org/transactions/87723D9D01AFAD8E55C944D7D1598969A8FBD852FCACAE361A40CBF5D4CB3BB1" %}Enabled: 2023-11-24{% /badge %} |
| [DisallowIncoming][]              | v1.10.0    | {% badge href="https://livenet.xrpl.org/transactions/8747EF67D8CC1CA72A88817FBDF454507C3D9E8F0702D8E2B614958AE27A1D4E" %}Enabled: 2023-08-21{% /badge %} |
| [fixNonFungibleTokensV1_2][]      | v1.10.0    | {% badge href="https://livenet.xrpl.org/transactions/3AB0892CAB29F049B9D9E5D522701FD01469D0B97080626F8DD4B489D0B8784E" %}Enabled: 2023-08-21{% /badge %} |
| [fixTrustLinesToSelf][]           | v1.10.0    | {% badge href="https://livenet.xrpl.org/transactions/4F4C05142CA1DE257CD86513086F0C99FAF06D80932377C6B6C02B3D09623A43" %}Enabled: 2023-08-21{% /badge %} |
| [fixUniversalNumber][]            | v1.10.0    | {% badge href="https://livenet.xrpl.org/transactions/EFE82B7155CE5B766AF343D98DAE6662C2713C99E760D610370D02338881B2F3" %}Enabled: 2023-08-21{% /badge %} |
| [ImmediateOfferKilled][]          | v1.10.0    | {% badge href="https://livenet.xrpl.org/transactions/65B8A4068B20696A866A07E5668B2AEB0451564E13B79421356FB962EC9A536B" %}Enabled: 2023-08-21{% /badge %} |
| [CheckCashMakesTrustLine][]       | v1.8.0     | {% badge href="https://livenet.xrpl.org/transactions/4C8546305583F72E056120B136EB251E7F45E8DFAAE65FDA33B22181A9CA4557" %}Enabled: 2023-01-23{% /badge %} |
| [NonFungibleTokensV1_1][]         | v1.9.2     | {% badge href="https://livenet.xrpl.org/transactions/251242639A640CD9287A14A476E7F7C20BA009FDE410570926BAAF29AA05CEDE" %}Enabled: 2022-10-31{% /badge %} |
| [fixRemoveNFTokenAutoTrustLine][] | v1.9.4     | {% badge href="https://livenet.xrpl.org/transactions/2A67DB4AC65D688281B76334C4B52038FD56931694A6DD873B5CCD9B970AD57C" %}Enabled: 2022-10-27{% /badge %} |
| [ExpandedSignerList][]            | v1.9.1     | {% badge href="https://livenet.xrpl.org/transactions/802E2446547BB86397217E32A78CB9857F21B048B91C81BCC6EF837BE9C72C87" %}Enabled: 2022-10-13{% /badge %} |
| [NegativeUNL][]                   | v1.7.3     | {% badge href="https://livenet.xrpl.org/transactions/1500FADB73E7148191216C53040990E829C7110788B26E7F3246CB3660769EBA" %}Enabled: 2021-11-21{% /badge %} |
| [fixRmSmallIncreasedQOffers][]    | v1.7.2     | {% badge href="https://livenet.xrpl.org/transactions/1F37BA0502576DD7B5464F47641FA95DEB55735EC2663269DFD47810505478E7" %}Enabled: 2021-11-18{% /badge %} |
| [TicketBatch][]                   | v1.7.0     | {% badge href="https://livenet.xrpl.org/transactions/111B32EDADDE916206E7315FBEE2DA1521B229F207F65DD314829F13C8D9CA36" %}Enabled: 2021-11-18{% /badge %} |
| [fixSTAmountCanonicalize][]       | v1.7.0     | {% badge href="https://livenet.xrpl.org/transactions/AFF17321A012C756B64FCC3BA0FDF79109F28E244D838A28D5AE8A0384C7C532" %}Enabled: 2021-11-11{% /badge %} |
| [FlowSortStrands][]               | v1.7.0     | {% badge href="https://livenet.xrpl.org/transactions/1C3D3BD2AFDAF326EBFEA54579A89B024856609DB4310F7140086AAB262D09A1" %}Enabled: 2021-11-11{% /badge %} |
| [fix1781][]                       | v1.6.0     | {% badge href="https://livenet.xrpl.org/transactions/DA59F10201D651B544F65896330AFACA8CA4198904265AD279D56781F655FAFB" %}Enabled: 2021-04-08{% /badge %} |
| [fixAmendmentMajorityCalc][]      | v1.6.0     | {% badge href="https://livenet.xrpl.org/transactions/5B3ACE6CAC9C56D2008410F1B0881A0A4A8866FB99D2C2B2261C86C760DC95EF" %}Enabled: 2021-04-08{% /badge %} |
| [HardenedValidations][]           | v1.6.0     | {% badge href="https://livenet.xrpl.org/transactions/3A45DCF055B68DCBBFE034240F9359FB22E8A64B1BF7113304535BF5BB8144BF" %}Enabled: 2021-04-08{% /badge %} |
| [FlowCross][]                     | v0.70.0    | {% badge href="https://livenet.xrpl.org/transactions/44C4B040448D89B6C5A5DEC97C17FEDC2E590BA094BC7DB63B7FDC888B9ED78F" %}Enabled: 2020-08-04{% /badge %} |
| [fixQualityUpperBound][]          | v1.5.0     | {% badge href="https://livenet.xrpl.org/transactions/5F8E9E9B175BB7B95F529BEFE3C84253E78DAF6076078EC450A480C861F6889E" %}Enabled: 2020-07-09{% /badge %} |
| [RequireFullyCanonicalSig][]      | v1.5.0     | {% badge href="https://livenet.xrpl.org/transactions/94D8B158E948148B949CC3C35DD5DC4791D799E1FD5D3CE0E570160EDEF947D3" %}Enabled: 2020-07-03{% /badge %} |
| [Checks][]                        | v0.90.0    | {% badge href="https://livenet.xrpl.org/transactions/D88F2DCDFB10023F9F6CBA8DF34C18E321D655CAC8FDB962387A5DB1540242A6" %}Enabled: 2020-06-18{% /badge %} |
| [DeletableAccounts][]             | v1.4.0     | {% badge href="https://livenet.xrpl.org/transactions/47B90519D31E0CB376B5FEE5D9359FA65EEEB2289F1952F2A3EB71D623B945DE" %}Enabled: 2020-05-08{% /badge %} |
| [fixCheckThreading][]             | v1.4.0     | {% badge href="https://livenet.xrpl.org/transactions/74AFEA8C17D25CA883D40F998757CA3B0DB1AC86794335BAA25FF20E00C2C30A" %}Enabled: 2020-05-01{% /badge %} |
| [fixPayChanRecipientOwnerDir][]   | v1.4.0     | {% badge href="https://livenet.xrpl.org/transactions/D2F8E457D08ACB185CDE3BB9BB1989A9052344678566785BACFB9DFDBDEDCF09" %}Enabled: 2020-05-01{% /badge %} |
| [fixMasterKeyAsRegularKey][]      | v1.3.1     | {% badge href="https://livenet.xrpl.org/transactions/61096F8B5AFDD8F5BAF7FC7221BA4D1849C4E21B1BA79733E44B12FC8DA6EA20" %}Enabled: 2019-10-02{% /badge %} |
| [MultiSignReserve][]              | v1.2.0     | {% badge href="https://livenet.xrpl.org/transactions/C421E1D08EFD78E6B8D06B085F52A34A681D0B51AE62A018527E1B8F54C108FB" %}Enabled: 2019-04-17{% /badge %} |
| [fixTakerDryOfferRemoval][]       | v1.2.0     | {% badge href="https://livenet.xrpl.org/transactions/C42335E95F1BD2009A2C090EA57BD7FB026AD285B4B85BE15F669BA4F70D11AF" %}Enabled: 2019-04-02{% /badge %} |
| [fix1578][]                       | v1.2.0     | {% badge href="https://livenet.xrpl.org/transactions/7A80C87F59BCE6973CBDCA91E4DBDB0FC5461D3599A8BC8EAD02FA590A50005D" %}Enabled: 2019-03-23{% /badge %} |
| [DepositPreauth][DepositPreauthAmendment] | v1.1.0     | {% badge href="https://livenet.xrpl.org/transactions/AD27403CB840AE67CADDB084BC54249D7BD1B403885819B39CCF723DC671F927" %}Enabled: 2018-10-09{% /badge %} |
| [fix1515][]                       | v1.1.0     | {% badge href="https://livenet.xrpl.org/transactions/6DF60D9EC8AF3C39B173840F4D1C57F8A8AB51E7C6571483B4A5F1AA0A9AAEBF" %}Enabled: 2018-10-09{% /badge %} |
| [fix1543][]                       | v1.0.0     | {% badge href="https://livenet.xrpl.org/transactions/EA6054C9D256657014052F1447216CEA75FFDB1C9342D45EB0F9E372C0F879E6" %}Enabled: 2018-06-21{% /badge %} |
| [fix1623][]                       | v1.0.0     | {% badge href="https://livenet.xrpl.org/transactions/4D218D86A2B33E29F17AA9C25D8DFFEE5D2559F75F7C0B1D016D3F2C2220D3EB" %}Enabled: 2018-06-20{% /badge %} |
| [fix1571][]                       | v1.0.0     | {% badge href="https://livenet.xrpl.org/transactions/920AA493E57D991414B614FB3C1D1E2F863211B48129D09BC8CB74C9813C38FC" %}Enabled: 2018-06-19{% /badge %} |
| [DepositAuth][]                   | v0.90.0    | {% badge href="https://livenet.xrpl.org/transactions/902C51270B918B40CD23A622E18D48B4ABB86F0FF4E84D72D9E1907BF3BD4B25" %}Enabled: 2018-04-06{% /badge %} |
| [fix1513][]                       | v0.90.0    | {% badge href="https://livenet.xrpl.org/transactions/57FE540B8B8E2F26CE8B53D1282FEC55E605257E29F5B9EB49E15EA3989FCF6B" %}Enabled: 2018-04-06{% /badge %} |
| [fix1201][]                       | v0.80.0    | {% badge href="https://livenet.xrpl.org/transactions/B1157116DDDDA9D9B1C4A95C029AC335E05DB052CECCC5CA90118A4D46C77C5E" %}Enabled: 2017-11-14{% /badge %} |
| [fix1512][]                       | v0.80.0    | {% badge href="https://livenet.xrpl.org/transactions/63F69F59BEFDC1D79DBF1E4060601E05960683AA784926FB74BC55074C4F6647" %}Enabled: 2017-11-14{% /badge %} |
| [fix1523][]                       | v0.80.0    | {% badge href="https://livenet.xrpl.org/transactions/97FD0E35654F4B6714010D3CBBAC4038F60D64AD0292693C28A1DF4B796D8469" %}Enabled: 2017-11-14{% /badge %} |
| [fix1528][]                       | v0.80.0    | {% badge href="https://livenet.xrpl.org/transactions/27AEE02DA4FE22B6BB479F850FBBC873FDC7A09A8594753A91B53098D726397E" %}Enabled: 2017-11-14{% /badge %} |
| [SortedDirectories][]             | v0.80.0    | {% badge href="https://livenet.xrpl.org/transactions/6E2309C156EBF94D03B83D282A3914671BF9168FB26463CFECD068C63FFFAB29" %}Enabled: 2017-11-14{% /badge %} |
| [EnforceInvariants][]             | v0.70.0    | {% badge href="https://livenet.xrpl.org/transactions/17593B03F7D3283966F3C0ACAF4984F26E9D884C9A202097DAED0523908E76C6" %}Enabled: 2017-07-07{% /badge %} |
| [fix1373][]                       | v0.70.0    | {% badge href="https://livenet.xrpl.org/transactions/7EBA3852D111EA19D03469F6870FAAEBF84C64F1B9BAC13B041DDD26E28CA399" %}Enabled: 2017-07-07{% /badge %} |
| [Escrow][]                        | v0.60.0    | {% badge href="https://livenet.xrpl.org/transactions/C581E0A3F3832FFFEEB13C497658F475566BD7695B0BBA531A774E6739801515" %}Enabled: 2017-03-31{% /badge %} |
| [fix1368][]                       | v0.60.0    | {% badge href="https://livenet.xrpl.org/transactions/3D20DE5CD19D5966865A7D0405FAC7902A6F623659667D6CB872DF7A94B6EF3F" %}Enabled: 2017-03-31{% /badge %} |
| [PayChan][]                       | v0.33.0    | {% badge href="https://livenet.xrpl.org/transactions/16135C0B4AB2419B89D4FB4569B8C37FF76B9EF9CE0DD99CCACB5734445AFD7E" %}Enabled: 2017-03-31{% /badge %} |
| [TickSize][]                      | v0.50.0    | {% badge href="https://livenet.xrpl.org/transactions/A12430E470BE5C846759EAE3C442FF03374D5D73ECE5815CF4906894B769565E" %}Enabled: 2017-02-21{% /badge %} |
| [CryptoConditions][]              | v0.50.0    | {% badge href="https://livenet.xrpl.org/transactions/8EB00131E1C3DB35EDFF45C155D941E18C3E86BC1934FF987D2DA204F4065F15" %}Enabled: 2017-01-03{% /badge %} |
| [Flow][]                          | v0.33.0    | {% badge href="https://livenet.xrpl.org/transactions/C06CE3CABA3907389E4DD296C5F31C73B1548CC20BD7B83416C78CD7D4CD38FC" %}Enabled: 2016-10-21{% /badge %} |
| [TrustSetAuth][]                  | v0.30.0    | {% badge href="https://livenet.xrpl.org/transactions/0E589DE43C38AED63B64FF3DA87D349A038F1821212D370E403EB304C76D70DF" %}Enabled: 2016-07-19{% /badge %} |
| [MultiSign][]                     | v0.31.0    | {% badge href="https://livenet.xrpl.org/transactions/168F8B15F643395E59B9977FC99D6310E8708111C85659A9BAF8B9222EEAC5A7" %}Enabled: 2016-06-27{% /badge %} |
| [FeeEscalation][]                 | v0.31.0    | {% badge href="https://livenet.xrpl.org/transactions/5B1F1E8E791A9C243DD728680F108FEF1F28F21BA3B202B8F66E7833CA71D3C3" %}Enabled: 2016-05-19{% /badge %} |

{% admonition type="info" name="Note" %}
In many cases, an incomplete version of the code for an amendment is present in previous versions of the software. The "Introduced" version in the table above is the first stable version. The value "TBD" indicates that the amendment is not yet considered stable.
{% /admonition %}

## Amendments in Development

The following is a list of [amendments](../docs/concepts/networks-and-servers/amendments.md) that are being developed and a private network is available to test the changes.

| Name                              | Status                                    | Additional Information         |
|:----------------------------------|:------------------------------------------|:-------------------------------|
| [Hooks][]                         | {% badge %}In Development: TBD{% /badge %} | [XRPL Hooks](https://hooks.xrpl.org/) |
| [OwnerPaysFee][]                  | {% badge %}In Development: TBD{% /badge %} | |

{% admonition type="success" name="Tip" %}
This list is updated manually. If you're working on an amendment and have a private network to test the changes, you can edit this page to add your in-development amendment to this list. For more information on contributing to the XRP Ledger, see [Contribute Code to the XRP Ledger](contribute-code/index.md).
{% /admonition %}

## Obsolete Amendments

The following is a list of known [amendments](../docs/concepts/networks-and-servers/amendments.md) that have been removed in a previous version, or are obsolete and have been marked for removal.

| Name                              | Introduced | Status                        |
|:----------------------------------|:-----------|:------------------------------|
| [fixNFTokenNegOffer][]            | v1.9.2     | {% badge %}Obsolete: To Be Removed{% /badge %} |
| [fixNFTokenDirV1][]               | v1.9.1     | {% badge %}Obsolete: To Be Removed{% /badge %} |
| [NonFungibleTokensV1][]           | v1.9.0     | {% badge %}Obsolete: To Be Removed{% /badge %} |
| [CryptoConditionsSuite][]         | v0.60.0    | {% badge %}Obsolete: To Be Removed{% /badge %} |
| [SHAMapV2][]                      | v0.32.1    | {% badge href="https://xrpl.org/blog/2019/rippled-1.4.0.html" %}Obsolete: Removed in v1.4.0{% /badge %} |
| [FlowV2][]                        | v0.32.1    | {% badge href="https://xrpl.org/blog/2016/flowv2-vetoed.html" %}Obsolete: Removed in v0.33.0{% /badge %} |
| [SusPay][]                        | v0.31.0    | {% badge href="https://xrpl.org/blog/2017/ticksize-voting.html#upcoming-features" %}Obsolete: Removed in v0.60.0{% /badge %} |
| [Tickets][]                       | v0.30.1    | {% badge href="https://xrpl.org/blog/2018/rippled-0.90.0.html" %}Obsolete: Removed in v0.90.0{% /badge %} |


## Details about Known Amendments


### AMM
[AMM]: #amm

| Amendment    | AMM |
|:-------------|:----|
| Amendment ID | 8CC0774A3BF66D1D22E76BBDA8E8A232E6B6313834301B3B23E8601196AE6455 |
| Status       | Enabled |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

Adds Automated Market Maker (AMM) functionality to the ledger in a way that is integrated with the existing decentralized exchange. Each pair of assets (tokens or XRP) can have up to one AMM in the ledger, which anyone can contribute liquidity to for a proportional share in the earnings and exchange risk. Each AMM instance has a special account to hold its assets and issue "LP Tokens" to liquidity providers in proportion to their deposits. Liquidity providers can vote on the AMM's trading fee based on their share of LP Tokens. Users can bid LP Tokens on the right to trade with a discounted trading fee for a limited period of time.

Adds new transactions:

- AMMBid - Bid on the AMM's auction slot, which offers discounted fees.
- AMMCreate - Create a new AMM instance and provide initial funding.
- AMMDelete - Remove an empty AMM instance from the ledger.
- AMMDeposit - Add funds to an existing AMM and receive LP Tokens.
- AMMWithdraw - Return LP Tokens to an AMM to remove funds.
- AMMVote - Vote on the AMM's trading fee.

Updates existing transactions with new functionality:

- Payment and OfferCreate transactions that trade currency automatically use any combination of Offers and AMMs to achieve the best exchange rate.
- Some transactions cannot be sent to an AMM's special account. (For example, the AMM cannot cash a check, so CheckCreate to an AMM is not allowed.)

Adds a new type of ledger entry, `AMM`, and adds an `AMMID` field to the `AccountRoot` ledger entry type.

Adds several new transaction result codes.


### CheckCashMakesTrustLine
[CheckCashMakesTrustLine]: #checkcashmakestrustline

| Amendment    | CheckCashMakesTrustLine |
|:-------------|:------------------------|
| Amendment ID | 98DECF327BF79997AEC178323AD51A830E457BFC6D454DAF3E46E5EC42DC619F |
| Status       | Enabled |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

Adjusts the [CheckCash transaction][] so that cashing a [Check](../docs/concepts/payment-types/checks.md) for an issued token automatically creates a [trust line](../docs/concepts/tokens/fungible-tokens/index.md) to hold the token. The new behavior is similar to how the [OfferCreate transaction][] behaves when users buy tokens in the decentralized exchange: the automatic trust line has a limit value of 0. This removes the setup step of setting up a trust line before receiving a token via a Check. (Checks that send XRP are unaffected.)

Without this amendment, users have to separately send a [TrustSet transaction][] before they can cash a Check for an issued token.

This amendment does not change the fact that you cannot force anyone to hold tokens they don't want in the XRP Ledger.


### Checks
[Checks]: #checks

| Amendment    | Checks |
|:-------------|:-------|
| Amendment ID | 157D2D480E006395B76F948E3E07A45A05FE10230D88A7993C71F97AE4B1F2D1 |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Introduces "Checks" to the XRP Ledger. Checks work similarly to personal paper checks. The sender signs a transaction to create a Check for a specific maximum amount and destination. Later, the destination can cash the Check to receive up to the specified amount. The actual movement of money only occurs when the Check is cashed, so cashing the Check may fail depending on the sender's current balance and the available liquidity. If cashing the Check fails, the Check object remains in the ledger so it may be successfully cashed later.

The sender or the receiver can cancel a Check at any time before it is cashed. A Check can also have an expiration time, after which it cannot be cashed, and anyone can cancel it.

Introduces three new transaction types: CheckCreate, CheckCancel, and CheckCash, and a new ledger object type, Check. Adds a new transaction result code, `tecEXPIRED`, which occurs when trying to create a Check whose expiration time is in the past.


### Clawback
[Clawback]: #clawback

| Amendment    | Clawback |
|:-------------|:---------|
| Amendment ID | 56B241D7A43D40354D02A9DC4C8DF5C7A1F930D92A9035C4E12291B3CA3E1C2B |
| Status       | Enabled |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

For regulatory purposes, some issuers must have the ability to recover issued tokens after they are distributed to accounts. For example, if an issuer were to discover that tokens were sent to an account sanctioned for illegal activity, the issuer could recover, or _claw back_ the funds.

Clawback is disabled by default. To use clawback, you must set the `lsfAllowTrustLineClawback` flag using an `AccountSet` transaction.

See [Clawback](../docs/concepts/tokens/fungible-tokens/clawing-back-tokens.md) for details on this amendment.


### CryptoConditions
[CryptoConditions]: #cryptoconditions

| Amendment    | CryptoConditions |
|:-------------|:-----------------|
| Amendment ID | 1562511F573A19AE9BD103B5D6B9E01B3B46805AEC5D3C4805C902B514399146 |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | Yes |

Although this amendment is enabled, it has no effect unless the [SusPay](#suspay) amendment is also enabled. The SusPay amendment was replaced by the [Escrow](#escrow) amendment, so the CryptoConditions amendment has no effect.


### CryptoConditionsSuite
[CryptoConditionsSuite]: #cryptoconditionssuite

| Amendment    | CryptoConditionsSuite |
|:-------------|:----------------------|
| Amendment ID | 86E83A7D2ECE3AD5FA87AB2195AE015C950469ABF0B72EAACED318F74886AE90 |
| Status       | Obsolete |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

This amendment was intended to add support for several types of crypto-conditions from the official [crypto-conditions specification](https://tools.ietf.org/html/draft-thomas-crypto-conditions-03) for use in [EscrowCreate][] and [EscrowFinish][] transactions.

However, the amendment was added to `rippled` v0.60.0 before implementation was complete. As a result, this amendment ID refers to incomplete code which does almost nothing. Modifying the existing amendment to add support for other crypto-conditions would cause a conflict with old versions of the amendment already in released software. If a future release adds support for additional crypto-conditions, it must use a new and different amendment ID.



### DeletableAccounts
[DeletableAccounts]: #deletableaccounts

| Amendment    | DeletableAccounts |
|:-------------|:------------------|
| Amendment ID | 30CD365592B8EE40489BA01AE2F7555CAC9C983145871DC82A42A31CF5BAE7D9 |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Makes it possible to delete [accounts](../docs/concepts/accounts/index.md).

Without this amendment, new accounts always start with their `Sequence` numbers at 1, and there is no way to remove accounts from the state data of the ledger.

With this amendment, new accounts start with their `Sequence` numbers equal to the `Sequence` number matching the [index of the ledger][Ledger Index] in which the account is created. This change protects accounts that are deleted and later re-created from having their old transactions executed again. Adds a new `AccountDelete` transaction type, which deletes an account and certain objects that the account owns in the ledger. Certain types of objects cannot be deleted this way, so an account that is linked to any such objects cannot be deleted. Additionally, an account cannot be deleted if the current ledger index minus 256 is less than the account's current `Sequence` number. See [XRP Community Standards Draft 7](https://github.com/XRPLF/XRPL-Standards/issues/8) for a detailed discussion of this amendment.


### DepositAuth
[DepositAuth]: #depositauth

| Amendment    | DepositAuth |
|:-------------|:------------|
| Amendment ID | F64E1EABBE79D55B3BB82020516CEC2C582A98A6BFE20FBE9BB6A0D233418064 |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Adds a new account flag, `DepositAuth`, which lets an account strictly reject any incoming money from transactions sent by other accounts. Businesses can use this flag to comply with strict regulations that require due diligence before receiving money from any source.

When an account enables this flag, Payment transactions fail if the account is the destination, regardless of whether the Payment would have delivered XRP or a token. EscrowFinish and PaymentChannelClaim transactions fail if the account is the destination unless the destination account itself sends those transactions. If the [Checks][] amendment is enabled, the account can receive XRP or tokens by sending CheckCash transactions.

As an exception, accounts with `DepositAuth` enabled can receive Payment transactions for small amounts of XRP (equal or less than the minimum [account reserve](../docs/concepts/accounts/reserves.md)) if their current XRP balance is below the account reserve.

Also fixes a bug in the EscrowCreate and PaymentChannelCreate transactions where they mistakenly enforced the Disallow XRP flag, which is meant to be a non-binding advisory flag. (By not enforcing Disallow XRP in the ledger itself an account can still receive the necessary XRP to meet its [account reserve](../docs/concepts/accounts/reserves.md) and pay [transaction costs](../docs/concepts/transactions/transaction-cost.md).)


### DepositPreauth
[DepositPreauth]: #depositpreauth

| Amendment    | DepositPreauth |
|:-------------|:---------------|
| Amendment ID | 3CBC5C4E630A1B82380295CDA84B32B49DD066602E74E39B85EF64137FA65194 |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Provides users of [deposit authorization](../docs/concepts/accounts/depositauth.md) with a way to preauthorize specific senders so those senders are allowed to send payments directly.

Adds a new transaction type, DepositPreauth for adding or removing preauthorization, and a DepositPreauth ledger object type for tracking preauthorizations from one account to another. Adds a JSON-RPC command, `deposit_authorized`, to query whether an account is authorized to send payments directly to another. <!-- STYLE_OVERRIDE: is authorized to -->

Changes the behavior of cross-currency Payments from an account to itself when that account requires deposit authorization. Without this amendment, those payments always fail with the code `tecNO_PERMISSION`. With this amendment, those payments succeed as they would with Deposit Authorization disabled.

Also changes the OfferCreate transaction to return `tecEXPIRED` when trying to create an Offer whose expiration time is in the past. Without this amendment, an OfferCreate whose expiration time is in the past returns `tesSUCCESS` but does not create or execute an Offer.


### DID
[DID]: #did

| Amendment    | DID |
|:-------------|:----|
| Amendment ID | DB432C3A09D9D5DFC7859F39AE5FF767ABC59AED0A9FB441E83B814D8946C109 |
| Status       | Open for Voting |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

Adds to the ledger Decentralized Identifier (DID) functionality that conforms to the [World Wide Web Consortium](https://www.w3.org/press-releases/2022/did-rec/) standard. DIDs provide a digital identity, not dependent on a centralized authority and controlled by the DID subject.

Adds new transactions:

- DIDDelete - Delete the DID associated with your XRPL account.
- DIDSet - Create a new DID or update an existing one.

Adds a new `DID` ledger entry type.

Adds several new transaction result codes.


### DisallowIncoming
[DisallowIncoming]: #disallowincoming

| Amendment    | DisallowIncoming |
|:-------------|:-----------------|
| Amendment ID | 47C3002ABA31628447E8E9A8B315FAA935CE30183F9A9B86845E469CA2CDC3DF |
| Status       | Enabled |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

Provides options to categorically block incoming Checks, Payment Channels, NFTokenOffers, and trust lines from reaching your account. When an account has these options enabled, other accounts cannot create those types of objects with the account as the destination.

Adds 4 new AccountSet Flags and modifies the AccountSet transaction to allow enabling and disabling them:

- asfDisallowIncomingCheck
- asfDisallowIncomingPayChan
- asfDisallowIncomingNFTOffer
- asfDisallowIncomingTrustline

Changes transaction processing to check the status of those flags before creating the corresponding type of object. If the destination account has the flag enabled, the transaction fails with the error code `tecNO_PERMISSION`.

Without this amendment, any account can create these objects with any object as the destination; while this is usually harmless, it can block an account from later being deleted, and may also be used as part of scams.


### EnforceInvariants
[EnforceInvariants]: #enforceinvariants

| Amendment    | EnforceInvariants |
|:-------------|:------------------|
| Amendment ID | DC9CA96AEA1DCF83E527D1AFC916EFAF5D27388ECA4060A88817C1238CAEE0BF |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | Yes |

Adds sanity checks to transaction processing to ensure that certain conditions are always met. This provides an extra, independent layer of protection against bugs in transaction processing that could otherwise cause exploits and vulnerabilities in the XRP Ledger. Future versions of `rippled` may add more invariants without additional amendments.

Introduces two new transaction error codes, `tecINVARIANT_FAILED` and `tefINVARIANT_FAILED`. Changes transaction processing to add the new checks.

Examples of invariant checks:

- The total amount of XRP destroyed by a transaction must match the [transaction cost](../docs/concepts/transactions/transaction-cost.md) exactly.
- XRP cannot be created.
- [`AccountRoot` objects in the ledger](../docs/references/protocol/ledger-data/ledger-entry-types/accountroot.md) cannot be deleted unless [DeletableAccounts](#deletableaccounts) is enabled. (See also: [Deleting Accounts](../docs/concepts/accounts/deleting-accounts.md).)
- [An entry in the ledger](../docs/references/protocol/ledger-data/ledger-entry-types/index.md) cannot change its type. (The `LedgerEntryType` field is immutable.)
- There cannot be a trust line for XRP.


### Escrow
[Escrow]: #escrow

| Amendment    | Escrow |
|:-------------|:-------|
| Amendment ID | 07D43DCE529B15A10827E5E04943B496762F9A88E3268269D69C44BE49E21104 |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | Yes |

Replaces the [SusPay](#suspay) and [CryptoConditions](#cryptoconditions) amendments.

Provides "suspended payments" for XRP for escrow within the XRP Ledger, including support for [Interledger Protocol Crypto-Conditions](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02). Creates a new ledger object type for suspended payments and new transaction types to create, execute, and cancel suspended payments.


### ExpandedSignerList
[ExpandedSignerList]: #expandedsignerlist

| Amendment    | ExpandedSignerList |
|:-------------|:-------------------|
| Amendment ID | B2A4DB846F0891BF2C76AB2F2ACC8F5B4EC64437135C6E56F3F859DE5FFD5856 |
| Status       | Enabled |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

This amendment expands the maximum signer list size and allows each signer to have optional data associated with it. The additional data can be used to identify the signer, which may be useful for smart contracts, or for identifying who controls a key in a large organization: for example, you could store an IPv6 address or the identifier of a Hardware Security Module (HSM).

Without this amendment, the maximum signer list size is 8 entries, and each entry has exactly two fields, `Account` and `SignerWeight`.

With this amendment, the maximum [SignerList object][] size is 32 entries. Additionally, each `SignerEntry` object can contain an optional 256-bit (32-byte) `WalletLocator` field containing arbitrary data. This amendment changes the [SignerListSet transaction][] accordingly.


### FeeEscalation
[FeeEscalation]: #feeescalation

| Amendment    | FeeEscalation |
|:-------------|:--------------|
| Amendment ID | 42426C4D4F1009EE67080A9B7965B44656D7714D104A72F9B4369F97ABF044EE |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | Yes |

Changes the way the [transaction cost](../docs/concepts/transactions/transaction-cost.md) applies to proposed transactions. Modifies the consensus process to prioritize transactions that pay a higher transaction cost. <!-- STYLE_OVERRIDE: prioritize -->

This amendment introduces a fixed-size transaction queue for transactions that were not able to be included in the previous consensus round. If the `rippled` servers in the consensus network are under heavy load, they queue the transactions with the lowest transaction cost for later ledgers. Each consensus round prioritizes transactions from the queue with the largest transaction cost (`Fee` value), and includes as many transactions as the consensus network can process. If the transaction queue is full, transactions drop from the queue entirely, starting with the ones that have the lowest transaction cost.

While the consensus network is under heavy load, legitimate users can pay a higher transaction cost to make sure their transactions get processed. The situation persists until the entire backlog of cheap transactions is processed or discarded.

A transaction remains in the queue until one of the following happens:

* It gets applied to a validated ledger (regardless of success or failure)
* It becomes invalid (for example, the [`LastLedgerSequence`](../docs/references/protocol/transactions/common-fields.md) causes it to expire)
* It gets dropped because there are too many transactions in the queue with a higher transaction cost.


### fix1201
[fix1201]: #fix1201

| Amendment    | fix1201 |
|:-------------|:--------|
| Amendment ID | B4D44CC3111ADD964E846FC57760C8B50FFCD5A82C86A72756F6B058DDDF96AD |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | Yes |

Correctly implements a limit on [transfer fees](../docs/concepts/tokens/transfer-fees.md) to a 100% fee, represented by a maximum `TransferRate` value of `2000000000`. (A 100% fee in this case means you must send 2 units of the token for every 1 unit you want to deliver.) Without the amendment, the effective limit is a `TransferRate` value of 2<sup>32</sup>-1, for approximately a 329% fee.

With this amendment enabled, an [AccountSet][] transaction that attempts to set `TransferRate` higher than `2000000000` fails with the result code `temBAD_TRANSFER_RATE`. Any existing `TransferRate` which was set to a higher value under the previous rules continues to apply at the higher rate.


### fix1368
[fix1368]: #fix1368

| Amendment    | fix1368 |
|:-------------|:--------|
| Amendment ID | E2E6F2866106419B88C50045ACE96368558C345566AC8F2BDF5A5B5587F0E6FA |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | Yes |

Fixes a minor bug in transaction processing that causes some payments to fail when they should be valid. Specifically, during payment processing, some payment steps that are expected to produce a certain amount of currency may produce a microscopically different amount, due to a loss of precision related to floating-point number representation. When this occurs, those payments fail because they cannot deliver the exact amount intended. The fix1368 amendment corrects transaction processing so payments can no longer fail in this manner.


### fix1373
[fix1373]: #fix1373

| Amendment    | fix1373 |
|:-------------|:--------|
| Amendment ID | 42EEA5E28A97824821D4EF97081FE36A54E9593C6E4F20CBAE098C69D2E072DC |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | Yes |

Fixes a minor bug in transaction processing that causes failures when trying to prepare certain [payment paths](../docs/concepts/tokens/fungible-tokens/paths.md) for processing. As a result, payments could not use certain paths that should have been valid but were invalidly prepared. Without this amendment, those payments are forced to use less-preferable paths or may even fail.

The fix1373 amendment corrects the issue so that the paths are properly prepared and payments can use them. It also disables some inappropriate paths that are currently allowed, including paths whose [steps](../docs/concepts/tokens/fungible-tokens/paths.md#path-specifications) include conflicting fields and paths that loop through the same object more than once.


### fix1512
[fix1512]: #fix1512

| Amendment    | fix1512 |
|:-------------|:--------|
| Amendment ID | 6C92211186613F9647A89DFFBAB8F94C99D4C7E956D495270789128569177DA1 |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | Yes |

Fixes a bug in transaction processing that causes some invalid [PaymentChannelClaim][] transactions to fail with the wrong error code. Without this amendment, the transactions have a `tec`-class result code despite not being included in a ledger.

With this amendment, the transactions fail with a more appropriate result code, `temBAD_AMOUNT`, instead.


### fix1513
[fix1513]: #fix1513

| Amendment    | fix1513 |
|:-------------|:--------|
| Amendment ID | 67A34F2CF55BFC0F93AACD5B281413176FEE195269FA6D95219A2DF738671172 |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Fixes a bug that resulted in transaction processing not using new `STAmountCalcSwitchovers` code when the `FeeEscalation` amendment is enabled.

With this amendment, the new `STAmountCalcSwitchovers` code applies, which may cause slight changes to transaction processing due to calculation differences. Amounts may be rounded differently and offers may be executed in a different order as a result.


### fix1515
[fix1515]: #fix1515

| Amendment    | fix1515 |
|:-------------|:--------|
| Amendment ID | 5D08145F0A4983F23AFFFF514E83FAD355C5ABFBB6CAB76FB5BC8519FF5F33BE |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Changes how Payment transactions consume offers to remove a minor difference in how payment processing and offer processing consume liquidity. (Also affects how OfferCreate transactions are processed if [FlowCross][] is enabled.)

Without the amendment, payment processing gives up on using particular order books if the transaction would consume over 2000 offers at the same exchange rate. In this case, the payment does not use the liquidity from those offers, and does not consider that order book's remaining liquidity when attempting to complete the payment.

With this amendment, if any transaction processes over 1000 offers at the same exchange rate, the transaction consumes the liquidity from the first 1000 offers, then does not consider that order book's remaining liquidity when attempting to complete the payment.

In both cases, transaction processing can still complete by using liquidity from other paths or exchange rates.


### fix1523
[fix1523]: #fix1523

| Amendment    | fix1523 |
|:-------------|:--------|
| Amendment ID | B9E739B8296B4A1BB29BE990B17D66E21B62A300A909F25AC55C22D6C72E1F9D |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | Yes |

Adds tracking by destination account to [escrows](../docs/concepts/payment-types/escrow.md). Without this amendment, pending escrows are only tracked by sender. This amendment makes it possible to look up pending escrows by the destination address using the [account_objects method][], excluding any pending escrows that were created before this amendment became enabled. This amendment also makes [EscrowCreate transactions][] appear in the destination's transaction history, as viewed with the [account_tx method][].

With this amendment, new escrows are added to the [owner directories](../docs/references/protocol/ledger-data/ledger-entry-types/directorynode.md) of both the sender and receiver. This amendment also adds a new `DestinationNode` field to [Escrow ledger objects](../docs/references/protocol/ledger-data/ledger-entry-types/escrow.md), indicating which page of the destination's owner directory contains the escrow.


### fix1528
[fix1528]: #fix1528

| Amendment    | fix1528 |
|:-------------|:--------|
| Amendment ID | 1D3463A5891F9E589C5AE839FFAC4A917CE96197098A1EF22304E1BC5B98A454 |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | Yes |

Fixes a bug where validators could build consensus ledgers with different timestamps, potentially delaying the process of declaring validated ledgers. The circumstances for this to occur require precise timing, so this bug is unlikely to happen outside of controlled test conditions.

This amendment changes how validators negotiate the close time of the consensus ledger so that they cannot reach a consensus on ledger contents but build ledger versions with different timestamps.


### fix1543
[fix1543]: #fix1543

| Amendment    | fix1543 |
|:-------------|:--------|
| Amendment ID | CA7C02118BA27599528543DFE77BA6838D1B0F43B447D4D7F53523CE6A0E9AC2 |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Enforces reserved flag ranges on some transaction types that did not correctly enforce them already. Transactions of the affected types are now considered invalid if they enable undefined or unknown flags, or flags from the reserved range. (Transactions unaffected by this change already correctly enforce the same rules.)

Without this amendment, transactions of certain types are considered valid even when they have undefined or reserved flags enabled.

The affected transaction types are:

- Escrow transactions: [EscrowCancel][], [EscrowCreate][], and [EscrowFinish][]
- Payment Channel transactions: [PaymentChannelClaim][], [PaymentChannelCreate][], and [PaymentChannelFund][]


### fix1571
[fix1571]: #fix1571

| Amendment    | fix1571 |
|:-------------|:--------|
| Amendment ID | 7117E2EC2DBF119CA55181D69819F1999ECEE1A0225A7FD2B9ED47940968479C |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Changes Escrow to fix the following issues:

- Changes the [EscrowCreate transaction][] to require the `Condition` or `FinishAfter` field (or both). Escrows with neither `Condition` nor `FinishAfter` that were created before this amendment can be finished by anyone at any time before their `CancelAfter` time.
- Fixes a flaw that incorrectly prevents time-based Escrows from being finished in some circumstances.


### fix1578
[fix1578]: #fix1578

| Amendment    | fix1578 |
|:-------------|:--------|
| Amendment ID | FBD513F1B893AC765B78F250E6FFA6A11B573209D1842ADC787C850696741288 |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Changes the result codes returned by two transaction types:

- Changes the [OfferCreate transaction][] to return a new result code, `tecKILLED`, if the offer used the `tfFillOrKill` flag and was killed. Without this amendment, the offer is killed but the transaction result is `tesSUCCESS`.
- Changes the [TrustSet transaction][] to fail with `tecNO_PERMISSION` if it tries to enable the [No Ripple flag](../docs/concepts/tokens/fungible-tokens/rippling.md#the-no-ripple-flag) but cannot because the trust line has a negative balance. Without this amendment, the transaction does not enable the No Ripple flag, but the transaction result is `tesSUCCESS` nonetheless.


### fix1623
[fix1623]: #fix1623

| Amendment    | fix1623 |
|:-------------|:--------|
| Amendment ID | 58BE9B5968C4DA7C59BA900961828B113E5490699B21877DEF9A31E9D0FE5D5F |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Adds delivered amount to metadata for CheckCash transactions cashed for a flexible amount. (Has no effect unless the [Checks](#checks) amendment is enabled.)

With this amendment enabled, transaction processing adds a `DeliveredAmount` field to the metadata of [CheckCash transactions][] for a variable amount (using the `DeliverMin` field). This change is written to the ledger data, resulting in a different ledger hash than would result from processing the transaction without this amendment. It does not affect the actual amounts delivered. Additionally, with this amendment enabled, the [tx method][] and [account_tx method][] return a [`delivered_amount` field](../docs/references/protocol/transactions/metadata.md#delivered_amount) for CheckCash transactions. (The `delivered_amount` field is calculated when you look up a transaction, and is not part of the data that is written to the ledger.)

The fix1623 amendment has no effect on [CheckCash transactions][] for a fixed amount (using the `Amount` field) or any other transaction types.


### fix1781
[fix1781]: #fix1781

| Amendment    | fix1781 |
|:-------------|:--------|
| Amendment ID | 25BA44241B3BD880770BFA4DA21C7180576831855368CBEC6A3154FDE4A7676E |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Fixes a bug where certain XRP endpoints were not checked when detecting circular paths.

Without this amendment, it is possible to have a [payment path](../docs/concepts/tokens/fungible-tokens/paths.md) where the input to the path is XRP, and an intermediate path step also outputs XRP. This is a "loop" payment, and the payment engine disallows such paths because they can have different results when executed forward compared to backwards.

With this amendment, those payments fail with the [`temBAD_PATH_LOOP` result code](../docs/references/protocol/transactions/transaction-results/tem-codes.md) instead.


### fixAmendmentMajorityCalc
[fixAmendmentMajorityCalc]: #fixamendmentmajoritycalc

| Amendment    | fixAmendmentMajorityCalc |
|:-------------|:-------------------------|
| Amendment ID | 4F46DF03559967AC60F2EB272FEFE3928A7594A45FF774B87A7E540DB0F8F068 |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Fixes a bug that could cause an amendment to achieve a majority and later activate with support of slightly less than 80% of trusted validators due to rounding semantics.

Without this amendment, the minimum threshold for amendment activation is any value that rounds to 204/256 of trusted validators, which depends on the number of trusted validators at the time. For example, an amendment could activate with exactly 28 out of 36 validators (approximately 77.8%). With this amendment, the actual minimum number of validators needed is never less than 80% of trusted validators.


### fixAMMOverflowOffer
[fixAMMOverflowOffer]: #fixammoverflowoffer

| Amendment    | fixAMMOverflowOffer |
|:-------------|:--------------------|
| Amendment ID | 12523DF04B553A0B1AD74F42DDB741DE8DC06A03FC089A0EF197E2A87F1D8107 |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

This amendment fixes the improper handling of large synthetic AMM offers in the payment engine. Due to the importance of this fix, the default vote in the source code has been set to YES.


### fixAMMv1_1
[fixAMMv1_1]: #fixammv1_1

| Amendment    | fixAMMv1_1 |
|:-------------|:-----------|
| Amendment ID | 35291ADD2D79EB6991343BDA0912269C817D0F094B02226C1C14AD2858962ED4 |
| Status       | Open for Voting |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

Fixes AMM offer rounding and low quality order book offers from blocking the AMM.


### fixCheckThreading
[fixCheckThreading]: #fixcheckthreading

| Amendment    | fixCheckThreading |
|:-------------|:------------------|
| Amendment ID | 8F81B066ED20DAECA20DF57187767685EEF3980B228E0667A650BAF24426D3B4 |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Changes the way Checks transactions affect account metadata, so that Checks are properly added to the [account](../docs/concepts/accounts/index.md) history of the receiving account. (Specifically, they update the `PreviousTxnID` and `PreviousTxnLedgerSeq` fields of the receiving account's [AccountRoot object](../docs/references/protocol/ledger-data/ledger-entry-types/accountroot.md), which can be used to trace the "thread" of transactions that affected the account and the objects it owns.)

Without this amendment, Checks transactions ([CheckCreate][], [CheckCash][], and [CheckCancel][]) only update the account history of the sender. With this amendment, those transactions affect both the sending and receiving accounts. This amendment has no effect unless the [Checks amendment](#checks) is also enabled.


### fixDisallowIncomingV1
[fixDisallowIncomingV1]: #fixdisallowincomingv1

| Amendment    | fixDisallowIncomingV1 |
|:-------------|:----------------------|
| Amendment ID | 15D61F0C6DB6A2F86BCF96F1E2444FEC54E705923339EC175BD3E517C8B3FF91 |
| Status       | Enabled |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

This amendment fixes an issue with approving trustlines after a user enables the `lsfDisallowIncomingTrustline` flag on their account.

To recreate this issue:

1. An issuer sets `asfRequireAuth` on their account.
2. The user sets `asfDisallowIncomingTrustline` on their account.
3. The user submits a `SetTrust` transaction to the issuer.
4. The issuer is unable to authorize the trustline.

With this amendment, the issuer can now authorize the trustline.

This amendment has no effect unless the [DisallowIncoming][] amendment is enabled.


### fixEmptyDID
[fixEmptyDID]: #fixemptydid

| Amendment    | fixEmptyDID |
|:-------------|:------------|
| Amendment ID | 755C971C29971C9F20C6F080F2ED96F87884E40AD19554A5EBECDCEC8A1F77FE |
| Status       | Open for Voting |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

This amendment adds an additional check to prevent empty DID ledger entries from being created.

With this amendment, if a transaction would create an empty DID, it returns the new error code `tecEMPTY_DID` instead.

Without this amendment, an empty DID can be created, which takes up space and counts towards the owner reserve but does nothing useful.

This amendment has no effect unless the [DID][] amendment is enabled.



### fixFillOrKill
[fixFillOrKill]: #fixfillorkill

| Amendment    | fixFillOrKill |
|:-------------|:--------------|
| Amendment ID | 3318EA0CF0755AF15DAC19F2B5C5BCBFF4B78BDD57609ACCAABE2C41309B051A |
| Status       | Enabled |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

This amendment fixes an issue introduced in the `FlowCross` amendment. Offers with the `tfFillOrKill` flag set and `tfSell` not set will fail if the exchange rate on the offer is better than, but doesn't exactly match, the order book rate.

This amendment enables the payment engine to properly handle this scenario and allow offers to cross.

This amendment has no effect unless the [FlowCross][] amendment is enabled.


### fixInnerObjTemplate

[fixInnerObjTemplate]: #fixinnerobjtemplate

| Amendment    | fixInnerObjTemplate |
|:-------------|:--------------------|
| Amendment ID | C393B3AEEBF575E475F0C60D5E4241B2070CC4D0EB6C4846B1A07508FAEFC485 |
| Status       | Enabled |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

This amendment fixes an issue with accessing the AMM `sfTradingFee` and `sfDiscountedFee` fields in the inner objects of `sfVoteEntry` and `sfAuctionSlot`.

Currently, the inner object template isn't set upon object creation. If the object contains an `soeDEFAULT` field and is initially set to the default value, accessing the field results in a `tefEXCEPTION` error in some circumstances. This amendment adds an `STObject` constructor overload that includes an additional boolean argument to set the inner object template.


### fixMasterKeyAsRegularKey
[fixMasterKeyAsRegularKey]: #fixmasterkeyasregularkey

| Amendment    | fixMasterKeyAsRegularKey |
|:-------------|:-------------------------|
| Amendment ID | C4483A1896170C66C098DEA5B0E024309C60DC960DE5F01CD7AF986AA3D9AD37 |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Fixes a bug where accounts can set their regular key pair to match their master key pair, but cannot send transactions signed by the key if the master key is disabled.

Without this fix, a user can unintentionally "black hole" their account by setting the regular key to match the master key, then disabling the master key. The network rejects transactions signed with the both-master-and-regular key pair because the code interprets them as being signed with the disabled master key before it recognizes that they are signed by the currently-enabled regular key.

With this amendment enabled, a SetRegularKey transaction cannot set the regular key to match the master key; such a transaction results in the transaction code `temBAD_REGKEY`. Additionally, this amendment changes the signature verification code so that accounts which _already_ have their regular key set to match their master key can send transactions successfully using the key pair.


### fixNFTokenDirV1
[fixNFTokenDirV1]: #fixnftokendirv1

| Amendment    | fixNFTokenDirV1 |
|:-------------|:----------------|
| Amendment ID | 0285B7E5E08E1A8E4C15636F0591D87F73CB6A7B6452A932AD72BBC8E5D1CBE3 |
| Status       | Obsolete |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

This amendment fixes an off-by-one error that occurred in some corner cases when determining which `NFTokenPage` a `NFToken` object belongs on. It also adjusts the constraints of `NFTokenPage` invariant checks, so that certain error cases fail with a suitable error code such as `tecNO_SUITABLE_TOKEN_PAGE` instead of failing with a `tecINVARIANT_FAILED` error code.

This amendment has no effect unless the [NonFungibleTokensV1][] amendment is enabled. This amendment is obsolete because its effects are included as part of [NonFungibleTokensV1_1][].


### fixNFTokenNegOffer
[fixNFTokenNegOffer]: #fixnftokennegoffer

| Amendment    | fixNFTokenNegOffer |
|:-------------|:-------------------|
| Amendment ID | 36799EA497B1369B170805C078AEFE6188345F9B3E324C21E9CA3FF574E3C3D6 |
| Status       | Obsolete |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

This amendment fixes a bug in the [NonFungibleTokensV1][] amendment code where NFTs could be traded for negative amounts of money. Without this fix, users could place and accept an offer to buy or sell a `NFToken` for a negative amount of money, which resulted in the person "buying" the NFT also receiving money from the "seller". With this amendment, NFT offers for negative amounts are considered invalid.

This amendment has no effect unless the [NonFungibleTokensV1][] amendment is enabled. This amendment is obsolete because its effects are included as part of [NonFungibleTokensV1_1][].


### fixNFTokenRemint
[fixNFTokenRemint]: #fixnftokenremint

| Amendment    | fixNFTokenRemint |
|:-------------|:-----------------|
| Amendment ID | AE35ABDEFBDE520372B31C957020B34A7A4A9DC3115A69803A44016477C84D6E |
| Status       | Enabled |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

Amendment `fixNFTokenRemint` would change the way NFT sequence numbers are constructed to prevent a situation where the same NFT could be minted more than once with the same sequence number, creating a possible collision scenario. This amendment would change the construction of NFT sequence numbers to:

- Create a new `AccountRoot` field, `FirstNFTSequence`, that stays constant over time. This field is set to the current account sequence when the account issues its first NFT. Otherwise, it is not set.

- Compute the sequence of a newly minted NFT as `FirstNFTSequence` + `MintedNFTokens` (after which, `MintedNFTokens` increments by 1).

The amendment also introduces a new account deletion restriction. An account can only be deleted if `FirstNFTSequence` + `MintedNFTokens` + 256 is less than the current ledger sequence (256 was chosen as a heuristic restriction for account deletion and already exists in the account deletion constraint). Without this restriction, an NFT could still be re-minted under certain conditions.

**Warning:** This is a **breaking change** for projects & tools relying on their own locally computed NFTokenID for minted tokens. If you have code to calculate NFTokenIDs, you must update it to match the new fomula. For an example of how to do so with backwards compatibility, see this [well known reference implementation in JavaScript](https://gist.github.com/N3TC4T/a20fb528931ed009ebdd708be4938748?permalink_comment_id=4738760#gistcomment-4738760).


### fixNFTokenReserve

[fixNFTokenReserve]: #fixnftokenreserve

| Amendment    | fixNFTokenReserve |
|:-------------|:------------------|
| Amendment ID | 03BDC0099C4E14163ADA272C1B6F6FABB448CC3E51F522F978041E4B57D9158C |
| Status       | Enabled |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

This amendment adds a check to the `NFTokenAcceptOffer` transactor to see if the `OwnerCount` changes. If it does, it makes an additional check that the reserve requirement is met for the updated owner count.


### fixNonFungibleTokensV1_2
[fixNonFungibleTokensV1_2]: #fixnonfungibletokensv1_2

| Amendment    | fixNonFungibleTokensV1_2 |
|:-------------|:-------------------------|
| Amendment ID | 73761231F7F3D94EC3D8C63D91BDD0D89045C6F71B917D1925C01253515A6669 |
| Status       | Enabled |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

Amendment `fixNonFungibleTokensV1_2` is a combination of bug fixes that have been individually merged into feature/nft-fixes through the pull request process.

**Fix Unburnable NFT**

Currently, an NFT cannot be burned when it has over 500 offers. To remove this restriction, this change deletes exactly 500 offers upon burning the NFT, leaving any remaining offers untouched. This addresses a concern where the issuer account cannot burn an NFT that has enabled the `lsfBurnable` flag, due to the exceeding number of offers.

See [PR 4346](https://github.com/XRPLF/rippled/pull/4346).

**Fix 3 Issues Around NFToken Offer Acceptance**

Issue 1: Resolve situation where an account is unable to broker a deal due to an erroneous insufficient funds condition.

Issue 2: Resolve situation where a buyer has insufficient funds to cover a transfer fee on the account.

Issue 3: Enable currency issuers to buy and sell NFTs using their own currency.

See [PR 4380](https://github.com/XRPLF/rippled/pull/4380).

**Prevent Brokered Sale of NFToken to Owner (fix #4374)**

This fix prevents a broker from selling an NFT to the account that already owns the token.

See [Issue 4374](https://github.com/XRPLF/rippled/issues/4374).

**Only allow the destination to settle an NFT offer through brokerage (fix #4373)**

If you set a destination on an NFT offer, only that destination can settle through brokerage (fix #4373).

See [Issue 4373](https://github.com/XRPLF/rippled/issues/4373).


### fixPayChanRecipientOwnerDir
[fixPayChanRecipientOwnerDir]: #fixpaychanrecipientownerdir

| Amendment    | fixPayChanRecipientOwnerDir |
|:-------------|:----------------------------|
| Amendment ID | 621A0B264970359869E3C0363A899909AAB7A887C8B73519E4ECF952D33258A8 |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Changes the [PaymentChannelCreate transaction][] type so that it adds new [payment channels](../docs/concepts/payment-types/payment-channels.md) to the recipient's [owner directory](../docs/references/protocol/ledger-data/ledger-entry-types/directorynode.md). Without this amendment, new payment channels are added only to the sender's owner directory; with this amendment enabled, newly-created payment channels are added to both owner directories. Existing payment channels are unchanged.

This change prevents accounts from being deleted if they are the recipient for open payment channels, except for channels created before this amendment.


### fixPreviousTxnID
[fixPreviousTxnID]: #fixprevioustxnid

| Amendment    | fixPreviousTxnID |
|:-------------|:-----------------|
| Amendment ID | 7BB62DC13EC72B775091E9C71BF8CF97E122647693B50C5E87A80DFD6FCFAC50 |
| Status       | Open for Voting |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

This amendment adds `PreviousTxnID` and `PreviousTxnLgrSequence` fields to ledger entries that did not already have them, namely `DirectoryNode`, `Amendments`, `FeeSettings`, `NegativeUNL`, and `AMM`.

Ledger entries that were created before this amendment was enabled will get the new fields whenever a transaction modifies those entries.

Without this amendment, some types of ledger entries don't have those fields, which makes it harder to trace the history of modifications to those ledger entries.


### fixQualityUpperBound
[fixQualityUpperBound]: #fixqualityupperbound

| Amendment    | fixQualityUpperBound |
|:-------------|:---------------------|
| Amendment ID | 89308AF3B8B10B7192C4E613E1D2E4D9BA64B2EE2D5232402AE82A6A7220D953 |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Fixes a bug in unused code for estimating the ratio of input to output of individual steps in cross-currency payments.

This amendment has no known impact on transaction processing.


### fixReducedOffersV1
[fixReducedOffersV1]: #fixreducedoffersv1

| Amendment    | fixReducedOffersV1 |
|:-------------|:-------------------|
| Amendment ID | 27CD95EE8E1E5A537FF2F89B6CEB7C622E78E9374EBD7DCBEDFAE21CD6F16E0A |
| Status       | Enabled |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

Adjusts rounding to prevent order books from being blocked by reduced offers whose exchange rate is affected by rounding of the remaining amounts.

In general, offers can be _reduced_ in 3 ways:

- The offer can be partially consumed when it is placed.
- The offer can be partially consumed after being placed into an order book.
- The offer can be under-funded, meaning its owner has less funds than it specifies.

With this amendment, the exchange rate of a reduced offer is rounded such that it is as good or better than the original offer (from the taker's perspective). This allows the reduced offer to be consumed by offers that would have matched the original, full amounts. The rounded amount is no more than 1 drop of XRP or 1e-81 of a token.

Without this amendment, an offer with very small amounts remaining can have a a much worse exchange rate after rounding than it had initially. This can cause an offer for very small amounts to "block" better offers in the same order book from being taken.


### fixRemoveNFTokenAutoTrustLine
[fixRemoveNFTokenAutoTrustLine]: #fixremovenftokenautotrustline

| Amendment    | fixRemoveNFTokenAutoTrustLine |
|:-------------|:------------------------------|
| Amendment ID | DF8B4536989BDACE3F934F29423848B9F1D76D09BE6A1FCFE7E7F06AA26ABEAD |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Removes the `tfTrustLine` setting on [non-fungible tokens](../docs/concepts/tokens/nfts/index.md), to protect against a denial of service attack on issuers using this flag. With this amendment enabled, a [NFTokenMint transaction](../docs/references/protocol/transactions/types/nftokenmint.md) with the `tfTrustLine` flag enabled is considered invalid and cannot be confirmed by consensus; new `NFToken` objects cannot be minted with the flag.

Without this amendment, an attacker could create new, meaningless fungible tokens and sell a `NFToken` back and forth for those tokens, creating many useless trust lines tied to the issuer and increasing the issuer's reserve requirement.

This amendment does not change the code for `NFToken` objects that have already been minted. On test networks that enabled NFT support before this amendment, issuers who have already minted NFTokens with the `tfTrustLine` flag enabled are still vulnerable to the exploit even after the fixRemoveNFTokenAutoTrustLine amendment.

This amendment has no effect unless either [NonFungibleTokensV1][] or [NonFungibleTokensV1_1][] is enabled. To protect issuers, this amendment should be enabled _before_ [NonFungibleTokensV1][] or [NonFungibleTokensV1_1][].


### fixRmSmallIncreasedQOffers
[fixRmSmallIncreasedQOffers]: #fixrmsmallincreasedqoffers

| Amendment    | fixRmSmallIncreasedQOffers |
|:-------------|:---------------------------|
| Amendment ID | B6B3EEDC0267AB50491FDC450A398AF30DBCD977CECED8BEF2499CAB5DAC19E2 |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

This amendment fixes an issue where certain Offers, when almost completely consumed, have a much lower exchange rate than when they were first placed. This occurs when the remaining amounts of one or both assets are so small that they cannot be rounded to a similar ratio as when the Offer was placed.

Without this amendment, an Offer in this state blocks Offers with better rates deeper in the order book and causes some payments and Offers to fail when they could have succeeded.

With this amendment, payments and trades can remove these types of Offers the same way that transactions normally remove fully consumed or unfunded Offers.


### fixSTAmountCanonicalize
[fixSTAmountCanonicalize]: #fixstamountcanonicalize

| Amendment    | fixSTAmountCanonicalize |
|:-------------|:------------------------|
| Amendment ID | 452F5906C46D46F407883344BFDD90E672B672C5E9943DB4891E3A34FEEEB9DB |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Fixes an edge case in [deserializing](../docs/references/protocol/binary-format.md) Amount-type fields. Without this amendment, in some rare cases the operation could result in otherwise valid serialized amounts overflowing during deserialization. With this amendment, the XRP Ledger detects error conditions more quickly and eliminates the problematic corner cases.


### fixTakerDryOfferRemoval
[fixTakerDryOfferRemoval]: #fixtakerdryofferremoval

| Amendment    | fixTakerDryOfferRemoval |
|:-------------|:------------------------|
| Amendment ID | 2CD5286D8D687E98B41102BDD797198E81EA41DF7BD104E6561FEB104EFF2561 |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Fixes a bug in [auto-bridging](../docs/concepts/tokens/decentralized-exchange/autobridging.md) that can leave a dry offer in the XRP Ledger. A dry offer is an offer that, if crossed, cannot yield any funds.

Without this fix, the dry offer remains on the ledger and counts toward its owner's [reserve requirement](../docs/concepts/accounts/reserves.md#owner-reserves) without providing any benefit to the owner. Another offer crossing of the right type and quality can remove the dry offer. However, if the required offer crossing type and quality are rare, it may take a while for the dry offer to be removed.

With this amendment enabled, the XRP Ledger removes these dry offers when they're matched in auto-bridging.


### fixTrustLinesToSelf
[fixTrustLinesToSelf]: #fixtrustlinestoself

| Amendment    | fixTrustLinesToSelf |
|:-------------|:--------------------|
| Amendment ID | F1ED6B4A411D8B872E65B9DCB4C8B100375B0DD3D62D07192E011D6D7F339013 |
| Status       | Enabled |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

This amendment removes two trust lines from an account to itself that were created due to an old bug (both on 2013-05-07). When the amendment becomes enabled, it deletes trust lines with the IDs `2F8F21EFCAFD7ACFB07D5BB04F0D2E18587820C7611305BB674A64EAB0FA71E1` and `326035D5C0560A9DA8636545DD5A1B0DFCFF63E68D491B5522B767BB00564B1A` if they exist. After doing so, the amendment does nothing else.

On test networks that do not have these trust lines, the amendment has no effect.


### fixUniversalNumber
[fixUniversalNumber]: #fixuniversalnumber

| Amendment    | fixUniversalNumber |
|:-------------|:-------------------|
| Amendment ID | 2E2FB9CF8A44EB80F4694D38AADAE9B8B7ADAFD2F092E10068E61C98C4F092B0 |
| Status       | Enabled |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

Simplifies and unifies the code for decimal floating point math. In some cases, this provides slightly better accuracy than the previous code, resulting in calculations whose least significant digits are different than when calculated with the previous code. The different results may cause other edge case differences where precise calculations are used, such as ranking of Offers or processing of payments that use several different paths.

Without this amendment, the code continues to use separate calculations for `STAmount` and `IOUAmount` objects, and [Automated Market Maker (XLS-30d)](https://github.com/XRPLF/XRPL-Standards/discussions/78) uses a third class for calculations.


### fixXChainRewardRounding
[fixXChainRewardRounding]: #fixxchainrewardrounding

| Amendment    | fixXChainRewardRounding |
|:-------------|:------------------------|
| Amendment ID | 2BF037D90E1B676B17592A8AF55E88DB465398B4B597AE46EECEE1399AB05699 |
| Status       | Open for Voting |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

This amendment ensures that reward shares for cross-chain transactions are always rounded down. This preserves the original intended behavior.

Without this amendment, the [XChainBridge][] amendment has an incompatibility with the [fixUniversalNumber][] amendment. When those two amendments are both enabled, the `Number` type may be used for some intermediate calculations of token amounts. In some cases, values that used to round down instead are rounded to nearest, which alters the intended rounding behavior for reward shares in cross-chain transactions.

This amendment restores the intended rounding behavior. It has no effect unless both the [XChainBridge][] and [fixUniversalNumber][] amendments are also enabled.


### Flow
[Flow]: #flow

| Amendment    | Flow |
|:-------------|:-----|
| Amendment ID | 740352F2412A9909880C23A559FCECEDA3BE2126FED62FC7660D628A06927F11 |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Replaces the payment processing engine with a more robust and efficient rewrite called the Flow engine. The new version of the payment processing engine is intended to follow the same rules as the old one, but occasionally produces different results due to floating point rounding. This Amendment supersedes the [FlowV2](https://xrpl.org/blog/2016/flowv2-vetoed.html) amendment.

The Flow Engine also makes it easier to improve and expand the payment engine with further Amendments.


### FlowCross
[FlowCross]: #flowcross

| Amendment    | FlowCross |
|:-------------|:----------|
| Amendment ID | 3012E8230864E95A58C60FD61430D7E1B4D3353195F2981DC12B0C7C0950FFAC |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Streamlines the offer crossing logic in the XRP Ledger's decentralized exchange. Uses the updated code from the [Flow](#flow) amendment to power offer crossing, so [OfferCreate transactions][] and [Payment transactions][] share more code. This has subtle differences in how offers are processed:

- Rounding is slightly different in some cases.
- Due to differences in rounding, some combinations of offers may be ranked higher or lower than by the old logic, and taken preferentially.
- The new logic may delete more or fewer offers than the old logic. (This includes cases caused by differences in rounding and offers that were incorrectly removed as unfunded by the old logic.)


### FlowSortStrands
[FlowSortStrands]: #flowsortstrands

| Amendment    | FlowSortStrands |
|:-------------|:----------------|
| Amendment ID | AF8DF7465C338AE64B1E937D6C8DA138C0D63AD5134A68792BBBE1F63356C422 |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Improves the payment engine's calculations for finding the most cost-efficient way to execute a cross-currency transaction.

Without this change, the engine simulates a payment through each possible path to calculate the quality (ratio of input to output) of each path. With this change, the engine calculates the theoretical quality of each path without simulating a full payment. With this amendment, the payment engine executes some cross-currency payments much faster, is able to find the most cost-efficient path in more cases, and can enable some payments to succeed in certain conditions where the old payment engine would fail to find enough liquidity.


### FlowV2
[FlowV2]: #flowv2

| Amendment    | FlowV2 |
|:-------------|:-------|
| Amendment ID | 5CC22CFF2864B020BD79E0E1F048F63EF3594F95E650E43B3F837EF1DF5F4B26 |
| Status       | Obsolete |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

This is a previous version of the [Flow](#flow) amendment. It was [rejected due to a bug](https://xrpl.org/blog/2016/flowv2-vetoed.html) and removed in version 0.33.0.


### HardenedValidations
[HardenedValidations]: #hardenedvalidations

| Amendment    | HardenedValidations |
|:-------------|:--------------------|
| Amendment ID | 1F4AFA8FA1BC8827AD4C0F682C03A8B671DCDF6B5C4DE36D44243A684103EF88 |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Allows validators to include a new optional field in their validations to attest to the hash of the latest ledger that the validator considers to be fully validated. The consensus process can use this information to increase the robustness of consensus.


### Hooks
[Hooks]: #hooks

| Amendment    | Hooks |
|:-------------|:------|
| Amendment ID | ECE6819DBA5DB528F1A241695F5A9811EF99467CDE22510954FD357780BBD078 |
| Status       | In Development |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

Adds on-chain smart contracts in the form of small pieces of code that can run on an account before or after transactions. For more information, see the [Hooks Documentation](https://xrpl-hooks.readme.io/).


### ImmediateOfferKilled
[ImmediateOfferKilled]: #immediateofferkilled

| Amendment    | ImmediateOfferKilled |
|:-------------|:---------------------|
| Amendment ID | 75A7E01C505DD5A179DFE3E000A9B6F1EDDEB55A12F95579A23E15B15DC8BE5A |
| Status       | Enabled |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

Changes OfferCreate transactions so that if an Offer uses `tfImmediateOrCancel` and transaction processing kills the Offer without moving any funds, the transaction uses the result code `tecKILLED` instead of `tesSUCCESS`. If the Offer exchanges any amount of funds, even a small amount, the transaction still uses `tesSUCCESS`. There are no other changes to the processing of the transaction (for example, in terms of whether it cleans up expired and unfunded Offers that were encountered in the ledger during transaction processing).

Without this amendment, "Immediate or Cancel" Offers that failed to move any funds returned a `tesSUCCESS` result code, which could be confusing because the transaction effectively did nothing.


### MultiSign
[MultiSign]: #multisign

| Amendment    | MultiSign |
|:-------------|:----------|
| Amendment ID | 4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373 |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | Yes |

Introduces [multi-signing](../docs/concepts/accounts/multi-signing.md) as a way to authorize transactions. Creates the [`SignerList` ledger object type](../docs/references/protocol/ledger-data/ledger-entry-types/signerlist.md) and the [`SignerListSet` transaction type](../docs/references/protocol/transactions/types/signerlistset.md). Adds the optional `Signers` field to all transaction types. Modifies some transaction result codes.

This amendment allows addresses to have a list of signers who can authorize transactions from that address in a multi-signature. The list has a quorum and 1 to 8 weighted signers. This allows various configurations, such as "any 3-of-5" or "signature from A plus any other two signatures."

Signers can be funded or unfunded addresses. Funded addresses in a signer list can sign using a regular key (if defined) or master key (unless disabled). Unfunded addresses can sign with a master key. Multi-signed transactions have the same permissions as transactions signed with a regular key.

An address with a SignerList can disable the master key even if a regular key is not defined. An address with a SignerList can also remove a regular key even if the master key is disabled. The `tecMASTER_DISABLED` transaction result code is renamed `tecNO_ALTERNATIVE_KEY`. The `tecNO_REGULAR_KEY` transaction result is retired and replaced with `tecNO_ALTERNATIVE_KEY`. Additionally, this amendment adds the following new [transaction result codes](../docs/references/protocol/transactions/transaction-results/index.md):

* `temBAD_SIGNER`
* `temBAD_QUORUM`
* `temBAD_WEIGHT`
* `tefBAD_SIGNATURE`
* `tefBAD_QUORUM`
* `tefNOT_MULTI_SIGNING`
* `tefBAD_AUTH_MASTER`


### MultiSignReserve
[MultiSignReserve]: #multisignreserve

| Amendment    | MultiSignReserve |
|:-------------|:-----------------|
| Amendment ID | 586480873651E106F1D6339B0C4A8945BA705A777F3F4524626FF1FC07EFE41D |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Reduces the [owner reserve](../docs/concepts/accounts/reserves.md#owner-reserves) counted against your XRP Ledger account when it owns a [multi-signing](../docs/concepts/accounts/multi-signing.md) SignerList.

Without this amendment, the owner reserve for a SignerList ranges from 15 to 50 XRP, depending on the number of signers in the list.

With this amendment enabled, the owner reserve for a new SignerList is 5 XRP, regardless of the number of signers. The reserve requirement for previously-created SignerList objects remains unchanged. To reduce the reserve requirement of SignerList objects created before this amendment was enabled, use a [SignerListSet transaction](../docs/references/protocol/transactions/types/signerlistset.md) to replace the SignerList after this amendment has been enabled. (The replacement can be the same as the previous version.)


### NegativeUNL
[NegativeUNL]: #negativeunl

| Amendment    | NegativeUNL |
|:-------------|:------------|
| Amendment ID | B4E4F5D2D6FB84DF7399960A732309C9FD530EAE5941838160042833625A6076 |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Implements a "Negative UNL" system, where the network can track which validators are temporarily offline and disregard those validators for quorum calculations. This can improve the ability of the network to make progress during periods of network instability.


### NonFungibleTokensV1
[NonFungibleTokensV1]: #nonfungibletokensv1

| Amendment    | NonFungibleTokensV1 |
|:-------------|:--------------------|
| Amendment ID | 3C43D9A973AA4443EF3FC38E42DD306160FBFFDAB901CD8BAA15D09F2597EB87 |
| Status       | Obsolete |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

Adds native support for [non-fungible tokens](../docs/concepts/tokens/nfts/index.md). Standards Draft: [XLS-20d](https://github.com/XRPLF/XRPL-Standards/discussions/46). <!-- SPELLING_IGNORE: xls, 20d -->

**Warning:** There are several known issues with this amendment including one that can cause `tecINVARIANT_FAILED` errors to appear in the ledger. It has been replaced by the [NonFungibleTokensV1_1 amendment][].

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


### NonFungibleTokensV1_1
[NonFungibleTokensV1_1]: #nonfungibletokensv1_1

| Amendment    | NonFungibleTokensV1_1 |
|:-------------|:----------------------|
| Amendment ID | 32A122F1352A4C7B3A6D790362CC34749C5E57FCE896377BFDC6CCD14F6CD627 |
| Status       | Enabled |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

Adds native support for [non-fungible tokens](../docs/concepts/tokens/nfts/index.md), including fixes to several issues that were discovered after [NonFungibleTokensV1][].

This amendment combines the effects of the following amendments, rendering the individual amendments obsolete:

- [NonFungibleTokensV1][]
- [fixNFTokenNegOffer][]
- [fixNFTokenDirV1][]

It has no other effects.

**Caution:** The [fixRemoveNFTokenAutoTrustLine][] fixes an known issue with this amendment. When creating a new test network, you should make sure that these amendments should be enabled together or the fix amendment is enabled first.


### OwnerPaysFee
[OwnerPaysFee]: #ownerpaysfee

| Amendment    | OwnerPaysFee |
|:-------------|:-------------|
| Amendment ID | 9178256A980A86CF3D70D0260A7DA6402AAFE43632FDBCB88037978404188871 |
| Status       | In Development |
| Default Vote (Latest stable release) | N/A |
| Pre-amendment functionality retired? | No |

Fixes an inconsistency in the way [transfer fees](../docs/concepts/tokens/transfer-fees.md) are calculated between [OfferCreate](../docs/references/protocol/transactions/types/offercreate.md) and [Payment](../docs/references/protocol/transactions/types/payment.md) transaction types. Without this amendment, the holder of the token pays the transfer fee if an offer is executed in offer placement, but the initial sender of a transaction pays the transfer fees for offers that are executed as part of payment processing. With this amendment, the holder of the token always pays the transfer fee, regardless of whether the offer is executed as part of a Payment or an OfferCreate transaction. Offer processing outside of payments is unaffected.

This Amendment requires the [Flow Amendment](#flow) to be enabled.

**Note:** An incomplete version of this amendment was introduced in v0.33.0 and removed in v0.80.0. (It was never enabled.)


### PayChan
[PayChan]: #paychan

| Amendment    | PayChan |
|:-------------|:--------|
| Amendment ID | 08DE7D96082187F6E6578530258C77FAABABE4C20474BDB82F04B021F1A68647 |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | Yes |

Creates "Payment Channels" for XRP. Payment channels are a tool for facilitating repeated, unidirectional payments or temporary credit between two parties. This feature is expected to be useful for the [Interledger Protocol](https://interledger.org/). One party creates a Payment Channel and sets aside some XRP in that channel for a predetermined expiration. Then, through off-ledger secure communications, the sender can send "Claim" messages to the receiver. The receiver can redeem the Claim messages before the expiration, or choose not to in case the payment is not needed. The receiver can verify Claims individually without actually distributing them to the network and waiting for the consensus process to redeem them, then redeem the combined content of many small Claims later, as long as it is within the expiration.

Creates three new transaction types: [PaymentChannelCreate][], [PaymentChannelClaim][], and [PaymentChannelFund][]. Creates a new ledger object type, [PayChannel](../docs/references/protocol/ledger-data/ledger-entry-types/paychannel.md). Defines an off-ledger data structure called a `Claim`; the PaymentChannelClaim uses a signature for this data structure. Creates new `rippled` API methods: [`channel_authorize`](../docs/references/http-websocket-apis/public-api-methods/payment-channel-methods/channel_authorize.md) (creates a signed Claim), [`channel_verify`](../docs/references/http-websocket-apis/public-api-methods/payment-channel-methods/channel_verify.md) (verifies a signed Claim), and [`account_channels`](../docs/references/http-websocket-apis/public-api-methods/account-methods/account_channels.md) (lists Channels associated with an account).

For more information, see the [Payment Channels Tutorial](../docs/tutorials/how-tos/use-specialized-payment-types/use-payment-channels/index.md).


### PriceOracle
[PriceOracle]: #priceoracle

| Amendment    | PriceOracle |
|:-------------|:------------|
| Amendment ID | 96FD2F293A519AE1DB6F8BED23E4AD9119342DA7CB6BAFD00953D16C54205D8B |
| Status       | Open for Voting |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

This amendment adds a "Price Oracle" feature to the XRP Ledger, as defined in the [XLS-47 specification](https://github.com/XRPLF/XRPL-Standards/blob/master/XLS-47d-PriceOracles/README.md). A blockchain oracle is a system where a service provides to the blockchain about the outside world, which can then be used by decentralized applications (dApps) that run primarily on or using the blockchain. This price oracle is intended to store pricing information about asset pairs that exist outside of the XRP Ledger so that smart contracts that rely on the XRP Ledger can use this information.

This amendment creates a new ledger entry type, `PriceOracle`, and new transactions, `OracleSet` (creates or modifies oracle data) and `OracleDelete` (deletes a given oracle).


### RequireFullyCanonicalSig
[RequireFullyCanonicalSig]: #requirefullycanonicalsig

| Amendment    | RequireFullyCanonicalSig |
|:-------------|:-------------------------|
| Amendment ID | 00C1FC4A53E60AB02C864641002B3172F38677E29C26C5406685179B37E1EDAC |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

Changes the signature requirements for the XRP Ledger protocol so that non-fully-canonical signatures are no longer valid in any case. This protects against [transaction malleability](../docs/concepts/transactions/finality-of-results/transaction-malleability.md) on _all_ transactions, instead of only transactions with the [`tfFullyCanonicalSig` flag](../docs/references/protocol/transactions/common-fields.md#global-flags) enabled.

Without this amendment, a transaction is malleable if it uses a secp256k1 signature and does not have `tfFullyCanonicalSig` enabled. Most signing utilities enable `tfFullyCanonicalSig` by default, but there are exceptions.

With this amendment, no single-signed transactions are malleable. ([Multi-signed transactions may still be malleable](../docs/concepts/transactions/finality-of-results/transaction-malleability.md#malleability-with-multi-signatures) if signers provide more signatures than are necessary.) All transactions must use the fully canonical form of the signature, regardless of the `tfFullyCanonicalSig` flag. Signing utilities that do not create fully canonical signatures are not supported. All of Ripple's signing utilities have been providing fully-canonical signatures exclusively since at least 2014.

For more information, see [`rippled` issue #3042](https://github.com/XRPLF/rippled/issues/3042).


### SHAMapV2
[SHAMapV2]: #shamapv2

| Amendment    | SHAMapV2 |
|:-------------|:---------|
| Amendment ID | C6970A8B603D8778783B61C0D445C23D1633CCFAEF0D43E7DBCD1521D34BD7C3 |
| Status       | Obsolete |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

Changes the hash tree structure that `rippled` uses to represent a ledger. The new structure is more compact and efficient than the previous version. This affects how ledger hashes are calculated, but has no other user-facing consequences.

When this amendment is activated, the XRP Ledger will undergo a brief scheduled unavailability while the network calculates the changes to the hash tree structure. <!-- STYLE_OVERRIDE: will -->


### SortedDirectories
[SortedDirectories]: #sorteddirectories

| Amendment    | SortedDirectories |
|:-------------|:------------------|
| Amendment ID | CC5ABAE4F3EC92E94A59B1908C2BE82D2228B6485C00AFF8F22DF930D89C194E |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | Yes |

Sorts the entries in [DirectoryNode ledger objects](../docs/references/protocol/ledger-data/ledger-entry-types/directorynode.md) and fixes a bug that occasionally caused pages of owner directories not to be deleted when they should have been.

**Warning:** Older versions of `rippled` that do not know about this amendment may crash when they find a DirectoryNode sorted by the new rules. To avoid this problem, [upgrade](../docs/infrastructure/installation/index.md) to `rippled` version 0.80.0 or later.


### SusPay
[SusPay]: #suspay

| Amendment    | SusPay |
|:-------------|:-------|
| Amendment ID | DA1BD556B42D85EA9C84066D028D355B52416734D3283F85E216EA5DA6DB7E13 |
| Status       | Obsolete |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

This amendment was replaced by the [Escrow](../docs/references/protocol/ledger-data/ledger-entry-types/escrow.md) amendment.


### TicketBatch
[TicketBatch]: #ticketbatch

| Amendment    | TicketBatch |
|:-------------|:------------|
| Amendment ID | 955DF3FA5891195A9DAEFA1DDC6BB244B545DDE1BAA84CBB25D5F12A8DA68A0C |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | No |

This amendment adds [Tickets](../docs/concepts/accounts/tickets.md) as a way of sending transactions out of the typical sequence number order.

Standards Draft: [XLS-13d](https://github.com/XRPLF/XRPL-Standards/issues/16). <!-- SPELLING_IGNORE: xls, 13d -->


### Tickets
[Tickets]: #tickets

| Amendment    | Tickets |
|:-------------|:--------|
| Amendment ID | C1B8D934087225F509BEB5A8EC24447854713EE447D277F69545ABFA0E0FD490 |
| Status       | Obsolete |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

This amendment was replaced by the [TicketBatch][] amendment.


### TickSize
[TickSize]: #ticksize

| Amendment    | TickSize |
|:-------------|:---------|
| Amendment ID | 532651B4FD58DF8922A49BA101AB3E996E5BFBF95A913B3E392504863E63B164 |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | Yes |

Changes the way [Offers](../docs/concepts/tokens/decentralized-exchange/offers.md#lifecycle-of-an-offer) are ranked in order books, so that currency issuers can configure how many significant digits are taken into account when ranking Offers by exchange rate. With this amendment, the exchange rates of Offers are rounded to the configured number of significant digits, so that more Offers have the same exact exchange rate. The intent of this change is to require a meaningful improvement in price to outrank a previous Offer. If used by major issuers, this should reduce the incentive to spam the ledger with Offers that are only a tiny fraction of a percentage point better than existing offers. It may also increase the efficiency of order book storage in the ledger, because Offers can be grouped into fewer exchange rates.

Introduces a `TickSize` field to accounts, which can be set with the [AccountSet transaction type](../docs/references/protocol/transactions/types/accountset.md). If a currency issuer sets the `TickSize` field, the XRP Ledger truncates the exchange rate (ratio of funds in to funds out) of Offers to trade the issuer's currency, and adjusts the amounts of the Offer to match the truncated exchange rate. If only one currency in the trade has a `TickSize` set, that number of significant digits applies. When trading two currencies that have different `TickSize` values, whichever `TickSize` indicates the fewest significant digits applies. XRP does not have a `TickSize`.


### TrustSetAuth
[TrustSetAuth]: #trustsetauth

| Amendment    | TrustSetAuth |
|:-------------|:-------------|
| Amendment ID | 6781F8368C4771B83E8B821D88F580202BCB4228075297B19E4FDC5233F1EFDC |
| Status       | Enabled |
| Default Vote (Latest stable release) | Yes |
| Pre-amendment functionality retired? | Yes |

Allows pre-authorization of accounting relationships (zero-balance trust lines) when using [Authorized Trust Lines](../docs/concepts/tokens/fungible-tokens/authorized-trust-lines.md).

With this amendment enabled, a `TrustSet` transaction with [`tfSetfAuth` enabled](../docs/references/protocol/transactions/types/trustset.md#trustset-flags) can create a new [`RippleState` ledger object](../docs/references/protocol/ledger-data/ledger-entry-types/ripplestate.md) even if it keeps all the other values of the `RippleState` node in their default state. The new `RippleState` node has the [`lsfLowAuth` or `lsfHighAuth` flag](../docs/references/protocol/ledger-data/ledger-entry-types/ripplestate.md#ripplestate-flags) enabled, depending on whether the sender of the transaction is considered the low node or the high node. The sender of the transaction must have already enabled [`lsfRequireAuth`](../docs/references/protocol/ledger-data/ledger-entry-types/accountroot.md#accountroot-flags) by sending an [AccountSet transaction](../docs/references/protocol/transactions/types/accountset.md) with the [`asfRequireAuth` flag enabled](../docs/references/protocol/transactions/types/accountset.md#accountset-flags).


### XChainBridge
[XChainBridge]: #xchainbridge

| Amendment    | XChainBridge |
|:-------------|:-------------|
| Amendment ID | C98D98EE9616ACD36E81FDEB8D41D349BF5F1B41DD64A0ABC1FE9AA5EA267E9C |
| Status       | Open for Voting |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

Adds cross-chain bridges, enabling the transfer of digital assets between networks (for example, between Mainnet and a sidechain).
Standards draft: [XLS-38d Cross-Chain Bridge](https://github.com/XRPLF/XRPL-Standards/blob/master/XLS-38d-XChainBridge/README.md).

Adds new transactions:

- XChainAccountCreateCommit - Create a new account for a witness server to submit transactions on an issuing chain..
- XChainAddAccountCreateAttestation - Provide an attestation that an account was created for a witness server to use.
- XChainAddClaimAttestation - Provide an attestation that assets were locked on a locking chain.
- XChainClaim - Claim assets on the destination chain.
- XChainCommit - Locks assets on the locking chain.
- XChainCreateBridge - Create a bridge ledger object.
- XChainCreateClaimID - Create a new cross-chain claim ID that is used for a cross-chain transfer.
- XChainModifyBridge - Modify the parameters of a bridge.

Adds new ledger entry types:

- Bridge - A single cross-chain bridge that connects the XRP Ledger with another blockchain.
- XChainOwnedClaimID - A cross-chain transfer of value that includes information of the account on the source chain that locks or burns the funds on the source chain.
- XChainOwnedCreateAccountClaimID - Collects attestations for creating an account via a cross-chain transfer.

Adds several new transaction result codes.


### XRPFees
[XRPFees]: #xrpfees

| Amendment    | XRPFees |
|:-------------|:--------|
| Amendment ID | 93E516234E35E08CA689FA33A6D38E103881F8DCB53023F728C307AA89D515A7 |
| Status       | Enabled |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

Simplifies transaction cost calculations to use XRP directly rather than calculating indirectly in "fee units" and translating the results to XRP. Updates all instances of "fee units" in the protocol and ledger data to be drops of XRP instead, including:

- Updates the Fee Voting protocol to use drops of XRP
- Updates the FeeSettings ledger entry type. Replaces `BaseFee`, `ReferenceFeeUnits`, `ReserveBase`, and `ReserveIncrement` fields with `BaseFeeDrops`, `ReserveBaseDrops`, and `ReserveIncrementDrops`.
- Updates the SetFee transaction type. Replaces `BaseFee`, `ReferenceFeeUnits`, `ReserveBase`, `ReserveIncrement` fields with `BaseFeeDrops`, `ReserveBaseDrops`, `ReserveIncrementDrops`.

Without this amendment, the format of the transaction and ledger entry are the same.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
