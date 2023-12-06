# Define the network client
from xrpl.clients import JsonRpcClient
JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
client = JsonRpcClient(JSON_RPC_URL)


# Create a wallet using the testnet faucet:
# https://xrpl.org/xrp-testnet-faucet.html
from xrpl.wallet import generate_faucet_wallet
test_wallet = generate_faucet_wallet(client, debug=True)

# Create an account str from the wallet
test_account = test_wallet.address

# Derive an x-address from the classic address:
# https://xrpaddress.info/
from xrpl.core import addresscodec
test_xaddress = addresscodec.classic_address_to_xaddress(test_account, tag=12345, is_test_network=True)
print("\nClassic address:\n\n", test_account)
print("X-address:\n\n", test_xaddress)


# Look up info about your account
from xrpl.models.requests.account_info import AccountInfo
acct_info = AccountInfo(
    account=test_account,
    ledger_index="validated",
    strict=True,
)
response = client.request(acct_info)
result = response.result
print("response.status: ", response.status)
import json
print(json.dumps(response.result, indent=4, sort_keys=True))
