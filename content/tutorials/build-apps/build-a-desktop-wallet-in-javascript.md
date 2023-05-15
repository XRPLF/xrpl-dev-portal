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

- You have [Node.js](https://nodejs.org/) 14+ installed.
- You are somewhat familiar with modern JavaScript programming and have completed the [Get Started Using JavaScript tutorial](get-started-using-javascript.html).
- You have at least some rough understanding of what the XRP Ledger, it's capabilities and of cryptocurrency in general. Ideally you have completed the [Basic XRPL guide](https://learn.xrpl.org/).

### Source Code

You can find the complete source code for all of this tutorial's examples in the [code samples section of this website's repository]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/).

## Rationale

This tutorial takes you through the process of creating a XRP Wallet application from scratch. Starting with a simple,
"Hello World" like example with minimal functionality, step-by-step we will add more and more complex features.

As JavaScript is a programming language that originated in the web browser ecosystem, it's not natively 
supporting the creation of desktop applications. We have to pick a frameworks that enable us to write 
desktop applications with JavaScript. For this tutorial we will use the [Electron Framework](https://www.electronjs.org/), as it is well 
established, documented and will get us up and running without having to care for dependencies and stuff that would make 
us divert too much from the goals of this tutorial.

## Goals

At the end of this tutorial, you will have built a JavaScript Wallet application that looks something like this:

![Desktop wallet screenshot](img/javascript-wallet-preview.png)

The look and feel of the user interface should be roughly the same regardless of operating system, as the Electron Framework allows us to write 
cross-platform applications that are styled with HTML and CSS just like a web-based application.

The application we are going to build here will be capable of the following:

- Showing updates to the XRP Ledger in real-time.
- Viewing any XRP Ledger account's activity "read-only" including showing how much XRP was delivered by each transaction.
- Showing how much XRP is set aside for the account's [reserve requirement](reserves.html).
- Sending [direct XRP payments](direct-xrp-payments.html), and providing feedback about the intended destination address, including:
    - Whether the intended destination already exists in the XRP Ledger, or the payment would have to fund its creation.
    - If the address doesn't want to receive XRP ([`DisallowXRP` flag](become-an-xrp-ledger-gateway.html#disallow-xrp) enabled).
    - If the address has a [verified domain name](https://xrpl.org/xrp-ledger-toml.html#account-verification) associated with it.

The application in this tutorial _doesn't_ have the ability to send or trade [tokens](issued-currencies.html) or 
use other [payment types](payment-types.html) like [Escrow](https://xrpl.org/escrow.html) or [Payment Channels](https://xrpl.org/payment-channels.html). However, it provides a foundation 
that you can implement those and other features on top of.

In addition to the above features, you'll also learn a bit about Events, IPC (inter-process-communication) 
and asynchronous (async) code in JavaScript.

## Steps

### 0. Project setup

To initialize the project we will create a package.json file with the following content:

{{ include_code("_code-samples/build-a-wallet/js/package.json", language="js", lines="1-28") }}

Here we define the libraries our application will use in the `dependencies` section as well as shortcuts for running our application in the `scripts` section. To install those dependencies, run the following command:
```console
npm install
```

This installs the Electron Framework, the xrpl.js client library and a couple of helpers we are going to need for our
application to work. 

### 1. Hello XRP Ledger

**Full code for this step:** 
[`1_hello.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/1_hello.js),
[`view/1_preload.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/view/1_preload.js),
[`view/1_hello.html`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/view/1_hello.html),
[`view/1_renderer.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/view/1_renderer.js).

Our first step is to write a "Hello World" like application, that interacts on a very basic level with the XRP Ledger 
and displays some high-level information about the current ledger state on the screen. Nothing too fancy so far, as we 
will take care of styling and GUI related coding in a later step:

![Screenshot: Step 1, hello world equivalent](img/javascript-wallet-1.png)

First, we will create an entrypoint for our application, for this we create the file `1_hello.js` with the following content:

`1_hello.js`
{{ include_code("_code-samples/build-a-wallet/js/1_hello.js", language="js") }}

This code has two parts: one that creates the application window and one that calls the XRP Ledger API's [ledger method](ledger.html). The code then broadcasts an event with the API response as the payload. The frontend picks up this event and uses the payload to display the index of most recently validated ledger.

To display our results to the user, we need to create the view components that we specified in the `createWindow()` function. For this, we will create a `view` folder and add the following files there:

<!-- MULTICODE_BLOCK_START -->

*view/1_preload.js*
{{ include_code("_code-samples/build-a-wallet/js/view/1_preload.js", language="js") }}

*view/1_hello.html*
{{ include_code("_code-samples/build-a-wallet/js/view/1_hello.html", language="html") }}

*view/1_renderer.js*
{{ include_code("_code-samples/build-a-wallet/js/view/1_renderer.js", language="js") }}

<!-- MULTICODE_BLOCK_END-->

The file `view/1_preload.js` does the main wiring of the application. The file `view/1_hello.html` defines the template part of the view. The file `view/1_renderer.js` contains scripts used in the template; you could also have put these in the HTML file, but it's a good practice to separate them so the code is more readable.

This example shows how to do Inter Process Communication (IPC) in Electron. Technically, JavaScript has no true parallel processes or threading, because it follows a single-threaded event-driven paradigm. Nonetheless Electron provides us with two IPC modules called `ipcMain` and `ipcRenderer`. We can roughly equate those two to a backend process and a frontend process when we think in terms of client-server applications. It works as follows:

1. Create a function that enables the frontend to subscribe to backend events (in `view/1_preload.js`)
2. Make the function available by preloading it (webPreferences.preload during window creation)
3. Create a frontend view
4. Use that function in the frontend (e.g. 1_renderer.js, loaded in 1_hello.html) to attach a callback that handles frontend updates when the event is dispatched
5. Dispatch the event from the backend (e.g. appWindow.webContents.send('update-ledger-index', value))

In the package.json file we have already defined some prepared commands to run our application according to the steps comprising the
structure of this tutorial. To get the application running at this early stage of development, run the following command:

```console
npm run hello
```


### 2.A. Show Ledger Updates by using WebSocket subscriptions

**Full code for this step:** 
[`2_async-subscribe.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/2_async-subscribe.js),
[`view/2_preload.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/view/2_preload.js),
[`view/2_async.html`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/view/2_async.html),
[`view/2_renderer.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/view/2_renderer.js).

Our "Hello Ledger" application from Step 1. so far only shows the latest validated ledger sequence at the time when we opened it. So let's take things up a notch and add some dashboard like functionality where our wallet app will keep in sync with the ledger and display the latest specs and stats like a clock that is keeping track on time:

![Screenshot: Step 2, show ledger updates](img/javascript-wallet-2.png)

The code has been refactored so that the main logic now resides in a main() function. This allows us to handle the application ready event by using an one-liner at the end of the code. We will do such refactorings regularly along our journey in order to keep the code well managed and readable.

{{ include_code("_code-samples/build-a-wallet/js/2_async-subscribe.js", language="js", lines="33-53") }}

In JavaScript, our client is connecting to the XRPL via [WebSockets](https://en.wikipedia.org/wiki/WebSocket). Our client has a permanent bidirectional connection to the XRPL, which allows us to subscribe to events that the server sends out. This saves resources on the server, which now only sends out data we explicitly asked for when a change happens, as well as the client which does not have to sort through incoming data for relevant changes. This also reduces the complexity of the application and saves us a couple of lines of code. The subscription is happening here: 

{{ include_code("_code-samples/build-a-wallet/js/2_async-subscribe.js", language="js", lines="42-45") }}

When we [subscribe](subscribe.html) to the `ledger` stream, our code gets a ´ledgerClosed´ event whenever there is a new validated ledger. The following code passes these events to the view as `update-ledger-data` events: 

{{ include_code("_code-samples/build-a-wallet/js/2_async-subscribe.js", language="js", lines="48-50") }}

To get the application running at this stage of development, run the following command:

```console
npm run async-subscribe
```


### 2.B. Show Ledger Updates by Using Polling

**Full code for this step:** 
[`2_async-poll.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/2_async-poll.js),
[`view/2_preload.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/view/2_preload.js),
[`view/2_async.html`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/view/2_async.html),
[`view/2_renderer.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/view/2_renderer.js).

In Step 2.A. we used the [subscribe method](https://xrpl.org/subscribe.html) to get the latest changes on the XRPL as soon as they happen. This is the preferred way to get such updates, because it not only reduces the complexity of our application and the data we have to handle, but also is less resource intensive on the servers. 

For completeness's sake we will also implement a polling solution to get a feeling on how this would be done in cases where Websocket subscriptions are not an option.

The main difference is that instead of a subscription, The [ledger request](https://xrpl.org/ledger.html#ledger) with which we are familiar from Step 1. is used in an infinite loop:

{{ include_code("_code-samples/build-a-wallet/js/2_async-poll.js", language="js", lines="58-72") }}

To get the application running using polling, run the following command:

```console
npm run async-poll
```

### 3. Display an Account

**Full code for this step:** 
[`3_account.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/3_account.js).
[`library/3_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/view/3_helper.js).
[`view/3_preload.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/view/3_preload.js).
[`view/3_account.html`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/view/3_account.html).
[`view/3_renderer.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/view/3_renderer.js).

Now that we have a permanent connection to the XRPL and some code to bring the delivered data to life on our screen, it's time to add some "wallet" functionality by managing an individual account. 

We will get the address of the account we want to monitor by using a HTML dialog element. We will furthermore refactor the application by encapsulating some functionality in a library. After finishing this step the application should look like this:

![Screenshot: Step 3, show account information](img/javascript-wallet-3.png)

First, we will create a new directory, aptly named `library`. In this directory we then create a file `3_helpers.js` with the following content:

{{ include_code("_code-samples/build-a-wallet/js/library/3_helpers.js", language="js") }}

Here we define three utility functions that will transform data we receive from the ledger, so it can be conveniently used in the frontend. as we progress in this tutorial, we will keep this pattern of putting reusable functionality in the library.

Our main file will be called `3_account.js` and have the following content:

{{ include_code("_code-samples/build-a-wallet/js/3_account.js", language="js") }}

The content of our view files will be complemented as follows:

`view/3_preload.js`
{{ include_code("_code-samples/build-a-wallet/js/view/3_preload.js", language="js") }}

`view/3_account.html`
{{ include_code("_code-samples/build-a-wallet/js/view/3_account.html", language="html") }}

`view/3_renderer.js`
{{ include_code("_code-samples/build-a-wallet/js/view/3_renderer.js", language="js") }}

In `view/3_account.html`, we have added a HTML dialog element, which we will use to query the user for the account address we want to monitor:
{{ include_code("_code-samples/build-a-wallet/js/view/3_account.html", language="html", lines="30-41") }}

To make the HTML dialog work, the following code snippet has been added to `view/3_renderer.js`:
{{ include_code("_code-samples/build-a-wallet/js/view/3_renderer.js", language="js", lines="1-20") }}

In order to handle the address the user entered and send it to the main process, we have added the following snippet to `exposeInMainWorld` in `view/3_preload.js`:
{{ include_code("_code-samples/build-a-wallet/js/view/3_preload.js", language="js", lines="4-6") }}

Note that, in contrast to our previous code, where we subscribed callbacks to events from the main process, we now send an event to the main process from the renderer context. For this we use `ipcRenderer.send()` instead of `ipcRenderer.on()`. Note that the use in the renderer also differs, while we subscribe to events from the main process immediately as soon as an `renderer.js` is loaded, we use our preloaded function only after an user interaction has taken place (`window.electronAPI.onEnterAccountAddress(address)`).

As we will know the account we want to query the leger for is known only after the user enters an address, we wrap our application logic with an event handler:

```javascript
ipcMain.on('address-entered', async (event, address) =>  {
  ...
}
```

To have some initial data to display for the account we have to add the following code to our main file:

{{ include_code("_code-samples/build-a-wallet/js/3_account.js", language="js", lines="50-61") }}

To keep the displayed balance of the account up-to-date, we use a transactions subscription for our account. As soon as a new transaction is registered, we issue an account_info request and send the data to the renderer:

{{ include_code("_code-samples/build-a-wallet/js/3_account.js", language="js", lines="63-71") }}

To get the application running at this stage of development, run the following command:

```console
npm run account
```

### 4. Show Account's Transactions

**Full code for this step:** 
[`4_tx-history.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/4_tx-history.js).
[`library/3_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/library/3_helper.js).
[`library/4_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/library/4_helper.js).
[`view/4_preload.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/view/4_tx-preload.js).
[`view/4_tx-history.html`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/view/4_tx-history.html).
[`view/4_renderer.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/view/4_tx-renderer.js).

At this point, our wallet shows the account's balance getting updated, but doesn't give us any clue about how this state came about, namely the actual transactions that caused the updates. So, our next step is to display the account's up to date transaction history using subscriptions once again:

![Screenshot: Step 4, show transaction history](img/javascript-wallet-4.png)

First we will add a section to the template (`view/4_tx-history.html`) file to display the transaction list of a given account by adding the following code after the fieldset for the latest validated ledger:

{{ include_code("_code-samples/build-a-wallet/js/view/4_tx-history.html", language="html", lines="29-44") }}

Our preloader (`view/4_preload.js`) will be complemented with a function that allows us to subscribe to the 'update-transaction-data' event:

{{ include_code("_code-samples/build-a-wallet/js/view/4_preload.js", language="js", lines="13-15") }}

In the renderer (`view/4_renderer.js`), we define the callback that displays the latest transaction list:

{{ include_code("_code-samples/build-a-wallet/js/view/4_renderer.js", language="js", lines="47-60") }}

In our main file (`4_tx-history`), we already have queried the relevant data in the `client.on('transaction')` subscription. We just have to send it to the renderer by triggering the 'update-transaction-data' event:

{{ include_code("_code-samples/build-a-wallet/js/4_tx-history.js", language="js", lines="62-63") }}

As this is only called as soon as a new transaction is recorded, our transaction table is empty at first, so we need to issue an initial call for the account transactions:

{{ include_code("_code-samples/build-a-wallet/js/4_tx-history.js", language="js", lines="76-83") }}

That is it for this step, to get the application running at this stage of development, run the following command:

```console
npm run tx-history
```


### 5. Saving the Private Keys with a Password

**Full code for this step:**
[`5_password.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/5_password.js).
[`library/3_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/library/3_helper.js).
[`library/4_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/library/4_helper.js).
[`library/5_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/library/5_helper.js).
[`view/5_preload.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/view/5_tx-preload.js).
[`view/5_password.html`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/view/5_password.html).
[`view/5_renderer.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/view/5_tx-renderer.js).

After finishing this step the application should look like this:

![Screenshot: Step 5, use salted password](img/javascript-wallet-5.png)

By now we always query the user for an account address at application startup. We more or less have a monitoring tool for accounts that queries publicly available data. Because we want to have real wallet functionality including sending XRP, we will have to deal with private keys and seeds, which will have to be handled properly.

In this step we will query the user for an account seed and save this seed with a salted password. 

<!-- MULTICODE_BLOCK_START -->
*5_password.js*
{{ include_code("_code-samples/build-a-wallet/js/5_password.js", language="js") }}

*view/5_preload.js*
{{ include_code("_code-samples/build-a-wallet/js/view/5_preload.js", language="js") }}

*view/5_password.html*
{{ include_code("_code-samples/build-a-wallet/js/view/5_password.html", language="html") }}

*view/5_renderer.js*
{{ include_code("_code-samples/build-a-wallet/js/view/5_renderer.js", language="js") }}

<!-- MULTICODE_BLOCK_END-->

### 6. Styling

**Full code for this step:**
[`6_styling.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/6_styling.js).
[`library/3_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/library/3_helper.js).
[`library/4_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/library/4_helper.js).
[`library/5_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/library/5_helper.js).
[`view/6_preload.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/view/6_tx-preload.js).
[`view/6_styling.html`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/view/6_styling.html).
[`view/6_renderer.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/view/6_tx-renderer.js).

After finishing this step the application should look like this:

![Screenshot: Step 6, style application with css](img/javascript-wallet-6.png)

### 7. Send XRP

**Full code for this step:** 
[`7_send-xrp.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/7_send-xrp.js).
[`library/3_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/library/3_helper.js).
[`library/4_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/library/4_helper.js).
[`library/5_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/library/5_helper.js).
[`library/6_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/library/6_helper.js).
[`library/7_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/library/7_helper.js).
[`view/7_preload.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/view/7_preload.js).
[`view/7_send-xrp.html`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/view/7_send-xrp.html).
[`view/7_renderer.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/view/7_renderer.js).

Up until now we have enabled our app to query and display data from the XRPL. Now it's time to actively participate in
the ledger by enabling out application to send transactions. For now, we can stick to sending direct XRP payments 
because there are more complexities involved in sending issued tokens. 

But before that, it is time to take that wallflowery appearance of our application and give it a more usable and 
nicer looking UI. 

![Screenshot: Step 7, send xrp dialog](img/javascript-wallet-7.png)

To get the application running at this stage of development, run the following command:

```console
npm run send-xrp
```


### 8. Domain Verification and Polish

**Full code for this step:** 
[`8_domain-verification.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/8_domain-verification.js).
[`library/3_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/library/3_helper.js).
[`library/4_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/library/4_helper.js).
[`library/5_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/library/5_helper.js).
[`library/6_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/library/6_helper.js).
[`library/7_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/library/7_helper.js).
[`library/8_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/library/8_helper.js).
[`view/8_prelaod.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/view/8_preload.js).
[`view/8_domain-verification.html`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/view/8_domain-verification.html).
[`view/8_renderer.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/view/8_renderer.js).

One of the biggest shortcomings of the wallet app from the previous step is that it doesn't provide a lot of protections or feedback for users to save them from human error and scams. These sorts of protections are extra important when dealing with the cryptocurrency space, because decentralized systems like the XRP Ledger don't have an admin or support team one can ask to cancel or refund a payment if one made a mistake such as sending it to the wrong address. This step shows how to add some checks on destination addresses to warn the user before sending.

One type of check we could make is to verify the domain name associated with an XRP Ledger address; this is called [account domain verification](xrp-ledger-toml.html#account-verification). When an account's domain is verified, we can could show it like this:

![Screenshot: Step 8, use domain verification](img/javascript-wallet-8.png)

To get the application running at this stage of development, run the following command:

```console
npm run domain-verification
```

## Next Steps & Topics for further research

TBD

- Promises / async
- Electron framework
- Event Handler

