# Credentials

The Credentials feature is a set of tools for managing authorization and compliance requirements using the XRP Ledger blockchain, while respecting privacy and decentralization. This feature extends and interconnects with other features of the XRP Ledger including [Deposit Authorization](https://xrpl.org/docs/concepts/accounts/depositauth). The goal of this feature is to streamline the process of compliance checks such as [KYC (Know Your Customer)](https://en.wikipedia.org/wiki/Know_your_customer) and to enable further trust-based applications within the XRP Ledger ecosystem.

The design of the Credentials standard draws from the [W3C Verifiable Credentials standard](https://www.w3.org/TR/vc-data-model-2.0/). It is intended to be compatible to an extent that makes sense in the context of the XRP Ledger. There are some differences in data structures and formatting: for example, the subject of a credential is identified by an XRP Ledger address rather than a URL.

## Overview

_Credentials_ are signed statements that can be stored in the ledger and can attest to a user's identity, legal status, or other status. This feature includes issuance, storage, and verification of credentials directly on the XRP Ledger, while still supporting the privacy needs of users.

This feature set is designed for an ecosystem of parties with the following roles:

- _Authorizers_ who want to limit specific actions or interactions to users who possess the correct credentials.
- _Issuers_ who provide credentials to users who meet their criteria.
- _Users_ who obtain credentials from issuers and use those credentials to interact with authorizers.

Each credential applies to a specific user's XRP Ledger account, and is attested by a specific credential issuer. The exact qualifications that a credential entails are open-ended, and defined by their issuers. They can range from trivial to serious, or broad to narrow. Some examples of things a credential could state:

- That a user is not a subject of sanctions by a particular nation or set of nations.
- That a user has accredited investor status in the US.
- That a user has reached a specific level in a particular video game.

### Uses

Within the XRP Ledger, you can use Deposit Authorization to automatically allow senders with the correct set of credentials, instead of approving sending accounts individually. Future amendments could further extend credentials to gate access to other features such as holding tokens, participating in lending pools, or contributing to an AMM.

Credentials stored in the XRP Ledger can also be used to authorize off-ledger activities, especially in association with a decentralized identifier.

## Usage Flow

A typical flow to use Credentials involves three parties with different roles, as described in the following example:

* Verity is a regulated business that wants to interact only with properly KYC'd accounts, to ensure legal compliance. This makes Verity an _authorizer_ because they configure which accounts are allowed (authorized) to interact with them.
* Isabel is a credential issuer who vets accounts and issues credentials attesting that the accounts are who they say they are.
* Alice is a user who wants to interact with Verity.

All three parties need XRP Ledger accounts. The flow works as follows:

1. Verity sets up their account so that only authorized accounts can interact with them. Since they trust Isabel to properly vet accounts and issue relevant credentials, they configure their account to accept credentials issued by Isabel.
2. Alice submits whatever documents are necessary to Isabel privately, off-chain.
3. Isabel examines Alice's documents and creates a credential attesting to Alice's trustworthiness.
4. Alice accepts the credential, making it valid.
5. Alice can now interact with/send funds to Verity.

Importantly, the documents that Alice sends to Isabel can include personally identifiable or private information that's needed to verify Alice's identity, but this information is never published or stored on the blockchain and Verity does not need to see it. Also, other businesses that trust Isabel can accept the same credentials so Alice does not need to repeatedly re-verify for every party she wants to interact with.

To revoke a credential, Isabel can delete it from the ledger. Alice can also delete her own credentials.
