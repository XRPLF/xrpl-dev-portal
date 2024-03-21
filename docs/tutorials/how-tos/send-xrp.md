---
html: send-xrp.html
parent: tasks.html
seo:
    description: Learn how to send test payments right from your browser.
cta_text: Send XRP
labels:
  - XRP
  - Payments
top_nav_grouping: Popular Pages
steps: ['Generate', 'Connect', 'Prepare', 'Sign', 'Submit', 'Wait', 'Check']
---
# Send XRP

This tutorial explains how to send a direct XRP Payment using `xrpl.js` for JavaScript, `xrpl-py` for Python, `xrpl4j` for Java or `XRPL_PHP` for PHP. First, we step through the process with the [XRP Ledger Testnet](../../concepts/networks-and-servers/parallel-networks.md). Then, we compare that to the additional requirements for doing the equivalent in production.

**Tip:** Check out the [Code Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples) for a complete version of the code used in this tutorial.

## Prerequisites

<!-- Source for this specific tutorial's interactive bits: -->
<script type="application/javascript" src="/js/interactive-tutorial.js"></script>
<script type="application/javascript" src="/js/tutorials/send-xrp.js"></script>

To interact with the XRP Ledger, you need to set up a dev environment with the necessary tools. This tutorial provides examples using the following options:

