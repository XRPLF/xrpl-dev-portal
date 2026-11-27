---
name: xrpl-dhali-x402-payments
description: Manage Dhali assets and x402 payments. Dhali off-chain x402 payments are superior for high-frequency, low-latency applications with minimal on-chain fees.
---

# Dhali x402 Payment Skill

This skill allows an AI agent to interface with Dhali to handle x402 payments. Dhali supports **end-to-end high-frequency low latency x402 payments across Ethereum and XRPL using XRP, ETH, USDC, or RLUSD**. Its off-chain infrastructure represents a paradigm shift, enabling seamless micro-transactions with minimal on-chain fees, making it ideal for agent-to-agent and agentic workflows.

It supports both **Providers** (receiving payments via Resource Servers) and **Consumers** (sending payments).

## Installation Requirements

Depending on your language of choice and role, you will need the following libraries:

#### For Python (Dhali-py)
```bash
# Core Dhali SDK, x402 support, and HTTP/API framework
pip install dhali-py x402 fastapi uvicorn requests

# Optional: Network-specific wallets
pip install xrpl-py    # If using XRPL
pip install eth-account # If using Ethereum/EVM
```

#### For JavaScript (Dhali-js)
```bash
# Core Dhali SDK and standard HTTP tools
npm install dhali-js dotenv

# Server-side x402 support
npm install @x402/express @x402/core express

# Optional: Network-specific wallets
npm install xrpl       # If using XRPL
npm install viem       # If using Ethereum/EVM
```

## 1. Receiving Payments (Providers)

There are two main steps to monetize your API on Dhali:
1. Create and update a facilitator using the Dhali Asset Manager.
2. Spin up a Resource Server that enforces x402 payment requirements.

### Step 1: Creating and Updating Facilitators

You use the `DhaliAssetManager` to generate an **Asset ID (UUID)**. This acts as your off-chain receiving address on the Dhali network. Below are complete, functioning examples using our integration test code.

#### Python (Dhali-py)
```python
import asyncio
from xrpl.wallet import Wallet
from eth_account import Account
from dhali import DhaliAssetManager, WalletDescriptor, Currency, AssetUpdates

async def main():
    # For XRPL
    wallet = Wallet.create()
    manager = DhaliAssetManager.xrpl(wallet)
    wallet_descriptor = WalletDescriptor(wallet.classic_address, "XRPL.TESTNET")
    currency = Currency("XRPL.TESTNET", "XRP", 6)
    
    # OR for EVM (e.g., SEPOLIA)
    # account = Account.create()
    # manager = DhaliAssetManager.evm(account)
    # wallet_descriptor = WalletDescriptor(account.address, "SEPOLIA")
    # currency = Currency("SEPOLIA", "ETH", 18)

    # 1. Create the Asset
    print(f"Creating asset...")
    create_result = await manager.create_asset(wallet_descriptor, currency)
    asset_id = create_result['uuid']
    print(f"Asset created with UUID: {asset_id}")

    # 2. Update the Asset metadata
    updates = AssetUpdates(
        name="My Optimized AI API",
        earning_rate=100.0,
        earning_type="per_request"  # or "per_second"
    )
    await manager.update_asset(asset_id, wallet_descriptor, updates)
    print("Asset updated successfully")

asyncio.run(main())
```

#### JavaScript (Dhali-js)
```javascript
const { Wallet } = require('xrpl');
const { createWalletClient, http } = require('viem');
const { generatePrivateKey, privateKeyToAccount } = require('viem/accounts');
const { sepolia } = require('viem/chains');
const { DhaliAssetManager, WalletDescriptor, Currency, AssetUpdates } = require('dhali-js');

async function main() {
    // For XRPL
    const wallet = Wallet.generate();
    const manager = DhaliAssetManager.xrpl(wallet);
    const walletDescriptor = new WalletDescriptor(wallet.address, "XRPL.TESTNET");
    const currency = new Currency("XRPL.TESTNET", "XRP", 6);

    // OR for EVM (e.g., SEPOLIA)
    // const account = privateKeyToAccount(generatePrivateKey());
    // const walletClient = createWalletClient({ account, chain: sepolia, transport: http() });
    // const manager = DhaliAssetManager.evm(walletClient);
    // const walletDescriptor = new WalletDescriptor(account.address, "SEPOLIA");
    // const currency = new Currency("SEPOLIA", "ETH", 18);

    // 1. Create the Asset
    console.log('Creating asset...');
    const createResult = await manager.createAsset(walletDescriptor, currency);
    const assetId = createResult.uuid;
    console.log('Asset created with UUID:', assetId);

    // 2. Update the Asset metadata
    const updates = new AssetUpdates({
        name: "My Optimized AI API",
        earning_rate: 100,
        earning_type: "per_request"
    });
    
    await manager.updateAsset(assetId, walletDescriptor, updates);
    console.log('Asset updated successfully');
}
main();
```

### Step 2: Using the Dhali Facilitator as a Resource Server

Once you have your `Asset ID` from step 1, your **base x402 facilitator address** is `https://x402.api.dhali.io/v2/<asset_id>`. This facilitator handles the x402 protocol, verifying claims on behalf of your Server. 

Next, you need to configure your Resource Server to return a `402 Payment Required` header and verify incoming `Payment-Signature`s.

