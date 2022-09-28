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

# Construct a TicketCreate transaction, 2 ticket created for future use
tx = TicketCreate(
    account=myAddr,
    ticket_count=2
)

# Sign transaction locally and submit
my_tx_payment_signed = safe_sign_and_submit_transaction(transaction=tx, wallet=test_wallet, client=client)

# Get a Ticket Sequence
get_ticket_sequence = AccountObjects(
    account=myAddr,
    type=AccountObjectType.TICKET
)

response = client.request(get_ticket_sequence)

# Since we created 2 Tickets previously, you're able to choose which Ticket you're going to use
ticket1_sequence = response.result["account_objects"][0]["TicketSequence"]
ticket2_sequence = response.result["account_objects"][1]["TicketSequence"]

print(f"Ticket 1: {ticket1_sequence}\n"
      f"Ticket 2: {ticket2_sequence}")

ticket_sequence = int(input("Pick a ticket sequence to use for your next transaction: "))

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
elif result == "terPRE_TICKET":
    print("The provided Ticket Sequence does not exist in the ledger")
elif result == "tefMAX_LEDGER":
    print("Transaction failed to achieve consensus")
elif result == "tefPAST_SEQ":
    print("The sequence number is lower than the current sequence number of the account")
elif result == "unknown":
    print("Transaction status unknown")
else:
    print(f"Transaction failed with code {result}")
