# Delete a Price Oracle ----------------------
# This example deletes an existing Price Oracle using the OracleDelete
# transaction.
import os

from xrpl.clients import JsonRpcClient
from xrpl.models import OracleDelete
from xrpl.transaction import submit_and_wait
from xrpl.wallet import Wallet

# Connect to the network ----------------------
print("Connecting to the test network...")
client = JsonRpcClient("https://s.altnet.rippletest.net:51234")

# Load the Oracle owner's wallet from an environment variable rather than
# printing or hardcoding a secret key.
seed = os.environ.get("ORACLE_OWNER_SEED")
if not seed:
    seed = input("Enter the seed of the account that owns the Price Oracle to delete: ")
oracle_owner = Wallet.from_seed(seed=seed)

# The same oracle_document_id value used when the Oracle was created.
oracle_document_id = 1

# Prepare OracleDelete transaction ----------------------
print("\n=== Preparing OracleDelete transaction ===\n")
oracle_delete_tx = OracleDelete(
    account=oracle_owner.address,
    oracle_document_id=oracle_document_id,
)

# Submit OracleDelete transaction ----------------------
print("=== Submitting OracleDelete transaction ===\n")
response = submit_and_wait(transaction=oracle_delete_tx, client=client, wallet=oracle_owner)

result_code = response.result["meta"]["TransactionResult"]
if result_code != "tesSUCCESS":
    print(f"Error: Unable to delete price oracle: {result_code}")
    exit(1)

print("Price oracle deleted successfully!")
print(f"Transaction hash: {response.result['hash']}")
