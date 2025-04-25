---
category: 2024
date: "2024-12-12"
template: '../../@theme/templates/blogpost'
seo:
    title: Introducing Clio version 2.3.0
    description: Version 2.3.0 of Clio, an XRP Ledger API server optimized for HTTP and WebSocket API calls, is now available. This release adds new features and bug fixes.
labels:
    - Clio Release Notes
markdown:
    editPage:
        hide: true
---

## Introducing Clio version 2.3.0

Version 2.3.0 of Clio, an XRP Ledger API server optimized for HTTP and WebSocket API calls, is now available. This release adds new features and bug fixes.

## Notable New Features

- [AmendmentCenter: central place to query amendment-related data](https://github.com/XRPLF/clio/pull/1418)
- [`ledger_index` API: returns latest closed ledger index before the given date](https://github.com/XRPLF/clio/pull/1503)
- [More verbose forwarding errors](https://github.com/XRPLF/clio/pull/1523)
- [Native `feature` API](https://github.com/XRPLF/clio/pull/1526)
- [Add `force_forward` field in requests](https://github.com/XRPLF/clio/pull/1647)
- [Cache on `server_info` API](https://github.com/XRPLF/clio/pull/1671)

## Amendment Support

The following amendments have been introduced since Clio 2.2.5 and have transaction model changes. Clio 2.3.0 is built with `libxrpl` 2.3.0, which supports these amendments.

- [AMMClawback](https://xrpl.org/resources/known-amendments#ammclawback)
- [Credentials](https://xrpl.org/resources/known-amendments#credentials)
- [MPTokensV1](https://xrpl.org/resources/known-amendments#mptokensv1)
- [NFTokenMintOffer](https://xrpl.org/resources/known-amendments#nftokenmintoffer)

If these amendments are enabled and you have not upgraded Clio to 2.3.0 or newer, the ETL will be amendment blocked and new ledgers will not be processed.

To check the current voting status of these amendments on Mainnet, see the [XRPL Amendments Dashboard](https://livenet.xrpl.org/amendments).

## Install / Upgrade

| Package |
|:--------|
| [Clio server Linux package](https://github.com/XRPLF/clio/releases/download/2.3.0/clio_server_Linux.zip) |

For other platforms, please [build from source](https://github.com/XRPLF/clio/releases/tag/2.3.0). The most recent commit in the git log should be:

```text
Author: Alex Kremer <akremer@ripple.com>
Date:   Tue Sep 10 22:33:11 2024 +0100

    fix: Add upper bound to limit
```

## What's Changed

See the [Full Changelog on GitHub](https://github.com/XRPLF/clio/compare/2.2.5...2.3.0).

### Features

- AmendmentCenter [(#1418)](https://github.com/XRPLF/clio/pull/1418)
- Ledger index [(#1503)](https://github.com/XRPLF/clio/pull/1503)
- More verbose forwarding errors [(#1523)](https://github.com/XRPLF/clio/pull/1523)
- Native Feature RPC [(#1526)](https://github.com/XRPLF/clio/pull/1526)
- Add stop to WorkQueue [(#1600)](https://github.com/XRPLF/clio/pull/1600)
- Move/copy support in async framework [(#1609)](https://github.com/XRPLF/clio/pull/1609)
- Delete-before support in data removal tool [(#1649)](https://github.com/XRPLF/clio/pull/1649)
- Add `force_forward` field to request [(#1647)](https://github.com/XRPLF/clio/pull/1647)
- Server info cache [(#1671)](https://github.com/XRPLF/clio/pull/1671)
- ETLng Registry [(#1713)](https://github.com/XRPLF/clio/pull/1713)
- Upgrade to `libxrpl 2.3.0-rc1` [(#1718)](https://github.com/XRPLF/clio/pull/1718)
- Implement MPT changes [(#1147)](https://github.com/XRPLF/clio/pull/1147)
- Add Support Credentials for Clio [(#1712)](https://github.com/XRPLF/clio/pull/1712)
- Upgrade to `libxrpl 2.3.0-rc2` [(#1736)](https://github.com/XRPLF/clio/pull/1736)

### Bug Fixes

- Duplicate messages when subscribe both accounts and proposed_accounts ([#1415](https://github.com/XRPLF/clio/pull/1415))
- Remove unused file ([#1496](https://github.com/XRPLF/clio/pull/1496))
- Fix extra brackets in warnings ([#1519](https://github.com/XRPLF/clio/pull/1519))
- Fix the ledger_index timezone issue ([#1522](https://github.com/XRPLF/clio/pull/1522))
- Change the field name from "close_time_iso" to "closed ([#1531](https://github.com/XRPLF/clio/pull/1531))
- Compatible `feature` response ([#1539](https://github.com/XRPLF/clio/pull/1539))
- Relax error when `full` or `accounts` set to `false` ([#1540](https://github.com/XRPLF/clio/pull/1540))
- Add more account check ([#1543](https://github.com/XRPLF/clio/pull/1543))
- Support deleted object in ledger_entry ([#1483](https://github.com/XRPLF/clio/pull/1483))
- Fail to deduplicate the same nfts in `ttNFTOKEN_CANCEL_OFFER` ([#1542](https://github.com/XRPLF/clio/pull/1542))
- Static linkage ([#1551](https://github.com/XRPLF/clio/pull/1551))
- NftData unique bug ([#1550](https://github.com/XRPLF/clio/pull/1550))
- LedgerEntryNotExist unittest failure ([#1564](https://github.com/XRPLF/clio/pull/1564))
- Remove cassandra from log ([#1557](https://github.com/XRPLF/clio/pull/1557))
- Account_objects returns error when filter does not make sense ([#1579](https://github.com/XRPLF/clio/pull/1579))
- Use doxygen 1.12 ([#1587](https://github.com/XRPLF/clio/pull/1587))
- Support conan channels in `check_libxrpl` flow ([#1583](https://github.com/XRPLF/clio/pull/1583))
- AccountNFT with invalid marker ([#1589](https://github.com/XRPLF/clio/pull/1589))
- Not forward admin API ([#1628](https://github.com/XRPLF/clio/pull/1628))
- Fix logging in SubscriptionSource ([#1617](https://github.com/XRPLF/clio/pull/1617)) ([#1632](https://github.com/XRPLF/clio/pull/1632))
- Subscription source bugs fix ([#1626](https://github.com/XRPLF/clio/pull/1626)) ([#1633](https://github.com/XRPLF/clio/pull/1633))
- Don't forward ledger API if 'full' is a string ([#1640](https://github.com/XRPLF/clio/pull/1640))
- Add more restrictions to admin fields ([#1643](https://github.com/XRPLF/clio/pull/1643))
- No restriction on type field ([#1644](https://github.com/XRPLF/clio/pull/1644))
- Pre-push tag ([#1614](https://github.com/XRPLF/clio/pull/1614))
- Upgrade Cassandra driver ([#1646](https://github.com/XRPLF/clio/pull/1646))
- Add no lint to ignore clang-tidy ([#1660](https://github.com/XRPLF/clio/pull/1660))
- Workaround for gcc12 bug with defaulted destructors ([#1666](https://github.com/XRPLF/clio/pull/1666))
- Deletion script will not OOM ([#1679](https://github.com/XRPLF/clio/pull/1679))
- Remove log ([#1694](https://github.com/XRPLF/clio/pull/1694))
- Example config syntax ([#1696](https://github.com/XRPLF/clio/pull/1696))
- Fix timer spurious calls ([#1700](https://github.com/XRPLF/clio/pull/1700))
- Fix issues clang-tidy found ([#1708](https://github.com/XRPLF/clio/pull/1708))
- Add queue size limit for websocket ([#1701](https://github.com/XRPLF/clio/pull/1701))
- Support Delete NFT ([#1695](https://github.com/XRPLF/clio/pull/1695))
- Credential error message ([#1738](https://github.com/XRPLF/clio/pull/1738))
- Authorized_credential elements in array not objects bug ([#1744](https://github.com/XRPLF/clio/pull/1744)) ([#1747](https://github.com/XRPLF/clio/pull/1747))
- Add upper bound to limit

### Refactor

- Structure global validators better ([#1484](https://github.com/XRPLF/clio/pull/1484))
- Separate fixtures ([#1495](https://github.com/XRPLF/clio/pull/1495))
- Refactor main ([#1555](https://github.com/XRPLF/clio/pull/1555))
- Clio Config ([#1544](https://github.com/XRPLF/clio/pull/1544))
- Move interval timer into a separate class ([#1588](https://github.com/XRPLF/clio/pull/1588))
- Create interface for DOSGuard ([#1602](https://github.com/XRPLF/clio/pull/1602))
- Subscription Manager uses async framework ([#1605](https://github.com/XRPLF/clio/pull/1605))
- Remove SubscriptionManagerRunner ([#1623](https://github.com/XRPLF/clio/pull/1623))
- Clio Config ([#1593](https://github.com/XRPLF/clio/pull/1593))
- Coroutine based webserver ([#1699](https://github.com/XRPLF/clio/pull/1699))

### Documentation

- Mention conventional commits ([#1490](https://github.com/XRPLF/clio/pull/1490))
- Use non-admin WS port ([#1592](https://github.com/XRPLF/clio/pull/1592))
- Document how to build with custom libxrpl ([#1572](https://github.com/XRPLF/clio/pull/1572))

### Testing

- Add more tests for warnings ([#1532](https://github.com/XRPLF/clio/pull/1532))
- Make ForwardingSource tests more stable ([#1607](https://github.com/XRPLF/clio/pull/1607))
- Add test for WsConnection for ping response ([#1619](https://github.com/XRPLF/clio/pull/1619))

### Miscellaneous Tasks

- Added conventional commits check ([#1487](https://github.com/XRPLF/clio/pull/1487))
- Upgrade to libxrpl 2.3.0-b1 ([#1489](https://github.com/XRPLF/clio/pull/1489))
- Add permissions to pr title check workflow ([#1491](https://github.com/XRPLF/clio/pull/1491))
- Turn off PR labelling ([#1492](https://github.com/XRPLF/clio/pull/1492))
- Clio docker image ([#1509](https://github.com/XRPLF/clio/pull/1509))
- Fix nightly ([#1514](https://github.com/XRPLF/clio/pull/1514))
- Fix bugs in nightly docker publishing ([#1520](https://github.com/XRPLF/clio/pull/1520))
- Setup dependabot for github-actions ([#1556](https://github.com/XRPLF/clio/pull/1556))
- Update clang-format and ccache ([#1559](https://github.com/XRPLF/clio/pull/1559))
- Bump peter-evans/create-pull-request from 5 to 6 ([#1560](https://github.com/XRPLF/clio/pull/1560))
- Bump crazy-max/ghaction-import-gpg from 5 to 6 ([#1561](https://github.com/XRPLF/clio/pull/1561))
- Bump actions/configure-pages from 4 to 5 ([#1562](https://github.com/XRPLF/clio/pull/1562))
- Bump wandalen/wretry.action from 1.4.10 to 3.5.0 ([#1563](https://github.com/XRPLF/clio/pull/1563))
- Fix errors in docker image uploading ([#1570](https://github.com/XRPLF/clio/pull/1570))
- Fix nightly release workflow ([#1577](https://github.com/XRPLF/clio/pull/1577))
- Bump peter-evans/create-pull-request from 6 to 7 ([#1636](https://github.com/XRPLF/clio/pull/1636))
- Revert Cassandra driver upgrade ([#1656](https://github.com/XRPLF/clio/pull/1656))
- Update libxrpl to 2.3.0-b4 ([#1667](https://github.com/XRPLF/clio/pull/1667))
- Apply commits for `2.3.0-b4` ([#1725](https://github.com/XRPLF/clio/pull/1725))
- Bump ytanikin/PRConventionalCommits from 1.2.0 to 1.3.0 ([#1670](https://github.com/XRPLF/clio/pull/1670))
- Upgrade to llvm 19 tooling ([#1681](https://github.com/XRPLF/clio/pull/1681))
- Remove unused static variables ([#1683](https://github.com/XRPLF/clio/pull/1683))
- Add counter for total messages waiting to be sent ([#1691](https://github.com/XRPLF/clio/pull/1691))
- Fix nightly build ([#1709](https://github.com/XRPLF/clio/pull/1709))
- Bump wandalen/wretry.action from 3.5.0 to 3.7.0 ([#1714](https://github.com/XRPLF/clio/pull/1714))
- Bump wandalen/wretry.action from 3.7.0 to 3.7.2 ([#1723](https://github.com/XRPLF/clio/pull/1723))
- Add relevant changes from develop ([#1762](https://github.com/XRPLF/clio/pull/1762))


## Feedback

The Clio open-source project is seeking feedback and engagement from the XRPL community.

- To provide feedback, please [fill out this survey](https://forms.gle/fnGPTUCAdmEzkFy57).
- To report an issue or propose a new idea, please [open an issue](https://github.com/XRPLF/clio/issues).
