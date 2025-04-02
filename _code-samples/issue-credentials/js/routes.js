const express = require("express");
const { parseCredentialRequest, toXrplFormat } = require("./credential");

function createRoutes(wallet, client) {
  const router = express.Router();

 // POST /credential - Method for users to request a credential from the service -------------------
  router.post("/credential", async (req, res) => {
    try {
      // parseCredentialRequest() throws if the request is not validly formatted
      const credRequest = parseCredentialRequest(req.body);
      const credXrpl = toXrplFormat(credRequest);

      const tx = {
        TransactionType: "CredentialCreate",
        Account: wallet.classicAddress,
        Subject: credXrpl.subject,
        CredentialType: credXrpl.credential,
        URI: credXrpl.uri,
        Expiration: credXrpl.expiration,
      };

      const ccResponse = await client.submitAndWait(tx, {
        autofill: true, // Adds in fields that can be automatically set like fee and last_ledger_sequence
        wallet,
      });

      const result = ccResponse.result;

      if (ccResponse.status === "error") {
        return res.status(400).json({ result });
      } else if (result.meta.TransactionResult === "tecDUPLICATE") {
        return res.status(409).json({ result });
      } else if (result.meta.TransactionResult !== "tesSUCCESS") {
        return res.status(400).json({ result });
      }

      return res.status(201).json(result);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  return router;
}

module.exports = createRoutes;
