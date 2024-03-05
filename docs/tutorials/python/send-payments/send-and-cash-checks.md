---
html: send-and-cash-checks.html
parent: send-payments-using-python.html
labels:
  - Accounts
  - Quickstart
  - Transaction Sending
  - Checks
  - XRP
---
# Send and Cash Checks

This example shows how to:

1. Send a check to transfer XRP or issued currency to another account. 
2. Get a list of checks you have sent or received.
3. Cash a check received from another account.
4. Cancel a check you have sent.

Checks offer another option for transferring funds between accounts. Checks have two particular advantages.

1. You can use a check to send funds to another account without first creating a trust line - the trust line is created automatically when the receiver chooses to accept the funds.
2. The receiver can choose to accept less than the full amount of the check. This allows you to authorize a maximum amount when the actual cost is not finalized. 


[![Empty Check Form](/docs/img/quickstart-py-checks1.png)](/docs/img/quickstart-py-checks1.png)

## Prerequisites

If you haven't done so already, create a new folder on your local disk and install the Python library using `pip`.

```
    pip3 install xrpl-py
```

Clone or download the [Modular Tutorial Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/quickstart/py/){.github-code-download}.

**Note:** Without the Quickstart Samples, you will not be able to try the examples that follow. 

## Usage

To get test accounts:

1. Open and launch `lesson10-check.py`.
2. Click **Get Standby Account**.
3. Click **Get Operational Account**.
4. Click **Get Standby Account Info**.
5. Click **Get Operational Account Info**.
5. Copy and paste the **Standby Seed** and **Operational Seed** fields to a persistent location, such as a Notepad, so that you can reuse the accounts after reloading the form.

[![Form with New Accounts](/docs/img/quickstart-py-checks2.png)](/docs/img/quickstart-py-checks2.png)

You can transfer XRP between your new accounts. Each account has its own fields and buttons.

<div align="center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/R5wyxVcokHo?si=V1omxO1ni4IrjcD-" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

### Send a Check for XRP

To send a check for XRP from the Standby account to the Operational account:

1. On the Standby (left) side of the form, enter the **Amount** of XRP to send in drops.
2. Copy and paste the **Operational Account** field to the Standby **Destination** field.
3. Set the **Currency** to _XRP_.
4. Click **Send Check**.

[![Send Check Settings](/docs/img/quickstart-py-checks3.png)](/docs/img/quickstart-py-checks3.png)

### Send a Check for an Issued Currency

To send a check for an issued currency token from the Standby account to the Operational account:

1. On the Standby side of the form, enter the **Amount** of currency to send.
2. Copy and paste the **Operational Account** field to the Standby **Destination** field.
3. Copy the **Standby Account** field and paste the value in the **Issuer** field.
4. Enter the **Currency** code for your token.
5. Click **Send Check**.

[![Send Token Check Settings](/docs/img/quickstart-py-checks4.png)](/docs/img/quickstart-py-checks4.png)


### Get Checks

Click **Get Checks** to get a list of the current checks you have sent or received. To uniquely identify a check (for existence, when cashing a check), capture the **index** value for the check.

[![Get Checks with index highlighted](/docs/img/quickstart-py-checks5.png)](/docs/img/quickstart-py-checks5.png)

### Cash Check

To cash a check you have received:

1. Enter the **Check ID** (**index** value).
2. Enter the **Amount** you want to collect, up to the full amount of the check.
3. Enter the currency code.
   a. If you cashing a check for XRP, enter _XRP_ in the **Currency** field.
	 b. If you are cashing a check for an issued currency token:
	    1. Enter the **Issuer** of the token.
	    2. Enter the **Currency** code for the token.
4. Click **Cash Check**.

[![Cashed check results](/docs/img/quickstart-py-checks6.png)](/docs/img/quickstart-py-checks6.png)


### Get Balances

Click **Get Balances** to get a list of obligations and assets for each account.

[![Account Balances](/docs/img/quickstart-py-checks7.png)](/docs/img/quickstart-py-checks7.png)

### Cancel Check

To cancel a check you have previously sent to another account.

1. Enter the **Check ID** (**index** value).
2. Click **Cancel Check**.

[![Canceled check results](/docs/img/quickstart-py-checks8.png)](/docs/img/quickstart-py-checks8.png)


# Code Walkthrough

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/quickstart/py/){.github-code-download} in the source repository for this website.

## mod10.py

Import dependencies.

