"""
Create, claim and verify a Payment Channel.
Reference: https://xrpl.org/paychannel.html 
"""
from xrpl.clients import JsonRpcClient
from xrpl.models import (
    AccountObjects,
    PaymentChannelCreate,
    PaymentChannelClaim,
)
from xrpl.wallet import generate_faucet_wallet
from xrpl.transaction import submit_and_wait, submit
from xrpl.account import get_balance


def claim_pay_channel():
    """The snippet walks us through creating and claiming a Payment Channel."""
    
    client = JsonRpcClient("https://s.altnet.rippletest.net:51234")
    
    try:
        # Creating wallets as prerequisite
        print("Creating and funding wallets...")
        wallet1 = generate_faucet_wallet(client, debug=True)
        wallet2 = generate_faucet_wallet(client, debug=True)
        
        print("Balances of wallets before Payment Channel is claimed:")
        balance1 = get_balance(wallet1.address, client)
        balance2 = get_balance(wallet2.address, client)
        print(f"Balance of {wallet1.address} is {balance1} XRP")
        print(f"Balance of {wallet2.address} is {balance2} XRP")
        
        # Create a Payment Channel transaction
        payment_channel_create = PaymentChannelCreate(
            account=wallet1.address,
            amount="3000000",  # 3 XRP in drops
            destination=wallet2.address,
            settle_delay=86400,
            public_key=wallet1.public_key,
        )
        
        # Submit and wait for the transaction to be validated
        print("Submitting a PaymentChannelCreate transaction...")
        payment_channel_response = submit_and_wait(
            payment_channel_create, 
            client, 
            wallet1
        )
        print("PaymentChannelCreate transaction response:")
        print(payment_channel_response)

        # Check that the object was actually created and get the channel ID
        account_objects_request = AccountObjects(
            account=wallet1.address,
        )
        account_objects_response = client.request(account_objects_request)
        account_objects = account_objects_response.result["account_objects"]
        
        # Find the payment channel from account objects and get its ID
        channel_id = None
        for obj in account_objects:
            if obj.get("LedgerEntryType") == "PayChannel":
                channel_id = obj["index"]
                break
        
        if not channel_id:
            raise Exception("Could not find PayChannel in account objects")
            
        print(f"Payment Channel ID: {channel_id}")
        
        # Destination claims the Payment Channel
        payment_channel_claim = PaymentChannelClaim(
            account=wallet2.address,
            channel=channel_id,
            amount="100",
            sequence=payment_channel_response.result["tx_json"]["Sequence"],
            fee="12",  # Fee in drops (0.000012 XRP)
        )

        print("Submitting a PaymentChannelClaim transaction...")
        channel_claim_response = submit(
            payment_channel_claim, 
            wallet2,
        )
        print("PaymentChannelClaim transaction response:")
        print(channel_claim_response)
        
        print("Balances of wallets after Payment Channel is claimed:")
        print(f"Balance of {wallet1.address} is {get_balance(wallet1.address, client)} XRP")
        print(f"Balance of {wallet2.address} is {get_balance(wallet2.address, client)} XRP")
        
    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    claim_pay_channel()
