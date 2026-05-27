from xrpl.clients import JsonRpcClient
from xrpl.models.requests import AccountObjects, AccountObjectType
from xrpl.models.transactions import AccountSet, SignerEntry, SignerListSet, TicketCreate
from xrpl.transaction import autofill, multisign, sign, submit_and_wait
from xrpl.wallet import Wallet, generate_faucet_wallet

# Use Tickets with multi-signing: each Ticket holds a Sequence slot for a
# transaction while you collect signatures from multiple signers.

JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
client = JsonRpcClient(JSON_RPC_URL)

# Set up the main account and three signers.
# Signer accounts only need cryptographically valid keys; the addresses
# don't need to be funded or exist on the ledger.
print("Funding main account from the faucet...")
main_wallet = generate_faucet_wallet(client=client)
signer_1 = Wallet.create()
signer_2 = Wallet.create()
signer_3 = Wallet.create()
print(f"Main account: {main_wallet.address}")

# Configure the signer list (quorum 2 of 3)
print("Submitting SignerListSet...")
signer_list_set = SignerListSet(
    account=main_wallet.address,
    signer_quorum=2,
    signer_entries=[
        SignerEntry(account=signer_1.address, signer_weight=1),
        SignerEntry(account=signer_2.address, signer_weight=1),
        SignerEntry(account=signer_3.address, signer_weight=1),
    ],
)
signer_list_result = submit_and_wait(signer_list_set, client, main_wallet)
print(f"SignerListSet hash: {signer_list_result.result['hash']}")

# Create Tickets
print("Submitting TicketCreate (3 Tickets)...")
ticket_create = TicketCreate(account=main_wallet.address, ticket_count=3)
ticket_create_result = submit_and_wait(ticket_create, client, main_wallet)
print(f"TicketCreate hash: {ticket_create_result.result['hash']}")

# Pick a Ticket
tickets_response = client.request(AccountObjects(
    account=main_wallet.address,
    type=AccountObjectType.TICKET,
))
use_ticket = tickets_response.result["account_objects"][0]["TicketSequence"]
print(f"Using Ticket Sequence: {use_ticket}")

# Prepare a multi-signed transaction that consumes the Ticket.
# Omit last_ledger_sequence so the transaction doesn't expire while
# signatures are being collected.
account_set = AccountSet(
    account=main_wallet.address,
    ticket_sequence=use_ticket,
    sequence=0,
    last_ledger_sequence=None,
)
prepared_tx = autofill(account_set, client, signers_count=3)

# In a real workflow you would share prepared_tx with each signer and
# receive their signed transactions back; here we sign in one process for clarity.
signed_1 = sign(prepared_tx, signer_1, multisign=True)
signed_2 = sign(prepared_tx, signer_2, multisign=True)
signed_3 = sign(prepared_tx, signer_3, multisign=True)

multisigned_tx = multisign(prepared_tx, [signed_1, signed_2, signed_3])
print("Submitting multi-signed AccountSet...")
multisig_result = submit_and_wait(multisigned_tx, client, autofill=False, check_fee=False)
print(f"Multi-sig hash: {multisig_result.result['hash']}, "
      f"result: {multisig_result.result['meta']['TransactionResult']}")
