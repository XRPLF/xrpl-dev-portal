---
html: py-mint-and-burn-nfts.html
parent: nfts-using-python.html
seo:
    description: Mint and burn NFTs.
labels:
  - Quickstart
  - Tokens
  - Non-fungible tokens, NFTs
---

# Mint and Burn NFTs Using Python

This example shows how to:

1. Mint new Non-fungible Tokens (NFTs).
2. Get a list of existing NFTs.
3. Delete (Burn) an NFT.

[![Quickstart 3 interface with mint NFT fields](/docs/img/quickstart-py10.png)](/docs/img/quickstart-py10.png)

# Usage

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/py/)<!-- {.github-code-download} --> archive to try the sample in your own browser.

## Get Accounts

1. Open and run `lesson3-mint-token.py`.
2. Get test accounts.
    1. If you have existing Testnet account seeds:
        1. Paste the standby account seed in the **Standby Seed** field.
        2. Click **Get Standby Account**.
        3. Paste the operational account seed in the **Operational Seed** field.
        4. Click **Get Operational Account**.
    2. If you do not have existing Testnet accounts:
        1. Click **Get New Standby Account**.
        2. Click **Get New Operational Account**.
    3. Click **Get Standby Account Info**.
    4. Click **Get Op Account Info**.

[![Get accounts](/docs/img/quickstart-py11.png)](/docs/img/quickstart-py11.png)

## Mint an NFT

<div align="center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/StOLO9Bx9n8?si=IgMtoYRQlheaXzsG" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

To mint a non-fungible token object:

