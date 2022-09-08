const baseCodec = require('base-x');
const createHash = require('create-hash');

function seqEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}

const Codec = (function () {
    function Codec(options) {
        this._sha256 = options.sha256;
        this._alphabet = options.alphabet;
        this._codec = baseCodec(this._alphabet);
    }

    //Encoder
    Codec.prototype.encode = function (bytes, opts) {
        const versions = opts.versions;
        return this._encodeVersioned(bytes, versions, opts.expectedLength);
    };

    // Decoder
    Codec.prototype.decode = function (base58string, opts) {
        let _a;
        const versions = opts.versions;
        const types = opts.versionTypes;
        const withoutSum = this.decodeChecked(base58string);
        if (versions.length > 1 && !opts.expectedLength) {
            throw new Error('expectedLength is required because there are >= 2 possible versions');
        }
        const versionLengthGuess = typeof versions[0] === 'number' ? 1 : versions[0].length;
        const payloadLength = (_a = opts.expectedLength) !== null && _a !== void 0 ? _a : withoutSum.length - versionLengthGuess;
        const versionBytes = withoutSum.slice(0, -payloadLength);
        const payload = withoutSum.slice(-payloadLength);
        for (let i = 0; i < versions.length; i++) {
            const version = Array.isArray(versions[i])
                ? versions[i]
                : [versions[i]];
            if (seqEqual(versionBytes, version)) {
                return {
                    version: version,
                    bytes: payload,
                    type: types ? types[i] : null,
                };
            }
        }
        throw new Error('version_invalid: version bytes do not match any of the provided version(s)');
    };

    Codec.prototype.decodeChecked = function (base58string) {
        const buffer = this._decodeRaw(base58string);
        if (buffer.length < 5) {
            throw new Error('invalid_input_size: decoded data must have length >= 5');
        }
        if (!this._verifyCheckSum(buffer)) {
            throw new Error('checksum_invalid');
        }
        return buffer.slice(0, -4);
    };

    Codec.prototype._decodeRaw = function (base58string) {
        return this._codec.decode(base58string);
    };

    Codec.prototype._verifyCheckSum = function (bytes) {
        const computed = this._sha256(this._sha256(bytes.slice(0, -4))).slice(0, 4);
        const checksum = bytes.slice(-4);
        return seqEqual(computed, checksum);
    };
    return Codec;
}());

const FAMILY_SEED = 0x21; //Seed value (for secret keys) (16 bytes)
const ED25519_SEED = [0x01, 0xe1, 0x4b]; // [1, 225, 75]

const codecOptions = {
    sha256: function (bytes) {
        return createHash('sha256').update(Buffer.from(bytes)).digest();
    },
    alphabet: 'rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz',
};

function decodeSeed(seed, opts) {
    if (opts === void 0) {
        opts = {
            versionTypes: ['ed25519', 'secp256k1'],
            versions: [ED25519_SEED, FAMILY_SEED],
            expectedLength: 16,
        };
    }
    return new Codec(codecOptions).decode(seed, opts);
};

module.exports = { decodeSeed }