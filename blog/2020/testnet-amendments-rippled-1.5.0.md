---
category: 2020
date: 2020-04-10
labels:
    - Advisories
theme:
    markdown:
        editPage:
            hide: true
---
# Postmortem: Testnet Amendments from rippled 1.5.0

Like most new releases, version 1.5.0 of the XRP Ledger core server (`rippled`) contains new amendments which are not understood by earlier versions of the software.

On Tuesday, March 10, 2020, Ripple upgraded its Testnet validators to rippled version 1.5.0-rc2. The new amendments, `RequireFullyCanonicalSig` and `fixQualityUpperBound`, were automatically supported by the validators because the server, by default, supports all of the amendments it knows about. The protocol enforces a 2-week delay between an amendment gaining majority support and its activation. This delay is intended to give operators time to upgrade to a version of rippled that supports the amendments. In this case, unfortunately, most operators were not given sufficient notice. The [ripple-server mailing list](https://groups.google.com/forum/#!forum/ripple-server) used for such announcements was not notified until about two hours before the amendments were activated.

On March 24, 2020, the amendments were activated by the Testnet validators. At this point, Ripple had these options:

1. Deactivate the amendments: From a technical standpoint, it is only feasible to do this by resetting the Testnet ledger, meaning that all accounts and balances would be removed.

2. Leave it alone: Testnet no longer matches Mainnet in terms of activated amendments, but the changes are minor, so it should not have much impact on testing or development. However, the amendments are only known to rippled 1.5.0, so all rippled servers connected to Testnet are [amendment blocked](https://xrpl.org/amendments.html#amendment-blocked) until they upgrade to rippled 1.5.0.

3. Roll back the testnet ledger to shortly before the amendments became activated. This would undo any transactions after that point, while leaving most Testnet accounts and balances in place. This should be possible as long as Ripple controls the Testnet validators and Ripple has at least one validator that hasn't yet online-deleted history past the rollback point. However, this has not been tried in practice, and there is no documented procedure for doing so.

Ripple opted for #2, the least disruptive option.

Therefore, all rippled servers connecting to the Testnet must be upgraded in order to continue operating. Unfortunately, every operator running a stable-version rippled server connected to Testnet [experienced a disruption](https://github.com/ripple/rippled/issues/3315) because rippled 1.5.0 was still in the release candidate process at the time. To restore service, Testnet servers could be [upgraded to an 'unstable' release candidate version](https://groups.google.com/forum/#!topic/ripple-server/21htQzq4zz0) or wait for the official release, which came out on March 31.

As new versions of rippled are released, operators should continue to upgrade their servers. Note that `unstable` repositories may update with pre-release versions in the future, so operators who opted to upgrade to a 1.5.0 release candidate should ensure that they do not get automatically upgraded to future 'unstable' versions, unless that is what they want.

## Action items

To improve this situation in the future, we recommend that the developers and participants of the XRP Ledger ecosystem incorporate the following process improvements:

1. When a new amendment is included in a beta, it should be documented on xrpl.org as soon as possible.

2. Whenever Ripple develops a new amendment with significant new features, Ripple will propose an [XRP Ledger Standard](https://github.com/xrp-community/standards-drafts), in the open source community-run GitHub repo, before merging code to the **develop** branch.

3. When Devnet/Testnet/Mainnet validators are upgraded to a new version of rippled, Ripple will post an announcement to [the ripple-server mailing list](https://groups.google.com/forum/#!forum/ripple-server), regardless of whether the release contains new amendments; these posts keep the XRP community up-to-date about new releases and invite them to review the changes. If there are new amendments, they should be emphasized and called out in the email.

4. New amendments should be vetoed on Testnet until they gain majority on Mainnet. Ripple plans to automate this with a script that monitors when an amendment gains majority (not just when it is activated) on Mainnet. The lag between the two networks would be no more than the time between flag ledgers, 20 minutes or less. Until this automation is in place, Testnet's amendments may be a day or two behind.

## Learn, ask questions, and discuss

To receive email updates whenever there are important releases or changes to the XRP Ledger server software, subscribe to the [ripple-server Google Group](https://groups.google.com/forum/#!forum/ripple-server).

Related documentation is available in the [XRP Ledger Dev Portal](https://xrpl.org/).

Other resources:

* Ripple Technical Services: <support@ripple.com>
* [Xpring Forum](https://forum.xpring.io/)
* [XRP Chat Forum](http://www.xrpchat.com/)
