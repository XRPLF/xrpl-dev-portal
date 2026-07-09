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

const issuerAddress = configData.issuer_address
const domainID = configData.domain_id

console.log('Domain ID:', domainID)
console.log('Domain owner:', wallet.address)
console.log('Credential issuer:', issuerAddress)

// Modify a permissioned domain -----------------------------------------------
// To demonstrate updating the domain, this tutorial uses a different credential
// type (issued by the same issuer, unless you modified setup.json)
const credentialType = stringToHex("new-credential-type")

const pDomainSet = {
  TransactionType: "PermissionedDomainSet",
  Account: wallet.address,
  DomainID: domainID,
  AcceptedCredentials: [
    {
      Credential: {
        Issuer: issuerAddress,
        CredentialType: credentialType
      }
    }
  ]
}
console.log('Submitting transaction', JSON.stringify(pDomainSet, null, 2))
const response = await client.submitAndWait(pDomainSet, { wallet, autofill: true})
console.log(response)
const resultCode = response.result.meta.TransactionResult
if (resultCode !== 'tesSUCCESS') {
  console.error(`PermissionedDomainSet failed with code ${resultCode}`)
  client.disconnect()
  process.exit(3)
}
console.log('Successfully modified permissioned domain.')
client.disconnect()
