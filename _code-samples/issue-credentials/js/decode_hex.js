export function decodeHex(sHex) {
  /**
   * Try decoding a hex string as ASCII; return the decoded string on success,
   * or the un-decoded string prefixed by '(BIN) ' on failure.
   */
  try {
    const buffer = Buffer.from(sHex, "hex");
    return buffer.toString("ascii");
    // Could use utf-8 instead, but it has more edge cases.
    // Optionally, sanitize the string for display before returning
  } catch (err) {
    return "(BIN) " + sHex;
  }
}
