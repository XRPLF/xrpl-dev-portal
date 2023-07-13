# Example Credentials ----------------------------------------------------------
from xrpl.wallet import Wallet
from xrpl.constants import CryptoAlgorithm
test_wallet = Wallet.from_seed(seed="sn3nxiW7v8KXzPzAqzyHXbSSKNuN9", algorithm=CryptoAlgorithm.SECP256K1)
print(test_wallet.address) # "rMCcNuTcajgw7YTgBy1sys3b89QqjUrMpH"

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
    account=test_wallet.address,
    amount=xrpl.utils.xrp_to_drops(22),
    destination="rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
)
print("Payment object:", my_payment)

# Sign transaction -------------------------------------------------------------
signed_tx = xrpl.transaction.autofill_and_sign(
        my_payment, client, test_wallet)
max_ledger = signed_tx.last_ledger_sequence
tx_id = signed_tx.get_hash()
print("Signed transaction:", signed_tx)
print("Transaction cost:", xrpl.utils.drops_to_xrp(signed_tx.fee), "XRP")
print("Transaction expires after ledger:", max_ledger)
print("Identifying hash:", tx_id)

# Submit transaction -----------------------------------------------------------
try:
    tx_response = xrpl.transaction.submit_and_wait(signed_tx, client)
except xrpl.transaction.XRPLReliableSubmissionException as e:
    exit(f"Submit failed: {e}")

# Wait for validation ----------------------------------------------------------
# submit_and_wait() handles this automatically, but it can take 4-7s.

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
