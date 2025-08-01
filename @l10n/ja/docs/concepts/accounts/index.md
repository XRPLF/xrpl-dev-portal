---
html: accounts.html
parent: concepts.html
seo:
    description: XRP Ledgerのアカウントについて説明します。アカウントはトランザクションを送信でき、XRPを保有できます。
labels:
  - アカウント
  - 支払い
---
# アカウント

XRP Ledgerの「アカウント」は、XRPの所有者と[トランザクション]アカウントの主な要素は次のとおりです。

アカウントは、アドレス、XRPの残高、シーケンス番号、トランザクション履歴から構成されます。トランザクションを送信するためには、所有者はアカウントに紐付く1つ以上の暗号鍵ペアを必要とします。


## アカウントの構成

アカウントの種等な構成要素は次の通りです。

- 識別用の**アドレス**。例えば、`rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn`。
- **XRPの残高**。XRP残高の一部は、[準備金](reserves.md)用に確保されています。
- **シーケンス番号**。このアカウントから送信されるトランザクションがすべて、正しい順序で、それぞれ1回のみ適用されるようにします。トランザクションを実行するには、トランザクションのシーケンス番号と送金元のシーケンス番号が一致する必要があります。その後も、トランザクションが適用されている限り、アカウントのシーケンス番号は1ずつ増加します。（関連項目: [基本的なデータタイプ: アカウントシーケンス](../../references/protocol/data-types/basic-data-types.md#アカウントシーケンス)）
- このアカウントと残高に影響を及ぼした**トランザクションの履歴**。
- [トランザクションの承認](../transactions/index.md#トランザクションの承認)方法。
    - アカウント固有のマスターキーのペア。（無効にできますが、変更はできません。）
    - ローテーションして使用できる「レギュラー」キーペア。
    - [マルチシグ](multi-signing.md)の署名者のリスト。(アカウントのコアデータとは別に保存されます。)

アカウントのコアデータは、[AccountRoot](../../references/protocol/ledger-data/ledger-entry-types/accountroot.md)レジャーエントリに保存されます。アカウントは、他の複数のタイプのレジャーエントリの所有者(または部分的な所有者)になることもできます。

{% admonition type="success" name="ヒント" %}XRP Ledgerの「アカウント」は、財務上の用途（例:「銀行口座」）やコンピュータ上の用途（例:「UNIXアカウント」）で使用されます。XRP以外の通貨および資産はXRP Ledgerアカウント自体には保存されません。そのような資産はそれぞれ、両当事者を結ぶ「トラストライン」と呼ばれる会計関係に保存されます。{% /admonition %}


### アカウントの作成

「アカウント作成」専用のトランザクションはありません。Paymentトランザクションでまだアカウントを所有していない数学的に有効なアドレスに[アカウントの準備金](reserves.md)以上のXRPが送信されると、[Paymentトランザクション][]で自動的に新しいアカウントが作成されます。これはアカウントへの _資金提供_ と呼ばれ、レジャーに[AccountRootエントリ](../../references/protocol/ledger-data/ledger-entry-types/accountroot.md)が作成されます。それ以外のトランザクションでアカウントを作成することはできません。

{% admonition type="warning" name="注意" %}アカウントへ資金提供をすることは、そのアカウントに対して特別な権限を持つことには**なりません**。アカウントのアドレスに対応する秘密鍵を持っている人なら誰でも、アカウントとそれに含まれるすべてのXRPの完全制御権を持っています。一部のアドレスでは、誰も秘密鍵を持っていない場合があります。その場合、アカウントは[ブラックホール](addresses.md#特別なアドレス)になり、XRPは永久に失われます。{% /admonition %}

XRP Ledgerでアカウントを取得する一般的な方法は次のとおりです。

1. ランダム性の強いソースからキーペアを生成し、そのキーペアのアドレスを計算します。（例えば、[wallet_proposeメソッド][]を使用して計算することができます。）

2. XRP Ledgerにアカウントをすでに持っているユーザに、生成したアドレスにXRPを送信してもらいます。

    - 例えば、一般的な取引所でXRPを購入し、その取引所から、指定したアドレスにXRPを出金することができます。

        {% admonition type="warning" name="注意" %}自身のXRP Ledgerアドレスで初めてXRPを受け取る場合は[アカウントの準備金](reserves.md)（現在は10XRP）を支払う必要があります。この金額のXRPは無期限に使用できなくなります。一方で、一般的な取引所では通常、顧客のXRPはすべて、共有されたいくつかのXRP Ledgerアカウントに保有されているため、顧客はその取引所で個々のアカウントの準備金を支払う必要はありません。引き出す前に、XRP Ledgerに直接アカウントを保有することが、金額に見合う価値があるかどうかを検討してください。{% /admonition %}



## 関連項目

- **コンセプト:**
    - [準備金](reserves.md)
    - [暗号鍵](cryptographic-keys.md)
   - [発行アドレスと運用アドレス](account-types.md)
- **リファレンス:**
    - [account_infoメソッド][]
    - [wallet_proposeメソッド][]
   - [AccountSetトランザクション][]
    - [Paymentトランザクション][]
  - [AccountRootオブジェクト](../../references/protocol/ledger-data/ledger-entry-types/accountroot.md)
- **チュートリアル:**
    - [アカウント設定の管理（カテゴリ）](../../tutorials/how-tos/manage-account-settings/index.md)
    - [WebSocketを使用した着信ペイメントの監視](../../tutorials/http-websocket-apis/monitor-incoming-payments-with-websocket.md)

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
