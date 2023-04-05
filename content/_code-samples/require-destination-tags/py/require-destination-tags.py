import asyncio

from xrpl.asyncio.clients import AsyncWebsocketClient
from xrpl.asyncio.transaction import (
    safe_sign_and_autofill_transaction,
    send_reliable_submission,
)
from xrpl.asyncio.wallet import generate_faucet_wallet
from xrpl.models.requests import AccountInfo
from xrpl.models.transactions import (
    AccountSet,
    AccountSetFlag,
)


async def main() -> int:
    # Define the network client
    async with AsyncWebsocketClient("wss://s.altnet.rippletest.net:51233") as client:
        # Get credentials from the Testnet Faucet -----------------------------------
        print("Requesting addresses from the Testnet faucet...")
        wallet = await generate_faucet_wallet(client, debug=True)

        # Send AccountSet transaction -----------------------------------------------
        tx = AccountSet(
            account=wallet.classic_address,
            set_flag=AccountSetFlag.ASF_REQUIRE_DEST,
        )

        # Sign and autofill the transaction (ready to submit)
        signed_tx = await safe_sign_and_autofill_transaction(tx, wallet, client)
        print("Transaction hash:", signed_tx.get_hash())

        # Submit the transaction and wait for response (validated or rejected)
        print("Submitting transaction...")
        submit_result = await send_reliable_submission(signed_tx, client)
        print("Submit result:", submit_result)

        # Confirm Account Settings --------------------------------------------------
        print("Requesting account information...")
        account_info = await client.request(
            AccountInfo(
                account=wallet.classic_address,
                ledger_index="validated",
            )
        )

        # Verify that the AccountRoot lsfRequireDestTag flag is set
        flags = account_info.result["account_data"]["Flags"]
        if flags & 0x00020000 != 0:
            print(f"Require Destination Tag for account {wallet.classic_address} is enabled.")
        else:
            print(f"Require Destination Tag for account {wallet.classic_address} is DISABLED.")

    # End main()
    return 0


if __name__ == "__main__":
    asyncio.run(main())

