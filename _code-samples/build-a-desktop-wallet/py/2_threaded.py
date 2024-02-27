# "Build a Wallet" tutorial, step 2: Watch ledger closes from a worker thread.
# This step builds an app architecture that keeps the GUI responsive while
# showing realtime updates to the XRP Ledger.
# License: MIT. https://github.com/XRPLF/xrpl-dev-portal/blob/master/LICENSE

import xrpl
import wx
import asyncio
from threading import Thread

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

    async def watch_xrpl(self):
        """
        This is the task that opens the connection to the XRPL, then handles
        incoming subscription messages by dispatching them to the appropriate
        part of the GUI.
        """

        async with xrpl.asyncio.clients.AsyncWebsocketClient(self.url) as self.client:
            await self.on_connected()
            async for message in self.client:
                mtype = message.get("type")
                if mtype == "ledgerClosed":
                    wx.CallAfter(self.gui.update_ledger, message)

    async def on_connected(self):
        """
        Set up initial subscriptions and populate the GUI with data from the
        ledger on startup. Requires that self.client be connected first.
        """
        # Set up a subscriptions for new ledgers
        response = await self.client.request(xrpl.models.requests.Subscribe(
            streams=["ledger"]
        ))
        # The immediate response contains details for the last validated ledger.
        # We can use this to fill in that area of the GUI without waiting for a
        # new ledger to close.
        wx.CallAfter(self.gui.update_ledger, response.result)


class TWaXLFrame(wx.Frame):
    """
    Tutorial Wallet for the XRP Ledger (TWaXL)
    user interface, main frame.
    """
    def __init__(self, url):
        wx.Frame.__init__(self, None, title="TWaXL", size=wx.Size(800,400))

        self.build_ui()

        # Start background thread for updates from the ledger ------------------
        self.worker = XRPLMonitorThread(url, self)
        self.worker.start()
        self.run_bg_job(self.worker.watch_xrpl())

    def build_ui(self):
        """
        Called during __init__ to set up all the GUI components.
        """
        main_panel = wx.Panel(self)
        self.ledger_info = wx.StaticText(main_panel, label="Not connected")

        main_sizer = wx.BoxSizer(wx.VERTICAL)
        main_sizer.Add(self.ledger_info, 1, flag=wx.EXPAND|wx.ALL, border=5)
        main_panel.SetSizer(main_sizer)

    def run_bg_job(self, job):
        """
        Schedules a job to run asynchronously in the XRPL worker thread.
        The job should be a Future (for example, from calling an async function)
        """
        task = asyncio.run_coroutine_threadsafe(job, self.worker.loop)

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


if __name__ == "__main__":
    WS_URL = "wss://s.altnet.rippletest.net:51233" # Testnet
    app = wx.App()
    frame = TWaXLFrame(WS_URL)
    frame.Show()
    app.MainLoop()
