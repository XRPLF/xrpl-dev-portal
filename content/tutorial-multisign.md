Introduction to Multi-Signing
===============================================================================

Multi-signing in Ripple is the act of authorizing transactions for the Ripple Consensus Ledger by using a combination of multiple secret keys. After setting up multi-signing for an account, you can put the master secret in cold storage, or even disable the master key entirely. With multiple secret keys required to authorize a multi-signature, you can improve security in several ways.

* If you keep an account's keys on different devices, a malicious user must compromise multiple machines in order to send transactions on your behalf.
* If the keys to an account are in the custody of entirely different people, those people must collaborate in order to send transaction from that account.
* You can use the SignerList as a backup, to delegate a group of others who can send transactions for you if you are unavailable or unable to sign using your regular key.
* Even more uses than can be described here.


Availability of Multi-Signing
-------------------------------------------------------------------------------

Multi-signing is built into `rippled` starting with version **0.31.0**. Because multi-signing is a change in transaction processing, the change is due to be enabled by an **Amendment** to the Ripple Consensus Protocol. This Amendment must be approved by a consensus of validators showing consistent support for the feature over a period of time. For more information, see [Amendments](concept-amendments.html).

You can test multi-signing by running `rippled` in [stand-alone mode](concept-stand-alone-mode.html) with the Multi-Sign feature enabled. To enable Multi-Sign for testing, add the following stanza to your `rippled.cfg`:

    [features]
    MultiSign


How to Multi-Sign
===============================================================================

The basic process of Multi-Signing a transaction is necessarily more complex than the process of signing a transaction with a single master key or regular key.

## 1. (Optional) Generate keys for a new wallet ##

This step is not strictly necessary. For this process, we generate and fund a new Ripple account and then set up multi-signing for that account. To set up multi-signing on an existing Ripple account, skip ahead to [Step 4: creating a signer list](4-create-a-signerlist-on-the-new-account-with-a-signerlistset-transaction).

    $ rippled wallet_propose
    Loading: "/home/mduo13/.config/ripple/rippled.cfg"
    Connecting to 127.0.0.1:5005
    {
       "result" : {
          "account_id" : "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
          "key_type" : "secp256k1",
          "master_key" : "LOST FOUR ALOE ABE SLUG ITS HACK MAGI SOCK BASS APE DELL",
          "master_seed" : "sn1CmMEkPijNrfyr8HJqsgP416dr3",
          "master_seed_hex" : "E42AD02985BB56923DFC1D002DB510B3",
          "public_key" : "aBQgQDutj8YUc7ZRtfj86dnzPCvPcRHtUszxeCCDMgZ7Zq1Thfri",
          "public_key_hex" : "03668837C3DCA0F4858587703524E61BB40128B9F6910B80B4655E152CAEE2E321",
          "status" : "success"
       }
    }


As always, be sure that an account's secret key never gets transmitted to anyone you don't trust with full control of that account, and certainly not unencrypted over the network.


## 2. Fund the new account with an existing wallet ##

Again, this step is only necessary if you are setting up a new account to use multi-signing for this example.

    $ rippled submit snoPBrXtMeMyMHUVTgbuqAfg1SUTb '{
    > "TransactionType": "Payment",
    > "Account": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    > "Destination": "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
    > "Amount": "100000000",
    > "Flags": 2147483648
    > }'
    Loading: "/home/mduo13/.config/ripple/rippled.cfg"
    Connecting to 127.0.0.1:5005
    {
       "result" : {
          "engine_result" : "tesSUCCESS",
          "engine_result_code" : 0,
          "engine_result_message" : "The transaction was applied. Only final in a validated ledger.",
          "status" : "success",
          "tx_blob" : "12000022800000002400000004614000000005F5E10068400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100ED13CDD4B8F6BA836F7732A029316393A5D9B50712FE79972236ECAD850F813802203148D8944B0BF3D30A3177EFCE6A9F12B3F5A3C3AFF7B73E9A7D65B370E526EE8114B5F762798A53D543A014CAF8B297CFF8F2F937E88314A3780F5CB5A44D366520FC44055E8ED44D9A2270",
          "tx_json" : {
             "Account" : "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
             "Amount" : "100000000",
             "Destination" : "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
             "Fee" : "10",
             "Flags" : 2147483648,
             "Sequence" : 4,
             "SigningPubKey" : "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
             "TransactionType" : "Payment",
             "TxnSignature" : "3045022100ED13CDD4B8F6BA836F7732A029316393A5D9B50712FE79972236ECAD850F813802203148D8944B0BF3D30A3177EFCE6A9F12B3F5A3C3AFF7B73E9A7D65B370E526EE",
             "hash" : "64FAA44F671E2CBB4E1E4156FCDA72BA3C32EF951C94EDDFEBEBE8BEC3F55696"
          }
       }
    }


