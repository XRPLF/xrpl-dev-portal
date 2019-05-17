# Contribute Code to ripple-lib

Want to contribute code or a bug report to help improve `ripple-lib`, the official client library for [RippleAPI](rippleapi-reference.html)? RippleAPI is a JavaScript API for interacting with the XRP Ledger. Here’s a roadmap to the high-level tasks that’ll have you reviewing code and functionality in no time.


<!-- USE_CASE_STEPS_START -->
{% set n = cycler(* range(1,99)) %}

<span class="use-case-step-num">{{n.next()}}</span>
## Access the `ripple-lib` repo

`ripple-lib` is an open-source project. You can take a look at `ripple-lib` code simply by accessing the `ripple-lib` GitHub repo. Before contributing or reporting bugs, we recommend that you get to know the code and developer experience by performing the following tasks.

<span class="use-case-external-link btn btn-outline-secondary external-link">[Access the `ripple-lib` repo](https://github.com/ripple/ripple-lib)</span>

<span class="use-case-step-num">{{n.next()}}</span>
## Set up and run a rippled server

RippleAPI is an API for interacting with the XRP Ledger. The core peer-to-peer server that manages the XRP Ledger is `rippled`. Optionally, you can set up and run a `rippled` server to understand its developer experience and functionality. Anyone can run their own `rippled` server that follows the network and keeps a complete copy of the XRP Ledger.

[Set up and run a rippled server >](manage-the-rippled-server.html)

<span class="use-case-step-num">{{n.next()}}</span>
## Get a Test Net XRP Ledger account

Use the XRP Test Net Faucet to get a test account on the XRP Test Network. If you set up a `rippled` server, you can connect it to the XRP Test Net to make test calls and get to know the XRP Ledger.

[Get a Test Net XRP Ledger account >](xrp-test-net-faucet.html)

<span class="use-case-step-num">{{n.next()}}</span>
## Set up your `ripple-lib` development environment

`ripple-lib` requires Node.js and a few dependencies. We recommend using [Node.js v10 LTS](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/en/) dependency management. Also, be sure to create your own fork of the `ripple-lib` repository on GitHub so you can contribute pull requests to the official repo.

[Set up your development environment >](get-started-with-rippleapi-for-javascript.html#environment-setup)

<span class="use-case-step-num">{{n.next()}}</span>
## Run your first `ripple-lib` script

Examine and run the `get-account-info.js` script. Use it to get a feel for how RippleAPI scripts work and to verify that your RippleAPI interface is working.

[Run your first script >](get-started-with-rippleapi-for-javascript.html#first-rippleapi-script)

<span class="use-case-step-num">{{n.next()}}</span>
## Contribute code

Now that you have a handle on `ripple-lib`, you may have ideas for how to improve it.

Perhaps you’re developing on the XRP Ledger and want to contribute some code that enables `ripple-lib` to provide a feature your application needs.

Need some inspiration? Take a look at our list of [Help Wanted issues](https://github.com/ripple/ripple-lib/issues?utf8=%E2%9C%93&q=label%3A%22help+wanted%22)

Access the `ripple-lib` repo and open an issue or pull request.

<span class="use-case-external-link btn btn-outline-secondary external-link">[Contribute code](https://github.com/ripple/ripple-lib/pulls)</span>

<span class="use-case-step-num">{{n.next()}}</span>
## Report bugs

As you explore `ripple-lib`, you may find code that you don’t think is working as intended. To report a bug, [open an issue](https://github.com/ripple/ripple-lib/issues) in the `ripple-lib` repo.

If the bug you wish to report is security-related, we urge you to disclose it responsibly through Ripple's [Bug Bounty program](https://ripple.com/bug-bounty/).

<span class="use-case-external-link btn btn-outline-secondary external-link">[Report bugs](https://github.com/ripple/ripple-lib/issues)</span>