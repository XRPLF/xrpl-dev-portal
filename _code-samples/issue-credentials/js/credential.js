import {
  strToHex,
  decodeHex,
  datetimeToRippleTime,
  rippleTimeToDatetime,
} from "./utils.js";

import { isValidClassicAddress } from "xrpl";

import { ValueError } from "./errors.js";

// Regex constants
const CREDENTIAL_REGEX = /^[A-Za-z0-9_.-]{1,64}$/;
const URI_REGEX = /^[A-Za-z0-9\-._~:/?#\[\]@!$&'()*+,;=%]{1,256}$/;

/**
 * Validate credential request.
 *
 * This function performs parameter validation. Validated fields:
 *   - subject (required): the subject of the credential, as a classic address
 *   - credential (required): the credential type, in human-readable (ASCII) chars
 *   - uri (optional): URI of the credential in human-readable (ASCII) chars
 *   - expiration (optional): time when the credential expires (displayed as an ISO 8601 format string in JSON)
 */
export function validateCredentialRequest({ subject, credential, uri, expiration }) {
  // Validate subject
  if (typeof subject !== "string") {
    throw new ValueError("Must provide a string 'subject' field");
  }
  if (!isValidClassicAddress(subject)) {
    throw new ValueError(`subject not valid address: '${subject}'`);
  }

  // Validate credential
  if (typeof credential !== "string") {
    throw new ValueError("Must provide a string 'credential' field");
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
    throw new ValueError(`credential not allowed: '${credential}'.`);
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
      throw new ValueError(`URI isn't valid: ${uri}`);
    }
  }

  // Validate and parse expiration
  let parsedExpiration;
  if (expiration !== undefined) {
    if (typeof expiration === "string") {
      parsedExpiration = new Date(expiration);
    } else {
      throw new ValueError(`Unsupported expiration format: ${typeof expiration}`);
    }

    if (isNaN(parsedExpiration.getTime())) {
      throw new ValueError(`Invalid expiration date: ${expiration}`);
    }
  }

  return {
    subject,
    credential,
    uri,
    expiration: parsedExpiration,
  };
}

/**
 * As a credential issuer, you typically need to verify some information
 * about someone before you issue them a credential. For this example,
 * the user passes relevant information in a documents field of the API request.
 * The documents are kept confidential, off-chain.
 */
export function verifyDocuments({documents}) {
  /* 
    This is where you would check the user's documents to see if you
    should issue the requested Credential to them.
    Depending on the type of credentials your service needs, you might
    need to implement different types of checks here.
  */
  if (typeof documents !== 'object' || Object.keys(documents).length === 0) {
    throw new ValueError("you must provide a non-empty 'documents' field");
  }

  // As a placeholder, this example checks that the documents field
  // contains a string field named "reason" containing the word "please".
  const reason = documents.reason;
  if (typeof reason !== "string") {
    throw new ValueError("documents must contain a 'reason' string");
  }

  if (!reason.toLowerCase().includes("please")) {
    throw new ValueError("reason must include 'please'");
  }
}

/**
 * Convert to a Credential object in a format closer to the XRP Ledger representation.
 * Credential type and URI are hexadecimal;
 * Expiration, if present, is in seconds since the Ripple Epoch.
 */
export function credentialToXrpl(cred) {
  return {
    subject: cred.subject,
    credential: strToHex(cred.credential),
    uri: cred.uri ? strToHex(cred.uri) : undefined,
    expiration: cred.expiration ? datetimeToRippleTime(cred.expiration) : undefined,
  };
}

// Convert an XRPL ledger entry into a usable  credential object
export function parseCredentialFromXrpl(entry) {
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
export function serializeCredential(cred) {
  const result = {
    subject: cred.subject,
    credential: cred.credential,
  };

  if (cred.uri) result.uri = cred.uri;
  if (cred.expiration) result.expiration = cred.expiration.toISOString();
  if (cred.accepted !== undefined) result.accepted = cred.accepted;

  return result;
}
