const assert = require("assert")
const { fixtures } = require("./fixtures")
const { decodeSeed, generateSeed } = require("..")

const entropy = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

describe("generate a seed", function () {
  it("generateSeed - secp256k1", () => {
    assert.strictEqual(generateSeed({ entropy }), fixtures.secp256k1.seed)
  })

  it("generateSeed - secp256k1, random", () => {
    const seed = generateSeed()
    assert(seed.charAt(0) === "s")
    const { type, bytes } = decodeSeed(seed)
    assert(type === "secp256k1")
    assert(bytes.length === 16)
  })

  it("generateSeed - ed25519", () => {
    assert.strictEqual(
      generateSeed({ entropy, algorithm: "ed25519" }),
      fixtures.ed25519.seed,
    )
  })

  it("generateSeed - ed25519, random", () => {
    const seed = generateSeed({ algorithm: "ed25519" })
    assert(seed.slice(0, 3) === "sEd")
    const { type, bytes } = decodeSeed(seed)
    assert(type === "ed25519")
    assert(bytes.length === 16)
  })
})
