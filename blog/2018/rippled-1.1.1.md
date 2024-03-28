---
date: 2018-10-23
category: 2018
labels:
    - Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# rippled Version 1.1.1

Ripple has released `rippled` version 1.1.1, which improves handling of validator list sites. These changes improve retrieval of Ripple's recommended UNL for servers in restrictive network environments, and prevent incorrect behavior in cases where a server is unable to fetch a validator list update before the previous list expires.

## Action Required

**If you operate a `rippled` server**, then you should upgrade to `rippled` version 1.1.1 as soon as possible.

## Impact of Not Upgrading

* **If you operate a `rippled` server**, but do not upgrade to version 1.1.1, then your server may behave incorrectly if it is unable to fetch a new validator list before its current list expires. (If your network configuration causes `rippled` to encounter HTTP redirects when fetching the validator list, this can prevent `rippled` 1.1.0 and lower from correctly downloading the updated list in a timely manner.)

## Upgrading

For instructions on updating `rippled` on supported platforms, see [Updating `rippled`](https://developers.ripple.com/update-rippled.html).

The SHA-256 for the RPM is: `a833fbaf988d85c985f80ad4dfd46a391cce7e884fba62b2f9b1b87aa41c3cfa`

The SHA-256 for the source RPM is: `a88b538fc3ee0bb5cefe3e96622faebecebcc91e5c530f74283d49c9cfff41d4`

For other platforms, please compile v1.1.1 from source. See the [`rippled` source tree](https://github.com/ripple/rippled/tree/develop/Builds) for instructions by platform. For instructions building `rippled` from source on Ubuntu Linux, see [Install `rippled` on Ubuntu](https://developers.ripple.com/install-rippled.html#installation-on-ubuntu-with-alien).

The first log entry should be the change setting the version:

```text
commit 72e6005f562a8f0818bc94803d222ac9345e1e40
Author: seelabs <scott.determan@yahoo.com>
Date:   Fri Oct 19 13:12:40 2018 -0400

    Set version to 1.1.1
```

## Network Update

The Ripple operations team plans to deploy version 1.1.1 to all `rippled` servers under its operational control, including private clusters, starting at 2:00 PM PDT on Tuesday, 2018-10-23. The deployment is expected to complete within 5 hours. The network should continue to operate during deployment and no outage is expected.

**Bug Bounties and Responsible Disclosures**

Ripple welcomes reviews of the `rippled` codebase and urges reviewers to responsibly disclose any issues that they may find. For more on Ripple's Bug Bounty program, please visit <https://ripple.com/bug-bounty/>.

**Boost Compatibility**

When compiling `rippled` from source, you must use a compatible version of the Boost library. **For version 1.1.1, Boost 1.67.0 is required for all platforms.**

## Learn, ask questions, and discuss

Related documentation is available in the [XRP Ledger Developer Portal](https://developers.ripple.com/), including detailed reference information, tutorials, and web tools.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* [The Ripple Dev Blog](https://developers.ripple.com/blog/)
* Ripple Technical Services: <support@ripple.com>
* [XRP Chat](http://www.xrpchat.com/)



## 1.1.1 Change Log

### Bug Fixes

- Follow the `Location:` HTTP header when fetching a validator list results in a redirect status code such as **301 Moved Permanently**, **302 Found**, **307 Temporary Redirect**, or **308 Permanent Redirect**. (RIPD-1669)

- Improve behavior of `rippled` servers when their latest available validator list is past its expiration (RIPD-1661):
    - Report the problem with an ERROR-level log message.
    - Stop sending validation messages for new ledgers until a non-expired validator list is available.
    - Report the validator list as `expired` in the [server_info method](https://developers.ripple.com/server_info.html) and [server_state method](https://developers.ripple.com/server_state.html).
