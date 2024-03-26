---
category: 2020
date: 2020-08-04
labels:
    - Amendments
theme:
    markdown:
        editPage:
            hide: true
---
# RequireFullyCanonicalSig, fixQualityUpperBound, and FlowCross are Now Available

[As previously announced](https://xrpl.org/blog/2020/requirefullycanonicalsig-expected.html), the **RequireFullyCanonicalSig** amendment [became enabled on the XRP Ledger](https://xrpcharts.ripple.com/#/transactions/94D8B158E948148B949CC3C35DD5DC4791D799E1FD5D3CE0E570160EDEF947D3) on 2020-07-03. Additionally, the **fixQualityUpperBound** amendment [became enabled](https://xrpcharts.ripple.com/#/transactions/5F8E9E9B175BB7B95F529BEFE3C84253E78DAF6076078EC450A480C861F6889E) on 2020-07-09 and the **FlowCross** amendment [became enabled](https://xrpcharts.ripple.com/#/transactions/44C4B040448D89B6C5A5DEC97C17FEDC2E590BA094BC7DB63B7FDC888B9ED78F) on 2020-08-04.

With these amendments enabled, **version 1.5.0 is the minimum** server version to remain synced to the XRP Ledger.

<!-- BREAK -->

## Action Required

- If you operate a `rippled` server, you should upgrade to version 1.5.0 (or higher) immediately.

    For instructions on upgrading `rippled` on supported platforms, see [Install `rippled`](https://xrpl.org/install-rippled.html).

    **Note:** As of 2020-08-04, [version 1.6.0 is in the release candidate process](https://github.com/ripple/rippled/commit/7b048b423e8ae08a54018a89231d050b9f562855), so the full 1.6.0 release is expected in the near future.

- If you use a custom or very old (pre-2014) tool for signing XRP Ledger transactions using secp256k1, check that your tool produces _fully canonical_ signatures. All valid Ed25519 signatures are fully canonical. If your tool produces secp256k1 signatures that are not fully canonical (see [Alternate secp256k1 signatures](https://xrpl.org/transaction-malleability.html#alternate-secp256k1-signatures) for details), you must update your tool to continue sending XRP Ledger transactions.

- If you trade in the XRP Ledger's decentralized exchange, the FlowCross amendment requires no further action at this time. There may be some differences in rounding when executing OfferCreate transactions compared to before the amendment, but the overall functionality of the decentralized exchange is unchanged and the actual currency value of any differences is expected to be very, very small.


## Impact of Not Upgrading

If you operate a `rippled` server on a version older than 1.5.0, then your server is now [amendment blocked](https://xrpl.org/amendments.html#amendment-blocked), meaning that your server:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments
* Could rely on potentially invalid data


## RequireFullyCanonicalSig Summary

Changes the signature requirements for the XRP Ledger protocol so that non-fully-canonical signatures are no longer valid in any case. This protects against [transaction malleability](https://xrpl.org/transaction-malleability.html) on _all_ transactions, instead of just transactions with the [tfFullyCanonicalSig flag](https://xrpl.org/transaction-common-fields.html#global-flags) enabled.

Without this amendment, a transaction is malleable if it uses a secp256k1 signature and does not have tfFullyCanonicalSig enabled. Most signing utilities enable tfFullyCanonicalSig by default, but there are exceptions.

With this amendment, no single-signed transactions are malleable. ([Multi-signed transactions may still be malleable](https://xrpl.org/transaction-malleability.html#malleability-with-multi-signatures) if signers provide more signatures than are necessary.) All transactions must use the fully canonical form of the signature, regardless of the tfFullyCanonicalSig flag. Signing utilities that do not create fully canonical signatures are not supported. All of Ripple's signing utilities have been providing fully-canonical signatures exclusively since at least 2014.

For more information, see [`rippled` issue #3042](https://github.com/ripple/rippled/issues/3042).


## fixQualityUpperBound Summary

Fixes a bug in unused code for estimating the ratio of input to output of individual steps in cross-currency payments.

Although this has no impact on current transaction processing, it [corrects a flaw in the flow cross engine](https://twitter.com/nbougalis/status/1273415169482223616). The fixQualityUpperBound was considered a prerequisite for the [FlowCross amendment](https://xrpl.org/known-amendments.html#flowcross) to be activated safely.


## FlowCross Summary

Originally [introduced in `rippled` v0.70.0, back in 2017](https://xrpl.org/blog/2017/rippled-0.70.0.html), the Flow amendment streamlines the offer crossing logic in the XRP Ledger's decentralized exchange. With FlowCross, [OfferCreate transactions](https://xrpl.org/offercreate.html) use the logic for Payment transactions, originally introduced by the [Flow](https://xrpl.org/known-amendments.html#flow) amendment. This has subtle differences in how offers are processed:

- Rounding is slightly different in some cases.
- Due to differences in rounding, some combinations of offers may be ranked higher or lower than by the old logic, and taken preferentially.
- The new logic may delete more or fewer offers than the old logic. (This includes cases caused by differences in rounding and offers that were incorrectly removed as unfunded by the old logic.)

## Learn, ask questions, and discuss

To receive email updates whenever there are important releases or changes to the XRP Ledger server software subscribe to the [ripple-server Google Group](https://groups.google.com/forum/#!forum/ripple-server).

Related documentation is available in the [XRP Ledger Dev Portal](https://xrpl.org/), including detailed example API calls and web tools for API testing.

Other resources:

* [XRPScan Amendments Dashboard](https://xrpscan.com/amendments)
* [Xpring Forum](https://forum.xpring.io/)
* [XRP Chat Forum](http://www.xrpchat.com/)
