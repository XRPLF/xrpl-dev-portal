import xrpl
import json

def get_account(_seed):
    from xrpl.clients import JsonRpcClient
    from xrpl.wallet import Wallet
    JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
    client = JsonRpcClient(JSON_RPC_URL)
    if (_seed == ''):
        new_wallet = xrpl.wallet.generate_faucet_wallet(client)
    else:
        new_wallet = Wallet(_seed, sequence = 79396029)
    return(new_wallet)

def get_account_info(_accountId):
    from xrpl.clients import JsonRpcClient
    from xrpl.models.requests.account_info import AccountInfo
    import json
    JSON_RPC_URL = 'wss://s.altnet.rippletest.net:51234'
    client = JsonRpcClient(JSON_RPC_URL)
    acct_info = AccountInfo(
        account=_accountId,
        ledger_index="validated"
    )
    response = client.request(acct_info)
    return response.result['account_data']

def send_xrp(_seed, _amount, _destination):
    from xrpl.clients import JsonRpcClient
    from xrpl.wallet import Wallet
    sending_wallet = Wallet(_seed, sequence = 16237283)
    testnet_url = "https://s.altnet.rippletest.net:51234"
    client = JsonRpcClient(testnet_url)
    payment = xrpl.models.transactions.Payment(
        account=sending_wallet.classic_address,
        amount=xrpl.utils.xrp_to_drops(int(_amount)),
        destination=_destination,
    )
    signed_tx = xrpl.transaction.safe_sign_and_autofill_transaction(
        payment, sending_wallet, client)   
 #   max_ledger = signed_tx.last_ledger_sequence
 #   tx_id = signed_tx.get_hash()
    try:
        tx_response = xrpl.transaction.send_reliable_submission(signed_tx,client)
        response = tx_response
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        response = f"Submit failed: {e}"
    return response

