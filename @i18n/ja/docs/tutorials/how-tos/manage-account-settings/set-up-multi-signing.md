---
html: set-up-multi-signing.html
parent: manage-account-settings.html
seo:
    description: アカウントに署名者リストを追加して、マルチシグを有効にします。
labels:
  - セキュリティ
---
# マルチシグの設定

[マルチシグ](../../../concepts/accounts/multi-signing.md)は、XRP Ledgerの[トランザクション](../../../concepts/transactions/index.md)を承認する3種類の方法の1つです。マルチシグの他に[レギュラーキーとマスターキー](../../../concepts/accounts/cryptographic-keys.md)で署名する方法があります。3種類のトランザクション承認方法を自由に組み合わせて使用できるように[アドレス](../../../concepts/accounts/index.md)を設定できます。

このチュートリアルでは、アドレスのマルチシグを有効にする方法を説明します。


## 前提条件

- トランザクションを送信するための十分なXRPが供給されていて、新しい署名者リストの[必要準備金](../../../concepts/accounts/reserves.md)を満たしている資金供給のあるXRP Ledger[アドレス](../../../concepts/accounts/index.md)が必要です。

  - [MultiSignReserve Amendment][]が有効な場合、マルチシグを使用するには、使用する署名と署名者の数に関わらず、アカウントの準備金として2 XRPが必要です。（MultiSignReserve Amendmentは**2019年4月7日**以降、本番環境のXRP Ledgerで有効になっています。)

  - [MultiSignReserve Amendment][]が有効ではないテストネットワークでは、マルチシグを使用するには[アカウント準備金](../../../concepts/accounts/reserves.md)に通常よりも多くのXRPが必要となります。必要額は、リストの署名者の数に応じて増加します。

- XRP Ledgerフォーマットでキーペアを生成するツールを利用できる必要があります。この処理に`rippled`サーバを使用する場合は、[wallet_proposeメソッド][]が管理者専用であるため、管理者アクセス権限が必要です。

  - あるいは、すでにXRP Ledgerアドレスを持っている人をあなたのアドレスの署名者として承認するには、その人または組織のアカウントアドレスを知っている必要があります。

- マルチシグは使用可能である必要があります。（MultiSign Amendmentは**2016年6月27日**以降、本番環境のXRP Ledgerで有効になっています。)

## 1. 構成の設計

含めたい署名者の数を決定します（最大8）。特定のトランザクションに必要な署名の数に基づいて、署名者リストの定数と署名者の重みを選択します。シンプルな「M-of-N」の署名設定では、各署名者に重み **`1`** を割り当て、リストの定数が「M」になるように設定します。これが必要な署名の数です。


## 2. メンバーキーの準備

署名者リストにメンバーとして加える有効な形式のXRP Ledgerアドレスが1つ以上必要です。あなた、またはあなたが選択した署名者は、これらのアドレスに関連付けられた秘密鍵を知っておく必要があります。アドレスは、レジャーに存在する資金供給されたアカウントにすることもできますが、必ずしもそうである必要はありません。

[wallet_proposeメソッド][]を使用して新しいアドレスを生成できます。例:

```
$ rippled wallet_propose
Loading: "/etc/opt/ripple/rippled.cfg"
Connecting to 127.0.0.1:5005
{
    "result" : {
        "account_id" : "rnRJ4dpSBKDR2M1itf4Ah6tZZm5xuNZFPH",
        "key_type" : "secp256k1",
        "master_key" : "FLOG SEND GOES CUFF GAGE FAT ANTI DEL GUM TIRE ISLE BEAR",
        "master_seed" : "snheH5UUjU4CWqiNVLny2k21TyKPC",
        "master_seed_hex" : "A9F859765EB8614D26809836382AFB82",
        "public_key" : "aBR4hxFXcDNHnGYvTiqb2KU8TTTV1cYV9wXTAuz2DjBm7S8TYEBU",
        "public_key_hex" : "03C09A5D112B393D531E4F092E3A5769A5752129F0A9C55C61B3A226BB9B567B9B",
        "status" : "success"
    }
}
```

生成した各アドレスの`account_id`（XRP Ledgerアドレス）と`master_seed`（シークレットキー）をメモします。


## 3. SignerListSetトランザクションの送信

