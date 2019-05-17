# Contribute Code to rippled

Want to contribute code or a bug report to help improve `rippled`, the core peer-to-peer server that manages the XRP Ledger? Here’s a roadmap to the high-level tasks that’ll have you reviewing code and functionality in no time.

<!-- USE_CASE_STEPS_START -->
{% set n = cycler(* range(1,99)) %}

<span class="use-case-step-num">{{n.next()}}</span>
## Access the `rippled` repo

`rippled` is an open-source project. You can take a look at `rippled` code simply by accessing the `rippled` GitHub repo. Before contributing or reporting bugs, we recommend that you get to know the code and developer experience by performing the following tasks.

<span class="use-case-external-link btn btn-outline-secondary external-link">[Access the repo](https://github.com/ripple/rippled)</span>

<span class="use-case-step-num">{{n.next()}}</span>
## Set up and run a `rippled` server

Set up and run a `rippled` server to understand the developer experience and functionality of the core peer-to-peer server that manages the XRP Ledger. Anyone can run their own `rippled` server that follows the network and keeps a complete copy of the XRP Ledger.

[Set up and run a server >](manage-the-rippled-server.html)

<span class="use-case-step-num">{{n.next()}}</span>
## Try out XRP Ledger integration tools

Take a look at the various tools provided to help developers integrate with the XRP Ledger. From WebSocket and JSON-RPC API endpoints to the `ripple-lib` JavaScript library, take a look at the modes of integration offered to the developer community.

[Try out XRP Ledger integration tools >](get-started-with-the-rippled-api.html)

<span class="use-case-step-num">{{n.next()}}</span>
## Get a sandbox XRP Ledger account

Use the XRP Ledger Test Net to get a sandbox account. Connect your `rippled server` to the Test Net to make test calls and get to know the XRP Ledger.

[Get a sandbox XRP Ledger account >](xrp-test-net-faucet.html)

<span class="use-case-step-num">{{n.next()}}</span>
## Set up your development environment

A `rippled` development environment has a C++ compiler, access to the necessary libraries to compile `rippled` (such as Boost), and an editor for making changes to the source files. See the [`rippled` repository](https://github.com/ripple/rippled) for the latest recommendations of each. You should also create your own fork of the `rippled` repository on GitHub so you can contribute pull requests to the official repo. <!-- for future, awaiting links to a few rippled repo md files - Nik -->


<span class="use-case-step-num">{{n.next()}}</span>
## Familiarize yourself with `rippled`'s coding style

Before you start contributing code to `rippled,` take some time to familiarize yourself with the coding standards used in the `rippled` repo. These standards gradually evolve and propagate through code reviews. Some aspects are enforced more strictly than others.

<span class="use-case-external-link btn btn-outline-secondary external-link">[Familiarize yourself with `rippled`'s coding style](https://github.com/ripple/rippled/blob/develop/docs/CodingStyle.md)</span>

<span class="use-case-step-num">{{n.next()}}</span>
## Contribute code

Now that you have a handle on `rippled`, you may have ideas for how to improve it. Perhaps you’re developing on the XRP Ledger and want to contribute some code that enables the XRP Ledger to provide a feature your application needs. Access the `rippled` repo and open an issue or pull request.

<span class="use-case-external-link btn btn-outline-secondary external-link">[Contribute code](https://github.com/ripple/rippled/pulls)</span>

<span class="use-case-step-num">{{n.next()}}</span>
## Report bugs

As you explore `rippled`, you may find code that you don’t think is working as intended. To report a bug, [open an issue](https://github.com/ripple/rippled/issues) in the `rippled` repo.

If the bug you wish to report is security-related, we urge you to disclose it responsibly through Ripple's [Bug Bounty program](https://ripple.com/bug-bounty/).

<span class="use-case-external-link btn btn-outline-secondary external-link">[Report bugs](https://github.com/ripple/rippled/issues)</span>