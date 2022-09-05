from xrpl.clients import JsonRpcClient
from xrpl.models.transactions import TicketCreate, AccountSet
from xrpl.transaction import safe_sign_and_submit_transaction
from xrpl.wallet import Wallet
from xrpl.models.requests.account_objects import AccountObjects, AccountObjectType

myAddr = "rLugkhsRxNHroDVJ29anq9UoTcNQdDjXCR"
mySeed = "sARIIQ06xLZulXC1MBeE---------"

# Derive and initialize wallet
wallet_from_seed = Wallet(mySeed, 0)

# Connect to a testnet node
JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
client = JsonRpcClient(JSON_RPC_URL)

# Construct a TicketCreate transaction, 1 ticket created for future use
tx = TicketCreate(
    account=myAddr,
    ticket_count=1
)

# Sign transaction locally and submit
my_tx_payment_signed = safe_sign_and_submit_transaction(transaction=tx, wallet=wallet_from_seed, client=client)

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
tx_result = safe_sign_and_submit_transaction(transaction=tx_1, client=client, wallet=wallet_from_seed)
result = tx_result.result["engine_result"]

if result == "tesSUCCESS":
    print("Transaction successful!")
elif result == "tefMAX_LEDGER":
    print("Transaction failed to achieve consensus")
elif result == "unknown":
    print("Transaction status unknown")
else:
    print(f"Transaction failed with code {result}")
