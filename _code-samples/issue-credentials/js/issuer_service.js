import express from "express";
import morgan from 'morgan';
import inquirer from "inquirer";
import dotenv from "dotenv";
import { Wallet, Client } from "xrpl";

import {
  validateCredentialRequest,
  verifyDocuments,
  credentialToXrpl,
  credentialFromXrpl,
} from "./credential.js";
import { XRPLTxError } from "./errors.js";
import { lookUpCredentials } from "./look_up_credentials.js";

dotenv.config();

async function initWallet() {
  let seed = process.env.ISSUER_ACCOUNT_SEED;

  if (!seed || seed.startsWith("<")) {
    const { seedInput } = await inquirer.prompt([
      {
        type: "password",
        name: "seedInput",
        message: "Issuer account seed:",
        validate: (input) => (input ? true : "Please specify the issuer's master seed"),
      },
    ]);
    seed = seedInput;
  }

  return Wallet.fromSeed(seed);
}

// Error handling --------------------------------------------------------------
function handleAppError(res, err) {
  if (err.name === "ValueError") {
    return res.status(err.status).json({
      error: err.type,
      error_message: err.message,
    });
  }
  
  if (err.name === "XRPLTxError") {
    return res.status(err.status).json(err.body);
  }

  // Default fallback
  return res.status(400).json({ error_message: err.message });
}

async function main() {
  // Set up XRPL connection ------------------------------------------------------
  const client = new Client("wss://s.devnet.rippletest.net:51233");
  await client.connect();

  const wallet = await initWallet();
  console.log("✅ Starting credential issuer with XRPL address", wallet.address);

  // Define Express app ------------------------------------------------------
  const app = express();
  app.use(morgan('common')); // Logger
  app.use(express.json()); // Middleware to parse JSON requests

  // POST /credential - Method for users to request a credential from the service -------------------
  app.post("/credential", async (req, res) => {
    try {
      // validateCredentialRequest() throws if the request is not validly formatted
      const credRequest = validateCredentialRequest(req.body);

      /**
       * As a credential issuer, you typically need to verify some information
       * about someone before you issue them a credential. For this example,
       * the user passes relevant information in a documents field of the API request.
       * The documents are kept confidential, off-chain.
       * 
       * verifyDocuments() throws if the provided documents don't pass inspection
       */
      verifyDocuments(req.body);

      const credXrpl = credentialToXrpl(credRequest);

      const tx = {
        TransactionType: "CredentialCreate",
        Account: wallet.address,
        Subject: credXrpl.subject,
        CredentialType: credXrpl.credential,
        URI: credXrpl.uri,
        Expiration: credXrpl.expiration,
      };
      const ccResponse = await client.submitAndWait(tx, { autofill: true, wallet });

      if (ccResponse.result.meta.TransactionResult === "tecDUPLICATE") {
        throw new XRPLTxError(ccResponse, 409);
      } else if (ccResponse.result.meta.TransactionResult !== "tesSUCCESS") {
        throw new XRPLTxError(ccResponse);
      }

      return res.status(201).json(ccResponse.result);
    } catch (err) {
      return handleAppError(res, err);
    }
  });

  // GET /admin/credential - Method for admins to look up all credentials issued -------------------
  app.get("/admin/credential", async (req, res) => {
    try {
      // ?accepted=yes|no|both query parameter - the default is "both"
      const query = Object.fromEntries(
        Object.entries(req.query).map(([k, v]) => [k.toLowerCase(), v])
      );
      const filterAccepted = (query.accepted || "both").toLowerCase();

      const credentials = await lookUpCredentials(client, wallet.address, "", filterAccepted);
      const result = credentials.map((entry) => credentialFromXrpl(entry));

      return res.status(200).json({ credentials: result });
    } catch (err) {
      return handleAppError(res, err);
    }
  });

  // DELETE /admin/credential - Method for admins to revoke an issued credential ----------------------------
  app.delete("/admin/credential", async (req, res) => {
    let delRequest;
    try {
      delRequest = validateCredentialRequest(req.body);
      const { credential } = credentialToXrpl(delRequest);

      // To save on transaction fees, check if the credential exists on ledger before attempting to delete it.
      // If the credential is not found, a RippledError (`entryNotFound`) is thrown.
      await client.request({
        command: "ledger_entry",
        credential: {
          subject: delRequest.subject,
          issuer: wallet.address,
          credential_type: credential,
        },
        ledger_index: "validated",
      });

      const tx = {
        TransactionType: "CredentialDelete",
        Account: wallet.address,
        Subject: delRequest.subject,
        CredentialType: credential,
      };

      const cdResponse = await client.submitAndWait(tx, { autofill: true, wallet });
      if (cdResponse.result.meta.TransactionResult === "tecNO_ENTRY") {
        // Usually this won't happen since we just checked for the credential,
        // but it's possible it got deleted since then.
        throw new XRPLTxError(cdResponse, 404);
      } else if (cdResponse.result.meta.TransactionResult !== "tesSUCCESS") {
        throw new XRPLTxError(cdResponse);
      }

      return res.status(200).json(cdResponse.result);
    } catch (err) {
      if (err.data?.error === "entryNotFound") {
        return res.status(404).json({
          error: err.data.error,
          error_message: `Credential doesn't exist for subject '${delRequest.subject}' and credential type '${delRequest.credential}'`,
        });
      } else {
        return handleAppError(res, err);
      }
    }
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🔐 Credential issuer service running on port: ${PORT}`);
  });
}

// Start the server --------------------------------------------------------------
main().catch((err) => {
  console.error("❌ Fatal startup error:", err);
  process.exit(1);
});

/**
 * Tip: Express returns plain text by default for unhandled routes (like 404 Not Found).
 * To ensure consistent JSON responses across your API, consider adding a catch-all
 * handler.
 *
 * Example:
 *
 * // Handle unmatched routes
 * app.use((req, res) => {
 *   res.status(404).json({
 *     error: "notFound",
 *     error_message: `Route not found: ${req.method} ${req.originalUrl}`,
 *   });
 * });
 *
 * You can also add a global error handler for unhandled exceptions:
 *
 * app.use((err, req, res, next) => {
 *   console.error("Unhandled error:", err);
 *   res.status(500).json({
 *     error: "internalServerError",
 *     error_message: "Something went wrong.",
 *   });
 * });
 */
