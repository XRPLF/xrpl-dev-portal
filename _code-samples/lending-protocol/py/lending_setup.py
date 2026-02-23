# Setup script for lending protocol tutorials

import asyncio
import json

from xrpl.asyncio.clients import AsyncWebsocketClient
from xrpl.asyncio.wallet import generate_faucet_wallet
from xrpl.asyncio.transaction import submit_and_wait, autofill, sign
from xrpl.transaction import sign_loan_set_by_counterparty
from xrpl.models import (
    AccountObjects,
    Batch,
    BatchFlag,
    CredentialAccept,
    CredentialCreate,
    LoanBrokerSet,
    LoanSet,
    MPTAmount,
    MPTCurrency,
    MPTokenAuthorize,
    MPTokenIssuanceCreate,
    MPTokenIssuanceCreateFlag,
    Payment,
    PermissionedDomainSet,
    TicketCreate,
    VaultCreate,
    VaultDeposit,
)
from xrpl.models.transactions.vault_create import VaultCreateFlag
from xrpl.models.transactions.deposit_preauth import Credential
from xrpl.utils import encode_mptoken_metadata, str_to_hex


async def main():
    async with AsyncWebsocketClient("wss://s.devnet.rippletest.net:51233") as client:

        print("Setting up tutorial: 0/6", end="\r")

        # Create and fund wallets
        loan_broker, borrower, depositor, credential_issuer = await asyncio.gather(
            generate_faucet_wallet(client),
            generate_faucet_wallet(client),
            generate_faucet_wallet(client),
            generate_faucet_wallet(client),
        )

        print("Setting up tutorial: 1/6", end="\r")

        # Issue MPT with depositor
        # Create tickets for later use with loan_broker
        # Set up credentials and domain with credential_issuer
        credential_type = str_to_hex("KYC-Verified")

        mpt_data = {
            "ticker": "TSTUSD",
            "name": "Test USD MPT",
            "desc": "A sample non-yield-bearing stablecoin backed by U.S. Treasuries.",
            "icon": "https://example.org/tstusd-icon.png",
            "asset_class": "rwa",
            "asset_subclass": "stablecoin",
            "issuer_name": "Example Treasury Reserve Co.",
            "uris": [
                {
                    "uri": "https://exampletreasury.com/tstusd",
                    "category": "website",
                    "title": "Product Page",
                },
                {
                    "uri": "https://exampletreasury.com/tstusd/reserve",
                    "category": "docs",
                    "title": "Reserve Attestation",
                },
            ],
            "additional_info": {
                "reserve_type": "U.S. Treasury Bills",
                "custody_provider": "Example Custodian Bank",
                "audit_frequency": "Monthly",
                "last_audit_date": "2026-01-15",
                "pegged_currency": "USD",
            },
        }

        ticket_create_response, mpt_issuance_response, _ = await asyncio.gather(
            submit_and_wait(
                TicketCreate(
                    account=loan_broker.address,
                    ticket_count=2,
                ),
                client,
                loan_broker,
            ),
            submit_and_wait(
                MPTokenIssuanceCreate(
                    account=depositor.address,
                    maximum_amount="100000000",
                    transfer_fee=0,
                    flags=(
                        MPTokenIssuanceCreateFlag.TF_MPT_CAN_TRANSFER
                        | MPTokenIssuanceCreateFlag.TF_MPT_CAN_CLAWBACK
                        | MPTokenIssuanceCreateFlag.TF_MPT_CAN_TRADE
                    ),
                    mptoken_metadata=encode_mptoken_metadata(mpt_data),
                ),
                client,
                depositor,
            ),
            submit_and_wait(
                Batch(
                    account=credential_issuer.address,
                    flags=BatchFlag.TF_ALL_OR_NOTHING,
                    raw_transactions=[
                        CredentialCreate(
                            account=credential_issuer.address,
                            subject=loan_broker.address,
                            credential_type=credential_type,
                        ),
                        CredentialCreate(
                            account=credential_issuer.address,
                            subject=borrower.address,
                            credential_type=credential_type,
                        ),
                        CredentialCreate(
                            account=credential_issuer.address,
                            subject=depositor.address,
                            credential_type=credential_type,
                        ),
                        PermissionedDomainSet(
                            account=credential_issuer.address,
                            accepted_credentials=[
                                Credential(
                                    issuer=credential_issuer.address,
                                    credential_type=credential_type,
                                ),
                            ],
                        ),
                    ],
                ),
                client,
                credential_issuer,
            ),
        )

        # Extract ticket sequence numbers
        tickets = [
            node["CreatedNode"]["NewFields"]["TicketSequence"]
            for node in ticket_create_response.result["meta"]["AffectedNodes"]
            if node.get("CreatedNode", {}).get("LedgerEntryType") == "Ticket"
        ]

        # Extract MPT issuance ID
        mpt_id = mpt_issuance_response.result["meta"]["mpt_issuance_id"]

        # Get domain ID
        credential_issuer_objects = await client.request(AccountObjects(
            account=credential_issuer.address,
            ledger_index="validated",
        ))
        domain_id = next(
            node["index"]
            for node in credential_issuer_objects.result["account_objects"]
            if node["LedgerEntryType"] == "PermissionedDomain"
        )

        print("Setting up tutorial: 2/6", end="\r")

        # Accept credentials and authorize MPT for each account
        await asyncio.gather(
            submit_and_wait(
                Batch(
                    account=loan_broker.address,
                    flags=BatchFlag.TF_ALL_OR_NOTHING,
                    raw_transactions=[
                        CredentialAccept(
                            account=loan_broker.address,
                            issuer=credential_issuer.address,
                            credential_type=credential_type,
                        ),
                        MPTokenAuthorize(
                            account=loan_broker.address,
                            mptoken_issuance_id=mpt_id,
                        ),
                    ],
                ),
                client,
                loan_broker,
            ),
            submit_and_wait(
                Batch(
                    account=borrower.address,
                    flags=BatchFlag.TF_ALL_OR_NOTHING,
                    raw_transactions=[
                        CredentialAccept(
                            account=borrower.address,
                            issuer=credential_issuer.address,
                            credential_type=credential_type,
                        ),
                        MPTokenAuthorize(
                            account=borrower.address,
                            mptoken_issuance_id=mpt_id,
                        ),
                    ],
                ),
                client,
                borrower,
            ),
            submit_and_wait(
                CredentialAccept(
                    account=depositor.address,
                    issuer=credential_issuer.address,
                    credential_type=credential_type,
                ),
                client,
                depositor,
            ),
        )

        print("Setting up tutorial: 3/6", end="\r")

        # Create private vault and distribute MPT to accounts
        vault_create_response, _ = await asyncio.gather(
            submit_and_wait(
                VaultCreate(
                    account=loan_broker.address,
                    asset=MPTCurrency(mpt_issuance_id=mpt_id),
                    flags=VaultCreateFlag.TF_VAULT_PRIVATE,
                    domain_id=domain_id,
                ),
                client,
                loan_broker,
            ),
            submit_and_wait(
                Batch(
                    account=depositor.address,
                    flags=BatchFlag.TF_ALL_OR_NOTHING,
                    raw_transactions=[
                        Payment(
                            account=depositor.address,
                            destination=loan_broker.address,
                            amount=MPTAmount(mpt_issuance_id=mpt_id, value="5000"),
                        ),
                        Payment(
                            account=depositor.address,
                            destination=borrower.address,
                            amount=MPTAmount(mpt_issuance_id=mpt_id, value="2500"),
                        ),
                    ],
                ),
                client,
                depositor,
            ),
        )

        vault_id = next(
            node["CreatedNode"]["LedgerIndex"]
            for node in vault_create_response.result["meta"]["AffectedNodes"]
            if node.get("CreatedNode", {}).get("LedgerEntryType") == "Vault"
        )

        print("Setting up tutorial: 4/6", end="\r")

        # Create LoanBroker and deposit MPT into vault
        loan_broker_set_response, _ = await asyncio.gather(
            submit_and_wait(
                LoanBrokerSet(
                    account=loan_broker.address,
                    vault_id=vault_id,
                ),
                client,
                loan_broker,
            ),
            submit_and_wait(
                VaultDeposit(
                    account=depositor.address,
                    vault_id=vault_id,
                    amount=MPTAmount(mpt_issuance_id=mpt_id, value="50000000"),
                ),
                client,
                depositor,
            ),
        )

        loan_broker_id = next(
            node["CreatedNode"]["LedgerIndex"]
            for node in loan_broker_set_response.result["meta"]["AffectedNodes"]
            if node.get("CreatedNode", {}).get("LedgerEntryType") == "LoanBroker"
        )

        print("Setting up tutorial: 5/6", end="\r")

        # Create 2 identical loans with complete repayment due in 30 days
        
        # Helper function to create, sign, and submit a LoanSet transaction
        async def create_loan(ticket_sequence):
            loan_set_tx = await autofill(LoanSet(
                account=loan_broker.address,
                counterparty=borrower.address,
                loan_broker_id=loan_broker_id,
                principal_requested="1000",
                interest_rate=500,
                payment_total=1,
                payment_interval=2592000,
                loan_origination_fee="100",
                loan_service_fee="10",
                sequence=0,
                ticket_sequence=ticket_sequence,
            ), client)

            loan_broker_signed = sign(loan_set_tx, loan_broker)
            fully_signed = sign_loan_set_by_counterparty(borrower, loan_broker_signed)
            submit_response = await submit_and_wait(fully_signed.tx, client)

            return submit_response

        submit_response_1, submit_response_2 = await asyncio.gather(
            create_loan(tickets[0]),
            create_loan(tickets[1]),
        )

        loan_id_1 = next(
            node["CreatedNode"]["LedgerIndex"]
            for node in submit_response_1.result["meta"]["AffectedNodes"]
            if node.get("CreatedNode", {}).get("LedgerEntryType") == "Loan"
        )

        loan_id_2 = next(
            node["CreatedNode"]["LedgerIndex"]
            for node in submit_response_2.result["meta"]["AffectedNodes"]
            if node.get("CreatedNode", {}).get("LedgerEntryType") == "Loan"
        )

        print("Setting up tutorial: 6/6", end="\r")

        # Write setup data to JSON file
        setup_data = {
            "description": "This file is auto-generated by lending_setup.py. It stores XRPL account info for use in lending protocol tutorials.",
            "loan_broker": {
                "address": loan_broker.address,
                "seed": loan_broker.seed,
            },
            "borrower": {
                "address": borrower.address,
                "seed": borrower.seed,
            },
            "depositor": {
                "address": depositor.address,
                "seed": depositor.seed,
            },
            "credential_issuer": {
                "address": credential_issuer.address,
                "seed": credential_issuer.seed,
            },
            "domain_id": domain_id,
            "mpt_id": mpt_id,
            "vault_id": vault_id,
            "loan_broker_id": loan_broker_id,
            "loan_id_1": loan_id_1,
            "loan_id_2": loan_id_2,
        }

        with open("lending_setup.json", "w") as f:
            json.dump(setup_data, f, indent=2)

        print("Setting up tutorial: Complete!")


asyncio.run(main())
