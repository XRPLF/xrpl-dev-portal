#!/usr/bin/env python
# "Build a Wallet" tutorial, extra step: Allow the user to switch to using a
# regular key. Doesn't actually including *setting* the regular key, though.
# Also adds a commandline switch for choosing the network.
# License: MIT. https://github.com/XRPLF/xrpl-dev-portal/blob/master/LICENSE

from argparse import ArgumentParser
import xrpl
import wx
import wx.dataview
import wx.adv
import asyncio
import re
from threading import Thread
from decimal import Decimal

from verify_domain import verify_account_domain

class XRPLMonitorThread(Thread):
    """
    A worker thread to watch for new ledger events and pass the info back to
    the main frame to be shown in the UI. Using a thread lets us maintain the
    responsiveness of the UI while doing work in the background.
    """
    def __init__(self, url, gui):
        Thread.__init__(self, daemon=True)
        # Note: For thread safety, this thread should treat self.gui as
        # read-only; to modify the GUI, use wx.CallAfter(...)
        self.gui = gui
        self.url = url
        self.loop = asyncio.new_event_loop()
        asyncio.set_event_loop(self.loop)
        self.loop.set_debug(True)

    def run(self):
        """
        This thread runs a never-ending event-loop that monitors messages coming
        from the XRPL, sending them to the GUI thread when necessary, and also
        handles making requests to the XRPL when the GUI prompts them.
        """
        self.loop.run_forever()

    async def watch_xrpl_account(self, address, wallet=None):
        """
        This is the task that opens the connection to the XRPL, then handles
        incoming subscription messages by dispatching them to the appropriate
        part of the GUI.
        """
        self.account = address
        self.wallet = wallet

        async with xrpl.asyncio.clients.AsyncWebsocketClient(self.url) as self.client:
            await self.on_connected()
            async for message in self.client:
                mtype = message.get("type")
                if mtype == "ledgerClosed":
                    wx.CallAfter(self.gui.update_ledger, message)
                elif mtype == "transaction":
                    wx.CallAfter(self.gui.add_tx_from_sub, message)
                    response = await self.client.request(xrpl.models.requests.AccountInfo(
                        account=self.account,
                        ledger_index=message["ledger_index"]
                    ))
                    wx.CallAfter(self.gui.update_account, response.result["account_data"])

    async def on_connected(self):
        """
        Set up initial subscriptions and populate the GUI with data from the
        ledger on startup. Requires that self.client be connected first.
        """
        # Set up 2 subscriptions: all new ledgers, and any new transactions that
        # affect the chosen account.
        response = await self.client.request(xrpl.models.requests.Subscribe(
            streams=["ledger"],
            accounts=[self.account]
        ))
        # The immediate response contains details for the last validated ledger.
        # We can use this to fill in that area of the GUI without waiting for a
        # new ledger to close.
        wx.CallAfter(self.gui.update_ledger, response.result)

        # Get starting values for account info.
        response = await self.client.request(xrpl.models.requests.AccountInfo(
            account=self.account,
            ledger_index="validated"
        ))
        if not response.is_successful():
            print("Got error from server:", response)
            # This most often happens if the account in question doesn't exist
            # on the network we're connected to. Better handling would be to use
            # wx.CallAfter to display an error dialog in the GUI and possibly
            # let the user try inputting a different account.
            exit(1)
        wx.CallAfter(self.gui.update_account, response.result["account_data"])
        if self.wallet:
            wx.CallAfter(self.gui.enable_readwrite)
        # Get the first page of the account's transaction history. Depending on
        # the server we're connected to, the account's full history may not be
        # available.
        response = await self.client.request(xrpl.models.requests.AccountTx(
            account=self.account
        ))
        wx.CallAfter(self.gui.update_account_tx, response.result)
        # Look up issued tokens
        response = await self.client.request(xrpl.models.requests.AccountLines(
            account=self.account,
            ledger_index="validated"
        ))
        if not response.is_successful():
            print("Error getting account lines:", response)
        else:
            wx.CallAfter(self.gui.update_account_lines,
                         response.result["lines"])
        # Look up all types of objects attached to the account
        response = await self.client.request(xrpl.models.requests.AccountObjects(
            account=self.account,
            ledger_index="validated"
        ))
        if not response.is_successful():
            print("Error getting account objects:", response)
        else:
            wx.CallAfter(self.gui.update_account_objects,
                         response.result["account_objects"])

    async def set_regular_key(self, wallet):
        """
        Check & set the regular key for this account
        """
        response = await self.client.request(xrpl.models.requests.AccountInfo(
            account=self.account,
            ledger_index="validated"
        ))
        if response.is_successful():
            print("set regular key: got account")
            if response.result["account_data"].get("RegularKey") == wallet.address:
                print("set regular key: regular key matches")
                self.wallet = wallet
                wx.CallAfter(self.gui.enable_readwrite)

    async def check_destination(self, destination, dlg):
        """
        Check a potential destination address's details, and pass them back to
        a "Send XRP" dialog:
        - Is the account funded?
            If not, payments below the reserve base will fail
        - Do they have DisallowXRP enabled?
            If so, the user should be warned they don't want XRP, but can click
            through.
        - Do they have a verified Domain?
            If so, we want to show the user the associated domain info.

        Requires that self.client be connected first.
        """

        # The data to send back to the GUI thread: None for checks that weren't
        # performed, True/False for actual results except where noted.
        account_status = {
            "funded": None,
            "disallow_xrp": None,
            "domain_verified": None,
            "domain_str": "" # the decoded domain, regardless of verification
        }

        # Look up the account. If this fails, the account isn't funded.
        try:
            response = await xrpl.asyncio.account.get_account_info(destination,
                    self.client, ledger_index="validated")
            account_status["funded"] = True
            dest_acct = response.result["account_data"]
        except xrpl.asyncio.clients.exceptions.XRPLRequestFailureException:
            # Not funded, so the other checks don't apply.
            account_status["funded"] = False
            wx.CallAfter(dlg.update_dest_info, account_status)
            return

        # Check DisallowXRP flag
        lsfDisallowXRP = 0x00080000
        if dest_acct["Flags"] & lsfDisallowXRP:
            account_status["disallow_xrp"] = True
        else:
            account_status["disallow_xrp"] = False

        # Check domain verification
        domain, verified = verify_account_domain(dest_acct)
        account_status["domain_verified"] = verified
        account_status["domain_str"] = domain

        # Send data back to the main thread.
        wx.CallAfter(dlg.update_dest_info, account_status)

    async def send_xrp(self, paydata):
        """
        Prepare, sign, and send an XRP payment with the provided parameters.
        Expects a dictionary with:
        {
            "dtag": Destination Tag, as a string, optional
            "to": Destination address (classic or X-address)
            "amt": Amount of decimal XRP to send, as a string
        }
        """
        dtag = paydata.get("dtag", "")
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
            account=self.account,
            destination=paydata["to"],
            amount=xrpl.utils.xrp_to_drops(paydata["amt"]),
            destination_tag=dtag
        )
        # Autofill provides a sequence number, but this may fail if you try to
        # send too many transactions too fast. You can send transactions more
        # rapidly if you track the sequence number more carefully.
        tx_signed = await xrpl.asyncio.transaction.autofill_and_sign(
                tx, self.client, self.wallet)
        await xrpl.asyncio.transaction.submit(tx_signed, self.client)
        wx.CallAfter(self.gui.add_pending_tx, tx_signed)


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
        top-to-bottom, left-to-right, with each inner iterable being a row. Set
        the total number of columns based on the longest iterable.
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

        # Icons to indicate a validation error
        bmp_err = wx.ArtProvider.GetBitmap(wx.ART_ERROR, wx.ART_CMN_DIALOG, size=(16,16))
        self.err_to = wx.StaticBitmap(self, bitmap=bmp_err)
        self.err_dtag = wx.StaticBitmap(self, bitmap=bmp_err)
        self.err_amt = wx.StaticBitmap(self, bitmap=bmp_err)
        self.err_to.Hide()
        self.err_dtag.Hide()
        self.err_amt.Hide()

        # Icons for domain verification
        bmp_check = wx.ArtProvider.GetBitmap(wx.ART_TICK_MARK, wx.ART_CMN_DIALOG, size=(16,16))
        self.domain_text = wx.StaticText(self, label="")
        self.domain_verified = wx.StaticBitmap(self, bitmap=bmp_check)
        self.domain_verified.Hide()

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

        # The "Send" button is functionally an "OK" button except for the text.
        self.btn_send = wx.Button(self, wx.ID_OK, label="Send")
        btn_cancel = wx.Button(self, wx.ID_CANCEL)

        sizer.BulkAdd(((lbl_to, self.txt_to, self.err_to),
                       (self.domain_verified, self.domain_text),
                       (lbl_dtag, self.txt_dtag, self.err_dtag),
                       (lbl_amt, self.txt_amt, self.err_amt),
                       (btn_cancel, self.btn_send)) )
        sizer.Fit(self)

        self.txt_dtag.Bind(wx.EVT_TEXT, self.on_dest_tag_edit)
        self.txt_to.Bind(wx.EVT_TEXT, self.on_to_edit)

    def get_payment_data(self):
        """
        Construct a dictionary with the relevant payment details to pass to the
        worker thread for making a payment. Called after the user clicks "Send".
        """
        return {
            "to": self.txt_to.GetValue().strip(),
            "dtag": self.txt_dtag.GetValue().strip(),
            "amt": self.txt_amt.GetValue(),
        }

    def on_to_edit(self, event):
        """
        When the user edits the "To" field, check that the address is well-
        formatted. If it's an X-address, fill in the destination tag and disable
        it. Also, start a background check to confirm more details about the
        address.
        """
        v = self.txt_to.GetValue().strip()
        # Reset warnings / domain verification
        err_msg = ""
        self.err_to.SetToolTip("")
        self.err_to.Hide()
        self.domain_text.SetLabel("")
        self.domain_verified.Hide()

        if xrpl.core.addresscodec.is_valid_xaddress(v):
            cl_addr, tag, is_test = xrpl.core.addresscodec.xaddress_to_classic_address(v)
            if tag is None: # Not the same as tag = 0
                tag = ""
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
            self.btn_send.Disable()
            err_msg = "Not a valid address."
        elif v == self.parent.classic_address:
            self.btn_send.Disable()
            err_msg = "Can't send XRP to self."
        else:
            self.parent.run_bg_job(self.parent.worker.check_destination(v, self))

        if err_msg:
            self.err_to.SetToolTip(err_msg)
            self.err_to.Show()
        else:
            self.err_to.Hide()

    def on_dest_tag_edit(self, event):
        """
        When the user edits the Destination Tag field, strip non-numeric
        characters from it.
        """
        v = self.txt_dtag.GetValue().strip()
        v = re.sub(r"[^0-9]", "", v)
        self.txt_dtag.ChangeValue(v) # SetValue would generate another EVT_TEXT
        self.txt_dtag.SetInsertionPointEnd()

    def update_dest_info(self, dest_status):
        """
        Update the UI with details provided by a background job to check the
        destination address.
        """
        # Keep existing error message if there is one
        try:
            err_msg = self.err_to.GetToolTip().GetTip().strip()
        except RuntimeError:
            # This method can be called after the dialog it belongs to has been
            # closed. In that case, there's nothing to do here.
            return

        if not dest_status["funded"]:
            err_msg = ("Warning: this account does not exist. The payment will "
                      "fail unless you send enough to fund it.")
        elif dest_status["disallow_xrp"]:
            err_msg = "This account does not want to receive XRP."

        # Domain verification
        bmp_err = wx.ArtProvider.GetBitmap(wx.ART_ERROR, wx.ART_CMN_DIALOG, size=(16,16))
        bmp_check = wx.ArtProvider.GetBitmap(wx.ART_TICK_MARK, wx.ART_CMN_DIALOG, size=(16,16))
        domain = dest_status["domain_str"]
        verified = dest_status["domain_verified"]
        if not domain:
            self.domain_text.Hide()
            self.domain_verified.Hide()
        elif verified:
            self.domain_text.SetLabel(domain)
            self.domain_text.Show()
            self.domain_verified.SetToolTip("Domain verified")
            self.domain_verified.SetBitmap(bmp_check)
            self.domain_verified.Show()
        else:
            self.domain_text.SetLabel(domain)
            self.domain_text.Show()
            self.domain_verified.SetToolTip("Failed to verify domain")
            self.domain_verified.SetBitmap(bmp_err)
            self.domain_verified.Show()

        if err_msg:
            # Disabling the button is optional. These types of errors can be
            # benign, so you could let the user "click through" them.
            #self.btn_send.Disable()
            self.err_to.SetToolTip(err_msg)
            self.err_to.Show()
        else:
            self.btn_send.Enable()
            self.err_to.SetToolTip("")
            self.err_to.Hide()


