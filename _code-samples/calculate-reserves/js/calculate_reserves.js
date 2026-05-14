
// Set up client ----------------------

import xrpl from 'xrpl'

const client = new xrpl.Client('wss://xrplcluster.com')
await client.connect()

// Look up reserve values ----------------------

const serverState = await client.request({ command: 'server_state' })
const validatedLedger = serverState.result.state.validated_ledger

const baseReserveDrops = validatedLedger.reserve_base
const reserveIncDrops = validatedLedger.reserve_inc

console.log(`Base reserve: ${xrpl.dropsToXrp(baseReserveDrops)} XRP`)
console.log(`Incremental reserve: ${xrpl.dropsToXrp(reserveIncDrops)} XRP`)

// Look up owner count ----------------------

const address = 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn' // replace with any address
const accountInfo = await client.request({ command: 'account_info', account: address })
const ownerCount = accountInfo.result.account_data.OwnerCount

// Calculate total reserve ----------------------

const totalReserveDrops = baseReserveDrops + (ownerCount * reserveIncDrops)
console.log(`Owner count: ${ownerCount}`)
console.log(`Total reserve: ${xrpl.dropsToXrp(totalReserveDrops)} XRP`)

await client.disconnect()
