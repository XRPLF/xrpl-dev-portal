# Escrow

Escrowは、XRP建ての条件付き送金決済を可能にするXRP Ledgerの機能です。 _Escrow_ と呼ばれるこの条件付き決済では、XRPはエスクローに預託され、後日特定の条件が満たされた時点で送金されます。Escrowを完了する条件には、時間ベースのロック解除や[Crypto-conditions][]などがあります。期限までに終了しなかった場合に期限切れとなるようにEscrowを設定することもできます。

エスクローに預託されているXRPはロックアップされます。Escrowが正常に終了またはキャンセルされるまでは、誰もXRPを使用または消却できません。有効期限前は、指定された受取人のみがXRPを受領できます。有効期限経過後は、XRPは送金元にのみ返金されます。

## 使用法

<!--{# Diagram sources: https://docs.google.com/presentation/d/1C-_TLkkoQEH7KJ6Gjwa1gO6EX17SLiJ8lxvFcAl6Rxo/ #}-->

[![Escrowのフローチャート（正常終了）](img/escrow-success-flow.ja.png)](img/escrow-success-flow.ja.png)

**ステップ1:** Escrowを送信するにあたり、送金元は[EscrowCreateトランザクション][]を使用していくらかのXRPをロックアップします。このトランザクションでは、終了時刻または有効期限、あるいはその両方が定義されます。また、このトランザクションでは、Escrow終了時に満たされるべきCrypto-conditionも定義できます。さらに、このトランザクションでは、XRPの指定受取人を定義する必要があります。受取人と送金元は同じでも _かまいません_ 。

**ステップ2:** このトランザクションの処理完了後に、エスクローに預託されたXRPを保持する[Escrowオブジェクト](escrow-object.html)がXRP Ledgerに作成されます。このオブジェクトには、オブジェクトを作成したトランザクションにより定義されたEscrowのプロパティーが含まれています。このEscrowに終了時刻が設定されている場合、この時刻まではXRPには誰もアクセスできません。

**ステップ3:** 受取人またはその他のXRP Ledgerアドレスが[EscrowFinishトランザクション][]を送信し、XRPが送金されます。正しい条件が満たされると、レジャーのEscrowオブジェクトは消却され、XRPが指定受取人に入金されます。EscrowにCrypto-conditionが指定されている場合、このトランザクションにはその条件に対するフルフィルメントが含まれている必要があります。Escrowの有効期限がすでに切れている場合、EscrowFinishトランザクションはコード[`tecNO_PERMISSION`](tec-codes.html)で失敗します。

### 有効期限切れの例

[![Escrowのフローチャート（期限切れEscrow）](img/escrow-cancel-flow.ja.png)](img/escrow-cancel-flow.ja.png)

Escrowはすべて同じ方法で開始されるため、**ステップ1と2**は正常終了の例と同じです。

**ステップ3a:** Escrowに有効期限が設定されており、有効期限までにEscrowが正常に終了しなかった場合、Escrowは期限切れとみなされます。XRP Ledgerに引き続き残りますが、これ以降は正常に終了できなくなります。（期限切れオブジェクトは、トランザクションにより変更されるまでレジャーに残ります。時間ベースのトリガーではレジャーの内容は変更できません。）

**ステップ4a:** 送金元またはその他のXRP Ledgerアドレスが、[EscrowCancelトランザクション][]を送信し、期限切れのEscrowをキャンセルします。これによりレジャーの[Escrowオブジェクト](escrow-object.html)が消却され、XRPは送金元に返金されます。

## 制約事項

Escrowは、XRP Ledgerを[Interledger Protocol][]やその他のスマートコントラクトで使用できるようにする機能として設計されています。現行バージョンでは、複雑にならないように範囲が適度に制限されています。

- EscrowはXRPでのみ実行でき、発行済み通貨では実行できません。
- Escrowでは、少なくとも2つのトランザクション（Escrowを作成するトランザクションとEscrowを終了またはキャンセルするトランザクション）を送信する必要があります。したがって、参加者は2つのトランザクションの[トランザクションコスト](transaction-cost.html)を消却する必要があるため、ごく少額の決済にEscrowを使用することは合理的ではありません。
    - Crypto-conditionを使用する場合、[EscrowFinishトランザクションのコスト](#escrowfinishトランザクションのコスト)が通常よりも高くなります。
- Escrowはすべて、「Finish-after」時刻または[Crypto-condition][]のいずれか、またはこの両方を使用して作成する必要があります。EscrowにFinish-after時刻が設定されていない場合は、有効期限が設定されている必要があります。

    **注記:** [fix1571 Amendment][] でEscrowの作成要件が変更されました。このAmendmentよりも前に作成されたEscrowでは、条件やFinish-after時刻を指定せずに有効期限を指定できました。このようなEscrowは誰でも即時に終了できます（資金を指定受取人に送金します）。

- Escrowを作成するトランザクションの実行時には、時刻の値が過去の時間であってはなりません。
- 時限リリースおよび有効期限は、XRP Ledgerクローズに制約されます。つまり実際には、レジャーの正確なクローズ時刻に基づいて、これらの時刻が約5秒単位で丸められる場合があります。
- サポートされている唯一の[Crypto-condition][]タイプはPREIMAGE-SHA-256です。

Escrowは、少量の大口決済に適した大きな保証を提供しています。[Payment Channel](use-payment-channels.html)は、迅速な小口決済に適しています。もちろん、条件無しの[決済](payment.html)も多くのユースケースで好まれます。

## 状態遷移図

次の図は、Escrow実施時の各状態を示します。

[![Escrowの状態がHeld → Ready/Conditionally Ready → Expiredと遷移する様子を示す状態遷移図](img/escrow-states.ja.png)](img/escrow-states.ja.png)

この図は、Escrowの「Finish-after」時刻（`FinishAfter`フィールド）、Crypto-condition（`Condition`フィールド）、および有効期限（`CancelAfter`フィールド）の3通りの組み合わせの3つの例を示します。

- **時間ベースのEscrow（左）:** Finish-after時刻のみが設定されているEscrowは、**Held**状態で作成されます。指定の時刻が経過すると**Ready**になり、誰でもこのEscrowを終了できるようになります。Escrowに有効期限が設定されており、その時刻になるまでに誰もEscrowを終了しないと、そのEscrowは**Expired**になります。Expired状態では、Escrowを終了できなくなり、誰でもEscrowをキャンセルできるようになります。Escrowに`CancelAfter`フィールドが設定されていない場合、Escrowが期限切れになることがないため、キャンセルできません。

- **コンビネーションEscrow（中央）:** EscrowでCrypto-condition（`Condition`フィールド） _および_ 「Finish-after」時刻（`FinishAfter` フィールド）の両方が指定されている場合、Finish-after時刻が経過するまでEscrowは**Held**状態です。その後**Conditionally Ready**になり、Crypto-conditionに対し正しいフルフィルメントを提供すればEscrowを終了できます。Escrowに有効期限（`CancelAfter`フィールド）が設定されており、その時刻になるまでに誰もEscrowを終了しないと、そのEscrowは**Expired**になります。Expired状態では、Escrowを終了できなくなり、誰でもEscrowをキャンセルできるようになります。Escrowに`CancelAfter`フィールドが設定されていない場合、Escrowが期限切れになることがないため、キャンセルできません。

- **条件付きEscrow（右）:** EscrowでCrypto-condition（`Condition`フィールド）が指定されており、Finish-after時刻が指定されていない場合、Escrowは作成時点で即時に**Conditionally Ready**になります。この時点では、Crypto-conditionに対する正しいフルフィルメントを提供した人だけがEscrowを終了できます。有効期限（`CancelAfter`フィールド）までに終了されなかったEscrowは**Expired**になります。（Finish-after時刻が設定されていないEscrowには、有効期限が設定されている _必要があります_ 。）Expired状態では、Escrowを終了できなくなり、誰でもEscrowをキャンセルできるようになります。



## Escrowの利用可能性

条件付き決済は、2017-03-31以降XRP Ledgerコンセンサスプロトコルに対する[「Escrow」Amendment](known-amendments.html#escrow)により利用可能になりました。同機能の以前のバージョンは、2016年に「Suspended Payments」（SusPay）という名称で[Ripple Test Net](https://ripple.com/build/ripple-test-net/)で利用可能になりました。

[スタンドアロンモード](rippled-server-modes.html#rippledサーバーをスタンドアロンモードで実行する理由)でのテストの際には、Amendmentのステータスに関係なく、Escrow機能をローカルで強制的に有効にできます。次のスタンザを`rippled.cfg`に追加してください。

    [features]
    Escrow

Escrow Amendmentのステータスは、[featureメソッド][]を使用して確認できます。

## EscrowFinishトランザクションのコスト

[Crypto-condition][]を使用する場合、Crypto-conditionフルフィルメントの検証に高い処理負荷がかかるため、EscrowFinishトランザクションでは[高額なトランザクションコスト](transaction-cost.html#特別なトランザクションコスト)を支払う必要があります。

Escrowが時間のみによってロックされており、Crypto-conditionがない場合、EscrowFinishのコストは、リファレンストランザクションの標準[トランザクションコスト](transaction-cost.html)のみです。

必要となる追加のトランザクションコストは、フルフィルメントのサイズに比例します。現時点では、フルフィルメントのあるEscrowFinishでは最小トランザクションコストとして、**330 drop（[XRPのdrop数](basic-data-types.html#通貨額の指定)）と、フルフィルメントのサイズで16バイトあたり10 drop**が必要です。[マルチ署名済み](multi-signing.html)トランザクションの場合、マルチ署名のコストがフルフィルメントのコストに加算されます。

**注記:** 上記の式は、トランザクションのリファレンスコストがXRPの10 dropであることを前提としています。

[手数料投票](fee-voting.html)により`reference_fee`の値が変更される場合、この式は新しいリファレンスコストに基づいてスケーリングされます。フルフィルメントのあるEscrowFinishトランザクションの公式は次のとおりです。

```
reference_fee * (signer_count + 33 + (fulfillment_bytes / 16))
```


## Escrowを使用する理由

従来の[Escrow](https://en.wikipedia.org/wiki/Escrow)では、特にオンラインでリスクが高いと見なされる可能性のあるさまざまな金融取引を可能にしてきました。取引期間中または評価期間中に信頼できる第三者に資金を預託することで、相手側が当事者としての責任を必ず果たすことが両者に対し保証されます。

Escrow機能では、第三者をXRP Ledger に組み込まれている自動システムに置き換えることで、この概念をさらに発展させました。これにより、資金のロックアップとリリースが公平に行われ、自動化できるようになりました。

完全に自動化されたEscrowは、XRP Ledger 自体の整合性で裏付けられており、Rippleにとって重大な問題を解決します。Escrowで実現可能なユースケースは他にも多数あると思われます。Rippleは、Escrowのユニークな活用法を新たに編み出すように業界に働きかけています。

### ユースケース: 時間ベースのロックアップ

**背景:** Rippleは大量のXRPを保有しており、XRP Ledgerと関連テクノロジーの健全な発展を促進し、資金を調達する目的でXRPを系統立てて売却しています。その一方、大量のXRPを保有しているために、Rippleでは次のような課題が生じています:

- XRP Ledgerを使用する個人や企業は、Rippleが市場でXRPを通常よりも高値で売却して市場へ大量供給した場合に、XRPへの投資の希薄化や価値の低下を招く可能性があると懸念しています。
    - 市場への大量売却は長期的にはRippleに損失をもたらしますが、Rippleがそのような大量売却を行う可能性は、XRP価格への押し下げ圧力を促し、Rippleの資産価値を下げることになります。
- Rippleは、内部関係者を含め、デジタル盗難やその他の悪意のある行為からアカウントを保護するため、アカウント所有権を慎重に管理しなければなりません。

**解決策:** Rippleは550億XRPを時間ベースのエスクローに預託することで、XRPの供給量を予測可能なものとし、その供給量がゆっくりですが安定したペースで増加していくようにしています。XRPを保有するその他の当事者は、Rippleの優先課題や戦略が変わったとしても、同社が市場へ大量供給できないとわかっています。

資金をEscrowに委託しても、Rippleの保有分が不正使用者から直接保護されるわけではありませんが、不正使用者が一時的にRippleのXRPアカウントを乗っ取っても、すぐに盗んだり流用したりできるXRPの量は大幅に減少します。これによりXRPの壊滅的な損失リスクは減少し、Rippleが自社のXRP資産の不正な流用を検出、防止、追跡する時間が増加します。

### ユースケース: インターレジャー決済

**背景:** 急速に成長しているフィンテック業界の主な課題の1つに、複数のデジタル通貨システムまたはレジャー間でのアクティビティーの調整があります。この課題に対して多くの解決策（XRP Ledgerの初期ビューを含む）が提案されていますが、これは「すべてを管理する1つのレジャー」の作成に絞り込むことができます。Rippleでは、1つのシステムでは世界中のすべての人々のニーズに応えることはできないと考えています。実際に、望ましい機能のいくつかは互いに矛盾しています。Rippleではその代わりに、レジャーを相互に接続するネットワーク、つまり _インターレジャー_ に、フィンテックの未来があると考えています。[Interledger Protocol][]は、できるだけ多くのシステムを安全かつスムーズに接続するための標準を定義します。

インターレジャー決済の根幹をなす基本原則は、 _条件付き送金_ です。マルチホップペイメントにはリスクの問題があります。中間のホップが増えるほど、決済が失敗する箇所が増えます。インターレジャーでは、この問題が金融版「[2相コミット](https://en.wikipedia.org/wiki/Two-phase_commit_protocol)」で解決されます。この2相コミットでの2つのステップとは、（1）条件付き送金の準備と（2）送金実行のための条件のフルフィルメントです。インターレジャープロジェクトでは、条件の定義と確認を自動化する方法を標準化するために[Crypto-condition][]仕様が定義され、このような条件の「共通の土台」としてSHA-256ハッシュが定められました。

**解決策:** Escrow機能により、XRP LedgerはInterledger Protocolを使用したマルチホップペイメントのブリッジングに理想的なレジャーとなりました。これは、Escrow機能がPREIMAGE-SHA-256 Crypto-conditionに基づいてXRPの送金をネイティブにサポートしており、一致するフルフィルメントの提示から数秒以内にこれらの送金が実行されるためです。


## 参考情報

XRP LedgerのEscrowの詳細は、以下を参照してください:

- [Escrowチュートリアル](use-escrows.html)
    - [時間に基づくEscrowの送信](send-a-time-held-escrow.html)
    - [条件に基づくEscrowの送信](send-a-conditionally-held-escrow.html)
    - [送金元または受取人別のEscrow検索](look-up-escrows.html)
- [トランザクションのリファレンス](transaction-formats.html)
    - [EscrowCreateトランザクション][]
    - [EscrowFinishトランザクション][]
    - [EscrowCancelトランザクション][]
- [レジャーリファレンス](ledger-data-formats.html)
    - [Escrowオブジェクト](escrow-object.html)

インターレジャーと、条件付き送金が実現する複数レジャー間での安全な決済についての詳細は、[Interledger Architecture](https://interledger.org/rfcs/0001-interledger-architecture/)を参照してください。

Rippleによる550億XRPのロックアップについては、[Ripple's Insights Blog](https://ripple.com/insights/ripple-to-place-55-billion-xrp-in-escrow-to-ensure-certainty-into-total-xrp-supply/)を参照してください。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
