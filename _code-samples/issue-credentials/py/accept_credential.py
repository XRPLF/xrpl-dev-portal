#!/usr/bin/env python

from binascii import unhexlify
from os import getenv
from getpass import getpass

from xrpl.clients import JsonRpcClient
from xrpl.models.requests import AccountObjects, AccountObjectType
from xrpl.models.transactions import CredentialAccept
from xrpl.transaction import submit_and_wait
from xrpl.utils import str_to_hex, datetime_to_ripple_time
from xrpl.wallet import Wallet, generate_faucet_wallet

from look_up_credentials import look_up_credentials
from decode_hex import decode_hex

XRPL_SERVER = "https://s.devnet.rippletest.net:51234/"

client = JsonRpcClient(XRPL_SERVER)

def init_wallet():
    seed = getenv("SUBJECT_ACCOUNT_SEED")
    if not seed:
        seed = getpass(prompt='Subject account seed: ',stream=None)
    if not seed:
        print("Please specify the subject's master seed")
        exit(1)
    return Wallet.from_seed(seed=seed)

wallet = init_wallet()

pending_credentials = look_up_credentials(
        client, 
        subject=wallet.address, 
        accepted="yes"
)

prompt = """
Accept a credential?
    0) No, quit."""
for i, cred in enumerate(pending_credentials):
    credential_type_s = decode_hex(cred["CredentialType"])
    prompt += f"\n    {i+1}) '{credential_type_s}' issued by {cred['Issuer']}"

selection = None
options = [str(n) for n in range(len(pending_credentials)+1)]
while selection not in options:
    selection = input(prompt+f"\n Select an option (0-{i+1}): ")

if selection == "0":
    exit(0)

chosen_cred = pending_credentials[int(selection)-1]
tx = CredentialAccept(
    account=wallet.address, 
    credential_type=chosen_cred["CredentialType"],
    issuer=chosen_cred["Issuer"]
)
print("Submitting transaction", tx)
response = submit_and_wait(tx, client=client, wallet=wallet, autofill=True)
print(response)
