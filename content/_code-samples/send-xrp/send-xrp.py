# Connect ----------------------------------------------------------------------
from xrpl.clients import JsonRpcClient
testnet_url = "https://s.altnet.rippletest.net:51234"
client = JsonRpcClient(testnet_url)

# Get credentials from the Testnet Faucet -----------------------------------
faucet_url = "https://faucet.altnet.rippletest.net/accounts"
print("Getting a new account from the Testnet faucet...")
from xrpl.wallet import generate_faucet_wallet
test_wallet = generate_faucet_wallet(client, debug=True)

# Prepare transaction ----------------------------------------------------------
from xrpl.ledger import get_latest_validated_ledger_sequence
current_validated_ledger = get_latest_validated_ledger_sequence(client)
min_ledger = current_validated_ledger + 1
max_ledger = min_ledger + 20

from xrpl.models.transactions import Payment
my_payment = Payment(
    account=test_wallet.classic_address,
    amount="22000000",
    destination="rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
    last_ledger_sequence=max_ledger,
    sequence=test_wallet.next_sequence_num,
    fee="10",
)
print("Payment object:", my_payment)
print(f"Can be validated in ledger range: {min_ledger} - {max_ledger}")

# Sign transaction -------------------------------------------------------------
import xrpl.transaction
signed = xrpl.transaction.safe_sign_transaction(my_payment, test_wallet)
print("Signed transaction blob:", signed)

# Submit transaction -----------------------------------------------------------
prelim_result = xrpl.transaction.submit_transaction_blob(signed, client)
print("Preliminary transaction result:", prelim_result)
if not prelim_result.is_successful():
    exit("Submit failed.")
tx_id = prelim_result.result["tx_json"]["hash"]

# Wait for validation ----------------------------------------------------------
from time import sleep
while True:
    sleep(1)
    current_validated_ledger = get_latest_validated_ledger_sequence(client)
    tx_response = xrpl.transaction.get_transaction_from_hash(tx_id, client)
    if tx_response.is_successful():
        if tx_response.result.get("validated"):
            print("Got validated result!")
            print(tx_response)
            print(f"Explorer link: https://testnet.xrpl.org/transactions/{tx_id}")
            break
        else:
            print(f"Results not yet validated... "
                  f"({current_validated_ledger}/{max_ledger})")
    if current_validated_ledger > max_ledger:
        print("max_ledger has passed. Last tx response:", tx_response)
