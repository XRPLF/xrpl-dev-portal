---
html: software-ecosystem.html
parent: introduction.html
blurb: Get an overview of what XRP Ledger software is out there and how it fits together.
labels:
  - Core Server
---
# Software Ecosystem

The XRP Ledger is home to a deep, layered ecosystem of software projects powering and enabling an Internet of Value. It's impossible to list every project, tool, and business that interacts with the XRP Ledger, so this page only lists a few categories and highlights some central projects that are documented on this website.
![The XRPL Ecosystem](img/ecosystem-apps-and-services.svg)

## Stack Levels

- [_Core Servers_](#core-servers) form the basis of the XRP Ledger, a peer-to-peer network relaying and processing transactions at all times.

- [_Client Libraries_](#client-libraries) exist in higher level software, where they are imported directly into program code, and contain methods to access the XRP Ledger.

- [_Middleware_](#middleware) provides indirect access to XRP Ledger data. Applications in this layer often have their own data storage and processing.

- [_Apps and Services_](#apps-and-services) provide user-level interaction with the XRP Ledger, or provide a basis for even higher-level apps and services.


### Core Servers

The peer-to-peer network at the heart of the XRP Ledger requires a highly-reliable, efficient server to enforce the rules of consensus and transaction processing. The XRP Ledger Foundation publishes a reference implementation of this server software, called [**`rippled`**](xrpl-servers.html) (pronounced "ripple-dee"). The server is available under [a permissive open-source license](https://github.com/XRPLF/rippled/blob/develop/LICENSE.md), so anyone can inspect and modify their own instance of the server, and re-publish with few restrictions.

![Core Servers](img/ecosystem-peer-to-peer.svg)

Every core server syncs to the same network (unless it's configured to follow a [test network](parallel-networks.html)) and has access to all communications across the network. Every server on the network keeps a complete copy of the latest state data for the entire XRP Ledger, along with recent transactions and a record of the changes those transactions made, and every server processes every transaction independently while verifying that its outcome matches the rest of the network. Servers can be configured to keep more [ledger history](ledger-history.html) and to participate in the consensus process as a [validator](rippled-server-modes.html#validators).

Core servers expose [HTTP / WebSocket APIs](http-websocket-apis.html) for users to look up data, administer the server, and submit transactions. Some servers also serve HTTP / WebSocket APIs but don't connect directly to the peer-to-peer network and don't process transactions or participate in consensus. These servers, such as `rippled` servers running in Reporting Mode and Clio servers, rely on a core server in P2P mode to process transactions.


### Client Libraries

Libraries simplify some of the common work of accessing the XRP Ledger, usually through the HTTP / WebSocket APIs. They convert the data into forms that are more familiar and convenient for various programming languages, and include implementations of common operations. 

![Client Libraries](img/ecosystem-client-libraries.svg)

One core feature of most client libraries is signing transactions locally, so users never have to send their private key across any network.

Many middleware services use client libraries internally.

See [Client Libraries](client-libraries.html) for some information about currently available client libraries.


### Middleware

Middleware services are programs that consume the XRP Ledger APIs on one side and provide their own APIs on the other side. They provide a layer of abstraction to make it easier to build higher-level applications by providing some common functionality as a service.

![Middleware](img/ecosystem-middleware.svg)

Unlike client libraries, which are instantiated fresh and shut down with the program that imports them, middleware services typically stay running indefinitely, and may have their own databases (relational SQL databases or otherwise) and configuration files. Some are available as cloud services with various pricing or usage limitations.


### Apps and Services

Atop the stack is where the truly exciting things happen. Apps and services provide a way for users and devices to connect to the XRP Ledger. Services like private exchanges, token issuers, marketplaces, interfaces to the decentralized exchange, and wallets provide user interfaces for buying, selling, and trading various assets including XRP and tokens of all kinds. Many other possibilities exist, including additional services layered even higher.

![Apps and Services](img/ecosystem-apps-and-services.svg)

See [Use Cases](use-cases.html) for some examples that can be built at or above this layer.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
