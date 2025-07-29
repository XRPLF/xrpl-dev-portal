---
html: freezes.html
parent: trust-lines-and-issuing.html
seo:
    description: 発行者はコンプライアンス目的でトークンの取引を停止できます。
labels:
  - トークン
---
# トークンのフリーズ

発行者は発行したトークンをXRP Ledgerでフリーズすることができます。**これはXRP LedgerのネイティブアセットであるXRPには適用されません。**

特定のケースでは、法的要件への準拠や、疑わしい活動の調査のために、取引所またはゲートウェイが、XRP以外のトークンの残高を急きょフリーズすることがあります。

{% admonition type="success" name="ヒント" %}誰もXRP LedgerのXRPをフリーズすることはできません。しかし、カストディアル取引所は、自らの裁量で常に保管資金をフリーズすることができます。詳しくは、[フリーズに関するよくある誤解](common-misconceptions-about-freezes.md)をご覧ください。{% /admonition %}

フリーズについては、3種類の設定があります。

* [**Individual Freeze(個別のフリーズ)**](#individual-freeze) - 1件の取引相手をフリーズします。
* [**Global Freeze(全体のフリーズ)**](#global-freeze) - 取引相手全員をフリーズします。
* [**No Freeze(フリーズ機能の放棄)**](#no-freeze) - 個々の取引相手のフリーズ機能と、Global Freeze機能を永久に放棄します。

フリーズ対象の残高がプラス、マイナスにかかわらず、すべてのフリーズ設定を行うことができます。通貨イシュアーまたは通貨保持者のいずれかがトラストラインをフリーズできますが、通貨保持者がイシュアーをフリーズしても、その影響はわずかです。


## Individual Freeze

**Individual Freeze**機能は、[トラストライン](index.md)に関する設定です。発行アドレスがIndividual Freeze設定を有効にすると、そのトラストラインの通貨に対して以下のルールが適用されます。

* フリーズされたトラストラインの両当事者間の直接決済は、フリーズ後も可能です。
* そのトラストラインの取引相手は、イシュアーへ直接支払う場合を除き、フリーズされたトラストラインの残高を減らすことはできません。取引相手は、フリーズされたイシュアンスを直接イシュアーに送信することだけが可能です。
* 取引相手は、フリーズされたトラストライン上で引き続きその他の当事者からの支払を受け取ることができます。
* 取引相手がフリーズされたトラストライン上のトークンの売りオファーを出した場合、[資金不足とみなされます](../decentralized-exchange/offers.md#オファーのライフサイクル)。

再確認: トラストラインではXRPは保持されません。XRPはフリーズできません。

金融機関は、疑わしい活動を行う取引相手や、金融機関の利用規約に違反する取引相手にリンクしているトラストラインをフリーズできます。金融機関は、同機関が運用する、XRP Ledgerに接続されているその他のシステムにおいても、その取引相手をフリーズする必要があります。（フリーズしないと、アドレスから金融機関経由で支払を送金することで、望ましくない活動を行うことが依然として可能となります。）

各個別アドレスは金融機関とのトラストラインをフリーズできます。これは金融機関とその他のユーザの間の取引には影響しません。ただし、他のアドレス（[運用アドレス](../../accounts/account-types.md)を含む）からその個別アドレスに対しては、その金融機関のイシュアンスを送信できなくなります。このようなIndividual Freezeは、オファーには影響しません。

Individual Freezeは1つの通貨にのみ適用されます。特定の取引相手の複数通貨をフリーズするには、アドレスが各通貨のトラストラインで、個別にIndividual Freezeを有効にする必要があります。

[No Freeze](#no-freeze)設定を有効にしている場合、アドレスはIndividual Freeze設定を有効にできません。


## Global Freeze

**Global Freeze**機能は、アドレスに設定できます。発行アドレスがGlobal Freeze機能を有効にすると、その発行アドレスのすべてのトークンに対して以下のルールが適用されます:

* フリーズされた発行アドレスのすべての取引相手は、イシュアーに直接支払う場合を除き、フリーズされたアドレスへのトラストラインの残高を減らすことができません。（これはすべての[運用アドレス](../../accounts/account-types.md)にも影響します。）
* フリーズされた発行アドレスの取引相手は、発行アドレスとの直接的な支払の送受信を引き続き行うことができます。
* フリーズアドレスによるトークンの売りオファーはすべて、[資金不足とみなされます](../decentralized-exchange/offers.md#オファーのライフサイクル)。

再確認: アドレスはXRPを発行できません。Global FreezeはXRPには適用されません。

運用アドレスのシークレットキーが漏えいした場合には、運用アドレスの制御を取り戻した後であっても金融機関の[発行アドレス](../../accounts/account-types.md)に対してGlobal Freezeを有効にすることが有益です。これにより資金流出を止め、攻撃者がそれ以上の資金を盗むことを防止し、少なくともそれまでの経過の追跡が容易になります。XRP LedgerでGlobal Freezeを行う他に、金融機関は外部システムへのコネクターでの疑わしい活動を停止する必要があります。

また、金融機関が新しい[発行アドレス](../../accounts/account-types.md)への移行や、営業の停止を予定している場合にも、Global Freezeを有効にすることが有用です。これにより、特定の時点で資金がロックされるため、ユーザは他の通貨で取引することができなくなります。

Global Freezeは、当該アドレスによって発行および保有されている _すべての_ 通貨に適用されます。1つの通貨のみに対してGlobal Freezeを有効にすることはできません。一部の通貨のみをフリーズできるようにしたい場合は、通貨ごとに異なるアドレスを使用してください。

アドレスのGlobal Freeze設定はいつでも有効にできます。ただし、アドレスの[No Freeze](#no-freeze)設定を有効にすると、Global Freezeを _無効にする_ ことはできません。


## No Freeze

**No Freeze**機能をアドレスに設定すると、取引相手が発行した通貨をフリーズする機能を永久に放棄します。この機能を使用すれば、企業は自社が発行した資金を「物理的なお金のように」扱うことができます。これにより、企業は顧客どうしがその資金を取引することに介入できなくなります。

確認事項: XRPはすでにフリーズできません。No Freeze機能は、XRP Ledgerで発行された他の通貨にのみ適用されます。

No Freeze設定には次の2つの効果があります。

* 発行アドレスは、すべての取引相手とのトラストラインに対してIndividual Freezeを有効にできなくなります。
* 発行アドレスは、Global Freezeを有効にしてグローバルフリーズを施行できますが、Global Freezeを _無効にする_ ことはできません。

XRP Ledgerは金融機関に対し、その発行資金が表す債務を履行することを強制できません。このため、Global Freezeを有効にする機能を放棄しても顧客を保護できません。ただし、Global Freezeを _無効にする_ 機能を放棄することで、Global Freeze機能が一部の顧客に対して不当に適用されないようにすることができます。

No Freeze設定は、アドレスに対して発行される通貨と、アドレスから発行される通貨のすべてに適用されます。一部の通貨のみをフリーズできるようにしたい場合は、通貨ごとに異なるアドレスを使用してください。

No Freeze設定は、アドレスのマスターキーのシークレットキーにより署名されたトランザクションでのみ有効にできます。[レギュラーキー](../../../references/protocol/transactions/types/setregularkey.md)または[マルチシグトランザクション](../../accounts/multi-signing.md)を使用してNo Freezeを有効にすることはできません。



# 関連項目

- [フリーズコードの例](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/freeze)
- **コンセプト:**
    - [トラストラインとトークンの発行](index.md)
- **Tutorials:**
    - [No Freezeを有効化](../../../tutorials/how-tos/use-tokens/enable-no-freeze.md)
    - [Global Freezeの実行](../../../tutorials/how-tos/use-tokens/enact-global-freeze.md)
    - [トラストラインのフリーズ](../../../tutorials/how-tos/use-tokens/freeze-a-trust-line.md)
- **References:**
    - [account_linesメソッド][]
    - [account_infoメソッド][]
    - [AccountSetトランザクション][]
    - [TrustSetトランザクション][]
    - [AccountRootフラグ](../../../references/protocol/ledger-data/ledger-entry-types/accountroot.md#accountrootのフラグ)
    - [RippleState(trust line)フラグ](../../../references/protocol/ledger-data/ledger-entry-types/ripplestate.md#ripplestateのフラグ)

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
