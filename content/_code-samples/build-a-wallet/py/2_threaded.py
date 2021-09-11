# "Build a Wallet" tutorial, step 2: Watch ledger closes from a worker thread.

import xrpl
import wx
# New dependencies
from threading import Thread
import wx.lib.newevent

# Set up an event type to pass info from the worker thread to the main thread
GotNewLedger, EVT_NEW_LEDGER = wx.lib.newevent.NewEvent()
class XRPLMonitorThread(Thread):
    """
    A worker thread to watch for new ledger events and pass the info back to
    the main frame to be shown in the UI. Using a thread lets us maintain the
    responsiveness of the UI while doing work in the background.
    """
    def __init__(self, ws_url, notify_window):
        Thread.__init__(self, daemon=True)
        self.notify_window = notify_window
        self.ws_url = ws_url

    def run(self):
        with xrpl.clients.WebsocketClient(self.ws_url) as client:
            # Subscribe to ledger updates
            client.send(xrpl.models.requests.Subscribe(
                id="ledger_sub",
                streams=[xrpl.models.requests.StreamParameter.LEDGER]
            ))
            # Watch for messages in the client
            for message in client:
                if message.get("id") == "ledger_sub":
                    # Immediate response to our subscribe command.
                    wx.QueueEvent(self.notify_window, GotNewLedger(data=message["result"]))
                elif message.get("type") == "ledgerClosed":
                    # Ongoing notifications that new ledgers have been validated.
                    wx.QueueEvent(self.notify_window, GotNewLedger(data=message))
                else:
                    print("Unhandled message:", message)

class TWaXLFrame(wx.Frame):
    """
    Tutorial Wallet for the XRP Ledger (TWaXL)
    user interface, main frame.
    """
    def __init__(self, url):
        wx.Frame.__init__(self, None, title="TWaXL", size=wx.Size(800,400))

        main_panel = wx.Panel(self)
        main_sizer = wx.BoxSizer(wx.VERTICAL)
        main_panel.SetSizer(main_sizer)

        self.st = wx.StaticText(main_panel, label="Not connected")
        main_sizer.Add(self.st, wx.SizerFlags().Border(wx.TOP|wx.LEFT, 25))

        self.Bind(EVT_NEW_LEDGER, self.update_ledger)
        XRPLMonitorThread(url, self).start()

    def update_ledger(self, event):
        message = event.data
        self.st.SetLabel(f"Latest validated ledger:\n"
                         f"Ledger Index: {message['ledger_index']}\n"
                         f"Ledger Hash: {message['ledger_hash']}")

if __name__ == "__main__":
    #JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
    #JSON_RPC_URL = "http://localhost:5005/"
    WS_URL = "wss://s.altnet.rippletest.net:51233"

    app = wx.App()
    frame = TWaXLFrame(WS_URL)
    frame.Show()
    app.MainLoop()
