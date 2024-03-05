---
html: py-batch-minting.html
parent: nfts-using-python.html
seo:
    description: Mint multiple NFTs with the press of a button.
labels:
  - Accounts
  - Quickstart
  - NFTs
  - XRP
---

# Batch Mint NFTs

You can create an application that mints multiple NFTs at one time, using a `for` loop to send one transaction after another.

A best practice is to use `Tickets` to reserve the transaction sequence numbers. If you create an application that creates NFTs without using tickets, if any transaction fails for any reason, the application stops with an error. If you use tickets, the application continues to send transactions, and you can look into the reason for any individual failures afterward.

[![Batch Mint](/docs/img/quickstart-py36.png)](/docs/img/quickstart-py36.png)

## Usage

You can download or clone the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/py/)<!-- {.github-code-download} --> to try the sample in your own browser.

## Get an Account

1. Open and run `lesson7-batch-minting.py`.
2. Get a test account.
    1. If you want to use an existing account seed:
        1. Paste the account seed in the **Standby Seed** field.
        2. Click **Get Standby Account**.
    2. If you do not want to use an existing account seed, just click **Get Standby Account**.
3. Click **Get Standby Account Info** to get the current XRP balance.


## Batch Mint NFTs

<div align="center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/NjEqEWcqhwc?si=E8ws75gts_7TtOuU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

This example lets you mint multiple NFTs for a single unique item. The NFT might represent "prints" of an original artwork, tickets to an event, or another limited set of unique items. 

To batch mint non-fungible token objects:

1. Enter the **NFT URI**. This is a URI that points to the data or metadata associated with the NFT object. You can use this sample URI if you do not have one of your own: ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi.
2. Set the **Flags** field. For testing purposes, we recommend setting the value to _8_. This sets the _tsTransferable_ flag, meaning that the NFT object can be transferred to another account. Otherwise, the NFT object can only be transferred back to the issuing account. See [NFTokenMint](../../../references/protocol/transactions/types/nftokenmint.md) for available NFT minting flags.
3. Enter the **Transfer Fee**, a percentage of the proceeds that the original creator receives from future sales of the NFT. This is a value of 0-50000 inclusive, allowing transfer fees between 0.000% and 50.000% in increments of 0.001%. If you do not set the **Flags** field to allow the NFT to be transferrable, set this field to 0.
4. Enter the **Taxon** for the NFT. If you do not have a need for the Taxon field, set this value to 0.
5. Enter an **NFT Count** of up to 200 NFTs to create in one batch.
6. Click **Batch Mint NFTs**.

## Get Batch NFTs

Click **Get Batch NFTs** to get the current list of NFTs for your account.

The difference between this function and the `getTokens()` function used earlier is that it allows for larger lists of tokens, sending multiple requests if the tokens exceed the number of objects allowed in a single request.

# Code Walkthrough

You can download or clone the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/py/)<!-- {.github-code-download} --> to try each of the samples locally.

Import dependencies and define the testnet_url variable. 

```python
import xrpl
from xrpl.clients import JsonRpcClient
from xrpl.wallet import Wallet
from xrpl.models.requests import AccountNFTs

testnet_url = "https://s.altnet.rippletest.net:51234"
```

## Batch Mint

Pass the values `seed`, `uri`, `flags`, `transfer_fee`, `taxon`, and `count`.

```python
def batch_mint(seed, uri, flags, transfer_fee, taxon, count):
    """batch_mint"""
```

Get the account wallet and a client instance.

```python
    wallet=Wallet.from_seed(seed)
    client=JsonRpcClient(testnet_url)
```

Request the full account info.

```python    
    acct_info = xrpl.models.requests.account_info.AccountInfo(
        account=wallet.classic_address,
        ledger_index='validated'
    )
    get_seq_request = client.request(acct_info)

```    

Parse the current sequence value.

```python
    current_sequence=get_seq_request.result['account_data']['Sequence']
```

Create a transaction to create tickets, starting at the current sequence number.

```python
    ticket_tx=xrpl.models.transactions.TicketCreate(
        account=wallet.address,
        ticket_count=int(count),
        sequence=current_sequence  
    )
```

Submit the ticket transaction and wait for the result.

```python
    response=xrpl.transaction.submit_and_wait(ticket_tx,client,wallet)
```

Create a request to obtain the next ticket number.

```python
    ticket_numbers_req=xrpl.models.requests.AccountObjects(
        account=wallet.address,
        type='ticket'
    )
    ticket_response=client.request(ticket_numbers_req)
```

Create the `tickets` variable to store an array of tickets.

```python
    tickets=[int(0)] * int(count)
    acct_objs= ticket_response.result['account_objects']
```

Create an array of ticket numbers.

```python
    for x in range(int(count)):
        tickets[x] = acct_objs[x]['TicketSequence']
```

Initialize variables to be used in the mint loop.

```python
    reply=""
    create_count=0
```

Use a `for` loop to send repeated mint requests, using the `ticket_sequence` field to uniquely identify the mint transactions.

```python
    for x in range(int(count)):
        mint_tx=xrpl.models.transactions.NFTokenMint(
            account=wallet.classic_address,
            uri=xrpl.utils.str_to_hex(uri),
            flags=int(flags),
            transfer_fee=int(transfer_fee),
            ticket_sequence=tickets[x],
            sequence=0,
            nftoken_taxon=int(taxon)
        )
```
Submit each transaction and report the results.

```python
        try:
            response=xrpl.transaction.submit_and_wait(mint_tx,client,
                wallet)
            create_count+=1 
        except xrpl.transaction.XRPLReliableSubmissionException as e:
            reply+=f"Submit failed: {e}\n"
    reply+=str(create_count)+' NFTs generated.'
    return reply
```

