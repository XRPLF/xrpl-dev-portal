import xrpl from 'xrpl'
import { execSync } from 'child_process'
import fs from 'fs'

// Looks for setup data required to run the checks tutorials.
// If missing, checks-setup.js will generate the data.

if (!fs.existsSync('checks-setup.json')) {
  console.log(`\n=== Checks tutorial data doesn't exist. Running setup script... ===\n`)
  execSync('node checks-setup.js', { stdio: 'inherit' })
}

// Load setup data ----------------------

const setupData = JSON.parse(fs.readFileSync('checks-setup.json', 'utf8'))
const address = setupData.recipient.address

// Connect ----------------------

const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
await client.connect()

// Loop through account objects until marker is undefined ----------------------

let currentMarker = null
let checksFound = []
do {
  const request = {
    command: 'account_objects',
    account: address,
    ledger_index: 'validated',
    type: 'check'
  }

  if (currentMarker) {
    request.marker = currentMarker
  }

  const response = await client.request(request)

  checksFound = checksFound.concat(response.result.account_objects)
  currentMarker = response.result.marker

} while (currentMarker)

// Filter results by recipient ----------------------
// To filter by sender, check Account field instead of Destination

const checksByRecipient = []
for (const check of checksFound) {
  if (check.Destination == address) {
    checksByRecipient.push(check)
  }
}

// Print results ----------------------

if (checksByRecipient.length === 0) {
  console.log('No checks found.')
} else {
  console.log('Checks: \n', JSON.stringify(checksByRecipient, null, 2))
}

// Disconnect ----------------------

await client.disconnect()
