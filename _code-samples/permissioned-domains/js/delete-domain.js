import xrpl from 'xrpl'
import { stringToHex } from '@xrplf/isomorphic/dist/utils/index.js'
import fs from 'fs'

// Set up client --------------------------------------------------------------
const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
await client.connect()

// Load setup data ------------------------------------------------------------
if (!fs.existsSync('setup.json')) {
  console.error('Config data not found. Did you run create_domain.py first?')
  process.exit(1)
}
const configData = JSON.parse(fs.readFileSync('setup.json', 'utf8'))
const wallet = xrpl.Wallet.fromSeed(configData.owner.seed)
if (wallet.address !== configData.owner.address) {
    console.error('Address did not match saved value. Did you use the wrong ',
        'cryptographic algorithm?',
        '\n\tSaved:', configData.owner.address,
        '\n\tGenerated:', wallet.address)
    client.disconnect()
    process.exit(2)
}

const domainID = configData.domain_id

console.log('Domain ID:', domainID)
console.log('Domain owner:', wallet.address)

// Delete a permissioned domain -----------------------------------------------
const pDomainDel = {
  TransactionType: "PermissionedDomainDelete",
  Account: wallet.address,
  DomainID: domainID
}
console.log('Submitting transaction', JSON.stringify(pDomainDel, null, 2))
const response = await client.submitAndWait(pDomainDel, { wallet, autofill: true})
console.log(response)
const resultCode = response.result.meta.TransactionResult
if (resultCode !== 'tesSUCCESS') {
  console.error(`PermissionedDomainDelete failed with code ${resultCode}`)
  client.disconnect()
  process.exit(3)
}
console.log('Successfully deleted permissioned domain.')
client.disconnect()
