# Amendments

[Introduced in: rippled 0.31.0][New in: rippled 0.31.0]

The Amendments system provides a means of introducing new features to the decentralized XRP Ledger network without causing disruptions. The amendments system works by utilizing the core consensus process of the network to approve any changes by showing continuous support before those changes go into effect. An amendment normally requires **80% support for two weeks** before it can apply.

When an Amendment has been enabled, it applies permanently to all ledger versions after the one that included it. You cannot disable an Amendment, unless you introduce a new Amendment to do so.

For a complete list of known amendments, their statuses, and IDs, see: [Known Amendments](reference-amendments.html).

## Background

Any changes to transaction processing could cause servers to build a different ledger with the same set of transactions. If some _validators_ (`rippled` servers [participating in consensus](tutorial-rippled-setup.html#reasons-to-run-a-validator)) have upgraded to a new version of the software while other validators use the old version, this could cause anything from minor inconveniences to full outages. In the minor case, a minority of servers spend more time and bandwidth fetching the actual consensus ledger because they cannot build it using the transaction processing rules they already know. In the worst case, [the consensus process][] might be unable to validate new ledger versions because servers with different rules could not reach a consensus on the exact ledger to build.

Amendments solve this problem, so that new features can be enabled only when enough validators support those features.

Users and businesses who rely on the XRP Ledger can also use Amendments to provide advance notice of changes in transaction processing that might affect their business. However, API changes that do not impact transaction processing or [the consensus process][] do not need Amendments.

[the consensus process]: concept-consensus.html


## About Amendments

An amendment is a fully-functional feature or change, waiting to be enabled by the peer-to-peer network as a part of the consensus process. A `rippled` server that wants to use an amendment has code for two modes: without the amendment (old behavior) and with the amendment (new behavior).

Every amendment has a unique identifying hex value and a short name. The short name is for human use, and is not used in the amendment process. Two servers can support the same amendment ID while using different names to describe it. An amendment's name is not guaranteed to be unique.

By convention, Ripple's developers use the SHA-512Half hash of the amendment name as the amendment ID.


## Amendment Process

Every 256th ledger is called a "flag" ledger. The process of approving an amendment starts in the ledger version immediately before the flag ledger. When `rippled` validator servers send validation messages for that ledger, those servers also submit votes in favor of specific amendments. If a validator does not vote in favor of an amendment, that is the same as voting against the amendment. ([Fee Voting](concept-fee-voting.html) also occurs around flag ledgers.)

The flag ledger itself has no special contents. However, during that time, the servers look at the votes of the validators they trust, and decide whether to insert an [`EnableAmendment` pseudo-transaction](reference-transaction-format.html#enableamendment) into the following ledger. The flags of an EnableAmendment pseudo-transaction show what the server thinks happened:

* The `tfGotMajority` flag means that support for the amendment has increased to at least 80% of trusted validators.
* The `tfLostMajority` flag means that support for the amendment has decreased to less than 80% of trusted validators.
* An EnableAmendment pseudo-transaction with no flags means that support for the amendment has been enabled. (The change in transaction processing applies to every ledger after this one.)

A server only inserts the pseudo-transaction to enable an amendment if all of the following conditions are met:

* The amendment has not already been enabled.
* A previous ledger includes an EnableAmendment pseudo-transaction for this amendment with the `tfGotMajority` flag enabled.
* The previous ledger in question is an ancestor of the current ledger.
* The previous ledger in question has a close time that is at least **two weeks** before the close time of the latest flag ledger.
* There are no EnableAmendment pseudo-transactions for this amendment with the `tfLostMajority` flag enabled in the consensus ledgers between the `tfGotMajority` pseudo-transaction and the current ledger.

Theoretically, a `tfLostMajority` EnableAmendment pseudo-transaction could be included in the same ledger as the pseudo-transaction to enable an amendment. In this case, the pseudo-transaction with the `tfLostMajority` pseudo-transaction has no effect.

## Amendment Voting

Each version of `rippled` is compiled with a list of known amendments and the code to implement those amendments. By default, `rippled` supports known amendments and opposes unknown amendments. Operators of `rippled` validators can [configure their servers](#configuring-amendment-voting) to explicitly support or oppose certain amendments, even if those amendments are not known to their `rippled` versions.

To become enabled, an amendment must be supported by at least 80% of trusted validators continuously for two weeks. If support for an amendment goes below 80% of trusted validators, the amendment is temporarily rejected. The two week period starts over if the amendment regains support of at least 80% of trusted validators. (This can occur if validators vote differently, or if there is a change in which validators are trusted.) An amendment can gain and lose a majority any number of times before it becomes permanently enabled. An amendment cannot be permanently rejected, but it becomes very unlikely for an amendment to become enabled if new versions of `rippled` do not have the amendment in their known amendments list.

As with all aspects of the consensus process, amendment votes are only taken into account by servers that trust the validators sending those votes. At this time, Ripple (the company) recommends only trusting the default validators that Ripple operates. For now, trusting only those validators is enough to coordinate with Ripple on releasing new features.

### Configuring Amendment Voting

You can temporarily configure an amendment using the [`feature` command](reference-rippled.html#feature). To make a persistent change to your server's support for an amendment, change your server's `rippled.cfg` file.

Use the `[veto_amendments]` stanza to list amendments you do not want the server to vote for. Each line should contain one amendment's unique ID, optionally followed by the short name for the amendment. For example:

```
[veto_amendments]
C1B8D934087225F509BEB5A8EC24447854713EE447D277F69545ABFA0E0FD490 Tickets
DA1BD556B42D85EA9C84066D028D355B52416734D3283F85E216EA5DA6DB7E13 SusPay
```

Use the `[amendments]` stanza to list amendments you want to vote for. (Even if you do not list them here, by default a server votes for all the amendments it knows how to apply.) Each line should contain one amendment's unique ID, optionally followed by the short name for the amendment. For example:

```
[amendments]
4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373 MultiSign
42426C4D4F1009EE67080A9B7965B44656D7714D104A72F9B4369F97ABF044EE FeeEscalation
```


### Amendment Blocked

When an amendment gets enabled for the network after the voting process, servers running earlier versions of `rippled` that do not know about the amendment become "amendment blocked" because they no longer understand the rules of the network. Servers that are amendment blocked:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Do not participate in the consensus process
* Do not vote on future amendments

Becoming amendment blocked is a security feature to protect backend applications. Rather than guessing and maybe misinterpreting a ledger after new rules have been applied, `rippled` reports that it does not know the state of the ledger because it does not know how the amendment works.

The amendments that a `rippled` server is configured to vote for or against have no impact on whether the server becomes amendment blocked. A `rippled` server always follows the set of amendments enabled by the rest of the network, to the extent possible. A server only becomes amendment blocked if the enabled amendment is not included in the amendment definitions compiled into the server's source code -- in other words, if the amendment is newer than the server.

If your server is amendment blocked, you must [upgrade to a new version](tutorial-rippled-setup.html#updating-rippled) to sync with the network.


#### How to Tell If Your `rippled` Server is Amendment Blocked

***TODO: Question: Okay location for this doc? It is building upon a concept, but is tutorial-ish.***

One of the first signs that your `rippled` server is amendment blocked is that an `amendmentBlocked` error is returned when you submit a transaction. Here's an example `amendmentBlocked` error:

```
{
   "result":{
      "error":"amendmentBlocked",
      "error_code":14,
      "error_message":"Amendment blocked, need upgrade.",
      "request":{
         "command":"submit",
         "tx_blob":"479H0KQ4LUUXIHL48WCVN0C9VD7HWSX0MG1UPYNXK6PI9HLGBU2U10K3HPFJSROFEG5VD749WDPHWSHXXO72BOSY2G8TWUDOJNLRTR9LTT8PSOB9NNZ485EY2RD9D80FLDFRBVMP1RKMELILD7I922D6TBCAZK30CSV6KDEDUMYABE0XB9EH8C4LE98LMU91I9ZV2APETJD4AYFEN0VNMIT1XQ122Y2OOXO45GJ737HHM5XX88RY7CXHVWJ5JJ7NYW6T1EEBW9UE0NLB2497YBP9V1XVAEK8JJYVRVW0L03ZDXFY8BBHP6UBU7ZNR0JU9GJQPNHG0DK86S4LLYDN0BTCF4KWV2J4DEB6DAX4BDLNPT87MM75G70DFE9W0R6HRNWCH0X075WHAXPSH7S3CSNXPPA6PDO6UA1RCCZOVZ99H7968Q37HACMD8EZ8SU81V4KNRXM46N520S4FVZNSJHA"
      },
      "status":"error"
   }
}
```

***TODO: Is this a universal error? Should it be added here? https://ripple.com/build/rippled-apis/#universal-errors***

You can verify that your `rippled` server is amendment blocked using the [`server_info`](reference-rippled.html#server-info) command. In the response, look for `result.info.amendment_blocked`. If `amendment_blocked` is set to `true`, your server is amendment blocked. For example:

```
{
  "result": {
    "info": {
      "amendment_blocked": true,
      "build_version": "0.90.0-b2",
      "complete_ledgers": "6015234-6022198,6022744-6025498,6026905-6029106,6030549-6031191,6031472-6032443,6033090-6033095,6033339-6033537,6034791-6034950,6034980-6035798,6036466,6036516-6036703,6037478-6037671,6038085-6040415,6042691-6046229,6046413-6053861",
...
      "validation_quorum": 4,
      "validator_list_expires": "2018-Jan-24 00:00:00"
    },
    "status": "success"
  }
}
```

If your server is not amendment blocked, the `amendment_blocked` field is not returned in the response.

***TODO: Question: Update the `server_info` doc to include an `amendment_blocked` field descr? https://ripple.com/build/rippled-apis/#server-info. Does this amendment_blocked also display in `server_state`? https://ripple.com/build/rippled-apis/#server-state. If yes, also add descr there?***

To find out which amendments are blocking your `rippled` server, use the [`feature`](reference-rippled.html#feature) admin command and look for features (amendments) that have `"enabled" : true` and `"supported" : false`. These values for a feature mean that the amendment is currently enabled (required) in the latest ledger, but your server does not know how to apply the amendment. For example:

***TODO: Update `features` doc to talk about the implications of when `"enabled" : true` and `"supported" : false`. Useful? https://ripple.com/build/rippled-apis/#feature***

```
{
   "id":1,
   "result":{
      "features":{
         "B4D44CC3111ADD964E846FC57760C8B50FFCD5A82C86A72756F6B058DDDF96AD":{
            "enabled":true,
            "supported":false,
            "vetoed":false
         },
         "6C92211186613F9647A89DFFBAB8F94C99D4C7E956D495270789128569177DA1":{
            "enabled":true,
            "supported":false,
            "vetoed":false
         },
         "B9E739B8296B4A1BB29BE990B17D66E21B62A300A909F25AC55C22D6C72E1F9D":{
            "enabled":true,
            "supported":false,
            "vetoed":false
         },
         "1D3463A5891F9E589C5AE839FFAC4A917CE96197098A1EF22304E1BC5B98A454":{
            "enabled":true,
            "supported":false,
            "vetoed":false
         },
         "CC5ABAE4F3EC92E94A59B1908C2BE82D2228B6485C00AFF8F22DF930D89C194E":{
            "enabled":true,
            "supported":false,
            "vetoed":false
         },
...
         "08DE7D96082187F6E6578530258C77FAABABE4C20474BDB82F04B021F1A68647":{
            "enabled":false,
            "name":"PayChan",
            "supported":true,
            "vetoed":false
         }
      },
      "status":"success"
   }
}
```

In this example, conflicts with the following features are causing the `rippled` server to be amendment blocked:

* `B4D44CC3111ADD964E846FC57760C8B50FFCD5A82C86A72756F6B058DDDF96AD`

* `6C92211186613F9647A89DFFBAB8F94C99D4C7E956D495270789128569177DA1`

* `B9E739B8296B4A1BB29BE990B17D66E21B62A300A909F25AC55C22D6C72E1F9D`

* `1D3463A5891F9E589C5AE839FFAC4A917CE96197098A1EF22304E1BC5B98A454`

* `CC5ABAE4F3EC92E94A59B1908C2BE82D2228B6485C00AFF8F22DF930D89C194E`

***TODO: Still need to build out an explanation of how these features became the ones that are amendment blocking the server. Working on amendment blocking my rippled server.***

[Upgrade to a new `rippled` version](tutorial-rippled-setup.html#updating-rippled) to unblock your server and enable it to sync with the network again. ***TODO: Question: Do these instructions need a refresh? Need to take a look.***


## Testing Amendments

If you want to see how `rippled` behaves with an amendment enabled, before that amendment gets enabled on the production network, you can run use `rippled`'s configuration file to forcibly enable a feature. This is intended for development purposes only.

Because other members of the consensus network probably do not have the feature enabled, you should not use this feature while connecting to the production network. While testing with features forcibly enabled, you should run `rippled` in [Stand-Alone Mode](concept-stand-alone-mode.html).

To forcibly enable a feature, add a `[features]` stanza to your `rippled.cfg` file. In this stanza, add the short names of the features to enable, one per line. For example:

```
[features]
MultiSign
TrustSetAuth
```



{% include 'snippets/rippled_versions.md' %}
{% include 'snippets/tx-type-links.md' %}