Make sure that the `engine_result` value in the response is **tesSUCCESS**. Otherwise, the transaction failed.

## 3. Close the ledger ##

If you are using the live network, you can wait for the ledger to close automatically as the result of consensus. This typically takes 4-7 seconds.

If you are running `rippled` in stand-alone mode, you must manually close the ledger with the [`ledger_accept` command](reference-rippled.html#ledger-accept).

    $ rippled ledger_accept
    Loading: "/home/mduo13/.config/ripple/rippled.cfg"
    Connecting to 127.0.0.1:5005
    {
       "result" : {
          "ledger_current_index" : 16061437,
          "status" : "success"
       }
    }


## 4. Create a SignerList on the new account with a SignerListSet transaction ##

Before you can multi-sign transactions, you must associate a SignerList with your account, so that RCL knows which keys can be used to sign for you. You do this with a [SignerListSet transaction](reference-transaction-format.html#signerlistset).

The `Account` values in your SignerList can be the addresses of funded accounts that exist in the ledger, or you can generate new addresses that are not currently in use. For funded accounts in the SignerList, a regular key associated with the account can contribute to a multi-signature, and the master key secret can be used only if it is not disabled. For unfunded addresses, only the master key associated with that address can be used to contribute to a multi-signature.

In this example, the SignerList has 3 members, with the weights and quorum set up such that multi-signed transactions need a signature from rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW plus at least one signature from the other two members of the list.

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
    Loading: "/home/mduo13/.config/ripple/rippled.cfg"
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

Make sure that the `engine_result` value in the response is **tesSUCCESS**. Otherwise, the transaction failed.

## 5. Close the ledger again ##

As before, on the live network, you can wait for the ledger to close automatically.

If running `rippled` in stand-alone mode, use the [`ledger_accept` command](reference-rippled.html#ledger-accept) to manually close the ledger:

    $ rippled ledger_accept
    Loading: "/home/mduo13/.config/ripple/rippled.cfg"
    Connecting to 127.0.0.1:5005
    {
       "result" : {
          "ledger_current_index" : 6,
          "status" : "success"
       }
    }


## 6. Confirm the presence of the new signer list using account_objects ##

Normally an account can own many objects of different types (such as trust lines and offers). For this tutorial, we created a new account, so the SignerList is the only object in the response from the [`account_objects` command](reference-rippled.html#account-objects).

    $ rippled account_objects rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC validated
    Loading: "/home/mduo13/.config/ripple/rippled.cfg"
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
             },
             {
                "Balance" : {
                   "currency" : "USD",
                   "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
                   "value" : "0"
                },
                "Flags" : 2162688,
                "HighLimit" : {
                   "currency" : "USD",
                   "issuer" : "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
                   "value" : "0"
                },
                "HighNode" : "0000000000000000",
                "LedgerEntryType" : "RippleState",
                "LowLimit" : {
                   "currency" : "USD",
                   "issuer" : "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
                   "value" : "100"
                },
                "LowNode" : "0000000000000000",
                "PreviousTxnID" : "BD636194C48FD7A100DE4C972336534C8E710FD008C0F3CF7BC5BF34DAF3C3E6",
                "PreviousTxnLgrSeq" : 6,
                "index" : "93E317B32022977C77810A2C558FBB28E30E744C68E73720622B797F957EC5FA"
             }
          ],
          "ledger_hash" : "56E81069F06492FB410A70218C08169BE3AB3CFD5AEA20E999662D81DC361D9F",
          "ledger_index" : 5,
          "status" : "success",
          "validated" : true
       }
    }



