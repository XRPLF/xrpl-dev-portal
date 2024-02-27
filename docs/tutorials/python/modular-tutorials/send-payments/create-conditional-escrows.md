---
html: py-create-conditional-escrows.html
parent: send-payments-using-python.html
seo:
    description: Create, finish, or cancel condition-based escrow transactions.
labels:
  - Accounts
  - Quickstart
  - Transaction Sending
  - XRP
---
# Create Conditional Escrows Using Python

This example shows how to:

1. Create escrow payments that become available when an account enters a fulfillment code.

2. Complete a conditional escrow transaction.

3. Cancel a conditional escrow transaction.

[![Conditional Escrow Tester Form](/docs/img/quickstart-py-conditional-escrow-1.png)](/docs/img/quickstart-py-conditional-escrow-1.png)


## Prerequisites

Download and expand the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/py/)<!-- {.github-code-download} --> archive.

You need the `cryptoconditions` module to generate your condition/fulfillment pair. You can install the module using [pip](https://pip.pypa.io/en/stable/).

In a terminal window, install the `cryptoconditions` module with this command:

```bash
pip install cryptoconditions
```

## Usage

### Get Test Accounts

To get test accounts:
 
1. Open and run `lesson9-conditional-escrow.py`.
2. Get test accounts.
    1. If you have existing account seeds
        1. Paste Standby account seed in the **Standby Seed** field.
        2. Click **Get Standby Account**.
        3. Click **Get Standby Account Info**.
        4. Paste Operational account seed in the **Operational Seed** field.
        5. Click **Get Operational Account**.
        6. Click **Get Op Account Info**.
    2. If you do not have account seeds:
        1. Click **Get Standby Account**.
        2. Click **Get Standby Account Info**.
        3. Click **Get Operational Account**.
        4. Click **Get Op Account Info**.

[![Escrow Example with Account Information](/docs/img/quickstart-py-conditional-escrow-2.png)](/docs/img/quickstart-py-conditional-escrow-2.png)

#### Get a Condition and Fulfillment

Click **Get Condition** to generate a condition/fulfillment pair and populate the fields on the form. You can copy the values and store them in a text file for safe keeping. 

[![Escrow Example with Condition and Fulfillment](/docs/img/quickstart-py-conditional-escrow-3.png)](/docs/img/quickstart-py-conditional-escrow-3.png)

### Create Conditional Escrow

<div align="center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/IUfSX5RKahs?si=7kV0T2NTtqsZfpvX" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

When you create a conditional escrow, you need to specify the `Condition` value you generated above. You must also set a cancel date and time, after which the escrow is no longer available.  

To create a conditional escrow:

1. Enter an **Amount** to transfer.
2. Copy the **Operational Account** value.
3. Paste it in the **Destination Account** field.
4. Enter the **Escrow Cancel (seconds)** value.
5. Click **Create Escrow**.
6. Copy and save the _Sequence Number_ of the escrow called out in the **Standby Result** field.

The escrow is created on the XRP Ledger instance, reserving your requested XRP amount plus the transaction cost.

When you create an escrow, capture and save the _Sequence Number_ so that you can use it to finish the escrow transaction.

[![Created Escrow Transaction](/docs/img/quickstart-py-conditional-escrow-4.png)](/docs/img/quickstart-py-conditional-escrow-4.png)

## Finish Conditional Escrow

Any account can finish the conditional escrow any time before the _Escrow Cancel_ time. Following on the example above, you can use the _Sequence Number_ to finish the transaction once the Escrow Cancel time has passed.

To finish a conditional escrow:

1. Paste the sequence number in the Operational account **Sequence Number** field.
2. Enter the **Escrow Condition** value.
3. Enter the **Escrow Fulfillment** code for the `Condition`.
4. Copy the **Standby Account** value.
5. Paste it into the **Escrow Owner** field.
4. Click **Finish Conditional Escrow**.

The transaction completes and balances are updated for both the Standby and Operational accounts.

[![Finished Escrow Transaction](/docs/img/quickstart-py-conditional-escrow-5.png)](/docs/img/quickstart-py-conditional-escrow-5.png)

## Get Escrows

Click **Get Escrows** for either the Standby account or the Operational account to see their current list of escrows. 

## Cancel Escrow

When the Escrow Cancel time passes, the escrow is no longer available to the recipient. The initiator of the escrow can reclaim the XRP, less the transaction fees. Any account can cancel an escrow once the cancel time has elapsed. Accounts that try to cancel the transaction prior to the **Escrow Cancel** time are charged the nominal transaction cost (about 10-15 drops), but the actual escrow cannot be cancelled until after the Escrow Cancel time.

## Oh No! I Forgot to Save the Sequence Number!

If you forget to save the sequence number, you can find it in the escrow transaction record.

1. Create a new escrow as described in [Create Conditional Escrow](#create-conditional-escrow), above.
2. Click **Get Escrows** to get the escrow information.
3. Copy the _PreviousTxnLgrSeq_ value from the results.
   ![Transaction ID in Get Escrows results](/docs/img/quickstart-py-conditional-escrow-6.png)
4. Paste the _PreviousTxnLgrSeq_ in the **Transaction to Look Up** field.
   ![Transaction to Look Up field](/docs/img/quickstart-py-conditional-escrow-7.png)
5. Click **Get Transaction**.
6. Locate the _Sequence_ value in the results.

![Sequence number in results](/docs/img/quickstart-py-conditional-escrow-8.png)

# Code Walkthrough

You can download the [Modular Tutorials](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/py/)<!-- {.github-code-download} --> in the source repository for this website.

## mod9.py

Import dependencies.

```python
import xrpl
from xrpl.clients import JsonRpcClient
from xrpl.wallet import Wallet
from datetime import datetime
from xrpl.models.transactions import EscrowCreate, EscrowFinish
from os import urandom
from cryptoconditions import PreimageSha256
```

Create a global variable pointing to Testnet.

```python
testnet_url = "https://s.altnet.rippletest.net:51234"
```

### generate_condition

Generate the _condition_ and _fulfillment_ values for the escrow.

```python
def generate_condition():
```

Set a variable to 32 random bytes.

```python
    randy = urandom(32)
```

Use the 32-byte random variable as the argument for the `PreimageSha256` functino.

```python
    fulfillment = PreimageSha256(preimage=randy)
```

Return the binary condition and the binary serialized (fulfillment) value.

```python
    return (fulfillment.condition_binary.hex().upper(),
            fulfillment.serialize_binary().hex().upper())
```

### add_seconds

Create a date in the Ripple epoch, adding the specified number of seconds.

```python
def add_seconds(numOfSeconds):
```

Create a new_date variable.

```python
    new_date = datetime.now()
```

Convert the date to a Ripple time object.

```python
    if new_date != '':
        new_date = xrpl.utils.datetime_to_ripple_time(new_date)
```

Add the requested seconds to the Ripple formatted date variable.

```python
        new_date = new_date + int(numOfSeconds)
```

Return the result.

```python
    return new_date
```

### create_conditional_escrow

You create conditional escrows using the same **EscrowCreate** model you used for a time-based escrow, but instead of a finish time, you provide a condition that must be met to complete the transaction.

Pass the _seed_ for the sending account, the _amount_ to hold in escrow, the _destination_ account to receive the escrow funds, the number of seconds until the escrow will _cancel_, and a _condition_ value that will be matched with a _fulfillment_ value to complete the escrow.

```python
def create_conditional_escrow(seed, amount, destination, cancel, condition):
```

Instantiate a wallet and connect to Testnet.

```python
    wallet=Wallet.from_seed(seed)
    client=JsonRpcClient(testnet_url)
```

Create a *cancel_date* variable, adding your specified number of seconds to the current Ripple epoch date.

```python
    cancel_date = add_seconds(cancel)
```

Define the transaction with your provided values.

```python
    escrow_tx=xrpl.models.transactions.EscrowCreate(
        account=wallet.address,
        amount=amount,
        destination=destination,
        cancel_after=cancel_date,
        condition=condition
    ) 
```

Submit the transaction and return the results.

```python
    reply=""
    try:
        response=xrpl.transaction.submit_and_wait(escrow_tx,client,wallet)
        reply=response.result
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        reply=f"Submit failed: {e}"
    return reply
```

### finish_conditional_escrow

At any time prior to the cancel date, the destination account can fulfill the escrow. 

Pass the _seed_ for the receiving account, the _owner_ (sending account), the _sequence_ number for the escrow, the _condition_ value, and the matching _fulfillment_ value.

```python
def finish_conditional_escrow(seed, owner, sequence, condition, fulfillment):
```

Instantiate the account wallet and connect to Testnet.

```python
    wallet=Wallet.from_seed(seed)
    client=JsonRpcClient(testnet_url)
```

Define the **EscrowFinish** transaction, including both the condition and the fulfillment values.

```python
    finish_tx=xrpl.models.transactions.EscrowFinish(
        account=wallet.address,
        owner=owner,
        offer_sequence=int(sequence),
        condition=condition,
        fulfillment=fulfillment
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

## lesson9-conditional-escrow.py

This example builds on `lesson8-time-escrow.py` to reuse fields, buttons, and functions that apply to both time-based and conditional escrows. Updates are highlighted below.

```python
import tkinter as tk
import xrpl
import json

from mod1 import get_account, get_account_info, send_xrp
from mod8 import get_escrows, cancel_time_escrow, get_transaction
```

Import new functions for conditional escrows from module 9.

```python
from mod9 import create_conditional_escrow, finish_conditional_escrow, generate_condition

```

Add handlers for creating and finishing conditional escrows.

```python
def get_condition():
    results = generate_condition()
    ent_standby_escrow_condition.delete(0, tk.END)
    ent_standby_escrow_condition.insert(0, results[0])
    ent_operational_escrow_fulfillment.delete(0, tk.END)
    ent_operational_escrow_fulfillment.insert(0, results[1])
    
def standby_create_conditional_escrow():
    results = create_conditional_escrow(
        ent_standby_seed.get(),
        ent_standby_amount.get(),
        ent_standby_destination.get(),
        ent_standby_escrow_cancel.get(),
        ent_standby_escrow_condition.get()
    )
    text_standby_results.delete("1.0", tk.END)
    text_standby_results.insert("1.0", json.dumps(results, indent=4))

def operational_finish_conditional_escrow():
    results = finish_conditional_escrow(
        ent_operational_seed.get(),
        ent_operational_escrow_owner.get(),
        ent_operational_sequence_number.get(),
        ent_standby_escrow_condition.get(),
        ent_operational_escrow_fulfillment.get()
    )
    text_operational_results.delete("1.0", tk.END)
    text_operational_results.insert("1.0", json.dumps(results, indent=4))

## Mod 8 Handlers

def operational_get_escrows():
    results = get_escrows(ent_operational_account.get())
    text_operational_results.delete("1.0", tk.END)
    text_operational_results.insert("1.0", json.dumps(results, indent=4))

def standby_cancel_time_escrow():
    results = cancel_time_escrow(
        ent_standby_seed.get(),
        ent_standby_escrow_owner.get(),
        ent_standby_escrow_sequence_number.get()
    )
    text_standby_results.delete("1.0", tk.END)
    text_standby_results.insert("1.0", json.dumps(results, indent=4))
    
def operational_get_transaction():
    results = get_transaction(ent_operational_account.get(),
                              ent_operational_look_up.get())
    text_operational_results.delete("1.0", tk.END)
    text_operational_results.insert("1.0", json.dumps(results, indent=4))    

## Mod 1 Handlers

def get_standby_account():
    new_wallet = get_account(ent_standby_seed.get())
    ent_standby_account.delete(0, tk.END)
    ent_standby_seed.delete(0, tk.END)
    ent_standby_account.insert(0, new_wallet.classic_address)
    ent_standby_seed.insert(0, new_wallet.seed)


def get_standby_account_info():
    accountInfo = get_account_info(ent_standby_account.get())
    ent_standby_balance.delete(0, tk.END)
    ent_standby_balance.insert(0,accountInfo['Balance'])
    text_standby_results.delete("1.0", tk.END)
    text_standby_results.insert("1.0",json.dumps(accountInfo, indent=4))


def standby_send_xrp():
    response = send_xrp(ent_standby_seed.get(),ent_standby_amount.get(),
                       ent_standby_destination.get())
    text_standby_results.delete("1.0", tk.END)
    text_standby_results.insert("1.0",json.dumps(response.result, indent=4))
    get_standby_account_info()
    get_operational_account_info()


def get_operational_account():
    new_wallet = get_account(ent_operational_seed.get())
    ent_operational_account.delete(0, tk.END)
    ent_operational_account.insert(0, new_wallet.classic_address)
    ent_operational_seed.delete(0, tk.END)
    ent_operational_seed.insert(0, new_wallet.seed)


def get_operational_account_info():
    accountInfo = get_account_info(ent_operational_account.get())
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

Rename the window.

```python
window = tk.Tk()
window.title("Conditional Escrow Example")

# Form frame
frm_form = tk.Frame(relief=tk.SUNKEN, borderwidth=3)
frm_form.pack()

# Create the Label and Entry widgets for "Standby Account"
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
```

Add a field for the escrow condition.

```python
lbl_standby_escrow_condition = tk.Label(master=frm_form, text="Escrow Condition")
ent_standby_escrow_condition = tk.Entry(master=frm_form, width=50)
lbl_standby_escrow_cancel = tk.Label(master=frm_form, text="Escrow Cancel (seconds)")
ent_standby_escrow_cancel = tk.Entry(master=frm_form, width=50)
lbl_standby_escrow_sequence_number = tk.Label(master=frm_form, text="Sequence Number")
ent_standby_escrow_sequence_number = tk.Entry(master=frm_form, width=50)
lbl_standby_escrow_owner = tk.Label(master=frm_form, text="Escrow Owner")
ent_standby_escrow_owner = tk.Entry(master=frm_form, width=50)                    
lbl_standby_results = tk.Label(master=frm_form, text="Results")
text_standby_results = tk.Text(master=frm_form, height = 20, width = 65)

# Place fields in a grid.
lbl_standy_seed.grid(row=0, column=0, sticky="e")
ent_standby_seed.grid(row=0, column=1)
lbl_standby_account.grid(row=2, column=0, sticky="e")
ent_standby_account.grid(row=2, column=1)
lbl_standy_amount.grid(row=3, column=0, sticky="e")
ent_standby_amount.grid(row=3, column=1)
lbl_standby_destination.grid(row=4, column=0, sticky="e")
ent_standby_destination.grid(row=4, column=1)
lbl_standby_balance.grid(row=5, column=0, sticky="e")
ent_standby_balance.grid(row=5, column=1)
```

Insert the condition field in the standby grid.

```python
lbl_standby_escrow_condition.grid(row=6, column=0, sticky="e")
ent_standby_escrow_condition.grid(row=6, column=1)
lbl_standby_escrow_cancel.grid(row=7, column=0, sticky="e")
ent_standby_escrow_cancel.grid(row=7, column=1)
lbl_standby_escrow_sequence_number.grid(row=8, column=0, sticky="e")
ent_standby_escrow_sequence_number.grid(row=8, column=1)
lbl_standby_escrow_owner.grid(row=9, column=0, sticky="e")
ent_standby_escrow_owner.grid(row=9, column=1)
lbl_standby_results.grid(row=10, column=0, sticky="ne")
text_standby_results.grid(row=10, column=1, sticky="nw")

###############################################
## Operational Account ########################
###############################################

# Create the Label and Entry widgets for "Operational Account"
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
```

Add a field for the escrow fulfillment value.

```python
lbl_operational_escrow_fulfillment = tk.Label(master=frm_form, text="Escrow Fulfillment")
ent_operational_escrow_fulfillment = tk.Entry(master=frm_form, width=50)
lbl_operational_sequence_number = tk.Label(master=frm_form, text="Sequence Number")
ent_operational_sequence_number = tk.Entry(master=frm_form, width=50)
lbl_operational_escrow_owner=tk.Label(master=frm_form, text="Escrow Owner")
ent_operational_escrow_owner=tk.Entry(master=frm_form, width=50)
lbl_operational_look_up = tk.Label(master=frm_form, text="Transaction to Look Up")
ent_operational_look_up = tk.Entry(master=frm_form, width=50)
lbl_operational_results = tk.Label(master=frm_form,text='Results')
text_operational_results = tk.Text(master=frm_form, height = 20, width = 65)


#Place the widgets in a grid
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
```

Insert the **Fulfillment** field in the operational grid, moving the other fields down so as to align the **Condition** and **Fulfillment** fields horizontally.

```python
lbl_operational_escrow_fulfillment.grid(row=6, column=4, sticky="e")
ent_operational_escrow_fulfillment.grid(row=6, column=5, sticky="w")
lbl_operational_sequence_number.grid(row=7, column=4, sticky="e")
ent_operational_sequence_number.grid(row=7, column=5, sticky="w")
lbl_operational_escrow_owner.grid(row=8, column=4, sticky="e")
ent_operational_escrow_owner.grid(row=8, column=5, sticky="w")
lbl_operational_look_up.grid(row=9, column=4, sticky="e")
ent_operational_look_up.grid(row=9, column=5, sticky="w")
lbl_operational_results.grid(row=10, column=4, sticky="ne")
text_operational_results.grid(row=10, column=5, sticky="nw")

#############################################
## Buttons ##################################
#############################################

# Create the Get Standby Account Buttons
btn_get_standby_account = tk.Button(master=frm_form, text="Get Standby Account",
                                    command = get_standby_account)
btn_get_standby_account.grid(row = 0, column = 2, sticky = "nsew")
btn_get_standby_account_info = tk.Button(master=frm_form,
                                         text="Get Standby Account Info",
                                         command = get_standby_account_info)
btn_get_standby_account_info.grid(row = 1, column = 2, sticky = "nsew")
btn_standby_send_xrp = tk.Button(master=frm_form, text="Send XRP >",
                                 command = standby_send_xrp)
btn_standby_send_xrp.grid(row = 2, column = 2, sticky = "nsew")
```

Add a **Create Conditional Escrow** button to the Standby grid.

```python
btn_standby_get_condition = tk.Button(master=frm_form, text="Get Condition",
                                      command = get_condition)
btn_standby_get_condition.grid(row=4, column=2, sticky="nsew")
btn_standby_create_escrow = tk.Button(master=frm_form, text="Create Conditional Escrow",
                                 command = standby_create_conditional_escrow)
btn_standby_create_escrow.grid(row=5, column = 2, sticky="nsew")
btn_standby_cancel_escrow = tk.Button(master=frm_form, text="Cancel Escrow",
                                 command = standby_cancel_time_escrow)
btn_standby_cancel_escrow.grid(row=6,column = 2, sticky="nsew")

# Create the Operational Account Buttons
btn_get_operational_account = tk.Button(master=frm_form,
                                        text="Get Operational Account",
                                        command = get_operational_account)
btn_get_operational_account.grid(row=0, column=3, sticky = "nsew")
btn_get_op_account_info = tk.Button(master=frm_form, text="Get Op Account Info",
                                    command = get_operational_account_info)
btn_get_op_account_info.grid(row=1, column=3, sticky = "nsew")
btn_op_send_xrp = tk.Button(master=frm_form, text="< Send XRP",
                            command = operational_send_xrp)
btn_op_send_xrp.grid(row=2, column = 3, sticky = "nsew")
```

Add a **Finish Escrow** button to the operational grid.

```python
btn_op_finish_escrow = tk.Button(master=frm_form, text="Finish Escrow",
                            command = operational_finish_conditional_escrow)
btn_op_finish_escrow.grid(row = 4, column = 3, sticky="nsew")
btn_op_get_escrows = tk.Button(master=frm_form, text="Get Escrows",
                            command = operational_get_escrows)
btn_op_get_escrows.grid(row = 5, column = 3, sticky="nsew")
btn_op_get_transaction = tk.Button(master=frm_form, text="Get Transaction",
                            command = operational_get_transaction)
btn_op_get_transaction.grid(row = 6, column = 3, sticky = "nsew")

# Start the application
window.mainloop()
```