### Get Batch

This version of `getTokens()` allows for a larger set of NFTs by watching for a `marker` at the end of each batch of NFTs. Subsequent requests get the next batch of NFTs starting at the previous marker, until all NFTs are retrieved.

```python
def get_batch(seed, account):
    """get_batch"""
```

Get a client instance. Since this is a request for publicly available information, no wallet is required.

```python
    client=JsonRpcClient(testnet_url)
```

Define the request for account NFTs. Set a return limit of 400 objects.

```python
    acct_nfts=AccountNFTs(
        account=account,
        limit=400
    )
```

Send the request.

```python
    response=client.request(acct_nfts)
```

Capture the result in the _responses_ variable.

```python
    responses=response.result
```

While there is a _marker_ value in the response, continue to define and send requests for 400 account NFTs at a time. Capture the _result_ from each request in the _responses_ variable.

```python
    while(acct_nfts.marker):
        acct_nfts=AccountNFTs(
            account=account,
            limit=400,
            marker=acct_nfts.marker
        )
        response=client.request(acct_nfts)
        responses+=response.result
```

Return the _responses_ variable.

```python
    return responses
```

## lesson7-batch-minting.py

This form is based on earlier examples, with unused fields, handlers, and buttons removed. Additions are highlighted below.

```python
import tkinter as tk
import xrpl
import json

from mod1 import get_account, get_account_info
```

Import dependencies from `mod7.py`.

```python
from mod7 import batch_mint, get_batch

```

Add Module 7 handlers.

```python

def batch_mint_nfts():
    results = batch_mint(
        ent_standby_seed.get(),
        ent_standby_uri.get(),
        ent_standby_flags.get(),
        ent_standby_transfer_fee.get(),
        ent_standby_taxon.get(),
        ent_standby_nft_count.get()
    )
    text_standby_results.delete("1.0", tk.END)
    text_standby_results.insert("1.0", json.dumps(results, indent=4))

def standby_get_batch_nfts():
    results = get_batch(
        ent_standby_seed.get(),
        ent_standby_account.get()
    )
    text_standby_results.delete("1.0", tk.END)
    text_standby_results.insert("1.0", json.dumps(results, indent=4))

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
```

Rename the window for Module 7.

```python
# Create a new window with the title "Python Module - Batch Minting"
window = tk.Tk()
window.title("Python Module - Batch Minting")



# Form frame
frm_form = tk.Frame(relief=tk.SUNKEN, borderwidth=3)
frm_form.pack()

# Create the Label and Entry widgets for "Standby Account"
lbl_standy_seed = tk.Label(master=frm_form, text="Standby Seed")
ent_standby_seed = tk.Entry(master=frm_form, width=50)
lbl_standby_account = tk.Label(master=frm_form, text="Standby Account")
ent_standby_account = tk.Entry(master=frm_form, width=50)
lbl_standby_balance = tk.Label(master=frm_form, text="XRP Balance")
ent_standby_balance = tk.Entry(master=frm_form, width=50)
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
lbl_standby_nft_offer_index = tk.Label(master=frm_form, text="NFT Offer Index")
ent_standby_nft_offer_index = tk.Entry(master=frm_form, width="50")
```

Add the **NFT Count** field for batch minting.

```python
lbl_standby_nft_count=tk.Label(master=frm_form, text="NFT Count")
ent_standby_nft_count=tk.Entry(master=frm_form, width="50")
lbl_standby_results = tk.Label(master=frm_form,text="Results")
text_standby_results = tk.Text(master=frm_form, height = 20, width = 65)

# Place field in a grid.
lbl_standy_seed.grid(row=0, column=0, sticky="w")
ent_standby_seed.grid(row=0, column=1)
lbl_standby_account.grid(row=2, column=0, sticky="e")
ent_standby_account.grid(row=2, column=1)
lbl_standby_balance.grid(row=5, column=0, sticky="e")
ent_standby_balance.grid(row=5, column=1)
lbl_standby_uri.grid(row=8, column=0, sticky="e")
ent_standby_uri.grid(row=8, column=1, sticky="w")
lbl_standby_flags.grid(row=9, column=0, sticky="e")
ent_standby_flags.grid(row=9, column=1, sticky="w")
lbl_standby_transfer_fee.grid(row=10, column=0, sticky="e")
ent_standby_transfer_fee.grid(row=10, column=1, sticky="w")
lbl_standby_taxon.grid(row=11, column=0, sticky="e")
ent_standby_taxon.grid(row=11, column=1, sticky="w")
```

Place the **NFT Count** field in the grid.

```python
lbl_standby_nft_count.grid(row=13, column=0, sticky="e")
ent_standby_nft_count.grid(row=13, column=1, sticky="w")
lbl_standby_results.grid(row=14, column=0, sticky="ne")
text_standby_results.grid(row=14, column=1, sticky="nw")

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
```

Add the **Batch Mint NFTs** and **Get Batch NFTs** buttons.

```python
btn_standby_batch_mint = tk.Button(master=frm_form,
                                         text="Batch Mint NFTs",
                                         command = standby_batch_mint)
btn_standby_batch_mint.grid(row=5, column=2, sticky = "nsew")
btn_standby_get_batch_nfts = tk.Button(master=frm_form,
                                         text="Get Batch NFTs",
                                         command = standby_get_batch_nfts)
btn_standby_get_batch_nfts.grid(row=8, column=2, sticky = "nsew")
# Start the application
window.mainloop()

```