```python
import xrpl
from xrpl.clients import JsonRpcClient
from xrpl.wallet import Wallet
from datetime import datetime
from xrpl.models.transactions import CheckCreate, CheckCash, CheckCancel
from xrpl.models.requests import AccountObjects, AccountTx, GatewayBalances
```

Set the TestNet URL.

```python
testnet_url = "https://s.altnet.rippletest.net:51234"
```
### send_check

Pass the arguments for the account seed, check amount, and destination account. Set the currency type to _XRP_, or if it is an issued currency token provide the currency type and  issuer. 

```python
def send_check(seed, amount, destination, currency, issuer):
		"""send_check"""
```

Instantiate the account wallet and create a client connection.

```python
    wallet=Wallet.from_seed(seed)
    client=JsonRpcClient(testnet_url)
```

Create the amount variable. If you are sending XRP, the amount variable is fine as is. If you are sending issued currency, you need to create an amount object that includes the currency and the issuer.

```python
    if currency != "XRP":
        amount = {"value": amount,
                  "currency": currency,
                  "issuer": issuer
                 }
```

Define the `CheckCreate` transaction.

```python
    check_tx=xrpl.models.transactions.CheckCreate(
        account=wallet.address,
        send_max=amount,
        destination=destination
    ) 
```

Submit the transaction and report the results.

```python
		reply=""
    try:
        response=xrpl.transaction.submit_and_wait(check_tx,client,wallet)
        reply=response.result
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        reply=f"Submit failed: {e}"
    return reply
```

### cash_check

Pass the values for seed, amount, and check_id. Set the currency type to _XRP_, or include the currency type and issuer.

```python
def cash_check(seed, amount, check_id, currency, issuer):
    """cash_check"""
```

Instantiate the account wallet and create a client connection.

```python
    wallet=Wallet.from_seed(seed)
    client=JsonRpcClient(testnet_url)
```

If using an issued currency token, create an amount object that includes the currency type and issuer.

```python
    if currency != "XRP":
        amount = {
            "value": amount,
            "currency": currency,
            "issuer": issuer
        }
```

Define the CheckCash transaction.

```python
    finish_tx=xrpl.models.transactions.CheckCash(
        account=wallet.address,
        amount=amount,
        check_id=check_id
    )
```

Submit the transaction and report the results.

```python
    reply=""
    try:
        response=xrpl.transaction.submit_and_wait(finish_tx,client,wallet)
        reply=response.result
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        reply=f"Submit failed: {e}"
    return reply
```

### cancel_check

Pass the values for the account seed and the check ID.

```python
def cancel_check(seed, check_id):
    """cancel_check"""
```

Instantiate the account wallet and create a client connection.

```python
    wallet=Wallet.from_seed(seed)
    client=JsonRpcClient(testnet_url)
```

Define the CheckCancel transaction.

```python
    cancel_tx=xrpl.models.transactions.CheckCancel(
        account=wallet.address,
        check_id=check_id
    )
```

Submit the transaction and report the results

```python
    reply=""
    try:
        response=xrpl.transaction.submit_and_wait(cancel_tx,client,wallet)
        reply=response.result
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        reply=f"Submit failed: {e}"
    return reply
```

### get_checks

```python
def get_checks(account):
    """get_checks"""
```

Create a client connection.

```python
    client=JsonRpcClient(testnet_url)
```

Define the AccountObjects request, specifying the type _check_.

```python
    acct_checks=AccountObjects(
        account=account,
        ledger_index="validated",
        type="check"
    )
```

Send the request and report the results.

```python
    response=client.request(acct_checks)
    return response.result
```

## lesson10-check.py

This example builds on `lesson2-send-currency.py`. Changes are noted below. 

```python
import tkinter as tk
import xrpl
import json

from mod1 import get_account, get_account_info, send_xrp
from mod2 import get_balance
```

Import check-specific functions.

```python
from mod10 import send_check, cash_check, cancel_check, get_checks

#############################################
## Handlers #################################
#############################################
```

Add handlers for module 10.

