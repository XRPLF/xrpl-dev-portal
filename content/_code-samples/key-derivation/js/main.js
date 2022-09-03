const { generateSeed } = require("ripple-keypairs/dist");
const addressCodec = require('ripple-address-codec');
const elliptic = require("elliptic");
const hashjs = require('hash.js');

console.log(`Code snippet to derive ed25519 key pairs\n`);

// Generating random ed25519 seed 
const seed = generateSeed({ algorithm: "ed25519" });
console.log(`Seed value: ${seed}\n`);

// JS Elliptic-curve cryptographic implementation, Link: https://www.npmjs.com/package/elliptic
const Ed25519 = elliptic.eddsa('ed25519');

// Function to convert bytes to hex
const bytesToHex = (a) => {
    return Array.from(a, (byteValue) => {
        const hex = byteValue.toString(16).toUpperCase()
        return hex.length > 1 ? hex : `0${hex}`
    }).join('');
};

// hashing the message using hash.js npm library, Link: https://github.com/indutny/hash.js
const hash = (message) => hashjs.sha512().update(message).digest().slice(0, 32);

// Decode seed using ripple-address-codec
const decoded = addressCodec.decodeSeed(seed);

// Conversion to key pairs
const prefix = 'ED'
const rawPrivateKey = hash(decoded.bytes)
const privateKey = prefix + bytesToHex(rawPrivateKey)
const publicKey = prefix + bytesToHex(Ed25519.keyFromSecret(rawPrivateKey).pubBytes());

// log key pairs in console
console.log({ privateKey, publicKey });
