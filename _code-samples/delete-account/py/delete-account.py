import os
import json
from dotenv import load_dotenv

from xrpl.clients import JsonRpcClient
from xrpl.wallet import Wallet, generate_faucet_wallet
from xrpl.models.requests import AccountInfo, ServerState, AccountObjects
from xrpl.models.transactions import AccountDelete
from xrpl.transaction import submit_and_wait
from xrpl.utils import get_balance_changes

client = JsonRpcClient("https://s.altnet.rippletest.net:51234")

# Where to send the deleted account's remaining XRP:
DESTINATION_ACCOUNT = "rJjHYTCPpNA3qAM8ZpCDtip3a8xg7B8PFo"  # Testnet faucet

# Load the account to delete from .env file -----------------------------------
# If the seed value is still the default, get a new account from the faucet.
# It won't be deletable immediately.
load_dotenv()
account_seed = os.getenv("ACCOUNT_SEED")
account_algorithm = os.getenv("ACCOUNT_ALGORITHM", "ed25519")

if account_seed == "s████████████████████████████" or not account_seed:
    print("Couldn't load seed from .env; getting account from the faucet.")
    wallet = generate_faucet_wallet(client)
    print(
        f"Got new account from faucet:\n"
        f"    Address: {wallet.address}\n"
        f"    Seed: {wallet.seed}\n"
    )

    print(
        "Edit the .env file to add this seed, then wait until the account can be deleted."
    )
else:
    wallet = Wallet.from_seed(account_seed, algorithm=account_algorithm)
    print(f"Loaded account: {wallet.address}")

# Check account info to see if account can be deleted -------------------------
try:
    acct_info_resp = client.request(
        AccountInfo(account=wallet.address, ledger_index="validated")
    )
except Exception as err:
    print(f"account_info failed with error: {err}")
    exit(1)

acct_info_result = acct_info_resp.result
num_problems = 0

# Check if sequence number is too high
acct_seq = acct_info_result["account_data"]["Sequence"]
last_validated_ledger_index = acct_info_result["ledger_index"]

if acct_seq + 255 > last_validated_ledger_index:
    print(
        f"Account is too new to be deleted.\n"
        f"    Account sequence + 255: {acct_seq + 255}\n"
        f"    Validated ledger index: {last_validated_ledger_index}\n"
        f"    (Sequence + 255 must be less than or equal to the ledger index)"
    )

    # Estimate time until deletability assuming ledgers close every ~3.5 seconds
    est_wait_time_s = (acct_seq + 255 - last_validated_ledger_index) * 3.5
    if est_wait_time_s < 120:
        print(f"Estimate: {est_wait_time_s} seconds until account can be deleted")
    else:
        est_wait_time_m = round(est_wait_time_s / 60)
        print(f"Estimate: {est_wait_time_m} minutes until account can be deleted")

    num_problems += 1
else:
    print(f"OK: Account sequence number ({acct_seq}) is low enough.")

# Check if owner count is too high
owner_count = acct_info_result["account_data"]["OwnerCount"]
if owner_count > 1000:
    print(
        f"Account owns too many objects in the ledger.\n"
        f"    Owner count: {owner_count}\n"
        f"    (Must be 1000 or less)"
    )
    num_problems += 1
else:
    print(f"OK: Account owner count ({owner_count}) is low enough.")

# Check if XRP balance is high enough
# Look up current incremental owner reserve to compare vs account's XRP balance
# using server_state so that both are in drops
try:
    server_state_resp = client.request(ServerState())
except Exception as err:
    print("server_state failed with error:", err)
    exit(1)

validated_ledger = server_state_resp.result["state"].get("validated_ledger", {})
deletion_cost = validated_ledger.get("reserve_inc")

if not deletion_cost:
    print(
        "Couldn't get reserve values from server. Maybe it's not synced to the network?"
    )
    print(json.dumps(server_state_resp.result, indent=2))
    exit(1)

acct_balance = int(acct_info_result["account_data"]["Balance"])
if acct_balance < deletion_cost:
    print(
        f"Account does not have enough XRP to pay the cost of deletion.\n"
        f"    Balance: {acct_balance}\n"
        f"    Cost of account deletion: {deletion_cost}"
    )
    num_problems += 1
else:
    print(f"OK: Account balance ({acct_balance} drops) is high enough.")

# Check if FirstNFTSequence is too high
first_nfq_seq = acct_info_result["account_data"].get("FirstNFTokenSequence", 0)
minted_nfts = acct_info_result["account_data"].get("MintedNFTokens", 0)
if first_nfq_seq + minted_nfts + 255 > last_validated_ledger_index:
    print(f"""Account's FirstNFTokenSequence + MintedNFTokens + 255 is too high.
    Current total: {first_nfq_seq + minted_nfts + 255}
    Validated ledger index: {last_validated_ledger_index}
    (FirstNFTokenSequence + MintedNFTokens + 255 must be less than or equal to the the ledger index)""")
    num_problems += 1
else:
    print("OK: FirstNFTokenSequence + MintedNFTokens is low enough.")

# Check that all issued NFTs have been burned
burned_nfts = acct_info_result["account_data"].get("BurnedNFTokens", 0)
if minted_nfts > burned_nfts:
    print(f"""Account has NFTs outstanding.
    Number of NFTs minted: {minted_nfts}
    Number of NFTs burned: {burned_nfts}""")
    num_problems += 1
else:
    print("OK: No outstanding, un-burned NFTs")

# Stop if any problems were found
if num_problems:
    print(
        f"A total of {num_problems} problem(s) prevent the account from being deleted."
    )
    exit(1)

# Check for deletion blockers -------------------------------------------------
blockers = []
marker = None
ledger_index = "validated"

while True:
    try:
        account_obj_resp = client.request(
            AccountObjects(
                account=wallet.address,
                deletion_blockers_only=True,
                ledger_index=ledger_index,
                marker=marker,
            )
        )
    except Exception as err:
        print(f"account_objects failed with error: {err}")
        exit(1)

    blockers.extend(account_obj_resp.result["account_objects"])

    marker = account_obj_resp.result.get("marker")
    if not marker:
        break

if not blockers:
    print("OK: Account has no deletion blockers.")
else:
    print(f"Account cannot be deleted until {len(blockers)} blocker(s) are removed:")
    for blocker in blockers:
        print(json.dumps(blocker, indent=2))
    exit(1)

# Delete the account ----------------------------------------------------------
account_delete_tx = AccountDelete(
    account=wallet.address, destination=DESTINATION_ACCOUNT
)

print("Signing and submitting the AccountDelete transaction:")
print(json.dumps(account_delete_tx.to_xrpl(), indent=2))
delete_tx_response = submit_and_wait(account_delete_tx, client, wallet, fail_hard=True)

# Check result of the AccountDelete transaction -------------------------------
print(json.dumps(delete_tx_response.result, indent=2))
result_code = delete_tx_response.result["meta"]["TransactionResult"]

if result_code != "tesSUCCESS":
    print(f"AccountDelete failed with code {result_code}.")
    exit(1)

print("Account deleted successfully.")
balance_changes = get_balance_changes(delete_tx_response.result["meta"])
print("Balance changes:", json.dumps(balance_changes, indent=2))
