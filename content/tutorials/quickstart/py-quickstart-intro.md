quickstart---
html: py-quickstart-intro.html
parent: quickstart-python.html
blurb: Use a Python test harness to send XRP, trade currencies, and mint and trade NFTs.
labels:
  - Accounts
  - Cross-Currency
  - Non-fungible Tokens, NFTs
  - Payments
  - Quickstart
  - Tokens
  - XRP
---
# Quickstart Introduction (Python)

The XRP Ledger (XRPL) is a robust, secure, customizable service. You can create your own interface to try out the capabilities and support your specific business needs.

This quickstart describes a test harness interface you can build to try out the XRP Ledger. The test harness displays multiple accounts, so that you can transfer tokens from one account to the other and see the results in real time. The image below shows the Token Test Harness at the completion of step 4.

[![Quickstart Tutorial Window](img/quickstart-py15.png)](img/quickstart-py15.png)

That is a lot of fields and buttons, all working together to perform some significant practical tasks. But getting _started_ with the XRP Ledger is not that complicated. When you eat the elephant a bite at a time, none of the tasks are difficult to consume.

Typically, the example functions for interacting with the XRP Ledger involve four steps.

1. Connect to the XRP Ledger and instantiate your wallet.
2. Make changes to the XRP Ledger using transactions.
3. Get the state of accounts and tokens on the XRP Ledger using requests.
4. Disconnect from the XRP Ledger.

Each lesson shows you how to build the Token Test Harness one section at a time. Each module lets you try out meaningful interactions with the test ledger, with complete Python code samples and a code walkthrough. There is also a link to the complete source code for each section that can be modified with a text editor and run in a Python environment. You can try out the examples in any order.

This quickstart tutorial introduces you to the API used to implement features and explore the capabilities of XRP Ledger. It does not represent _all_ of the capabilities of the API and this example is not intended for production or secure payment use.

Much of this is “brute force” code that sacrifices conciseness for readability. Each example builds on the previous step, adding a new Python UI file and a module to support the new behavior in the lesson. We expect the applications you build to greatly improve upon these examples. Your feedback and contributions are most welcome.

In this quickstart, you can:

1. [Create Accounts and Send XRP](py-create-accounts-send-xrp.html)
2. [Create Trust Line and Send Currency](py-create-trustline-send-currency.html).
3. [Mint and Burn NFTs](py-mint-and-burn-nfts.html).
4. [Transfer NFTs](py-transfer-nfts.html).

There are also expanded lessons demonstrating how to [Broker an NFT Sale](py-broker-sale.html) and [Assign an Authorized Minter](py-authorize-minter.html).


## Prerequisites

To get started, create a new folder on your local disk and install the Python library (xrpl-py) using `pip`.

```
    pip3 install xrpl-py
```

Download the python [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/quickstart/py/){.github-code-download}.

**Note:** Without the Quickstart Samples, you will not be able to try the examples that follow.