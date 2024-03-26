---
category: 2020
date: 2020-08-10
labels:
    - Advisories
theme:
    markdown:
        editPage:
            hide: true
---
# Moving Devnet to a Validator List

Ripple plans to upgrade [the XRP Ledger Devnet](https://xrpl.org/parallel-networks.html) to use a recommended validator list like the ones used on the Testnet and Mainnet. Ripple also plans to reset the Devnet history and state at this time. If you operate a server on the XRP Ledger Devnet, or run software on the Devnet, you must upgrade your configuration to remain synced.

<!-- BREAK -->

## Background

Ripple runs the Devnet as a way to preview and test upcoming XRP Ledger features. Until now, the Devnet has used a short, hard-coded list of trusted validators that every server must use to remain synced. Configurations with a different set of trusted validators may not be fork-safe, so the entire network has to coordinate adding or removing trusted validators from the list.

Ripple plans to add more trusted validators to the Devnet before testing the upcoming [Negative UNL feature](https://www.xrpchat.com/topic/33072-suggestion-robustness-improvements/). A validator list site helps to coordinate adding more validators to servers' UNLs, and provides a test environment that more closely resembles the Testnet and Mainnet.

Balances in the Devnet have no real-world value. To enforce this and to keep the Devnet a free place to run tests, Ripple resets the ledger state and history of the Devnet periodically.


## Actions Required

Ripple plans to upgrade and reset its Devnet validators on Tuesday, 2020-08-11. After the upgrade, the way to [connect your server to the Devnet](https://xrpl.org/connect-your-rippled-to-the-xrp-test-net.html) will be to use a validator list site, as described below.

If you had any Devnet accounts, balances, or in-ledger settings, you must re-create those accounts and settings. Use the [Devnet Faucet](https://xrpl.org/xrp-testnet-faucet.html) to fund new addresses with a new supply of Devnet Test XRP.


### Configuration Changes

To connect to the Devnet after the update, complete the following steps:

1. Add the new validator list and key to your `validators.txt`.

        [validator_list_sites]
        https://vl.devnet.rippletest.net

        [validator_list_keys]
        EDDF2F53DFEC79358F7BE76BC884AC31048CFF6E2A00C628EAE06DB7750A247B12

    The `validators.txt` file defines a server's trusted validator settings. The [recommended installation](https://xrpl.org/install-rippled.html) places this file at `/etc/opt/ripple/validators.txt` by default.

2. Remove or comment-out any other URLs in `[validator_list_sites]` and any other keys in `[validator_list_keys]`. If this server was previously connected to the devnet, **remove or comment out the `[validators]` stanza and any hard-coded validator public keys in that stanza**.

    For example:

        # # Old Hard-coded List of Devnet Validators
        # [validators]
        # n9Mo4QVGnMrRN9jhAxdUFxwvyM4aeE1RvCuEGvMYt31hPspb1E2c
        # n9MEwP4LSSikUnhZJNQVQxoMCgoRrGm6GGbG46AumH2KrRrdmr6B
        # n9M1pogKUmueZ2r3E3JnZyM3g6AxkxWPr8Vr3zWtuRLqB7bHETFD
        # n9MX7LbfHvPkFYgGrJmCyLh8Reu38wsnnxA4TKhxGTZBuxRz3w1U
        # n94aw2fof4xxd8g3swN2qJCmooHdGv1ajY8Ae42T77nAQhZeYGdd
        # n9LiE1gpUGws1kFGKCM9rVFNYPVS4QziwkQn281EFXX7TViCp2RC
        # n9Jq9w1R8UrvV1u2SQqGhSXLroeWNmPNc3AVszRXhpUr1fmbLyhS

3. After changing your config, **restart** the `rippled` service.

        $ sudo systemctl restart rippled


## Next Steps

Stay tuned to the [XRP Ledger Dev Blog](https://xrpl.org/blog/) for the upcoming release of version 1.6.0 of the core XRP Ledger server (`rippled`) and details about the upcoming tests of the Negative UNL feature. To receive email updates whenever there are important releases or changes to the XRP Ledger server software subscribe to the [ripple-server Google Group](https://groups.google.com/forum/#!forum/ripple-server).

Other resources:

- [XRP Ledger Dev Portal](https://xrpl.org/)
* [The Xpring Forum](https://forum.xpring.io/)
* [XRP Chat Forum](http://www.xrpchat.com/)
