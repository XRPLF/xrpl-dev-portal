import { Client, rippleTimeToISOTime, convertStringToHex } from "xrpl"

const client = new Client("wss://xrplcluster.com")
await client.connect()

const SUBJECT_ADDRESS = "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
const ISSUER_ADDRESS = "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX"
const CREDENTIAL_TYPE = convertStringToHex("my_credential").toUpperCase()

// Look up Credential ledger entry --------------------------------------------
const ledgerEntryRequest = {
  command: "ledger_entry",
  credential: {
    subject: SUBJECT_ADDRESS,
    issuer: ISSUER_ADDRESS,
    credential_type: CREDENTIAL_TYPE,
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
  client.disconnect()
  process.exit(1)
}

const credential = xrplResponse.result.node
console.log("Found credential:")
console.log(JSON.stringify(credential, null, 2))

// Check if the credential has been accepted ----------------------------------
const lsfAccepted = 0x00010000
if (!(credential.Flags & lsfAccepted)) {
  console.log("Credential is not accepted.")
  client.disconnect()
  process.exit(2)
}

// Confirm that the credential is not expired ---------------------------------
if (credential.Expiration) {
  const expirationTime = rippleTimeToISOTime(credential.Expiration)
  console.log(`Credential has expiration: ${expirationTime}`)
  console.log("Looking up validated ledger to check for expiration.")

  let ledgerResponse
  try {
    ledgerResponse = await client.request({
      command: "ledger",
      ledger_index: "validated",
    })
  } catch (err) {
    console.error("Error looking up most recent validated ledger:", err)
    client.disconnect()
    process.exit(3)
  }

  const closeTime = rippleTimeToISOTime(ledgerResponse.result.ledger.close_time)
  console.log(`Most recent validated ledger was at: ${closeTime}`)

  if (new Date(closeTime) > new Date(expirationTime)) {
    console.log("Credential is expired.")
    client.disconnect()
    process.exit(4)
  }
}

// Credential has passed all checks -------------------------------------------
console.log("Credential is valid.")
client.disconnect()
