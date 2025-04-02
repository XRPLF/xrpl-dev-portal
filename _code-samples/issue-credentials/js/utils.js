const { isValidClassicAddress } = require("xrpl");

// Validate credential type (1–64 ASCII alphanum, underscore, dash, dot)
function isAllowedCredentialType(credential) {
  const regex = /^[A-Za-z0-9_.-]{1,64}$/;
  return regex.test(credential);
}

// Validate URI (1–256 characters, URL-safe)
function isAllowedUri(uri) {
  const regex = /^[A-Za-z0-9\-._~:/?#\[\]@!$&'()*+,;=%]{1,256}$/;
  return regex.test(uri);
}

// String → hex (uppercase)
function strToHex(str) {
  return Buffer.from(str, "utf8").toString("hex").toUpperCase();
}

// JS Date → Ripple epoch seconds
function datetimeToRippleTime(date) {
  const rippleEpoch = 946684800; // 2000-01-01T00:00:00Z
  const seconds = Math.floor(date.getTime() / 1000);
  return seconds - rippleEpoch;
}

// Ripple epoch seconds → JS Date
function rippleTimeToDatetime(rippleTime) {
  const rippleEpoch = 946684800;
  return new Date((rippleTime + rippleEpoch) * 1000);
}

module.exports = {
  isAllowedCredentialType,
  isAllowedUri,
  strToHex,
  datetimeToRippleTime,
  rippleTimeToDatetime,
  isValidClassicAddress,
};
