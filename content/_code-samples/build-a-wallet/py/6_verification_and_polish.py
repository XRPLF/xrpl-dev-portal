# "Build a Wallet" tutorial, step 6: Verification and Polish
# TODO: description
import xrpl

import asyncio
import requests
import toml
import re
import wx
import wx.dataview
import wx.adv
from wxasync import AsyncBind, WxAsyncApp, StartCoroutine
from threading import Thread
from decimal import Decimal
from queue import Queue, Empty

class AutoGridBagSizer(wx.GridBagSizer):
    """
    Helper class for adding a bunch of items uniformly to a GridBagSizer.
    """
    def __init__(self, parent):
        wx.GridBagSizer.__init__(self, vgap=5, hgap=5)
        self.parent = parent

    def BulkAdd(self, ctrls):
        """
        Given a two-dimensional iterable `ctrls`, add all the items in a grid
        top-to-bottom, left-to-right, with each inner iterable being a row and a
        total number of columns based on the longest iterable.
        """
        flags = wx.EXPAND|wx.ALL|wx.RESERVE_SPACE_EVEN_IF_HIDDEN|wx.ALIGN_CENTER_VERTICAL
        for x, row in enumerate(ctrls):
            for y, ctrl in enumerate(row):
                self.Add(ctrl, (x,y), flag=flags, border=5)
        self.parent.SetSizer(self)

