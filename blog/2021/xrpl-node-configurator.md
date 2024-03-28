---
category: 2021
theme:
    markdown:
        editPage:
            hide: true
date: 2021-04-14
labels:
    - Development
author: Javier Romero
---
# XRP Ledger Node Configurator

The XRP Ledger is open to anyone: all you need is a computer. For many people, using one of the many available client applications, user interfaces or portals is sufficient. But if you want to go beyond [exploring the ledger](https://livenet.xrpl.org/) or sending a payment, you need to run a server to participate as a node in the peer-to-peer network that manages the Ledger.

While the [docs](https://xrpl.org/manage-the-rippled-server.html) on xrpl.org make it fairly easy for anyone to spin up an XRP Ledger node, some nuanced configuration options can complicate the setup process. To help simplify this process, we've built the [XRPL Node Configurator](https://xrplf.github.io/xrpl-node-configurator/#/), a tool that walks you through setting up a node based on your use case.

<!-- BREAK -->

Before you set up an XRPL node, you need to know why you're setting up a server. Not everyone has the exact same needs. You might want to [set up rippled on your Mac](https://xrpl.org/build-run-rippled-macos.html) or [on your server](https://xrpl.org/build-run-rippled-ubuntu.html) to play around and familiarize yourself with the software, you may only need the server to run RPC commands or APIs locally or to test your application code, or you might want to help the network by [running a Validator](https://xrpl.org/run-rippled-as-a-validator.html).

Here are some questions you need to answer when configuring a node:

* Do you need full transaction history, none, or just some of it?  
* What ports and protocols do you need?  
* What database do you want to use?  
* What Node Size should you choose?  
* Are you following best practices for your use case? For example, if you're running a validator, you should not reveal your IP address or allow public WebSocket connections.
* Are you running your node on Mainnet, Testnet, or just for your testing?

Choosing suitable configuration settings means you can meet your requirements. But each decision also has potential tradeoffs that could impact performance and security.


## XRP Ledger Node Configurator to the Rescue

The XRP Ledger Node Configurator is a tool that, through a set of steps, will guide you to produce the required files to run a node.

While this tool doesn’t aim to cover all the possible configuration decisions you could be making, it helps to configure your node quickly and follow best practices.

It also provides contextual information about each decision and links to the official docs in some cases, as well as provides recommendations based on your decisions.

For example:

* If you are going to run a Validator server: you should probably use RocksDB, do not broadcast your address, and should not store more than about 300,000 ledgers (approximately two weeks' worth of historical data) in the ledger store.  
* If you want to run on Mainnet, you should probably choose a `Huge` node size.


## Server Decisions

It’s essential to understand what the primary purpose of your node is and to choose configuration settings accordingly. Let’s review the use cases for the following server decisions below:


### Dedicated Validator

You want to help keep the XRP Ledger network online and humming along smoothly. You might have different machines you use for other purposes, or you might actually send or receive XRPL transactions sparingly enough that you don’t run a machine for that purpose.

Maybe you don’t even use the XRPL much directly, but you’re associated with another entity that does. For example, a charity organization might run a validator while governments and companies it assists use the XRPL for transactions.

Most likely, you run this as a private peer even though it might be clustered with several other servers you also operate, such as a hub server and API servers.


### All-Purpose Server

You are using the XRPL, but you’re a small enough entity that you don’t want to maintain a whole farm of servers for all the things you do, so you have one high-quality server that does a little bit of everything you need.

This machine acts as a validator, provides admin APIs to authorized users to send and monitor for transactions as they arrive, keeps a moderate amount of ledger history to facilitate day-to-day use, and maybe even signs transactions that you send.


### Dedicated API Server

You use the XRP Ledger APIs extensively for your work, so you have one or even multiple machines dedicated to this purpose.

Maybe you’re tracking analytics, sending transactions at high volume, or providing a public server as a means of increasing your social capital. If you’re a medium-sized business, you might run one of these as a hot backup to your all-purpose server so that critical business functions can continue through a hardware failure or a partial outage.

This machine stores a moderate to high amount of history but has little to no unique persistent settings so additional exact clones can be spun up and down on short notice or even automatically. It doesn’t run as a validator because each validator must be unique and these servers are meant to be numerous and interchangeable.

It may or may not serve a public API to the open internet, and if you run several servers, they may be clustered with one another.


### Full History Server

You need to have all the history since the genesis block because you will be making use of that data. This server maintains special hardware specs that make it capable of storing the entire history of the XRP Ledger.

This also means it’s not cheap and replacements cannot be easily brought online because [full history](https://xrpl.org/ledger-history.html#full-history) is too large to quickly acquire/copy into a new instance.


### Hub Server

You want to contribute to the overall success of the XRP Ledger and you happen to have the resources to do that by improving the connectivity within the network. Your hub server has the resources, especially network bandwidth, to connect to many peers at the same time.

This server does not do much other than relay messages throughout the network and follow along with consensus, but some servers specialized for this role are very helpful to the overall health of the network.

Hub servers that are especially reliable may be hard-coded into the rippled source code as connection points where new servers can go to bootstrap their connectivity with the rest of the network.


### Development Machine

You are experimenting with XRP Ledger software, either developing rippled itself or some kind of integration or app on top of it. You don’t need your server to have production-quality stability and you are likely to start it up or shut it down frequently.

Retaining some history is nice so that you can look up transactions you sent or received a little while ago, but you don’t need to keep a large amount of history, and it’s not that bad if you wipe it and start from scratch. You might hop around between different network chains (e.g. Devnet, Testnet, etc.) or run experimental code.

You need an admin API, and you might experiment with any other features of the code, but you likely don’t have a cluster. It’s likely you may want to run with a higher level of logging than any other use case.


## Other Server Settings

In this step, you will also decide what protocols (Peer, WebSockets, JSON-RPC, gRPC…) you need to run, on which ports, and what kind of access they will allow.


### Protocol Settings

You know so far what your server is for and how you want to configure it but here you will make decisions at the protocol level:

* What Node size you want/need to run?
* How much ledger history you need?
* What Network do you want to run it on?
* What Validators do you want to trust?


### Storage

Choosing storage settings wisely is important to avoid future problems. Depending on what you run your server on, you might use RocksDB or NuDB, and you might need an SSD unit.

Another important decision to make is how much data do we want to purge automatically (or manually) if any.


### SSL

When running an XRP Ledger node, our server will be making client connections as well as receiving connections as a server. SSL settings are important to make sure we support secure outgoing and incoming connections.


### Other Settings

The tool also allows you to configure other settings like:

* Broadcasting your address
* Providing signing support
* Determining the level of logs you want to have
* Configuring the outgoing and incoming connections number


## Output

Once you are ready to go, click on ‘Generate’, and the tool will produce a zip file with all the files needed to run our server, and in cases where further configuration is required (like keys generation), instructions will be provided on how to do it:


### Configuration Files

`rippled.cfg`: main configuration file for your XRP node.

`validators.txt`: Validators configuration.


### Other files

`instructions.txt`: Follow up instructions to finish your node configuration.

`cfg.json`: JSON Export of the configuration. This is useful if later on, you want to load it in the tool to make amendments.


## It’s Open Source and Multi-language

The tool is built using [Vue.js](https://vuejs.org) and [Tailwind CSS](https://tailwindcss.com), it is Open Source and multi-language with initial support for English and Spanish.

It supports being run locally or from a web server.

Although it is the very first version, we encourage the community to participate and work on fixing bugs, adding new features, languages...


## Use It Today

Repo: <https://github.com/XRPLF/xrpl-node-configurator>

Github Pages: <https://xrplf.github.io/xrpl-node-configurator>
