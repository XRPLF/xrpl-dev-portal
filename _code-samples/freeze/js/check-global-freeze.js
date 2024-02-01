// Dependencies for Node.js.
// In browsers, use <script> tags as in the example demo.html.
if (typeof module !== "undefined") {
  // Use var here because const/let are block-scoped to the if statement.
  var xrpl = require('xrpl')
  var { AccountRootFlags } = require('xrpl/dist/npm/models/ledger')
}
  
// Connect -------------------------------------------------------------------
async function main() {
  console.log("Connecting to Mainnet...")
  const client = new xrpl.Client('wss://s1.ripple.com')
  await client.connect()

  const my_address = 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn';

  // Request account info for my_address to check account settings ------------
  const response = await client.request(
    {command: 'account_info', account: my_address })
  const settings = response.result
  const lsfGlobalFreeze = xrpl.LedgerEntry.AccountRootFlags.lsfGlobalFreeze

  console.log('Got settings for address', my_address);
  console.log('Global Freeze enabled?',
              ((settings.account_data.Flags & lsfGlobalFreeze) 
              === lsfGlobalFreeze))

  await client.disconnect()

  // End main()
} 

main().catch(console.error)
  