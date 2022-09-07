from xrpl.clients import WebsocketClient
from xrpl.wallet import generate_faucet_wallet
from xrpl.models.transactions import AccountSet, AccountSetFlag
from xrpl.models.requests import AccountInfo
from xrpl.transaction import (
    send_reliable_submission,
    safe_sign_and_autofill_transaction
)

webSocket = WebsocketClient('wss://s.altnet.rippletest.net:51233')

if __name__ == "__main__":
  lsfRequireDestTag = 131072

  with webSocket as xrplClient:

    #Generate a Wallet and Fund
    testWallet = generate_faucet_wallet(xrplClient, debug=True)

    #Prepare AccountSet transaction with asfRequireDest Flag Set
    account_set_tx = AccountSet(
                account=testWallet.classic_address,
                set_flag=AccountSetFlag.ASF_REQUIRE_DEST,
            )

    #Sign AccountSet Tx
    signed_tx = safe_sign_and_autofill_transaction(
        transaction=account_set_tx,
        wallet=testWallet,
        client=xrplClient,
    )

    #Submit TX
    print("Enabling Destination TAG Flag on Account:" + testWallet.classic_address)
    response = send_reliable_submission(signed_tx, xrplClient)

    txResult = response.result['meta']['TransactionResult']
    if txResult != 'tesSUCCESS':
        print('Unable to send Tx AccountSet to the Ledger, result : {}'.format(txResult))
    else:
        #Verify Account Destination TAG flag is set
        response = xrplClient.request(
            AccountInfo(
                account=testWallet.classic_address,
                ledger_index="current",
            )
        )

        if response.result['account_data']['Flags'] & lsfRequireDestTag:
            print("Destination TAG flag is set successfully")
        else:
            print("Destination TAG flag is NOT set successfully")
