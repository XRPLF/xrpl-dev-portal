---
html: py-transfer-nfts.html
parent: nfts-using-python.html
blurb: Use a Python test harness to create and accept NFT buy and sell offers.
labels:
  - Quickstart
  - Tokens
  - Non-fungible Tokens, NFTs
---

# Transfer NFTs Using Python

This example shows how to:

1. Create NFT Sell Offers.
2. Create NFT Buy Offers.
3. Accept NFT Sell Offers.
4. Accept NFT Buy Offers.
5. Get a list of offers for a particular NFT.
6. Cancel an offer.

[![Quickstart form with NFT transfer fields](img/quickstart-py15.png)](img/quickstart-py15.png)

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/quickstart/py/){.github-code-download} archive to try each of the samples in your own browser.

# Usage

## Get Accounts

1. Open `4.transfer-nfts.html` in a browser.
2. Choose your ledger instance (**Testnet** or **Devnet**).
3. Get test accounts.
    1. If you have existing test account seeds
        1. Paste account seed in the **Standby Seed** field.
        2. Click **Get Standby Account**.
        3. Click **Get Standby Account Info**.
        4. Paste account seed in the **Operational Seed** field.
        5. Click **Get Operational Account**.
        6. Click **Get Operational Account Info**.
    2. If you do not have test account seeds:
        1. Click **Get Standby Account**.
        2. Click **Get Standby Account Info**.
        3. Click **Get Operational Account**.
        4. Click **Get Get Op Account Info**.

[![Form with account information](img/quickstart-py16.png)](img/quickstart-py16.png)

## Create a Sell Offer

<div align="center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/tL3wIJXBt7Q?si=t3LYsxIVkZU7yAx_" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

To create a NFT sell offer:

1. Enter the **Amount** of the sell offer in drops (millionths of an XRP).
2. Enter the **NFT ID** of the NFT you want to sell.
3. Optionally, enter a **Destination** account, the only account that can accept the offer.
4. Optionally, enter a number of seconds until **Expiration**.
5. Click **Create Sell Offer**.
6. Click **Get Offers**.

The important piece of information in the response is the NFT Offer Index, labeled as `nft_offer_index`, which you use to accept the sell offer.

[![NFT Sell Offer](img/quickstart-py17.png)](img/quickstart-py17.png)

## Accept Sell Offer

Once a sell offer is available, another account can opt to accept the offer and buy the NFT.

To accept an available sell offer:

1. Enter the **NFT Offer Index** (labeled as `nft_offer_index` in the token offer results. This is different from the `NFTokenID`.)
2. Click **Accept Sell Offer**.
3. Click **Get Standby Account Info** and **Get Op Account Info** to update the XRP balances.
4. Click **Get NFTs** for each account to see that the NFT has moved from the Standby account to the Operational account.

[![Accept Sell Offer](img/quickstart-py18.png)](img/quickstart-py18.png)

## Create a Buy Offer

You can offer to buy an NFT from another account.

To create an offer to buy an NFT:

1. Enter the **Amount** of your offer.
2. Enter the **NFT ID**.
3. Enter the owner’s account string in the **Owner** field.
4. Optionally enter the number of seconds until **Expiration**.
5. Click **Create Buy Offer**.
6. On the Operational side, enter the **NFT ID**.
7. Click **Get Offers** to view the offer and copy the `nft_offer_index`.

[![NFT Buy Offer](img/quickstart-py19.png)](img/quickstart-py19.png)

## Accept a Buy Offer

To accept an offer to buy an NFT:

1. Enter the **NFT Offer Index** (the `nft_offer_index` of the NFT buy offer).
2. Click **Accept Buy Offer**.
3. Click **Get Standby Account Info** and **Get Op Account Info** to update the XRP balances.
4. Click **Get NFTs** for both accounts to see that the NFT has moved from the Operational account to the Standby account.

[![Accept Buy Offer](img/quickstart-py20.png)](img/quickstart-py20.png)

## Get Offers

To list the buy and sell offers associated with an NFT:

1. Enter the **NFT ID**.
2. Click **Get Offers**.

[![Get offers](img/quickstart-py21.png)](img/quickstart-py21.png)

## Cancel Offer

To cancel a buy or sell offer that you have created:

1. Enter the **NFT Offer Index**.
2. Click **Cancel Offer**.

