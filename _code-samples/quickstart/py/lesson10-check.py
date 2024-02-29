import tkinter as tk
import xrpl
import json

from mod1 import get_account, get_account_info, send_xrp
from mod2 import get_balance
from mod10 import send_check, cash_check, cancel_check, get_checks

#############################################
## Handlers #################################
#############################################

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
    text_operational_results.insert("1.0", json.dumps(results, indent=4))

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


## Mod 8 Handlers
    
def operational_get_transaction():
    results=get_transaction(ent_operational_account.get(),
                              ent_operational_look_up.get())
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


# Create a new window with the title "Conditional Escrow Example"
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
