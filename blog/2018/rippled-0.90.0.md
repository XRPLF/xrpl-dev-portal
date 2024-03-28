---
date: 2018-02-21
category: 2018
labels:
    - Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# rippled Version 0.90.0

Ripple has released `rippled` version 0.90.0, which introduces several enhancements that improve the reliability, scalability and security of the XRP Ledger. Ripple recommends that all server operators upgrade to version 0.90.0 by Thursday, 2018-03-15, for service continuity.

Highlights of this release include:

- The **DepositAuth** Amendment, which lets an account strictly reject any incoming money from transactions sent by other accounts.
- The **Checks** Amendment, which allows users to create a deferred payment that can be canceled or cashed by its intended recipient.
- **History Sharding**, which allows `rippled` servers to distribute historical ledger data if they agree to dedicate storage for segments of ledger history.
- **Preferred Ledger by Branch**, which improves how a `rippled` server decides which ledger it should base future ledgers on when there are multiple candidates.

Ripple expects the `DepositAuth` and `Checks` amendments to be enabled on Thursday, 2018-03-15.

## Action Required

If you operate a `rippled` server, you should upgrade to `rippled` version 0.90.0 by Thursday, 2018-03-15, for service continuity.

## Impact of Not Upgrading

* **If you operate a `rippled` server**, but do not upgrade to `rippled` version 0.90.0 by **Thursday, 2018-03-15**, when DepositAuth and Checks are expected to be enabled via Amendment, then your rippled server will become [amendment blocked](https://ripple.com/build/amendments/#amendment-blocked), meaning that your server:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments
* Could rely on potentially invalid data

If the **DepositAuth** and **Checks** Amendments do not get approved, then your `rippled` server will not become Amendment blocked and should continue to operate.

For instructions on updating `rippled` on supported platforms, see [Updating `rippled` on supported platforms](https://ripple.com/build/rippled-setup/#updating-rippled).

The SHA-256 for the RPM is: `7d6c6d9908289edbf38660f0ab2a233b159ac7abfe502ae774bf9af579270613`

The SHA-256 for the source RPM is: `faf0d669a38b7f97acd2d4b95b48a8c50a9859a6235be2ed289d10c6c5f96a1f`

For other platforms, please compile version 0.90.0 from source. See the [`rippled` source tree](https://github.com/ripple/rippled/tree/develop/Builds) for instructions by platform. For instructions building `rippled` from source on Ubuntu Linux, see [Build and Run `rippled` on Ubuntu](https://ripple.com/build/build-run-rippled-ubuntu/).

The first log entry should be the change setting the version:

    commit 6230204e425f6aef6ec1c0def0bdd1257e1c4c7f
    Author: Nikolaos D. Bougalis <nikb@bougalis.net>
    Date:   Tue Feb 20 14:12:03 2018 -0800

        Set version to 0.90.0

## Action Recommended: Configure History Shards

If you operate a `rippled` server and want to start storing history shards, you must add a `[shard_db]` stanza to your `rippled` configuration file. The following settings are required to configure your server. The **type** field determines the database backend for the shard store. Ripple recommends using NuDB because it uses less memory and fewer file descriptors than RocksDB. The **path** field determines the location to store the database and the **max_size_gb** field limits the maximum disk space the shard store can occupy.

Example snippet:

    [shard_db]
    type=NuDB
    path=/var/lib/rippled/db/shards/nudb
    max_size_gb=100

Ripple recommends storing history shards only on non-validator servers to reduce overhead for validators.

## Network Update
The Ripple operations team plans to deploy version 0.90.0 to all `rippled` servers under its operational control, including private clusters, starting at 2:00 PM PST on Wednesday, **2018-02-21**. The deployment is expected to complete within 4 hours. The network should continue to operate during deployment and no outage is expected.

## Other Information

### Acknowledgements

Ripple thanks Guido Vranken for responsibly disclosing a potential vulnerability in the parsing code handling nested JSON objects. The issue could be exploited under some circumstances to mount a denial of service attack. It was addressed with pull request [#2326](https://github.com/ripple/rippled/pull/2326).

### Bug Bounties and Responsible Disclosures
We welcome reviews of the `rippled` codebase and urge reviewers to responsibly disclose any issues that they may find. For more on Ripple's Bug Bounty program, please visit <https://ripple.com/bug-bounty/>.

### Boost Compatibility
When compiling `rippled` from source, you must use a compatible version of the Boost library. Ripple recommends Boost 1.64.0 for all platforms.

Other compatible versions differ by platform. Boost 1.58.0 is compatible on Linux but not on Windows. On macOS, Boost 1.58.0 is not compatible with the Clang compiler version 4.0+. On all platforms, Boost 1.66.0 compatibility in rippled 0.90.0 is experimental.


## Learn, ask questions, and discuss
Related documentation is available in the [Ripple Developer Portal](https://ripple.com/build/), including detailed example API calls and web tools for API testing.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* [The Ripple Dev Blog](https://developers.ripple.com/blog/)
* Ripple Technical Services: <support@ripple.com>
* [XRP Chat](http://www.xrpchat.com/)

## Full Release Notes

### DepositAuth

The DepositAuth Amendment allows enterprise account holders to comply with strict regulations that require due diligence before receiving money from any source. When an account enables this flag, payment transactions fail if the account is the destination, regardless of whether the payment would have delivered XRP or an issued currency.

If an Escrow has a Destination with the DepositAuth flag set, then the corresponding EscrowFinish transaction can succeed only if that transaction is signed by the Destination. Similar rules apply to Payment Channels.

As an exception, accounts with DepositAuth enabled can receive XRP payment transactions for small amounts of XRP (equal or less than the minimum account reserve) if their current XRP balance is below the account reserve.

For more information, see <https://ripple.com/build/deposit-authorization/>

### Checks

The Checks Amendment works similarly to personal paper checks and introduces a new ledger object type ([Check](https://ripple.com/build/ledger-format/#check)), a new transaction result code ([tecEXPIRED](https://ripple.com/build/transactions/#tec-codes)) and three new transaction types ([CheckCreate](https://ripple.com/build/transactions/#checkcreate), [CheckCash](https://ripple.com/build/transactions/#checkcash), [CheckCancel](https://ripple.com/build/transactions/#checkcancel)) to the XRP Ledger.

The sender signs a CheckCreate transaction to create a Check for a specific maximum amount and specifies a destination account to receive the funds. Later, the destination account can sign a CheckCash transaction to cash the Check and receive up to the specified amount. The actual movement of money only occurs when the Check is cashed, so cashing the Check may fail depending on the sender's current balance and the available liquidity. An account with the DepositAuth flag set can receive funds using a CheckCash transaction.

If cashing the Check fails, the Check object remains in the ledger so it may be successfully cashed later. The sender or the receiver can sign a CheckCancel transaction to cancel a Check at any time before it is cashed. A Check can also have an expiration time, after which it cannot be cashed, and anyone can cancel it. tecEXPIRED occurs when trying to create a Check whose expiration time is in the past.

### History Sharding

History Sharding allows `rippled` servers to distribute historical ledger data if they agree to keep particular ranges of historical ledgers. This makes it very easy for servers to confirm that they have all the data that they're supposed to have. Further, History Sharding makes it simpler to produce proof trees or ledger deltas and challenge servers to demonstrate they actually hold the data they claim to have.

For more information, see <https://ripple.com/build/history-sharding/>

### Preferred Ledger by Branch

Preferred Ledger by Branch improves how a `rippled` server decides which ledger it should be working on during consensus. In previous versions, a `rippled` server always checks that it is working on what it believes is the most supported ledger, but does not using the common ancestry of validated ledgers as part of that decision. Determining the best working ledger is important during rare cases of network or server instability and improves a `rippled` server's ability to re-converge with the rest of the network.

Preferred Ledger by Branch leverages the ancestry information of branches to account for common support across validated ledgers and their ancestors, since a validation for some ledger is also a validation for all its ancestors. To find the preferred ledger, a `rippled` server starts at the most recent validated ledger and selects the child ledger with most support based on recent validations, but only selects it if an alternate sibling ledger does not possibly have more support. This process is then repeated starting from the newly chosen ledger until no better ledger exists. Preferred Ledger by Branch is designed to be conservative, only switching when the server sees enough peer validations to know another branch won't become preferred.

## Upcoming Features
The [previously announced](https://developers.ripple.com/blog/2017/rippled-0.70.0.html) **FlowCross** Amendment will be enabled on a future date (TBA).

Compiling `rippled` with scons is deprecated. Starting in rippled version 1.0, the only supported build will be using CMake.

An upcoming version of `rippled` will switch to using the Boost.Beast library instead of the Beast library from the `rippled` source code. As part of this change, the minimum supported version of Boost will change to be a version incorporating Boost.Beast.

Ripple does not expect to enable the **SHAMapV2**, **Tickets**, or **OwnerPaysFee** amendments before the next release of `rippled`. These amendments have been disabled in the source code so `rippled` 0.90.0 will not show them as available. Ripple plans to re-introduce some or all of these amendments in a future version of `rippled`.

## 0.90.0 Change Log

- Add support for Deposit Authorization account root flag ([#2239](https://github.com/ripple/rippled/pull/2239))
- Implement history shards ([#2258](https://github.com/ripple/rippled/pull/2258))
- Preferred ledger by branch ([#2300](https://github.com/ripple/rippled/pull/2300))
- Tune for higher transaction processing ([#2294](https://github.com/ripple/rippled/pull/2294))
- Redesign Consensus Simulation Framework ([#2209](https://github.com/ripple/rippled/pull/2209))
- Optimize queries for account_tx to work around SQLite query planner ([#2312](https://github.com/ripple/rippled/pull/2312))
- Allow Journal to be copied/moved ([#2292](https://github.com/ripple/rippled/pull/2292))
- Cleanly report invalid [server] settings ([#2305](https://github.com/ripple/rippled/pull/2305))
- Improve log scrubbing ([#2358](https://github.com/ripple/rippled/pull/2358))
- Update rippled-example.cfg ([#2307](https://github.com/ripple/rippled/pull/2307))
- Force json commands to be objects ([#2319](https://github.com/ripple/rippled/pull/2319))
- Fix cmake clang build for sanitizers ([#2325](https://github.com/ripple/rippled/pull/2325))
- Allow account_objects RPC to filter by “check” ([#2356](https://github.com/ripple/rippled/pull/2356))
- Limit nesting of json commands ([#2326](https://github.com/ripple/rippled/pull/2326))
- Update Visual Studio build instructions ([#2355](https://github.com/ripple/rippled/pull/2355))
- Unit test that sign_for returns a correct hash ([#2333](https://github.com/ripple/rippled/pull/2333))
- Force boost static linking for MacOS builds ([#2334](https://github.com/ripple/rippled/pull/2334))
- Update MacOS build instructions ([#2342](https://github.com/ripple/rippled/pull/2342))
- Add dev docs generation to Jenkins ([#2343](https://github.com/ripple/rippled/pull/2343))
- Poll if process is still alive in Test.py ([#2290](https://github.com/ripple/rippled/pull/2290))
- Remove unused beast::currentTimeMillis() ([#2345](https://github.com/ripple/rippled/pull/2345))

### Bug Fixes

- Improve error message on mistyped command ([#2283](https://github.com/ripple/rippled/pull/2283))
- Add missing includes ([#2368](https://github.com/ripple/rippled/pull/2368))
- Link boost statically only when requested ([#2291](https://github.com/ripple/rippled/pull/2291))
- Unit test logging fixes ([#2293](https://github.com/ripple/rippled/pull/2293))
- Fix Jenkins pipeline for branches ([#2289](https://github.com/ripple/rippled/pull/2289))
- Avoid AppVeyor stack overflow ([#2344](https://github.com/ripple/rippled/pull/2344))
- Reduce noise in log ([#2352](https://github.com/ripple/rippled/pull/2352))
