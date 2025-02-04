const EC = require('elliptic').ec;
const crypto = require('crypto');

const ec = new EC('secp256k1');

/**
 * Generates a signature for predefined data using the provided private key.
 * @param {string} privateKeyHex - The private key in hex format.
 * @returns {Object} - The signature object.
 */
function getSignature(privateKeyHex) {
    const keyPair = ec.keyFromPrivate(privateKeyHex);

    // Declare the data to sign
    const dataToSign = 'Helloworld';

    // Generate the hash for the data
    const hash = crypto.createHash('sha256').update(dataToSign).digest();
    console.log('Node.js Hash:', hash);

    const signature = keyPair.sign(hash);
    console.log('r:', signature.r.toString(16));
    console.log('s:', signature.s.toString(16));
    return signature;
}

module.exports = { getSignature };
