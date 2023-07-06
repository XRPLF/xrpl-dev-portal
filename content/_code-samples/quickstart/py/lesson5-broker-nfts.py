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
from mod4 import (
    create_sell_offer,
    create_buy_offer,
    get_offers,
    cancel_offer,
    accept_sell_offer,
    accept_buy_offer,
)
from mod5 import broker_sale

#############################################
## Handlers #################################
#############################################

# Module 5 Handlers

def get_broker_account():
    new_wallet = get_account(ent_broker_seed.get())
    ent_broker_account.delete(0, tk.END)
    ent_broker_seed.delete(0, tk.END)
    ent_broker_account.insert(0, new_wallet.classic_address)
    ent_broker_seed.insert(0, new_wallet.seed)


def get_broker_account_info():
    accountInfo = get_account_info(ent_broker_account.get())
    ent_broker_balance.delete(0, tk.END)
    ent_broker_balance.insert(0,accountInfo['Balance'])
    text_broker_results.delete("1.0", tk.END)
    text_broker_results.insert("1.0",json.dumps(accountInfo, indent=4))


def broker_broker_sale():
    results = broker_sale(
        ent_broker_seed.get(),
        ent_broker_sell_nft_idx.get(),
        ent_broker_buy_nft_idx.get(),
        ent_broker_fee.get()
    )
    text_broker_results.delete("1.0", tk.END)
    text_broker_results.insert("1.0", json.dumps(results, indent=4))


def broker_get_offers():
    results = get_offers(ent_broker_nft_id.get())
    text_broker_results.delete("1.0", tk.END)
    text_broker_results.insert("1.0", results)


def broker_cancel_offer():
    results = cancel_offer(
        ent_broker_seed.get(),
        ent_broker_buy_nft_idx.get()
    )
    text_broker_results.delete("1.0", tk.END)
    text_broker_results.insert("1.0", json.dumps(results, indent=4))


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

# Create a new window with the title "Quickstart - Broker Sale"
window = tk.Tk()
window.title("Quickstart - Broker Sale")

myscrollbar=tk.Scrollbar(window,orient="vertical")
myscrollbar.pack(side="right",fill="y")


standbyRippling = tk.BooleanVar()
operationalRippling = tk.BooleanVar()

# Broker frame

frm_broker = tk.Frame(relief=tk.SUNKEN, borderwidth=3)
frm_broker.pack()

lbl_broker_seed = tk.Label(master=frm_broker, text="Broker Seed")
ent_broker_seed = tk.Entry(master=frm_broker, width=50)
lbl_broker_account = tk.Label(master=frm_broker, text="Broker Account")
ent_broker_account = tk.Entry(master=frm_broker, width=50)
lbl_broker_balance = tk.Label(master=frm_broker, text="XRP Balance")
ent_broker_balance = tk.Entry(master=frm_broker, width=50)
lbl_broker_amount = tk.Label(master=frm_broker, text="Amount")
ent_broker_amount = tk.Entry(master=frm_broker, width=50)
lbl_broker_nft_id = tk.Label(master=frm_broker, text="NFT ID")
ent_broker_nft_id = tk.Entry(master=frm_broker, width=50)
lbl_broker_sell_nft_idx = tk.Label(master=frm_broker, text="Sell NFT Offer Index")
ent_broker_sell_nft_idx = tk.Entry(master=frm_broker, width=50)
lbl_broker_buy_nft_idx = tk.Label(master=frm_broker, text="Buy NFT Offer Index")
ent_broker_buy_nft_idx = tk.Entry(master=frm_broker, width=50)
lbl_broker_owner = tk.Label(master=frm_broker, text="Owner")
ent_broker_owner = tk.Entry(master=frm_broker, width=50)
lbl_broker_fee = tk.Label(master=frm_broker, text="Broker Fee")
ent_broker_fee = tk.Entry(master=frm_broker, width=50)
lbl_broker_results=tk.Label(master=frm_broker, text="Results")
text_broker_results = tk.Text(master=frm_broker, height=10, width=65)

lbl_broker_seed.grid(row=0, column=0, sticky="w")
ent_broker_seed.grid(row=0, column=1)
lbl_broker_account.grid(row=1, column=0, sticky="w")
ent_broker_account.grid(row=1, column=1)
lbl_broker_balance.grid(row=2, column=0, sticky="w")
ent_broker_balance.grid(row=2, column=1)
lbl_broker_amount.grid(row=3, column=0, sticky="w")
ent_broker_amount.grid(row=3, column=1)
lbl_broker_nft_id.grid(row=4, column=0, sticky="w")
ent_broker_nft_id.grid(row=4, column=1)
lbl_broker_sell_nft_idx.grid(row=5, column=0, sticky="w")
ent_broker_sell_nft_idx.grid(row=5, column=1)
lbl_broker_buy_nft_idx.grid(row=6, column=0, sticky="w")
ent_broker_buy_nft_idx.grid(row=6, column=1)
lbl_broker_owner.grid(row=7, column=0, sticky="w")
ent_broker_owner.grid(row=7, column=1)
lbl_broker_fee.grid(row=8, column=0, sticky="w")
ent_broker_fee.grid(row=8, column=1)
lbl_broker_results.grid(row=9, column=0)
text_broker_results.grid(row=9, column=1)

# Broker Buttons
btn_broker_get_account = tk.Button(master=frm_broker, text="Get Broker Account",
                                   command = get_broker_account)
btn_broker_get_account.grid(row=0, column=2, sticky = "nsew")
btn_broker_get_account_info = tk.Button(master=frm_broker, text="Get Broker Account Info",
                                   command = get_broker_account_info)
btn_broker_get_account_info.grid(row=1, column=2, sticky = "nsew")
btn_broker_sale = tk.Button(master=frm_broker, text="Broker Sale",
                            command = broker_broker_sale)
btn_broker_sale.grid(row=2, column=2, sticky = "nsew")
btn_broker_get_offers = tk.Button(master=frm_broker, text="Get Offers",
                                  command = broker_get_offers)
btn_broker_get_offers.grid(row=3, column=2, sticky = "nsew")
btn_broker_cancel_offer = tk.Button(master=frm_broker, text="Cancel Offer",
                                    command = broker_cancel_offer)
btn_broker_cancel_offer.grid(row=4, column=2, sticky="nsew")

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
lbl_standby_nft_offer_index = tk.Label(master=frm_form, text="NFT Offer Index")
ent_standby_nft_offer_index = tk.Entry(master=frm_form, width="50")
lbl_standby_owner = tk.Label(master=frm_form, text="Owner")
ent_standby_owner = tk.Entry(master=frm_form, width="50")
lbl_standby_expiration = tk.Label(master=frm_form, text="Expiration")
ent_standby_expiration = tk.Entry(master=frm_form, width="50")
lbl_standby_results = tk.Label(master=frm_form,text='Results')
text_standby_results = tk.Text(master=frm_form, height = 10, width = 65)




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
lbl_operational_nft_offer_index = tk.Label(master=frm_form, text="NFT Offer Index")
ent_operational_nft_offer_index = tk.Entry(master=frm_form, width="50")
lbl_operational_owner = tk.Label(master=frm_form, text="Owner")
ent_operational_owner = tk.Entry(master=frm_form, width="50")
lbl_operational_expiration = tk.Label(master=frm_form, text="Expiration")
ent_operational_expiration = tk.Entry(master=frm_form, width="50")
lbl_operational_results = tk.Label(master=frm_form,text="Results")
text_operational_results = tk.Text(master=frm_form, height = 10, width = 65)

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
