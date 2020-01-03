# Send a Multi-Signed Transaction

The following procedure demonstrates how to create, sign, and submit a multi-signed transaction.

## Prerequisites

- You must have already [set up multi-signing](set-up-multi-signing.html) for your address.

- Multi-signing must be available. Multi-signing has been enabled by an [**Amendment**](amendments.html) to the XRP Ledger Consensus Protocol since 2016-06-27.


## 1. Create the transaction

Create a JSON object that represents the transaction you want to submit. You have to specify _everything_ about this transaction, including `Fee` and `Sequence`. Also include the field `SigningPubKey` as an empty string, to indicate that the transaction is multi-signed.

Keep in mind that the `Fee` for multi-signed transactions is significantly higher than for regularly-signed transactions. It should be at least (N+1) times the normal [transaction cost](transaction-cost.html), where N is the number of signatures you plan to provide. Since it sometimes takes a while to collect signatures from multiple sources, you may want to specify more than the current minimum, in case the [transaction cost](transaction-cost.html) increases in that time.

Here's an example transaction ready to be multi-signed:

    {
        "TransactionType": "TrustSet",
        "Account": "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
        "Flags": 262144,
        "LimitAmount": {
            "currency": "USD",
            "issuer": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
            "value": "100"
        },
        "Sequence": 2,
        "SigningPubKey": "",
        "Fee": "30000"
    }

(This transaction creates an accounting relationship from rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC to rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh with a maximum balance of 100 USD.)


## 2. Get one signature

Use the [sign_for method][] with the secret key and address of one of the members of your SignerList to get a signature for that member.

