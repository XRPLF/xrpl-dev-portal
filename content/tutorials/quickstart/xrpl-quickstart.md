---
html: xrpl-quickstart.html
parent: quickstart.html
blurb: Use a JavaScript test harness to send XRP, trade currencies, and mint and trade NFTokens.
labels:
  - Quickstart
  - Tokens
  - NFTokens
---


# XRPL Quickstart

The XRP Ledger (XRPL)  is a robust, secure, customizable service. You can create your own interface to try out the capabilities and support your specific business needs.

This Quickstart describes a test harness interface you can build to try out the XRPL. The harness displays multiple accounts, so that you can transfer tokens from one account to the other and see the results in real time. The image below shows the Token Test Harness at the completion of step 4.

![Quickstart Tutorial Window](img/quickstart1.png)

That is a lot of fields and buttons, all working together to perform some significant practical tasks. But getting _started_ with the XRPL is not that complicated. When you eat the elephant a bite at a time, none of the tasks is all that difficult to consume.

Typically, the example functions for interacting with the XRPL involve four steps.



1. Connect to the XRPL and instantiate your wallet.
2. Make changes to the XRPL using transactions.
3. Get the state of accounts and tokens on the XRPL using requests.
4. Disconnect from the XRPL.

Each lesson shows you how to build the Token Test Harness one section at a time. Each module lets you try out meaningful interactions with the test ledger, with complete JavaScript and HTML code samples and a code walkthrough. There is also a link to the complete source code for each section that can be modified with a text editor and run in a browser. If you just cannot wait, you can jump to lesson 4, [Transfer NFTokens](transfer-nftokens.html), and try out the complete test harness right away.

Not all of the capabilities of the API are represented in this quickstart tutorial. This example is not intended for production or secure payment use, but to introduce you to the API used to implement features and explore the capabilities of XRPL.

Much of this is “brute force” code that sacrifices conciseness for readability. We anticipate that the applications you build greatly improve upon these examples. Your feedback and contributions are most welcome.

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/quickstart/quickstart.zip) archive to try each of the samples in your own browser.


1. [Create Accounts and Send XRP](create-accounts-send-xrp.html)
2. [Create TrustLine and Send Currency](create-trustline-send-currency.html).
3. [Mint and Burn NFTokens](mint-and-burn-nftokens.html).
4. [Transfer NFTokens](transfer-nftokens.html).


| Previous      | Next                                                             |
| :---          |                                                             ---: |
|               | 1. [Create Accounts and Send XRP](create-accounts-send-xrp.html) |