[![Cancel offer](img/quickstart-py22.png)](img/quickstart-py22.png)

# Code Walkthrough

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/quickstart/py/){.github-code-download} archive to try each of the samples in your own browser.

## mod4.py
This module contains the new methods `create_sell_offer`, `create_buy_offer`, `accept_sell_offer`, `accept_buy_offer`, `get_offers`, and `cancel_offer`.

Import dependencies.

```python
import xrpl
import json
from xrpl.clients import JsonRpcClient
from xrpl.wallet import Wallet
from datetime import datetime
from datetime import timedelta
from xrpl.models.requests import NFTSellOffers
from xrpl.models.requests import NFTBuyOffers
from xrpl.models.transactions import NFTokenAcceptOffer
testnet_url = "https://s.altnet.rippletest.net:51234"
```

## Create Sell Offer

Pass the arguments _seed_, _amount_, _NFT ID_, _expiration_ (in seconds, optional), and _destination_ (optional).

```python
def create_sell_offer(seed, amount, nftoken_id, expiration, destination):
    """create_sell_offer"""
```

Get the owner wallet and create a client connection.

```python
    owner_wallet = Wallet.from_seed(seed)
    client = JsonRpcClient(testnet_url)
```

If there is an expiration value, convert the current date and time to Ripple time, then add the expiration value.

```python
    expiration_date = datetime.now()
    if expiration != '':
        expiration_date = xrpl.utils.datetime_to_ripple_time(expiration_date)
        expiration_date = expiration_date + int(expiration)
```

Define the sell offer transaction.

```python
    sell_offer_tx=xrpl.models.transactions.NFTokenCreateOffer(
        account=owner_wallet.address,
        nftoken_id=nftoken_id,
        amount=amount,
```

If the sale is designated for a specific destination account, include the `destination` argument.

```python
        destination=destination if destination != '' else None,
```

If the expiration date is present, include the `expiration` argument.

```python
        expiration=expiration_date if expiration != '' else None,
```
Set the `flags` value to _1_, indicating that this is a sell offer.

```python
        flags=1
    )
```

Submit the transaction.

```python
    reply=""
    try:
        response=xrpl.transaction.submit_and_wait(sell_offer_tx,client,owner_wallet)
        reply=response.result
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        reply=f"Submit failed: {e}"
```

Return the result.

```python
    return reply
```

## Accept Sell Offer

Pass the buyer's seed value and the NFT sell offer index.

```python
def accept_sell_offer(seed, offer_index):
    """accept_sell_offer"""
```

Get the wallet and a client instance.

```python
    buyer_wallet=Wallet.from_seed(seed)
    client=JsonRpcClient(testnet_url)
```

Define the accept offer transaction

```python
    accept_offer_tx=xrpl.models.transactions.NFTokenAcceptOffer(
       account=buyer_wallet.classic_address,
       nftoken_sell_offer=offer_index
    )
```

Sign and fill the transaction.

```python
    signed_tx=xrpl.transaction.safe_sign_and_autofill_transaction(
        accept_offer_tx, buyer_wallet, client)
```

Submit the transaction and report the results.

```python
    reply=""
    try:
        response=xrpl.transaction.submit_and_wait(accept_offer_tx,client,buyer_wallet)
        reply=response.result
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        reply=f"Submit failed: {e}"
    return reply
```

## Create Buy Offer

Pass the buyer _seed_,  _amount_, _NFT ID_, _owner_, _expiration_ (in seconds, optional), and _destination_ account (optional).

```python
def create_buy_offer(seed, amount, nft_id, owner, expiration, destination):
    """create_buy_offer"""
```

Get the buyer wallet and a client instance.

```python
    buyer_wallet=Wallet.from_seed(seed)
    client=JsonRpcClient(testnet_url)
```

If the _expiration_ value is present, get the current date and time, convert it to Ripple time, and add the _expiration_ value.

```python
    expiration_date=datetime.now()
    if (expiration!=''):
        expiration_date=xrpl.utils.datetime_to_ripple_time(expiration_date)
        expiration_date=expiration_date + int(expiration)
```

Define the buy offer transaction.

```python
    buy_offer_tx=xrpl.models.transactions.NFTokenCreateOffer(
        account=buyer_wallet.address,
        nftoken_id=nft_id,
        amount=amount,
        owner=owner,
```

