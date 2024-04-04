---
html: testing-devnet-features.html
parent: how-tos.html
seo:
    description: Guide on using pre-release transaction types on the XRP Ledger for developers.
labels:
  - Development
  - Customization
  - Devnet
---
# Test Pre-Release Transaction Types

_(Requires cloning and modifying XRPL core repositories and understanding of XRPL [transaction serialization](../../references/protocol/binary-format.md))._

Pre-release transactions are [amendments](../../concepts/networks-and-servers/amendments.md) that represent new features or other changes to transaction processing. Features are typically released to the [XRPL Devnet](../../concepts/networks-and-servers/parallel-networks.md) for early testing.

This guide walks through the steps to test transaction types in development using either JavaScript with `xrpl.js` or Python with `xrpl-py`. This approach is typically only necessary for pre-release amendments that are available on the [XRPL Devnet](../../concepts/networks-and-servers/parallel-networks.md) for early testing.

**Note**: The code samples below illustrate how to prepare your development environment and modify the XRPL to support custom transaction types, using the respective [client library](../../references/client-libraries.md).

## Prerequisites

- Basic understanding of XRPL transactions.
- Development environment setup for JavaScript or Python.
- Docker installed and configured.

## Steps

### 1. Set Up Your Development Environment

Ensure the proper dependencies are installed for Node.js or Python.

{% tabs %}

{% tab label="JavaScript" %}

```javascript
npm install xrpl
```

{% /tab %}

{% tab label="Python" %}

```bash
pip install xrpl-py
```

{% /tab %}

{% /tabs %}

### 2. Generate Definitions File

Utilize the [server_definitions](../../references/http-websocket-apis/public-api-methods/server-info-methods/server_definitions.md) command to retrieve the definitions.json content.

**Note:** Any [parallel test network](../../concepts/networks-and-servers/parallel-networks.md) may be used instead of Devnet.

{% tabs %}

{% tab label="Linux" %}

```bash
curl -X POST https://s.devnet.rippletest.net:51234/ -H 'Content-Type: application/json' -d '{"method": "server_definitions"}' > definitions.json
```

{% /tab %}

{% tab label="Mac" %}

```bash
curl -X POST https://s.devnet.rippletest.net:51234/ -H 'Content-Type: application/json' -d '{"method": "server_definitions"}' > definitions.json
```

{% /tab %}

{% tab label="Windows (Cmd)" %}

```cmd
curl -X POST https://s.devnet.rippletest.net:51234/ -H "Content-Type: application/json" -d "{\"method\": \"server_definitions\"}" > definitions.json
```

{% /tab %}

{% tab label="Windows (PowerShell)" %}

```cmd
curl -Method Post -Uri https://s.devnet.rippletest.net:51234/ -Headers @{"Content-Type"="application/json"} -Body '{"method": "server_definitions"}' | Out-File -FilePath definitions.json
```

{% /tab %}

{% /tabs %}

### 3. Update XRPL Library Definitions

Copy the generated `definitions.json` to your XRPL library installation.

{% tabs %}

{% tab label="JavaScript" %}

```bash
// Locate your ripple-binary-codec installation in node_modules and replace the definitions.json file.
// <_your project directory_>/node_modules/ripple-binary-codec/dist/definitions.json
```

{% /tab %}

{% tab label="Python" %}

```bash
// Use `pip show xrpl-py` to find the installation location and navigate to `<_output of pip show_>/xrpl/core/binarycodec/definitions/definitions.json` to replace the `definitions.json` file.
```

{% /tab %}

{% /tabs %}

### 4. Create and Submit Custom Transaction

{% tabs %}

{% tab label="JavaScript" %}

```javascript
const { Client, Wallet } = require('xrpl');
const { encode } = require('ripple-binary-codec');

async function main() {
  const client = new Client("wss://s.devnet.rippletest.net:51233");
  await client.connect();

  const wallet = Wallet.fromSeed('sYOURSEEDHERE');

  const customTx = {
    TransactionType: 'NewTransactionType',
    Account: wallet.address,
    // additional fields for the new transaction
  };

  // If using Typescript, you will need to encode to allow typechecks to function
  // or just us @ts-expect-error when calling submit
  //   const encodedTransaction = encode(customTx);

  await client.submitAndWait(customTx, { wallet });
  // If using typescript, you should pass the encoded string of the transaction or us @ts-expect-error
  //   await client.submitAndWait(encodedTransaction, { wallet });
  // await client.disconnect();
}

main();
// Or call await main(); if your nodejs versions supports top level await
```

{% /tab %}

{% tab label="Python" %}

```python
from xrpl.clients import JsonRpcClient
from xrpl.models.transactions import Transaction
from xrpl.wallet import Wallet
from xrpl.transaction import send_reliable_submission
from xrpl.core.binarycodec import encode

client = JsonRpcClient("wss://s.devnet.rippletest.net:51233")

wallet = Wallet(seed="sYOURSEEDHERE", sequence=0)

custom_tx = Transaction(
    account=wallet.classic_address,
    transaction_type="NewTransactionType",
    # additional fields for the new transaction
)

# If using typechecking, encode the transaction into a string before passing to send_reliable_submission
# because the new transaction type is not natively supported by xrpl-py and therefore will have a type
# error if you pass an unsupported transaction type
# encoded_tx = encode(custom_tx)

send_reliable_submission(custom_tx, client, wallet)
# If using typechecking, encode the transaction into a string before passing to send_reliable_submission
# because the new transaction type is not natively supported by xrpl-py and therefore will have a type
# error if you pass an unsupported transaction type
# send_reliable_submission(encoded_tx, client, wallet)
# Or disable type checking for the line
# send_reliable_submission(custom_tx, client, wallet) # type: ignore
```

{% /tab %}

{% /tabs %}

### Considerations

- **Testing**: Utilize the XRPL Testnet or Devnet for testing new transaction types.
- **Updates**: Regularly update your `rippled` and XRPL library clones to include the latest features and fixes.
- **Custom Types and Serialization**: If your transaction involves new data structures, ensure they are correctly defined and serialized according to [XRPL standards](../../references/protocol/transactions/index.md).

{% raw-partial file="/docs/_snippets/common-links.md" /%}
