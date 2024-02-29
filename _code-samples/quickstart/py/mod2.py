import xrpl
from xrpl.clients import JsonRpcClient
from xrpl.wallet import Wallet


testnet_url = "https://s.devnet.rippletest.net:51234"

#####################
# create_trust_line #
#####################

def create_trust_line(seed, issuer, currency, amount):
    """create_trust_line"""
# Get the client
    receiving_wallet = Wallet.from_seed(seed)
    client = JsonRpcClient(testnet_url)
# Define the trust line transaction
    trustline_tx=xrpl.models.transactions.TrustSet(
        account=receiving_wallet.address,
        limit_amount=xrpl.models.amounts.IssuedCurrencyAmount(
            currency=currency,
            issuer=issuer,
            value=int(amount)
        )
    )

    response =  xrpl.transaction.submit_and_wait(trustline_tx,
        client, receiving_wallet)
    return response.result

#################
# send_currency #
#################

def send_currency(seed, destination, currency, amount):
    """send_currency"""
# Get the client
    sending_wallet=Wallet.from_seed(seed)
    client=JsonRpcClient(testnet_url)
# Define the payment transaction.
    send_currency_tx=xrpl.models.transactions.Payment(
        account=sending_wallet.address,
        amount=xrpl.models.amounts.IssuedCurrencyAmount(
            currency=currency,
            value=int(amount),
            issuer=sending_wallet.address
        ),
        destination=destination
    )
    response=xrpl.transaction.submit_and_wait(send_currency_tx, client, sending_wallet)
    return response.result

###############
# get_balance #
###############

def get_balance(sb_account_seed, op_account_seed):
    """get_balance"""
    wallet = Wallet.from_seed(sb_account_seed)
    opWallet = Wallet.from_seed(op_account_seed)
    client=JsonRpcClient(testnet_url)
    balance=xrpl.models.requests.GatewayBalances(
        account=wallet.address,
        ledger_index="validated"
    )
    response = client.request(balance)
    return response.result
    
#####################
# configure_account #
#####################

def configure_account(seed, default_setting):
    """configure_account"""
# Get the client
    wallet=Wallet.from_seed(seed)
    client=JsonRpcClient(testnet_url)
# Create transaction
    if (default_setting):
        setting_tx=xrpl.models.transactions.AccountSet(
            account=wallet.classic_address,
            set_flag=xrpl.models.transactions.AccountSetAsfFlag.ASF_DEFAULT_RIPPLE
        )
    else:
        setting_tx=xrpl.models.transactions.AccountSet(
            account=wallet.classic_address,
            clear_flag=xrpl.models.transactions.AccountSetAsfFlag.ASF_DEFAULT_RIPPLE
        )
    response=xrpl.transaction.submit_and_wait(setting_tx,client,wallet)
    return response.result    