IF the _expiration_ value is present, include the _expiration_ argument.

```python
        expiration=expiration_date if expiration!='' else None,
```

If the _destination_ value is present, include the _destination_ argument.

```python
        destination=destination if destination!='' else None,
```

Set the _flags_ value to _0_, indicating that this is a "buy" offer.

```python
        flags=0
    )
```

Submit the transaction and report the results.

```python
    reply=""
    try:
        response=xrpl.transaction.submit_and_wait(buy_offer_tx,client,buyer_wallet)
        reply=response.result
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        reply=f"Submit failed: {e}"
    return reply
```

## Accept Buy Offer

Pass the buyer's _seed_ value and the NFT _offer___index_.

```python
def accept_buy_offer(seed, offer_index):
    """accept_buy_offer"""
```

Get the buyer wallet and a client instance.

```python
    buyer_wallet=Wallet.from_seed(seed)
    client=JsonRpcClient(testnet_url)
```

Define the accept offer transaction.

```python
    accept_offer_tx=xrpl.models.transactions.NFTokenAcceptOffer(
       account=buyer_wallet.address,
       nftoken_buy_offer=offer_index
    )
```

Submit the transaction and report the results

```python
    reply=""
    try:
        response=xrpl.transaction.submit_and_wait(accept_offer_tx,client,buyer_wallet)
        reply=response.result
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        reply=f"Submit failed: {e}"
    return reply
```

## Get Offers

This is a request, rather than a transaction, so there is no need for a wallet.

Pass the _NFT ID_.

```python
def get_offers(nft_id):
    """get_offers"""
```

Create a client instance.

```python
    client=JsonRpcClient(testnet_url)
```

Define the request for buy offers.

```python
    offers=NFTBuyOffers(
        nft_id=nft_id
    )
```

Send the request and capture the response.

```python
    response=client.request(offers)
```

Create the _allOffers_ variable to accumulate the offer responses.

```python
    allOffers="Buy Offers:\n"+json.dumps(response.result, indent=4)
```

Define the request for sell offers.

```python
    offers=NFTSellOffers(
        nft_id=nft_id
    )
```

Send the request and capture the response.

```python
    response=client.request(offers)
```

Add the response to the _allOffers_ variable and return the results.

```python
    allOffers+="\n\nSell Offers:\n"+json.dumps(response.result, indent=4)
    return allOffers
```

## Cancel Offer

The creator of an offer can cancel it at any time before it is accepted. Anyone can cancel and offer if its expiration data has expired.

Pass the seed and the NFT Offer ID to be canceled.

```python
def cancel_offer(seed, nftoken_offer_ids):
    """cancel_offer"""
```

Get the wallet and a client instance.

```python
    owner_wallet=Wallet(seed, sequence=16237283)
    client=JsonRpcClient(testnet_url)
```

The `nftoken_offers` parameter is an array, rather than a single ID. You can revise the code to accept several offer IDs at one time. Here, the value is added to a new array variable.

```python
    tokenOfferIDs=[nftoken_offer_ids]
```

Define the cancel offer transaction.

```python
    nftSellOffers="No sell offers"
    cancel_offer_tx=xrpl.models.transactions.NFTokenCancelOffer(
				account=owner_wallet.classic_address,
				nftoken_offers=tokenOfferIDs
		)
```

Submit the transaction and return the result.

```python
    reply=""
    try:
        response=xrpl.transaction.submit_and_wait(cancel_offer_tx,client,owner_wallet)
        reply=response.result
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        reply=f"Submit failed: {e}"
    return reply
```

## lesson4-transfer-tokens.py

This module builds on `lesson3-mint-token.py`. Changes are noted below.

```python
import tkinter as tk
import xrpl
import json

from mod1 import get_account, get_account_info, send_xrp
from mod2 import (
    create_trust_line,
    send_currency,
    get_balance,
    configure_account,
)
from mod3 import (
    mint_token,
    get_tokens,
    burn_token,
)
```

Import new methods from `mod4.py`.

```python
from mod4 import (
    create_sell_offer,
    create_buy_offer,
    get_offers,
    cancel_offer,
    accept_sell_offer,
    accept_buy_offer,
)

```

Add handlers for creating, retrieving, and canceling buy and sell offers.

