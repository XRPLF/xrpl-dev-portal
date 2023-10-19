import xrpl
from xrpl.clients import JsonRpcClient
from xrpl.wallet import Wallet
testnet_url="https://s.altnet.rippletest.net:51234"

def set_minter(seed, minter):
    """set_minter"""
    granter_wallet=Wallet.from_seed(seed)
    client=JsonRpcClient(testnet_url)

    set_minter_tx=xrpl.models.transactions.AccountSet(
        account=granter_wallet.address,
        nftoken_minter=minter,
        set_flag=xrpl.models.transactions.AccountSetAsfFlag.ASF_AUTHORIZED_NFTOKEN_MINTER
    )     
# Submit the transaction and report the results
    reply=""
    try:
        response=xrpl.transaction.submit_and_wait(set_minter_tx,client,
            granter_wallet)
        reply=response.result
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        reply=f"Submit failed: {e}"
    return reply

def mint_other(seed, uri, flags, transfer_fee, taxon, issuer):
    """mint_other"""
    minter_wallet=Wallet.from_seed(seed)
    client=JsonRpcClient(testnet_url)
    mint_other_tx=xrpl.models.transactions.NFTokenMint(
        account=minter_wallet.address,
        uri=xrpl.utils.str_to_hex(uri),
        flags=int(flags),
        transfer_fee=int(transfer_fee),
        nftoken_taxon=int(taxon),
        issuer=issuer
    )
# Submit the transaction and report the results
    reply=""
    try:
        response=xrpl.transaction.submit_and_wait(mint_other_tx,client,
            minter_wallet)
        reply=response.result
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        reply=f"Submit failed: {e}"
    return reply
