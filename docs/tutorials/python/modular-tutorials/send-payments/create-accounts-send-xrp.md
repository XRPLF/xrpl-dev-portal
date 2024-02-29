---
html: py-create-accounts-send-xrp.html
parent: send-payments-using-python.html
seo:
    description: Create two accounts and transfer XRP between them using Python.
labels:
  - Accounts
  - Quickstart
  - Transaction Sending
  - XRP
---
# Create Accounts and Send XRP Using Python

This example shows how to:

1. Create accounts on the Testnet, funded with 10000 test XRP with no actual value. 
2. Retrieve the accounts from seed values.
3. Transfer XRP between accounts.

When you create an account, you receive a public/private key pair offline. Your account does not appear on the ledger until it is funded with XRP. This example shows how to create accounts for Testnet, but not how to create an account that you can use on Mainnet.

[![Token Test Harness](/docs/img/quickstart-py2.png)](/docs/img/quickstart-py2.png)

## Prerequisites

To get started, create a new folder on your local disk and install the Python library using `pip`.

```
pip3 install xrpl-py
```

Download and expand the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/py/)<!-- {.github-code-download} --> archive.

**Note:** Without the Quickstart Samples, you will not be able to try the examples that follow. 

## Usage
<div align="center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/YnPccLPa0hc?si=t-CqrLYmCCHSaZhB" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

To get test accounts:

1. Open and launch `lesson1-send-xrp.py`.
2. Click **Get Standby Account**.
3. Click **Get Operational Account**.
4. Click **Get Standby Account Info**.
5. Click **Get Operational Account Info**.
5. Copy and paste the **Standby Seed** and **Operational Seed** fields to a persistent location, such as a Notepad, so that you can reuse the accounts after reloading the form.

[![Standby and Operational Accounts](/docs/img/quickstart-py3.png)](/docs/img/quickstart-py3.png)

You can transfer XRP between your new accounts. Each account has its own fields and buttons.

<div align="center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/l2X7Vso5wWc?si=9l1SOlhjIBdPEuv0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

To transfer XRP from the Standby account to the Operational account:

1. On the Standby (left) side of the form, enter the **Amount** of XRP to send.
2. Copy and paste the **Operational Account** field to the Standby **Destination** field.
3. Click **Send XRP>** to transfer XRP from the standby account to the operational account

[![Transferred XRP](/docs/img/quickstart-py4.png)](/docs/img/quickstart-py4.png)

To transfer XRP from the Operational account to the Standby account:

1. On the Operational (right) side of the form, enter the **Amount** of XRP to send.
2. Copy and paste the **Standby Account** field to the Operational **Destination** field.
3. Click **&lt;Send XRP** to transfer XRP from the Operational account to the Standby account.

# Code Walkthrough

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/py/)<!-- {.github-code-download} --> in the source repository for this website.

## mod1.py

The mod1.py module contains the business logic for interacting with the XRP Ledger.

Import the XRPL library.

```python
import xrpl

```

 Create a variable for the server URI. This example uses the _Testnet_ ledger. You can update the URI to choose a different XRP Ledger instance.

 
 ```python
 testnet_url = "https://s.altnet.rippletest.net:51234/"
```

### get_account

This method lets you get an existing account by providing a seed value. If you provide no seed value, the method creates a new account for you.

Import required methods.

```python
def get_account(seed):
    """get_account"""
```

Request a new client from the XRP Ledger.

```python
    client = xrpl.clients.JsonRpcClient(testnet_url)
```

If you do not enter a seed, generate and return a new wallet. If you provide a seed value, return the wallet for that seed.

```python
    if (seed == ''):
        new_wallet = xrpl.wallet.generate_faucet_wallet(client)
    else:
        new_wallet = xrpl.wallet.Wallet.from_seed(seed)
    return new_wallet
```

### get_account_info

Pass the account ID to the `get_account_info` method.

```python
def get_account_info(accountId):
    """get_account_info"""
```

Get a client instance from Testnet. 

```python
    client = xrpl.clients.JsonRpcClient(testnet_url)
```

Create the account info request, passing the account ID and the ledger index (in this case, the latest validated ledger). 

```python
    acct_info = xrpl.models.requests.account_info.AccountInfo(
        account=accountId,
        ledger_index="validated"
    )
```

Send the request to the XRP Ledger instance.

```python
    response=client.request(acct_info)
```

Return the account data.

```python
    return response.result['account_data']
```

### send_xrp

Transfer XRP to another account by passing the client seed, amount to transfer, and the destination account.

```python
def send_xrp(seed, amount, destination):
```

Get the sending wallet.