```python
# Module 4 Handlers

def standby_create_sell_offer():
    results = create_sell_offer(
        ent_standby_seed.get(),
        ent_standby_amount.get(),
        ent_standby_nft_id.get(),
        ent_standby_expiration.get(),
        ent_standby_destination.get()
    )
    text_standby_results.delete("1.0", tk.END)
    text_standby_results.insert("1.0", json.dumps(results, indent=4))
def standby_accept_sell_offer():
    results = accept_sell_offer (
        ent_standby_seed.get(),
        ent_standby_nft_offer_index.get()
    )
    text_standby_results.delete("1.0", tk.END)
    text_standby_results.insert("1.0", json.dumps(results, indent=4))
def standby_create_buy_offer():
    results = create_buy_offer(
        ent_standby_seed.get(),
        ent_standby_amount.get(),
        ent_standby_nft_id.get(),
        ent_standby_owner.get(),
        ent_standby_expiration.get(),
        ent_standby_destination.get()
    )
    text_standby_results.delete("1.0", tk.END)
    text_standby_results.insert("1.0", json.dumps(results, indent=4))
def standby_accept_buy_offer():
    results = accept_buy_offer (
        ent_standby_seed.get(),
        ent_standby_nft_offer_index.get()
    )
    text_standby_results.delete("1.0", tk.END)
    text_standby_results.insert("1.0", json.dumps(results, indent=4))
def standby_get_offers():
    results = get_offers(ent_standby_nft_id.get())
    text_standby_results.delete("1.0", tk.END)
    text_standby_results.insert("1.0", results)
def standby_cancel_offer():
    results = cancel_offer(
        ent_standby_seed.get(),
        ent_standby_nft_offer_index.get()
    )
    text_standby_results.delete("1.0", tk.END)
    text_standby_results.insert("1.0", json.dumps(results, indent=4))    
def op_create_sell_offer():
    results = create_sell_offer(
        ent_operational_seed.get(),
        ent_operational_amount.get(),
        ent_operational_nft_id.get(),
        ent_operational_expiration.get(),
        ent_operational_destination.get()
    )
    text_operational_results.delete("1.0", tk.END)
    text_operational_results.insert("1.0", json.dumps(results, indent=4))
def op_accept_sell_offer():
    results = accept_sell_offer (
        ent_operational_seed.get(),
        ent_operational_nft_offer_index.get()
    )
    text_operational_results.delete("1.0", tk.END)
    text_operational_results.insert("1.0", json.dumps(results, indent=4))
def op_create_buy_offer():
    results = create_buy_offer(
        ent_operational_seed.get(),
        ent_operational_amount.get(),
        ent_operational_nft_id.get(),
        ent_operational_owner.get(),
        ent_operational_expiration.get(),
        ent_operational_destination.get()
    )
    text_operational_results.delete("1.0", tk.END)
    text_operational_results.insert("1.0", json.dumps(results, indent=4))  
def op_accept_buy_offer():
    results = accept_buy_offer (
        ent_operational_seed.get(),
        ent_operational_nft_offer_index.get()
    )
    text_operational_results.delete("1.0", tk.END)
    text_operational_results.insert("1.0", json.dumps(results, indent=4))
def op_get_offers():
    results = get_offers(ent_operational_nft_id.get())
    text_operational_results.delete("1.0", tk.END)
    text_operational_results.insert("1.0", results)
def op_cancel_offer():
    results = cancel_offer(
        ent_operational_seed.get(),
        ent_operational_nft_offer_index.get()
    )
    text_operational_results.delete("1.0", tk.END)
    text_operational_results.insert("1.0", json.dumps(results, indent=4))    


# Module 3 Handlers

def standby_mint_token():
    results = mint_token(
        ent_standby_seed.get(),
        ent_standby_uri.get(),
        ent_standby_flags.get(),
        ent_standby_transfer_fee.get(),
        ent_standby_taxon.get()
    )
    text_standby_results.delete("1.0", tk.END)
    text_standby_results.insert("1.0", json.dumps(results, indent=4))
def standby_get_tokens():
    results = get_tokens(ent_standby_account.get())
    text_standby_results.delete("1.0", tk.END)
    text_standby_results.insert("1.0", json.dumps(results, indent=4))
def standby_burn_token():
    results = burn_token(
        ent_standby_seed.get(),
        ent_standby_nft_id.get()
    )
    text_standby_results.delete("1.0", tk.END)
    text_standby_results.insert("1.0", json.dumps(results, indent=4))
def operational_mint_token():
    results = mint_token(
        ent_operational_seed.get(),
        ent_operational_uri.get(),
        ent_operational_flags.get(),
        ent_operational_transfer_fee.get(),
        ent_operational_taxon.get()
    )
    text_operational_results.delete("1.0", tk.END)
    text_operational_results.insert("1.0", json.dumps(results, indent=4))
def operational_get_tokens():
    results = get_tokens(ent_operational_account.get())
    text_operational_results.delete("1.0", tk.END)
    text_operational_results.insert("1.0", json.dumps(results, indent=4))
def operational_burn_token():
    results = burn_token(
        ent_operational_seed.get(),
        ent_operational_nft_id.get()
    )
    text_operational_results.delete("1.0", tk.END)
    text_operational_results.insert("1.0", json.dumps(results, indent=4))

# Module 2 Handlers

def standby_create_trust_line():
    results = create_trust_line(ent_standby_seed.get(),
        ent_standby_destination.get(),
        ent_standby_currency.get(),
        ent_standby_amount.get())
    text_standby_results.delete("1.0", tk.END)
    text_standby_results.insert("1.0", json.dumps(results, indent=4))
def standby_send_currency():
    results = send_currency(ent_standby_seed.get(),
        ent_standby_destination.get(),
        ent_standby_currency.get(),
        ent_standby_amount.get())
    text_standby_results.delete("1.0", tk.END)
    text_standby_results.insert("1.0", json.dumps(results, indent=4))
def standby_configure_account():
    results = configure_account(
        ent_standby_seed.get(),
        standbyRippling)
    text_standby_results.delete("1.0", tk.END)
    text_standby_results.insert("1.0", json.dumps(results, indent=4))
def operational_create_trust_line():
    results = create_trust_line(ent_operational_seed.get(),
        ent_operational_destination.get(),
        ent_operational_currency.get(),
        ent_operational_amount.get())
    text_operational_results.delete("1.0", tk.END)
    text_operational_results.insert("1.0", json.dumps(results, indent=4))
def operational_send_currency():
    results = send_currency(ent_operational_seed.get(),
        ent_operational_destination.get(),
        ent_operational_currency.get(),
        ent_operational_amount.get())
    text_operational_results.delete("1.0", tk.END)
    text_operational_results.insert("1.0", json.dumps(results, indent=4))
def operational_configure_account():
    results = configure_account(
        ent_operational_seed.get(),
        operationalRippling)
    text_operational_results.delete("1.0", tk.END)
    text_operational_results.insert("1.0", json.dumps(results, indent=4))
def get_balances():
    results = get_balance(ent_operational_account.get(), ent_standby_account.get())
    text_standby_results.delete("1.0", tk.END)
    text_standby_results.insert("1.0", json.dumps(results, indent=4))    
    results = get_balance(ent_standby_account.get(), ent_operational_account.get())
    text_operational_results.delete("1.0", tk.END)
    text_operational_results.insert("1.0", json.dumps(results, indent=4))    

# Module 1 Handlers
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
    response = send_xrp(ent_operational_seed.get(),ent_operational_amount.get(), ent_operational_destination.get())
    text_operational_results.delete("1.0", tk.END)
    text_operational_results.insert("1.0",json.dumps(response.result,indent=4))
    get_standby_account_info()
    get_operational_account_info()

# Create a new window with the title "Quickstart Module 4"
window = tk.Tk()
window.title("Quickstart Module 4")

standbyRippling = tk.BooleanVar()
operationalRippling = tk.BooleanVar()

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
lbl_standby_currency = tk.Label(master=frm_form, text="Currency")
ent_standby_currency = tk.Entry(master=frm_form, width=50)
cb_standby_allow_rippling = tk.Checkbutton(master=frm_form, text="Allow Rippling", variable=standbyRippling, onvalue=True, offvalue=False)
lbl_standby_uri = tk.Label(master=frm_form, text="NFT URI")
ent_standby_uri = tk.Entry(master=frm_form, width=50)
lbl_standby_flags = tk.Label(master=frm_form, text="Flags")
ent_standby_flags = tk.Entry(master=frm_form, width=50)
lbl_standby_transfer_fee = tk.Label(master=frm_form, text="Transfer Fee")
ent_standby_transfer_fee = tk.Entry(master=frm_form, width="50")
lbl_standby_taxon = tk.Label(master=frm_form, text="Taxon")
ent_standby_taxon = tk.Entry(master=frm_form, width="50")
lbl_standby_nft_id = tk.Label(master=frm_form, text="NFT ID")
ent_standby_nft_id = tk.Entry(master=frm_form, width="50")
```

