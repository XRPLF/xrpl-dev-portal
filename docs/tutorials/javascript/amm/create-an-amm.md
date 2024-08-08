# Create an AMM

This example shows how to:

1. Issue `FOO` tokens on Devnet.
2. Check if an AMM exists for `XRP/FOO`.
3. Create an AMM for `XRP/FOO`.


## Usage

![Test harness to create AMM](/docs/img/create-an-amm.png)

Download the [AMM Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/amm/js/) to use the AMM test harness in your browser and follow along in this tutorial.

1. Open `create-an-amm.html` in a browser.
2. Click **Get New Devnet Account**.
3. Click **Issue FOO Tokens**.
4. Click **Check for AMM**. 
5. Click **Create AMM**.
6. Click **Check for AMM**.


## Code Walkthrough

### Connect to Devnet and generate credentials

You must be connected to the network to query it and submit transactions. This code connects to Devnet and generates a fresh wallet, funded with 100 XRP.

{% code-snippet file="/_code-samples/amm/js/1.create-an-amm.js" from="// Define client, network, and explorer." before="// Issue FOO tokens to Devnet wallet." language="js" /%}


### Issue FOO tokens

Normally, you'd acquire a second token through a stablecoin issuer, or buying it off an exchange. For this tutorial, we'll go through the process of issuing a brand new FOO token, enabling us to create a unique AMM pair later. Creating a new issuer and issuing a token involves:

1. Creating a new issuer wallet.
2. Enabling the `DefaultRipple` flag.
3. Creating a trustline from your wallet to the issuer wallet.
4. Sending the `FOO` tokens from the issuer to your wallet. 

{% code-snippet file="/_code-samples/amm/js/1.create-an-amm.js" from="// Issue FOO tokens to Devnet wallet." before="// Check if AMM exists." language="js" /%}


### Check if an AMM already exists.

Each AMM pair is unique. This checks to make sure the `XRP/FOO` pair doesn't already exist. In the previous step, we created a new issuer and `FOO` token; even if another `FOO` token already exists, it's considered unique if issued by another account. If the AMM pair exists, this responds with the AMM information, such as token pair, trading fees, etc.

{% code-snippet file="/_code-samples/amm/js/1.create-an-amm.js" from="// Check if AMM exists." before="// Create new AMM." language="js" /%}


### Create AMM

This send the `AMMCreate` transaction with an initial pairing of 50 `XRP` to 500 `FOO`.

{% code-snippet file="/_code-samples/amm/js/1.create-an-amm.js" from="// Create new AMM." language="js" /%}