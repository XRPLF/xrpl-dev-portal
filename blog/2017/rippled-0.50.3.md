---
date: 2017-03-14
category: 2017
labels:
    - Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# rippled version 0.50.3

The `rippled` team has released version 0.50.3, which patches a reported exploit that would allow a combination of trust lines and order books in a payment path to bypass the blocking effect of the `NoRipple` flag. Ripple recommends that all `rippled` server operators immediately upgrade to version 0.50.3, which contains a patch that fixes the exploit. There are no new or updated features in the 0.50.3 release.

Ripple will be following up with a postmortem, explaining the exploit, the timeline of events and the actions taken in more detail at a later date.

## Action Recommended

**If you operate a `rippled` server**, then you should upgrade to version 0.50.3 immediately.

**If you operate a gateway**, then you should:
1. Make sure your issuing account has not set the `NoRipple` flag on any trust lines
2. Your issuing account should have a zero limit on all trust lines
3. Make sure the `DefaultRipple` flag is set on your issuing account
4. Upgrade to `rippled` version 0.50.3 immediately

**If you are an individual user**, then you should have the `NoRipple` flag enabled by default and set the trust line limit to zero on gateways that you do not trust.

**If you are an individual user, and you do not have the `NoRipple` flag enabled**, and you discover a negative balance owed to an unknown account, then you should freeze that individual trust line.

## Impact of Not Upgrading

If you operate a `rippled` server, but don’t upgrade to `rippled` version 0.50.3, then your server may lose sync with Ripple operated validators more frequently.

If you operate a `rippled` validating server, but don’t upgrade to `rippled` version 0.50.3, which includes a patch for the reported exploit, then your server will validate some transactions in a payment path that bypass the blocking effect of the `NoRipple` flag.

For instructions on updating `rippled` on supported platforms, see [Updating `rippled` on supported platforms](https://ripple.com/build/rippled-setup/#updating-rippled).

The sha256 for the rpm is: 2ee3e7e2912b5df9e3f8f88c5f6adfa60afbb37ef08afe50f6147795c5c2abaf

The sha256 for the source rpm is: ada6f9ae8b8136569d28f03a43fef0f828e2c69857c81f230d17cf9f832cce0f

For other platforms, please [compile version 0.50.3 from source](https://github.com/ripple/rippled/tree/master/Builds).

The first log entry should be the change setting the version:

        commit 82de944b30afef7fb6220424b62a79156e93b321
        Author: Nik Bougalis <nikb@bougalis.net>
        Date:   Mon Mar 13 15:49:21 2017 -0700

        Set version to 0.50.3

## Bug Fixes

Patch a reported exploit that would allow a combination of trust lines and order books in a payment path to bypass the blocking effect of the `NoRipple` flag [(#2050)](https://github.com/ripple/rippled/pull/2050/commits/0b187a6a4eb503c91efca997aae32c4c9b45f115)

## Network Update

Ripple engineers have deployed the fix to all `rippled` validating servers under Ripple’s operational control and will not be updating client-facing `rippled` servers to 0.50.3 at this time. _(Editor's note: an earlier version of this post incorrectly stated that the fix was configuration-based. The fix was to update Ripple's validating servers to 0.50.3.)_

## Learn, ask questions, and discuss
Related documentation is available in the [Ripple Developer Portal](https://ripple.com/build/), including detailed example API calls and web tools for API testing.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* [The Ripple Dev Blog](https://developers.ripple.com/blog/)
* Ripple Technical Services: <support@ripple.com>
* [XRP Chat](http://www.xrpchat.com/)
