import json
from xrpl.clients import JsonRpcClient
from xrpl.wallet import generate_faucet_wallet, Wallet
from xrpl.models.transactions import SignerListSet, SignerEntry, AccountSet
from xrpl.transaction import (
    autofill,
    multisign,
    sign,
    submit_and_wait
)

client = JsonRpcClient("https://s.altnet.rippletest.net:51234")

print("Funding new wallet from faucet...")
wallet = generate_faucet_wallet(client)
print(f"""Funded. Master key pair:
  Address: {wallet.address}
  Seed: {wallet.seed}
""")
# Set up multi-signing --------------------------------------------------------
# Skip this step if you are using an existing account with multi-signing
# already set up.
algorithm = "ed25519"
signers = []
for i in range(3):
    signer = Wallet.create(algorithm=algorithm)
    print(f"""Generated regular key pair:
  Address: {signer.address}
  Seed: {signer.seed}
  Algorithm: {algorithm}
""")
    signers.append(signer)
signer_entries = [
    SignerEntry(account=signer.address, signer_weight=1) 
    for signer in signers
]
signer_list_set_tx = SignerListSet(
    account=wallet.address,
    signer_quorum=2,
    signer_entries=signer_entries
)
print("Setting up multi-signing...")
try:
    response = submit_and_wait(signer_list_set_tx, client, wallet)
except err:
    print("Submitting SignerListSet transaction failed with error", err)
    exit(1)
list_set_result_code = response.result["meta"]["TransactionResult"]
if list_set_result_code == "tesSUCCESS":
    print("... done.")
else:
    print(f"SignerListSet failed with code {list_set_result_code}.")
    exit(1)

# Prepare transaction ---------------------------------------------------------
# This example uses a no-op AccountSet, but you could send almost any type
# of transaction the same way.
num_signers = 2
tx_prepared = autofill(AccountSet(account=wallet.address), client, num_signers)

print("Transaction ready for signing:")
print(json.dumps(tx_prepared.to_xrpl(), indent=2))

# Collect signatures ----------------------------------------------------------
tx_signed_by_key_1 = sign(tx_prepared, signers[0], multisign=True)
print("Signed by signer #1:", tx_signed_by_key_1)

tx_signed_by_key_2 = sign(tx_prepared, signers[1], multisign=True)
print("Signed by signer #2:", tx_signed_by_key_2)

# Combine signatures and submit -----------------------------------------------
multisigned_tx = multisign(tx_prepared, [tx_signed_by_key_1, tx_signed_by_key_2])
print("Combined multi-signed transaction:")
print(json.dumps(multisigned_tx.to_xrpl(), indent=2))

try:
    response2 = submit_and_wait(multisigned_tx, client)
except err:
    print("Submitting multi-signed transaction failed with error", err)
    exit(1)
multisigned_result_code = response2.result["meta"]["TransactionResult"]

if multisigned_result_code == "tesSUCCESS":
    tx_hash = response2.result["hash"]
    print(f"✅ Multi-signed transaction {tx_hash} succeeded!")
else:
    print(f"❌ Multi-signed transaction failed with result code {multisigned_result_code}")
    exit(1)
