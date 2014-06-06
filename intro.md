# Introduction #

Ripple is a decentralized, peer-to-peer network for moving value using cryptographic technology. For more on the big picture, consult [ripple.com](https://ripple.com/) and check out [our blog](https://ripple.com/blog/). 

# Ripple Client Applications #

The official web client for the Ripple Network is available at [https://ripple.com/client/](). In order to get an account on the network, you will have to find someone to give or sell you some amount of XRP in excess of the reserve requirement. You can also try signing up for [Ripple Trade](https://rippletrade.com/), which is still in development. In the future, official downloadable clients will also be available.

# Ripple APIs #

If you intend to act as a gateway, or if you are a developer with great ideas of how to use the Ripple Network, you will probably want to build a custom client application that you or your customers can use to send, receive, or observe funds on the Ripple Network.

Connecting to the Ripple Network generally means connecting to [`rippled`](https://github.com/ripple/rippled) (pronounced "ripple-dee"), the Ripple server software, sending it requests and commands, and listening to the responses. To get started, you can try running a few calls to retrieve public information from the [Ripple API Tool](https://ripple.com/tools/api) or you try downloading and running your own instance of `rippled`. 

If you are building your own client, you have several options of interfaces that you can use to interact with the Ripple Network:

* You can set up [Ripple-REST](?p=ripple-rest-api) as a simple, intuitive, RESTful interface to `rippled`, although it does not have access to every feature of `rippled` and it requires a second Node.js server as an intermediate.
* You can connect directly using the [WebSocket API or the JSON-RPC API](?p=web-sockets-api). These APIs provide robust, full-featured access to the Ripple Network, at the cost of higher complexity.
  * The `rippled` commandline can even be used as a simple JSON-RPC client application.
  * The [ripple-lib Javascript client library](https://github.com/ripple/ripple-lib) is a reference implementation for accessing the WebSocket API. Client libraries for other languages are in progress.



