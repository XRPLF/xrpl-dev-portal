import xrpl
import json
from xrpl.clients import JsonRpcClient
from xrpl.wallet import Wallet
testnet_url="https://s.altnet.rippletest.net:51234"

def set_minter(seed, minter):
    """set_minter"""
    granter_wallet=Wallet(seed, sequence = 16237283)
    client=JsonRpcClient(testnet_url)

    set_minter_tx=xrpl.models.transactions.AccountSet(
        account=granter_wallet.classic_address,
        nftoken_minter=minter,
        set_flag=xrpl.models.transactions.AccountSetFlag.ASF_AUTHORIZED_NFTOKEN_MINTER
    )     
# Sign and fill the transaction    
    signed_tx=xrpl.transaction.safe_sign_and_autofill_transaction(
        set_minter_tx, granter_wallet, client)
# Submit the transaction and report the results
    try:
        response=xrpl.transaction.send_reliable_submission(signed_tx,client)
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        response=f"Submit failed: {e}"
    return response.result

def mint_other(seed, uri, flags, transfer_fee, taxon, issuer):
    """mint_other"""
    minter_wallet=Wallet(seed, sequence=16237283)
    client=JsonRpcClient(testnet_url)
    mint_other_tx=xrpl.models.transactions.NFTokenMint(
        account=minter_wallet.classic_address,
        uri=xrpl.utils.str_to_hex(uri),
        flags=int(flags),
        transfer_fee=int(transfer_fee),
        nftoken_taxon=int(taxon),
        issuer=issuer
    )
# Sign and fill the transaction    
    signed_tx=xrpl.transaction.safe_sign_and_autofill_transaction(
        mint_other_tx, minter_wallet, client)
# Submit the transaction and report the results
    try:
        response=xrpl.transaction.send_reliable_submission(signed_tx,client)
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        response=f"Submit failed: {e}"
    return response.result