```python
    sending_wallet = xrpl.wallet.Wallet.from_seed(seed)
    client = xrpl.clients.JsonRpcClient(testnet_url)
```

Create a transaction request, passing the sending account, amount, and destination account.

```python
    payment = xrpl.models.transactions.Payment(
        account=sending_wallet.address,
        amount=xrpl.utils.xrp_to_drops(int(amount)),
        destination=destination,
    )
```

Submit the transaction and return the response. If the transaction fails, return the error message.

```python
    try:    
        response = xrpl.transaction.submit_and_wait(payment, client, sending_wallet)    
    except xrpl.transaction.XRPLReliableSubmissionException as e:    
        response = f"Submit failed: {e}"
    return response
```

## lesson1-send-xrp.py

This module handles the UI for the application, providing fields for entering and reporting results of transactions and requests.

Import the tkinter, xrpl, and json modules.

```python
import tkinter as tk
import xrpl
import json
```

Import the methods from mod1.py.

```python    
from .mod1 import get_account, get_account_info, send_xrp
```

### getStandbyAccount

```python
def get_standby_account():
```

Use the value in the standby Seed field (or an empty value) to request a new account.

```python
    new_wallet = get_account(ent_standby_seed.get())
```

Clear the **Standby Seed** and **Standby Account** fields.

```python
    ent_standby_account.delete(0, tk.END)
    ent_standby_seed.delete(0, tk.END)
```

Insert the account ID and seed values in the standby fields.

```python
    ent_standby_account.insert(0, new_wallet.classic_address)
    ent_standby_seed.insert(0, new_wallet.seed)
```

### get_standby_account_info

With an account ID, anyone can request information about the account. Get the standby account value and use it to populate a `get_account_info` request.

```python
def get_standby_account_info():
    accountInfo = get_account_info(ent_standby_account.get())
```

Clear the Standby **Balance** field and insert the value from the account info response.

```python
    ent_standby_balance.delete(0, tk.END)
    ent_standby_balance.insert(0,accountInfo['Balance'])
```

Clear the Standby **Results** text area and fill it with the full JSON response.

```python
    text_standby_results.delete("1.0", tk.END)
    text_standby_results.insert("1.0",json.dumps(accountInfo, indent=4))
```

### standby_send_xrp

```python
def standby_send_xrp():
```

Call the `send_xrp` method, passing the standby seed, the amount, and the destination value.

```python
    response = send_xrp(ent_standby_seed.get(),ent_standby_amount.get(),
        ent_standby_destination.get())
```

Clear the standby **Results** field and insert the JSON response.

```python
    text_standby_results.delete("1.0", tk.END)
    text_standby_results.insert("1.0",json.dumps(response.result, indent=4))
```

Use `get_standby_account_info()` and `get_operational_account_info()` to update the balance field for both accounts.

```python
    get_standby_account_info()
    get_operational_account_info()
```

### Reciprocal Transactions and Requests

The following four methods are the same as the previous standby transactions, but for the operational account.
    
```python
def get_operational_account():
    new_wallet = get_account(ent_operational_seed.get())
    ent_operational_account.delete(0, tk.END)
    ent_operational_account.insert(0, new_wallet.classic_address)
    ent_operational_seed.delete(0, tk.END)
    ent_operational_seed.insert(0, new_wallet.seed)


def get_operational_account_info():
    account_info = get_account_info(ent_operational_account.get())
    ent_operational_balance.delete(0, tk.END)
    ent_operational_balance.insert(0,accountInfo['Balance'])
    text_operational_results.delete("1.0", tk.END)
    text_operational_results.insert("1.0",json.dumps(accountInfo, indent=4))


def operational_send_xrp():
    response = send_xrp(ent_operational_seed.get(),ent_operational_amount.get(),
                        ent_operational_destination.get())
    text_operational_results.delete("1.0", tk.END)
    text_operational_results.insert("1.0",json.dumps(response.result,indent=4))
    get_standby_account_info()
    get_operational_account_info()
```

Create UI elements, starting with the main window.

```python
window = tk.Tk()
window.title("Quickstart Module 1")
```

Add a frame for the form.

```python
frm_form = tk.Frame(relief=tk.SUNKEN, borderwidth=3)
frm_form.pack()
```

Create the `Label` and `Entry` widgets for the standby account.

