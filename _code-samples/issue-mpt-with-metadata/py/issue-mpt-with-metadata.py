import json
from xrpl.utils import encode_mptoken_metadata, decode_mptoken_metadata
from xrpl.clients import JsonRpcClient
from xrpl.wallet import generate_faucet_wallet
from xrpl.transaction import submit_and_wait
from xrpl.models import LedgerEntry, MPTokenIssuanceCreate, MPTokenIssuanceCreateFlag

# Set up client and get a wallet
client = JsonRpcClient("https://s.devnet.rippletest.net:51234")
print("=== Funding new wallet from faucet... ===")
issuer = generate_faucet_wallet(client, debug=True)

# Define metadata as JSON 
mpt_metadata = {
    "ticker": "TBILL",
    "name": "T-Bill Yield Token",
    "desc": "A yield-bearing stablecoin backed by short-term U.S. Treasuries and money market instruments.",
    "icon": "https://example.org/tbill-icon.png",
    "asset_class": "rwa",
    "asset_subclass": "treasury",
    "issuer_name": "Example Yield Co.",
    "uris": [
        {
            "uri": "https://exampleyield.co/tbill",
            "category": "website",
            "title": "Product Page"
        },
        {
            "uri": "https://exampleyield.co/docs",
            "category": "docs",
            "title": "Yield Token Docs"
        }
    ],
    "additional_info": {
        "interest_rate": "5.00%",
        "interest_type": "variable",
        "yield_source": "U.S. Treasury Bills",
        "maturity_date": "2045-06-30",
        "cusip": "912796RX0"
    }
}

# Encode the metadata.
# The encode_mptoken_metadata function converts the JSON metadata object into
# a compact, hex-encoded string, following the XLS-89 standard.
# https://xls.xrpl.org/xls/XLS-0089-multi-purpose-token-metadata-schema.html
print("\n=== Encoding metadata...===")
mpt_metadata_hex = encode_mptoken_metadata(mpt_metadata)
print("Encoded mpt_metadata_hex:", mpt_metadata_hex)

# Define the transaction, including other MPT parameters
mpt_issuance_create = MPTokenIssuanceCreate(
    account=issuer.address,
    asset_scale=4,
    maximum_amount="50000000",
    transfer_fee=0,
    flags=MPTokenIssuanceCreateFlag.TF_MPT_CAN_TRANSFER |
          MPTokenIssuanceCreateFlag.TF_MPT_CAN_TRADE,
    mptoken_metadata=mpt_metadata_hex
)

# Sign and submit the transaction
print("\n=== Sending MPTokenIssuanceCreate transaction...===")
print(json.dumps(mpt_issuance_create.to_xrpl(), indent=2))
response = submit_and_wait(mpt_issuance_create, client, issuer, autofill=True)

# Check transaction results
print("\n=== Checking MPTokenIssuanceCreate results... ===")
print(json.dumps(response.result, indent=2))
result_code = response.result["meta"]["TransactionResult"]
if result_code != "tesSUCCESS":
    print(f"Transaction failed with result code {result_code}.")
    exit(1)

issuance_id = response.result["meta"]["mpt_issuance_id"]
print(f"\n- MPToken created successfully with issuance ID: {issuance_id}")
print(f"- Explorer URL: https://devnet.xrpl.org/mpt/{issuance_id}")

# Look up MPT Issuance entry in the validated ledger
print("\n=== Confirming MPT Issuance metadata in the validated ledger... ===")
ledger_entry_response = client.request(LedgerEntry(
    mpt_issuance=issuance_id,
    ledger_index="validated"
))

# Decode the metadata.
# The decode_mptoken_metadata function takes a hex-encoded string representing MPT metadata,
# decodes it to a JSON object, and expands any compact field names to their full forms.
metadata_blob = ledger_entry_response.result["node"]["MPTokenMetadata"]
decoded_metadata = decode_mptoken_metadata(metadata_blob)
print("Decoded MPT metadata:\n", json.dumps(decoded_metadata, indent=2))
