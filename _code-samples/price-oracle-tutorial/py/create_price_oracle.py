# Create a Price Oracle ----------------------
# This example creates a Price Oracle on the XRP Ledger using the OracleSet
# transaction, funds a new Testnet account via the faucet, and reports the
# transaction result.
import datetime

from xrpl.clients import JsonRpcClient
from xrpl.models import OracleSet
from xrpl.models.transactions.oracle_set import PriceData
from xrpl.transaction import submit_and_wait
from xrpl.utils import str_to_hex
from xrpl.wallet import generate_faucet_wallet

# Connect to the network ----------------------
print("Connecting to the test network...")
client = JsonRpcClient("https://s.altnet.rippletest.net:51234")

# Fund a new account via the Testnet faucet. You can also use an existing
# funded account instead of generating a new one.
oracle_creator = generate_faucet_wallet(client=client)
print(f"\nOracle owner address: {oracle_creator.address}")

# Prepare OracleSet transaction ----------------------
print("\n=== Preparing OracleSet transaction ===\n")

# An arbitrary, caller-chosen ID that uniquely identifies this Oracle object
# for this account. The ledger does not look up this value anywhere else, so
# you must keep track of it yourself (for example, in local storage) to
# reference this specific oracle later.
oracle_document_id = 1

# The name of the data provider, as a hex string.
provider = str_to_hex("provider")

# An optional URI describing the data source, as a hex string.
uri = str_to_hex("sampleprovider.com")

# The timestamp (in seconds since the Ripple Epoch) when the price data was
# last updated. Must be within 4 minutes in the past or 5 minutes in the
# future of the close time of the ledger the transaction is validated in.
last_update_time = int(datetime.datetime.now().timestamp())

# A classification of the asset, such as "currency", "commodity", or
# "index", as a hex string.
asset_class = str_to_hex("currency")

# Define the price data to record. You can provide up to 10 PriceData
# objects in a single OracleSet transaction.
price_data_array = [
    PriceData(
        base_asset="BTC",
        quote_asset="USD",
        asset_price=1000,
        scale=4,
    )
]

oracle_set_tx = OracleSet(
    account=oracle_creator.address,
    oracle_document_id=oracle_document_id,
    provider=provider,
    uri=uri,
    last_update_time=last_update_time,
    asset_class=asset_class,
    price_data_series=price_data_array,
)

# Submit OracleSet transaction ----------------------
print("=== Submitting OracleSet transaction ===\n")
response = submit_and_wait(transaction=oracle_set_tx, client=client, wallet=oracle_creator)

result_code = response.result["meta"]["TransactionResult"]
if result_code != "tesSUCCESS":
    print(f"Error: Unable to create price oracle: {result_code}")
    exit(1)

print("Price oracle created successfully!")
print(f"Transaction hash: {response.result['hash']}")
