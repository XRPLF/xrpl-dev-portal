import json

from xrpl.clients import JsonRpcClient
from xrpl.ext.confidential import (
    MPTCrypto,
    decrypt_confidential_balance,
    prepare_confidential_convert,
    prepare_confidential_merge_inbox,
)
from xrpl.models import (
    LedgerEntry,
    MPTokenAuthorize,
    MPTokenIssuanceCreate,
    MPTokenIssuanceCreateFlag,
    MPTokenIssuanceSet,
    Payment,
)
from xrpl.models.requests.ledger_entry import MPToken
from xrpl.transaction import submit_and_wait
from xrpl.utils import encode_mptoken_metadata
from xrpl.wallet import generate_faucet_wallet

# Connect to the network ----------------------
client = JsonRpcClient("https://s.devnet.rippletest.net:51234")

EXPLORER = "https://devnet.xrpl.org"
ticker = "CTST"
supply_amount = 12000

# Fund the accounts ----------------------
# An issuer cannot hold a confidential balance on the account that issues the
# token, because an issuer's own balance is not counted as tokens in
# circulation. Confidential tokens enter circulation through a second account
# the issuer controls, which the ledger treats as a regular holder.
print("\n=== Funding accounts... ===")
issuer = generate_faucet_wallet(client)
issuer_second_account = generate_faucet_wallet(client)
auditor = generate_faucet_wallet(client)
print(f"Issuer address: {issuer.address}")
print(f"Issuer second account address: {issuer_second_account.address}")
print(f"Auditor address: {auditor.address}")

# Generate confidential encryption keypairs ----------------------
# These ElGamal keypairs are separate from the accounts' signing keys.
print("\n=== Generating confidential encryption keypairs... ===")
crypto = MPTCrypto()
issuer_privkey, issuer_pubkey = crypto.generate_keypair()
issuer_second_account_privkey, issuer_second_account_pubkey = crypto.generate_keypair()
auditor_privkey, auditor_pubkey = crypto.generate_keypair()
print(f"Issuer public encryption key: {issuer_pubkey}")
print(f"Second account public encryption key: {issuer_second_account_pubkey}")
print(f"Auditor public encryption key: {auditor_pubkey}")

# Create the MPT issuance ----------------------
print("\n=== Creating the MPT issuance ===")
mpt_metadata = {
    "ticker": ticker,
    "name": "Confidential Token",
    "desc": "A confidential demo token.",
    "icon": "https://example.org/ctst-icon.png",
    "asset_class": "rwa",
    "asset_subclass": "treasury",
    "issuer_name": "Example Financial Corp",
    "additional_info": {
        "interest_rate": "4.25%",
        "interest_type": "fixed",
    },
}

mpt_issuance_create = MPTokenIssuanceCreate(
    account=issuer.address,
    asset_scale=0,
    maximum_amount="1000000000",
    transfer_fee=0,
    flags=MPTokenIssuanceCreateFlag.TF_MPT_CAN_HOLD_CONFIDENTIAL_BALANCE
    | MPTokenIssuanceCreateFlag.TF_MPT_CAN_TRANSFER
    | MPTokenIssuanceCreateFlag.TF_MPT_CAN_CLAWBACK
    | MPTokenIssuanceCreateFlag.TF_MPT_CAN_LOCK,
    mptoken_metadata=encode_mptoken_metadata(mpt_metadata),
)

create_response = submit_and_wait(mpt_issuance_create, client, issuer, autofill=True)
if create_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = create_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to create the MPT issuance: {result_code}")
    exit(1)
mpt_issuance_id = create_response.result["meta"]["mpt_issuance_id"]
print(f"MPT issuance ID: {mpt_issuance_id}")
print(f"{EXPLORER}/transactions/{create_response.result['hash']}")

# Register the encryption keys on the issuance ----------------------
print("\n=== Registering the encryption keys... ===")
mpt_issuance_set = MPTokenIssuanceSet(
    account=issuer.address,
    mptoken_issuance_id=mpt_issuance_id,
    issuer_encryption_key=issuer_pubkey,
    auditor_encryption_key=auditor_pubkey,
)

set_response = submit_and_wait(mpt_issuance_set, client, issuer, autofill=True)
if set_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = set_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to register the encryption keys: {result_code}")
    exit(1)
print("Issuer and auditor encryption keys registered.")
print(f"{EXPLORER}/transactions/{set_response.result['hash']}")

# Authorize the second account ----------------------
print("\n=== Authorizing the issuer second account... ===")
mpt_authorize = MPTokenAuthorize(
    account=issuer_second_account.address,
    mptoken_issuance_id=mpt_issuance_id,
)

authorize_response = submit_and_wait(
    mpt_authorize, client, issuer_second_account, autofill=True
)
if authorize_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = authorize_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to authorize the second account: {result_code}")
    exit(1)
