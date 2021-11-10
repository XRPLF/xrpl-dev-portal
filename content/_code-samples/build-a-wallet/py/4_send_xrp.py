# "Build a Wallet" tutorial, step 4: Send XRP button.

import re
import xrpl
import wx
from threading import Thread
from queue import Queue, Empty
from decimal import Decimal
import wx.lib.newevent

# Set up event types to pass info from the worker thread to the main UI thread
GotNewLedger, EVT_NEW_LEDGER = wx.lib.newevent.NewEvent()
GotAccountInfo, EVT_ACCT_INFO = wx.lib.newevent.NewEvent()

class WSResponseError(Exception):
    pass

WSC_TIMEOUT = 0.2
class SmartWSClient(xrpl.clients.WebsocketClient):
    def __init__(self, *args, **kwargs):
        self._handlers = {}
        self._pending_requests = {}
        self._id = 0
        self.running = False
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
        self.running = True
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

    def on_transaction(self, client, message):
        """
        Re-check the balance whenever a new transaction
        touches the account.
        """
        client.request({
            "command": "account_info",
            "account": self.account,
            "ledger_index": message["ledger_index"]
        }, self.notify_account)

    def run(self):
        client = self.client
        client.open()
        # Subscribe to ledger updates
        client.request({
                "command": "subscribe",
                "streams": ["ledger"],
                "accounts": [self.account]
            },
            lambda message: self.notify_ledger(message["result"])
        )
        client.on("ledgerClosed", self.notify_ledger)
        client.on("transaction", lambda message: self.on_transaction(client, message))

        # Look up our balance right away
        client.request({
                "command": "account_info",
                "account": self.account,
                "ledger_index": "validated"
            },
            self.notify_account
        )
        client.run_forever()

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
            self.txt_dtag.SetEditable(False)
        elif not self.txt_dtag.IsEditable():
            # Maybe the user erased an X-address from here
            self.txt_dtag.Clear()
            self.txt_dtag.SetEditable(True)

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

        main_panel = wx.Panel(self)
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
        main_sizer.Add(self.sxb, 1, wx.ALL, 25)

        self.ledger_info = wx.StaticText(main_panel, label="Not connected")
        main_sizer.Add(self.ledger_info, 1, wx.EXPAND|wx.ALL, 25)

        main_panel.SetSizer(main_sizer)

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

        self.Bind(wx.EVT_BUTTON, self.send_xrp, source=self.sxb)
        self.Bind(EVT_NEW_LEDGER, self.update_ledger)
        self.Bind(EVT_ACCT_INFO, self.update_account)
        self.worker = XRPLMonitorThread(url, self, self.classic_address)
        self.worker.start()
        # XRPLMonitorThread(url, self, self.classic_address).start()

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

    def send_xrp(self, event):
        """
        TODO: make this a full-featured send with a popup
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
        # TODO: confirm we have filled out wallet's sequence first

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


if __name__ == "__main__":
    #JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
    #JSON_RPC_URL = "http://localhost:5005/"
    WS_URL = "wss://s.altnet.rippletest.net:51233"

    app = wx.App()
    frame = TWaXLFrame(WS_URL)
    frame.Show()
    app.MainLoop()
