# WARNING: local testing only. This writes account seeds and encryption private
# keys to confidential_transfers_setup.json. Never persist secrets in plaintext
# in production.

import asyncio
import json
import sys

from xrpl.asyncio.clients import AsyncWebsocketClient
from xrpl.asyncio.transaction import autofill, submit_and_wait
from xrpl.asyncio.wallet import generate_faucet_wallet
from xrpl.ext.confidential import (
    MPTCrypto,
    prepare_confidential_convert_async,
    prepare_confidential_merge_inbox_async,
    prepare_confidential_send_async,
)
from xrpl.models import (
    Batch,
    MPTokenAuthorize,
    MPTokenIssuanceCreate,
    MPTokenIssuanceCreateFlag,
    MPTokenIssuanceSet,
    Payment,
)
from xrpl.models.amounts import MPTAmount
from xrpl.models.transactions.batch import BatchFlag
from xrpl.models.transactions.transaction import TransactionFlag
from xrpl.transaction import sign_multiaccount_batch
from xrpl.utils import encode_mptoken_metadata

TOTAL_STEPS = 6
ASSET_SCALE = 0

confidential_supply = 900000


async def main():
    async with AsyncWebsocketClient("wss://s.devnet.rippletest.net:51233") as client:
        crypto = MPTCrypto()

        step = 1

        def progress():
            nonlocal step
            sys.stdout.write(f"Setting up tutorial: {step}/{TOTAL_STEPS}\r")
            sys.stdout.flush()
            step += 1

        async def submit(tx, wallet, description):
            response = await submit_and_wait(tx, client, wallet, autofill=True)
            result_code = response.result["meta"]["TransactionResult"]
            if result_code != "tesSUCCESS":
                raise Exception(f"Unable to {description}: {result_code}")
            return response

        # 1. Fund the accounts ----------------------
        progress()
        (
            issuer,
            issuer_second_account,
            auditor,
            seller,
            buyer,
            flagged_holder,
        ) = await asyncio.gather(*(generate_faucet_wallet(client) for _ in range(6)))

        issuer_privkey, issuer_pubkey = crypto.generate_keypair()
        second_privkey, second_pubkey = crypto.generate_keypair()
        auditor_privkey, auditor_pubkey = crypto.generate_keypair()
        seller_privkey, seller_pubkey = crypto.generate_keypair()
        buyer_privkey, buyer_pubkey = crypto.generate_keypair()
        flagged_privkey, flagged_pubkey = crypto.generate_keypair()

        tokens = [
            {
                "ticker": "CTST",
                "distributions": [
                    {
                        "recipient": seller,
                        "recipient_pubkey": seller_pubkey,
                        "amount": 1000,
                    },
                ],
                "metadata": {
                    "name": "Confidential Fund Token",
                    "desc": "A confidential demo tokenized fund.",
                    "icon": "https://example.org/ctst-icon.png",
                    "asset_class": "rwa",
                    "asset_subclass": "treasury",
                },
            },
            {
                "ticker": "CTUSD",
                "distributions": [
                    {
                        "recipient": buyer,
                        "recipient_pubkey": buyer_pubkey,
                        "amount": 100000,
                    },
                    {
                        "recipient": flagged_holder,
                        "recipient_pubkey": flagged_pubkey,
                        "amount": 500,
                    },
                ],
                "metadata": {
                    "name": "Confidential Cash Token",
                    "desc": "A confidential demo stablecoin.",
                    "icon": "https://example.org/cusd-icon.png",
                    "asset_class": "rwa",
                    "asset_subclass": "stablecoin",
                },
            },
        ]

        # 2. Create both issuances ----------------------
        progress()
        for token in tokens:
            create_response = await submit(
                MPTokenIssuanceCreate(
                    account=issuer.address,
                    asset_scale=ASSET_SCALE,
                    maximum_amount="1000000000",
                    transfer_fee=0,
                    flags=MPTokenIssuanceCreateFlag.TF_MPT_CAN_HOLD_CONFIDENTIAL_BALANCE
                    | MPTokenIssuanceCreateFlag.TF_MPT_CAN_TRANSFER
                    | MPTokenIssuanceCreateFlag.TF_MPT_CAN_CLAWBACK
                    | MPTokenIssuanceCreateFlag.TF_MPT_CAN_LOCK,
                    mptoken_metadata=encode_mptoken_metadata(
                        {
                            "ticker": token["ticker"],
                            "issuer_name": "Example Financial Corp",
                            **token["metadata"],
                        }
                    ),
                ),
                issuer,
                f"create the {token['ticker']} issuance",
            )
            token["mpt_issuance_id"] = create_response.result["meta"]["mpt_issuance_id"]

        await submit(
            Batch(
                account=issuer.address,
                flags=BatchFlag.TF_ALL_OR_NOTHING,
                raw_transactions=[
                    MPTokenIssuanceSet(
                        account=issuer.address,
                        mptoken_issuance_id=token["mpt_issuance_id"],
                        issuer_encryption_key=issuer_pubkey,
                        auditor_encryption_key=auditor_pubkey,
                        flags=TransactionFlag.TF_INNER_BATCH_TXN,
                    )
                    for token in tokens
                ],
            ),
            issuer,
            "register the encryption keys on both issuances",
        )

        # 3. Move each supply into a confidential balance ----------------------
        progress()
        supply_batch_tx = await autofill(
            Batch(
                account=issuer.address,
                flags=BatchFlag.TF_ALL_OR_NOTHING,
                raw_transactions=[
                    *[
                        MPTokenAuthorize(
                            account=issuer_second_account.address,
                            mptoken_issuance_id=token["mpt_issuance_id"],
                            flags=TransactionFlag.TF_INNER_BATCH_TXN,
                        )
                        for token in tokens
                    ],
                    *[
                        Payment(
                            account=issuer.address,
                            destination=issuer_second_account.address,
                            amount=MPTAmount(
                                mpt_issuance_id=token["mpt_issuance_id"],
                                value=str(confidential_supply),
                            ),
                            flags=TransactionFlag.TF_INNER_BATCH_TXN,
                        )
                        for token in tokens
                    ],
                ],
            ),
            client,
            1,
        )
        signed_supply_batch = sign_multiaccount_batch(
            issuer_second_account, supply_batch_tx
        )
        await submit(
            signed_supply_batch, issuer, "send the public supply of both tokens"
        )

        # Each convert and merge carries a proof bound to its own sequence, so
        # they stay outside the Batch.
        for token in tokens:
            convert_tx = await prepare_confidential_convert_async(
                client,
                issuer_second_account,
                token["mpt_issuance_id"],
                confidential_supply,
                issuer_pubkey,
                second_privkey,
                second_pubkey,
                auditor_pubkey,
            )
            await submit(
                convert_tx,
                issuer_second_account,
                f"convert the {token['ticker']} supply",
            )

            supply_merge_tx = await prepare_confidential_merge_inbox_async(
                client, issuer_second_account, token["mpt_issuance_id"]
            )
            await submit(
                supply_merge_tx,
                issuer_second_account,
                f"merge the {token['ticker']} supply",
            )

        # 4. Onboard each holder on both issuances ----------------------
        progress()

        async def onboard(holder, holder_privkey, holder_pubkey):
            await submit(
                Batch(
                    account=holder.address,
                    flags=BatchFlag.TF_ALL_OR_NOTHING,
                    raw_transactions=[
                        MPTokenAuthorize(
                            account=holder.address,
                            mptoken_issuance_id=token["mpt_issuance_id"],
                            flags=TransactionFlag.TF_INNER_BATCH_TXN,
                        )
                        for token in tokens
                    ],
                ),
                holder,
                f"authorize {holder.address} to hold both tokens",
            )

            for token in tokens:
                register_tx = await prepare_confidential_convert_async(
                    client,
                    holder,
                    token["mpt_issuance_id"],
                    0,
                    issuer_pubkey,
                    holder_privkey,
                    holder_pubkey,
                    auditor_pubkey,
                )
                await submit(
                    register_tx,
                    holder,
                    f"register the {token['ticker']} holder key",
                )

        await asyncio.gather(
            onboard(seller, seller_privkey, seller_pubkey),
            onboard(buyer, buyer_privkey, buyer_pubkey),
            onboard(flagged_holder, flagged_privkey, flagged_pubkey),
        )

        # 5. Distribute each token to its holders ----------------------
        progress()
        for token in tokens:
            for distribution in token["distributions"]:
                recipient = distribution["recipient"]
                distribute_tx = await prepare_confidential_send_async(
                    client,
                    issuer_second_account,
                    recipient.address,
                    token["mpt_issuance_id"],
                    distribution["amount"],
                    second_privkey,
                    second_pubkey,
                    distribution["recipient_pubkey"],
                    issuer_pubkey,
                    auditor_pubkey,
                )
                await submit(
                    distribute_tx,
                    issuer_second_account,
                    f"distribute {token['ticker']} to {recipient.address}",
                )

        # 6. Write the setup data ----------------------
        progress()
        fund_token, cash_token = tokens
        setup_data = {
            "description": (
                "This file is auto-generated by confidential_transfers_setup.py. "
                "It stores XRPL account info, confidential encryption keypairs, "
                "and the confidential MPT issuance IDs for the confidential "
                "transfer tutorials."
            ),
            "issuer": {
                "address": issuer.address,
                "seed": issuer.seed,
                "privateKey": issuer_privkey,
                "publicKey": issuer_pubkey,
            },
            "issuerSecondAccount": {
                "address": issuer_second_account.address,
                "seed": issuer_second_account.seed,
                "privateKey": second_privkey,
                "publicKey": second_pubkey,
            },
            "auditor": {
                "address": auditor.address,
                "seed": auditor.seed,
                "privateKey": auditor_privkey,
                "publicKey": auditor_pubkey,
            },
            "seller": {
                "address": seller.address,
                "seed": seller.seed,
                "privateKey": seller_privkey,
                "publicKey": seller_pubkey,
            },
            "buyer": {
                "address": buyer.address,
                "seed": buyer.seed,
                "privateKey": buyer_privkey,
                "publicKey": buyer_pubkey,
            },
            "flaggedHolder": {
                "address": flagged_holder.address,
                "seed": flagged_holder.seed,
                "privateKey": flagged_privkey,
                "publicKey": flagged_pubkey,
            },
            "fund": {
                "ticker": fund_token["ticker"],
                "mptIssuanceID": fund_token["mpt_issuance_id"],
            },
            "stablecoin": {
                "ticker": cash_token["ticker"],
                "mptIssuanceID": cash_token["mpt_issuance_id"],
            },
        }

        with open("confidential_transfers_setup.json", "w") as setup_file:
            json.dump(setup_data, setup_file, indent=2)


# Allow running this file directly: `python confidential_transfers_setup.py`
if __name__ == "__main__":
    asyncio.run(main())