print(f"{issuer_second_account.address} is authorized to hold the MPT.")
print(f"{EXPLORER}/transactions/{authorize_response.result['hash']}")

# Send public tokens to the second account ----------------------
print("\n=== Sending public tokens to the second account... ===")
payment = Payment(
    account=issuer.address,
    destination=issuer_second_account.address,
    amount={
        "mpt_issuance_id": mpt_issuance_id,
        "value": str(supply_amount),
    },
)

payment_response = submit_and_wait(payment, client, issuer, autofill=True)
if payment_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = payment_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to send the payment: {result_code}")
    exit(1)
print(f"Issuer sent {supply_amount} {ticker} to {issuer_second_account.address}.")
print(f"{EXPLORER}/transactions/{payment_response.result['hash']}")

# Convert the public balance to a confidential balance ----------------------
print("\n=== Converting public balance to confidential... ===")
convert_tx = prepare_confidential_convert(
    client,
    issuer_second_account,
    mpt_issuance_id,
    supply_amount,
    issuer_pubkey,
    issuer_second_account_privkey,
    issuer_second_account_pubkey,
    auditor_pubkey,
)
print(json.dumps(convert_tx.to_dict(), indent=2))

convert_response = submit_and_wait(
    convert_tx, client, issuer_second_account, autofill=True
)
if convert_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = convert_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to convert the balance: {result_code}")
    exit(1)
print(f"Converted {supply_amount} {ticker} into a confidential balance.")
print(f"{EXPLORER}/transactions/{convert_response.result['hash']}")

# Merge the inbox into the spending balance ----------------------
# A conversion lands in the inbox balance. Merging folds it into the spending
# balance, which is the only balance a confidential send can draw from.
print("\n=== Merging inbox into spending balance... ===")
merge_tx = prepare_confidential_merge_inbox(
    client, issuer_second_account, mpt_issuance_id
)
print(json.dumps(merge_tx.to_dict(), indent=2))

merge_response = submit_and_wait(merge_tx, client, issuer_second_account, autofill=True)
if merge_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = merge_response.result["meta"]["TransactionResult"]
    print(f"Error: Unable to merge the inbox: {result_code}")
    exit(1)
print("Inbox merged into the spending balance.")
print(f"{EXPLORER}/transactions/{merge_response.result['hash']}")

# Decrypt the confidential balance ----------------------
print("\n=== Decrypting the confidential balance... ===")
mptoken = client.request(
    LedgerEntry(
        mptoken=MPToken(
            mpt_issuance_id=mpt_issuance_id,
            account=issuer_second_account.address,
        ),
    )
).result["node"]
issuance = client.request(
    LedgerEntry(mpt_issuance=mpt_issuance_id),
).result["node"]

# The entry carries the same balance once per registered key, so each party
# reads it with their own private key.
print("MPToken entry:")
print(json.dumps(mptoken, indent=2))

confidential_supply = int(issuance["ConfidentialOutstandingAmount"])

# Only a party holding the matching private key can decrypt the
# balance.
issuer_second_account_balance = decrypt_confidential_balance(
    mptoken["ConfidentialBalanceSpending"],
    issuer_second_account_privkey,
    range_high=confidential_supply,
)
print(
    f"\nSecond account reads its balance as: "
    f"{issuer_second_account_balance} {ticker}"
)

# The auditor reads the same amount from a separate ciphertext on the same
# entry, using its own private key.
auditor_view = decrypt_confidential_balance(
    mptoken["AuditorEncryptedBalance"],
    auditor_privkey,
    range_high=confidential_supply,
)
print(f"Auditor reads the balance as: {auditor_view} {ticker}")

# Save the accounts and keys ----------------------
# MPTCrypto.generate_keypair is not derived from the account seed, and losing an
# encryption private key makes a confidential balance permanently unspendable,
# so write the seeds and keypairs to keys.json.
print("\n=== Saving accounts and keys to keys.json... ===")
keys_data = {
    "description": (
        "This file is auto-generated by issue_confidential_mpt.py. It stores "
        "the account seeds and confidential encryption keypairs that script "
        "created."
    ),
    "issuer": {
        "seed": issuer.seed,
        "privateKey": issuer_privkey,
        "publicKey": issuer_pubkey,
    },
    "issuerSecondAccount": {
        "seed": issuer_second_account.seed,
        "privateKey": issuer_second_account_privkey,
        "publicKey": issuer_second_account_pubkey,
    },
    "auditor": {
        "seed": auditor.seed,
        "privateKey": auditor_privkey,
        "publicKey": auditor_pubkey,
    },
}

with open("keys.json", "w") as keys_file:
    json.dump(keys_data, keys_file, indent=2)
print("Saved keys to file.")
