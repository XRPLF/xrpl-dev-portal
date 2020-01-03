# マルチ署名の設定

マルチ署名は、XRP Ledgerのトランザクションを承認する3種類の方法の1つです。マルチ署名の他に[レギュラーキーとマスターキー](cryptographic-keys.html)で署名する方法があります。3種類のトランザクション承認方法を自由に組み合わせて使用できるようにアドレスを設定できます。

このチュートリアルでは、アドレスのマルチ署名を有効にする方法を説明します。


## 前提条件

- 資金供給のあるXRP Ledgerアドレスが必要です。

- XRP Ledgerフォーマットでキーペアを生成するツールを利用できる必要があります。この処理に`rippled`サーバーを使用する場合は、[wallet_proposeメソッド][]が管理者専用であるため、管理者アクセス権限が必要です。

- マルチ署名は使用可能である必要があります。マルチ署名は、2016年6月27日以降、XRP Ledger Consensusプロトコルに対する[**Amendment**](amendments.html)により利用できるようになりました。


## 1. 資金供給のあるアドレスの準備

トランザクションを送信でき、利用可能なXRPを十分に保有するXRP Ledgerアドレスが必要です。

[MultiSignReserve Amendment][]が有効ではない場合、マルチ署名を使用するには[アカウント準備金](reserves.html)および[トランザクションコスト](transaction-cost.html)に通常よりも多くのXRPが必要となります。必要額は、使用する署名および署名者の数に応じて増加します。

[MultiSignReserve Amendment][]が有効な場合、マルチ署名を使用するには、使用する署名と署名者の数に関わらず、アカウントの準備金として5 XRPが必要です。マルチ署名済みトランザクションの[トランザクションコスト](transaction-cost.html)は、このAmendmentの影響を受けず、使用する署名と署名者の数に応じて増加します。

`rippled`を[スタンドアロンモード](rippled-server-modes.html#rippledサーバーをスタンドアロンモードで実行する理由)で新しいジェネシスレジャーで開始した場合は、以下の操作を行う必要があります:

1. 新しいアドレスのキーを生成するか、またはすでに所有するキーを再利用します。
2. ジェネシスアカウントから新しいアドレスに資金を供給するため、Paymentトランザクションを送信します。（[XRPのdrop数][]で100,000,000以上を送信してください。）
3. 手動でレジャーを閉鎖します。


## 2. メンバーキーの準備

複数のXRP Ledgerキーセット（アドレスとシークレット）をSignerListのメンバーに追加する必要があります。SignerListには、レジャーに既存の資金供給のあるアドレス、または[wallet_proposeメソッド][]で生成した新しいアドレスを追加できます。例:

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

生成した各アドレスの`account_id`（XRP Ledgerアドレス）と`master_seed`（シークレットキー）をメモします。


## 3. SignerListSetトランザクションの送信

通常の方法（シングルシグネチャー）で[SignerListSetトランザクション][]に[署名して送信](transaction-basics.html#トランザクションへの署名とトランザクションの送信)します。これによりSignerListがXRP Ledgerのアドレスに関連付けられるので、これ以降はSignerListの複数メンバーがあなたの代わりにトランザクションに署名するマルチ署名が可能となります。

この例ではSignerListに3人のメンバーが含まれています。また、マルチ署名済みトランザクションにはrsA2LpzuawewSBQXkiju3YQTMzW13pAAdWの署名と、リストの他の2人のメンバーからの少なくとも1つの署名を必要とするように、重みと定数が設定されています。

{% include '_snippets/secret-key-warning.md' %}
<!--{#_ #}-->

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
          "engine_result_message" : "The transaction was applied.Only final in a validated ledger.",
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

[トランザクションの結果](transaction-results.html)が[**tesSUCCESS**](tes-success.html)であることを確認します。それ以外の場合、トランザクションは失敗しています。スタンドアロンモードまたは本番環境以外のネットワークで問題が発生した場合は、[マルチ署名が有効であること](start-a-new-genesis-ledger-in-stand-alone-mode.html#新しいジェネシスレジャーの設定)を確認してください。

**注記:** [MultiSignReserve Amendment][]が有効ではない場合は、SignerListのメンバーの増加に応じて、アドレスの[所有者準備金](reserves.html#所有者準備金)のXRP額を増加する必要があります。アドレスに十分なXRPがないと、トランザクションは[tecINSUFFICIENT_RESERVE](tec-codes.html)で失敗します。[MultiSignReserve Amendment][]が有効な場合は、SignerListの署名者の数に関係なく[所有者準備金](reserves.html#所有者準備金)として必要なXRPは5 XRPです。関連項目: [SignerListと準備金](signerlist.html#signerlistと準備金)


## 4. レジャーの閉鎖

本番環境のネットワークでは、レジャーが自動的に閉鎖するまでに4～7秒かかる場合があります。

スタンドアロンモードで`rippled`を実行している場合は、[ledger_acceptメソッド][]を使用してレジャーを手動で閉鎖します。

    $ rippled ledger_accept
    Loading: "/etc/opt/ripple/rippled.cfg"
    Connecting to 127.0.0.1:5005
    {
       "result" : {
          "ledger_current_index" : 6,
          "status" : "success"
       }
    }


## 5. 新しい署名者リストの確認

[account_objectsメソッド][]を使用して、SignerListに最新の検証済みレジャーのアドレスが関連付けられていることを確認します。

通常、アカウントは異なるタイプのオブジェクト（トラストラインやオファーなど）を複数所有できます。このチュートリアルで新しいアドレスに資金を供給した場合、SignerListが応答の唯一のオブジェクトになります。

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
                         "Account" : "raKEEVSGnKSD9Zyvxu4z6Pqpm4ABH8FS6n",
                         "SignerWeight" : 1
                      }
                   },
                   {
                      "SignerEntry" : {
                         "Account" : "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
                         "SignerWeight" : 1
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

SignerListが予期した内容で存在していれば、アドレスでマルチ署名ができるようになります。

## 6. その他のステップ

これで、アドレスから[マルチ署名済みトランザクションを送信](send-a-multi-signed-transaction.html)できます。次の操作も実行できます。

* `asfDisableMaster`フラグを使用して[AccountSetトランザクション][]を送信し、アドレスのマスターキーペアを無効化。
* [SetRegularKeyトランザクション][]を送信してアドレスのレギュラーキーペアを削除（レギュラーキーペアをすでに設定している場合）。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
