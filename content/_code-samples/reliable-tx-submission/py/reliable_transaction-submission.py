"""Example of how to send a transaction and see its validation response"""
from xrpl.account import get_balance
from xrpl.clients import JsonRpcClient
from xrpl.models.requests import Tx
from xrpl.models.transactions import Payment
from xrpl.transaction import submit_and_wait
from xrpl.wallet import generate_faucet_wallet

# References:
# - https://xrpl.org/reliable-transaction-submission.html
# - https://xrpl.org/send-xrp.html
# - https://xrpl.org/look-up-transaction-results.html

# Create a client to connect to the test network
client = JsonRpcClient("https://s.altnet.rippletest.net:51234")

# Creating two wallets to send money between
wallet1 = generate_faucet_wallet(client, debug=True)
wallet2 = generate_faucet_wallet(client, debug=True)

# Both balances should be zero since nothing has been sent yet
print("Balances of wallets before Payment tx")
print(get_balance(wallet1.address, client))
print(get_balance(wallet2.address, client))

# Create a Payment transaction
payment_tx = Payment(
    account=wallet1.address,
    amount="1000",
    destination=wallet2.address,
)

# Autofill, sign, and submit the transaction
payment_response = submit_and_wait(payment_tx, client, wallet1)
print("Transaction was submitted")

# Create a Transaction request to see transaction
tx_response = client.request(Tx(transaction=payment_response.result["hash"]))

# Check validated field on the transaction
print("Validated:", tx_response.result["validated"])

# Check balances after 1000 was sent from wallet1 to wallet2
print("Balances of wallets after Payment tx:")
print(get_balance(wallet1.address, client))
print(get_balance(wallet2.address, client))
