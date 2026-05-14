from xrpl.clients import JsonRpcClient
from xrpl.models.requests import ServerState, AccountInfo
from xrpl.utils import drops_to_xrp

# Set up client ----------------------

client = JsonRpcClient("https://xrplcluster.com")

# Look up reserve values ----------------------

response = client.request(ServerState())
validated_ledger = response.result["state"]["validated_ledger"]

base_reserve = validated_ledger["reserve_base"]
reserve_inc = validated_ledger["reserve_inc"]

print(f"Base reserve: {drops_to_xrp(str(base_reserve))} XRP")
print(f"Incremental reserve: {drops_to_xrp(str(reserve_inc))} XRP")

# Look up owner count ----------------------

address = "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"  # replace with any address
response = client.request(AccountInfo(account=address))
owner_count = response.result["account_data"]["OwnerCount"]

# Calculate total reserve ----------------------

total_reserve = base_reserve + (owner_count * reserve_inc)
print(f"Owner count: {owner_count}")
print(f"Total reserve: {drops_to_xrp(str(total_reserve))} XRP")
