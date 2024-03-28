---
date: 2018-01-08
category: 2018
labels:
    - Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# rippled Version 0.81.0

Ripple has released `rippled` version 0.81.0, which introduces changes that improve the scalability of the XRP Ledger and transitions the recommended validator configuration to a new hosted site, as described in [Ripple's Decentralization Strategy Update](https://developers.ripple.com/blog/2017/decent-strategy-update.html) post.

Ripple strongly recommends upgrading to `rippled` version 0.81.0 immediately.

## Action Required

If you operate a `rippled` server, then you should upgrade to `rippled` version 0.81.0 immediately.

Ripple recommends that you:

* Edit your `rippled.cfg` to remove the `[validators]` section, if one is present.
* Replace the contents of any existing `validators.txt` file with the [version included with this release](https://github.com/ripple/rippled/blob/4e8c8deeaac83d18eb62c95b7425d96e11847a41/doc/validators-example.txt#L51-L55). If you are upgrading to `rippled` version 0.81.0 [using the rippled RPM package](https://ripple.com/build/rippled-setup/#updating-rippled), then your default `validators.txt` file may automatically be updated, in which case you will not need to modify the file. The `validators.txt` file is usually in the same directory as your `rippled.cfg` file.
* After starting your `rippled` server, confirm that it is configured to use the new defaults by executing:

`/opt/ripple/bin/rippled validators`

The result should include the following:

      "local_static_keys" : [],
            "publisher_lists" : [
               {
                  "available" : true,
                  "expiration" : "2018-Jan-23 00:00:00",
                  "list" : [
                      "nHB1FqfBpNg7UTpiqEUkKcAiWqC2PFuoGY7FPWtCcXAxSkhpqDkm",
                      "nHUpwrafS45zmi6eT72XS5ijpkW5JwfL5mLdPhEibrqUvtRcMAjU",
                      "nHUBGitjsiaiMJBWKYsJBHU2shmYt9m29hRqoh8AS5bSAjXoHmdd",
                      "nHUXh1ELizQ5QLLqtNaVEbbbfMdq3wMkh14aJo5xi83xzzaatWWP",
                      "nHUgoJvpqXZMZwxh8ZoFseFJEVF8ryup9r2mFYchX7ftMdNn3jLT"
                  ],
                  "pubkey_publisher" : "ED2677ABFFD1B33AC6FBC3062B71F1E8397C1505E1C42C64D11AD1B28FF73F4734",
                  "seq" : 2,
                  "version" : 1
               }
            ],

## Impact of Not Upgrading

* **If you operate a `rippled` server**, but do not upgrade to `rippled` version 0.81.0, then your `rippled` server may periodically drop transactions and fall out of sync with the network.

* On Tuesday January 16, 2018, the current validator keys on all five Ripple-operated `rippled` validator servers will be replaced. **If you have been using the recommended default configuration** and do not reconfigure your `rippled` server before that time, then your `rippled` server will stop seeing validated ledgers.

For instructions on updating `rippled` on supported platforms, see [Updating `rippled` on supported platforms](https://ripple.com/build/rippled-setup/#updating-rippled).

The sha256 for the rpm is: 75acdf54e472875bff609fa2d1cc59524e4d8f8e885751b50aaeb85938ab3609

The sha256 for the source rpm is: fbc95f6168d015190b93b81f97c20979886fa2f6663e4dd15157409075db46e9

For other platforms, please [compile version 0.81.0 from source](https://github.com/ripple/rippled/tree/master/Builds).

The first log entry should be the change setting the version:

        commit 4e8c8deeaac83d18eb62c95b7425d96e11847a41
        Author: Nikolaos D. Bougalis <nikb@bougalis.net>
        Date:   Wed Jan 3 14:43:42 2018 -0800

        	Set version to 0.81.0


## Network Update
The Ripple technical operations team will deploy `rippled` version 0.81.0 to all `rippled` servers under its operational control, Tuesday, 01/09/2018.

## Learn, ask questions, and discuss
Related documentation is available in the [Ripple Developer Portal](https://ripple.com/build/), including detailed example API calls and web tools for API testing.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* [The Ripple Dev Blog](https://developers.ripple.com/blog/)
* Ripple Technical Services: <support@ripple.com>
* [XRP Chat](http://www.xrpchat.com/)


## 0.81.0 Change Log

* New hosted validator configuration

## Bug Fixes

* Filter SQL results in lieu of a search clause [(#2312)](https://github.com/ripple/rippled/pull/2312)
