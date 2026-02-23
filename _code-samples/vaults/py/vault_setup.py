import asyncio
import json
import sys

from xrpl.asyncio.clients import AsyncWebsocketClient
from xrpl.asyncio.transaction import submit_and_wait
from xrpl.asyncio.wallet import generate_faucet_wallet
from xrpl.models import (
    Batch, BatchFlag, CredentialAccept, CredentialCreate, MPTokenAuthorize,
    MPTokenIssuanceCreate, MPTokenIssuanceCreateFlag, Payment,
    PermissionedDomainSet, VaultDeposit
)
from xrpl.models.requests import AccountObjects
from xrpl.models.transactions.deposit_preauth import Credential
from xrpl.models.transactions.vault_create import (
    VaultCreate, VaultCreateFlag, WithdrawalPolicy
)
from xrpl.utils import encode_mptoken_metadata, str_to_hex


async def main():
    # Setup script for vault tutorials
    print("Setting up tutorial: 0/5", end="\r")

    async with AsyncWebsocketClient("wss://s.devnet.rippletest.net:51233") as client:
        # Create and fund all wallets concurrently
        mpt_issuer, domain_owner, depositor, vault_owner = await asyncio.gather(
            generate_faucet_wallet(client),
            generate_faucet_wallet(client),
            generate_faucet_wallet(client),
            generate_faucet_wallet(client),
        )

        # Step 1: Create MPT issuance, permissioned domain, and credentials in parallel
        print("Setting up tutorial: 1/5", end="\r")

        cred_type = "VaultAccess"
        mpt_create_result, _ = await asyncio.gather(
            submit_and_wait(
                MPTokenIssuanceCreate(
                    account=mpt_issuer.address,
                    flags=(
                        MPTokenIssuanceCreateFlag.TF_MPT_CAN_TRANSFER |
                        MPTokenIssuanceCreateFlag.TF_MPT_CAN_LOCK
                    ),
                    asset_scale=2,
                    transfer_fee=0,
                    maximum_amount="1000000000000",
                    mptoken_metadata=encode_mptoken_metadata({
                        "ticker": "USTST",
                        "name": "USTST Stablecoin",
                        "desc": "A test stablecoin token",
                        "icon": "example.org/ustst-icon.png",
                        "asset_class": "rwa",
                        "asset_subclass": "stablecoin",
                        "issuer_name": "Test Stablecoin Inc",
                        "uris": [
                            {
                                "uri": "example.org/ustst",
                                "category": "website",
                                "title": "USTST Official Website",
                            },
                            {
                                "uri": "example.org/ustst/reserves",
                                "category": "attestation",
                                "title": "Reserve Attestation Reports",
                            },
                            {
                                "uri": "example.org/ustst/docs",
                                "category": "docs",
                                "title": "USTST Documentation",
                            },
                        ],
                        "additional_info": {
                            "backing": "USD",
                            "reserve_ratio": "1:1",
                        },
                    }),
                ),
                client,
                mpt_issuer,
                autofill=True
            ),
            submit_and_wait(
                Batch(
                    account=domain_owner.address,
                    flags=BatchFlag.TF_ALL_OR_NOTHING,
                    raw_transactions=[
                        PermissionedDomainSet(
                            account=domain_owner.address,
                            accepted_credentials=[
                                Credential(
                                    issuer=domain_owner.address,
                                    credential_type=str_to_hex(cred_type)
                                )
                            ],
                        ),
                        CredentialCreate(
                            account=domain_owner.address,
                            subject=depositor.address,
                            credential_type=str_to_hex(cred_type),
                        ),
                    ],
                ),
                client,
                domain_owner,
                autofill=True
            )
        )

        mpt_issuance_id = mpt_create_result.result["meta"]["mpt_issuance_id"]

        # Get domain ID
        domain_owner_objects = await client.request(AccountObjects(
            account=domain_owner.address,
            ledger_index="validated",
        ))
        domain_id = next(
            node["index"]
            for node in domain_owner_objects.result["account_objects"]
            if node["LedgerEntryType"] == "PermissionedDomain"
        )

        # Step 2: Depositor accepts credential, authorizes MPT, and creates vault in parallel
        print("Setting up tutorial: 2/5", end="\r")

        _, vault_create_result = await asyncio.gather(
            submit_and_wait(
                Batch(
                    account=depositor.address,
                    flags=BatchFlag.TF_ALL_OR_NOTHING,
                    raw_transactions=[
                        CredentialAccept(
                            account=depositor.address,
                            issuer=domain_owner.address,
                            credential_type=str_to_hex(cred_type),
                        ),
                        MPTokenAuthorize(
                            account=depositor.address,
                            mptoken_issuance_id=mpt_issuance_id,
                        ),
                    ],
                ),
                client,
                depositor,
                autofill=True
            ),
            submit_and_wait(
                VaultCreate(
                    account=vault_owner.address,
                    asset={"mpt_issuance_id": mpt_issuance_id},
                    flags=VaultCreateFlag.TF_VAULT_PRIVATE,
                    domain_id=domain_id,
                    data=str_to_hex(json.dumps(
                        {"n": "LATAM Fund II", "w": "examplefund.com"}
                    )),
                    mptoken_metadata=encode_mptoken_metadata({
                        "ticker": "SHARE1",
                        "name": "Vault Shares",
                        "desc": "Proportional ownership shares of the vault",
                        "icon": "example.com/vault-shares-icon.png",
                        "asset_class": "defi",
                        "issuer_name": "Vault Owner",
                        "uris": [
                            {
                                "uri": "example.com/asset",
                                "category": "website",
                                "title": "Asset Website",
                            },
                            {
                                "uri": "example.com/docs",
                                "category": "docs",
                                "title": "Docs",
                            },
                        ],
                        "additional_info": {
                            "example_info": "test",
                        },
                    }),
                    assets_maximum="0",
                    withdrawal_policy=WithdrawalPolicy.VAULT_STRATEGY_FIRST_COME_FIRST_SERVE,
                ),
                client,
                vault_owner,
                autofill=True
            ),
        )

        # Extract vault_id and vault_share_mpt_issuance_id
        vault_node = next(
            node for node in vault_create_result.result["meta"]["AffectedNodes"]
            if "CreatedNode" in node and node["CreatedNode"].get("LedgerEntryType") == "Vault"
        )
        vault_id = vault_node["CreatedNode"]["LedgerIndex"]
        vault_share_mpt_issuance_id = vault_node["CreatedNode"]["NewFields"]["ShareMPTID"]

        # Step 3: Issuer sends payment to depositor
        print("Setting up tutorial: 3/5", end="\r")

        payment_result = await submit_and_wait(
            Payment(
                account=mpt_issuer.address,
                destination=depositor.address,
                amount={
                    "mpt_issuance_id": mpt_issuance_id,
                    "value": "10000",
                },
            ),
            client,
            mpt_issuer,
            autofill=True
        )

        if payment_result.result["meta"]["TransactionResult"] != "tesSUCCESS":
            print(f"\nPayment failed: {payment_result.result['meta']['TransactionResult']}", file=sys.stderr)
            sys.exit(1)

        # Step 4: Make an initial deposit so withdraw example has shares to work with
        print("Setting up tutorial: 4/5", end="\r")

        initial_deposit_result = await submit_and_wait(
            VaultDeposit(
                account=depositor.address,
                vault_id=vault_id,
                amount={
                    "mpt_issuance_id": mpt_issuance_id,
                    "value": "1000",
                },
            ),
            client,
            depositor,
            autofill=True
        )

        if initial_deposit_result.result["meta"]["TransactionResult"] != "tesSUCCESS":
            print(f"\nInitial deposit failed: {initial_deposit_result.result['meta']['TransactionResult']}", file=sys.stderr)
            sys.exit(1)

        # Step 5: Save setup data to file
        print("Setting up tutorial: 5/5", end="\r")

        setup_data = {
            "mpt_issuer": {
                "address": mpt_issuer.address,
                "seed": mpt_issuer.seed,
            },
            "mpt_issuance_id": mpt_issuance_id,
            "domain_owner": {
                "address": domain_owner.address,
                "seed": domain_owner.seed,
            },
            "domain_id": domain_id,
            "credential_type": cred_type,
            "depositor": {
                "address": depositor.address,
                "seed": depositor.seed,
            },
            "vault_owner": {
                "address": vault_owner.address,
                "seed": vault_owner.seed,
            },
            "vault_id": vault_id,
            "vault_share_mpt_issuance_id": vault_share_mpt_issuance_id,
        }

        with open("vault_setup.json", "w") as f:
            json.dump(setup_data, f, indent=2)

        print("Setting up tutorial: Complete!")


if __name__ == "__main__":
    asyncio.run(main())
