const crypto = require("crypto")
const { XRPCodec } = require("./codec")

const ED25519_SEED = [0x01, 0xe1, 0x4b]
const FAMILY_SEED = 0x21

function generateRandomNumber(length) {
  return Math.random().toFixed(length).split(".")[1]
}

const codecWithXrpAlphabet = new XRPCodec({
  sha256(bytes) {
    return crypto.createHash("sha256").update(Buffer.from(bytes)).digest()
  },
  alphabet: "rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz",
})

exports.generateSeed = function generateSeed(
  options = { entropy: new Uint8Array(), algorithm: "secp256k1" },
) {
  const entropy =
    options.entropy?.length >= 16
      ? options.entropy.slice(0, 16)
      : generateRandomNumber(16)

  const type = options.algorithm === "ed25519" ? "ed25519" : "secp256k1"

  const entropyBuf = Buffer.from(entropy)

  if (entropyBuf.length !== 16) {
    throw new Error("entropy must have length 16")
  }

  // prefixes entropy with version bytes
  return codecWithXrpAlphabet.encode(entropyBuf, {
    expectedLength: 16,
    // for secp256k1, use `FAMILY_SEED`
    versions: type === "ed25519" ? ED25519_SEED : [FAMILY_SEED],
  })
}

exports.decodeSeed = function decodeSeed(
  seed,
  opts = {
    versionTypes: ["ed25519", "secp256k1"],
    versions: [ED25519_SEED, FAMILY_SEED],
    expectedLength: 16,
  },
) {
  return codecWithXrpAlphabet.decode(seed, opts)
}
