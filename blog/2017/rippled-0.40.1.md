---
date: 2017-01-11
category: 2017
labels:
    - Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# rippled version 0.40.1

The `rippled` team has released version 0.40.1, which increases SQLite database limits in all `rippled` full-history servers. Ripple recommends upgrading to 0.40.1 only if server operators are running `rippled` servers with full-history of the ledger. There are no new or updated features in the 0.40.1 release.

## Action Recommended

**If you operate a `rippled` server and have full-history of the ledger, then you should upgrade to 0.40.1 immediately.**

## Impact of Not Upgrading

If you operate a `rippled` server and have full-history of the ledger, but don’t upgrade to version 0.40.1, then your server may crash when restarted.

For instructions on updating `rippled` on supported platforms, see [Updating `rippled` on supported platforms](https://ripple.com/build/rippled-setup/#updating-rippled).

The md5sum for the rpm is: e876816f4ddb38bec28d158083020fa9

The md5sum for the source rpm is: 3ed1569bd0dbba5ff1d1ef1abfca7ed7

For other platforms, please [compile version 0.40.1 from source](https://github.com/ripple/rippled/tree/master/Builds).

The first log entry should be the change setting the version:

    $ git log -1 upstream/master
    commit e91aacc9a3d2f332a93981270c3812e26189226e
    Author: Nik Bougalis <nikb@bougalis.net>
    Date:   Thu Jan 5 09:38:28 2017 -0800

    Set version to 0.40.1

## Bug Fixes
Increase SQLite database limits to prevent full-history servers from crashing when restarting. [(#1961)](https://github.com/ripple/rippled/commit/610e51a162a6ef06accf8733b3b35b492963a78b)

## Network Update
The Ripple operations team has deployed version 0.40.1 to all full-history `rippled` servers under its operational control.

## Learn, ask questions, and discuss
Related documentation is available in the [Ripple Developer Portal](https://ripple.com/build/), including detailed example API calls and web tools for API testing.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* [The Ripple Dev Blog](https://developers.ripple.com/blog/)
* Ripple Technical Services: <support@ripple.com>
* [XRP Chat](http://www.xrpchat.com/)
