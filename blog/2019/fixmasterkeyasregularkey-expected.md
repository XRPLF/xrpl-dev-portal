---
labels:
    - Amendments
date: "2019-09-18"
template: '../../@theme/templates/blogpost'
category: 2019
markdown:
    editPage:
        hide: true
---
# The fixMasterKeyAsRegularKey Amendment is Expected 2019-10-02

The fixMasterKeyAsRegularKey amendment to the XRP Ledger, introduced in [`rippled` v1.3.1](https://github.com/ripple/rippled/releases/tag/1.3.1), has [gained support from a majority of trusted validators](https://xrpcharts.ripple.com/#/transactions/EE38E5927605FAB1BD8CFE44C9BE5118B4FD558F846E3DA717C23DA2ADB65991). Currently, it is expected to become enabled on 2019-10-02. As long as the fixMasterKeyAsRegularKey amendment continues to have the support of at least 80% of trusted validators continuously, it will become enabled on the scheduled date.

## fixMasterKeyAsRegularKey Summary

Fixes a bug where accounts can set their regular key pair to match their master key pair, but cannot send transactions signed by the key if the master key is disabled.

Without this fix, a user can unintentionally "black hole" their account by setting the regular key to match the master key, then disabling the master key. The network rejects transactions signed with the both-master-and-regular key pair because the code interprets them as being signed with the disabled master key before it recognizes that they are signed by the currently-enabled regular key.

With this amendment enabled, a SetRegularKey transaction cannot set the regular key to match the master key; such a transaction results in the transaction code `temBAD_REGKEY`. Additionally, this amendment changes the signature verification code so that accounts which _already_ have their regular key set to match their master key can send transactions successfully using the key pair.

## Action Required

- If you operate a `rippled` server, you must upgrade to version 1.3.1 (or higher) by 2019-10-02, for service continuity.

- If you are one of the few individuals whose account was unable to submit transactions because of this bug, your account will be able to send transactions again after the amendment becomes enabled on 2019-10-02.

- Otherwise, this amendment should have no impact on your usage of the XRP Ledger.

## Impact of Not Upgrading

If you operate a `rippled` server but don’t upgrade to version 1.3.1 (or higher) by 2019-10-02, when the fixMasterKeyAsRegularKey amendment is expected to become enabled, then your server will become amendment blocked, meaning that your server:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments
* Could rely on potentially invalid data

If the fixMasterKeyAsRegularKey amendment does not become enabled, then your server will not become amendment blocked and should continue to operate.

For instructions on upgrading `rippled` on supported platforms, see [Install `rippled`](https://xrpl.org/install-rippled.html).

## Learn, ask questions, and discuss
Related documentation is available in the [XRP Ledger Dev Portal](https://xrpl.org/), including detailed example API calls and web tools for API testing.

Other resources:

* [The XRP Ledger Dev Blog](https://xrpl.org/blog/)
* Ripple Technical Services: <support@ripple.com>
* [XRP Chat Forum](http://www.xrpchat.com/)
