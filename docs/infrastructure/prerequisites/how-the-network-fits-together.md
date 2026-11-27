---
seo:
    description: An operator's introduction to the XRP Ledger network - what the server roles are, why they differ, how they connect, and what to read before you run one.
labels:
  - Core Server
---
# How the Network Fits Together

If you can run a Linux server but have never run an XRP Ledger node, start here. This page explains how the pieces of the network relate to each other from an operator's seat, and which concept pages to read before you choose a role. It explains nothing in depth; every section links to the page that does.

Two terms first. The ledger is the shared record of every account and balance; a new version of it closes every few seconds, and each version is also called a ledger. A node is any server that takes part in maintaining that record.

## One program, several roles

Every node on the XRP Ledger network runs the same server software, `xrpld` (formerly `rippled`). A server running with the default configuration is called a stock node. A validator, a public hub, and a full history server aren't different programs from a stock node. They are the same program with different configuration, and with a different commitment from the person running it. A validator is a stock node with a signing key and a public uptime record, not a bigger machine. A hub is a stock node whose operator has chosen to carry other people's connections.

The one exception is [Clio](../../concepts/networks-and-servers/the-clio-server.md). Clio is a separate API server. It doesn't join the peer-to-peer network at all; it reads validated data from an `xrpld` server you point it at, stores that data compactly, and answers API queries so the `xrpld` doesn't have to.

For the roles the server itself distinguishes, see [xrpld Server Modes](../../concepts/networks-and-servers/xrpld-server-modes.md).

## How a server joins the network

The network has no center. Each server connects to a handful of other servers, called peers, and messages spread from peer to peer. A new server gets its first peers from the servers you name in its configuration or, if you name none, from a short built-in list of public hubs. After that it discovers more by asking its peers, and when it restarts it reconnects to the peers it had before.

Public hubs are ordinary servers whose operators accept a large number of inbound connections, so the network always has well-connected points to join through. A short list of them is built into the server to bootstrap a fresh install, used only when `[ips]` and `[ips_fixed]` are both empty; see [Connect to Public Hubs](../configuration/peering/connect-to-public-hubs.md) for who runs them and how to use them.

A server can also be configured as a private peer: it connects only to servers you name, and asks them not to pass its address on to anyone else. It is one way to run a validator, as the next section explains. The mechanics are in [Peer Protocol](../../concepts/networks-and-servers/peer-protocol.md).

## What a validator is, and what trust means

A validator is a server that signs its own view of each new ledger and sends that signature to its peers. Signing alone gives it no influence. Every server keeps its own list of the validators it trusts, called its Unique Node List or UNL, and doesn't count signatures from anyone not on it. A validator nobody trusts has no say in which ledger is final. Its signatures still travel the network (servers relay and process untrusted validations by default, they just don't count them), so explorers and other operators can see what it saw, and a long public record of agreeing with the network is how a validator comes to be trusted at all.