```python
## Mod 10 Handlers

def standby_send_check():
    results=send_check(
        ent_standby_seed.get(),
        ent_standby_amount.get(),
        ent_standby_destination.get(),
        ent_standby_currency.get(),
        ent_standby_issuer.get()
    )
    text_standby_results.delete("1.0", tk.END)
    text_standby_results.insert("1.0", json.dumps(results, indent=4))

def standby_cash_check():
    results=cash_check(
        ent_standby_seed.get(),
        ent_standby_amount.get(),
        ent_standby_check_id.get(),
        ent_standby_currency.get(),
        ent_standby_issuer.get()
    )
    text_standby_results.delete("1.0", tk.END)
    text_standby_results.insert("1.0", json.dumps(results, indent=4))

def standby_cancel_check():
    results=cancel_check(
        ent_standby_seed.get(),
        ent_standby_check_id.get()
    )
    text_standby_results.delete("1.0", tk.END)
    text_standby_results.insert("1.0", json.dumps(results, indent=4))

def standby_get_checks():
    results=get_checks(
        ent_standby_account.get(),
    )
    text_standby_results.delete("1.0", tk.END)
    text_standby_results.insert("1.0", json.dumps(results, indent=4))

def standby_get_balance():
    results=get_balance(
        ent_standby_seed.get(),
        ent_operational_seed.get()
    )
    text_standby_results.delete("1.0", tk.END)
    text_standby_results.insert("1.0", json.dumps(results, indent=4))

def operational_send_check():
    results=send_check(
        ent_operational_seed.get(),
        ent_operational_amount.get(),
        ent_operational_destination.get(),
        ent_operational_currency.get(),
        ent_operational_issuer.get()
    )
    text_operational_results.delete("1.0", tk.END)
    text_operational_results.insert("1.0", json.dumps(results, indent=4))

def operational_cash_check():
    results=cash_check(
        ent_operational_seed.get(),
        ent_operational_amount.get(),
        ent_operational_check_id.get(),
        ent_operational_currency.get(),
        ent_operational_issuer.get()
    )
    text_operational_results.delete("1.0", tk.END)
    text_operational_results.insert("1.0", json.dumps(results, indent=4))

def operational_cancel_check():
    results=cancel_check(
        ent_operational_seed.get(),
        ent_operational_check_id.get()
    )
    text_operational_results.delete("1.0", tk.END)
    text_standby_results.insert("1.0", json.dumps(results, indent=4))

def operational_get_checks():
    results=get_checks(
        ent_operational_account.get(),
    )
    text_operational_results.delete("1.0", tk.END)
    text_operational_results.insert("1.0", json.dumps(results, indent=4))

def operational_get_balance():
    results=get_balance(
        ent_operational_seed.get(),
        ent_standby_seed.get()
    )
    text_operational_results.delete("1.0", tk.END)
    text_operational_results.insert("1.0", json.dumps(results, indent=4))

## Mod 1 Handlers

def get_standby_account():
    new_wallet=get_account(ent_standby_seed.get())
    ent_standby_account.delete(0, tk.END)
    ent_standby_seed.delete(0, tk.END)
    ent_standby_account.insert(0, new_wallet.classic_address)
    ent_standby_seed.insert(0, new_wallet.seed)


def get_standby_account_info():
    accountInfo=get_account_info(ent_standby_account.get())
    ent_standby_balance.delete(0, tk.END)
    ent_standby_balance.insert(0,accountInfo['Balance'])
    text_standby_results.delete("1.0", tk.END)
    text_standby_results.insert("1.0",json.dumps(accountInfo, indent=4))


def standby_send_xrp():
    response=send_xrp(ent_standby_seed.get(),ent_standby_amount.get(),
                       ent_standby_destination.get())
    text_standby_results.delete("1.0", tk.END)
    text_standby_results.insert("1.0",json.dumps(response.result, indent=4))
    get_standby_account_info()
    get_operational_account_info()


def get_operational_account():
    new_wallet=get_account(ent_operational_seed.get())
    ent_operational_account.delete(0, tk.END)
    ent_operational_account.insert(0, new_wallet.classic_address)
    ent_operational_seed.delete(0, tk.END)
    ent_operational_seed.insert(0, new_wallet.seed)


def get_operational_account_info():
    accountInfo=get_account_info(ent_operational_account.get())
    ent_operational_balance.delete(0, tk.END)
    ent_operational_balance.insert(0,accountInfo['Balance'])
    text_operational_results.delete("1.0", tk.END)
    text_operational_results.insert("1.0",json.dumps(accountInfo, indent=4))


def operational_send_xrp():
    response=send_xrp(ent_operational_seed.get(),ent_operational_amount.get(),
                        ent_operational_destination.get())
    text_operational_results.delete("1.0", tk.END)
    text_operational_results.insert("1.0",json.dumps(response.result,indent=4))
    get_standby_account_info()
    get_operational_account_info()


# Create a new window with the title "Check Example"
window=tk.Tk()
window.title("Check Example")

# Form frame
frm_form=tk.Frame(relief=tk.SUNKEN, borderwidth=3)
frm_form.pack()

# Create the Label and Entry widgets for "Standby Account"
lbl_standy_seed=tk.Label(master=frm_form, text="Standby Seed")
ent_standby_seed=tk.Entry(master=frm_form, width=50)
lbl_standby_account=tk.Label(master=frm_form, text="Standby Account")
ent_standby_account=tk.Entry(master=frm_form, width=50)
lbl_standby_balance=tk.Label(master=frm_form, text="XRP Balance")
ent_standby_balance=tk.Entry(master=frm_form, width=50)
lbl_standy_amount=tk.Label(master=frm_form, text="Amount")
ent_standby_amount=tk.Entry(master=frm_form, width=50)
lbl_standby_destination=tk.Label(master=frm_form, text="Destination")
ent_standby_destination=tk.Entry(master=frm_form, width=50)
```

