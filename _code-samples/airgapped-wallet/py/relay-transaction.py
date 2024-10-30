from xrpl.clients import JsonRpcClient
from xrpl.models.transactions import Payment
from xrpl.transaction import submit_and_wait
from xrpl.utils import drops_to_xrp
import argparse

def connect_node(_node):
    """
    Connects to a node
    """

    JSON_RPC_URL = _node
    _client = JsonRpcClient(url=JSON_RPC_URL)
    print("\n   ---   Connected to Node")
    return _client


def send_transaction(tx_blob):
    """
    Connects to a node -> Send Transaction
    Main Function to send transaction to the XRPL
    """

    client = connect_node("https://s.altnet.rippletest.net:51234/")
    # TESTNET: "https://s.altnet.rippletest.net:51234/"
    # MAINNET: "https://s2.ripple.com:51234/"

    tx = submit_and_wait(transaction=tx_blob, client=client)

    tx_account = tx.result["tx_json"]["Account"]
    tx_hash = tx.result["hash"]
    tx_destination = tx.result["tx_json"]['Destination']
    delivered = tx.result["meta"]["delivered_amount"]
    if type(delivered) == str:
        tx_delivered_amount = f"{drops_to_xrp(delivered)} XRP"
    else:
        tx_delivered_amount = f"{delivered['value']} {delivered['currency']}.{delivered['issuer']}"


    print(f"\n           XRPL Explorer: https://testnet.xrpl.org/transactions/{tx_hash}"
          f"\n              Wallet Used: {tx_account}"
          f"\n         Transaction Hash: {tx_hash}"
          f"\n  Transaction Destination: {tx_destination}"
          f"\n         Amount Delivered: {tx_delivered_amount}"
         )


if __name__ == '__main__':
    p = argparse.ArgumentParser(description='Submit a signed transaction blob')
    p.add_argument('blob', type=str, 
        help='Transaction blob (in hexadecimal) to submit')
    tx_blob = p.parse_args().blob
    send_transaction(tx_blob)
