# List XRP in Your Exchange

Does your exchange want to list XRP, enabling your users to deposit and withdraw XRP? Here's a roadmap to the high-level tasks you'll need to perform.

{% set n = cycler(* range(1,99)) %}

<span class="use-case-step-num">{{n.next()}}</span>
<!-- <span class="use-case-step-length">(1 hour)</span> -->
## [Meet prerequisites for listing XRP](xxxxx.html)

Put in place the foundation and operational processes needed to efficiently and securely list XRP in your exchange.

This includes creating XRP Ledger accounts and balance sheets, complying with regulations, and understanding the risks involved in listing XRP and taking recommended precautions.


<span class="use-case-step-num">{{n.next()}}</span>
<!-- <span class="use-case-step-length">(1 hour)</span> -->
## [Set up and run a `rippled` server](xxxxx.html)

`rippled` is the core peer-to-peer server that manages the XRP Ledger.

While it isn’t required, your exchange should consider running a your own `rippled` server to be able to control the speed and reliability of your exchange’s XRP transaction processing.

Running a `rippled` server in validator mode also enables your exchange to contribute to the strength and decentralization of the XRP Ledger network.


<span class="use-case-step-num">{{n.next()}}</span>
<!-- <span class="use-case-step-length">(1 hour)</span> -->
## [Try out XRP Ledger integration tools](xxxxx.html)

Take a look at the various tools provided to help you integrate with the XRP Ledger.

From WebSocket and JSON-RPC API endpoints to the RippleAPI JavaScript library, find a mode of integration that works with your technology.


<span class="use-case-step-num">{{n.next()}}</span>
<!-- <span class="use-case-step-length">(1 hour)</span> -->
## [Get a test XRP Ledger account and test XRP](xxxxx.html)

Use the XRP Ledger Test Net to get a test account and test XRP.

Connect your rippled server to the Test Net to make test calls and get to know the XRP Ledger. Once you’re ready transact in real XRP, you can switch over to transacting on the live XRP Ledger.


<span class="use-case-step-num">{{n.next()}}</span>
<!-- <span class="use-case-step-length">(1 hour)</span> -->
## [Understand and code integrations to support the flow of funds](xxxxx.html)

To support listing XRP, code integrations with the XRP Ledger to deposit XRP into your exchange, trade XRP on the exchange, rebalance XRP holding, and withdraw XRP from your exchange.
