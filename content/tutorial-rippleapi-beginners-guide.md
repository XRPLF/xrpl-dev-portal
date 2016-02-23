# RippleAPI Beginners Guide #

This tutorial guides you through the basics of building a simple Ripple-connected application using [Node.js](http://nodejs.org/) and [RippleAPI](reference-rippleapi.html), a simple JavaScript API for accessing the Ripple Consensus Ledger.

# Environment Setup #

The first step to using RippleAPI successfully is setting up your development environment.

## Install Node.js and npm ##

RippleAPI is built as an application for the Node.js runtime environment, so the first step is getting Node.js installed. Specifically, RippleAPI requires Node.js version 0.12, version 4.x, or higher.

This step depends on your operating system. We recommend [the official instructions for installing Node.js using a package manager](https://nodejs.org/en/download/package-manager/) for your operating system. If the packages for Node.js and `npm` (Node Package Manager) are separate (this includes Arch Linux, CentOS, Fedora, and RHEL), you should make sure to install both.

After you have installed Node.js, you can check whether it's installed by checking the version of the `node` binary from a commandline:

```
node --version
```

On some platforms, the binary is named `nodejs` instead:

```
nodejs --version
```


## Use NPM to install RippleAPI and dependencies ##

RippleAPI uses the newest version of JavaScript, ECMAScript 6 (also known as ES2015). In order to use the new features of ECMAScript 6, RippleAPI depends on [Babel-Node](https://babeljs.io) and its ES2015 presets. Fortunately you can use `npm` to install RippleAPI and these dependencies all at once.

#### 1. Create a new directory for your project

For example, to create a folder called `my_ripple_experiment`:

```
mkdir my_ripple_experiment && cd my_ripple_experiment
```

Optionally, initiate a [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) repository in that directory so you can track changes to your code.

```
git init
```

Alternatively, you can [create a repo on GitHub](https://help.github.com/articles/create-a-repo/) in order to version and share your work. After setting it up, [clone the repo](https://help.github.com/articles/cloning-a-repository/) to your local machine and `cd` into that directory.

#### 2. Create a new `package.json` file for your project.

Here's a good template:

```
{% include 'code_samples/rippleapi_quickstart/package.json' %}
```

This includes RippleAPI itself (`ripple-lib`), Babel (`babel-cli`), the ECMAScript 6 presets for Babel (`babel-preset-es2015`). It also has the optional add-on [ESLint](http://eslint.org/) (`eslint`) for checking your code quality.

#### 3. Use NPM to install the dependencies.

```
npm install
```

This automatically installs all the dependencies defined in the `package.json` into the local folder `node_modules/`. (We recommend _not_ using `npm -g` to install the dependencies globally.)

The install process may take a while, and may end with a few warnings. The following warnings are benign, and do not indicate a real problem:

```
npm WARN optional Skipping failed optional dependency /chokidar/fsevents:
npm WARN notsup Not compatible with your operating system or architecture: fsevents@1.0.6
npm WARN ajv@1.4.10 requires a peer of ajv-i18n@0.1.x but none was installed.
```

#### 4. (Optional) Tell Git to ignore the `node_modules` folder.

If you are using Git to manage your repository, it's considered a good practice to omit the `node_modules` folder from the Git repo. Other people who check out your code can use `npm` to install the dependencies, and you don't have to keep the repo synchronized with changes to your modules. Edit the `.gitignore` file and add the following line to it:

```
/node_modules/
```

Save and commit the changes:

```
git add .gitignore
git commit -m "ignore node_modules"
```

# First RippleAPI Script ##

With RippleAPI installed, it's time to test that it works. Here's a simple script that uses RippleAPI to retrieve information on a specific account:

```
{% include 'code_samples/rippleapi_quickstart/get-account-info.js' %}
```

## Running the script ##

RippleAPI and the script both use the ECMAScript 6 version of JavaScript, which is (at this time) not supported by Node.js natively. That's why we installed Babel earlier. The easiest way to run ECMAScript 6 is to use the `babel-node` binary, which NPM installs in the `node_modules/.bin/` directory of your project. Thus, running the script looks like this:

```
./node_modules/.bin/babel-node get-account-info.js
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

## Understanding the script ##

Even for a simple script, there's a lot packed into that, including some syntax and conventions that are recent developments in JavaScript. Understanding these concepts will help you write better code using RippleAPI, so let's divide the sample code into smaller chunks that are easier to understand.

### Script opening ###

```
'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;
```

The opening line enables [strict mode](https://www.nczonline.net/blog/2012/03/13/its-time-to-start-using-javascript-strict-mode/). This is purely optional, but it helps you avoid some common pitfalls of JavaScript. See also: [Restrictions on Code in Strict Mode](https://msdn.microsoft.com/library/br230269%28v=vs.94%29.aspx#Anchor_1).

The second line imports RippleAPI into the current scope using Node.js's require function. RippleAPI is just one of [the modules `ripple-lib` exports](https://github.com/ripple/ripple-lib/blob/develop/src/index.js).

### Instantiating the API ###

```
const api = new RippleAPI({
  server: 'wss://s1.ripple.com' // Public rippled server
});
```

This section creates a new instance of the RippleAPI class, assigning it to the variable `api`. (The [`const` keyword](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) means you can't reassign the value `api` to some other value. The internal state of the object can still change, though.)

The one argument to the constructor is an options object, which has [a variety of options](reference-rippleapi.html#parameters). The `server` parameter tells it where it should connect to a `rippled` server.

* The example `server` setting uses a secure WebSocket connection to connect to one of the public servers that Ripple (the company) operates.
* If you don't include the `server` option, RippleAPI runs in [offline mode](reference-rippleapi.html#offline-functionality) instead, which only provides methods that don't need network connectivity.
* You can specify a [Ripple Test Net](https://ripple.com/build/ripple-test-net/) server instead to connect to the parallel-world Test Network instead of the production Ripple Consensus Ledger.
* If you [run your own `rippled`](tutorial-rippled-setup.html), you can instruct it to connect to your local server. For example, you might say `server: 'ws://localhost:5005'` instead.

### Connecting and Promises ###

```
api.connect().then(() => {
```

The [connect() method](reference-rippleapi.html#connect) is one of many RippleAPI methods that returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), which is a special kind of JavaScript object. A Promise is designed to perform some asynchronous operation, like querying a the Ripple Consensus Ledger.

When you get a Promise back from some expression (like `api.connect()`), you call the Promise's `then` method and pass in a callback function. Passing a function as an argument is conventional in JavaScript, taking advantage of how JavaScript functions are [first-class objects](https://en.wikipedia.org/wiki/First-class_function).

When a Promise finishes with its asynchronous operations, the Promise runs the callback function you passed it. The return value from the `then` method is another Promise object, so you can "chain" that into another `then` method, or the Promise's `catch` method, which also takes a callback. The callback you provide to `catch` gets called if something goes wrong.

Finally, we have more new ECMAScript 6 syntax - an [arrow function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions). Arrow functions are just a shorter way of defining anonymous functions, which is pretty convenient when you're defining lots of one-off functions as callbacks, like we are here. The syntax `()=> {...}` is mostly equivalent to `function() {...}`. If you want an anonymous function with one parameter, you can use a syntax like `info => {...}` instead, which is basically just `function(info) {...}` as well.

### Custom code ###

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

This is the part that really defines what this script does, so this is the part you will probably spend the most time customizing.

The example code looks up a Ripple account (belonging to [this writer](https://github.com/mDuo13/)) by its address. You can substitute your own address, if you want.

The `console.log()` function is a built-in tool in both Node.js and web browsers, which writes out to the console; this example includes lots of console output to make it easier to understand what the code is doing.

Keep in mind that the example code starts in the middle of a callback function (called when RippleAPI finishes connecting). That function calls RippleAPI's [`getAccountInfo`](reference-rippleapi.html#getaccountinfo) method, and returns the results.

The results of that API method are another Promise, so the line `}).then( info => {` passes in another anonymous callback function to run when the second Promise's asynchronous work is done. Unlike the previous case, this callback function takes one argument, called `info`, which holds the -- actual -- return value from the `getAccountInfo` API method. The rest of this callback function just outputs that return value to the console.

### Cleanup ###

```
}).then(() => {
  return api.disconnect();
}).then(() => {
  console.log('done and disconnected.');
}).catch(console.error);
```

The remainder of the sample code is mostly more [boilerplate code](reference-rippleapi.html#boilerplate). The first line ends the previous callback function, then chains to another callback to run when it ends. That method disconnects cleanly from the Ripple Consensus Ledger, and has yet another callback which writes to the console when it finishes.

Finally, we get to the `catch` method of this entire long Promise chain. If any of the Promises or their callback functions encounters an error, the callback provided here will run. One thing worth noting: instead of defining a new anonymous callback function here, we can just pass in the standard `console.error` function, which writes whatever arguments it gets out to the console. If you so desired, you could define a smarter callback function here which might intelligently catch certain error types.

# Waiting for Validation #

One of the biggest challenges in using the Ripple Consensus Ledger (or any decentralized system) is knowing the final, immutable transaction results. Even if you [follow the best practices](tutorial-reliable-transaction-submission.html) you still have to wait for the [consensus process](https://ripple.com/knowledge_center/the-ripple-ledger-consensus-process/) to finally accept or reject your transaction. The following example code demonstrates how to wait for the final outcome of a transaction:

```
{% include 'code_samples/rippleapi_quickstart/submit-and-verify.js' %}
```

This code creates and submits an order transaction, although the same principles apply to other types of transactions as well. After submitting the transaction, the code uses a new Promise, which queries the ledger again after using setTimeout to wait a fixed amount of time, to see if the transaction has been verified. If it hasn't been verified, the process repeats until either the transaction is found in a validated ledger or the returned ledger is higher than the LastLedgerSequence parameter.

In rare cases (particularly with a large delay or a loss of power), the `rippled` server may be missing a ledger version between when you submitted the transaction and when you determined that the network has passed the `maxLedgerVersion`. In this case, you cannot be definitively sure whether the transaction has failed, or has been included in one of the missing ledger versions. RippleAPI returns `MissingLedgerHistoryError` in this case.

If you are the administrator of the `rippled` server, you can [manually request the missing ledger(s)](reference-rippled.html#ledger-request). Otherwise, you can try checking the ledger history using a different server. (Ripple runs a public full-history server at `s2.ripple.com` for this purpose.)

See [Reliable Transaction Submission](tutorial-reliable-transaction-submission.html) for a more thorough explanation.



# RippleAPI in Web Browsers #

The process of using RippleAPI in a web browser is slightly different.

## Build Instructions ##

Before you can use RippleAPI in a browser, you need to compile a browser-compatible version. The following process creates a single JavaScript file you can include in a webpage.

#### 1. Download a copy of the RippleAPI git repository.

If you have [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) installed, you can clone the repository and check out the **release** branch, which always has the latest official release:

```
git clone https://github.com/ripple/ripple-lib.git
cd ripple-lib
checkout release
```

Alternatively, you can download an archive (.zip or .tar.gz) of a specific release from the [RippleAPI releases page](https://github.com/ripple/ripple-lib/releases) and extract it.


#### 2. Install dependencies using NPM

You need to have [NPM (Node.js Package Manager) installed](#install-nodejs-and-npm) first.

Then, from within the `ripple-lib` directory, you can use NPM to install all the necessary dependencies:

```
npm install
```

(We recommend _not_ using `npm -g` to install dependencies globally.)

This can take a while, and may include some warnings. The following warnings are benign and do not indicate a problem:

```
npm WARN optional Skipping failed optional dependency /chokidar/fsevents:
npm WARN notsup Not compatible with your operating system or architecture: fsevents@1.0.6
```

#### 3. Use Gulp to build a single JavaScript output

RippleAPI comes with code to use the [gulp](http://gulpjs.com/) package to compile all its source code into browser-compatible JavaScript files. Gulp is automatically installed as one of the dependencies, so all you have to do is run it. RippleAPI's configuration makes this easy:

```
npm run build
```

Output:

```
> ripple-lib@0.16.5 build /home/username/ripple-lib
> gulp

[15:22:30] Using gulpfile /home/username/ripple-lib/Gulpfile.js
[15:22:30] Starting 'build'...
[15:22:30] Starting 'build-debug'...
[15:22:42] Finished 'build' after 12 s
[15:22:42] Starting 'build-min'...
[15:22:42] Finished 'build-debug' after 12 s
[15:22:51] Finished 'build-min' after 9.83 s
[15:22:51] Starting 'default'...
[15:22:51] Finished 'default' after 4.58 μs
```

This may take a while. At the end, the build process creates a new `build/` folder, which contains the files you want.

The file `build/ripple-<VERSION NUMBER>.js` is a straight export of RippleAPI (whatever version you built) ready to be used in browsers. The file ending in `-min.js` is the same thing, but with the content [minified](https://en.wikipedia.org/wiki/Minification_%28programming%29) for faster loading.

## Example Browser Usage ##

The following HTML file demonstrates basic usage of the browser version of RippleAPI to connect to a public `rippled` server and report information about that server. Instead of using Node.js's "require" syntax, the browser version creates a global variable named `ripple`, which contains the `RippleAPI` class.

To use this example, you must first [build RippleAPI](#build-instructions) and then copy one of the resulting output files to the same folder as this HTML file. (You can use either the minified or full-size version.) Modify the first `<script>` tag in this example to use the correct file name for the version of RippleAPI you built.

```
{% include 'code_samples/rippleapi_quickstart/browser-demo.html' %}
```

