const express = require("express");
const {
  validateCredentialRequest,
  verifyDocuments,
  credentialToXrpl,
  serializeCredential,
  parseCredentialFromXrpl,
} = require("./credential");
const { lookUpCredentials } = require("./look_up_credentials");

function createRoutes(wallet, client) {
  const router = express.Router();

  // POST /credential - Method for users to request a credential from the service -------------------
  router.post("/credential", async (req, res) => {
    try {
      // validateCredentialRequest() throws if the request is not validly formatted
      const credRequest = validateCredentialRequest(req.body);
      // verifyDocuments() throws if the provided documents don't pass inspection
      verifyDocuments(req.body)
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
        return res.status(409).json(result)
      } else if (result.engine_result !== "tesSUCCESS") {
        return res.status(400).json(result);
      }

      return res.status(201).json(result);
    } catch (err) {
      return res.status(400).json({ error: "badRequest", error_message: err.message });
    }
  });

  // GET /admin/credential - Method for admins to look up all credentials issued -------------------
  router.get("/admin/credential", async (req, res) => {
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
      return res.status(400).json({ error: err.message });
    }
  });

  return router;
}

module.exports = createRoutes;