Add fields for the *NFT Offer Index*, *Owner*, *Expiration*, and *Transfer Fee*.

```python
lbl_standby_nft_offer_index = tk.Label(master=frm_form, text="NFT Offer Index")
ent_standby_nft_offer_index = tk.Entry(master=frm_form, width="50")
lbl_standby_owner = tk.Label(master=frm_form, text="Owner")
ent_standby_owner = tk.Entry(master=frm_form, width="50")
lbl_standby_expiration = tk.Label(master=frm_form, text="Expiration")
ent_standby_expiration = tk.Entry(master=frm_form, width="50")
lbl_standby_transfer_fee = tk.Label(master=frm_form, text="Transfer Fee")
ent_standby_transfer_fee = tk.Entry(master=frm_form, width="50")
lbl_standby_results = tk.Label(master=frm_form,text='Results')
text_standby_results = tk.Text(master=frm_form, height = 20, width = 65)

# Place field in a grid.
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
lbl_standby_currency.grid(row=6, column=0, sticky="e")
ent_standby_currency.grid(row=6, column=1)
cb_standby_allow_rippling.grid(row=7,column=1, sticky="w")
lbl_standby_uri.grid(row=8, column=0, sticky="e")
ent_standby_uri.grid(row=8, column=1, sticky="w")
lbl_standby_flags.grid(row=9, column=0, sticky="e")
ent_standby_flags.grid(row=9, column=1, sticky="w")
lbl_standby_transfer_fee.grid(row=10, column=0, sticky="e")
ent_standby_transfer_fee.grid(row=10, column=1, sticky="w")
lbl_standby_taxon.grid(row=11, column=0, sticky="e")
ent_standby_taxon.grid(row=11, column=1, sticky="w")
lbl_standby_nft_id.grid(row=12, column=0, sticky="e")
ent_standby_nft_id.grid(row=12, column=1, sticky="w")
lbl_standby_nft_offer_index.grid(row=13, column=0, sticky="ne")
ent_standby_nft_offer_index.grid(row=13, column=1, sticky="w")
lbl_standby_owner.grid(row=14, column=0, sticky="ne")
ent_standby_owner.grid(row=14, column=1, sticky="w")
lbl_standby_expiration.grid(row=15, column=0, sticky="ne")
ent_standby_expiration.grid(row=15, column=1, sticky="w")
lbl_standby_results.grid(row=17, column=0, sticky="ne")
text_standby_results.grid(row=17, column=1, sticky="nw")

cb_standby_allow_rippling.select()

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
lbl_operational_currency = tk.Label(master=frm_form, text="Currency")
ent_operational_currency = tk.Entry(master=frm_form, width=50)
cb_operational_allow_rippling = tk.Checkbutton(master=frm_form, text="Allow Rippling", variable=operationalRippling, onvalue=True, offvalue=False)
lbl_operational_uri = tk.Label(master=frm_form, text="NFT URI")
ent_operational_uri = tk.Entry(master=frm_form, width=50)
lbl_operational_flags = tk.Label(master=frm_form, text="Flags")
ent_operational_flags = tk.Entry(master=frm_form, width=50)
lbl_operational_transfer_fee = tk.Label(master=frm_form, text="Transfer Fee")
ent_operational_transfer_fee = tk.Entry(master=frm_form, width="50")
lbl_operational_taxon = tk.Label(master=frm_form, text="Taxon")
ent_operational_taxon = tk.Entry(master=frm_form, width="50")
lbl_operational_nft_id = tk.Label(master=frm_form, text="NFT ID")
ent_operational_nft_id = tk.Entry(master=frm_form, width="50")
```

