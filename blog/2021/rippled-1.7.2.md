---
category: 2021
theme:
    markdown:
        editPage:
            hide: true
date: 2021-05-24
labels:
    - rippled Release Notes
---
# Introducing XRP Ledger version 1.7.2

Version 1.7.2 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release protects against the security issue [CVE-2021-3499 affecting OpenSSL](https://www.openssl.org/news/secadv/20210325.txt), adds an amendment to fix an issue with small offers not being properly removed from order books in some cases, and includes various other minor fixes.

This release supersedes version 1.7.1 and adds fixes for more issues that were discovered during the release cycle.

<!-- BREAK -->

## Action Required

This release introduces a new amendment to the XRP Ledger protocol: fixRmSmallIncreasedQOffers. This amendment is now **open for voting** according to the XRP Ledger's [amendment process](https://xrpl.org/amendments.html), which enables protocol changes following two weeks of >80% support from trusted validators.

**If you operate an XRP Ledger server,** then you should upgrade to version 1.7.2 within two weeks, to ensure service continuity. The exact time that protocol changes take effect depends on the voting decisions of the decentralized network.

If you operate an XRP Ledger validator, please [learn more about this amendment](https://xrpl.org/known-amendments.html) so you can make informed decisions about [how your validator votes](https://xrpl.org/configure-amendment-voting.html). If you take no action, your validator begins voting in favor of any new amendments as soon as it has been upgraded.


## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](https://xrpl.org/install-rippled.html).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-1.7.2-1.el7.x86_64.rpm) | `fbdc7a442b1cbcb04cacda40fc3eb0b6178329b5bf9ba3084b4728a0ed2d9b26` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_1.7.2-1_amd64.deb) | `71767ee966b3520796d03ffbdc14ddeeb44876097b897df0ff71b2da3e69e633` |

For other platforms, please [build from source](https://github.com/ripple/rippled/tree/master/Builds). The most recent commit in the git log should be the change setting the version:

```text
commit 34ee4ca0cb59037e840f7d454114701b534f0afa
Author: manojsdoshi <mdoshi@ripple.com>
Date:   Fri May 7 15:03:49 2021 -0700

    Set version to 1.7.2
```

## Change Log

### Bug Fixes

Version 1.7.2 has the following fixes:

- **fixRmSmallIncreasedQOffers Amendment:** This amendment fixes an issue where certain small offers can be left at the tip of an order book without being consumed or removed when appropriate and causes some payments and Offers to fail when they should have succeeded. ([#3827](https://github.com/ripple/rippled/pull/3827))

- **Adjust OpenSSL defaults and mitigate CVE-2021-3499:** Prior to this fix, servers compiled against a vulnerable version of OpenSSL could have a crash triggered by a malicious network connection. This fix disables renegotiation support in OpenSSL so that the `rippled` server is not vulnerable to this bug regardless of the OpenSSL version used to compile the server. This also removes support for deprecated TLS versions 1.0 and 1.1 and ciphers that are not part of TLS 1.2. ([79e69da](https://github.com/ripple/rippled/pull/3843/commits/79e69da3647019840dca49622621c3d88bc3883f))

- **Support HTTP health check in reporting mode:** Enables the [Health Check special method](https://xrpl.org/health-check.html) when running the server in the new [Reporting Mode][] introduced in 1.7.0. ([9c8cadd](https://github.com/ripple/rippled/pull/3843/commits/9c8caddc5a197bdd642556f8beb14f06d53cdfd3))

- **Maintain compatibility for forwarded RPC responses:** Fixes a case in API responses from servers in [Reporting Mode][], where requests that were forwarded to a P2P-mode server would have the `result` field nested inside another `result` field. ([8579eb0](https://github.com/ripple/rippled/pull/3843/commits/8579eb0c191005022dcb20641444ab471e277f67))

- **Add `load_factor` in reporting mode:** Adds a `load_factor` value to the [server info method response](https://xrpl.org/server_info.html) when running the server in [Reporting Mode][] so that the response is compatible with the format returned by servers in P2P mode (the default). ([430802c](https://github.com/ripple/rippled/pull/3843/commits/430802c1cf6d4179f2249a30bfab9eff8e1fa748))

- **Properly encode metadata from tx RPC command:** Fixes a problem where transaction metadata in the [tx API method response](https://xrpl.org/tx.html) would be in JSON format even when binary was requested. ([7311629](https://github.com/ripple/rippled/pull/3843/commits/73116297aa94c4acbfc74c2593d1aa2323b4cc52))

- **Updates to Windows builds:** When building on Windows, use `vcpkg` 2021 by default and add compatibility with MSVC 2019. ([36fe196](https://github.com/ripple/rippled/pull/3843/commits/36fe1966c3cd37f668693b5d9910fab59c3f8b1f), [30fd458](https://github.com/ripple/rippled/pull/3843/commits/30fd45890b1d3d5f372a2091d1397b1e8e29d2ca))


[Reporting Mode]: https://xrpl.org/rippled-server-modes.html#reporting-mode

## Contributions

### GitHub

The public git repository for `rippled` is hosted on GitHub at <https://github.com/ripple/rippled>.

We welcome contributions, big and small, and invite everyone to join the community
of XRP Ledger developers and help us build the Internet of Value.


### Credits
The following people contributed directly to this release:

- CJ Cobb <ccobb@ripple.com>
- Edward Hennis <ed@ripple.com>
- Manoj Doshi <mdoshi@ripple.com>
- Mark Travis <mtravis@ripple.com>
- Nik Bougalis <nikb@bougalis.net>
- Scott Determan <scott.determan@yahoo.com>

#### Lifetime Contributors

The following is the list of people who made code contributions, large and small, to XRP Ledger prior to the release of 1.7.2:

Aishraj Dahal, Alex Chung, Alex Dupre, Alloy Networks, Andrey Fedorov, Arthur Britto, Bharath Chari, Bob Way, Brad Chase, Brandon Wilson, Bryce Lynch, Carl Hua, Casey Bodley, Christian Ramseier, CJ Cobb, crazyquark, Crypto Brad Garlinghouse, David Grogan, David 'JoelKatz' Schwartz, Devon White, Donovan Hide, Edward Hennis, Elliot Lee, Eric Lombrozo, Ethan MacBrough, Evan Hubinger, Frank Cash, Gábor Lipták, Gregory Tsipenyuk, Howard Hinnant, Ian Roskam, invalidator, Jack Bond-Preston, James Fryman, jatchili, Jcar, Jed McCaleb, Jeff Trull, Jeroen Meulemeester, Jesper Wallin, Joe Loser, Johanna Griffin, John Freeman, John Northrup, Joseph Busch, Josh Juran, Justin Lynn, Keaton Okkonen, Kirill Fomichev, Lazaridis, Lieefu Way, Luke Cyca, Manoj Doshi, Mark Travis, Markus Alvila, Markus Teufelberger, Mayur Bhandary, Miguel Portilla, Mike Ellery, MJK, Mo Morsi, Nicholas Dudfield, Nikolaos D. Bougalis, Niraj Pant, p2peer, Patrick Dehne, Peng Wang, Roberto Catini, Rome Reginelli, Scott Determan, Scott Schurr, S. Matthew English, Stefan Thomas, ShangyanLi, The Gitter Badger, Ties Jan Hefting, Tim Lewkow, Tom 'Swirly' Ritchford, Torrie Fischer, Vahe Hovhannisyan, Vinnie Falco, Vishwas Patil, Warren Paul Anderson, Will, wltsmrz, Wolfgang Spraul, Yana Novikova and Yusuf Sahin HAMZA.

For a real-time view of all contributors, including links to the commits made by each, please visit the "Contributors" section of the GitHub repository: <https://github.com/ripple/rippled/graphs/contributors>.

We welcome external contributions and are excited to see the broader XRP Ledger community continue to grow and thrive.
