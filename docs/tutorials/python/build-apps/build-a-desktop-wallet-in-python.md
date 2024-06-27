---
html: build-a-desktop-wallet-in-python.html
parent: python.html
seo:
    description: Build a graphical desktop wallet for the XRPL in Python.
---
# Build a Desktop Wallet in Python
<!-- STYLE_OVERRIDE: wallet -->

This tutorial demonstrates how to build a desktop wallet for the XRP Ledger using the Python programming language and various libraries. This application can be used as a starting point for building a more complete and powerful application, as a reference point for building comparable apps, or as a learning experience to better understand how to integrate XRP Ledger functionality into a larger project.

## Prerequisites

To complete this tutorial, you should meet the following guidelines:

- You have Python 3.7 or higher installed.
- You are somewhat familiar with object-oriented programming in Python and have completed the [Get Started Using Python tutorial](./get-started.md).
- You have some understanding of what the XRP Ledger can do and of cryptocurrency in general. You don't need to be an expert.

## Source Code

You can find the complete source code for all of this tutorial's examples in the {% repo-link path="_code-samples/build-a-desktop-wallet/py/" %}code samples section of this website's repository{% /repo-link %}.

## Goals

At the end of this tutorial, you should have a Python application that looks something like this:

![Desktop wallet screenshot](/docs/img/python-wallet-preview.png)

The exact look and feel of the user interface depend on your computer's operating system. This application is capable of the following:

