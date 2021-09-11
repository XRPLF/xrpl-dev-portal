# "Build a Wallet" tutorial, step 1: slightly more than "Hello World"

import xrpl
import wx

class TWaXLFrame(wx.Frame):
    """
    Tutorial Wallet for the XRP Ledger (TWaXL)
    user interface, main frame.
    """
    def __init__(self, url):
        super(TWaXLFrame, self).__init__(None, title="TWaXL")

        self.client = xrpl.clients.JsonRpcClient(url)

        main_panel = wx.Panel(self)
        main_sizer = wx.BoxSizer(wx.VERTICAL)
        main_panel.SetSizer(main_sizer)

        st = wx.StaticText(main_panel, label=self.get_validated_ledger())
        main_sizer.Add(st, wx.SizerFlags().Border(wx.TOP|wx.LEFT, 25))

    def get_validated_ledger(self):
        try:
            response = self.client.request(xrpl.models.requests.Ledger(
                ledger_index="validated"
            ))
        except Exception as e:
            return f"Failed to get validated ledger from server. ({e})"

        if response.is_successful():
            return f"Latest validated ledger: {response.result['ledger_index']}"
        else:
            # Connected to the server, but the request failed. This can
            # happen if, for example, the server isn't synced to the network
            # so it doesn't have the latest validated ledger.
            return f"Server returned an error: {response.result['error_message']}"

if __name__ == "__main__":
    JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
    #JSON_RPC_URL = "http://localhost:5005/"

    app = wx.App()
    frame = TWaXLFrame(JSON_RPC_URL)
    frame.Show()
    app.MainLoop()
