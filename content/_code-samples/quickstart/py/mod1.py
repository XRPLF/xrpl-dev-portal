import xrpl
import json
import xrpl.clients
import xrpl.wallet

def get_account(seed):
    """get_account"""
    JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
    client = xrpl.clients.JsonRpcClient(JSON_RPC_URL)
    if (seed == ''):
        new_wallet = xrpl.wallet.generate_faucet_wallet(client)
    else:
        new_wallet = xrpl.wallet.Wallet(seed, sequence = 79396029)
    return(new_wallet)

def get_account_info(accountId):
    """get_account_info"""
    JSON_RPC_URL = 'wss://s.altnet.rippletest.net:51234'
    client = xrpl.clients.JsonRpcClient(JSON_RPC_URL)
    acct_info = xrpl.models.requests.account_info.AccountInfo(
        account=accountId,
        ledger_index="validated"
    )
    response = client.request(acct_info)
    return response.result['account_data']

def send_xrp(seed, amount, destination):
    sending_wallet = xrpl.wallet.Wallet(seed, sequence = 16237283)
    testnet_url = "https://s.altnet.rippletest.net:51234"
    client = xrpl.clients.JsonRpcClient(testnet_url)
    payment = xrpl.models.transactions.Payment(
        account=sending_wallet.classic_address,
        amount=xrpl.utils.xrp_to_drops(int(amount)),
        destination=destination,
    )
    signed_tx = xrpl.transaction.safe_sign_and_autofill_transaction(
        payment, sending_wallet, client)
    try:
        tx_response = xrpl.transaction.send_reliable_submission(signed_tx,client)
        response = tx_response
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        response = f"Submit failed: {e}"
    return response

