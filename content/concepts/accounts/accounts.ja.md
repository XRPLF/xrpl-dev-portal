---
html: accounts.html
parent: concepts.html
blurb: XRP Ledgerのアカウントについて説明します。アカウントはトランザクションを送信でき、XRPを保有できます。
labels:
  - アカウント
  - 支払い
---
# アカウント

XRP Ledgerの「アカウント」は、XRPの所有者と[トランザクション](transaction-formats.html)の送信者を表します。アカウントの主な要素は次のとおりです。

- 識別用の**アドレス**。例えば、`rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn`

  **注記:** XRPコミュニティは、取引所およびウォレットで[宛先タグ](source-and-destination-tags.html)の代わりに使用できる新しいフォーマット、**X**アドレスを[提案](https://github.com/XRPLF/XRPL-Standards/issues/6)（これをサポートする[コーデック](https://github.com/xrp-community/xrpl-tagged-address-codec)も開発）しました。これらの「パック化」したアドレスは、`r`ではなく`X`で開始します。詳細は、[XRPL 𝗫-address format](https://xrpaddress.info/)のサイトを参照してください。

- **XRPの残高**。このXRPの一部は、[準備金](reserves.html)用に確保されています。
- **シーケンス番号**。このアカウントから送信されるトランザクションがすべて、正しい順序で、それぞれ1回のみ適用されるようにします。トランザクションを実行するには、トランザクションのシーケンス番号と送金元のシーケンス番号が一致する必要があります。その後も、トランザクションが適用されている限り、アカウントのシーケンス番号は1ずつ増加します。（関連項目: [基本的なデータタイプ: アカウントシーケンス](basic-data-types.html#アカウントシーケンス)）
- このアカウントと残高に影響を及ぼした**取引の履歴**。
- [トランザクションの承認](transactions.html#トランザクションの承認)方法。以下に例を示します。
  - アカウント固有のマスターキーのペア。（[無効](accountset.html)にできますが、変更はできません。）
  - [ローテーションで使用](setregularkey.html)できる「レギュラー」キーペア。
  - [マルチシグ](multi-signing.html)の署名者のリスト。（アカウントのコアデータとは別に保存されます。）

アカウントのコアデータは、レジャーのデータツリーの[AccountRoot](accountroot.html)レジャーのオブジェクトタイプに保存されます。アカウントは、他の複数のタイプのデータの所有者（または部分的な所有者）になることもできます。

**ヒント:** XRP Ledgerの「アカウント」は、財務上の用途（例:「銀行口座」）やコンピューター上の用途（例:「UNIXアカウント」）で使用されます。XRP以外の通貨および資産はXRP Ledgerアカウント自体には保存されません。そのような資産はそれぞれ、両当事者を結ぶ「トラストライン」と呼ばれる会計関係に保存されます。

### アカウントの作成

「アカウント作成」専用のトランザクションはありません。Paymentトランザクション でまだアカウントを所有していない数学的に有効なアドレスに[アカウントの準備金](reserves.html)以上のXRPが送信されると、[Paymentトランザクション][]で自動的に新しいアカウントが作成されます。これはアカウントの _資金提供_ と呼ばれ、レジャーに[AccountRootオブジェクト](accountroot.html)が作成されます。それ以外のトランザクションでアカウントを作成することはできません。

**注意:** アカウントを資金提供することによって、そのアカウントに対して特別な権限を持つことには**なりません**。アカウントのアドレスに対応するシークレットキーを持っている人なら誰でも、アカウントとそれに含まれるすべてのXRPの完全制御権を持っています。一部のアドレスでは、誰もシークレットキーを持っていない場合があります。その場合、アカウントは[ブラックホール](#特別なアドレス)になり、XRPは永久に失われます。

XRP Ledgerでアカウントを取得する一般的な方法は次のとおりです。

1. ランダム性の強いソースからキーペアを生成し、そのキーペアのアドレスを計算します。（例えば、[wallet_proposeメソッド][]を使用して計算することができます。）

2. XRP Ledgerにアカウントをすでに持っているユーザーに、生成したアドレスにXRPを送信してもらいます。

   - 例えば、一般の取引所でXRPを購入し、その取引所から、指定したアドレスにXRPを引き出すことができます。

     **注意:** 自身のXRP Ledgerアドレスで初めてXRPを受け取る場合は[アカウントの準備金](reserves.html)（現在は10 XRP）を支払う必要があります。この金額のXRPは無期限に使用できなくなります。一方で、一般の取引所では通常、顧客のXRPはすべて、共有されたいくつかのXRP Ledgerアカウントに保有されているため、顧客はその取引所で個々のアカウントの準備金を支払う必要はありません。引き出す前に、XRP Ledgerに直接アカウントを保有することが、金額に見合う価値があるかどうかを検討してください。

## アドレス

{% include '_snippets/data_types/address.ja.md' %}

有効なアドレスに資金供給することで、そのアドレスを[XRP Ledgerのアカウントにする](#アカウントの作成)ことができます。[レギュラーキー](setregularkey.html)または[署名者リスト](multi-signing.html)のメンバーを表すために資金供給されていないアドレスを使用することもできます。資金供給されたアカウントのみがトランザクションの送信者になることができます。

キーペアを始め、有効なアドレスの作成は、厳密な数学的演算です。キーペアの生成と、そのアドレスの計算は完全にオフラインで行うことができます。XRP Ledgerやその他の関係者と通信する必要はありません。公開鍵からアドレスへの変換には一方向のハッシュ関数が含まれるため、公開鍵がアドレスと一致することは確認できますが、アドレスのみから公開鍵を導出することはできません。（このことが、署名付きのトランザクションに送信者の公開鍵 _と_ アドレスが含まれる理由の1つとなっています。）

XRP Ledgerアドレスの計算方法の技術的な詳細は、[アドレスのエンコード](#アドレスのエンコード)を参照してください。


### 特別なアドレス

XRP Ledgerでは、過去の使用という点で、一部のアドレスに特別な意味があります。多くの場合、これらのアドレスは「ブラックホール」アドレスです。つまり、このアドレスは既知のシークレットキーから派生したものではありません。アドレスのみからシークレットキーを推測することは事実上不可能なため、ブラックホールアドレスが保有しているXRPは永久に失われます。

| アドレス                    | 名前  | 意味    | ブラックホール? |
|-----------------------------|------|---------|-------------|
| rrrrrrrrrrrrrrrrrrrrrhoLvTp | ACCOUNT_ZERO | 値`0`を[base58][]形式にエンコードしたXRP Ledgerのアドレス。ピアツーピア通信では、このアドレスは、XRPの発行者として`rippled`で使用されます。 | はい |
| rrrrrrrrrrrrrrrrrrrrBZbvji | ACCOUNT_ONE | 値`1`を[base58][]形式にエンコードしたXRP Ledgerのアドレス。レジャーの[RippleState項目](ripplestate.html)では、このアドレスは、トラストライン残高の発行者のプレースホルダーとして使用されます。 | はい |
| rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh | ジェネシスアカウント | `rippled`で新しいジェネシスレジャーが一から開始される場合（例えば、スタンドアロンモード）、このアカウントはすべてのXRPを保持します。このアドレスは、シード値「masterpassphrase」から生成されており、この値は[ハードコーディング](https://github.com/XRPLF/rippled/blob/94ed5b3a53077d815ad0dd65d490c8d37a147361/src/ripple/app/ledger/Ledger.cpp#L184)されています。 | いいえ |
| rrrrrrrrrrrrrrrrrNAMEtxvNvQ | Ripple名予約のブラックホール | 以前は、Rippleでは、このアカウントにXRPを送信してRipple名を予約するようユーザーに求めていました。 | はい |
| rrrrrrrrrrrrrrrrrrrn5RM1rHd | NaNアドレス | 以前のバージョンの[ripple-lib](https://github.com/XRPLF/xrpl.js)では、XRP Ledgerの[base58][]文字列エンコード形式を使用して、値[NaN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN)をエンコードするときにこのアドレスを生成しました。 | はい |


## アカウントの削除

[DeletableAccounts amendment](known-amendments.html#deletableaccounts)（有効2020-05-08）では、アカウントの削除は可能になりました。

削除するには、アカウントが次の要件を満たしている必要があります。

- アカウントの`Sequence`番号に256を加えた値が、現在の[レジャーインデックス][]未満であること。
- アカウントが次のタイプの[レジャーオブジェクト](ledger-object-types.html)のいずれにも（送金元または受取人として）関連付けられていないこと。
  - `Escrow`
  - `PayChannel`
  - `RippleState`
  - `Check`
- アカウントがレジャー内に所有するオブジェクトが1000個未満であること。
- [AccountDeleteトランザクション][]では、少なくとも1アイテムの[所有者準備金](reserves.html)（現在2 XRP）に相当する特別な[トランザクションコスト][]を支払う必要があります。

アカウントは、削除した後、通常の[アカウント作成](#アカウントの作成)方法でレジャーに再作成できます。削除後に再作成されたアカウントと、初めて作成されたアカウントに違いはありません。

Bitcoinやその他の多くの暗号資産とは異なり、新バージョンのXRP Ledgerの公開レジャーチェーンにはそれぞれレジャーの全状態が含まれており、新規アカウントが増えるごとにサイズが大きくなります。そのため、XRP Ledgerの新規アカウントは必要な場合以外は作成しないでください。アカウントを削除することで、アカウントの[準備金](reserves.html)である10 XRPの一部を復元できますが、そのためには少なくとも2 XRPを消却する必要があります。

多くのユーザーに代わって価値を送受信する金融機関などは、XRP Ledgerでは1つ（または少数）のアカウントのみを使用し、顧客との間の個別の決済を区別するために[**ソースタグ**と**宛先タグ**](source-and-destination-tags.html)を使用できます。




## トランザクション履歴

XRP Ledgerでは、トランザクション（取引）履歴をトランザクションの「スレッド」によって追跡することができます。これはトランザクションの識別用のハッシュとレジャーインデックスにリンクされています。`AccountRoot`レジャーオブジェクトには、それを最後に修正したトランザクションの識別用のハッシュとレジャーが含まれます。そのトランザクションのメタデータには、`AccountRoot`ノードの前の状態が含まれているため、この方法で1つのアカウントの履歴を繰り返すことができます。このトランザクション履歴には、`AccountRoot`ノードを直接変更するトランザクションが含まれます。以下に例を示します。

- アカウントによって送信されるトランザクション。アカウントの`Sequence`番号が変更されるため。このようなトランザクションでは、[トランザクションコスト](transaction-cost.html)によりアカウントのXRP残高も変更されます。
- アカウントのXRP残高を変更したトランザクション。例えば、着信する[Paymentトランザクション][]や他のタイプの取引（例:[PaymentChannelClaim][]や[EscrowFinish][]）。

アカウントの _概念的な_ トランザクション履歴には、アカウントの所有オブジェクトとXRP以外の残高を変更したトランザクションも含まれます。これらのオブジェクトは別個のレジャーオブジェクトであり、それぞれに影響を及ぼした独自のトランザクションスレッドが含まれます。アカウントのレジャーの履歴全体がある場合は、それをたどって、その履歴によって作成または変更されたレジャーオブジェクトを見つけることができます。「完全」なトランザクション履歴には、トランザクションで所有されているオブジェクトの履歴が含まれます。例を以下に示します。

- `RippleState`オブジェクト（トラストライン）。アカウントに関連付けられています。
- `DirectoryNode`オブジェクト（特にアカウントの所有オブジェクトを追跡する所有者ディレクトリ）。
- `Offer`オブジェクト。分散型取引所でのアカウントの未処理の取引注文を表すオブジェクト。
- `PayChannel`アカウントとの間の非同期のPayment Channelを表すオブジェクト。
- `Escrow`時間または暗号条件によってロックされ、アカウントとの間の保留中の支払いを表すオブジェクト。
- `SignerList`[マルチシグ](multi-signing.html)によってアカウントのトランザクションを承認できるアドレスのリストを表すオブジェクト。

これらの各オブジェクトの詳細は、[レジャーフォーマットのリファレンス](ledger-data-formats.html)を参照してください。


## アドレスのエンコード

**ヒント:** これらの技術的な詳細は、XRP Ledgerとの互換性を保つために低レベルのライブラリソフトウェアを構築しているユーザーのみを対象としています。

[[ソース]](https://github.com/XRPLF/rippled/blob/35fa20a110e3d43ffc1e9e664fc9017b6f2747ae/src/ripple/protocol/impl/AccountID.cpp#L109-L140 "Source")

XRP Ledgerのアドレスは、[base58][]_形式のディクショナリ_`rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz`を使用してエンコードされています。XRP Ledgerはbase58でいくつかのタイプのキーをエンコードするため、それらを区別するためにエンコードされたデータの前に1バイトの「タイププレフィクス」（「バージョンプレフィクス」とも呼ばれます）を付けます。タイププレフィクスによりアドレスは通常、base58形式の異なる文字で始まります。

次の図は、キーとアドレスの関係を示しています。

[![マスター公開鍵 + プレフィクスの種類 → アカウントID + チェックサム → アドレス](img/address-encoding.ja.png)](img/address-encoding.ja.png)

公開鍵からXRP Ledgerアドレスを計算する式は次のとおりです。コード例全体については、[`encode_address.js`](https://github.com/XRPLF/xrpl-dev-portal/blob/master/content/_code-samples/address_encoding/js/encode_address.js)を参照してください。パスフレーズまたはシード値から公開鍵を導出するプロセスについては、[鍵の導出](cryptographic-keys.html#鍵導出)を参照してください。

1. 次の必須アルゴリズムをインポートします。SHA-256、RIPEMD160、base58。base58のディクショナリーを設定します。

        'use strict';
        const assert = require('assert');
        const crypto = require('crypto');
        const R_B58_DICT = 'rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz';
        const base58 = require('base-x')(R_B58_DICT);

        assert(crypto.getHashes().includes('sha256'));
        assert(crypto.getHashes().includes('ripemd160'));

2. 33バイトのECDSA secp256k1公開鍵、または32バイトのEd25519公開鍵で始めます。Ed25519キーの場合は、キーの前にバイト`0xED`を付けます。

        const pubkey_hex =
          'ED9434799226374926EDA3B54B1B461B4ABF7237962EAE18528FEA67595397FA32';
        const pubkey = Buffer.from(pubkey_hex, 'hex');
        assert(pubkey.length == 33);

3. 公開鍵のSHA-256ハッシュの[RIPEMD160](https://en.wikipedia.org/wiki/RIPEMD)ハッシュを計算します。この値は「Account ID」です。

        const pubkey_inner_hash = crypto.createHash('sha256').update(pubkey);
        const pubkey_outer_hash = crypto.createHash('ripemd160');
        pubkey_outer_hash.update(pubkey_inner_hash.digest());
        const account_id = pubkey_outer_hash.digest();

4. アカウントIDのSHA-256ハッシュのSHA-256ハッシュを計算します。最初の4バイトを使用ます。この値が「チェックサム」です。

        const address_type_prefix = Buffer.from([0x00]);
        const payload = Buffer.concat([address_type_prefix, account_id]);
        const chksum_hash1 = crypto.createHash('sha256').update(payload).digest();
        const chksum_hash2 = crypto.createHash('sha256').update(chksum_hash1).digest();
        const checksum =  chksum_hash2.slice(0,4);

5. ペイロードとチェックサムを連結します。連結バッファーのbase58値を計算します。この結果が、該当のアドレスになります。

        const dataToEncode = Buffer.concat([payload, checksum]);
        const address = base58.encode(dataToEncode);
        console.log(address);
        // rDTXLQ7ZKZVKz33zJbHjgVShjsBnqMBhmN


## 関連項目

- **コンセプト:**
  - [準備金](reserves.html)
  - [暗号鍵](cryptographic-keys.html)
  - [発行アドレスと運用アドレス](account-types.html)
- **リファレンス:**
  - [account_infoメソッド][]
  - [wallet_proposeメソッド][]
  - [AccountSetトランザクション][]
  - [Paymentトランザクション][]
  - [AccountRootオブジェクト](accountroot.html)
- **チュートリアル:**
  - [アカウント設定の管理（カテゴリー）](manage-account-settings.html)
  - [WebSocketを使用した着信ペイメントの監視](monitor-incoming-payments-with-websocket.html)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
