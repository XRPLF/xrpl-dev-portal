---
title: "Decentralized Identity"
sidebar_label: "DID Resolver"
---

# Decentralized Identity

This document explains how to use the XRPL DID Resolver for verifying Decentralized Identifiers (DIDs) on the XRP Ledger (XRPL). The resolver interacts with XRPL's ledger to fetch, validate, and process DIDs using the `xrpl-did-resolver` package.

## Inputs Required

Following inputs are required for verification:

- **DID Identifier**: A valid DID stored on the XRPL Ledger.
- **Signature**: A signature to be verified against the DID's public key.

## How It Works
Assuming that a Decentralized Identity (DID) already exists on the XRPL ledger and a valid signature is available for verification. If a signature is not available, it can be generated using the following code snippet:

```javascript
function getSignature(privateKey) {
    const keyPair = ec.keyFromPrivate(privateKey);
    const hash = crypto.createHash('sha256').update('Helloworld').digest();
    return keyPair.sign(hash);
}
```
### Fetching a DID Object from XRPL

To retrieve the DID entry from the XRPL ledger, the function `getDIDObject` is used. It establishes a connection with the XRPL node, requests the ledger entry for the provided DID, and returns the stored object.
```javascript
async function getDIDObject(address) {
    const client = new Client(XRPL_NODE);
    await client.connect();
    const result = await client.request({ command: 'ledger_entry', did: address });
    await client.disconnect();
    return result.result.node;
}
```
### Retrieving and Parsing a DID Document

After fetching the DID object, the function `getDID` decodes the URI field and fetches the DID document from an external source if necessary.
```javascript
async function getDID(address) {
    const object = await getDIDObject(address);
    const decodedData = Buffer.from(object.URI, 'hex').toString('utf8');
    const response = await fetch(decodedData);
    return await response.json();
}
```
### Processing a DID Document

The function `processDID` ensures the DID document matches the requested DID and returns the validated data.
```javascript
async function processDID(did, address) {
    const result = await getDID(address);
    if (result?.id !== did) throw new Error('DID document ID mismatch');
    return { result };
}
```
### Resolving a DID

To fully resolve a DID, the function `resolveDID` processes the DID and returns the structured DID document along with metadata.
```javascript
async function resolveDID(did, parsed) {
    const address = parsed.id;
    const result = await processDID(did, address);
    return { didDocument: result.result, didResolutionMetadata: { contentType: 'application/did+json' } };
}
```
### Verifying a Signature

To verify a digital signature, the function `verifySignature` extracts the public key from the DID document and verifies the given signature using elliptic curve cryptography.
```javascript
export async function verifySignature(did, signature) {
    const didResolver = new Resolver({ ...xrplResolver });
    const doc = await didResolver.resolve(did);
    const publicKeyHex = doc.didDocument?.publicKey?.[0]?.publicKeyHex;
    const hash = crypto.createHash('sha256').update('Helloworld').digest();
    const publicKey = ec.keyFromPublic(publicKeyHex, 'hex');
    return publicKey.verify(hash, signature);
}
```
For further clarification, [resolver.js](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/did-resolver) file is available in code samples.

 
