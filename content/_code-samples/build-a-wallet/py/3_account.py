# "Build a Wallet" tutorial, step 3: Take account input & show account info

import xrpl
import wx
from threading import Thread
import wx.lib.newevent

# Set up event types to pass info from the worker thread to the main UI thread
GotNewLedger, EVT_NEW_LEDGER = wx.lib.newevent.NewEvent()
GotAccountInfo, EVT_ACCT_INFO = wx.lib.newevent.NewEvent()
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

    def run(self):
        with xrpl.clients.WebsocketClient(self.ws_url) as client:
            # Subscribe to ledger updates
            client.send(xrpl.models.requests.Subscribe(
                id="ledger_sub",
                streams=[xrpl.models.requests.StreamParameter.LEDGER],
                accounts=[self.account]
            ))
            client.send(xrpl.models.requests.AccountInfo(
                id="acct_info",
                account=self.account,
                ledger_index="validated"
            ))
            # Watch for messages in the client
            i = 0 # nonce so we don't reuse request IDs
            for message in client:
                #print(message)
                if message.get("id") == "ledger_sub":
                    # Immediate response to our subscribe command.)
                    wx.QueueEvent(self.notify_window, GotNewLedger(data=message["result"]))
                elif message.get("id") and "acct_info" in message.get("id"):
                    wx.QueueEvent(self.notify_window, GotAccountInfo(data=message["result"]))
                elif message.get("type") == "ledgerClosed":
                    # Ongoing notifications that new ledgers have been validated.
                    wx.QueueEvent(self.notify_window, GotNewLedger(data=message))
                elif message.get("type") == "transaction":
                    # Got a new transaction. Check for updated balances
                    i+=1
                    client.send(xrpl.models.requests.AccountInfo(
                        id=f"acct_info{i}",
                        account=self.account,
                        ledger_index=message["ledger_index"]
                    ))
                else:
                    print("Unhandled message:", message)

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

        self.ledger_info = wx.StaticText(main_panel, label="Not connected")
        main_sizer.Add(self.ledger_info, 1, wx.EXPAND|wx.ALL, 25)

        main_panel.SetSizer(main_sizer)

        account_dialog = wx.TextEntryDialog(self,
                "Please enter an account address (for read-only)"
                " or your secret (for read-write access)",
                caption="Enter account",
                value="rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe")

        if account_dialog.ShowModal() == wx.ID_OK:
            self.set_up_account(account_dialog.GetValue())
            account_dialog.Destroy()
        else:
            # If the user presses Cancel on the account entry, exit the app.
            exit(1)

        self.Bind(EVT_NEW_LEDGER, self.update_ledger)
        self.Bind(EVT_ACCT_INFO, self.update_account)
        XRPLMonitorThread(url, self, self.classic_address).start()

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

if __name__ == "__main__":
    #JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
    #JSON_RPC_URL = "http://localhost:5005/"
    WS_URL = "wss://s.altnet.rippletest.net:51233"

    app = wx.App()
    frame = TWaXLFrame(WS_URL)
    frame.Show()
    app.MainLoop()
