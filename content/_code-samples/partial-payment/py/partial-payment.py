"""Example of how to handle partial payments"""
from xrpl.clients import JsonRpcClient
from xrpl.models.amounts import IssuedCurrencyAmount
from xrpl.models.requests import AccountLines
from xrpl.models.transactions import Payment, PaymentFlag, TrustSet
from xrpl.transaction import submit_and_wait
from xrpl.wallet import generate_faucet_wallet

# References
# - https://xrpl.org/partial-payments.html#partial-payments
# - https://xrpl.org/payment.html#payment-flags
# - https://xrpl.org/trustset.html#trustset
# - https://xrpl.org/account_lines.html#account_lines

# Create a client to connect to the test network
client = JsonRpcClient("https://s.altnet.rippletest.net:51234")

# Creating two wallets to send money between
wallet1 = generate_faucet_wallet(client, debug=True)
wallet2 = generate_faucet_wallet(client, debug=True)

# Create a TrustSet to issue an IOU `FOO` and set limit on it
trust_set_tx = TrustSet(
    account=wallet2.address,
    limit_amount=IssuedCurrencyAmount(
        currency="FOO",
        value="10000000000",
        issuer=wallet1.address,
    ),
)

# Sign and autofill, then send transaction to the ledger
signed_trust_set_tx = submit_and_wait(trust_set_tx, client, wallet2)

# Both balances should be zero since nothing has been sent yet
print("Balances after trustline is claimed:")
print("Balance of ${wallet1.address} is:")
print((client.request(AccountLines(account=wallet1.address))).result["lines"])
print("Balance of ${wallet2.address} is:")
print((client.request(AccountLines(account=wallet2.address))).result["lines"])

# Create a Payment to send 3840 FOO from wallet1 (issuer) to destination (wallet2)
issue_quantity = "3840"
payment_tx = Payment(
    account=wallet1.address,
    amount=IssuedCurrencyAmount(
        currency="FOO",
        value=issue_quantity,
        issuer=wallet1.address,
    ),
    destination=wallet2.address,
)

# Sign and autofill, then send transaction to the ledger
payment_response = submit_and_wait(payment_tx, client, wallet1)
print("Initial Payment response: ", payment_response)

# Issuer (wallet1) should have -3840 FOO and destination (wallet2) should have 3840 FOO
print("Balances after wallet1 sends 3840 FOO to wallet2:")
print("Balance of ${wallet1.address} is:")
print((client.request(AccountLines(account=wallet1.address))).result["lines"])
print("Balance of ${wallet2.address} is:")
print((client.request(AccountLines(account=wallet2.address))).result["lines"])

# Send money less than the amount specified on 2 conditions:
# 1. Sender has less money than the amount specified in the payment Tx.
# 2. Sender has the tfPartialPayment flag activated.

# Other ways to specify flags are by using Hex code and decimal code.
# eg. For partial payment(tfPartialPayment)
# decimal ->131072, hex -> 0x00020000

# Create Payment to send 4000 (of 3840) FOO from wallet2 to wallet1
partial_payment_tx = Payment(
    account=wallet2.address,
    amount=IssuedCurrencyAmount(
        currency="FOO",
        value="4000",
        issuer=wallet1.address,
    ),
    destination=wallet1.address,
    flags=[PaymentFlag.TF_PARTIAL_PAYMENT],
    send_max=IssuedCurrencyAmount(
        currency="FOO",
        value="1000000",
        issuer=wallet1.address,
    ),
)

# Sign and autofill, then send transaction to the ledger
partial_payment_response = submit_and_wait(partial_payment_tx, client, wallet2)
print("Partial Payment response: ", partial_payment_response)

# Tried sending 4000 of 3840 FOO -> wallet1 and wallet2 should have 0 FOO
print("Balances after Partial Payment, when wallet2 tried to send 4000 FOOs")
print("Balance of ${wallet1.address} is:")
print((client.request(AccountLines(account=wallet1.address))).result["lines"])
print("Balance of ${wallet2.address} is:")
print((client.request(AccountLines(account=wallet2.address))).result["lines"])