class SendXRPDialog(wx.Dialog):
    """
    Pop-up dialog that prompts the user for the information necessary to send a
    direct XRP-to-XRP payment on the XRPL.
    """
    def __init__(self, parent, max_send=100000000.0):
        wx.Dialog.__init__(self, parent, title="Send XRP")
        sizer = AutoGridBagSizer(self)
        self.parent = parent

        # little "X" icons to indicate a validation error
        bmp_err = wx.ArtProvider.GetBitmap(wx.ART_ERROR, wx.ART_CMN_DIALOG, size=(16,16))
        self.err_to = wx.StaticBitmap(self, bitmap=bmp_err)
        self.err_dtag = wx.StaticBitmap(self, bitmap=bmp_err)
        self.err_amt = wx.StaticBitmap(self, bitmap=bmp_err)
        self.err_to.Hide()
        self.err_dtag.Hide()
        self.err_amt.Hide()

        # ✅/❌ for domain verification
        bmp_check = wx.ArtProvider.GetBitmap(wx.ART_TICK_MARK, wx.ART_CMN_DIALOG, size=(16,16))
        self.domain_text = wx.StaticText(self, label="")
        self.domain_verified = wx.StaticBitmap(self, bitmap=bmp_check)
        self.domain_verified.Hide()
        #self.domain_mismatch = wx.StaticBitmap(self, bitmap=bmp_err)
        #self.domain_mismatch.SetTooltip("Fail to verify domain")

        if max_send <= 0:
            max_send = 100000000.0
            self.err_amt.Show()
            self.err_amt.SetToolTip("Not enough XRP to pay the reserve and transaction cost!")

        lbl_to = wx.StaticText(self, label="To (Address):")
        lbl_dtag = wx.StaticText(self, label="Destination Tag:")
        lbl_amt = wx.StaticText(self, label="Amount of XRP:")
        self.txt_to = wx.TextCtrl(self)
        self.txt_dtag = wx.TextCtrl(self)
        self.txt_amt = wx.SpinCtrlDouble(self, value="20.0", min=0.000001, max=max_send)
        self.txt_amt.SetDigits(6)
        self.txt_amt.SetIncrement(1.0)


        btn_send = wx.Button(self, wx.ID_OK, label="Send")
        btn_cancel = wx.Button(self, wx.ID_CANCEL)

        sizer.BulkAdd(((lbl_to, self.txt_to, self.err_to),
                       (self.domain_verified, self.domain_text),
                       (lbl_dtag, self.txt_dtag, self.err_dtag),
                       (lbl_amt, self.txt_amt, self.err_amt),
                       (btn_cancel, btn_send)) )
        sizer.Fit(self)


        self.txt_dtag.Bind(wx.EVT_TEXT, self.onDestTagEdit)
        ## TODO: why does this only run when the dialog is closed?
        ## and is there a fix for AsyncShowDialog causing an invalid ptr deref??
        AsyncBind(wx.EVT_TEXT, self.onToEdit, self.txt_to)

    async def onToEdit(self, event):
        v = self.txt_to.GetValue().strip()
        err_msg = ""
        if xrpl.core.addresscodec.is_valid_xaddress(v):
            cl_addr, tag, is_test = xrpl.core.addresscodec.xaddress_to_classic_address(v)
            self.txt_dtag.ChangeValue(str(tag))
            self.txt_dtag.Disable()

            if cl_addr == self.parent.classic_address:
                err_msg = "Can't send XRP to self."
            elif is_test != self.parent.test_network:
                err_msg = "This address is intended for a different network."

        elif not self.txt_dtag.IsEditable():
            self.txt_dtag.Clear()
            self.txt_dtag.Enable()

        if not (xrpl.core.addresscodec.is_valid_classic_address(v) or
                xrpl.core.addresscodec.is_valid_xaddress(v) ):
            err_msg = "Not a valid address."
        elif v == self.parent.classic_address:
            err_msg = "Can't send XRP to self."

        # Check for Disallow XRP
        try:
            response = await xrpl.asyncio.account.get_account_info(v,
                    self.parent.client, ledger_index="validated")
            dest_funded = True
            dest_acct = response.result["account_data"]
        except xrpl.asyncio.clients.exceptions.XRPLRequestFailureException:
            dest_funded = False

        if dest_funded:
            lsfDisallowXRP = 0x00080000
            if dest_acct["Flags"] & lsfDisallowXRP:
                err_msg = "This account does not want to receive XRP"

            # Domain verification
            bmp_err = wx.ArtProvider.GetBitmap(wx.ART_ERROR, wx.ART_CMN_DIALOG, size=(16,16))
            bmp_check = wx.ArtProvider.GetBitmap(wx.ART_TICK_MARK, wx.ART_CMN_DIALOG, size=(16,16))
            domain, verified = verify_account_domain(dest_acct)
            if not domain:
                self.domain_text.Hide()
                self.domain_verified.Show()
            elif verified:
                self.domain_text.SetLabel(domain)
                self.domain_text.Show()
                self.domain_verified.SetTooltip("Domain verified")
                self.domain_verified.SetBitmap(bmp_check)
                self.domain_verified.Show()
            else:
                self.domain_text.SetLabel(domain)
                self.domain_text.Show()
                self.domain_verified.SetTooltip("Failed to verify domain")
                self.domain_verified.SetBitmap(bmp_err)
                self.domain_verified.Show()

        # TODO: Check for Deposit Auth

        if err_msg:
            self.err_to.SetToolTip(err_msg)
            self.err_to.Show()
        else:
            self.err_to.Hide()

    def onDestTagEdit(self, event):
        v = self.txt_dtag.GetValue().strip()
        v = re.sub(r"[^0-9]", "", v)
        self.txt_dtag.ChangeValue(v) # SetValue would generate another EVT_TEXT
        self.txt_dtag.SetInsertionPointEnd()

    def GetPaymentData(self):
        return {
            "to": self.txt_to.GetValue().strip(),
            "dtag": self.txt_dtag.GetValue().strip(),
            "amt": self.txt_amt.GetValue(),
        }

def verify_account_domain(account):
    """
    Verify an account using an xrp-ledger.toml file.

    Params:
        account:dict - the AccountRoot object to verify
    Returns (domain:str, verified:bool)
    """
    domain_hex = account.get("Domain")
    if not domain_hex:
        return "", False
    verified = False
    domain = xrpl.utils.hex_to_str(domain_hex)
    toml_url = f"https://{domain}/.well-known/xrp-ledger.toml"
    toml_response = requests.get(toml_url)
    if toml_response.ok:
        parsed_toml = toml.loads(toml_response.text)
        toml_accounts = parsed_toml.get("ACCOUNTS", [])
        for t_a in toml_accounts:
            if t_a.get("address") == account.get("Account"):
                verified = True
                break
    return domain, verified


