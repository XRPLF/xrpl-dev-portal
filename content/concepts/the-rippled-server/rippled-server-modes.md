---
html: rippled-server-modes.html
parent: the-rippled-server.html
blurb: Learn about rippled server modes, including stock servers, validator servers, and rippled servers run in stand-alone mode.
---
# rippled Server Modes

The `rippled` server software can run in several modes depending on its configuration, including:

- [**P2P Mode**](#p2p-mode) - This is the main mode of the server: it follows the peer-to-peer network, processes transactions, and maintains some amount of [ledger history](ledger-history.html). This mode can be configured to do any or all of the following roles:
    - [**Validator**](#validators) - Helps secure the network by participating in consensus
    - [**API Server**](#api-servers) - Provides [API access](get-started-using-http-websocket-apis.html) to read data from the shared ledger, submit transactions, and watch activity in the ledger. Optionally, this can be a [**Full History Server**](#full-history-servers), which keeps a complete record of transaction and ledger history.
    - [**Hub Server**](#public-hubs) - Relays messages between many other members of the peer-to-peer network.
- [**Reporting mode**](#reporting-mode) - A specialized mode for serving API requests from a relational database. Since it does not participate in the peer-to-peer network, it requires a connection to a P2P Mode server. [New in: rippled 1.7.0][]
- [**Stand-alone mode**](#stand-alone-mode) - An offline mode for testing. Does not connect to the peer-to-peer network or use consensus.

You can also run the `rippled` executable as a client application for accessing [`rippled` APIs](rippled-api.html) locally. (Two instances of the same binary can run side-by-side in this case; one as a server, and the other running briefly as a client and then terminating.)

For information on the commands to run `rippled` in each of these modes, see the [Commandline Reference](commandline-usage.html).


## P2P Mode

P2P Mode is the main and default mode of the `rippled` server, and it can handle almost anything you might want your server to do. These servers form a peer-to-peer network that processes transactions and maintains the shared state of the XRP Ledger. If you want to submit transactions, read ledger data, or otherwise participate in the network, your requests must go through a P2P Mode server at some point.

P2P Mode servers can be further configured to provide additional functionality. A server running in P2P Mode with a minimally-modified config file is also called a _stock server_. Other configurations include:

- [Validator](#validators)
- [API Server](#api-servers)
- [Public Hubs](#public-hubs)

P2P Mode servers connect to [Mainnet](parallel-networks.html) by default.


### API Servers

All P2P Mode servers provide [APIs](rippled-api.html) for purposes like submitting transactions, checking balances and settings, and administering the server. If you query the XRP Ledger for data or submit transactions for business use, it can be useful to [run your own server](the-rippled-server.html#reasons-to-run-your-own-server).

#### Full History Servers

Unlike some other blockchains, the XRP Ledger does not require servers to have a complete transaction history to know the current state and process new transactions. As a server operator, you decide how much [ledger history](ledger-history.html) to store at a time. However, a P2P Mode server can only answer API requests using the ledger history it has locally available. For example, if you keep six months of history, your server can't describe the outcome of a transaction from a year ago. API servers with [full history](ledger-history.html#full-history) can report all transactions and balances since the inception of the XRP Ledger.


### Public Hubs

A hub server is a P2P Mode server with lots of [peer protocol connections](peer-protocol.html) to other servers. Hub servers, especially _public hubs_ that allow connections from the open internet, help the XRP Ledger network maintain efficient connectivity. Successful public hubs embody the following traits:

- Good bandwidth.

- Connections with a lot of reliable peers.

- Ability to relay messages reliably.

To configure your server as a hub, increase the maximum number of peers allowed and make sure you've [forwarded the appropriate ports](forward-ports-for-peering.html) through your firewall and NAT (network address translation) router as appropriate.


### Validators

The robustness of the XRP Ledger depends on an interconnected web of _validators_ who each trust some other validators _not to collude_. In addition to processing each transaction and calculating ledger state just like other P2P Mode servers, validators participate actively in the [consensus protocol](consensus.html). If you or your organization relies on the XRP Ledger, it is in your interest to contribute to the consensus process by running _one_ server as a validator.

Validation uses only a small amount of computing resources, but there is not much benefit to a single entity or organization running multiple validators because doing so does not provide more protections against collusion. Each validator identifies itself with a unique cryptographic key pair that must be carefully managed; multiple validators must not share a key pair. For these reasons, validation is disabled by default.

You can safely enable validation on a server that is also used for other purposes; this type of configuration is called an _all-purpose server_. Alternatively, you can run a _dedicated validator_ that does not perform other tasks, possibly in a [cluster](clustering.html) with other P2P Mode `rippled` servers.

For more information about running a validator, see [Run `rippled` as a Validator](run-rippled-as-a-validator.html).


## Reporting Mode
[New in: rippled 1.7.0][]

Reporting mode is specialized mode for serving API requests more efficiently. In this mode, the server gets the latest validated ledger data over [gRPC](https://xrpl.org/configure-grpc.html) from a separate `rippled` server running in P2P Mode, then loads that data into a relational database ([PostgreSQL](https://www.postgresql.org/)). The reporting mode server does not directly participate in the peer-to-peer network, though it can forward requests such as transaction submission to the P2P Mode server it uses.

Multiple reporting mode servers can share access to a PostgreSQL database and [Apache Cassandra](https://cassandra.apache.org/) cluster to serve a large amount of history without each server needing a redundant copy of all the data. Reporting mode servers provide this data through the same [`rippled` APIs](rippled-api.html) with some slight changes to accommodate for the differences in how they store the underlying data.

Most notably, reporting mode servers do not report pending, non-validated ledger data or transactions. This limitation is relevant to certain use cases that rely on rapid access to in-flux data, such as performing arbitrage in the [decentralized exchange](decentralized-exchange.html).

<!-- TODO: link setup steps for Reporting Mode when those are ready -->


## Stand-Alone Mode

In stand-alone mode, the server operates without attempting to connect to the peer-to-peer network or follow the consensus process. The server still provides API access as normal and uses the same transaction processing engine, so you can test `rippled` behavior without being tied to the live network. For example, you can:

- [Test the effects of Amendments](amendments.html#testing-amendments) before those Amendments have gone into effect across the decentralized network.
- [Create a new genesis ledger](start-a-new-genesis-ledger-in-stand-alone-mode.html) from scratch.
- [Load an existing ledger version](load-a-saved-ledger-in-stand-alone-mode.html) from disk, then replay specific transactions to re-create their outcomes or test other possibilities.

**Caution:** In stand-alone mode, you must [manually advance the ledger](advance-the-ledger-in-stand-alone-mode.html).


## See Also

- **References:**
    - [Commandline Usage Reference](commandline-usage.html) - Detailed information on command-line options for all `rippled` server modes.
    - [ledger_accept method][] - Manually advance the ledger in stand-alone mode.
    - [feature method][] - Check [amendments](amendments.html) currently known and enabled.
- **Tutorials:**
    - [Configure `rippled`](configure-rippled.html)
        - [Run `rippled` as a Validator](run-rippled-as-a-validator.html)
    - [Use rippled in Stand-Alone Mode](use-stand-alone-mode.html):
        - [Start a New Genesis Ledger in Stand-Alone Mode](start-a-new-genesis-ledger-in-stand-alone-mode.html)
        - [Load a Saved Ledger in Stand-Alone Mode](load-a-saved-ledger-in-stand-alone-mode.html)
        - [Advance the Ledger in Stand-Alone Mode](advance-the-ledger-in-stand-alone-mode.html)


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
