# Query a Price Oracle ----------------------
# This example looks up every Oracle ledger entry owned by a given account
# and prints the price data each one contains.
from xrpl.clients import JsonRpcClient
from xrpl.models import AccountObjects, AccountObjectType

# Connect to the network ----------------------
print("Connecting to the test network...")
client = JsonRpcClient("https://s.altnet.rippletest.net:51234")

# The account that owns the Price Oracle(s) to look up.
# Replace this with the address of the account that ran create_price_oracle.py.
oracle_owner = "rhgpuipyrUotm8FLJ9wdpvFWHA7uefcroh"

# Check oracles owned by this account ----------------------
print(f"\n=== Checking Oracle objects owned by {oracle_owner} ===\n")
request = AccountObjects(
    account=oracle_owner,
    ledger_index="validated",
    type=AccountObjectType.ORACLE,
)
response = client.request(request)

oracles = response.result.get("account_objects", [])
if not oracles:
    print("No Price Oracle objects found for this account.")
    exit(0)

for oracle in oracles:
    print(f"Oracle ID: {oracle['index']}")
    print(f"  Provider: {oracle['Provider']}")
    print(f"  Asset Class: {oracle['AssetClass']}")
    for price_data_wrapper in oracle.get("PriceDataSeries", []):
        price_data = price_data_wrapper["PriceData"]
        base = price_data["BaseAsset"]
        quote = price_data["QuoteAsset"]
        price = price_data.get("AssetPrice", "(not set)")
        scale = price_data.get("Scale", "(not set)")
        print(f"  {base}/{quote}: {price} (scale: {scale})")
