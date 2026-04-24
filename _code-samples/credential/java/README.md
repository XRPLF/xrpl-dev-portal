# Credential Example (Java)

This directory contains a Java example demonstrating how to issue a credential, accept a credential, and delete a credential.

## Setup

Install dependencies before running any examples:

```sh
mvn install
```

---

## Manage Credentials

```sh
mvn exec:java -Dexec.mainClass=com.example.xrpl.ManageCredentials
```

The script should output two newly funded accounts, the CredentialCreate transaction, CredentialAccept transaction, and CredentialDelete transaction. Each successful transaction submission includes a link to the transaction metadata on the XRPL Explorer.

```sh
=== Funding issuer and subject accounts on Testnet ===

Issuer:  r446kRqJA1XGo1zGMiC2RAebtWbQa4duHL
Subject: rs8vtTf3aLZW7XRCh398SUkuuAWBn7q49y

=== Preparing CredentialCreate transaction ===

{
  "Account" : "r446kRqJA1XGo1zGMiC2RAebtWbQa4duHL",
  "TransactionType" : "CredentialCreate",
  "Fee" : "15",
  "Sequence" : 16795444,
  "LastLedgerSequence" : 16795464,
  "SigningPubKey" : "EDC2C03C393852514C40CCCCF34CB61A8DDB4AECC6C95271468DDF13DE0979DCC7",
  "Subject" : "rs8vtTf3aLZW7XRCh398SUkuuAWBn7q49y",
  "CredentialType" : "6B79632D747261646572"
}

=== Submitting CredentialCreate transaction ===

CredentialCreate succeeded!
Explorer: https://testnet.xrpl.org/transactions/D7A00CFC8DFFE384F7A5D2DF14B3AC5629E8F8DBFD8BD06BC389363782F296B3

=== Preparing CredentialAccept transaction ===

{
  "Account" : "rs8vtTf3aLZW7XRCh398SUkuuAWBn7q49y",
  "TransactionType" : "CredentialAccept",
  "Fee" : "15",
  "Sequence" : 16795444,
  "LastLedgerSequence" : 16795466,
  "SigningPubKey" : "EDBED812587E0D7D9F965EFE63F4F2B2BB2EB559AD7D1FA9250C239C235CE62726",
  "Issuer" : "r446kRqJA1XGo1zGMiC2RAebtWbQa4duHL",
  "CredentialType" : "6B79632D747261646572"
}

=== Submitting CredentialAccept transaction ===

CredentialAccept succeeded!
Explorer: https://testnet.xrpl.org/transactions/C9E55B0A5270FEB37C18E710BDB01C46480530673FE8E4FC39FE3D6B036DF8F5

=== Preparing CredentialDelete transaction ===

{
  "Account" : "rs8vtTf3aLZW7XRCh398SUkuuAWBn7q49y",
  "TransactionType" : "CredentialDelete",
  "Fee" : "15",
  "Sequence" : 16795445,
  "LastLedgerSequence" : 16795468,
  "SigningPubKey" : "EDBED812587E0D7D9F965EFE63F4F2B2BB2EB559AD7D1FA9250C239C235CE62726",
  "Issuer" : "r446kRqJA1XGo1zGMiC2RAebtWbQa4duHL",
  "CredentialType" : "6B79632D747261646572"
}

=== Submitting CredentialDelete transaction ===

CredentialDelete succeeded!
Explorer: https://testnet.xrpl.org/transactions/0755B4FED0A646D5FB3698891D25DC0374C521DEF00D85D8FCFF58EB09CAB4FE
```
