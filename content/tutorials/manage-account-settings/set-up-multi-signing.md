# Set Up Multi-Signing

[Multi-signing](multi-signing.html) is one of three ways to authorize [transactions](transaction-basics.html) for the XRP Ledger, alongside signing with [regular keys and master keys](cryptographic-keys.html). You can configure your [address](accounts.html) to allow any combination of the three methods to authorize transactions.

This tutorial demonstrates how to enable multi-signing for an address.


## Prerequisites

- You must have a funded XRP Ledger [address](accounts.html) with enough spare XRP to send transactions and meet the [reserve requirement](reserves.html) of a new signer list.

    - With the [MultiSignReserve amendment][] enabled, multi-signing requires 5 XRP for the account reserve, regardless of the number of signers and signatures you use. (The MultiSignReserve amendment has been enabled in the production XRP Ledger since **2019-04-07**.)

    - If you are on a test network that does not have the [MultiSignReserve amendment][] enabled, multi-signing requires more than the usual amount of XRP for the [account reserve](reserves.html), increasing with the number of signers in the list.

- You must have access to a tool that can generate key pairs in the XRP Ledger format. If you are using a `rippled` server for this, you must have admin access because the [wallet_propose method][] is admin-only.

    - Alternatively, if you are authorizing others who already have XRP Ledger addresses to be signers for your address, you only need to know the account addresses of those people or entities.

- Multi-signing must be available. (The MultiSign amendment has been enabled in the production XRP Ledger since **2016-06-27**.)

## 1. Design Your Configuration

Decide how many signers you want to include (up to 8). Choose a quorum number for your signer list and weights for your signers based on how many signatures you want to require for a given transaction. For a straightforward "M-of-N" signing setup, assign each signer weight **`1`** and set your list's quorum to be "M", the number of signatures to require.


## 2. Prepare member keys

You need one or more validly-formed XRP Ledger addresses to include as members of  your signer list. You or your chosen signers must know the secret keys associated with these addresses. The addresses can be funded accounts that exist in the ledger, but they do not need to be.

You can generate new addresses using the [wallet_propose method][]. For example:

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

Take note of the `account_id` (XRP Ledger Address) and `master_seed` (secret key) for each one you generate.


## 3. Send SignerListSet transaction

[Sign and submit](transaction-basics.html#signing-and-submitting-transactions) a [SignerListSet transaction][] in the normal (single-signature) way. This associates a SignerList with your XRP Ledger address, so that a combination of signatures from the members of that SignerList can multi-sign later transactions on your behalf.

In this example, the SignerList has 3 members, with the weights and quorum set up such that multi-signed transactions need a signature from rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW plus at least one signature from the other two members of the list.

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

Make sure that the [Transaction Result](transaction-results.html) is [**tesSUCCESS**](tes-success.html). Otherwise, the transaction failed. If you have a problem in stand-alone mode or a non-production network, check that [multi-sign is enabled](start-a-new-genesis-ledger-in-stand-alone-mode.html#settings-in-new-genesis-ledgers).

**Note:** Without the [MultiSignReserve amendment][], the more members in the SignerList, the more XRP your address must have for purposes of the [owner reserve](reserves.html#owner-reserves). If your address does not have enough XRP, the transaction fails with [tecINSUFFICIENT_RESERVE](tec-codes.html). With the [MultiSignReserve amendment][] enabled, the XRP your address must have for purposes of the [owner reserve](reserves.html#owner-reserves) is 5 XRP, regardless of the number of members in the SignerList. See also: [SignerLists and Reserves](signerlist.html#signerlists-and-reserves).


## 4. Wait for validation

{% include '_snippets/wait-for-validation.md' %} <!--#{ fix md highlighting_ #}-->


## 5. Confirm the new signer list

Use the [account_objects method][] to confirm that the SignerList is associated with the address in the latest validated ledger.

Normally, an account can own many objects of different types (such as trust lines and offers). If you funded a new address for this tutorial, the SignerList is the only object in the response.

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

If the SignerList is present with the expected contents, then your address is ready to multi-sign.

## 6. Further steps

At this point, your address is ready to [send a multi-signed transaction](send-a-multi-signed-transaction.html). You may also want to:

* Disable the address's master key pair by sending an [AccountSet transaction][] using the `asfDisableMaster` flag.
* [Remove the address's regular key pair](change-or-remove-a-regular-key-pair.html) (if you previously set one) by sending a [SetRegularKey transaction][].

## See Also

- **Concepts:**
    - [Cryptographic Keys](cryptographic-keys.html)
    - [Multi-Signing](multi-signing.html)
- **Tutorials:**
    - [Install rippled](install-rippled.html)
    - [Assign a Regular Key Pair](assign-a-regular-key-pair.html)
    - [Reliable Transaction Submission](reliable-transaction-submission.html)
    - [Enable Public Signing](enable-public-signing.html)
- **References:**
    - [wallet_propose method][]
    - [account_objects method][]
    - [sign_for method][]
    - [submit_multisigned method][]
    - [SignerListSet transaction][]
    - [SignerList object](signerlist.html)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
