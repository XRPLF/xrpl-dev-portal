---
seo:
    description: Build a Java app that interacts with the XRP Ledger.
labels:
  - Development
---

{% code-walkthrough
  filesets=[
    {
      "files": ["/_code-samples/get-started/java/src/main/java/com/example/xrpl/GetAccountInfo.java"],
      "downloadAssociatedFiles": ["/_code-samples/get-started/java/pom.xml", "/_code-samples/get-started/java/src/main/java/com/example/xrpl/GetAccountInfo.java", "/_code-samples/get-started/java/src/main/resources/logback.xml", "/_code-samples/get-started/java/README.md"]
    }
  ]
%}

# Get Started Using Java Library

This tutorial walks you through the basics of building an XRP Ledger-connected application using [`xrpl4j`](https://github.com/XRPLF/xrpl4j), a pure Java library built to interact with the XRP Ledger.

This tutorial is intended for beginners and should take no longer than 30 minutes to complete.

## Goals

In this tutorial, you'll learn:

- The basic building blocks of XRP Ledger-based applications.
- How to connect to the XRP Ledger using `xrpl4j`.
- How to get an account on the [Testnet](/resources/dev-tools/xrp-faucets) using `xrpl4j`.
- How to use the `xrpl4j` library to look up information about an account on the XRP Ledger.
- How to put these steps together to create a Java app.

## Prerequisites

To complete this tutorial, you should meet the following guidelines:

- Have a basic understanding of Java.
- Have installed [Java 11](https://adoptium.net/) or later.
- Have installed [Maven](https://maven.apache.org/).

## Source Code

Click **Download** on the top right of the code preview panel to download the source code.

## Steps

Follow the steps to create a simple application with `xrpl4j`.

{% step id="import-tag" %}
### 1. Install Dependencies

The [`xrpl4j` library](https://github.com/XRPLF/xrpl4j) is available on [Maven Central](https://search.maven.org/artifact/org.xrpl/xrpl4j-parent).

Start a new Maven project, then add the `xrpl4j-client` module to the `dependencies` section of your project's `pom.xml` file. It pulls in the rest of the library:

```xml
<dependency>
  <groupId>org.xrpl</groupId>
  <artifactId>xrpl4j-client</artifactId>
  <version>6.0.0</version>
</dependency>
```

Alternatively, if you're using the downloaded source code, you can install all dependencies from the `pom.xml` file:

```sh
mvn install
```
{% /step %}

### 2. Connect to the XRP Ledger

{% step id="connect-tag" %}
#### Connect to the XRP Ledger Testnet

To make queries and submit transactions, you need to connect to the XRP Ledger. To do this with `xrpl4j`, you can use an [`XrplClient`](https://javadoc.io/doc/org.xrpl/xrpl4j-client/latest/org/xrpl/xrpl4j/client/XrplClient.html). The client sends each request over JSON-RPC, so there is no connection to open or close.

The sample code shows you how to connect to the Testnet, which is one of the available [parallel networks](../../concepts/networks-and-servers/parallel-networks.md).
{% /step %}

{% step id="connect-mainnet-tag" %}
#### Connect to the XRP Ledger Mainnet

The sample code in the previous section shows you how to connect to the Testnet, which is a [parallel network](../../concepts/networks-and-servers/parallel-networks.md) for testing where the money has no real value. When you're ready to integrate with the production XRP Ledger, you'll need to connect to the Mainnet. You can do that in two ways:

- By [installing the core server](../../infrastructure/installation/index.md) (`xrpld`) and running a node yourself. The core server connects to the Mainnet by default, but you can [change the configuration to use Testnet or Devnet](../../infrastructure/configuration/connect-your-xrpld-to-the-xrp-test-net.md). [There are good reasons to run your own core server](../../concepts/networks-and-servers/index.md#reasons-to-run-your-own-server). If you run your own server, you can connect to it like so:

    ```java
    XrplClient xrplClient = new XrplClient(HttpUrl.get("http://localhost:5005/"));
    ```

    See the example {% source-link name="core server config file" path="cfg/xrpld-example.cfg#L1469" /%} for more information about default values.

- By using one of the available [public servers][]:

    ```java
    XrplClient xrplClient = new XrplClient(HttpUrl.get("https://s2.ripple.com:51234/"));
    ```
{% /step %}

### 3. Get Account

{% step id="get-account-create-wallet-tag" %}
#### Create and Fund a Wallet

To store value and execute transactions on the XRP Ledger, you need to get an account: a [set of keys](../../concepts/accounts/cryptographic-keys.md#key-components) and an [address](../../concepts/accounts/addresses.md) that's been [funded with enough XRP](../../concepts/accounts/index.md#creating-accounts) to meet the [account reserve](../../concepts/accounts/reserves.md). The address is the identifier of your account and you use the [private key](../../concepts/accounts/cryptographic-keys.md#private-key) to sign transactions that you submit to the XRP Ledger. For production purposes, you should take care to store your keys and set up a [secure signing method](../../concepts/transactions/secure-signing.md).

To generate a new account, `xrpl4j` provides the [`Seed`](https://javadoc.io/doc/org.xrpl/xrpl4j-core/latest/org/xrpl/xrpl4j/crypto/keys/Seed.html) class. A random seed derives a [`KeyPair`](https://javadoc.io/doc/org.xrpl/xrpl4j-core/latest/org/xrpl/xrpl4j/crypto/keys/KeyPair.html), and the address is derived from its public key.

For testing and development purposes, you can use a [`FaucetClient`](https://javadoc.io/doc/org.xrpl/xrpl4j-client/latest/org/xrpl/xrpl4j/client/faucet/FaucetClient.html) connected to the XRP Ledger [Testnet](../../concepts/networks-and-servers/parallel-networks.md) to fund the account. The faucet payment takes a few seconds to be validated, so the sample code waits until the account appears in a validated ledger before continuing.
{% /step %}

{% step id="get-account-create-wallet-c-tag" %}
#### (Optional) Use Your Own Wallet Seed

To use an existing wallet seed encoded in [base58][], create the `Seed` with `Seed.fromBase58EncodedSecret()` and derive the key pair from it. This also requires importing `org.xrpl.xrpl4j.crypto.keys.Base58EncodedSecret`.
{% /step %}

{% step id="query-xrpl-tag" %}
### 4. Query the XRP Ledger

You can query the XRP Ledger to get information about [a specific account](../../references/http-websocket-apis/public-api-methods/account-methods/index.md), [a specific transaction](../../references/http-websocket-apis/public-api-methods/transaction-methods/tx.md), the state of a [current or a historical ledger](../../references/http-websocket-apis/public-api-methods/ledger-methods/index.md), and [the XRP Ledger's decentralized exchange](../../references/http-websocket-apis/public-api-methods/path-and-order-book-methods/index.md). You need to make these queries, among other reasons, to look up account info to follow best practices for [reliable transaction submission](../../concepts/transactions/reliable-transaction-submission.md).

Here, we'll use the `XrplClient` we constructed to look up information about the account we got in the previous step. The request asks for the latest validated ledger, and the sample prints the result as JSON using the library's `ObjectMapperFactory`.
{% /step %}

{% step id="run-app-tag" %}
### 5. Run the Application

Finally, in your terminal, run the application from the folder that contains the `pom.xml` file like so:

```sh
mvn exec:java -Dexec.mainClass=com.example.xrpl.GetAccountInfo
```

You should see output similar to this example:

```sh
Creating a new wallet and funding it with Testnet XRP...
Wallet: raWynmAz4cd6fFBx8Zua737CT3HYHHk71n
Account Testnet Explorer URL:
  https://testnet.xrpl.org/accounts/raWynmAz4cd6fFBx8Zua737CT3HYHHk71n

Getting account info...
{
  "status" : "success",
  "account_data" : {
    "LedgerEntryType" : "AccountRoot",
    "Account" : "raWynmAz4cd6fFBx8Zua737CT3HYHHk71n",
    "Balance" : "100000000",
    "Flags" : 0,
    "OwnerCount" : 0,
    "PreviousTxnID" : "1A6072ADED5C0CED0E0D864F49EFD107E63F17A303F93DA5919C75D90166C54F",
    "PreviousTxnLgrSeq" : 22224134,
    "Sequence" : 22224134,
    "index" : "6CEAC28531D19D48F973429A9CC81CB08712C9A88B19A3F64C32D093EA0F91BA"
  },
  "ledger_index" : 22224134,
  "validated" : true
}
```

The response fields that you want to inspect in most cases are:

- `account_data.Sequence` — This is the sequence number of the next valid transaction for the account. You need to specify the sequence number when you prepare transactions.

- `account_data.Balance` — This is the account's balance of [XRP, in drops][]. You can use this to confirm that you have enough XRP to send (if you're making a payment) and to meet the [current transaction cost](../../concepts/transactions/transaction-cost.md#current-transaction-cost) for a given transaction.

- `validated` — Indicates whether the returned data is from a [validated ledger](../../concepts/ledgers/open-closed-validated-ledgers.md). When inspecting transactions, it's important to confirm that [the results are final](../../concepts/transactions/finality-of-results/index.md) before further processing the transaction. If `validated` is `true` then you know for sure the results won't change. For more information about best practices for transaction processing, see [Reliable Transaction Submission](../../concepts/transactions/reliable-transaction-submission.md).

For a detailed description of every response field, see [account_info](../../references/http-websocket-apis/public-api-methods/account-methods/account_info.md#response-format).
{% /step %}

## See Also

- **Concepts:**
    - [XRP Ledger Overview](/about/)
    - [Client Libraries](../../references/client-libraries.md)
- **Tutorials:**
    - [Send XRP](../payments/send-xrp)
    - [Issue a Fungible Token](../tokens/fungible-tokens/issue-a-fungible-token.md)
    - [Set up Secure Signing](../../concepts/transactions/secure-signing.md)
- **References:**
    - [`xrpl4j` Reference](https://javadoc.io/doc/org.xrpl/xrpl4j-client/latest/)
    - [Public API Methods](../../references/http-websocket-apis/public-api-methods/index.md)
    - [API Conventions](../../references/http-websocket-apis/api-conventions/index.md)
        - [base58 Encodings](../../references/protocol/data-types/base58-encodings.md)
    - [Transaction Formats](../../references/protocol/transactions/index.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}

{% /code-walkthrough %}
