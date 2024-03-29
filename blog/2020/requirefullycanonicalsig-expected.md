---
category: 2020
date: 2020-06-24
labels:
    - Amendments
theme:
    markdown:
        editPage:
            hide: true
---
# The RequireFullyCanonicalSig Amendment is Expected 2020-07-03

The RequireFullyCanonicalSig amendment to the XRP Ledger, introduced in [`rippled` v1.5.0](https://github.com/ripple/rippled/releases/tag/1.5.0), has [gained support from a majority of trusted validators](https://xrpcharts.ripple.com/#/transactions/4DF3E28D6920D917CE0A0A9E341BC5F792B3584E2DD5E679BD7679FE0875AEE6). Currently, it is expected to become enabled on 2020-07-03 (UTC). As long as the RequireFullyCanonicalSig amendment continues to have the support of at least 80% of trusted validators continuously, it will become enabled on the scheduled date.

<!-- BREAK -->

## RequireFullyCanonicalSig Summary

Changes the signature requirements for the XRP Ledger protocol so that non-fully-canonical signatures are no longer valid in any case. This protects against [transaction malleability](https://xrpl.org/transaction-malleability.html) on _all_ transactions, instead of just transactions with the [tfFullyCanonicalSig flag](https://xrpl.org/transaction-common-fields.html#global-flags) enabled.

Without this amendment, a transaction is malleable if it uses a secp256k1 signature and does not have tfFullyCanonicalSig enabled. Most signing utilities enable tfFullyCanonicalSig by default, but there are exceptions.

With this amendment, no single-signed transactions are malleable. ([Multi-signed transactions may still be malleable](https://xrpl.org/transaction-malleability.html#malleability-with-multi-signatures) if signers provide more signatures than are necessary.) All transactions must use the fully canonical form of the signature, regardless of the tfFullyCanonicalSig flag. Signing utilities that do not create fully canonical signatures are not supported. All of Ripple's signing utilities have been providing fully-canonical signatures exclusively since at least 2014.


## Action Required

- If you operate a `rippled` server, you must upgrade to version 1.5.0 (or higher) by 2020-07-03, for service continuity.

- If you use a custom or very old (pre-2014) tool for signing XRP Ledger transactions using secp256k1, check that your tool produces _fully canonical_ signatures. All valid Ed25519 signatures are fully canonical. If your tool produces secp256k1 signatures that are not fully canonical (see [Alternate secp256k1 signatures](https://xrpl.org/transaction-malleability.html#alternate-secp256k1-signatures) for details), you must update your tool to continue sending XRP Ledger transactions.

## Impact of Not Upgrading

If you operate a `rippled` server but don’t upgrade to version 1.5.0 (or higher) by 2020-07-03, when the RequireFullyCanonicalSig amendment is expected to become enabled, then your server will become amendment blocked, meaning that your server:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments
* Could rely on potentially invalid data

If the RequireFullyCanonicalSig amendment does not become enabled, then your server will not become amendment blocked and should continue to operate.

For instructions on upgrading `rippled` on supported platforms, see [Install `rippled`](https://xrpl.org/install-rippled.html).

## Learn, ask questions, and discuss

To receive email updates whenever there are important releases or changes to the XRP Ledger server software subscribe to the [ripple-server Google Group](https://groups.google.com/forum/#!forum/ripple-server).

Related documentation is available in the [XRP Ledger Dev Portal](https://xrpl.org/), including detailed example API calls and web tools for API testing.

Other resources:

* [XRPScan Amendments Dashboard](https://xrpscan.com/amendments)
* [Xpring Forum](https://forum.xpring.io/)
* [XRP Chat Forum](http://www.xrpchat.com/)
