# Connect to the XRPL Ledger via websocket and subscribe to an account
# depends on websocket-client: exec `pip3 install websocket-client` to install

import os
import json
from contextlib import closing
from websocket import create_connection

testnet_websocket_addr = os.getenv("WEBSOCKET_ADDR", "wss://s.altnet.rippletest.net:51233")

# connect to websocket
with closing(create_connection(testnet_websocket_addr)) as ws:
    # send a subscribe command with a target XRPL account
    subscribe_cmd = json.dumps({
        'command': 'subscribe',
        # "streams": ["ledger"],  # monitor new ledger
        'accounts': ['rUCzEr6jrEyMpjhs4wSdQdz4g8Y382NxfM']
    })
    ws.send(subscribe_cmd)

    # keep reading from websocket
    while True:
        print(ws.recv())
