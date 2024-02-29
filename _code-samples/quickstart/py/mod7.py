import xrpl
from xrpl.clients import JsonRpcClient
from xrpl.wallet import Wallet
from xrpl.models.requests import AccountNFTs

testnet_url = "https://s.altnet.rippletest.net:51234"


def batch_mint(seed, uri, flags, transfer_fee, taxon, count):
    """batch_mint"""
    wallet=Wallet.from_seed(seed)
    client=JsonRpcClient(testnet_url)

    acct_info = xrpl.models.requests.account_info.AccountInfo(
        account=wallet.classic_address,
        ledger_index='validated'
    )
    get_seq_request = client.request(acct_info)
    current_sequence=get_seq_request.result['account_data']['Sequence']
    ticket_tx=xrpl.models.transactions.TicketCreate(
        account=wallet.address,
        ticket_count=int(count),
        sequence=current_sequence  
    )
    
    response=xrpl.transaction.submit_and_wait(ticket_tx,client,wallet)

    ticket_numbers_req=xrpl.models.requests.AccountObjects(
        account=wallet.address,
        type='ticket'
    )
    ticket_response=client.request(ticket_numbers_req)
    
    tickets=[int(0)] * int(count)
    acct_objs= ticket_response.result['account_objects']
    for x in range(int(count)):
        tickets[x] = acct_objs[x]['TicketSequence']
    reply=""
    create_count=0
    # Define the mint transaction
    for x in range(int(count)):
        mint_tx=xrpl.models.transactions.NFTokenMint(
            account=wallet.classic_address,
            uri=xrpl.utils.str_to_hex(uri),
            flags=int(flags),
            transfer_fee=int(transfer_fee),
            ticket_sequence=tickets[x],
            sequence=0,
            nftoken_taxon=int(taxon)
        )
        # Submit the transaction and get results
        try:
            response=xrpl.transaction.submit_and_wait(mint_tx,client,
                wallet)
            create_count+=1 
        except xrpl.transaction.XRPLReliableSubmissionException as e:
            reply+=f"Submit failed: {e}\n"
    reply+=str(create_count)+' NFTs generated.'
    return reply


def get_batch(seed, account):
    """get_batch"""
    client=JsonRpcClient(testnet_url)
    acct_nfts=AccountNFTs(
        account=account,
        limit=400
    )
    response=client.request(acct_nfts)
    responses=response.result
    while(acct_nfts.marker):
        acct_nfts=AccountNFTs(
            account=account,
            limit=400,
            marker=acct_nfts.marker
        )
        response=client.request(acct_nfts)
        responses+=response.result
    return responses
