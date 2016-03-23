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
          "account_id" : "rnBFvgZphmN39GWzUJeUitaP22Fr9be75H",
          "key_type" : "secp256k1",
          "master_key" : "NED MANA SPA BLUR HERS HEAT RED NIBS MAIN MELT NOB RARE",
          "master_seed" : "shqZZy2Rzs9ZqWTCQAdqc3bKgxnYq",
          "master_seed_hex" : "99C7F2DCD88218372B7509ADF7DC562B",
          "public_key" : "aBPvx491i2ZPVzmxoAmAVq5qXAxAZgmjfxoMTxFCg9Xxf2xwVVLc",
          "public_key_hex" : "0303E20EC6B4A39A629815AE02C0A1393B9225E3B890CAE45B59F42FA29BE9668D",
          "status" : "success"
       }
    }

As always, be sure that an account's secret key never gets transmitted to anyone you don't trust with full control of that account, and certainly not unencrypted over the network.


## 2. Fund the new account with an existing wallet ##

Again, this step is only necessary if you are setting up a new account to use multi-signing for this example.

    $ rippled submit <your existing account secret> '{
    >   "TransactionType" : "Payment",
    >   "Account" : "<your existing account address>",
    >   "Destination" : "rnBFvgZphmN39GWzUJeUitaP22Fr9be75H",
    >   "Amount" : "100000000",
    >   "Flags": 2147483648
    > }'
    Loading: "/home/mduo13/.config/ripple/rippled.cfg"
    Connecting to 127.0.0.1:5005
    {
       "result" : {
          "engine_result" : "tesSUCCESS",
          "engine_result_code" : 0,
          "engine_result_message" : "The transaction was applied. Only final in a validated ledger.",
          "status" : "success",
          "tx_blob" : "1200002280000000240000001E614000000005F5E10068400000000000000A7321023693F15967AE357D0327974AD46FE3C127113B1110D6044FD41E723689F81CC67446304402207AB5D16F58E9E6ADBBDD24837CAB80D871860E47EB0840FE57403FB979755A6D022015FE7A8838BEE6C18962C246D6D27791B7EE34B93415AE3824D12564E7A886C6811493B89AFCAD4C8EAC2B131C1331FEF12AE1522BBE83142DECAB42CA805119A9BA2FF305C9AFA12F0B86A1",
          "tx_json" : {
             "Account" : "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
             "Amount" : "100000000",
             "Destination" : "rnBFvgZphmN39GWzUJeUitaP22Fr9be75H",
             "Fee" : "10",
             "Flags" : 2147483648,
             "Sequence" : 30,
             "SigningPubKey" : "023693F15967AE357D0327974AD46FE3C127113B1110D6044FD41E723689F81CC6",
             "TransactionType" : "Payment",
             "TxnSignature" : "304402207AB5D16F58E9E6ADBBDD24837CAB80D871860E47EB0840FE57403FB979755A6D022015FE7A8838BEE6C18962C246D6D27791B7EE34B93415AE3824D12564E7A886C6",
             "hash" : "8C7A4D35D71CE80DA4EDAC91D620B6A348B7691B78AA2896284135378E10E0C2"
          }
       }
    }


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

In this example, the SignerList has 3 members, with the weights and quorum set up such that multi-signed transactions need a signature from rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW plus at least one signature from the other two members of the list. The `Account` values you use in your list can be funded accounts that exist in the ledger or just unused addresses.

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


## 5. Close the ledger again ##

As before, on the live network, you can wait for the ledger to close automatically.