Add fields for _Issuer_ and _Check ID_.

```python
lbl_standby_issuer=tk.Label(master=frm_form, text="Issuer")
ent_standby_issuer=tk.Entry(master=frm_form, width=50)
lbl_standby_check_id=tk.Label(master=frm_form, text="Check ID")
ent_standby_check_id=tk.Entry(master=frm_form, width=50)
lbl_standby_currency=tk.Label(master=frm_form, text="Currency")
ent_standby_currency=tk.Entry(master=frm_form, width=50)
lbl_standby_results=tk.Label(master=frm_form, text="Results")
text_standby_results=tk.Text(master=frm_form, height=20, width=65)

# Place fields in a grid.
lbl_standy_seed.grid(row=0, column=0, sticky="e")
ent_standby_seed.grid(row=0, column=1)
lbl_standby_account.grid(row=2, column=0, sticky="e")
ent_standby_account.grid(row=2, column=1)
lbl_standby_balance.grid(row=3, column=0, sticky="e")
ent_standby_balance.grid(row=3, column=1)
lbl_standy_amount.grid(row=4, column=0, sticky="e")
ent_standby_amount.grid(row=4, column=1)
lbl_standby_destination.grid(row=5, column=0, sticky="e")
ent_standby_destination.grid(row=5, column=1)
```

Place the _Issuer_ and _Check ID_ fields in the grid.

```python
lbl_standby_issuer.grid(row=6, column=0, sticky="e")
ent_standby_issuer.grid(row=6, column=1)
lbl_standby_check_id.grid(row=7, column=0, sticky="e")
ent_standby_check_id.grid(row=7, column=1)
lbl_standby_currency.grid(row=8, column=0, sticky="e")
ent_standby_currency.grid(row=8, column=1)
lbl_standby_results.grid(row=9, column=0, sticky="ne")
text_standby_results.grid(row=9, column=1, sticky="nw")

###############################################
## Operational Account ########################
###############################################

# Create the Label and Entry widgets for "Operational Account"

lbl_operational_seed=tk.Label(master=frm_form, text="Operational Seed")
ent_operational_seed=tk.Entry(master=frm_form, width=50)
lbl_operational_account=tk.Label(master=frm_form, text="Operational Account")
ent_operational_account=tk.Entry(master=frm_form, width=50)
lbl_operational_balance=tk.Label(master=frm_form, text="XRP Balance")
ent_operational_balance=tk.Entry(master=frm_form, width=50)
lbl_operational_amount=tk.Label(master=frm_form, text="Amount")
ent_operational_amount=tk.Entry(master=frm_form, width=50)
lbl_operational_destination=tk.Label(master=frm_form, text="Destination")
ent_operational_destination=tk.Entry(master=frm_form, width=50)
```

Add fields for the _Issuer_ and _Check ID_.

```python
lbl_operational_issuer=tk.Label(master=frm_form, text="Issuer")
ent_operational_issuer=tk.Entry(master=frm_form, width=50)
lbl_operational_check_id=tk.Label(master=frm_form, text="Check ID")
ent_operational_check_id=tk.Entry(master=frm_form, width=50)
lbl_operational_currency=tk.Label(master=frm_form, text="Currency")
ent_operational_currency=tk.Entry(master=frm_form, width=50)
lbl_operational_results=tk.Label(master=frm_form,text='Results')
text_operational_results=tk.Text(master=frm_form, height=20, width=65)

#Place the widgets in a grid
lbl_operational_seed.grid(row=0, column=4, sticky="e")
ent_operational_seed.grid(row=0, column=5, sticky="w")
lbl_operational_account.grid(row=2,column=4, sticky="e")
ent_operational_account.grid(row=2,column=5, sticky="w")
lbl_operational_balance.grid(row=3, column=4, sticky="e")
ent_operational_balance.grid(row=3, column=5, sticky="w")
lbl_operational_amount.grid(row=4, column=4, sticky="e")
ent_operational_amount.grid(row=4, column=5, sticky="w")
lbl_operational_destination.grid(row=5, column=4, sticky="e")
ent_operational_destination.grid(row=5, column=5, sticky="w")
```

