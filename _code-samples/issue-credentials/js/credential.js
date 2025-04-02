const {
  isValidClassicAddress,
  strToHex,
  decodeHex,
  datetimeToRippleTime,
  rippleTimeToDatetime,
} = require("./utils");

// Regex constants
const CREDENTIAL_REGEX = /^[A-Za-z0-9_.-]{1,64}$/;
const URI_REGEX = /^[A-Za-z0-9\-._~:/?#\[\]@!$&'()*+,;=%]{1,256}$/;

/**
 * Validate and parse a credential request.
 *
 * This function performs parameter validation. 
 * Validated fields:
    subject (required): the subject of the credential, as a classic address
    credential (required): the credential type, in human-readable (ASCII) chars
    uri (optional): URI of the credential in human-readable (ASCII) chars
    expiration (optional): time when the credential expires
                            (displayed as an ISO 8601 format string in JSON)
    accepted (optional): true if this credential has been accepted
                               on the XRPL by the subject account.
                               False if not accepted. 
                               Omitted for credentials that haven't been 
                               issued yet.
 */
function parseCredentialRequest(data) {
  const { subject, credential, uri, expiration, documents } = data;

  // Validate subject
  if (typeof subject !== "string") {
    throw new Error("Must provide a string 'subject' field");
  }
  if (!isValidClassicAddress(subject)) {
    throw new Error(`subject not valid address: '${subject}'`);
  }

  // Validate credential
  if (typeof credential !== "string") {
    throw new Error("Must provide a string 'credential' field");
  }

  /* 
  Checks if the specified credential type is one that this service issues. 

  XRPL credential types can be any binary data; this service issues
  any credential that can be encoded from the following ASCII chars:
  alphanumeric characters, underscore, period, and dash.
  (min length 1, max 64)

  You might want to further limit the credential types, depending on your 
  use case; for example, you might only issue one specific credential type.
  */
  if (!CREDENTIAL_REGEX.test(credential)) {
    throw new Error(`credential not allowed: '${credential}'.`);
  }

  /*
  (Optional) Checks if the specified URI is acceptable for this service.

  XRPL Credentials' URI values can be any binary data; this service
  adds any user-requested URI to a Credential as long as the URI
  can be encoded from the characters usually allowed in URIs, namely
  the following ASCII chars:

    alphanumeric characters (upper and lower case)
    the following symbols: -._~:/?#[]@!$&'()*+,;=%
    (minimum length 1 and max length 256 chars)

  You might want to instead define your own URI and attach it to the
  Credential regardless of user input, or you might want to verify that the
  URI points to a valid Verifiable Credential document that matches the user.
  */
  if (uri !== undefined) {
    if (typeof uri !== "string" || !URI_REGEX.test(uri)) {
      throw new Error(`URI isn't valid: ${uri}`);
    }
  }

  // Validate expiration (optional)
  let parsedExpiration;
  if (expiration !== undefined) {
    if (typeof expiration === "string") {
      parsedExpiration = new Date(expiration);
    } else if (expiration instanceof Date) {
      parsedExpiration = expiration;
    } else {
      throw new Error(`Unsupported expiration format: ${typeof expiration}`);
    }

    if (isNaN(parsedExpiration.getTime())) {
      throw new Error(`Invalid expiration date: ${expiration}`);
    }
  }

  /* This is where you would check the user's documents to see if you
    should issue the requested Credential to them.
    Depending on the type of credentials your service needs, you might
    need to implement different types of checks here.
    */
  if (!documents || typeof documents !== "object") {
    throw new Error("you must provide a non-empty 'documents' field");
  }

  // As a placeholder, this example checks that the documents field
  // contains a string field named "reason" containing the word "please".
  const reason = documents.reason;
  if (typeof reason !== "string") {
    throw new Error("documents must contain a 'reason' string");
  }
  if (!reason.toLowerCase().includes("please")) {
    throw new Error("reason must include 'please'");
  }

  return {
    subject,
    credential,
    uri,
    expiration: parsedExpiration,
    documents,
  };
}

/**
 * Convert a validated credential object into XRPL transaction format
 */
function toXrplFormat(cred) {
  return {
    subject: cred.subject,
    credential: strToHex(cred.credential),
    uri: cred.uri ? strToHex(cred.uri) : undefined,
    expiration: cred.expiration ? datetimeToRippleTime(cred.expiration) : undefined,
  };
}

/**
 * Convert an XRPL ledger entry into a usable app credential object
 */
function parseCredentialFromXrpl(entry) {
  const { Subject, CredentialType, URI, Expiration, Flags } = entry;

  if (!Subject || !CredentialType) {
    throw new Error("Missing required fields from XRPL credential entry");
  }

  return {
    subject: Subject,
    credential: decodeHex(CredentialType),
    uri: URI ? decodeHex(URI) : undefined,
    expiration: Expiration ? rippleTimeToDatetime(Expiration) : undefined,
    accepted: Boolean(Flags & 0x00010000), // lsfAccepted
  };
}

/**
 * Convert a credential object into API-friendly JSON
 */
function serializeCredential(cred) {
  const result = {
    subject: cred.subject,
    credential: cred.credential,
  };

  if (cred.uri) result.uri = cred.uri;
  if (cred.expiration) result.expiration = cred.expiration.toISOString();
  if (cred.accepted !== undefined) result.accepted = cred.accepted;

  return result;
}

module.exports = {
  parseCredentialRequest,
  toXrplFormat,
  parseCredentialFromXrpl,
  serializeCredential,
};
