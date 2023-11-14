---
html: py-checks.html
parent: send-payments-using-python.html
blurb: Send checks to facilitate a two-step payment.
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


[![Empty Check Form](img/quickstart-py37c.png)](img/quickstart-py37c.png)

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

[![Form with New Accounts](img/quickstart-py38c.png)](img/quickstart-py38c.png)

You can transfer XRP between your new accounts. Each account has its own fields and buttons.

<div align="center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/R5wyxVcokHo?si=V1omxO1ni4IrjcD-" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

### Send a Check for XRP

To send a check for XRP from the Standby account to the Operational account:

1. On the Standby (left) side of the form, enter the **Amount** of XRP to send.
2. Copy and paste the **Operational Account** field to the Standby **Destination** field.
3. Set the **Currency** to _XRP_.
4. Click **Send Check**.

[![Send Check Settings](img/quickstart-py39c.png)](img/quickstart-py39c.png)

### Send a Check for an Issued Currency

To send a check for an issued currency token from the Standby account to the Operational account:

1. On the Standby side of the form, enter the **Amount** of currency to send.
2. Copy and paste the **Operational Account** field to the Standby **Destination** field.
3. Copy the **Standby Account** field and paste the value in the **Issuer** field.
4. Enter the **Currency** code for your token.
5. Click **Send Check**.

[![Send Token Check Settings](img/quickstart-py40c.png)](img/quickstart-py40c.png)


### Get Checks

Click **Get Checks** to get a list of the current checks you have sent or received. To uniquely identify a check (for existence, when cashing a check), capture the **index** value for the check.

[![Get Checks with index highlighted](img/quickstart-py41c.png)](img/quickstart-py41c.png)

### Cash Check

To cash a check you have received:

1. Enter the **Check ID** (**index** value).
2. Enter the **Amount** you want to collect, up to the full amount of the check.
3. Enter the currency code.
   a. If you cashing a check for XRP, enter _XRP_ in the **Currency** field.
	    If you are cashing a check for an issued currency token:
	    1. Enter the **Issuer** of the token.
	    2. Enter the **Currency** code for the token.
4. Click **Cash Check**.

[![Cashed check results](img/quickstart-py42c.png)](img/quickstart-py42c.png)


### Get Balances

Click **Get Balances** to get a list of obligations and assets for each account.

[![Account Balances](img/quickstart-py43c.png)](img/quickstart-py43c.png)

### Cancel Check

To cancel a check you have previously sent to another account.

1. Enter the **Check ID** (**index** value).
2. Click **Cancel Check**.

[![Canceled check results](img/quickstart-py44c.png)](img/quickstart-py44c.png)


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
