---
html: connect-to-ledger.html
funnel: Build
doc_type: Tutorials
category: Get Started
subcategory: Build Apps
blurb: Learn how to connect to the XRP Ledger.
cta_text: Build Apps
filters:
    - interactive_steps
    - include_code
---

# Connect to the XRP Ledger

To make queries and submit transactions, you need to establish a connection to the XRP Ledger. To do this 
with `xrpl-py`, use the [`xrp.clients` module](https://xrpl-py.readthedocs.io/en/latest/source/xrpl.clients.
html):




{{ include_code("_code-samples/xrpl-py/get-acct-info.py", start_with="# Define the network client", 
end_before="# Create a wallet using the testnet faucet:", language="py") }}

#### Connect to the production XRP Ledger

The sample code in the previous section shows you how to connect to the Testnet, which is one of the 
available [parallel networks](parallel-networks.html). When you're ready to integrate with the production 
XRP Ledger, you'll need to connect to the Mainnet. You can do that in two ways:

* By [installing the core server](install-rippled.html) (`rippled`) and running a node yourself (the core 
server connects to the Mainnet by default and you can [change the configuration to use an altnet]
(connect-your-rippled-to-the-xrp-test-net.html) ). [There are good reasons to run your own core server]
(the-rippled-server.html#reasons-to-run-your-own-server). If you run your own server, you can coconnect to 
it like so:

        from xrpl.clients import JsonRpcClient
        JSON_RPC_URL = "http://localhost:5005/"
        client = JsonRpcClient(JSON_RPC_URL)

    See the example [core server config file](https://github.com/ripple/rippled/blob/
c0a0b79d2d483b318ce1d82e526bd53df83a4a2c/cfg/rippled-example.cfg#L1562) for more information about 
default values.

* By using one of the [available public servers](get-started-with-the-rippled-api.html#public-servers):

        from xrpl.clients import JsonRpcClient
        JSON_RPC_URL = "https://s2.ripple.com:51234/"
        client = JsonRpcClient(JSON_RPC_URL)
