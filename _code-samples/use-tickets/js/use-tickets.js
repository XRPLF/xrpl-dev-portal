import xrpl from 'xrpl'

// Set up client and account
const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
await client.connect()

// Fund wallet --------------------------------------------------------------
console.log('Getting a wallet from the faucet...')
const { wallet } = await client.fundWallet()
console.log("Wallet address:", wallet.address)

// Create Tickets -----------------------------------------------------------
console.log('\nSubmitting TicketCreate transaction...')
const ticketCreateResult = await client.submitAndWait({
  TransactionType: 'TicketCreate',
  Account: wallet.address,
  TicketCount: 10
}, { wallet, autofill: true })
console.log(`TicketCreate hash: ${ticketCreateResult.result.hash}, validated: ${ticketCreateResult.result.validated}`)

// Check Available Tickets --------------------------------------------------
console.log('\nChecking available tickets...')
const ticketsResponse = await client.request({
  command: 'account_objects',
  account: wallet.address,
  type: 'ticket'
})
const tickets = ticketsResponse.result.account_objects
console.log(`Found ${tickets.length} Tickets`)

// Choose an arbitrary Ticket to use
const useTicket = tickets[0].TicketSequence
console.log(`Using Ticket Sequence: ${useTicket}`)

// Use a Ticket -------------------------------------------------------------
console.log('\nSubmitting ticketed AccountSet transaction...')
const ticketedResult = await client.submitAndWait({
  TransactionType: 'AccountSet',
  Account: wallet.address,
  TicketSequence: useTicket,
  Sequence: 0
}, { wallet, autofill: true })
console.log(`Ticketed AccountSet hash: ${ticketedResult.result.hash}, validated: ${ticketedResult.result.validated}`)

// Recheck Available Tickets ------------------------------------------------
console.log('\nRechecking available tickets...')
const ticketsAfterResponse = await client.request({
  command: 'account_objects',
  account: wallet.address,
  type: 'ticket'
})
console.log(`Found ${ticketsAfterResponse.result.account_objects.length} Tickets`)

// Disconnect when done (If you omit this, Node.js won't end the process)
await client.disconnect()
