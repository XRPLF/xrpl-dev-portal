import xrpl

testnet_url = "https://s.devnet.rippletest.net:51234/"

def get_account(seed):
    """get_account"""
    client = xrpl.clients.JsonRpcClient(testnet_url)
    if (seed == ''):
        new_wallet = xrpl.wallet.generate_faucet_wallet(client)
    else:
        new_wallet = xrpl.wallet.Wallet.from_seed(seed)
    return new_wallet

def get_account_info(accountId):
    """get_account_info"""
    client = xrpl.clients.JsonRpcClient(testnet_url)
    acct_info = xrpl.models.requests.account_info.AccountInfo(
        account=accountId,
        ledger_index="validated"
    )
    response = client.request(acct_info)
    return response.result['account_data']

def send_xrp(seed, amount, destination):
    sending_wallet = xrpl.wallet.Wallet.from_seed(seed)
    client = xrpl.clients.JsonRpcClient(testnet_url)
    payment = xrpl.models.transactions.Payment(
        account=sending_wallet.address,
        amount=xrpl.utils.xrp_to_drops(int(amount)),
        destination=destination,
    )
    try:	
        response = xrpl.transaction.submit_and_wait(payment, client, sending_wallet)	
    except xrpl.transaction.XRPLReliableSubmissionException as e:	
        response = f"Submit failed: {e}"

    return response
