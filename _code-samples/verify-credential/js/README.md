# Verify Credential - Javascript sample code

Verifies that a specific credential exists on the XRPL and is valid.

Quick install & usage:

```sh
npm install
node ./verify_credential.js
```

The output should look something like this:

```text
Looking up credential...
{
  "command": "ledger_entry",
  "credential": {
    "subject": "rsYhHbanGpnYe3M6bsaMeJT5jnLTfDEzoA",
    "issuer": "rEzikzbnH6FQJ2cCr4Bqmf6c3jyWLzkonS",
    "credential_type": "6D795F63726564656E7469616C"
  },
  "ledger_index": "validated"
}
Found credential:
{
  "CredentialType": "6D795F63726564656E7469616C",
  "Flags": 65536,
  "Issuer": "rEzikzbnH6FQJ2cCr4Bqmf6c3jyWLzkonS",
  "IssuerNode": "0",
  "LedgerEntryType": "Credential",
  "PreviousTxnID": "7D1257779E2D298C07C7E0C73CD446534B143FBD1F13DB268A878E40FD153B9A",
  "PreviousTxnLgrSeq": 803275,
  "Subject": "rsYhHbanGpnYe3M6bsaMeJT5jnLTfDEzoA",
  "SubjectNode": "0",
  "index": "9603F0E204A8B1C61823625682EB0ECE98A4ECF22FF46CD4845FA9BFA3606B24"
}
Credential is valid.
```
