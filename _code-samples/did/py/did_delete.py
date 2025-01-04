from xrpl.models import DIDDelete
from xrpl.clients import JsonRpcClient
from xrpl.wallet import Wallet
from xrpl.transaction import submit_and_wait


# connect to the xrpl via a client
print("Connecting to client")
client = JsonRpcClient("https://s.altnet.rippletest.net:51234")
print("connected!!!")


# restore an account that has an existing DID
account_did_creator = Wallet.from_seed(seed="sEdTP3iaY4PE9vYm2LBCsrY4LaTpU7m")


# define the account DIDDelete transaction
did_delete_txn = DIDDelete(account=account_did_creator.address)

# sign, submit the did delete transaction and wait for result
print("signed and submitting did delete transaction. awaiting response...")
did_delete_response = submit_and_wait(
    transaction=did_delete_txn,
    wallet=account_did_creator,
    client=client,
)

# Parse response for result
did_delete_result = did_delete_response.result

# Print result and transaction hash
print(did_delete_result["meta"]["TransactionResult"])
print(did_delete_result["hash"])
