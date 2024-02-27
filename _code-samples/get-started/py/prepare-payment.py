
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

# Prepare payment
from xrpl.models.transactions import Payment
from xrpl.utils import xrp_to_drops
my_tx_payment = Payment(
    account=test_account,
    amount=xrp_to_drops(22),
    destination="rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
)

# print prepared payment
print(my_tx_payment)

# Sign and submit the transaction
from xrpl.transaction import submit_and_wait

tx_response = submit_and_wait(my_tx_payment, client, test_wallet)

# Print tx response
print("Tx response:", tx_response)