通常の方法（シングルシグネチャー）で[SignerListSetトランザクション][]に[署名して送信](../../../concepts/transactions/index.md#トランザクションへの署名とトランザクションの送信)します。これによりSignerListがXRP Ledgerのアドレスに関連付けられるので、これ以降はSignerListの複数メンバーがあなたの代わりにトランザクションに署名するマルチシグが可能となります。

この例ではSignerListに3人のメンバーが含まれています。また、マルチシグトランザクションにはrsA2LpzuawewSBQXkiju3YQTMzW13pAAdWの署名と、リストの他の2人のメンバーからの少なくとも1つの署名を必要とするように、重みと定数が設定されています。

{% partial file="/@i18n/ja/docs/_snippets/secret-key-warning.md" /%}


```
$ rippled submit shqZZy2Rzs9ZqWTCQAdqc3bKgxnYq '{
>     "Flags": 0,
>     "TransactionType": "SignerListSet",
>     "Account": "rnBFvgZphmN39GWzUJeUitaP22Fr9be75H",
>     "Fee": "10000",
>     "SignerQuorum": 3,
>     "SignerEntries": [
>         {
>             "SignerEntry": {
>                 "Account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
>                 "SignerWeight": 2
>             }
>         },
>         {
>             "SignerEntry": {
>                 "Account": "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
>                 "SignerWeight": 1
>             }
>         },
>         {
>             "SignerEntry": {
>                 "Account": "raKEEVSGnKSD9Zyvxu4z6Pqpm4ABH8FS6n",
>                 "SignerWeight": 1
>             }
>         }
>     ]
> }'
Loading: "/etc/opt/ripple/rippled.cfg"
Connecting to 127.0.0.1:5005
{
   "result" : {
      "engine_result" : "tesSUCCESS",
      "engine_result_code" : 0,
      "engine_result_message" : "The transaction was applied. Only final in a validated ledger.",
      "status" : "success",
      "tx_blob" : "12000C2200000000240000000120230000000368400000000000271073210303E20EC6B4A39A629815AE02C0A1393B9225E3B890CAE45B59F42FA29BE9668D74473045022100BEDFA12502C66DDCB64521972E5356F4DB965F553853D53D4C69B4897F11B4780220595202D1E080345B65BAF8EBD6CA161C227F1B62C7E72EA5CA282B9434A6F04281142DECAB42CA805119A9BA2FF305C9AFA12F0B86A1F4EB1300028114204288D2E47F8EF6C99BCC457966320D12409711E1EB13000181147908A7F0EDD48EA896C3580A399F0EE78611C8E3E1EB13000181143A4C02EA95AD6AC3BED92FA036E0BBFB712C030CE1F1",
      "tx_json" : {
         "Account" : "rnBFvgZphmN39GWzUJeUitaP22Fr9be75H",
         "Fee" : "10000",
         "Flags" : 0,
         "Sequence" : 1,
         "SignerEntries" : [
            {
               "SignerEntry" : {
                  "Account" : "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
                  "SignerWeight" : 2
               }
            },
            {
               "SignerEntry" : {
                  "Account" : "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
                  "SignerWeight" : 1
               }
            },
            {
               "SignerEntry" : {
                  "Account" : "raKEEVSGnKSD9Zyvxu4z6Pqpm4ABH8FS6n",
                  "SignerWeight" : 1
               }
            }
         ],
         "SignerQuorum" : 3,
         "SigningPubKey" : "0303E20EC6B4A39A629815AE02C0A1393B9225E3B890CAE45B59F42FA29BE9668D",
         "TransactionType" : "SignerListSet",
         "TxnSignature" : "3045022100BEDFA12502C66DDCB64521972E5356F4DB965F553853D53D4C69B4897F11B4780220595202D1E080345B65BAF8EBD6CA161C227F1B62C7E72EA5CA282B9434A6F042",
         "hash" : "3950D98AD20DA52EBB1F3937EF32F382D74092A4C8DF9A0B1A06ED25200B5756"
      }
   }
}
```

[トランザクションの結果](../../../references/protocol/transactions/transaction-results/index.md)が[**tesSUCCESS**](../../../references/protocol/transactions/transaction-results/tes-success.md)であることを確認します。それ以外の場合、トランザクションは失敗しています。スタンドアロンモードまたは本番環境以外のネットワークで問題が発生した場合は、[マルチシグが有効であること](../../../infrastructure/testing-and-auditing/start-a-new-genesis-ledger-in-stand-alone-mode.md#新しいジェネシスレジャーの設定)を確認してください。

**注記:** [MultiSignReserve Amendment][]が有効ではない場合は、SignerListのメンバーの増加に応じて、アドレスの[所有者準備金](../../../concepts/accounts/reserves.md#所有者準備金)のXRP額を増加する必要があります。アドレスに十分なXRPがないと、トランザクションは[tecINSUFFICIENT_RESERVE](../../../references/protocol/transactions/transaction-results/tec-codes.md)で失敗します。[MultiSignReserve Amendment][]が有効な場合は、SignerListの署名者の数に関係なく[所有者準備金](../../../concepts/accounts/reserves.md#所有者準備金)として必要なXRPは5 XRPです。関連項目: [SignerListと準備金](../../../references/protocol/ledger-data/ledger-entry-types/signerlist.md#signerlistと準備金)


## 4. 検証の待機

{% partial file="/@i18n/ja/docs/_snippets/wait-for-validation.md" /%} 


## 5. 新しい署名者リストの確認

[account_objectsメソッド][]を使用して、SignerListに最新の検証済みレジャーのアドレスが関連付けられていることを確認します。

通常、アカウントは異なるタイプのオブジェクト（トラストラインやオファーなど）を複数所有できます。このチュートリアルで新しいアドレスに資金を供給した場合、SignerListがレスポンスの唯一のオブジェクトになります。

```
$ rippled account_objects rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC validated
Loading: "/etc/opt/ripple/rippled.cfg"
Connecting to 127.0.0.1:5005
{
   "result" : {
      "account" : "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
      "account_objects" : [
         {
            "Flags" : 0,
            "LedgerEntryType" : "SignerList",
            "OwnerNode" : "0000000000000000",
            "PreviousTxnID" : "8FDC18960455C196A8C4DE0D24799209A21F4A17E32102B5162BD79466B90222",
            "PreviousTxnLgrSeq" : 5,
            "SignerEntries" : [
               {
                  "SignerEntry" : {
                     "Account" : "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
                     "SignerWeight" : 2
                  }
               },
               {
                  "SignerEntry" : {
                     "Account" : "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
                     "SignerWeight" : 2
                  }
               },
               {
                  "SignerEntry" : {
                     "Account" : "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
                     "SignerWeight" : 2
                  }
               }
            ],
            "SignerListID" : 0,
            "SignerQuorum" : 3,
            "index" : "79FD203E4DDDF2EA78B798C963487120C048C78652A28682425E47C96D016F92"
         }
      ],
      "ledger_hash" : "56E81069F06492FB410A70218C08169BE3AB3CFD5AEA20E999662D81DC361D9F",
      "ledger_index" : 5,
      "status" : "success",
      "validated" : true
   }
}
```

SignerListが予期した内容で存在していれば、アドレスでマルチシグができるようになります。

## 6. その他のステップ

これで、アドレスから[マルチシグトランザクションを送信](send-a-multi-signed-transaction.md)できます。次の操作も実行できます。

* `asfDisableMaster`フラグを使用して[AccountSetトランザクション][]を送信し、アドレスのマスターキーペアを無効化。
* [SetRegularKeyトランザクション][]を送信して[アドレスのレギュラーキーペアを削除](change-or-remove-a-regular-key-pair.md)（レギュラーキーペアをすでに設定している場合）。

## 関連項目

- **コンセプト:**
  - [暗号鍵](../../../concepts/accounts/cryptographic-keys.md)
  - [マルチシグ](../../../concepts/accounts/multi-signing.md)
- **チュートリアル:**
  - [rippledのインストール](../../../infrastructure/installation/index.md)
  - [レギュラーキーペアの割り当て](assign-a-regular-key-pair.md)
  - [信頼できるトランザクションの送信](../../../concepts/transactions/reliable-transaction-submission.md)
  - [パブリック署名の有効化](../../../infrastructure/configuration/enable-public-signing.md)
- **リファレンス:**
  - [wallet_proposeメソッド][]
  - [account_objectsメソッド][]
  - [sign_forメソッド][]
  - [submit_multisignedメソッド][]
  - [SignerListSetトランザクション][]
  - [SignerListオブジェクト](../../../references/protocol/ledger-data/ledger-entry-types/signerlist.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
