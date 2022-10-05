'use strict';

// Organize imports
const assert = require("assert")
const brorand = require("brorand")
const BN = require("bn.js")
const elliptic = require("elliptic");
const Ed25519 = elliptic.eddsa('ed25519');
const Secp256k1 = elliptic.ec('secp256k1');
const hashjs = require("hash.js");
const Sha512 = require("ripple-keypairs/dist/Sha512")
const { codec, encodeAccountPublic, encodeNodePublic } = require("ripple-address-codec");

const XRPL_SEED_PREFIX = 0x21

const isHex = function(value) {
    const regex = new RegExp(/^[0-9a-f]+$/, 'i')
    return regex.test(value)
}

const bytesToHex = function(bytes) {
    return Array.from(bytes, (byteValue) => {
        const hex = byteValue.toString(16).toUpperCase();
        return hex.length > 1 ? hex : `0${hex}`;
    }).join('');
}

const hexToBytes = function(hex) {
    assert.ok(hex.length % 2 === 0);
    return hex.length === 0 ? [] : new BN(hex, 16).toArray(null, hex.length / 2);
}

const encodeUTF8 = function (string) {
    return encodeURIComponent(string)
}

const sha512half = function (value) {
    return hashjs.sha512().update(value).digest().slice(0, 32);
}

class Seed {
    
    constructor(seedValue = '', checkRFC1751 = false) {
        this.bytes = this._initSeed(seedValue)
        this.ED25519Keypair = this._deriveED25519Keypair(this.bytes)
        this.Secp256K1Keypair = this._deriveSecp256K1Keypair(this.bytes)
    }

    _initSeed(seedValue) {

        // No input given - default to random seed
        if (!seedValue || seedValue === '') {
            const randomBuffer = brorand(16)
            return [...randomBuffer]
        }

        // From base58 formatted seed
        try {
            const base58decoded = codec.decodeChecked(seedValue)
            if (base58decoded[0] === XRPL_SEED_PREFIX && base58decoded.length === 17) {
                return [...base58decoded.slice(1)];
            }
        } catch (exception) {
            // Continue probing the seed for different format
        }

        // From hex formatted seed
        if (isHex(seedValue)) {
            const decoded = hexToBytes(seedValue);
            if(decoded.length === 16) {
                return decoded
            } else {
                // Raise Error
                throw new Error("incorrect decoded seed length")
            }
        }

        // From password seed
        const encoded = encodeUTF8(seedValue)
        return hashjs.sha512().update(encoded).digest().slice(0, 16);
    }

    _deriveED25519Keypair() {
        const prefix = 'ED';
        const rawPrivateKey = sha512half(this.bytes);
        const privateKey = prefix + bytesToHex(rawPrivateKey);
        const publicKey = prefix + bytesToHex(Ed25519.keyFromSecret(rawPrivateKey).pubBytes());
        return { privateKey, publicKey };
    }

    _deriveSecp256K1Keypair(entropy, options) {
        const prefix = '00';
        const privateKey = prefix + this._deriveSecp256K1PrivateKey(entropy, options).toString(16, 64).toUpperCase()
        const publicKey = bytesToHex(Secp256k1.keyFromPrivate(privateKey.slice(2))
            .getPublic()
            .encodeCompressed());
        return { privateKey, publicKey };
    }

    _deriveSecp256K1PrivateKey(seed, opts = {}) {
        const root = opts.validator;
        const order = Secp256k1.curve.n;
        // This private generator represents the `root` private key, and is what's
        // used by validators for signing when a keypair is generated from a seed.
        const privateGen = this._deriveScalar(seed);
        if (root) {
            // As returned by validation_create for a given seed
            return privateGen;
        }
        const publicGen = Secp256k1.g.mul(privateGen);
        // A seed can generate many keypairs as a function of the seed and a uint32.
        // Almost everyone just uses the first account, `0`.
        const accountIndex = opts.accountIndex || 0;

        return this._deriveScalar(publicGen.encodeCompressed(), accountIndex)
            .add(privateGen)
            .mod(order);
    }

    _deriveScalar(bytes, discrim) {
        const order = Secp256k1.curve.n;
        for (let i = 0; i <= 0xffffffff; i++) {
            // We hash the bytes to find a 256 bit number, looping until we are sure it
            // is less than the order of the curve.
            const hasher = new Sha512.default().add(bytes);
            // If the optional discriminator index was passed in, update the hash.
            if (discrim !== undefined) {
                hasher.addU32(discrim);
            }
            hasher.addU32(i);
            const key = hasher.first256BN();
            /* istanbul ignore else */
            /* istanbul ignore else */
            if (key.cmpn(0) > 0 && key.cmp(order) < 0) {
                return key;
            }
        }
        // This error is practically impossible to reach.
        // The order of the curve describes the (finite) amount of points on the curve
        // https://github.com/indutny/elliptic/blob/master/lib/elliptic/curves.js#L182
        // How often will an (essentially) random number generated by Sha512 be larger than that?
        // There's 2^32 chances (the for loop) to get a number smaller than the order,
        // and it's rare that you'll even get past the first loop iteration.
        // Note that in TypeScript we actually need the throw, otherwise the function signature would be BN | undefined
        //
        /* istanbul ignore next */
        throw new Error('impossible unicorn ;)');
    }

    getBase58ED25519Account() {
        const buffer = Buffer.from(this.ED25519Keypair.publicKey, "hex")
        return encodeAccountPublic([...buffer])
    }

    getBase58ESecp256k1Account(validator = false) {
        const buffer = Buffer.from(this.Secp256K1Keypair.publicKey, "hex")
        if (validator) {
            return encodeNodePublic([...buffer])
        } else {
            return encodeAccountPublic([...buffer])
        }
    }

    toString() {
        const base58Seed = codec.encodeChecked([XRPL_SEED_PREFIX].concat(this.bytes))
        const hexSeed = Buffer.from(this.bytes).toString('hex').toUpperCase()

        const base58ED25519Account = this.getBase58ED25519Account();

        const base58Secp256k1Account = this.getBase58ESecp256k1Account();
        const base58Secp256k1AccountValidator = this.getBase58ESecp256k1Account(true);

        const out = `
            Seed (base58): ${base58Seed}
            Seed (hex): ${hexSeed}
            
            Ed25519 Secret Key (hex): ${this.ED25519Keypair.privateKey}
            Ed25519 Public Key (hex): ${this.ED25519Keypair.publicKey}
            Ed25519 Public Key (base58 - Account): ${base58ED25519Account}
            
            secp256k1 Secret Key (hex): ${this.Secp256K1Keypair.privateKey}
            secp256k1 Public Key (hex): ${this.Secp256K1Keypair.publicKey}
            secp256k1 Public Key (base58 - Account): ${base58Secp256k1Account}
            secp256k1 Public Key (base58 - Validator): ${base58Secp256k1AccountValidator}
        `

        return out
    }
}

if (process.argv[2] !== undefined) {
    console.log(process.argv[2]);
    const seed = new Seed(process.argv[2]);
    console.log(seed.toString())
} else {
    const seed = new Seed();
    console.log(seed.toString())
}