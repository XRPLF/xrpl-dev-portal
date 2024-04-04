---
html: testing-prerelease-devnet-features.html
parent: how-tos.html
seo:
    description: Guide on using pre-release transaction types on the XRP Ledger for developers.
labels:
  - Development
  - Customization
  - Devnet
---
# Test a Pre-Release Transaction Type on the XRP Ledger

_(Requires cloning and modifying XRPL core repositories and understanding of XRPL transaction serialization)_

Pre-release transactions are [Amendments](../../concepts/networks-and-servers/amendments.md) that represent new features or other changes to transaction processing. Features are typically released to the [XRPL Devnet](../../concepts/networks-and-servers/parallel-networks.md) for early testing.

This guide walks through using either JavaScript with `xrpl.js` or Python with `xrpl-py`. This approach is typically only necessary for early pre-release amendments on the [XRPL Devnet](../../concepts/networks-and-servers/parallel-networks.md).

**Note**: The code samples below illustrate how to prepare your development environment and modify the XRPL to support custom transaction types, using the respective [client library](../../references/client-libraries.md).

## Prerequisites

- Basic understanding of XRPL transactions.
- Development environment setup for JavaScript or Python.

## Steps

### 1. Set Up Your Development Environment

#### JavaScript:
Ensure Node.js and npm are installed. Use npm to install `xrpl.js` in your project:
```javascript
npm install xrpl
```

#### Python:
Ensure Python and pip are installed. Use pip to install `xrpl-py`:
```bash
pip install xrpl-py
```

### 2. Clone XRPL Core Repositories

Clone the `rippled` source code and the `xrpl-codec-gen` tool from GitHub:
```bash
git clone https://github.com/XRPLF/rippled
git clone https://github.com/RichardAH/xrpl-codec-gen
```

### 3. Generate Definitions File

Ensure you're on the `develop` branch of `rippled` to get the latest changes. The `develop` branch is kept in sync with the [XRPL Devnet](../../concepts/networks-and-servers/parallel-networks.md).

Use `xrpl-codec-gen` to create a `definitions.json` file based on the XRPL source code. There is no difference between using Python or JavaScript to generate the `definitions.json`.

#### JavaScript:
```bash
node gen.js /path/to/rippled/src/ripple/ > definitions.json
```

#### Python:
```bash
python gen.py /path/to/rippled/src/ripple/ > definitions.json
```

### 4. Update XRPL Library Definitions

Copy the generated `definitions.json` to your XRPL library installation.

#### JavaScript:
```bash
// Locate your ripple-binary-codec installation in node_modules and replace the definitions.json file.
// <your project directory>/node_modules/ripple-binary-codec/dist/definitions.json
```

#### Python:
```bash
// Use `pip show xrpl-py` to find the installation location and navigate to `<output of pip show>/xrpl/core/binarycodec/definitions/definitions.json` to replace the `definitions.json` file.
```

### 5. Create and Submit Custom Transaction

#### JavaScript:
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

#### Python:
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

### Final Considerations

- **Testing**: Utilize the XRPL Testnet or Devnet for testing new transaction types.
- **Updates**: Regularly update your `rippled` and XRPL library clones to include the latest features and fixes.
- **Custom Types and Serialization**: If your transaction involves new data structures, ensure they are correctly defined and serialized according to XRPL standards.

This guide provides a foundational approach to extending the XRP Ledger with new transaction types, fostering innovation and customization.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
