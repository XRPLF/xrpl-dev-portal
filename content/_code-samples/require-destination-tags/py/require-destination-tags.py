from xrpl.clients import JsonRpcClient
from xrpl.models.transactions import AccountSet, AccountSetFlag
from xrpl.transaction import safe_sign_and_autofill_transaction, submit_transaction
from xrpl.wallet import generate_faucet_wallet
from xrpl.models.requests import AccountInfo


if __name__ == "__main__":
    lsfRequireDestTag = 131072

    # Connect to a testnet node
    print("Connecting to Testnet...")
    JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
    client = JsonRpcClient(JSON_RPC_URL)

    # Generate a wallet and request faucet
    print("Requesting address from the Testnet faucet...")
    test_wallet = generate_faucet_wallet(client=client)
    myAddr = test_wallet.classic_address

    # Construct AccountSet transaction
    tx = AccountSet(
        account=myAddr,
        set_flag=AccountSetFlag.ASF_REQUIRE_DEST
    )
    print(f"Prepared transaction: {tx}")

    # Sign the transaction locally and submit to a node
    my_tx_payment_signed = safe_sign_and_autofill_transaction(tx, wallet=test_wallet, client=client)
    print(f"Transaction Hash: {my_tx_payment_signed.txn_signature}")

    print(f"Enabling Require Destination Tag flag (asfRequireDest) on {myAddr}")
    submit_transaction = submit_transaction(client=client, transaction=my_tx_payment_signed)
    submit_transaction = submit_transaction.result["engine_result"]

    print(f"Transaction result: {submit_transaction}!")

    # Verify Account Settings
    get_acc_flag = AccountInfo(
            account=myAddr
    )

    response = client.request(get_acc_flag)

    if response.result['account_data']['Flags'] == lsfRequireDestTag:
        print("Require Destination Tag is enabled.")
    else:
        print("Require Destination Tag is DISABLED.")
