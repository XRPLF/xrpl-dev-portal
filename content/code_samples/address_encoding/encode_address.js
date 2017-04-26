'use strict';
const assert = require('assert');
const crypto = require('crypto');
const R_B58_DICT = 'rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz';
const base58 = require('base-x')(R_B58_DICT);

assert(crypto.getHashes().includes('sha256'));
assert(crypto.getHashes().includes('ripemd160'));

function checksum_of(payload_buf) {
  const hash_1 = crypto.createHash('sha256').update(payload_buf).digest();
  const hash_2 = crypto.createHash('sha256').update(hash_1).digest();
  return hash_2.slice(0,4);
}

function address_of(pubkey_hex, key_type='secp256k1') {
  const pubkey_buf = Buffer.from(pubkey_hex, 'hex');

  if (key_type.toLowerCase() == 'secp256k1') {
    assert(pubkey_buf.length == 33);
  } else if (key_type.toLowerCase() == 'ed25519') {
    assert(pubkey_buf.length == 32);
  } else {
    throw 'UnknownKeyType';
  }

  const pubkey_inner_hash = crypto.createHash('sha256');

  // Ed25519 keys are prefixed with 0xED to make them 33 bytes
  if (key_type.toLowerCase() == 'ed25519') {
    pubkey_inner_hash.update(Buffer.from([0xED]));
  }

  pubkey_inner_hash.update(pubkey_buf);

  const pubkey_outer_hash = crypto.createHash('ripemd160');
  pubkey_outer_hash.update(pubkey_inner_hash.digest());

  const addressTypePrefix = Buffer.from([0x00]);
  const accountID = pubkey_outer_hash.digest();
  const checksum = checksum_of(accountID);

  const dataToEncode = Buffer.concat([addressTypePrefix, accountID, checksum]);
  return base58.encode(dataToEncode);
}

console.log(
address_of('0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020')
);
// rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh
