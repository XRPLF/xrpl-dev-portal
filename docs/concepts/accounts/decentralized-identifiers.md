---
html: decentralized-identifiers.html
parent: accounts.html
seo:
    description: Decentralized identifiers enable verifiable, decentralized digital identities.
status: not_enabled
labels:
  - DID
---
# Decentralized Identifiers

_(Requires the [DID amendment][] {% not-enabled /%})_

A Decentralized Identifier (DID) is a new type of identifier defined by the World Wide Web Consortium (W3C) that enables verifiable, digital identities. DIDs are fully under the control of the DID owner, independent from any centralized registry, identity provider, or certificate authority.

The key principles of a DID are:

- **Decentralization:** No central issuing agency controls the DID, enabling the owner to update, resolve, or deactivate it. This also makes your identity highly-available, since DIDs are usually stored on a blockchain and always available for verification.

- **Verifiable Credentials:** Anyone can create a DID and falsify the information on it. To prove the authenticity of a DID, a user must provide a verifiable credential (VC) that is cryptographically secure and tamper-evident.

    In the DID ecosystem, there are three parties: _user_, _issuer_, and _verifier_. The _user_ controls the DID, but needs a trusted _issuer_ to verify the information offline. The issuer provides a verfiable credential, which the user gives to _verifiers_ that need to confirm the user's identity. To learn more about the DID ecosystem, see: [Ecosystem Overview](https://www.w3.org/TR/vc-data-model/#ecosystem-overview).

- **Interoperability:** DIDs are open to any solution that recognizes the W3C DID standard. This means a DID can be used to authenticate and establish trust in various digital transactions and interactions.

**Note:** The implementation of DIDs on the XRP Ledger conforms to the requirements in the [DID v1.0 specification](https://www.w3.org/TR/did-core/).


## How It Works

1. An XRPL account holder generates a DID that is controlled by the account.
2. The DID is associated with a DID document as defined by W3C specifications.
3. A user provides their DID and VC to a verifier for a digital task.
4. The verifier resolves the DID to its document and uses the VC to verify its authenticity.


## DID Documents

DID documents contain the necessary information to cryptographically verify the identity of the subject described by a DID document. The subject can be a person, organization, or thing. For example, a DID document could contain cryptographic public keys that the DID subject can use to authenticate itself and prove its association with the DID.

**Note:** DID documents usually serialize to a JSON or JSON-LD representation.

On the XRP Ledger, there are several ways to associate a DID to a DID document:

1. Store a reference to the document in the `URI` field of the `DID` object, which points to a document stored on another decentralized storage network, such as IPFS or STORJ.
2. Store a minimal DID document in the `DIDDocument` field of the `DID` object.
3. Use a minimal _implicit_ DID document generated from the DID and other available public information.
    **Note:** Simpler use cases may only need signatures and simple authorization tokens. In cases where there isn't explicitly a DID document on the ledger, an implicit document is used instead. For example, the implicit DID Document of `did:xrpl:1:0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020` enables only a single key `0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020` to authorize changes on the DID document or sign credentials in the name of the DID.


### Sample XRPL DID Document

```json
{
    "@context": "https://w3id.org/did/v1",
    "id": "did:xrpl:1:rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "publicKey": [
        {
            "id": "did:xrpl:1:rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn#keys-1",
            "type": ["CryptographicKey", "EcdsaKoblitzPublicKey"],
            "curve": "secp256k1",
            "expires": 15674657,
            "publicKeyHex": "04f42987b7faee8b95e2c3a3345224f00e00dfc67ba882..."
        }
    ]
}
```

To learn more about the core properties of a DID document, see: [Decentralized Identifiers (DIDs) v1.0](https://www.w3.org/TR/did-core/#core-properties).


## Privacy and Security Concerns

- Whoever controls the private keys of an XRPL account, controls the DID and reference to the DID document it resolves to. Take care to ensure your private keys aren't compromised.
- You can include any content in a DID document, but should limit it to verification methods and service points. Since DIDs on XRPL are publicly available, you shouldn't include any personal information.
- IPFS allows anyone to store content on the nodes in a distributed network. A common misconception is that anyone can edit that content; however, the content-addressability of IPFS means any edited content will have a different address from the original. While any entity can copy a DID document anchored with an XRPL account's `DIDDocument` or `URI` fields, they can't change the document itself unless they control the private key that created the corresponding `DID` object.


## Use Cases

DIDs enable many use cases, such as:

- Meeting Know Your Client (KYC) and Anti-money Laundering (AML) standards.
- User identity management across the XRP Ledger.
- Differentiated access to DeFi apps.
- Signing digital documents.
- Making secure online transactions.
- Logging into websites.


{% raw-partial file="/docs/_snippets/common-links.md" /%}
