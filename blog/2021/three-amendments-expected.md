---
category: 2021
theme:
    markdown:
        editPage:
            hide: true
date: 2021-03-30
labels:
    - Amendments
---
# Three Amendments Expected on 2021-04-08

Two bug-fixing amendments to the XRP Ledger protocol and one amendment that improves robustness of consensus, all introduced in [`rippled` v1.6.0](https://github.com/ripple/rippled/releases/tag/1.6.0), have gained support from a majority of trusted validators: [fix1781](https://livenet.xrpl.org/transactions/777AF3E5F557972734AE43C71E092782DDEC6F730A729BE3A74C2007F4EACC55), [fixAmendmentMajorityCalc](https://livenet.xrpl.org/transactions/29D7B3317C5662086791A0C21FB0FB9261DC7A6537D8E4117D925029EEF57BB3), and [HardenedValidations](https://livenet.xrpl.org/transactions/DCB78BB19FD379918A52F68C4B4BA98C5A8F98A15153876AC3458B4613A7CB9E). Currently, they are expected to become enabled on 2021-04-08. Any of these amendments that continue to have the continuous support of at least 80% of trusted validators will become enabled on the scheduled date.

Server operators should be sure to upgrade `rippled` before this date.

<!-- BREAK -->

## Action Required

- If you operate a `rippled` server, you must upgrade to version 1.6.0 or higher by 2021-04-08, for service continuity. [Version 1.7.0](https://xrpl.org/blog/2021/rippled-1.7.0.html) is recommended.

- If you have code that submits XRP Ledger payments, make sure your code correctly handles the [`temBAD_PATH_LOOP` error code](https://xrpl.org/tem-codes.html). As a `tem` code, this error only occurs on transaction submission and does not appear in validated ledger data.

## Impact of Not Upgrading

If you operate a `rippled` server but don’t upgrade to version 1.6.0 (or higher) by 2021-04-08, when the amendments are expected to become enabled, then your server will become amendment blocked, meaning that your server:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments
* Could rely on potentially invalid data

If none of the amendments becomes enabled, then your server will not become amendment blocked and should continue to operate.

For instructions on upgrading `rippled` on supported platforms, see [Install `rippled`](https://xrpl.org/install-rippled.html).


## fix1781 Summary

Fixes a bug where certain XRP endpoints were not checked when detecting circular paths.

Without this amendment, it is possible to have a [payment path](https://xrpl.org/paths.html) where the input to the path is XRP, and an intermediate path step also outputs XRP. This is a "loop" payment, and the payment engine typically disallows such paths because they can have different results when executed forward compared to backwards.

With this amendment, those payments fail with the [`temBAD_PATH_LOOP` result code](https://xrpl.org/tem-codes.html) instead.

## fixAmendmentMajorityCalc Summary

Fixes a bug that could cause an amendment to achieve a majority and later activate with support of slightly less than 80% of trusted validators due to rounding semantics.

Without this amendment, the minimum threshold for amendment activation is any value that rounds to 204/256 of trusted validators, which depends on the number of trusted validators at the time. For example, an amendment could activate with exactly 28 out of 36 validators (approximately 77.8%). With this amendment, the actual minimum number of validators needed is never less than 80% of trusted validators.

## HardenedValidations Summary

Allows validators to include a new optional field in their validations to attest to the hash of
the latest ledger that the validator considers to be fully validated. The consensus process can use this information to increase the robustness of consensus.


## Learn, ask questions, and discuss

To receive email updates whenever there are important releases or changes to the XRP Ledger server software subscribe to the [ripple-server Google Group](https://groups.google.com/forum/#!forum/ripple-server).

Related documentation is available in the [XRP Ledger Dev Portal](https://xrpl.org/), including detailed example API calls and web tools for API testing.