1. Set the **Flags** field. For testing purposes, we recommend setting the value to _8_. This sets the _tsTransferable_ flag, meaning that the NFT can be transferred to another account. Otherwise, the NFT can only be transferred back to the issuing account. See [NFToken Mint](/docs/references/protocol/transactions/types/nftokenmint/#nftokenmint-flags) for information about all of the available flags for minting NFTs.
2. Enter the **NFT URI**. This is a URI that points to the data or metadata associated with the NFT. You can use the sample URI provided if you do not have one of your own.
3. Enter the **Transfer Fee**, a percentage of the proceeds from future sales of the NFT that will be returned to the original creator. This is a value of 0-50000 inclusive, allowing transfer rates between 0.000% and 50.000% in increments of 0.001%. If you do not set the **Flags** field to allow the NFT to be transferrable, set this field to 0.
4. Optionally a **Taxon** value as an integer. If you choose not to use a taxon, enter _0_.
4. Click **Mint NFT**.

[![Mint NFT fields](/docs/img/quickstart-py12.png)](/docs/img/quickstart-py12.png)


## Get Tokens

Click **Get NFTs** to get a list of NFTs owned by the account.

[![Get NFTs](/docs/img/quickstart-py13.png)](/docs/img/quickstart-py13.png)

## Burn a Token

The current owner of an NFT can always destroy (or _burn_) an NFT.

To permanently destroy an NFT:

1. Enter the **Token ID**.
2. Click **Burn NFT**.

[![Burn NFTs](/docs/img/quickstart-py14.png)](/docs/img/quickstart-py14.png)

# Code Walkthrough

You can download the [Quickstart Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/py/)<!-- {.github-code-download} --> archive to examine the code samples.

## mod3.py

This module contains the new methods `mint_token`, `get_tokens`, and `burn_token`.

Import dependencies and set global variable.

```python
import xrpl
from xrpl.clients import JsonRpcClient
from xrpl.wallet import Wallet
from xrpl.models.requests import AccountNFTs

testnet_url = "https://s.altnet.rippletest.net:51234"
```

## mintToken

Pass the arguments account seed, NFT URI, transaction flags, the transfer fee, and optional taxon.

```python
def mint_token(seed, uri, flags, transfer_fee, taxon):
    """mint_token"""
```

Get the account wallet and a client instance.

```python
    minter_wallet=Wallet.from_seed(seed)
    client=JsonRpcClient(testnet_url)
```

Define the mint transaction. Note that the NFT URI must be converted to a hex string.

```python
    mint_tx=xrpl.models.transactions.NFTokenMint(
        account=minter_wallet.address,
        uri=xrpl.utils.str_to_hex(uri),
        flags=int(flags),
        transfer_fee=int(transfer_fee),
        nftoken_taxon=int(taxon)
    )
```

Submit the transaction and return results.

```python
    reply=""
    try:
        response=xrpl.transaction.submit_and_wait(mint_tx,client,minter_wallet)
        reply=response.result
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        reply=f"Submit failed: {e}"
    return reply
```

## getTokens

```python
def get_tokens(account):
    """get_tokens"""
```

Instantiate a client.

```python
    client=JsonRpcClient(testnet_url)
```

Prepare the `AccountNFTs` request.

```python
    acct_nfts=AccountNFTs(
        account=account
    )
```

Send the request and return the result.

```python
    response=client.request(acct_nfts)
    return response.result
```

## burn_token 

Pass the owner's seed value and the NFT ID.

```python
def burn_token(seed, nftoken_id):
    """burn_token"""
```

Get the owner wallet and client instance.

```python
    owner_wallet=Wallet.from_seed(seed)
    client=JsonRpcClient(testnet_url)
```

Define the NFTokenBurn transaction.

```python
    burn_tx=xrpl.models.transactions.NFTokenBurn(
        account=owner_wallet.address,
        nftoken_id=nftoken_id    
    )
```

Submit the transaction and return results.

```python
    reply=""
    try:
        response=xrpl.transaction.submit_and_wait(burn_tx,client,owner_wallet)
        reply=response.result
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        reply=f"Submit failed: {e}"
    return reply
```

## lesson3-mint-token.py
<!-- SPELLING_IGNORE: lesson3 -->

This module builds on `lesson2-create-trustline-send-currency.py`. Changes are noted below.

```python
import tkinter as tk
import xrpl
import json
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
```

Import methods from `mod3.py`.

```python
from mod3 import (
    mint_token,
    get_tokens,
    burn_token,
)

#############################################
## Handlers #################################
#############################################
```

Module 3 Handlers

```python
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
```

Create a new window with the title "Quickstart Module 3."

```python
window = tk.Tk()
window.title("Quickstart Module 3")

standbyRippling = tk.BooleanVar()
operationalRippling = tk.BooleanVar()

# Form frame
frm_form = tk.Frame(relief=tk.SUNKEN, borderwidth=3)
frm_form.pack()

# Create the Label and Entry widgets for "Standby Account"
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
cb_standby_allow_rippling = tk.Checkbutton(master=frm_form, text="Allow Rippling", variable=standbyRippling, onvalue=True, offvalue=False)
```

Add **NFT URI**, **Flags**, **Transfer Fee**, **Taxon**, and **NFT ID** fields.

```python
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
```

Place new UI elements in the grid.

```python
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
lbl_standby_results.grid(row=13, column=0, sticky="ne")
text_standby_results.grid(row=13, column=1, sticky="nw")
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
```

Add fields for **NFT URI**, **Flags**, **Transfer Fee**, **Taxon**, and **NFT ID**.

```python
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
lbl_operational_currency.grid(row=6, column=4, sticky="e")
ent_operational_currency.grid(row=6, column=5)
cb_operational_allow_rippling.grid(row=7,column=5, sticky="w")
```

Place new UI elements in the grid.

```python
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
lbl_operational_results.grid(row=13, column=4, sticky="ne")
text_operational_results.grid(row=13, column=5, sticky="nw")

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
btn_standby_create_trust_line.grid(row=3, column=2, sticky = "nsew")
btn_standby_send_currency = tk.Button(master=frm_form, text="Send Currency >",
                                      command = standby_send_currency)
btn_standby_send_currency.grid(row=4, column=2, sticky = "nsew")
btn_standby_send_currency = tk.Button(master=frm_form, text="Get Balances",
                                      command = get_balances)
btn_standby_send_currency.grid(row=5, column=2, sticky = "nsew")
btn_standby_configure_account = tk.Button(master=frm_form,
                                          text="Configure Account",
                                          command = standby_configure_account)
```

Add buttons for **Mint NFT**, **Get NFTs**, and **Burn NFT**.

```python
btn_standby_mint_token = tk.Button(master=frm_form, text="Mint NFT",
                                   command = standby_mint_token)
btn_standby_mint_token.grid(row=8, column=2, sticky="nsew")
btn_standby_get_tokens = tk.Button(master=frm_form, text="Get NFTs",
                                   command = standby_get_tokens)
btn_standby_get_tokens.grid(row=9, column=2, sticky="nsew")
btn_standby_burn_token = tk.Button(master=frm_form, text="Burn NFT",
                                   command = standby_burn_token)
btn_standby_burn_token.grid(row=10, column=2, sticky="nsew")


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
btn_op_create_trust_line.grid(row=3, column=3, sticky = "nsew")
btn_op_send_currency = tk.Button(master=frm_form, text="< Send Currency",
                                 command = operational_send_currency)
btn_op_send_currency.grid(row=4, column=3, sticky = "nsew")
btn_op_get_balances = tk.Button(master=frm_form, text="Get Balances",
                                command = get_balances)
btn_op_get_balances.grid(row=5, column=3, sticky = "nsew")
btn_op_configure_account = tk.Button(master=frm_form, text="Configure Account",
                                     command = operational_configure_account)
btn_op_configure_account.grid(row=7,column=4, sticky = "nsew")
```
Add buttons for **Mint NFT**, **Get NFTs**, and **Burn NFT**.

```python
btn_op_mint_token = tk.Button(master=frm_form, text="Mint NFT",
                              command = operational_mint_token)
btn_op_mint_token.grid(row=8, column=3, sticky="nsew")
btn_op_get_tokens = tk.Button(master=frm_form, text="Get NFTs",
                              command = operational_get_tokens)
btn_op_get_tokens.grid(row=9, column=3, sticky="nsew")
btn_op_burn_token = tk.Button(master=frm_form, text="Burn NFT",
                              command = operational_burn_token)
btn_op_burn_token.grid(row=10, column=3, sticky="nsew")

# Start the application
window.mainloop()
```