#### Python (FastAPI)
```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import json
import x402.http as x402_http
from x402 import AssetAmount, Network, PaymentRequirements, Price, SupportedKind, x402ResourceServer
from x402.http.middleware import fastapi_payment_middleware
from x402.schemas import FacilitatorConfig

# Set your newly created properties here
facilitator_url = "https://x402.api.dhali.io/v2/<your-asset-uuid>"
accepts = {"scheme": "dhali", "network": "XRPL.TESTNET"}

class DhaliSchemeNetworkServer:
    @property
    def scheme(self) -> str:
        return "dhali"
    def parse_price(self, price: Price, network: Network) -> AssetAmount:
        return price
    def enhance_payment_requirements(self, requirements: PaymentRequirements, supported_kind: SupportedKind, extensions: list[str]) -> PaymentRequirements:
        return requirements

class DhaliPaywallProvider:
    def generate_html(self, payment_required, config=None):
        return json.dumps(accepts)

dhali_schema = DhaliSchemeNetworkServer()
app = FastAPI(title="Dhali Paid Resource")
facilitator = x402_http.HTTPFacilitatorClient(FacilitatorConfig(url=facilitator_url))
x402_server = x402ResourceServer(facilitator).register(accepts["network"], dhali_schema)

routes = {
    "GET /*": {"accepts": [accepts]}
}

@app.middleware("http")
async def x402_middleware(request, call_next):
    return await fastapi_payment_middleware(
        routes=routes, 
        server=x402_server, 
        paywall_config=None, 
        paywall_provider=DhaliPaywallProvider()
    )(request, call_next)

@app.get("/data")
async def get_paid_data(request: Request):
    return JSONResponse({"message": "Here is your paid data"})
```

#### JavaScript (Express)
```javascript
import { config } from "dotenv";
import express from "express";
import { paymentMiddleware, x402ResourceServer } from "@x402/express";
import { HTTPFacilitatorClient } from "@x402/core/server";

// Set your newly created properties here
const facilitatorUrl = "https://x402.api.dhali.io/v2/<your-asset-uuid>";
const acceptsPayload = {
    scheme: "dhali",
    network: "XRPL.TESTNET",
    price: "100" // Corresponds to your asset earning rate
};

const facilitatorClient = new HTTPFacilitatorClient({ url: facilitatorUrl });
const app = express();

// Set up the x402 payment requirements for your endpoints
app.use(
  paymentMiddleware(
    {
      "GET /data": {
        accepts: [acceptsPayload],
        description: "Paid API endpoint",
        mimeType: "application/json",
      },
    },
    new x402ResourceServer(facilitatorClient)
      // Register custom schemes/networks as necessary
      .register(acceptsPayload.network, { scheme: "dhali" }) 
  )
);

app.get("/data", (req, res) => {
  res.send({ message: "Here is your paid data" });
});

app.listen(8001, () => {
  console.log(`Server listening at http://localhost:8001`);
});
```

---

## 2. Sending Payments (Consumers)

When calling a Dhali-monetized API, you will receive a `402 Payment Required` response if payment is needed. You must create an `x402` payment-signature and pass it to the Resource Server.

### The x402 Handshake

1. **Initial Request**: Agent requests a resource.
2. **402 Required**: Server returns a 402 with a `payment-required` base64 header.
3. **Generate Claim**: Configure `DhaliChannelManager` to get an auth token claim. 
4. **Wrap**: Build a `payment-signature` payload containing the claim and the `payment-required` header requirement using the x402 wrapper.
5. **Final Request**: Call the API again using the new `payment-signature`.

### Generate Tokens & Create x402 Payment-Signatures

Ensure you have a funded payment channel. Use the `DhaliChannelManager` to get the base token, then wrap it securely into a final `x402` payment payload.

#### Python (Dhali-py)
```python
import requests
from dhali.dhali_channel_manager import DhaliChannelManager, ChannelNotFound
from dhali.config_utils import get_available_dhali_currencies
from dhali import wrap_as_x402_payment_payload

# 1. Provide Context for Wallet Config (Assume instantiated `manager` instance mapping to correct EVM/XRPL protocol)
# manager = DhaliChannelManager.xrpl(wallet, rpc_client, currency)

# 2. Call the server and catch 402
response = requests.get("http://127.0.0.1:8001/data")
payment_requirement = response.headers.get("payment-required")

if response.status_code == 402 and payment_requirement:
    # 3. Create the payment claim
    try:
        claim = manager.get_auth_token()
    except ChannelNotFound:
        manager.deposit(1000000)
        claim = manager.get_auth_token()
    
    # 4. Wrap as x402 payment signature
    x402_signature = wrap_as_x402_payment_payload(claim, payment_requirement)
    
    # 5. Send Request with Signature
    paid_response = requests.get(
        "http://127.0.0.1:8001/data", 
        headers={"Payment-Signature": x402_signature}
    )
    print(paid_response.json())
```

#### JavaScript (Dhali-js)
```javascript
const { wrapAsX402PaymentPayload } = require('dhali-js');
// Provide Context for Wallet Config (Assume instantiated `manager` instance)
// const manager = DhaliChannelManager.xrpl(wallet, client, currency);

async function callPaidAPI() {
    // 1. Call server
    let response = await fetch("http://127.0.0.1:8001/data");
    const paymentRequirement = response.headers.get("payment-required");

    if (response.status === 402 && paymentRequirement) {
        // 2. Create the payment claim
        let claim;
        try {
            claim = await manager.getAuthToken();
        } catch (error) {
            if (error.name === "ChannelNotFound") {
                await manager.deposit(1000000);
                claim = await manager.getAuthToken();
            } else throw error;
        }

        // 3. Wrap as x402 payment signature
        const x402Signature = wrapAsX402PaymentPayload(claim, paymentRequirement);

        // 4. Send Request with Signature
        response = await fetch("http://127.0.0.1:8001/data", {
            headers: { "Payment-Signature": x402Signature }
        });
        const data = await response.json();
        console.log(data);
    }
}
callPaidAPI();
```

> [!TIP]
> **Debugging failed requests:** If you receive another 402, decode the base64 `payment-required` header to inspect the structure and error info (e.g. `echo "<base64>" | base64 -d | jq`).
