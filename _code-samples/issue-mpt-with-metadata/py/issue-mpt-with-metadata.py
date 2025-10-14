import json
from xrpl.utils import str_to_hex, hex_to_str
from xrpl.clients import JsonRpcClient
from xrpl.wallet import generate_faucet_wallet
from xrpl.transaction import submit_and_wait
from xrpl.models import LedgerEntry, MPTokenIssuanceCreate, MPTokenIssuanceCreateFlag

# Set up client and get a wallet
client = JsonRpcClient("https://s.devnet.rippletest.net:51234")
print("Funding new wallet from faucet...")
wallet = generate_faucet_wallet(client, debug=True)

# Define metadata as JSON
mpt_metadata = {
    "t": "TBILL",
    "n": "T-Bill Yield Token",
    "d": "A yield-bearing stablecoin backed by short-term U.S. Treasuries and money market instruments.",
    "i": "example.org/tbill-icon.png",
    "ac": "rwa",
    "as": "treasury",
    "in": "Example Yield Co.",
    "us": [
        {
            "u": "exampleyield.co/tbill",
            "c": "website",
            "t": "Product Page"
        },
        {
            "u": "exampleyield.co/docs",
            "c": "docs",
            "t": "Yield Token Docs"
        }
    ],
    "ai": {
        "interest_rate": "5.00%",
        "interest_type": "variable",
        "yield_source": "U.S. Treasury Bills",
        "maturity_date": "2045-06-30",
        "cusip": "912796RX0"
    }
}

# Convert JSON to a string (without excess whitespace), then string to hex
mpt_metadata_string = json.dumps(mpt_metadata, separators=(',', ':'))
mpt_metadata_hex = str_to_hex(mpt_metadata_string)

# Define the transaction, including other MPT parameters
mpt_issuance_create = MPTokenIssuanceCreate(
    account=wallet.address,
    asset_scale=4,
    maximum_amount="50000000",
    transfer_fee=0,
    flags=MPTokenIssuanceCreateFlag.TF_MPT_CAN_TRANSFER |
          MPTokenIssuanceCreateFlag.TF_MPT_CAN_TRADE,
    mptoken_metadata=mpt_metadata_hex
)

# Prepare, sign, and submit the transaction
print("Sending MPTokenIssuanceCreate transaction...")
response = submit_and_wait(mpt_issuance_create, client, wallet, autofill=True)
print(json.dumps(response.result, indent=2))

# Check transaction results
result_code = response.result["meta"]["TransactionResult"]
if result_code != "tesSUCCESS":
    print(f"Transaction failed with result code {result_code}")
    exit(1)

issuance_id = response.result["meta"]["mpt_issuance_id"]
print(f"MPToken successfully created with issuance ID {issuance_id}")

# Look up MPT Issuance entry in the validated ledger
print("Confirming MPT Issuance metadata in the validated ledger.")
ledger_entry_response = client.request(LedgerEntry(
    mpt_issuance=issuance_id,
    ledger_index="validated"
))

# Decode the metadata
metadata_blob = ledger_entry_response.result["node"]["MPTokenMetadata"]
decoded_metadata = json.loads(hex_to_str(metadata_blob))
print("Decoded metadata:", decoded_metadata)
