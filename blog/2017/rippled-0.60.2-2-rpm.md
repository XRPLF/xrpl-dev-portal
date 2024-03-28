---
date: 2017-05-03
category: 2017
labels:
    - Advisories
theme:
    markdown:
        editPage:
            hide: true
---
# rippled RPM version 0.60.2-2

Ripple has released a new `rippled` 0.60.2-2 RPM that contains an update to the [validator-keys](https://github.com/ripple/validator-keys-tool/blob/master/doc/validator-keys-tool-guide.md#validator-keys) key generation and management tool. The latest version of validator-keys allows validator operators to [sign data with their validator key](https://github.com/ripple/validator-keys-tool/blob/master/doc/validator-keys-tool-guide.md#signing).

There are no changes to `rippled` with this version.

## Action Required

**If you operate a `rippled` validator server that was set up using validator-keys and would like to sign data with your validator key**, then you should update to the `rippled` 0.60.2-2 RPM.

## Impact of Not Upgrading

**If you operate a `rippled` validator server but you don’t update to the `rippled` 0.60.2-2 RPM**, then your `rippled` instance will continue to operate normally. 

**If you operate a `rippled` validator server that was set up using validator-keys but don’t update to the `rippled` 0.60.2-2 RPM**, then you will be unable to sign data using your validator key.

For instructions on updating `rippled` on supported platforms, see [Updating `rippled` on supported platforms](https://ripple.com/build/rippled-setup/#updating-rippled).

The sha256 for the RPM is: 74e2541c1c6c06bd34d102229890bb11811701d73d99e4cfb4882d430131c067

The sha256 for the source RPM is: aab7f247b5cf9d3a20d4720aef2c51532bb83ee91fafe584e4fdfac77171537b

For other platforms, please [compile version 0.60.2-2 from source](https://github.com/ripple/rippled/tree/master/Builds).

The first log entry should be the change setting the version:

      commit 7cd4d7889779e6418270c8af89386194efbef24b
      Author: seelabs <scott.determan@yahoo.com>
      Date:   Thu Mar 30 14:25:41 2017 -0400

          Set version to 0.60.2


## Learn, ask questions, and discuss
Related documentation is available in the [Ripple Developer Portal](https://ripple.com/build/), including detailed example API calls and web tools for API testing.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* [The Ripple Dev Blog](https://developers.ripple.com/blog/)
* Ripple Technical Services: support@ripple.com
* [XRP Chat](http://www.xrpchat.com/)
