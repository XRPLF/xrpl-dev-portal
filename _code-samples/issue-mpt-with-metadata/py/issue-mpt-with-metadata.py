import json
from xrpl.utils import str_to_hex
from xrpl.clients import JsonRpcClient
from xrpl.wallet import generate_faucet_wallet
from xrpl.transaction import submit_and_wait
from xrpl.models.transactions import MPTokenIssuanceCreate, MPTokenIssuanceCreateFlag

# Set up client and get a wallet
client = JsonRpcClient("https://s.devnet.rippletest.net:51234")
print("Funding new wallet from faucet...")
wallet = generate_faucet_wallet(client, debug=True)

# Define metadata as JSON
mpt_metadata = {
    "ticker": "TBILL",
    "name": "T-Bill Yield Token",
    "desc": "A yield-bearing stablecoin backed by short-term U.S. Treasuries and money market instruments.",
    "icon": "https://example.org/tbill-icon.png",
    "asset_class": "rwa",
    "asset_subclass": "treasury",
    "issuer_name": "Example Yield Co.",
    "urls": [
        {
            "url": "https://exampleyield.co/tbill",
            "type": "website",
            "title": "Product Page"
        },
        {
            "url": "https://exampleyield.co/docs",
            "type": "docs",
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

# Check transaction results and disconnect
if response.result["meta"]["TransactionResult"] == "tesSUCCESS":
    issuance_id = response.result["meta"]["mpt_issuance_id"]
    print(f"MPToken successfully created with issuance ID {issuance_id}")
