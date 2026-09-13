// Setup script for lending protocol tutorials

import xrpl from 'xrpl'
import fs from 'fs'

process.stdout.write('Setting up tutorial: 0/7\r')

const client = new xrpl.Client('wss://s.devnet.rippletest.net:51233')
await client.connect()

// Create and fund wallets
const [
  { wallet: loanBroker },
  { wallet: borrower },
  { wallet: depositor },
  { wallet: credentialIssuer }
] = await Promise.all([
  client.fundWallet(),
  client.fundWallet(),
  client.fundWallet(),
  client.fundWallet()
])

process.stdout.write('Setting up tutorial: 1/7\r')

// Create tickets for parallel transactions
const extractTickets = (response) =>
  response.result.meta.AffectedNodes
    .filter(node => node.CreatedNode?.LedgerEntryType === 'Ticket')
    .map(node => node.CreatedNode.NewFields.TicketSequence)

const [ciTicketResponse, lbTicketResponse, brTicketResponse, dpTicketResponse] = await Promise.all([
  client.submitAndWait({
    TransactionType: 'TicketCreate',
    Account: credentialIssuer.address,
    TicketCount: 4
  }, { wallet: credentialIssuer, autofill: true }),
  client.submitAndWait({
    TransactionType: 'TicketCreate',
    Account: loanBroker.address,
    TicketCount: 4
  }, { wallet: loanBroker, autofill: true }),
  client.submitAndWait({
    TransactionType: 'TicketCreate',
    Account: borrower.address,
    TicketCount: 2
  }, { wallet: borrower, autofill: true }),
  client.submitAndWait({
    TransactionType: 'TicketCreate',
    Account: depositor.address,
    TicketCount: 2
  }, { wallet: depositor, autofill: true })
])

const ciTickets = extractTickets(ciTicketResponse)
const lbTickets = extractTickets(lbTicketResponse)
const brTickets = extractTickets(brTicketResponse)
const dpTickets = extractTickets(dpTicketResponse)

process.stdout.write('Setting up tutorial: 2/7\r')

// Issue MPT with depositor
// Set up credentials and domain with credentialIssuer
const credentialType = xrpl.convertStringToHex('KYC-Verified')
const mptData = {
  ticker: 'TSTUSD',
  name: 'Test USD MPT',
  desc: 'A sample non-yield-bearing stablecoin backed by U.S. Treasuries.',
  icon: 'https://example.org/tstusd-icon.png',
  asset_class: 'rwa',
  asset_subclass: 'stablecoin',
  issuer_name: 'Example Treasury Reserve Co.',
  uris: [
    {
      uri: 'https://exampletreasury.com/tstusd',
      category: 'website',
      title: 'Product Page'
    },
    {
      uri: 'https://exampletreasury.com/tstusd/reserve',
      category: 'docs',
      title: 'Reserve Attestation'
    }
  ],
  additional_info: {
    reserve_type: 'U.S. Treasury Bills',
    custody_provider: 'Example Custodian Bank',
    audit_frequency: 'Monthly',
    last_audit_date: '2026-01-15',
    pegged_currency: 'USD'
  }
}

const [mptIssuanceResponse, domainSetResponse] = await Promise.all([
  client.submitAndWait({
    TransactionType: 'MPTokenIssuanceCreate',
    Account: depositor.address,
    MaximumAmount: '100000000',
    TransferFee: 0,
    Flags:
      xrpl.MPTokenIssuanceCreateFlags.tfMPTCanTransfer |
      xrpl.MPTokenIssuanceCreateFlags.tfMPTCanClawback |
      xrpl.MPTokenIssuanceCreateFlags.tfMPTCanTrade,
    MPTokenMetadata: xrpl.encodeMPTokenMetadata(mptData)
  }, { wallet: depositor, autofill: true }),
  client.submitAndWait({
    TransactionType: 'PermissionedDomainSet',
    Account: credentialIssuer.address,
    AcceptedCredentials: [
      {
        Credential: {
          Issuer: credentialIssuer.address,
          CredentialType: credentialType
        }
      }
    ],
    Sequence: 0,
    TicketSequence: ciTickets[0]
  }, { wallet: credentialIssuer, autofill: true }),
  client.submitAndWait({
    TransactionType: 'CredentialCreate',
    Account: credentialIssuer.address,
    Subject: loanBroker.address,
    CredentialType: credentialType,
    Sequence: 0,
    TicketSequence: ciTickets[1]
  }, { wallet: credentialIssuer, autofill: true }),
  client.submitAndWait({
    TransactionType: 'CredentialCreate',
    Account: credentialIssuer.address,
    Subject: borrower.address,
    CredentialType: credentialType,
    Sequence: 0,
    TicketSequence: ciTickets[2]
  }, { wallet: credentialIssuer, autofill: true }),
  client.submitAndWait({
    TransactionType: 'CredentialCreate',
    Account: credentialIssuer.address,
    Subject: depositor.address,
    CredentialType: credentialType,
    Sequence: 0,
    TicketSequence: ciTickets[3]
  }, { wallet: credentialIssuer, autofill: true })
])

// Extract MPT issuance ID
const mptID = mptIssuanceResponse.result.meta.mpt_issuance_id

// Extract domain ID
const domainID = domainSetResponse.result.meta.AffectedNodes.find(node =>
  node.CreatedNode?.LedgerEntryType === 'PermissionedDomain'
).CreatedNode.LedgerIndex

process.stdout.write('Setting up tutorial: 3/7\r')

// Accept credentials and authorize MPT for each account
await Promise.all([
  client.submitAndWait({
    TransactionType: 'CredentialAccept',
    Account: loanBroker.address,
    Issuer: credentialIssuer.address,
    CredentialType: credentialType,
    Sequence: 0,
    TicketSequence: lbTickets[0]
  }, { wallet: loanBroker, autofill: true }),
  client.submitAndWait({
    TransactionType: 'MPTokenAuthorize',
    Account: loanBroker.address,
    MPTokenIssuanceID: mptID,
    Sequence: 0,
    TicketSequence: lbTickets[1]
  }, { wallet: loanBroker, autofill: true }),
  client.submitAndWait({
    TransactionType: 'CredentialAccept',
    Account: borrower.address,
    Issuer: credentialIssuer.address,
    CredentialType: credentialType,
    Sequence: 0,
    TicketSequence: brTickets[0]
  }, { wallet: borrower, autofill: true }),
  client.submitAndWait({
    TransactionType: 'MPTokenAuthorize',
    Account: borrower.address,
    MPTokenIssuanceID: mptID,
    Sequence: 0,
    TicketSequence: brTickets[1]
  }, { wallet: borrower, autofill: true }),
  // Depositor only needs to accept credentials
  client.submitAndWait({
    TransactionType: 'CredentialAccept',
    Account: depositor.address,
    Issuer: credentialIssuer.address,
    CredentialType: credentialType
  }, { wallet: depositor, autofill: true })
])

process.stdout.write('Setting up tutorial: 4/7\r')

// Close-ended vault schedule. Anchor it to the ledger's close time.
let latestLedger = await client.request({ command: 'ledger', ledger_index: 'validated' })
const subscriptionDate = latestLedger.result.ledger.close_time + 30
const redemptionDate = subscriptionDate + 3650 * 24 * 60 * 60

// Create private vault and distribute MPT to accounts
const [vaultCreateResponse] = await Promise.all([
  client.submitAndWait({
    TransactionType: 'VaultCreate',
    Account: loanBroker.address,
    Asset: {
      mpt_issuance_id: mptID
    },
    Flags: xrpl.VaultCreateFlags.tfVaultPrivate,
    DomainID: domainID,
    VaultKind: 1,
    SubscriptionDate: subscriptionDate,
    RedemptionDate: redemptionDate
  }, { wallet: loanBroker, autofill: true }),
  client.submitAndWait({
    TransactionType: 'Payment',
    Account: depositor.address,
    Destination: loanBroker.address,
    Amount: {
      mpt_issuance_id: mptID,
      value: '5000'
    },
    Sequence: 0,
    TicketSequence: dpTickets[0]
  }, { wallet: depositor, autofill: true }),
  client.submitAndWait({
    TransactionType: 'Payment',
    Account: depositor.address,
    Destination: borrower.address,
    Amount: {
      mpt_issuance_id: mptID,
      value: '2500'
    },
    Sequence: 0,
    TicketSequence: dpTickets[1]
  }, { wallet: depositor, autofill: true })
])

const vaultID = vaultCreateResponse.result.meta.AffectedNodes.find(node =>
  node.CreatedNode?.LedgerEntryType === 'Vault'
).CreatedNode.LedgerIndex

process.stdout.write('Setting up tutorial: 5/7\r')