class TWaXLFrame(wx.Frame):
    """
    Tutorial Wallet for the XRP Ledger (TWaXL)
    user interface, main frame.
    """
    def __init__(self, url, test_network=True):
        wx.Frame.__init__(self, None, title="TWaXL", size=wx.Size(800,400))

        self.test_network = test_network
        self.url = url
        # The ledger's current reserve settings. To be filled in later.
        self.reserve_base = None
        self.reserve_inc = None
        # This account's total XRP reserve including base + owner amounts
        self.reserve_xrp = None

        self.build_ui()

        # Pop up to ask user for their account ---------------------------------
        address, wallet = self.prompt_for_account()
        self.classic_address = address

        # Start background thread for updates from the ledger ------------------
        self.worker = XRPLMonitorThread(url, self)
        self.worker.start()
        self.run_bg_job(self.worker.watch_xrpl_account(address, wallet))

    def build_ui(self):
        """
        Called during __init__ to set up all the GUI components.
        """
        self.tabs = wx.Notebook(self, style=wx.BK_DEFAULT)
        # Tab 1: "Summary" pane ------------------------------------------------
        main_panel = wx.Panel(self.tabs)
        self.tabs.AddPage(main_panel, "Summary")

        self.net_url = wx.StaticText(main_panel, label=f"Server: {self.url}")

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


        # Send XRP button. Disabled until we have a secret key & network connection
        self.sxb = wx.Button(main_panel, label="Send XRP")
        self.sxb.SetToolTip("Disabled in read-only mode.")
        self.sxb.Disable()
        self.Bind(wx.EVT_BUTTON, self.click_send_xrp, source=self.sxb)

        # Add Key button
        self.urkb = wx.Button(main_panel, label="Use Regular Key")
        self.Bind(wx.EVT_BUTTON, self.click_use_rk, source=self.urkb)

        self.ledger_info = wx.StaticText(main_panel, label="Not connected")

        main_sizer = wx.BoxSizer(wx.VERTICAL)
        main_sizer.Add(self.net_url, 0, flag=wx.EXPAND|wx.ALL, border=5)
        main_sizer.Add(self.acct_info_area, 1, flag=wx.EXPAND|wx.ALL, border=5)
        button_bar = wx.BoxSizer(wx.HORIZONTAL)
        button_bar.Add(self.sxb, 0, flag=wx.ALL, border=5)
        button_bar.Add(self.urkb, 0, flag=wx.ALL, border=5)
        main_sizer.Add(button_bar, 0, flag=wx.EXPAND|wx.ALL, border=5)
        main_sizer.Add(self.ledger_info, 1, flag=wx.EXPAND|wx.ALL, border=5)
        main_panel.SetSizer(main_sizer)

        # Tab 2: "Transaction History" pane ------------------------------------
        txhistory_panel = wx.Panel(self.tabs)
        self.tabs.AddPage(txhistory_panel, "Transaction History")
        txhistory_sizer = wx.BoxSizer(wx.VERTICAL)

        self.tx_list = wx.dataview.DataViewListCtrl(txhistory_panel)
        self.tx_list.AppendTextColumn("Confirmed")
        self.tx_list.AppendTextColumn("Type")
        self.tx_list.AppendTextColumn("From")
        self.tx_list.AppendTextColumn("To")
        self.tx_list.AppendTextColumn("Value Delivered")
        self.tx_list.AppendTextColumn("Identifying Hash")
        self.tx_list.AppendTextColumn("Raw JSON")
        txhistory_sizer.Add(self.tx_list, 1, wx.EXPAND|wx.ALL)
        self.pending_tx_rows = {} # Map pending tx hashes to rows in the history UI
        txhistory_panel.SetSizer(txhistory_sizer)

        # Tab 3: "Tokens" pane -------------------------------------------------
        tokens_panel = wx.Panel(self.tabs)
        self.tabs.AddPage(tokens_panel, "Tokens")
        tokens_sizer = wx.BoxSizer(wx.VERTICAL)

        self.tkn_list = wx.dataview.DataViewListCtrl(tokens_panel)
        self.tkn_list.AppendTextColumn("Currency")
        self.tkn_list.AppendTextColumn("Issuer")
        self.tkn_list.AppendTextColumn("Balance")
        self.tkn_list.AppendTextColumn("Limit")
        self.tkn_list.AppendTextColumn("Peer Limit")
        self.tkn_list.AppendToggleColumn("Allows Rippling?", mode=wx.dataview.DATAVIEW_CELL_INERT)
        self.tkn_list.AppendToggleColumn("Frozen?", mode=wx.dataview.DATAVIEW_CELL_INERT)
        self.tkn_list.AppendToggleColumn("Authorized?", mode=wx.dataview.DATAVIEW_CELL_INERT)
        self.tkn_list.AppendToggleColumn("Peer Allows Rippling?", mode=wx.dataview.DATAVIEW_CELL_INERT)
        self.tkn_list.AppendToggleColumn("Frozen by Peer?", mode=wx.dataview.DATAVIEW_CELL_INERT)
        self.tkn_list.AppendToggleColumn("Authorized by Peer?", mode=wx.dataview.DATAVIEW_CELL_INERT)
        tokens_sizer.Add(self.tkn_list, 1, wx.EXPAND|wx.ALL)
        tokens_panel.SetSizer(tokens_sizer)

        # Tab 4: "Objects" pane ------------------------------------------------
        objs_panel = wx.Panel(self.tabs)
        self.tabs.AddPage(objs_panel, "Other Objects")
        objs_sizer = wx.BoxSizer(wx.VERTICAL)
        self.o_list = wx.dataview.DataViewListCtrl(objs_panel)
        self.o_list.AppendTextColumn("Type")
        self.o_list.AppendTextColumn("Summary")
        objs_sizer.Add(self.o_list, 1, wx.EXPAND|wx.ALL)
        objs_panel.SetSizer(objs_sizer)

    def run_bg_job(self, job):
        """
        Schedules a job to run asynchronously in the XRPL worker thread.
        The job should be a Future (for example, from calling an async function)
        """
        task = asyncio.run_coroutine_threadsafe(job, self.worker.loop)

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

    def click_use_rk(self, event):
        """
        Change to using a regular key as the secret.
        """

        addr, wallet = self.prompt_for_account(for_regular_key=True)
        if not wallet:
            print("Didn't get a seed, nevermind")
            return

        self.run_bg_job(self.worker.set_regular_key(wallet))


    def prompt_for_account(self, for_regular_key=False):
        """
        Prompt the user for an account to use, in a base58-encoded format:
        - master key seed: Grants read-write access.
          (assumes the master key pair is not disabled)
        - classic address. Grants read-only access.
        - X-address. Grants read-only access.

        Exits with error code 1 if the user cancels the dialog, if the input
        doesn't match any of the formats, or if the user inputs an X-address
        intended for use on a different network type (test/non-test).

        Populates the classic address and X-address labels in the UI.

        Returns (classic_address, wallet) where wallet is None in read-only mode
        """
        label = ("Please enter an account address (for read-only)"
                " or your master secret (for read-write access).\n"
                "To use a regular key, enter your address here for now.")
        default_val = "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"
        if for_regular_key:
            label = "Enter the regular key seed (for regular-key write access)"
            default_val = ""
        account_dialog = wx.TextEntryDialog(self, label,
                caption="Enter account / seed",
                value=default_val)
        account_dialog.Bind(wx.EVT_TEXT, self.toggle_dialog_style)

        if account_dialog.ShowModal() != wx.ID_OK:
            # If the user presses Cancel on the account entry, exit the app.
            # Or, if this is for the regular key thing, just return quietly
            if for_regular_key:
                return None, None
            exit(1)

        value = account_dialog.GetValue().strip()
        account_dialog.Destroy()

        classic_address = ""
        wallet = None
        x_address = ""

        if xrpl.core.addresscodec.is_valid_xaddress(value):
            x_address = value
            classic_address, dest_tag, test_network = xrpl.core.addresscodec.xaddress_to_classic_address(value)
            if test_network != self.test_network:
                on_net = "a test network" if self.test_network else "Mainnet"
                print(f"X-address {value} is meant for a different network type"
                      f"than this client is connected to."
                      f"(Client is on: {on_net})")
                exit(1)

        elif xrpl.core.addresscodec.is_valid_classic_address(value):
            classic_address = value
            x_address = xrpl.core.addresscodec.classic_address_to_xaddress(
                    value, tag=None, is_test_network=self.test_network)

        else:
            try:
                # Check if it's a valid seed
                seed_bytes, alg = xrpl.core.addresscodec.decode_seed(value)
                wallet = xrpl.wallet.Wallet.from_seed(seed=value)
                x_address = wallet.get_xaddress(is_test=self.test_network)
                classic_address = wallet.address
            except Exception as e:
                print(e)
                exit(1)

        if not for_regular_key:
            # Update the UI with the address values
            self.st_classic_address.SetLabel(classic_address)
            self.st_x_address.SetLabel(x_address)

        return classic_address, wallet

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
        # Save reserve settings so we can calculate account reserve
        self.reserve_base = xrpl.utils.drops_to_xrp(str(message["reserve_base"]))
        self.reserve_inc = xrpl.utils.drops_to_xrp(str(message["reserve_inc"]))

    def calculate_reserve_xrp(self, owner_count):
        """
        Calculates how much XRP the user needs to reserve based on the account's
        OwnerCount and the reserve values in the latest ledger.
        """
        if self.reserve_base == None or self.reserve_inc == None:
            return None
        oc_decimal = Decimal(owner_count)
        reserve_xrp = self.reserve_base + (self.reserve_inc * oc_decimal)
        return reserve_xrp

    def update_account(self, acct):
        """
        Update the account info UI based on an account_info response.
        """
        xrp_balance = str(xrpl.utils.drops_to_xrp(acct["Balance"]))
        self.st_xrp_balance.SetLabel(xrp_balance)

        # Display account reserve and save for calculating max send.
        reserve_xrp = self.calculate_reserve_xrp(acct.get("OwnerCount", 0))
        if reserve_xrp != None:
            self.st_reserve.SetLabel(str(reserve_xrp))
            self.reserve_xrp = reserve_xrp

    def enable_readwrite(self):
        """
        Enable buttons for sending transactions.
        """
        self.sxb.Enable()
        self.sxb.SetToolTip("")

    def displayable_amount(self, a):
        """
        Convert an arbitrary amount value from the XRPL to a string to be
        displayed to the user:
        - Convert drops of XRP to 6-decimal XRP (e.g. '12.345000 XRP')
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
        Add one row to the account transaction history control. Helper function
        called by other methods.
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
        # Note: if you extend the code to do paginated responses, you might want
        # to keep previous history instead of deleting the contents first.
        self.tx_list.DeleteAllItems()
        for t in txs:
            self.add_tx_row(t)

    def add_tx_from_sub(self, t):
        """
        Add 1 transaction to the history based on a subscription stream message.
        Assumes only validated transaction streams (e.g. transactions, accounts)
        not proposed transaction streams.

        Also, send a notification to the user about it.
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

        # Send a notification message (aka a "toast") about the transaction.
        # Note the transaction stream and account_tx include all transactions
        # that "affect" the account, no just ones directly from/to the account.
        # For example, if the account has issued tokens, it gets notified when
        # other users transfer those tokens among themselves.
        notif = wx.adv.NotificationMessage(title="New Transaction", message =
                f"New {t['tx']['TransactionType']} transaction confirmed!")
        notif.SetFlags(wx.ICON_INFORMATION)
        notif.Show()

    def add_pending_tx(self, txm):
        """
        Add a "pending" transaction to the history based on a transaction model
        that was (presumably) just submitted.
        """
        confirmation_time = "(pending)"
        tx_type = txm.transaction_type
        from_acct = txm.account
        if from_acct == self.classic_address:
            from_acct = "(Me)"
        # Some transactions don't have a destination, so we need to handle that.
        to_acct = getattr(txm, "destination", "")
        if to_acct == self.classic_address:
            to_acct = "(Me)"
        # Delivered amount is only known after a transaction is processed, so
        # leave this column empty in the display for pending transactions.
        delivered_amt = ""
        tx_hash = txm.get_hash()
        cols = (confirmation_time, tx_type, from_acct, to_acct, delivered_amt,
                tx_hash, str(txm.to_xrpl()))
        self.tx_list.PrependItem(cols)
        self.pending_tx_rows[tx_hash] = self.tx_list.RowToItem(0)

    def click_send_xrp(self, event):
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
            dlg.Destroy()
            return

        paydata = dlg.get_payment_data()
        dlg.Destroy()
        self.run_bg_job(self.worker.send_xrp(paydata))
        notif = wx.adv.NotificationMessage(title="Sending!", message =
                f"Sending a payment for {paydata['amt']} XRP!")
        notif.SetFlags(wx.ICON_INFORMATION)
        notif.Show()

    def update_account_lines(self, lines):
        """
        Update the Tokens tab based on an account_lines result.
        This doesn't handle pagination.
        """
        self.tkn_list.DeleteAllItems()
        for l in lines:
            self.tkn_list.AppendItem([
                l["currency"],
                l["account"],
                l["balance"],
                l["limit"],
                l["limit_peer"],
                not l.get("no_ripple", False),
                l.get("freeze", False),
                l.get("authorized", False),
                l.get("freeze_peer", False),
                not l.get("no_ripple_peer", False),
                l.get("peer_authorized", False),
            ])

    def update_account_objects(self, objs):
        """
        Update the tab of objects owned with the results of an account_objects
        call, skipping RippleState objects since those are represented in the
        Tokens tab. This doesn't handle pagination.
        """
        self.o_list.DeleteAllItems()
        for o in objs:
            if o["LedgerEntryType"] == "RippleState":
                continue
            elif o["LedgerEntryType"] == "Check":
                check_amt = self.displayable_amount(o["SendMax"])
                summary = f"Deliver up to {check_amt}"
                if o["Account"] == self.classic_address:
                    # Outgoing check
                    summary += f" to {o['Destination']}"
                else:
                    summary += f" from {o['Account']}"
            elif o["LedgerEntryType"] == "DepositPreauth":
                if o["Account"] == self.classic_address:
                    # We authorized them
                    summary = f"Authorized {o['Authorize']}"
                else:
                    summary = f"Authorized by {o['Account']}"
            elif o["LedgerEntryType"] == "Escrow":
                escrow_amt = self.displayable_amount(o["Amount"])
                summary = f"Hold {escrow_amt} "
                if o["Account"] == self.classic_address:
                    # Outgoing escrow
                    summary += f"for {o['Destination']} "
                else:
                    summary += f"from {o['Account']} "
                if o.get("Condition"):
                    summary += "with condition "
                if o.get("FinishAfter"):
                    fa_dt = xrpl.utils.ripple_time_to_datetime(o["FinishAfter"])
                    # Convert datetime to locale-default representation & time zone
                    fa_time = fa_dt.astimezone().strftime("%c")
                    summary += f"until {fa_time} "
                if o.get("CancelAfter"):
                    ca_dt = xrpl.utils.ripple_time_to_datetime(o["CancelAfter"])
                    # Convert datetime to locale-default representation & time zone
                    ca_time = ca_dt.astimezone().strftime("%c")
                    summary += f"or cancel at {ca_time} "
            elif o["LedgerEntryType"] == "Offer":
                # An order we placed in the decentralized exchange
                sell_amt = self.displayable_amount(o["TakerGets"])
                buy_amt = self.displayable_amount(o["TakerPays"])
                summary = f"Trade {sell_amt} to receive {buy_amt}"
            elif o["LedgerEntryType"] == "PayChannel":
                # Payment channels' balance is determined by the amount paid
                # out of the amount funded
                amt_dec = xrpl.utils.drops_to_xrp(o["Amount"])
                bal_dec = xrpl.utils.drops_to_xrp(o["Balance"])
                summary = f"{bal_dec} paid of {amt_dec} XRP"
                if o["Account"] == self.classic_address:
                    # Outgoing channel
                    summary += f" to {o['Destination']}"
                else:
                    summary += f" from {o['Account']}"
            elif o["LedgerEntryType"] == "SignerList":
                summary = f"Quorum: {o['SignerQuorum']}. Signers: "
                summary += ", ".join([
                    f"{se['SignerEntry']['Account']} "
                    f"(Weight: {se['SignerEntry']['SignerWeight']})"
                    for se in o["SignerEntries"]])
            elif o["LedgerEntryType"] == "Ticket":
                summary = f"Ticket #{o['TicketSequence']}"
            else:
                summary = ""
            cols = (o["LedgerEntryType"], summary)
            self.o_list.AppendItem(cols)

if __name__ == "__main__":
    networks = {
        "mainnet": "wss://xrplcluster.com",
        "testnet": "wss://s.altnet.rippletest.net:51233",
        "devnet": "wss://s.devnet.rippletest.net:51233",
    }
    parser = ArgumentParser()
    parser.add_argument("--network", "-n", choices=networks.keys(), default="testnet")
    args = parser.parse_args()

    app = wx.App()
    frame = TWaXLFrame(networks[args.network], test_network=(not args.network=="mainnet"))
    frame.Show()
    app.MainLoop()
