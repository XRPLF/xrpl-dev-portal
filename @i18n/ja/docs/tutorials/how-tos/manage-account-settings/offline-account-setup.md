---
html: offline-account-setup.html
parent: manage-account-settings.html
seo:
    description: 物理的に隔離されたオフラインのマシンを使用して暗号鍵を保管するXRP Ledgerアカウントを設定します。
labels:
  - アカウント
  - セキュリティ
---
# オフラインでのアカウント設定のチュートリアル

きわめて安全な[署名構成](../../../concepts/transactions/secure-signing.md)では、XRP Ledger[アカウント](../../../concepts/accounts/index.md)の[暗号鍵](../../../concepts/accounts/cryptographic-keys.md)をオフラインの物理的に隔離されたマシンに安全に保管します。この構成を設定すると、さまざまなトランザクションに署名して、署名済みトランザクションのみをオンラインコンピュータに転送し、秘密鍵をオンラインにいる不正使用者に見せることなくそれらのトランザクションをXRP Ledgerネットワークに送信できます。

**注意:** オフラインマシンを保護するためには、適切な運用セキュリティ対策が必要です。例えば、オフラインマシンは信頼できない人がアクセスできない場所に物理的に設置する必要があり、信頼できるオペレーターはマシンに悪用されたソフトウェアを転送しないように注意する必要があります。（例えば、ネットワークに接続されたコンピュータに接続したことがあるUSBドライブは使用してはいけません。）

## 前提条件

オフライン署名を使用するには、次の前提条件を満たしている必要があります。

