---
html: javascript.html
parent: tutorials.html
top_nav_grouping: Article Types
metadata:
  indexPage: true
---
# JavaScript

You can create your own interface to try out the capabilities and support your specific business needs. These tutorials build a test harness interface to try out features of the XRP Ledger. The harness displays multiple accounts, so that you can transfer tokens from one account to the other and see the results in real time.

Typically, the example functions involve four steps.

- Connect to the XRP Ledger and instantiate your wallet.
- Make changes to the XRP Ledger using transactions.
- Get the state of accounts and tokens on the XRP Ledger using requests.
- Disconnect from the XRP Ledger.

Each lesson builds the Token Test Harness one section at a time, with complete JavaScript and HTML code samples and a code walkthrough. You can download the source code, manipulate it in a text editor, and run it in your favorite browser. 

Much of this is “brute force” code that sacrifices conciseness for readability. Each example builds on the previous examples, adding a new JavaScript file and the supporting HTML UI. 

Once familiar with the library functions, you can build sample applications in JavaScript. We anticipate that the applications you build greatly improve upon these examples. Your feedback and contributions are most welcome.

To get started:
- create a new folder on your local disk and install the JavaScript library using npm.

  `npm install xrpl`

- Clone or download the [Sample modules](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/js/).

## Tutorial Modules

{% child-pages /%}