# List XRP in Your Exchange

Does your exchange want to list XRP, enabling your users to deposit, trade, and withdraw XRP? Here's a roadmap to the high-level tasks you'll need to perform.

{% set n = cycler(* range(1,99)) %}

<span class="use-case-step-num">{{n.next()}}</span>
<!-- <span class="use-case-step-length">(1 hour)</span> -->
## [Meet prerequisites for listing XRP](list-xrp-as-an-exchange.html#prerequisites-for-supporting-xrp)

Put in place the foundation and operational processes needed to efficiently and securely list XRP in your exchange.

This includes creating and securing XRP Ledger accounts, implementing internal balance sheets, adopting appropriate security procedures, and complying with any applicable regulations.


<span class="use-case-step-num">{{n.next()}}</span>
<!-- <span class="use-case-step-length">(1 hour)</span> -->
## [Set up and run a `rippled` server](manage-the-rippled-server.html)

`rippled` is the core peer-to-peer server that manages the XRP Ledger.

While it isn’t required, your exchange should consider running your own `rippled` server to be able to control the speed and reliability of your exchange’s XRP transaction processing.

You can start out running one `rippled` server to support development and exploration. If required for your use case, you can then build up to an enterprise deployment that consists of multiple clustered servers with one private-peer validator, for example.

[Running a `rippled` server in validator mode](run-a-rippled-validator.html) enables your exchange to contribute to the strength and decentralization of the XRP Ledger network. Even if your `rippled` server isn’t included in published validator lists, it is still contributing (albeit indirectly) and continues to build up reputation over time.


<span class="use-case-step-num">{{n.next()}}</span>
<!-- <span class="use-case-step-length">(1 hour)</span> -->
## [Try out XRP Ledger integration tools](get-started-with-the-rippled-api.html)

Take a look at the various tools provided to help you integrate with the XRP Ledger.

From WebSocket and JSON-RPC API endpoints to the RippleAPI JavaScript library, find a mode of integration that works with your technology.


<span class="use-case-step-num">{{n.next()}}</span>
<!-- <span class="use-case-step-length">(1 hour)</span> -->
## [Get a sandbox XRP Ledger account](xrp-test-net-faucet.html)

Use the XRP Ledger Test Net to get a sandbox account. Connect your `rippled` server to the Test Net to make test calls and get to know the XRP Ledger. Once you’re ready to transact in real XRP, you can switch over to transacting on the live XRP Ledger.


<span class="use-case-step-num">{{n.next()}}</span>
<!-- <span class="use-case-step-length">(1 hour)</span> -->
## [Understand and code integrations to support the flow of funds](list-xrp-as-an-exchange.html#flow-of-funds)

To support listing XRP, code integrations with the XRP Ledger to deposit XRP into your exchange, trade XRP on the exchange, rebalance XRP holding, and withdraw XRP from your exchange.


### Related Tasks

- [Contribute Code to `rippled`](contribute-code-to-rippled.html)
- [Subscribe to XRP Ledger Updates](subscription-methods.html)
- [Capacity Planning](capacity-planning.html)
- [Look Up an XRP Ledger Account’s Transaction History](tx_history.html)
<!-- for the future, link to Implement Destination Tags -->
