import tkinter as tk
import xrpl
import json

from mod1 import get_account, get_account_info, send_xrp

#############################################
## Handlers #################################
#############################################

# sb seed: snk7pMfHPZoUpwMQuFApo3XTLRJhn
# op seed: spmiHeaCDMFX56SNZVsCbi34WEE52

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


# Create a new window with the title "Send and Receive XRP"
window = tk.Tk()
window.title("Send and Receive XRP")

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
lbl_standby_results = tk.Label(master=frm_form,text='Results')
text_standby_results = tk.Text(master=frm_form, height = 20, width = 65)

# Place fields in a grid.
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
lbl_operational_results.grid(row=6, column=4, sticky="ne")
text_operational_results.grid(row=6, column=5, sticky="nw")

#############################################
## Buttons ##################################
#############################################

# Create the Get Standby Account Buttons
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


# Start the application
window.mainloop()
