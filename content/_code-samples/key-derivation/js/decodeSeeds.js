const hashjs = require('hash.js');
const elliptic = require("elliptic");
const { Sha512 } = require("./Sha512");
const { decodeSeed } = require("./codec");

// JS Elliptic-curve cryptographic implementation, Link: https://www.npmjs.com/package/elliptic
const Ed25519 = elliptic.eddsa('ed25519');
const Secp256k1 = elliptic.ec('secp256k1');

// hashing the message using hash.js npm library, Link: https://github.com/indutny/hash.js
const hash = (message) => hashjs.sha512().update(message).digest().slice(0, 32);

// Function to convert bytes to hex
const bytesToHex = (a) => {
    return Array.from(a, (byteValue) => {
        const hex = byteValue.toString(16).toUpperCase()
        return hex.length > 1 ? hex : `0${hex}`
    }).join('');
};

const decodeEd25519Seed = (seed) => {
    // Decode seed
    const decoded = decodeSeed(seed);
    // Conversion to key pairs
    const prefix = 'ED';
    const rawPrivateKey = hash(decoded.bytes);
    const privateKey = prefix + bytesToHex(rawPrivateKey);
    const publicKey = prefix + bytesToHex(Ed25519.keyFromSecret(rawPrivateKey).pubBytes());

    return { privateKey, publicKey };
};

const decodeSecp256k1 = (seed) => {

    const deriveScalar = (bytes, d) => {
        const order = Secp256k1.curve.n;
        // Hash the bytes to find a 256 bit number
        for (let i = 0; i <= 0xffffffff; i++) {
            const hasher = new Sha512().add(bytes);
            if (d !== undefined) {
                hasher.addU32(d);
            }
            hasher.addU32(i);
            const key = hasher.first256BN();
            if (key.cmpn(0) > 0 && key.cmp(order) < 0) {
                return key;
            }
        }
    };

    const derivePrivateKey = (seed) => {
        const order = Secp256k1.curve.n;
        const privateGen = deriveScalar(seed);
        const publicGen = Secp256k1.g.mul(privateGen);
        const privateKey = deriveScalar(publicGen.encodeCompressed(), 0).add(privateGen).mod(order);
        return privateKey;
    };

    // Conversion to key pairs
    const prefix = '00';
    const decoded = decodeSeed(seed);
    const privateKey = prefix + derivePrivateKey(decoded.bytes).toString(16, 64).toUpperCase();
    const publicKey = bytesToHex(Secp256k1.keyFromPrivate(privateKey.slice(2))
        .getPublic()
        .encodeCompressed());

    return { privateKey, publicKey };
};

module.exports = { decodeEd25519Seed, decodeSecp256k1 };