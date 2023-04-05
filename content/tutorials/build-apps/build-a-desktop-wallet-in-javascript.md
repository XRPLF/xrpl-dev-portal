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

- You have node.js 14+ installed on your machine. You can get the latest version [here](https://nodejs.org/en/).
- You are somewhat familiar with modern JavaScript programming and have completed the [Get Started Using JavaScript tutorial](get-started-using-javascript.html).
- You have at least some rough understanding of what the XRP Ledger, it's capabilities and of cryptocurrency in general. Ideally you have completed the [Basic XRPL guide](https://learn.xrpl.org/)

### Source Code

You can find the complete source code for all of this tutorial's examples in the [code samples section of this website's repository]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/).

### Preparing the development machine and installing dependencies

The basic building block for running JavaScript in a non-browser environment, also called headless JavaScript, we need
to have node.js installed on the development machine.

This tutorial depends on various node.js libraries. To install those dependencies and get the project up and running, in the build-a-wallet-with-javascript/js
folder, run the following command to install the required modules:

```console
npm install
```

This installs the Electron Framework, the xrpl.js client library and a couple of helpers we are going to need for our
application to work.

## Rationale

This tutorial takes you through the process of creating a XRP Wallet application from scratch. Starting with a simple,
"Hello World" like example with minimal functionality, step-by-step we will add more and more complex features. At the 
end you will have a rough understanding  

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

### 1. Hello XRP Ledger

**Full code for this step:** [`1_hello.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/1_hello.js).

Our first step is to write a "Hello World" like application, that interacts on a very basic level with the XRP Ledger 
and displays some high-level information about the current ledger state on the screen. Nothing too fancy so far, as we 
will take care of styling and GUI related coding in a later step:

![Screenshot: Step 1, hello world equivalent](img/javascript-wallet-1.png)

In the package.json file you can find prepared commands to run our application according to the steps comprising the 
structure of this tutorial. To get the application running at this early stage of development, run the following command: 

```console
npm run hello
```

The source code of this step is as follows, and we will use this lightweight example to get privy on how the data flow 
in electron works: 

{{ include_code("_code-samples/build-a-wallet/js/1_hello.js", language="js") }}

The main parts are a helper function that executes a ledger request and the main function that creates the application 
window. The main function then calls our helper function and distributes its contents by broadcasting an event that will get picked up by the frontend.

We will use this example to study how to do Inter Process Communication (IPC) in Electron. For reasons of due diligence it 
has to be mentioned that JavaScript has no real Processes / Threading because follows event-driven paradigm. Nonetheless 
Electron provides us with two IPC modules called ipcMain and ipcRenderer. We can roughly equate those to the backend
and the frontend when we think in terms of client-server applications. It works as follows:

1. Create a function that enables the frontend to subscribe to backend events (in 1_preload.js)
2. Make the function available by preloading it (webPreferences.preload during window creation)
3. Use that function in the frontend (e.g. 1_renderer.js, loaded in 1_hello.html) to attach a callback that handles frontend updates when the event is dispatched
4. Dispatch the event from the backend (e.g. appWindow.webContents.send('update-ledger-index', value))

### 2.A. Show Ledger Updates by Polling

**Full code for this step:** [`2_async-poll.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/2_async-poll.js).

Our "Hello Ledger" application from Step 1. so far only shows the latest validated ledger sequence at the time when we 
opened it. So let's take things up a notch and add some dashboard like functionality where our wallet app will keep in 
sync with the ledger and display the latest specs and stats like a clock that is keeping track on time:

![Screenshot: Step 2, show ledger updates](img/javascript-wallet-2.png)

To accomplish this, we'll need to subscribe to the ledger using this snippet of code: 

<Code snippet>

When you subscribe to the `ledger` stream, anytime there is a new validated ledger your code will be updated...

To get the application running at this stage of development, run the following command:

```console
npm run async-poll
```

The code has been refactored so that the main logic now resides in a main() function which delegates the window creation
to a helper function. We also put the functionality to do the ledger request into a separate function:

