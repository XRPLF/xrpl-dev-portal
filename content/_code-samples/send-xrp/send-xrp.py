# Example Credentials ----------------------------------------------------------
from xrpl.wallet import Wallet
test_wallet = Wallet(seed="sn3nxiW7v8KXzPzAqzyHXbSSKNuN9", sequence=16237283)
print(test_wallet.classic_address) # "rMCcNuTcajgw7YTgBy1sys3b89QqjUrMpH"

# Connect ----------------------------------------------------------------------
import xrpl
testnet_url = "https://s.altnet.rippletest.net:51234"
client = xrpl.clients.JsonRpcClient(testnet_url)

# Get credentials from the Testnet Faucet -----------------------------------
# For production, instead create a Wallet instance as above
faucet_url = "https://faucet.altnet.rippletest.net/accounts"
print("Getting a new account from the Testnet faucet...")
from xrpl.wallet import generate_faucet_wallet
test_wallet = generate_faucet_wallet(client, debug=True)

# Prepare transaction ----------------------------------------------------------
my_payment = xrpl.models.transactions.Payment(
    account=test_wallet.classic_address,
    amount=xrpl.utils.xrp_to_drops(22),
    destination="rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
)
print("Payment object:", my_payment)

# Sign transaction -------------------------------------------------------------
signed_tx = xrpl.transaction.safe_sign_and_autofill_transaction(
        my_payment, test_wallet, client)
max_ledger = signed_tx.last_ledger_sequence
tx_id = signed_tx.get_hash()
print("Signed transaction:", signed_tx)
print("Transaction cost:", xrpl.utils.drops_to_xrp(signed_tx.fee), "XRP")
print("Transaction expires after ledger:", max_ledger)
print("Identifying hash:", tx_id)

# Submit transaction -----------------------------------------------------------
validated_index = xrpl.ledger.get_latest_validated_ledger_sequence(client)
min_ledger = validated_index + 1
print(f"Can be validated in ledger range: {min_ledger} - {max_ledger}")

# Tip: you can use xrpl.transaction.send_reliable_submission(signed_tx, client)
#  to send the transaction and wait for the results to be validated.
try:
    prelim_result = xrpl.transaction.submit_transaction(signed_tx, client)
except xrpl.clients.XRPLRequestFailureException as e:
    exit(f"Submit failed: {e}")
print("Preliminary transaction result:", prelim_result)

# Wait for validation ----------------------------------------------------------
# Note: If you used xrpl.transaction.send_reliable_submission, you can skip this
#  and use the result of that method directly.
from time import sleep
while True:
    sleep(1)
    validated_ledger = xrpl.ledger.get_latest_validated_ledger_sequence(client)
    tx_response = xrpl.transaction.get_transaction_from_hash(tx_id, client)
    if tx_response.is_successful():
        if tx_response.result.get("validated"):
            print("Got validated result!")
            break
        else:
            print(f"Results not yet validated... "
                  f"({validated_ledger}/{max_ledger})")
    if validated_ledger > max_ledger:
        print("max_ledger has passed. Last tx response:", tx_response)

# Check transaction results ----------------------------------------------------
import json
print(json.dumps(tx_response.result, indent=4, sort_keys=True))
print(f"Explorer link: https://testnet.xrpl.org/transactions/{tx_id}")
metadata = tx_response.result.get("meta", {})
if metadata.get("TransactionResult"):
    print("Result code:", metadata["TransactionResult"])
if metadata.get("delivered_amount"):
    print("XRP delivered:", xrpl.utils.drops_to_xrp(
                metadata["delivered_amount"]))
