'use strict';
const assert = require('assert');
const crypto = require('crypto');
const R_B58_DICT = 'rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz';
const base58 = require('base-x')(R_B58_DICT);

assert(crypto.getHashes().includes('sha256'));
assert(crypto.getHashes().includes('ripemd160'));

// Start with a public key. secp256k1 keys should be 33 bytes;
//    Ed25519 keys should be 32 bytes prefixed with 0xED (a total of 33 bytes).

// Ed25519 key:
const pubkey_hex =
  'ED9434799226374926EDA3B54B1B461B4ABF7237962EAE18528FEA67595397FA32';
//// secp256k1 key:
// const pubkey_hex =
//   '0303E20EC6B4A39A629815AE02C0A1393B9225E3B890CAE45B59F42FA29BE9668D';

const pubkey = Buffer.from(pubkey_hex, 'hex');
assert(pubkey.length == 33);

// Calculate the RIPEMD160 hash of the SHA-256 hash of the public key
//   This is the "Account ID"
const pubkey_inner_hash = crypto.createHash('sha256').update(pubkey);
const pubkey_outer_hash = crypto.createHash('ripemd160');
pubkey_outer_hash.update(pubkey_inner_hash.digest());
const account_id = pubkey_outer_hash.digest();

// Prefix the Account ID with the type prefix for "Ripple Address", then
//   calculate a checksum as the first 4 bytes of the SHA-256 of the SHA-256
//   of the Account ID
const address_type_prefix = Buffer.from([0x00]);
const payload = Buffer.concat([address_type_prefix, account_id]);
const chksum_hash1 = crypto.createHash('sha256').update(payload).digest();
const chksum_hash2 = crypto.createHash('sha256').update(chksum_hash1).digest();
const checksum =  chksum_hash2.slice(0,4);

// Concatenate the address type prefix, the payload, and the checksum.
// Base-58 encode the encoded value to get the address.
const dataToEncode = Buffer.concat([payload, checksum]);
const address = base58.encode(dataToEncode);
console.log(address);
// rnBFvgZphmN39GWzUJeUitaP22Fr9be75H (secp256k1 example)
// rDTXLQ7ZKZVKz33zJbHjgVShjsBnqMBhmN (Ed25519 example)
