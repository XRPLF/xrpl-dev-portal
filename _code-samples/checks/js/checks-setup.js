import xrpl from 'xrpl'
import fs from 'fs'

// Helper to extract ticket sequences from TicketCreate result

function getTicketSequences(ticketCreateResult) {
  return ticketCreateResult.result.meta.AffectedNodes
    .filter(node => node.CreatedNode?.LedgerEntryType === 'Ticket')
    .map(node => node.CreatedNode.NewFields.TicketSequence)
}

// Helper to extract check ID from CheckCreate result

function getCheckId(checkCreateResult) {
  const checkNode = checkCreateResult.result.meta.AffectedNodes.find(
    node => node.CreatedNode?.LedgerEntryType === 'Check'
  )
  return checkNode.CreatedNode.LedgerIndex
}

// Connect ----------------------

const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
await client.connect()

// Fund sender and recipient wallets ----------------------

process.stdout.write('Setting up tutorial: 0/3\r')
const [{ wallet: sender }, { wallet: recipient }] = await Promise.all([
  client.fundWallet(),
  client.fundWallet()
])

// Create tickets for sender to submit checks in parallel ----------------------

process.stdout.write('Setting up tutorial: 1/3\r')
const ticketCreateResult = await client.submitAndWait(
  {
    TransactionType: 'TicketCreate',
    Account: sender.address,
    TicketCount: 4
  },
  { wallet: sender, autofill: true }
)
const ticketSequences = getTicketSequences(ticketCreateResult)

// Create four checks in parallel ----------------------

process.stdout.write('Setting up tutorial: 2/3\r')
const [exactResult, flexibleResult, cancelResult, sampleResult] = await Promise.all([
  client.submitAndWait(
    {
      TransactionType: 'CheckCreate',
      Account: sender.address,
      Destination: recipient.address,
      SendMax: xrpl.xrpToDrops(30),
      TicketSequence: ticketSequences[0],
      Sequence: 0
    },
    { wallet: sender, autofill: true }
  ),
  client.submitAndWait(
    {
      TransactionType: 'CheckCreate',
      Account: sender.address,
      Destination: recipient.address,
      SendMax: xrpl.xrpToDrops(100),
      TicketSequence: ticketSequences[1],
      Sequence: 0
    },
    { wallet: sender, autofill: true }
  ),
  client.submitAndWait(
    {
      TransactionType: 'CheckCreate',
      Account: sender.address,
      Destination: recipient.address,
      SendMax: xrpl.xrpToDrops(30),
      TicketSequence: ticketSequences[2],
      Sequence: 0
    },
    { wallet: sender, autofill: true }
  ),
  client.submitAndWait(
    {
      TransactionType: 'CheckCreate',
      Account: sender.address,
      Destination: recipient.address,
      SendMax: xrpl.xrpToDrops(50),
      TicketSequence: ticketSequences[3],
      Sequence: 0
    },
    { wallet: sender, autofill: true }
  )
])

// Save setup data to file ----------------------

process.stdout.write('Setting up tutorial: 3/3\r')
const setupData = {
  sender: {
    address: sender.address,
    seed: sender.seed
  },
  recipient: {
    address: recipient.address,
    seed: recipient.seed
  },
  checkIDs: {
    exact: getCheckId(exactResult),
    flexible: getCheckId(flexibleResult),
    cancel: getCheckId(cancelResult),
    sample: getCheckId(sampleResult)
  }
}
fs.writeFileSync('checks-setup.json', JSON.stringify(setupData, null, 2))
process.stdout.write('Setting up tutorial: Complete!\n')

// Disconnect ----------------------

await client.disconnect()
