---
html: rippled-server-modes.html
parent: networks-and-servers.html
seo:
    description: Learn about rippled server modes, including stock servers, validator servers, and rippled servers run in stand-alone mode.
labels:
  - Core Server
---
# rippled Server Modes

The `rippled` server software can run in several modes depending on its configuration, including:

- [**P2P Mode**](#p2p-mode) - This is the main mode of the server: it follows the peer-to-peer network, processes transactions, and maintains some amount of [ledger history](ledger-history.md). This mode can be configured to do any or all of the following roles:
    - [**Validator**](#validators) - Helps secure the network by participating in consensus.
    - [**API Server**](#api-servers) - Provides [API access](../../tutorials/http-websocket-apis/build-apps/get-started.md) to read data from the shared ledger, submit transactions, and watch activity in the ledger. Optionally, this can be a [**Full History Server**](#full-history-servers), which keeps a complete record of transaction and ledger history.
    - [**Hub Server**](#public-hubs) - Relays messages between many other members of the peer-to-peer network.
- [**Reporting mode**](#reporting-mode) - A specialized mode for serving API requests from a relational database. It does not participate in the peer-to-peer network, so you need to run a P2P Mode server and connect the reporting mode server using a trusted gRPC connection. 
- [**Stand-alone mode**](#stand-alone-mode) - An offline mode for testing. Does not connect to the peer-to-peer network or use consensus.

You can also run the `rippled` executable as a client application for accessing [`rippled` APIs](../../references/http-websocket-apis/index.md) locally. (Two instances of the same binary can run side-by-side in this case; one as a server, and the other running briefly as a client and then terminating.)

For information on the commands to run `rippled` in each of these modes, see the [Commandline Reference](../../infrastructure/commandline-usage.md).


## P2P Mode

P2P Mode is the main and default mode of the `rippled` server, and it can handle almost anything you might want your server to do. These servers form a peer-to-peer network that processes transactions and maintains the shared state of the XRP Ledger. If you want to submit transactions, read ledger data, or otherwise participate in the network, your requests must go through a P2P Mode server at some point.

P2P Mode servers can be further configured to provide additional functionality. A server running in P2P Mode with a minimally-modified config file is also called a _stock server_. Other configurations include:

- [Validator](#validators)
- [API Server](#api-servers)
- [Public Hubs](#public-hubs)

P2P Mode servers connect to [Mainnet](parallel-networks.md) by default.


### API Servers

All P2P Mode servers provide [APIs](../../references/http-websocket-apis/index.md) for purposes like submitting transactions, checking balances and settings, and administering the server. If you query the XRP Ledger for data or submit transactions for business use, it can be useful to [run your own server](index.md#reasons-to-run-your-own-server).

#### Full History Servers

Unlike some other blockchains, the XRP Ledger does not require servers to have a complete transaction history to know the current state and process new transactions. As a server operator, you decide how much [ledger history](ledger-history.md) to store at a time. However, a P2P Mode server can only answer API requests using the ledger history it has locally available. For example, if you keep six months of history, your server can't describe the outcome of a transaction from a year ago. API servers with [full history](ledger-history.md#full-history) can report all transactions and balances since the start of the XRP Ledger.


### Public Hubs

A hub server is a P2P Mode server with lots of [peer protocol connections](peer-protocol.md) to other servers. Hub servers, especially _public hubs_ that allow connections from the open internet, help the XRP Ledger network maintain efficient connectivity. Successful public hubs embody the following traits:

- Good bandwidth.

- Connections with a lot of reliable peers.

- Ability to relay messages reliably.

To configure your server as a hub, increase the maximum number of peers allowed and make sure you've [forwarded the appropriate ports](../../infrastructure/configuration/peering/forward-ports-for-peering.md) through your firewall and NAT (network address translation) router as appropriate.


### Validators

The robustness of the XRP Ledger depends on an interconnected web of _validators_ who each trust some other validators _not to collude_. In addition to processing each transaction and calculating ledger state exactly like other P2P Mode servers, validators participate actively in the [consensus protocol](../consensus-protocol/index.md). If you or your organization relies on the XRP Ledger, it is in your interest to contribute to the consensus process by running _one_ server as a validator.

Validation uses only a small amount of computing resources, but there is not much benefit to a single entity or organization running multiple validators because doing so does not provide more protections against collusion. Each validator identifies itself with a unique cryptographic key pair that must be carefully managed; multiple validators must not share a key pair. For these reasons, validation is disabled by default.

You can safely enable validation on a server that is also used for other purposes; this type of configuration is called an _all-purpose server_. Alternatively, you can run a _dedicated validator_ that does not perform other tasks, possibly in a [cluster](clustering.md) with other P2P Mode `rippled` servers.

For more information about running a validator, see [Run `rippled` as a Validator](../../infrastructure/configuration/server-modes/run-rippled-as-a-validator.md).


## Reporting Mode


Reporting mode is specialized mode for serving API requests more efficiently. In this mode, the server gets the latest validated ledger data over [gRPC](../../infrastructure/configuration/configure-grpc.md) from a separate `rippled` server running in P2P Mode, then loads that data into a relational database ([PostgreSQL](https://www.postgresql.org/)). The reporting mode server does not directly participate in the peer-to-peer network, though it can forward requests such as transaction submission to the P2P Mode server it uses.

Multiple reporting mode servers can share access to a PostgreSQL database and [Apache Cassandra](https://cassandra.apache.org/) cluster to serve a large amount of history without each server needing a redundant copy of all the data. Reporting mode servers provide this data through the same [`rippled` APIs](../../references/http-websocket-apis/index.md) with some slight changes to accommodate for the differences in how they store the underlying data.

Most notably, reporting mode servers do not report pending, non-validated ledger data or transactions. This limitation is relevant to certain use cases that rely on rapid access to in-flux data, such as performing arbitrage in the [decentralized exchange](../tokens/decentralized-exchange/index.md).

<!-- TODO: link setup steps for Reporting Mode when those are ready -->


## Stand-Alone Mode

In stand-alone mode, the server operates without connecting to the network and participating in the consensus process. Without the consensus process, you have to manually advance the ledger and no distinction is made between "closed" and "validated" ledgers. However, the server still provides API access and processes transactions the same. This enables you to:

- [Test the effects of Amendments](../../infrastructure/testing-and-auditing/test-amendments.md) before those Amendments have gone into effect across the decentralized network.
- [Create a new genesis ledger](../../infrastructure/testing-and-auditing/start-a-new-genesis-ledger-in-stand-alone-mode.md) from scratch.
- [Load an existing ledger version](../../infrastructure/testing-and-auditing/load-a-saved-ledger-in-stand-alone-mode.md) from disk, then replay specific transactions to re-create their outcomes or test other possibilities.


## See Also

- **Tutorials:**
    - [Configure `rippled`](../../infrastructure/configuration/index.md)
    - [Use rippled in Stand-Alone Mode](../../infrastructure/testing-and-auditing/index.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
