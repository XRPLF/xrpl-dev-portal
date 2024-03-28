---
date: 2017-05-11
category: 2017
labels:
    - Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# rippled version 0.60.3

The `rippled` team has released `rippled` version 0.60.3, which helps to increase the stability of the overlay network under increased load. Ripple recommends server operators upgrade to `rippled` version 0.60.3 immediately. There are no new features in the 0.60.3 release.

## Action Recommended

**If you operate a rippled server and are experiencing connection instability or your server has difficulty maintaining sync with the Ripple network during periods of increased load**, then you should upgrade to `rippled` version 0.60.3 immediately.

## Impact of Not Upgrading

**If you operate a rippled server**, but don’t upgrade to `rippled` version 0.60.3, then your server may experience dropped connections to other servers more frequently.

For instructions on updating `rippled` on supported platforms, see [Updating `rippled` on supported platforms](https://ripple.com/build/rippled-setup/#updating-rippled).

The sha256 for the RPM is: 3e9c8b421ea0ae6da7ae65524be60408f32ef2bd0bcfea1e1c9fb54eec5fc809

The sha256 for the source RPM is: 9848185e35a21ef41fcea334f8ad224c49e243f64b38dd9311ab898b97ab6c0a

For other platforms, please [compile version 0.60.3 from source](https://github.com/ripple/rippled/tree/master/Builds).

The first log entry should be the change setting the version:

        commit 208028a1420cc187a6b5b9e97846e8cafd54f39f
        Author: Nik Bougalis <nikb@bougalis.net>
        Date:   Tue May 9 13:37:49 2017 -0700

          Set version to 0.60.3

## Change Log

Server overlay improvements [(#2110)](https://github.com/ripple/rippled/pull/2110)

## Network Update

The Ripple technical operations team plans to deploy `rippled` version 0.60.3 to all `rippled` servers under its operational control, including private clusters and hubs, starting at 4:00 PM PDT on Thursday, 2017-05-11. The deployment is expected to complete within 4 hours. The network should continue to operate during deployment and no outage is expected.


## Learn, ask questions, and discuss
Related documentation is available in the [Ripple Developer Portal](https://ripple.com/build/), including detailed example API calls and web tools for API testing.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* [The Ripple Dev Blog](https://developers.ripple.com/blog/)
* Ripple Technical Services: support@ripple.com
* [XRP Chat](http://www.xrpchat.com/)
