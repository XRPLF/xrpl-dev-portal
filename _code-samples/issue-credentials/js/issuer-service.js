const express = require("express");
const morgan = require('morgan');
const dotenv = require("dotenv");
const { Wallet, Client } = require("xrpl");
const createRoutes = require("./routes");

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

  app.use("/", createRoutes(wallet, client));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🔐 Credential issuer service running on port: ${PORT}`);
  });
}

main().catch((err) => {
  console.error("❌ Fatal startup error:", err);
  process.exit(1);
});
