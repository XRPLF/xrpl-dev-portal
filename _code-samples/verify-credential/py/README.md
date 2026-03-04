# Verify Credential - Python sample code

Verifies that a specific credential exists on the XRPL and is valid.

Quick install & usage:

```sh
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python verify_credential.py
```

The output should look something like this:

```text
Looking up credential...
{'ledger_index': 'validated', 'method': 'ledger_entry', 'api_version': 2, 'credential': {'subject': 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn', 'issuer': 'ra5nK24KXen9AHvsdFTKHSANinZseWnPcX', 'credential_type': '6D795F63726564656E7469616C'}, 'binary': False}
Found credential:
{'CredentialType': '6D795F63726564656E7469616C', 'Expiration': 1199232000, 'Flags': 65536, 'Issuer': 'ra5nK24KXen9AHvsdFTKHSANinZseWnPcX', 'IssuerNode': '0', 'LedgerEntryType': 'Credential', 'PreviousTxnID': '2D3A865C3AAC50A20ACC40E3644D93FE5FEF2C8CFF21B1E0580ADB34D9487A9E', 'PreviousTxnLgrSeq': 102230586, 'Subject': 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn', 'SubjectNode': '0', 'index': '1CA15B7FBD6E0BEE616F2B5FF479D9F6EBEF5D93073FA03F734081AF46804B47'}
Credential has expiration: 2038-01-01T00:00:00+00:00
Looking up validated ledger to check for expiration.
Most recent validated ledger was at: 2026-02-17T18:47:52+00:00
Credential is valid.
```
