from xrpl.clients import JsonRpcClient
from xrpl.models.transactions import TicketCreate, AccountSet
from xrpl.account import get_next_valid_seq_number
from xrpl.transaction import safe_sign_and_submit_transaction
from xrpl.core import keypairs
from xrpl.wallet import Wallet
from xrpl.models.requests.account_info import AccountInfo

myAddr = "rfaNymVS1fEREj4FpNroXVEcVVMph6k2Mt"
mySeed = "ss3GZzmyEBxvwB3LUvsqfa-------"

# Derive and initialize wallet
public, private = keypairs.derive_keypair(mySeed)
wallet_from_seed = Wallet(mySeed, 0)

# Connect to a testnet node
JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
client = JsonRpcClient(JSON_RPC_URL)

# Construct a TicketCreate transaction, 1 ticket created for future use
tx = TicketCreate(
    account=myAddr,
    fee="10",
    ticket_count=1,
    sequence=get_next_valid_seq_number(address=myAddr, client=client)
)

# Sign transaction locally and submit
my_tx_payment_signed = safe_sign_and_submit_transaction(transaction=tx, wallet=wallet_from_seed, client=client)

# Get ticket Sequence
get_ticket = AccountInfo(
    account=myAddr,
    ledger_index="current",
    strict=True
)

response = client.request(get_ticket)
ticket_sequence = response.result["account_data"]["Sequence"]-1

# Construct Transaction using a Ticket
tx_1 = AccountSet(
    account=myAddr,
    fee="10",
    sequence=0,
    last_ledger_sequence=None,
    ticket_sequence=ticket_sequence
)

# Send transaction (w/ Ticket)
result = safe_sign_and_submit_transaction(transaction=tx_1, client=client, wallet=wallet_from_seed)
result = result.result["engine_result"]

if result == "tesSUCCESS":
    print("Transaction successful!")
elif result == "tefMAX_LEDGER":
    print("Transaction failed to achieve consensus")
elif result == "unknown":
    print("Transaction status unknown")
else:
    print(f"Transaction failed with code {result}")
