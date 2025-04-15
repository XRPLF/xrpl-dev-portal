#!/usr/bin/env node

import { Command } from "commander";
import { Client, rippleTimeToISOTime, convertStringToHex } from "xrpl";
import winston from "winston";

// Set up logging --------------------------------------------------------------
// Use WARNING by default in case verify_credential is called from elsewhere.
const logger = winston.createLogger({
  level: "warn",
  transports: [new winston.transports.Console()],
  format: winston.format.simple(),
});

// Define an error to throw when XRPL lookup fails unexpectedly
class XRPLLookupError extends Error {
  constructor(xrplResponse) {
    super("XRPL look up error");
    this.name = "XRPLLookupError";
    this.body = xrplResponse.result;
  }
}

const CREDENTIAL_REGEX = /^[0-9A-F]{2,128}$/;
const LSF_ACCEPTED = 0x00010000;

async function verifyCredential(client, issuer, subject, credentialType, binary=false) {
  /**
   * Check whether an XRPL account holds a specified credential,
   * as of the most recently validated ledger.
   * Parameters:
   *  client - Client for interacting with rippled servers.
   *  issuer - Address of the credential issuer, in base58
   *  subject - Address of the credential holder/subject, in base58
   *  credentialType - Credential type to check for as a string,
   *                   which will be encoded as UTF-8 (1-128 bytes long).
   *  binary - Specifies that the credential type is provided in hexadecimal format.
   *  verbose - If true, print details to stdout during lookup.
   * You must provide the credential_type as input.
   * Returns True if the account holds the specified, valid credential.
   * Returns False if the credential is missing, expired, or not accepted.
   */

  // Handle function inputs --------------------------------------------------
  if (!credentialType) {
    throw new Error("Provide a non-empty credential_type");
  }

  // Encode credentialType as uppercase hex, if needed
  let credentialTypeHex = "";
  if (binary) {
    credentialTypeHex = credentialType.toUpperCase();
  } else {
    credentialTypeHex = convertStringToHex(credentialType).toUpperCase();
    logger.info(`Encoded credential_type as hex: ${credentialTypeHex}`);
  }

  if (credentialTypeHex.length % 2 !== 0 || !CREDENTIAL_REGEX.test(credentialTypeHex)) {
    // Hexadecimal is always 2 chars per byte, so an odd length is invalid.
    throw new Error("Credential type must be 1-128 bytes as hexadecimal.");
  }

  // Perform XRPL lookup of Credential ledger entry --------------------------
  const ledgerEntryRequest = {
    command: "ledger_entry",
    credential: {
      subject: subject,
      issuer: issuer,
      credential_type: credentialTypeHex,
    },
    ledger_index: "validated",
  };
  logger.info("Looking up credential...");
  logger.info(JSON.stringify(ledgerEntryRequest, null, 2));

  let xrplResponse;
  try {
    xrplResponse = await client.request(ledgerEntryRequest);
  } catch (err) {
    if (err.data?.error === "entryNotFound") {
      logger.info("Credential was not found");
      return false;
    } else {
      //Other errors, for example invalidly-specified addresses.
      throw new XRPLLookupError(xrplResponse);
    }
  }

  const credential = xrplResponse.result.node;
  logger.info("Found credential:");
  logger.info(JSON.stringify(credential, null, 2));

  // Confirm that the credential has been accepted ---------------------------
  if (!(credential.Flags & LSF_ACCEPTED)) {
    logger.info("Credential is not accepted.");
    return false
  } 
  
  // Confirm that the credential is not expired ------------------------------
  if (credential.Expiration) {
    const expirationTime = rippleTimeToISOTime(credential.Expiration);
    logger.info(`Credential has expiration: ${expirationTime}`);
    logger.info("Looking up validated ledger to check for expiration.");

    let ledgerResponse;
    try {
      ledgerResponse = await client.request({
        command: "ledger",
        ledger_index: "validated",
      });
    } catch (err) {
      throw new XRPLLookupError(err?.data || err);
    }

    const closeTime = rippleTimeToISOTime(ledgerResponse.result.ledger.close_time);
    logger.info(`Most recent validated ledger is: ${closeTime}`);

    if (new Date(closeTime) > new Date(expirationTime)) {
      logger.info("Credential is expired.");
      return false;
    }
  }

  // Credential has passed all checks ---------------------------------------
  logger.info("Credential is valid.");
  return true;
}


// Commandline usage -----------------------------------------------------------
async function main() {
  // JSON-RPC URLs of public servers
  const NETWORKS = {
    devnet: "wss://s.devnet.rippletest.net:51233",
    testnet: "wss://s.altnet.rippletest.net:51233",
    mainnet: "wss://xrplcluster.com/",
  };


  // Parse arguments ---------------------------------------------------------
  let result = false
  const program = new Command();
  program
    .name("verify-credential")
    .description("Verify an XRPL credential")
    .argument("[issuer]", "Credential issuer address as base58", "rEzikzbnH6FQJ2cCr4Bqmf6c3jyWLzkonS")
    .argument("[subject]", "Credential subject (holder) address as base58", "rsYhHbanGpnYe3M6bsaMeJT5jnLTfDEzoA")
    .argument("[credential_type]", "Credential type as string.", "my_credential")
    .option("-b, --binary", "Use binary (hexadecimal) for credential_type")
    .option(
      `-n, --network <network> {${Object.keys(NETWORKS)}}`,
      "Use the specified network for lookup",
      (value) => {
        if (!Object.keys(NETWORKS).includes(value)) {
          throw new Error(`Must be one of: ${Object.keys(NETWORKS)}`);
        }
        return value;
      },
      "devnet"
    )
    .option("-q, --quiet", "Don't print log messages")
    // Call verify_credential with appropriate args ----------------------------
    .action(async (issuer, subject, credentialType, options) => {
      const client = new Client(NETWORKS[options.network]);
      await client.connect();

      // Use INFO level by default when called from the commandline.
      if (!options.quiet) { logger.level = "info" }

      // Commander.js automatically sets options.binary to a boolean:
      //   - If you provide -b or --binary on the command line then options.binary = true
      //   - If you do not provide it then options.binary = false
      result = await verifyCredential(client, issuer, subject, credentialType, options.binary);

      await client.disconnect();
    });
  await program.parseAsync(process.argv);

  // Return a nonzero exit code if credential verification failed -----------
  if (!result) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
