const express = require("express");
const morgan = require('morgan');
const dotenv = require("dotenv");
const { Wallet, Client } = require("xrpl");

const {
  validateCredentialRequest,
  verifyDocuments,
  credentialToXrpl,
  serializeCredential,
  parseCredentialFromXrpl,
} = require("./credential");
const { XRPLTxError, XRPLLookupError } = require("./errors");
const { lookUpCredentials } = require("./look_up_credentials");

dotenv.config();

async function main() {
  // Set up XRPL connection ------------------------------------------------------
  const SEED = process.env.ISSUER_ACCOUNT_SEED;
  if (!SEED) {
    console.error("❌ Please specify the ISSUER_ACCOUNT_SEED in .env file");
    process.exit(1);
  }

  const wallet = Wallet.fromSeed(SEED);
  console.log("✅ Starting credential issuer with XRPL address", wallet.classicAddress);

  const client = new Client("wss://s.devnet.rippletest.net:51233");
  await client.connect();

  // Define Express app ------------------------------------------------------
  const app = express();
  app.use(morgan('common')) // Logger
  app.use(express.json()); // Middleware to parse JSON requests

  // POST /credential - Method for users to request a credential from the service -------------------
  app.post("/credential", async (req, res) => {
    try {
      // validateCredentialRequest() throws if the request is not validly formatted
      const credRequest = validateCredentialRequest(req.body);
      // verifyDocuments() throws if the provided documents don't pass inspection
      verifyDocuments(req.body);
      const credXrpl = credentialToXrpl(credRequest);

      const tx = {
        TransactionType: "CredentialCreate",
        Account: wallet.classicAddress,
        Subject: credXrpl.subject,
        CredentialType: credXrpl.credential,
        URI: credXrpl.uri,
        Expiration: credXrpl.expiration,
      };
      const ccResponse = await client.submit(tx, { autofill: true, wallet });

      const result = ccResponse.result;
      if (result.engine_result === "tecDUPLICATE") {
        throw new XRPLTxError(result, 409);
      } else if (result.engine_result !== "tesSUCCESS") {
        throw new XRPLTxError(result);
      }

      return res.status(201).json(result);
    } catch (err) {
      return handleAppError(res, err);
    }
  });

  // GET /admin/credential - Method for admins to look up all credentials issued -------------------
  app.get("/admin/credential", async (req, res) => {
    try {
      // ?accepted=yes|no|both query parameter - the default is "both"
      const filterAccepted = (req.query.accepted || "both").toLowerCase();
      if (!["yes", "no", "both"].includes(filterAccepted)) {
        return res.status(400).json({ error: "Invalid 'accepted' filter" });
      }

      const credentials = await lookUpCredentials(client, wallet.classicAddress, filterAccepted);
      console.log(credentials)
      // const result = credentials.map((entry) =>
      //   serializeCredential(parseCredentialFromXrpl(entry))
      // );

      // return res.json({ credentials: result })
    } catch (err) {
      return handleAppError(res, err)
    }
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🔐 Credential issuer service running on port: ${PORT}`);
  });
}

function handleAppError(res, err) {
  if (err.name === "ValueError") {
    return res.status(err.status).json({
      error: err.type,
      error_message: err.message,
    });
  }

  if (err.name === "XRPLTxError" || err.name === "XRPLLookupError") {
    return res.status(err.status).json(err.body);
  }

  // Default fallback
  return res.status(400).json({ error_message: err.message });
}


main().catch((err) => {
  console.error("❌ Fatal startup error:", err);
  process.exit(1);
});
