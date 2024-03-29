---
date: 2017-07-10
category: 2017
labels:
    - Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# rippled version 0.70.1

The `rippled` team has released `rippled` version 0.70.1, which corrects a technical flaw in the newly [refactored](https://github.com/ripple/rippled/commit/00c60d408a887d8a986db81afbb5ead121e8310c#diff-dab2766c14d0ef8e760dc5e353fa7b9dR1389) consensus code that could, in rare cases, cause a node to get stuck in consensus due to stale votes from a peer. **Ripple requires upgrading to `rippled` version 0.70.1 immediately.**

There are no new features in the 0.70.1 release.

{% admonition type="danger" name="UPDATE 7-12-2017" %}
This announcement now contains corrected SHA-256 values for the RPM and source RPM.
{% /admonition %}

## Action Required

**If you operate a `rippled` server, then you should upgrade to 0.70.1 immediately.**

## Impact of Not Upgrading

* If you operate a `rippled` validator server, but do not upgrade to `rippled` version 0.70.1, then your `rippled` validator server could experience increased loss of synchronization with the network.

For instructions on updating `rippled` on supported platforms, see [Updating `rippled` on supported platforms](https://ripple.com/build/rippled-setup/#updating-rippled).

The SHA-256 for the `RPM` is: `23c8ec08d1ca8c8ce6c0602617c7e41b7f2fd249a1417a79a286a3faa5be08eb`

The SHA-256 for the source `RPM` is: `3522546989024e783cfa933218a28ee878dcc3f334749e7456cb04a9cd07d8fc`

For other platforms, please [compile version 0.70.1 from source](https://github.com/ripple/rippled/tree/master/Builds).

The first log entry should be the change setting the version:

      commit 3bfd9de6779994e5bbbba864791429e2f7360947
      Author: Nik Bougalis <nikb@bougalis.net>
      Date:   Wed Jun 28 07:15:07 2017 -0700

            Set version to 0.70.1

## 0.70.1 Change Log

* Allow compiling against OpenSSL 1.1.0, which allows compiling under the latest version of Fedora. [(#2151)](https://github.com/ripple/rippled/pull/2151)

## Bug Fixes

* Log invariant check messages at "fatal" level [(#2154)](https://github.com/ripple/rippled/pull/2154)

* Fix the consensus code to update all disputed transactions after a node changes a position [(#2156)](https://github.com/ripple/rippled/pull/2156)


## Network Update

The Ripple technical operations team deployed `rippled` version 0.70.1 to all `rippled` servers under its operational control, including private clusters, on Sunday, 2017-07-09.

## Learn, ask questions, and discuss
Related documentation is available in the [Ripple Developer Portal](https://ripple.com/build/), including detailed example API calls and web tools for API testing.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* [The Ripple Dev Blog](https://developers.ripple.com/blog/)
* Ripple Technical Services: support@ripple.com
* [XRP Chat](http://www.xrpchat.com/)
