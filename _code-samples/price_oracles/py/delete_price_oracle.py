# neccesary imports
from xrpl.wallet import Wallet
from xrpl.clients import JsonRpcClient
from xrpl.models import (
    OracleDelete,
)
from xrpl.transaction import submit_and_wait


print("connecting to the test network")
# Connect to XRPL test network
client = JsonRpcClient("https://s.altnet.rippletest.net:51234")
print("connected!!!")

# input the seed that was generated from running the did_set.py
seed = input("now, enter the seed of the account that owns a Price Oracle object to delete: ")

# create demo wallet or use an existing one as created in the oracle set transaction
oracle_creator = Wallet.from_seed(seed=seed)

# define the oracle document id
# this should be stored offline as the blockchain doesn't retrieve it in requests
oracle_document_id = 1


print("building transaction")
# create price oracle delete transaction
oracle_set = OracleDelete(
    account=oracle_creator.address,
    oracle_document_id=oracle_document_id,
)


print("signing and submitting transaction, awaiting response")
# sign, submit and wait for transaction result
oracle_set_txn_response = submit_and_wait(
    transaction=oracle_set, client=client, wallet=oracle_creator
)


# print the result and transaction hash
print(oracle_set_txn_response.result["meta"]["TransactionResult"])
print(oracle_set_txn_response.result["hash"])

# check if the transaction was successful
if oracle_set_txn_response.result["meta"]["TransactionResult"] == "tesSUCCESS":
    print("oracle deleted successfully")
