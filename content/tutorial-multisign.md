How to Multi-Sign
=============================

Multi-signing is one of three ways to authorize transactions for the Ripple Consensus Ledger, alongside signing with [regular keys](reference-transaction-format.html#setregularkey) and master keys. You can configure your address to allow any combination of the three methods to authorize transactions.

Benefits of multi-signing include:

* You can require keys from different devices, so that a malicious actor must compromise multiple machines to send transactions on your behalf.
* You can share custody of an address between multiple people, each of whom only has one of several keys necessary to send transactions from that address.
* You can delegate the power to send transactions from your address to a group of people, who can control your address if you are unavailable or unable to sign normally.
* ... and more.

To use multi-signing:

1. [The Ripple peer-to-peer network must have multi-signing enabled.](#availability-of-multi-signing)
2. [Set up a list of signers on your account.](#setting-up-multi-signing)
3. [Send transactions using multiple signatures.](#sending-a-multi-signed-transaction)


Availability of Multi-Signing
-----------------------------

Multi-signing is built into `rippled` starting with [version 0.31.0](https://wiki.ripple.com/Rippled-0.31.0). Because multi-signing is a change in transaction processing, the change is due to be enabled by an **Amendment** to the Ripple Consensus Protocol. This Amendment must be approved by a consensus of validators showing consistent support for the feature over a period of time. For more information, see [Amendments](concept-amendments.html).

If you want to test multi-signing before it becomes available in the production network, or without risking real money, you can do so by running `rippled` in [stand-alone mode](concept-stand-alone-mode.html) with the MultiSign feature enabled. To enable multi-signing for testing, add the following stanza to your `rippled.cfg`:

    [features]
    MultiSign


Setting up Multi-Signing
------------------------

Before you can set up multi-signing, first check that [multi-signing is available](#availability-of-multi-signing).

To multi-sign transactions from a particular address, you must create a list of addresses that can contribute to a multi-signature for your address. This list is stored in the Ripple Consensus Ledger as a [SignerList node](reference-ledger-format.html#signerlist). The following procedure demonstrates how to set up a SignerList for your address:


### 1. Prepare a funded address ###

You need a Ripple address that can send transactions, and has enough XRP available. Multi-signing requires more than the usual amount of XRP for the [account reserve](concept-reserves.html) and [transaction cost](concept-transaction-cost.html), increasing with the number of signers and signatures you use.

If you started `rippled` in [stand-alone mode](concept-stand-alone-mode.html) with a new genesis ledger, you must:

1. Generate keys for a new address, or reuse keys you already have.
2. Submit a Payment transaction to fund the new address from the genesis account. (Send at least 100,000,000 [drops of XRP](reference-rippled.html#specifying-currency-amounts).)
3. Manually close the ledger.


### 2. Prepare member keys ###

You need several sets of Ripple keys (address and secret) to include as members of your SignerList. These can be funded addresses that exist in the ledger, or you can generate new addresses using the [`wallet_propose` command](reference-rippled.html#wallet-propose). For example:

    $ rippled wallet_propose
    Loading: "/home/mduo13/.config/ripple/rippled.cfg"
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

Take note of the `account_id` (Ripple Address) and `master_seed` (Ripple secret key) for each one you generate.


### 3. Send SignerListSet transaction ###

[Sign and submit](reference-transaction-format.html#signing-and-submitting-transactions) a [SignerListSet transaction](reference-transaction-format.html#signerlistset) in the normal (single-signature) way. This associates a SignerList with your Ripple address, so that a combination of signatures from the members of that SignerList can multi-sign later transactions on your behalf.

In this example, the SignerList has 3 members, with the weights and quorum set up such that multi-signed transactions need a signature from rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW plus at least one signature from the other two members of the list.

**Caution:** Never submit a secret key to a server you do not control. Do not transmit a secret key unencrypted over the network.

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

Make sure that the [Transaction Result](reference-transaction-format.html#transaction-results) is [**tesSUCCESS**](reference-transaction-format.html#tes-success). Otherwise, the transaction failed.

**Note:** The more members in the SignerList, the more XRP your address must have for purposes of the [owner reserve](concept-reserves.html#owner-reserves). If your address does not have enough XRP, the transaction fails with [tecINSUFFICIENT_RESERVE](reference-transaction-format.html#tec-codes). See also: [SignerLists and Reserves](reference-ledger-format.html#signerlists-and-reserves).


### 4. Close the ledger ###

On the live network, you can wait 4-7 seconds for the ledger to close automatically.

If you're running `rippled` in stand-alone mode, use the [`ledger_accept` command](reference-rippled.html#ledger-accept) to manually close the ledger:

    $ rippled ledger_accept
    Loading: "/home/mduo13/.config/ripple/rippled.cfg"
    Connecting to 127.0.0.1:5005
    {
       "result" : {
          "ledger_current_index" : 6,
          "status" : "success"
       }
    }


### 5. Confirm the new signer list ###

Use the [`account_objects` command](reference-rippled.html#account-objects) to confirm that the SignerList is associated with the address in the latest validated ledger.

Normally, an account can own many objects of different types (such as trust lines and offers). If you funded a new address for this tutorial, the SignerList is the only object in the response.

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
             }
          ],
          "ledger_hash" : "56E81069F06492FB410A70218C08169BE3AB3CFD5AEA20E999662D81DC361D9F",
          "ledger_index" : 5,
          "status" : "success",
          "validated" : true
       }
    }

If the SignerList is present with the expected contents, then your address is ready to multi-sign.

### 6. Further steps ###

At this point, your address is ready to [send a multi-signed transaction](#sending-a-multi-signed-transaction). You may also want to:

* Disable the address's master key by sending an [AccountSet transaction](reference-transaction-format.html#accountset) using the `asfDisableMaster` flag.
* Remove the address's regular key (if you previously set one) by sending a [SetRegularKey transaction](reference-transaction-format.html#setregularkey).


Sending a Multi-Signed Transaction
----------------------------------

Before you can multi-sign a transaction, first  [set up multi-signing](#setting-up-multi-signing) for your address. The following procedure demonstrates how to create, sign, and submit a multi-signed transaction.

### 1. Create the transaction ##

Create a JSON object that represents the transaction you want to submit. You have to specify _everything_ about this transaction, including `Fee` and `Sequence`. Also include the field `SigningPubKey` as an empty string, to indicate that the transaction is multi-signed.

Keep in mind that the `Fee` for multi-signed transactions is significantly higher than for regularly-signed transactions. It should be (N+1) times the normal [transaction cost](concept-transaction-cost.html), where N is the number of signatures you plan to provide. Given that it sometimes takes a while to collect signatures from multiple sources, you may want to include additional buffer in case the [transaction cost](concept-transaction-cost.html) increases in that time.

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


### 2. Get one signature ###

Use the [`sign_for` command](reference-rippled.html#sign-for) with the secret key and address of one of the members of your SignerList to get a signature for that member.

**Caution:** Never submit a secret key to a server you do not control. Do not transmit a secret key unencrypted over the network.

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

Save the `tx_json` field of the response: it has the new signature in the `Signers` field. You can discard the value of the `tx_blob` field.


### 3. Get additional signatures ###

You can collect additional signatures in parallel or in serial:

* In parallel: Use the `sign_for` command with the original JSON for the transaction. Each response has a single signature in the `Signers` array.
* In serial: Use the `sign_for` command with the `tx_json` value from the previous `sign_for` response. Each response adds a new signature to the existing `Signers` array.

**Caution:** Never submit a secret key to a server you do not control. Do not transmit a secret key unencrypted over the network.

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

Depending on the SignerList you configured, you may need to repeat this step several times to get signatures from all the necessary parties.


### 4. Combine signatures and submit ###

If you collected the signatures in serial, the `tx_json` from the last `sign_for` response has all the signatures assembled, so you can use that as the argument to the [`submit_multisigned` command](reference-rippled.html#submit-multisigned).

If you collected the signatures in parallel, you must manually construct a `tx_json` object with all the signatures included. Take the `Signers` arrays from all the `sign_for` responses, and combine their contents into a single `Signers` array that has each signature. Add the combined `Signers` array to the original transaction JSON value, and use that as the argument to the [`submit_multisigned` command](reference-rippled.html#submit-multisigned).

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


### 5. Close the ledger ##

If you are using the live network, you can wait 4-7 seconds for the ledger to close automatically.

If you're running `rippled` in stand-alone mode, use the [`ledger_accept` command](reference-rippled.html#ledger-accept) to manually close the ledger:

    $ rippled ledger_accept
    Loading: "/home/mduo13/.config/ripple/rippled.cfg"
    Connecting to 127.0.0.1:5005
    {
       "result" : {
          "ledger_current_index" : 7,
          "status" : "success"
       }
    }


### 6. Confirm transaction results ###

Use the hash value from the response to the `submit_multisigned` command to look up the transaction using the [`tx` command](reference-rippled.html#tx). In particular, check that the `TransactionResult` is the string `tesSUCCESS`.

On the live network, you must also confirm that the `validated` field is set to the boolean `true`. If the field is not `true`, you might need to wait longer for the consensus process to finish; or your transaction may be unable to be included in a ledger for some reason.

In stand-alone mode, the server automatically considers a ledger to be `validated` if it has been manually closed.

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
