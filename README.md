# XRPL Dev Portal

The [XRP Ledger Dev Portal](https://xrpl.org) is the authoritative source for XRP Ledger documentation, including the `rippled` server, RippleAPI, the Ripple Data API, and other open-source XRP Ledger software.

To build the site locally:

1. Install [**Dactyl**](https://github.com/ripple/dactyl):

        sudo pip3 install dactyl  

2. Clone the repo:

        git clone git@github.com:ripple/xrpl-dev-portal.git

3. Build the site:

        dactyl_build -t en

For more details, see the [contribution guidelines](CONTRIBUTING.md).


If you make changes to the [Domain Verification Checker](https://xrpl.org/validator-domain-verifier.html) tool and edit the domain-verifier-checker.js file, you will need to do the following: 

1. Install [Browserify](http://browserify.org/) and required libraries via npm:

        npm install -g browserify
        npm install ripple-binary-codec ripple-address-codec ripple-keypairs

2. From the project root directory

        cd assets/js
        browserify domain-verifier-checker.js -o domain-verifier-bundle.js

3. Build the site:

        cd ../..
        dactyl_build -t en
