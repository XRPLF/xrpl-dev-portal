# Get Started with RippleAPI for JavaScript

This tutorial guides you through the basics of building an XRP Ledger-connected application using [Node.js](http://nodejs.org/) and [RippleAPI](rippleapi-reference.html), a JavaScript API for accessing the XRP Ledger.

The scripts and config files used in this guide are [available in the Ripple Dev Portal GitHub Repository](https://github.com/ripple/ripple-dev-portal/tree/master/content/_code-samples/rippleapi_quickstart).


<!--#{ keep multiple H1s so that all steps are surfaced in sidebar. Do not change H1 titles unless they provide a clear improvement bc they are linked to on external sites. }# -->
# Environment Setup

The first step to using RippleAPI is setting up your development environment.



## Install Node.js and npm

RippleAPI is built as an application for the Node.js runtime environment, so the first step is getting Node.js installed. RippleAPI requires Node.js v6 or higher. Ripple recommends using Node.js v10 LTS.

This step depends on your operating system. Ripple recommends using [the official instructions for installing Node.js using a package manager](https://nodejs.org/en/download/package-manager/) for your operating system. If the packages for Node.js and npm (Node Package Manager) are separate, install both. (This applies to Arch Linux, CentOS, Fedora, and RHEL.)

After you have installed Node.js, you can check the version of the `node` binary from a command line:

```
node --version
```

On some platforms, the binary is named `nodejs` instead:

```
nodejs --version
```



## Install Yarn

RippleAPI uses Yarn to manage dependencies. Ripple recommends using Yarn v1.13.0.

This step depends on your operating system. Ripple recommends using [the official instructions for installing Yarn using a package manager](https://yarnpkg.com/en/docs/install#mac-stable) for your operating system.

After you have installed Yarn, you can check the version of the `yarn` binary from a command line:

```
yarn --version
```



## Install RippleAPI and Dependencies

Complete these steps to use Yarn to install RippleAPI and dependencies.


### 1. Create a new directory for your project

Create a folder called (for example) `my_ripple_experiment`:

```
mkdir my_ripple_experiment && cd my_ripple_experiment
```

Optionally, start a [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) repository in that directory so you can track changes to your code.

```
git init
```

Alternatively, you can [create a repo on GitHub](https://help.github.com/articles/create-a-repo/) to version and share your work. After setting it up, [clone the repo](https://help.github.com/articles/cloning-a-repository/) to your local machine and `cd` into that directory.


### 2. Create a new `package.json` file for your project

Use the following template, which includes:

- RippleAPI itself (`ripple-lib`)
- (Optional) [ESLint](http://eslint.org/) (`eslint`) for checking code quality.

```
{% include '_code-samples/rippleapi_quickstart/package.json' %}
```


### 3. Use Yarn to install RippleAPI and dependencies

Use Yarn to install RippleAPI and the dependencies defined in the `package.json` file you created for your project.

```
yarn
```

This installs RippleAPI and the dependencies into the local folder `node_modules/`.

The install process may end with a few warnings. You may safely ignore the following warnings:

```
warning eslint > file-entry-cache > flat-cache > circular-json@0.3.3: CircularJSON is in maintenance only, flatted is its successor.

npm WARN optional Skipping failed optional dependency /chokidar/fsevents:

npm WARN notsup Not compatible with your operating system or architecture: fsevents@1.0.6
```



# First RippleAPI Script

This script, `get-account-info.js`, fetches information about a hard-coded account. Use it to test that RippleAPI works:

```
{% include '_code-samples/rippleapi_quickstart/get-account-info.js' %}
```



## Run the Script

Run your first RippleAPI script using this command:

```
node get-account-info.js
```

Output:

```
getting account info for rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn
{ sequence: 359,
  xrpBalance: '75.181663',
  ownerCount: 4,
  previousInitiatedTransactionID: 'E5C6DD25B2DCF534056D98A2EFE3B7CFAE4EBC624854DE3FA436F733A56D8BD9',
  previousAffectingTransactionID: 'E5C6DD25B2DCF534056D98A2EFE3B7CFAE4EBC624854DE3FA436F733A56D8BD9',
  previousAffectingTransactionLedgerVersion: 18489336 }
getAccountInfo done
done and disconnected.
```



## Understand the Script

In addition to RippleAPI-specific code, this script uses syntax and conventions that are recent developments in JavaScript. Let's divide the sample code into smaller chunks to explain each one.


### Script opening

```
'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;
```

The opening line enables [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode). This is purely optional, but it helps you avoid some common pitfalls of JavaScript.

The second line imports RippleAPI into the current scope using Node.js's require function. RippleAPI is one of [the modules `ripple-lib` exports](https://github.com/ripple/ripple-lib/blob/develop/src/index.ts).


### Instantiating the API

```
const api = new RippleAPI({
  server: 'wss://s1.ripple.com' // Public rippled server
});
```

This section creates a new instance of the RippleAPI class, assigning it to the variable `api`. (The [`const` keyword](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) means you can't reassign the value `api` to some other value. The internal state of the object can still change, though.)

The one argument to the constructor is an options object, which has [a variety of options](rippleapi-reference.html#parameters). The `server` parameter tells it where it should connect to a `rippled` server.

- The example `server` setting uses a secure WebSocket connection to connect to one of the public servers that Ripple (the company) operates.
- If you don't include the `server` option, RippleAPI runs in [offline mode](rippleapi-reference.html#offline-functionality) instead, which only provides methods that don't need network connectivity.
- You can specify a [XRP Ledger Test Net](xrp-test-net-faucet.html) server instead to connect to the parallel-world Test Network instead of the production XRP Ledger.
- If you [run your own `rippled`](install-rippled.html), you can instruct it to connect to your local server. For example, you might say `server: 'ws://localhost:5005'` instead.


### Connecting and Promises

```
api.connect().then(() => {
```

The [connect() method](rippleapi-reference.html#connect) is one of many RippleAPI methods that returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), which is a special kind of JavaScript object. A Promise is designed to do an asynchronous operation that returns a value later, such as querying the XRP Ledger.

When you get a Promise back from some expression (like `api.connect()`), you call the Promise's `then` method and pass in a callback function. Passing a function as an argument is conventional in JavaScript, taking advantage of how JavaScript functions are [first-class objects](https://en.wikipedia.org/wiki/First-class_function).

When a Promise finishes with its asynchronous operations, the Promise runs the callback function you passed it. The return value from the `then` method is another Promise object, so you can "chain" that into another `then` method, or the Promise's `catch` method, which also takes a callback. The callback you pass to `catch` gets called if something goes wrong.

The example uses [arrow function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), a shorter way of defining anonymous functions. This is convenient for defining lots of one-off functions as callbacks. The syntax `()=> {...}` is mostly equivalent to `function() {...}`. If you want an anonymous function with one parameter, you can use a syntax like `info => {...}` instead, which is almost the same as `function(info) {...}` syntax.


### Custom code

```
  /* begin custom code ------------------------------------ */
  const myAddress = 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn';

  console.log('getting account info for', myAddress);
  return api.getAccountInfo(myAddress);

}).then(info => {
  console.log(info);
  console.log('getAccountInfo done');

  /* end custom code -------------------------------------- */
```

This is the part that you change to do whatever you want the script to do.

The example code looks up an XRP Ledger account by its address. Try running the code with different addresses to see different results.

The `console.log()` function is built into both Node.js and web browsers, and writes out to the console. This example includes lots of console output to make it easier to understand what the code is doing.

Keep in mind that the example code starts in the middle of a callback function (called when RippleAPI finishes connecting). That function calls RippleAPI's [`getAccountInfo`](rippleapi-reference.html#getaccountinfo) method, and returns the results.

The `getAccountInfo` API method returns another Promise, so the line `}).then( info => {` defines another anonymous callback function to run when this Promise's asynchronous work is done. Unlike the previous case, this callback function takes one argument, called `info`, which holds the asynchronous return value from the `getAccountInfo` API method. The rest of this callback function outputs that return value to the console.


### Cleanup

```
}).then(() => {
  return api.disconnect();
}).then(() => {
  console.log('done and disconnected.');
}).catch(console.error);
```

The rest of the sample code is mostly more [boilerplate code](rippleapi-reference.html#boilerplate). The first line ends the previous callback function, then chains to another callback to run when it ends. That method disconnects cleanly from the XRP Ledger, and has yet another callback which writes to the console when it finishes. If your script waits on [RippleAPI events](rippleapi-reference.html#api-events), do not disconnect until you are done waiting for events.

The `catch` method ends this Promise chain. The callback provided here runs if any of the Promises or their callback functions encounters an error. In this case, we pass the standard `console.error` function, which writes to the console, instead of defining a custom callback. You could define a smarter callback function here to intelligently catch certain error types.



# Waiting for Validation

One of the biggest challenges in using the XRP Ledger (or any decentralized system) is knowing the final, immutable transaction results. Even if you [follow the best practices](reliable-transaction-submission.html) you still have to wait for the [consensus process](consensus.html) to finally accept or reject your transaction. The following example code demonstrates how to wait for the final outcome of a transaction:

```
{% include '_code-samples/rippleapi_quickstart/submit-and-verify.js' %}
```

This code creates and submits an order transaction, although the same principles apply to other types of transactions as well. After submitting the transaction, the code uses a new Promise, which queries the ledger again after using setTimeout to wait a fixed amount of time, to see if the transaction has been verified. If it hasn't been verified, the process repeats until either the transaction is found in a validated ledger or the returned ledger is higher than the LastLedgerSequence parameter.

In rare cases (particularly with a large delay or a loss of power), the `rippled` server may be missing a ledger version between when you submitted the transaction and when you determined that the network has passed the `maxLedgerVersion`. In this case, you cannot be definitively sure whether the transaction has failed, or has been included in one of the missing ledger versions. RippleAPI returns `MissingLedgerHistoryError` in this case.

If you are the administrator of the `rippled` server, you can [manually request the missing ledger(s)](ledger_request.html). Otherwise, you can try checking the ledger history using a different server. (Ripple runs a public full-history server at `s2.ripple.com` for this purpose.)

See [Reliable Transaction Submission](reliable-transaction-submission.html) for a more thorough explanation.



# RippleAPI in Web Browsers

RippleAPI can also be used in a web browser if you compile a browser-compatible version and include [lodash](https://www.npmjs.com/package/lodash) as a dependency before the RippleAPI script.



## Build a Browser-Compatible Version of RippleAPI

To use RippleAPI in a browser, you need to build a browser-compatible version. The following process compiles RippleAPI into a single JavaScript file you can include in a webpage.


### 1. Download a copy of the RippleAPI git repository

If you have [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) installed, you can clone the repository and check out the **master** branch, which always has the latest official release:

```
git clone https://github.com/ripple/ripple-lib.git
cd ripple-lib
git checkout master
```

Alternatively, you can download an archive (.zip or .tar.gz) of a specific release from the [RippleAPI releases page](https://github.com/ripple/ripple-lib/releases) and extract it.


### 2. Install Yarn

Use these instructions to [install Yarn](#install-yarn).


### 3. Install dependencies using Yarn

```
yarn
```


### 4. Use Gulp to build a single JavaScript output

RippleAPI comes with code to use the [gulp](http://gulpjs.com/) package to compile all its source code into browser-compatible JavaScript files. Gulp is automatically installed as one of the dependencies, so all you have to do is run it. RippleAPI's configuration makes this easy:

```
yarn run build
```

Output:

```
> ripple-lib@0.16.5 build /home/username/ripple-lib
> gulp

[14:11:02] Using gulpfile /home/username/ripple-lib/gulpfile.js
[14:11:02] Starting 'build'...
[14:11:03] Starting 'build-debug'...
[14:11:03] Starting 'build-min'...
[14:11:18] Finished 'build-debug' after 15 s
[14:11:18] Finished 'build' after 16 s
[14:11:18] Finished 'build-min' after 15 s
[14:11:18] Starting 'default'...
[14:11:18] Finished 'default' after 19 μs
```

This may take a while. At the end, the build process creates a new `build/` folder, which contains the files you want.

The file `build/ripple-<VERSION NUMBER>.js` is a straight export of RippleAPI (whatever version you built) ready to be used in browsers. The file ending in `-min.js` is the same thing, but with the content [minified](https://en.wikipedia.org/wiki/Minification_%28programming%29) for faster loading.



## Demo RippleAPI in a Browser

The following HTML file demonstrates basic usage of the browser version of RippleAPI to connect to a public `rippled` server and report information about that server. Instead of using Node.js's "require" syntax, the browser version creates a global variable named `ripple`, which contains the `RippleAPI` class.

To use this example, you must first [build a browser-compatible version of RippleAPI](#build-a-browser-compatible-version-of-rippleapi) and then copy one of the resulting output files to the same folder as this HTML file. (You can use either the minified or full-size version.) Change the second `<script>` tag in this example to use the correct file name for the version of RippleAPI you built.

[**browser-demo.html:**](https://github.com/ripple/ripple-dev-portal/blob/master/content/_code-samples/rippleapi_quickstart/browser-demo.html "Source on GitHub")

```
{% include '_code-samples/rippleapi_quickstart/browser-demo.html' %}
```

This demo HTML loads Lodash v4.17.11 from CDNJS on Cloudflare and then loads ripple-lib v1.1.2, but you could also download and load a variant of Lodash locally. <!--#{ no specific recommended or required version at this time. Update this once we have some guidance to provide here. }#-->

## See Also

- **Concepts:**
    - [XRP Ledger Overview](xrp-ledger-overview.html)
    - [Software Ecosystem](software-ecosystem.html)
- **Tutorials:**
    - [Send XRP](send-xrp.html)
- **References:**
    - [RippleAPI Reference](rippleapi-reference.html)
    - [rippled API Conventions](api-conventions.html)
        - [base58 Encodings](base58-encodings.html)
    - [rippled Transaction Formats](transaction-formats.html)