- オフラインマシンとして使用する1台のコンピュータを用意していること。このマシンは[サポートされているオペレーティングシステム](../../../infrastructure/installation/system-requirements.md)でセットアップされている必要があります。オフラインセットアップの手順については、使用するオペレーティングシステムのサポートをご覧ください（例: [Red Hat Enterprise Linux DVD ISOインストール手順](https://access.redhat.com/solutions/7227)）。使用するソフトウェアと物理メディアがマルウェアに感染していないことを確認します。
- オンラインマシンとして使用する別のコンピュータを用意していること。このマシンは`rippled`を実行する必要はありませんが、XRP Ledgerネットワークに接続し、共有レジャーの状態についての正確な情報を受信できる必要があります。例えば、[公開サーバへのWebSocket接続](../../http-websocket-apis/get-started.md)を使用できます。
- 署名済みのトランザクションバイナリデータをオフラインマシンからオンラインマシンに転送する安全な方法を用意していること。
  - その方法の1つは、オフラインマシンでQRコードジェネレーターを使用し、オンラインマシンでQRコードスキャナーを使用することです。（この場合、「オンラインマシン」はスマートフォンなどの携帯デバイスだとよいでしょう。）
  - 別の方法としては、物理メディアを使ってオフラインマシンからオンラインマシンにファイルをコピーします。この方法を使用する場合、オフラインマシンが悪意のあるソフトウェアに感染するおそれのある物理メディアは使用しないよう注意します。（例えば、オンラインマシンとオフラインマシンで同じUSBドライブを再利用しないようにします。）
  - オンラインマシンにデータを手動で入力することも _可能_ ですが、面倒でミスが発生しやすくなります。


## 手順

### 1. オフラインマシンの設定

オフラインマシンには、安全な永続ストレージ（暗号化されたディスクドライブなど）と[トランザクションに署名する](../../../concepts/transactions/secure-signing.md)ための方法が必要です。一般的には、必要なソフトウェアをオンラインマシンでダウンロードして、物理メディアを使ってオフラインマシンに転送します。オンラインマシン、物理メディア、ソフトウェア自体がマルウェアに感染していないことを確認する必要があります。

XRP Ledgerで署名するためのソフトウェアオプションは次のとおりです。

- パッケージ（`.deb`または`.rpm`。使用するLinuxディストリビューションによって異なる）ファイルから[`rippled`をインストール](../../../infrastructure/installation/index.md)し、[スタンドアロンモードで実行します](../../../concepts/networks-and-servers/rippled-server-modes.md)。
- [xrpl.js](https://github.com/XRPLF/xrpl.js/)とその依存関係をオフラインでインストールします。例えば、Yarn Package Managerでは、[オフラインでの使用に関して推奨される手順](https://yarnpkg.com/blog/2016/11/24/offline-mirror/)があります。
- 関連項目: [安全な署名の設定](../../../concepts/transactions/secure-signing.md)

オフラインマシンでトランザクションの指示を生成するプロセスを容易にするために、カスタムソフトウェアを設定することもできます。例えば、ソフトウェアで次に使用する[シーケンス番号][]を追跡したり、送信するトランザクションのタイプに応じた設定済みテンプレートを含めるといったことが可能です。

### 2.暗号鍵の生成

**オフラインマシン**で、アカウントで使用する[暗号鍵](../../../concepts/accounts/cryptographic-keys.md)のペアを生成します。鍵は、単純なパスフレーズやエントロピーが十分でないその他のソースから生成するのではなく、安全なランダム手続きで生成してください。（例えば、`rippled`の[wallet_proposeメソッド][]を使用することができます。）

{% tabs %}

{% tab label="rippledコマンドライン" %}
```sh
$ ./rippled wallet_propose
Loading: "/etc/opt/ripple/rippled.cfg"
2019-Dec-09 22:58:24.110862955 HTTPClient:NFO Connecting to 127.0.0.1:5005

{
   "result" : {
      "account_id" : "r4MRc4BArFPXmiDjmLdrufyFManSYhfKE6",
      "key_type" : "secp256k1",
      "master_key" : "JANE GIBE LIST TEND NU RUDE JIG PA FLOG DEFT SAME NASH",
      "master_seed" : "shYHSiJod8CLPTj1SNJ2PdUFj4pFk",
      "master_seed_hex" : "8465FDB80B2E2620A7D58274C26291A0",
      "public_key" : "aBQLW8imt7VChRJU1NMVCB7fE3jSL3VNEgLDKf88ygAhnfuZh3oo",
      "public_key_hex" : "03396074ED4B8155ACF9A8DC3665EFA53B5CFA0A1E91C3879303D37721EB222644",
      "status" : "success"
   }
}
```
{% /tab %}

{% /tabs %}

次の値をメモします。

- **`account_id`**:  これはキーペアに関連付けられているアドレスです。このアドレスは、XRPを供給（このプロセスの先で実行）した後に、XRP Ledgerでの **[アカウント](../../../concepts/accounts/index.md)アドレス**になります。`account_id`は公開しても安全です。
- **`master_seed`**:  これはキーペアの秘密シード値です。この値は、アカウントからのトランザクションに署名する際に使用します。最高レベルのセキュリティを実現するために、この値をオフラインマシンのディスクに書き込む前に暗号化してください。暗号化キーとして、人間のオペレーターが覚えやすい安全なパスフレーズや、物理的に安全な場所に書き留めたパスフレーズを使います。例えば、適切な重さのサイコロを使用して作成する[ダイスウェアパスフレーズ](https://theworld.com/~reinhold/diceware.html)などがあります。第2の要素として物理セキュリティキーを使用することもできます。この段階で取る対策の程度はご自身で決めてください。
- **`key_type`**:  これは、このキーペアに使用する暗号化アルゴリズムです。有効なトランザクションに署名するには、どのようなタイプのキーペアを所有しているかを知る必要があります。デフォルトは`secp256k1`です。

`master_key`、`master_seed`、`master_seed_hex`の値はどこにも共有**しないでください**。これらはこのアドレスに関連付けられている秘密鍵を再作成するために使用できます。



### 3.新しいアドレスへの資金の供給

オンラインマシンから、ステップ1でメモした**アカウントアドレス** に十分なXRPを送金します。詳細は、[アカウントの作成](../../../concepts/accounts/index.md#アカウントの作成)をご覧ください。

**ヒント:** テストの目的で、[Testnet Faucet](/resources/dev-tools/xrp-faucets)を使用して、テスト用のXRPが入った新しいアカウントを取得できます。そのアカウントを使用して、オフラインで生成されたアドレスに資金を供給します。



### 4.アカウントの詳細の確認

前のステップからのトランザクションがコンセンサスにより検証されたら、アカウントが作成されたことになります。オンラインマシンから、[account_infoメソッド][]を使用して、アカウントのステータスを確認します。レスポンスに`"validated": true`が含まれていることを確認し、この結果が最終的なものであることを確認します。

結果の`account_data`の`Sequence`フィールドにある、アカウントのシーケンス番号をメモします。この後のステップでアカウントのトランザクションに署名するために、このシーケンス番号を把握しておく必要があります。

[DeletableAccounts Amendment](/resources/known-amendments.md#deletableaccounts)がenabledになっている場合、新しく資金を供給したアカウントの`Sequence`番号は、資金を供給したときの[レジャーインデックス][]と一致します。enabledになっていない場合、新しく資金を供給したアカウントの`Sequence`番号は常に1です。

{% tabs %}

{% tab label="rippledコマンドライン" %}
```sh
$ ./rippled account_info rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn

Loading: "/etc/opt/ripple/rippled.cfg"
2019-Dec-11 01:06:21.728637950 HTTPClient:NFO Connecting to 127.0.0.1:5005
{
   "result" : {
      "account_data" : {
         "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
         "Balance" : "5000000000000",
         "Flags" : 0,
         "LedgerEntryType" : "AccountRoot",
         "OwnerCount" : 0,
         "PreviousTxnID" : "00C5B713B11DA775C6F932D38CE162C16FA88B7269BAFC6FDF4C6ADB74419670",
         "PreviousTxnLgrSeq" : 3,
         "Sequence" : 1,
         "index" : "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8"
      },
      "ledger_current_index" : 4,
      "status" : "success",
      "validated" : false
   }
}
```
{% /tab %}

{% /tabs %}

### 5.オフラインマシンでのシーケンス番号の入力

オフラインマシンでアカウントの開始シーケンス番号を保存します。オフラインマシンを使用してトランザクションを準備するときは、必ずこの保存されたシーケンス番号を使用し、シーケンス番号を1増やして、新しい値を保存します。

この方法で複数のトランザクションを前もって準備しておき、署名済みのトランザクションを一度にオンラインマシンに転送して、すべてを送信できます。各トランザクションの形式が有効で、十分な[トランザクションコスト](../../../concepts/transactions/transaction-cost.md)を支払っていれば、XRP Ledgerネットワークは最終的にこれらのトランザクションを検証済みレジャーに含めて、共有XRP Ledgerにあるアカウントのシーケンス番号と、オフラインマシンで追跡している「現在の」シーケンス番号と同期が保たれるようにします。（ほとんどのトランザクションでは、ネットワークに送信して15秒以内に最終的な検証済みの結果が得られます。）

任意で、現在のレジャーインデックスをオフラインマシンに保存します。この値を使用して、今後のトランザクションに適切な`LastLedgerSequence`値を選択できます。



### 6.初期設定トランザクションの署名（ある場合）

オフラインマシンで、アカウントの設定用のトランザクションを準備して署名します。詳細は、アカウントを使用する目的によって異なります。例えば次のようなことができます。

- 定期的なローテーションで使用できる[レギュラーキーペアを割り当てる](assign-a-regular-key-pair.md)。
- ユーザが送金理由や送金相手をタグ付けせずに送金できないようにするために、[宛先タグを要求する](require-destination-tags.md)。
- アカウントセキュリティを強化するために、[マルチシグを設定する](set-up-multi-signing.md)。
- 明示的に承認した送金、または事前に承認した相手からの送金のみを受け取れるようにするために、[DepositAuthを有効にする](../../../concepts/accounts/depositauth.md)。
- ユーザがあなたの許可なくあなたへの[トラストライン](../../../concepts/tokens/fungible-tokens/index.md)を開けないようにするために、[RequireAuthを有効にする](../../../concepts/tokens/fungible-tokens/authorized-trust-lines.md#requireauthの有効化)。XRP Ledgerの分散型取引所やトークン機能を使用する予定がない場合は、これを対策として行うことをお勧めします。
- [トークン発行者](../../../use-cases/tokenization/stablecoin-issuer.md)には次のような追加の設定がある場合があります。
  - トークンを送金するユーザに対してTransferRateを設定する。
  - このアドレスをトークンのみに使用する予定の場合は、XRPペイメントを禁止する。

この段階では、トランザクションに署名をするだけで、まだ送信しません。各トランザクションに対して、`Fee`（[トランザクションコスト](../../../concepts/transactions/transaction-cost.md)）や`Sequence`（[シーケンス番号][]）など、通常は自動入力可能なフィールドを含めて、すべてのフィールドに入力する必要があります。一度に複数のトランザクションを準備する場合は、トランザクションの実行順にシーケンシャルに増やした`Sequence`番号を使用する必要があります。

例（RequireAuthを有効にする）:

{% tabs %}

{% tab label="rippledコマンドライン" %}
```sh
$ rippled sign sn3nxiW7v8KXzPzAqzyHXbSSKNuN9 '{"Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "Fee": "12", "Sequence": 1, "TransactionType": "AccountSet", "SetFlag": 2}' offline

Loading: "/etc/opt/ripple/rippled.cfg"
2019-Dec-11 00:18:31.865955978 HTTPClient:NFO Connecting to 127.0.0.1:5005
{
   "result" : {
      "deprecated" : "This command has been deprecated and will be removed in a future version of the server. Please migrate to a standalone signing tool.",
      "status" : "success",
      "tx_blob" : "1200032280000000240000000120210000000268400000000000000C7321039543A0D3004CDA0904A09FB3710251C652D69EA338589279BC849D47A7B019A174473045022100D5C92D7705036CD7EBB601C8DFCD90927FA591A62AF832C489E9C898EC8E2FA0022052F1819340EB73E9749B8930A6935727362B8E141D1B2E246B49F912223FFD4381144B4E9C06F24296074F7BC48F92A97916C6DC5EA9",
      "tx_json" : {
         "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
         "Fee" : "12",
         "Flags" : 2147483648,
         "Sequence" : 1,
         "SetFlag" : 2,
         "SigningPubKey" : "039543A0D3004CDA0904A09FB3710251C652D69EA338589279BC849D47A7B019A1",
         "TransactionType" : "AccountSet",
         "TxnSignature" : "3045022100D5C92D7705036CD7EBB601C8DFCD90927FA591A62AF832C489E9C898EC8E2FA0022052F1819340EB73E9749B8930A6935727362B8E141D1B2E246B49F912223FFD43",
         "hash" : "F81C34E7F05423DC1C973CB5008CA41AE984DE142EAA3975A749FABF0D08FA63"
      }
   }
}
```
{% /tab %}

{% /tabs %}

一定の時間内に _すべて_ のトランザクションで最終結果が得られるように、[`LastLedgerSequence`](../../../concepts/transactions/reliable-transaction-submission.md#lastledgersequence)フィールドに入力してください。この値は、現行のレジャーインデックス（オンラインマシンから検索する必要がある）と、トランザクションを有効に保つ時間に基づいたものである必要があります。オンラインマシンからオフラインマシンへ、オフラインマシンからオンラインマシンへ切り替える時間を取れるだけの十分に大きな`LastLedgerSequence`値を設定するようにしてください。例えば、現行のレジャーインデックスより256大きな値では、トランザクションは約15分間有効になります。詳細は、[結果のファイナリティー](../../../concepts/transactions/finality-of-results/index.md)と[信頼できるトランザクションの送信](../../../concepts/transactions/reliable-transaction-submission.md)をご覧ください。


### 7.オンラインマシンへのトランザクションのコピー

トランザクションに署名したら、次のステップは署名済みのトランザクションデータをオンラインマシンに入れることです。その方法の例については、[前提条件](#前提条件)をご覧ください。



### 8.設定したトランザクションの送信

次のステップはトランザクションの送信です。ほとんどのトランザクションは、送信後の次の検証済みレジャー（約4秒後）、またはキューに入っている場合はその後のレジャー（10秒未満）で最終結果が得られるはずです。トランザクションの最終結果を追跡する詳細な手順については、[信頼できるトランザクションの送信](../../../concepts/transactions/reliable-transaction-submission.md)をご覧ください。

単純なトランザクションを送信する例:

{% tabs %}

{% tab label="rippledコマンドライン" %}
```sh
$ rippled submit 1200032280000000240000000120210000000268400000000000000C7321039543A0D3004CDA0904A09FB3710251C652D69EA338589279BC849D47A7B019A174473045022100D5C92D7705036CD7EBB601C8DFCD90927FA591A62AF832C489E9C898EC8E2FA0022052F1819340EB73E9749B8930A6935727362B8E141D1B2E246B49F912223FFD4381144B4E9C06F24296074F7BC48F92A97916C6DC5EA9

Loading: "/etc/opt/ripple/rippled.cfg"
2019-Dec-11 01:14:25.988839227 HTTPClient:NFO Connecting to 127.0.0.1:5005

{
   "result" : {
      "deprecated" : "Signing support in the 'submit' command has been deprecated and will be removed in a future version of the server. Please migrate to a standalone signing tool.",
      "engine_result" : "tesSUCCESS",
      "engine_result_code" : 0,
      "engine_result_message" : "The transaction was applied. Only final in a validated ledger.",
      "status" : "success",
      "tx_blob" : "1200032280000000240000000120210000000268400000000000000C7321039543A0D3004CDA0904A09FB3710251C652D69EA338589279BC849D47A7B019A174473045022100D5C92D7705036CD7EBB601C8DFCD90927FA591A62AF832C489E9C898EC8E2FA0022052F1819340EB73E9749B8930A6935727362B8E141D1B2E246B49F912223FFD4381144B4E9C06F24296074F7BC48F92A97916C6DC5EA9",
      "tx_json" : {
         "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
         "Fee" : "12",
         "Flags" : 2147483648,
         "Sequence" : 1,
         "SetFlag" : 2,
         "SigningPubKey" : "039543A0D3004CDA0904A09FB3710251C652D69EA338589279BC849D47A7B019A1",
         "TransactionType" : "AccountSet",
         "TxnSignature" : "3045022100D5C92D7705036CD7EBB601C8DFCD90927FA591A62AF832C489E9C898EC8E2FA0022052F1819340EB73E9749B8930A6935727362B8E141D1B2E246B49F912223FFD43",
         "hash" : "F81C34E7F05423DC1C973CB5008CA41AE984DE142EAA3975A749FABF0D08FA63"
      }
   }
}
```
{% /tab %}

{% /tabs %}

**ヒント:** 一度に10件を超えるトランザクションを送信しようとしている場合、10件未満のグループに分けて送信すると成功の可能性が高まります。[トランザクションキュー](../../../concepts/transactions/transaction-queue.md)では同じ送信者から一度に送信されるトランザクションを10件に制限しているためです。10件の1グループのトランザクションを送信した後に、すべてのトランザクションがキューから出るのを待ってから、次のグループを送信します。

[最終的でない結果](../../../concepts/transactions/finality-of-results/index.md)が得られて失敗したトランザクションの送信をやり直します。同じトランザクションが2回以上処理される可能性はありません。

### 9.トランザクションの最終ステータスの確認

送信した各トランザクションについて、トランザクションの[最終結果](../../../concepts/transactions/finality-of-results/index.md)をメモします。例えば、[txメソッド][]を使用します。例:

{% tabs %}

{% tab label="rippledコマンドライン" %}
```sh
$ ./rippled tx F81C34E7F05423DC1C973CB5008CA41AE984DE142EAA3975A749FABF0D08FA63

Loading: "/etc/opt/ripple/rippled.cfg"
2019-Dec-11 01:38:30.124771464 HTTPClient:NFO Connecting to 127.0.0.1:5005
{
   "result" : {
      "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "Fee" : "12",
      "Flags" : 2147483648,
      "Sequence" : 1,
      "SetFlag" : 2,
      "SigningPubKey" : "039543A0D3004CDA0904A09FB3710251C652D69EA338589279BC849D47A7B019A1",
      "TransactionType" : "AccountSet",
      "TxnSignature" : "3045022100D5C92D7705036CD7EBB601C8DFCD90927FA591A62AF832C489E9C898EC8E2FA0022052F1819340EB73E9749B8930A6935727362B8E141D1B2E246B49F912223FFD43",
      "date" : 629343510,
      "hash" : "F81C34E7F05423DC1C973CB5008CA41AE984DE142EAA3975A749FABF0D08FA63",
      "inLedger" : 4,
      "ledger_index" : 4,
      "meta" : {
         "AffectedNodes" : [
            {
               "ModifiedNode" : {
                  "FinalFields" : {
                     "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                     "Balance" : "4999999999988",
                     "Flags" : 262144,
                     "OwnerCount" : 0,
                     "Sequence" : 2
                  },
                  "LedgerEntryType" : "AccountRoot",
                  "LedgerIndex" : "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
                  "PreviousFields" : {
                     "Balance" : "5000000000000",
                     "Flags" : 0,
                     "Sequence" : 1
                  },
                  "PreviousTxnID" : "00C5B713B11DA775C6F932D38CE162C16FA88B7269BAFC6FDF4C6ADB74419670",
                  "PreviousTxnLgrSeq" : 3
               }
            }
         ],
         "TransactionIndex" : 0,
         "TransactionResult" : "tesSUCCESS"
      },
      "status" : "success",
      "validated" : true
   }
}
```
{% /tab %}

{% /tabs %}

すべてのトランザクションが処理された後で送信側アカウントの[account_info][account_infoメソッド]を確認すると便利です。アカウントの現在のシーケンス番号（`Sequence`フィールド）と、必要に応じてXRP残高をメモします。

失敗したトランザクションについては、どうするか決める必要があります。

- トランザクションが`tefMAX_LEDGER`コードで失敗した場合、トランザクションが処理されるように、より高い[トランザクションコスト](../../../concepts/transactions/transaction-cost.md)を指定する必要があります。（これはXRP Ledgerネットワークに負荷がかかっていることを示している可能性があります。）トランザクションを、より高いコストを支払い、より高い`LastLedgerSequence`パラメーター（ある場合）を持つ新しいバージョンに置き換えるのも1つの方法です。
- トランザクションが[`tem`クラスコードで](../../../references/protocol/transactions/transaction-results/tem-codes.md)で失敗した場合は、トランザクションの生成時にスペルミスなどのミスをした可能性があります。トランザクションを再度確認し、有効な形式に置き換えます。
- トランザクションが[`tec`クラスコード](../../../references/protocol/transactions/transaction-results/tec-codes.md)で失敗した場合は、失敗した具体的な理由に応じてケースバイケースで対処する必要があります。

調整や置き換えをするトランザクションについては、オフラインマシンに戻るタイミングについての詳細をメモします。



### 10.オフラインマシンのステータスの調整

オフラインマシンに戻り、カスタムサーバに保存されている設定に必要な変更を加えます。例えば次のような変更です。

- アカウントの現在の`Sequence`番号を更新する。すべてのトランザクションが検証済みレジャーに含まれている場合（成功または`tec`コードで終了）、オフラインマシンに保存されているシーケンス番号はすでに正確であるはずです。含まれていない場合は、保存されているシーケンス番号を、前のステップでメモした`Sequence`値と一致するように変更する必要があります。
- 新しいトランザクションで適切な`LastLedgerSequence`値を使用できるように、現在のレジャーインデックスを更新する。（新しいトランザクションを生成する直前に必ずこれを行う必要があります。）
- _（省略可）_ オフラインマシンで使用可能なXRPの金額を追跡している場合は、使用可能なXRPの実際の金額を更新する。

その後で、前のステップで失敗したトランザクションの置き換えとなるトランザクションを調整して署名します。以前の手順と同様に、オフラインマシンでトランザクションを生成し、オンラインマシンから送信します。



## 関連項目

- **コンセプト:**
  - [アカウント](../../../concepts/accounts/index.md)
  - [暗号鍵](../../../concepts/accounts/cryptographic-keys.md)
- **チュートリアル:**
  - [安全な署名の設定](../../../concepts/transactions/secure-signing.md)
  - [レギュラーキーペアの割り当て](assign-a-regular-key-pair.md)
  - [マルチシグの設定](set-up-multi-signing.md)
- **リファレンス:**
  - [基本的なデータタイプ: ](../../../references/protocol/data-types/basic-data-types.md#アカウントシーケンス)[ ](../../../references/protocol/data-types/basic-data-types.md#アカウントシーケンス)[アカウントシーケンス](../../../references/protocol/data-types/basic-data-types.md#アカウントシーケンス)
  - [account_infoメソッド][]
  - [signメソッド][]
  - [submitメソッド][]
  - [txメソッド][]
  - [AccountSetトランザクション][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
