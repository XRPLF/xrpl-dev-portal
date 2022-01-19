---
parent: build-apps.html
filters:
  - include_code
targets:
  - en
  - ja # TODO: translate this page
blurb: Build a graphical desktop wallet for the XRPL using Python.
---
# Build a Desktop Wallet in Python

This tutorial demonstrates how to build a desktop wallet for the XRP Ledger using the Python programming language and various libraries. This application can be used as a starting point for building a more complete and powerful application, as a reference point for building comparable apps, or as a learning experience to better understand how to integrate XRP Ledger functionality into a larger project.

## Prerequisites

To complete this tutorial, you should meet the following guidelines:

- You have Python 3.7 or higher installed.
- You are somewhat familiar with object-oriented programming in Python and have completed the [Get Started Using Python tutorial](get-started-using-python.html).
- You have some understanding of what the XRP Ledger can do and of cryptocurrency in general. You don't need to be an expert.

## Source Code

You can find the complete source code for all of this tutorial's examples in the [code samples section of this website's repository]({{target.github_forkurl}}//tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/py/).

## Goals

At the end of this tutorial, you should have a Python application that looks something like this:

![Desktop wallet screenshot](img/python-wallet-preview.png)

The exact look and feel of the user interface depend on your computer's operating system. This application is capable of the following:

- Shows updates to the XRP Ledger in real-time.
- Can view any XRP Ledger account's activity "read-only" including showing how much XRP was delivered by each transaction.
- Shows how much XRP is set aside for the account's [reserve requirement](reserves.html).
- Can send [direct XRP payments](direct-xrp-payments.html), and provides feedback about the intended destination address, including:
    - Whether the intended destination already exists in the XRP Ledger, or the payment would have to fund its creation.
    - If the address doesn't want to receive XRP (DisallowXRP flag enabled).
    - If the address a [verified domain name](https://xrpl.org/xrp-ledger-toml.html#account-verification) associated with it.

The application in this tutorial _doesn't_ have the ability to send or trade [tokens](issued-currencies.html) or use other [payment types](payment-types.html) like Escrow or Payment Channels. However, it provides a foundation that you can implement those and other features on top of.

In addition to the above features, you'll also learn a little bit about graphical user interface (GUI) programming, threading, and asynchronous (async) code in Python.

## Steps

### Install Dependencies

This tutorial depends on various programming libraries. Before you get started coding, you should install all of them as follows:

```sh
pip3 install --upgrade xrpl-py wxPython requests toml
```

This installs and upgrades the following Python libraries:

- [xrpl-py](https://xrpl-py.readthedocs.io/), a client library for the XRP Ledger. This tutorial requires **version 1.3.0 or higher**.
- [wxPython](https://wxpython.org/), a cross-platform graphical toolkit.
- [Requests](https://docs.python-requests.org/), a library for easily making HTTP requests.
- [toml](https://github.com/uiri/toml), a library for parsing TOML-formatted files.

The `requests` and `toml` libraries are only needed for the [domain verification in step 6](TODO:link), but you can install them now while you're installing other dependencies.

### 1. Hello World

The first step is to build an app that combines the "hello world" equivalents for the XRP Ledger and wxPython programming. The code is as follows:

{{ include_code("_code-samples/build-a-wallet/py/1_hello.py", language="py") }}

When you run this script, it displays a single window that (hopefully) shows the latest validated ledger index on the XRP Ledger Testnet. It looks like this:

![Screenshot: Step 1, hello world equivalent](img/python-wallet-1.png)

Under the hood, the code makes a JSON-RPC client, connects to a public Testnet server, and uses the [ledger method][] to get this information. Meanwhile, it creates a [`wx.Frame`](https://docs.wxpython.org/wx.Frame.html) subclass as the base of the user interface. This class makes a window the user can see, with a [`wx.StaticText`](https://docs.wxpython.org/wx.StaticText.html) widget to display text to the user, and a [`wx.Panel`](https://docs.wxpython.org/wx.Panel.html) to hold that widget.

### 2. Showing Updates

**Full code for this step:** [`2_threaded.py`](TODO:link).

You may have noticed that the app in step 1 only shows the latest validated ledger at the time you opened it: the app doesn't keep watching for updates. If you want to continually watch the ledger for updates (for example, waiting to see when new transactions have been confirmed), then you need to change the architecture of your app slightly. For reasons specific to Python, it's best to use two _threads_: a "GUI" thread to handle user input and display, and a "worker" thread for XRP Ledger network connectivity. The operating system can switch quickly between the two threads at any time, so user interface can remain responsive while the background thread waits on information from the network that may take a while to arrive.

The main challenge with threads is that you have to be careful not to access data from one thread that another thread may be in the middle of changing. A straightforward way to do this is to design your program so that you each thread has variables it "owns" and doesn't write to the other thread's variables. In this program, the class attributes (anything starting with `self.`) are  When the threads need to communicate, they use specific, "threadsafe" methods of communication, namely:

- For GUI to worker thread, use [`asyncio.run_coroutine_threadsafe()`](https://docs.python.org/3/library/asyncio-task.html#asyncio.run_coroutine_threadsafe).
- For worker to GUI communications, use [`wx.CallAfter()`](https://docs.wxpython.org/wx.functions.html#wx.CallAfter).

To make full use of the XRP Ledger's ability to push messages to the client, use [xrpl-py's `AsyncWebsocketClient`](https://xrpl-py.readthedocs.io/en/stable/source/xrpl.asyncio.clients.html#xrpl.asyncio.clients.AsyncWebsocketClient) instead of `JsonRpcClient`. This lets you "subscribe" to updates using asynchronous code, while also performing other request/response actions in response to various events such as user input.

**Note:** While you can, technically, use the synchronous (that is, non-async) WebSocket client, it gets significantly more complicated to manage these things while also handling input from the GUI. Even if writing async code is unfamiliar to you, it can be worth it to reduce the overall complexity of the code you have to write later.

Add these imports to the top of the file:

{{ include_code("_code-samples/build-a-wallet/py/2_threaded.py", language="py", start_with="import async", end_before="class XRPLMonitorThread") }}

Then, the code for the monitor thread is as follows (put this in the same file as the rest of the app):

{{ include_code("_code-samples/build-a-wallet/py/2_threaded.py", language="py", start_with="class XRPLMonitorThread", end_before="class TWaXLFrame") }}

This code defines a `Thread` subclass for the worker. When the thread is created, it starts an event loop, which means it's waiting for async tasks and functions to be created. The `watch_xrpl()` function is an example of a such a task (which the GUI thread starts when it's ready): connects to the XRP Ledger, then calls the [subscribe method][] to be notified whenever a new ledger is validated. It uses the immediate response _and_ all later subscription stream messages to trigger updates of the GUI.

**Tip: Define worker jobs like this using `async def` instead of `def` so that you can use the `await` keyword in them; you need to use `await` to get the response to the [`AsyncWebsocketClient.request()` method](https://xrpl-py.readthedocs.io/en/stable/source/xrpl.asyncio.clients.html#xrpl.asyncio.clients.AsyncWebsocketClient.request).

Update the code for the main thread and GUI frame to look like this:

{{ include_code("_code-samples/build-a-wallet/py/2_threaded.py", language="py", start_with="class TWaXLFrame", end_before="if __name__") }}

The part that builds the GUI has been moved to a separate method, `build_ui(self)`. This helps to divide the code into chunks that are easier to understand, because the `__init__()` constructor has other work to do now, too: it starts the worker thread, and gives it its first job. The GUI setup also now uses a [sizer](https://docs.wxpython.org/sizers_overview.html) to control placement of the text within the frame.

**Tip:** In this tutorial, all the GUI code is written by hand, but you may find it easier to create powerful GUIs using a "builder" tool such as [wxGlade](http://wxglade.sourceforge.net/). Separating the GUI code from the constructor may make it easier to switch to this type of approach later.

There's a new helper method, `run_bg_job()`, which runs an asynchronous function (defined with `async def`) in the worker thread. Use this method any time you want the worker thread to interact with the XRP Ledger network.

Instead of a `get_validated_ledger()` method, the GUI class now has an `update_ledger()` method, which takes an object in the format of a [ledger stream message](subscribe.html#ledger-stream) and displays some of that information to the user. The worker thread calls this method using `wx.CallAfter()` whenever it gets a `ledgerClosed` event from the ledger.

Finally, change the code to start the app (at the end of the file) slightly:

{{ include_code("_code-samples/build-a-wallet/py/2_threaded.py", language="py", start_with="if __name__") }}

Since the app uses a WebSocket client instead of the JSON-RPC client now, the code has to be use WebSocket URL to connect.

**Tip:** If you [run your own `rippled` server](the-rippled-server.html#reasons-to-run-your-own-server) you can connect to it using `ws://localhost:6006` as the URL. You can also use the WebSocket URLs of [public servers](public-servers.html) to connect to the Mainnet or other test networks.


### 3. Viewing an Account

**Full code for this step:** [`3_account.py`](TODO:link)

A "wallet" application is one that lets you manage your account. Now that we have a working, ongoing connection to the XRP Ledger, it's time to start adding details for a specific account. For this step, you should prompt the user to input their address or master seed, then use that to display information about their account including how much XRP is set aside for the [reserve requirement](reserves.html).

When you do math on XRP amounts, you should import the `Decimal` class so that you don't get rounding errors. Add this to the top of the file:

{{ include_code("_code-samples/build-a-wallet/py/3_account.py", language="py", start_with="from decimal", end_before="class XRPLMonitorThread") }}

Update the `watch_xrpl()` and `on_connected()` methods as follows:

{{ include_code("_code-samples/build-a-wallet/py/3_account.py", language="py", start_with="async def watch_xrpl", end_before="class AutoGridBagSizer") }}

The `watch_xrpl()` method has been renamed to `watch_xrpl_account()` because now it takes an address and optional wallet and saves them for later. (The GUI thread provides these based on user input.) This method also adds a new case for [transaction stream messages](subscribe.html#transaction-streams), because the `on_connected()` method now also subscribes to transactions for the provided account. When it sees a new transaction, the worker does not yet do anything with the transaction itself, but it uses that as a trigger to get the account's latest XRP balance and other info using the [account_info method][]. The `on_connected()` method now also calls [account_info][account_info method] on startup. In both cases, the worker passes the `account_data` object from the response back to the GUI using `wx.CallAfter()`.

The new GUI has a lot more fields that need to be laid out in two dimensions. The following subclass of [`wx.GridBagSizer`](https://docs.wxpython.org/wx.GridBagSizer.html) provides a quick way to do so, setting the appropriate padding and sizing values for a two-dimensional list of widgets. Add this code to the same file:

{{ include_code("_code-samples/build-a-wallet/py/3_account.py", language="py", start_with="class AutoGridBagSizer", end_before="class TWaXLFrame") }}




***TODO***


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
