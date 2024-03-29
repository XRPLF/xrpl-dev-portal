---
date: 2017-01-30
category: 2017
labels:
    - Release Notes
theme:
    markdown:
        editPage:
            hide: true
---

# rippled version 0.50.2

The `rippled` team has released 0.50.2, which adjusts the default TLS cipher list and corrects a flaw that would not allow an SSL handshake to properly complete if the port was configured using the wss keyword. Ripple recommends upgrading to 0.50.2 only if server operators are running `rippled` servers that accept client connections over TLS. There are no new or updated features in the 0.50.2 release.

## Action Recommended

**If you operate a `rippled` server and accept secure client connections, then you should upgrade to 0.50.2 immediately.**

## Impact of Not Upgrading

If you operate a `rippled` server and accept secure client connections, but don’t upgrade to version 0.50.2, then your server may be unable to negotiate SSL connections.

For instructions on updating `rippled` on supported platforms, see [Updating `rippled` on supported platforms](https://ripple.com/build/rippled-setup/#updating-rippled).

The md5sum for the rpm is: 05cf675685158aabfc3ff6af7b1549d8

The md5sum for the source rpm is: 0a8c93d67e1c27726ee57693177e7745

For other platforms, please [compile version 0.50.2 from source](https://github.com/ripple/rippled/tree/master/Builds).

The first log entry should be the change setting the version:

```
commit d8a5f5b0946e2a155a1af8455512488a5f758955
Author: Nik Bougalis <nikb@bougalis.net>
Date:   Mon Jan 30 15:45:35 2017 -0800

    Set version to 0.50.2
```


## Bug Fixes

Adjust the default cipher list and correct a flaw that would not allow an SSL handshake to properly complete if the port was configured using the wss keyword. [(#1985)](https://github.com/ripple/rippled/pull/1985/commits/708fc6cd6f3c75d08fa409f6815ed915854438a5)

## Network Update
The Ripple operations team has deployed a configuration-based fix to all client-facing `rippled` servers under its operational control and will not be updating to 0.50.2 at this time.

## Learn, ask questions, and discuss
Related documentation is available in the [Ripple Developer Portal](https://ripple.com/build/), including detailed example API calls and web tools for API testing.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* [The Ripple Dev Blog](https://developers.ripple.com/blog/)
* Ripple Technical Services: support@ripple.com
* [XRP Chat](http://www.xrpchat.com/)