{% include '_snippets/secret-key-warning.md' %}
<!--{#_ #}-->

    $ rippled sign_for rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW <rsA2L..'s secret> '{
    >     "TransactionType": "TrustSet",
    >     "Account": "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
    >     "Flags": 262144,
    >     "LimitAmount": {
    >         "currency": "USD",
    >         "issuer": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    >         "value": "100"
    >     },
    >     "Sequence": 2,
    >     "SigningPubKey": "",
    >     "Fee": "30000"
    > }'
    Loading: "/etc/opt/ripple/rippled.cfg"
    Connecting to 127.0.0.1:5005
    {
       "result" : {
          "status" : "success",
          "tx_blob" : "1200142200040000240000000263D5038D7EA4C680000000000000000000000000005553440000000000B5F762798A53D543A014CAF8B297CFF8F2F937E868400000000000753073008114A3780F5CB5A44D366520FC44055E8ED44D9A2270F3E010732102B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF744730450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E58114204288D2E47F8EF6C99BCC457966320D12409711E1F1",
          "tx_json" : {
             "Account" : "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
             "Fee" : "30000",
             "Flags" : 262144,
             "LimitAmount" : {
                "currency" : "USD",
                "issuer" : "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
                "value" : "100"
             },
             "Sequence" : 2,
             "Signers" : [
                {
                   "Signer" : {
                      "Account" : "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
                      "SigningPubKey" : "02B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF",
                      "TxnSignature" : "30450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E5"
                   }
                }
             ],
             "SigningPubKey" : "",
             "TransactionType" : "TrustSet",
             "hash" : "A94A6417D1A7AAB059822B894E13D322ED3712F7212CE9257801F96DE6C3F6AE"
          }
       }
    }

Save the `tx_json` field of the response: it has the new signature in the `Signers` field. You can discard the value of the `tx_blob` field.

If you have a problem in stand-alone mode or a non-production network, check that [multi-sign is enabled](start-a-new-genesis-ledger-in-stand-alone-mode.html#settings-in-new-genesis-ledgers).

## 3. Get additional signatures

You can collect additional signatures in parallel or in serial:

* In parallel: Use the `sign_for` command with the original JSON for the transaction. Each response has a single signature in the `Signers` array.
* In serial: Use the `sign_for` command with the `tx_json` value from the previous `sign_for` response. Each response adds a new signature to the existing `Signers` array.

{% include '_snippets/secret-key-warning.md' %}
<!--{#_ #}-->

    $ rippled sign_for rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v <rUpy..'s secret> '{
    >    "Account" : "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
    >    "Fee" : "30000",
    >    "Flags" : 262144,
    >    "LimitAmount" : {
    >       "currency" : "USD",
    >       "issuer" : "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    >       "value" : "100"
    >    },
    >    "Sequence" : 2,
    >    "Signers" : [
    >       {
    >          "Signer" : {
    >             "Account" : "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
    >             "SigningPubKey" : "02B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF",
    >             "TxnSignature" : "30450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E5"
    >          }
    >       }
    >    ],
    >    "SigningPubKey" : "",
    >    "TransactionType" : "TrustSet",
    >    "hash" : "A94A6417D1A7AAB059822B894E13D322ED3712F7212CE9257801F96DE6C3F6AE"
    > }'
    Loading: "/etc/opt/ripple/rippled.cfg"
    Connecting to 127.0.0.1:5005
    {
       "result" : {
          "status" : "success",
          "tx_blob" : "1200142200040000240000000263D5038D7EA4C680000000000000000000000000005553440000000000B5F762798A53D543A014CAF8B297CFF8F2F937E868400000000000753073008114A3780F5CB5A44D366520FC44055E8ED44D9A2270F3E010732102B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF744730450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E58114204288D2E47F8EF6C99BCC457966320D12409711E1E0107321028FFB276505F9AC3F57E8D5242B386A597EF6C40A7999F37F1948636FD484E25B744630440220680BBD745004E9CFB6B13A137F505FB92298AD309071D16C7B982825188FD1AE022004200B1F7E4A6A84BB0E4FC09E1E3BA2B66EBD32F0E6D121A34BA3B04AD99BC181147908A7F0EDD48EA896C3580A399F0EE78611C8E3E1F1",
          "tx_json" : {
             "Account" : "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
             "Fee" : "30000",
             "Flags" : 262144,
             "LimitAmount" : {
                "currency" : "USD",
                "issuer" : "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
                "value" : "100"
             },
             "Sequence" : 2,
             "Signers" : [
                {
                   "Signer" : {
                      "Account" : "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
                      "SigningPubKey" : "02B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF",
                      "TxnSignature" : "30450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E5"
                   }
                },
                {
                   "Signer" : {
                      "Account" : "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
                      "SigningPubKey" : "028FFB276505F9AC3F57E8D5242B386A597EF6C40A7999F37F1948636FD484E25B",
                      "TxnSignature" : "30440220680BBD745004E9CFB6B13A137F505FB92298AD309071D16C7B982825188FD1AE022004200B1F7E4A6A84BB0E4FC09E1E3BA2B66EBD32F0E6D121A34BA3B04AD99BC1"
                   }
                }
             ],
             "SigningPubKey" : "",
             "TransactionType" : "TrustSet",
             "hash" : "BD636194C48FD7A100DE4C972336534C8E710FD008C0F3CF7BC5BF34DAF3C3E6"
          }
       }
    }

Depending on the SignerList you configured, you may need to repeat this step several times to get signatures from all the necessary parties.


## 4. Combine signatures and submit

If you collected the signatures in serial, the `tx_json` from the last `sign_for` response has all the signatures assembled, so you can use that as the argument to the [submit_multisigned method][].

If you collected the signatures in parallel, you must manually construct a `tx_json` object with all the signatures included. Take the `Signers` arrays from all the `sign_for` responses, and combine their contents into a single `Signers` array that has each signature. Add the combined `Signers` array to the original transaction JSON value, and use that as the argument to the [submit_multisigned method][].

    $ rippled submit_multisigned '{
    >              "Account" : "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
    >              "Fee" : "30000",
    >              "Flags" : 262144,
    >              "LimitAmount" : {
    >                 "currency" : "USD",
    >                 "issuer" : "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    >                 "value" : "100"
    >              },
    >              "Sequence" : 2,
    >              "Signers" : [
    >                 {
    >                    "Signer" : {
    >                       "Account" : "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
    >                       "SigningPubKey" : "02B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF",
    >                       "TxnSignature" : "30450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E5"
    >                    }
    >                 },
    >                 {
    >                    "Signer" : {
    >                       "Account" : "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
    >                       "SigningPubKey" : "028FFB276505F9AC3F57E8D5242B386A597EF6C40A7999F37F1948636FD484E25B",
    >                       "TxnSignature" : "30440220680BBD745004E9CFB6B13A137F505FB92298AD309071D16C7B982825188FD1AE022004200B1F7E4A6A84BB0E4FC09E1E3BA2B66EBD32F0E6D121A34BA3B04AD99BC1"
    >                    }
    >                 }
    >              ],
    >              "SigningPubKey" : "",
    >              "TransactionType" : "TrustSet",
    >              "hash" : "BD636194C48FD7A100DE4C972336534C8E710FD008C0F3CF7BC5BF34DAF3C3E6"
    >           }'
    Loading: "/etc/opt/ripple/rippled.cfg"
    Connecting to 127.0.0.1:5005
    {
    	"result": {
    		"engine_result": "tesSUCCESS",
    		"engine_result_code": 0,
    		"engine_result_message": "The transaction was applied. Only final in a validated ledger.",
    		"status": "success",
    		"tx_blob": "1200142200040000240000000263D5038D7EA4C680000000000000000000000000005553440000000000B5F762798A53D543A014CAF8B297CFF8F2F937E868400000000000753073008114A3780F5CB5A44D366520FC44055E8ED44D9A2270F3E010732102B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF744730450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E58114204288D2E47F8EF6C99BCC457966320D12409711E1E0107321028FFB276505F9AC3F57E8D5242B386A597EF6C40A7999F37F1948636FD484E25B744630440220680BBD745004E9CFB6B13A137F505FB92298AD309071D16C7B982825188FD1AE022004200B1F7E4A6A84BB0E4FC09E1E3BA2B66EBD32F0E6D121A34BA3B04AD99BC181147908A7F0EDD48EA896C3580A399F0EE78611C8E3E1F1",
    		"tx_json": {
    			"Account": "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
    			"Fee": "30000",
    			"Flags": 262144,
    			"LimitAmount": {
    				"currency": "USD",
    				"issuer": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    				"value": "100"
    			},
    			"Sequence": 2,
    			"Signers": [{
    				"Signer": {
    					"Account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
    					"SigningPubKey": "02B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF",
    					"TxnSignature": "30450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E5"
    				}
    			}, {
    				"Signer": {
    					"Account": "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
    					"SigningPubKey": "028FFB276505F9AC3F57E8D5242B386A597EF6C40A7999F37F1948636FD484E25B",
    					"TxnSignature": "30440220680BBD745004E9CFB6B13A137F505FB92298AD309071D16C7B982825188FD1AE022004200B1F7E4A6A84BB0E4FC09E1E3BA2B66EBD32F0E6D121A34BA3B04AD99BC1"
    				}
    			}],
    			"SigningPubKey": "",
    			"TransactionType": "TrustSet",
    			"hash": "BD636194C48FD7A100DE4C972336534C8E710FD008C0F3CF7BC5BF34DAF3C3E6"
    		}
    	}
    }


Take note of the `hash` value from the response so you can check the results of the transaction later.  (In this case, the hash is `BD636194C48FD7A100DE4C972336534C8E710FD008C0F3CF7BC5BF34DAF3C3E6`.)


## 5. Close the ledger

If you are using the live network, you can wait 4-7 seconds for the ledger to close automatically.

If you're running `rippled` in stand-alone mode, use the [ledger_accept method][] to manually close the ledger:

    $ rippled ledger_accept
    Loading: "/etc/opt/ripple/rippled.cfg"
    Connecting to 127.0.0.1:5005
    {
       "result" : {
          "ledger_current_index" : 7,
          "status" : "success"
       }
    }


## 6. Confirm transaction results

Use the hash value from the response to the `submit_multisigned` command to look up the transaction using the [tx method][]. In particular, check that the `TransactionResult` is the string `tesSUCCESS`.

On the live network, you must also confirm that the `validated` field is set to the boolean `true`. If the field is not `true`, you might need to wait longer for the consensus process to finish; or your transaction may be unable to be included in a ledger for some reason.

In stand-alone mode, the server automatically considers a ledger to be `validated` if it has been manually closed.

    $ rippled tx BD636194C48FD7A100DE4C972336534C8E710FD008C0F3CF7BC5BF34DAF3C3E6
    Loading: "/etc/opt/ripple/rippled.cfg"
    Connecting to 127.0.0.1:5005
    {
    	"result": {
    		"Account": "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
    		"Fee": "30000",
    		"Flags": 262144,
    		"LimitAmount": {
    			"currency": "USD",
    			"issuer": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    			"value": "100"
    		},
    		"Sequence": 2,
    		"Signers": [{
    			"Signer": {
    				"Account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
    				"SigningPubKey": "02B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF",
    				"TxnSignature": "30450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E5"
    			}
    		}, {
    			"Signer": {
    				"Account": "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
    				"SigningPubKey": "028FFB276505F9AC3F57E8D5242B386A597EF6C40A7999F37F1948636FD484E25B",
    				"TxnSignature": "30440220680BBD745004E9CFB6B13A137F505FB92298AD309071D16C7B982825188FD1AE022004200B1F7E4A6A84BB0E4FC09E1E3BA2B66EBD32F0E6D121A34BA3B04AD99BC1"
    			}
    		}],
    		"SigningPubKey": "",
    		"TransactionType": "TrustSet",
    		"date": 512172510,
    		"hash": "BD636194C48FD7A100DE4C972336534C8E710FD008C0F3CF7BC5BF34DAF3C3E6",
    		"inLedger": 6,
    		"ledger_index": 6,
    		"meta": {
    			"AffectedNodes": [{
    				"ModifiedNode": {
    					"LedgerEntryType": "AccountRoot",
    					"LedgerIndex": "2B6AC232AA4C4BE41BF49D2459FA4A0347E1B543A4C92FCEE0821C0201E2E9A8",
    					"PreviousTxnID": "B7E1D33DB7DEA3BB65BFAB2C80E02125F47FCCF6C957A7FDECD915B3EBE0C1DD",
    					"PreviousTxnLgrSeq": 4
    				}
    			}, {
    				"CreatedNode": {
    					"LedgerEntryType": "RippleState",
    					"LedgerIndex": "93E317B32022977C77810A2C558FBB28E30E744C68E73720622B797F957EC5FA",
    					"NewFields": {
    						"Balance": {
    							"currency": "USD",
    							"issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
    							"value": "0"
    						},
    						"Flags": 2162688,
    						"HighLimit": {
    							"currency": "USD",
    							"issuer": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    							"value": "0"
    						},
    						"LowLimit": {
    							"currency": "USD",
    							"issuer": "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
    							"value": "100"
    						}
    					}
    				}
    			}, {
    				"ModifiedNode": {
    					"FinalFields": {
    						"Account": "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
    						"Balance": "999960000",
    						"Flags": 0,
    						"OwnerCount": 6,
    						"Sequence": 3
    					},
    					"LedgerEntryType": "AccountRoot",
    					"LedgerIndex": "A6B1BA6F2D70813100908EA84ABB7783695050312735E2C3665259F388804EA0",
    					"PreviousFields": {
    						"Balance": "999990000",
    						"OwnerCount": 5,
    						"Sequence": 2
    					},
    					"PreviousTxnID": "8FDC18960455C196A8C4DE0D24799209A21F4A17E32102B5162BD79466B90222",
    					"PreviousTxnLgrSeq": 5
    				}
    			}, {
    				"ModifiedNode": {
    					"FinalFields": {
    						"Flags": 0,
    						"Owner": "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
    						"RootIndex": "C2728175908D82FB1DE6676F203D8D3C056995A9FA9B369EF326523F1C65A1DE"
    					},
    					"LedgerEntryType": "DirectoryNode",
    					"LedgerIndex": "C2728175908D82FB1DE6676F203D8D3C056995A9FA9B369EF326523F1C65A1DE"
    				}
    			}, {
    				"CreatedNode": {
    					"LedgerEntryType": "DirectoryNode",
    					"LedgerIndex": "D8120FC732737A2CF2E9968FDF3797A43B457F2A81AA06D2653171A1EA635204",
    					"NewFields": {
    						"Owner": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    						"RootIndex": "D8120FC732737A2CF2E9968FDF3797A43B457F2A81AA06D2653171A1EA635204"
    					}
    				}
    			}],
    			"TransactionIndex": 0,
    			"TransactionResult": "tesSUCCESS"
    		},
    		"status": "success",
    		"validated": true
    	}
    }

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
