---
html: authorized-trust-lines.html
parent: trust-lines-and-issuing.html
seo:
    description: 認可トラストラインとは、トークンを保有できる人を制限するための設定です。
labels:
  - トークン
  - セキュリティ
---
# 認可トラストライン

XRP Ledgerの認可トラストライン機能により、発行者は、発行者が許可したアカウントのみが保有できるトークンを作成することができます。認可トラストライン機能はトークンにのみ適用され、XRPには影響しません。

認可トラストライン機能を使用するには、発行アドレスで**RequireAuth**フラグを有効にします。その後、他のアカウントは、あなたがそのアカウントのトラストラインをあなたの発行アカウントに承認した場合にのみ、あなたが発行したトークンを保持することができます。

発行アドレスから[TrustSetトランザクション][]を送信し、自分のアカウントと認可するアカウントとの間のトラストラインを設定することで、トラストラインを認可することができます。トラストラインを認可した後、その認可を取り消すことはできません。(ただし、必要に応じてトラストラインを[凍結](freezes.md)することは可能です)。

トラストラインを認可するためのトランザクションは、発行アドレスの署名が必要であり、残念ながらそのアドレスのリスクエクスポージャーが増加することを意味します。

**注意:** Require Authを有効にできるのは、アカウントにトラストラインがなく、XRP LedgerにOffersがない場合だけなので、トークンの発行前に使用するかどうかを決定する必要があります。

## ステーブルコインの発行

XRP Ledger上のステーブルコインと認可トラストラインの使用により、新規顧客の獲得プロセスは以下のようなものになります。

1. 顧客は、ステーブルコイン発行会社のシステムに登録し、身元を証明する情報（「Know Your Customer」（KYC）情報とも呼ばれる）を送信します。
2. 顧客とステーブルコイン発行者は、お互いのXRP Ledgerアドレスを提示し合います。
3. 顧客は[TrustSetトランザクション][]を送信し、発行者のアドレスにトラストラインを作成し、正のリミットを設定します。
4. 発行者はTrustSetトランザクションを送信し、顧客のトラストラインを認可します。

**ヒント:** 2つのTrustSetトランザクション（ステップ3および4）は、どちらの順序で発生しても構いません。発行者がトラストラインを先に認可した場合、これにより限度額が0に設定されたトラストラインが作成され、顧客のTrustSetトランザクションは、事前に認可されたトラストラインの限度額を設定することになります。([TrustSetAuth amendment][]により追加されました。)_
## 注意事項

認可トラストラインを使用するつもりがない場合でも、[運用アカウントと予備アカウント](../../accounts/account-types.md)のRequire Auth設定を有効にし、これらのアカウントにトラストラインを認可させないようにすることができます。これは、これらのアカウントが誤ってトークンを発行することを防止します（たとえば、ユーザが誤って間違ったアドレスをトラストしてしまった場合など）。これはあくまで予防措置であり、運用アカウントと予備アカウントが意図したとおりに _発行者の_ トークンを転送することを止めるものではありません。

## 技術情報
<!--{# TODO: split these off into one or more tutorials on using authorized trust lines, preferably with both JavaScript and Python code samples. #}-->

### RequireAuthの有効化

以下は、ローカルでホストされている`rippled`の[submitメソッド][]を使って、`asfRequireAuth`フラグを使ってRequire Authを有効にする[AccountSetトランザクション][]を送信する例です。（このメソッドは、アドレスが発行アドレス、運用アドレス、待機アドレスのいずれであっても同様に機能します。）

リクエスト:

```json
POST http://localhost:5005/
{
   "method": "submit",
   "params": [
       {
           "secret": "s████████████████████████████",
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

{% partial file="/@i18n/ja/docs/_snippets/secret-key-warning.md" /%}


## アカウントのRequireAuthの有効化の確認

アカウントのRequireAuth設定の有効化の状態を確認するには、[account_infoメソッド][]を使用してアカウントを調べます。`Flags`フィールド（`result.account_data`オブジェクト）の値を、[AccountRootレジャーオブジェクトのビット単位フラグ](../../../references/protocol/ledger-data/ledger-entry-types/accountroot.md)と比較します。

`Flags`値と`lsfRequireAuth`フラグ値（`0x00040000`）のビット単位のANDの結果がゼロ以外の場合、アカウントではRequireAuthが有効になっています。結果がゼロの場合、アカウントではRequireAuthが無効になっています。

## トラストラインの認可

認可トラストライン機能を使用している場合、他のアカウントからのトラストラインを認可しなければ、これらの他のアカウントはあなたが発行する残高を保有できません。複数のトークンを発行する場合には、各通貨のトラストラインを個別に認可する必要があります。

トラストラインを認可するには、`LimitAmount`の`issuer`として信頼するユーザを指定して、発行アドレスから[TrustSetトランザクション][]を送信します。`value`（信頼する額）を**0**のままにし、トランザクションの[tfSetfAuth](../../../references/protocol/transactions/types/trustset.md#trustsetのフラグ)フラグを有効にします。

以下は、ローカルでホストされている`rippled`の[submitメソッド][]を使用して、顧客アドレス`rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn`がアドレス`rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW`で発行したUSDを持つことを認可するTrustSetトランザクションを送信する例です。

リクエスト:

```json
POST http://localhost:8088/
{
   "method": "submit",
   "params": [
       {
           "secret": "s████████████████████████████",
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

{% partial file="/@i18n/ja/docs/_snippets/secret-key-warning.md" /%}


## トラストラインの認可状況の確認

トラストラインの認可状況を確認するには、[account_linesメソッド][]を使用してトラストラインを調べます。レスポンスの`account`フィールドに顧客のアドレスを指定し、`peer`フィールドに発行者のアドレスを指定します。

レスポンスの`result.lines`配列で、必要とする通貨のトラストラインを表している`currency`フィールドを持つオブジェクトを見つけます。そのオブジェクトの`peer_authorized`フィールドに値`true`が設定されている場合は、発行者（レスポンスの`peer`フィールドとして使用したアドレス）によりそのトラストラインが承認されています。

## 関連項目

- **コンセプト:**
    - [Deposit Authorization](../../accounts/depositauth.md)
    - [トークンの凍結](freezes.md)
- **リファレンス:**
    - [account_linesメソッド][]
    - [account_infoメソッド][]
    - [AccountSetトランザクション][]
    - [TrustSetトランザクション][]
    - [AccountRootフラグ](../../../references/protocol/ledger-data/ledger-entry-types/accountroot.md#accountrootのフラグ)
    - [RippleState (トラストライン) フラグ](../../../references/protocol/ledger-data/ledger-entry-types/ripplestate.md#ripplestateのフラグ)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
