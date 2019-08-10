# Software Ecosystem

The XRP Ledger is home to a deep, layered ecosystem of software projects powering and enabling an Internet of Value. It's impossible to list every project, tool, and business that interacts with the XRP Ledger, so this page only lists a few categories and highlights some central projects that are documented here on [xrpl.org](https://xrpl.org).

## Stack Levels

The [core of the XRP Ledger](#rippled-the-core-server) is a peer-to-peer network of always-on servers sharing transactions, engaging in the [consensus process](consensus.html) and processing [transactions](transaction-basics.html). Everything else in the XRP Ledger ecosystem is ultimately built on top of this peer-to-peer network, directly or indirectly.

[_Programming libraries_](#programming-libraries) exist in higher level software, where they are imported directly into program code, and contain premade implementations of routines to access the XRP Ledger.

[_Middleware services_](#middleware) provide indirect access to XRP Ledger data, frequently with their own data storage and processing.


### rippled: The Core Server

The peer-to-peer network at the heart of the XRP Ledger requires a highly-reliable, efficient server to enforce the rules of consensus and transaction processing. The reference implementation of this server software, [**`rippled`**](the-rippled-server.html) (pronounced "ripple-dee") is managed and published by Ripple, and available under a permissive open-source license so anyone can inspect and modify their own instance of the server.

Every instance of `rippled` syncs to the same network (unless it's configured to follow a [parallel network such as a test net](parallel-networks.html)) and has access to all communications across the network. Every `rippled` server on the network keeps a complete copy of the latest state data for the entire XRP Ledger, along with a slice of recent transactions and a record of the changes those transactions made, and every server processes every transaction independently while verifying that its outcome matches the rest of the network. Servers can be configured to keep more [ledger history](ledger-history.html) and to participate in the consensus process as a [validator](rippled-server-modes.html#reasons-to-run-a-validator).

This server exposes [`rippled` APIs](rippled-apis.html) for users to look up data, administer the server, and submit transactions.

### Programming Libraries

Programming libraries are not strictly required to access XRP Ledger data, since you can use HTTP or WebSocket to connect to the [`rippled` APIs](rippled-apis.html) directly. Libraries simplify some of the common work of accessing the `rippled` APIs, and convert the data into forms that are easier to understand and program with in the programming language of the library.

[RippleAPI for JavaScript](get-started-with-rippleapi-for-javascript.html) (also called "ripple-lib") is the longest-standing, most well-supported library for accessing the XRP Ledger. Many [middleware services](#middleware) use programming libraries like RippleAPI internally.

### Middleware

Middleware services are programs that consume the XRP Ledger APIs on one side and provide their own APIs on the other side. They provide a layer of abstraction to make it easier to build higher-level applications by providing some common functionality as a service.

Unlike [programming libraries](#programming-libraries), which are instantiated fresh and shut down with the program that imports them, middleware services typically stay running indefinitely, and may have their own databases (relational SQL databases or otherwise) and configuration files. Middleware services

The [Data API](data-api.html) is an example of a middleware service on top of the XRP Ledger. The Data API collects and transforms XRP Ledger data, so that you can query by time, filter by data type, or perform data analysis.

<!--{# TODO: Add XRP-API here when it has more documentation #}-->

### Apps and Services

## See Also

- [Technical FAQ](technial-faq.html)
- [XRPChat Links & Resources](https://www.xrpchat.com/links/) - Includes updated lists of gateways and exchanges, wallets and storage, apps, and more.
