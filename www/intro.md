# Welcome to Ripple #

Ripple is a decentralized, peer-to-peer network for moving money using cryptographic technology. For more on the big picture, consult [ripple.com](https://ripple.com/) and check out [our blog](https://ripple.com/blog/).

To get started using Ripple, you can try running a few calls to retrieve public information from the [Ripple API Tool](https://ripple.com/tools/api) or you can start by downloading and running your own instance of `rippled`, the Ripple server. In order to get an account on the network, you will have to find someone to send you some amount of XRP in excess of the reserve requirement. 

# Ripple Client Applications #

The official web client for the Ripple Network is available at [https://ripple.com/client/]. You can also try signing up for [Ripple Trade](https://rippletrade.com/), which is still in development. In the future, official downloadable clients will also be available.

If you intend to act as a gateway, you will probably want to build custom client applications that your customers can use to manage their funds within the Ripple Network. To do that, you will need to integrate against the [Ripple APIs](#ripple-apis).

# Ripple APIs #

Connecting to the Ripple Network generally means connecting to a `rippled` server, sending it requests and commands, and listening to the responses. Depending on your situation, there are several different interfaces you can use to do this:

* The `rippled` commandline interface provides a quick way to control a local instance for testing purposes
* The Web Sockets API provides a robust, full-featured system for running commands and receiving data asynchronously from a web browser, Node.js instance, or any other environment that supports Web Sockets.
* The JSON-RPC API provides a powerful, synchronous (call-response) system for running commands and receiving data using any HTTP client; however, it does not support the asynchronous features of Web Sockets.
* The Ripple-REST API is a simpler, more intuitive method for connecting to the network; however, it requires a separate node.js server running the REST API software as a proxy between the REST-client application and the `rippled` server. This proxy can run on the same server as the rippled instance, or on the same computer as the ripple client application.

## Choosing a `rippled` server ##

In any case (except commandline), it is your choice which `rippled` server you connect to. There are a few public servers currently available, including:

[s1.ripple.com:443]

Alternatively, you can run your own server. (If you intend to integrate your business with the Ripple Network, you will probably want to do this, so that you aren't depending on an outside source for everything.)