class TWaXLFrame(wx.Frame):
    """
    Tutorial Wallet for the XRP Ledger (TWaXL)
    user interface, main frame.
    """
    def __init__(self, url, test_network=True):
        wx.Frame.__init__(self, None, title="TWaXL", size=wx.Size(800,400))

        self.test_network = test_network

        self.tabs = wx.Notebook(self, style=wx.BK_DEFAULT)

        # Tab 1: "Summary" pane ------------------------------------------------
        main_panel = wx.Panel(self.tabs)
        self.tabs.AddPage(main_panel, "Summary")

        self.acct_info_area = wx.StaticBox(main_panel, label="Account Info")

        lbl_address = wx.StaticText(self.acct_info_area, label="Classic Address:")
        self.st_classic_address = wx.StaticText(self.acct_info_area, label="TBD")
        lbl_xaddress = wx.StaticText(self.acct_info_area, label="X-Address:")
        self.st_x_address = wx.StaticText(self.acct_info_area, label="TBD")
        lbl_xrp_bal = wx.StaticText(self.acct_info_area, label="XRP Balance:")
        self.st_xrp_balance = wx.StaticText(self.acct_info_area, label="TBD")
        lbl_reserve = wx.StaticText(self.acct_info_area, label="XRP Reserved:")
        self.st_reserve = wx.StaticText(self.acct_info_area, label="TBD")

        aia_sizer = AutoGridBagSizer(self.acct_info_area)
        aia_sizer.BulkAdd( ((lbl_address, self.st_classic_address),
                           (lbl_xaddress, self.st_x_address),
                           (lbl_xrp_bal, self.st_xrp_balance),
                           (lbl_reserve, self.st_reserve)) )


        # Send XRP button.
        self.sxb = wx.Button(main_panel, label="Send XRP")
        self.sxb.Disable()

        # Ledger info text. One multi-line static text, unlike the account area.
        self.ledger_info = wx.StaticText(main_panel, label="Not connected")

        # The ledger's current reserve settings. To be filled in when we get a
        # ledger event.
        self.reserve_base = None
        self.reserve_inc = None

        main_sizer = wx.BoxSizer(wx.VERTICAL)
        main_sizer.Add(self.acct_info_area, 1, flag=wx.EXPAND|wx.ALL, border=5)
        main_sizer.Add(self.sxb, 0, flag=wx.ALL, border=5)
        main_sizer.Add(self.ledger_info, 1, flag=wx.EXPAND|wx.ALL, border=5)
        main_panel.SetSizer(main_sizer)

        # Tab 2: "Transaction History" pane ------------------------------------
        objs_panel = wx.Panel(self.tabs)
        self.tabs.AddPage(objs_panel, "Transaction History")
        objs_sizer = wx.BoxSizer(wx.VERTICAL)

        self.tx_list = wx.dataview.DataViewListCtrl(objs_panel)
        self.tx_list.AppendTextColumn("Confirmed")
        self.tx_list.AppendTextColumn("Type")
        self.tx_list.AppendTextColumn("From")
        self.tx_list.AppendTextColumn("To")
        self.tx_list.AppendTextColumn("Value Delivered")
        self.tx_list.AppendTextColumn("Identifying Hash")
        self.tx_list.AppendTextColumn("Raw JSON")
        objs_sizer.Add(self.tx_list, 1, wx.EXPAND|wx.ALL)
        self.pending_tx_rows = {} # Map pending tx hashes to rows in the history UI

        objs_panel.SetSizer(objs_sizer)

        # Pop up to ask user for their account ---------------------------------
        account_dialog = wx.TextEntryDialog(self,
                "Please enter an account address (for read-only)"
                " or your secret (for read-write access)",
                caption="Enter account",
                # value="rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe")
                value="snX6rmeLQasF2fLswCB7C4PwMSPD7",#TODO: remove test secret
                )
        account_dialog.Bind(wx.EVT_TEXT, self.toggle_dialog_style)

        if account_dialog.ShowModal() == wx.ID_OK:
            self.set_up_account(account_dialog.GetValue())
            account_dialog.Destroy()
        else:
            # If the user presses Cancel on the account entry, exit the app.
            exit(1)

        # Attach handlers and start bg thread for updates from the ledger ------
        # self.Bind(wx.EVT_BUTTON, self.send_xrp, source=self.sxb)
        AsyncBind(wx.EVT_BUTTON, self.send_xrp, self.sxb)
        self.url = url
        StartCoroutine(self.monitor_xrpl, self)

    def toggle_dialog_style(self, event):
        """
        Automatically switches to a password-style dialog if it looks like the
        user is entering a secret key, and display ***** instead of s12345...
        """
        dlg = event.GetEventObject()
        v = dlg.GetValue().strip()
        if v[:1] == "s":
            dlg.SetWindowStyle(wx.TE_PASSWORD)
        else:
            dlg.SetWindowStyle(wx.TE_LEFT)

    def set_up_account(self, value):
        """
        Set up fields for address and wallet (or quit with an error) depending
        on what input the user provided.
        """
        value = value.strip()

        if xrpl.core.addresscodec.is_valid_xaddress(value):
            classic_address, dest_tag, test_network = xrpl.core.addresscodec.xaddress_to_classic_address(value)
            if test_network != self.test_network:
                print(f"X-address {value} is meant for a different network type"
                      f"than this client is connected to."
                      f"(Client is on: {'a test network' if self.test_network else 'Mainnet'})")
                exit(1)
            self.xaddress = value
            self.classic_address = classic_address
            self.wallet = None
            self.sxb.SetToolTip("Disabled in read-only mode.")

        elif xrpl.core.addresscodec.is_valid_classic_address(value):
            self.xaddress = xrpl.core.addresscodec.classic_address_to_xaddress(
                    value, tag=None, is_test_network=self.test_network)
            self.classic_address = value
            self.wallet = None
            self.sxb.SetToolTip("Disabled in read-only mode.")

        else:
            try:
                # Check if it's a valid seed
                seed_bytes, alg = xrpl.core.addresscodec.decode_seed(value)
                self.wallet = xrpl.wallet.Wallet(seed=value, sequence=0)
                # We'll fill in the actual sequence later.
                self.xaddress = self.wallet.get_xaddress(is_test=self.test_network)
                self.classic_address = self.wallet.classic_address
            except Exception as e:
                print(e)
                exit(1)
        self.st_classic_address.SetLabel(self.classic_address)
        self.st_x_address.SetLabel(self.xaddress)

    async def monitor_xrpl(self):
        """
        Coroutine to set up XRPL API subscriptions & handle incoming messages,
        without making the GUI non-responsive while it waits for the network.
        """
        async with xrpl.asyncio.clients.AsyncWebsocketClient(self.url) as self.client:
            response = await self.client.request(xrpl.models.requests.Subscribe(
                streams=["ledger"],
                accounts=[self.classic_address]
            ))
            # The immediate response contains details for the last validated ledger
            self.update_ledger(response.result)

            # Get starting values for account info, account transaction history
            response = await self.client.request(xrpl.models.requests.AccountInfo(
                account=self.classic_address,
                ledger_index="validated"
            ))
            self.update_account(response.result["account_data"])
            response = await self.client.request(xrpl.models.requests.AccountTx(
                account=self.classic_address
            ))
            self.update_account_tx(response.result)

            async for message in self.client:
                mtype = message.get("type")
                if mtype == "ledgerClosed":
                    self.update_ledger(message)
                elif mtype == "transaction":
                    self.add_tx_from_sub(message)
                    response = await self.client.request(xrpl.models.requests.AccountInfo(
                        account=self.classic_address,
                        ledger_index=message["ledger_index"]
                    ))
                    self.update_account(response.result["account_data"])

    def update_ledger(self, message):
        """
        Process a ledger subscription message to update the UI with
        information about the latest validated ledger.
        """
        close_time_iso = xrpl.utils.ripple_time_to_datetime(message["ledger_time"]).isoformat()
        self.ledger_info.SetLabel(f"Latest validated ledger:\n"
                         f"Ledger Index: {message['ledger_index']}\n"
                         f"Ledger Hash: {message['ledger_hash']}\n"
                         f"Close time: {close_time_iso}")
        # Save reserve settings (in drops of XRP) so we can calc account reserve
        self.reserve_base = Decimal(message["reserve_base"])
        self.reserve_inc = Decimal(message["reserve_inc"])

    def calculate_reserve_xrp(self, owner_count):
        """
        Calculates how much XRP the user needs to reserve based on the account's
        OwnerCount and the reserve values in the latest ledger.
        """
        if self.reserve_base == None or self.reserve_inc == None:
            return None
        oc_decimal = Decimal(owner_count)
        reserve_drops = self.reserve_base + (self.reserve_inc * oc_decimal)
        reserve_xrp = xrpl.utils.drops_to_xrp(str(reserve_drops))
        return reserve_xrp

    def update_account(self, acct):
        """
        Process an account_info response to update the account info area of the
        UI.
        """
        xrp_balance = str(xrpl.utils.drops_to_xrp(acct["Balance"]))
        self.st_xrp_balance.SetLabel(xrp_balance)

        # Display account reserve and save for calculating max send.
        reserve_xrp = self.calculate_reserve_xrp(acct.get("OwnerCount", 0))
        if reserve_xrp != None:
            self.st_reserve.SetLabel(str(reserve_xrp))
            self.reserve_xrp = reserve_xrp

        # If we're not read-only, we can set the Sequence number and enable the
        # Send XRP button.
        if self.wallet:
            self.wallet.sequence = acct["Sequence"]
            self.sxb.Enable()

    @staticmethod
    def displayable_amount(a):
        """
        Convert an arbitrary amount value from the XRPL to a string to be
        displayed to the user:
        - Convert drops of XRP to 6-digit decimal XRP (e.g. '12.345000 XRP')
        - For issued tokens, show amount, currency code, and issuer. For
          example, 100 USD issued by address r12345... is returned as
          '100 USD.r12345...'

        Leaves non-standard (hex) currency codes as-is.
        """
        if a == "unavailable":
            # Special case for pre-2014 partial payments.
            return a
        elif type(a) == str:
            # It's an XRP amount in drops. Convert to decimal.
            return f"{xrpl.utils.drops_to_xrp(a)} XRP"
        else:
            # It's a token amount.
            return f"{a['value']} {a['currency']}.{a['issuer']}"

    def add_tx_row(self, t, prepend=False):
        """
        Add one row to the account transaction history control.
        """
        conf_dt = xrpl.utils.ripple_time_to_datetime(t["tx"]["date"])
        # Convert datetime to locale-default representation & time zone
        confirmation_time = conf_dt.astimezone().strftime("%c")

        tx_hash = t["tx"]["hash"]
        tx_type = t["tx"]["TransactionType"]
        from_acct = t["tx"].get("Account") or ""
        if from_acct == self.classic_address:
            from_acct = "(Me)"
        to_acct = t["tx"].get("Destination") or ""
        if to_acct == self.classic_address:
            to_acct = "(Me)"

        delivered_amt = t["meta"].get("delivered_amount")
        if delivered_amt:
            delivered_amt = self.displayable_amount(delivered_amt)
        else:
            delivered_amt = ""

        cols = (confirmation_time, tx_type, from_acct, to_acct, delivered_amt,
                tx_hash, str(t))
        if prepend:
            self.tx_list.PrependItem(cols)
        else:
            self.tx_list.AppendItem(cols)

    def update_account_tx(self, data):
        """
        Update the transaction history tab with information from an account_tx
        response.
        """
        txs = data["transactions"]
        # TODO: with pagination, we should leave existing items
        self.tx_list.DeleteAllItems()
        for t in txs:
            self.add_tx_row(t)

    def add_tx_from_sub(self, t):
        """
        Add 1 transaction to the history based on a subscription stream message.
        Assumes only validated transaction streams (e.g. transactions, accounts)
        not proposed transaction streams.

        Also send a notification to the user about it.
        """
        # Convert to same format as account_tx results
        t["tx"] = t["transaction"]
        if t["tx"]["hash"] in self.pending_tx_rows.keys():
            dvi = self.pending_tx_rows[t["tx"]["hash"]]
            pending_row = self.tx_list.ItemToRow(dvi)
            self.tx_list.DeleteItem(pending_row)

        self.add_tx_row(t, prepend=True)
        # Scroll to top of list.
        self.tx_list.EnsureVisible(self.tx_list.RowToItem(0))

        # Send a notification message ("toast") about the transaction
        # Note the transaction stream and account_tx include all transactions
        # that "affect" the account, no just ones directly from/to the account.
        # For example, an issuer gets notified when users transfer its tokens
        # among themselves.
        notif = wx.adv.NotificationMessage(title="New Transaction", message =
                f"New {t['tx']['TransactionType']} transaction confirmed!")
        notif.SetFlags(wx.ICON_INFORMATION)
        notif.Show()

    def add_pending_tx(self, txm):
        """
        Add a "pending" transaction to the history based on a transaction model
        that was (presumably) just submitted.
        """
        tx = txm.to_xrpl()
        confirmation_time = "(pending)"
        tx_type = tx["TransactionType"]
        from_acct = tx.get("Account") or ""
        if from_acct == self.classic_address:
            from_acct = "(Me)"
        to_acct = tx.get("Destination") or ""
        if to_acct == self.classic_address:
            to_acct = "(Me)"
        delivered_amt = ""
        tx_hash = txm.get_hash()
        cols = (confirmation_time, tx_type, from_acct, to_acct, delivered_amt,
                tx_hash, str(tx))
        self.tx_list.PrependItem(cols)
        self.pending_tx_rows[tx_hash] = self.tx_list.RowToItem(0)

    async def send_xrp(self, event):
        """
        Pop up a dialog for the user to input how much XRP to send where, and
        send the transaction (if the user doesn't cancel).
        """
        xrp_bal = Decimal(self.st_xrp_balance.GetLabelText())
        tx_cost = Decimal("0.000010")
        reserve = self.reserve_xrp or Decimal(0.000000)
        dlg = SendXRPDialog(self, max_send=float(xrp_bal - reserve - tx_cost))
        dlg.CenterOnScreen()
        resp = dlg.ShowModal()
        if resp != wx.ID_OK:
            print("Send XRP canceled")
            return

        paydata = dlg.GetPaymentData()
        dtag = paydata.get("dtag")
        if dtag.strip() == "":
            dtag = None
        if dtag is not None:
            try:
                dtag = int(dtag)
                if dtag < 0 or dtag > 2**32-1:
                    raise ValueError("Destination tag must be a 32-bit unsigned integer")
            except ValueError as e:
                print("Invalid destination tag:", e)
                print("Canceled sending payment.")
                return

        tx = xrpl.models.transactions.Payment(
            account=self.classic_address,
            sequence=self.wallet.sequence,
            destination=paydata["to"],
            amount=xrpl.utils.xrp_to_drops(paydata["amt"]),
            destination_tag=dtag
        )
        tx_signed = await xrpl.asyncio.transaction.safe_sign_and_autofill_transaction(tx, self.wallet, self.client)
        self.add_pending_tx(tx_signed)
        await xrpl.asyncio.transaction.submit_transaction(tx_signed, self.client)


if __name__ == "__main__":
    #JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
    #JSON_RPC_URL = "http://localhost:5005/"
    WS_URL = "wss://s.altnet.rippletest.net:51233"

    app = WxAsyncApp()
    frame = TWaXLFrame(WS_URL)
    frame.Show()
    loop = asyncio.events.get_event_loop()
    loop.run_until_complete(app.MainLoop())
