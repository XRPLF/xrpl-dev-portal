---
seo:
    description: tecコードは、トランザクションは失敗したものの、トランザクションコストを適用するために、このトランザクションがレジャーに適用されたことを示します。
labels:
    - トランザクション送信
---
# tecコード
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/impl/TER.cpp "ソース")

これらのコードは、トランザクションは失敗したものの、[トランザクションコスト](../../../../concepts/transactions/transaction-cost.md)を適用するために、このトランザクションがレジャーに適用されたことを示します。100から199までの数値が含まれています。数値ではなくテキストコードの使用が推奨されます。

ほとんどの場合、`tec`コード付きのトランザクションは、[トランザクションコスト](../../../../concepts/transactions/transaction-cost.md)として支払われた分のXRPを消却する以外の操作は実行しませんが、いくつかの例外があります。例外として、`tecOVERSIZE`となったトランザクションは、一部の[資金供給のないオファー](../../../../concepts/tokens/decentralized-exchange/offers.md#オファーのライフサイクル)を引き続きクリーンアップします。[トランザクションメタデータ](../metadata.md)を常に確認し、トランザクションの実行内容を正確に把握してください。

{% admonition type="warning" name="注意" %}暫定的に`tec`コードで失敗したトランザクションは、再適用後に成功するか、または別のコードで失敗する可能性があります。検証済みレジャーバージョンに記録される結果が最終結果となります。詳細は、[結果のファイナリティー](../../../../concepts/transactions/finality-of-results/index.md)と[信頼できるトランザクションの送信](../../../../concepts/transactions/reliable-transaction-submission.md)をご覧ください。{% /admonition %}

| コード                             | 値  | 説明                                    |
|:---------------------------------- |:----|:----------------------------------------|
| `tecAMM_ACCOUNT`                   | 168 | 自動マーケットメーカー（AMM）アカウントではこの操作が許可されていないため、トランザクションが失敗しました。 {% amendment-disclaimer name="AMM" /%}  |
| `tecAMM_UNFUNDED`                  | 162 | 送信者が指定された資産を十分に保有していないため[AMMCreateトランザクション][]が失敗しました。 {% amendment-disclaimer name="AMM" /%}  |
| `tecAMM_BALANCE`                   | 163 | AMMまたはユーザーが指定された資産の十分な量を保有していないため[AMMDeposit][]または[AMMWithdraw][]トランザクションが失敗しました。(例えば、AMMが保有するよりも多くを引き出そうとしている場合） {% amendment-disclaimer name="AMM" /%}  |
| `tecAMM_EMPTY`                     | 166 | AMMのプールに資産がないためAMM関連のトランザクションが失敗しました。この状態では、AMMを削除するか、新しい入金でAMMに資金を供給することしかできません。 {% amendment-disclaimer name="AMM" /%}  |
| `tecAMM_FAILED`                    | 164 | AMM関連のトランザクションは失敗しました。[AMMDeposit][]または[AMMWithdraw][]の場合、これは送信者が指定された資産を十分に持っていないか、利用可能な金額では不可能な実効価格がトランザクションで要求されたことが原因である可能性があります。[AMMBid][]の場合、これは当該アカウントが落札に必要な金額を十分に持っていないか、指定された最高入札価格よりも高い金額が必要であることが原因である可能性があります。[AMMVote] の場合、このAMMのLPトークンをより多く保有している他のアカウントからの投票がすでに多すぎるのが原因である可能性があります。 {% amendment-disclaimer name="AMM" /%}  |
| `tecAMM_INVALID_TOKENS`            | 165 | LPトークンの不足や丸め処理の問題により、AMM関連のトランザクションが失敗しました。例えば、返却されるLPトークンの額がゼロに切り捨てられる場合、「非常に少量の資産を預け入れる」という行為が失敗する可能性があります。 {% amendment-disclaimer name="AMM" /%}  |
| `tecAMM_NOT_EMPTY`                 | 167 | トランザクションは、資産プールが空のAMMで動作するように設計されていましたが、指定されたAMMは資産を保有しています。 {% amendment-disclaimer name="AMM" /%}  |
| `tecCANT_ACCEPT_OWN_NFTOKEN_OFFER` | 157 | トランザクションは、同じアカウントが購入または売却するために作成された[非代替可能トークン(NFT)](../../../../concepts/tokens/nfts/index.md)のオファーを受け入れようとしました。 {% amendment-disclaimer name="NonFungibleTokensV1_1" /%} |
| `tecCLAIM`                         | 100 | 不明なエラー。トランザクションコストは消却されました。 |
| `tecCRYPTOCONDITION_ERROR`         | 146 | この[EscrowCreate][]トランザクションまたは[EscrowFinish][]トランザクションに指定されるCrypto-conditionの形式が誤っているか、または一致しませんでした。 |
| `tecDIR_FULL`                      | 121 | トランザクションがアカウントの所有者ディレクトリにオブジェクト（トラストライン、Check、Escrow、Payment Channelなど）を追加しようと試みましたが、このアカウントはレジャーにこれ以上のオブジェクトを所有できません。 |
| `tecDUPLICATE`                     | 149 | トランザクションが、すでに存在するオブジェクト（[DepositPreauth][]の承認など）を作成しようとしました。 |
| `tecDST_TAG_NEEDED`                | 143 | [Paymentトランザクション][]の宛先タグが省略されましたが、支払先アカウントでは`lsfRequireDestTag`フラグが有効になっています。 |
| `tecEMPTY_DID`                     | 187 | トランザクションが[DIDエントリ](../../ledger-data/ledger-entry-types/did.md)を作成しようとしましたが、内容が空でした。DIDは空にできません。 {% amendment-disclaimer name="DID" /%} |
| `tecEXPIRED`                       | 148 | トランザクションがオブジェクト（OfferやCheckなど）を作成しようとしましたが、そのオブジェクトで指定された有効期限がすでに経過しています。 |
| `tecFAILED_PROCESSING`             | 105 | トランザクションの処理中に不明なエラーが発生しました。 |
| `tecFROZEN`                        | 137 | [OfferCreateトランザクション][]が失敗しました。関係する1つまたは両方の資産が[Global Freeze](../../../../concepts/tokens/fungible-tokens/freezes.md)の対象となっています。 |
| `tecHAS_OBLIGATIONS `              | 151 | 削除するアカウントが削除できないオブジェクトを所有しているため、[AccountDeleteトランザクション][]が失敗しました。詳細は、[アカウントの削除](../../../../concepts/accounts/deleting-accounts.md)をご覧ください。 |
| `tecINSUF_RESERVE_LINE`            | 122 | 送信側アカウントに、新しいトラストラインを作成するのに十分なXRPがないため、トランザクションが失敗しました。（[準備金](../../../../concepts/accounts/reserves.md)をご覧ください）このエラーは、取引相手から同一通貨の送信側アカウントへのトラストラインがデフォルト以外の状態である場合に発生します。（その他のケースについては`tecNO_LINE_INSUF_RESERVE`をご覧ください。） |
| `tecINSUF_RESERVE_OFFER`           | 123 | 送信側アカウントに、新しいオファーを作成するのに十分なXRPがないため、トランザクションが失敗しました。（[準備金](../../../../concepts/accounts/reserves.md)をご覧ください。) |
| `tecINSUFF_FEE`                    | 136 | 指定された[トランザクションコスト](../../../../concepts/transactions/transaction-cost.md)を支払うのに十分なXRPが送金元アカウントにないため、トランザクションが失敗しました。（この場合、送金元のXRPが指定されたトランザクションコストよりも低い場合でも、トランザクション処理によってすべて消却されます。）この結果は、このトランザクションがコンセンサスセットに含まれるのに十分なネットワークに配布された*後に*アカウントの残高が減少した場合にのみ発生します。そうでない場合、トランザクションは配布される前に[`terINSUF_FEE_B`](ter-codes.md)で失敗します。 |
| `tecINSUFFICIENT_FUNDS`            | 158 | 関連するアカウントのうちの1つが必要な資産を十分に保有していません。 {% amendment-disclaimer name="NonFungibleTokensV1_1" /%} |
| `tecINSUFFICIENT_PAYMENT`          | 161 | 指定された金額は、トランザクションに関わるすべての料金を支払うには十分ではありません。例えば、非代替性トークンを取引する場合、購入金額はブローカー手数料と販売金額の両方を支払うには不十分である可能性があります。 {% amendment-disclaimer name="NonFungibleTokensV1_1" /%} |
| `tecINSUFFICIENT_RESERVE`          | 141 | トランザクションによって[必要準備金](../../../../concepts/accounts/reserves.md)が増加し、送信側アカウントの残高を超える可能性があります。[SignerListSet][]、[PaymentChannelCreate][]、[PaymentChannelFund][]、および[EscrowCreate][]からこのエラーコードが返されることがあります。詳細は、[SignerListと準備金](../../ledger-data/ledger-entry-types/signerlist.md#signerlistと準備金)をご覧ください。 |
| `tecINTERNAL`                      | 144 | 不明な内部エラーが発生し、トランザクションコストは適用されました。通常はこのエラーは返されません。このエラーを再現できる場合は、[問題を報告](https://github.com/XRPLF/rippled/issues)してください。 |
| `tecINVARIANT_FAILED`              | 147 | このトランザクションを実行しようとしたところ、不変性チェックが失敗しました。このエラーを再現できる場合は、[問題を報告](https://github.com/XRPLF/rippled/issues)してください。{% amendment-disclaimer name="EnforceInvariants" /%} |
| `tecKILLED`                        | 150 | [OfferCreateトランザクション][]がtfFillOrKillフラグを指定しましたが、トランザクションを確定できなかったため、このトランザクションは取り消されました。{% amendment-disclaimer name="fix1578" /%} |
| `tecMAX_SEQUENCE_REACHED`          | 153 | シーケンス番号フィールドはすでに最大値に達しています。これには`MintedNFTokens`フィールドも含まれます。 {% amendment-disclaimer name="NonFungibleTokensV1_1" /%} |
| `tecNEED_MASTER_KEY`               | 142 | このトランザクションはマスターキーを必要とする変更（[マスターキーの無効化または残高フリーズ能力の放棄](../types/accountset.md#accountsetのフラグ)など）を試みました。|
| `tecNFTOKEN_BUY_SELL_MISMATCH`     | 155 | [NFTokenAcceptOfferトランザクション][]は、非代替性トークンの購入と売却に関する対応しないオファーをマッチングさせようとしました。 {% amendment-disclaimer name="NonFungibleTokensV1_1" /%} |
| `tecNFTOKEN_OFFER_TYPE_MISMATCH`   | 156 | トランザクションで指定されたオファーのうち、1つまたは複数について、オファーの種類が適切ではありませんでした。（例えば、`NFTokenSellOffer`フィールドに購入オファーが指定されていました。） {% amendment-disclaimer name="NonFungibleTokensV1_1" /%} |
| `tecNO_ALTERNATIVE_KEY`            | 130 | トランザクションが唯一の[トランザクション承認](../../../../concepts/transactions/index.md#トランザクションの承認)メソッドを削除しようとしました。これは、レギュラーキーを削除する[SetRegularKeyトランザクション][]、SignerListを削除する[SignerListSetトランザクション][]、またはマスターキーを無効にする[AccountSetトランザクション][]である可能性があります。（`rippled` 0.30.0より前のバージョンでは、このトランザクションは`tecMASTER_DISABLED`と呼ばれていました。） |
| `tecNO_AUTH`                       | 134 | トランザクションはトラストラインの残高を、`lsfRequireAuth`フラグが有効になっているアカウントに追加する必要がありましたが、そのトラストラインが承認されていなかったため、失敗しました。トラストラインが存在しない場合は、代わりに`tecNO_LINE`が発生します。 |
| `tecNO_DST`                        | 124 | トランザクションの受信側のアカウントが存在しません。これには、PaymentトランザクションタイプやTrustSetトランザクションタイプがあります。（XRPを十分に受信した場合に作成される可能性があります。） |
| `tecNO_DST_INSUF_XRP`              | 125 | トランザクションの受信側のアカウントが存在しません。トランザクションは、アカウントの作成に十分なXRPを送金していません。 |
| `tecNO_ENTRY`                      | 140 | トランザクションは[Check](../../../../concepts/payment-types/checks.md)か[Payment Channel](../../../../concepts/payment-types/payment-channels.md)か[Deposit Preauth事前承認](../../ledger-data/ledger-entry-types/depositpreauth.md)などの[レジャーオブジェクト](../../ledger-data/ledger-entry-types/index.md)の変更を試みましたが、そのオブジェクトは存在しません。以前のトランザクションで削除されましたか、あるいはこのトランザクションに正しくないIDフィールド（`CheckID`か`Channel`か`Unauthorize`など）があります。 |
| `tecNO_ISSUER`                     | 133 | 通貨額の`issuer`フィールドに指定されたアカウントが存在しません。 |
| `tecNO_LINE`                       | 135 | [OfferCreateトランザクション][]の`TakerPays`フィールドに、`lsfRequireAuth`を有効にしているイシュアーの資産が指定されており、このオファーを行っているアカウントはその資産に関してトラストラインを確立していません。（通常、オファーを暗黙に行うと必要に応じてトラストラインが作成されますが、この場合は承認なしでは資産を保有できないので問題にはなりません。）トラストラインは存在しているが承認されていない場合は、代わりに`tecNO_AUTH`が発生します。 |
| `tecNO_LINE_INSUF_RESERVE`         | 126 | 送信側アカウントに、新しいトラストラインを作成するのに十分なXRPがないため、トランザクションが失敗しました。（[準備金](../../../../concepts/accounts/reserves.md)を参照）このエラーは、取引相手がこのアカウントに対する同一通貨のトラストラインを持っていない場合に発生します。（その他のケースについては`tecINSUF_RESERVE_LINE`をご覧ください。） |
| `tecNO_LINE_REDUNDANT`             | 127 | トランザクションはトラストラインをデフォルト状態に設定しようと試みましたが、トラストラインが存在していなかったため、失敗しました。 |
| `tecNO_PERMISSION`                 | 139 | 送信者にはこの操作を実行する権限がありません。たとえば[EscrowFinishトランザクション][]が`FinishAfter`時刻に達する前に保留中の支払をリリースしようとしたか、送信者が所有していないChannelで誰かが[PaymentChannelFund][]を使用しようとしたか、または[Payment][]が「DepositAuth」フラグが有効になっているアカウントに資金の送金を試みました。 |
| `tecNO_REGULAR_KEY`                | 131 | [AccountSetトランザクション][]がマスターキーを無効にしようとしましたが、アカウントにはマスターキー以外で[トランザクションを承認する](../../../../concepts/transactions/index.md#トランザクションの承認)方法がありません。[マルチシグ](../../../../concepts/accounts/multi-signing.md)が有効な場合、このコードは廃止予定であり、代わりに`tecNO_ALTERNATIVE_KEY`が使用されます。 |
| `tecNO_SUITABLE_NFTOKEN_PAGE`      | 154 | トランザクションは、非代替性トークンの発行または取得を試みましたが、`NFToken`を受け取るアカウントには、それを保持できるディレクトリページがありません。この状況はレアケースです。 {% amendment-disclaimer name="NonFungibleTokensV1_1" /%} |
| `tecNO_TARGET`                     | 138 | トランザクションが参照するEscrowレジャーオブジェクトまたはPayChannelレジャーオブジェクトが存在していません。これらのオブジェクトは、これまでに存在したことがないか、すでに削除されています。（たとえば、別の[EscrowFinishトランザクション][]で保留中の支払がすでに実行されている場合などです。）あるいは、支払先アカウントで`asfDisallowXRP`が設定されているため、このアカウントは[PaymentChannelCreate][]トランザクションまたは[EscrowCreate][]トランザクションの宛先に指定できません。 |
| `tecOVERSIZE`                      | 145 | サーバがこのトランザクションの適用時に大量のメタデータを作成したため、このトランザクションを処理できませんでした。 |
| `tecOWNERS`                        | 132 | トランザクションでは、トランザクションを送信するアカウントの「所有者カウント」はゼロ以外である必要があります。このためトランザクションを正常に完了できません。たとえば、トラストラインや使用可能なオファーがあるアカウントでは、[`lsfRequireAuth`](../types/accountset.md#accountsetのフラグ)フラグを有効にできません。 |
| `tecPATH_DRY`                      | 128 | トランザクションが失敗しました。指定されたパスに、送信の実行に十分な流動性がありませんでした。つまり、支払元アカウントと支払先アカウントはトラストラインにより関連付けされていません。 |
| `tecPATH_PARTIAL`                  | 101 | トランザクションが失敗しました。指定されたパスに、全額を送金するのに十分な流動性がありませんでした。 |
| `tecTOO_SOON`                      | 152 | 削除するアカウントの`Sequence`番号が大きすぎるため、[AccountDeleteトランザクション][]が失敗しました。現行のレジャーインデックスは、アカウントのシーケンス番号より256以上大きくなければなりません。 |
| `tecUNFUNDED`                      | 129 | トランザクションが失敗しました。アカウントがトランザクションの支払額に十分なXRPを保有しておらず、 _かつ_ このトランザクションを実行するのに追加で必要となる準備金が不足しています。([準備金](../../../../concepts/accounts/reserves.md)をご覧ください。) |
| `tecUNFUNDED_ADD`                  | 102 | **廃止。** |
| `tecUNFUNDED_PAYMENT`              | 104 | 送信側アカウントが準備金を考慮せずに、保有するXRPを超える額の送信を試みたため、トランザクションが失敗しました。([準備金](../../../../concepts/accounts/reserves.md)をご覧ください。) |
| `tecUNFUNDED_OFFER`                | 103 | [OfferCreateトランザクション][]が失敗しました。オファーの作成元アカウントに`TakerGets`通貨がありません。 |

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
