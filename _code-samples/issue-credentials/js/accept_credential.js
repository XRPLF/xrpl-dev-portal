#!/usr/bin/env node

import dotenv from "dotenv";
import inquirer from "inquirer";
import { Client, Wallet } from "xrpl";
import { lookUpCredentials } from "./look_up_credentials.js";
import { hexToString } from "@xrplf/isomorphic/dist/utils/index.js";

const XRPL_SERVER = "wss://s.devnet.rippletest.net:51233"

dotenv.config();

async function initWallet() {
  let seed = process.env.SUBJECT_ACCOUNT_SEED;
  if (!seed) {
    const { seedInput } = await inquirer.prompt([
      {
        type: "password",
        name: "seedInput",
        message: "Subject account seed:",
        validate: (input) => (input ? true : "Please specify the subject's master seed"),
      },
    ]);
    seed = seedInput;
  }

  return Wallet.fromSeed(seed);
}

async function main() {
  const client = new Client(XRPL_SERVER);
  await client.connect();    

  const wallet = await initWallet();

  const pendingCredentials = await lookUpCredentials(
    client,
    "",
    wallet.address,
    "no"
  );

  const choices = pendingCredentials.map((cred, i) => ({
    name: `${i+1}) '${hexToString(cred.CredentialType)}' issued by ${cred.Issuer}`,
    value: i,
  }));
  choices.unshift({ name: "0) No, quit.", value: -1 });

  const { selectedIndex } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedIndex",
      message: "Accept a credential?",
      choices,
    },
  ]);

  if (selectedIndex === -1) {
    process.exit(0);
  }

  const chosenCred = pendingCredentials[selectedIndex];
  const tx = {
    TransactionType: "CredentialAccept",
    Account: wallet.address,
    CredentialType: chosenCred.CredentialType,
    Issuer: chosenCred.Issuer,
  };

  console.log("Submitting transaction:", tx);
  const response = await client.submit(tx, { autofill: true, wallet });
  console.log("Response:", response);

  await client.disconnect();
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
})

