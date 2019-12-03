# tecコード

これらのコードは、トランザクションは失敗したものの、[トランザクションコスト](transaction-cost.html)を適用するために、このトランザクションがレジャーに適用されたことを示します。100から199までの数値が含まれています。数値ではなくテキストコードの使用が推奨されます。

ほとんどの場合、`tec`コード付きのトランザクションは、[トランザクションコスト](transaction-cost.html)として支払われた分のXRPを消却する以外の操作は実行しませんが、いくつかの例外があります。例外として、`tecOVERSIZE`となったトランザクションは、一部の[資金供給のないオファー](offers.html#オファーのライフサイクル)を引き続きクリーンアップします。[トランザクションメタデータ](transaction-metadata.html)を常に確認し、トランザクションの実行内容を正確に把握してください。

**注意:** 暫定的に`tec`コードで失敗したトランザクションは、再適用後に成功するか、または別のコードで失敗する可能性があります。検証済みレジャーバージョンに記録される結果が最終結果となります。詳細は、[結果のファイナリティー](finality-of-results.html)と[信頼性の高いトランザクション送信](reliable-transaction-submission.html)を参照してください。

| コード                       | 値 | 説明                             |
|:---------------------------|:------|:----------------------------------------|
| `tecCLAIM`                 | 100   | 不明なエラー。トランザクションコストは消却されました。 |
| `tecCRYPTOCONDITION_ERROR` | 146   | この[EscrowCreate][]トランザクションまたは[EscrowFinish][]トランザクションに指定されるCrypto-conditionの形式が誤っているか、または一致しませんでした。 |
| `tecDIR_FULL`              | 121   | トランザクションがアカウントの所有者ディレクトリにオブジェクト（トラストライン、Check、Escrow、Payment Channelなど）を追加しようと試みましたが、このアカウントはレジャーにこれ以上のオブジェクトを所有できません。 |
| `tecDST_TAG_NEEDED`        | 143   | [Paymentトランザクション][]の宛先タグが省略されましたが、支払先アカウントでは`lsfRequireDestTag`フラグが有効になっています。[新規: rippled 0.28.0][] |
| `tecEXPIRED`               | 148   | トランザクションがオブジェクト（OfferやCheckなど）を作成しようとしましたが、そのオブジェクトで指定された有効期限がすでに経過しています。 |
| `tecFAILED_PROCESSING`     | 105   | トランザクションの処理中に不明なエラーが発生しました。 |
| `tecFROZEN`                | 137   | [OfferCreateトランザクション][]が失敗しました。関係する1つまたは両方の資産が[Global Freeze](freezes.html)の対象となっています。 |
| `tecHAS_OBLIGATIONS`       | 151   | The [AccountDelete transaction][] failed because the account to be deleted owns objects that cannot be deleted. See [Deletion of Accounts](accounts.html#deletion-of-accounts) for details. <!-- TODO: translate --> |
| `tecINSUF_RESERVE_LINE`    | 122   | 送信側アカウントに、新しいトラストラインを作成するのに十分なXRPがないため、トランザクションが失敗しました。（[準備金](reserves.html)を参照してください）このエラーは、取引相手から同一通貨の送信側アカウントへのトラストラインがデフォルト以外の状態である場合に発生します。（その他のケースについては`tecNO_LINE_INSUF_RESERVE`を参照してください。） |
| `tecINSUF_RESERVE_OFFER`   | 123   | 送信側アカウントに、新しいオファーを作成するのに十分なXRPがないため、トランザクションが失敗しました。（[準備金](reserves.html)を参照してください。) |
| `tecINSUFFICIENT_RESERVE`  | 141   | トランザクションによって[必要準備金](reserves.html)が増加し、送信側アカウントの残高を超える可能性があります。[SignerListSet][]、[PaymentChannelCreate][]、[PaymentChannelFund][]、および[EscrowCreate][]からこのエラーコードが返されることがあります。詳細は、[SignerListと準備金](signerlist.html#signerlistと準備金)を参照してください。 |
| `tecINTERNAL`              | 144   | 不明な内部エラーが発生し、トランザクションコストは適用されました。通常はこのエラーは返されません。このエラーを再現できる場合は、[問題を報告](https://github.com/ripple/rippled/issues)してください。 |
| `tecINVARIANT_FAILED`      | 147   | このトランザクションを実行しようとしたところ、不変性チェックが失敗しました。[EnforceInvariants Amendment][]が必要です。このエラーを再現できる場合は、[問題を報告](https://github.com/ripple/rippled/issues)してください。 |
| `tecNEED_MASTER_KEY`       | 142   | このトランザクションはマスターキーを必要とする変更（[マスターキーの無効化または残高凍結能力の放棄](accountset.html#accountsetのフラグ)など）を試みました。[新規: rippled 0.28.0][] |
| `tecNO_ALTERNATIVE_KEY`    | 130   | トランザクションが唯一の[トランザクション承認](transaction-basics.html#取引の承認)メソッドを削除しようとしました。これは、レギュラーキーを削除する[SetRegularKeyトランザクション][]、SignerListを削除する[SignerListSetトランザクション][]、またはマスターキーを無効にする[AccountSetトランザクション][]である可能性があります。（`rippled` 0.30.0より前のバージョンでは、このトランザクションは`tecMASTER_DISABLED`と呼ばれていました。） |
| `tecNO_AUTH`               | 134   | トランザクションはトラストラインの残高を、`lsfRequireAuth`フラグが有効になっているアカウントに追加する必要がありましたが、そのトラストラインが承認されていなかったため、失敗しました。トラストラインが存在しない場合は、代わりに`tecNO_LINE`が発生します。 |
| `tecNO_DST`                | 124   | トランザクションの受信側のアカウントが存在しません。これには、PaymentトランザクションタイプやTrustSetトランザクションタイプがあります。（XRPを十分に受信した場合に作成される可能性があります。） |
| `tecNO_DST_INSUF_XRP`      | 125   | トランザクションの受信側のアカウントが存在しません。トランザクションは、アカウントの作成に十分なXRPを送金していません。 |
| `tecNO_ENTRY`              | 140   | 将来の使用のために予約されています。                |
| `tecNO_ISSUER`             | 133   | 通貨額の`issuer`フィールドに指定されたアカウントが存在しません。 |
| `tecKILLED`                | 150   | [OfferCreateトランザクション][]がtfFillOrKillフラグを指定しましたが、トランザクションを確定できなかったため、このトランザクションは取り消されました。_（[fix1578 Amendment][]が必要です。）_ |
| `tecNO_LINE`               | 135   | [OfferCreateトランザクション][]の`TakerPays`フィールドに、`lsfRequireAuth`を有効にしているイシュアーの資産が指定されており、このオファーを行っているアカウントはその資産に関してトラストラインを確立していません。（通常、オファーを暗黙に行うと必要に応じてトラストラインが作成されますが、この場合は承認なしでは資産を保有できないので問題にはなりません。）トラストラインは存在しているが承認されていない場合は、代わりに`tecNO_AUTH`が発生します。 |
| `tecNO_LINE_INSUF_RESERVE` | 126   | 送信側アカウントに、新しいトラストラインを作成するのに十分なXRPがないため、トランザクションが失敗しました。（[準備金](reserves.html)を参照）このエラーは、取引相手がこのアカウントに対する同一通貨のトラストラインを持っていない場合に発生します。（その他のケースについては`tecINSUF_RESERVE_LINE`を参照してください。） |
| `tecNO_LINE_REDUNDANT`     | 127   | トランザクションはトラストラインをデフォルト状態に設定しようと試みましましたが、トラストラインが存在していなかったため、失敗しました。 |
| `tecNO_PERMISSION`         | 139   | 送信者にはこの操作を実行する権限がありません。たとえば[EscrowFinishトランザクション][]が`FinishAfter`時刻に達する前に保留中の支払をリリースしようとしたか、送信者が所有していないChannelで誰かが[PaymentChannelFund][]を使用しようとしたか、または[Payment][]が「DepositAuth」フラグが有効になっているアカウントに資金の送金を試みました。 |
| `tecNO_REGULAR_KEY`        | 131   | [AccountSetトランザクション][]がマスターキーを無効にしようとしましたが、アカウントにはマスターキー以外で[トランザクションを承認する](transaction-basics.html#取引の承認)方法がありません。[マルチ署名](multi-signing.html)が有効な場合、このコードは廃止予定であり、代わりに`tecNO_ALTERNATIVE_KEY`が使用されます。 |
| `tecNO_TARGET`             | 138   | トランザクションが参照するEscrowレジャーオブジェクトまたはPayChannelレジャーオブジェクトが存在していません。これらのオブジェクトは、これまでに存在したことがないか、すでに削除されています。（たとえば、別の[EscrowFinishトランザクション][]で保留中の支払がすでに実行されている場合などです。）あるいは、支払先アカウントで`asfDisallowXRP`が設定されているため、このアカウントは[PaymentChannelCreate][]トランザクションまたは[EscrowCreate][]トランザクションの宛先に指定できません。 |
| `tecOVERSIZE`              | 145   | サーバーがこのトランザクションの適用時に大量のメタデータを作成したため、このトランザクションを処理できませんでした。[新規: rippled 0.29.0-hf1][] |
| `tecOWNERS`                | 132   | トランザクションでは、トランザクションを送信するアカウントの「所有者カウント」はゼロ以外である必要があります。このためトランザクションを正常に完了できません。たとえば、トラストラインや使用可能なオファーがあるアカウントでは、[`lsfRequireAuth`](accountset.html#accountsetのフラグ)フラグを有効にできません。 |
| `tecPATH_DRY`              | 128   | トランザクションが失敗しました。指定されたパスに、送信の実行に十分な流動性がありませんでした。つまり、支払元アカウントと支払先アカウントはトラストラインにより関連付けされていません。 |
| `tecPATH_PARTIAL`          | 101   | トランザクションが失敗しました。指定されたパスに、全額を送金するのに十分な流動性がありませんでした。 |
| `tecTOO_SOON`              | 152   | The [AccountDelete transaction][] failed because the account to be deleted had a `Sequence` number that is too high. The current ledger index must be at least 256 higher than the account's sequence number. <!-- TODO: translate --> |
| `tecUNFUNDED`              | 129   | トランザクションが失敗しました。アカウントがトランザクションの支払額に十分なXRPを保有しておらず、 _かつ_ このトランザクションを実行するのに追加で必要となる準備金が不足しています。（[準備金](reserves.html)を参照してください。) |
| `tecUNFUNDED_ADD`          | 102   | **廃止予定。**                         |
| `tecUNFUNDED_PAYMENT`      | 104   | 送信側アカウントが準備金を考慮せずに、保有するXRPを超える額の送信を試みたため、トランザクションが失敗しました。（[準備金](reserves.html)を参照してください。) |
| `tecUNFUNDED_OFFER`        | 103   | [OfferCreateトランザクション][]が失敗しました。オファーの作成元アカウントに`TakerGets` 通貨がありません。 |

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
