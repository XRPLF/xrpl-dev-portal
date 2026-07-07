import sys

from xrpl.clients import JsonRpcClient
from xrpl.models.transactions import CredentialCreate, PermissionedDomainSet
from xrpl.models.transactions.deposit_preauth import Credential
from xrpl.transaction import submit_and_wait
from xrpl.utils import str_to_hex
from xrpl.wallet import generate_faucet_wallet

# Get issuer wallet and define constants ---------------------------------------
client = JsonRpcClient("https://s.altnet.rippletest.net:51234")
issuer = generate_faucet_wallet(client, debug=True)
subject_address = "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"
credential_type = str_to_hex("my-credential")

# Issue a credential -----------------------------------------------------------
credential_create = CredentialCreate(
    account=issuer.address,
    subject=subject_address,
    credential_type=credential_type,
    # Optionally, add an expiration and URI here too
)
cc_response = submit_and_wait(credential_create, client=client, wallet=issuer)
if cc_response.status != "success":
    print("Failed to submit the CredentialCreate transaction:", cc_response)
    sys.exit(1)
if cc_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    print("CredentialCreate transaction failed with result code",
        cc_response.result["engine_result"]
    )
    sys.exit(2)
print("Successfully created credential.")

# Create a domain --------------------------------------------------------------
p_domain_set = PermissionedDomainSet(
    account=issuer.address,
    accepted_credentials=[
        Credential(
            issuer=issuer.address,
            credential_type=credential_type
        )
    ]
)
pds_response = submit_and_wait(p_domain_set, client=client, wallet=issuer)
if pds_response.status != "success":
    print("Failed to submit the PermissionedDomainSet transaction:",
        pds_response)
    sys.exit(1)
if pds_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    print("PermissionedDomainSet transaction failed with result code",
        pds_response.result["engine_result"]
    )
    sys.exit(2)
print("Successfully created permissioned domain.")

# Find Domain ID in metadata ---------------------------------------------------
# Look for a created ledger entry of type PermissionedDomain and get 
# its ledger entry ID from the AffectedNodes part of the metadata.
#
# Note, an alternative way to get the Domain ID is to calculate it as the
# SHA-512Half of the PermissionedDomain space key, owner's account ID, and the
# sequence number of the transaction that created it.

domain_id = None
for modified_node in pds_response.result["meta"]["AffectedNodes"]:
    if "CreatedNode" in modified_node.keys():
        if modified_node["CreatedNode"]["LedgerEntryType"] == "PermissionedDomain":
            domain_id = modified_node["CreatedNode"]["LedgerIndex"]
            break
if not domain_id:
    print("Couldn't find a created Permissioned Domain in transaction metadata."
          " This is not typical.")
    sys.exit(3)
print("Domain ID of created domain:", domain_id)
