#!/usr/bin/env python
import json
import os
import sys

from xrpl.clients import JsonRpcClient
from xrpl.models.transactions import PermissionedDomainDelete
from xrpl.transaction import submit_and_wait
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
          "cryptographic algorithm?\n"
          "\tSaved:", config_data["owner"]["address"],
          "\tGenerated:", wallet.address)
    sys.exit(2)

domain_id = config_data["domain_id"]

print("Domain ID:", domain_id)
print("Domain owner:", wallet.address)

# Delete a permissioned domain ------------------------------------------------
p_domain_del = PermissionedDomainDelete(
    account=wallet.address,
    domain_id=domain_id
)
print("Submitting transaction", p_domain_del)
pdd_response = submit_and_wait(p_domain_del, client=client, wallet=wallet)
if pdd_response.status != "success":
    print("Transaction submission failed:", pdd_response)
    sys.exit(1)
print(json.dumps(pdd_response.result, indent=2))
result_code = pdd_response.result["meta"]["TransactionResult"]
if result_code != "tesSUCCESS":
    print("Transaction failed with result code", result_code)
    sys.exit(3)
print("Successfully deleted permissioned domain.")