## 7. Create a new transaction that you plan to multi-sign ##

You have to specify _everything_ about this transaction, including `Fee` and
`Sequence`. Also include the field `SigningPubKey` as an empty string -- this
indicates that the transaction is multi-signed.

Here's an example transaction we can send from our test account:

    {
        "TransactionType": "TrustSet",
        "Account": "rnBFvgZphmN39GWzUJeUitaP22Fr9be75H",
        "Flags": 262144,
        "LimitAmount": {
          "currency": "USD",
          "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
          "value": "100"
        },
        "Sequence": 2,
        "SigningPubKey":"",
        "Fee": "30000"
    }

(If you started from a fresh ledger, you first need to fund the account
specified by the `issuer` in this example, and then manually close the ledger.)

Keep in mind that the `Fee` for multi-signed transactions is significantly
higher than for regularly-signed transactions. It should be (N+1) times the
normal fee, where N is the number of signatures you plan to provide. Given that
it sometimes takes a while to collect signatures from multiple sources, you may
want to include additional buffer in case the load fee increases in that time.


## 8. Get one signature ##

The [`sign_for` command](reference-rippled.html#sign-for) takes an address and related secret, and a transaction in JSON form. It generates a signature for that transaction, using the secret key and address specified. By using this, you can provide signatures that contribute to a multi-signed transaction. (The signatures should come from the members of your SignerList.)

    $ rippled sign_for rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW <rsA2L..'s secret> '{ "TransactionType": "TrustSet", "Account": "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC", "Flags": 262144, "LimitAmount": { "currency": "USD", "issuer": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh", "value": "100" }, "Sequence": 2, "SigningPubKey":"", "Fee": "30000" }'
    Loading: "/home/mduo13/.config/ripple/rippled.cfg"
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

Save the `tx_json` field of the response: it has the new signature in the `Signers` field.

The `tx_blob` is not very useful at this point, unless you're "multi-signing" a transaction with only one signature.


## 9. Get additional signatures the same way ##

You can collect additional signatures for the same transaction in parallel by using the `sign_for` command with the same transaction JSON. You can also collect additional signatures in serial: if you provide the `tx_json` value from a previous `sign_for` response, the response appends a signature to the existing Signers array.

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
    Loading: "/home/mduo13/.config/ripple/rippled.cfg"
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

Depending on the SignerList you configured, you may need to repeat this step several times in order to get signatures from all the necessary parties.


## 10. Combine the signatures and submit ##

The commandline syntax for the [`submit_multisigned` command](reference-rippled.html#submit-multisigned) takes a single transaction JSON containing a `Signers` array, so you need to combine all the signatures from the all the responses into a single `Signers` array field with all the signatures. If you collected signatures serially, the `tx_json` from the last response is sufficient.

The `submit_multisigned` command actually submits the transaction for inclusion in the ledger. In online mode, this also relays it to other members of the network.

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
    Loading: "/home/mduo13/.config/ripple/rippled.cfg"
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


## 14. Close the ledger one last time ##

As before, on the live network, you can wait 4-7 seconds for the ledger to close automatically.

If running `rippled` in stand-alone mode, use the [`ledger_accept` command](reference-rippled.html#ledger-accept) to manually close the ledger:

    $ rippled ledger_accept
    Loading: "/home/mduo13/.config/ripple/rippled.cfg"
    Connecting to 127.0.0.1:5005
    {
       "result" : {
          "ledger_current_index" : 7,
          "status" : "success"
       }
    }


## 15. Confirm the results of the transaction ##

Use the hash value from the response to the `submit_multisigned` command.

    $ rippled tx BD636194C48FD7A100DE4C972336534C8E710FD008C0F3CF7BC5BF34DAF3C3E6
    Loading: "/home/mduo13/.config/ripple/rippled.cfg"
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


In particular, check that the `TransactionResult` is the string `tesSUCCESS`.

On the live network, you must also confirm that the `validated` field is set to the boolean `true`. If the field is not `true`, you might need to wait longer for the consensus process to finish; or your transaction may be unable to be included in a ledger for some reason.

In stand-alone mode, the server automatically considers a ledger to be `validated` if it has been manually closed.
