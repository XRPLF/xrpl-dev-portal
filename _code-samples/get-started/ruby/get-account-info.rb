require 'xrpl-ruby'
require 'json'

# Create a client using the Testnet
client = XRPL::Client.new(:testnet)
client.connect!

# Create a new wallet and fund it using the Testnet faucet
funded = XRPL.fund_wallet(client)
wallet = funded[:wallet]

puts "Classic address: #{wallet.classic_address}"

# Look up information about the account on the XRP Ledger
account_info = client.account_info_response(
  account: wallet.classic_address,
  ledger_index: 'validated'
)

puts JSON.pretty_generate(account_info)

client.disconnect
