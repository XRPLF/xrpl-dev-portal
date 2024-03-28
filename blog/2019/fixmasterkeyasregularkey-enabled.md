---
labels:
    - Amendments
date: 2019-10-02
category: 2019
theme:
    markdown:
        editPage:
            hide: true
---
# fixMasterKeyAsRegularKey is Now Available

[As previously announced](https://xrpl.org/blog/2019/fixmasterkeyasregularkey-expected.html), the fixMasterKeyAsRegularKey amendment [became enabled on the XRP Ledger](https://xrpcharts.ripple.com/#/transactions/61096F8B5AFDD8F5BAF7FC7221BA4D1849C4E21B1BA79733E44B12FC8DA6EA20) on 2019-10-02.

## Action Required

- If you operate a `rippled` server, you should upgrade to version 1.3.1 (or higher) immediately.

For instructions on upgrading `rippled` on supported platforms, see [Install `rippled`](https://xrpl.org/install-rippled.html).


## Impact of Not Upgrading

If you operate a `rippled` server on a version older than 1.3.1, then your server is now amendment blocked, meaning that your server:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments
* Could rely on potentially invalid data

## fixMasterKeyAsRegularKey Summary

Fixes a bug where accounts can set their regular key pair to match their master key pair, but cannot send transactions signed by the key if the master key is disabled.

Without this fix, a user can unintentionally "black hole" their account by setting the regular key to match the master key, then disabling the master key. The network rejects transactions signed with the both-master-and-regular key pair because the code interprets them as being signed with the disabled master key before it recognizes that they are signed by the currently-enabled regular key.

With this amendment enabled, a SetRegularKey transaction cannot set the regular key to match the master key; such a transaction results in the transaction code `temBAD_REGKEY`. Additionally, this amendment changes the signature verification code so that accounts which _already_ have their regular key set to match their master key can send transactions successfully using the key pair.

## Learn, ask questions, and discuss
Related documentation is available in the [XRP Ledger Dev Portal](https://xrpl.org/), including detailed example API calls and web tools for API testing.

Other resources:

* [The XRP Ledger Dev Blog](https://xrpl.org/blog/)
* Ripple Technical Services: <support@ripple.com>
* [XRP Chat Forum](http://www.xrpchat.com/)
