from xrpl.clients import JsonRpcClient
from xrpl.models.requests import AccountObjects, AccountObjectType
from xrpl.models.transactions import AccountSet, TicketCreate
from xrpl.transaction import submit_and_wait
from xrpl.wallet import generate_faucet_wallet

# Set up client and account
JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
client = JsonRpcClient(JSON_RPC_URL)

# Fund wallet
print("Getting a wallet from the faucet...")
wallet = generate_faucet_wallet(client=client)

# Create Tickets
ticket_create = TicketCreate(
    account=wallet.address,
    ticket_count=10,
)
print("Submitting TicketCreate transaction...")
ticket_create_result = submit_and_wait(ticket_create, client, wallet)
print(f"TicketCreate hash: {ticket_create_result.result['hash']}, validated: {ticket_create_result.result['validated']}")

# Check Available Tickets
tickets_response = client.request(AccountObjects(
    account=wallet.address,
    type=AccountObjectType.TICKET,
))
tickets = tickets_response.result["account_objects"]
print(f"Found {len(tickets)} Tickets")

# Choose an arbitrary Ticket to use
use_ticket = tickets[0]["TicketSequence"]
print(f"Using Ticket Sequence: {use_ticket}")

# Use a Ticket
ticketed_tx = AccountSet(
    account=wallet.address,
    ticket_sequence=use_ticket,
    sequence=0,
)
print("Submitting ticketed AccountSet transaction...")
ticketed_result = submit_and_wait(ticketed_tx, client, wallet)
print(f"Ticketed AccountSet hash: {ticketed_result.result['hash']}, validated: {ticketed_result.result['validated']}")
