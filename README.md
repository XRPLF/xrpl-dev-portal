# XRPL Dev Portal

The [XRP Ledger Dev Portal](https://xrpl.org) is the authoritative source for XRP Ledger documentation, including the `rippled` server, RippleAPI, the Ripple Data API, and other open-source XRP Ledger software.

To build the site locally:

1. Install [**Dactyl**](https://github.com/ripple/dactyl):

        sudo pip3 install dactyl  

2. Clone the repo:

        git clone git@github.com:ripple/xrpl-dev-portal.git

3. Install [Browserify](http://browserify.org/) using npm:

        npm install -g browserify

4. From the project root directory

        cd assets/js
        browserify domain-verifier-checker.js -o domain-verifier-bundle.js

3. Build the site:

        cd ../..
        dactyl_build -t en

For more details, see the [contribution guidelines](CONTRIBUTING.md).
