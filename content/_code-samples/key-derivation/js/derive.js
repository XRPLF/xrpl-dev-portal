'use strict'
// Dependencies for Node.js.
const api = require('ripple-keypairs')

const entropy= [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

// Derive XRPL wallet using ed25519  --------------------
const seed_ed25519 = api.generateSeed({entropy:entropy, algorithm:'ed25519'});
const keypair_ed25519 = api.deriveKeypair(seed_ed25519);
const address_ed25519 = api.deriveAddress(keypair_ed25519.publicKey);
const accountObject_ed25519  = {
    'accountType': 'familySeed',
    'address': address_ed25519,
    'secret': { 
        'familySeed': seed_ed25519,
        'mnemonic': null,
        'passphrase': null
    },
    'keypair': { 
        'algorithm': 'ed25519',
        'publicKey': keypair_ed25519.publicKey,
        'privateKey': keypair_ed25519.privateKey 
    } 
}

console.log('XRPL_Account', accountObject_ed25519)

// Derive XRPL wallet using secp256k1  --------------------
const seed_secp256 = api.generateSeed({entropy:entropy, algorithm:'ecdsa-secp256k1'});
const keypair_secp256 = api.deriveKeypair(seed_secp256);
const address_secp256 = api.deriveAddress(keypair_secp256.publicKey);
const accountObject_secp256  = {
    'accountType': 'familySeed',
    'address': address_secp256,
    'secret': { 
        'familySeed': seed_secp256,
        'mnemonic': null,
        'passphrase': null
    },
    'keypair': { 
        'algorithm': 'secp256k1',
        'publicKey': keypair_secp256.publicKey,
        'privateKey': keypair_secp256.privateKey
    } 
}
console.log('XRPL_Account', accountObject_secp256)

// Derive XRPL wallet using xrpl account-lib library  --------------------
const lib = require('xrpl-accountlib')
const account = lib.generate.familySeed()
console.log(account)