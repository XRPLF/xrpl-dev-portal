const { deriveKeypair } = require("ripple-keypairs/dist");

// Seed value
const seed = "snoPBrXtMeMyMHUVTgbuqAfg1SUTb";

// Derive Key pairs using ripple-keypairs/dist
const key_pair = deriveKeypair(seed);

// log key pairs in console
console.log(key_pair);