Place the _Issuer_ and _Check ID_ fields in the grid.

```python
lbl_operational_issuer.grid(row=6, column=4, sticky="e")
ent_operational_issuer.grid(row=6, column=5, sticky="w")
lbl_operational_check_id.grid(row=7, column=4, sticky="e")
ent_operational_check_id.grid(row=7, column=5, sticky="w")
lbl_operational_currency.grid(row=8, column=4, sticky="e")
ent_operational_currency.grid(row=8, column=5)
lbl_operational_results.grid(row=9, column=4, sticky="ne")
text_operational_results.grid(row=9, column=5, sticky="nw")

#############################################
## Buttons ##################################
#############################################

# Create the Get Standby Account Buttons
btn_get_standby_account=tk.Button(master=frm_form, text="Get Standby Account",
                                    command=get_standby_account)
btn_get_standby_account.grid(row=0, column=2, sticky="nsew")
btn_get_standby_account_info=tk.Button(master=frm_form,
                                         text="Get Standby Account Info",
                                         command=get_standby_account_info)
btn_get_standby_account_info.grid(row=1, column=2, sticky="nsew")
btn_standby_send_xrp=tk.Button(master=frm_form, text="Send XRP >",
                                 command=standby_send_xrp)
btn_standby_send_xrp.grid(row=2, column=2, sticky="nsew")
```

Add standby buttons for **Send Check**, **Get Checks**, **Cash Check**, **Cancel Check**, and **Get Balances**.


```python
btn_standby_send_check=tk.Button(master=frm_form, text="Send  Check",
                                 command=standby_send_check)
btn_standby_send_check.grid(row=4, column=2, sticky="nsew")
btn_standby_get_checks=tk.Button(master=frm_form, text="Get Checks",
                                 command=standby_get_checks)
btn_standby_get_checks.grid(row=5, column=2, sticky="nsew")
btn_standby_cash_check=tk.Button(master=frm_form, text="Cash  Check",
                                 command=standby_cash_check)
btn_standby_cash_check.grid(row=6, column=2, sticky="nsew")
btn_standby_cancel_check=tk.Button(master=frm_form, text="Cancel  Check",
                                 command=standby_cancel_check)
btn_standby_cancel_check.grid(row=7, column=2, sticky="nsew")
btn_standby_get_balances=tk.Button(master=frm_form, text="Get Balances",
                            command=standby_get_balance)
btn_standby_get_balances.grid(row=8, column=2, sticky="nsew")

# Create the Operational Account Buttons
btn_get_operational_account=tk.Button(master=frm_form,
                                        text="Get Operational Account",
                                        command=get_operational_account)
btn_get_operational_account.grid(row=0, column=3, sticky="nsew")
btn_get_op_account_info=tk.Button(master=frm_form, text="Get Op Account Info",
                                    command=get_operational_account_info)
btn_get_op_account_info.grid(row=1, column=3, sticky="nsew")
btn_op_send_xrp=tk.Button(master=frm_form, text="< Send XRP",
                            command=operational_send_xrp)
btn_op_send_xrp.grid(row=2, column=3, sticky="nsew")
```

Add operational buttons for **Send Check**, **Get Checks**, **Cash Check**, **Cancel Check**, and **Get Balances**.


```javascript
btn_op_send_check=tk.Button(master=frm_form, text="Send Check",
                            command=operational_send_check)
btn_op_send_check.grid(row=4, column=3, sticky="nsew")
btn_op_get_checks=tk.Button(master=frm_form, text="Get Checks",
                            command=operational_get_checks)
btn_op_get_checks.grid(row=5, column=3, sticky="nsew")
btn_op_cash_check=tk.Button(master=frm_form, text="Cash Check",
                            command=operational_cash_check)
btn_op_cash_check.grid(row=6, column=3, sticky="nsew")
btn_op_cancel_check=tk.Button(master=frm_form, text="Cancel Check",
                            command=operational_cancel_check)
btn_op_cancel_check.grid(row=7, column=3, sticky="nsew")
btn_op_get_balances=tk.Button(master=frm_form, text="Get Balances",
                            command=operational_get_balance)
btn_op_get_balances.grid(row=8, column=3, sticky="nsew")

# Start the application
window.mainloop()
```