```python
lbl_standy_seed = tk.Label(master=frm_form, text="Standby Seed")
ent_standby_seed = tk.Entry(master=frm_form, width=50)
lbl_standby_account = tk.Label(master=frm_form, text="Standby Account")
ent_standby_account = tk.Entry(master=frm_form, width=50)
lbl_standy_amount = tk.Label(master=frm_form, text="Amount")
ent_standby_amount = tk.Entry(master=frm_form, width=50)
lbl_standby_destination = tk.Label(master=frm_form, text="Destination")
ent_standby_destination = tk.Entry(master=frm_form, width=50)
lbl_standby_balance = tk.Label(master=frm_form, text="XRP Balance")
ent_standby_balance = tk.Entry(master=frm_form, width=50)
lbl_standby_results = tk.Label(master=frm_form,text='Results')
text_standby_results = tk.Text(master=frm_form, height = 20, width = 65)
```

Place the fields in a grid.

```python
lbl_standy_seed.grid(row=0, column=0, sticky="w")
ent_standby_seed.grid(row=0, column=1)
lbl_standby_account.grid(row=2, column=0, sticky="e")
ent_standby_account.grid(row=2, column=1)
lbl_standy_amount.grid(row=3, column=0, sticky="e")
ent_standby_amount.grid(row=3, column=1)
lbl_standby_destination.grid(row=4, column=0, sticky="e")
ent_standby_destination.grid(row=4, column=1)
lbl_standby_balance.grid(row=5, column=0, sticky="e")
ent_standby_balance.grid(row=5, column=1)
lbl_standby_results.grid(row=6, column=0, sticky="ne")
text_standby_results.grid(row=6, column=1, sticky="nw")
```

Create the `Label` and `Entry` widgets for the operational account

```python
lbl_operational_seed = tk.Label(master=frm_form, text="Operational Seed")
ent_operational_seed = tk.Entry(master=frm_form, width=50)
lbl_operational_account = tk.Label(master=frm_form, text="Operational Account")
ent_operational_account = tk.Entry(master=frm_form, width=50)
lbl_operational_amount = tk.Label(master=frm_form, text="Amount")
ent_operational_amount = tk.Entry(master=frm_form, width=50)
lbl_operational_destination = tk.Label(master=frm_form, text="Destination")
ent_operational_destination = tk.Entry(master=frm_form, width=50)
lbl_operational_balance = tk.Label(master=frm_form, text="XRP Balance")
ent_operational_balance = tk.Entry(master=frm_form, width=50)
lbl_operational_results = tk.Label(master=frm_form,text='Results')
text_operational_results = tk.Text(master=frm_form, height = 20, width = 65)
```

Place the operational widgets in a grid.

```python
lbl_operational_seed.grid(row=0, column=4, sticky="e")
ent_operational_seed.grid(row=0, column=5, sticky="w")
lbl_operational_account.grid(row=2,column=4, sticky="e")
ent_operational_account.grid(row=2,column=5, sticky="w")
lbl_operational_amount.grid(row=3, column=4, sticky="e")
ent_operational_amount.grid(row=3, column=5, sticky="w")
lbl_operational_destination.grid(row=4, column=4, sticky="e")
ent_operational_destination.grid(row=4, column=5, sticky="w")
lbl_operational_balance.grid(row=5, column=4, sticky="e")
ent_operational_balance.grid(row=5, column=5, sticky="w")
lbl_operational_results.grid(row=6, column=4, sticky="ne")
text_operational_results.grid(row=6, column=5, sticky="nw")
```

Create the standby account buttons and add them to the grid.

```python
btn_get_standby_account = tk.Button(master=frm_form, text="Get Standby Account", command = get_standby_account)
btn_get_standby_account.grid(row=0, column=2, sticky = "nsew")
btn_get_standby_account_info = tk.Button(master=frm_form, text="Get Standby Account Info", command = get_standby_account_info)
btn_get_standby_account_info.grid(row=1, column=2, sticky = "nsew")
btn_standby_send_xrp = tk.Button(master=frm_form, text="Send XRP >", command = standby_send_xrp)
btn_standby_send_xrp.grid(row=2, column = 2, sticky = "nsew")
```

Create the operational account buttons and add them to the grid.

```python
btn_get_operational_account = tk.Button(master=frm_form, text="Get Operational Account",
                                        command = get_operational_account)
btn_get_operational_account.grid(row=0, column=3, sticky = "nsew")
btn_get_op_account_info = tk.Button(master=frm_form, text="Get Op Account Info", 
                                    command = get_operational_account_info)
btn_get_op_account_info.grid(row=1, column=3, sticky = "nsew")
btn_op_send_xrp = tk.Button(master=frm_form, text="< Send XRP",
                            command = operational_send_xrp)
btn_op_send_xrp.grid(row=2, column = 3, sticky = "nsew")
```

Start the application.

```python
window.mainloop()
```
