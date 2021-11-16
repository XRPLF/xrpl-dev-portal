# "Build a Wallet" tutorial, step 5: Send XRP button.
# This step finally introduces events from the GUI to the worker thread.

import re
import xrpl
import wx
import wx.lib.newevent
import wx.dataview
import wx.adv
from threading import Thread
from decimal import Decimal
from queue import Queue, Empty

class WSResponseError(Exception):
    pass

WSC_TIMEOUT = 0.2
class SmartWSClient(xrpl.clients.WebsocketClient):
    def __init__(self, *args, **kwargs):
        self._handlers = {}
        self._pending_requests = {}
        self._id = 0
        self.jobq = Queue() # for incoming UI events
        super().__init__(*args, **kwargs, timeout=WSC_TIMEOUT)

    def on(self, event_type, callback):
        """
        Map a callback function to a type of event message from the connected
        server. Only supports one callback function per event type.
        """
        self._handlers[event_type] = callback

    def request(self, req_dict, callback):
        if "id" not in req_dict:
            req_dict["id"] = f"__auto_{self._id}"
            self._id += 1
        # Work around xrpl-py quirk where it won't let you instantiate a request
        # in proper WebSocket format because WS uses "command" instead of
        # "method" but xrpl-py checks for "method":
        req_dict["method"] = req_dict["command"]
        del req_dict["command"]

        req = xrpl.models.requests.request.Request.from_xrpl(req_dict)
        req.validate()
        self._pending_requests[req.id] = callback
        self.send(req)

    def run_forever(self):
        while True:
            try:
                req, callback = self.jobq.get(block=False)
                self.request(req, callback)
            except Empty:
                pass

            for message in self:
                if message.get("type") == "response":
                    if message.get("status") == "success":
                        del message["status"]
                    else:
                        raise WSResponseError("Unsuccessful response:", message)

                    msg_id = message.get("id")
                    if msg_id in self._pending_requests:
                        self._pending_requests[msg_id](message)
                        del self._pending_requests[msg_id]
                    else:
                        raise WSResponseError("Response to unknown request:", message)

                elif message.get("type") in self._handlers:
                    self._handlers[message.get("type")](message)

# Set up event types to pass info from the worker thread to the main UI thread
GotNewLedger, EVT_NEW_LEDGER = wx.lib.newevent.NewEvent()
GotAccountInfo, EVT_ACCT_INFO = wx.lib.newevent.NewEvent()
GotAccountTx, EVT_ACCT_TX = wx.lib.newevent.NewEvent()
GotTxSub, EVT_TX_SUB = wx.lib.newevent.NewEvent()

class XRPLMonitorThread(Thread):
    """
    A worker thread to watch for new ledger events and pass the info back to
    the main frame to be shown in the UI. Using a thread lets us maintain the
    responsiveness of the UI while doing work in the background.
    """
    def __init__(self, ws_url, notify_window, classic_address):
        Thread.__init__(self, daemon=True)
        self.notify_window = notify_window
        self.ws_url = ws_url
        self.account = classic_address
        self.client = SmartWSClient(self.ws_url)

    def notify_ledger(self, message):
        wx.QueueEvent(self.notify_window, GotNewLedger(data=message))

    def notify_account(self, message):
        wx.QueueEvent(self.notify_window, GotAccountInfo(data=message["result"]))

    def notify_account_tx(self, message):
        wx.QueueEvent(self.notify_window, GotAccountTx(data=message["result"]))

    def on_transaction(self, message):
        """
        Update our account history and re-check our balance whenever a new
        transaction touches our account.
        """
        self.client.request({
            "command": "account_info",
            "account": self.account,
            "ledger_index": message["ledger_index"]
        }, self.notify_account)
        wx.QueueEvent(self.notify_window, GotTxSub(data=message))

    def run(self):
        self.client.open()
        # Subscribe to ledger updates
        self.client.request({
                "command": "subscribe",
                "streams": ["ledger"],
                "accounts": [self.account]
            },
            lambda message: self.notify_ledger(message["result"])
        )
        self.client.on("ledgerClosed", self.notify_ledger)
        self.client.on("transaction", self.on_transaction)

        # Look up our balance right away
        self.client.request({
                "command": "account_info",
                "account": self.account,
                "ledger_index": "validated"
            },
            self.notify_account
        )
        # Look up our transaction history
        self.client.request({
                "command": "account_tx",
                "account": self.account
            },
            self.notify_account_tx
        )
        # Start looping through messages received. This runs indefinitely.
        self.client.run_forever()

