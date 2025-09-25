import { Client, rippleTimeToISOTime, convertStringToHex } from "xrpl"

const client = new Client("wss://s.devnet.rippletest.net:51233")
await client.connect()

const subject_address = "rsYhHbanGpnYe3M6bsaMeJT5jnLTfDEzoA"
const issuer_address = "rEzikzbnH6FQJ2cCr4Bqmf6c3jyWLzkonS"
const credential_type = convertStringToHex("my_credential").toUpperCase()

// Look up Credential ledger entry --------------------------------------------
const ledgerEntryRequest = {
  command: "ledger_entry",
  credential: {
    subject: subject_address,
    issuer: issuer_address,
    credential_type: credential_type,
  },
  ledger_index: "validated",
}
console.log("Looking up credential...")
console.log(JSON.stringify(ledgerEntryRequest, null, 2))

let xrplResponse
try {
  xrplResponse = await client.request(ledgerEntryRequest)
} catch (err) {
  if (err.data?.error === "entryNotFound") {
    console.error("Credential was not found")
  } else {
    console.error(err)
  }
  process.exit(1)
}

const credential = xrplResponse.result.node
console.log("Found credential:")
console.log(JSON.stringify(credential, null, 2))

// Check if the credential has been accepted ----------------------------------
const lsfAccepted = 0x00010000
if (!(credential.Flags & lsfAccepted)) {
  console.log("Credential is not accepted.")
  process.exit(2)
}

// Confirm that the credential is not expired ---------------------------------
if (credential.Expiration) {
  const expirationTime = rippleTimeToISOTime(credential.Expiration)
  console.log(`Credential has expiration: ${expirationTime}`)
  console.log("Looking up validated ledger to check for expiration.")

  const ledgerResponse = await client.request({
    command: "ledger",
    ledger_index: "validated",
  })

  const closeTime = rippleTimeToISOTime(ledgerResponse.result.ledger.close_time)
  console.log(`Most recent validated ledger was at: ${closeTime}`)

  if (new Date(closeTime) > new Date(expirationTime)) {
    console.log("Credential is expired.")
    process.exit(3)
  }
}

// Credential has passed all checks -------------------------------------------
console.log("Credential is valid.")
client.disconnect()