Nearly every server uses the two validator lists published by the XRP Ledger Foundation and by Ripple, and those lists overlap almost entirely. So when operators say a validator is "on the UNL" or "on the dUNL" (the default UNL), they mean it is on those published lists. Getting there is a matter of record, not configuration: publishers add validators that have run reliably and visibly for a long time, and the XRP Ledger Foundation takes applications by pull request to its [XRPLF/unl repository](https://github.com/XRPLF/unl). See [Unique Node List](../../concepts/consensus-protocol/unl.md).

Being trusted changes how a validator should be run. Its uptime and every restart are visible to the whole network, and it can attract attacks meant to knock it offline. The strongest configuration, and the one this guide recommends, is a private peer that connects only to a few stock nodes the same operator runs, called its proxies, which face the network on its behalf. Validators also run in production behind a small number of public hubs that reserve them a slot, as public peers with protections, and outbound only; [Validator Security](../configuration/security/validator.md) compares all four. A single quiet validator can't stall the network, because validating a ledger needs agreement from 80% of the trusted validators. If one stays quiet, the network temporarily stops counting it, so the next ones to go quiet don't push the rest below that 80%; that mechanism is the [Negative UNL](../../concepts/consensus-protocol/negative-unl.md). How signatures become a confirmed ledger is explained in [Consensus Principles and Rules](../../concepts/consensus-protocol/consensus-principles-and-rules.md).

## Where history lives

Because a new ledger closes every few seconds, the history grows continuously. Most servers keep only recent ledgers and delete older ones on a schedule, a process called online deletion. That is the normal, intended state of a server: a validator needs only the last few minutes of history to do its job.

A small number of operators keep every ledger the network still has, back to index 32570; the ledgers before it were lost early in the network's history, and no server holds them. These full history servers exist so that anyone can ask about any transaction that ever happened. They need tens of terabytes and take months to build, which is why [Full History](../configuration/server-modes/full-history.md) is its own role. A Clio server that must answer questions about old ledgers is filled once from one of them, or from a snapshot of one; after that, ordinary stock nodes keep it current.

How much history your server keeps is the biggest single decision behind its disk size. See [Ledger History](../../concepts/networks-and-servers/ledger-history.md) for the concept and [Configure Online Deletion](../configuration/data-retention/configure-online-deletion.md) for the setting.

## Staying current

The network changes its own rules through amendments. Validators vote on each proposed change, and once a change has enough support for long enough it becomes part of the protocol. A server that is too old to understand an enabled amendment stops processing new ledgers until it is upgraded. You get notice first: once an amendment your server doesn't know reaches a majority, admin `server_info` shows a warning, with the expected activation date where the server can compute it, and the amendment then needs two weeks of majority before it is enabled. This is the one obligation shared by every role: you update the server on the network's schedule, not on yours. See [Amendments](../../concepts/networks-and-servers/amendments.md), and in particular [Amendment Blocked Servers](../../concepts/networks-and-servers/amendments.md#amendment-blocked-servers).

## How the roles work together

[{% inline-svg file="/docs/img/infra-network-roles.svg" /%}](/docs/img/infra-network-roles.svg "Diagram: clients, stock nodes and Clio, public hubs, validators behind proxies, and full history servers")

Read the diagram from left to right. Applications and wallets talk to stock nodes and to Clio; that is where transactions enter and where queries are answered. Stock nodes connect into the peer network, usually through public hubs, and relay what they receive. Validators sit at the far side, shown here in the strongest topology: behind proxies their operator runs, connected to nothing else. A transaction submitted on the left reaches the validators through the mesh, and their signatures on the resulting ledger flow back the same way; every server builds that ledger itself and checks it against them. Full history servers are stock nodes that never delete, and a full history Clio fills its own database from one when it is built.

Every box in the diagram except Clio is the same software. What differs is the commitment: a stock node gives you your own trusted view of the ledger and your own path to submit transactions; a hub gives the network carrying capacity; a validator puts an identity and its uptime on public record; a full history server keeps the complete record. The pages that follow are organized by those roles.

## Before you continue

Read these in order. The role pages assume you have.

1. [xrpld Server Modes](../../concepts/networks-and-servers/xrpld-server-modes.md): what the server can be configured to do. Everyone.
2. [Peer Protocol](../../concepts/networks-and-servers/peer-protocol.md): how servers find and talk to each other, and what a private peer is. Everyone.
3. [Unique Node List](../../concepts/consensus-protocol/unl.md): what trust means and who decides it. Essential for validators; background for other roles.
4. [Consensus Principles and Rules](../../concepts/consensus-protocol/consensus-principles-and-rules.md): how a ledger becomes final. Essential for validators; background for other roles.
5. [Ledger History](../../concepts/networks-and-servers/ledger-history.md): what a server keeps and why most of it is deleted. Everyone.
6. [Amendments](../../concepts/networks-and-servers/amendments.md): how the rules change and why you must keep up. Everyone.

Then choose a role: [Node Types](node-types.md).
