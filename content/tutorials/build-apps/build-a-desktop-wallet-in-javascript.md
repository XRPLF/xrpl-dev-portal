---
parent: build-apps.html
targets:
  - en
  - ja # TODO: translate this page
blurb: Build a graphical desktop wallet for the XRPL using JavaScript.
---
# Build a Desktop Wallet in JavaScript
<!-- STYLE_OVERRIDE: wallet -->

This tutorial demonstrates how to build a desktop wallet for the XRP Ledger using the JavaScript programming language, 
the Electron Framework and various libraries. This application can be used as a starting point for building a more 
complex and powerful application, as a reference point for building comparable apps, or as a learning experience to 
better understand how to integrate XRP Ledger functionality into a larger project.

## Prerequisites

To complete this tutorial, you should meet the following requirements:

- You have node.js 14+ installes on your machine.
- You are somewhat familiar with modern JavaScript programming and have completed the [Get Started Using JavaScript tutorial](get-started-using-javascript.html).
- You have at least some rough understanding of what the XRP Ledger, it's capabilities and of cryptocurrency in general. Ideally you have completed the [Basic XRPL guide](https://learn.xrpl.org/)

## Source Code

You can find the complete source code for all of this tutorial's examples in the [code samples section of this website's repository]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/).

## Rationale

This tutorial takes you through the process of creating a XRP Wallet application from scratch. Starting with a simple,
hello-world like example with minimal functionality, we add more complex functionality, progressing step-by-step.

As JavaScript is a programming language that originated in the web browser ecosystem, it is by it's nature not natively 
suited for creating apps. Here we have to choose from a bunch of frameworks that enable us to write desktop apps with 
JavaScript. For this tutorial we will use the [Electron Framework](https://www.electronjs.org/), as it is well 
established, documented and will get us up and running without having to care for dependencies and stuff that would make 
us divert too much from the goals of this tutorial.

## Goals

At the end of this tutorial, you will have built a JavaScript Wallet application that looks something like this:

![Desktop wallet screenshot](img/javascript-wallet-preview.png)

The look and feel of the user interface should be roughly the same, as the Electron Framework allows us to write 
cross-platform applications that are styled with CSS.

This application is capable of the following:

- Shows updates to the XRP Ledger in real-time.
- Can view any XRP Ledger account's activity "read-only" including showing how much XRP was delivered by each transaction.
- Shows how much XRP is set aside for the account's [reserve requirement](reserves.html).
- Can send [direct XRP payments](direct-xrp-payments.html), and provides feedback about the intended destination address, including:
    - Whether the intended destination already exists in the XRP Ledger, or the payment would have to fund its creation.
    - If the address doesn't want to receive XRP ([`DisallowXRP` flag](become-an-xrp-ledger-gateway.html#disallow-xrp) enabled).
    - If the address has a [verified domain name](https://xrpl.org/xrp-ledger-toml.html#account-verification) associated with it.

The application in this tutorial _doesn't_ have the ability to send or trade [tokens](issued-currencies.html) or use other [payment types](payment-types.html) like Escrow or Payment Channels. However, it provides a foundation that you can implement those and other features on top of.

In addition to the above features, you'll also learn a little bit about Events, IPC (inter-process-communication) 
and asynchronous (async) code in JavaScript.

## Steps

### Install Dependencies

This tutorial depends on various programming libraries. To get the project up and running, in the build-a-wallet-with-javascript/js
folder, run the following command to install the required modules:

```console
npm install
```

This installs the Electron Framework, the xrpl.js client library and the async.js library we will use for the polling example.


### 1. Hello World

```console
npm run hello
```

### 2.a Show Ledger Updates by Polling

```console
npm run async-poll
```

### 2.b Show Ledger Updates by Using Subscriptions

```console
npm run async-subscribe
```

### 3. Display an Account

```console
npm run account
```

### 4. Show Account's Transactions

```console
npm run tx-history
```


### 5. Send XRP

```console
npm run send-xrp
```


### 6. Domain Verification and Polish

TDB


## Next Steps

TBD