If running `rippled` in stand-alone mode, use the [`ledger_accept` command](reference-rippled.html#ledger-accept) to manually close the ledger:

    $ rippled ledger_accept
    Loading: "/home/mduo13/.config/ripple/rippled.cfg"
    Connecting to 127.0.0.1:5005
    {
       "result" : {
          "ledger_current_index" : 16061438,
          "status" : "success"
       }
    }


## 6. Confirm the presence of the new signer list using account_objects ##

Normally an account has lots of different types of objects, but for this new account, the only thing we've done is add a SignerList, so it should be easy to find in the results of the [`account_objects` command](reference-rippled.html#account-objects).

    $ rippled account_objects rnBFvgZphmN39GWzUJeUitaP22Fr9be75H
    Loading: "/home/mduo13/.config/ripple/rippled.cfg"
    Connecting to 127.0.0.1:5005
    {
       "result" : {
          "account" : "rnBFvgZphmN39GWzUJeUitaP22Fr9be75H",
          "account_objects" : [
             {
                "Flags" : 0,
                "LedgerEntryType" : "SignerList",
                "OwnerNode" : "0000000000000000",
                "PreviousTxnID" : "3950D98AD20DA52EBB1F3937EF32F382D74092A4C8DF9A0B1A06ED25200B5756",
                "PreviousTxnLgrSeq" : 16061437,
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
                "index" : "92373B9F1683001079764527F0BD553ED8656A9934FE641A7F0A0BF4DB230E0E"
             }
          ],
          "ledger_current_index" : 16061438,
          "status" : "success",
          "validated" : false
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
        "Fee": "12000"
    }

(If you started from a fresh ledger, you first need to fund the account
specified by the `issuer` in this example, and then manually close the ledger.)

Keep in mind that the `Fee` for multi-signed transactions is significantly
higher than for regularly-signed transactions. It should be (N+1) times the
normal fee, where N is the number of signatures you plan to provide. Given that
it sometimes takes a while to collect signatures from multiple sources, you may
want to include additional buffer in case the load fee increases in that time.


## 8. Get a signature using the sign_for command ##

    $ rippled sign_for rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW <rsA2's secret> '{
    >     "TransactionType": "TrustSet",
    >     "Account": "rnBFvgZphmN39GWzUJeUitaP22Fr9be75H",
    >     "Flags": 262144,
    >     "LimitAmount": {
    >       "currency": "USD",
    >       "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    >       "value": "100"
    >     },
    >     "Sequence": 2,
    >     "SigningPubKey":"",
    >     "Fee": "12000"
    > }'
    Loading: "/home/mduo13/.config/ripple/rippled.cfg"
    Connecting to 127.0.0.1:5005
    {
       "result" : {
          "Signers" : [
             {
                "Signer" : {
                   "Account" : "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
                   "SigningPubKey" : "02B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF",
                   "TxnSignature" : "304502210093EED0F75190385282C6369EE3C5C0FCC65227917F545EC8848B94E17105BC3D022073B3FB14452056FF8E966736150E2D75F3B7460AD7DEF6E2932ECD6690B6C3FE"
                }
             }
          ],
          "status" : "success",
          "tx_blob" : "1200142200040000240000000263D5038D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA9684000000000002EE0730081142DECAB42CA805119A9BA2FF305C9AFA12F0B86A1",
          "tx_json" : {
             "Account" : "rnBFvgZphmN39GWzUJeUitaP22Fr9be75H",
             "Fee" : "12000",
             "Flags" : 262144,
             "LimitAmount" : {
                "currency" : "USD",
                "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "value" : "100"
             },
             "Sequence" : 2,
             "SigningPubKey" : "",
             "TransactionType" : "TrustSet",
             "hash" : "4622B2893AF3A70B4DB1FF86B25C10E92B71973895143E66029567A8541A8060"
          }
       }
    }

The valuable part in the response is the `Signers` field. This is the part that you're going to need later in order to construct the full, multi-signed transaction.

The other parts, such as the `tx_blob`, are not very useful at this point, unless you're "multi-signing" a transaction with only one signature.


## 9. Get additional signatures the same way ##

If the accounts in your SignerList are funded accounts, the secret key you use to sign for those accounts can come from the regular key (if they have one), or the master key (unless it's disabled). For accounts that don't exist in the ledger, you can only use the master secret associated with the address.

    $ rippled sign_for rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v <rUpy's secret> '{
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
        "Fee": "12000"
    }'
    Loading: "/home/mduo13/.config/ripple/rippled.cfg"
    Connecting to 127.0.0.1:5005
    {
       "result" : {
          "Signers" : [
             {
                "Signer" : {
                   "Account" : "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
                   "SigningPubKey" : "028FFB276505F9AC3F57E8D5242B386A597EF6C40A7999F37F1948636FD484E25B",
                   "TxnSignature" : "304402204C1A4FFE1628A4BBEA4E8BEDE7C7080B94299704207479D1334096721629DB9802206BB07EBAB23EA288D5714CF7D3231D041BBB2AFD973D24ED693197C4881DC2E1"
                }
             }
          ],
          "status" : "success",
          "tx_blob" : "1200142200040000240000000263D5038D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA9684000000000002EE0730081142DECAB42CA805119A9BA2FF305C9AFA12F0B86A1",
          "tx_json" : {
             "Account" : "rnBFvgZphmN39GWzUJeUitaP22Fr9be75H",
             "Fee" : "12000",
             "Flags" : 262144,
             "LimitAmount" : {
                "currency" : "USD",
                "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "value" : "100"
             },
             "Sequence" : 2,
             "SigningPubKey" : "",
             "TransactionType" : "TrustSet",
             "hash" : "4622B2893AF3A70B4DB1FF86B25C10E92B71973895143E66029567A8541A8060"
          }
       }
    }

Depending on the SignerList you configured, you may need to repeat this step several times in order to get signatures from all the necessary parties.


## 10. Combine the signatures and submit ##

Take the contents of all the `Signers` arrays from all the responses, and concatenate them in to a single `Signers` array field. The commandline syntax for the [`submit_multisigned` command](reference-rippled.html#submit-multisigned) takes a single JSON object with two elements: this combined `Signers` array; and `tx_json`, which is the transaction JSON that they signed.

This command actually submits the transaction for inclusion in the ledger. In online mode, this relays it to other members of the network.

    $ rippled submit_multisigned '    {
    >         "Signers": [
    >             {
    >                 "Signer" : {
    >                    "Account" : "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
    >                    "SigningPubKey" : "028FFB276505F9AC3F57E8D5242B386A597EF6C40A7999F37F1948636FD484E25B",
    >                    "TxnSignature" : "304402204C1A4FFE1628A4BBEA4E8BEDE7C7080B94299704207479D1334096721629DB9802206BB07EBAB23EA288D5714CF7D3231D041BBB2AFD973D24ED693197C4881DC2E1"
    >                 }
    >             },
    >             {
    >                 "Signer" : {
    >                    "Account" : "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
    >                    "SigningPubKey" : "02B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF",
    >                    "TxnSignature" : "304502210093EED0F75190385282C6369EE3C5C0FCC65227917F545EC8848B94E17105BC3D022073B3FB14452056FF8E966736150E2D75F3B7460AD7DEF6E2932ECD6690B6C3FE"
    >                 }
    >             }
    >         ],
    >         "tx_json": {
    >             "TransactionType": "TrustSet",
    >             "Account": "rnBFvgZphmN39GWzUJeUitaP22Fr9be75H",
    >             "Flags": 262144,
    >             "LimitAmount": {
    >               "currency": "USD",
    >               "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    >               "value": "100"
    >             },
    >             "Sequence": 2,
    >             "SigningPubKey":"",
    >             "Fee": "12000"
    >         }
    >     }'
    Loading: "/home/mduo13/.config/ripple/rippled.cfg"
    Connecting to 127.0.0.1:5005
    {
       "result" : {
          "engine_result" : "tesSUCCESS",
          "engine_result_code" : 0,
          "engine_result_message" : "The transaction was applied. Only final in a validated ledger.",
          "status" : "success",
          "tx_blob" : "1200142200040000240000000263D5038D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA9684000000000002EE0730081142DECAB42CA805119A9BA2FF305C9AFA12F0B86A1F3E010732102B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF7447304502210093EED0F75190385282C6369EE3C5C0FCC65227917F545EC8848B94E17105BC3D022073B3FB14452056FF8E966736150E2D75F3B7460AD7DEF6E2932ECD6690B6C3FE8114204288D2E47F8EF6C99BCC457966320D12409711E1E0107321028FFB276505F9AC3F57E8D5242B386A597EF6C40A7999F37F1948636FD484E25B7446304402204C1A4FFE1628A4BBEA4E8BEDE7C7080B94299704207479D1334096721629DB9802206BB07EBAB23EA288D5714CF7D3231D041BBB2AFD973D24ED693197C4881DC2E181147908A7F0EDD48EA896C3580A399F0EE78611C8E3E1F1",
          "tx_json" : {
             "Account" : "rnBFvgZphmN39GWzUJeUitaP22Fr9be75H",
             "Fee" : "12000",
             "Flags" : 262144,
             "LimitAmount" : {
                "currency" : "USD",
                "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "value" : "100"
             },
             "Sequence" : 2,
             "Signers" : [
                {
                   "Signer" : {
                      "Account" : "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
                      "SigningPubKey" : "02B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF",
                      "TxnSignature" : "304502210093EED0F75190385282C6369EE3C5C0FCC65227917F545EC8848B94E17105BC3D022073B3FB14452056FF8E966736150E2D75F3B7460AD7DEF6E2932ECD6690B6C3FE"
                   }
                },
                {
                   "Signer" : {
                      "Account" : "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
                      "SigningPubKey" : "028FFB276505F9AC3F57E8D5242B386A597EF6C40A7999F37F1948636FD484E25B",
                      "TxnSignature" : "304402204C1A4FFE1628A4BBEA4E8BEDE7C7080B94299704207479D1334096721629DB9802206BB07EBAB23EA288D5714CF7D3231D041BBB2AFD973D24ED693197C4881DC2E1"
                   }
                }
             ],
             "SigningPubKey" : "",
             "TransactionType" : "TrustSet",
             "hash" : "878C1C988305D87070F3E961FC27AC9D02C46FFDD92FC7EBB74E962344E58C78"
          }
       }
    }

Take note of the `hash` value from the response (In this case, it's `878C1C988305D87070F3E961FC27AC9D02C46FFDD92FC7EBB74E962344E58C78`) so you can check the results of the transaction later.


## 14. Close the ledger one last time ##

As before, on the live network, you can wait 4-7 seconds for the ledger to close automatically.

If running `rippled` in stand-alone mode, use the [`ledger_accept` command](reference-rippled.html#ledger-accept) to manually close the ledger:

    $ rippled ledger_accept
    Loading: "/home/mduo13/.config/ripple/rippled.cfg"
    Connecting to 127.0.0.1:5005
    {
       "result" : {
          "ledger_current_index" : 16061439,
          "status" : "success"
       }
    }


## 15. Confirm the results of the transaction ##

Use the hash value from the response to the `submit_multisigned` command.

    $ rippled tx 878C1C988305D87070F3E961FC27AC9D02C46FFDD92FC7EBB74E962344E58C78
    Loading: "/home/mduo13/.config/ripple/rippled.cfg"
    Connecting to 127.0.0.1:5005
    {
       "result" : {
          "Account" : "rnBFvgZphmN39GWzUJeUitaP22Fr9be75H",
          "Fee" : "12000",
          "Flags" : 262144,
          "LimitAmount" : {
             "currency" : "USD",
             "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
             "value" : "100"
          },
          "Sequence" : 2,
          "Signers" : [
             {
                "Signer" : {
                   "Account" : "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
                   "SigningPubKey" : "02B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF",
                   "TxnSignature" : "304502210093EED0F75190385282C6369EE3C5C0FCC65227917F545EC8848B94E17105BC3D022073B3FB14452056FF8E966736150E2D75F3B7460AD7DEF6E2932ECD6690B6C3FE"
                }
             },
             {
                "Signer" : {
                   "Account" : "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
                   "SigningPubKey" : "028FFB276505F9AC3F57E8D5242B386A597EF6C40A7999F37F1948636FD484E25B",
                   "TxnSignature" : "304402204C1A4FFE1628A4BBEA4E8BEDE7C7080B94299704207479D1334096721629DB9802206BB07EBAB23EA288D5714CF7D3231D041BBB2AFD973D24ED693197C4881DC2E1"
                }
             }
          ],
          "SigningPubKey" : "",
          "TransactionType" : "TrustSet",
          "date" : 496881900,
          "hash" : "878C1C988305D87070F3E961FC27AC9D02C46FFDD92FC7EBB74E962344E58C78",
          "inLedger" : 16061438,
          "ledger_index" : 16061438,
          "meta" : {
             "AffectedNodes" : [
                {
                   "ModifiedNode" : {
                      "LedgerEntryType" : "AccountRoot",
                      "LedgerIndex" : "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
                      "PreviousTxnID" : "6ECC8C16B76D9B9AB099CA96DD653D8A321C34F1E5972D5EE6DBA19418F4D0CC",
                      "PreviousTxnLgrSeq" : 16061436
                   }
                },
                {
                   "ModifiedNode" : {
                      "FinalFields" : {
                         "Flags" : 0,
                         "Owner" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                         "RootIndex" : "3B9C0CE77FCE7BCEE1A68F1E26AC467AF326239D0D816CE705E4A0E2DAD03F6D"
                      },
                      "LedgerEntryType" : "DirectoryNode",
                      "LedgerIndex" : "3B9C0CE77FCE7BCEE1A68F1E26AC467AF326239D0D816CE705E4A0E2DAD03F6D"
                   }
                },
                {
                   "CreatedNode" : {
                      "LedgerEntryType" : "RippleState",
                      "LedgerIndex" : "3C75A1F3DB61406AC2A9493038E8394A73F103C9229695AC7E57EB0F8AFC69E4",
                      "NewFields" : {
                         "Balance" : {
                            "currency" : "USD",
                            "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
                            "value" : "0"
                         },
                         "Flags" : 65536,
                         "HighLimit" : {
                            "currency" : "USD",
                            "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                            "value" : "0"
                         },
                         "LowLimit" : {
                            "currency" : "USD",
                            "issuer" : "rnBFvgZphmN39GWzUJeUitaP22Fr9be75H",
                            "value" : "100"
                         }
                      }
                   }
                },
                {
                   "ModifiedNode" : {
                      "FinalFields" : {
                         "Account" : "rnBFvgZphmN39GWzUJeUitaP22Fr9be75H",
                         "Balance" : "109978000",
                         "Flags" : 0,
                         "OwnerCount" : 6,
                         "Sequence" : 3
                      },
                      "LedgerEntryType" : "AccountRoot",
                      "LedgerIndex" : "3D728C1F82CFE419F2DC58707D1AD06E985A29217D21A991ADF154184B664F4F",
                      "PreviousFields" : {
                         "Balance" : "109990000",
                         "OwnerCount" : 5,
                         "Sequence" : 2
                      },
                      "PreviousTxnID" : "3950D98AD20DA52EBB1F3937EF32F382D74092A4C8DF9A0B1A06ED25200B5756",
                      "PreviousTxnLgrSeq" : 16061437
                   }
                },
                {
                   "ModifiedNode" : {
                      "FinalFields" : {
                         "Flags" : 0,
                         "Owner" : "rnBFvgZphmN39GWzUJeUitaP22Fr9be75H",
                         "RootIndex" : "95DA402B4D58FBFF6BAA4CB84BBC21348CC273949B61FEBCE758410EF90D147D"
                      },
                      "LedgerEntryType" : "DirectoryNode",
                      "LedgerIndex" : "95DA402B4D58FBFF6BAA4CB84BBC21348CC273949B61FEBCE758410EF90D147D"
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

In particular, check that the `TransactionResult` is the string `tesSUCCESS`.

On the live network, you must also confirm that the `validated` field is set to the boolean `true`. If the field is not `true`, you might need to wait longer for the consensus process to finish; or your transaction may be unable to be included in a ledger for some reason.

In stand-alone mode, the server automatically considers a ledger to be `validated` if it has been manually closed.