// Create LoanBroker and deposit MPT into vault
const [loanBrokerSetResponse] = await Promise.all([
  client.submitAndWait({
    TransactionType: 'LoanBrokerSet',
    Account: loanBroker.address,
    VaultID: vaultID
  }, { wallet: loanBroker, autofill: true }),
  client.submitAndWait({
    TransactionType: 'VaultDeposit',
    Account: depositor.address,
    VaultID: vaultID,
    Amount: {
      mpt_issuance_id: mptID,
      value: '50000000'
    }
  }, { wallet: depositor, autofill: true })
])

const loanBrokerID = loanBrokerSetResponse.result.meta.AffectedNodes.find(node =>
  node.CreatedNode?.LedgerEntryType === 'LoanBroker'
).CreatedNode.LedgerIndex

process.stdout.write('Setting up tutorial: 6/7\r')

// Loans can only be originated during the investment phase.
latestLedger = await client.request({ command: 'ledger', ledger_index: 'validated' })
for (let secondsLeft = subscriptionDate - latestLedger.result.ledger.close_time; secondsLeft > 0; secondsLeft--) {
  process.stdout.write(`\x1b[KSetting up tutorial: 6/7 (investment phase opens in ${secondsLeft}s)\r`)
  await new Promise((resolve) => setTimeout(resolve, 1000))
}

// Confirm the ledger has actually advanced before originating loans.
process.stdout.write('\x1b[KSetting up tutorial: 6/7 (waiting for ledger)\r')
while (true) {
  latestLedger = await client.request({ command: 'ledger', ledger_index: 'validated' })
  if (latestLedger.result.ledger.close_time > subscriptionDate) break
  await new Promise((resolve) => setTimeout(resolve, 1000))
}
process.stdout.write('\x1b[KSetting up tutorial: 6/7\r')

// Create 2 loans:
// A 60s that goes overdue quickly for loanManage.js
// A 30-day for loanPay.js

// Suppress unnecessary console warning from autofilling LoanSet.
console.warn = () => {}

// Helper function to create, sign, and submit a LoanSet transaction
async function createLoan (ticketSequence, paymentInterval) {
  const loanSetTx = await client.autofill({
    TransactionType: 'LoanSet',
    Account: loanBroker.address,
    Counterparty: borrower.address,
    LoanBrokerID: loanBrokerID,
    PrincipalRequested: '1000',
    InterestRate: 500,
    PaymentTotal: 1,
    PaymentInterval: paymentInterval,
    LoanOriginationFee: '100',
    LoanServiceFee: '10',
    Sequence: 0,
    TicketSequence: ticketSequence
  })

  const loanBrokerSigned = loanBroker.sign(loanSetTx)
  const loanBrokerSignedTx = xrpl.decode(loanBrokerSigned.tx_blob)

  const fullySigned = xrpl.signLoanSetByCounterparty(borrower, loanBrokerSignedTx)
  const submitResponse = await client.submitAndWait(fullySigned.tx)

  return submitResponse
}

const [submitResponse1, submitResponse2] = await Promise.all([
  createLoan(lbTickets[2], 60),
  createLoan(lbTickets[3], 2592000)
])

const loanID1 = submitResponse1.result.meta.AffectedNodes.find(node =>
  node.CreatedNode?.LedgerEntryType === 'Loan'
).CreatedNode.LedgerIndex

const loanID2 = submitResponse2.result.meta.AffectedNodes.find(node =>
  node.CreatedNode?.LedgerEntryType === 'Loan'
).CreatedNode.LedgerIndex

process.stdout.write('Setting up tutorial: 7/7\r')

// Write setup data to JSON file
const setupData = {
  description: 'This file is auto-generated by lendingSetup.js. It stores XRPL account info for use in lending protocol tutorials.',
  loanBroker: {
    address: loanBroker.address,
    seed: loanBroker.seed
  },
  borrower: {
    address: borrower.address,
    seed: borrower.seed
  },
  depositor: {
    address: depositor.address,
    seed: depositor.seed
  },
  credentialIssuer: {
    address: credentialIssuer.address,
    seed: credentialIssuer.seed
  },
  domainID,
  mptID,
  vaultID,
  loanBrokerID,
  loanID1,
  loanID2
}

fs.writeFileSync('lendingSetup.json', JSON.stringify(setupData, null, 2))

process.stdout.write('Setting up tutorial: Complete!\n')

await client.disconnect()
