import { Resolver } from 'did-resolver';
import { Client } from 'xrpl';
import fetch from 'node-fetch';
import crypto from 'crypto';
import elliptic from 'elliptic';

// Initialize the elliptic curve for signature verification
const ec = new elliptic.ec('secp256k1');

const XRPL_NODE = 'wss://s.devnet.rippletest.net:51233';

/**
 * Fetch DID object from the XRPL Ledger
 */
async function getDIDObject(address) {
    const client = new Client(XRPL_NODE);
    await client.connect();
    let result;
    try {
        result = await client.request({
            command: 'ledger_entry',
            did: address,
        });
    } catch (e) {
        if (e.message === 'entryNotFound') {
            throw new Error('DID Not Found');
        }
        console.log(e.message);
        throw e;
    } finally {
        await client.disconnect();
    }
    return result.result.node;
}

/**
 * Retrieve and parse the DID document
 */
async function getDID(address) {
    const object = await getDIDObject(address);

    if (object.LedgerEntryType !== 'DID') {
        throw new Error('Unexpected LedgerEntryType');
    }

    let decodedData = Buffer.from(object.URI, 'hex').toString('utf8');
    
    try {
        const response = await fetch(decodedData);
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.error("Error fetching JSON document:", error);
        return null;
    }
}

/**
 * Process DID and validate the document
 */
async function processDID(did, address) {
    let result;
    try {
        result = await getDID(address);
        if (typeof result !== 'object') {
            return {
                error: {
                    error: 'unsupportedFormat',
                    message: 'DID does not resolve to a valid document containing a JSON document',
                },
            };
        }
        if (result?.id !== did) {
            return {
                error: {
                    error: 'notFound',
                    message: 'DID document ID does not match requested DID',
                },
            };
        }
    } catch (error) {
        return {
            error: {
                error: 'resolver_error',
                message: `DID must resolve to a valid document containing a JSON document: ${error}`,
            },
        };
    }
    return { result };
}

/**
 * DID Resolver Function
 */
async function resolveDID(did, parsed) {
    const address = parsed.id;
    const didDocumentMetadata = {};
    const result = await processDID(did, address);
    
    if (result.error) {
        return {
            didDocument: null,
            didDocumentMetadata,
            didResolutionMetadata: result.error,
        };
    }

    const didDocument = result.result || null;
    const contentType =
        typeof didDocument?.['@context'] !== 'undefined'
            ? 'application/did+ld+json'
            : 'application/did+json';

    return {
        didDocument,
        didDocumentMetadata,
        didResolutionMetadata: { contentType },
    };
}

/**
 * DID Resolver Object
 */
const xrplResolver = {
    xrpl: resolveDID
};

/**
 * Verify Signature using DID and Public Key
 */
export async function verifySignature(did, signature) {
    try {
        const didResolver = new Resolver({ ...xrplResolver });
        
        const doc = await didResolver.resolve(did);

        // Extract Public Key from the DID document
        let publicKeyHex = doc.didDocument?.publicKey?.map(key => key.publicKeyHex) ?? [];
        if (Array.isArray(publicKeyHex) && publicKeyHex.length > 0) {
            publicKeyHex = publicKeyHex[0];
        } else {
            throw new Error('No public key found in DID document');
        }

        // Hash the data
        const data = 'Helloworld';
        const hash = crypto.createHash('sha256').update(data).digest();

        // Convert public key to elliptic curve format
        const publicKey = ec.keyFromPublic(publicKeyHex, 'hex');

        // Verify the signature
        const isValid = publicKey.verify(hash, signature);
        
        return isValid;
    } catch (error) {
        console.error('Error during signature verification:', error);
        return false;
    }
}

