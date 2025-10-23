# @chunk {"steps": ["connect-tag"]}
# Define the network client
from xrpl.clients import JsonRpcClient
from xrpl.wallet import generate_faucet_wallet
from xrpl.core import addresscodec
from xrpl.models.requests.account_info import AccountInfo
import json

JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
client = JsonRpcClient(JSON_RPC_URL)
print("Connected to Testnet")
# @chunk-end


# @chunk {"steps": ["get-account-create-wallet-tag"]}
# Create a wallet using the Testnet faucet:
# https://xrpl.org/xrp-testnet-faucet.html
print("\nCreating a new wallet and funding it with Testnet XRP...")
test_wallet = generate_faucet_wallet(client, debug=True)
test_account = test_wallet.classic_address
print(f"Wallet: {test_account}")
print(f"Account Testnet Explorer URL: ")
print(f" https://testnet.xrpl.org/accounts/{test_account}")
# @chunk-end


# @chunk {"steps": ["get-account-x-address-tag"]}
# Derive an x-address from the classic address:
# https://xrpaddress.info/
print("\nGenerating an x-address from the classic address...")
test_xaddress = addresscodec.classic_address_to_xaddress(
    test_account,
    tag=12345,
    is_test_network=True
)
print(f"Classic address: {test_account}")
print(f"X-address: {test_xaddress}")
# @chunk-end


# @chunk {"steps": ["query-xrpl-tag"]}
# Look up info about your account
print("\nGetting account info...")
acct_info = AccountInfo(
    account=test_account,
    ledger_index="validated",
    strict=True,
)

response = client.request(acct_info)
result = response.result
print("Response Status: ", response.status)
print(json.dumps(response.result, indent=4, sort_keys=True))
# @chunk-end
