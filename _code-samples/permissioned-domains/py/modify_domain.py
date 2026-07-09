#!/usr/bin/env python
import json
import os
import sys

from xrpl.clients import JsonRpcClient
from xrpl.models.transactions import PermissionedDomainSet
from xrpl.models.transactions.deposit_preauth import Credential
from xrpl.transaction import submit_and_wait
from xrpl.utils import str_to_hex
from xrpl.wallet import Wallet

# Set up client ---------------------------------------------------------------
client = JsonRpcClient("https://s.altnet.rippletest.net:51234")

# Load setup data -------------------------------------------------------------
if not os.path.exists("setup.json"):
    print("ERROR: Config data not found. Did you run create_domain.py first?")
    sys.exit(1)

with open("setup.json") as f:
    config_data = json.load(f)

wallet = Wallet.from_seed(config_data["owner"]["seed"])
if wallet.address != config_data["owner"]["address"]:
    print("ERROR: Address did not match saved value. Did you use the wrong "
          "cryptographic algorithm?"
          "\n\tSaved:", config_data["owner"]["address"],
          "\n\tGenerated:", wallet.address)
    sys.exit(2)

issuer_address = config_data["issuer_address"]
domain_id = config_data["domain_id"]

print("Domain ID:", domain_id)
print("Domain owner:", wallet.address)
print("Credential issuer:", issuer_address)

# Modify a permissioned domain ------------------------------------------------
# To demonstrate updating the domain, this tutorial uses a different credential
# type (issued by the same issuer, unless you modified setup.json)
credential_type = str_to_hex("new-credential-type")

p_domain_set = PermissionedDomainSet(
    account=wallet.address,
    domain_id=domain_id,
    accepted_credentials=[
        Credential(
            issuer=issuer_address,
            credential_type=credential_type
        )
    ]
)
print("Submitting transaction", p_domain_set)
pds_response = submit_and_wait(p_domain_set, client=client, wallet=wallet)
if pds_response.status != "success":
    print("Transaction submission failed:", pds_response)
    sys.exit(1)
print(json.dumps(pds_response.result, indent=2))
result_code = pds_response.result["meta"]["TransactionResult"]
if result_code != "tesSUCCESS":
    print("Transaction failed with result code", result_code)
    sys.exit(3)
print("Successfully modified permissioned domain.")
