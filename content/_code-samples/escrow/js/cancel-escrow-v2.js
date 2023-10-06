// Code in progress.

const xrpl = require("xrpl")

async function main() {

  // Create a client and connect to the network.
  const client = new xrpl.Client("wss://xrplcluster.com/")
  await client.connect()

  // Query the most recently validated ledger for info.
  const ledger = await client.request({
    "command": "ledger",
    "ledger_index": "validated",
  })
  const ledgerCloseTime = ledger["result"]["ledger"]["close_time"]
  
  // Check the `CancelAfter` time of the escrow.
  // For this example, we have the identifying hash of the `EscrowCreate` transaction.
  const escrowInfo = await client.request({
    "command": "tx",
    "transaction": "3DC728E4DB4120AD26DD41997C42FF5AD46C0073D8692AFB8F59660D058D87A3",    
  })
  const escrowAccountSender = escrowInfo["result"]["Account"]
  const escrowCancelAfter = escrowInfo["result"]["CancelAfter"]
  const escrowSequence = escrowInfo["result"]["Sequence"]
  
  // Submit an `EscrowCancel` transaction if the cancel after time is smaller than the ledger close time.
  // Any valid account can submit an escrow cancel transaction.
  if (escrowCancelAfter < ledgerCloseTime) {
    client.submitAndWait({
        "Account": escrowAccountSender,
        "TransactionType": "EscrowCancel",
        "Owner": escrowAccountSender,
        "OfferSequence": escrowSequence
    })
  }

  client.disconnect()
}

main()
