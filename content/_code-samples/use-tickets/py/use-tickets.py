from xrpl.clients import JsonRpcClient
from xrpl.models.transactions import TicketCreate, AccountSet
from xrpl.transaction import safe_sign_and_submit_transaction
from xrpl.wallet import Wallet, generate_faucet_wallet
from xrpl.models.requests.account_objects import AccountObjects, AccountObjectType

# Connect to a testnet node
JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
client = JsonRpcClient(JSON_RPC_URL)

# Generate a wallet and request faucet
test_wallet = generate_faucet_wallet(client=client)
myAddr = test_wallet.classic_address

# Construct a TicketCreate transaction, 1 ticket created for future use
tx = TicketCreate(
    account=myAddr,
    ticket_count=1
)

# Sign transaction locally and submit
my_tx_payment_signed = safe_sign_and_submit_transaction(transaction=tx, wallet=test_wallet, client=client)

# Get a Ticket Sequence
get_ticket_sequence = AccountObjects(
    account=myAddr,
    type=AccountObjectType.TICKET
)

response = client.request(get_ticket_sequence)
ticket_sequence = response.result["account_objects"][0]["TicketSequence"]

# Construct Transaction using a Ticket
tx_1 = AccountSet(
    account=myAddr,
    fee="10",
    sequence=0,
    last_ledger_sequence=None,
    ticket_sequence=ticket_sequence
)

# Send transaction (w/ Ticket)
tx_result = safe_sign_and_submit_transaction(transaction=tx_1, client=client, wallet=test_wallet)
result = tx_result.result["engine_result"]

print(f"Account: {myAddr}")
if result == "tesSUCCESS":
    print("Transaction successful!")
elif result == "tefMAX_LEDGER":
    print("Transaction failed to achieve consensus")
elif result == "unknown":
    print("Transaction status unknown")
else:
    print(f"Transaction failed with code {result}")