{{ include_code("_code-samples/build-a-wallet/js/2_async-poll.js", language="js", lines="8-22" }}

Our main logic is to continuously poll the XRPL using this function in an infinite loop:

{{ include_code("_code-samples/build-a-wallet/js/2_async-poll.js", language="js", lines="57-71" }}

Querying the XRPL continuously works but is a rather clumsy "solution" that is both resource intensive for the XRPL 
as well as for our local machine. Fortunately the XRPl offers the functionality to subscribe to certain changes in the 
ledger via the subscribe method offered by the client. We will improve our code by employing this function in the next step.

### 2.B. Show Ledger Updates by Using Subscriptions

**Full code for this step:** [`2_async-subscribe.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/2_async-subscribe.js).

In Step 2.A we kept  our application on the heartbeat of the XRPL by periodically polling it for updates. In JavaScript,
our client is connecting to the XRPL via [WebSockets](https://en.wikipedia.org/wiki/WebSocket). Our client has a 
permanent bidirectional connection to the XRPL, which allows us to subscribe to events that the server sends out. This 
saves resources on the server, which now only sends out data we explicitly asked for when a change happens, as well as 
the client which does not have to sort through incoming data for relevant changes. This also reduces the complexity of the 
application and saves us a couple of lines of code.

To get the application running at this stage of development, run the following command:

```console
npm run async-subscribe
```

### 3. Display an Account

**Full code for this step:** [`3_account.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/3_account.js).

Now that we have a permanent connection to the XRPL and some code to bring the delivered data to life on our 
screen, it's time to add some "wallet" functionality by managing an individual account. 

For this step, we will momentarily 
hardcode the address of the account, and save the complexities of key handling for later. After finishing 
this step the application should look like this:

![Screenshot: Step 3, show account information](img/javascript-wallet-3.png)

To get the application running at this stage of development, run the following command:

```console
npm run account
```

### 4. Show Account's Transactions

**Full code for this step:** [`4_tx-history.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/4_tx-history.js).

At this point, your wallet shows the account's balance getting updated, but doesn't give you any clue about how this state
came about, namely the actual transactions that caused the updates. So, our next step is to display the account's 
up to date transaction history using subscriptions once again:

![Screenshot: Step 4, show transaction history](img/javascript-wallet-4.png)

To get the application running at this stage of development, run the following command:

```console
npm run tx-history
```


### 5. Send XRP

**Full code for this step:** [`7_send-xrp.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/2_send-xrp.js).

Up until now we have enabled our app to query and display data from the XRPL. Now it's time to actively participate in
the ledger by enabling out application to send transactions. For now, you can stick to sending direct XRP payments 
because there are more complexities involved in sending issued tokens. 

But before that, it is time to take that wallflowery appearance of our application and give it a more usable and 
nicer looking UI. 

![Screenshot: Step 5, send xrp dialog](img/javascript-wallet-5.png)

To get the application running at this stage of development, run the following command:

```console
npm run send-xrp
```


### 6. Domain Verification and Polish

**Full code for this step:** [`8_domain-verification.js`]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/3_domain-verification.js).

One of the biggest shortcomings of the wallet app from the previous step is that it doesn't provide a lot of 
protections or feedback for users to save them from human error and scams. These sorts of protections are extra 
important when dealing with the cryptocurrency space, because decentralized systems like the XRP Ledger don't 
have an admin or support team you can ask to cancel or refund a payment if you made a mistake such as sending it to 
the wrong address. This step shows how to add some checks on destination addresses to warn the user before sending.

One type of check you can make is to verify the domain name associated with an XRP Ledger address; this is called
[account domain verification](xrp-ledger-toml.html#account-verification). When an account's domain is verified, 
you could show it like this:

TBD

To get the application running at this stage of development, run the following command:

```console
npm run domain-verification
```

## Next Steps & Topics for further research

TBD

- Promises / async
- Electron framework
- Event Handler

