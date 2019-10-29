# Software Ecosystem

The XRP Ledger is home to a deep, layered ecosystem of software projects powering and enabling an Internet of Value. It's impossible to list every project, tool, and business that interacts with the XRP Ledger, so this page only lists a few categories and highlights some central projects that are documented here on [xrpl.org](https://xrpl.org).

## Stack Levels

[![Ecosystem diagram with the four layers: XRP Ledger peer-to-peer network on the bottom, Programming Libraries above that, Middleware next, and Apps and Services at the top](img/ecosystem.png)](img/ecosystem.png)

- The [basis of the XRP Ledger](#rippled-the-core-server) is a peer-to-peer network of always-on servers sharing transactions, engaging in the [consensus process](consensus.html) and processing [transactions](transaction-basics.html). Everything else in the XRP Ledger ecosystem is ultimately built on top of this peer-to-peer network, directly or indirectly.

- [_Programming Libraries_](#programming-libraries) exist in higher level software, where they are imported directly into program code, and contain premade implementations of routines to access the XRP Ledger.

- [_Middleware_](#middleware) provides indirect access to XRP Ledger data. Applications in this layer frequently have their own data storage and processing.

- [_Apps and Services_](#apps-and-services) provide user-level interaction with the XRP Ledger, or provide a basis for even higher-level apps and services.


### rippled: The Core Server

The peer-to-peer network at the heart of the XRP Ledger requires a highly-reliable, efficient server to enforce the rules of consensus and transaction processing. Ripple manages and publishes a reference implementation of this server software, called [**`rippled`**](the-rippled-server.html) (pronounced "ripple-dee"). The server is available under [a permissive open-source license](https://github.com/ripple/rippled/blob/develop/LICENSE), so anyone can inspect and modify their own instance of the server, and re-publish with few restrictions.

Every instance of `rippled` syncs to the same network (unless it's configured to follow a [parallel network such as a test net](parallel-networks.html)) and has access to all communications across the network. Every `rippled` server on the network keeps a complete copy of the latest state data for the entire XRP Ledger, along with a slice of recent transactions and a record of the changes those transactions made, and every server processes every transaction independently while verifying that its outcome matches the rest of the network. Servers can be configured to keep more [ledger history](ledger-history.html) and to participate in the consensus process as a [validator](rippled-server-modes.html#reasons-to-run-a-validator).

This server exposes [`rippled` APIs](rippled-api.html) for users to look up data, administer the server, and submit transactions.

### Programming Libraries

Programming libraries are not strictly required to access XRP Ledger data, since you can use HTTP or WebSocket to connect to the [`rippled` APIs](rippled-api.html) directly. Libraries simplify some of the common work of accessing the `rippled` APIs, and convert the data into forms that are easier to understand and program with in the programming language of the library.

[RippleAPI for JavaScript](get-started-with-rippleapi-for-javascript.html) (also called "ripple-lib") is the longest-standing, most well-supported library for accessing the XRP Ledger. Many [middleware services](#middleware) use programming libraries like RippleAPI internally.

### Middleware

Middleware services are programs that consume the XRP Ledger APIs on one side and provide their own APIs on the other side. They provide a layer of abstraction to make it easier to build higher-level applications by providing some common functionality as a service.

Unlike [programming libraries](#programming-libraries), which are instantiated fresh and shut down with the program that imports them, middleware services typically stay running indefinitely, and may have their own databases (relational SQL databases or otherwise) and configuration files.

The [Data API](data-api.html) is an example of a middleware service on top of the XRP Ledger. The Data API collects and transforms XRP Ledger data, so that you can query by time, filter by data type, or perform data analysis.

[XRP-API](xrp-api.html) is another middleware service. XRP-API manages secret keys and provides a more convenient RESTful interface to the XRP Ledger for apps in any programming language.


### Apps and Services

Atop the stack is where the truly exciting things happen. Apps and services provide a way for users and devices to connect to the XRP Ledger. At this level, [exchanges list XRP](list-xrp-in-your-exchange.html), [gateways issue other currencies](become-an-xrp-ledger-gateway.html) for use in the decentralized exchange, and wallets provide user interfaces for buying, selling, or just <s>HODLing</s> holding XRP. Many other possibilities exist, including additional services layered even higher.

A great way to build applications that are compatible with not only XRP but lots of other ways of denominating value is to use the [Interledger Protocol][] with settlement in XRP.

There are numerous other examples of projects using XRP and adjacent technologies to interact with users. Ripple's enterprise customers already have the option to use XRP through [on-demand liquidity services](https://www.ripple.com/ripplenet/on-demand-liquidity/). For more examples of businesses and software built on the XRP Ledger, see [Xpring Partners](https://xpring.io/#partners) or XRPChat's excellent [Links & Resources](https://www.xrpchat.com/links/) listing.


## See Also

- [Xpring Partners](https://xpring.io/#partners)
- [Technical FAQ](technical-faq.html)
- [XRPChat Links & Resources](https://www.xrpchat.com/links/) - Includes updated lists of gateways and exchanges, wallets and storage, apps, and more.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