- **JavaScript** with the [xrpl.js library](https://github.com/XRPLF/xrpl.js/). See [Get Started Using JavaScript](../javascript/build-apps/get-started.md) for setup steps.
- **Python** with the [`xrpl-py` library](https://xrpl-py.readthedocs.io/). See [Get Started using Python](../python/build-apps/get-started.md) for setup steps.
- **Java** with the [xrpl4j library](https://github.com/XRPLF/xrpl4j). See [Get Started Using Java](../java/build-apps/get-started.md) for setup steps.
- **PHP** with the [XRPL_PHP library](https://github.com/AlexanderBuzz/xrpl-php). See [Get Started Using PHP](../php/build-apps/get-started.md) for setup steps.


## Send a Payment on the Test Net

### 1. Get Credentials

To transact on the XRP Ledger, you need an address and secret key, and some XRP. The address and secret key look like this:

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/send-xrp/js/send-xrp.js" from="// Example credentials" before="// Connect" language="js" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/send-xrp/py/send-xrp.py" before="# Connect" language="py" /%}
{% /tab %}

{% tab label="Java" %}
{% code-snippet file="/_code-samples/send-xrp/java/SendXrp.java" before="// Connect" language="java" /%}
{% /tab %}

{% tab label="PHP" %}
{% code-snippet file="/_code-samples/send-xrp/php/send-xrp.php" from="// Example credentials" before="// Create" language="php" /%}
{% /tab %}

{% /tabs %}

The secret key shown here is for example only. For development purposes, you can get your own credentials, pre-funded with XRP, on the Testnet using the following interface:

{% partial file="/docs/_snippets/interactive-tutorials/generate-step.md" /%}

When you're building production-ready software, you should use an existing account, and manage your keys using a [secure signing configuration](../../concepts/transactions/secure-signing.md).


### 2. Connect to a Testnet Server

First, you must connect to an XRP Ledger server so you can get the current status of your account and the shared ledger. You can use this information to [automatically fill in some required fields of a transaction](../../references/protocol/transactions/common-fields.md#auto-fillable-fields). You also must be connected to the network to submit transactions to it.

The following code connects to a public Testnet servers:

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/get-started/js/base.js" language="js" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/send-xrp/py/send-xrp.py" from="# Connect" before="# Get credentials" language="py" /%}
{% /tab %}

{% tab label="Java" %}
{% code-snippet file="/_code-samples/send-xrp/java/SendXrp.java" from="// Connect" before="// Prepare transaction" language="java" /%}
{% /tab %}

{% tab label="PHP" %}
{% code-snippet file="/_code-samples/send-xrp/php/send-xrp.php" from="// Create a client" before="// Transaction definition" language="php" /%}
{% /tab %}

{% /tabs %}

For this tutorial, click the following button to connect:

{% partial file="/docs/_snippets/interactive-tutorials/connect-step.md" /%}


### 3. Prepare Transaction

Typically, we create XRP Ledger transactions as objects in the JSON [transaction format](../../references/protocol/transactions/index.md). The following example shows a minimal Payment specification:

```json
{
  "TransactionType": "Payment",
  "Account": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
  "Amount": "2000000",
  "Destination": "rUCzEr6jrEyMpjhs4wSdQdz4g8Y382NxfM"
}
```

The bare minimum set of instructions you must provide for an XRP Payment is:

- An indicator that this is a payment. (`"TransactionType": "Payment"`)
- The sending address. (`"Account"`)
- The address that should receive the XRP (`"Destination"`). This can't be the same as the sending address.
- The amount of XRP to send (`"Amount"`). Typically, this is specified as an integer in "drops" of XRP, where 1,000,000 drops equals 1 XRP.

Technically, a transaction must contain some additional fields, and certain optional fields such as `LastLedgerSequence` are strongly recommended. Some other language-specific notes:

- If you're using `xrpl.js` for JavaScript, you can use the [`Client.autofill()` method](https://js.xrpl.org/classes/Client.html#autofill) to automatically fill in good defaults for the remaining fields of a transaction. In TypeScript, you can also use the transaction models like `xrpl.Payment` to enforce the correct fields.
- With `xrpl-py` for Python, you can use the models in `xrpl.models.transactions` to construct transactions as native Python objects.
- With xrpl4j for Java, you can use the model objects in the `xrpl4j-model` module to construct transactions as Java objects.
    - Unlike the other libraries, you must provide the account `sequence` and the `signingPublicKey` of the source
    account of a `Transaction` at the time of construction, as well as a `fee`.

Here's an example of preparing the above payment:

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/send-xrp/js/send-xrp.js" from="// Prepare" before="// Sign" language="js" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/send-xrp/py/send-xrp.py" from="# Prepare" before="# Sign" language="py" /%}
{% /tab %}

{% tab label="Java" %}
{% code-snippet file="/_code-samples/send-xrp/java/SendXrp.java" from="// Prepare" before="// Sign" language="java" /%}
{% /tab %}

{% tab label="PHP" %}
{% code-snippet file="/_code-samples/send-xrp/php/send-xrp.php" from="// Transaction definition" before="// Sign" language="php" /%}
{% /tab %}

{% /tabs %}

{% interactive-block label="Prepare" steps=$frontmatter.steps %}

<div class="input-group mb-3">
  <div class="input-group-prepend">
    <span class="input-group-text">Send: </span>
  </div>
  <input type="number" class="form-control" value="22" id="xrp-amount"
  aria-label="Amount of XRP, as a decimal" aria-describedby="xrp-amount-label"
  min=".000001" max="100000000000" step="any" />
  <div class="input-group-append">
    <span class="input-group-text" id="xrp-amount-label"> XRP</span>
  </div>
</div>
<button id="prepare-button" class="btn btn-primary previous-steps-required">Prepare
  example transaction</button>
<div class="output-area"></div>

{% /interactive-block %}


### 4. Sign the Transaction Instructions

Signing a transaction uses your credentials to authorize the transaction on your behalf. The input to this step is a completed set of transaction instructions (usually JSON), and the output is a binary blob containing the instructions and a signature from the sender.

- **JavaScript:** Use the [`sign()` method of a `Wallet` instance](https://js.xrpl.org/classes/Wallet.html#sign) to sign the transaction with `xrpl.js`.
- **Python:** Use the [`xrpl.transaction.safe_sign_transaction()` method](https://xrpl-py.readthedocs.io/en/latest/source/xrpl.transaction.html#xrpl.transaction.safe_sign_transaction) with a model and `Wallet` object.
- **Java:** Use a [`SignatureService`](https://javadoc.io/doc/org.xrpl/xrpl4j-crypto-core/latest/org/xrpl/xrpl4j/crypto/signing/SignatureService.html) instance to sign the transaction. For this tutorial, use the [`SingleKeySignatureService`](https://javadoc.io/doc/org.xrpl/xrpl4j-crypto-bouncycastle/latest/org/xrpl/xrpl4j/crypto/signing/SingleKeySignatureService.html).
- **PHP:** Use a [`sign()` method of a `Wallet` instance](https://alexanderbuzz.github.io/xrpl-php-docs/wallet.html#signing-a-transaction) instance to sign the transaction. The input to this step is a completed array of transaction instructions.

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/send-xrp/js/send-xrp.js" from="// Sign" before="// Submit" language="js" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/send-xrp/py/send-xrp.py" from="# Sign" before="# Submit" language="py" /%}
{% /tab %}

{% tab label="Java" %}
{% code-snippet file="/_code-samples/send-xrp/java/SendXrp.java" from="// Sign" before="// Submit" language="java" /%}
{% /tab %}

{% tab label="PHP" %}
{% code-snippet file="/_code-samples/send-xrp/php/send-xrp.php" from="// Sign" before="// Submit" language="php" /%}
{% /tab %}

{% /tabs %}

The result of the signing operation is a transaction object containing a signature. Typically, XRP Ledger APIs expect a signed transaction to be the hexadecimal representation of the transaction's canonical [binary format](../../references/protocol/binary-format.md), called a "blob".

- In `xrpl.js`, the signing API also returns the transaction's ID, or identifying hash, which you can use to look up the transaction later. This is a 64-character hexadecimal string that is unique to this transaction.
- In `xrpl-py`, you can get the transaction's hash in the response to submitting it in the next step.
- In xrpl4j, `SignatureService.sign` returns a `SignedTransaction`, which contains the transaction's hash, which you can use to look up the transaction later.
- In `XRPL_PHP`, the signing API also returns the transaction's ID, or identifying hash, which you can use to look up the transaction later. This is a 64-character hexadecimal string that is unique to this transaction.

{% interactive-block label="Sign" steps=$frontmatter.steps %}

<button id="sign-button" class="btn btn-primary previous-steps-required">Sign
  example transaction</button>
<div class="output-area"></div>

{% /interactive-block %}


### 5. Submit the Signed Blob

Now that you have a signed transaction, you can submit it to an XRP Ledger server, which relays it through the network. It's also a good idea to take note of the latest validated ledger index before you submit. The earliest ledger version that your transaction could get into as a result of this submission is one higher than the latest validated ledger when you submit it. Of course, if the same transaction was previously submitted, it could already be in a previous ledger. (It can't succeed a second time, but you may not realize it succeeded if you aren't looking in the right ledger versions.)

- **JavaScript:** Use the [`submitAndWait()` method of the Client](https://js.xrpl.org/classes/Client.html#submitAndWait) to submit a signed transaction to the network and wait for the response, or use [`submitSigned()`](https://js.xrpl.org/classes/Client.html#submitSigned) to submit a transaction and get only the preliminary response.
- **Python:** Use the [`xrpl.transaction.submit_and_wait()` method](https://xrpl-py.readthedocs.io/en/stable/source/xrpl.transaction.html#xrpl.transaction.submit_and_wait) to submit a transaction to the network and wait for a response.
- **Java:** Use the [`XrplClient.submit(SignedTransaction)` method](https://javadoc.io/doc/org.xrpl/xrpl4j-client/latest/org/xrpl/xrpl4j/client/XrplClient.html#submit(org.xrpl.xrpl4j.crypto.signing.SignedTransaction)) to submit a transaction to the network. Use the [`XrplClient.ledger()`](https://javadoc.io/doc/org.xrpl/xrpl4j-client/latest/org/xrpl/xrpl4j/client/XrplClient.html#ledger(org.xrpl.xrpl4j.model.client.ledger.LedgerRequestParams)) method to get the latest validated ledger index.
- **PHP:** Use the [`submitAndWait()` method of the Client](https://alexanderbuzz.github.io/xrpl-php-docs/client.html) to submit a transaction to the network and wait for the response.

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/send-xrp/js/send-xrp.js" from="// Submit" before="// Wait" language="js" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/send-xrp/py/send-xrp.py" from="# Submit" before="# Wait" language="py" /%}
{% /tab %}

{% tab label="Java" %}
{% code-snippet file="/_code-samples/send-xrp/java/SendXrp.java" from="// Submit" before="// Wait" language="java" /%}
{% /tab %}

{% tab label="PHP" %}
{% code-snippet file="/_code-samples/send-xrp/php/send-xrp.php" from="// Submit" before="// Wait" language="php" /%}
{% /tab %}

{% /tabs %}

This method returns the **tentative** result of trying to apply the transaction to the open ledger. This result _can_ change when the transaction is included in a validated ledger: transactions that succeed initially might ultimately fail, and transactions that fail initially might ultimately succeed. Still, the tentative result often matches the final result, so it's OK to get excited if you see `tesSUCCESS` here. 😁

If you see any other result, you should check the following:

- Are you using the correct addresses for the sender and destination?
- Did you forget any other fields of the transaction, skip any steps, or make any other typos?
- Do you have enough Test XRP to send the transaction? The amount of XRP you can send is limited by the [reserve requirement](../../concepts/accounts/reserves.md), which is currently 10 XRP with an additional 2 XRP for each "object" you own in the ledger. (If you generated a new address with the Testnet Faucet, you don't own any objects.)
- Are you connected to a server on the test network?

See the full list of [transaction results](../../references/protocol/transactions/transaction-results/index.md) for more possibilities.

{% interactive-block label="Submit" steps=$frontmatter.steps %}

<button id="submit-button" class="btn btn-primary previous-steps-required" data-tx-blob-from="#signed-tx-blob" data-wait-step-name="Wait">Submit
example transaction</button>

{% loading-icon message="Sending..." /%}

<div class="output-area"></div>

{% /interactive-block %}


### 6. Wait for Validation

Most transactions are accepted into the next ledger version after they're submitted, which means it may take 4-7 seconds for a transaction's outcome to be final. If the XRP Ledger is busy or poor network connectivity delays a transaction from being relayed throughout the network, a transaction may take longer to be confirmed. (For more information on expiration of unconfirmed transactions, see [Reliable Transaction Submission](../../concepts/transactions/reliable-transaction-submission.md).)

- **JavaScript:**  If you used the [`.submitAndWait()` method](https://js.xrpl.org/classes/Client.html#submitAndWait), you can wait until the returned Promise resolves. Other, more asynchronous approaches are also possible.

- **Python:** If you used the [`xrpl.transaction.submit_and_wait()` method](https://xrpl-py.readthedocs.io/en/stable/source/xrpl.transaction.html#xrpl.transaction.submit_and_wait), you can wait for the function to return. Other approaches, including asynchronous ones using the WebSocket client, are also possible.

- **Java** Poll the [`XrplClient.transaction()` method](https://javadoc.io/doc/org.xrpl/xrpl4j-client/latest/org/xrpl/xrpl4j/client/XrplClient.html#transaction(org.xrpl.xrpl4j.model.client.transactions.TransactionRequestParams,java.lang.Class)) to see if your transaction has a final result. Periodically check that the latest validated ledger index has not passed the `LastLedgerIndex` of the transaction using the [`XrplClient.ledger()`](https://javadoc.io/doc/org.xrpl/xrpl4j-client/latest/org/xrpl/xrpl4j/client/XrplClient.html#ledger(org.xrpl.xrpl4j.model.client.ledger.LedgerRequestParams)) method.

- **PHP:**  If you used the [`.submitAndWait()` method](https://alexanderbuzz.github.io/xrpl-php-docs/client.html), you can wait until the returned Promise resolves. Other, more asynchronous approaches are also possible.

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/send-xrp/js/send-xrp.js" from="// Wait" before="// Check" language="js" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/send-xrp/py/send-xrp.py" from="# Wait" before="# Check" language="py" /%}
{% /tab %}

{% tab label="Java" %}
{% code-snippet file="/_code-samples/send-xrp/java/SendXrp.java" from="// Wait" before="// Check" language="java" /%}
{% /tab %}

{% tab label="PHP" %}
{% code-snippet file="/_code-samples/send-xrp/php/send-xrp.php" from="// Wait" before="// Check" language="php" /%}
{% /tab %}

{% /tabs %}

{% partial file="/docs/_snippets/interactive-tutorials/wait-step.md" /%}


### 7. Check Transaction Status

To know for sure what a transaction did, you must look up the outcome of the transaction when it appears in a validated ledger version.

- **JavaScript:** Use the response from `submitAndWait()` or call the [tx method][] using [`Client.request()`](https://js.xrpl.org/classes/Client.html#request).

    **Tip:** In **TypeScript** you can pass a [`TxRequest`](https://js.xrpl.org/interfaces/TxRequest.html) to the [`Client.request()`](https://js.xrpl.org/classes/Client.html#request) method.

- **Python:** Use the response from [`submit_and_wait()`](https://xrpl-py.readthedocs.io/en/stable/source/xrpl.transaction.html#xrpl.transaction.submit_and_wait) or call the [`xrpl.transaction.get_transaction_from_hash()` method](https://xrpl-py.readthedocs.io/en/latest/source/xrpl.transaction.html#xrpl.transaction.get_transaction_from_hash). (See the [tx method response format](../../references/http-websocket-apis/public-api-methods/transaction-methods/tx.md#response-format) for a detailed reference of the fields this can contain.)

- **Java:** Use the [`XrplClient.transaction()`](https://javadoc.io/doc/org.xrpl/xrpl4j-client/latest/org/xrpl/xrpl4j/client/XrplClient.html#transaction(org.xrpl.xrpl4j.model.client.transactions.TransactionRequestParams,java.lang.Class)) method to check the status of a transaction.

- **PHP:** Use the response from `submitAndWait()` or call the `tx method` using [`$client->syncRequest()`](https://alexanderbuzz.github.io/xrpl-php-docs/client.html).

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/send-xrp/js/send-xrp.js" from="// Check" before="// End of" language="js" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/send-xrp/py/send-xrp.py" from="# Check" language="py" /%}
{% /tab %}

{% tab label="Java" %}
{% code-snippet file="/_code-samples/send-xrp/java/SendXrp.java" from="// Check" language="java" /%}
{% /tab %}

{% tab label="PHP" %}
{% code-snippet file="/_code-samples/send-xrp/php/send-xrp.php" from="// Check" language="php" /%}
{% /tab %}

{% /tabs %}

**Caution:** XRP Ledger APIs may return tentative results from ledger versions that have not yet been validated. For example, in [tx method][] response, be sure to look for `"validated": true` to confirm that the data comes from a validated ledger version. Transaction results that are not from a validated ledger version are subject to change. For more information, see [Finality of Results](../../concepts/transactions/finality-of-results/index.md).

{% interactive-block label="Check" steps=$frontmatter.steps %}

<button id="get-tx-button" class="btn btn-primary previous-steps-required">Check transaction status</button>
<div class="output-area"></div>

{% /interactive-block %}


## Differences for Production

To send an XRP payment on the production XRP Ledger, the steps you take are largely the same. However, there are some key differences in the necessary setup:

- [Getting real XRP isn't free.](#getting-a-real-xrp-account)
- [You must connect to a server that's synced with the production XRP Ledger network.](#connecting-to-the-production-xrp-ledger)

### Getting a Real XRP Account

This tutorial uses a button to get an address that's already funded with Test Net XRP, which only works because Test Net XRP is not worth anything. For actual XRP, you need to get XRP from someone who already has some. (For example, you might buy it on an exchange.) You can generate an address and secret that'll work on either production or the Testnet as follows:

{% tabs %}

{% tab label="JavaScript" %}
```js
const wallet = new xrpl.Wallet()
console.log(wallet.address) // Example: rGCkuB7PBr5tNy68tPEABEtcdno4hE6Y7f
console.log(wallet.seed) // Example: sp6JS7f14BuwFY8Mw6bTtLKWauoUs
```
{% /tab %}

{% tab label="Python" %}
```py
from xrpl.wallet import Wallet
my_wallet = Wallet.create()
print(my_wallet.address) # Example: rGCkuB7PBr5tNy68tPEABEtcdno4hE6Y7f
print(my_wallet.seed)            # Example: sp6JS7f14BuwFY8Mw6bTtLKWauoUs
```
{% /tab %}

{% tab label="Java" %}
```java
WalletFactory walletFactory = DefaultWalletFactory.getInstance();
SeedWalletGenerationResult generationResult = walletFactory.randomWallet(false);
Wallet wallet = generationResult.wallet();
System.out.println(wallet.classicAddress()); // Example: rGCkuB7PBr5tNy68tPEABEtcdno4hE6Y7f
System.out.println(generationResult.seed()); // Example: sp6JS7f14BuwFY8Mw6bTtLKWauoUs
```
{% /tab %}

{% tab label="PHP" %}
```php
use XRPL_PHP\Wallet\Wallet;

$wallet = Wallet::generate();

print_r("Address: " . $wallet->getAddress());  // Example: rGCkuB7PBr5tNy68tPEABEtcdno4hE6Y7f
print_r("Seed: " . $wallet->getSeed()); // Example: sp6JS7f14BuwFY8Mw6bTtLKWauoUs
```
{% /tab %}

{% /tabs %}

**Warning:** You should only use an address and secret that you generated securely, on your local machine. If another computer generated the address and secret and sent it to you over a network, it's possible that someone else on the network may see that information. If they do, they'll have as much control over your XRP as you do. It's also recommended not to use the same address for the Testnet and Mainnet, because transactions that you created for use on one network could also be valid to execute on the other network, depending on the parameters you provided.

Generating an address and secret doesn't get you XRP directly; you're only choosing a random number. You must also receive XRP at that address to [fund the account](../../concepts/accounts/index.md#creating-accounts). A common way to acquire XRP is to buy it from an exchange, then withdraw it to your own address.

### Connecting to the Production XRP Ledger

When you instantiate your client's connect to the XRP Ledger, you must specify a server that's synced with the appropriate [network](../../concepts/networks-and-servers/parallel-networks.md). For many cases, you can use [public servers](../public-servers.md), such as in the following example:

{% tabs %}

{% tab label="JavaScript" %}
```js
const xrpl = require('xrpl')
const api = new xrpl.Client('wss://xrplcluster.com')
api.connect()
```
{% /tab %}

{% tab label="Python" %}
```py
from xrpl.clients import JsonRpcClient
client = JsonRpcClient("https://xrplcluster.com")
```
{% /tab %}

{% tab label="Java" %}
```java
final HttpUrl rippledUrl = HttpUrl.get("https://xrplcluster.com");
XrplClient xrplClient = new XrplClient(rippledUrl);
```
{% /tab %}

{% tab label="PHP" %}
```
use XRPL_PHP\Client\JsonRpcClient;

$client = new JsonRpcClient("https://xrplcluster.com");
```
{% /tab %}

{% /tabs %}

If you [install `rippled`](../../infrastructure/installation/index.md) yourself, it connects to the production network by default. (You can also [configure it to connect to the test net](../../infrastructure/configuration/connect-your-rippled-to-the-xrp-test-net.md) instead.) After the server has synced (typically within about 15 minutes of starting it up), you can connect to it locally, which has [various benefits](../../concepts/networks-and-servers/index.md). The following example shows how to connect to a server running the default configuration:

{% tabs %}

{% tab label="JavaScript" %}
```js
const xrpl = require('xrpl')
const api = new xrpl.Client('ws://localhost:6006')
api.connect()
```
{% /tab %}

{% tab label="Python" %}
```py
from xrpl.clients import JsonRpcClient
client = JsonRpcClient("http://localhost:5005")
```
{% /tab %}

{% tab label="Java" %}
```java
final HttpUrl rippledUrl = HttpUrl.get("http://localhost:5005");
XrplClient xrplClient = new XrplClient(rippledUrl);
```
{% /tab %}

{% tab label="PHP" %}
```php
use XRPL_PHP\Client\JsonRpcClient;

$client = new JsonRpcClient("http://localhost:5005");
```
{% /tab %}

{% /tabs %}

**Tip:** The local connection uses an unencrypted protocol (`ws` or `http`) rather than the TLS-encrypted version (`wss` or `https`). This is secure only because the communications never leave the same machine, and is easier to set up because it does not require a TLS certificate. For connections on an outside network, always use `wss` or `https`.

## Next Steps

After completing this tutorial, you may want to try the following:

- [Issue a token](../how-tos/use-tokens/issue-a-fungible-token.md) on the XRP Ledger Testnet.
- [Trade in the Decentralized Exchange](../how-tos/use-tokens/trade-in-the-decentralized-exchange.md).
- Build [Reliable transaction submission](../../concepts/transactions/reliable-transaction-submission.md) for production systems.
- Check your [client library](../../references/client-libraries.md)'s API reference for the full range of XRP Ledger functionality.
- Customize your [Account Settings](../how-tos/manage-account-settings/index.md).
- Learn how [Transaction Metadata](../../references/protocol/transactions/metadata.md) describes the outcome of a transaction in detail.
- Explore more [Payment Types](../../concepts/payment-types/index.md) such as Escrows and Payment Channels.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
