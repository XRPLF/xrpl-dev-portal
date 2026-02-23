// Setup script for lending protocol tutorials

import xrpl from 'xrpl'
import fs from 'fs'

process.stdout.write('Setting up tutorial: 0/6\r')

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

process.stdout.write('Setting up tutorial: 1/6\r')

// Issue MPT with depositor
// Create tickets for later use with loanBroker
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

const [ticketCreateResponse, mptIssuanceResponse] = await Promise.all([
  client.submitAndWait({
    TransactionType: 'TicketCreate',
    Account: loanBroker.address,
    TicketCount: 2
  }, { wallet: loanBroker, autofill: true }),
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
    TransactionType: 'Batch',
    Account: credentialIssuer.address,
    Flags: xrpl.BatchFlags.tfAllOrNothing,
    RawTransactions: [
      {
        RawTransaction: {
          TransactionType: 'CredentialCreate',
          Account: credentialIssuer.address,
          Subject: loanBroker.address,
          CredentialType: credentialType,
          Flags: xrpl.GlobalFlags.tfInnerBatchTxn
        }
      },
      {
        RawTransaction: {
          TransactionType: 'CredentialCreate',
          Account: credentialIssuer.address,
          Subject: borrower.address,
          CredentialType: credentialType,
          Flags: xrpl.GlobalFlags.tfInnerBatchTxn
        }
      },
      {
        RawTransaction: {
          TransactionType: 'CredentialCreate',
          Account: credentialIssuer.address,
          Subject: depositor.address,
          CredentialType: credentialType,
          Flags: xrpl.GlobalFlags.tfInnerBatchTxn
        }
      },
      {
        RawTransaction: {
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
          Flags: xrpl.GlobalFlags.tfInnerBatchTxn
        }
      }
    ]
  }, { wallet: credentialIssuer, autofill: true })
])

// Extract ticket sequence numbers
const tickets = ticketCreateResponse.result.meta.AffectedNodes
  .filter(node => node.CreatedNode?.LedgerEntryType === 'Ticket')
  .map(node => node.CreatedNode.NewFields.TicketSequence)

// Extract MPT issuance ID
const mptID = mptIssuanceResponse.result.meta.mpt_issuance_id

// Get domain ID
const credentialIssuerObjects = await client.request({
  command: 'account_objects',
  account: credentialIssuer.address,
  ledger_index: 'validated'
})
const domainID = credentialIssuerObjects.result.account_objects.find(node =>
  node.LedgerEntryType === 'PermissionedDomain'
).index

process.stdout.write('Setting up tutorial: 2/6\r')

// Accept credentials and authorize MPT for each account
await Promise.all([
  ...([loanBroker, borrower].map(wallet =>
    client.submitAndWait({
      TransactionType: 'Batch',
      Account: wallet.address,
      Flags: xrpl.BatchFlags.tfAllOrNothing,
      RawTransactions: [
        {
          RawTransaction: {
            TransactionType: 'CredentialAccept',
            Account: wallet.address,
            Issuer: credentialIssuer.address,
            CredentialType: credentialType,
            Flags: xrpl.GlobalFlags.tfInnerBatchTxn
          }
        },
        {
          RawTransaction: {
            TransactionType: 'MPTokenAuthorize',
            Account: wallet.address,
            MPTokenIssuanceID: mptID,
            Flags: xrpl.GlobalFlags.tfInnerBatchTxn
          }
        }
      ]
    }, { wallet, autofill: true })
  )),
  // Depositor only needs to accept credentials
  client.submitAndWait({
    TransactionType: 'CredentialAccept',
    Account: depositor.address,
    Issuer: credentialIssuer.address,
    CredentialType: credentialType
  }, { wallet: depositor, autofill: true })
])

process.stdout.write('Setting up tutorial: 3/6\r')

// Create private vault and distribute MPT to accounts
const [vaultCreateResponse] = await Promise.all([
  client.submitAndWait({
    TransactionType: 'VaultCreate',
    Account: loanBroker.address,
    Asset: {
      mpt_issuance_id: mptID
    },
    Flags: xrpl.VaultCreateFlags.tfVaultPrivate,
    DomainID: domainID
  }, { wallet: loanBroker, autofill: true }),
  client.submitAndWait({
    TransactionType: 'Batch',
    Account: depositor.address,
    Flags: xrpl.BatchFlags.tfAllOrNothing,
    RawTransactions: [
      {
        RawTransaction: {
          TransactionType: 'Payment',
          Account: depositor.address,
          Destination: loanBroker.address,
          Amount: {
            mpt_issuance_id: mptID,
            value: '5000'
          },
          Flags: xrpl.GlobalFlags.tfInnerBatchTxn
        }
      },
      {
        RawTransaction: {
          TransactionType: 'Payment',
          Account: depositor.address,
          Destination: borrower.address,
          Amount: {
            mpt_issuance_id: mptID,
            value: '2500'
          },
          Flags: xrpl.GlobalFlags.tfInnerBatchTxn
        }
      }
    ]
  }, { wallet: depositor, autofill: true })
])

const vaultID = vaultCreateResponse.result.meta.AffectedNodes.find(node =>
  node.CreatedNode?.LedgerEntryType === 'Vault'
).CreatedNode.LedgerIndex

process.stdout.write('Setting up tutorial: 4/6\r')

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

process.stdout.write('Setting up tutorial: 5/6\r')

// Create 2 identical loans with complete repayment due in 30 days

// Suppress unnecessary console warning from autofilling LoanSet.
console.warn = () => {}

// Helper function to create, sign, and submit a LoanSet transaction
async function createLoan (ticketSequence) {
  const loanSetTx = await client.autofill({
    TransactionType: 'LoanSet',
    Account: loanBroker.address,
    Counterparty: borrower.address,
    LoanBrokerID: loanBrokerID,
    PrincipalRequested: '1000',
    InterestRate: 500,
    PaymentTotal: 1,
    PaymentInterval: 2592000,
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
  createLoan(tickets[0]),
  createLoan(tickets[1])
])

const loanID1 = submitResponse1.result.meta.AffectedNodes.find(node =>
  node.CreatedNode?.LedgerEntryType === 'Loan'
).CreatedNode.LedgerIndex

const loanID2 = submitResponse2.result.meta.AffectedNodes.find(node =>
  node.CreatedNode?.LedgerEntryType === 'Loan'
).CreatedNode.LedgerIndex

process.stdout.write('Setting up tutorial: 6/6\r')

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
