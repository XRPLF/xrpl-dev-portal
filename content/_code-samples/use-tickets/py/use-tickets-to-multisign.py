from xrpl.models.transactions import TicketCreate, AccountSet, SignerListSet, SignerEntry
from xrpl.transaction import sign_and_submit, autofill, multisign, sign
from xrpl.models.requests.account_objects import AccountObjects, AccountObjectType
from xrpl.models.requests.submit_multisigned import SubmitMultisigned
from xrpl.wallet import generate_faucet_wallet
from xrpl.clients import JsonRpcClient

# This code sample shows how to use tickets with multisigning
# to allow you to do a series of transactions in any order while you wait
# for signers to come back with their signatures.
# https://xrpl.org/tickets.html#tickets
# https://xrpl.org/use-tickets.html
# https://xrpl.org/set-up-multi-signing.html#set-up-multi-signing
# https://xrpl.org/send-a-multi-signed-transaction.html#send-a-multi-signed-transaction

# Note that this will only work with xrpl-py version v2.0.0-beta.0 or later

# Connect to a testnet node
JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
client = JsonRpcClient(JSON_RPC_URL)

# Generate a wallet and request faucet
test_wallet = generate_faucet_wallet(client=client)
myAddr = test_wallet.address

print("Setting up all the signers' accounts via the testnet faucet, this may take a while...")
signer_1_wallet = generate_faucet_wallet(client=client)
signer_2_wallet = generate_faucet_wallet(client=client)
signer_3_wallet = generate_faucet_wallet(client=client)

# Set the list of accounts that are able to authorize transactions on behalf of our Account via a multi-sig transaction
signers = [
        SignerEntry(account=signer_1_wallet.address, signer_weight=1),
        SignerEntry(account=signer_2_wallet.address, signer_weight=1),
        SignerEntry(account=signer_3_wallet.address, signer_weight=1)
]

# Display all the signers' account address
print("\nSigners:")
signer_int = 1
for signer in signers:
    print(f"{signer_int}. {signer}")
    signer_int += 1

# A multi-sig transaction is achievable by trusting a list of keys to authorize transactions on behalf of the account
# Construct a SignerList transaction
tx_set_signer_list = SignerListSet(
    account=myAddr,
    signer_quorum=3,
    signer_entries=signers
)

# We'll set the signer_quorum to 3, each key will represent 1 signer weight
# if 3 of the signers sign a particular transaction, it's an authorized transaction on the XRPL

# Sign transaction locally and submit
print("Submitting a SignerListSet transaction to update our account to use our new Signers...")
tx_set_signer_list_signed = sign_and_submit(transaction=tx_set_signer_list, client=client, wallet=test_wallet)

# Construct a TicketCreate transaction, 3 tickets will be created
tx_create_ticket = TicketCreate(
    account=myAddr,
    ticket_count=len(signers)
)

# Sign transaction locally and submit
print("Submitting a TicketCreate transaction to get Ticket Sequences for future transactions...")
tx_create_ticket_signed = sign_and_submit(transaction=tx_create_ticket, client=client, wallet=test_wallet)

# Get a Ticket Sequence
get_ticket_sequence = client.request(AccountObjects(
    account=myAddr,
    type=AccountObjectType.TICKET
))

# Since we created 3 Tickets previously, you're able to choose which Ticket you're going to use
ticket1_sequence = get_ticket_sequence.result["account_objects"][0]["TicketSequence"]
ticket2_sequence = get_ticket_sequence.result["account_objects"][1]["TicketSequence"]
ticket3_sequence = get_ticket_sequence.result["account_objects"][2]["TicketSequence"]

print(f"\nTickets issued:\n"
      f"Ticket 1: {ticket1_sequence}\n"
      f"Ticket 2: {ticket2_sequence}\n"
      f"Ticket 3: {ticket3_sequence}")

ticket_sequence = int(input("\nPick 1 ticket sequence to use for your next multi-sig transaction: "))

# Construct AccountSet Transaction using a Ticket
tx_1 = AccountSet(
    account=myAddr,
    fee="1000",
    sequence=0,
    last_ledger_sequence=None,
    ticket_sequence=ticket_sequence
)

autofilled_account_set_tx = autofill(tx_1, client, len(signers))

# Sign 'tx_1' using all the keys on signers[]
# In a real app, you would share this transaction with key holders for them to sign
# but since we own these accounts for test purposes, we can sign directly here.
tx_result_1 = sign(transaction=autofilled_account_set_tx, wallet=signer_1_wallet, multisign=True)
tx_result_2 = sign(transaction=autofilled_account_set_tx, wallet=signer_2_wallet, multisign=True)
tx_result_3 = sign(transaction=autofilled_account_set_tx, wallet=signer_3_wallet, multisign=True)

print(f"\nTx signature by account 1: {tx_result_1.signers}")
print(f"Tx signature by account 2: {tx_result_2.signers}")
print(f"Tx signature by account 3: {tx_result_3.signers}")

# Combine all the signed transactions from the provided signed txs into a multi-sig transaction
tx_1_filled = multisign(
    transaction=autofilled_account_set_tx,
    tx_list=[
        tx_result_1,
        tx_result_2,
        tx_result_3
    ]
)

response = client.request(SubmitMultisigned(tx_json=tx_1_filled))
result = response.result

print(f"\n Account Set tx result: {result['engine_result']}"
      f"\n            Tx content: {result}\n")

if result['engine_result'] == "tesSUCCESS":
    print("Multi-sig transaction using a Ticket was successful!")
elif result == "terPRE_TICKET":
    print(f"The provided Ticket Sequence {ticket_sequence} does not exist in the ledger")
elif result == "tefMAX_LEDGER":
    print("Transaction failed to achieve consensus")
elif result == "tefPAST_SEQ":
    print("The sequence number is lower than the current sequence number of the account")
elif result == "unknown":
    print("Transaction status unknown")
    print(f"The transaction's engine_result was {result['engine_result']}")
