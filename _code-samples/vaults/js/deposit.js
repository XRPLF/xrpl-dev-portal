// IMPORTANT: This example deposits into an existing PRIVATE vault.
// The depositor account used has valid credentials in the vault's Permissioned Domain.
// Without valid credentials, the VaultDeposit transaction will fail.
// If you want to deposit into a public vault, you can replace the vaultID and shareMPTIssuanceId 
// values with your own.

import xrpl from "xrpl"
import { execSync } from "child_process"
import fs from "fs"

// Auto-run setup if needed
if (!fs.existsSync("vaultSetup.json")) {
  console.log(`\n=== Vault setup data doesn't exist. Running setup script... ===\n`)
  execSync("node vaultSetup.js", { stdio: "inherit" })
}

// Load setup data
const setupData = JSON.parse(fs.readFileSync("vaultSetup.json", "utf8"))

// Connect to the network
const client = new xrpl.Client("wss://s.devnet.rippletest.net:51233")
await client.connect()

// You can replace these values with your own
const depositor = xrpl.Wallet.fromSeed(setupData.depositor.seed)
const vaultID = setupData.vaultID
const assetMPTIssuanceId = setupData.mptIssuanceId
const shareMPTIssuanceId = setupData.vaultShareMPTIssuanceId

console.log(`Depositor address: ${depositor.address}`)
console.log(`Vault ID: ${vaultID}`)
console.log(`Asset MPT issuance ID: ${assetMPTIssuanceId}`)
console.log(`Vault share MPT issuance ID: ${shareMPTIssuanceId}`)

const depositAmount = 1

// Get initial vault state ----------------------
console.log("\n=== Getting initial vault state... ===")
const initialVaultInfo = await client.request({
  command: "vault_info",
  vault_id: vaultID,
  ledger_index: "validated"
})

console.log(` - Total vault value: ${initialVaultInfo.result.vault.AssetsTotal}`)
console.log(` - Available assets: ${initialVaultInfo.result.vault.AssetsAvailable}`)

// Check depositor's asset balance ----------------------
console.log("\n=== Checking depositor's balance... ===")
try {
  // Use ledger_entry to get specific MPT issuance balance
  const ledgerEntryResult = await client.request({
    command: "ledger_entry",
    mptoken: {
      mpt_issuance_id: assetMPTIssuanceId,
      account: depositor.address
    },
    ledger_index: "validated"
  })

  const balance = ledgerEntryResult.result.node?.MPTAmount
  console.log(`Balance: ${balance}`)

  // Check if balance is sufficient
  if (balance < depositAmount) {
    console.error(`Error: Insufficient balance! Have ${balance}, need ${depositAmount}`)
    await client.disconnect()
    process.exit(1)
  }
} catch (error) {
  if (error.data?.error === 'entryNotFound') {
    console.error(`Error: The depositor doesn't hold any assets with ID: ${assetMPTIssuanceId}`)
  } else {
    console.error(`Error checking MPT: ${error}`)
  }
  await client.disconnect()
  process.exit(1)
}

// Prepare VaultDeposit transaction ----------------------
console.log(`\n=== VaultDeposit transaction ===`)
const vaultDepositTx = {
  TransactionType: "VaultDeposit",
  Account: depositor.address,
  VaultID: vaultID,
  Amount: {
    mpt_issuance_id: assetMPTIssuanceId,
    value: depositAmount.toString()
  }
}

// Validate the transaction structure before submitting
xrpl.validate(vaultDepositTx)
console.log(JSON.stringify(vaultDepositTx, null, 2))

// Submit VaultDeposit transaction ----------------------
console.log("\n=== Submitting VaultDeposit transaction... ===")
const depositResult = await client.submitAndWait(vaultDepositTx, {
  wallet: depositor,
  autofill: true,
})
if (depositResult.result.meta.TransactionResult !== "tesSUCCESS") {
  const result_code = depositResult.result.meta.TransactionResult
  console.error("Error: Unable to deposit:", result_code)
  await client.disconnect()
  process.exit(1)
}
console.log("Deposit successful!")

// Extract vault state from transaction metadata ----------------------
console.log("\n=== Vault state after deposit ===")
const affectedNodes = depositResult.result.meta.AffectedNodes
const vaultNode = affectedNodes.find(
  (node) => {
    return (
      node.ModifiedNode &&
      node.ModifiedNode.LedgerEntryType === "Vault" &&
      node.ModifiedNode.LedgerIndex === vaultID
    )
  }
)
if (vaultNode) {
  const vaultFields = vaultNode.ModifiedNode.FinalFields
  console.log(` - Total vault value: ${vaultFields.AssetsTotal}`)
  console.log(` - Available assets: ${vaultFields.AssetsAvailable}`)
}

// Get the depositor's share balance ----------------------
console.log("\n=== Depositor's share balance ==")
const depositorShareNode = affectedNodes.find((node) => {
  const shareNode = node.ModifiedNode || node.CreatedNode
  const fields = shareNode?.FinalFields || shareNode?.NewFields
  return (
    shareNode &&
    shareNode.LedgerEntryType === "MPToken" &&
    fields?.Account === depositor.address &&
    fields?.MPTokenIssuanceID === shareMPTIssuanceId
  )
})
if (depositorShareNode) {
  const shareNode = depositorShareNode.ModifiedNode || depositorShareNode.CreatedNode
  const shareFields = shareNode.FinalFields || shareNode.NewFields
  console.log(`Shares held: ${shareFields.MPTAmount}`)
}

await client.disconnect()

