"""Example of how we can setting a regular key"""
from xrpl.account import get_balance
from xrpl.clients import JsonRpcClient
from xrpl.models.transactions import Payment, SetRegularKey
from xrpl.transaction import autofill_and_sign, send_reliable_submission
from xrpl.wallet import generate_faucet_wallet

# References
# - https://xrpl.org/assign-a-regular-key-pair.html#assign-a-regular-key-pair
# - https://xrpl.org/setregularkey.html#setregularkey
# - https://xrpl.org/change-or-remove-a-regular-key-pair.html

# Create a client to connect to the test network
client = JsonRpcClient("https://s.altnet.rippletest.net:51234")

# Creating two wallets to send money between
wallet1 = generate_faucet_wallet(client, debug=True)
wallet2 = generate_faucet_wallet(client, debug=True)
regular_key_wallet = generate_faucet_wallet(client, debug=True)

# Both balances should be zero since nothing has been sent yet
print("Balances before payment:")
print(get_balance(wallet1.classic_address, client))
print(get_balance(wallet2.classic_address, client))

# Assign key pair (regular_key_wallet) to wallet1 using SetRegularKey transaction
tx = SetRegularKey(
    account=wallet1.classic_address, regular_key=regular_key_wallet.classic_address
)

signed_tx = autofill_and_sign(tx, wallet1, client)
set_regular_key_response = send_reliable_submission(signed_tx, client)

print("Response for successful SetRegularKey tx:")
print(set_regular_key_response)

# Since regular_key_wallet is linked to wallet1,
# walet1 can send payment to wallet2 and have regular_key_wallet sign it
payment = Payment(
    account=wallet1.classic_address,
    destination=wallet2.classic_address,
    amount="1000",
)

signed_payment = autofill_and_sign(payment, regular_key_wallet, client)
payment_response = send_reliable_submission(signed_payment, client)

print("Response for tx signed using Regular Key:")
print(payment_response)

# Balance after sending 1000 from wallet1 to wallet2
print("Balances after payment:")
print(get_balance(wallet1.classic_address, client))
print(get_balance(wallet2.classic_address, client))
