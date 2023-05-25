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

You can find the complete source code for all of this tutorial's examples in the [code samples section of this website's repository]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/).

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

{{ include_code("_code-samples/build-a-wallet/desktop-js/package.json", language="js", lines="1-28") }}

Here we define the libraries our application will use in the `dependencies` section as well as shortcuts for running our application in the `scripts` section. To install those dependencies, run the following command:
```console
npm install
```

This installs the Electron Framework, the xrpl.js client library and a couple of helpers we are going to need for our
application to work. 

### 1. Hello XRP Ledger

**Full code for this step:** 
[`1_hello.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/1_hello.js),
[`view/1_preload.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/view/1_preload.js),
[`view/1_hello.html`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/view/1_hello.html),
[`view/1_renderer.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/view/1_renderer.js).

Our first step is to write a "Hello World" like application, that interacts on a very basic level with the XRP Ledger 
and displays some high-level information about the current ledger state on the screen. Nothing too fancy so far, as we 
will take care of styling and GUI related coding in a later step:

![Screenshot: Step 1, hello world equivalent](img/javascript-wallet-1.png)

First, we will create an entrypoint for our application, for this we create the file `1_hello.js` with the following content:

`1_hello.js`
{{ include_code("_code-samples/build-a-wallet/desktop-js/1_hello.js", language="js") }}

This code has two parts: one that creates the application window and one that calls the XRP Ledger API's [ledger method](ledger.html). The code then broadcasts an event with the API response as the payload. The frontend picks up this event and uses the payload to display the index of most recently validated ledger.

To display our results to the user, we need to create the view components that we specified in the `createWindow()` function. For this, we will create a `view` folder and add the following files there:

<!-- MULTICODE_BLOCK_START -->

*view/1_preload.js*
{{ include_code("_code-samples/build-a-wallet/desktop-js/view/1_preload.js", language="js") }}

*view/1_hello.html*
{{ include_code("_code-samples/build-a-wallet/desktop-js/view/1_hello.html", language="html") }}

*view/1_renderer.js*
{{ include_code("_code-samples/build-a-wallet/desktop-js/view/1_renderer.js", language="js") }}

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
[`2_async-subscribe.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/2_async-subscribe.js),
[`view/2_preload.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/view/2_preload.js),
[`view/2_async.html`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/view/2_async.html),
[`view/2_renderer.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/view/2_renderer.js).

Our "Hello Ledger" application from Step 1. so far only shows the latest validated ledger sequence at the time when we opened it. So let's take things up a notch and add some dashboard like functionality where our wallet app will keep in sync with the ledger and display the latest specs and stats like a clock that is keeping track on time:

![Screenshot: Step 2, show ledger updates](img/javascript-wallet-2.png)

The code has been refactored (`1_hello.js` to `2_async-subscribe.js`) so that the main logic now resides in a main() function. This allows us to handle the application ready event by using an one-liner at the end of the code. We will do such refactorings regularly along our journey in order to keep the code well managed and readable.

{{ include_code("_code-samples/build-a-wallet/desktop-js/2_async-subscribe.js", language="js", lines="33-53") }}

