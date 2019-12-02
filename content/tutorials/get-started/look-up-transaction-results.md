# Look Up Transaction Results

To use the XRP Ledger effectively, you need to be able to understand [transaction](transaction-basics.html) outcomes: did the transaction succeed? What did it accomplish? If it failed, why?

The XRP Ledger is a shared system, with all data recorded publicly and carefully, securely updated with each new [ledger version](ledgers.html). Anyone can look up the exact outcome of any transaction and read the [transaction metadata](transaction-metadata.html) to see what it did.

This document describes, at a low level, how to know why a transaction reached the outcome it did. For an end-user, it is easier to look at a processed view of a transaction. For example, you can [use XRP Charts to get an English-language description of any recorded transaction](https://xrpcharts.ripple.com/#/transactions/).

## Prerequisites

To understand the outcome of a transaction as described in these instructions, you must:

- Know which transaction you want to understand. If you know the transaction's [identifying hash][], you can look it up that way. You can also look at transactions that executed in a recent ledger or the transactions that most recently affected a given account.
- Have access to a `rippled` server that provides reliable information and has the necessary history for when the transaction was submitted.
    - For looking up the outcomes of transactions you've recently submitted, the server you submitted through should be sufficient, as long as it maintains sync with the network during that time.
    - For outcomes of older transactions, you may want to use a [full-history server](ledger-history.html#full-history).

**Tip:** There are other ways of querying for data on transactions from the XRP Ledger, including the [Data API](data-api.html) and other exported databases, but those interfaces are non-authoritative. This document describes how to look up data using the `rippled` API directly, for the most direct and authoritative results possible.


## 1. Get Transaction Status

Knowing whether a transaction succeeded or failed is a two-part question:

1. Was the transaction included in a validated ledger?
2. If so, what changes to the ledger state occurred as a result?

To know whether a transaction was included in a validated ledger, you usually need access to all the ledgers it could possibly be in. The simplest, most foolproof way to do this is to look up the transaction on a [full history server](ledger-history.html#full-history). Use the [tx method][], [account_tx method][], or other response from `rippled`. Look for `"validated": true` to indicate that this response uses a ledger version that has been validated by consensus.

- If the result does not have `"validated": true`, then the result may be tentative and you must wait for the ledger to be validated to know if the transaction's outcome is final.
- If the result does not contain the transaction in question, or returns the error `txnNotFound`, then the transaction is not in any ledger that the server has in its available history. This may or may not mean that the transaction failed, depending on whether the transaction could be in a validated ledger version that the server does not have and whether it could be included in a future validated ledger. You can constrain the range of ledgers a transaction can be in by knowing:
    - The earliest ledger the transaction could be in, which is the **first ledger to be validated _after_ the transaction was first submitted**.
    - The last ledger the transaction could be in, which is defined by the transaction's `LastLedgerSequence` field.

The following example shows a successful transaction, as returned by the [tx method][], which is in a validated ledger version. The order of the fields in the JSON response has been rearranged, with some parts omitted, to make it easier to understand:

```json
{
  "TransactionType": "AccountSet",
  "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "Sequence": 376,
  "hash": "017DED8F5E20F0335C6F56E3D5EE7EF5F7E83FB81D2904072E665EEA69402567",

  ... (omitted) ...

  "meta": {
    "AffectedNodes": [
      ... (omitted) ...
    ],
    "TransactionResult": "tesSUCCESS"
  },
  "ledger_index": 46447423,
  "validated": true
}
```

This example shows an [AccountSet transaction][] sent by the [account](accounts.html) with address rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn, using [Sequence number][] 376. The transaction's [identifying hash][] is `017DED8F5E20F0335C6F56E3D5EE7EF5F7E83FB81D2904072E665EEA69402567` and its [result](transaction-results.html) is `tesSUCCESS`. The transaction was included in ledger version 46447423, which has been validated, so these results are final.


### Case: Not Included in a Validated Ledger

**If a transaction is not included in a validated ledger, it cannot possibly have had _any_ effect on the shared XRP Ledger state.** If the transaction's failure to be included in a ledger is [_final_](finality-of-results.html), then it cannot have any future effect, either.

If the transaction's failure is not final, it may still become included in a _future_ validated ledger. You can use the provisional results of applying the transaction to the current open ledger as a preview of the likely effects the transaction may have in a final ledger, but those results can change due to [numerous factors](finality-of-results.html#how-can-non-final-results-change).


### Case: Included in a Validated Ledger

If the transaction _is_ included in a validated ledger, then the [transaction metadata](transaction-metadata.html) contains a full report of all changes that were made to the ledger state as a result of processing the transaction. The metadata's `TransactionResult` field contains a [transaction result code](transaction-results.html) that summarizes the outcome:

- The code `tesSUCCESS` indicates that the transaction was, more or less, successful.
- A `tec`-class code indicates that the transaction failed, and its only effects on the ledger state are to destroy the XRP [transaction cost](transaction-cost.html) and possibly perform some bookkeeping like removing [expired Offers](offers.html#offer-expiration) and [closed payment channels](payment-channels.html#payment-channel-lifecycle).
- No other code can appear in any ledger.

The result code is only a summary of the transaction's outcome. To understand in more detail what the transaction did, you must read the rest of the metadata in context of the transaction's instructions and the ledger state before the transaction executed.


## 2. Interpret Metadata

Transaction metadata describes _exactly_ how the transaction was applied to the ledger, including the following fields:

{% include '_snippets/tx-metadata-field-table.md' %} <!--_ -->

Most of the metadata is contained in [the `AffectedNodes` array](transaction-metadata.html#affectednodes). What to look for in this array depends on the type of transaction. Almost every transaction modifies the sender's [AccountRoot object][] to destroy the XRP [transaction cost](transaction-cost.html) and increase the [account's Sequence number](basic-data-types.html#account-sequence).

**Info:** One exception to this rule is for [pseudo-transactions](pseudo-transaction-types.html), which aren't sent from a real account and thus do not modify an AccountRoot object. There are other exceptions that modify an AccountRoot object without changing its `Balance` field: [free key reset transactions](transaction-cost.html#key-reset-transaction) do not change the sender's XRP balance; and in the unlikely scenario that a transaction causes an account to receive exactly as much XRP as it destroys, the account's Balance shows no net change. (The transaction cost is reflected elsewhere in the metadata, from wherever the account received the XRP.)

This example shows the full response from step 1 above. See if you can figure out what changes it made to the ledger:

```json
{
  "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "Fee": "12",
  "Flags": 2147483648,
  "LastLedgerSequence": 46447424,
  "Sequence": 376,
  "SigningPubKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
  "TransactionType": "AccountSet",
  "TxnSignature": "30450221009B2910D34527F4EA1A02C375D5C38CF768386ACDE0D17CDB04C564EC819D6A2C022064F419272003AA151BB32424F42FC3DBE060C8835031A4B79B69B0275247D5F4",
  "date": 608257201,
  "hash": "017DED8F5E20F0335C6F56E3D5EE7EF5F7E83FB81D2904072E665EEA69402567",
  "inLedger": 46447423,
  "ledger_index": 46447423,
  "meta": {
    "AffectedNodes": [
      {
        "ModifiedNode": {
          "LedgerEntryType": "AccountRoot",
          "LedgerIndex": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
          "FinalFields": {
            "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            "AccountTxnID": "017DED8F5E20F0335C6F56E3D5EE7EF5F7E83FB81D2904072E665EEA69402567",
            "Balance": "396015164",
            "Domain": "6D64756F31332E636F6D",
            "EmailHash": "98B4375E1D753E5B91627516F6D70977",
            "Flags": 8519680,
            "MessageKey": "0000000000000000000000070000000300",
            "OwnerCount": 9,
            "Sequence": 377,
            "TransferRate": 4294967295
          },
          "PreviousFields": {
            "AccountTxnID": "E710CADE7FE9C26C51E8630138322D80926BE91E46D69BF2F36E6E4598D6D0CF",
            "Balance": "396015176",
            "Sequence": 376
          },
          "PreviousTxnID": "E710CADE7FE9C26C51E8630138322D80926BE91E46D69BF2F36E6E4598D6D0CF",
          "PreviousTxnLgrSeq": 46447387
        }
      }
    ],
    "TransactionIndex": 13,
    "TransactionResult": "tesSUCCESS"
  },
  "validated": true
}
```

The _only_ changes made by this [no-op transaction](cancel-or-skip-a-transaction.html) are to update the [AccountRoot object][] representing the sender's account in the following ways:

- The `Sequence` value increases from 376 to 377.

- The XRP `Balance` in this account changes from `396015176` to `396015164` [drops of XRP](basic-data-types.html#xrp). This decrease of exactly 12 drops represents the [transaction cost](transaction-cost.html), as specified in the `Fee` field of the transaction.

- The [`AccountTxnID`](transaction-common-fields.html#accounttxnid) changes to reflect that this transaction is now the one most recently sent from this address.

- The previous transaction to affect this account was the transaction `E710CADE7FE9C26C51E8630138322D80926BE91E46D69BF2F36E6E4598D6D0CF`, which executed in ledger version 46447387, as specified in the `PreviousTxnID` and `PreviousTxnLgrSeq` fields. (This may be useful if you want to walk backwards through the account's transaction history.)

    **Note:** Although the metadata does not explicitly show it, any time a transaction modifies a ledger object, it updates that object's `PreviousTxnID` and `PreviousTxnLgrSeq` fields with the current transaction's information. If the same sender has multiple transactions in a single ledger version, each one after the first provides a `PreviousTxnLgrSeq` whose value is the [ledger index](basic-data-types.html#ledger-index) of the ledger version that included all those transactions.

Since the `ModifiedNode` entry for rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn's account is the only object in the `AffectedNodes` array, no other changes were made to the ledger as a result of this transaction.

**Tip:** If the transaction sends or receives XRP, the sender's balance changes are combined with the transaction cost, resulting in a single change to the `Balance` field in the net amount. For example, if you sent 1 XRP (1,000,000 drops) and destroyed 10 drops for the transaction cost, the metadata shows your `Balance` decreasing by 1,000,010 drops of XRP.

### General-Purpose Bookkeeping

Almost any transaction can result in the following types of changes:

- **Sequence and Transaction Cost changes:** [As mentioned, every transaction (excluding pseudo-transactions) modifies the sender's `AccountRoot` object](#2-interpret-metadata) to increase the sender's sequence number and destroy the XRP used to pay the transaction cost.
- **Account Threading:** Some transactions that create objects also modify the [AccountRoot object](accountroot.html) of an intended recipient or destination account to indicate that something relating to that account changed. This technique of "tagging" an account changes only that object's `PreviousTxnID` and `PreviousTxnLgrSeq` fields. This makes it more efficient to look up an account's transaction history of an account by following the "thread" of transactions mentioned in these fields.
- **Directory Updates:** Transactions that create or remove ledger objects often make changes to [DirectoryNode objects](directorynode.html) to track which objects exist. Also, when a transaction adds an object that counts towards an account's [owner reserve](reserves.html#owner-reserves), it increases the `OwnerCount` of the owner's [AccountRoot object][]. Removing an object decreases the `OwnerCount`. This is how the XRP Ledger tracks how much owner reserve each account owes at any point in time.

Example of increasing an Account's `OwnerCount`:

```json
{
  "ModifiedNode": {
    "FinalFields": {
      "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "Balance": "9999999990",
      "Flags": 0,
      "OwnerCount": 1,
      "Sequence": 2
    },
    "LedgerEntryType": "AccountRoot",
    "LedgerIndex": "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05",
    "PreviousFields": {
      "Balance": "10000000000",
      "OwnerCount": 0,
      "Sequence": 1
    },
    "PreviousTxnID": "B24159F8552C355D35E43623F0E5AD965ADBF034D482421529E2703904E1EC09",
    "PreviousTxnLgrSeq": 16154
  }
}
```

Many transaction types create or modify [DirectoryNode objects](directorynode.html). These objects are for bookkeeping: tracking all objects owned by an account, or all Offers to exchange currency at the same exchange rate. If the transaction created new objects in the ledger, it may need to add entries to an existing DirectoryNode object, or add another DirectoryNode object to represent another page of the directory. If the transaction removed objects from the ledger, it may delete one or more DirectoryNode objects that are no longer needed.

Example of a CreatedNode representing a new Offer Directory:

```json
{
  "CreatedNode": {
    "LedgerEntryType": "DirectoryNode",
    "LedgerIndex": "F60ADF645E78B69857D2E4AEC8B7742FEABC8431BD8611D099B428C3E816DF93",
    "NewFields": {
      "ExchangeRate": "4E11C37937E08000",
      "RootIndex": "F60ADF645E78B69857D2E4AEC8B7742FEABC8431BD8611D099B428C3E816DF93",
      "TakerPaysCurrency": "0000000000000000000000004254430000000000",
      "TakerPaysIssuer": "5E7B112523F68D2F5E879DB4EAC51C6698A69304"
    }
  }
},
```

Other things to look for when processing transaction metadata depend on the transaction type.

### Payments

A [Payment transaction][] can represent a direct XRP-to-XRP transaction, a [cross-currency payment](cross-currency-payments.html), or a direct transaction in an [issued (non-XRP) currency](issued-currencies.html). Anything other than a direct XRP-to-XRP transaction can be a [partial payment](partial-payments.html), including issued currency to XRP or XRP to issued currency transactions.

XRP amounts are tracked in the `Balance` field of `AccountRoot` objects. (XRP can also exist in [Escrow objects](escrow-object.html) and [PayChannel objects](paychannel.html), but Payment transactions cannot affect those.)

You should always use [the delivered_amount field](partial-payments.html#the-delivered_amount-field) to see how much a payment delivered.

If the payment contains a `CreatedNode` of LedgerEntryType `AccountRoot`, that means the payment [funded a new account](accounts.html#creating-accounts) in the ledger.

#### Issued Currency Payments

Payments involving issued currencies are a bit more complicated.

All changes in issued currency balances are reflected in [RippleState objects](ripplestate.html), which represent [trust lines](trust-lines-and-issuing.html). An increase to one party's balance on a trust line is considered to decrease the counterparty's balance by equal amount; in the metadata, this is only recorded as a single change to the shared `Balance` for the RippleState object. Whether this change is recorded as an "increase" or "decrease" depends on which account has the numerically higher address.

A single payment may go across a long [path](paths.html) consisting of several trust lines and order books. The process of changing the balances on several trust lines to connect parties indirectly is called [rippling](rippling.html). Depending on the `issuer` specified in the transaction's `Amount` field, it is also possible that the amount delivered may be split between several trust lines (`RippleState` accounts) connected to the destination account.

**Tip:** The order that modified objects are presented in the metadata does not necessarily match the order those objects were visited while processing a payment. To better understand payment execution, it may help to reorder `AffectedNodes` members to reconstruct the paths the funds took through the ledger.

Cross-currency payments consume [Offers](offer.html) in part or entirely to change between currencies with different currency codes and issuers. If a transaction shows `DeletedNode` objects for `Offer` types, that can indicate an Offer that was fully consumed, or an Offer that was found to be [expired or unfunded](offers.html#lifecycle-of-an-offer) at the time of processing. If a transaction shows a `ModifiedNode` of type `Offer`, that indicates an Offer that was partially consumed.

The [`QualityIn` and `QualityOut` settings of trust lines](trustset.html) can affect how one side of a trust line values the issued currency, so that the numeric change in balances is different from how the sender values that currency. The `delivered_amount` shows how much was delivered as valued by the recipient.

If the amount to be sent or received is outside of the [issued currency precision](currency-formats.html#issued-currency-precision), it is possible that one side may be debited for an amount that is rounded to nothing on the other side of the transaction. Therefore, when two parties transact while their balances are different by a factor of 10<sup>16</sup>, it is possible that rounding may effectively "create" or "destroy" small amounts of the issued currency. (XRP is never rounded, so this is not possible with XRP.)

Depending on the length of the [paths](paths.html), the metadata for cross-currency payments can be _long_. For example, [transaction 8C55AFC2A2AA42B5CE624AEECDB3ACFDD1E5379D4E5BF74A8460C5E97EF8706B](https://xrpcharts.ripple.com/#/transactions/8C55AFC2A2AA42B5CE624AEECDB3ACFDD1E5379D4E5BF74A8460C5E97EF8706B) delivered 2.788 GCB issued by rHaaans..., spending XRP but passing through USD from 2 issuers, paying XRP to 2 accounts, removing an unfunded offer from r9ZoLsJ to trade EUR for ETH, plus bookkeeping for a total of 17 different ledger objects modified.

### Offers

An [OfferCreate transaction][] may or may not create an object in the ledger, depending on how much was matched and whether the transaction used flags such as `tfImmediateOrCancel`. Look for a `CreatedNode` entry with LedgerEntryType `Offer` to see if the transaction added a new Offer to the ledger's order books. For example:

```json
{
  "CreatedNode": {
    "LedgerEntryType": "Offer",
    "LedgerIndex": "F39B13FA15AD2A345A9613934AB3B5D94828D6457CCBB51E3135B6C44AE4BC83",
    "NewFields": {
      "Account": "rETSmijMPXT9fnDbLADZnecxgkoJJ6iKUA",
      "BookDirectory": "CA462483C85A90DB76D8903681442394D8A5E2D0FFAC259C5B0C59269BFDDB2E",
      "Expiration": 608427156,
      "Sequence": 1082535,
      "TakerGets": {
        "currency": "EUR",
        "issuer": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
        "value": "2157.825"
      },
      "TakerPays": "7500000000"
    }
  }
}
```

A `ModifiedNode` of type `Offer` indicates an Offer that was matched and partially consumed. A single transaction can consume a large number of Offers. An Offer to trade two issued currencies might also consume Offers to trade XRP because of [auto-bridging](autobridging.html). All or part of an exchange can be auto-bridged.

A `DeletedNode` of LedgerEntryType `Offer` can indicate a matching Offer that was fully consumed, an Offer that was found to be [expired or unfunded](offers.html#lifecycle-of-an-offer) at the time of processing, or an Offer that was canceled as part of placing a new Offer. You can recognize a canceled Offer because the `Account` that placed it is the sender of the transaction that deleted it.

Example of a deleted Offer:

```json
{
  "DeletedNode": {
    "FinalFields": {
      "Account": "rETSmijMPXT9fnDbLADZnecxgkoJJ6iKUA",
      "BookDirectory": "CA462483C85A90DB76D8903681442394D8A5E2D0FFAC259C5B0C595EDE3E1EE9",
      "BookNode": "0000000000000000",
      "Expiration": 608427144,
      "Flags": 0,
      "OwnerNode": "0000000000000000",
      "PreviousTxnID": "0CA50181C1C2A4D45E9745F69B33FA0D34E60D4636562B9D9CDA1D4E2EFD1823",
      "PreviousTxnLgrSeq": 46493676,
      "Sequence": 1082533,
      "TakerGets": {
        "currency": "EUR",
        "issuer": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
        "value": "2157.675"
      },
      "TakerPays": "7500000000"
    },
    "LedgerEntryType": "Offer",
    "LedgerIndex": "9DC99BF87F22FB957C86EE6D48407201C87FBE623B2F1BC4B950F83752B55E27"
  }
}
```

Offers can create, delete, and modify both types of [DirectoryNode objects](directorynode.html), to keep track of who placed which Offers and which Offers are available at which exchange rates. Generally, users don't need to pay close attention to this bookkeeping.

An [OfferCancel transaction][] may have the code `tesSUCCESS` even if there was no Offer to delete. Look for a `DeletedNode` of LedgerEntryType `Offer` to confirm that the transaction actually deleted an Offer. If not, the Offer may already have been removed by a previous transaction, or the OfferCancel transaction may have used the wrong sequence number in the `OfferSequence` field.

If an OfferCreate transaction shows a `CreatedNode` of type `RippleState`, that indicates that [the Offer created a trust line](offers.html#offers-and-trust) to hold an issued currency received in the trade.

### Escrows

A successful [EscrowCreate transaction][] creates an [Escrow object](escrow-object.html) in the ledger. Look for a `CreatedNode` entry of LedgerEntryType `Escrow`. The `NewFields` should show an `Amount` equal to the amount of XRP escrowed, and other properties as specified.

A successful EscrowCreate transaction also debits the same amount of XRP from the sender. Look for a `ModifiedNode` of LedgerEntryType `AccountRoot`, where the `Account` in the final fields matches the address from the `Account` in the transaction instructions. The `Balance` should show the decrease in XRP due to the escrowed XRP (in addition to the XRP destroyed to pay the transaction cost).

A successful [EscrowFinish transaction][] modifies the `AccountRoot` of the recipient to increase their XRP balance (in the `Balance` field), deletes the `Escrow` object, and reduces the owner count of the escrow creator. Since the escrow's creator, recipient, and finisher may all be different accounts or the same, this can result in _one to three_ `ModifiedNode` objects of LedgerEntryType `AccountRoot`. A successful [EscrowCancel transaction][] is very similar, except it sends the XRP back to the original creator of the escrow.

Of course, an EscrowFinish can only be successful if it meets the conditions of the escrow, and an EscrowCancel can only be successful if the expiration of the Escrow object is before the close time of the previous ledger.

Escrow transactions also do normal [bookkeeping](#general-purpose-bookkeeping) for adjusting the sender's owner reserve and the directories of the accounts involved.

In the following excerpt, we see that r9UUEX...'s balance increases by 1 billion XRP and its owner count decreases by 1 because an escrow from that account to itself finished successfully. The `Sequence` number does not change because [a third party completed the escrow](https://xrpcharts.ripple.com/#/transactions/C4FE7F5643E20E7C761D92A1B8C98320614DD8B8CD8A04CFD990EBC5A39DDEA2):

```json
{
  "ModifiedNode": {
    "FinalFields": {
      "Account": "r9UUEXn3cx2seufBkDa8F86usfjWM6HiYp",
      "Balance": "1650000199898000",
      "Flags": 1048576,
      "OwnerCount": 11,
      "Sequence": 23
    },
    "LedgerEntryType": "AccountRoot",
    "LedgerIndex": "13FDBC39E87D9B02F50940F9FDDDBFF825050B05BE7BE09C98FB05E49DD53FCA",
    "PreviousFields": {
      "Balance": "650000199898000",
      "OwnerCount": 12
    },
    "PreviousTxnID": "D853342BC27D8F548CE4D7CB688A8FECE3229177790453BA80BC79DE9AAC3316",
    "PreviousTxnLgrSeq": 41005507
  }
},
{
  "DeletedNode": {
    "FinalFields": {
      "Account": "r9UUEXn3cx2seufBkDa8F86usfjWM6HiYp",
      "Amount": "1000000000000000",
      "Destination": "r9UUEXn3cx2seufBkDa8F86usfjWM6HiYp",
      "FinishAfter": 589075200,
      "Flags": 0,
      "OwnerNode": "0000000000000000",
      "PreviousTxnID": "D5FB1C7D18F931A4FBFA468606220560C17ADF6DE230DA549F4BD11A81F19DFC",
      "PreviousTxnLgrSeq": 35059548
    },
    "LedgerEntryType": "Escrow",
    "LedgerIndex": "62F0ABB58C874A443F01CDCCA18B12E6DA69C254D3FB17A8B71CD8C6C68DB74D"
  }
},
```

### Payment Channels

Look for a `CreatedNode` of LedgerEntryType `PayChannel` when creating a payment channel. You should also find a `ModifiedNode` of LedgerEntryType `AccountRoot` showing the decrease in the sender's balance. Look for an `Account` field in the `FinalFields` to confirm that the address matches the sender, and look at the difference in the `Balance` fields to see the change in XRP balance.

If the [fixPayChanRecipientOwnerDir amendment](known-amendments.html#fixpaychanrecipientownerdir) :not_enabled: is enabled, the metadata should also change the destination account's [owner directory](directorynode.html) to list the newly-created payment channel. This prevents an account from [being deleted](accounts.html#deletion-of-accounts) if it is the receiver of an open payment channel. (If the payment channel was created before the fixPayChanRecipientOwnerDir amendment became enabled, the account can be deleted.)

There are several ways to request to close a payment channel, aside from the immutable `CancelAfter` time of the channel (which is only set on creation). If a transaction schedules a channel to close, there is  a `ModifiedNode` entry of LedgerEntryType `PayChannel` for the channel, with the newly-added close time in the `Expiration` field of the `FinalFields`. The following example shows the changes to a `PayChannel` in a case where the sender requested to close the channel without redeeming a claim:

```json
{
  "ModifiedNode": {
    "FinalFields": {
      "Account": "rNn78XpaTXpgLPGNcLwAmrcS8FifRWMWB6",
      "Amount": "1000000",
      "Balance": "0",
      "Destination": "rwWfYsWiKRhYSkLtm3Aad48MMqotjPkU1F",
      "Expiration": 608432060,
      "Flags": 0,
      "OwnerNode": "0000000000000002",
      "PublicKey": "EDEACA57575C6824FC844B1DB4BF4AF2B01F3602F6A9AD9CFB8A3E47E2FD23683B",
      "SettleDelay": 3600,
      "SourceTag": 1613739140
    },
    "LedgerEntryType": "PayChannel",
    "LedgerIndex": "DC99821FAF6345A4A6C41D5BEE402A7EA9198550F08D59512A69BFC069DC9778",
    "PreviousFields": {},
    "PreviousTxnID": "A9D6469F3CB233795B330CC8A73D08C44B4723EFEE11426FEE8E7CECC611E18E",
    "PreviousTxnLgrSeq": 41889092
  }
}
```

### TrustSet Transactions

TrustSet transactions create, modify, or delete [trust lines](trust-lines-and-issuing.html), which are represented as [`RippleState` objects](ripplestate.html). A single `RippleState` object contains settings for both parties involved, including their limits, [rippling settings](rippling.html), and more. Creating and modifying trust lines can also [adjust the sender's owner reserve and owner directory](#general-purpose-bookkeeping).

The following example shows a new trust line, where **rf1BiG...** is willing to hold up to 110 USD issued by **rsA2Lp...**:

```json
 {
  "CreatedNode": {
    "LedgerEntryType": "RippleState",
    "LedgerIndex": "9CA88CDEDFF9252B3DE183CE35B038F57282BC9503CDFA1923EF9A95DF0D6F7B",
    "NewFields": {
      "Balance": {
        "currency": "USD",
        "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
        "value": "0"
      },
      "Flags": 131072,
      "HighLimit": {
        "currency": "USD",
        "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "value": "110"
      },
      "LowLimit": {
        "currency": "USD",
        "issuer": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
        "value": "0"
      }
    }
  }
}
```


### Other Transactions

Most other transactions create a specific type of ledger entry and [adjust the sender's owner reserve and owner directory](#general-purpose-bookkeeping):

- [AccountSet transactions][] modify the sender's existing [AccountRoot object][], changing the settings and flags as specified.
- [DepositPreauth transactions][] add or remove a [DepositPreauth object](depositpreauth-object.html) for a specific sender.
- [SetRegularKey transactions][] modify the [AccountRoot object][] of the sender, changing the `RegularKey` field as specified.
- [SignerListSet transactions][] add, remove, or replace a [SignerList object](signerlist.html).

### Pseudo-Transactions

[Pseudo-transactions](pseudo-transaction-types.html) also have metadata, but they do not follow all the rules of normal transactions. They are not tied to a real account (the `Account` value is just the [base58-encoded form of the number 0](accounts.html#special-addresses)), so they do not modify an AccountRoot object in the ledger to increase the `Sequence` number or destroy XRP. Pseudo-transactions only make specific changes to special ledger objects:

- [EnableAmendment pseudo-transactions][] modify the [Amendments ledger object](amendments-object.html) to track which amendments are enabled, and which ones are pending with majority support and for how long.
- [SetFee pseudo-transactions][] modify the [FeeSettings ledger object](feesettings.html) to change the base levels for the [transaction cost](transaction-cost.html) and [reserve requirements](reserves.html).

## See Also

- **Concepts:**
    - [Finality of Results](finality-of-results.html) - How to know when a transaction's success or failure is final. (Short version: if a transaction is in a validated ledger, its outcome and metadata are final.)
- **Tutorials:**
    - [Reliable Transaction Submission](reliable-transaction-submission.html)
    - [Monitor Incoming Payments with WebSocket](monitor-incoming-payments-with-websocket.html)
- **References:**
    - [Ledger Object Types Reference](ledger-object-types.html) - All possible fields of all types of ledger objects
    - [Transaction Metadata](transaction-metadata.html) - Summary of the metadata format and fields that appear in metadata
    - [Transaction Results](transaction-results.html) - Tables of all possible result codes for transactions.


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