Add fields for *NFT Offer Index*, *Owner*, *Expiration*, and *Transfer Fee*.

```python
lbl_operational_nft_offer_index = tk.Label(master=frm_form, text="NFT Offer Index")
ent_operational_nft_offer_index = tk.Entry(master=frm_form, width="50")
lbl_operational_owner = tk.Label(master=frm_form, text="Owner")
ent_operational_owner = tk.Entry(master=frm_form, width="50")
lbl_operational_expiration = tk.Label(master=frm_form, text="Expiration")
ent_operational_expiration = tk.Entry(master=frm_form, width="50")
lbl_operational_transfer_fee = tk.Label(master=frm_form, text="Transfer Fee")
ent_operational_transfer_fee = tk.Entry(master=frm_form, width="50")
lbl_operational_results = tk.Label(master=frm_form,text="Results")
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
lbl_operational_currency.grid(row=6, column=4, sticky="e")
ent_operational_currency.grid(row=6, column=5)
cb_operational_allow_rippling.grid(row=7,column=5, sticky="w")
lbl_operational_uri.grid(row=8, column=4, sticky="e")
ent_operational_uri.grid(row=8, column=5, sticky="w")
lbl_operational_flags.grid(row=9, column=4, sticky="e")
ent_operational_flags.grid(row=9, column=5, sticky="w")
lbl_operational_transfer_fee.grid(row=10, column=4, sticky="e")
ent_operational_transfer_fee.grid(row=10, column=5, sticky="w")
lbl_operational_taxon.grid(row=11, column=4, sticky="e")
ent_operational_taxon.grid(row=11, column=5, sticky="w")
lbl_operational_nft_id.grid(row=12, column=4, sticky="e")
ent_operational_nft_id.grid(row=12, column=5, sticky="w")
lbl_operational_nft_offer_index.grid(row=13, column=4, sticky="ne")
ent_operational_nft_offer_index.grid(row=13, column=5, sticky="w")
lbl_operational_owner.grid(row=14, column=4, sticky="ne")
ent_operational_owner.grid(row=14, column=5, sticky="w")
lbl_operational_expiration.grid(row=15, column=4, sticky="ne")
ent_operational_expiration.grid(row=15, column=5, sticky="w")
lbl_operational_results.grid(row=17, column=4, sticky="ne")
text_operational_results.grid(row=17, column=5, sticky="nw")

cb_operational_allow_rippling.select()

#############################################
## Buttons ##################################
#############################################

# Create the Standby Account Buttons
btn_get_standby_account = tk.Button(master=frm_form, text="Get Standby Account",
                                    command = get_standby_account)
btn_get_standby_account.grid(row=0, column=2, sticky = "nsew")
btn_get_standby_account_info = tk.Button(master=frm_form,
                                         text="Get Standby Account Info",
                                         command = get_standby_account_info)
btn_get_standby_account_info.grid(row=1, column=2, sticky = "nsew")
btn_standby_send_xrp = tk.Button(master=frm_form, text="Send XRP >",
                                 command = standby_send_xrp)
btn_standby_send_xrp.grid(row=2, column = 2, sticky = "nsew")
btn_standby_create_trust_line = tk.Button(master=frm_form,
                                         text="Create Trust Line",
                                         command = standby_create_trust_line)
btn_standby_create_trust_line.grid(row=4, column=2, sticky = "nsew")
btn_standby_send_currency = tk.Button(master=frm_form, text="Send Currency >",
                                      command = standby_send_currency)
btn_standby_send_currency.grid(row=5, column=2, sticky = "nsew")
btn_standby_send_currency = tk.Button(master=frm_form, text="Get Balances",
                                      command = get_balances)
btn_standby_send_currency.grid(row=6, column=2, sticky = "nsew")
btn_standby_configure_account = tk.Button(master=frm_form,
                                          text="Configure Account",
                                          command = standby_configure_account)
btn_standby_configure_account.grid(row=7,column=0, sticky = "nsew")
btn_standby_mint_token = tk.Button(master=frm_form, text="Mint NFT",
                                   command = standby_mint_token)
btn_standby_mint_token.grid(row=8, column=2, sticky="nsew")
btn_standby_get_tokens = tk.Button(master=frm_form, text="Get NFTs",
                                   command = standby_get_tokens)
btn_standby_get_tokens.grid(row=9, column=2, sticky="nsew")
btn_standby_burn_token = tk.Button(master=frm_form, text="Burn NFT",
                                   command = standby_burn_token)
btn_standby_burn_token.grid(row=10, column=2, sticky="nsew")
```

