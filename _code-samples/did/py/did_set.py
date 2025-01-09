# This allows you to create or update a DID
from xrpl.models import DIDSet
from xrpl.clients import JsonRpcClient
from xrpl.wallet import generate_faucet_wallet
from xrpl.transaction import submit_and_wait
from xrpl.utils import str_to_hex


# connect to the xrpl via a client
print("Connecting to client")
client = JsonRpcClient("https://s.altnet.rippletest.net:51234")
print("connected!!!")


# define/generate a wallet / account
account_did_creator = generate_faucet_wallet(client)

print("⭐successfully generated wallet")
print("here's your seed phrase. You'll need it to modify and delete the DID set by this account/wallet")
print(f"seed: {account_did_creator.seed}")

# define the document associated with the DID
document = "did:example:123#public-key-0"

# define the data associated with the DID
# The public attestations of identity credentials associated with the DID.
data = "did:example:123#key-1"

# define the uri associated with the DID
# The Universal Resource Identifier associated with the DID.
uri = "https://example.did.com/123"


# build DID SET transaction
# str_to_hex() converts the inputted string to blockchain understandable hexadecimal
did_set_txn = DIDSet(
    account=account_did_creator.address,
    did_document=str_to_hex(document),
    data=str_to_hex(data),
    uri=str_to_hex(uri),
)


# sign, submit the transaction and wait for the response
print("siging and submitting the transaction, awaiting a response")
did_set_txn_response = submit_and_wait(
    transaction=did_set_txn, client=client, wallet=account_did_creator
)

# Parse response for result
did_set_txn_result = did_set_txn_response.result

# Print result and transaction hash
print(did_set_txn_result["meta"]["TransactionResult"])
print(did_set_txn_result["hash"])
