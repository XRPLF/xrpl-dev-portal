---
date: 2015-02-19
category: 2015
labels:
    - Development
    - Features
theme:
    markdown:
        editPage:
            hide: true
---
# Calculating Balance Changes for a Transaction

## Introduction

When interacting with Transactions on the Ripple Network you often care about the changes that have been made to a specific account. For example, if you make a payment, you want to know by how much the balance on your account has been decreased. Parsing out the exact balance changes from a transaction can often be complicated and we’ve spend a lot of time to provide a simple method for getting accurate information. In an effort to standardize the way we deal with balance changes and make sure we have one place that captures our efforts, we released a module, called [ripple-lib-transactionparser](https://www.npmjs.com/package/ripple-lib-transactionparser). We’ve made the module available on npm and you can find the source on our [github](https://github.com/ripple/ripple-lib-extensions/tree/master/transactionparser)

In this post we want to provide some background on why parsing balance changes is hard and give details on how a transaction’s meta should be interpreted.

### Table of Contents

- **[Installation Instructions](#installation-instructions)**
- **[Why is parsing transactions hard?](#why-is-parsing-transactions-hard)**
- **[The solution](#the-solution)**
- **[Counterparty vs Issuer](#counterparty-vs-issuer)**
- **[Additonal notes on meta](#additional-notes-on-meta)**

## Installation Instructions

To install this package in your Node project, run:

    npm install ripple-lib-transactionparser

Given a `transactionResponse`, which is a return for a transaction submission or transaction lookup, you can use it as follows:

        var parseBalanceChanges = require(‘ripple-lib-transactionparser’).parseBalanceChanges;
        …
        var balanceChanges = parseBalanceChanges(transactionResponse.meta);

## Why is parsing Transactions hard?

Each host on the Ripple Network runs a program called [rippled](https://github.com/ripple/rippled) that is responsible for maintaining the Ripple ledger and reaching consensus. The rippled application is written in C++ and it’s interface is geared more for machine consumption than human consumption, so it doesn’t directly tell you higher-level information like what balances were affected by a specific transaction. Instead, it provides some `meta` about how various nodes changed in the ledger, which can be used to compute balance changes for transactions that affect balances.

Extracting the balance changes from a transaction’s meta isn’t straightforward. Objects in the AffectedNodes array describe the changes to nodes in the ledger, but how a balance or a affected account has changed requires some parsing of the given meta.

### Transaction meta

Below is an example of what the relevant transaction meta that comes from rippled looks like

    {
      "AffectedNodes": [
        {
          "ModifiedNode": {
            "FinalFields": {
              "Balance": {
                "currency": "USD",
                "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                "value": "1.525330905250352"
              },
              "Flags": 1114112,
              "HighLimit": {
                "currency": "USD",
                "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
                "value": "0"
              },
              "HighNode": "00000000000001E8",
              "LowLimit": {
                "currency": "USD",
                "issuer": "rKmBGxocj9Abgy25J51Mk1iqFzW9aVF9Tc",
                "value": "1000000000"
              },
              "LowNode": "0000000000000000"
            },
            "LedgerEntryType": "RippleState",
            "LedgerIndex": "2F323020B4288ACD4066CC64C89DAD2E4D5DFC2D44571942A51C005BF79D6E25",
            "PreviousFields": {
              "Balance": {
                "currency": "USD",
                "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                "value": "1.535330905250352"
              }
            },
            "PreviousTxnID": "DC061E6F47B1B6E9A496A31B1AF87194B4CB24B2EBF8A59F35E31E12509238BD",
            "PreviousTxnLgrSeq": 10459364
          }
        },
        {
          "ModifiedNode": {
            "FinalFields": {
              "Balance": {
                "currency": "USD",
                "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                "value": "0.02"
              },
              "Flags": 1114112,
              "HighLimit": {
                "currency": "USD",
                "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
                "value": "0"
              },
              "HighNode": "00000000000001E8",
              "LowLimit": {
                "currency": "USD",
                "issuer": "rLDYrujdKUfVx28T9vRDAbyJ7G2WVXKo4K",
                "value": "1000000000"
              },
              "LowNode": "0000000000000000"
            },
            "LedgerEntryType": "RippleState",
            "LedgerIndex": "AAE13AF5192EFBFD49A8EEE5869595563FEB73228C0B38FED9CC3D20EE74F399",
            "PreviousFields": {
              "Balance": {
                "currency": "USD",
                "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                "value": "0.01"
              }
            },
            "PreviousTxnID": "DC061E6F47B1B6E9A496A31B1AF87194B4CB24B2EBF8A59F35E31E12509238BD",
            "PreviousTxnLgrSeq": 10459364
          }
        },
        {
          "ModifiedNode": {
            "FinalFields": {
              "Account": "rKmBGxocj9Abgy25J51Mk1iqFzW9aVF9Tc",
              "Balance": "239555992",
              "Flags": 0,
              "OwnerCount": 1,
              "Sequence": 38
            },
            "LedgerEntryType": "AccountRoot",
            "LedgerIndex": "E9A39B0BA8703D5FFD05D9EAD01EE6C0E7A15CF33C2C6B7269107BD2BD535818",
            "PreviousFields": {
              "Balance": "239567992",
              "Sequence": 37
            },
            "PreviousTxnID": "DC061E6F47B1B6E9A496A31B1AF87194B4CB24B2EBF8A59F35E31E12509238BD",
            "PreviousTxnLgrSeq": 10459364
          }
        }
      ],
      "TransactionIndex": 2,
      "TransactionResult": "tesSUCCESS"
    }

The meta above doesn’t make it obvious what the changes are to which accounts without first understanding what `HighNode`, `LowNode`, `...Limit` and the various other fields mean.

## The solution

We wrote the `ripple-lib-transactionparser` module to capture the logic needed to parse transaction meta like the above. We spent a lot of time discussing various edge cases and how to correctly parse the balance changes most intuitively. Using the `ripple-lib-transactionparser` the above meta will result in the following balance changes:

    {
      rKmBGxocj9Abgy25J51Mk1iqFzW9aVF9Tc: [
        {
          value: '-0.01',
          currency: 'USD',
          counterparty: 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q'
        },
        {
          value: '-0.012',
          currency: 'XRP',
          counterparty: ''
        }
      ],
      rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q: [
        {
          counterparty: 'rKmBGxocj9Abgy25J51Mk1iqFzW9aVF9Tc',
          currency: 'USD',
          value: '0.01'
        },
        {
          counterparty: 'rLDYrujdKUfVx28T9vRDAbyJ7G2WVXKo4K',
          currency: 'USD',
          value: '-0.01'
        }
      ],
      rLDYrujdKUfVx28T9vRDAbyJ7G2WVXKo4K: [
        {
          counterparty: 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q',
          currency: 'USD',
          value: '0.01'
        }
      ]
    }

The keys in the balance changes object (rLDY…) are the affected addresses and the values (in square brackets) are arrays of balance changes that happened on that address. Each balance change is specified with a counterparty, currency, and value, where `counterparty` refers to the address on the opposite end of the trustline. If you’re not a gateway, then the counterparty is typically the issuer of the currency (for a more detailed explanation see the section [Counterparty vs Issuer](#counterparty-vs-issuer) below).

Let’s look at how these balance changes are computed from the meta. The meta contains an array of AffectedNodes, where each AffectedNode object contains a CreatedNode, ModifiedNode, or DeletedNode, which each correspond to a change in the ledger. The JSON is structured this way, rather than just an array of nodes with the type as a property, so that the node objects can map directly to the corresponding C++ classes. Each node has a LedgerEntryType and there are two types that can indicate a balance change: AccountRoot - holds an account’s XRP balance, last transaction sequence number, and related information RippleState - tracks credit between two accounts and associated properties (corresponds to a trustline) So AccountRoot nodes appear when XRP balances change and RippleState nodes appear when trustline balances change.

Calculating XRP balance changes from AccountRoot nodes is straightforward; subtract the balance in the FinalFields from the balance in the PreviousFields and convert from drops to XRP (all XRP balances from rippled are specified in drops, where one XRP is equivalent to one million drops). If a new account is created, a CreatedNode will be found instead of a ModifiedNode, in which case PreviousFields won’t exist and FinalFields will be replaced with NewFields. DeletedNodes still have FinalFields and PreviousFields, just like ModifiedNodes.

Calculating the balance changes for a trustline is similar, but with an additional complication: the sign of the balances are oriented with respect to the `low node`, which is the node with the lower address of the two on the trustline (the address is treated as a numerical value, so for example `rKm…` is lower than `rMw…` since `K` comes before `M` in the [base58 dictionary](https://xrpl.org/base58-encodings.html)). This convention was established in rippled so that the hash of a trustline between A and B is the same as the hash of a trustline between B and A. Therefore, the balance is negated when generating the balance change for the high address. Two balance changes are created for each trustline balance change, one from the perspective of each address on the trustline, which are extracted from the HighLimit and LowLimit objects.

## Counterparty vs. Issuer

Through the Ripple products we sometimes use the concept of `issuer` instead of `counterparty`. Ripple-REST for example has been using the term `issuer` and it shows up throughout our documentation. The `issuer` is the party on a trustline that owes the other party, so the party on a trustline that has credited the party. The `counterparty` is the party on the other side of the trustline from the perspective of a given party, regardless of who owes who. For calculating balance changes, `counterparty` is more useful. If we were to use `issuer`, gateways would not be able to see balance changes that shift money between their trustlines because both changes would have the same issuer and would cancel out. A gateway may want to monitor such changes in order to mirror balances to an off-ledger accounting system.

It might seem like you would need the concept of `issuer` in order to keep track of who issued your USD because only the issuer will redeem it. But any USD that you have on a trustline with a gateway is automatically issued by that gateway. There’s no way to take USD from gateway A and move it to a trustline with gateway B because that would require increasing your balance with gateway B, which is something that only gateway B is allowed to do. If Alice sends SnapSwap-USD to Bob, it moves from Alice’s trustline with SnapSwap to Bob’s trustline with SnapSwap; SnapSwap-USDs never leave SnapSwap’s trustlines. Actually even calling them SnapSwap-USDs makes it sound like the currency itself is tied to SnapSwap, but the currency format doesn’t specify any address for the issuer, so SnapSwap-USDs are really just USDs on a SnapSwap trustline.

## Additional Notes on meta

### LowNode and HighNode

The LowNode and HighNode fields may be confusing. They are hints to make node deletion happen in constant time in rippled and should always be ignored outside of rippled. More precisely, LowNode is the integer number of the page in the low account's owner directory that contains the reference to the trust line.

### ACCOUNT\_ONE

The issuer listed in the balance fields is `rrrrrrrrrrrrrrrrrrrrBZbvji`, which is referred to as [ACCOUNT\_ONE](https://xrpl.org/accounts.html#special-addresses) and is the encoding that corresponds to the numerical value 1. This convention is used because the addresses on the trustline are already specified in the HighLimit and LowLimit objects, so specifying them here would be redundant.

## Conclusion

Parsing balance changes from a transaction is hard, so we made a module that makes it easy. Find it on NPM: <https://www.npmjs.com/package/ripple-lib-transactionparser> And here's the github: <https://github.com/ripple/ripple-lib-extensions/tree/master/transactionparser> For any issues or questions, please use the github issues page.
