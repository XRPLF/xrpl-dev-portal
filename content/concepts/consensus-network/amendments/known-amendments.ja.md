---
html: known-amendments.html
parent: amendments.html
blurb: 本番環境のXRP Ledgerに関する既知のAmendmentのすべてとそのステータスをまとめた総合リストです。
labels:
  - ブロックチェーン
---
# 既知のAmendment
[[ソース]](https://github.com/ripple/rippled/blob/master/src/ripple/protocol/impl/Feature.cpp "Source")

以下に示すのは、本番環境のXRP Ledgerに関する既知のAmendmentのすべてとそのステータスをまとめた総合リストです。

**ヒント:** このリストは手動に更新されています。生ステータスを[XRPScan Amendment Dashboard](https://xrpscan.com/amendments)にご覧下さい。

| 名前                            | 導入済み | ステータス                              |
|:--------------------------------|:-----------|:------------------------------------|
| [fixTrustLinesToSelf][]         | 未定        | [開発中: 未定]( "BADGE_LIGHTGREY") |
| [OwnerPaysFee][]                | 未定        | [開発中: 未定]( "BADGE_LIGHTGREY") |
| [fixRemoveNFTokenAutoTrustLine][] | v1.9.4   | [投票中: 未定](https://xrpl.org/blog/2022/rippled-1.9.4.html "BADGE_80d0e0") |
| [fixNFTokenNegOffer][]          | v1.9.2     | [投票中: 未定](https://xrpl.org/blog/2022/rippled-1.9.2.html "BADGE_80d0e0") |
| [NonFungibleTokensV1_1][]       | v1.9.2     | [投票中: 未定](https://xrpl.org/blog/2022/rippled-1.9.2.html "BADGE_80d0e0") |
| [ExpandedSignerList][]          | v1.9.1     | [投票中: 未定](https://xrpl.org/blog/2022/rippled-1.9.1.html "BADGE_80d0e0") |
| [fixNFTokenDirV1][]             | v1.9.1     | [投票中: 未定](https://xrpl.org/blog/2022/rippled-1.9.1.html "BADGE_80d0e0") |
| [NonFungibleTokensV1][]         | v1.9.0     | [投票中: 未定](https://xrpl.org/blog/2022/rippled-1.9.0.html "BADGE_80d0e0") |
| [CheckCashMakesTrustLine][]     | v1.8.0     | [投票中: 未定](https://xrpl.org/blog/2021/rippled-1.8.1.html "BADGE_80d0e0") |
| [NegativeUNL][]                 | v1.7.3     | [有効: 2021/11/21](https://livenet.xrpl.org/transactions/1500FADB73E7148191216C53040990E829C7110788B26E7F3246CB3660769EBA "BADGE_GREEN") |
| [fixRmSmallIncreasedQOffers][]  | v1.7.2     | [有効: 2021/11/18](https://livenet.xrpl.org/transactions/1F37BA0502576DD7B5464F47641FA95DEB55735EC2663269DFD47810505478E7 "BADGE_GREEN") |
| [TicketBatch][]                 | v1.7.0     | [有効: 2021/11/18](https://livenet.xrpl.org/transactions/111B32EDADDE916206E7315FBEE2DA1521B229F207F65DD314829F13C8D9CA36 "BADGE_GREEN") |
| [fixSTAmountCanonicalize][]     | v1.7.0     | [有効: 2021/11/11](https://livenet.xrpl.org/transactions/AFF17321A012C756B64FCC3BA0FDF79109F28E244D838A28D5AE8A0384C7C532 "BADGE_GREEN") |
| [FlowSortStrands][]             | v1.7.0     | [有効: 2021/11/11](https://livenet.xrpl.org/transactions/1C3D3BD2AFDAF326EBFEA54579A89B024856609DB4310F7140086AAB262D09A1 "BADGE_GREEN") |
| [fix1781][]                     | v1.6.0     | [有効: 2021/04/08](https://livenet.xrpl.org/transactions/DA59F10201D651B544F65896330AFACA8CA4198904265AD279D56781F655FAFB "BADGE_GREEN") |
| [fixAmendmentMajorityCalc][]    | v1.6.0     | [有効: 2021/04/08](https://livenet.xrpl.org/transactions/5B3ACE6CAC9C56D2008410F1B0881A0A4A8866FB99D2C2B2261C86C760DC95EF "BADGE_GREEN") |
| [HardenedValidations][]         | v1.6.0     | [有効: 2021/04/08](https://livenet.xrpl.org/transactions/3A45DCF055B68DCBBFE034240F9359FB22E8A64B1BF7113304535BF5BB8144BF "BADGE_GREEN") |
| [FlowCross][]                   | v0.70.0    | [有効: 2020/08/04](https://livenet.xrpl.org/transactions/44C4B040448D89B6C5A5DEC97C17FEDC2E590BA094BC7DB63B7FDC888B9ED78F "BADGE_GREEN") |
| [fixQualityUpperBound][]        | v1.5.0     | [有効: 2020/07/09](https://livenet.xrpl.org/transactions/5F8E9E9B175BB7B95F529BEFE3C84253E78DAF6076078EC450A480C861F6889E "BADGE_GREEN") |
| [RequireFullyCanonicalSig][]    | v1.5.0     | [有効: 2020/07/03](https://livenet.xrpl.org/transactions/94D8B158E948148B949CC3C35DD5DC4791D799E1FD5D3CE0E570160EDEF947D3 "BADGE_GREEN") |
| [Checks][]                      | v0.90.0    | [有効: 2020/06/18](https://livenet.xrpl.org/transactions/D88F2DCDFB10023F9F6CBA8DF34C18E321D655CAC8FDB962387A5DB1540242A6 "BADGE_GREEN") |
| [DeletableAccounts][]           | v1.4.0     | [有効: 2020/05/08](https://livenet.xrpl.org/transactions/47B90519D31E0CB376B5FEE5D9359FA65EEEB2289F1952F2A3EB71D623B945DE "BADGE_GREEN") |
| [fixCheckThreading][]           | v1.4.0     | [有効: 2020/05/01](https://livenet.xrpl.org/transactions/74AFEA8C17D25CA883D40F998757CA3B0DB1AC86794335BAA25FF20E00C2C30A "BADGE_GREEN") |
| [fixPayChanRecipientOwnerDir][] | v1.4.0     | [有効: 2020/05/01](https://livenet.xrpl.org/transactions/D2F8E457D08ACB185CDE3BB9BB1989A9052344678566785BACFB9DFDBDEDCF09 "BADGE_GREEN") |
| [fixMasterKeyAsRegularKey][]    | v1.3.1     | [有効: 2019/10/02](https://livenet.xrpl.org/transactions/61096F8B5AFDD8F5BAF7FC7221BA4D1849C4E21B1BA79733E44B12FC8DA6EA20 "BADGE_GREEN") |
| [MultiSignReserve][]            | v1.2.0     | [有効: 2019/04/17](https://livenet.xrpl.org/transactions/C421E1D08EFD78E6B8D06B085F52A34A681D0B51AE62A018527E1B8F54C108FB "BADGE_GREEN") |
| [fixTakerDryOfferRemoval][]     | v1.2.0     | [有効: 2019/04/02](https://livenet.xrpl.org/transactions/C42335E95F1BD2009A2C090EA57BD7FB026AD285B4B85BE15F669BA4F70D11AF "BADGE_GREEN") |
| [fix1578][]                     | v1.2.0     | [有効: 2019/03/23](https://livenet.xrpl.org/transactions/7A80C87F59BCE6973CBDCA91E4DBDB0FC5461D3599A8BC8EAD02FA590A50005D "BADGE_GREEN") |
| [DepositPreauth][]              | v1.1.0     | [有効: 2018/10/09](https://livenet.xrpl.org/transactions/AD27403CB840AE67CADDB084BC54249D7BD1B403885819B39CCF723DC671F927 "BADGE_GREEN") |
| [fix1515][]                     | v1.1.0     | [有効: 2018/10/09](https://livenet.xrpl.org/transactions/6DF60D9EC8AF3C39B173840F4D1C57F8A8AB51E7C6571483B4A5F1AA0A9AAEBF "BADGE_GREEN") |
| [fix1543][]                     | v1.0.0     | [有効: 2018/06/21](https://livenet.xrpl.org/transactions/EA6054C9D256657014052F1447216CEA75FFDB1C9342D45EB0F9E372C0F879E6 "BADGE_GREEN") |
| [fix1623][]                     | v1.0.0     | [有効: 2018/06/20](https://livenet.xrpl.org/transactions/4D218D86A2B33E29F17AA9C25D8DFFEE5D2559F75F7C0B1D016D3F2C2220D3EB "BADGE_GREEN") |
| [fix1571][]                     | v1.0.0     | [有効: 2018/06/19](https://livenet.xrpl.org/transactions/920AA493E57D991414B614FB3C1D1E2F863211B48129D09BC8CB74C9813C38FC "BADGE_GREEN") |
| [DepositAuth][]                 | v0.90.0    | [有効: 2018/04/06](https://livenet.xrpl.org/transactions/902C51270B918B40CD23A622E18D48B4ABB86F0FF4E84D72D9E1907BF3BD4B25 "BADGE_GREEN") |
| [fix1513][]                     | v0.90.0    | [有効: 2018/04/06](https://livenet.xrpl.org/transactions/57FE540B8B8E2F26CE8B53D1282FEC55E605257E29F5B9EB49E15EA3989FCF6B "BADGE_GREEN") |
| [fix1201][]                     | v0.80.0    | [有効: 2017/11/14](https://livenet.xrpl.org/transactions/B1157116DDDDA9D9B1C4A95C029AC335E05DB052CECCC5CA90118A4D46C77C5E "BADGE_GREEN") |
| [fix1512][]                     | v0.80.0    | [有効: 2017/11/14](https://livenet.xrpl.org/transactions/63F69F59BEFDC1D79DBF1E4060601E05960683AA784926FB74BC55074C4F6647 "BADGE_GREEN") |
| [fix1523][]                     | v0.80.0    | [有効: 2017/11/14](https://livenet.xrpl.org/transactions/97FD0E35654F4B6714010D3CBBAC4038F60D64AD0292693C28A1DF4B796D8469 "BADGE_GREEN") |
| [fix1528][]                     | v0.80.0    | [有効: 2017/11/14](https://livenet.xrpl.org/transactions/27AEE02DA4FE22B6BB479F850FBBC873FDC7A09A8594753A91B53098D726397E "BADGE_GREEN") |
| [SortedDirectories][]           | v0.80.0    | [有効: 2017/11/14](https://livenet.xrpl.org/transactions/6E2309C156EBF94D03B83D282A3914671BF9168FB26463CFECD068C63FFFAB29 "BADGE_GREEN") |
| [EnforceInvariants][]           | v0.70.0    | [有効: 2017/07/07](https://livenet.xrpl.org/transactions/17593B03F7D3283966F3C0ACAF4984F26E9D884C9A202097DAED0523908E76C6 "BADGE_GREEN") |
| [fix1373][]                     | v0.70.0    | [有効: 2017/07/07](https://livenet.xrpl.org/transactions/7EBA3852D111EA19D03469F6870FAAEBF84C64F1B9BAC13B041DDD26E28CA399 "BADGE_GREEN") |
| [Escrow][]                      | v0.60.0    | [有効: 2017/03/31](https://livenet.xrpl.org/transactions/C581E0A3F3832FFFEEB13C497658F475566BD7695B0BBA531A774E6739801515 "BADGE_GREEN") |
| [fix1368][]                     | v0.60.0    | [有効: 2017/03/31](https://livenet.xrpl.org/transactions/3D20DE5CD19D5966865A7D0405FAC7902A6F623659667D6CB872DF7A94B6EF3F "BADGE_GREEN") |
| [PayChan][]                     | v0.33.0    | [有効: 2017/03/31](https://livenet.xrpl.org/transactions/16135C0B4AB2419B89D4FB4569B8C37FF76B9EF9CE0DD99CCACB5734445AFD7E "BADGE_GREEN") |
| [TickSize][]                    | v0.50.0    | [有効: 2017/02/21](https://livenet.xrpl.org/transactions/A12430E470BE5C846759EAE3C442FF03374D5D73ECE5815CF4906894B769565E "BADGE_GREEN") |
| [CryptoConditions][]            | v0.50.0    | [有効: 2017/01/03](https://livenet.xrpl.org/transactions/8EB00131E1C3DB35EDFF45C155D941E18C3E86BC1934FF987D2DA204F4065F15 "BADGE_GREEN") |
| [Flow][]                        | v0.33.0    | [有効: 2016/10/21](https://livenet.xrpl.org/transactions/C06CE3CABA3907389E4DD296C5F31C73B1548CC20BD7B83416C78CD7D4CD38FC "BADGE_GREEN") |
| [TrustSetAuth][]                | v0.30.0    | [有効: 2016/07/19](https://livenet.xrpl.org/transactions/0E589DE43C38AED63B64FF3DA87D349A038F1821212D370E403EB304C76D70DF "BADGE_GREEN") |
| [MultiSign][]                   | v0.31.0    | [有効: 2016/06/27](https://livenet.xrpl.org/transactions/168F8B15F643395E59B9977FC99D6310E8708111C85659A9BAF8B9222EEAC5A7 "BADGE_GREEN") |
| [FeeEscalation][]               | v0.31.0    | [有効: 2016/05/19](https://livenet.xrpl.org/transactions/5B1F1E8E791A9C243DD728680F108FEF1F28F21BA3B202B8F66E7833CA71D3C3 "BADGE_GREEN") |
| [CryptoConditionsSuite][]       | v0.60.0    | [廃止: 削除未定]( "BADGE_RED") |
| [SHAMapV2][]                    | v0.32.1    | [禁止: v1.4.0で削除](https://xrpl.org/blog/2019/rippled-1.4.0.html "BADGE_RED") |
| [FlowV2][]                      | v0.32.1    | [禁止: v0.33.0で削除](https://xrpl.org/blog/2016/flowv2-vetoed.html "BADGE_RED") |
| [SusPay][]                      | v0.31.0    | [禁止: v0.60.0で削除](https://xrpl.org/blog/2017/ticksize-voting.html#upcoming-features "BADGE_RED") |
| [Tickets][]                     | v0.30.1    | [禁止: v0.90.0で削除](https://xrpl.org/blog/2018/rippled-0.90.0.html "BADGE_RED") |

**注記:** 多くの場合、旧バージョンのソフトウェアには不完全バージョンの修正用コードが存在します。上の表内の「導入済み」バージョンは最初の安定バージョンです。「未定」は、修正がまだ安定していないと見なされていることを示します。

## CheckCashMakesTrustLine
[CheckCashMakesTrustLine]: #checkcashmakestrustline

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 98DECF327BF79997AEC178323AD51A830E457BFC6D454DAF3E46E5EC42DC619F | 開発中 |

Adjusts the [CheckCash transaction][] so that cashing a [Check](checks.html) for an issued token automatically creates a [trust line](trust-lines-and-issuing.html) to hold the token. The new behavior is similar to how the [OfferCreate transaction][] behaves when users purchase tokens in the decentralized exchange: the automatic trust line has a limit value of 0. This removes the setup step of setting up a trust line before receiving a token via a Check. (Checks that send XRP are unaffected.)

Without this amendment, users have to separately send a [TrustSet transaction][] before they can cash a Check for an issued token.

This amendment does not change the fact that you cannot force anyone to hold tokens they don't want in the XRP Ledger.


## Checks
[Checks]: #checks

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 157D2D480E006395B76F948E3E07A45A05FE10230D88A7993C71F97AE4B1F2D1 | 有効 |

「Checks」をXRP Ledgerに導入します。Checksは個人用の紙の小切手と同様の機能を持っています。送信者はトランザクションに署名して、具体的な最高額と受取人を入力したCheckを作成します。その後、受取人はCheckを換金して、指定された金額を上限として現金を受け取ることができます。金銭の移動が実際に発生するのはCheckが換金されるときなので、送信者の現在の残高と流動性の状況によっては、Checkを換金できない場合があります。Checkを換金できない場合、Checkオブジェクトはレジャーに残るため、後日換金できるようになる場合があります。

送信者と受信者は、換金前であればいつでもCheckを取り消すことができます。Checkには有効期限を設定できます。有効期限が過ぎた後は換金できなくなり、誰でもそのCheckを取り消すことができます。

新たに導入するトランザクションタイプは次の3つです。CheckCreate、CheckCancel、CheckCash。また、新しいレジャーオブジェクトタイプはCheckです。新たに追加するトランザクション結果コード`tecEXPIRED`は、有効期限が過去の日時であるCheckを作成しようとすると発生します。

この修正はまた、有効期限が過去の日時であるオファーを作成しようとすると、OfferCreateトランザクションが`tecEXPIRED`を返すように変更しています。この修正を行わない場合、OfferCreateの有効期限が過去の日時であっても`tesSUCCESS`が返されますが、オファーの作成や実行は行われません。

## CryptoConditions
[CryptoConditions]: #cryptoconditions

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 1562511F573A19AE9BD103B5D6B9E01B3B46805AEC5D3C4805C902B514399146 | 有効 |

この修正は有効ですが、[SusPay](#suspay) Amendmentも有効にならなければ効果がありません。RippleではSusPayを有効にする予定はありません。代わりに、Crypto-Conditionsを[Escrow](#escrow) Amendmentに組み込む予定です。

## CryptoConditionsSuite
[CryptoConditionsSuite]: #cryptoconditionssuite

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 86E83A7D2ECE3AD5FA87AB2195AE015C950469ABF0B72EAACED318F74886AE90 | 開発中 |

[EscrowCreate][]トランザクションと[EscrowFinish][]トランザクションで使用するために、公式の[Crypto-Conditions仕様](https://tools.ietf.org/html/draft-thomas-crypto-conditions-03)から数種類のCrypto-Conditionsを導入します。この修正を行わない場合、サポートされるのはPREIMAGE-SHA-256タイプのみです。

<!-- TODO: update translated description to clarify that this amendment is obsolete. -->

**注意:** この修正は[開発中](https://github.com/ripple/rippled/pull/2170)です。`rippled`v0.60.0以降のバージョンでは、完全な機能は導入されません。

## DeletableAccounts
[DeletableAccounts]: #deletableaccounts

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 30CD365592B8EE40489BA01AE2F7555CAC9C983145871DC82A42A31CF5BAE7D9 | 有効 |

[アカウント](accounts.html)を削除できるようになります。

この修正を適用しない場合、新しいアカウントは`Sequence`番号が必ず1で始まります。また、レジャーの状態データからアカウントを削除できません。

この修正を適用した場合、新しいアカウントは、そのアカウントが作成された[レジャーのインデックス][レジャーインデックス]に一致する`Sequence`番号に等しい`Sequence`番号で始まります。この変更により、一度削除され、その後再作成されたアカウントが、古いトランザクションを再度実行しないように保護することができます。新しい`AccountDelete`トランザクションタイプを追加すると、アカウントと、そのアカウントがレジャーに所有する特定のオブジェクトが削除されます。ただし、特定の種類のオブジェクトはこの方法で削除できないため、そのようなオブジェクトに関連付けられているアカウントは削除できません。また、現行のレジャーインデックスから256を引いた値がアカウントの現行`Sequence`番号より低い場合も、アカウントは削除できません。この修正に関する詳しい解説については、[XRP Community Standards Draft 7](https://github.com/XRPLF/XRPL-Standards/issues/8)を参照してください。

## DepositAuth
[DepositAuth]: #depositauth

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| F64E1EABBE79D55B3BB82020516CEC2C582A98A6BFE20FBE9BB6A0D233418064 | 有効 |

新しいアカウントフラグ`DepositAuth`を追加します。これにより、他のアカウントから送信されたトランザクションに係る入金が厳密に拒否されます。企業はこのフラグを使用することで、あらゆる送金人からの送金を受け入れる前に規則に準拠して適切に対処することができます。

支払先のアカウントのこのフラグが有効になっている場合、支払いがXRPでなされるか、発行済み通貨でなされるかにかかわらず、Paymentトランザクションは失敗となります。アカウントが支払先である場合、支払先アカウント自体から上記のトランザクションが送信されなければ、EscrowFinishトランザクションとPaymentChannelClaimトランザクションは失敗します。[Checks][] amendmentが有効である場合、CheckCashトランザクションを送信することによってXRPまたは発行済み通貨をアカウントで受け取ることができます。

例外として、`DepositAuth`が有効になっているアカウントでは、現在のXRP残高がアカウントの準備金を下回る場合、少額のXRP（[アカウント準備金](reserves.html)の最低額以下）のPaymentトランザクションを受け取ることができます。

また、EscrowCreateトランザクションとPaymentChannelCreateトランザクションで誤ってDisallowXRPフラグを適用してしまうバグも修正します。これは強制力のない勧告フラグとするものです。（レジャー自体にDisallowXRPフラグを適用しないことで、[アカウント準備金](reserves.html)を満たし[トランザクションコスト](transaction-cost.html)を支払うのに必要なXRPを、アカウントが引き続き受け取ることができます。）

## DepositPreauth
[DepositPreauth]: #depositpreauth

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 3CBC5C4E630A1B82380295CDA84B32B49DD066602E74E39B85EF64137FA65194 | 有効 |

[Deposit Authorization](depositauth.html)のユーザーに特定の送信者を事前承認する手段を提供して、承認された送信者が支払いを直接送信できるようにします。

事前承認の追加または削除のために新しいトランザクションタイプDepositPreauthを、あるアカウントから別のアカウントへの事前承認の追跡のためにDepositPreauthレジャーオブジェクトタイプを追加します。JSON-RPCコマンド`deposit_authorized`を追加します。これは、アカウントが別のアカウントへ支払いを直接送金することが承認されているかどうかを問い合わせるためのものです。

また、アカウントにDeposit Authorizationが必要な場合、アカウントから自身への異なる通貨間での支払いの動作も変更します。この修正を行わない場合、これらの支払いはコードtecNO_PERMISSIONにて常に失敗します。この修正を行う場合、これらの支払いはDeposit Authorization無効時と同様に成功します。

## EnforceInvariants
[EnforceInvariants]: #enforceinvariants

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| DC9CA96AEA1DCF83E527D1AFC916EFAF5D27388ECA4060A88817C1238CAEE0BF | 有効 |

トランザクション処理にサニティーチェックを追加して、所定の条件が常に満たされるようにします。これにより、トランザクション処理時のバグを防ぐ独立した追加のレイヤーができます。このレイヤーがなければXRP Ledgerが脆弱なものとなり悪用される可能性が生じます。Rippleは、Amendmentを追加せずに、将来バージョンの`rippled`に不変性チェックをさらに追加する予定です。

2つの新しいトランザクションエラーコード、`tecINVARIANT_FAILED`と`tefINVARIANT_FAILED`を導入します。新しいチェックを追加するためにトランザクション処理を変更します。

不変性チェックの例:

- トランザクションによって消却されたXRPの合計額は、[トランザクションコスト](transaction-cost.html)と正確に一致していなければなりません。
- XRPは作成できません。
- [レジャー内の`AccountRoot`オブジェクト](accountroot.html)は、[DeletableAccounts](#deletableaccounts)が有効でない限り削除できません。（関連項目: [アカウントの削除](accounts.html#アカウントの削除)）
- [レジャー内のオブジェクト](ledger-object-types.html)のタイプは変更できません。（`LedgerEntryType`フィールドは変更できません。）
- XRPにトラストラインはありません。

## Escrow
[Escrow]: #escrow

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 07D43DCE529B15A10827E5E04943B496762F9A88E3268269D69C44BE49E21104 | 有効 |

[SusPay](#suspay)および[CryptoConditions](#cryptoconditions) Amendmentを置き換えます。

XRP Ledger内のEscrowにXRPの「停止された支払い」機能を提供します。これには[Interledger Protocol Crypto-Conditions](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02)のサポートが含まれます。停止された支払い用のレジャーオブジェクトタイプと、停止された支払いを作成、実行、取り消すためのトランザクションタイプを新規作成します。


## ExpandedSignerList
[ExpandedSignerList]: #expandedsignerlist

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| B2A4DB846F0891BF2C76AB2F2ACC8F5B4EC64437135C6E56F3F859DE5FFD5856 | 投票中 |

<!-- TODO: translate description -->
This amendment expands the maximum signer list size and allows each signer to have optional data associated with it. The additional data can be used to identify the signer, which may be useful for smart contracts, or for identifying who controls a key in a large organization: for example, you could store an IPv6 address or the identifier of a Hardware Security Module (HSM).

Without this amendment, the maximum signer list size is 8 signers, and each signer has exactly two fields, `Account` and `SignerWeight`.

With this amendment, the maximum [SignerList object][] size is 32 entries. Additionally, each `SignerEntry` object can contain an optional 256-bit `WalletLocator` field containing arbitrary data. This amendment changes the [SignerListSet transaction][] accordingly.

## FeeEscalation
[FeeEscalation]: #feeescalation

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 42426C4D4F1009EE67080A9B7965B44656D7714D104A72F9B4369F97ABF044EE | 有効 |

提案されたトランザクションに[トランザクションコスト](transaction-cost.html)を適用する方法を変更します。トランザクションコストの高いトランザクションの優先順位が高くなるよう、コンセンサスプロセスを変更します。 <!-- STYLE_OVERRIDE: prioritize -->

この修正により、前のコンセンサスラウンドに含められなかったトランザクションに固定サイズのトランザクションキューが導入されます。コンセンサスネットワーク内の`rippled`サーバーに重い負荷が課されている場合、トランザクションコストの低いトランザクションは後のレジャーのキューに入れられます。各コンセンサスラウンドでは、トランザクションコスト（`Fee`値）が高いキューのトランザクションが優先され、コンセンサスネットワークで処理できる限りのトランザクションが含められます。トランザクションキューが一杯になると、トランザクションコストが最も低いトランザクションから順にキューから完全に除外されます。

コンセンサスネットワークに重い負荷がかかる一方で、正規のユーザーは高めのトランザクションコストを支払い、トランザクションを確実に処理することができます。この状況は、未処理の低コストのトランザクションが完全に処理または除外されるまで続きます。

1つのトランザクションは、以下のいずれかが発生するまでキュー内に残ります。

* 検証済みレジャーに適用される（成功か失敗かには関係ありません）
* 無効になる（例えば、[`LastLedgerSequence`](transaction-common-fields.html)によって有効期限切れとなる）
* キュー内にトランザクションコストの高いトランザクションがたくさんあるため除外される

## fix1201
[fix1201]: #fix1201

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| B4D44CC3111ADD964E846FC57760C8B50FFCD5A82C86A72756F6B058DDDF96AD | 有効 |

[送金手数料](transfer-fees.html)に限度を正しく導入し、100%の料金にします。これは、`TransferRate`値の最大値である`2000000000`を表します。（この場合の100%の料金とは、送信する1ユニットごとに2ユニットの発行済み通貨を送信する必要があることを意味します。）この修正を行わない場合、有効な限度は`TransferRate`値の2<sup>32</sup>-1、つまり約329%の料金となります。

この修正を行う場合、[AccountSet][]トランザクションの`TransferRate`を`2000000000`より高く設定すると、トランザクションは結果コード`temBAD_TRANSFER_RATE`にて失敗します。以前のルールに従って高い値が設定されている既存のすべての`TransferRate`には、そのまま高い率が適用されます。

## fix1368
[fix1368]: #fix1368

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| E2E6F2866106419B88C50045ACE96368558C345566AC8F2BDF5A5B5587F0E6FA | 有効 |

有効であるべき一部の支払いが失敗となる、トランザクション処理の小さなバグを修正します。具体的には、支払い処理中に、特定金額の通貨を生成する支払いステップの一部で、浮動小数点の表示に関する精度の不良により、わずかに異なる金額が生成されてしまうことがあります。この状況が発生すると、正確な金額を送金できないため支払いが失敗します。fix1368 Amendmentにより、トランザクション処理が修正されれば、このような支払いの失敗はなくなります。

## fix1373
[fix1373]: #fix1373

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 42EEA5E28A97824821D4EF97081FE36A54E9593C6E4F20CBAE098C69D2E072DC | 有効 |

特定の[支払いパス](paths.html)を作成する際にエラーを引き起こすトランザクション処理の小さなバグを修正します。この結果、有効であっても正しく作成されていないパスを、支払いで使用できなくなりました。この修正を行わない場合、支払い時に好ましくないパスの使用を強制されたり、失敗したりする恐れがあります。

fix1373 Amendmenによりこの問題は修正されるため、正しく作成されたパスを使用して支払いを行えます。また、現在は許可されているものの適切ではない一部のパスが無効になります。これには、同じオブジェクトを2回以上ループしてコンフリクトを起こすフィールドやパスを含む[ステップ](paths.html#パスの仕様)を持つパスが含まれます。

## fix1512
[fix1512]: #fix1512

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 6C92211186613F9647A89DFFBAB8F94C99D4C7E956D495270789128569177DA1 | 有効 |

一部の無効な[PaymentChannelClaim][]トランザクションが、不正確なエラーコードで失敗するトランザクション処理のバグを修正します。この修正を行わない場合、トランザクションの結果コードは`tec`クラスとなりますが、レジャーに入力されず、[トランザクションコスト](transaction-cost.html)は支払われません。

この修正により、トランザクションは適切な結果コード`temBAD_AMOUNT`にて失敗します。

## fix1513
[fix1513]: #fix1513

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 67A34F2CF55BFC0F93AACD5B281413176FEE195269FA6D95219A2DF738671172 | 有効 |

`FeeEscalation` Amendmentが行われると、新しい`STAmountCalcSwitchovers`コードが使用されないトランザクション処理のバグを修正します。

この修正により、新しい`STAmountCalcSwitchovers`コードが適用されるため、計算の違いによってトランザクション処理に若干の変更を生じる場合があります。金額の四捨五入のやり方が異なり、その結果、オファーが異なる順序で実行される場合があります。

## fix1515
[fix1515]: #fix1515

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 5D08145F0A4983F23AFFFF514E83FAD355C5ABFBB6CAB76FB5BC8519FF5F33BE | 有効 |

Paymentトランザクションがオファーを処理していく方法を変更して、支払処理とオファー処理における流動性の消費の仕方のわずかな違いをなくします。（[FlowCross][]が有効の場合、オファーCreateトランザクションの処理方法にも影響します。）

この修正を行わない場合、トランザクションが同じ為替レートで2000を超えるオファーを消費すると、支払い処理は特定のオーダーブックを使用しなくなります。この場合、支払いはそれらのオファーの流動性を使用せず、支払いを完了するときにそのオーダーブックに残された流動性を考慮しません。

この修正により、同じ為替レートで1000を超えるオファーを処理するトランザクションはすべて、そのトランザクションの最初の1000のオファーの流動性を消費し、支払いを完了時にはそのオーダーブックに残された流動性は考慮されません。

どちらの場合でも、トランザクション処理は他のパスまたは為替レートからの流動性を使用して完了できます。

## fix1523
[fix1523]: #fix1523

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| B9E739B8296B4A1BB29BE990B17D66E21B62A300A909F25AC55C22D6C72E1F9D | 有効 |

支払先アカウント別の追跡機能を[Escrow](escrow.html)に追加します。この修正を行わない場合、保留中のEscrowは送信者別にしか追跡できません。この修正により、[account_objectsメソッド][]を使用して支払先アドレスごとに保留中のEscrowを調べることができます。ただし、この修正が有効になる前に作成された保留中のEscrowを除きます。また、この修正では、[EscrowCreateトランザクション][]を支払先のトランザクション履歴に表示することができます。これは[account_txメソッド][]による表示と同様です。

この修正により、新しいEscrowが送信者と受信者両方の[所有者ディレクトリー](directorynode.html)に追加されます。また、[Escrowレジャーオブジェクト](escrow-object.html)に新しい`DestinationNode`フィールドも追加され、支払先の所有者ディレクトリのどのページにEscrowがあるかを表示します。

## fix1528
[fix1528]: #fix1528

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 1D3463A5891F9E589C5AE839FFAC4A917CE96197098A1EF22304E1BC5B98A454 | 有効 |

バリデータがさまざまなタイムスタンプでコンセンサスレジャーを構築できることが原因で、検証済みレジャーの宣言プロセスに遅れをもたらす可能性があるバグを修正します。このような状況の発生は正確なタイミングを要するため、管理テスト環境の外部にいるバリデータがこのバグに遭遇することはあまりありません。

この修正は、バリデータがコンセンサスレジャーの終了時刻の交渉方法を変更して、レジャー内容について合意を得ることはできないが、異なるタイムスタンプでレジャーバージョンを構築できるようにします。

## fix1543
[fix1543]: #fix1543

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| CA7C02118BA27599528543DFE77BA6838D1B0F43B447D4D7F53523CE6A0E9AC2 | 有効 |

予約済のフラグ範囲を、まだ正しく適用されていないトランザクションタイプに適用します。未定義または未知のフラグ、または予約された範囲のフラグが有効になっている場合、影響を受けるトランザクションタイプのトランザクションは無効と見なされるようになります。（この変更による影響を受けないトランザクションには、すでに同じルールが正しく適用されています。）

この修正を行わない場合、特定のタイプのトランザクションで未定義または予約されたフラグが有効になっていても、そのトランザクションタイプは有効と見なされます。

影響を受けるトランザクションタイプは以下のとおりです。

- Escrowトランザクション: [EscrowCancel][]、[EscrowCreate][]、[EscrowFinish][]
- Payment Channelトランザクション: [PaymentChannelClaim][]、[PaymentChannelCreate][]、[PaymentChannelFund][]

## fix1571
[fix1571]: #fix1571

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 7117E2EC2DBF119CA55181D69819F1999ECEE1A0225A7FD2B9ED47940968479C | 有効 |

以下のようにEscrowの問題を修正します。

- [EscrowCreateトランザクション][]に`Condition`フィールドまたは`FinishAfter`フィールド（またはその両方）が必要となるように変更します。この修正以前に作成された、`Condition`や`FinishAfter`のいずれも持たないEscrowは、`CancelAfter`時間より前ならいつでも誰でも終了できます。
- 時間ベースのEscrowが特定の状況下で終了されるのを誤って妨げる欠陥を修正します。

## fix1578
[fix1578]: #fix1578

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| FBD513F1B893AC765B78F250E6FFA6A11B573209D1842ADC787C850696741288 | 有効 |

以下の2つのトランザクションタイプから返される結果コードを変更します。

- [OfferCreateトランザクション][]を変更して、オファーが`tfFillOrKill`フラグを使用していて中止された場合に、新しい結果コード`tecKILLED`が返されるようにします。この修正を行わない場合、オファーは中止されますが、トランザクション結果は`tesSUCCESS`になります。
- [TrustSetトランザクション][]を変更して、トラストラインがマイナス残高であるため、[NoRippleフラグ](rippling.html#norippleフラグ)を有効にしようとしてもできない場合に、`tecNO_PERMISSION`で失敗するようにします。この修正を行わない場合、トランザクションでNoRippleフラグを有効にできなくても、トランザクション結果は`tesSUCCESS`になります。

## fix1623
[fix1623]: #fix1623

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 58BE9B5968C4DA7C59BA900961828B113E5490699B21877DEF9A31E9D0FE5D5F | 有効 |

変動金額で換金されたCheckCashトランザクションのメタデータに送金額を追加します。（[Checks](#checks) Amendmentが有効でないかぎり効果がありません。）

この修正を行うと、トランザクション処理にて変動金額の[CheckCashトランザクション][]のメタデータに`DeliveredAmount`フィールドが追加されます（`DeliverMin`フィールドを使用します）。この変更はレジャーデータに書き込まれるため、この修正を行わずにトランザクションを処理した場合とは異なるレジャーハッシュとなります。これは実際に送信される金額には影響しません。また、この修正を有効にすると、[txメソッド][]と[account_txメソッド][]によってCheckCashトランザクションの[`delivered_amount`フィールド](transaction-metadata.html#delivered_amount)が返されます。（`delivered_amount`フィールドはトランザクションの検索時に計算されるものであり、レジャーに書き込まれるデータの一部ではありません。）

fix1623 Amendmentは、固定金額の[CheckCashトランザクション][]（`Amount`フィールドを使用）またはその他のトランザクションタイプには影響しません。

**注意:** `rippled`1.0.0では、fix1623 Amendmentの前にChecks Amendmentを有効にした場合、fix1623 Amendmentが行われる前の変動金額のCheckCashトランザクションについては、トランザクションがゼロ以外の金額であっても、`delivered_amount`に「0」と表示される場合があります。Rippleでは、fix1623を[Checks][] Amendmentと同時に本番ネットワーク環境で有効にするよう計画していますが、この状況は[並列ネットワーク](parallel-networks.html)上で発生する可能性があります。

## fix1781
[fix1781]: #fix1781

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 25BA44241B3BD880770BFA4DA21C7180576831855368CBEC6A3154FDE4A7676E | 有効 |

<!-- TODO: translate amendment description -->
Fixes a bug where certain XRP endpoints were not checked when detecting circular paths.

Without this amendment, it is possible to have a [payment path](paths.html) where the input to the path is XRP, and an intermediate path step also outputs XRP. This is a "loop" payment, and the payment engine disallows such paths because they can have different results when executed forward compared to backwards.

With this amendment, those payments fail with the [`temBAD_PATH_LOOP` result code](tem-codes.html) instead.


## fixAmendmentMajorityCalc
[fixAmendmentMajorityCalc]: #fixamendmentmajoritycalc

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 4F46DF03559967AC60F2EB272FEFE3928A7594A45FF774B87A7E540DB0F8F068 | 有効 |

<!-- TODO: translate amendment description -->
Fixes a bug that could cause an amendment to achieve a majority and later activate with support of slightly less than 80% of trusted validators due to rounding semantics.

Without this amendment, the minimum threshold for amendment activation is any value that rounds to 204/256 of trusted validators, which depends on the number of trusted validators at the time. For example, an amendment could activate with exactly 28 out of 36 validators (approximately 77.8%). With this amendment, the actual minimum number of validators needed is never less than 80% of trusted validators.


## fixCheckThreading
[fixCheckThreading]: #fixcheckthreading

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 8F81B066ED20DAECA20DF57187767685EEF3980B228E0667A650BAF24426D3B4 | 有効 |

Checksトランザクションがアカウントのメタデータに影響を及ぼす方法を変更し、Checksが受信アカウントの[アカウント](accounts.html)履歴に適切に追加されるようにします。（具体的には、受信アカウントの[AccountRootオブジェクト](accountroot.html)の`PreviousTxnID`フィールドと`PreviousTxnLedgerSeq`フィールドを更新します。これは、アカウントと、アカウントが所有するオブジェクトに影響を及ぼしたトランザクションの「スレッド」を追跡するために使用できます。）

この修正を適用しない場合、Checksトランザクション（[CheckCreate][]、[CheckCash][]、および[CheckCancel][]）は送信者のアカウント履歴のみを更新します。この修正を適用した場合、これらのトランザクションは、送信アカウントにも受信アカウントにも影響します。この修正は、[Checks Amendment](#checks)も有効でないかぎり効果がありません。

## fixMasterKeyAsRegularKey
[fixMasterKeyAsRegularKey]: #fixmasterkeyasregularkey

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| C4483A1896170C66C098DEA5B0E024309C60DC960DE5F01CD7AF986AA3D9AD37 | 有効 |

アカウントのレギュラーキーペアがマスターキーペアと一致するように設定できるものの、マスターキーが無効になった場合に、そのキーによって署名されたトランザクションを送信できなくなるバグを修正します。

この修正を適用しない場合、ユーザーは、レギュラーキーがマスターキーと一致するように設定し、その後マスターキーを無効にすることで、意図せずアカウントを「ブラックホール」にしてしまうおそれがあります。ネットワークは、マスターキーペアとレギュラーキーペアの両方で署名されたトランザクションを拒否します。コードは、トランザクションが現在有効なレギュラーキーで署名されていると認識する前に、無効なマスターキーで署名されていると解釈するためです。

この修正を有効にした場合、SetRegularKeyトランザクションはレギュラーキーがマスターキーに一致するよう設定できないため、そのようなトランザクションでは、トランザクションコードが`temBAD_REGKEY`になります。また、この修正により、署名検証コードが変更されるため、レギュラーキーがマスターキーに一致するよう_すでに_設定しているアカウントは、そのキーペアを使用して正常にトランザクションを送信できます。


## fixNFTokenDirV1
[fixNFTokenDirV1]: #fixnftokendirv1

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 0285B7E5E08E1A8E4C15636F0591D87F73CB6A7B6452A932AD72BBC8E5D1CBE3 | 投票中 |

<!-- TODO: translate description -->
This amendment fixes an off-by-one error that occurred in some corner cases when determining which `NFTokenPage` a `NFToken` object belongs on. It also adjusts the constraints of `NFTokenPage` invariant checks, so that certain error cases fail with a suitable error code such as `tecNO_SUITABLE_TOKEN_PAGE` instead of failing with a `tecINVARIANT_FAILED` error code.

This amendment has no effect unless the [NonFungibleTokensV1][] amendment is enabled. To avoid bugs, the fixNFTokenDirV1 amendment should be enabled before the NonFungibleTokensV1 amendment.


## fixNFTokenNegOffer
[fixNFTokenNegOffer]: #fixnftokennegoffer

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 36799EA497B1369B170805C078AEFE6188345F9B3E324C21E9CA3FF574E3C3D6 | 投票中 |

<!-- TODO: translate description -->
This amendment fixes a bug in the [NonFungibleTokensV1][] amendment code where NFTs could be traded for negative amounts of money. Without this fix, users could place and accept an offer to buy or sell an NFT for a negative amount of money, which resulted in the person "buying" the NFT also receiving money from the "seller". With this amendment, NFT offers for negative amounts are considered invalid.

This amendment has no effect unless the [NonFungibleTokensV1][] amendment is enabled. To avoid bugs, all the NFT-related amendments should be enabled together using [NonFungibleTokensV1_1][].


## fixPayChanRecipientOwnerDir
[fixPayChanRecipientOwnerDir]: #fixpaychanrecipientownerdir

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 621A0B264970359869E3C0363A899909AAB7A887C8B73519E4ECF952D33258A8 | 有効 |

[PaymentChannelCreateトランザクション][]タイプを変更し、受取人の[所有者ディレクトリー](directorynode.html)に新しい[Payment Channel](payment-channels.html)が追加されるようにします。この修正を適用しない場合、新しいPayment Channelは送金者の所有者ディレクトリーにのみ追加されます。この修正を有効にする場合、新しく作成したPayment Channelは両者の所有者ディレクトリーに追加されます。既存のPayment Channelは変更されません。

この変更により、受取人によるPayment Channelの検索が容易になります。また、アカウントがオープンPayment Channelの受取人だった場合に、そのアカウントが削除されないようにします（ただし、この修正の前に作成されたチャンネルを除きます）。


## fixQualityUpperBound
[fixQualityUpperBound]: #fixqualityupperbound

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 89308AF3B8B10B7192C4E613E1D2E4D9BA64B2EE2D5232402AE82A6A7220D953 | 有効 |

<!-- TODO: translate amendment description -->
Fixes a bug in unused code for estimating the ratio of input to output of individual steps in cross-currency payments.

This amendment has no known impact on transaction processing.

## fixRemoveNFTokenAutoTrustLine
[fixRemoveNFTokenAutoTrustLine]: #fixremovenftokenautotrustline


| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| DF8B4536989BDACE3F934F29423848B9F1D76D09BE6A1FCFE7E7F06AA26ABEAD | 投票中 |

<!-- TODO: translate amendment description -->

Removes the `tfTrustLine` setting on [non-fungible tokens](non-fungible-tokens.html), to protect against a denial of service attack on issuers using this flag. With this amendment enabled, a [NFTokenMint transaction](nftokenmint.html) with the `tfTrustLine` flag enabled is considered invalid and cannot be confirmed by consensus; therefore, `NFToken` objects cannot be minted with the flag.

Without this amendment, an attacker could create new, meaningless fungible tokens and sell an NFT back and forth for those tokens, creating numerous useless trust lines tied to the issuer and increasing the issuer's reserve requirement. 

This amendment does not change the code for `NFToken` objects that have already been minted. On test networks that already have NonFungibleTokensV1_1 enabled, this means that issuers who have already minted NFTokens with the `tfTrustLine` flag enabled are still vulnerable to the exploit even after the fixRemoveNFTokenAutoTrustLine amendment.

This amendment has no effect unless [NonFungibleTokensV1][] or [NonFungibleTokensV1_1][] is also enabled.

To protect issuers, this amendment should be enabled _before_ [NonFungibleTokensV1][] or [NonFungibleTokensV1_1][].


## fixRmSmallIncreasedQOffers
[fixRmSmallIncreasedQOffers]: #fixrmsmallincreasedqoffers

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| B6B3EEDC0267AB50491FDC450A398AF30DBCD977CECED8BEF2499CAB5DAC19E2 | 有効 |

<!-- TODO: translate amendment description -->
This amendment fixes an issue where certain Offers, when almost completely consumed, have a much lower exchange rate than when they were first placed. This occurs when the remaining amounts of one or both assets are so small that they cannot be rounded to a similar ratio as when the Offer was placed.

Without this amendment, an Offer in this state blocks Offers with better rates deeper in the order book and causes some payments and Offers to fail when they could have succeeded.

With this amendment, payments and trades can remove these types of Offers the same way that transactions normally remove fully consumed or unfunded Offers.


## fixSTAmountCanonicalize
[fixSTAmountCanonicalize]: #fixstamountcanonicalize

| Amendment ID                                                     | ステータス  |
|:-----------------------------------------------------------------|:----------|
| 452F5906C46D46F407883344BFDD90E672B672C5E9943DB4891E3A34FEEEB9DB | 有効 |

<!-- TODO: translate amendment description -->
Fixes an edge case in [deserializing](serialization.html) Amount-type fields. Without this amendment, in some rare cases the operation could result in otherwise valid serialized amounts overflowing during deserialization. With this amendment, the XRP Ledger detects error conditions more quickly and eliminates the problematic corner cases.


## fixTakerDryOfferRemoval
[fixTakerDryOfferRemoval]: #fixtakerdryofferremoval

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 2CD5286D8D687E98B41102BDD797198E81EA41DF7BD104E6561FEB104EFF2561 | 有効 |

XRP Ledger内にドライオファーを残す可能性がある[オートブリッジ](autobridging.html)のバグを修正します。ドライオファーとは、オファーを掛け合わせても資金を調達できないオファーのことです。

この修正を行わなければ、ドライオファーがレジャー上に残り、所有者の[必要準備金](reserves.html#所有者準備金)に加算されることになり、所有者に何も利益をもたらしません。正しいタイプとクオリティで掛け合わせた別のオファーによって、ドライオファーを除去することができます。ただし、タイプとクオリティがうまく掛け合わされたオファーがめったにない場合、ドライオファーの除去には時間がかかることがあります。

この修正により、これらのドライオファーがオートブリッジで一致した場合に、XRP Ledgerによって除去されます。


## fixTrustLinesToSelf
[fixTrustLinesToSelf]: #fixtrustlinestoself

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| F1ED6B4A411D8B872E65B9DCB4C8B100375B0DD3D62D07192E011D6D7F339013 | 開発中 |

<!-- TODO: translate amendment description -->
This amendment removes two trust lines from an account to itself that were created due to an old bug (both on 2013-05-07). When the amendment becomes enabled, it deletes trust lines with the IDs `2F8F21EFCAFD7ACFB07D5BB04F0D2E18587820C7611305BB674A64EAB0FA71E1` and `326035D5C0560A9DA8636545DD5A1B0DFCFF63E68D491B5522B767BB00564B1A` if they exist. After doing so, the amendment does nothing else.

On test networks that do not have these trust lines, the amendment has no effect.


## Flow
[Flow]: #flow

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 740352F2412A9909880C23A559FCECEDA3BE2126FED62FC7660D628A06927F11 | 有効 |

支払い処理エンジンを、より堅固で効率的に作られたFlowエンジンに置き換えます。この新バージョンの支払い処理エンジンは、旧バージョンと同じルールを踏襲しますが、浮動小数点の丸め処理により異なる結果をもたらすことがあります。この修正は[FlowV2](https://xrpl.org/blog/2016/flowv2-vetoed.html) Amendmentに代わるものです。

また、Flowエンジンは、さらなるAmendmentを通じて、支払いエンジンの改善や拡張を容易にします。

## FlowCross
[FlowCross]: #flowcross

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 3012E8230864E95A58C60FD61430D7E1B4D3353195F2981DC12B0C7C0950FFAC | 有効 |

XRP Ledgerの分散型取引所において、オファーの掛け合わせのロジックを合理化します。[Flow](#flow) Amendmentから更新されたコードを使用してオファーの掛け合わせを行うため、[OfferCreateトランザクション][]と[Paymentトランザクション][]は多くのコードを共有します。オファーの処理方法には微妙な違いがあります。

- 丸め方が一部のケースで少し異なります。
- 丸め方の違いが原因で、一部のオファーの組み合わせのランク付けが以前のロジックより上下したり、優先されたりします。
- 新しいロジックによって、以前のロジックより多めまたは少なめにオファーが削除される場合があります。（これには、丸め方の違いによるケースや、以前のロジックによって資金供給なしとして不正に削除されたオファーが含まれます。）


## FlowSortStrands
[FlowSortStrands]: #flowsortstrands

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| AF8DF7465C338AE64B1E937D6C8DA138C0D63AD5134A68792BBBE1F63356C422 | 有効 |

<!-- TODO: translate amendment description -->
Improves the payment engine's calculations for finding the most cost-efficient way to execute a cross-currency transaction.

Without this change, the engine simulates a payment through each possible path to calculate the quality (ratio of input to output) of each path. With this change, the engine calculates the theoretical quality of each path without simulating a full payment. With this amendment, the payment engine executes some cross-currency payments much faster, is able to find the most cost-efficient path in more cases, and can enable some payments to succeed in certain conditions where the old payment engine would fail to find enough liquidity.


## FlowV2
[FlowV2]: #flowv2

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 5CC22CFF2864B020BD79E0E1F048F63EF3594F95E650E43B3F837EF1DF5F4B26 | 禁止 |

これは[Flow](#flow) Amendmentの旧バージョンです。[バグが原因で不採用となり](https://xrpl.org/blog/2016/flowv2-vetoed.html)、バージョン0.33.0で除外されました。

## HardenedValidations
[HardenedValidations]: #hardenedvalidations

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 1F4AFA8FA1BC8827AD4C0F682C03A8B671DCDF6B5C4DE36D44243A684103EF88 | 有効 |

<!-- TODO: translate amendment description -->
Allows validators to include a new optional field in their validations to attest to the hash of
the latest ledger that the validator considers to be fully validated. The consensus process can use this information to increase the robustness of consensus.


## MultiSign
[MultiSign]: #multisign

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373 | 有効 |

トランザクションの承認方法として[マルチ署名](multi-signing.html)を導入します。[`SignerList`レジャーオブジェクトタイプ](signerlist.html)と[`SignerListSet`トランザクションタイプ](signerlistset.html)を作成します。省略可能な`Signers`フィールドをすべてのトランザクションタイプに追加します。一部のトランザクション結果コードを変更します。

この修正により、マルチ署名のアドレスからトランザクションを承認できる署名者のリストをそのアドレスに保持できるようになります。このリストには定数があり、1から8で重み付けされた署名者が記載されています。これにより、「5人のうち任意の3人」や「Aの署名とその他任意の2人の署名」などの多様な設定が可能になります。

署名者は資金供給のあるアドレスでも資金供給のないアドレスでも可能です。署名者リストのうち資金供給のあるアドレスは、レギュラーキー（定義済みの場合）またはマスターキー（無効でない場合）を使用して署名できます。資金供給のないアドレスは、マスターキーを使用して署名できます。マルチ署名済みトランザクションは、レギュラーキーで署名されたトランザクションと同じ権限を持ちます。

SignerListを持つアドレスは、レギュラーキーが定義されていなくてもマスターキーを無効にすることができます。また、SignerListを持つアドレスは、マスターキーが無効な場合でもレギュラーキーを削除することができます。`tecMASTER_DISABLED`トランザクション結果コードは`tecNO_ALTERNATIVE_KEY`に名前が変更されます。`tecNO_REGULAR_KEY`トランザクション結果コードは廃止となり、`tecNO_ALTERNATIVE_KEY`に代わります。さらに、この修正は以下の新しい[トランザクション結果コード](transaction-results.html)を追加します。

* `temBAD_SIGNER`
* `temBAD_QUORUM`
* `temBAD_WEIGHT`
* `tefBAD_SIGNATURE`
* `tefBAD_QUORUM`
* `tefNOT_MULTI_SIGNING`
* `tefBAD_AUTH_MASTER`


## MultiSignReserve
[MultiSignReserve]: #multisignreserve

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 586480873651E106F1D6339B0C4A8945BA705A777F3F4524626FF1FC07EFE41D | 有効 |

XRP Ledgerアカウントが[マルチ署名](multi-signing.html) SignerListを所有する場合、アカウントに加算される[所有者準備金](reserves.html#所有者準備金)を削減します。

この修正を行わない場合、SignerListの所有者準備金は、リスト内の署名者数に応じて15～50 XRPの範囲となります。

この修正により、新しいSignerListの所有者準備金は、署名者数に関係なく5 XRPとなります。以前に作成されたSignerListオブジェクトの準備金は、そのまま変更されません。この修正の後に作成されたSignerListオブジェクトの準備金を削減するには、この修正実施後に、[SignerListSetトランザクション](signerlistset.html)を使用してSignerListを置き換えます。（この置き換えは、前のバージョンの場合とまったく同じです。）


## NegativeUNL
[NegativeUNL]: #negativeunl

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| B4E4F5D2D6FB84DF7399960A732309C9FD530EAE5941838160042833625A6076 | 有効 |

<!-- TODO: translate amendment description -->
Implements a "Negative UNL" system, where the network can track which validators are temporarily offline and disregard those validators for quorum calculations. This can improve the ability of the network to make progress during periods of network instability.


## NonFungibleTokensV1
[NonFungibleTokensV1]: #nonfungibletokensv1

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 3C43D9A973AA4443EF3FC38E42DD306160FBFFDAB901CD8BAA15D09F2597EB87 | 開発中 |

<!-- TODO: translate description -->
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

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 32A122F1352A4C7B3A6D790362CC34749C5E57FCE896377BFDC6CCD14F6CD627 | 予定 |

<!-- TODO: translate description -->
This amendment's only effect is to enable three other amendments at the same time:

- [NonFungibleTokensV1][]
- [fixNFTokenNegOffer][]
- [fixNFTokenDirV1][]

This ensures that the base NFT functionality and the related fixes all become enabled together, with no chance for the buggy functionality to become enabled without the fixes and no delay needed in between.

Validators who wish to enable Non-Fungible Tokens (NFTs) on the XRP Ledger should vote in favor of this amendment and not the others.


## OwnerPaysFee
[OwnerPaysFee]: #ownerpaysfee

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 9178256A980A86CF3D70D0260A7DA6402AAFE43632FDBCB88037978404188871 | 開発中 |

[OfferCreate](offercreate.html)トランザクションタイプと[Payment](payment.html)トランザクションタイプで、[送金手数料](transfer-fees.html)の計算方法に相違があるのを修正します。この修正を行わない場合、オファーがオファープレースメントで実行される際にイシュアンスの保有者が送金手数料を支払いますが、トランザクションの最初の送信者は支払い処理の過程で実行されるオファーの送金手数料を支払います。この修正により、オファーがPaymentトランザクションまたはOfferCreateトランザクションの一部として実行されるかどうかにかかわらず、イシュアンスの保有者が常に送金手数料を支払います。支払い以外のオファー処理は影響を受けません。

この修正については、[Flow Amendment](#flow)を有効にする必要があります。

**注記:** この修正の未完成のバージョンがv0.33.0で導入されましたが、v0.80.0で削除されました。（適用されませんでした。）Rippleは、コードが十分に安定してからAmendmentを再度追加する予定です。

## PayChan
[PayChan]: #paychan

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 08DE7D96082187F6E6578530258C77FAABABE4C20474BDB82F04B021F1A68647 | 有効 |

XRPの「Payment Channel」を作成します。Payment Channelは、2名の当事者間で一方向の繰り返しの支払い、またはそれに伴う一時的な貸付を容易に行えるようにするツールです。Rippleは、この機能が[Interledger Protocol](https://interledger.org/)に役立つと期待しています。ある当事者がPayment Channelを作成し、そのチャンネル内に有効期限を事前に設定してXRPをいくらか確保します。次に、レジャー外部の安全な通信を介して、送信者は「クレーム」メッセージを受信者に送信できます。受信者は有効期限の終了前にクレームメッセージを清算することも、支払いが必要ない場合は清算しないことも選択できます。受信者は、クレームを実際にネットワークに分散させてコンセンサスプロセスで清算されるのを待たなくとも、請求を個々に確認してから、有効期限内であれば多数の少額クレームをまとめて後で清算することができます。

新たに作成するトランザクションタイプは次の3つです。[PaymentChannelCreate][]、[PaymentChannelClaim][]、[PaymentChannelFund][]。新たに作成するレジャーオブジェクトタイプは[PayChannel](paychannel.html)です。レジャー外のデータ構造`Claim`を定義し、ChannelClaimトランザクションに使用します。新たに作成する`rippled` APIメソッドは次のとおりです。[`channel_authorize`](channel_authorize.html) （署名されたクレームを作成します）、[`channel_verify`](channel_verify.html)（署名されたクレームを検証します）、[`account_channels`](account_channels.html)（アカウントに関連するチャンネルをリストを作成します）。

詳細は、[Payment Channelsのチュートリアル](use-payment-channels.html)を参照してください。

## RequireFullyCanonicalSig
[RequireFullyCanonicalSig]: #requirefullycanonicalsig

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 00C1FC4A53E60AB02C864641002B3172F38677E29C26C5406685179B37E1EDAC | 有効 |

<!-- TODO: translate amendment description -->
Changes the signature requirements for the XRP Ledger protocol so that non-fully-canonical signatures are no longer valid in any case. This protects against [transaction malleability](transaction-malleability.html) on _all_ transactions, instead of only protecting transactions with the [tfFullyCanonicalSig flag](transaction-common-fields.html#グローバルフラグ) enabled.

Without this amendment, a transaction is malleable if it uses a secp256k1 signature and does not have tfFullyCanonicalSig enabled. Most signing utilities enable tfFullyCanonicalSig by default, but there are exceptions.

With this amendment, no single-signed transactions are malleable. ([Multi-signed transactions may still be malleable](transaction-malleability.html#マルチ署名の展性) if signers provide more signatures than are necessary.) All transactions must use the fully canonical form of the signature, regardless of the tfFullyCanonicalSig flag. Signing utilities that do not create fully canonical signatures are not supported. All of Ripple's signing utilities have been providing fully-canonical signatures exclusively since at least 2014.

For more information, see [`rippled` issue #3042](https://github.com/ripple/rippled/issues/3042).


## SHAMapV2
[SHAMapV2]: #shamapv2

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| C6970A8B603D8778783B61C0D445C23D1633CCFAEF0D43E7DBCD1521D34BD7C3 | 禁止 |

`rippled`がレジャーを表示する際に使用するハッシュツリー構造を変更します。新しい構造は以前のバージョンよりもコンパクトで効率的です。この修正はレジャーハッシュの計算方法が変わりますが、その他にユーザーに与える影響はありません。

この修正が適用されると、ネットワークでハッシュツリー構造への変更を計算している間、XRP Ledgerはしばらく使用できなくなります。 <!-- STYLE_OVERRIDE: will -->

## SortedDirectories
[SortedDirectories]: #sorteddirectories

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| CC5ABAE4F3EC92E94A59B1908C2BE82D2228B6485C00AFF8F22DF930D89C194E | 有効 |

[DirectoryNodeレジャーオブジェクト](directorynode.html)内の項目をソートして、削除されるべき所有者ディレクトリのページが場合によっては削除されないというバグを修正します。

**警告:** このが適用されていない旧バージョンの`rippled`は、新しいルールでソートされたDirectoryNodeによって機能が停止するおそれがあります。この問題を回避するには、`rippled`バージョン0.80.0以降に[アップグレード](install-rippled.html)してください。

## SusPay
[SusPay]: #suspay

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| DA1BD556B42D85EA9C84066D028D355B52416734D3283F85E216EA5DA6DB7E13 | 禁止 |

この修正は、[Escrow](escrow-object.html) Amendmentに置き換えられました。


## TicketBatch
[TicketBatch]: #ticketbatch

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 955DF3FA5891195A9DAEFA1DDC6BB244B545DDE1BAA84CBB25D5F12A8DA68A0C | 有効 |

<!-- TODO: translate amendment description -->
This amendment adds [Tickets](tickets.html) as a way of sending transactions out of the typical sequence number order.

Standards Draft: [XLS-13d](https://github.com/XRPLF/XRPL-Standards/issues/16).


## Tickets
[Tickets]: #tickets

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| C1B8D934087225F509BEB5A8EC24447854713EE447D277F69545ABFA0E0FD490 | 禁止 |

この修正は、[TicketBatch][] Amendmentに置き換えられました。

## TickSize
[TickSize]: #ticksize

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 532651B4FD58DF8922A49BA101AB3E996E5BFBF95A913B3E392504863E63B164 | 有効 |

オーダーブック内で[オファー](offers.html#オファーのライフサイクル)をランク付けする方法を変更して、通貨発行者がオファーを為替レートでランク付けする際に考慮する有効桁数を設定できるようにします。この修正により、オファーの交換レートが設定された有効桁数に丸められるため、同じ交換レートを持つオファーが増加します。この修正の目的は、以前のオファーよりもランク付けを高くするには、価格面で意味のある改善をしなければならないようにすることです。主要な発行者がこれを採用すれば、既存のオファーよりわずかなパーセンテージだけ上回るオファーでレジャーを攻撃しようとするスパムが低減します。また、よりバラツキの少ない為替レートでオファーをグループ化できるため、レジャー内のオーダーブックを効率的に保管できます。

アカウントに`TickSize`フィールドを追加します。このフィールドは[AccountSetトランザクションタイプ](accountset.html)を使用して設定できます。通貨発行者が`TickSize`フィールドを設定すれば、発行者の通貨を取引するオファーの為替レート（資金の入出金率）がXRP Ledgerによって丸められ、丸められた為替レートに合わせてオファーの金額が調整されます。トランザクションにて1つの通貨にのみ`TickSize`が設定されていれば、その有効桁数が適用されます。異なる`TickSize`値が設定された2つの通貨を取引する場合は、有効桁数が最も小さい`TickSize`が適用されます。XRPに`TickSize`は設定されません。

## TrustSetAuth
[TrustSetAuth]: #trustsetauth

| Amendment ID                                                     | ステータス |
|:-----------------------------------------------------------------|:---------|
| 6781F8368C4771B83E8B821D88F580202BCB4228075297B19E4FDC5233F1EFDC | 有効 |

[承認されたトラストライン](authorized-trust-lines.html)を使用する場合に、会計関係の事前承認（ゼロバランストラストライン）を許可します。

この修正が適用されれば、[`tfSetfAuth`を有効にした](trustset.html#trustsetのフラグ)`TrustSet`トランザクションにおいて、`RippleState`ノードの他のすべての値をデフォルト状態にしたままでも、新しい[`RippleState`レジャーオブジェクト](ripplestate.html)を作成できます。新しい`RippleState`ノードでは、トランザクションの送信者が低いノードと見なされるか高いノードと見なされるかに応じて、[`lsfLowAuth`フラグまたは`lsfHighAuth`フラグ](ripplestate.html#ripplestateのフラグ)が有効になります。トランザクションの送信者は、[asfRequireAuthフラグを有効](accountset.html#accountsetのフラグ)にして[AccountSetトランザクション](accountset.html)を送信することで、事前に[`lsfRequireAuth`](accountroot.html#accountrootのフラグ)を有効にしておく必要があります。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
