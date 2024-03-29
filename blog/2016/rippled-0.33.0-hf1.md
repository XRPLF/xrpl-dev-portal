---
date: 2016-10-16
labels:
    - Release Notes
category: 2016
theme:
    markdown:
        editPage:
            hide: true
---
# rippled version 0.33.0-hf1

Ripple has released `rippled` version 0.33.0-hf1, which fixes a JSON parsing issue in all `rippled` servers. Ripple recommends upgrading to 0.33.0-hf1 only if server operators are experiencing a `jsonInvalid` error response to client requests. There are no new or updated features in the 0.33.0-hf1 release.

## Action Recommended

**If you operate a `rippled` server and are experiencing a `jsonInvalid` error response to client requests, then you should upgrade to 0.33.0-hf1 immediately.**

## Impact of Not Upgrading

If you operate a `rippled` server and are experiencing a `jsonInvalid` error response to client requests, but don’t upgrade to version 0.33.0-hf1, then your server will continue to experience failing client requests.

For instructions on updating `rippled` on supported platforms, see [Updating `rippled` on supported platforms](https://ripple.com/build/rippled-setup/#updating-rippled).

The md5sum for the rpm is: f181f1fc801e3387487d246f9a975517

The md5sum for the source rpm is: 7993f125ed05bfeeda4e091761021429

For other platforms, please [compile version 0.33.0-hf1 from source](https://github.com/ripple/rippled/tree/master/Builds).

The first log entry should be the change setting the version:

          commit 98f878cf10a32e26021b6a6ed44990bccbbc92c2
          Author: Vinnie Falco <vinnie.falco@gmail.com>
          Date:   Sat Oct 1 12:12:34 2016 -0400

          Set version to 0.33.0-hf1

## Bug Fixes

Fix a JSON parsing issue that can fail to parse valid JSON requests when the data received by the server is broken up into more than one contiguous buffer. [(#1863)](https://github.com/ripple/rippled/commit/69b47890e69cea46c403e6354742c3653f125c6f)

## Network Update
The Ripple operations team has deployed version 0.33.0-hf1 to all client facing `rippled` servers under its operational control.

## Learn, ask questions, and discuss
Related documentation is available in the [Ripple Developer Portal](https://ripple.com/build/), including detailed example API calls and web tools for API testing.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* [The Ripple Dev Blog](https://developers.ripple.com/blog/)
* Ripple Technical Services: support@ripple.com
* [XRP Chat](http://www.xrpchat.com/)