The most relevant piece of code here is the swapping of a single call to the ledger for a subscription: Our client is now connecting to the XRPL via [WebSockets](https://en.wikipedia.org/wiki/WebSocket). This establishes a permanent bidirectional connection to the XRPL, which allows us to subscribe to events that the server sends out. This saves resources on the server, which now only sends out data we explicitly asked for when a change happens, as well as the client which does not have to sort through incoming data for relevant changes. This also reduces the complexity of the application and saves us a couple of lines of code. The subscription is happening here: 

{{ include_code("_code-samples/build-a-wallet/desktop-js/2_async-subscribe.js", language="js", lines="42-45") }}

When we [subscribe](subscribe.html) to the `ledger` stream, our code gets a ´ledgerClosed´ event whenever there is a new validated ledger. The following code passes these events to the view as `update-ledger-data` events: 

{{ include_code("_code-samples/build-a-wallet/desktop-js/2_async-subscribe.js", language="js", lines="48-50") }}

To get the application running at this stage of development, run the following command:

```console
npm run async-subscribe
```


### 2.B. Show Ledger Updates by Using Polling

**Full code for this step:** 
[`2_async-poll.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/2_async-poll.js),
[`view/2_preload.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/view/2_preload.js),
[`view/2_async.html`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/view/2_async.html),
[`view/2_renderer.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/view/2_renderer.js).

In Step 2.A. we used the [subscribe method](https://xrpl.org/subscribe.html) to get the latest changes on the XRPL as soon as they happen. This is the preferred way to get such updates, because it not only reduces the complexity of our application and the data we have to handle, but also is less resource intensive on the servers. 

For completeness's sake we will also implement a polling solution to get a feeling on how this would be done in cases where Websocket subscriptions are not an option.

The main difference is that instead of a subscription, The [ledger request](https://xrpl.org/ledger.html#ledger) with which we are familiar from Step 1. is used in an infinite loop:

{{ include_code("_code-samples/build-a-wallet/desktop-js/2_async-poll.js", language="js", lines="58-72") }}

To get the application running using polling, run the following command:

```console
npm run async-poll
```

### 3. Display an Account

**Full code for this step:** 
[`3_account.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/3_account.js).
[`library/3_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/view/3_helper.js).
[`view/3_preload.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/view/3_preload.js).
[`view/3_account.html`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/view/3_account.html).
[`view/3_renderer.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/view/3_renderer.js).

Now that we have a permanent connection to the XRPL and some code to bring the delivered data to life on our screen, it's time to add some "wallet" functionality by managing an individual account. 

We will get the address of the account we want to monitor by using a HTML dialog element. We will furthermore refactor the application by encapsulating some functionality in a library. After finishing this step the application should look like this:

![Screenshot: Step 3, show account information](img/javascript-wallet-3.png)

First, we will create a new directory named `library`. In this directory we then create a file `3_helpers.js` with the following content:

`3_helpers.js`
{{ include_code("_code-samples/build-a-wallet/desktop-js/library/3_helpers.js", language="js") }}

Here we define three utility functions that will transform data we receive from the ledger, so it can be conveniently used in the frontend. as we progress in this tutorial, we will keep this pattern of putting reusable functionality in the library.

Our new main file will be called `3_account.js` and have the following content:

{{ include_code("_code-samples/build-a-wallet/desktop-js/3_account.js", language="js") }}

As you may have noticed, this is kind of an evolution from the last step. As these are rather grave changes, it's best to just copy and paste them, the relevant changes will be explained.

To update the view logic, create the following files:

<!-- MULTICODE_BLOCK_START -->
*view/3_preload.js*
{{ include_code("_code-samples/build-a-wallet/desktop-js/view/3_preload.js", language="js") }}

*view/3_account.html*
{{ include_code("_code-samples/build-a-wallet/desktop-js/view/3_account.html", language="html") }}

*view/3_renderer.js*
{{ include_code("_code-samples/build-a-wallet/desktop-js/view/3_renderer.js", language="js") }}
<!-- MULTICODE_BLOCK_END -->

In the new template, we have added a HTML dialog element, which we will use to query the user for the account address we want to monitor:

`view/3_account.html`
{{ include_code("_code-samples/build-a-wallet/desktop-js/view/3_account.html", language="html", lines="30-41") }}

To make the HTML dialog work, the following code snippet has been added to the new renderer:

`view/3_renderer.js`
{{ include_code("_code-samples/build-a-wallet/desktop-js/view/3_renderer.js", language="js", lines="1-22") }}

In order to handle the address the user entered and send it to the main process, we have added the following snippet to `exposeInMainWorld` in `view/3_preload.js`:
{{ include_code("_code-samples/build-a-wallet/desktop-js/view/3_preload.js", language="js", lines="4-6") }}

Note that, in contrast to our previous code, where we subscribed callbacks to events from the main process, we now send an event to the main process from the renderer context. For this we use `ipcRenderer.send()` instead of `ipcRenderer.on()`. Note that the use in the renderer also differs, while we subscribe to events from the main process immediately as soon as an `renderer.js` is loaded, we use our preloaded function only after an user interaction has taken place (`window.electronAPI.onEnterAccountAddress(address)`).

As we will know the account we want to query the leger for is known only after the user enters an address, we wrap our application logic with an event handler:

```javascript
ipcMain.on('address-entered', async (event, address) =>  {
  // ...
})
```

To have some initial data to display for the account we have to add the following code to our main file:

{{ include_code("_code-samples/build-a-wallet/desktop-js/3_account.js", language="js", lines="50-61") }}

To keep the displayed balance of the account up-to-date, we use a transactions subscription for our account. As soon as a new transaction is registered, we issue an account_info request and send the data to the renderer:

{{ include_code("_code-samples/build-a-wallet/desktop-js/3_account.js", language="js", lines="63-71") }}

To get the application running at this stage of development, run the following command:

```console
npm run account
```

### 4. Show Account's Transactions

**Full code for this step:** 
[`4_tx-history.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/4_tx-history.js).
[`library/3_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/library/3_helper.js).
[`library/4_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/library/4_helper.js).
[`view/4_preload.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/view/4_tx-preload.js).
[`view/4_tx-history.html`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/view/4_tx-history.html).
[`view/4_renderer.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/view/4_tx-renderer.js).

At this point, our wallet shows the account's balance getting updated, but doesn't give us any clue about how this state came about, namely the actual transactions that caused the updates. So, our next step is to display the account's up to date transaction history using subscriptions once again:

![Screenshot: Step 4, show transaction history](img/javascript-wallet-4.png)

First, save the template file from last step as `view/4_tx-history.html`.Update this file to display the transaction list of a given account by adding the following code after the fieldset for the latest validated ledger:

`view/4_tx-history.html`
{{ include_code("_code-samples/build-a-wallet/desktop-js/view/4_tx-history.html", language="html", lines="29-44") }}

Our preloader (`view/4_preload.js`) will be complemented with a function that allows us to subscribe to the 'update-transaction-data' event:

`view/4_preload.js`
{{ include_code("_code-samples/build-a-wallet/desktop-js/view/4_preload.js", language="js", lines="13-15") }}

In the renderer (`view/4_renderer.js`), we define the callback that displays the latest transaction list:

`view/4_renderer.js`
{{ include_code("_code-samples/build-a-wallet/desktop-js/view/4_renderer.js", language="js", lines="47-63") }}

Create a new main file `4_tx-history` with the contents of the file from `3_account.js`. There is already a query for the relevant data in the `client.on('transaction')` subscription. We just have to send it to the renderer by triggering the 'update-transaction-data' event:

`4_tx-history`
{{ include_code("_code-samples/build-a-wallet/desktop-js/4_tx-history.js", language="js", lines="62-63") }}

As this is only called as soon as a new transaction is recorded, our transaction table is empty at first, so we need to issue an initial call for the account transactions:

{{ include_code("_code-samples/build-a-wallet/desktop-js/4_tx-history.js", language="js", lines="76-83") }}

That is it for this step, to get the application running at this stage of development, run the following command:

```console
npm run tx-history
```


### 5. Saving the Private Keys with a Password

**Full code for this step:**
[`5_password.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/5_password.js).
[`library/3_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/library/3_helper.js).
[`library/4_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/library/4_helper.js).
[`library/5_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/library/5_helper.js).
[`view/5_preload.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/view/5_tx-preload.js).
[`view/5_password.html`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/view/5_password.html).
[`view/5_renderer.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/view/5_tx-renderer.js).

After finishing this step the application should look like this:

![Screenshot: Step 5, use salted password](img/javascript-wallet-5.png)

By now we always query the user for an account address at application startup. We more or less have a monitoring tool for accounts that queries publicly available data. Because we want to have real wallet functionality including sending XRP, we will have to deal with private keys and seeds, which will have to be handled properly.

In this step we will query the user for an account seed and  a password save this seed with a salted password. 

<!-- MULTICODE_BLOCK_START -->
*5_password.js*
{{ include_code("_code-samples/build-a-wallet/desktop-js/5_password.js", language="js") }}

*library/5_helpers.js*
{{ include_code("_code-samples/build-a-wallet/desktop-js/library/5_helpers.js", language="js") }}

*view/5_preload.js*
{{ include_code("_code-samples/build-a-wallet/desktop-js/view/5_preload.js", language="js") }}

*view/5_password.html*
{{ include_code("_code-samples/build-a-wallet/desktop-js/view/5_password.html", language="html") }}

*view/5_renderer.js*
{{ include_code("_code-samples/build-a-wallet/desktop-js/view/5_renderer.js", language="js") }}
<!-- MULTICODE_BLOCK_END-->

For this step we will first create a new helper function `library/5_helpers.js`. Add the following required imports to the top of the file:

{{ include_code("_code-samples/build-a-wallet/desktop-js/library/5_helpers.js", language="js", lines="1-6") }}

For saving a seed to disk, create the following function in that helper file:

{{ include_code("_code-samples/build-a-wallet/desktop-js/library/5_helpers.js", language="js", lines="86-109") }}

Here, a random string of 20 bytes is created, hex-encoded and saved in a file  `Wallet/salt.txt`. This tutorial assumes that you know what a salt is but if you're new to cryptography this snippet from wikipedia explains what a "salt" is quite well:

In cryptography, a salt is random data that is used as an additional input to a one-way function that hashes data, a password or passphrase. Salts are used to safeguard passwords in storage. Historically, only the output from an invocation of a cryptographic hash function on the password was stored on a system, but, over time, additional safeguards were developed to protect against duplicate or common passwords being identifiable (as their hashes are identical).Salting is one such protection.

Next on a key suitable for symmetric encryption is generated using [Password-Based Key Derivation Function 2](https://en.wikipedia.org/wiki/PBKDF2) which basically hashes and re-hashes the password with the salt multiple times. This key is then used to encrypt the seed with a scheme called [Fernet](https://github.com/csquared/fernet.js). the encrypted key is the saved to `Wallet/seed.txt`. To implement the functionality to load and decrypt the seed add the following function to `library/5_helpers.js`:

{{ include_code("_code-samples/build-a-wallet/desktop-js/library/5_helpers.js", language="js", lines="43-77") }}

This reverses the process as it loads the salt and the encrypted seed from disk, derives a key as before and decrypts the seed.

The functionality for fetching the ledger and account data we want to send to the frontend also gets implemented in the current helper file. This helps to unclutter our main logic file `5_password.js`, which would become unreadable by now. Two functions need to be added, one for fetching the initial data on application startup and one doing the subscriptions:

{{ include_code("_code-samples/build-a-wallet/desktop-js/library/5_helpers.js", language="js", lines="16-33") }}

{{ include_code("_code-samples/build-a-wallet/desktop-js/library/5_helpers.js", language="js", lines="43-59") }}

Finally the helper functions get exported to be used in the main code:

{{ include_code("_code-samples/build-a-wallet/desktop-js/library/5_helpers.js", language="js", lines="139") }}

The main file again gets refactored from `4_transactions.js` to `5_password.js`, note that the main() function has completely changed:

{{ include_code("_code-samples/build-a-wallet/desktop-js/5_password.js", language="js") }}

In the main function, first there is a check if the `Wallet`directory used to store the salt and the encrypted seed does exist. If not, it will be created. Then the application listens for the event when the user enters his seed:

{{ include_code("_code-samples/build-a-wallet/desktop-js/5_password.js", language="js", lines="36-39") }}

This event will trigger the seed dialog in the frontend to close and the password dialog to open up. Then the application listens for the event which is triggered when the password is entered. The application checks if there is already a saved seed to be encrypted, or if it is the first time when the seed will be saved:

{{ include_code("_code-samples/build-a-wallet/desktop-js/5_password.js", language="js", lines="41-57") }}

After the seed is available to the application a wallet is created using the seed, and after creating and connecting the client the heavy lifting is done by the `nitialize` and `subscribe` functions which were implemented in `library/5_helpers.js`. Finally, the application listens to the `ready-to-show` electron event which more or less equivalent to a `domReady` event when we would be dealing with a browser-only environment. Here we trigger the opening of the password or seed dialog at application startup.

Finally, our view files will be updated by adding the following snippets:

`view/5_preload.js`
{{ include_code("_code-samples/build-a-wallet/desktop-js/view/5_preload.js", language="js", lines="5-16") }}

`view/5_password.html`
{{ include_code("_code-samples/build-a-wallet/desktop-js/view/5_password.html", language="html", lines="46-72") }}

This replaces the `account-address-dialog`from Step 4, as the address can be derived from the wallet instantiated with the seed. In `view/5_renderer.js` we replace the dialog logic at the top of the file with the following code:

`view/5_renderer.js`
{{ include_code("_code-samples/build-a-wallet/desktop-js/view/5_renderer.js", language="js", lines="2-38") }}

To get the application running at this stage of development, run the following command:

```console
npm run password
```


### 6. Styling

**Full code for this step:**
[`6_styling.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/6_styling.js).
[`library/3_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/library/3_helper.js).
[`library/4_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/library/4_helper.js).
[`library/5_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/library/5_helper.js).
[`view/6_preload.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/view/6_tx-preload.js).
[`view/6_styling.html`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/view/6_styling.html).
[`view/6_renderer.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/view/6_tx-renderer.js).

After finishing this step the application should look like this:

![Screenshot: Step 6, style application with css](img/javascript-wallet-6.png)

In this step, the application will get a facelift. First, copy the folder `bootstrap` and its contents to your project directory. Also, copy the file `view/custom.css` to the `view`directory. The Template for this Step, `view/6_styling.html` gets a complete overhaul:

`view/6_styling.html`
{{ include_code("_code-samples/build-a-wallet/desktop-js/view/6_styling.html", language="html") }}

Note that the Bootstrap Stylesheets and the custom styles get included in the header of the file:

{{ include_code("_code-samples/build-a-wallet/desktop-js/view/6_styling.html", language="html", lines="10-11") }}

Bootstraps minified Javascript files get included in the bottom of the template: 

{{ include_code("_code-samples/build-a-wallet/desktop-js/view/6_styling.html", language="html", lines="118-119") }}

Note that `view/5_render.js` and `view/5_preload.js` do get used in this tutorial as nothing has changed in those files. In the main file, which gets refactored from `5_password.js` to `6_styling.js` the only thing that changes is the inclusion of the updated template file:

{{ include_code("_code-samples/build-a-wallet/desktop-js/6_styling.js", language="js", lines="21") }}

That's it for this Step - to get the application running at this stage of development, run the following command:

```console
npm run styling
```

### 7. Send XRP

**Full code for this step:** 
[`7_send-xrp.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/7_send-xrp.js).
[`library/3_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/library/3_helper.js).
[`library/4_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/library/4_helper.js).
[`library/5_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/library/5_helper.js).
[`library/6_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/library/6_helper.js).
[`library/7_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/library/7_helper.js).
[`view/7_preload.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/view/7_preload.js).
[`view/7_send-xrp.html`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/view/7_send-xrp.html).
[`view/7_renderer.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/view/7_renderer.js).

Up until now we have enabled our app to query and display data from the XRPL. Now it's time to actively participate in the ledger by enabling our application to send transactions. For now, we can stick to sending direct XRP payments because there are more complexities involved in sending issued tokens. After finishing this step the application should look like this:

![Screenshot: Step 7, send xrp dialog](img/javascript-wallet-7.png)

First, create the file `library/7_helpers.js` and add the following contents:

`library/7_helpers.js`
{{ include_code("_code-samples/build-a-wallet/desktop-js/library/7_helpers.js", language="js") }}

Here a raw payment transaction (short: tx) is created which contains all the necessary information that defines a payment from a user perspective. This payment transaction is then "autofilled", which basically adds a few fields the transaction needs to be processed correctly on the ledger. If you are interested, you could console.log the resulting prepared payment transaction. 

After that, the transaction needs to be signed, which is done using the wallet object, after which it gets submitted using the `submitAndWait` function, which basically sends the signed transaction and waits for the next closed ledger to include said transaction after which it is regarded final.

Our template, after saving it as `view/7_send-xrp.html` gets updated with a bootstrap modal dialog at the end of the `<main>`tag:

`view/7_send-xrp.html`
{{ include_code("_code-samples/build-a-wallet/desktop-js/view/7_send-xrp.html", language="html", lines="92-124") }}

The renderer evolves from `view/5_renderer.js` (remember, no modification in Step 6) to `view/7_renderer.js` by adding the following code at the end of the file:

`view/7_renderer.js`
{{ include_code("_code-samples/build-a-wallet/desktop-js/view/7_renderer.js", language="js", lines="79-103") }}

The preload file from Step 5 also basically stays the same baring the addition of two event listeners at the end of the `exposeInMainWorld` function:

`view/7_preload.js`
{{ include_code("_code-samples/build-a-wallet/desktop-js/view/7_preload.js", language="js", lines="27-32") }}

It might become evident by now that the changes needed to add to the applications functionality have become smaller, this is because of smart refactoring early on. The main file, now `7_send-xrp-js` differs from the last step by two small additions:

The new helper function gets included at the imports section at the top:

`7_send-xrp.js`
{{ include_code("_code-samples/build-a-wallet/desktop-js/7_send-xrp.js", language="js", lines="6") }}

Add a listener to the `send-xrp-action` event and payload from the frontend has to be implemented:

{{ include_code("_code-samples/build-a-wallet/desktop-js/7_send-xrp.js", language="js", lines="59-62") }}

That's basically it, the only thing that is missing to modify the imports of the preloader and the template:

{{ include_code("_code-samples/build-a-wallet/desktop-js/7_send-xrp.js", language="js", lines="18") }}

{{ include_code("_code-samples/build-a-wallet/desktop-js/7_send-xrp.js", language="js", lines="22") }}

To get the application running at this stage of development, run the following command:

```console
npm run send-xrp
```


### 8. Domain Verification and Polish

**Full code for this step:** 
[`8_domain-verification.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/8_domain-verification.js).
[`library/3_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/library/3_helper.js).
[`library/4_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/library/4_helper.js).
[`library/5_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/library/5_helper.js).
[`library/6_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/library/6_helper.js).
[`library/7_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/library/7_helper.js).
[`library/8_helper.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/library/8_helper.js).
[`view/8_prelaod.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/view/8_preload.js).
[`view/8_domain-verification.html`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/view/8_domain-verification.html).
[`view/8_renderer.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/desktop-js/view/8_renderer.js).

One of the biggest shortcomings of the wallet app from the previous step is that it doesn't provide a lot of protections or feedback for users to save them from human error and scams. These sorts of protections are extra important when dealing with the cryptocurrency space, because decentralized systems like the XRP Ledger don't have an admin or support team one can ask to cancel or refund a payment if one made a mistake such as sending it to the wrong address. This step shows how to add some checks on destination addresses to warn the user before sending.

One type of check we could make is to verify the domain name associated with an XRP Ledger address; this is called [account domain verification](xrp-ledger-toml.html#account-verification). When an account's domain is verified, we can could show it like this:

![Screenshot: Step 8, use domain verification](img/javascript-wallet-8.png)

As in the previous steps, the library get updated with a new helper class. First, create the file `library/8_helpers.js` and add the following contents:

`library/8_helpers.js`
{{ include_code("_code-samples/build-a-wallet/desktop-js/library/8_helpers.js", language="js") }}

Create a new main logic file named `8_domain-verification.js` in the root directory with the contents of `7_send-xrp.js`and modify it as follows, starting with the import of the new `validate`helper function: 

`8_domain-verification.js`
{{ include_code("_code-samples/build-a-wallet/desktop-js/8_domain-verification.js", language="js", lines="6") }}

At the end of the callback function `ipcMain.on('send-xrp-action', callback)` add the following event handler:

{{ include_code("_code-samples/build-a-wallet/desktop-js/8_domain-verification.js", language="js", lines="66-70") }}

The code in the helper class basically issues an [`account_info`](account_info.html) request to look up the account in the ledger.

If the account does exist, the code checks for the [`lsfDisallowXRP` flag](accountroot.html#accountroot-flags). Note that this is an `lsf` (ledger state flag) value because this is an object from the ledger state data; these are different than the flag values the [AccountSet transaction][] uses to configure the same settings.

And again, the modified template and preloader have to be included:
{{ include_code("_code-samples/build-a-wallet/desktop-js/8_domain-verification.js", language="js", lines="15-23") }}

Finally, the code decodes the account's `Domain` field, if present, and performs domain verification using the method imported above.

After this, it's time to update the view logic, namely template, preloader and renderer. In `view/8_domain-verification.html` add the following lines just before the `<input>` element with `id="input-destination-address`:

`view/8_domain-verification.html`
{{ include_code("_code-samples/build-a-wallet/desktop-js/view/8_domain-verification.html", language="html", lines="101-103") }}

Now modify the line at the end of the file including the new renderer script:

{{ include_code("_code-samples/build-a-wallet/desktop-js/view/8_domain-verification.html", language="html", lines="158") }}

The renderer script again is created by saving `view/7_renderer.js` as `view/8_renderer.js` and adding the following code after `const sendXrpButtonEl`:

`view/8_renderer.js`:
```javascript
const accountVerificationEl = document.querySelector('.accountVerificationIndicator span')

destinationAddressEl.addEventListener('input', (event) => {
    window.electronAPI.onDestinationAccountChange(destinationAddressEl.value)
})

window.electronAPI.onUpdateDomainVerificationData((_event, result) => {
    accountVerificationEl.textContent = `Domain: ${result.domain || 'n/a'} Verified: ${result.verified}`
})
```

The updated preloader `view/8_preloader.js` is also modified the same way by adding the following two event listeners:

`view/8_preload.js`
{{ include_code("_code-samples/build-a-wallet/desktop-js/view/8_preload.js", language="js", lines="33-38") }}

To get the application running at this stage of development, run the following command:

```console
npm run domain-verification
```

Test your wallet app the same way you did in the previous steps. To test domain verification, try entering the following addresses in the "To" box of the Send XRP dialog:

| Address                              | Domain       | Verified? |
|:-------------------------------------|:-------------|:----------|
| `rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW` | `mduo13.com` | ✅ Yes    |
| `rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn` | `xrpl.org`   | ❌ No     |
| `rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe` | (Not set)    | ❌ No     |

To test X-addresses, try the following addresses:

| Address                                           | Destination Tag | Test Net? |
|:--------------------------------------------------|:----------------|:----------|
| `T7YChPFWifjCAXLEtg5N74c7fSAYsvPKxzQAET8tbZ8q3SC` | 0               | Yes       |
| `T7YChPFWifjCAXLEtg5N74c7fSAYsvJVm6xKZ14AmjegwRM` | None            | Yes       |
| `X7d3eHCXzwBeWrZec1yT24iZerQjYLjJrFT7A8ZMzzYWCCj` | 0               | No        |
| `X7d3eHCXzwBeWrZec1yT24iZerQjYLeTFXz1GU9RBnWr7gZ` | None            | No        |
| `X7d3eHCXzwBeWrZec1yT24iZerQjYLeTFXz1GU9RBnWr7gZ` | None            | No        |

## Next Steps & Topics for further research

TBD

- Promises / async
- Electron framework
- Event Handler

