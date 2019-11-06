# temコード

これらのコードは、トランザクションの形式が正しくないため、XRP Ledgerプロトコルに基づきトランザクションが正常に完了しないことを示します。これらには-299から-200までの数値が含まれています。実際のエラーに対して数値は変更される可能性がありますので、これに頼らないでください。

**ヒント:** `tem`コードが付いているトランザクションはレジャーには適用されません。またこのようなトランザクションが原因でXRP Ledgerの状態が変わることはありません。有効なトランザクションに関するルールが変更されない限り、`tem`コードが最終的な結果となります。（例えば、[Amendment](amendments.html)の有効化前に当該のAmendmentの機能を使用すると`temDISABLED`になります。後日Amendmentが有効化されると、エラーになったトランザクションは有効となり、正常に処理される可能性があります。）

| コード                         | 説明                                   |
|:-----------------------------|:----------------------------------------------|
| `temBAD_AMOUNT`               | トランザクションにより指定された額（宛先への[Payment][]の`Amount`または`SendMax`の金額など）が無効でした。マイナスの金額が指定された可能性があります。 |
| `temBAD_AUTH_MASTER`         | このトランザクションの署名に使用されたキーが、トランザクションの送信元アカウントのマスターキーと一致していません。また、アカウントに[レギュラーキー](cryptographic-keys.html)セットがありません。 |
| `temBAD_CURRENCY`             | トランザクションの通貨フィールドが誤って指定されています。正しいフォーマットについては、[通貨額の指定][通貨額]を参照してください。 |
| `temBAD_EXPIRATION`           | トランザクションの有効期限の値が誤って指定されています（[OfferCreateトランザクション][]など）。あるいは、トランザクションに必須の有効期限値が指定されていません（例えば、[EscrowCreateトランザクション][]の作成過程などで）。 |
| `temBAD_FEE`                  | トランザクションで`Fee`の値が誤って指定されています（例えば、XRP以外の通貨やマイナスの額のXRPを指定するなど）。 |
| `temBAD_ISSUER`               | 要求に指定されている通貨の`issuer`フィールドが、トランザクションにて誤って指定されています。 |
| `temBAD_LIMIT`                | [TrustSetトランザクション][]でトラストラインの`LimitAmount`値が誤って指定されています。 |
| `temBAD_OFFER`                | [OfferCreateトランザクション][]で無効なオファーが指定されています（XRPをXRP自身と取引するオファー、マイナスの額のオファーなど）。 |
| `temBAD_PATH`                 | [Paymentトランザクション][]の1つ以上の[パス](paths.html)が誤って指定されています。例えば、XRPのイシュアーが含まれていたり、アカウントが異なる方法で指定されたりするなど。 |
| `temBAD_PATH_LOOP`           | [Paymentトランザクション][]で[パス](paths.html)の1つがループとしてマークされているため、限られた時間内に処理できません。 |
| `temBAD_SEND_XRP_LIMIT`     | [Paymentトランザクション][]で、XRP間の直接支払に[tfLimitQuality](payment.html#クオリティの制限)フラグが使用されましたが、XRP間の支払いでは通貨の取引は行われません。 |
| `temBAD_SEND_XRP_MAX`       | [Paymentトランザクション][]で、XRP間の直接支払に`SendMax`フィールドが指定されていますが、XRPの送金ではSendMaxは不要です。（SendMaxでXRPが有効となるのは、宛先への`Amount`がXRPではない場合のみです。） |
| `temBAD_SEND_XRP_NO_DIRECT` | [Paymentトランザクション][]で、XRP間の直接支払に[tfNoDirectRipple](payment.html#paymentのフラグ)フラグが使用されていますが、XRP間の支払いは常に直接行われます。 |
| `temBAD_SEND_XRP_PARTIAL`   | [Paymentトランザクション][]で、XRP間の直接支払に [tfPartialPayment](partial-payments.html)フラグが使用されていますが、XRP間の直接支払では常に全額が送金されます。 |
| `temBAD_SEND_XRP_PATHS`     | [Paymentトランザクション][]で、XRP送金時の`Paths`が指定されていますが、XRP間の支払いは常に直接行われます。 |
| `temBAD_SEQUENCE`             | トランザクションは、トランザクション自体の`Sequence`番号よりも大きいシーケンス番号を参照します。例えば、取り消したいオファーは、そのオファーを取り消すトランザクションよりも後に置く必要があります。 |
| `temBAD_SIGNATURE`            | このトランザクションを承認するための署名がないか、または署名の形式が適切ではありません。（適切な形式の署名がアカウントで承認されない場合は、[tecNO_PERMISSION](tec-codes.html)を参照してください。） |
| `temBAD_SRC_ACCOUNT`         | このトランザクションの送信元の`Account`（「支払元アカウント」）の[アカウント](accounts.html)アドレスは適切な形式ではありません。 |
| `temBAD_TRANSFER_RATE`       | [AccountSetトランザクションの`TransferRate`フィールド](accountset.html#transferrate)のフォーマットが適切ではないか、または許容範囲外です。 |
| `temCANNOT_PREAUTH_SELF`     | [DepositPreauthトランザクション][]の送信者は、事前承認対象のアカウントとしても指定されていました。自分自身を事前承認することはできません。 |
| `temDST_IS_SRC`              | トランザクションで宛先アドレスがトランザクションの送信元`Account`として誤って指定されていました。これにはトラストライン（支払先アドレスは`LimitAmount`の`issuer`フィールド）とPayment Channel（支払先アドレスは`Destination`フィールド）などがあります。 |
| `temDST_NEEDED`               | トランザクションで宛先が誤って省略されていました。これは、[Paymentトランザクション][]の`Destination`フィールド、または`TrustSet`トランザクションの`LimitAmount`フィールドの`issuer`サブフィールドで起こり得ます。 |
| `temINVALID`                   | その他の理由により、トランザクションは無効です。例えば、トランザクションIDのフォーマットや署名の形式が正しくないなど、トランザクションを解釈する過程で何らかの誤った処理が発生した可能性があります。 |
| `temINVALID_FLAG`             | トランザクションに指定されている[フラグ](transaction-common-fields.html#flagsフィールド)が存在していないか、または矛盾するフラグの組み合わせが指定されています。 |
| `temMALFORMED`                 | トランザクションのフォーマットで不明な問題が発生しました。 |
| `temREDUNDANT`                 | トランザクションは処理を行いません。例えば、送信側アカウントに支払いを直接送金する場合や、同一イシュアーの同一通貨を売買するオファーを作成する場合などです。 |
| `temREDUNDANT_SEND_MAX`      | [削除: rippled 0.28.0][] |
| `temRIPPLE_EMPTY`             | [Paymentトランザクション][]に指定されている`Paths`フィールドが空ですが、この支払いを完了するにはパスが必要です。 |
| `temBAD_WEIGHT`                | [SignerListSetトランザクション][]に無効な`SignerWeight`が指定されています。例えば、0やマイナス値など。 |
| `temBAD_SIGNER`                | [SignerListSetトランザクション][]に指定されている署名者が無効です。例えば、重複するエントリが指定されている場合や、SignerListの所有者がメンバーでもある場合などです。 |
| `temBAD_QUORUM`                | [SignerListSetトランザクション][]に無効な`SignerQuorum`値が指定されています。この値が0以下であるか、またはリストのすべての署名者の合計数を超えています。 |
| `temUNCERTAIN`                 | 内部使用のみ。通常はこのコードは返されません。 |
| `temUNKNOWN`                   | 内部使用のみ。通常はこのコードは返されません。 |
| `temDISABLED`                  | このトランザクションには、無効化されているロジックが必要です。通常これは、現行レジャー向けに有効化されていない[Amendment](amendments.html)を使用しようとしていることを意味します。 |

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
