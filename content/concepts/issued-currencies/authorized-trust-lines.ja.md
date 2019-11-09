# Authorized Trust Lines

XRP LedgerのAuthorized Trust Lines機能により、通貨イシュアーは自身の（XRP以外の）発行済み通貨を保有できるユーザーを制限できます。これにより、不明なXRP Ledgerアドレスは発行済み通貨を保有できなくなります。Authorized Trust Lines機能は発行済み通貨にのみ適用され、XRPには影響しません。

Authorized Trust Lines機能を使用するには、発行アドレスでRequireAuthフラグを有効にします。その後、発行アドレスは他のアドレスからのトラストラインを承認する[TrustSetトランザクション][]を送信できます。RequireAuthが有効であるときに発行アドレスから発行された資金を他のアドレスが保有できるのは、発行アドレスへのトラストラインが承認されている場合だけです。

トラストラインを承認するトランザクションには発行アドレスによる署名が必要ですが、これにより発行アドレスが危険にさらされる可能性が高くなります。RequireAuthが有効であるXRP Ledgerへの資金の送金プロセスは次のようになります。

1. 発行ゲートウェイがその発行アドレスを顧客に公開します。
2. 顧客のXRP Ledgerアドレスからゲートウェイの発行アドレスへのトラストラインを作成するために顧客は[TrustSetトランザクション][]を送信します。これは、ゲートウェイが発行した特定通貨を特定の限度額まで保有することを顧客が望んでいることを意味します。
3. ゲートウェイの発行アドレスは、顧客のトラストラインを承認するTrustSetトランザクションを送信します。

**ヒント:** 発行ゲートウェイは、顧客がトラストラインの作成を完了する前に、そのトラストラインを事前に承認できます（ステップ3）。これにより限度額がゼロのトラストラインが作成されます。顧客のTrustSetトランザクション（ステップ2）により、事前承認されたトラストラインに限度額が設定されます。_（[TrustSetAuth Amendment][]が必要です。）_

## RequireAuth設定

`RequireAuth`設定（[RippleAPI](rippleapi-reference.html)の`requireAuthorization`）をすることで、発行アドレスが当該通貨に関してその取引相手とのトラストラインを具体的に承認している場合を除き、すべての取引相手はアドレスから発行された残高を保有できなくなります。

用心として、発行ゲートウェイが[運用アドレスとスタンバイアドレス](issuing-and-operational-addresses.html)に対して`RequireAuth`を常に有効にし、これらのアドレスへのトラストラインを一切承認しないことが推奨されます。これにより、運用アドレスとスタンバイアドレスがXRP Ledgerで誤って通貨を発行することを防止できます。これは純粋な予防措置であり、発行アドレスにより作成された発行済み通貨の残高を、これらのアドレスが意図したとおりに送金することを阻止するものではありません。

Authorized Trust Lines機能を使用するには、イシュアーがその発行アドレスの`RequireAuth`も有効にする必要もあります。その後、発行アドレスは顧客からの[各トラストラインを承認する`TrustSet`トランザクションを送信する](#トラストラインの承認)必要があります。

**注意:** アカウントが`RequireAuth`を有効にできるのは、アカウントがトラストラインを所有しておらず、またXRP Ledgerにオファーがない場合に限られます。したがってXRP Ledgerで取引を開始する前に、この設定を使用するかどうかを決定しておく必要があります。

### RequireAuthの有効化

ローカルでホストされている`rippled`の[submitメソッド][]を使用して、RequireAuthフラグを有効にする[AccountSetトランザクション][]を送信する例を以下に示します。（このメソッドは、アドレスが発行アドレス、運用アドレス、スタンバイアドレスのいずれであっても同様に機能します。）

要求:

```
POST http://localhost:5005/
{
   "method": "submit",
   "params": [
       {
           "secret": "sn3nxiW7v8KXzPzAqzyHXbSSKNuN9",
           "tx_json": {
               "Account": "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
               "Fee": "15000",
               "Flags": 0,
               "SetFlag": 2,
               "TransactionType": "AccountSet"
           }
       }
   ]
}
```

{% include '_snippets/secret-key-warning.md' %}
<!--{#_ #}-->

## アカウントのRequireAuthの有効化の確認

アカウントのRequireAuth設定の有効化の状態を確認するには、[account_infoメソッド][]を使用してアカウントを調べます。`Flags`フィールド（`result.account_data`オブジェクト）の値を、[AccountRootレジャーオブジェクトのビット単位フラグ](accountroot.html)と比較します。

`Flags`値と`lsfRequireAuth`フラグ値（0x00040000）のビット単位のANDの結果がゼロ以外の場合、アカウントではRequireAuthが有効になっています。結果がゼロの場合、アカウントではRequireAuthが無効になっています。

## トラストラインの承認

Authorized Trust Lines機能を使用している場合、他のアカウントからのトラストラインを最初に承認しなければ、これらの他のアカウントはあなたが発行する残高を保有できません。複数の通貨を発行する場合には、各通貨のトラストラインを個別に承認する必要があります。

トラストラインを承認するには、`LimitAmount`の`issuer`として信頼するユーザーを指定して、発行アドレスから[TrustSetトランザクション][]を送信します。`value`（信頼する額）を**0**のままにし、トランザクションの[tfSetfAuth](trustset.html#trustsetのフラグ)フラグを有効にします。

ローカルでホストされている`rippled`の[submitメソッド][]を使用して、顧客アドレス（rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn）が発行アドレス（rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW）からのUSDのイシュアンスを保有することを承認するTrustSetトランザクションを送信する例を以下に示します。

要求:

```
POST http://localhost:8088/
{
   "method": "submit",
   "params": [
       {
           "secret": "sn3nxiW7v8KXzPzAqzyHXbSSKNuN9",
           "tx_json": {
               "Account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
               "Fee": "15000",
               "TransactionType": "TrustSet",
               "LimitAmount": {
                   "currency": "USD",
                   "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                   "value": 0
               },
               "Flags": 65536
           }
       }
   ]
}
```

{% include '_snippets/secret-key-warning.md' %}
<!--{#_ #}-->

## トラストラインの承認状況の確認

トラストラインの承認状況を確認するには、[account_linesメソッド][]を使用してトラストラインを調べます。要求の`account`フィールドに顧客のアドレスを指定し、`peer`フィールドにイシュアーのアドレスを指定します。

応答の`result.lines`配列で、必要とする通貨のトラストラインを表している`currency`フィールドを持つオブジェクトを見つけます。そのオブジェクトの`peer_authorized`フィールドに値`true`が設定されている場合は、イシュアー（要求の`peer`フィールドとして使用したアドレス）によりそのトラストラインが承認されています。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
