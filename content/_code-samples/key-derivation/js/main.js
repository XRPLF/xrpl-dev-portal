const { generateSeed } = require("ripple-keypairs/dist");
const { decodeEd25519Seed, decodeSecp256k1 } = require("./deriveKeys");

console.log(`Code snippet to derive ed25519 & secp256k1 key pairs\n`);

// Generating random ed25519 seed
const seed = generateSeed({ algorithm: "ed25519" });
console.log(`ED25519 => Seed value: ${seed}`);
console.log("ED25519 Key Pairs:");
// decoding seed value
console.log(decodeEd25519Seed(seed));

// ------------------------------------------------------------------------ 

// Generating random secp256k1 seed 
const secp256k1Seed = generateSeed({ algorithm: "ecdsa-secp256k1" });
console.log(`\nSECP256k1 => Seed value: ${secp256k1Seed}`);
console.log("SECP256k1 Key Pairs:");
// decoding seed value
console.log(decodeSecp256k1(secp256k1Seed));
