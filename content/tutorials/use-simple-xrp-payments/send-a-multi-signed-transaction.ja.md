# マルチ署名済みトランザクションの送信

マルチ署名済みトランザクションを作成、署名、送信する方法を以下で説明します。

## 前提条件

- 事前にアドレスの[マルチ署名の設定](set-up-multi-signing.html)をする必要があります。

- マルチ署名は使用可能である必要があります。マルチ署名は、XRP Ledgerコンセンサスプロトコルに対する[**Amendment**](amendments.html)により2016/06/27以降利用可能になりました。


## 1.トランザクションの作成

送信するトランザクションを表すJSONオブジェクトを作成します。`Fee`や`Sequence`をはじめ、このトランザクションに関する _すべての_ 情報を指定する必要があります。また、トランザクションがマルチ署名済みトランザクションであることを示すため、`SigningPubKey`を空の文字列として指定します。

マルチ署名済みトランザクションの`Fee`は、標準の署名済みトランザクションよりもかなり高額ですので、ご注意ください。手数料は通常の[トランザクションコスト](transaction-cost.html)の（N+1）倍以上となります（Nは付与する予定の署名数です）。複数のソースから署名を収集するのに時間がかかることがあるため、その間に[トランザクションコスト](transaction-cost.html)の増加に備えて現行の最小値よりも大きな値を指定できます。

マルチ署名が可能なトランザクションの例を以下に示します。

    {
        "TransactionType":"TrustSet",
        "Account":"rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
        "Flags":262144,
        "LimitAmount":{
            "currency":"USD",
            "issuer":"rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
            "value":"100"
        },
        "Sequence":2,
        "SigningPubKey":"",
        "Fee":"30000"
    }

（このトランザクションは、残高上限額が100 USDのrEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQCから rHb9CJAWyB4rj91VRWn96DkukG4bwdtyThへの会計上の関係を作成します。）


## 2.1つの署名の取得

SlignerListのメンバーの1人のシークレットキーとアドレスを指定した[sign_forメソッド][]を使用して、そのメンバーの署名を取得します。

{% include '_snippets/secret-key-warning.md' %}
<!--{#_ #}-->

    $ rippled sign_for rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW <rsA2L..'s secret> '{
    >     "TransactionType":"TrustSet",
    >     "Account":"rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
    >     "Flags":262144,
    >     "LimitAmount":{
    >         "currency":"USD",
    >         "issuer":"rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    >         "value":"100"
    >     },
    >     "Sequence":2,
    >     "SigningPubKey":"",
    >     "Fee":"30000"
    > }'
    Loading:"/etc/opt/ripple/rippled.cfg"
    Connecting to 127.0.0.1:5005
    {
       "result" :{
          "status" :"success",
          "tx_blob" :"1200142200040000240000000263D5038D7EA4C680000000000000000000000000005553440000000000B5F762798A53D543A014CAF8B297CFF8F2F937E868400000000000753073008114A3780F5CB5A44D366520FC44055E8ED44D9A2270F3E010732102B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF744730450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E58114204288D2E47F8EF6C99BCC457966320D12409711E1F1",
          "tx_json" :{
             "Account" :"rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
             "Fee" :"30000",
             "Flags" :262144,
             "LimitAmount" :{
                "currency" :"USD",
                "issuer" :"rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
                "value" :"100"
             },
             "Sequence" :2,
             "Signers" :[
                {
                   "Signer" :{
                      "Account" :"rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
                      "SigningPubKey" :"02B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF",
                      "TxnSignature" :"30450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E5"
                   }
                }
             ],
             "SigningPubKey" :"",
             "TransactionType" :"TrustSet",
             "hash" :"A94A6417D1A7AAB059822B894E13D322ED3712F7212CE9257801F96DE6C3F6AE"
          }
       }
    }

応答の`tx_json`フィールドを保存します。このフィールドの`Signers`フィールドに新しい署名が入力されています。`tx_blob`フィールドの値は無視できます。

スタンドアロンモードまたは本番環境以外のネットワークで問題が発生した場合は、[マルチ署名が有効であること](start-a-new-genesis-ledger-in-stand-alone-mode.html#新しいジェネシスレジャーの設定)を確認してください。

## 3.追加の署名の取得

追加の署名は平行して取得するか、または順次取得することができます。　

* 並行して取得する場合: トランザクションの元のJSONを指定した`sign_for`コマンドを使用します。各応答の`Signers`配列に1つの署名が含まれています。
* 順次取得する場合: 前の`sign_for`応答の`tx_json`値を指定した`sign_for`コマンドを使用します。各応答の既存の`Signers`配列に新しい署名が追加されます。

{% include '_snippets/secret-key-warning.md' %}
<!--{#_ #}-->

    $ rippled sign_for rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v <rUpy..'s secret> '{
    >    "Account" :"rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
    >    "Fee" :"30000",
    >    "Flags" :262144,
    >    "LimitAmount" :{
    >       "currency" :"USD",
    >       "issuer" :"rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    >       "value" :"100"
    >    },
    >    "Sequence" :2,
    >    "Signers" :[
    >       {
    >          "Signer" :{
    >             "Account" :"rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
    >             "SigningPubKey" :"02B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF",
    >             "TxnSignature" :"30450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E5"
    >          }
    >       }
    >    ],
    >    "SigningPubKey" :"",
    >    "TransactionType" :"TrustSet",
    >    "hash" :"A94A6417D1A7AAB059822B894E13D322ED3712F7212CE9257801F96DE6C3F6AE"
    > }'
    Loading:"/etc/opt/ripple/rippled.cfg"
    Connecting to 127.0.0.1:5005
    {
       "result" :{
          "status" :"success",
          "tx_blob" :"1200142200040000240000000263D5038D7EA4C680000000000000000000000000005553440000000000B5F762798A53D543A014CAF8B297CFF8F2F937E868400000000000753073008114A3780F5CB5A44D366520FC44055E8ED44D9A2270F3E010732102B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF744730450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E58114204288D2E47F8EF6C99BCC457966320D12409711E1E0107321028FFB276505F9AC3F57E8D5242B386A597EF6C40A7999F37F1948636FD484E25B744630440220680BBD745004E9CFB6B13A137F505FB92298AD309071D16C7B982825188FD1AE022004200B1F7E4A6A84BB0E4FC09E1E3BA2B66EBD32F0E6D121A34BA3B04AD99BC181147908A7F0EDD48EA896C3580A399F0EE78611C8E3E1F1",
          "tx_json" :{
             "Account" :"rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
             "Fee" :"30000",
             "Flags" :262144,
             "LimitAmount" :{
                "currency" :"USD",
                "issuer" :"rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
                "value" :"100"
             },
             "Sequence" :2,
             "Signers" :[
                {
                   "Signer" :{
                      "Account" :"rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
                      "SigningPubKey" :"02B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF",
                      "TxnSignature" :"30450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E5"
                   }
                },
                {
                   "Signer" :{
                      "Account" :"rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
                      "SigningPubKey" :"028FFB276505F9AC3F57E8D5242B386A597EF6C40A7999F37F1948636FD484E25B",
                      "TxnSignature" :"30440220680BBD745004E9CFB6B13A137F505FB92298AD309071D16C7B982825188FD1AE022004200B1F7E4A6A84BB0E4FC09E1E3BA2B66EBD32F0E6D121A34BA3B04AD99BC1"
                   }
                }
             ],
             "SigningPubKey" :"",
             "TransactionType" :"TrustSet",
             "hash" :"BD636194C48FD7A100DE4C972336534C8E710FD008C0F3CF7BC5BF34DAF3C3E6"
          }
       }
    }

構成したSignerListによっては、必要なすべての当事者からの署名を取得するためにこのステップを複数回繰り返す必要があります。


## 4.署名の結合と送信

署名を順次収集した場合、最後の`sign_for`応答の`tx_json`ではすべての署名が結合されているので、これを[submit_multisignedメソッド][]の引数として使用できます。

署名を並行して収集した場合、すべての署名を含む`tx_json`オブジェクトを手動で作成する必要があります。すべての`sign_for`応答の`Signers`配列の内容を1つの`Signers`配列に結合します。この配列には各署名が含まれます。結合された`Signers`配列を元のトランザクションのJSON値に追加し、これを[submit_multisignedメソッド][]の引数として使用します。

    $ rippled submit_multisigned '{
    >              "Account" :"rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
    >              "Fee" :"30000",
    >              "Flags" :262144,
    >              "LimitAmount" :{
    >                 "currency" :"USD",
    >                 "issuer" :"rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    >                 "value" :"100"
    >              },
    >              "Sequence" :2,
    >              "Signers" :[
    >                 {
    >                    "Signer" :{
    >                       "Account" :"rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
    >                       "SigningPubKey" :"02B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF",
    >                       "TxnSignature" :"30450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E5"
    >                    }
    >                 },
    >                 {
    >                    "Signer" :{
    >                       "Account" :"rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
    >                       "SigningPubKey" :"028FFB276505F9AC3F57E8D5242B386A597EF6C40A7999F37F1948636FD484E25B",
    >                       "TxnSignature" :"30440220680BBD745004E9CFB6B13A137F505FB92298AD309071D16C7B982825188FD1AE022004200B1F7E4A6A84BB0E4FC09E1E3BA2B66EBD32F0E6D121A34BA3B04AD99BC1"
    >                    }
    >                 }
    >              ],
    >              "SigningPubKey" :"",
    >              "TransactionType" :"TrustSet",
    >              "hash" :"BD636194C48FD7A100DE4C972336534C8E710FD008C0F3CF7BC5BF34DAF3C3E6"
    >           }'
    Loading:"/etc/opt/ripple/rippled.cfg"
    Connecting to 127.0.0.1:5005
    {
    	"result":{
    		"engine_result":"tesSUCCESS",
    		"engine_result_code":0,
    		"engine_result_message":"The transaction was applied.Only final in a validated ledger.",
    		"status":"success",
    		"tx_blob":"1200142200040000240000000263D5038D7EA4C680000000000000000000000000005553440000000000B5F762798A53D543A014CAF8B297CFF8F2F937E868400000000000753073008114A3780F5CB5A44D366520FC44055E8ED44D9A2270F3E010732102B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF744730450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E58114204288D2E47F8EF6C99BCC457966320D12409711E1E0107321028FFB276505F9AC3F57E8D5242B386A597EF6C40A7999F37F1948636FD484E25B744630440220680BBD745004E9CFB6B13A137F505FB92298AD309071D16C7B982825188FD1AE022004200B1F7E4A6A84BB0E4FC09E1E3BA2B66EBD32F0E6D121A34BA3B04AD99BC181147908A7F0EDD48EA896C3580A399F0EE78611C8E3E1F1",
    		"tx_json":{
    			"Account":"rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
    			"Fee":"30000",
    			"Flags":262144,
    			"LimitAmount":{
    				"currency":"USD",
    				"issuer":"rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    				"value":"100"
    			},
    			"Sequence":2,
    			"Signers":[{
    				"Signer":{
    					"Account":"rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
    					"SigningPubKey":"02B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF",
    					"TxnSignature":"30450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E5"
    				}
    			}, {
    				"Signer":{
    					"Account":"rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
    					"SigningPubKey":"028FFB276505F9AC3F57E8D5242B386A597EF6C40A7999F37F1948636FD484E25B",
    					"TxnSignature":"30440220680BBD745004E9CFB6B13A137F505FB92298AD309071D16C7B982825188FD1AE022004200B1F7E4A6A84BB0E4FC09E1E3BA2B66EBD32F0E6D121A34BA3B04AD99BC1"
    				}
    			}],
    			"SigningPubKey":"",
    			"TransactionType":"TrustSet",
    			"hash":"BD636194C48FD7A100DE4C972336534C8E710FD008C0F3CF7BC5BF34DAF3C3E6"
    		}
    	}
    }


応答の`hash`値をメモしておきます。これにより、後でトランザクションの結果を確認できます。（この例ではハッシュは`BD636194C48FD7A100DE4C972336534C8E710FD008C0F3CF7BC5BF34DAF3C3E6`です。）


## 5.レジャーの閉鎖

本番環境のネットワークを使用している場合は、レジャーが自動的に閉鎖するまで4～7秒待つことがあります。

スタンドアロンモードで`rippled`を実行している場合は、[ledger_acceptメソッド][]を使用してレジャーを手動で閉鎖します。

    $ rippled ledger_accept
    Loading:"/etc/opt/ripple/rippled.cfg"
    Connecting to 127.0.0.1:5005
    {
       "result" :{
          "ledger_current_index" :7,
          "status" :"success"
       }
    }


## 6.トランザクション結果の確認

`submit_multisigned`コマンドの応答のハッシュ値を使用して、[txメソッド][]でトランザクションを検索します。特に`TransactionResult`が文字列`tesSUCCESS`であることを確認してください。

本番環境のネットワークでは、`validated`フィールドがブール値`true`に設定されていることも確認する必要があります。このフィールドが`true`ではない場合は、コンセンサスプロセスの完了までしばらく待機する必要があるか、または何らかの理由でトランザクションをレジャーに記録できない可能性があります。

スタンドアロンモードでは、サーバーは手動で閉鎖されたレジャーを自動的に`validated`とみなします。

    $ rippled tx BD636194C48FD7A100DE4C972336534C8E710FD008C0F3CF7BC5BF34DAF3C3E6
    Loading:"/etc/opt/ripple/rippled.cfg"
    Connecting to 127.0.0.1:5005
    {
    	"result":{
    		"Account":"rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
    		"Fee":"30000",
    		"Flags":262144,
    		"LimitAmount":{
    			"currency":"USD",
    			"issuer":"rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    			"value":"100"
    		},
    		"Sequence":2,
    		"Signers":[{
    			"Signer":{
    				"Account":"rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
    				"SigningPubKey":"02B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF",
    				"TxnSignature":"30450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E5"
    			}
    		}, {
    			"Signer":{
    				"Account":"rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
    				"SigningPubKey":"028FFB276505F9AC3F57E8D5242B386A597EF6C40A7999F37F1948636FD484E25B",
    				"TxnSignature":"30440220680BBD745004E9CFB6B13A137F505FB92298AD309071D16C7B982825188FD1AE022004200B1F7E4A6A84BB0E4FC09E1E3BA2B66EBD32F0E6D121A34BA3B04AD99BC1"
    			}
    		}],
    		"SigningPubKey":"",
    		"TransactionType":"TrustSet",
    		"date":512172510,
    		"hash":"BD636194C48FD7A100DE4C972336534C8E710FD008C0F3CF7BC5BF34DAF3C3E6",
    		"inLedger":6,
    		"ledger_index":6,
    		"meta":{
    			"AffectedNodes":[{
    				"ModifiedNode":{
    					"LedgerEntryType":"AccountRoot",
    					"LedgerIndex":"2B6AC232AA4C4BE41BF49D2459FA4A0347E1B543A4C92FCEE0821C0201E2E9A8",
    					"PreviousTxnID":"B7E1D33DB7DEA3BB65BFAB2C80E02125F47FCCF6C957A7FDECD915B3EBE0C1DD",
    					"PreviousTxnLgrSeq":4
    				}
    			}, {
    				"CreatedNode":{
    					"LedgerEntryType":"RippleState",
    					"LedgerIndex":"93E317B32022977C77810A2C558FBB28E30E744C68E73720622B797F957EC5FA",
    					"NewFields":{
    						"Balance":{
    							"currency":"USD",
    							"issuer":"rrrrrrrrrrrrrrrrrrrrBZbvji",
    							"value":"0"
    						},
    						"Flags":2162688,
    						"HighLimit":{
    							"currency":"USD",
    							"issuer":"rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    							"value":"0"
    						},
    						"LowLimit":{
    							"currency":"USD",
    							"issuer":"rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
    							"value":"100"
    						}
    					}
    				}
    			}, {
    				"ModifiedNode":{
    					"FinalFields":{
    						"Account":"rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
    						"Balance":"999960000",
    						"Flags":0,
    						"OwnerCount":6,
    						"Sequence":3
    					},
    					"LedgerEntryType":"AccountRoot",
    					"LedgerIndex":"A6B1BA6F2D70813100908EA84ABB7783695050312735E2C3665259F388804EA0",
    					"PreviousFields":{
    						"Balance":"999990000",
    						"OwnerCount":5,
    						"Sequence":2
    					},
    					"PreviousTxnID":"8FDC18960455C196A8C4DE0D24799209A21F4A17E32102B5162BD79466B90222",
    					"PreviousTxnLgrSeq":5
    				}
    			}, {
    				"ModifiedNode":{
    					"FinalFields":{
    						"Flags":0,
    						"Owner":"rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
    						"RootIndex":"C2728175908D82FB1DE6676F203D8D3C056995A9FA9B369EF326523F1C65A1DE"
    					},
    					"LedgerEntryType":"DirectoryNode",
    					"LedgerIndex":"C2728175908D82FB1DE6676F203D8D3C056995A9FA9B369EF326523F1C65A1DE"
    				}
    			}, {
    				"CreatedNode":{
    					"LedgerEntryType":"DirectoryNode",
    					"LedgerIndex":"D8120FC732737A2CF2E9968FDF3797A43B457F2A81AA06D2653171A1EA635204",
    					"NewFields":{
    						"Owner":"rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    						"RootIndex":"D8120FC732737A2CF2E9968FDF3797A43B457F2A81AA06D2653171A1EA635204"
    					}
    				}
    			}],
    			"TransactionIndex":0,
    			"TransactionResult":"tesSUCCESS"
    		},
    		"status":"success",
    		"validated": true
    	}
    }

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
