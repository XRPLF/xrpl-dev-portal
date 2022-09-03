const baseCodec = require("base-x")
/**
 * Check whether a value is a sequence (e.g. Array of numbers).
 *
 * @param val - The value to check.
 */
function isSequence(val) {
  return typeof val !== "number"
}

/**
 * Concatenate all `arguments` into a single array. Each argument can be either
 * a single element or a sequence, which has a `length` property and supports
 * element retrieval via sequence[ix].
 *
 * > concatArgs(1, [2, 3], Buffer.from([4,5]), new Uint8Array([6, 7]));
 * [1,2,3,4,5,6,7]
 *
 * @param args - Concatenate of these args into a single array.
 * @returns Array of concatenated arguments
 */
function concatArgs(...args) {
  const ret = []

  args.forEach((arg) => {
    if (isSequence(arg)) {
      for (const j of arg) {
        ret.push(j)
      }
    } else {
      ret.push(arg)
    }
  })
  return ret
}

/**
 * Check whether two sequences (e.g. Arrays of numbers) are equal.
 *
 * @param arr1 - One of the arrays to compare.
 * @param arr2 - The other array to compare.
 */
function seqEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false
    }
  }
  return true
}

exports.XRPCodec = class XRPCodec {
  constructor(options) {
    this._sha256 = options.sha256
    this._alphabet = options.alphabet
    this._codec = baseCodec(this._alphabet)
  }

  /**
   * Encoder.
   *
   * @param bytes - Buffer of data to encode.
   * @param opts - Options object including the version bytes and the expected length of the data to encode.
   */
  encode(bytes, opts = {}) {
    const versions = opts.versions
    return this._encodeVersioned(bytes, versions, opts.expectedLength)
  }

  decode(base58string, opts) {
    const versions = opts.versions
    const types = opts.versionTypes

    const withoutSum = this.decodeChecked(base58string)

    if (versions.length > 1 && !opts.expectedLength) {
      throw new Error(
        "expectedLength is required because there are >= 2 possible versions",
      )
    }
    const versionLengthGuess =
      typeof versions[0] === "number" ? 1 : versions[0].length
    const payloadLength =
      opts.expectedLength ?? withoutSum.length - versionLengthGuess
    const versionBytes = withoutSum.slice(0, -payloadLength)
    const payload = withoutSum.slice(-payloadLength)

    for (let i = 0; i < versions.length; i++) {
      /* eslint-disable @typescript-eslint/consistent-type-assertions --
       * TODO refactor */
      const version = Array.isArray(versions[i]) ? versions[i] : [versions[i]]
      if (seqEqual(versionBytes, version)) {
        return {
          version,
          bytes: payload,
          type: types ? types[i] : null,
        }
      }
      /* eslint-enable @typescript-eslint/consistent-type-assertions */
    }

    throw new Error(
      "version_invalid: version bytes do not match any of the provided version(s)",
    )
  }

  decodeChecked(base58string) {
    const buffer = this._decodeRaw(base58string)
    if (buffer.length < 5) {
      throw new Error("invalid_input_size: decoded data must have length >= 5")
    }
    if (!this._verifyCheckSum(buffer)) {
      throw new Error("checksum_invalid")
    }
    return buffer.slice(0, -4)
  }

  encodeChecked(buffer) {
    const check = this._sha256(this._sha256(buffer)).slice(0, 4)
    return this._encodeRaw(Buffer.from(concatArgs(buffer, check)))
  }

  _encodeVersioned(bytes, versions, expectedLength) {
    if (expectedLength && bytes.length !== expectedLength) {
      throw new Error(
        "unexpected_payload_length: bytes.length does not match expectedLength." +
          " Ensure that the bytes are a Buffer.",
      )
    }
    return this.encodeChecked(Buffer.from(concatArgs(versions, bytes)))
  }

  _encodeRaw(bytes) {
    return this._codec.encode(bytes)
  }

  _decodeRaw(base58string) {
    return this._codec.decode(base58string)
  }

  _verifyCheckSum(bytes) {
    const computed = this._sha256(this._sha256(bytes.slice(0, -4))).slice(0, 4)
    const checksum = bytes.slice(-4)
    return seqEqual(computed, checksum)
  }
}