Add buttons for transferring NFTs.

```python
btn_standby_create_sell_offer = tk.Button(master=frm_form, text="Create Sell Offer",
                                          command = standby_create_sell_offer)
btn_standby_create_sell_offer.grid(row=11, column=2, sticky="nsew")
btn_standby_accept_sell_offer = tk.Button(master=frm_form, text="Accept Sell Offer",
                                          command = standby_accept_sell_offer)
btn_standby_accept_sell_offer.grid(row=12, column=2, sticky="nsew")
btn_standby_create_buy_offer = tk.Button(master=frm_form, text="Create Buy Offer",
                                          command = standby_create_buy_offer)
btn_standby_create_buy_offer.grid(row=13, column=2, sticky="nsew")
btn_standby_accept_buy_offer = tk.Button(master=frm_form, text="Accept Buy Offer",
                                          command = standby_accept_buy_offer)
btn_standby_accept_buy_offer.grid(row=14, column=2, sticky="nsew")
btn_standby_get_offers = tk.Button(master=frm_form, text="Get Offers",
                                          command = standby_get_offers)
btn_standby_get_offers.grid(row=15, column=2, sticky="nsew")
btn_standby_cancel_offer = tk.Button(master=frm_form, text="Cancel Offer",
                                          command = standby_cancel_offer)
btn_standby_cancel_offer.grid(row=16, column=2, sticky="nsew")


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
btn_op_create_trust_line = tk.Button(master=frm_form, text="Create Trust Line",
                                    command = operational_create_trust_line)
btn_op_create_trust_line.grid(row=4, column=3, sticky = "nsew")
btn_op_send_currency = tk.Button(master=frm_form, text="< Send Currency",
                                 command = operational_send_currency)
btn_op_send_currency.grid(row=5, column=3, sticky = "nsew")
btn_op_get_balances = tk.Button(master=frm_form, text="Get Balances",
                                command = get_balances)
btn_op_get_balances.grid(row=6, column=3, sticky = "nsew")
btn_op_configure_account = tk.Button(master=frm_form, text="Configure Account",
                                     command = operational_configure_account)
btn_op_configure_account.grid(row=7,column=4, sticky = "nsew")
btn_op_mint_token = tk.Button(master=frm_form, text="Mint NFT",
                              command = operational_mint_token)
btn_op_mint_token.grid(row=8, column=3, sticky="nsew")
btn_op_get_tokens = tk.Button(master=frm_form, text="Get NFTs",
                              command = operational_get_tokens)
btn_op_get_tokens.grid(row=9, column=3, sticky="nsew")
btn_op_burn_token = tk.Button(master=frm_form, text="Burn NFT",
                              command = operational_burn_token)
btn_op_burn_token.grid(row=10, column=3, sticky="nsew")
```

