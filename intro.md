# Introduction #

Ripple is a decentralized, peer-to-peer network for moving money using cryptographic technology. For more on the big picture, consult [ripple.com](https://ripple.com/) and check out [our blog](https://ripple.com/blog/).

To get started using Ripple, you can try running a few calls to retrieve public information from the [Ripple API Tool](https://ripple.com/tools/api) or you can start by downloading and running your own instance of `rippled`, the Ripple server. In order to get an account on the network, you will have to find someone to send you some amount of XRP in excess of the reserve requirement. 

# Ripple Client Applications #

The official web client for the Ripple Network is available at [https://ripple.com/client/](). You can also try signing up for [Ripple Trade](https://rippletrade.com/), which is still in development. In the future, official downloadable clients will also be available.

If you intend to act as a gateway, you will probably want to build custom client applications that your customers can use to manage their funds within the Ripple Network. To do that, you will need to integrate against the [Ripple APIs](#ripple-apis).

# Ripple APIs #

Connecting to the Ripple Network generally means connecting to a `rippled` server, sending it requests and commands, and listening to the responses. If you are building your own client, you have several options of interfaces that you can use to interact with the Ripple Network:

* You can set up [Ripple-REST](?p=ripple-rest-api) as a simple, intuitive, RESTful interface to `rippled`, although it does not have access to every feature of `rippled` and it requires a second Node.js server as an intermediate.
* You can connect directly using the [WebSocket API or the JSON-RPC API](?p=web-sockets-api). These APIs provide robust, full-featured access to the Ripple Network, at the cost of higher complexity.
** The `rippled` commandline can even be used as a simple JSON-RPC client application.
** The [ripple-lib Javascript client library](https://github.com/ripple/ripple-lib) makes it easier to connect to and use the WebSocket API. Client libraries for other languages are in progress.



