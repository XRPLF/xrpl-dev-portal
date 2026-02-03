import json
from xrpl.clients import JsonRpcClient
from xrpl.models.requests import AccountInfo
from xrpl.models.transactions import SignerEntry, SignerListSet
from xrpl.wallet import generate_faucet_wallet, Wallet
from xrpl.transaction import submit_and_wait

client = JsonRpcClient("https://s.altnet.rippletest.net:51234")

print("Funding new wallet from faucet...")
wallet = generate_faucet_wallet(client)
print(f"""Funded. Master key pair:
  Address: {wallet.address}
  Seed: {wallet.seed}
""")

# Generate key pairs to use as signers -----------------------------------------
# If each signer represents a separate person, they should generate their own
# key pairs and send you just the address. These key pairs don't need to be
# funded accounts in the ledger.
algorithm = "ed25519"
signer_addresses = []
for i in range(3):
    signer = Wallet.create(algorithm=algorithm)
    print(f"""Generated regular key pair:
  Address: {signer.address}
  Seed: {signer.seed}
  Algorithm: {algorithm}
""")
    signer_addresses.append(signer.address)

# Send SignerListSet transaction -----------------------------------------------
# This example sets up a 2-of-3 requirement with all signers weighted equally
signer_list_set_tx = SignerListSet(
    account=wallet.address,
    signer_quorum=2,
    signer_entries=[
        SignerEntry(account=signer_address, signer_weight=1)
        for signer_address in signer_addresses
    ],
)

print(
    "Signing and submitting the SignerListSet transaction:",
    json.dumps(signer_list_set_tx.to_xrpl(), indent=2),
)
try:
    response = submit_and_wait(signer_list_set_tx, client, wallet)
except err:
    print("Submitting SignerListSet transaction failed with error", err)
    exit(1)

# Check result of the SignerListSet transaction --------------------------------
print(json.dumps(response.result, indent=2))
signer_list_set_result_code = response.result["meta"]["TransactionResult"]
if signer_list_set_result_code == "tesSUCCESS":
    print("Signer list set successfully.")
else:
    print(f"SignerListSet failed with code {signer_list_set_result_code}.")
    exit(1)

# Confirm signer list ----------------------------------------------------------
try:
    account_info_resp = client.request(
        AccountInfo(account=wallet.address, ledger_index="validated", signer_lists=True)
    )
except err:
    print("Error requesting account_info:", err)
    exit(1)
if not account_info_resp.is_successful():
    print("Error looking up account:", account_info_resp.result)
    exit(1)

if account_info_resp.result.get("signer_lists"):
    lists = account_info_resp.result["signer_lists"]
    print(f"Account has {len(lists)} signer list(s):")
    for l in lists:
        print(f"  List #{l['SignerListID']} Quorum = {l['SignerQuorum']}")
        for se_wrapper in l["SignerEntries"]:
            se = se_wrapper["SignerEntry"]
            print(f"    Signer {se['Account']} Weight = {se['SignerWeight']}")
else:
    print(f"❌ No signer lists associated with {wallet.address}")
    exit(1)