class SendXRPDialog(wx.Dialog):
    def __init__(self, parent, max_send):
        wx.Dialog.__init__(self, parent, title="Send XRP")
        sizer = wx.GridBagSizer(vgap=5, hgap=5)
        self.SetSizer(sizer)
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

        # Lay out the controls in a 2x3 grid
        ctrls = ((lbl_to, self.txt_to),
                 (lbl_dtag, self.txt_dtag),
                 (lbl_amt, self.txt_amt),
                 (btn_cancel, btn_send))
        for x, row in enumerate(ctrls):
            for y, ctrl in enumerate(row):
                sizer.Add(ctrl, (x,y), flag=wx.EXPAND|wx.ALL, border=5)

        sizer.Fit(self)

        self.txt_dtag.Bind(wx.EVT_TEXT, self.onDestTagEdit)
        self.txt_to.Bind(wx.EVT_TEXT, self.onToEdit)

    def onToEdit(self, event):
        v = self.txt_to.GetValue().strip()
        if xrpl.core.addresscodec.is_valid_xaddress(v):
            cl_addr, tag, is_test = xrpl.core.addresscodec.xaddress_to_classic_address(v)
            self.txt_dtag.ChangeValue(str(tag))
            # self.txt_dtag.SetEditable(False)
            self.txt_dtag.Disable()
        elif not self.txt_dtag.IsEditable():
            # Maybe the user erased an X-address from here
            self.txt_dtag.Clear()
            # self.txt_dtag.SetEditable(True)
            self.txt_dtag.Enable()

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
        main_sizer = wx.BoxSizer(wx.VERTICAL)

        self.acct_info_area = wx.StaticBox(main_panel, label="Account Info")
        aia_sizer = wx.GridBagSizer(vgap=5, hgap=5)
        self.acct_info_area.SetSizer(aia_sizer)
        aia_sizer.Add(wx.StaticText(self.acct_info_area, label="Classic Address:"), (0,0))
        self.st_classic_address = wx.StaticText(self.acct_info_area, label="TBD")
        aia_sizer.Add(self.st_classic_address, (0,1))
        aia_sizer.Add(wx.StaticText(self.acct_info_area, label="X-Address:"), (1,0))
        self.st_x_address = wx.StaticText(self.acct_info_area, label="TBD")
        aia_sizer.Add(self.st_x_address, (1,1), flag=wx.EXPAND)
        aia_sizer.Add(wx.StaticText(self.acct_info_area, label="XRP Balance:"), (2,0))
        self.st_xrp_balance = wx.StaticText(self.acct_info_area, label="TBD")
        aia_sizer.Add(self.st_xrp_balance, (2,1), flag=wx.EXPAND)

        main_sizer.Add(self.acct_info_area, 1, wx.EXPAND|wx.ALL, 25)

        ## Send XRP button.
        self.sxb = wx.Button(main_panel, label="Send XRP")
        self.sxb.Disable()
        main_sizer.Add(self.sxb, 1, wx.ALL, 25)

        self.ledger_info = wx.StaticText(main_panel, label="Not connected")
        main_sizer.Add(self.ledger_info, 1, wx.EXPAND|wx.ALL, 25)

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
                value="snX6rmeLQasF2fLswCB7C4PwMSPD7")#TODO: remove test secret

        if account_dialog.ShowModal() == wx.ID_OK:
            self.set_up_account(account_dialog.GetValue())
            account_dialog.Destroy()
        else:
            # If the user presses Cancel on the account entry, exit the app.
            exit(1)

        # Attach handlers and start bg thread for updates from the ledger ------
        self.Bind(wx.EVT_BUTTON, self.send_xrp, source=self.sxb)
        self.Bind(EVT_NEW_LEDGER, self.update_ledger)
        self.Bind(EVT_ACCT_INFO, self.update_account)
        self.Bind(EVT_ACCT_TX, self.update_account_tx)
        self.Bind(EVT_TX_SUB, self.add_tx_from_sub)
        self.worker = XRPLMonitorThread(url, self, self.classic_address)
        self.worker.start()

    def set_up_account(self, value):
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

        elif xrpl.core.addresscodec.is_valid_classic_address(value):
            self.xaddress = xrpl.core.addresscodec.classic_address_to_xaddress(
                    value, tag=None, is_test_network=self.test_network)
            self.classic_address = value
            self.wallet = None

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

    def update_ledger(self, event):
        message = event.data
        close_time_iso = xrpl.utils.ripple_time_to_datetime(message["ledger_time"]).isoformat()
        self.ledger_info.SetLabel(f"Latest validated ledger:\n"
                         f"Ledger Index: {message['ledger_index']}\n"
                         f"Ledger Hash: {message['ledger_hash']}\n"
                         f"Close time: {close_time_iso}")

    def update_account(self, event):
        acct = event.data["account_data"]
        xrp_balance = str(xrpl.utils.drops_to_xrp(acct["Balance"]))
        self.st_xrp_balance.SetLabel(xrp_balance)
        self.wallet.sequence = acct["Sequence"]
        # Now that we have a sequence number we can enable the Send XRP button
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

    def update_account_tx(self, event):
        """
        Update the transaction history tab with information from an account_tx
        response.
        """
        txs = event.data["transactions"]
        # TODO: with pagination, we should leave existing items
        self.tx_list.DeleteAllItems()
        for t in txs:
            self.add_tx_row(t)

    def add_tx_from_sub(self, event):
        """
        Add 1 transaction to the history based on a subscription stream message.
        Assumes only validated transaction streams (e.g. transactions, accounts)
        not proposed transaction streams.

        Also send a notification to the user about it.
        """
        t = event.data
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

    def send_xrp(self, event):
        """
        Pop up a dialog for the user to input how much XRP to send where, and
        send the transaction (if the user doesn't cancel).
        """
        xrp_bal = Decimal(self.st_xrp_balance.GetLabelText())
        tx_cost = Decimal("0.000010")
        dlg = SendXRPDialog(self, max_send=float(xrp_bal - tx_cost))
        dlg.CenterOnScreen()
        resp = dlg.ShowModal()
        if resp != wx.ID_OK:
            print("Send XRP canceled")
            return

        paydata = dlg.GetPaymentData()

        # TODO: can we safely autofill with the client in another thread??

        tx = {
            "TransactionType": "Payment",
            "Account": self.classic_address,
            "Sequence": self.wallet.sequence,
            "Destination": paydata["to"],
            "Amount": xrpl.utils.xrp_to_drops(paydata["amt"]),
            "Fee": "10",
            #TODO: LLS
            "Flags": 0
        }
        dtag = paydata.get("dtag")
        if dtag is not None and dtag != "":
            try:
                dtag = int(dtag)
                if dtag < 0 or dtag > 2**32-1:
                    raise ValueError("Destination tag must be a 32-bit unsigned integer")
            except ValueError as e:
                print("Invalid destination tag:", e)
                print("Canceled sending payment.")
                return
            tx["DestinationTag"] = dtag
        txm = xrpl.models.transactions.transaction.Transaction.from_xrpl(tx)
        signed_tx = xrpl.transaction.safe_sign_transaction(txm, self.wallet)
        tx_blob = xrpl.core.binarycodec.encode(signed_tx.to_xrpl())
        req = {
            "command": "submit",
            "tx_blob": tx_blob
        }
        nop = lambda x: x # TODO: actually handle response from sending
        self.worker.client.jobq.put( (req, nop) )
        self.add_pending_tx(signed_tx)


if __name__ == "__main__":
    #JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
    #JSON_RPC_URL = "http://localhost:5005/"
    WS_URL = "wss://s.altnet.rippletest.net:51233"

    app = wx.App()
    frame = TWaXLFrame(WS_URL)
    frame.Show()
    app.MainLoop()
