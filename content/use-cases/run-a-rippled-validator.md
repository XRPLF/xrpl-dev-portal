# Run a rippled Validator

Each `rippled` server (not running in stand-alone mode) connects to a network of peers, relays cryptographically signed transactions, and maintains a local copy of the complete shared global ledger. A `rippled` server running in validator mode additionally participates in the consensus process and is a part of an interconnected web of validators who each trust a specific set of validators not to collude. Here’s a roadmap to the high-level tasks you’ll need to perform to run a `rippled` validator.

<!-- USE_CASE_STEPS_START -->
{% set n = cycler(* range(1,99)) %}

<span class="use-case-step-num">{{n.next()}}</span>
<!-- <span class="use-case-step-length">(1 hour)</span> -->
## Understand what it means to run a validator

If you or your organization relies on the XRP Ledger, it is in your interest to run a validator to participate in the consensus process and provide a trusted validator that supports the ongoing decentralization of the XRP Ledger.

If you are an independent developer, you may want to run a validator as a way to participate in and dive into the technology that supports the XRP Ledger network.

While validator diversity is important, not every validator is likely to be widely trusted and validator list publishers may require validators to meet stringent criteria before they list them on validator lists.

Despite that, it is important to note that every validator contributes to the long-term health and decentralization of the XRP Ledger.

[Understand what it means to run a validator >](rippled-server-modes.html#reasons-to-run-a-validator)

<span class="use-case-step-num">{{n.next()}}</span>
<!-- <span class="use-case-step-length">(1 hour)</span> -->
## Set up and run a `rippled` server

Install and run a `rippled` server. Anyone can run their own `rippled` server that follows the network and keeps a complete copy of the XRP Ledger.

For configuration guidance and network and hardware requirements, see [Capacity Planning](capacity-planning.html).

[Set up and run a rippled server >](manage-the-rippled-server.html)

<span class="use-case-step-num">{{n.next()}}</span>
<!-- <span class="use-case-step-length">(1 hour)</span> -->
## Enable validation on your rippled server

To configure your `rippled` server to run in validator mode, generate a validator key pair and add it to your `rippled.cfg` file.

[Learn more about validation >](run-rippled-as-a-validator.html)

<span class="use-case-step-num">{{n.next()}}</span>
<!-- <span class="use-case-step-length">(1 hour)</span> -->
## Set up a stock rippled server as a proxy

To protect a production validator from DDoS attacks, you can use a stock `rippled` server as a proxy between the validator and the outside network.

[Set up a proxy >](run-rippled-as-a-validator.html#connect-using-proxies)

<span class="use-case-step-num">{{n.next()}}</span>
<!-- <span class="use-case-step-length">(1 hour)</span> -->
## Associate your validator with a web domain you control

Network participants are unlikely to trust a validator without knowing who is operating it. To address this concern, associate your validator with a web domain you control.
You may also wish to have your validator listed with one or more validator tracking services, such as the [XRP Charts Validator Registry](https://xrpcharts.ripple.com/#/validators).

[Associate your validator >](run-rippled-as-a-validator.html#6-provide-domain-verification)

### Related Tasks
<div class='related-tasks-links'>

- [Contribute Code to `rippled`](contribute-code-to-rippled.html)

</div>