- Shows updates to the XRP Ledger in real-time.
- Can view any XRP Ledger account's activity "read-only" including showing how much XRP was delivered by each transaction.
- Shows how much XRP is set aside for the account's [reserve requirement](../../../concepts/accounts/reserves.md).
- Can send [direct XRP payments](../../../concepts/payment-types/direct-xrp-payments.md), and provides feedback about the intended destination address, including:
    - Whether the intended destination already exists in the XRP Ledger, or the payment would have to fund its creation.
    - If the address doesn't want to receive XRP (**Disallow XRP** flag enabled).
    - If the address has a [verified domain name](../../../references/xrp-ledger-toml.md#account-verification) associated with it.

The application in this tutorial _doesn't_ have the ability to send or trade [tokens](../../../concepts/tokens/index.md) or use other [payment types](../../../concepts/payment-types/index.md) like Escrow or Payment Channels. However, it provides a foundation that you can implement those and other features on top of.

Other topics mentioned in this tutorial include graphical user interface (GUI) programming, threading, and asynchronous (async) code in Python.

## Steps

### Install Dependencies

This tutorial depends on various programming libraries. Before you get started coding, you should install all of them as follows:

```sh
pip3 install --upgrade xrpl-py wxPython requests toml
```

(On some systems, the command may be `pip` or you may need to use `sudo pip3` instead.)

This installs and upgrades the following Python libraries:

- [xrpl-py](https://xrpl-py.readthedocs.io/), a client library for the XRP Ledger. This tutorial requires **version 1.3.0 or higher**.
- [wxPython](https://wxpython.org/), a cross-platform graphical toolkit.
- [Requests](https://requests.readthedocs.io/), a library for making HTTP requests.
- [toml](https://github.com/uiri/toml), a library for parsing TOML-formatted files.

The `requests` and `toml` libraries are only needed for the [domain verification in step 6](#6-domain-verification-and-polish), but you can install them now while you're installing other dependencies.

#### Notes for Windows Users

On Windows, you can build apps using either Windows natively or by using the Windows Subsystem for Linux (WSL). <!-- SPELLING_IGNORE: wsl -->

On native Windows, the GUI uses native Windows controls and should run without any dependencies beyond those mentioned above.

On WSL, you may need to install `libnotify-dev` as follows:

```sh
apt-get install libnotify-dev
```

If you have trouble installing wxPython on WSL, you can also try installing it this way:

```sh
python -m pip install -U -f https://extras.wxpython.org/wxPython4/extras/linux/gtk3/ubuntu-18.04 wxPython
```


### 1. Hello World

The first step is to build an app that combines the "hello world" equivalents for the XRP Ledger and wxPython programming. The code is as follows:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/1_hello.py" language="py" /%}

When you run this script, it displays a single window that (hopefully) shows the latest validated ledger index on the XRP Ledger Testnet. It looks like this:

![Screenshot: Step 1, hello world equivalent](/docs/img/python-wallet-1.png)

Under the hood, the code makes a JSON-RPC client, connects to a public Testnet server, and uses the [ledger method][] to get this information. Meanwhile, it creates a [`wx.Frame`](https://docs.wxpython.org/wx.Frame.html) subclass as the base of the user interface. This class makes a window the user can see, with a [`wx.StaticText`](https://docs.wxpython.org/wx.StaticText.html) widget to display text to the user, and a [`wx.Panel`](https://docs.wxpython.org/wx.Panel.html) to hold that widget.

### 2. Show Ledger Updates

**Full code for this step:** {% repo-link path="_code-samples/build-a-desktop-wallet/py/2_threaded.py" %}`2_threaded.py`{% /repo-link %}.

You may have noticed that the app in step 1 only shows the latest validated ledger at the time you opened it: the text displayed never changes unless you close the app and reopen it. The actual XRP Ledger is constantly making forward progress, so a more useful app would show it, something like this:

![Animation: Step 2, showing ledger updates](/docs/img/python-wallet-2.gif)

If you want to continually watch the ledger for updates (for example, waiting to see when new transactions have been confirmed), then you need to change the architecture of your app slightly. For reasons specific to Python, it's best to use two _threads_: a "GUI" thread to handle user input and display, and a "worker" thread for XRP Ledger network connectivity. The operating system can switch quickly between the two threads at any time, so the user interface can remain responsive while the background thread waits on information from the network that may take a while to arrive.

The main challenge with threads is that you have to be careful not to access data from one thread that another thread may be in the middle of changing. A straightforward way to do this is to design your program so that each thread has variables it "owns" and doesn't write to the other thread's variables. In this program, each thread is its own class, so each thread should only write to its own class attributes (anything starting with `self.`). When the threads need to communicate, they use specific, "thread-safe" methods of communication, namely:

- For GUI to worker thread, use [`asyncio.run_coroutine_threadsafe()`](https://docs.python.org/3/library/asyncio-task.html#asyncio.run_coroutine_threadsafe).
- For worker to GUI communications, use [`wx.CallAfter()`](https://docs.wxpython.org/wx.functions.html#wx.CallAfter).

To make full use of the XRP Ledger's ability to push messages to the client, use [xrpl-py's `AsyncWebsocketClient`](https://xrpl-py.readthedocs.io/en/stable/source/xrpl.asyncio.clients.html#xrpl.asyncio.clients.AsyncWebsocketClient) instead of `JsonRpcClient`. This lets you "subscribe" to updates using asynchronous code, while also performing other request/response actions in response to various events such as user input.

**Note:** While you can, technically, use the synchronous (that is, non-async) WebSocket client, it gets significantly more complicated to manage these things while also handling input from the GUI. Even if writing async code is unfamiliar to you, it can be worth it to reduce the overall complexity of the code you have to write later.

Add these imports to the top of the file:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/2_threaded.py" from="import async" before="class XRPLMonitorThread" language="py" /%}

Then, the code for the monitor thread is as follows (put this in the same file as the rest of the app):

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/2_threaded.py" from="class XRPLMonitorThread" before="class TWaXLFrame" language="py" /%}

This code defines a `Thread` subclass for the worker. When the thread starts, it sets up an event loop, which waits for async tasks to be created and run. The code uses [`asyncio`'s Debug Mode](https://docs.python.org/3/library/asyncio-dev.html#asyncio-debug-mode) so that the console shows any errors that occur in async tasks.

The `watch_xrpl()` function is an example of a such a task (which the GUI thread starts when it's ready): it connects to the XRP Ledger, then calls the [subscribe method][] to be notified whenever a new ledger is validated. It uses the immediate response _and_ all later subscription stream messages to trigger updates of the GUI.

**Tip:** Define worker jobs like this using `async def` instead of `def` so that you can use the `await` keyword in them; you need to use `await` to get the response to the [`AsyncWebsocketClient.request()` method](https://xrpl-py.readthedocs.io/en/stable/source/xrpl.asyncio.clients.html#xrpl.asyncio.clients.AsyncWebsocketClient.request). Normally, you would also need to use `await` or something similar to get the response from any function you define with `async def`; but, in this app, the `run_bg_job()` helper takes care of that in a different way.

Update the code for the main thread and GUI frame to look like this:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/2_threaded.py" from="class TWaXLFrame" before="if __name__" language="py" /%}

The part that builds the GUI has been moved to a separate method, `build_ui(self)`. This helps to divide the code into chunks that are easier to understand, because the `__init__()` constructor has other work to do now, too: it starts the worker thread, and gives it its first job. The GUI setup also now uses a [sizer](https://docs.wxpython.org/sizers_overview.html) to control placement of the text within the frame.

**Tip:** In this tutorial, all the GUI code is written by hand, but you may find it easier to create powerful GUIs using a "builder" tool such as [wxGlade](http://wxglade.sourceforge.net/). Separating the GUI code from the constructor may make it easier to switch to this type of approach later. <!-- SPELLING_IGNORE: wxGlade -->

There's a new helper method, `run_bg_job()`, which runs an asynchronous function (defined with `async def`) in the worker thread. Use this method any time you want the worker thread to interact with the XRP Ledger network.

Instead of a `get_validated_ledger()` method, the GUI class now has an `update_ledger()` method, which takes an object in the format of a [ledger stream message](../../../references/http-websocket-apis/public-api-methods/subscription-methods/subscribe.md#ledger-stream) and displays some of that information to the user. The worker thread calls this method using `wx.CallAfter()` whenever it gets a `ledgerClosed` event from the ledger.

Finally, change the code to start the app (at the end of the file) slightly:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/2_threaded.py" from="if __name__" language="py" /%}

Since the app uses a WebSocket client instead of the JSON-RPC client now, the code has to use a WebSocket URL to connect.

**Tip:** If you [run your own `rippled` server](../../../concepts/networks-and-servers/index.md#reasons-to-run-your-own-server) you can connect to it using `ws://localhost:6006` as the URL. You can also use the WebSocket URLs of [public servers](../../public-servers.md) to connect to the Mainnet or other test networks.

#### Troubleshooting SSL Certificate Errors

If you get an error like this, you may need to make sure your operating system's certificate authority store is updated:

```text
[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate
```

On macOS, run the [`Install Certificates.command`](https://stackoverflow.com/questions/52805115/certificate-verify-failed-unable-to-get-local-issuer-certificate) for your Python version.

On Windows, open Edge or Chrome and browse to <https://s1.ripple.com>, then close the page. This should be enough to update your system's certificates. (It doesn't work if you use Firefox or Safari, because those browser's don't use Windows' certificate validation APIs.) <!-- SPELLING_IGNORE: s1 -->


### 3. Display an Account

**Full code for this step:** {% repo-link path="_code-samples/build-a-desktop-wallet/py/3_account.py" %}`3_account.py`{% /repo-link %}

Now that you have a working, ongoing connection to the XRP Ledger, it's time to start adding some "wallet" functionality that lets you manage an individual account. For this step, you should prompt the user to input their address or master seed, then use that to display information about their account including how much XRP is set aside for the [reserve requirement](../../../concepts/accounts/reserves.md).

The prompt is in a pop-up dialog like this:

![Screenshot: step 3, account input prompt](/docs/img/python-wallet-3-enter.png)

After the user inputs the prompt, the updated GUI looks like this:

![Screenshot, step 3, showing account details](/docs/img/python-wallet-3-main.png)

When you do math on XRP amounts, you should use the `Decimal` class so that you don't get rounding errors. Add this to the top of the file, with the other imports:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/3_account.py" from="from decimal" before="class XRPLMonitorThread" language="py" /%}

In the `XRPLMonitorThread` class, rename and update the `watch_xrpl()` method as follows:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/3_account.py" from="async def watch_xrpl" before="async def on_connected" language="py" /%}

The newly renamed `watch_xrpl_account()` method now takes an address and optional wallet and saves them for later. (The GUI thread provides these based on user input.) This method also adds a new case for [transaction stream messages](../../../references/http-websocket-apis/public-api-methods/subscription-methods/subscribe.md#transaction-streams). When it sees a new transaction, the worker does not yet do anything with the transaction itself, but it uses that as a trigger to get the account's latest XRP balance and other info using the [account_info method][]. When _that_ response arrives, the worker passes the account data to the GUI for display.

Still in the `XRPLMonitorThread` class, update the `on_connected()` method as follows:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/3_account.py" from="async def on_connected" before="class AutoGridBagSizer" language="py" /%}

The `on_connected()` method now subscribes to transactions for the provided account (and the ledger stream too). Furthermore, it now calls [account_info][account_info method] on startup, and passes the response to the GUI for display.

The new GUI has a lot more fields that need to be laid out in two dimensions. The following subclass of [`wx.GridBagSizer`](https://docs.wxpython.org/wx.GridBagSizer.html) provides a quick way to do so, setting the appropriate padding and sizing values for a two-dimensional list of widgets. Add this code to the same file:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/3_account.py" from="class AutoGridBagSizer" before="class TWaXLFrame" language="py" /%}

Update the `TWaXLFrame`'s constructor as follows:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/3_account.py" from="def __init__(self, url, test_network=True):" before="def build_ui(self):" language="py" /%}

Now the constructor takes a boolean to indicate whether it's connecting to a test network. (If you provide a Mainnet URL, you should also pass `False`.) It uses this to encode and decode X-addresses and warn if they're intended for a different network. It also calls a new method, `prompt_for_account()` to get an address and wallet, and passes those to the renamed `watch_xrpl_account()` background job.

Update the `build_ui()` method definition as follows:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/3_account.py" from="def build_ui(self):" before="def run_bg_job(self, job):" language="py" /%}

This adds a [`wx.StaticBox`](https://docs.wxpython.org/wx.StaticBox.html) with several new widgets, then uses the `AutoGridBagSizer` (defined above) to lay them out in 2×4 grid within the box. These new widgets are all static text to display [details of the account](../../../references/protocol/ledger-data/ledger-entry-types/accountroot.md), though some of them start with placeholder text. (Since they require data from the ledger, you have to wait for the worker thread to send that data back.)

**Caution:** You may notice that even though the constructor for this class sees the `wallet` variable, it does not save it as a property of the object. This is because the wallet mostly needs to be managed by the worker thread, not the GUI thread, and updating it in both places might not be thread-safe.

Add a new `prompt_for_account()` method to the `TWaXLFrame` class:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/3_account.py" from="def prompt_for_account" before="def update_ledger" language="py" /%}

The constructor calls this method to prompt the user for their [address](../../../concepts/accounts/addresses.md) or [master seed](../../../concepts/accounts/cryptographic-keys.md#seed), then processes the user input to decode whatever value the user put in, and use it accordingly. With wxPython, you usually follow this pattern with dialog boxes:

1. Create a new instance of a dialog class, such as a [`wx.TextEntryDialog`](https://docs.wxpython.org/wx.TextEntryDialog.html).
2. Use `showModal()` to display it to the user and get a return code based on which button the user clicked.
3. If the user clicked OK, get a value the user input. This example gets the text the user entered in the box.
4. Destroy the dialog instance. If you forget to do this, the application can leak memory whenever the user opens a new dialog.

From there, the `prompt_for_account()` code branches based on whether the input is a classic address, X-address, seed, or not a valid value at all. Assuming the value decodes successfully, it updates the `wx.StaticText` widgets with both the classic and X-address equivalents of the address and returns them. (As noted above, the constructor passes these values to the worker thread.)

**Tip:** This code exits if the user inputs an invalid value, but you could rewrite it to prompt again or display a different message to the user.

This code also binds an _event handler_, which is a method that is called whenever a certain type of thing happens to a particular part of the GUI, usually based on the user's actions. In this case, the trigger is `wx.EVT_TEXT` on the dialog, which triggers immediately when the user types or pastes anything into the dialog's text box.

Add the following method to `TWaXLFrame` class to define the handler:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/3_account.py" from="def toggle_dialog_style" before="def prompt_for_account" language="py" /%}

Event handlers generally take one positional argument, a [`wx.Event` object](https://docs.wxpython.org/wx.Event.html) which describes the exact event that occurred. In this case, the handler uses this object to find out what value the user input. If the input looks like a master seed (it starts with the letter "s"), the handler switches the dialog to a "password" style that masks the user input, so people viewing the user's screen won't see the secret. And, if the user erases it and switches back to inputting an address, the handler toggles the style back.

Add the following lines **at the end of** the `update_ledger()` method:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/3_account.py" from="# Save reserve settings" before="def calculate_reserve_xrp" language="py" /%}

This saves the ledger's current reserves settings, so that you can use them to calculate the account's total amount of XRP reserved. Add the following method to the `TWaXLFrame` class, to do exactly that:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/3_account.py" from="def calculate_reserve_xrp" before="def update_account" language="py" /%}

Add an `update_account()` method to the `TWaXLFrame` class:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/3_account.py" from="def update_account" before="if __name__" language="py" /%}

The worker thread calls this method to pass account details to the GUI for display.

Lastly, towards the end of the file, in the `if __name__ == "__main__":` block, update the line that instantiates the `TWaXLFrame` class to pass the new `test_net` parameter:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/3_account.py" from="frame = TWaXLFrame" before="frame.Show()" language="py" /%}

(If you change the code to connect to a Mainnet server URL, also change this value to `False`.)

To test your wallet app with your own test account, first go to the [Testnet Faucet](/resources/dev-tools/xrp-faucets) and **Get Testnet credentials**. Save the address and secret key somewhere, and try your wallet app with either one. Then, to see balance changes, go to the [Transaction Sender](/resources/dev-tools/tx-sender) and paste your address into the **Destination Address** field. Click **Initialize** and try out some of the transaction types there, and see if the balance displayed by your wallet app updates as you expect.


### 4. Show Account's Transactions

**Full code for this step:** {% repo-link path="_code-samples/build-a-desktop-wallet/py/4_tx_history.py" %}`4_tx_history.py`{% /repo-link %}

At this point, your wallet shows the account's balance getting updated, but doesn't show you anything about the actual transactions that caused the updates. So, the next step is to display the account's transaction history (and keep it updated).

The new transaction history displays in a new tab, like this:

![Screenshot: transaction history tab](/docs/img/python-wallet-4-main.png)

Additionally, the app can produce desktop notifications (sometimes called "toasts"), which might look like this depending on your operating system:

![Screenshot: notification message](/docs/img/python-wallet-4-notif.png)

First, add the following imports to get GUI classes for the table view and notifications:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/4_tx_history.py" from="import wx.dataview" before="import asyncio" language="py" /%}

Next, update the `watch_xrpl_account()` method of the worker class to pass transaction details to the GUI when you receive a transaction subscription message. This requires only one line:

```py
wx.CallAfter(self.gui.add_tx_from_sub, message)
```

The complete method should look like this:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/4_tx_history.py" from="async def watch_xrpl_account" before="async def on_connected" language="py" /%}

Have the worker use the [account_tx method][] to look up the account's transaction history and pass it to the GUI. This method gets a list of transactions that affected an account, including transactions from, to, or passing through the account in question, starting with the most recent by default. Add new code **to the end of** the `XRPLMonitorThread`'s `on_connected()` method, as follows:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/4_tx_history.py" from="# Get the first page of the account's transaction history" before="class AutoGridBagSizer" language="py" /%}

**Note:** You may have to [paginate](../../../references/http-websocket-apis/api-conventions/markers-and-pagination.md) across multiple [account_tx][account_tx method] requests and responses if you want the _complete_ list of transactions that affected an account since its creation. This example does not show pagination, so the app only displays the most recent transactions to affect the account.

Now, edit the `build_ui()` method of the `TWaXLFrame` class. **Update the beginning of the method** to add a new [`wx.Notebook`](https://docs.wxpython.org/wx.Notebook.html), which makes a "tabs" interface, and make the `main_panel` into the first tab, as follows:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/4_tx_history.py" from="def build_ui" before="self.acct_info_area" language="py" /%}

Additionally, add a new tab for the transaction history to the **end of the** `build_ui()` method, as follows:

{{ include_code("_code-samples/build-a-desktop-wallet/py/4_tx_history.py", language="py", start_with="Tab 2: \"Transaction History\"", end_before="def run_bg_job") }}

This adds a second tab containing a [`wx.dataview.DataViewListCtrl`](https://docs.wxpython.org/wx.dataview.DataViewListCtrl.html), which is capable of displaying a bunch of info as a table. It sets up the table columns to show some relevant details of the account's transactions.

Add the following helper method to the `TWaXLFrame` class:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/4_tx_history.py" from="def displayable_amount" before="def add_tx_row" language="py" /%}

This method takes a [currency amount](../../../references/protocol/data-types/basic-data-types.md#specifying-currency-amounts) and converts it into a string for display to a human. Since it's used with the [`delivered_amount` field](../../../references/protocol/transactions/metadata.md#delivered_amount) in particular, it also handles the special case for pre-2014 partial payments where the delivered amount is unavailable.

After that, add another helper method to the `TWaXLFrame` class:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/4_tx_history.py" from="def add_tx_row" before="def update_account_tx" language="py" /%}

This method takes a transaction object, parses some of its fields into formats more suitable for displaying to users, and then adds it to the `DataViewListCtrl` in the transaction history tab.

Add a method to the `TWaXLFrame` class to update the transaction history based on the [account_tx response][account_tx method] from the worker thread, as follows:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/4_tx_history.py" from="def update_account_tx" before="def add_tx_from_sub" language="py" /%}

Lastly, add a similar method to the `TWaXLFrame` to add a single transaction to the transaction history table whenever the worker thread passes a transaction subscription message:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/4_tx_history.py" from="def add_tx_from_sub" before="if __name__" language="py" /%}

As before, you can test your wallet app with your own test account if you use the [Testnet Faucet](/resources/dev-tools/xrp-faucets) and the [Transaction Sender](/resources/dev-tools/tx-sender). On the Faucet page, select **Get Testnet credentials** (or use the same credentials from before). Input either the address or secret when you open your wallet app. On the Transaction Sender page, paste your address into the **Destination Address** field, click **Initialize**, then click various transaction buttons to see how your wallet displays the results.


### 5. Send XRP

**Full code for this step:** {% repo-link path="_code-samples/build-a-desktop-wallet/py/5_send_xrp.py" %}`5_send_xrp.py`{% /repo-link %}

Until now, you've made the app able to view data from the ledger, and it's capable of showing the transactions an account has received. Now it's finally time to make the app capable of _sending_ transactions. For now, you can stick to sending [direct XRP payments](../../../concepts/payment-types/direct-xrp-payments.md) because there are more complexities involved in sending [issued tokens](../../../concepts/tokens/index.md).

The main window gets a new "Send XRP" button:

![Screenshot: main frame with "Send XRP" button enabled](/docs/img/python-wallet-5-main.png)

Clicking this button opens a dialog where the user can enter the details of the payment:

![Screenshot: "Send XRP" dialog](/docs/img/python-wallet-5-dialog.png)

First, add the [regular expressions](https://docs.python.org/3/howto/regex.html) library to the list of imports at the top of the file:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/5_send_xrp.py" from="import re" before="from threading" language="py" /%}

In the `XRPLMonitorThread` class, add the following lines to the `on_connected()` method, anywhere **after getting a successful [account_info][account_info method] response**:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/5_send_xrp.py" from="if self.wallet:" before="# Get the first page" language="py" /%}

Add a new method to the `XRPLMonitorThread` class to send an XRP payment based on data the user provides, and alert the GUI when it has been sent:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/5_send_xrp.py" from="def send_xrp" before="class AutoGridBagSizer" language="py" /%}

In this flow, the app sends the transaction without waiting for it to be confirmed by the consensus process. You should be careful to mark any results from the initial submission as "pending" or "tentative" since the actual result of the transaction [isn't final until it's confirmed](../../../concepts/transactions/finality-of-results/index.md). Since the app is also subscribed to the account's transactions, it automatically gets notified when the transaction is confirmed.

Now, create a custom dialog for the user to input the necessary details for the payment:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/5_send_xrp.py" from="class SendXRPDialog" before="def on_to_edit" language="py" /%}

This subclass of [`wx.Dialog`](https://docs.wxpython.org/wx.Dialog.html) has several custom widgets, which are laid out using the `GridBagSizer` defined earlier. Notably, it has text boxes for the "To" address, the amount of XRP, and the [destination tag](../../../concepts/transactions/source-and-destination-tags.md) to use, if any. (A destination tag is kind of like a phone extension for an XRP Ledger address: for addresses owned by individuals, you don't need it, but if the destination address has many users then you need to specify it so that the destination knows which recipient you intended. It's common to need a destination tag to deposit at a cryptocurrency exchange.) The dialog also has **OK** and **Cancel** buttons, which automatically function to cancel or complete the dialog, although the "OK" button is labeled "Send" instead to make it clearer what the app does when the user clicks it.

The `SendXRPDialog` constructor also binds two event handlers for when the user inputs text in the "to" and "destination tag" fields, so you need the definitions for those handlers to the same class. First, add `on_to_edit()`:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/5_send_xrp.py" from="def on_to_edit" before="def on_dest_tag_edit" language="py" /%}

This checks the "To" address to ensure that it matches two conditions:

1. It's a validly formatted classic address or X-address.
2. It's not the user's own address—you can't send XRP to yourself.

If either condition is not met, the handler disables the "Send" button for this dialog. If both conditions are met, it enables the "Send" button.

Next, add the `on_dest_tag_edit()` handler, also as a method of the `SendXRPDialog` class:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/5_send_xrp.py" from="def on_dest_tag_edit" before="class TWaXLFrame" language="py" /%}

In other GUI toolkits, you might be able to use a dedicated number entry control for the Destination Tag field, but with wxPython there is only a generic text entry field, so the `on_dest_tag_edit()` handler makes it behave more like a number-only control by instantly deleting any non-numeric characters the user tries to enter in the field.

From here, you need to edit the `TWaXLFrame` class. First, in the `build_ui()` method, you need to add a new "Send XRP" button, and bind it to a new event handler. Add the following lines **before the code to add things to the sizer**:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/5_send_xrp.py" from="# Send XRP button." before="self.ledger_info =" language="py" /%}

Still in the `build_ui()` method, add the new button to the `main_sizer` so it fits nicely in between the account info area and the ledger info area. The sizer code **at the end of the "Tab 1" section** should look like the following, including one new line and the previous (unchanged) lines:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/5_send_xrp.py" from="main_sizer = wx.BoxSizer" before="# Tab 2:" language="py" /%}

Also in the `build_ui()` method, initialize a dictionary to hold rows with pending transaction details, so that you can replace them with the confirmed results when those are available. Add this line **anywhere near the "Tab 2" section** that sets up `self.tx_list` code:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/5_send_xrp.py" from="self.pending_tx_rows = {}" before="objs_panel" language="py" /%}

The "Send XRP" button starts out disabled, so you need to add a new method to the `TWaXLFrame` class to enable it when the right conditions are met:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/5_send_xrp.py" from="def enable_readwrite" before="def displayable_amount" language="py" /%}

The changes you made to `on_connected()` earlier in this step call this method after successfully receiving account data, but only if the worker class has a `Wallet` instance—meaning the user input the secret key to an account that really exists. If the user input an address, this method never gets called.

Add the handler for when the user clicks the "Send XRP" button as a method of the `TWaXLFrame` class:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/5_send_xrp.py" from="def click_send_xrp" before="if __name__" language="py" /%}

This dialog opens a new "Send XRP" dialog using the custom `SendXRPDialog` class defined earlier in this step. If the user clicks the "Send" button, it passes the details to the worker thread to send the payment, and displays a notification that indicates the transaction is sending. (Note, the transaction can still fail after this point, so the notification does not say what the transaction did.)

Also add a new method to the `TWaXLFrame` class to display the pending transaction in the Transaction History pane when the worker thread sends it, as follows:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/5_send_xrp.py" from="def add_pending_tx" before="def click_send_xrp" language="py" /%}

This method is similar to the `add_tx_row()` method in that it processes a transaction for display and adds it to the Transaction History table. The differences are that it takes one of [xrpl-py's Transaction models](https://xrpl-py.readthedocs.io/en/stable/source/xrpl.models.transactions.html) rather than a JSON-like API response; and it handles certain columns differently because the transaction has not yet been confirmed. Importantly, it saves a reference to table row containing this transaction to the `pending_tx_rows` dictionary, so that later on when the transaction is confirmed, you can remove the table row for the pending version and replace it with the final version of the transaction.

Lastly, update the `add_tx_from_sub()` method so that it finds and updates pending transactions with their final results when those transactions are confirmed. Add the following lines **right before the call to** `self.add_tx_row()`:

{{ include_code("_code-samples/build-a-desktop-wallet/py/5_send_xrp.py", language="py", start_with="if t[\"tx\"][\"hash\"] in", end_before="self.add_tx_row(t, prepend=True)") }}

You can now use your wallet to send XRP! You can even fund an entirely new account. To do that:

1. Open the Python interpreter.

    ```
    python3
    ```

    **Caution:** Depending on your OS, the command may be `python` or `python3`. You want to open Python 3, not a Python 2.x version.


2. Run the following commands in the Python interpreter:

    ```
    import xrpl
    w = xrpl.wallet.Wallet.create()
    print(w.address)
    print(w.seed)
    exit()
    ```

    Save the classic address and seed somewhere.

3. Open your wallet app and provide a **Secret** (seed) value from an already-funded address, such as one you got from the [Testnet Faucet](/resources/dev-tools/xrp-faucets).

4. Send at least the [base reserve](../../../concepts/accounts/reserves.md) (currently 10 XRP) to the brand-new classic address you generated in the Python interpreter.

5. Wait for the transaction to be confirmed, then close your wallet app.

6. Open your wallet app and provide the seed value you generated in the Python interpreter.

7. You should see the balance and transaction history of your newly-funded account, matching the address you generated in the interpreter.


### 6. Domain Verification and Polish

**Full code for this step:** {% repo-link path="_code-samples/build-a-desktop-wallet/py/6_verification_and_polish.py" %}`6_verification_and_polish.py`{% /repo-link %}

One of the biggest shortcomings of the wallet app from the previous step is that it doesn't provide a lot of protections or feedback for users to save them from human error and [DeFi scams](https://learn.xrpl.org/safeguarding-your-crypto-wallet-your-essential-checklist-against-defi-scams/). These sorts of protections are extra important when dealing with the cryptocurrency space, because decentralized systems like the XRP Ledger don't have an admin or support team you can ask to cancel or refund a payment if you made a mistake such as sending it to the wrong address. This step shows how to add some checks on destination addresses to warn the user before sending.

One type of check you can make is to verify the domain name associated with an XRP Ledger address; this is called [account domain verification](../../../references/xrp-ledger-toml.md#account-verification). When an account's domain is verified, you could show it like this:

![Screenshot: domain verified destination](/docs/img/python-wallet-6.png)

When there are other errors, you can expose them to the user with an icon and a tooltip, which looks like this:

![Screenshot: invalid address error icon with tooltip](/docs/img/python-wallet-6-err.png)

The following code implements account domain verification; **save it as a new file** named `verify_domain.py` in the same folder as your app's main file:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/verify_domain.py" language="py" /%}

**In your app's main file,** import the `verify_account_domain` function:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/6_verification_and_polish.py" from="from verify_domain" before="class XRPLMonitorThread" language="py" /%}

In the `XRPLMonitorThread` class, add a new `check_destination()` method to check the destination address, as follows:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/6_verification_and_polish.py" from="async def check_destination" before="async def send_xrp" language="py" /%}

This code uses [`xrpl.asyncio.account.get_account_info()`](https://xrpl-py.readthedocs.io/en/stable/source/xrpl.asyncio.account.html#xrpl.asyncio.account.get_account_info) to look up the account in the ledger; unlike using the client's `request()` method, `get_account_info()` raises an exception if the account is not found.

If the account _does_ exist, the code checks for the [`lsfDisallowXRP` flag](../../../references/protocol/ledger-data/ledger-entry-types/accountroot.md#accountroot-flags). Note that this is an `lsf` (ledger state flag) value because this is an object from the ledger state data; these are different than the flag values the [AccountSet transaction][] uses to configure the same settings.

Finally, the code decodes the account's `Domain` field, if present, and performs domain verification using the method imported above.

**Caution:** The background check takes the Send XRP dialog (`dlg`) as a parameter, since each dialog is a separate instance, but does not modify the dialog directly since that might not be thread-safe. (It _only_ uses `wx.CallAfter` to pass the results of the check back to the dialog.)

After this, it's time to update the `SendXRPDialog` class to make it capable of displaying these errors. You can also set a more specific upper bound for how much XRP the account can actually send. Change the constructor to take a new parameter:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/6_verification_and_polish.py" from="def __init__(self, parent, max_send=100000000.0)" before="wx.Dialog.__init__" language="py" /%}

Add some icon widgets to the UI, also in the `SendXRPDialog` constructor:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/6_verification_and_polish.py" from="# Icons to indicate" before="lbl_to =" language="py" /%}

Still in the `SendXRPDialog` constructor, add a maximum value to the line that creates the `self.txt_amt` widget:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/6_verification_and_polish.py" from="self.txt_amt =" before="self.txt_amt.SetDigits(6)" language="py" /%}

Don't forget to add all the new widgets to the `SendXRPDialog`'s sizer so they fit in the right places. Update the `BulkAdd` call in the constructor as follows:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/6_verification_and_polish.py" from="sizer.BulkAdd(((lbl_to," before="sizer.Fit(self)" language="py" /%}

Next, refactor the `on_to_edit()` handler in the `SendXRPDialog` class to perform more checks, including the new background check on the destination address. The updated handler should be as follows:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/6_verification_and_polish.py" from="def on_to_edit" before="def on_dest_tag_edit" language="py" /%}

In addition to starting the background check, this handler does some checks immediately. Any check that doesn't require getting data from the network is probably fast enough to run directly in the handler; if the check requires network access, you have to run it in the worker thread instead.

One of the new checks is to decode X-addresses to pull out the additional data they encode:

- If the X-address includes a destination tag, show it in the destination tag field.
- If the X-address is not intended for a test network and the app is connected to a test network (or the other way around), show an error.

One tricky bit of writing handlers like this in GUI code is that you have to be ready for the handler to be called many times as the user inputs and erases data. For example, if you disable a field when some input is invalid, you also have to enable it if the user changes their input to be valid.

The code shows the error icons when it finds errors (and hides them when it doesn't), and adds tooltips with the error message. You could, of course, display errors to the user in another way as well, such as additional pop-up dialogs or a status bar.

Moving on, you also need a new method in the `SendXRPDialog` class to process the results from the background check. Add the following code:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/6_verification_and_polish.py" from="def update_dest_info" before="class TWaXLFrame" language="py" /%}

This code takes the dictionary passed by the `check_destination()` and uses it to update various widgets in the Send XRP dialog's GUI.

You need to make a few small updates to configure the maximum send amount in the Send XRP dialog. Start by adding these lines to the `TWaXLFrame` class's constructor:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/6_verification_and_polish.py" from="# This account's total XRP reserve" before="self.build_ui()" language="py" /%}

Then modify the `update_account()` method of the `TWaXLFrame` to save the latest calculated reserve. Modify the last few lines to look like this:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/6_verification_and_polish.py" from="# Display account reserve and" before="def enable_readwrite" language="py" /%}

Finally, calculate the maximum amount the user can send and provide it to the Send XRP dialog. Modify **the beginning of the `click_send_xrp()` handler** as follows:

{% code-snippet file="/_code-samples/build-a-desktop-wallet/py/6_verification_and_polish.py" from="xrp_bal = Decimal" before="dlg.CenterOnScreen()" language="py" /%}

The formula this code uses to calculate the maximum amount the user can send is the account's XRP balance, minus its [reserve](../../../concepts/accounts/reserves.md) and minus the [transaction cost](../../../concepts/transactions/transaction-cost.md). The calculation uses the `Decimal` class to avoid rounding errors, but ultimately it has to be converted down to a `float` because that's what wxPython's [`wx.SpinCtrlDouble`](https://docs.wxpython.org/wx.SpinCtrlDouble.html) accepts for minimum and maximum values. Still there is less opportunity for floating-point rounding errors to occur if the conversion happens _after_ the other calculations.

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


## Next Steps

Now that you have a functional wallet, you can take it in several new directions. The following are a few ideas:

- You could support more of the XRP Ledger's [transaction types](../../../references/protocol/transactions/types/index.md) including [tokens](../../../concepts/tokens/index.md) and [cross-currency payments](../../../concepts/payment-types/cross-currency-payments.md)
    - Example code for displaying token balances and other objects: {% repo-link path="_code-samples/build-a-desktop-wallet/py/7_owned_objects.py" %}`7_owned_objects.py`{% /repo-link %}
- Allow the user to trade in the [decentralized exchange](../../../concepts/tokens/decentralized-exchange/index.md)
- Add a way to request payments, such as with QR codes or URIs that open in your wallet.
- Support better account security including [regular key pairs](../../../concepts/accounts/cryptographic-keys.md#regular-key-pair) or [multi-signing](../../../concepts/accounts/multi-signing.md).

{% raw-partial file="/docs/_snippets/common-links.md" /%}
