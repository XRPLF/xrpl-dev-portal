"""
Example of how we can multisign a transaction.
This will only work with version 2.0.0-beta.0 or later.
Reference: https://xrpl.org/multi-signing.html
"""
from xrpl.clients import JsonRpcClient
from xrpl.models.requests import SubmitMultisigned
from xrpl.models.transactions import AccountSet, SignerEntry, SignerListSet
from xrpl.transaction import (
    autofill,
    autofill_and_sign,
    multisign,
    submit_and_wait,
    sign,
)
from xrpl.utils import str_to_hex
from xrpl.wallet import generate_faucet_wallet

client = JsonRpcClient("https://s.altnet.rippletest.net:51234")

# Create a wallets to use for multisigning
# Prints debug info as it creates the wallet
master_wallet = generate_faucet_wallet(client, debug=True)
signer_wallet_1 = generate_faucet_wallet(client, debug=True)
signer_wallet_2 = generate_faucet_wallet(client, debug=True)

signer_entries = [
    SignerEntry(account=signer_wallet_1.address, signer_weight=1),
    SignerEntry(account=signer_wallet_2.address, signer_weight=1),
]
signer_list_set_tx = SignerListSet(
    account=master_wallet.address,
    signer_quorum=2,
    signer_entries=signer_entries,
)
signed_signer_list_set_tx = autofill_and_sign(signer_list_set_tx, client, master_wallet)

print("Constructed SignerListSet and submitting it to the ledger...")
signed_list_set_tx_response = submit_and_wait(
    signed_signer_list_set_tx, client
)
print("SignerListSet submitted, here's the response:")
print(signed_list_set_tx_response)

# Now that we've set up multisigning, let's try using it to submit an AccountSet
# transaction.
account_set_tx = AccountSet(
    account=master_wallet.address, domain=str_to_hex("example.com")
)
autofilled_account_set_tx = autofill(account_set_tx, client, len(signer_entries))
print("AccountSet transaction is ready to be multisigned")
print(autofilled_account_set_tx)

# Since we created both signer keys, we can sign locally, but if you are building an app
# That allows multisigning, you would need to request signatures from the key holders.
tx_1 = sign(autofilled_account_set_tx, signer_wallet_1, multisign=True)
tx_2 = sign(autofilled_account_set_tx, signer_wallet_2, multisign=True)

multisigned_tx = multisign(autofilled_account_set_tx, [tx_1, tx_2])

print("Successfully multisigned the transaction")
print(multisigned_tx)

multisigned_tx_response = client.request(SubmitMultisigned(tx_json=multisigned_tx))

if multisigned_tx_response.result["engine_result"] == "tesSUCCESS":
    print("The multisigned transaction was accepted by the ledger:")
    print(multisigned_tx_response)
    if multisigned_tx_response.result["tx_json"]["Signers"]:
        print(
            "The transaction had "
            f"{len(multisigned_tx_response.result['tx_json']['Signers'])} signatures"
        )
else:
    print(
        "The multisigned transaction was rejected by rippled."
        "Here's the response from rippled:"
    )
    print(multisigned_tx_response)
