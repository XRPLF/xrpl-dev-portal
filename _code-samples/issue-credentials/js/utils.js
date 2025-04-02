// Validate credential type (1–64 ASCII alphanum, underscore, dash, dot)
export function isAllowedCredentialType(credential) {
  const regex = /^[A-Za-z0-9_.-]{1,64}$/;
  return regex.test(credential);
}

// Validate URI (1–256 characters, URL-safe)
export function isAllowedUri(uri) {
  const regex = /^[A-Za-z0-9\-._~:/?#\[\]@!$&'()*+,;=%]{1,256}$/;
  return regex.test(uri);
}

// String → hex (uppercase)
export function strToHex(str) {
  return Buffer.from(str, "utf8").toString("hex").toUpperCase();
}

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

// JS Date → Ripple epoch seconds
export function datetimeToRippleTime(date) {
  const rippleEpoch = 946684800; // 2000-01-01T00:00:00Z
  const seconds = Math.floor(date.getTime() / 1000);
  return seconds - rippleEpoch;
}

// Ripple epoch seconds → JS Date
export function rippleTimeToDatetime(rippleTime) {
  const rippleEpoch = 946684800;
  return new Date((rippleTime + rippleEpoch) * 1000);
}