Add buttons for transferring NFTs. 

```python
btn_op_create_sell_offer = tk.Button(master=frm_form, text="Create Sell Offer",
                                          command = op_create_sell_offer)
btn_op_create_sell_offer.grid(row=11, column=3, sticky="nsew")
btn_op_accept_sell_offer = tk.Button(master=frm_form, text="Accept Sell Offer",
                                          command = op_accept_sell_offer)
btn_op_accept_sell_offer.grid(row=12, column=3, sticky="nsew")
btn_op_create_buy_offer = tk.Button(master=frm_form, text="Create Buy Offer",
                                          command = op_create_buy_offer)
btn_op_create_buy_offer.grid(row=13, column=3, sticky="nsew")
btn_op_accept_buy_offer = tk.Button(master=frm_form, text="Accept Buy Offer",
                                          command = op_accept_buy_offer)
btn_op_accept_buy_offer.grid(row=14, column=3, sticky="nsew")
btn_op_get_offers = tk.Button(master=frm_form, text="Get Offers",
                                          command = op_get_offers)
btn_op_get_offers.grid(row=15, column=3, sticky="nsew")
btn_op_cancel_offer = tk.Button(master=frm_form, text="Cancel Offer",
                                          command = op_cancel_offer)
btn_op_cancel_offer.grid(row=16, column=3, sticky="nsew")

# Start the application
window.mainloop()
```