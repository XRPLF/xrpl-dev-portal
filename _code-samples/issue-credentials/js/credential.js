import {
  isoTimeToRippleTime,
  rippleTimeToISOTime,
  isValidClassicAddress,
} from "xrpl";
import { stringToHex, hexToString } from "@xrplf/isomorphic/dist/utils/index.js";

import { ValueError } from "./errors.js";

// Regex constants
const CREDENTIAL_REGEX = /^[A-Za-z0-9_.-]{1,128}$/;
const URI_REGEX = /^[A-Za-z0-9\-._~:/?#\[\]@!$&'()*+,;=%]{1,256}$/;

/**
 * Validate credential request.
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
  if (!CREDENTIAL_REGEX.test(credential)) {
    /**
     * Checks if the specified credential type is one that this service issues.
     * XRPL credential types can be any binary data; this service issues
     * any credential that can be encoded from the following ASCII chars:
     * alphanumeric characters, underscore, period, and dash. (min length 1, max 64)
     *
     * You might want to further limit the credential types, depending on your
     * use case; for example, you might only issue one specific credential type.
     */
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
    if (typeof expiration !== "string") {
      throw new ValueError(`Unsupported expiration format: ${typeof expiration}`);
    }
    parsedExpiration = new Date(expiration);
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

// Convert an XRPL ledger entry into a usable credential object
export function credentialFromXrpl(entry) {
  const { Subject, CredentialType, URI, Expiration, Flags } = entry;
  return {
    subject: Subject,
    credential: hexToString(CredentialType),
    uri: URI ? hexToString(URI) : undefined,
    expiration: Expiration ? rippleTimeToISOTime(Expiration) : undefined,
    accepted: Boolean(Flags & 0x00010000), // lsfAccepted
  };
}

// Convert to an object in a format closer to the XRP Ledger representation
export function credentialToXrpl(cred) {
   // Credential type and URI are hexadecimal;
   // Expiration, if present, is in seconds since the Ripple Epoch.
  return {
    subject: cred.subject,
    credential: stringToHex(cred.credential),
    uri: cred.uri ? stringToHex(cred.uri) : undefined,
    expiration: cred.expiration
      ? isoTimeToRippleTime(cred.expiration)
      : undefined,
  };
}


export function verifyDocuments({ documents }) {
 /**
  * This is where you would check the user's documents to see if you
  * should issue the requested Credential to them.
  * Depending on the type of credentials your service needs, you might
  * need to implement different types of checks here.
  */
  if (typeof documents !== "object" || Object.keys(documents).length === 0) {
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
