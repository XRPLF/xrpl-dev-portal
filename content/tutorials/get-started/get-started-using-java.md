---
html: get-started-using-java.html
parent: get-started.html
funnel: Build
doc_type: Tutorials
category: Get Started
blurb: Build a Java app that interacts with the XRP Ledger.
cta_text: Build an XRP Ledger-connected app
top_nav_name: Java
top_nav_grouping: Get Started
labels:
  - Development
showcase_icon: assets/img/logos/java.svg
---

# Get Started Using Java

This tutorial walks you through the basics of building an XRP Ledger-connected application using [`xrpl4j`](https://github.com/XRPLF/xrpl4j), a pure Java library built to interact with the XRP Ledger.

This tutorial is intended for beginners and should take no longer than 30 minutes to complete.

## Learning Goals

In this tutorial, you'll learn:

* The basic building blocks of XRP Ledger-based applications.
* How to connect to the XRP Ledger using `xrpl4j`.
* How to get an account on the [Testnet](xrp-testnet-faucet.html) using `xrpl4j`.
* How to use the `xrpl4j` library to look up information about an account on the XRP Ledger.
* How to put these steps together to create a Java app.

## Requirements

* The `xrpl4j` library supports Java 1.8 and later.
* A project management tool such as [Maven](https://maven.apache.org/) or [Gradle](https://gradle.org/). <!-- SPELLING_IGNORE: gradle -->


## Installation

The [`xrpl4j` library](https://github.com/XRPLF/xrpl4j) is available on [Maven Central](https://search.maven.org/artifact/org.xrpl/xrpl4j-parent).
`xrpl4j` is split into multiple artifacts, which can be imported as needed.

In this tutorial, you need the [xrpl4j-client](https://javadoc.io/doc/org.xrpl/xrpl4j-client/latest/index.html), [xrpl4j-address-codec](https://javadoc.io/doc/org.xrpl/xrpl4j-address-codec/latest/index.html), [xrpl4j-keypairs](https://javadoc.io/doc/org.xrpl/xrpl4j-keypairs/latest/index.html), and [xrpl4j-model](https://javadoc.io/doc/org.xrpl/xrpl4j-model/latest/index.html) modules. <!-- SPELLING_IGNORE: keypairs -->

To install with Maven, add the following to your project's `pom.xml` file and then run `mvn install`:

```xml
<dependencies>
    <dependency>
      <groupId>org.xrpl</groupId>
      <artifactId>xrpl4j-client</artifactId>
      <version>2.0.0</version>
    </dependency>
    <dependency>
      <groupId>org.xrpl</groupId>
      <artifactId>xrpl4j-address-codec</artifactId>
      <version>2.0.0</version>
    </dependency>
    <dependency>
      <groupId>org.xrpl</groupId>
      <artifactId>xrpl4j-keypairs</artifactId>
      <version>2.0.0</version>
    </dependency>
    <dependency>
      <groupId>org.xrpl</groupId>
      <artifactId>xrpl4j-model</artifactId>
      <version>2.0.0</version>
    </dependency>
</dependencies>
```

Check out the [xrpl4j sample project](https://github.com/XRPLF/xrpl4j-sample) for a full Maven project containing the code from this tutorial.

## Start Building
{% set n = cycler(* range(1,99)) %}

When you're working with the XRP Ledger, there are a few things you'll need to manage, whether you're adding XRP to your [account](accounts.html), integrating with the [decentralized exchange](decentralized-exchange.html), or [issuing tokens](tokens.html). This tutorial walks you through basic patterns common to getting started with all of these use cases and provides sample code for implementing them.

Here are the basic steps you'll need to cover for almost any XRP Ledger project:

1. [Connect to the XRP Ledger.](#1-connect-to-the-xrp-ledger)
1. [Get an account.](#2-get-account)
1. [Query the XRP Ledger.](#3-query-the-xrp-ledger)


### {{n.next()}}. Connect to the XRP Ledger

To make queries and submit transactions, you need to connect to the XRP Ledger. To do this with `xrpl4j`,
you can use an [`XrplClient`](https://javadoc.io/doc/org.xrpl/xrpl4j-client/latest/org/xrpl/xrpl4j/client/XrplClient.html):

{{ include_code("_code-samples/get-started/java/GetAccountInfo.java", start_with="// Construct a network client", end_before="// Create a Wallet using a WalletFactory", language="java") }}

#### Connect to the production XRP Ledger

The sample code in the previous section shows you how to connect to the Testnet, which is one of the available [parallel networks](parallel-networks.html). When you're ready to integrate with the production XRP Ledger, you'll need to connect to the Mainnet. You can do that in two ways:

* By [installing the core server](install-rippled.html) (`rippled`) and running a node yourself. The core server connects to the Mainnet by default, but you can [change the configuration to use Testnet or Devnet](connect-your-rippled-to-the-xrp-test-net.html). [There are good reasons to run your own core server](xrpl-servers.html#reasons-to-run-your-own-server). If you run your own server, you can connect to it like so:

        final HttpUrl rippledUrl = HttpUrl.get("http://localhost:5005/");
        XrplClient xrplClient = new XrplClient(rippledUrl);

    See the example [core server config file](https://github.com/ripple/rippled/blob/c0a0b79d2d483b318ce1d82e526bd53df83a4a2c/cfg/rippled-example.cfg#L1562) for more information about default values.

* By using one of the available [public servers][]:

        final HttpUrl rippledUrl = HttpUrl.get("https://s2.ripple.com:51234/");
        XrplClient xrplClient = new XrplClient(rippledUrl);

### {{n.next()}}. Get account

To store value and execute transactions on the XRP Ledger, you need to get an account: a [set of keys](cryptographic-keys.html#key-components) and an [address](accounts.html#addresses) that's been [funded with enough XRP](accounts.html#creating-accounts) to meet the [account reserve](reserves.html). The address is the identifier of your account and you use the [private key](cryptographic-keys.html#private-key) to sign transactions that you submit to the XRP Ledger. For production purposes, you should take care to store your keys and set up a [secure signing method](set-up-secure-signing.html).

To generate a new account, `xrpl4j` provides the [`DefaultWalletFactory`](https://javadoc.io/doc/org.xrpl/xrpl4j-keypairs/latest/org/xrpl/xrpl4j/wallet/DefaultWalletFactory.html).

{{ include_code("_code-samples/get-started/java/GetAccountInfo.java", start_with="// Create a Wallet using a WalletFactory", end_before="// Get the Classic and X-Addresses from testWallet", language="java") }}


The result of a call to `walletFactory.randomWallet(true).wallet()` is a [`Wallet` instance](https://javadoc.io/doc/org.xrpl/xrpl4j-keypairs/latest/org/xrpl/xrpl4j/wallet/Wallet.html):

```java
System.out.println(testWallet);

// print output
Wallet {
    privateKey= -HIDDEN-,
    publicKey=ED90635A6F2A5905D3D5CD2C14905FFB2D838185993576CA4CEE24A920D0D6BD6B,
    classicAddress=raj5eirfEpbN9YzG9FzB8ZPNyjpFvH6ycV,
    xAddress=T76mQFr9zLGi2LCjVDgJ7mEQCk4767SdEL32mZFygpdGcFf,
    isTest=true
}
```

For testing and development purposes, you can use a `FaucetClient` connected to the XRP Ledger [Testnet](parallel-networks.html):

{{ include_code("_code-samples/get-started/java/GetAccountInfo.java", start_with="// Fund the account using the testnet Faucet", end_before="// Look up your Account Info", language="java") }}

### {{n.next()}}. Query the XRP Ledger

You can query the XRP Ledger to get information about [a specific account](account-methods.html), [a specific transaction](tx.html), the state of a [current or a historical ledger](ledger-methods.html), and [the XRP Ledger's decentralized exchange](path-and-order-book-methods.html). You need to make these queries, among other reasons, to look up account info to follow best practices for [reliable transaction submission](reliable-transaction-submission.html).

Here, we'll use the [`XrplClient` we constructed](#1-connect-to-the-xrp-ledger) to look up information about the [account we got](#2-get-account) in the previous step.

{{ include_code("_code-samples/get-started/java/GetAccountInfo.java", start_with="// Look up your Account Info", end_before="// Print the result", language="java") }}


### {{n.next()}}. Putting it all together

Using these building blocks, we can create a Java app that:

1. Gets an account on the Testnet.
2. Connects to the XRP Ledger.
3. Looks up and prints information about the account you created.


```java
{% include '_code-samples/get-started/java/GetAccountInfo.java' %}
```

To run the app, you can download the code from [Github](https://github.com/XRPLF/xrpl4j-sample) and run `GetAccountInfo` either
from your IDE or from the command line.

```sh
git clone https://github.com/XRPLF/xrpl4j-sample.git
cd xrpl4j-sample
mvn compile exec:java -Dexec.mainClass="org.xrpl.xrpl4j.samples.GetAccountInfo"
```

You should see output similar to this example:

```sh
Running the GetAccountInfo sample...
Constructing an XrplClient connected to https://s.altnet.rippletest.net:51234/
Generated a wallet with the following public key: ED015D922B5EACF09DF01168141FF27FA6229B0FAB9B4CD88D2B6DA036090EFAA4
Classic Address: rBXHGshqXu3Smy9FUsQTmo49bGpQUQEm3X
X-Address: T7yMiiJJCmgY2yg5WB2davUedDeBFAG5B8r9KHjKCxDdvv3
Funded the account using the Testnet faucet.
AccountInfoResult{
    status=success,
    accountData=AccountRootObject{
        ledgerEntryType=ACCOUNT_ROOT,
        account=rBXHGshqXu3Smy9FUsQTmo49bGpQUQEm3X,
        balance=1000000000,
        flags=0,
        ownerCount=0,
        previousTransactionId=0000000000000000000000000000000000000000000000000000000000000000,
        previousTransactionLedgerSequence=0,
        sequence=17178149,
        signerLists=[],
        index=0DC1B13C73A7F3D2D82446526D0C5D08E88F89BA442D54291117F1A08E447685
    },
    ledgerCurrentIndex=17178149,
    validated=false
}
```

#### Interpreting the response

The response fields contained in `AccountInfoResult` that you want to inspect in most cases are:

* `accountData.sequence` — This is the sequence number of the next valid transaction for the account. You need to specify the sequence number when you prepare transactions.

* `accountData.balance` — This is the account's balance of XRP, in drops. You can use this to confirm that you have enough XRP to send (if you're making a payment) and to meet the [current transaction cost](transaction-cost.html#current-transaction-cost) for a given transaction.

* `validated` — Indicates whether the returned data is from a [validated ledger](ledgers.html#open-closed-and-validated-ledgers). When inspecting transactions, it's important to confirm that [the results are final](finality-of-results.html) before further processing the transaction. If `validated` is `true` then you know for sure the results won't change. For more information about best practices for transaction processing, see [Reliable Transaction Submission](reliable-transaction-submission.html).

For a detailed description of every response field, see [account_info](account_info.html#response-format).


## Keep on building

Now that you know how to use `xrpl4j` to connect to the XRP Ledger, get an account, and look up information about it, you can also use `xrpl4j` to:

* [Send XRP](send-xrp.html).
* [Set up secure signing](set-up-secure-signing.html) for your account.


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
