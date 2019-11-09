# 発行済み通貨の凍結

XRPは発行済み通貨ではありません。XRPはXRP Ledgerのネイティブ資産であり、XRP Ledgerでのトランザクションの実行に必要となります。XRPは取引相手を必要としません。つまり、XRPを保有しているということは負債ではなく実際の通貨であるXRPを保有していることになります。このため、_**<u>いかなる組織または個人もXRPを凍結できません</u>**_。

XRP Ledgerでは、XRP以外の通貨はすべて発行済み通貨として表すことができます。このような発行済み通貨（「イシュアンス」または「IOU」とも呼ばれます）は、「トラストライン」と呼ばれるアドレス間の会計上の関係で管理されます。発行済み通貨は通常、負債とも資産とも見なされるため、トラストラインの残高は、見る視点によってマイナスにもプラスにもなります。どのアドレスも（XRP以外の）通貨を自由に発行できますが、他のアドレスが希望する保有量によってのみ制限されます。

特定のケースでは、法的要件への準拠や、疑わしい活動の調査のために、取引所またはゲートウェイが、XRP以外の発行済み通貨の残高を急きょ凍結することがあります。

**ヒント:** 誰もXRPを凍結することはできません。

凍結については、3種類の設定があります。

* [**Individual Freeze**](#individual-freeze) - 1件の取引相手を凍結します。
* [**Global Freeze**](#global-freeze) - 取引相手全員を凍結します。
* [**No Freeze**](#no-freeze) - 個々の取引相手の凍結機能と、Global Freezeを終了できる機能を永久に放棄します。

凍結機能は発行済み通貨にのみ適用されます。XRP Ledgerには特権的な立場の当事者は存在しないため、凍結機能では、取引相手が、XRPまたはその他の取引相手が発行した資金で取引を実行することを阻止できません。Rippleを含め誰もXRPを凍結することはできません。

凍結対象の残高がプラス、マイナスにかかわらず、すべての凍結設定を行うことができます。通貨イシュアーまたは通貨保持者のいずれかがトラストラインを凍結できますが、通貨保持者がイシュアーを凍結しても、その影響はわずかです。


## Individual Freeze

**Individual Freeze**機能は、[トラストライン](trust-lines-and-issuing.html)に関する設定です。発行アドレスがIndividual Freeze設定を有効にすると、そのトラストラインの通貨に対して以下のルールが適用されます。

* 凍結されたトラストラインの両当事者間の直接決済は、凍結後も可能です。
* そのトラストラインの取引相手は、イシュアーへ直接支払う場合を除き、凍結されたトラストラインの残高を減らすことはできません。取引相手は、凍結されたイシュアンスを直接イシュアーに送信することだけが可能です。
* 取引相手は、凍結されたトラストライン上で引き続きその他の当事者からの支払を受け取ることができます。
* 取引相手が凍結されたトラストライン上の発行済み通貨の売りオファーを出した場合、[資金不足とみなされます](offers.html#オファーのライフサイクル)。

確認事項: トラストラインではXRPは保持されません。XRPは凍結できません。

金融機関は、疑わしい活動を行う取引相手や、金融機関の利用規約に違反する取引相手にリンクしているトラストラインを凍結できます。金融機関は、同機関が運用する、XRP Ledgerに接続されているその他のシステムにおいても、その取引相手を凍結する必要があります。（凍結しないと、アドレスから金融機関経由で支払を送金することで、望ましくない活動を行うことが依然として可能となります。）

各個別アドレスは金融機関とのトラストラインを凍結できます。これは金融機関とその他のユーザーの間の取引には影響しません。ただし、他のアドレス（[運用アドレス](issuing-and-operational-addresses.html)を含む）からその個別アドレスに対しては、その金融機関のイシュアンスを送信できなくなります。このようなIndividual Freezeは、オファーには影響しません。

Individual Freezeは1つの通貨にのみ適用されます。特定の取引相手の複数通貨を凍結するには、アドレスが各通貨のトラストラインで、個別にIndividual Freezeを有効にする必要があります。

[No Freeze](#no-freeze)設定を有効にしている場合、アドレスはIndividual Freeze設定を有効にできません。


## Global Freeze

**Global Freeze**機能は、アドレスに設定できます。発行アドレスがGlobal Freeze機能を有効にすると、その発行アドレスのすべての発行済み通貨に対して以下のルールが適用されます:

* 凍結された発行アドレスのすべての取引相手は、イシュアーに直接支払う場合を除き、凍結されたアドレスへのトラストラインの残高を減らすことができません。（これはすべての[運用アドレス](issuing-and-operational-addresses.html)にも影響します。）
* 凍結された発行アドレスの取引相手は、発行アドレスとの直接的な支払の送受信を引き続き行うことができます。
* 凍結アドレスによる発行済み通貨の売りオファーはすべて、[資金不足とみなされます](offers.html#オファーのライフサイクル)。

確認事項: アドレスはXRPを発行できません。Global FreezeはXRPには適用されません。

運用アドレスのシークレットキーが漏えいした場合には、運用アドレスの制御を取り戻した後であっても金融機関の[発行アドレス](issuing-and-operational-addresses.html)に対してGlobal Freezeを有効にすることが有益です。これにより資金流出を止め、攻撃者がそれ以上の資金を盗むことを防止し、少なくともそれまでの経過の追跡が容易になります。XRP LedgerでGlobal Freezeを行う他に、金融機関は外部システムへのコネクターでの疑わしい活動を停止する必要があります。

また、金融機関が新しい[発行アドレス](issuing-and-operational-addresses.html)への移行や、営業の停止を予定している場合にも、Global Freezeを有効にすることが有用です。これにより、特定の時点で資金がロックされるため、ユーザーは他の通貨で取引することができなくなります。

Global Freezeは、当該アドレスによって発行および保有されている _すべての_ 通貨に適用されます。1つの通貨のみに対してGlobal Freezeを有効にすることはできません。一部の通貨のみを凍結できるようにしたい場合は、通貨ごとに異なるアドレスを使用してください。

アドレスのGlobal Freeze設定はいつでも有効にできます。ただし、アドレスの[No Freeze](#no-freeze)設定を有効にすると、Global Freezeを _無効にする_ ことはできません。


## No Freeze

**No Freeze**機能をアドレスに設定すると、取引相手が発行した通貨を凍結する機能を永久に放棄します。この機能を使用すれば、企業は自社が発行した資金を「物理的なお金のように」扱うことができます。これにより、企業は顧客どうしがその資金を取引することに介入できなくなります。

確認事項: XRPはすでに凍結できません。No Freeze機能は、XRP Ledgerで発行された他の通貨にのみ適用されます。

No Freeze設定には次の2つの効果があります。

* 発行アドレスは、すべての取引相手とのトラストラインに対してIndividual Freezeを有効にできなくなります。
* 発行アドレスは、Global Freezeを有効にしてグローバル凍結を施行できますが、Global Freezeを _無効にする_ ことはできません。

XRP Ledgerは金融機関に対し、その発行資金が表す債務を履行することを強制できません。このため、Global Freezeを有効にする機能を放棄しても顧客を保護できません。ただし、Global Freezeを _無効にする_ 機能を放棄することで、Global Freeze機能が一部の顧客に対して不当に適用されないようにすることができます。

No Freeze設定は、アドレスに対して発行される通貨と、アドレスから発行される通貨のすべてに適用されます。一部の通貨のみを凍結できるようにしたい場合は、通貨ごとに異なるアドレスを使用してください。

No Freeze設定は、アドレスのマスターキーのシークレットキーにより署名されたトランザクションでのみ有効にできます。[レギュラーキー](setregularkey.html)または[マルチ署名済みトランザクション](multi-signing.html)を使用してNo Freezeを有効にすることはできません。


# 技術詳細

## Individual Freezeの有効化または無効化

### 使用する`rippled`

特定のトラストラインに対するIndividual Freezeを有効または無効にするには、`TrustSet`トランザクションを送信します。Freezeを有効にするには[`tfSetFreeze`フラグ](trustset.html#trustsetのフラグ)を使用し、無効にするには`tfClearFreeze`フラグを使用します。トランザクションのフィールドは次のとおりです。

| フィールド                | 値  | 説明 |
|----------------------|--------|-------------|
| Account              | 文字列 | Freezeを有効または無効にするXRP Ledgerアドレス。 |
| TransactionType      | 文字列 | `TrustSet` |
| LimitAmount          | オブジェクト | 凍結するトラストラインを定義するオブジェクト。 |
| LimitAmount.currency | 文字列 | トラストラインの通貨（XRPは指定できません） |
| LimitAmount.issuer   | 文字列 | 凍結する取引相手のXRP Ledgerアドレス |
| LimitAmount.value    | 文字列 | この取引相手があなたに対して発行する通貨の数量として信頼できる数量を、引用符で囲んで指定します。金融機関の観点からは、通常これは`"0"`となります。 |
| Flags                | 数値 | 凍結を有効にするには、ビット`0x00100000`（tfSetFreeze）が有効な値を使用します。凍結を無効にするには、ビット`0x00200000`（tfClearFreeze）が有効な値を使用します。 |

`Fee`、`Sequence`、`LastLedgerSequence`パラメーターは[通常の方法で](transaction-basics.html#トランザクションへの署名とトランザクションの送信)設定します。

[WebSocket API](get-started-with-the-rippled-api.html#websocket-api)を使用してIndividual Freezeを有効にするTrustSetトランザクションを送信する例:

```
{
 "id": 12,
 "command": "submit",
 "tx_json": {
   "TransactionType": "TrustSet",
   "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
   "Fee": "12000",
   "Flags": 1048576,
   "LastLedgerSequence": 18103014,
   "LimitAmount": {
     "currency": "USD",
     "issuer": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
     "value": "110"
   },
   "Sequence": 340
 },
 "secret": "s████████████████████████████",
 "offline": false,
 "fee_mult_max": 1000
}
```

**注意:** シークレットキーを信頼できないサーバーに送信することや、安全ではないチャネル経由で送信することは避けてください。


### RippleAPIを使用する

特定のトラストラインに対するIndividual Freezeを有効または無効にするには、[prepareTrustline](rippleapi-reference.html#preparetrustline)メソッドを使用して *Trustline* トランザクションを準備します。`trustline`パラメーターのフィールドは次のように設定してください:

| フィールド        | 値  | 説明 |
|--------------|--------|-------------|
| currency     | 文字列 | 凍結するトラストラインの[通貨](rippleapi-reference.html#currency)（XRPは指定できません） |
| counterparty | 文字列 | 取引相手の[XRP Ledgerアドレス](rippleapi-reference.html#address) |
| limit        | 文字列 | この取引相手があなたに対して発行する通貨の数量として信頼できる数量を、引用符で囲んで指定します。金融機関の観点からは、通常これは`"0"`となります。 |
| frozen       | ブール値 | `true` このトラストラインのIndividual Freezeを有効にします。`false`Individual Freezeを無効にします。 |

残りの[トランザクションフロー](rippleapi-reference.html#transaction-flow)は他のトランザクションと同じです。

トラストラインのIndividual Freezeを有効にするJavaScript（ECMAScript 6）コードの例:

```js
{% include '_code-samples/freeze/set-individual-freeze.js' %}
```


## Global Freezeの有効化または無効化

### 使用する`rippled`

アドレスに対してGlobal Freezeを有効にするには、`SetFlag`フィールドに[asfGlobalFreezeフラグ値](accountset.html#accountsetのフラグ)を指定した`AccountSet`トランザクションを送信します。Global Freezeを無効にするには、`ClearFlag`フィールドにasfGlobalFreezeフラグ値を指定します。

[WebSocket API](get-started-with-the-rippled-api.html#websocket-api)を使用してGlobal Freezeを有効にするAccountSetトランザクションを送信する例:

```
{
 "id": 12,
 "command": "submit",
 "tx_json": {
   "TransactionType": "AccountSet",
   "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
   "Fee": "12000",
   "Flags": 0,
   "SetFlag": 7,
   "LastLedgerSequence": 18122753,
   "Sequence": 349
 },
 "secret": "s████████████████████████████",
 "offline": false,
 "fee_mult_max": 1000
}
```

**注意:** シークレットキーを信頼できないサーバーに送信することや、安全ではないチャネル経由で送信することは避けてください。


### RippleAPIを使用する

アドレスに対してGlobal Freezeを有効または無効にするには、[prepareSettings](rippleapi-reference.html#preparesettings)メソッドを使用して**Settings**トランザクションを準備します。`settings`パラメーターは、次のように設定されているオブジェクトです:

| フィールド        | 値  | 説明 |
|--------------|--------|-------------|
| globalFreeze | ブール値 | `true` このアドレスに対してGlobal Freezeを有効にします。`false`Global Freezeを無効にします。 |

残りの[トランザクションフロー](rippleapi-reference.html#transaction-flow)は他のトランザクションと同じです。

アドレスに対してGlobal Freezeを有効にするJavaScript（ECMAScript 6）コードの例:

```js
{% include '_code-samples/freeze/set-global-freeze.js' %}
```



## No Freezeの有効化

### 使用する`rippled`

アドレスに対してNo Freezeを有効にするには、`SetFlag`フィールドに[asfNoFreezeフラグ値](accountset.html#accountsetのフラグ)を指定した`AccountSet`トランザクションを送信します。このトランザクションをマスターキーで署名する必要があります。有効にしたNo Freezeを無効にすることはできません。

[WebSocket API](get-started-with-the-rippled-api.html#websocket-api)を使用してNo Freezeを有効にするAccountSetトランザクションを送信する例:

WebSocket要求:

```
{
 "id": 12,
 "command": "submit",
 "tx_json": {
   "TransactionType": "AccountSet",
   "Account": "raKEEVSGnKSD9Zyvxu4z6Pqpm4ABH8FS6n",
   "Fee": "12000",
   "Flags": 0,
   "SetFlag": 6,
   "LastLedgerSequence": 18124917,
   "Sequence": 4
 },
 "secret": "s████████████████████████████",
 "offline": false,
 "fee_mult_max": 1000
}
```

**注意:** シークレットキーを信頼できないサーバーに送信することや、安全ではないチャネル経由で送信することは避けてください。

### RippleAPIを使用する

アドレスに対してNo Freezeを有効または無効にするには、[prepareSettings](rippleapi-reference.html#preparesettings)メソッドを使用して**Settings**トランザクションを準備します。有効にしたNo Freezeを無効にすることはできません。`settings`パラメーターは、次のように設定されているオブジェクトです:

| フィールド    | 値   | 説明 |
|----------|---------|-------------|
| noFreeze | ブール値 | `true`      |

このトランザクションをマスターキーで[署名](rippleapi-reference.html#sign)する必要があります。残りの[トランザクションフロー](rippleapi-reference.html#transaction-flow)は他のトランザクションと同じです。

アドレスに対してNo Freezeを有効にするJavaScript（ECMAScript 6）コードの例:

```js
{% include '_code-samples/freeze/set-no-freeze.js' %}
```


## Individual Freezeの確認

### 使用する`rippled`

トラストラインでIndividual Freezeが有効になっているかどうかを確認するには、以下のパラメーターを持つ[account_linesメソッド][]を使用します。

| フィールド    | 値   | 説明 |
|----------|---------|-------------|
| account  | 文字列  | イシュアーのXRP Ledgerアドレス |
| peer     | 文字列  | 取引相手のXRP Ledgerアドレス |
| ledger\_index | 文字列 | 最新の検証済み情報を取得するには`validated`を使用します。 |

応答には、発行アドレスと取引相手がリンクされている各通貨のトラストラインの配列が含まれています。各トラストラインオブジェクトで以下のフィールドを確認します:

| フィールド        | 値   | 説明 |
|--------------|---------|-------------|
| freeze       | ブール値 | （省略される場合があります）`true`: 発行アドレスがこのトラストラインを凍結した場合。省略されている場合は、`false`と同じです。 |
| freeze\_peer | ブール値 | （省略される場合があります）`true`: 取引相手がこのトラストラインを凍結した場合。省略されている場合は、`false`と同じです。 |

Individual Freezeを確認するためのWebSocket要求の例:

```
{
 "id": 15,
 "command": "account_lines",
 "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
 "ledger": "validated",
 "peer": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW"
}
```

WebSocket応答の例:

```
{
 "id": 15,
 "status": "success",
 "type": "response",
 "result": {
   "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
   "lines": [
     {
       "account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
       "balance": "10",
       "currency": "USD",
       "freeze": true,
       "limit": "110",
       "limit_peer": "0",
       "peer_authorized": true,
       "quality_in": 0,
       "quality_out": 0
     }
   ]
 }
}
```

`"freeze": true`フィールドは、 rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpnが、rsA2LpzuawewSBQXkiju3YQTMzW13pAAdWへのUSDトラストラインに対してIndividual Freezeを有効にしたことを示しています。`"freeze_peer": true`フィールドがない場合、取引相手はトラストラインを凍結 _していません_ 。


### RippleAPIを使用する

トラストラインに対するIndividual Freezeが有効になっているかどうかを確認するには、以下のパラメーターを持つ[`getTrustlines`メソッド](rippleapi-reference.html#gettrustlines)を使用します。

| フィールド         | 値   | 説明 |
|---------------|---------|-------------|
| address       | 文字列  | イシュアーのXRP Ledgerアドレス |
| options.counterparty  | 文字列  | 取引相手のXRP Ledgerアドレス |

応答には、発行アドレスと取引相手がリンクされている各通貨のトラストラインの配列が含まれています。各トラストラインオブジェクトで以下のフィールドを確認します:

| フィールド                | 値   | 説明 |
|----------------------|---------|-------------|
| specification.frozen | ブール値 | （省略される場合があります）`true`: 発行アドレスがトラストラインを凍結した場合。 |
| counterparty.frozen  | ブール値 | （省略される場合があります）`true`: 取引相手がトラストラインを凍結した場合。 |

トラストラインが凍結されているかどうかを確認するJavaScript（ECMAScript 6）コードの例:

```js
{% include '_code-samples/freeze/check-individual-freeze.js' %}
```


## Global FreezeとNo Freezeの確認

### 使用する`rippled`

アドレスがGlobal FreezeとNo Freezeのいずれかまたは両方を有効にしているかどうかを確認するには、以下のパラメーターを持つ[account_infoメソッド][]を使用します。

| フィールド    | 値   | 説明 |
|----------|---------|-------------|
| account  | 文字列  | 発行アドレスのXRP Ledgerアドレス |
| ledger\_index | 文字列 | 最新の検証済み情報を取得するには`validated`を使用します。 |

[ビット単位AND](https://en.wikipedia.org/wiki/Bitwise_operation#AND)演算子を使用して応答の`account_data.Flags`フィールドの値を確認します:

* `Flags` AND `0x00400000`（[lsfGlobalFreeze](accountroot.html#accountrootのフラグ)）が _ゼロ以外_ の場合: Global Freezeが有効です。
* `Flags` AND `0x00200000`（[lsfNoFreeze](accountroot.html#accountrootのフラグ)）が _ゼロ以外_ の場合: No Freezeが有効です。

WebSocket要求の例:

```
{
 "id": 1,
 "command": "account_info",
 "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
 "ledger_index": "validated"
}
```

WebSocket応答:

```
{
 "id": 4,
 "status": "success",
 "type": "response",
 "result": {
   "account_data": {
     "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
     "AccountTxnID": "41320138CA9837B34E82B3B3D6FB1E581D5DE2F0A67B3D62B5B8A8C9C8D970D0",
     "Balance": "100258663",
     "Domain": "6D64756F31332E636F6D",
     "EmailHash": "98B4375E1D753E5B91627516F6D70977",
     "Flags": 12582912,
     "LedgerEntryType": "AccountRoot",
     "MessageKey": "0000000000000000000000070000000300",
     "OwnerCount": 4,
     "PreviousTxnID": "41320138CA9837B34E82B3B3D6FB1E581D5DE2F0A67B3D62B5B8A8C9C8D970D0",
     "PreviousTxnLgrSeq": 18123095,
     "Sequence": 352,
     "TransferRate": 1004999999,
     "index": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
     "urlgravatar": "http://www.gravatar.com/avatar/98b4375e1d753e5b91627516f6d70977"
   },
   "ledger_hash": "A777B05A293A73E511669B8A4A45A298FF89AD9C9394430023008DB4A6E7FDD5",
   "ledger_index": 18123249,
   "validated": true
 }
}
```

上記の例では`Flags`の値は12582912です。この場合、次のJavaScriptコードのように、lsfGlobalFreezeフラグとlsfDefaultRippleフラグが有効になっています。

```js
var lsfGlobalFreeze = 0x00400000; 
var lsfNoFreeze = 0x00200000; 

var currentFlags = 12582912; 

console.log(currentFlags & lsfGlobalFreeze); //4194304
//therefore, Global Freeze is enabled

console.log(currentFlags & lsfNoFreeze); //0
//therefore, No Freeze is not enabled
```

### RippleAPIを使用する

アドレスに対してGlobal FreezeとNo Freezeのいずれか、または両方が有効になっているかどうかを確認するには、以下のパラメーターを持つ[`getSettings`メソッド](rippleapi-reference.html#getsettings)を使用します。

| フィールド         | 値   | 説明 |
|---------------|---------|-------------|
| address       | 文字列  | 発行アドレスのXRP Ledgerアドレス |

応答オブジェクトの以下の値を確認します:

| フィールド         | 値   | 説明 |
|---------------|---------|-------------|
| noFreeze      | ブール値 | （省略される場合があります）`true`: No Freezeが有効な場合。 |
| globalFreeze  | ブール値 | （省略される場合があります）`true`: Global Freezeが有効な場合。 |

アドレスに対するGlobal FreezeまたはNo Freezeが有効になっているかどうかを確認するJavaScript（ECMAScript 6）コードの例:

```js
{% include '_code-samples/freeze/check-global-freeze-no-freeze.js' %}
```

# 関連項目

* [GB-2014-02新機能残高凍結](https://ripple.com/files/GB-2014-02.pdf)
* [凍結コードの例](https://github.com/ripple/ripple-dev-portal/tree/master/content/_code-samples/freeze)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
